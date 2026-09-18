"""Accessibility sheets for the DEEP FIELD landing.

  a11y-focus.jpg        four cells: keyboard focus on a portal's link, on a
                        figure beat's link, on a tools caption and on the seek
                        nav. Each cell is cropped to the control, at 2x, so the
                        ring is judged at the size a ring is judged at, and each
                        carries the outline the page actually computed.
  reduced-motion-en.jpg three beats as posters, with prefers-reduced-motion on.
  reduced-motion-ar.jpg the same on the Arabic route.

Focus is taken by the KEYBOARD, not by el.focus(): :focus-visible is the
browser's own judgement about whether a ring is warranted, and a scripted focus
does not always earn one. The script tabs until the control it wants is the
active element, and says how many presses that took.

    node scripts/serve-static.mjs dist 4618
    python scripts/capture-deep-field-a11y.py
"""
import argparse
import io
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--out', default=str(ROOT / 'docs' / 'deep-field' / 'r04'))
parser.add_argument('--max-kb', type=int, default=600)
args = parser.parse_args()
OUT = Path(args.out)
OUT.mkdir(parents=True, exist_ok=True)

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
  await new Promise(r => setTimeout(r, 280));
}'''
ACTIVE = '''() => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const box = el.firstElementChild && el.firstElementChild.offsetWidth
    ? el.firstElementChild : el;
  const r = box.getBoundingClientRect();
  const cs = getComputedStyle(box);
  return {tag: el.tagName, text: (el.textContent || '').trim().slice(0, 40),
          rect: {x: r.left, y: r.top, w: r.width, h: r.height},
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          offset: cs.outlineOffset};
}'''

# Which control each cell wants, and where on the flight to find it.
CELLS = [
    {'name': 'a portal link', 'chapter': 'world-strings',
     'selector': '[data-chapter="world-strings"] .signal__action'},
    {'name': 'a figure beat link', 'chapter': 'game-war-strikes',
     'selector': '[data-chapter="game-war-strikes"] .signal__action'},
    # The star caption the brief asks for, taken on the PUBLIC constellation:
    # a tool's chip carries no href — none of those repositories are public —
    # so it is not a control and cannot take keyboard focus. The repositories'
    # captions are the same component with a link on it.
    {'name': 'a star caption (public work)', 'chapter': 'public',
     'selector': '[data-chapter="public"] .signal__label[href]'},
    {'name': 'the seek nav', 'chapter': 'tools',
     'selector': '[data-signal-seek] [data-seek=next]'},
]
POSTERS = ['world-academy', 'game-artillery3d', 'tools']


def font(size):
    for name in ('segoeui.ttf', 'arial.ttf'):
        try:
            return ImageFont.truetype(f'C:/Windows/Fonts/{name}', size)
        except OSError:
            continue
    return ImageFont.load_default()


def save(image, path, max_kb):
    for quality in (90, 84, 78, 72, 66, 60, 54, 48):
        buf = io.BytesIO()
        image.save(buf, 'JPEG', quality=quality, optimize=True, progressive=True)
        if buf.tell() <= max_kb * 1024:
            path.write_bytes(buf.getvalue())
            return quality, buf.tell()
    path.write_bytes(buf.getvalue())
    return quality, buf.tell()


def sheet(cells, columns, title, cell_width):
    scale = cell_width / cells[0][0].width
    cw, ch = cell_width, round(cells[0][0].height * scale)
    label, gap, pad, head = 46, 12, 18, 46
    rows = (len(cells) + columns - 1) // columns
    canvas = Image.new('RGB', (pad * 2 + columns * cw + (columns - 1) * gap,
                               head + pad + rows * (ch + label + gap)), (8, 9, 12))
    draw = ImageDraw.Draw(canvas)
    draw.text((pad, 14), title, font=font(18), fill=(230, 236, 244))
    face = font(13)
    for i, (shot, text) in enumerate(cells):
        x = pad + (i % columns) * (cw + gap)
        y = head + pad + (i // columns) * (ch + label + gap)
        canvas.paste(shot.resize((cw, ch), Image.LANCZOS), (x, y))
        draw.rectangle([x, y, x + cw - 1, y + ch - 1], outline=(46, 52, 62))
        for j, line in enumerate(text.split('\n')[:3]):
            draw.text((x + 2, y + ch + 6 + j * 14), line, font=face, fill=(178, 188, 200))
    return canvas


report = {'baseUrl': args.base_url}

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=CHROME, headless=False)

    # ------------------------------------------------------------ the rings
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=2)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(3000)
    chapters = {c['id']: c for c in page.evaluate('() => window.__deepField.chapters')}

    cells, states = [], []
    for cell in CELLS:
        page.evaluate(SEEK, chapters[cell['chapter']]['hold'])
        page.evaluate(SETTLE)
        # Tab from the TOP of the document until the wanted control is active.
        # blur() alone is not enough: the sequential focus navigation starting
        # point stays where the last element was, so the next Tab continues
        # from the middle of the archive and the wanted control is never
        # reached. A throwaway anchor at the head of the body moves the
        # starting point to the top for real.
        page.evaluate('''() => {
          document.getElementById('tab-origin')?.remove();
          const origin = document.createElement('span');
          origin.id = 'tab-origin';
          origin.tabIndex = -1;
          document.body.prepend(origin);
          // preventScroll, and it is load-bearing. A plain focus() scrolls the
          // element into view — which for an element at the head of the body
          // means the top of the document — and the renderer then chases that
          // scroll through nineteen chapters, handing focus to each arriving
          // chapter's line as the one behind it goes inert. The walk was
          // reading the renderer's own focus handoff and calling it a tab
          // order.
          origin.focus({preventScroll: true});
        }''')
        got, presses = None, 0
        for presses in range(1, 61):
            page.keyboard.press('Tab')
            matched = page.evaluate('(sel) => document.activeElement.matches(sel)', cell['selector'])
            if matched:
                got = page.evaluate(ACTIVE)
                break
        page.evaluate("() => document.getElementById('tab-origin')?.remove()")
        if not got:
            states.append({**cell, 'reached': False})
            continue
        page.evaluate(SETTLE)
        shot = Image.open(io.BytesIO(page.screenshot()))
        # device_scale_factor 2: the screenshot is twice the CSS box.
        r = got['rect']
        pad = 34
        crop = (max(0, int((r['x'] - pad) * 2)), max(0, int((r['y'] - pad) * 2)),
                min(shot.width, int((r['x'] + r['w'] + pad) * 2)),
                min(shot.height, int((r['y'] + r['h'] + pad) * 2)))
        detail = shot.crop(crop)
        # Every cell the same box, so four rings are compared and not four crops.
        canvas = Image.new('RGB', (560, 240), (0, 0, 0))
        detail.thumbnail((560, 240), Image.LANCZOS)
        canvas.paste(detail, ((560 - detail.width) // 2, (240 - detail.height) // 2))
        cells.append((canvas,
                      f"{cell['name']}  ·  {got['text'][:34]}\n"
                      f"reached on Tab #{presses}  ·  outline {got['outline']}\n"
                      f"offset {got['offset']}  ·  box {round(r['w'])}x{round(r['h'])}"))
        states.append({**cell, 'reached': True, 'tabPresses': presses, **got})

    out = OUT / 'a11y-focus.jpg'
    quality, size = save(sheet(cells, 2, 'DEEP FIELD — keyboard focus, 1440x900 EN at DPR 2, each cell '
                                         'cropped to the control. Tab count and computed outline per cell.', 560),
                         out, args.max_kb)
    report['focus'] = {'file': out.name, 'bytes': size, 'jpegQuality': quality, 'cells': states}
    ctx.close()

    # -------------------------------------------------- the reduced-motion poster
    for lang in ('en', 'ar'):
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1,
                                  reduced_motion='reduce')
        page = ctx.new_page()
        page.goto(f'{args.base_url}/{lang}', wait_until='networkidle')
        page.wait_for_timeout(3200)
        graphics = page.evaluate('() => document.querySelector("[data-signal]").dataset.graphics')
        chapters = {c['id']: c for c in page.evaluate('() => window.__deepField.chapters')}
        cells, states = [], []
        for cid in POSTERS:
            page.evaluate(SEEK, chapters[cid]['hold'])
            page.evaluate(SETTLE)
            a = page.evaluate('() => window.__deepField.state()')
            page.wait_for_timeout(900)
            b = page.evaluate('() => window.__deepField.state()')
            shot = Image.open(io.BytesIO(page.screenshot()))
            still = a['appliedDolly'] == b['appliedDolly']
            cells.append((shot, f"{cid.replace('world-', '')}  ·  morph {a['morph']:.2f}  ·  "
                                f"{a['stars']} stars\nheld still over 900 ms: {still}"))
            states.append({'chapter': cid, 'morph': a['morph'], 'held': still,
                           'graphics': graphics})
        out = OUT / f'reduced-motion-{lang}.jpg'
        quality, size = save(
            sheet(cells, 3, f'DEEP FIELD — prefers-reduced-motion: reduce, 1440x900, '
                            f'{lang.upper()}. Three beats, each a poster at its held pose. '
                            f'graphics={graphics}', 470),
            out, args.max_kb)
        report[f'reduced-{lang}'] = {'file': out.name, 'bytes': size, 'jpegQuality': quality,
                                     'graphics': graphics, 'cells': states}
        ctx.close()
    browser.close()

(OUT / 'a11y.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
for key, meta in report.items():
    if isinstance(meta, dict) and 'file' in meta:
        print(f"{meta['file']}: {meta['bytes'] / 1024:.0f} KB at quality {meta['jpegQuality']}")
print(f'written {OUT}')
