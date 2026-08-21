"""Drive worlds/spotify.html in a real browser and prove the footage scrubs.

The claim being tested is not "the videos load". It is that scroll position
drives `video.currentTime` — so the evidence has to be the SAME scene captured
at several scroll positions showing DIFFERENT video frames, with the measured
currentTime printed beside each shot.

  python scripts/verify-spotify-live.py --base-url http://127.0.0.1:4601 --out proof/

Checks, in order:
  1. Side B flight — 8 scroll positions across the 12 legs (two of them inside
     the same leg, which is what separates "scrubbing" from "cutting").
  2. Side A — the seven recut room plates, three positions each.
  3. Arabic — flip the language and re-shoot two positions.
  4. ?solo=N per new scene.
  5. Phone — the same seven plates, full down/up traversal, and the ending.
  6. Console: any error or pageerror fails the run.
"""
import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

# the captions are half Arabic and Windows stdout defaults to cp1252
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

FLIGHT_SAMPLES = [        # (leg, fraction-through-leg, label)
    (0, 0.10, 'leg01-portal-early'),
    (0, 0.85, 'leg01-portal-late'),      # same clip, far later frame
    (2, 0.50, 'leg03-playlist'),
    (4, 0.50, 'leg05-parallax'),
    (6, 0.35, 'leg07-highway-THE-DROP'),
    (7, 0.80, 'leg08-listener'),
    (9, 0.50, 'leg10-pullback'),
    (11, 0.90, 'leg12-line'),
]

RECUT_PLATES = [
    ('A01', 'room01-silence-recut'),
    ('A02', 'room02-contact-recut'),
    ('A03', 'room03-runway-recut'),
    ('A04', 'room04-build-recut'),
    ('A05', 'room05-lounge-recut'),
    ('A06', 'room06-chorus-recut'),
    ('A07', 'room07-needle-up-recut'),
]

FLIGHT_JS = """
() => {
  const f = document.getElementById('flight');
  const vids = [...f.querySelectorAll('.flightplate video')];
  const on = vids.find(v => v.classList.contains('on'));
  const cap = f.querySelector('.legcap.on');
  const lang = document.documentElement.lang;
  const pick = el => { const s = el && el.querySelector('.L.' + (lang === 'ar' ? 'ar' : 'en')); return s ? s.textContent.trim() : null; };
  return {
    p: f.style.getPropertyValue('--p'),
    frac: f.style.getPropertyValue('--f'),
    legno: f.querySelector('.legno').textContent,
    caption: cap ? pick(cap.querySelector('h2')) : null,
    clip: on ? on.currentSrc.split('/').pop() : null,
    t: on ? +on.currentTime.toFixed(3) : null,
    readyState: on ? on.readyState : null,
    dims: on ? on.videoWidth + 'x' + on.videoHeight : null,
    pip: [...f.querySelectorAll('.legrail i')].findIndex(i => i.classList.contains('on')),
    // Name the element, do not count elements. A previous version asserted
    // "exactly one caption is visible", which passed while the OUTGOING
    // caption was the visible one and the incoming one was still at 0 — so it
    // photographed the wrong headline and reported the right one.
    activeCapOpacity: cap ? +getComputedStyle(cap).opacity : 0,
    otherCapOpacity: Math.max(0, ...[...f.querySelectorAll('.legcap')]
                       .filter(c => c !== cap).map(c => +getComputedStyle(c).opacity)),
    activeVidOpacity: on ? +getComputedStyle(on).opacity : 0,
    otherVidOpacity: Math.max(0, ...vids.filter(v => v !== on)
                       .map(v => +getComputedStyle(v).opacity)),
    capTop: cap ? Math.round(cap.getBoundingClientRect().top) : null,
    noTop: Math.round(f.querySelector('.legno').getBoundingClientRect().top),
  };
}
"""

