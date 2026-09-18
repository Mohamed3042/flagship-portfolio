"""Browser regression checks for the "From Signal to Systems" landing sequence.

Every check here maps to a line in the plan's acceptance checklist. The one that
matters most is determinism: the same scroll progress must reconstruct the same
scene whether it was reached going forward, going backward, by a direct jump, or
by a restored scroll position.

Run against a served production build:
    node scripts/serve-static.mjs dist 4618
    python scripts/test-signal.py --base-url http://127.0.0.1:4618
"""
from pathlib import Path
import argparse, json, sys

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--round', default='signal')
args = parser.parse_args()

OUT = ROOT / '.impeccable' / 'review' / args.round
OUT.mkdir(parents=True, exist_ok=True)

report = {'round': args.round, 'viewports': {}, 'checks': [], 'failures': []}


def check(name, passed, detail=''):
    report['checks'].append({'name': name, 'passed': bool(passed), 'detail': str(detail)[:600]})
    if not passed:
        report['failures'].append(f'{name}: {str(detail)[:600]}')


def attempt(name, action):
    try:
        action()
    except Exception as exc:  # a thrown check is a failed check, not a crashed run
        check(name, False, str(exc)[:700])


# The scene state the page exposes for testing. Reading it is a pure observation:
# it reports what the renderer already computed, it does not drive anything.
PROBE = '''() => {
  const root = document.querySelector('[data-signal]');
  if (!root) return null;
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  const top = runway.getBoundingClientRect().top + scrollY;
  const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
  return {
    u: Math.min(1, Math.max(0, (scrollY - top) / range)),
    chapter: root.dataset.signalChapter || '',
    graphics: root.dataset.graphics || '',
    tier: root.dataset.tier || '',
    active: [...root.querySelectorAll('[data-chapter]')]
      .filter(p => p.dataset.active === 'true').map(p => p.dataset.chapter),
    plate: (() => {
      const p = root.querySelector('[data-chapter][data-active="true"] [data-plate]');
      if (!p) return null;
      const r = p.getBoundingClientRect();
      return {h: p.dataset.handoff || '', x: Math.round(r.x), y: Math.round(r.y),
              w: Math.round(r.width), h2: Math.round(r.height)};
    })(),
  };
}'''


