"""A real-time recording of the DEEP FIELD landing route, driven by real input.

Nothing here is stepped. The page is scrolled with mouse-wheel events, the
browser renders at whatever rate it manages, and Chrome's own screencast hands
back the frames it presented, each stamped with the time it was presented.
ffmpeg then encodes those frames at their real intervals, so the recording runs
at the speed the session ran at - including any pause where the browser did not
produce a frame.

The same timestamps give an honest cadence report: observed frames per second,
the longest gap between presented frames, how many intervals exceeded 100 ms,
and - the part that matters - whether each long gap fell inside a voluntary
stop, where a browser presents nothing because nothing changed, or during
active input, where it would be a real stall.

What this is NOT: a GPU frame-time profile, a physical device, or Safari. It is
headless Chromium on one Windows machine, and the numbers should be read as the
cadence CDP observed there, not as a field performance measurement.

    node scripts/serve-static.mjs dist 4618
    python scripts/record-signal-realtime.py
"""
from pathlib import Path
import argparse
import base64
import json
import shutil
import statistics
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--out', default=str(ROOT / 'docs' / 'deep-field' / 'r02'))
parser.add_argument('--lang', default='en')
args = parser.parse_args()

OUT = Path(args.out)
OUT.mkdir(parents=True, exist_ok=True)

# One uninterrupted forward pass, driven by wheel events at a fixed cadence.
SCRIPT = []  # Filled from the measured runway below; one continuous forward pass.

# One recording, at the size the owner reviews the film at. The phone gets its
# own pass on a real device in Round 3; an emulated portrait recording here
# would look like evidence about a phone and be nothing of the kind.
VIEWS = [
    {'key': 'desktop', 'w': 1440, 'h': 900},
]