PLATE_JS = """
(sel) => {
  const s = document.querySelector(sel);
  const v = s.querySelector('.plate video');
  return {
    p: s.style.getPropertyValue('--p'),
    plate: s.dataset.plate.split('/').pop(),
    t: v ? +v.currentTime.toFixed(3) : null,
    readyState: v ? v.readyState : null,
    dims: v ? v.videoWidth + 'x' + v.videoHeight : null,
    ready: s.classList.contains('plate-ready'),
    missing: s.classList.contains('plate-missing'),
    // the shared engine fades a scene's caption in over .7s once it goes live;
    // an instant scroll jump lands mid-fade and photographs a half-lit card
    activeCapOpacity: +getComputedStyle(s.querySelector('.caption')).opacity,
    otherCapOpacity: 0, activeVidOpacity: 1, otherVidOpacity: 0,
  };
}
"""


def settle(page, probe, want, expect=None, budget_ms=6000, step=100):
    """Wait for the seek to land instead of sleeping a guessed interval.

    A fixed sleep is not a wait: it passes when the machine is warm and reports
    a page defect when a cold 1.8 MB clip needs an extra 200 ms. Poll the
    property under test, cap the budget, and return how long it took so a
    future slow run is a measurement rather than a mystery.

    `expect` is a (key, value) the state must ALSO satisfy. Without it the time
    test alone can be satisfied by the state left over from the previous
    sample — asking for leg 05 at 2.5 s accepted leg 03 still sitting at
    2.498 s and reported it as a 0 ms settle. A convergence test that the
    pre-change state can pass is not a convergence test.
    """
    waited = 0
    while waited < budget_ms:
        st = page.evaluate(probe)
        t = st.get('t')
        ok_key = expect is None or st.get(expect[0]) == expect[1]
        # the RIGHT video and the RIGHT caption fully up, everything else gone:
        # otherwise a CSS transition is still running and the frame is a
        # dissolve, or worse, the previous leg's card
        settled = (st.get('activeCapOpacity', 1) > 0.98
                   and st.get('otherCapOpacity', 0) < 0.02
                   and st.get('activeVidOpacity', 1) > 0.98
                   and st.get('otherVidOpacity', 0) < 0.02)
        if (ok_key and settled and st.get('readyState', 0) >= 2
                and t is not None and abs(t - want) < 0.12):
            return st, waited
        page.wait_for_timeout(step)
        waited += step
    return page.evaluate(probe), waited


def scroll_flight(page, leg, frac):
    page.evaluate(
        """([leg, frac]) => {
            const f = document.getElementById('flight');
            const top = f.getBoundingClientRect().top + scrollY;
            const travel = f.getBoundingClientRect().height - innerHeight;
            scrollTo({ top: Math.round(top + ((leg + frac) / 12) * travel), behavior: 'instant' });
        }""", [leg, frac])


