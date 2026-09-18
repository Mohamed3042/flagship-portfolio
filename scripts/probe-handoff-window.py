"""Is there a moment where both sides of the portal handoff can be compared?

The corner-marker diagnostic returned no usable comparison: at every blend it
sampled, the 3D wall's markers ran off the edge of the frame. Rather than widen
a budget or drop the clip rule to get numbers out, this asks the prior question
directly -- how big is the 3D surface on screen, how big is the HTML plate, and
is there any blend where the surface is both fully visible AND still drawn?

For each blend it reports:
  surface opacity      1 - blend, and the mesh stops drawing at 0.995
  markers resolved     of four, at that opacity
  markers unclipped    of those, fully inside the frame
  span ratio           HTML marker separation / geometry marker separation,
                       measured between the same two markers, so it is a pure
                       scale comparison that survives clipping of the others
  plate rect           what the renderer placed
"""
import io
import json
import sys

import numpy as np
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
ORIGIN = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4618'
MARKERS = {'tl': (230, 30, 30), 'tr': (30, 220, 60),
           'br': (50, 90, 245), 'bl': (245, 210, 30)}
CORNERS = ['tl', 'tr', 'br', 'bl']
PLATE = "document.querySelector('[data-chapter][data-active=\"true\"] [data-plate]')"
SCROLL = """(u) => {
  const root = document.querySelector('[data-signal]');
  const runway = root.querySelector('[data-signal-runway]');
  const frame = root.querySelector('[data-signal-frame]');
  const top = runway.getBoundingClientRect().top + scrollY;
  const range = Math.max(1, runway.offsetHeight - frame.offsetHeight);
  window.scrollTo({top: top + range * u, behavior: 'instant'});
}"""
STATE = """() => {
  const p = %s;
  if (!p) return null;
  const r = p.getBoundingClientRect();
  return {blend: parseFloat(getComputedStyle(p).getPropertyValue('--plate-blend')) || 0,
          fit: p.dataset.fit, src: p.currentSrc,
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height)};
}""" % PLATE


def marker_image(w, h):
    img = Image.new('RGB', (w, h), (26, 28, 32))
    d = ImageDraw.Draw(img)
    r = max(10, int(min(w, h) * 0.11))
    ins = max(8, int(min(w, h) * 0.07))
    for key, (cx, cy) in {'tl': (ins, ins), 'tr': (w - ins, ins),
                          'br': (w - ins, h - ins), 'bl': (ins, h - ins)}.items():
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=MARKERS[key])
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    return buf.getvalue()


def centroids(shot, dpr):
    arr = np.asarray(Image.open(io.BytesIO(shot)).convert('RGB')).astype(np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    lit = (r + g + b) > 55
    masks = {
        'bl': lit & (r > b * 1.9) & (g > b * 1.9) & (np.abs(r - g) < 0.45 * np.maximum(r, g)),
        'tl': lit & (r > g * 1.7) & (r > b * 1.7),
        'tr': lit & (g > r * 1.7) & (g > b * 1.7),
        'br': lit & (b > r * 1.6) & (b > g * 1.5),
    }
    taken = masks['bl']
    out = {}
    for key in CORNERS:
        m = masks[key] if key == 'bl' else (masks[key] & ~taken)
        if int(m.sum()) < 12:
            out[key] = None
            continue
        ys, xs = np.nonzero(m)
        clipped = bool(m[:2, :].any() or m[-2:, :].any() or m[:, :2].any() or m[:, -2:].any())
        out[key] = (float(xs.mean()) / dpr, float(ys.mean()) / dpr, clipped)
    return out


def span(c, a, b):
    """Distance between two markers, or None if either is missing or cut."""
    p, q = c.get(a), c.get(b)
    if not p or not q or p[2] or q[2]:
        return None
    return ((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2) ** 0.5


def run():
    rows = []
    with sync_playwright() as play:
        browser = play.chromium.launch(executable_path=CHROME, headless=True)
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900},
                                  device_scale_factor=1)
        page = ctx.new_page()
        page.goto(f'{ORIGIN}/en', wait_until='networkidle')
        page.evaluate(SCROLL, 0.78)
        page.wait_for_timeout(900)
        info = page.evaluate(STATE)
        pattern = marker_image(1280, 800)
        ctx.close()

        ctx = browser.new_context(viewport={'width': 1440, 'height': 900},
                                  device_scale_factor=1)
        page = ctx.new_page()
        page.route(info['src'], lambda route: route.fulfill(
            status=200, content_type='image/png', body=pattern))
        page.goto(f'{ORIGIN}/en', wait_until='networkidle')
        page.add_style_tag(content='[data-plate]{box-shadow:none!important;'
                                   'filter:none!important;border-color:transparent!important}')
        for i in range(29):
            u = 0.66 + (0.94 - 0.66) * i / 28
            page.evaluate(SCROLL, u)
            page.wait_for_timeout(300)
            st = page.evaluate(STATE)
            if not st:
                continue
            page.evaluate(f"() => {PLATE}?.style.setProperty('opacity','0','important')")
            page.wait_for_timeout(170)
            geom = centroids(page.screenshot(), 1)
            page.evaluate(f"() => {PLATE}?.style.setProperty('opacity','1','important')")
            page.wait_for_timeout(170)
            html = centroids(page.screenshot(), 1)
            page.evaluate(f"() => {PLATE}?.style.removeProperty('opacity')")

            resolved = sum(1 for k in CORNERS if geom.get(k))
            unclipped = sum(1 for k in CORNERS if geom.get(k) and not geom[k][2])
            ratios = []
            for a, b in (('tl', 'tr'), ('tl', 'bl'), ('tr', 'br'), ('bl', 'br')):
                gs, hs = span(geom, a, b), span(html, a, b)
                if gs and hs and gs > 8:
                    ratios.append(hs / gs)
            ratio = round(sum(ratios) / len(ratios), 4) if ratios else None
            rows.append({'u': round(u, 4), 'blend': round(st['blend'], 3),
                         'surface_opacity': round(1 - st['blend'], 3),
                         'drawn': st['blend'] < 0.995,
                         'geom_resolved': resolved, 'geom_unclipped': unclipped,
                         'span_ratio_html_over_geom': ratio, 'fit': st['fit'],
                         'plate': [st['x'], st['y'], st['w'], st['h']]})
            print(f"u={u:.3f} blend={st['blend']:.3f} surf_op={1 - st['blend']:.3f} "
                  f"resolved={resolved}/4 unclipped={unclipped}/4 "
                  f"span_ratio={ratio} fit={st['fit']} plate={st['w']}x{st['h']}")
        ctx.close()
        browser.close()

    usable = [r for r in rows if r['geom_unclipped'] >= 2 and r['drawn']
              and r['surface_opacity'] > 0.05]
    print(f'\nsamples: {len(rows)}   with >=2 unclipped geometry corners while the '
          f'surface is still drawn: {len(usable)}')
    if usable:
        worst = max(usable, key=lambda r: abs((r['span_ratio_html_over_geom'] or 1) - 1))
        print(f"  span ratio range: "
              f"{min(r['span_ratio_html_over_geom'] for r in usable if r['span_ratio_html_over_geom']):.4f}"
              f" .. {max(r['span_ratio_html_over_geom'] for r in usable if r['span_ratio_html_over_geom']):.4f}")
        print(f"  furthest from 1.0: u={worst['u']} ratio={worst['span_ratio_html_over_geom']}")
    with open('handoff-window.json', 'w', encoding='utf-8') as fh:
        json.dump(rows, fh, indent=1)


if __name__ == '__main__':
    run()
