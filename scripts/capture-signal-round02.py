"""Director Round 02 evidence capture for "From Signal to Systems".

Produces the eight poses the director asked for, in matched desktop and portrait
editions, in English and Arabic, plus a reduced-motion still and a normal-paced
forward/reverse recording through the real project rows.

Ambient time is frozen for every still, so two runs of the same pose differ only
where the composition actually differs. The freeze is injected by this harness
into the page context; it changes no product code. Mid-transition frames are
therefore comparable, not explained away as "breath".

    node scripts/serve-static.mjs dist 4618
    python scripts/capture-signal-round02.py --tag after

Stills land in docs/signal-review/round02/<tag>/, the recording beside them.
"""
from pathlib import Path
import argparse
import json
import shutil
import subprocess
import sys

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--tag', default='after', help='before | after')
parser.add_argument('--out', default=None)
parser.add_argument('--skip-video', action='store_true')
args = parser.parse_args()

OUT = Path(args.out) if args.out else ROOT / 'docs' / 'signal-review' / 'round02' / args.tag
OUT.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------- time freeze
#
# The renderer accumulates ambient time from the rAF timestamp. Handing it the
# same timestamp every frame drives dt to zero, so the scene is fully settled at
# whatever progress the harness put it at. Scroll still works: progress is read
# from scrollY, not from the clock.
FREEZE = '''
(() => {
  const raf = window.requestAnimationFrame.bind(window);
  window.__signalFrozenAt = null;
  window.requestAnimationFrame = (cb) => raf((t) => cb(window.__signalFrozenAt ?? t));
  window.__signalFreeze = (on) => {
    window.__signalFrozenAt = on ? 100000 : null;
    return window.__signalFrozenAt;
  };
})();
'''

