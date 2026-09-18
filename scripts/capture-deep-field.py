"""Evidence captures for the DEEP FIELD landing route.

Six images, and every one of them says where it came from:

  contact-desktop-en.jpg   ten poses at 1440x900, four columns
  contact-phone-en.jpg     the same ten at 390x844
  contact-phone-ar.jpg     the Arabic route at 390x844
  morph-strip.jpg          six frames through ONE constellation, 25% to 100%
  field-strip.jpg          five frames across a 400px scroll step, no figure on
                           screen, so the streaming depth reads as motion
  figures-desktop-en.jpg   every chapter at its held pose, on one sheet

Each cell is labelled with the progress it was taken at and the p95 interval
between frames at that pose, in MILLISECONDS. Not a frame rate: the control in
`scripts/measure-deep-field.py` shows this harness's loop is not locked to the
display, so an interval is an upper bound on how long a frame took and not a
rate anything presented. 55 fps is 18.2 ms a frame; 30 fps is 33.3 ms.

Reading a frame: seek, then requestAnimationFrame twice and 260 ms, then settle
the two clock-driven terms so the capture is the pure evaluation of the scroll
position rather than whatever the drift happened to be doing. The language is in
every filename — a capture script that names files by view alone overwrites one
language with the other on its second pass, which cost this project a round.

    node scripts/serve-static.mjs dist 4618
    python scripts/capture-deep-field.py
"""
from pathlib import Path
import argparse
import io
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--out', default=str(ROOT / 'docs' / 'deep-field' / 'r02'))
parser.add_argument('--max-kb', type=int, default=600)
# Re-cutting one sheet should not mean re-shooting all six: each of them takes a
# browser and a couple of minutes, and most rounds only move one.
parser.add_argument('--only', default='', help='comma-separated: desktop, phone, arabic, morph, field, figures')
args = parser.parse_args()

OUT = Path(args.out)
OUT.mkdir(parents=True, exist_ok=True)

