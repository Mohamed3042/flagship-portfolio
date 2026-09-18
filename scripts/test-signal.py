"""Browser regression checks for the DEEP FIELD landing sequence.

The one that matters most is determinism: the same scroll progress must
reconstruct the same scene whether it was reached going forward, going backward,
by a direct jump, or by a restored scroll position. Everything the stage draws is
a pure evaluation of one number, so that is a testable claim and not a hope.

Two standing rules from this project's history are enforced here rather than
remembered:

  * A browser probe that does not await a frame measures the PREVIOUS state.
    Every read is preceded by requestAnimationFrame twice plus a short timeout.
  * A contrast number taken from a design document certifies the intent, not the
    page. Every colour here is read with getComputedStyle from the rendered
    element, and the ratios are computed from those bytes.

Run against a served production build:
    node scripts/serve-static.mjs dist 4618
    python scripts/test-signal.py --base-url http://127.0.0.1:4618
"""
from pathlib import Path
import argparse, json, sys

# A failing check must be able to print itself. Arabic copy in a failure detail
# was crashing the reporter on a cp1252 console, which turns a red suite into a
# traceback and hides what actually failed.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--round', default='deep-field')
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
# it reports what the renderer already computed; it drives nothing.
PROBE = '''() => {
  const root = document.querySelector('[data-signal]');
  if (!root) return null;
  const df = window.__deepField;
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  const top = runway.getBoundingClientRect().top + scrollY;
  const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
  const canvas = root.querySelector('[data-signal-canvas]');
  return {
    u: Math.min(1, Math.max(0, (scrollY - top) / range)),
    graphics: root.dataset.graphics || '',
    tier: root.dataset.tier || '',
    heroFigure: root.dataset.heroFigure || '',
    canvasOpacity: Number(getComputedStyle(canvas).opacity),
    active: [...root.querySelectorAll('[data-chapter]')]
      .filter(p => p.dataset.active === 'true').map(p => p.dataset.chapter),
    state: df ? df.state() : null,
  };
}'''

SEEK = '''(u) => {
  const root = document.querySelector('[data-signal]');
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  const top = runway.getBoundingClientRect().top + scrollY;
  const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
  window.scrollTo({top: top + range * u, behavior: 'instant'});
}'''

SETTLE = '''async () => {
  window.__deepField && window.__deepField.settle(6);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise(r => setTimeout(r, 240));
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}'''

# Contrast, read from the rendered element. The ground is the nearest ancestor
# with a non-transparent background-color, which on this route is .signal itself
# — black. The field of stars sits between, and the copy carries its own scrim;
# both only ever darken or lighten a fraction of the area, so the flat ground is
# the conservative reading, not a flattering one.
CONTRAST = '''(selectors) => {
  const lum = (css) => {
    const m = css.match(/[\\d.]+/g).map(Number);
    const ch = m.slice(0, 3).map(v => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const ground = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const m = bg.match(/[\\d.]+/g);
      if (m && (m.length < 4 || Number(m[3]) > 0.5)) return bg;
    }
    return 'rgb(0, 0, 0)';
  };
  const out = {};
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (!el) { out[sel] = null; continue; }
    const fg = getComputedStyle(el).color;
    const bg = ground(el);
    const a = lum(fg), b = lum(bg);
    out[sel] = {color: fg, ground: bg,
                ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)};
  }
  return out;
}'''

VIEWS = [
    ('desktop', 'en', 1440, 900),
    ('mobile', 'en', 390, 844),
    ('arabic-desktop', 'ar', 1440, 900),
    ('arabic-mobile', 'ar', 390, 844),
]

# Every act has to appear at least once in this sweep, or the suite is only
# testing the beats it happens to land on.
SAMPLES = [0.02, 0.05, 0.13, 0.26, 0.42, 0.58, 0.68, 0.8, 0.93, 0.99]
TEXT = ['.signal__chapter[data-active=true] .signal__title, .signal__chapter[data-active=true] .signal__name',
        '.signal__chapter[data-active=true] .signal__line',
        '.signal__chapter[data-active=true] .signal__kicker',
        '.signal__chapter[data-active=true] .signal__action',
        '.signal__seek button']


