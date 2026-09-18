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
import argparse, io, json, sys

# A failing check must be able to print itself. Arabic copy in a failure detail
# was crashing the reporter on a cp1252 console, which turns a red suite into a
# traceback and hides what actually failed.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from PIL import Image, ImageChops
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


def changed_pixels(a, b):
    """Pixels that differ between two frames, ignoring encoder noise below 4/255."""
    ia = Image.open(io.BytesIO(a)).convert('RGB')
    ib = Image.open(io.BytesIO(b)).convert('RGB')
    return sum(ImageChops.difference(ia, ib).convert('L').histogram()[4:])


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

        # --- registration, measured from pixels rather than from data-fit ----
        #
        # `data-fit` is the renderer marking its own homework, so this reads the
        # frame instead. Two renders of the SAME progress are compared: one with
        # the HTML image suppressed, one with it at full strength.
        #
        # What that can and cannot establish, stated plainly. The region that
        # CHANGES between the two is exactly where the image painted, and it must
        # coincide with the rectangle the image was placed at and appear nowhere
        # else — that is what catches a ghost quad or a second draw, and it holds
        # for every chapter. Comparing the lit EXTENT of the 3D surface against
        # the image only means something where that surface is itself visible;
        # the workflow's and carton's screens are near-black planes whose lit area
        # is not their rectangle, so the corner comparison is run for the portal,
        # whose far wall carries a texture, and its measured drift is recorded
        # rather than asserted away.
        def boxes(shot_a, shot_b, region, floor):
            a = Image.open(io.BytesIO(shot_a)).convert('L').crop(region)
            b = Image.open(io.BytesIO(shot_b)).convert('L').crop(region)
            diff = ImageChops.difference(a, b)
            # `floor` was accepted here and never applied, so getbbox() answered
            # on ANY non-zero difference — a single unit of dither anywhere in a
            # 1440x900 frame widened the box. That is the whole reason the changed
            # region read "consistently larger than the plate": the number was
            # measuring encoder noise, not a second draw. Threshold first, then
            # ask for the bounding box of what actually differs.
            return diff.point(lambda v: 255 if v > floor else 0).getbbox(), a, b

        def lit_bbox(image, floor):
            return image.point(lambda v: 255 if v > floor else 0).getbbox()

        def registration_corners():
            measured = {}
            for label, u in [('system', 0.33), ('matter', 0.545), ('world', 0.78)]:
                scroll_to(page, u)
                page.wait_for_timeout(400)
                rect = page.evaluate("""() => {
                  const p = document.querySelector('[data-chapter][data-active="true"] [data-plate]');
                  if (!p) return null;
                  const r = p.getBoundingClientRect();
                  return {x: Math.round(r.x), y: Math.round(r.y),
                          w: Math.round(r.width), h: Math.round(r.height)};
                }""")
                if not rect or rect['w'] < 40:
                    continue
                hide = ("document.querySelector('[data-chapter][data-active=\"true\"] [data-plate]')"
                        ".style.setProperty('opacity','%s','important')")
                # The plate carries `box-shadow: 0 24px 48px -24px`, which paints
                # OUTSIDE its border box -- so toggling the plate changes pixels
                # below its rectangle, and a check asking "does anything outside
                # the rectangle change?" was answering about the shadow. Removing
                # it for the two captures changes no layout geometry: width,
                # height, transform and position are untouched, and it is removed
                # from BOTH frames, so it cannot contribute to the difference
                # either way. The production styles go back immediately after.
                neutral = page.add_style_tag(content=(
                    '[data-plate]{box-shadow:none!important;filter:none!important}'))
                page.wait_for_timeout(120)
                page.evaluate(hide % '0'); page.wait_for_timeout(280)
                without = page.screenshot()
                page.evaluate(hide % '1'); page.wait_for_timeout(280)
                with_html = page.screenshot()
                neutral.evaluate('node => node.remove()')
                page.wait_for_timeout(120)
                page.evaluate("document.querySelector('[data-chapter][data-active=\"true\"] [data-plate]')"
                              ".style.removeProperty('opacity')")
                page.wait_for_timeout(120)

                # Whole frame: what changed, and did anything change anywhere else?
                whole = (0, 0, page.viewport_size['width'], page.viewport_size['height'])
                changed, a_img, b_img = boxes(without, with_html, whole, 40)
                if not changed:
                    check(f'{name} {label}: the image actually draws', False, 'no pixels changed')
                    continue
                corners = [abs(changed[0] - rect['x']), abs(changed[1] - rect['y']),
                           abs(changed[2] - (rect['x'] + rect['w'])),
                           abs(changed[3] - (rect['y'] + rect['h']))]
                measured[label] = {'plate': rect, 'changed': list(changed), 'corners': corners}
                # Two claims this method can actually carry, bounded on both
                # sides, and named for what they establish rather than for what
                # would be nice to have shown.
                #
                # The outermost pixels of a dark UI capture over a near-black
                # stage differ by less than any usable threshold, so the changed
                # region stops a few pixels short of the declared edge. That is a
                # property of the content, not of where the plate landed, and an
                # assertion on the exact edge is an assertion about contrast.
                # So: the plate's INTERIOR must all change -- that catches a plate
                # landing elsewhere, at the wrong size, or not drawing -- and
                # nothing beyond a small margin OUTSIDE it may change, which is
                # what catches a ghost quad or a second draw.
                #
                # Neither of these is a registration test. Registration is
                # scripts/diagnose-registration.py, which compares corner markers
                # in rendered pixels and does not consult data-fit or the
                # fitter's own rectangle. This is the cheap always-on guard.
                inset_x, inset_y = rect['w'] * 0.08, rect['h'] * 0.08
                inner = (rect['x'] + inset_x, rect['y'] + inset_y,
                         rect['x'] + rect['w'] - inset_x, rect['y'] + rect['h'] - inset_y)
                covers_inner = (changed[0] <= inner[0] and changed[1] <= inner[1]
                                and changed[2] >= inner[2] and changed[3] >= inner[3])
                check(f'{name} {label}: every part of the plate interior changes when it draws',
                      covers_inner, f"changed={changed} interior={[round(v) for v in inner]}")
                MARGIN = 6
                contained = (changed[0] >= rect['x'] - MARGIN and changed[1] >= rect['y'] - MARGIN
                             and changed[2] <= rect['x'] + rect['w'] + MARGIN
                             and changed[3] <= rect['y'] + rect['h'] + MARGIN)
                check(f'{name} {label}: nothing outside the plate rectangle changes with it',
                      contained, f"changed={changed} plate={rect} margin={MARGIN}px")
                measured[label]['edgeInsetPx'] = [
                    round(changed[0] - rect['x'], 1), round(changed[1] - rect['y'], 1),
                    round(rect['x'] + rect['w'] - changed[2], 1),
                    round(rect['y'] + rect['h'] - changed[3], 1)]

                if label == 'world':
                    lit_a = lit_bbox(a_img, 40)
                    lit_b = lit_bbox(b_img, 40)
                    measured[label]['lit3d'] = list(lit_a) if lit_a else None
                    measured[label]['litHtml'] = list(lit_b) if lit_b else None
            report['viewports'][name]['registration_px'] = measured

        attempt(f'{name} four-corner registration', registration_corners)

        # --- the evidence names the object, not the scene --------------------
        # What is SHOWN, not what is in the document. A chapter with an interval
        # where the capture is deliberately absent carries both captions and
        # displays one; counting nodes would call that a defect, and counting only
        # the settled phase would never see the claim that matters.
        def visible_evidence():
            return page.evaluate("""() => {
              const out = {};
              for (const panel of document.querySelectorAll('[data-chapter]')) {
                out[panel.dataset.chapter] = [...panel.querySelectorAll('.signal__evidence')]
                  .filter(e => getComputedStyle(e).display !== 'none')
                  .map(e => ({kind: e.dataset.evidence, text: e.textContent.trim()}));
              }
              return out;
            }""")

        scroll_to(page, 0.545)          # the carton's proof stop
        page.wait_for_timeout(250)
        evidence = visible_evidence()
        report['viewports'][name]['evidence'] = evidence
        for chapter in ('system', 'matter', 'world'):
            lines = evidence.get(chapter) or []
            check(f'{name} {chapter}: the drawn object and the capture are labelled separately',
                  len(lines) == 2 and any(l['kind'] == 'illustration' for l in lines)
                  and any(l['kind'] == 'screenshot' or l['kind'] == 'media' for l in lines),
                  lines)

        scroll_to(page, 0.474)          # the carton's own stop: no capture exists
        page.wait_for_timeout(250)
        at_object = (visible_evidence().get('matter') or [])
        report['viewports'][name]['evidenceAtObject'] = at_object
        check(f'{name} matter: the object stop shows one caption', len(at_object) == 1, at_object)
        check(f'{name} matter: no caption claims a screenshot that is not on screen',
              all(l['kind'] != 'screenshot' for l in at_object), at_object)
        scroll_to(page, 0.0)

        # ====================================================================
        # Migrated from scripts/test-showroom.py
        #
        # That suite waited for `[data-motion-toggle]`, which lives only in
        # Exhibit.astro — a component this route stopped importing when the
        # cinema replaced the showroom composition. A selector can go obsolete
        # without the requirement behind it going obsolete, so what follows is
        # the behaviour it was protecting, re-expressed against what this route
        # actually renders. What was genuinely retired is listed at the bottom of
        # this file, with the reason, rather than in a commit message.
        # ====================================================================

        # The old suite let a visitor stop the motion. Here the motion stops
        # itself at every reading stop, so the equivalent requirement is that a
        # reading stop is actually STILL. Asserting that progress and the chapter
        # did not drift only proves the scroll stopped; it says nothing about
        # whether the scene is still moving in front of someone reading it.
        def stillness():
            for label, u in [('system', 0.34), ('matter', 0.52), ('world', 0.78)]:
                scroll_to(page, u)
                page.wait_for_timeout(1200)
                first = page.screenshot()
                page.wait_for_timeout(2000)
                second = page.screenshot()
                rest = page.evaluate("getComputedStyle(document.querySelector('[data-signal]'))"
                                     ".getPropertyValue('--signal-rest').trim()")
                moved = changed_pixels(first, second)
                check(f'{name} {label} reading stop declares itself at rest', rest == '1', rest)
                check(f'{name} {label} reading stop is a still frame', moved == 0, f'{moved} px moved')

        attempt(f'{name} reading stops are still', stillness)

        # Keyboard: the rewind this suite previously could not see. From the
        # middle of the cinema, Tab must not scroll the page or change the
        # chapter, and the live chapter's own controls must be reachable.
        def keyboard_hold():
            scroll_to(page, 0.53)
            page.wait_for_timeout(300)
            before = page.evaluate('() => ({y: Math.round(scrollY), '
                                   "ch: document.querySelector('[data-signal]').dataset.signalChapter})")
            # Only while focus is still inside the film. Tabbing PAST the last
            # control in the stage and on into the page below it is ordinary
            # document order, and the browser scrolling there is correct; the
            # requirement is that focusing what is on screen does not move it.
            seen = []
            for _ in range(16):
                page.keyboard.press('Tab')
                page.wait_for_timeout(90)
                state = page.evaluate("""() => {
                  const a = document.activeElement, r = a.getBoundingClientRect();
                  const stage = document.querySelector('[data-signal-stage]');
                  return {y: Math.round(scrollY),
                          ch: document.querySelector('[data-signal]').dataset.signalChapter,
                          inStage: !!(stage && stage.contains(a)),
                          inChapter: !!a.closest('[data-chapter]'),
                          inSeek: !!a.closest('[data-signal-seek]'),
                          inert: !!a.closest('[inert]'),
                          onScreen: r.width > 0 && r.top >= 0 && r.bottom <= innerHeight + 1};
                }""")
                if not state['inStage'] and any(f['inStage'] for f in seen):
                    break     # focus has left the film; the rest is the page
                seen.append(state)
            check(f'{name} the film offers real keyboard stops',
                  sum(1 for f in seen if f['inStage']) >= 3,
                  sum(1 for f in seen if f['inStage']))
            check(f'{name} the chapter navigation is reachable',
                  any(f['inSeek'] for f in seen))
            drift = max(abs(f['y'] - before['y']) for f in seen)
            check(f'{name} Tab from mid-cinema does not scroll the page', drift <= 2, drift)
            check(f'{name} Tab from mid-cinema does not change the chapter',
                  all(f['ch'] == before['ch'] for f in seen),
                  sorted({f['ch'] for f in seen}))
            check(f'{name} the live chapter is reachable by keyboard',
                  any(f['inChapter'] for f in seen), 'no chapter control was focused')
            check(f'{name} focus never lands inside an inert subtree',
                  not any(f['inert'] for f in seen))
            check(f'{name} every focused element is on screen',
                  all(f['onScreen'] for f in seen),
                  sum(1 for f in seen if not f['onScreen']))

        attempt(f'{name} keyboard holds its place mid-cinema', keyboard_hold)

        def seek_controls():
            scroll_to(page, 0.53)
            page.wait_for_timeout(250)
            page.click('[data-seek=next]')
            page.wait_for_timeout(600)
            after = page.evaluate("""() => {
              const a = document.activeElement;
              return {ch: document.querySelector('[data-signal]').dataset.signalChapter, id: a.id};
            }""")
            check(f'{name} Next advances the chapter', after['ch'] == 'signal', after['ch'])
            check(f'{name} Next lands focus on what it arrived at',
                  after['id'] == 'signal-signal-line', after['id'])
            page.click('[data-seek=prev]')
            page.wait_for_timeout(600)
            back = page.evaluate("document.querySelector('[data-signal]').dataset.signalChapter")
            check(f'{name} Previous goes back', back == 'matter', back)
            page.click('[data-seek=work]')
            page.wait_for_timeout(700)
            landed = page.evaluate("() => ({id: document.activeElement.id, "
                                   "vis: !!document.querySelector('#work')})")
            check(f'{name} View work lands on the work itself', landed['id'] == 'public-title', landed)

        attempt(f'{name} chapter navigation', seek_controls)

        # --- the archive directory, migrated ---------------------------------
        def archive_directory():
            page.locator('[data-sky-filter="all"]').click(); page.wait_for_timeout(150)
            shown = page.locator('[data-sky-item]:visible').count()
            check(f'{name} archive opens on the first twelve', shown == 12, shown)
            # 'all' and 'automation' are capped by the pager, so the cap and the
            # group size are asserted separately: otherwise 12 silently stands in
            # for 18 and the test agrees with a defect.
            for group, expect in [('public', 4), ('automation', 12), ('lab', 7), ('foundation', 9)]:
                page.locator(f'[data-sky-filter="{group}"]').click(); page.wait_for_timeout(150)
                visible = page.locator('[data-sky-item]:visible').count()
                total = page.locator(f'[data-sky-item][data-group="{group}"]').count()
                check(f'{name} filter {group} shows {expect}', visible == expect, visible)
                check(f'{name} filter {group} never shows more than the group holds',
                      visible <= total, f'{visible} of {total}')
            page.locator('[data-sky-filter="all"]').click()
            page.locator('[data-project-search]').fill('mk voice'); page.wait_for_timeout(200)
            check(f'{name} search narrows to one project',
                  page.locator('[data-sky-item]:visible').count() == 1,
                  page.locator('[data-sky-item]:visible').count())
            page.locator('[data-project-search]').fill('no-such-project-xyz'); page.wait_for_timeout(200)
            check(f'{name} a search with no hits says so',
                  page.locator('[data-project-empty]').is_visible())
            page.locator('[data-project-search]').fill(''); page.wait_for_timeout(200)

        attempt(f'{name} archive directory', archive_directory)

        # --- the quick view keeps its focus contract -------------------------
        def quick_view():
            page.locator('[data-preview="preview-ask-repos"]').click(); page.wait_for_timeout(350)
            check(f'{name} quick view opens', page.locator('[data-showroom-dialog]').is_visible())
            boundary = page.locator('[data-showroom-dialog] .sr-preview__boundary').inner_text()
            check(f'{name} quick view carries the honest boundary', len(boundary) > 50, len(boundary))
            page.keyboard.press('Escape'); page.wait_for_timeout(350)
            check(f'{name} Escape closes the quick view',
                  not page.locator('[data-showroom-dialog]').is_visible())
            check(f'{name} closing returns focus to the trigger',
                  page.evaluate('document.activeElement.dataset.preview') == 'preview-ask-repos',
                  page.evaluate('document.activeElement.dataset.preview'))

        attempt(f'{name} quick view', quick_view)

        # --- a card's own evidence controls ----------------------------------
        def card_evidence():
            card = page.locator('.sr-card').first
            shots = card.locator('[data-shot]')
            check(f'{name} the first card offers more than one screenshot',
                  shots.count() > 1, shots.count())
            shots.nth(1).click(); page.wait_for_timeout(250)
            check(f'{name} the chosen screenshot is the pressed one',
                  shots.nth(1).get_attribute('aria-pressed') == 'true')

        attempt(f'{name} card evidence controls', card_evidence)

        def method_disclosure():
            steps = page.locator('#method details')
            check(f'{name} five method steps', steps.count() == 5, steps.count())
            first = steps.first
            check(f'{name} method steps start closed', first.get_attribute('open') is None)
            first.locator('summary').click(); page.wait_for_timeout(200)
            check(f'{name} a method step opens on its summary', first.get_attribute('open') is not None)
            first.locator('summary').click()

        attempt(f'{name} method disclosure', method_disclosure)

        if w < 700:
            def mobile_menu():
                page.evaluate('window.scrollTo({top:0,behavior:"instant"})'); page.wait_for_timeout(250)
                page.locator('[data-mobile-menu] summary').click(); page.wait_for_timeout(250)
                check(f'{name} mobile menu opens',
                      page.locator('[data-mobile-menu]').get_attribute('open') is not None)
                page.keyboard.press('Escape'); page.wait_for_timeout(250)
                check(f'{name} Escape closes the mobile menu',
                      page.locator('[data-mobile-menu]').get_attribute('open') is None)

            attempt(f'{name} mobile menu', mobile_menu)

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
    # Migrated: the old suite asked the whole archive to survive without script,
    # not only the part the cinema replaced.
    visible = page.locator('[data-sky-item]:visible').count()
    check('no-JS shows every project in the archive', visible == 38, visible)
    check('no-JS hides the empty state it cannot drive',
          not page.locator('[data-project-empty]').is_visible())
    # And the old poster requirement: where the interactive illustration would
    # have been, a real image with a real description, served by the document.
    plates = page.evaluate('''() => {
      const imgs = [...document.querySelectorAll('[data-chapter] img[data-plate]')];
      return {count: imgs.length, withAlt: imgs.filter(i => (i.alt || '').length > 10).length};
    }''')
    check('no-JS keeps the chapter plates with their descriptions',
          plates['count'] >= 4 and plates['withAlt'] == plates['count'], plates)
    page.screenshot(path=str(OUT / 'nojs.png'))
    ctx.close()

    browser.close()

# ---------------------------------------------------------------------------
# Retired from scripts/test-showroom.py, with the reason.
#
# These four groups were Exhibit-specific and Exhibit renders on no route now
# (the landing page stopped importing it when the cinema replaced the showroom
# composition). The assertions are kept readable in scripts/attic/, not deleted,
# so they can come back with the component if it is ever mounted again:
#
#   * exhibit kind switching            test-showroom.py:81-83
#   * the [data-assembly] range control            :85
#   * the [data-motion-toggle] control      :86-87, :104
#   * the [data-exhibit-fallback] poster     :105, :110
#
# Three more were genuinely obsolete rather than renamed, and their requirements
# are already discharged here: one renderer (the `one renderer canvas` check),
# WebGL initialised (`WebGL initialised`), and the static path (`reduced motion
# uses the static path`). Nothing was added for `?showroom=static`; reintroducing
# a static escape on this route would be a product decision, not a migration.
# ---------------------------------------------------------------------------

(OUT / 'signal-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
passed = sum(1 for c in report['checks'] if c['passed'])
print(f'{passed}/{len(report["checks"])} checks passed')
for f in report['failures']:
    print('FAIL', f)
sys.exit(1 if report['failures'] else 0)