report = {'base_url': args.base_url, 'lang': args.lang, 'views': {}}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, headless=True)

    for view in VIEWS:
        ctx = browser.new_context(
            viewport={'width': view['w'], 'height': view['h']},
            device_scale_factor=1,
            is_mobile=view['w'] < 700,
            has_touch=view['w'] < 700,
        )
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(f"{args.base_url}/{args.lang}", wait_until='networkidle')
        page.wait_for_timeout(2800)

        frames = []  # (presented_seconds, jpeg_bytes)
        client = ctx.new_cdp_session(page)

        def on_frame(params, _client=client, _frames=frames):
            meta = params.get('metadata') or {}
            _frames.append((meta.get('timestamp') or time.time(), base64.b64decode(params['data'])))
            try:
                _client.send('Page.screencastFrameAck', {'sessionId': params['sessionId']})
            except Exception:
                pass

        client.on('Page.screencastFrame', on_frame)
        client.send('Page.startScreencast', {
            'format': 'jpeg', 'quality': 78, 'everyNthFrame': 1,
            'maxWidth': view['w'], 'maxHeight': view['h'],
        })

        started = time.time()
        page.mouse.move(view['w'] // 2, view['h'] // 2)
        # Every step is stamped, so a gap in the presented frames can be matched
        # to what the hand was actually doing. "The holds explain the gaps" is a
        # claim, and a claim needs the timestamps that support it.
        steps = []
        distance=page.evaluate('()=>{const r=document.querySelector("[data-signal-runway]"),f=document.querySelector("[data-signal-frame]");return r.offsetHeight-f.offsetHeight+innerHeight}')
        SCRIPT=[('hold',0,0,1.0),('scroll',80,int(distance/80)+2,1.0)]
        visited=set()
        for kind, delta, ticks, pause in SCRIPT:
            t0 = time.time() - started
            if kind == 'scroll':
                for _ in range(ticks):
                    page.mouse.wheel(0, delta)
                    page.wait_for_timeout(75)
                    visited.add(page.evaluate('window.__deepField.state().chapter'))   # a hand, not a teleport
            t1 = time.time() - started
            page.wait_for_timeout(int(pause * 1000))
            steps.append({'kind': kind, 'moveFrom': round(t0, 3), 'moveTo': round(t1, 3),
                          'holdTo': round(time.time() - started, 3)})
        wall = time.time() - started

        client.send('Page.stopScreencast')
        page.wait_for_timeout(400)
        ctx.close()

        if not frames:
            report['views'][view['key']] = {'error': 'no screencast frames were delivered'}
            continue

        base = frames[0][0]
        times = [max(0.0, t - base) for t, _ in frames]
        gaps = [b - a for a, b in zip(times, times[1:]) if b > a]

        work = (OUT / f"rt-frames-{view['key']}").resolve()
        if not work.is_relative_to(OUT.resolve()) or work == OUT.resolve():
            raise RuntimeError(f'Capture scratch escaped its output directory: {work}')
        if work.exists():
            shutil.rmtree(work, ignore_errors=True)
        work.mkdir(parents=True)
        listing = []
        for i, (_, data) in enumerate(frames):
            name = f'f{i:05d}.jpg'
            (work / name).write_bytes(data)
            listing.append(name)

        # Concat demuxer with the real inter-frame durations: the encode inherits
        # the session's own timing rather than imposing a frame rate on it.
        concat = work / 'frames.txt'
        with concat.open('w', encoding='utf-8') as fh:
            for i, name in enumerate(listing):
                fh.write(f"file '{name}'\n")
                if i < len(listing) - 1:
                    fh.write(f"duration {max(0.008, times[i + 1] - times[i]):.4f}\n")
            fh.write(f"file '{listing[-1]}'\n")

        mp4 = OUT / 'real-input-720.mp4'
        subprocess.run(
            ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0',
             '-i', str(concat), '-fps_mode', 'vfr', '-video_track_timescale', '1000',
             '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '25',
             '-vf', 'scale=-2:720',
             '-movflags', '+faststart', str(mp4)],
            check=True)
        shutil.rmtree(work, ignore_errors=True)

        # Where each long gap fell: inside a scripted hold (the page was not being
        # scrolled and a browser presents nothing when nothing changes) or during
        # input (which would be a real stall).
        long_gaps = []
        for i, gap in enumerate(gaps):
            if gap <= 0.1:
                continue
            at = times[i]
            during = 'hold'
            for step in steps:
                if step['moveFrom'] <= at <= step['moveTo'] and step['kind'] == 'scroll':
                    during = 'input'
                    break
            long_gaps.append({'atSeconds': round(at, 2), 'gapMs': round(gap * 1000, 1), 'during': during})

        report['views'][view['key']] = {
            'file': mp4.name,
            'chapters_observed':sorted(visited),
            'all_chapters_observed':len(visited)==46,
            'bytes': mp4.stat().st_size,
            'viewport': f"{view['w']}x{view['h']}",
            'wallClockSeconds': round(wall, 2),
            'presentedFrames': len(frames),
            'observedFps': round(len(frames) / wall, 2) if wall > 0 else None,
            'medianFrameGapMs': round(statistics.median(gaps) * 1000, 2) if gaps else None,
            'p95FrameGapMs': round(sorted(gaps)[int(len(gaps) * 0.95)] * 1000, 2) if gaps else None,
            'longestFrameGapMs': round(max(gaps) * 1000, 2) if gaps else None,
            'gapsOver100ms': sum(1 for g in gaps if g > 0.1),
            'longGaps': long_gaps,
            'longGapsDuringHold': sum(1 for g in long_gaps if g['during'] == 'hold'),
            'longGapsDuringInput': sum(1 for g in long_gaps if g['during'] == 'input'),
            'pageErrors': errors[:5],
            'method': 'CDP Page.startScreencast; real wheel input; encoded at the presented timestamps',
            'notMeasured': 'GPU frame time, input latency, physical touch scrolling, Safari, any real device',
        }
        print(view['key'], json.dumps(report['views'][view['key']], indent=1))

    browser.close()

(OUT / 'realtime-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
bad = [k for k, v in report['views'].items() if 'error' in v or v.get('pageErrors')]
sys.exit(1 if bad else 0)