# The ten the brief asks for, plus two the grid had room for anyway. A four
# column sheet of ten leaves two empty cells, and a packet where a whole act is
# invisible is a weaker packet: 0.68 is the Film beat, which every one of the ten
# required poses steps over, and the last cell is the reduced-motion composition.
POSES = [0.0, 0.05, 0.12, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1.0]
EXTRA_POSE = 0.87
# The constellation the strip follows: the carton, which is also the one figure
# with a second pose — the strip shows it arriving, and the figures sheet shows
# it half open.
STRIP_CHAPTER = 'world-medmac-box-studio'
STRIP_MORPHS = [0.25, 0.4, 0.55, 0.7, 0.85, 1.0]
# The field strip: five frames, 400 CSS px of scroll apart, at a beat where the
# stars carry the frame alone.
FIELD_STEP_PX = 400
FIELD_FRAMES = 5

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
  await new Promise(r => setTimeout(r, 260));
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
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
  return {medianMs: gaps[Math.floor(gaps.length * 0.5)],
          p95Ms: gaps[Math.floor(gaps.length * 0.95)]};
}'''


def font(size):
    for name in ('segoeui.ttf', 'arial.ttf', 'consola.ttf'):
        try:
            return ImageFont.truetype(f'C:/Windows/Fonts/{name}', size)
        except OSError:
            continue
    return ImageFont.load_default()


def save(image, path, max_kb):
    """JPEG, stepped down in quality until it fits the packet's size limit."""
    for quality in (88, 82, 76, 70, 64, 58, 52):
        buf = io.BytesIO()
        image.save(buf, 'JPEG', quality=quality, optimize=True, progressive=True)
        if buf.tell() <= max_kb * 1024:
            path.write_bytes(buf.getvalue())
            return quality, buf.tell()
    path.write_bytes(buf.getvalue())
    return quality, buf.tell()


def sheet(cells, columns, title, cell_width):
    """Lay captures out in a grid, each under its own label."""
    scale = cell_width / cells[0][0].width
    cw, ch = cell_width, round(cells[0][0].height * scale)
    label, gap, pad, head = 30, 12, 18, 46
    rows = (len(cells) + columns - 1) // columns
    width = pad * 2 + columns * cw + (columns - 1) * gap
    height = head + pad + rows * (ch + label + gap)
    canvas = Image.new('RGB', (width, height), (8, 9, 12))
    draw = ImageDraw.Draw(canvas)
    # A title that runs off the sheet is a title nobody can read the end of.
    face = font(19)
    while draw.textlength(title, font=face) > width - pad * 2 and len(title) > 24:
        title = title[:-2] + '…'
    draw.text((pad, 14), title, font=face, fill=(230, 236, 244))
    size = 15 if cw >= 400 else 12
    face = font(size)
    for i, (shot, text) in enumerate(cells):
        x = pad + (i % columns) * (cw + gap)
        y = head + pad + (i // columns) * (ch + label + gap)
        canvas.paste(shot.resize((cw, ch), Image.LANCZOS), (x, y))
        draw.rectangle([x, y, x + cw - 1, y + ch - 1], outline=(46, 52, 62))
        # A label that runs past its own cell collides with the next one, which
        # is how a contact sheet stops being readable at phone widths.
        while draw.textlength(text, font=face) > cw - 4 and len(text) > 8:
            text = text[:-2] + '…'
        draw.text((x + 2, y + ch + 7), text, font=face, fill=(178, 188, 200))
    return canvas


report = {'baseUrl': args.base_url, 'sheets': {}}


def capture(pw, name, lang, width, height, poses, columns, cell_width, title):
    browser = pw.chromium.launch(executable_path=CHROME, headless=False)
    ctx = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=1,
                              is_mobile=width < 700, has_touch=width < 700)
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(f'{args.base_url}/{lang}', wait_until='networkidle')
    page.wait_for_timeout(3000)

    cells, states = [], []
    for u in poses + [EXTRA_POSE]:
        page.evaluate(SEEK, u)
        page.evaluate(SETTLE)
        shot = Image.open(io.BytesIO(page.screenshot()))
        state = page.evaluate('() => window.__deepField.state()')
        page.evaluate('() => window.__deepField.resume()')
        fps = page.evaluate(CADENCE, 1.2)
        page.evaluate(SETTLE)
        # Milliseconds, not a frame rate: this harness's loop is not established
        # to be vsync-locked, so its interval is an upper bound on how long a
        # frame took and not a rate the display presented. See budgets.json.
        rate = f"{fps['p95Ms']:.1f} ms/frame p95" if fps else 'no samples'
        extra = '  (extra)' if u == EXTRA_POSE else ''
        cells.append((shot, f"u {u:.2f} · {state['chapter'].replace('world-', '')} · {rate}{extra}"))
        states.append({'u': u, **state, 'frameIntervalP95Ms': round(fps['p95Ms'], 2) if fps else None})

    # The twelfth cell: the same page with the visitor's reduced-motion
    # preference on. It is a different composition, not a switched-off one.
    still_ctx = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=1,
                                    is_mobile=width < 700, has_touch=width < 700, reduced_motion='reduce')
    still_page = still_ctx.new_page()
    still_page.goto(f'{args.base_url}/{lang}', wait_until='networkidle')
    still_page.wait_for_timeout(2800)
    still_page.evaluate(SETTLE)
    cells.append((Image.open(io.BytesIO(still_page.screenshot())), 'reduced motion  ·  held  (extra)'))
    still_ctx.close()

    out = OUT / f'{name}.jpg'
    quality, size = save(sheet(cells, columns, title, cell_width), out, args.max_kb)
    report['sheets'][name] = {'file': out.name, 'bytes': size, 'jpegQuality': quality,
                              'viewport': f'{width}x{height}', 'lang': lang,
                              'poses': states, 'pageErrors': errors[:5]}
    ctx.close()
    browser.close()


def strip(pw):
    """Six frames through one constellation, found from the SHIPPED easing."""
    browser = pw.chromium.launch(executable_path=CHROME, headless=False)
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(3000)

    chapter = page.evaluate('(id) => window.__deepField.chapters.find(c => c.id === id)', STRIP_CHAPTER)
    cells, states = [], []
    for target in STRIP_MORPHS:
        # Bisect on the page's own evaluator: no second copy of the easing here.
        lo, hi = chapter['from'], chapter['from'] + (chapter['to'] - chapter['from']) * 0.7
        for _ in range(40):
            mid = (lo + hi) / 2
            if page.evaluate('(u) => window.__deepField.at(u).morph', mid) < target:
                lo = mid
            else:
                hi = mid
        u = (lo + hi) / 2
        page.evaluate(SEEK, u)
        page.evaluate(SETTLE)
        state = page.evaluate('() => window.__deepField.at(' + repr(u) + ')')
        shot = Image.open(io.BytesIO(page.screenshot()))
        cells.append((shot, f"assembled {state['morph'] * 100:.0f}%  ·  u {u:.4f}"))
        states.append({'target': target, 'u': round(u, 5), 'morph': round(state['morph'], 4)})

    out = OUT / 'morph-strip.jpg'
    quality, size = save(
        sheet(cells, 3, f'DEEP FIELD — one constellation forming: {STRIP_CHAPTER}, 1440x900, EN', 470),
        out, args.max_kb)
    report['sheets']['morph-strip'] = {'file': out.name, 'bytes': size, 'jpegQuality': quality,
                                       'chapter': STRIP_CHAPTER, 'frames': states}
    ctx.close()
    browser.close()


def field_strip(pw):
    """Five frames across 400 px of scroll, with no figure on screen.

    The point is the DEPTH: near stars sweep outward and accelerate, far stars
    barely move. A contact sheet at a tenth of a page apart cannot show that,
    because everything has changed by then. Four hundred pixels is one flick of
    a wheel, which is the distance at which parallax is the only thing moving.

    WHERE is found, not assumed. The first attempt put the strip at the opening
    of the Film chapter and walked 400 px per frame; by the second frame the
    stars had parted for the reel, which is a different illusion entirely. The
    window is now located by asking the page's own evaluator where nothing is
    assembling, and the strip is laid across that.
    """
    browser = pw.chromium.launch(executable_path=CHROME, headless=False)
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(3000)

    span = page.evaluate("""() => {
      const root = document.querySelector('[data-signal]');
      const runway = root.querySelector('[data-signal-runway]');
      const frame = root.querySelector('[data-signal-frame]');
      return Math.max(1, runway.offsetHeight - frame.offsetHeight);
    }""")
    # The longest stretch of the page where the field is on its own: no morph,
    # no parting, no breath. Sampled off the shipped evaluator.
    window = page.evaluate("""(span) => {
      const step = 20 / span;                       // twenty pixels at a time
      let best = null, run = null;
      for (let u = 0; u <= 1; u += step) {
        const s = window.__deepField.at(u);
        const quiet = s.morph < 0.002 && s.part < 0.002 && s.breath < 0.002;
        if (quiet) run = run ? {from: run.from, to: u} : {from: u, to: u};
        else { if (run && (!best || run.to - run.from > best.to - best.from)) best = run; run = null; }
      }
      if (run && (!best || run.to - run.from > best.to - best.from)) best = run;
      return best;
    }""", span)
    widest = (window['to'] - window['from']) * span
    total = min(FIELD_STEP_PX, widest * 0.94)
    start = window['from'] + (widest - total) / 2 / span

    cells, states = [], []
    for i in range(FIELD_FRAMES):
        offset = total * i / (FIELD_FRAMES - 1)
        u = start + offset / span
        page.evaluate(SEEK, u)
        page.evaluate(SETTLE)
        state = page.evaluate('() => window.__deepField.state()')
        cells.append((Image.open(io.BytesIO(page.screenshot())),
                      f"+{offset:.0f} px  ·  dolly {state['dolly']:.1f}  ·  {state['visible']} stars in frame"))
        states.append({'u': round(u, 5), 'offsetPx': round(offset), 'dolly': state['dolly'],
                       'visible': state['visible'], 'morph': state['morph'], 'part': state['part'],
                       'chapter': state['chapter']})

    # A second row: the same five frames, cropped to one region at 2.25x. At
    # strip size the whole frame is a field of dots and the eye cannot tell
    # which of them moved; the crop is where the claim is actually legible.
    # Upper right: the one region of the frame that no chapter's copy block ever
    # occupies, in either direction.
    CROP = (700, 80, 1340, 480)
    detail = [(shot.crop(CROP), f'detail 2.25x  ·  {label.split(chr(183))[0].strip()}')
              for shot, label in cells]

    out = OUT / 'field-strip.jpg'
    quality, size = save(
        sheet(cells + detail, 5, f'DEEP FIELD — {total:.0f} px of scroll across five frames, field only, '
                                 '1440x900, EN. Top: the frame. Bottom: one region at 2.25x, same frames.', 400),
        out, args.max_kb)
    report['sheets']['field-strip'] = {'file': out.name, 'bytes': size, 'jpegQuality': quality,
                                       'spanPx': round(total), 'quietWindowPx': round(widest),
                                       'frames': states}
    ctx.close()
    browser.close()


def figures_sheet(pw):
    """Every chapter at its held pose, on one sheet, so the set is judged at once."""
    browser = pw.chromium.launch(executable_path=CHROME, headless=False)
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(3000)

    chapters = page.evaluate('() => window.__deepField.chapters')
    cells, states = [], []
    for c in chapters:
        u = c['from'] + (c['to'] - c['from']) * 0.61
        page.evaluate(SEEK, u)
        page.evaluate(SETTLE)
        state = page.evaluate('() => window.__deepField.state()')
        box = page.evaluate('() => window.__deepField.figureBox()')
        cells.append((Image.open(io.BytesIO(page.screenshot())),
                      f"{c['id'].replace('world-', '')}  ·  "
                      + (f"{box['points']} stars · {box['links']} lines · {box['heightShare'] * 100:.0f}% h"
                         if box else 'field only')))
        states.append({'chapter': c['id'], 'u': round(u, 5), 'morph': state['morph'],
                       'fold': state['fold'], 'part': state['part'], 'side': state['side'],
                       'points': box['points'] if box else 0,
                       'links': box['links'] if box else 0,
                       'heightShare': box['heightShare'] if box else None})

    out = OUT / 'figures-desktop-en.jpg'
    quality, size = save(
        sheet(cells, 4, 'DEEP FIELD — every chapter at its held pose, 1440x900, EN. '
                        'Star count, hairlines and figure height per cell.', 470),
        out, args.max_kb)
    report['sheets']['figures'] = {'file': out.name, 'bytes': size, 'jpegQuality': quality,
                                   'cells': states}
    ctx.close()
    browser.close()


wanted = {w.strip() for w in args.only.split(',') if w.strip()}
run = lambda key: not wanted or key in wanted

with sync_playwright() as pw:
    if run('desktop'):
        capture(pw, 'contact-desktop-en', 'en', 1440, 900, POSES, 4, 470,
                'DEEP FIELD — desktop 1440x900, EN. p95 frame interval at each pose; 55 fps is 18.2 ms.')
    if run('phone'):
        capture(pw, 'contact-phone-en', 'en', 390, 844, POSES, 4, 235,
                'DEEP FIELD — phone emulation 390x844, EN. p95 frame interval; 30 fps is 33.3 ms. Desktop GPU, not a phone.')
    if run('arabic'):
        capture(pw, 'contact-phone-ar', 'ar', 390, 844, POSES, 4, 235,
                'DEEP FIELD — phone emulation 390x844, AR (RTL). p95 frame interval. Desktop GPU, not a phone.')
    if run('morph'):
        strip(pw)
    if run('field'):
        field_strip(pw)
    if run('figures'):
        figures_sheet(pw)

# A partial run must not erase what the other sheets recorded.
existing = OUT / 'captures.json'
if existing.exists() and wanted:
    try:
        previous = json.loads(existing.read_text(encoding='utf-8'))
        merged = previous.get('sheets', {})
        merged.update(report['sheets'])
        report['sheets'] = merged
    except Exception:
        pass
existing.write_text(json.dumps(report, indent=2), encoding='utf-8')
for name, meta in report['sheets'].items():
    print(f"{name}: {meta['bytes'] / 1024:.0f} KB at quality {meta['jpegQuality']}")
print(f"written {OUT}")
