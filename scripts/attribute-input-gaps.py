"""What is actually happening during the frame gaps that fall on real input.

Round 04 reported three gaps on desktop and three on portrait that landed during
active wheel input, and named main-thread texture decode as the likely cause.
That was a hypothesis with nothing behind it, and the contact sheet for the
portrait segment showed ordinary project and archive content where the portal
textures were supposed to be decoding. So this attributes instead of guessing.

FOUR THINGS THE EARLIER CLASSIFIER GOT WRONG

1. Two clocks, one comparison. Frame times were normalised to the first
   screencast frame; input steps were stamped against a separate `started`.
   Nothing measured the offset between those origins, and the offset is on the
   same order as the gaps being classified. Here everything -- frames, input,
   and in-page marks -- is converted to epoch seconds, and the conversion is
   asserted rather than assumed.

2. Filtering shifted the index. `gaps` was built by `zip(times, times[1:])` with
   a `if b > a` filter, and then read back as `times[i]`. One dropped pair and
   every later gap is attributed to the wrong moment. Pairs are kept whole here,
   and non-monotonic ones are reported, not silently removed.

3. A gap is an interval, not an instant. Classification used only the gap's
   start, so a gap beginning in a hold and ending under the wheel counted as a
   hold. Overlap with both now reads `mixed`.

4. Nothing observed the main thread. `longtask` and `resource` entries, and a
   sampled record of chapter and progress, now come from the page itself, so a
   gap can be matched to what was running rather than to what would be a
   satisfying explanation.

No product code is instrumented: everything here is injected by the harness.
"""
import base64
import json
import statistics
import sys
import time

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
ORIGIN = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4618'
LONG_GAP = 0.1   # seconds; the threshold Round 04 used, kept so numbers compare

SCRIPT = [
    ('hold', 0, 0, 2.2), ('scroll', 140, 26, 1.6), ('scroll', 140, 16, 2.4),
    ('scroll', -140, 10, 1.8), ('scroll', 140, 22, 2.6), ('hold', 0, 0, 2.0),
    ('scroll', 140, 24, 2.4), ('scroll', 140, 12, 2.2), ('scroll', -140, 14, 1.6),
    ('scroll', 140, 26, 2.0), ('scroll', 140, 22, 2.6), ('hold', 0, 0, 1.8),
    ('scroll', 140, 26, 1.8), ('scroll', 140, 18, 2.6), ('scroll', -140, 30, 1.4),
    ('scroll', 140, 18, 1.6),
]

# Bounded on purpose: an unbounded observer in a 60-second recording becomes a
# second source of main-thread work and starts measuring itself.
PROBE = """
window.__probe = {longtasks: [], resources: [], states: [], origin: performance.timeOrigin};
try {
  new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
      if (window.__probe.longtasks.length < 800) {
        window.__probe.longtasks.push({start: e.startTime, dur: e.duration,
          attribution: (e.attribution || []).map(a => a.name).join(',')});
      }
    }
  }).observe({entryTypes: ['longtask']});
} catch (e) { window.__probe.longtaskError = String(e); }
try {
  new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
      if (window.__probe.resources.length < 1200 &&
          /\\.(webp|jpg|jpeg|png|avif)(\\?|$)/i.test(e.name)) {
        window.__probe.resources.push({name: e.name.split('/').slice(-1)[0],
          start: e.startTime, end: e.responseEnd, size: e.encodedBodySize});
      }
    }
  }).observe({entryTypes: ['resource'], buffered: true});
} catch (e) { window.__probe.resourceError = String(e); }
// Throttled to roughly one sample per displayed frame, and counted rather than
// capped silently. Headless Chrome runs rAF unvsynced -- it fired near 240Hz
// here -- so an unthrottled sampler ran out of its own budget a third of the
// way through the recording and reported "the page rendered nothing" for every
// gap after that. That was the sampler stopping, not the page.
window.__probe.dropped = 0;
window.__probe.lastSample = -1e9;
(function sample() {
  requestAnimationFrame(sample);
  const p = window.__probe;
  const now = performance.now();
  if (now - p.lastSample < 15) return;
  p.lastSample = now;
  if (p.states.length >= 20000) { p.dropped++; return; }
  const root = document.querySelector('[data-signal]');
  if (!root) return;
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  let u = null;
  if (runway && frame) {
    const top = runway.getBoundingClientRect().top + scrollY;
    const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
    u = Math.min(1, Math.max(0, (scrollY - top) / range));
  }
  const active = document.querySelector('[data-chapter][data-active="true"]');
  const plate = active && active.querySelector('[data-plate]');
  const max = document.documentElement.scrollHeight - innerHeight;
  p.states.push({t: now, u: u === null ? null : +u.toFixed(4),
    y: Math.round(scrollY), maxY: Math.round(max), atBottom: scrollY >= max - 2,
    chapter: active ? active.dataset.chapter : null,
    blend: plate ? +(parseFloat(getComputedStyle(plate).getPropertyValue('--plate-blend')) || 0).toFixed(3) : null,
    over: root.dataset.over || null});
})();
"""


