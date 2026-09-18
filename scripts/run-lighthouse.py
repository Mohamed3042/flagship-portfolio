"""Lighthouse on the DEEP FIELD landing, three runs a preset, median reported.

One Lighthouse run is not a number. Total Blocking Time on a machine that is
also running a browser, a dev server and an editor moves by a factor of two
between runs, and the performance score moves with it: the same build measured
95 and 91 ten minutes apart. Three runs and the median is the smallest honest
answer, and the spread is reported beside it so nobody reads the median as a
precision it does not have.

SEO is measured twice, and this is not padding. A Netlify DRAFT deploy answers
with `X-Robots-Tag: noindex`, which fails `is-crawlable` and takes SEO to 69 —
a property of the preview, not of the page. The same build is therefore also
run against the local static server, which sends no such header, and both
numbers go in the report.

    node scripts/serve-static.mjs dist 4618
    python scripts/run-lighthouse.py --url <draft>/en/
"""
import argparse
import json
import statistics
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[1]

parser = argparse.ArgumentParser()
parser.add_argument('--url', required=True, help='the draft URL, including the route')
parser.add_argument('--local', default='http://127.0.0.1:4618/en',
                    help='the same build with no preview headers on it')
parser.add_argument('--out', default=str(ROOT / 'docs' / 'deep-field' / 'r04'))
parser.add_argument('--runs', type=int, default=3)
args = parser.parse_args()
OUT = Path(args.out)
OUT.mkdir(parents=True, exist_ok=True)

CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']


def run(url, preset, path):
    # One string, not a list: npx goes through cmd.exe on Windows, and a list
    # with `--chrome-flags=--headless=new --no-sandbox` in it loses the quoting
    # around the space and Lighthouse exits 1 on an unknown argument.
    cmd = (f'npx --yes lighthouse "{url}" --quiet '
           f'--chrome-flags="--headless=new --no-sandbox" '
           f'--output=json --output-path="{path}" '
           f"--only-categories={','.join(CATEGORIES)}")
    if preset == 'desktop':
        cmd += ' --preset=desktop'
    # A NON-ZERO EXIT IS NOT ALWAYS A FAILED MEASUREMENT. chrome-launcher
    # deletes its temporary profile after the run, and on Windows that is a
    # directory another process may still have a handle on: the run completes,
    # the report is written, and the CLI then exits 1 on
    # `EPERM ... rmSync(lighthouse.XXXXXXXX)`. Throwing that run away threw
    # away a measurement that had already been taken. What decides is whether a
    # parseable report landed; the exit code is recorded beside it.
    Path(path).unlink(missing_ok=True)
    data = None
    problem = None
    for attempt in range(3):
        done = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        try:
            data = json.loads(Path(path).read_text(encoding='utf-8'))
            problem = None if done.returncode == 0 else (
                'report written, CLI exited '
                f"{done.returncode} in cleanup: "
                f"{(done.stderr or done.stdout or '').strip().splitlines()[0][:90]}")
            break
        except (OSError, json.JSONDecodeError):
            problem = (done.returncode, (done.stderr or done.stdout or '')[-300:])
            print(f'  retrying {preset} ({attempt + 1}/3): no report, exit {done.returncode}')
    if data is None:
        raise RuntimeError(f'lighthouse produced no report three times: {problem}')
    audits = data['audits']
    return {
        'scores': {k: round(v['score'] * 100) for k, v in data['categories'].items()},
        'fcpMs': round(audits['first-contentful-paint']['numericValue']),
        'lcpMs': round(audits['largest-contentful-paint']['numericValue']),
        'tbtMs': round(audits['total-blocking-time']['numericValue']),
        'cls': audits['cumulative-layout-shift']['numericValue'],
        'failingBinaryAudits': sorted(
            k for k, v in audits.items()
            if v.get('score') is not None and v['score'] < 1
            and v.get('scoreDisplayMode') == 'binary'),
        'lighthouseVersion': data['lighthouseVersion'],
        'url': data['finalDisplayedUrl'],
        'cliNote': problem,
    }


report = {'url': args.url, 'local': args.local, 'runs': args.runs}
for preset in ('desktop', 'mobile'):
    runs = [run(args.url, preset, str(OUT / f'lighthouse-{preset}-{i + 1}.json'))
            for i in range(args.runs)]
    median = {c: statistics.median(r['scores'][c] for r in runs) for c in
              runs[0]['scores']}
    report[preset] = {
        'median': {k: int(v) for k, v in median.items()},
        'spread': {c: [min(r['scores'][c] for r in runs), max(r['scores'][c] for r in runs)]
                   for c in runs[0]['scores']},
        'medianFcpMs': int(statistics.median(r['fcpMs'] for r in runs)),
        'medianLcpMs': int(statistics.median(r['lcpMs'] for r in runs)),
        'medianTbtMs': int(statistics.median(r['tbtMs'] for r in runs)),
        'cls': max(r['cls'] for r in runs),
        'failingBinaryAudits': runs[0]['failingBinaryAudits'],
        'runs': runs,
    }
    print(f"{preset}: " + ' | '.join(f'{k} {int(v)}' for k, v in median.items())
          + f"  (spread {report[preset]['spread']})")

# The same build with no preview header on it, so `is-crawlable` can pass.
local = run(args.local, 'desktop', str(OUT / 'lighthouse-local-desktop.json'))
report['localNoPreviewHeader'] = local
print('local (no X-Robots-Tag): ' + ' | '.join(f'{k} {v}' for k, v in local['scores'].items()))
print('   failing:', local['failingBinaryAudits'])

(OUT / 'lighthouse.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(f"written {OUT / 'lighthouse.json'}")