def scroll_to(page, u):
    """Put the document at cinematic progress u and let the frame settle."""
    page.evaluate('''(u) => {
      const root = document.querySelector('[data-signal]');
      const runway = root.querySelector('[data-signal-runway]');
      const frame = root.querySelector('[data-signal-frame]');
      const top = runway.getBoundingClientRect().top + scrollY;
      const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
      window.scrollTo({top: top + range * u, behavior: 'instant'});
    }''', u)
    page.wait_for_timeout(220)
    return page.evaluate(PROBE)


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, headless=True)

    for name, lang, w, h in [
        ('desktop', 'en', 1440, 900),
        ('mobile', 'en', 390, 844),
        ('arabic-desktop', 'ar', 1440, 900),
        ('arabic-mobile', 'ar', 390, 844),
    ]:
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1,
                                  is_mobile=w < 700, has_touch=w < 700)
        page = ctx.new_page()
        page.set_default_timeout(8000)
        errors, bad = [], []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('response', lambda r: bad.append(f'{r.status} {r.url}') if r.status >= 400 else None)

        page.goto(f'{args.base_url}/{lang}', wait_until='networkidle')
        page.wait_for_timeout(1400)

        base = page.evaluate('''() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          h1: document.querySelectorAll('h1').length,
          canvases: document.querySelectorAll('[data-signal] canvas').length,
          ambient: (() => { const c = document.querySelector('#space');
            return c ? getComputedStyle(c).display : 'absent'; })(),
          direction: document.documentElement.dir,
          audio: document.querySelectorAll('audio, video[autoplay]').length,
          chapters: document.querySelectorAll('[data-chapter]').length,
          workLink: !!document.querySelector('a[href*="#work"], a[href$="/#work"]'),
          contact: !!document.querySelector('#contact'),
        })''')
        report['viewports'][name] = base

        check(f'{name} no horizontal overflow', base['overflow'] <= 1, base['overflow'])
        check(f'{name} one h1', base['h1'] == 1, base['h1'])
        check(f'{name} one renderer canvas', base['canvases'] == 1, base['canvases'])
        check(f'{name} no second ambient star field', base['ambient'] in ('none', 'absent'), base['ambient'])
        check(f'{name} direction', base['direction'] == ('rtl' if lang == 'ar' else 'ltr'))
        check(f'{name} no audio element', base['audio'] == 0, base['audio'])
        check(f'{name} seven chapters in the DOM', base['chapters'] == 7, base['chapters'])
        check(f'{name} work reachable from the first viewport', base['workLink'])
        check(f'{name} contact section present', base['contact'])

        state0 = page.evaluate(PROBE)
        check(f'{name} scene probe available', state0 is not None)
        if state0:
            check(f'{name} WebGL initialised', state0['graphics'] == 'webgl', state0['graphics'])

        # --- determinism: forward, then reverse, then a direct jump ----------
        samples = [0.05, 0.16, 0.31, 0.48, 0.62, 0.75, 0.92]
        forward = [scroll_to(page, u) for u in samples]
        reverse = [scroll_to(page, u) for u in reversed(samples)][::-1]

        for u, f, r in zip(samples, forward, reverse):
            same_chapter = f['chapter'] == r['chapter']
            check(f'{name} u={u} same chapter forward and reverse', same_chapter,
                  f"{f['chapter']} vs {r['chapter']}")
            if f['plate'] and r['plate']:
                drift = max(abs(f['plate']['x'] - r['plate']['x']),
                            abs(f['plate']['y'] - r['plate']['y']),
                            abs(f['plate']['w'] - r['plate']['w']))
                check(f'{name} u={u} plate lands in the same place', drift <= 2, drift)

        # A direct jump must agree with the swept value at the same progress.
        page.evaluate('window.scrollTo({top: 0, behavior: "instant"})')
        page.wait_for_timeout(300)
        jumped = scroll_to(page, samples[4])
        check(f'{name} direct jump matches swept state',
              jumped['chapter'] == forward[4]['chapter'],
              f"{jumped['chapter']} vs {forward[4]['chapter']}")

        # --- exactly one chapter is live, and hidden ones are not focusable --
        live = [s for s in forward if len(s['active']) != 1]
        check(f'{name} exactly one active chapter at every sample', not live, live)

        hidden_targets = page.evaluate('''() => {
          const hidden = [...document.querySelectorAll('[data-chapter]')]
            .filter(p => p.dataset.active !== 'true');
          return hidden.reduce((n, p) => n + [...p.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]')]
            .filter(el => el.tabIndex >= 0 && !el.closest('[inert]')).length, 0);
        }''')
        check(f'{name} hidden chapters leave no keyboard targets', hidden_targets == 0, hidden_targets)

        # --- stopping the scroll stops narrative progression -----------------
        held = scroll_to(page, 0.44)
        page.wait_for_timeout(900)
        still = page.evaluate(PROBE)
        check(f'{name} stopping scroll stops progression',
              abs(still['u'] - held['u']) < 0.002 and still['chapter'] == held['chapter'],
              f"{held['u']:.4f} -> {still['u']:.4f}")

        # --- keyboard and history -------------------------------------------
        attempt(f'{name} End then Home returns a valid state', lambda: (
            page.keyboard.press('End'), page.wait_for_timeout(400),
            page.keyboard.press('Home'), page.wait_for_timeout(400),
            check(f'{name} Home returns to the opening chapter',
                  page.evaluate(PROBE)['u'] < 0.02, page.evaluate(PROBE)['u'])))

        # Entering a World must be an explicit action, never a scroll side effect.
        before = page.url
        scroll_to(page, 0.78)
        page.wait_for_timeout(500)
        check(f'{name} scrolling past the portal does not navigate', page.url == before,
              f'{before} -> {page.url}')

        # --- registration: the plate sits ON the surface, not near it --------
        #
        # The camera is fitted to the handoff surface before the crossfade, so the
        # HTML image is placed on the rectangle that camera produces. `data-fit`
        # reports whether that actually held. It is an assertion, not a repair: an
        # image silently rescaled to fit would pass a screenshot and still be out
        # of register with the surface it is replacing for the whole blend.
        registration = page.evaluate("""async () => {
          // Seek, then WAIT for the renderer. Progress is read from scrollY inside
          // a rAF callback, so a synchronous read after scrollTo returns the frame
          // before the seek -- every sample would carry the previous stop's state,
          // and a suite that measures the wrong frame is worse than no suite.
          const settle = () => new Promise((done) => {
            requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 90)));
          });
          const root = document.querySelector('[data-signal]');
          const runway = root.querySelector('[data-signal-runway]');
          const frame = root.querySelector('[data-signal-frame]');
          const top = runway.getBoundingClientRect().top + scrollY;
          const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
          const seek = (u) => window.scrollTo({top: top + range * u, behavior: 'instant'});
          const read = () => {
            const live = root.querySelector('[data-chapter][data-active="true"]');
            const plate = live && live.querySelector('[data-plate]');
            const copy = live && live.querySelector('[data-chapter-copy]');
            if (!plate) return null;
            const p = plate.getBoundingClientRect(), c = copy.getBoundingClientRect();
            const overlap = !(p.right <= c.left + 1 || p.left >= c.right - 1 ||
                              p.bottom <= c.top + 1 || p.top >= c.bottom - 1);
            return {
              chapter: live.dataset.chapter,
              fit: plate.dataset.fit || '',
              handoff: plate.dataset.handoff || '',
              opacity: Number(getComputedStyle(plate).opacity),
              overlapsCopy: overlap,
              inFrame: p.left >= -1 && p.top >= -1 &&
                       p.right <= innerWidth + 1 && p.bottom <= innerHeight + 1,
            };
          };
          const out = {};
          for (const [name, u] of [['system', .355], ['object', .474], ['proof', .545],
                                   ['tracks', .655], ['world', .79]]) {
            seek(u); await settle(); out[name] = read();
          }
          seek(0); await settle();
          return out;
        }""")
        page.wait_for_timeout(200)
        report['viewports'][name]['registration'] = registration

        for stop, state in (registration or {}).items():
            if not state:
                continue
            if state['handoff'] == 'html':
                check(f'{name} {stop}: plate is registered on its surface',
                      state['fit'] == 'exact', f"data-fit={state['fit']}")
                check(f'{name} {stop}: plate stays inside the frame', state['inFrame'], state)
            # A plate at zero opacity is not on screen; only what is visible can
            # cross the copy.
            if state['opacity'] > 0.02:
                check(f'{name} {stop}: plate never crosses the narration',
                      not state['overlapsCopy'], state)

        # The object gets its own interval: at the carton's recognition stop the
        # screenshot has no opacity at all, and at its proof stop it has all of it.
        object_stop = (registration or {}).get('object')
        proof_stop = (registration or {}).get('proof')
        if object_stop and proof_stop:
            check(f'{name} the carton is read before any screenshot appears',
                  object_stop['opacity'] < 0.02, object_stop['opacity'])
            check(f'{name} the proof stop shows the capture outright',
                  proof_stop['opacity'] > 0.98, proof_stop['opacity'])

        # --- the evidence names the object, not the scene --------------------
        evidence = page.evaluate("""() => {
          const out = {};
          for (const panel of document.querySelectorAll('[data-chapter]')) {
            out[panel.dataset.chapter] = [...panel.querySelectorAll('.signal__evidence')]
              .map(e => ({kind: e.dataset.evidence, text: e.textContent.trim()}));
          }
          return out;
        }""")
        report['viewports'][name]['evidence'] = evidence
        for chapter in ('system', 'matter', 'world'):
            lines = evidence.get(chapter) or []
            check(f'{name} {chapter}: the drawn object and the capture are labelled separately',
                  len(lines) == 2 and any(l['kind'] == 'illustration' for l in lines),
                  lines)

        # --- captures --------------------------------------------------------
        for label, u in [('open', 0.02), ('forge', 0.17), ('system', 0.34),
                         ('matter', 0.50), ('signal', 0.63), ('world', 0.76), ('archive', 0.95)]:
            scroll_to(page, u)
            page.wait_for_timeout(420)
            page.screenshot(path=str(OUT / f'{name}-{label}.png'))

        check(f'{name} no page errors', not errors, errors[:3])
        check(f'{name} no failed responses', not bad, bad[:3])
        ctx.close()

    # --- reduced motion: a real composition, not a blank page -----------------
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce')
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(900)
    rm = page.evaluate('''() => {
      const root = document.querySelector('[data-signal]');
      const panels = [...root.querySelectorAll('[data-chapter]')];
      return {
        graphics: root.dataset.graphics || '',
        visible: panels.filter(p => p.getBoundingClientRect().height > 40).length,
        inert: panels.filter(p => p.hasAttribute('inert')).length,
        plates: [...root.querySelectorAll('[data-plate] img, img[data-plate]')].length,
        height: document.documentElement.scrollHeight,
      };
    }''')
    check('reduced motion uses the static path', rm['graphics'] == 'static', rm['graphics'])
    check('reduced motion shows every chapter', rm['visible'] == 7, rm['visible'])
    check('reduced motion leaves nothing inert', rm['inert'] == 0, rm['inert'])
    page.screenshot(path=str(OUT / 'reduced.png'), full_page=False)
    ctx.close()

    # --- no JavaScript: the portfolio still works -----------------------------
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, java_script_enabled=False)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='domcontentloaded')
    counts = page.locator('[data-chapter]').count()
    links = page.locator('[data-chapter] a[href]').count()
    check('no-JS keeps every chapter in the document', counts == 7, counts)
    check('no-JS keeps the project links', links > 0, links)
    page.screenshot(path=str(OUT / 'nojs.png'))
    ctx.close()

    browser.close()

(OUT / 'signal-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
passed = sum(1 for c in report['checks'] if c['passed'])
print(f'{passed}/{len(report["checks"])} checks passed')
for f in report['failures']:
    print('FAIL', f)
sys.exit(1 if report['failures'] else 0)