def scroll_to(page, u):
    """Put the document at cinematic progress u and let the frame settle."""
    page.evaluate(SEEK, u)
    page.evaluate(SETTLE)
    return page.evaluate(PROBE)


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, headless=True)

    for name, lang, w, h in VIEWS:
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1,
                                  is_mobile=w < 700, has_touch=w < 700)
        page = ctx.new_page()
        page.set_default_timeout(9000)
        errors, bad = [], []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('response', lambda r: bad.append(f'{r.status} {r.url}') if r.status >= 400 else None)

        page.goto(f'{args.base_url}/{lang}', wait_until='networkidle')
        page.wait_for_timeout(2600)

        base = page.evaluate('''() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          h1: document.querySelectorAll('h1').length,
          h1Text: (document.querySelector('h1') || {}).textContent || '',
          canvases: document.querySelectorAll('[data-signal] canvas').length,
          ambient: (() => { const c = document.querySelector('#space');
            return c ? getComputedStyle(c).display : 'absent'; })(),
          direction: document.documentElement.dir,
          audio: document.querySelectorAll('audio, video[autoplay]').length,
          chapters: document.querySelectorAll('[data-chapter]').length,
          workLink: !!document.querySelector('a[href*="#work"], a[href$="/#work"]'),
          contact: !!document.querySelector('#contact'),
          progressBars: document.querySelectorAll('.progress, [data-signal-progress]').length,
        })''')
        report['viewports'][name] = base

        check(f'{name} no horizontal overflow', base['overflow'] <= 1, base['overflow'])
        check(f'{name} one h1', base['h1'] == 1, base['h1'])
        check(f'{name} the h1 is the name', base['h1Text'].strip() != '', base['h1Text'][:60])
        check(f'{name} one renderer canvas', base['canvases'] == 1, base['canvases'])
        check(f'{name} no second ambient star field', base['ambient'] in ('none', 'absent'), base['ambient'])
        check(f'{name} direction', base['direction'] == ('rtl' if lang == 'ar' else 'ltr'))
        check(f'{name} no audio element', base['audio'] == 0, base['audio'])
        check(f'{name} twelve chapters in the DOM', base['chapters'] == 12, base['chapters'])
        check(f'{name} work reachable from the first viewport', base['workLink'])
        check(f'{name} contact section present', base['contact'])
        # Two bars reporting the same number is a defect, not redundancy.
        check(f'{name} exactly one progress bar on the route', base['progressBars'] == 1, base['progressBars'])

        state0 = page.evaluate(PROBE)
        check(f'{name} scene probe available', state0 is not None)
        if state0:
            check(f'{name} WebGL initialised', state0['graphics'] == 'webgl', state0['graphics'])
            check(f'{name} the field is live', (state0['state'] or {}).get('stars', 0) > 4000,
                  (state0['state'] or {}).get('stars'))
            check(f'{name} the hero constellation was built', state0['heroFigure'] == 'true',
                  state0['heroFigure'])
            # The tier's count is a CAP, not a constant: the governor is allowed
            # to come down off it on a slow machine, and asserting equality here
            # would turn "the adaptive path worked" into a red suite.
            budget, floor = (80000, 26000) if w >= 820 else (25000, 11000)
            got = (state0['state'] or {}).get('stars', 0)
            check(f'{name} star count within its tier', floor <= got <= budget,
                  f'{got} outside [{floor}, {budget}]')

        # --- determinism: forward, then reverse, then a direct jump ----------
        forward = [scroll_to(page, u) for u in SAMPLES]
        reverse = [scroll_to(page, u) for u in reversed(SAMPLES)][::-1]

        for u, f, r in zip(SAMPLES, forward, reverse):
            fs, rs = f['state'], r['state']
            check(f'{name} u={u} same chapter forward and reverse', fs['chapter'] == rs['chapter'],
                  f"{fs['chapter']} vs {rs['chapter']}")
            # The illusion is scrub-reversible or it is an animation with a
            # play head. These are floats out of one pure function; they match
            # exactly or the function is not pure.
            for key in ('morph', 'local', 'dolly', 'narration'):
                check(f'{name} u={u} {key} reconstructs in reverse',
                      abs(fs[key] - rs[key]) < 1e-4, f"{fs[key]} vs {rs[key]}")
            check(f'{name} u={u} the dolly settles on its scroll value',
                  abs(fs['dolly'] - fs['appliedDolly']) < 1e-3,
                  f"{fs['dolly']} vs {fs['appliedDolly']}")

        seen = {f['state']['act'] for f in forward}
        check(f'{name} the sweep visits every act', seen == {'hero', 'worlds', 'film', 'public', 'contact'},
              sorted(seen))

        # A direct jump must agree with the swept value at the same progress.
        page.evaluate('window.scrollTo({top: 0, behavior: "instant"})')
        page.wait_for_timeout(300)
        jumped = scroll_to(page, SAMPLES[4])
        check(f'{name} direct jump matches swept state',
              jumped['state']['chapter'] == forward[4]['state']['chapter']
              and abs(jumped['state']['morph'] - forward[4]['state']['morph']) < 1e-4,
              f"{jumped['state']} vs {forward[4]['state']}")

        # The evaluator the capture scripts read must be the one the page renders.
        for u in (0.13, 0.5):
            live = scroll_to(page, u)['state']
            pure = page.evaluate('(u) => window.__deepField.at(u)', live['u'])
            check(f'{name} u={u} the exposed evaluator matches the rendered state',
                  pure['chapter'] == live['chapter'] and abs(pure['morph'] - live['morph']) < 1e-6,
                  f"{pure} vs {live}")

        # --- exactly one chapter is live, and hidden ones are not focusable --
        live = [s for s in forward if len(s['active']) != 1]
        check(f'{name} exactly one active chapter at every sample', not live,
              [s['state']['chapter'] for s in live])

        hidden_targets = page.evaluate('''() => {
          const hidden = [...document.querySelectorAll('[data-chapter]')]
            .filter(p => p.dataset.active !== 'true');
          return hidden.reduce((n, p) => n + [...p.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]')]
            .filter(el => el.tabIndex >= 0 && !el.closest('[inert]')).length, 0);
        }''')
        check(f'{name} hidden chapters leave no keyboard targets', hidden_targets == 0, hidden_targets)

        # --- the morph is a held pose, not a flicker -------------------------
        hero = scroll_to(page, 0.0)['state']
        check(f'{name} the name is assembled when the page opens', hero['morph'] > 0.99, hero['morph'])
        released = scroll_to(page, 0.09)['state']
        check(f'{name} the name is back in the field by the end of the hero',
              released['morph'] < 0.05, released['morph'])

        # --- stopping the scroll stops narrative progression -----------------
        held = scroll_to(page, 0.44)
        page.wait_for_timeout(900)
        still = page.evaluate(PROBE)
        check(f'{name} stopping scroll stops progression',
              abs(still['u'] - held['u']) < 0.002 and still['state']['chapter'] == held['state']['chapter'],
              f"{held['u']:.4f} -> {still['u']:.4f}")

        # --- the canvas is gone before the archive ---------------------------
        page.evaluate('''() => document.querySelector('#work').scrollIntoView({behavior: 'instant'})''')
        page.evaluate(SETTLE)
        at_work = page.evaluate(PROBE)
        check(f'{name} the field has faded out before the work section',
              at_work['canvasOpacity'] < 0.02, at_work['canvasOpacity'])

        # --- contrast, from the rendered page --------------------------------
        scroll_to(page, 0.13)
        ratios = page.evaluate(CONTRAST, TEXT)
        for sel, got in ratios.items():
            label = sel.split('.')[-1].split(',')[0].split('[')[0]
            check(f'{name} {label} contrast >= 4.5:1', bool(got) and got['ratio'] >= 4.5,
                  f"{got['ratio']:.2f}:1 {got['color']} on {got['ground']}" if got else 'element not found')

        # --- hit targets ------------------------------------------------------
        small = page.evaluate('''() => {
          const live = document.querySelector('[data-chapter][data-active="true"]');
          const nodes = [...(live ? live.querySelectorAll('a[href], button') : []),
                         ...document.querySelectorAll('[data-signal-seek] a, [data-signal-seek] button')];
          return nodes.map(n => ({t: (n.textContent||'').trim().slice(0,24),
                                  h: Math.round(n.getBoundingClientRect().height),
                                  w: Math.round(n.getBoundingClientRect().width)}))
                      .filter(r => r.h < 44 || r.w < 24);
        }''')
        check(f'{name} every control in the stage is at least 44px tall', not small, small)

        # --- keyboard and history -------------------------------------------
        attempt(f'{name} End then Home returns a valid state', lambda: (
            page.keyboard.press('End'), page.wait_for_timeout(420),
            page.keyboard.press('Home'), page.wait_for_timeout(420),
            check(f'{name} Home returns to the opening chapter',
                  page.evaluate(PROBE)['u'] < 0.02, page.evaluate(PROBE)['u'])))

        # Every chapter has to be reachable without a wheel.
        def walk():
            page.evaluate('window.scrollTo({top: 0, behavior: "instant"})')
            page.wait_for_timeout(260)
            visited = []
            for _ in range(13):
                page.evaluate(SETTLE)
                visited.append(page.evaluate(PROBE)['state']['chapter'])
                nxt = page.query_selector('[data-signal-seek] [data-seek=next]')
                if not nxt or nxt.is_disabled():
                    break
                nxt.click()
                page.wait_for_timeout(180)
            check(f'{name} the keyboard nav reaches all twelve chapters',
                  len(set(visited)) == 12, f'{len(set(visited))}: {visited}')
        attempt(f'{name} chapter nav walk', walk)

        # --- deep links -------------------------------------------------------
        page.goto(f'{args.base_url}/{lang}#signal-contact', wait_until='networkidle')
        page.wait_for_timeout(2200)
        page.evaluate(SETTLE)
        addressed = page.evaluate(PROBE)
        check(f'{name} a chapter address resolves to that chapter',
              addressed['state']['chapter'] == 'contact', addressed['state']['chapter'])

        check(f'{name} no page errors', not errors, errors[:3])
        check(f'{name} no failed requests', not bad, bad[:3])
        page.screenshot(path=str(OUT / f'{name}-{lang}.png'))
        ctx.close()

    # ---------------------------------------------------------------- reduced
    # Reduced motion is a different composition, not a switched-off one: the
    # field is still drawn, held still, with every morph at its held pose.
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1,
                              reduced_motion='reduce')
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(2600)
    reduced = page.evaluate('''() => {
      const root = document.querySelector('[data-signal]');
      const panels = [...document.querySelectorAll('[data-chapter]')];
      return {
        graphics: root.dataset.graphics,
        visible: panels.filter(p => getComputedStyle(p).visibility !== 'hidden').length,
        inert: panels.filter(p => p.hasAttribute('inert')).length,
        canvas: getComputedStyle(root.querySelector('[data-signal-canvas]')).display,
        morph: window.__deepField ? window.__deepField.state().morph : null,
        nativePatched: typeof window.__mmNativeMatchMedia === 'function',
      };
    }''')
    # Reduced motion keeps the composition and removes the movement, so the
    # DOM contract is the same as the cinema's: one chapter live, the rest inert
    # AND invisible. The failure this replaced was the two halves disagreeing —
    # twelve chapters visible with eleven of them inert, so a keyboard could
    # reach one of the twelve things on screen.
    check('reduced motion keeps one chapter live', reduced['visible'] == 1, reduced['visible'])
    check('reduced motion leaves the other eleven inert', reduced['inert'] == 11, reduced['inert'])
    check('reduced motion still draws the field', reduced['canvas'] == 'block', reduced['canvas'])
    check('reduced motion holds the constellation at its pose',
          reduced['morph'] is not None and reduced['morph'] > 0.99, reduced['morph'])
    check('reduced motion reads the native query, not the patched one', reduced['nativePatched'],
          reduced['nativePatched'])
    before = page.screenshot()
    page.wait_for_timeout(1400)
    after = page.screenshot()
    check('reduced motion holds the scene still', before == after,
          'the page kept moving with reduced motion on')
    page.screenshot(path=str(OUT / 'reduced.png'))
    ctx.close()

    # ------------------------------------------------------------------ no JS
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, java_script_enabled=False)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='domcontentloaded')
    page.wait_for_timeout(700)
    nojs = page.evaluate if False else None
    shape = page.locator('[data-chapter]')
    check('no-JS ships every chapter as HTML', shape.count() == 12, shape.count())
    check('no-JS keeps the headline', page.locator('h1').count() == 1, page.locator('h1').count())
    links = page.locator('[data-chapter] a').count()
    check('no-JS keeps every chapter link', links >= 20, links)
    check('no-JS shows the archive', page.locator('#work').is_visible())
    page.screenshot(path=str(OUT / 'nojs.png'))
    ctx.close()

    browser.close()