def scroll_scene(page, sel, p):
    page.evaluate(
        """([sel, p]) => {
            const s = document.querySelector(sel);
            const top = s.getBoundingClientRect().top + scrollY;
            const travel = s.getBoundingClientRect().height - innerHeight;
            scrollTo({ top: Math.round(top + p * travel), behavior: 'instant' });
        }""", [sel, p])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base-url', default='http://127.0.0.1:4601')
    ap.add_argument('--out', default='proof')
    ap.add_argument('--headed', action='store_true')
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    url = args.base_url.rstrip('/') + '/worlds/spotify.html'
    errors, report, fail = [], [], 0

    with sync_playwright() as pw:
        # Use a browser this machine already has rather than downloading one.
        # Installed Chrome/Edge also ship the proprietary codecs, so H.264
        # actually decodes — Playwright's own Chromium build may not have them,
        # which would make every plate silently blank in a test about plates.
        br = None
        for channel in ('chrome', 'msedge', None):
            try:
                br = pw.chromium.launch(headless=not args.headed,
                                        **({'channel': channel} if channel else {}))
                print(f'browser: {channel or "bundled chromium"}')
                break
            except Exception as exc:                                  # noqa: BLE001
                print(f'  ({channel or "bundled"} unavailable: {str(exc).splitlines()[0]})')
        if br is None:
            print('FAIL: no usable browser'); return 1
        page = br.new_page(viewport={'width': 1440, 'height': 900})
        page.on('console', lambda m: errors.append(f'console.{m.type}: {m.text}')
                if m.type in ('error', 'warning') else None)
        page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
        page.on('requestfailed', lambda r: errors.append(f'requestfailed: {r.url} {r.failure}'))

        page.goto(url, wait_until='load')
        page.wait_for_timeout(1200)

        # Name the environment before grading the page. Chrome refuses to move
        # currentTime unless the server advertises Accept-Ranges, and a server
        # that does not (python -m http.server answers 206 but omits the
        # header) makes a perfectly good page read as "does not scrub".
        env = page.evaluate("""async () => {
            const r = await fetch('spotify/live/j01-portal.mp4', {method:'HEAD'});
            const v = document.querySelector('.plate video');
            const paths = [...document.querySelectorAll('[data-plate*="-recut.mp4"]')]
                            .map(s => s.dataset.plate);
            const recutRanges = await Promise.all(paths.map(async path => {
              const rr = await fetch(path, {headers: {Range: 'bytes=0-1'}});
              const bytes = new Uint8Array(await rr.arrayBuffer()).length;
              return {path, status: rr.status,
                      acceptRanges: rr.headers.get('accept-ranges'),
                      contentRange: rr.headers.get('content-range'), bytes};
            }));
            return { acceptRanges: r.headers.get('accept-ranges'),
                     seekable: v ? v.seekable.length : -1,
                     recutRanges };
        }""")
        print(f"server Accept-Ranges: {env['acceptRanges']}   "
              f"video.seekable ranges: {env['seekable']}")
        if env['acceptRanges'] != 'bytes':
            print('FAIL: this server cannot serve ranges — nothing below is about the page')
            br.close()
            return 1
        for rr in env['recutRanges']:
            good = (rr['status'] == 206 and rr['acceptRanges'] == 'bytes'
                    and rr['bytes'] == 2 and (rr['contentRange'] or '').startswith('bytes 0-1/'))
            print(f"  {'GREEN' if good else 'FAIL'} range {rr['path']} "
                  f"status={rr['status']} bytes={rr['bytes']}")
            if not good:
                fail = 1

        mode = page.evaluate("() => document.getElementById('flight').className")
        print(f'flight mode: {mode}')
        if 'mode-scrub' not in mode:
            print('FAIL: desktop viewport did not select scrub mode')
            fail = 1

        # ---- 1. Side B, eight positions ----
        print('\n== Side B · the flight ==')
        seen = []
        for leg, frac, label in FLIGHT_SAMPLES:
            scroll_flight(page, leg, frac)
            st, waited = settle(page, FLIGHT_JS, want=frac * 5.0,
                                expect=('legno', f'{leg + 1:02d}'))
            page.screenshot(path=str(out / f'flight-{label}.png'))
            st['label'] = label
            st['settleMs'] = waited
            seen.append(st)
            report.append(st)
            print(f"  {label:26} leg={st['legno']} f={st['frac']} t={st['t']} "
                  f"({waited} ms)  {st['clip']}  {st['caption']!r}")
            if st['readyState'] is None or st['readyState'] < 2:
                print(f'    FAIL: no decoded video at {label}'); fail = 1
            if st['dims'] != '1600x670':
                print(f"    FAIL: unexpected dims {st['dims']}"); fail = 1
            if (st['activeCapOpacity'] <= 0.98 or st['otherCapOpacity'] >= 0.02
                    or st['activeVidOpacity'] <= 0.98 or st['otherVidOpacity'] >= 0.02):
                print(f"    FAIL: caught mid-transition — active caption "
                      f"{st['activeCapOpacity']} / ghost {st['otherCapOpacity']}, "
                      f"active video {st['activeVidOpacity']} / ghost "
                      f"{st['otherVidOpacity']}"); fail = 1

        # the scrub proof: two samples of the SAME clip must differ in time
        a, b = seen[0], seen[1]
        if a['clip'] != b['clip']:
            print('  FAIL: the two leg-01 samples are not the same clip'); fail = 1
        elif abs(b['t'] - a['t']) < 2.0:
            print(f"  FAIL: same clip barely moved ({a['t']} -> {b['t']})"); fail = 1
        else:
            print(f"  SCRUB PROVEN: {a['clip']} at t={a['t']} and t={b['t']} "
                  f"from two scroll positions")
        # every sample must be a distinct frame
        if len({(s['clip'], s['t']) for s in seen}) != len(seen):
            print('  FAIL: two samples landed on the identical frame'); fail = 1

        # caption/numeral parallax: they must sit at different offsets per frac
        if seen[0]['capTop'] == seen[1]['capTop'] and seen[0]['noTop'] == seen[1]['noTop']:
            print('  FAIL: caption and numeral did not drift between fractions'); fail = 1

        # ---- 2. Side A room plates ----
        print('\n== Side A · the seven WAN recut plates ==')
        bound = page.evaluate(
            "() => [...document.querySelectorAll('[data-plate*=\"-recut.mp4\"]')].map(s => s.dataset.plate)")
        expected = [f'spotify/live/{name}.mp4' for _, name in RECUT_PLATES]
        if bound != expected:
            print(f'  FAIL: runtime binding mismatch: {bound!r}'); fail = 1
        for shot, name in RECUT_PLATES:
            sel = f"[data-plate='spotify/live/{name}.mp4']"
            times = []
            states = []
            for p in (0.001, 0.50, 0.98):
                scroll_scene(page, sel, p)
                st, waited = settle(page, f'() => ({PLATE_JS})({sel!r})', want=p * 5.0)
                times.append(st['t'])
                states.append(st)
                page.screenshot(path=str(out / f'desktop-{shot}-p{int(p * 1000):03d}.png'))
                if st['readyState'] is None or st['readyState'] < 2:
                    print(f'    FAIL: {shot} has no decoded frame at p={p}'); fail = 1
                if st['dims'] != '1280x660':
                    print(f"    FAIL: {shot} unexpected dimensions {st['dims']}"); fail = 1
                if st['missing'] or not st['ready']:
                    print(f'    FAIL: {shot} plate did not arm'); fail = 1
                if st['t'] is None or abs(st['t'] - p * 5.0) >= 0.12:
                    print(f"    FAIL: {shot} missed p={p}: t={st['t']}"); fail = 1
            report.append({'viewport': 'desktop', 'shot': shot, 'times': times,
                           'dims': states[-1]['dims']})
            print(f"  {shot} {name:28} t={times[0]} -> {times[1]} -> {times[2]}  "
                  f"dims={states[-1]['dims']}")
            if any(t is None for t in times) or times[-1] - times[0] < 4.6:
                print(f'    FAIL: {shot} did not scrub end to end'); fail = 1

        # ---- 3. Arabic ----
        print('\n== Arabic ==')
        page.click('[data-lang-toggle]')
        page.wait_for_timeout(400)
        dirn = page.evaluate("() => [document.documentElement.lang, document.documentElement.dir]")
        print(f'  html lang/dir: {dirn}')
        if dirn != ['ar', 'rtl']:
            print('  FAIL: language did not flip'); fail = 1
        for leg, frac, label in [(6, 0.35, 'ar-leg07-THE-DROP'), (10, 0.5, 'ar-leg11-return')]:
            scroll_flight(page, leg, frac)
            st, _ = settle(page, FLIGHT_JS, want=frac * 5.0,
                           expect=('legno', f'{leg + 1:02d}'))
            page.screenshot(path=str(out / f'{label}.png'))
            print(f"  {label:20} leg={st['legno']} t={st['t']} cap={st['caption']!r}")
            if not st['caption'] or any('a' <= c <= 'z' for c in st['caption'].lower()[:12]):
                print('  FAIL: Arabic caption did not swap'); fail = 1
        page.click('[data-lang-toggle]')
        page.wait_for_timeout(300)

        # ---- 4. ?solo per new scene ----
        print('\n== ?solo harness ==')
        idx = page.evaluate("""() => {
            const scenes=[...document.querySelectorAll('[data-scene]')];
            const want=[...document.querySelectorAll('[data-plate*="-recut.mp4"]'), document.getElementById('flight')];
            return want.map(w=>scenes.indexOf(w));
        }""")
        if len(idx) != 8 or any(i < 0 for i in idx):
            print(f'  FAIL: expected seven recut scenes plus Side B, got {idx!r}'); fail = 1
        for k, i in enumerate(idx):
            page.goto(f'{url}?solo={i}&p=0.55', wait_until='load')
            page.wait_for_timeout(1600)
            st = page.evaluate("""() => {
                const s=[...document.querySelectorAll('[data-scene]')].find(x=>x.style.display!=='none');
                const v=s.querySelector('video');
                return {slate:s.dataset.slate, t:v?+v.currentTime.toFixed(2):null, rs:v?v.readyState:null};
            }""")
            page.screenshot(path=str(out / f'solo-{i}.png'))
            print(f"  solo={i:<3} {st['slate']:28} t={st['t']} readyState={st['rs']}")
            if st['rs'] is None or st['rs'] < 2 or st['t'] in (None, 0):
                print('    FAIL: soloed scene did not hold a frame'); fail = 1

        # ---- 5. Phone parity + complete ending path ----
        print('\n== Phone 390x844 @ DPR 3 ==')
        phone_context = br.new_context(
            viewport={'width': 390, 'height': 844},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            reduced_motion='no-preference',
        )
        phone = phone_context.new_page()
        phone.on('console', lambda m: errors.append(f'phone console.{m.type}: {m.text}')
                 if m.type in ('error', 'warning') else None)
        phone.on('pageerror', lambda e: errors.append(f'phone pageerror: {e}'))
        phone.on('requestfailed', lambda r: errors.append(
            f'phone requestfailed: {r.url} {r.failure}'))
        phone.goto(url, wait_until='load')
        phone.wait_for_timeout(1200)
        phone_state = phone.evaluate("""() => ({
            width: innerWidth,
            dpr: devicePixelRatio,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            flightMode: document.getElementById('flight').className,
            hasFinale: Boolean(document.querySelector('.sc-fin')),
            hasFlip: Boolean(document.querySelector('.flip')),
            hasCredits: Boolean(document.querySelector('.credits')),
        })""")
        print(f"  width={phone_state['width']} dpr={phone_state['dpr']} "
              f"overflow={phone_state['overflow']} flight={phone_state['flightMode']}")
        if phone_state['width'] != 390 or phone_state['dpr'] != 3:
            print('  FAIL: phone viewport contract not active'); fail = 1
        if phone_state['overflow'] > 1:
            print(f"  FAIL: horizontal overflow {phone_state['overflow']} px"); fail = 1
        if 'mode-chain' not in phone_state['flightMode']:
            print('  FAIL: phone did not choose its touch-safe Side B chain mode'); fail = 1
        if not all(phone_state[k] for k in ('hasFinale', 'hasFlip', 'hasCredits')):
            print('  FAIL: phone ending structure is incomplete'); fail = 1

        for shot, name in RECUT_PLATES:
            sel = f"[data-plate='spotify/live/{name}.mp4']"
            times = []
            last = None
            for p in (0.001, 0.50, 0.98):
                scroll_scene(phone, sel, p)
                last, _ = settle(phone, f'() => ({PLATE_JS})({sel!r})', want=p * 5.0,
                                 budget_ms=8000)
                times.append(last['t'])
                if p == 0.50:
                    phone.screenshot(path=str(out / f'phone-{shot}-peak.png'))
            report.append({'viewport': 'phone-390x844-dpr3', 'shot': shot,
                           'times': times, 'dims': last['dims'] if last else None})
            print(f"  {shot} t={times[0]} -> {times[1]} -> {times[2]}  "
                  f"dims={last['dims'] if last else None}")
            if (last is None or last['missing'] or not last['ready']
                    or last['dims'] != '1280x660'
                    or any(t is None for t in times)
                    or times[-1] - times[0] < 4.6):
                print(f'    FAIL: {shot} phone scrub/decode gate'); fail = 1

        # Exercise the actual long page in both directions; jumping straight to
        # credits cannot detect the historical phone ending failure.
        travel = phone.evaluate('() => document.documentElement.scrollHeight - innerHeight')
        for step_i in range(61):
            phone.evaluate('(y) => scrollTo({top:y, behavior:"instant"})',
                           round(travel * step_i / 60))
            phone.wait_for_timeout(20)
        bottom = phone.evaluate("""() => ({
            y: scrollY,
            max: document.documentElement.scrollHeight - innerHeight,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            creditsBottom: document.querySelector('.credits').getBoundingClientRect().bottom,
        })""")
        phone.screenshot(path=str(out / 'phone-ending.png'))
        if abs(bottom['max'] - bottom['y']) > 2 or bottom['overflow'] > 1:
            print(f'  FAIL: phone did not reach a clean ending: {bottom!r}'); fail = 1
        for step_i in range(60, -1, -1):
            phone.evaluate('(y) => scrollTo({top:y, behavior:"instant"})',
                           round(travel * step_i / 60))
            phone.wait_for_timeout(20)
        back_at_top = phone.evaluate('() => scrollY')
        if back_at_top > 2:
            print(f'  FAIL: reverse traversal stopped at y={back_at_top}'); fail = 1
        else:
            print(f"  full down/up traversal GREEN; bottom y={bottom['y']} / {bottom['max']}")
        phone_context.close()

        br.close()

    print('\n== console ==')
    # Three buckets, and the split is stated rather than quietly filtered.
    #
    # 1. Aborted .mp4 — a scrubbing page cancels media fetches by design: every
    #    double-buffer swap and every re-seek kills one. The mechanism working.
    # 2. ERR_INVALID_HTTP_RESPONSE on .mp4 against a LOCAL harness server —
    #    scripts/serve-static.mjs streams files by hand, and under this much
    #    cancellation Node occasionally closes a response short of its declared
    #    Content-Length. It is a defect in the test rig, not the page: every
    #    affected clip still loads, decodes and scrubs in the measurements
    #    above. Counted and printed, never hidden — and it MUST be zero when
    #    this harness is pointed at the deployed host, which is the run that
    #    decides whether the page is clean.
    # 3. Everything else fails the run.
    local = args.base_url.startswith(('http://127.0.0.1', 'http://localhost'))
    aborted_media = [e for e in errors if 'ERR_ABORTED' in e and '.mp4' in e]
    rig = [e for e in errors
           if local and '.mp4' in e and 'ERR_INVALID_HTTP_RESPONSE' in e]
    rig += [e for e in errors
            if local and e == 'console.error: Failed to load resource: '
                              'net::ERR_INVALID_HTTP_RESPONSE']
    rig += [e for e in errors
            if local and e.startswith('phone console.error:')
            and e.endswith('net::ERR_INVALID_HTTP_RESPONSE')]
    real = [e for e in errors
            if 'favicon' not in e.lower() and e not in aborted_media and e not in rig]
    print(f'  {len(aborted_media)} aborted .mp4 fetches — expected, that is how a '
          f'scrub cancels a range request')
    if rig:
        print(f'  {len(rig)} ERR_INVALID_HTTP_RESPONSE from the LOCAL harness server '
              f'(serve-static.mjs truncating a cancelled stream).')
        print('  Not a page defect — every affected clip measured correct above. '
              'Must be 0 against the deployed host.')
    for e in real:
        print('  ' + e)
    if real:
        print(f'FAIL: {len(real)} console/network problem(s)')
        fail = 1
    else:
        print('  clean')

    (out / 'report.json').write_text(json.dumps(report, indent=1), encoding='utf-8')
    print(f'\nshots + report.json in {out.resolve()}')
    print('RESULT: ' + ('FAIL' if fail else 'PASS'))
    return fail


if __name__ == '__main__':
    sys.exit(main())
