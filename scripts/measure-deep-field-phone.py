"""The phone, as close as an emulator gets to the way the owner will open it.

No device is attached to this machine, so nothing here is called a phone
measurement. What it is: a 390x844 viewport with touch, a device pixel ratio
of 3, and the CPU throttled 4x through the DevTools protocol — the same lever
Lighthouse's mobile profile pulls. That bounds the WORK the page asks for on a
slower machine. It does not tell you what a phone's GPU does with it, and the
report says so.

Five things are measured, and three of them carry a control that can fail:

  1. FRAME INTERVAL, p95, at six poses across the flight, under the throttle.
  2. THE PIXEL RATIO the renderer actually asked the context for. The device
     reports 3; the site caps at 1.5. Measured on this viewport that is 740,610
     fragments a frame instead of 2,962,440 — four times the work — so the cap
     is read back off the drawing buffer rather than trusted.
  3. THE ADAPTIVE COUNT, proved rather than asserted. A known cost is burned
     inside every animation frame until the interval crosses the phone's own
     budget, and the star count has to FALL. Then the load is removed and it
     has to climb back. CONTROL: with no load planted, the same wait must not
     move the count — otherwise the fall is just drift.
  4. TOUCH SCROLL, driven as real touch events through the protocol, with every
     listener traced back to the bundle that registered it. A scroll film that
     takes the wheel or swallows touchmove is a film a thumb cannot watch — and
     WHOSE handler it is decides the answer, so the runway and the sticky frame
     are read separately from the site's own smooth-scroll layer.
  5. NO HORIZONTAL SCROLL, and every control at least 44 px.

    node scripts/serve-static.mjs dist 4618
    python scripts/measure-deep-field-phone.py
"""
import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--out', default=str(ROOT / 'docs' / 'deep-field' / 'r04' / 'phone.json'))
parser.add_argument('--lang', default='en')
parser.add_argument('--throttle', type=float, default=4.0)
parser.add_argument('--seconds', type=float, default=2.5)
args = parser.parse_args()

