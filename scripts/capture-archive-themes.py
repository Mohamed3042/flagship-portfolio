"""The archive top under each of the site's six themes, one row per theme.

Also reads, from the rendered page, the seam (the last pixel row of the cinema
against the first of the archive) and the contrast of every ink slot the
archive uses — because "it looks black" is not a measurement and the light
theme is the one that paints literal values.
"""
import io
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
BASE = 'http://127.0.0.1:4618'
THEMES = ['dark', 'light', 'neon', 'cinema', 'storybook', 'wave']
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
OUT.mkdir(parents=True, exist_ok=True)

# Every ink slot the archive actually paints, read where it is painted.
SLOTS = {
    'section heading': '#work h2',
    'section lede': '#work .sr-section-head p',
    'card title': '#work .sr-projects h3',
    'card body': '#work .sr-projects p',
    'text link': '#work .sr-text-link',
    'status chip': '#work .sr-status',
    'method summary': '#method summary',
    'contact line': '.sr-contact .cf-l1',
    'contact lead': '.sr-contact .cf-lead',
    'contact card': '.sr-contact .cf-card',
}

# The one contrast reader, shared with the suite.
from signal_probes import CONTRAST


def font(size):
    for name in ('segoeui.ttf', 'arial.ttf'):
        try:
            return ImageFont.truetype(f'C:/Windows/Fonts/{name}', size)
        except OSError:
            continue
    return ImageFont.load_default()


rows, report = [], {}
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=CHROME, headless=True)
    for theme in THEMES:
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
        page = ctx.new_page()
        page.goto(f'{BASE}/en', wait_until='networkidle')
        page.evaluate('(t) => { if (t === "dark") document.documentElement.removeAttribute("data-theme");'
                      ' else document.documentElement.setAttribute("data-theme", t);'
                      ' try { localStorage.setItem("theme", t); } catch {} }', theme)
        page.wait_for_timeout(700)
        # Sit at the seam: the archive's own top, with the last of the cinema
        # still in frame above it.
        page.evaluate('''() => {
          const work = document.querySelector('#work');
          scrollTo({top: work.getBoundingClientRect().top + scrollY - 200, behavior: 'instant'});
        }''')
        page.wait_for_timeout(900)
        shot = Image.open(io.BytesIO(page.screenshot()))
        rows.append((shot, theme))
        report[theme] = {
            'contrast': {label: page.evaluate(CONTRAST, [sel])[sel]
                         for label, sel in SLOTS.items()},
            'bodyBackground': page.evaluate('() => getComputedStyle(document.body).backgroundColor'),
            'archiveBackground': page.evaluate(
                '() => getComputedStyle(document.querySelector(".sr-container")).backgroundColor'),
            'tokens': page.evaluate('''() => {
              const cs = getComputedStyle(document.querySelector('.showroom'));
              return Object.fromEntries(['--bg', '--ink', '--ink-2', '--ink-3', '--accent']
                .map(k => [k, cs.getPropertyValue(k).trim()]));
            }'''),
        }
        ctx.close()
    browser.close()

# One row per theme, each a full 1440x900 frame scaled to fit.
CW = 700
scale = CW / rows[0][0].width
CH = round(rows[0][0].height * scale)
pad, gap, label, head = 18, 10, 28, 46
canvas = Image.new('RGB', (pad * 2 + CW * 2 + gap, head + pad + 3 * (CH + label + gap)), (8, 9, 12))
draw = ImageDraw.Draw(canvas)
draw.text((pad, 14), 'DEEP FIELD — the archive at the seam, one cell per site theme, 1440x900, EN. '
                     'The cinema ends on #000 in all six.', font=font(18), fill=(230, 236, 244))
for i, (shot, theme) in enumerate(rows):
    x = pad + (i % 2) * (CW + gap)
    y = head + pad + (i // 2) * (CH + label + gap)
    canvas.paste(shot.resize((CW, CH), Image.LANCZOS), (x, y))
    draw.rectangle([x, y, x + CW - 1, y + CH - 1], outline=(46, 52, 62))
    worst = round(min((v['ratio'] for v in report[theme]['contrast'].values() if v), default=0), 2)
    draw.text((x + 2, y + CH + 7),
              f"theme: {theme}  ·  archive ground {report[theme]['tokens']['--bg']}"
              f"  ·  worst ink contrast {worst}:1", font=font(14), fill=(178, 188, 200))

for q in (88, 82, 76, 70, 64, 58, 52, 46):
    buf = io.BytesIO()
    canvas.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
    if buf.tell() <= 600 * 1024:
        break
(OUT / 'themes-archive.jpg').write_bytes(buf.getvalue())
(OUT / 'themes-archive.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(f"themes-archive.jpg {buf.tell() / 1024:.0f} KB at quality {q}")
for theme in THEMES:
    bad = {k: v['ratio'] for k, v in report[theme]['contrast'].items() if v and v['ratio'] < 4.5}
    missing = [k for k, v in report[theme]['contrast'].items() if v is None]
    print(f"{theme:<10} bg {report[theme]['tokens']['--bg']:<10} "
          f"worst {min((v['ratio'] for v in report[theme]['contrast'].values() if v), default=0):.2f}:1"
          f"  under 4.5: {bad or 'none'}{'  missing: ' + str(missing) if missing else ''}")