# The scene state the page already exposes. Reading it observes; it drives nothing.
PROBE = '''() => {
  const root = document.querySelector('[data-signal]');
  if (!root) return null;
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  const top = runway.getBoundingClientRect().top + scrollY;
  const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
  const live = root.querySelector('[data-chapter][data-active="true"]');
  const plate = live && live.querySelector('[data-plate]');
  const r = plate && plate.getBoundingClientRect();
  return {
    u: Math.min(1, Math.max(0, (scrollY - top) / range)),
    scrollY: Math.round(scrollY),
    chapter: root.dataset.signalChapter || '',
    graphics: root.dataset.graphics || '',
    tier: root.dataset.tier || '',
    active: [...root.querySelectorAll('[data-chapter]')]
      .filter(p => p.dataset.active === 'true').map(p => p.dataset.chapter),
    plate: r ? {handoff: plate.dataset.handoff || '', x: Math.round(r.x), y: Math.round(r.y),
                w: Math.round(r.width), h: Math.round(r.height)} : null,
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

SEEK_SELECTOR = '''(sel) => {
  const el = document.querySelector(sel);
  if (!el) return false;
  window.scrollTo({top: el.getBoundingClientRect().top + scrollY - 72, behavior: 'instant'});
  return true;
}'''

# ------------------------------------------------------------------- the poses
#
# The director's eight, in narrative order. `u` addresses the cinematic segment;
# `sel` addresses real document content after the segment releases.
POSES = [
    {'key': '1-entry',             'mode': 'top'},
    {'key': '2-aligned-form',      'mode': 'u', 'u': 0.150},
    {'key': '3-separated-depth',   'mode': 'u', 'u': 0.214},
    {'key': '4-automation-screen', 'mode': 'u', 'u': 0.355},
    {'key': '5-carton',            'mode': 'u', 'u': 0.474},
    {'key': '6-media-alignment',   'mode': 'u', 'u': 0.655},
    {'key': '7-portal-threshold',  'mode': 'u', 'u': 0.790},
    {'key': '8-project-rows',      'mode': 'sel', 'sel': '#work'},
    # Beyond the director's eight: the seam below the cinema, where the route's
    # own colour tokens were resolving to nothing.
    {'key': '9-atlas',             'mode': 'sel', 'sel': '#sky'},
    {'key': '10-close',            'mode': 'sel', 'sel': '#contact'},
]

EDITIONS = [
    {'key': 'desktop-en', 'lang': 'en', 'w': 1440, 'h': 900},
    {'key': 'portrait-en', 'lang': 'en', 'w': 390, 'h': 844},
    {'key': 'desktop-ar', 'lang': 'ar', 'w': 1440, 'h': 900},
    {'key': 'portrait-ar', 'lang': 'ar', 'w': 390, 'h': 844},
]

# ------------------------------------------------------------ the recording
#
# A normal-paced pass: travel at a readable rate, dwell where a reader would
# stop, then the same in reverse. Not a six-second diagnostic sweep.
WALK = '''async ({stops, pxPerSecond, dwell}) => {
  const ease = (t) => t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const glide = (to) => new Promise(resolve => {
    const from = scrollY, span = to - from;
    if (Math.abs(span) < 2) return resolve();
    const ms = Math.max(240, Math.abs(span) / pxPerSecond * 1000);
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      window.scrollTo({top: from + span * ease(k), behavior: 'instant'});
      if (k < 1) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });
  for (const stop of stops) {
    await glide(stop);
    await sleep(dwell);
  }
}'''


FPS = 12


def build_walk(stops, px_per_second, dwell, fps):
    """Scroll position for every frame of a normal-paced pass, forward and back.

    Travel is eased so a stop is approached and left the way a reader leaves one,
    and each stop is held long enough to read what is on it.
    """
    path, current = [], stops[0]
    path.extend([current] * max(1, int(dwell * fps)))
    for target in stops[1:]:
        span = abs(target - current)
        seconds = max(0.35, span / px_per_second)
        steps = max(1, int(seconds * fps))
        for i in range(1, steps + 1):
            k = i / steps
            eased = 2 * k * k if k < 0.5 else 1 - ((-2 * k + 2) ** 2) / 2
            path.append(round(current + (target - current) * eased))
        path.extend([target] * max(1, int(dwell * fps)))
        current = target
    return path


def freeze(page, on=True):
    page.evaluate('(on) => window.__signalFreeze(on)', on)
    page.wait_for_timeout(120)


def settle(page, ms=520):
    """Let the render loop draw the new progress, then stop the clock again."""
    page.wait_for_timeout(ms)


report = {'tag': args.tag, 'base_url': args.base_url, 'editions': {}, 'video': {}}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, headless=True)

    # ------------------------------------------------------------- the stills
    for ed in EDITIONS:
        ctx = browser.new_context(
            viewport={'width': ed['w'], 'height': ed['h']},
            device_scale_factor=1,
            is_mobile=ed['w'] < 700,
            has_touch=ed['w'] < 700,
        )
        ctx.add_init_script(FREEZE)
        page = ctx.new_page()
        page.set_default_timeout(12000)
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))

        page.goto(f"{args.base_url}/{ed['lang']}", wait_until='networkidle')
        page.wait_for_timeout(1500)
        freeze(page, True)

        states = {}
        for pose in POSES:
            freeze(page, False)
            if pose['mode'] == 'top':
                page.evaluate('window.scrollTo({top: 0, behavior: "instant"})')
            elif pose['mode'] == 'u':
                page.evaluate(SEEK, pose['u'])
            else:
                found = page.evaluate(SEEK_SELECTOR, pose['sel'])
                if not found:
                    states[pose['key']] = {'error': f"selector {pose['sel']} not found"}
                    continue
            settle(page)
            freeze(page, True)
            settle(page, 260)
            states[pose['key']] = page.evaluate(PROBE)
            page.screenshot(path=str(OUT / f"{ed['key']}-{pose['key']}.png"))

        states['_errors'] = errors[:5]
        report['editions'][ed['key']] = states
        ctx.close()

    # ------------------------------------------------------- reduced motion
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce')
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(900)
    report['reduced'] = page.evaluate('''() => {
      const root = document.querySelector('[data-signal]');
      const panels = [...root.querySelectorAll('[data-chapter]')];
      return {graphics: root.dataset.graphics || '',
              visible: panels.filter(p => p.getBoundingClientRect().height > 40).length,
              inert: panels.filter(p => p.hasAttribute('inert')).length};
    }''')
    page.screenshot(path=str(OUT / 'reduced-motion-en.png'))
    page.evaluate(SEEK_SELECTOR, '#work')
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / 'reduced-motion-en-work.png'))
    ctx.close()

    # ------------------------------------------------------------ the video
    #
    # Frame-stepped rather than screen-recorded. The harness advances one virtual
    # clock for BOTH the scroll position and the renderer's ambient time, then
    # takes the frame, so the encoded result is the pace it claims to be at the
    # frame rate it is encoded at -- on any machine, headless or not, fast or
    # slow. A real-time recording of a headless browser is a recording of how
    # fast that machine happened to be.
    if not args.skip_video:
        for vid in [{'key': 'desktop', 'w': 1440, 'h': 900, 'pps': 620, 'dwell': 1.7},
                    {'key': 'portrait', 'w': 390, 'h': 844, 'pps': 520, 'dwell': 1.6}]:
            ctx = browser.new_context(
                viewport={'width': vid['w'], 'height': vid['h']},
                device_scale_factor=1,
                is_mobile=vid['w'] < 700, has_touch=vid['w'] < 700,
            )
            ctx.add_init_script(FREEZE)
            page = ctx.new_page()
            page.goto(f'{args.base_url}/en', wait_until='networkidle')
            page.wait_for_timeout(1800)

            stops = page.evaluate("""() => {
              const root = document.querySelector('[data-signal]');
              const runway = root.querySelector('[data-signal-runway]');
              const frame = root.querySelector('[data-signal-frame]');
              const top = runway.getBoundingClientRect().top + scrollY;
              const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
              const at = (u) => Math.round(top + range * u);
              const work = document.querySelector('#work');
              return {
                forward: [0, at(.15), at(.214), at(.355), at(.474), at(.655), at(.79), at(1),
                          Math.round(work.getBoundingClientRect().top + scrollY - 72)],
                back: [at(1), at(.79), at(.655), at(.474), at(.355), at(.214), at(.15), 0],
              };
            }""")

            path = build_walk(stops['forward'] + stops['back'], vid['pps'], vid['dwell'], FPS)
            frames = OUT / f"frames-{vid['key']}"
            frames.mkdir(parents=True, exist_ok=True)
            step_ms = 1000.0 / FPS
            for i, y in enumerate(path):
                page.evaluate(
                    '({y, t}) => { window.__signalFrozenAt = t;'
                    ' window.scrollTo({top: y, behavior: "instant"}); }',
                    {'y': y, 't': 100000 + i * step_ms})
                page.wait_for_timeout(42)
                page.screenshot(path=str(frames / f'f{i:05d}.jpg'), type='jpeg', quality=82)
            ctx.close()

            mp4 = OUT / f"signal-round02-{vid['key']}.mp4"
            subprocess.run(
                ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS),
                 '-i', str(frames / 'f%05d.jpg'),
                 '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '25',
                 '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
                 '-movflags', '+faststart', str(mp4)],
                check=True)
            shutil.rmtree(frames, ignore_errors=True)
            report['video'][vid['key']] = {
                'file': mp4.name, 'bytes': mp4.stat().st_size,
                'frames': len(path), 'fps': FPS,
                'seconds': round(len(path) / FPS, 1),
                'method': 'frame-stepped, one virtual clock for scroll and ambient time',
            }

    browser.close()

(OUT / 'capture-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')

problems = []
for name, states in report['editions'].items():
    for key, state in states.items():
        if key == '_errors':
            if state:
                problems.append(f'{name}: page errors {state}')
            continue
        if not state or 'error' in state:
            problems.append(f'{name}/{key}: {state}')

print(f"captured {len(POSES)} poses x {len(EDITIONS)} editions -> {OUT}")
for name, states in report['editions'].items():
    live = [f"{k}={v.get('chapter', '?')}" for k, v in states.items() if k != '_errors' and v]
    print(f'  {name}: ' + ' '.join(live))
for problem in problems:
    print('PROBLEM', problem)
sys.exit(1 if problems else 0)