def overlap(a0, a1, b0, b1):
    return min(a1, b1) - max(a0, b0) > 0


def nearest_state(states, when):
    if not states:
        return None
    return min(states, key=lambda s: abs(s['epoch'] - when))


def run():
    report = {'origin': ORIGIN, 'longGapThresholdMs': LONG_GAP * 1000, 'views': {}}
    with sync_playwright() as play:
        browser = play.chromium.launch(executable_path=CHROME, headless=True)
        for key, w, h in (('desktop', 1440, 900), ('portrait', 390, 844)):
            ctx = browser.new_context(viewport={'width': w, 'height': h},
                                      device_scale_factor=1)
            ctx.add_init_script(PROBE)
            page = ctx.new_page()
            page.goto(f'{ORIGIN}/en', wait_until='networkidle')
            page.wait_for_timeout(1800)

            frames = []   # (cdp_timestamp, local_receipt_epoch)
            client = ctx.new_cdp_session(page)

            def on_frame(params, _c=client, _f=frames):
                meta = params.get('metadata') or {}
                _f.append((meta.get('timestamp'), time.time(), len(params.get('data') or '')))
                try:
                    _c.send('Page.screencastFrameAck', {'sessionId': params['sessionId']})
                except Exception:
                    pass

            client.on('Page.screencastFrame', on_frame)
            client.send('Page.startScreencast', {'format': 'jpeg', 'quality': 78,
                                                 'everyNthFrame': 1,
                                                 'maxWidth': w, 'maxHeight': h})
            page.mouse.move(w // 2, h // 2)
            steps = []
            for kind, delta, ticks, pause in SCRIPT:
                t0 = time.time()
                if kind == 'scroll':
                    for _ in range(ticks):
                        page.mouse.wheel(0, delta)
                        page.wait_for_timeout(45)
                t1 = time.time()
                page.wait_for_timeout(int(pause * 1000))
                steps.append({'kind': kind, 'inputFrom': t0, 'inputTo': t1,
                              'holdTo': time.time()})
            client.send('Page.stopScreencast')
            page.wait_for_timeout(400)
            probe = page.evaluate('window.__probe')
            ctx.close()

            if len(frames) < 3:
                report['views'][key] = {'error': f'only {len(frames)} screencast frames'}
                continue

            # ---- one clock, and the claim that it is one clock is checked ----
            # Chrome reports screencast metadata.timestamp as seconds since the
            # epoch, the same scale as time.time(). If that ever stopped being
            # true the whole comparison would be meaningless, so it is asserted
            # against the local receipt time rather than trusted.
            stamped = [f for f in frames if isinstance(f[0], (int, float))]
            skew = [abs(f[1] - f[0]) for f in stamped]
            epoch_comparable = bool(stamped) and statistics.median(skew) < 2.0
            page_origin = (probe or {}).get('origin')

            def to_epoch(ms):
                return (page_origin + ms) / 1000.0

            states = [dict(s, epoch=to_epoch(s['t'])) for s in (probe or {}).get('states', [])]
            longtasks = [{'from': to_epoch(t['start']), 'to': to_epoch(t['start'] + t['dur']),
                          'ms': round(t['dur'], 1), 'attribution': t.get('attribution', '')}
                         for t in (probe or {}).get('longtasks', [])]
            resources = [{'name': r['name'], 'from': to_epoch(r['start']),
                          'to': to_epoch(r['end']),
                          'ms': round(r['end'] - r['start'], 1), 'bytes': r['size']}
                         for r in (probe or {}).get('resources', [])]

            times = [f[0] if isinstance(f[0], (int, float)) else f[1] for f in frames]
            # Pairs are kept whole. Index i is the pair (times[i], times[i+1]) and
            # stays that way; nothing is dropped out from under the indexing.
            pairs = list(zip(range(len(times) - 1), times, times[1:]))
            nonmonotonic = [i for i, a, b in pairs if b <= a]
            gaps = [b - a for _, a, b in pairs]

            first, last = times[0], times[-1]
            input_windows = [(s['inputFrom'], s['inputTo']) for s in steps if s['kind'] == 'scroll']
            hold_windows = []
            for s in steps:
                start = s['inputTo'] if s['kind'] == 'scroll' else s['inputFrom']
                if s['holdTo'] > start:
                    hold_windows.append((start, s['holdTo']))

            long_gaps = []
            for i, a, b in pairs:
                if (b - a) <= LONG_GAP or b <= a:
                    continue
                on_input = any(overlap(a, b, x, y) for x, y in input_windows)
                on_hold = any(overlap(a, b, x, y) for x, y in hold_windows)
                during = ('mixed' if on_input and on_hold
                          else 'input' if on_input
                          else 'hold' if on_hold
                          else 'outside')
                st = nearest_state(states, (a + b) / 2)
                # How much of this gap actually sits under the wheel, in ms.
                # A three-second gap that clips the edge of an input window is
                # not a three-second input stall, and a boolean cannot say so.
                on_input_ms = sum(max(0.0, min(b, y) - max(a, x))
                                  for x, y in input_windows) * 1000
                on_hold_ms = sum(max(0.0, min(b, y) - max(a, x))
                                 for x, y in hold_windows) * 1000
                # The decisive one. The page's own rAF timestamps are recorded
                # independently of the screencast, so if the page kept producing
                # frames across this window the gap belongs to the recording
                # pipeline and not to the page.
                inside = [t['epoch'] for t in states if a <= t['epoch'] <= b]
                raf_gap = max((y - x for x, y in zip(inside, inside[1:])), default=None)
                rendered = len(inside)
                tasks = [t for t in longtasks if overlap(a, b, t['from'], t['to'])]
                res = [r for r in resources if overlap(a, b, r['from'], r['to'])]
                long_gaps.append({
                    'frameIndex': i,
                    'rawPair': [round(a - first, 4), round(b - first, 4)],
                    'atSeconds': round(a - first, 2),
                    'gapMs': round((b - a) * 1000, 1),
                    'during': during,
                    'chapter': st['chapter'] if st else None,
                    'progress': st['u'] if st else None,
                    'scrollY': st['y'] if st else None,
                    'documentEnd': st['maxY'] if st else None,
                    'parkedAtDocumentEnd': st['atBottom'] if st else None,
                    'blend': st['blend'] if st else None,
                    'over': st['over'] if st else None,
                    'underInputMs': round(on_input_ms, 1),
                    'underHoldMs': round(on_hold_ms, 1),
                    'pageFramesDuringGap': rendered,
                    'worstPageFrameGapMs': round(raf_gap * 1000, 1) if raf_gap else None,
                    'mainThreadMs': round(sum(t['ms'] for t in tasks), 1),
                    'longTasks': tasks[:4],
                    'imageLoadsInFlight': [r['name'] for r in res][:6],
                })

            counts = {}
            for g in long_gaps:
                counts[g['during']] = counts.get(g['during'], 0) + 1
            # A wheel event at the bottom of the document is real input that
            # cannot move anything. Nothing changes, so nothing is presented, and
            # the gap says something about this script's scroll budget rather
            # than about the page's responsiveness.
            parked = [g for g in long_gaps
                      if g['during'] in ('input', 'mixed') and g['parkedAtDocumentEnd']]
            # A gap the page rendered straight through is a gap in the RECORDING,
            # not in the product. That distinction is the whole question.
            recorder = [g for g in long_gaps
                        if g['during'] in ('input', 'mixed') and g['pageFramesDuringGap'] > 2
                        and (g['worstPageFrameGapMs'] or 0) < 100]
            unexplained = [g for g in long_gaps
                           if g['during'] in ('input', 'mixed') and g['mainThreadMs'] < 1
                           and not g['parkedAtDocumentEnd'] and g not in recorder]
            explained = [g for g in long_gaps
                         if g['during'] in ('input', 'mixed') and g['mainThreadMs'] >= 1]

            report['views'][key] = {
                'frames': len(frames),
                'wallSeconds': round(last - first, 2),
                'observedFps': round(len(frames) / max(0.001, last - first), 2),
                'epochClockComparable': epoch_comparable,
                'medianFrameToReceiptSkewMs': round(statistics.median(skew) * 1000, 1) if skew else None,
                'nonMonotonicPairs': nonmonotonic,
                'medianFrameGapMs': round(statistics.median(gaps) * 1000, 2),
                'longestFrameGapMs': round(max(gaps) * 1000, 2),
                'gapsOverThreshold': len(long_gaps),
                'byWindow': counts,
                'stateSamples': len(states),
                'stateSamplesDropped': (probe or {}).get('dropped', 0),
                'longTasksObserved': len(longtasks),
                'longTaskTotalMs': round(sum(t['ms'] for t in longtasks), 1),
                'onInputWithMainThreadWork': len(explained),
                'onInputWhileParkedAtDocumentEnd': len(parked),
                'onInputButPageKeptRendering': len(recorder),
                'onInputUnexplained': len(unexplained),
                'longGaps': long_gaps,
            }
            v = report['views'][key]
            print(f"--- {key} ---")
            print(f"  {v['frames']} frames over {v['wallSeconds']}s "
                  f"({v['observedFps']} screencast fps), clocks comparable="
                  f"{v['epochClockComparable']} (skew {v['medianFrameToReceiptSkewMs']}ms)")
            print(f"  non-monotonic frame pairs: {len(nonmonotonic)}  "
                  f"(the old code silently dropped these and kept indexing past them)")
            print(f"  gaps over {int(LONG_GAP * 1000)}ms: {len(long_gaps)}  by window: {counts}")
            print(f"  long tasks observed: {len(longtasks)} totalling {v['longTaskTotalMs']}ms")
            print(f"  page-state samples: {v['stateSamples']} (dropped by cap: "
                  f"{v['stateSamplesDropped']})")
            print(f"  gaps on real input WITH main-thread work: {len(explained)}")
            print(f"  gaps on input while parked at the document end: {len(parked)}")
            print(f"  gaps on input where the PAGE kept rendering (recorder, not product): {len(recorder)}")
            print(f"  gaps on real input still unexplained: {len(unexplained)}")
            for g in long_gaps:
                if g['during'] in ('input', 'mixed'):
                    print(f"    {g['atSeconds']:6.2f}s {g['gapMs']:7.1f}ms {g['during']:6} "
                          f"chapter={g['chapter']} u={g['progress']} "
                          f"underInput={g['underInputMs']:.0f}ms "
                          f"pageFrames={g['pageFramesDuringGap']} "
                          f"worstPageGap={g['worstPageFrameGapMs']}ms "
                          f"mainThread={g['mainThreadMs']}ms")
        browser.close()

    with open('input-gap-attribution.json', 'w', encoding='utf-8') as fh:
        json.dump(report, fh, indent=1)
    print('\nwrote input-gap-attribution.json')


if __name__ == '__main__':
    run()