VIEW = {'width': 390, 'height': 844}
DPR = 3
POSES = [0.0, 0.08, 0.2, 0.45, 0.7, 0.95]
# 30 fps in portrait, as the renderer's own governor states it.
BUDGET_MS = 1000 / 30

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
  await new Promise(r => setTimeout(r, 300));
}'''

CADENCE = '''async (seconds) => {
  const gaps = [];
  let last = 0;
  const until = performance.now() + seconds * 1000;
  await new Promise(done => {
    const tick = (now) => {
      if (last) gaps.push(now - last);
      last = now;
      if (now < until) requestAnimationFrame(tick); else done();
    };
    requestAnimationFrame(tick);
  });
  if (!gaps.length) return null;
  gaps.sort((a, b) => a - b);
  const at = (q) => gaps[Math.min(gaps.length - 1, Math.floor(gaps.length * q))];
  return {frames: gaps.length, medianMs: at(0.5), p95Ms: at(0.95)};
}'''

# Burn a known number of milliseconds inside every animation frame. Every rAF
# callback of a frame runs in that frame, so the renderer's own interval
# lengthens by this whether or not it knows about it.
PLANT = '''(ms) => {
  window.__plantedLoad = ms;
  if (window.__plantedRaf) return;
  const burn = () => {
    const load = window.__plantedLoad || 0;
    if (load > 0) { const end = performance.now() + load; while (performance.now() < end); }
    window.__plantedRaf = requestAnimationFrame(burn);
  };
  window.__plantedRaf = requestAnimationFrame(burn);
}'''

UNPLANT = '''() => {
  window.__plantedLoad = 0;
  if (window.__plantedRaf) cancelAnimationFrame(window.__plantedRaf);
  window.__plantedRaf = 0;
}'''

report = {
    'baseUrl': args.base_url, 'lang': args.lang,
    'viewport': f"{VIEW['width']}x{VIEW['height']}", 'deviceScaleFactor': DPR,
    'cpuThrottleRate': args.throttle, 'frameBudgetMs': round(BUDGET_MS, 2),
    'notMeasured': 'any physical device, any phone GPU, Safari, a cold network, touch latency',
}

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=CHROME, headless=True)
    ctx = browser.new_context(viewport=VIEW, device_scale_factor=DPR,
                              is_mobile=True, has_touch=True)
    page = ctx.new_page()
    cdp = ctx.new_cdp_session(page)
    cdp.send('Emulation.setCPUThrottlingRate', {'rate': args.throttle})
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(f'{args.base_url}/{args.lang}', wait_until='networkidle')
    page.wait_for_timeout(4000)

    # ------------------------------------------------- 2. the pixel ratio cap
    report['pixelRatio'] = page.evaluate('''() => {
      const canvas = document.querySelector('[data-signal-canvas]');
      const rect = canvas.getBoundingClientRect();
      return {devicePixelRatio,
              // What the renderer asked the drawing buffer for, read off the
              // canvas itself: its backing store divided by its CSS box.
              backingRatio: Number((canvas.width / Math.max(1, rect.width)).toFixed(3)),
              cssBox: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
              drawingBuffer: `${canvas.width}x${canvas.height}`,
              fragmentsPerFrame: canvas.width * canvas.height,
              fragmentsAtDeviceRatio: Math.round(rect.width * devicePixelRatio)
                                    * Math.round(rect.height * devicePixelRatio)};
    }''')

    # ------------------------------------------------- 1. the frame interval
    poses = {}
    for u in POSES:
        page.evaluate(SEEK, u)
        page.evaluate(SETTLE)
        page.evaluate('() => window.__deepField && window.__deepField.resume()')
        cadence = page.evaluate(CADENCE, args.seconds)
        state = page.evaluate('() => window.__deepField.state()')
        poses[f'{u:.2f}'] = {
            'chapter': state['chapter'], 'stars': state['stars'],
            'visible': state['visible'], 'tier': state['tier'],
            'governorFrameMs': state['frameIntervalMs'],
            'medianMs': round(cadence['medianMs'], 2) if cadence else None,
            'p95Ms': round(cadence['p95Ms'], 2) if cadence else None,
            'frames': cadence['frames'] if cadence else 0,
        }
    report['poses'] = poses
    worst = max((c['p95Ms'] or 0) for c in poses.values())
    report['verdict'] = {'worstP95Ms': worst, 'budgetMs': round(BUDGET_MS, 2),
                         'passed': worst <= BUDGET_MS}

    # ------------------------------------------- 3. the adaptive count, proved
    page.evaluate(SEEK, 0.2)
    page.evaluate(SETTLE)
    page.evaluate('() => window.__deepField.resume()')

    def settle_governor(seconds=4.0):
        """The governor needs 45 samples and 1.2 s between decisions."""
        page.wait_for_timeout(int(seconds * 1000))
        return page.evaluate('() => window.__deepField.state()')

    before = settle_governor(4.0)
    # CONTROL FIRST: the same wait with nothing planted must not move the count.
    control = settle_governor(4.0)
    page.evaluate(PLANT, 45)
    loaded = settle_governor(9.0)
    page.evaluate(UNPLANT)
    recovered = settle_governor(12.0)
    report['adaptive'] = {
        'floor': before['starFloor'], 'budget': before['starBudget'],
        'before': {'stars': before['stars'], 'frameMs': before['frameIntervalMs']},
        'control': {'stars': control['stars'], 'frameMs': control['frameIntervalMs'],
                    'moved': control['stars'] != before['stars']},
        'underPlantedLoad': {'plantedMs': 45, 'stars': loaded['stars'],
                             'frameMs': loaded['frameIntervalMs']},
        'afterLoadRemoved': {'stars': recovered['stars'],
                             'frameMs': recovered['frameIntervalMs']},
        'fell': loaded['stars'] < control['stars'],
        'climbedBack': recovered['stars'] > loaded['stars'],
        'controlHeld': control['stars'] == before['stars'],
    }

    # ------------------------------------------------- 4. touch, not the wheel
    # WHOSE handler it is matters as much as whether there is one. Every script
    # the page parsed is collected first, so each listener can be traced back to
    # the bundle that registered it: the question is whether the CINEMA takes
    # the wheel or the touch, not whether the site's smooth-scroll library does.
    sources = {}
    cdp.on('Debugger.scriptParsed', lambda e: sources.update({e['scriptId']: e.get('url', '')}))
    cdp.send('Debugger.enable')
    page.reload(wait_until='networkidle')
    page.wait_for_timeout(4000)

    listeners = {}
    for label, expr in (('window', 'window'), ('document', 'document'),
                        ('runway', 'document.querySelector("[data-signal-runway]")'),
                        ('frame', 'document.querySelector("[data-signal-frame]")')):
        obj = cdp.send('Runtime.evaluate', {'expression': expr})['result']
        if 'objectId' not in obj:
            listeners[label] = []
            continue
        got = cdp.send('DOMDebugger.getEventListeners', {'objectId': obj['objectId']})
        listeners[label] = sorted({
            f"{l['type']}{'' if l.get('passive') else ' (non-passive)'}"
            f"  <- {sources.get(l.get('scriptId'), 'unknown').rsplit('/', 1)[-1]}"
            for l in got.get('listeners', [])})
    cdp.send('Debugger.disable')

    page.evaluate(SEEK, 0.2)
    page.evaluate(SETTLE)
    start_y = page.evaluate('() => scrollY')
    # A real swipe, dispatched as touch through the protocol: no wheel event is
    # produced by this, so a page that only listens for wheel cannot move.
    cdp.send('Input.dispatchTouchEvent', {
        'type': 'touchStart', 'touchPoints': [{'x': 195, 'y': 640}]})
    for y in (560, 470, 380, 300, 240):
        cdp.send('Input.dispatchTouchEvent', {
            'type': 'touchMove', 'touchPoints': [{'x': 195, 'y': y}]})
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    page.wait_for_timeout(900)
    moved = page.evaluate('() => scrollY') - start_y
    cinema_handlers = [t for label in ('runway', 'frame') for t in listeners[label]]
    report['touch'] = {
        'listeners': listeners,
        # What the CINEMA registers on its own runway and sticky frame: nothing.
        # Native scroll is the only source of progress, which is the direction's
        # first rule, and it is also what makes a thumb work.
        'cinemaScrollHandlers': cinema_handlers,
        'wheelHandlers': [t for ls in listeners.values() for t in ls if t.startswith('wheel')],
        'touchMoveHandlers': [t for ls in listeners.values() for t in ls if t.startswith('touchmove')],
        'swipeMovedPx': round(moved),
        # A touch swipe produces no wheel event at all, so a page that only
        # answered the wheel could not move under this.
        'nativeScroll': moved > 40 and not cinema_handlers,
    }

    # ---------------------------------- 5. overflow and the size of a target
    report['layout'] = page.evaluate('''() => {
      const live = document.querySelector('[data-chapter][data-active=true]');
      const nodes = [...(live ? live.querySelectorAll('a[href], button') : []),
                     ...document.querySelectorAll('[data-signal-seek] a, [data-signal-seek] button')];
      return {
        overflowPx: document.documentElement.scrollWidth - innerWidth,
        controls: nodes.length,
        small: nodes.map(n => {
          const r = n.getBoundingClientRect();
          return {text: (n.textContent || '').trim().slice(0, 24),
                  w: Math.round(r.width), h: Math.round(r.height)};
        }).filter(r => r.h < 44),
      };
    }''')
    report['pageErrors'] = errors[:5]
    ctx.close()
    browser.close()

Path(args.out).parent.mkdir(parents=True, exist_ok=True)
Path(args.out).write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps({k: report[k] for k in
                  ('viewport', 'deviceScaleFactor', 'cpuThrottleRate', 'pixelRatio',
                   'verdict', 'adaptive', 'touch', 'layout', 'pageErrors')
                  if k in report}, indent=1))
print(f'written {args.out}')