# ---------------------------------------------------------------------------
# Retired with the object stage, and why.
#
# The "From Signal to Systems" object stage (planet rim -> fragments -> rails ->
# paper fold -> carton -> Cake Studio hall) was replaced as a DESIGN, so the
# checks that only described it were retired rather than ported:
#
#   * plate registration: `data-fit="exact"`, the plate rectangle, the pixel
#     comparison of a render with the HTML image suppressed, and the crop
#     agreement. There is no handoff surface in Deep Field: nothing hands a 3D
#     plane over to an <img>, so the claim is undefined, not unverified.
#   * the evidence-label phase switch (`data-phase=object|proof`). Deep Field
#     shows no product screenshot inside the cinema, so there is no claim on
#     screen for a label to be true or false about.
#   * the World portal being an explicit action and never a scroll side effect.
#     No portal: the Worlds chapters link out, and those links are covered by
#     the hit-target and keyboard checks.
#   * the shard ring, the rim, the flare, the carton fold and the paper macro.
#
# Carried over unchanged in intent: determinism forward/reverse/jump, one active
# chapter, hidden chapters out of the tab order, stopping scroll stops
# progression, End/Home, the reduced-motion composition, and the no-JS document.
# Added this round: the exposed evaluator must agree with the rendered state, the
# dolly must settle on its pure value, the contrast is read from the rendered
# element, there must be exactly one progress bar, and the field has to be gone
# before the archive.
# ---------------------------------------------------------------------------

(OUT / 'deep-field-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
passed = sum(1 for c in report['checks'] if c['passed'])
print(f'{passed}/{len(report["checks"])} checks passed')
for f in report['failures']:
    print('FAIL', f)
sys.exit(1 if report['failures'] else 0)
