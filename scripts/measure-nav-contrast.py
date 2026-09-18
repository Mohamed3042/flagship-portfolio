"""Nav contrast on the landing route, measured from rendered pixels.

Why this is a screenshot and not a computed-style walk: the header is
`background: color-mix(in srgb, var(--bg) 72%, transparent)` over a
`backdrop-filter: saturate(180%) blur(20px)`. Its effective background is
therefore whatever scrolls underneath, saturated and blurred. Nothing about
that is readable from the DOM.

My first attempt at this walked ancestors looking for a non-transparent
background colour, and where the whole chain up to <main> was transparent it
fell back to white -- inventing a near-white backdrop under a black header and
reporting five themes as failures at 3.59:1. The rendered bar at that exact
scroll position is rgb(7,15,31). The measurement was the defect.

So: the background comes from a screenshot of the bar with its own contents
hidden (real compositing, real backdrop-filter), and the foreground comes from
the computed `color`, which is opaque and therefore exact. Text pixels are
never sampled directly -- antialiasing would bias every reading.
"""
import io
import json
import sys

from PIL import Image
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
ORIGIN = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4618'
THEMES = ['dark', 'light', 'neon', 'cinema', 'storybook', 'wave']
CONTROLS = {
    'link': '.nav__links a',
    'brand': '.nav__brand',
    'pill': '.nav__tools .pill',
}
SAMPLES = 61
AA = 'Whether this text is large-scale by WCAG (>=18.66px bold or >=24px).'


def linear(c):
    c /= 255
    return c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = (linear(c) for c in rgb[:3])
    return .2126 * r + .7152 * g + .0722 * b


def contrast(a, b):
    x, y = luminance(a), luminance(b)
    return (max(x, y) + .05) / (min(x, y) + .05)


def composite(fg, bg):
    """Text colour over its background. Opaque text returns itself."""
    a = fg[3] if len(fg) > 3 else 1
    return tuple(fg[i] * a + bg[i] * (1 - a) for i in range(3))


def parse(css):
    m = [float(v) for v in __import__('re').findall(r'[\d.]+', css)]
    if css.startswith('color('):
        rgb = [m[0] * 255, m[1] * 255, m[2] * 255]
        return (*rgb, m[3] if len(m) > 3 else 1)
    return (m[0], m[1], m[2], m[3] if len(m) > 3 else 1)


RECTS = """() => {
  const out = {};
  for (const [k, sel] of Object.entries(%s)) {
    const el = document.querySelector('.nav ' + sel);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize);
    const bold = (parseInt(cs.fontWeight, 10) || 400) >= 700;
    out[k] = {
      x: r.x + r.width / 2, y: r.y + r.height / 2,
      color: cs.color, fontSize: px,
      // WCAG 1.4.3 large text: 24px, or 18.66px when bold.
      large: px >= 24 || (bold && px >= 18.66),
    };
  }
  return out;
}""" % json.dumps(CONTROLS)


def measure(page, height):
    """Worst contrast for each control at the current scroll position."""
    rects = page.evaluate(RECTS)
    # The bar keeps painting -- its own contents do not. That is the backdrop
    # the text actually sits on, blur and saturation included.
    page.add_style_tag(content='.nav *{visibility:hidden!important}')
    shot = Image.open(io.BytesIO(page.screenshot(
        clip={'x': 0, 'y': 0, 'width': 1440, 'height': height}))).convert('RGB')
    page.evaluate("""() => {
      const tags = [...document.querySelectorAll('style')];
      const last = tags.reverse().find(t => t.textContent.includes('.nav *{visibility:hidden'));
      last?.remove();
    }""")
    out = {}
    for key, r in rects.items():
        x, y = int(round(r['x'])), int(round(r['y']))
        if not (0 <= x < shot.width and 0 <= y < shot.height):
            continue
        # A small patch, so one stray pixel of a blurred edge cannot decide it.
        patch = [shot.getpixel((px, py))
                 for px in range(max(0, x - 6), min(shot.width, x + 7), 3)
                 for py in range(max(0, y - 4), min(shot.height, y + 5), 2)]
        fg = parse(r['color'])
        worst = min(patch, key=lambda bg: contrast(composite(fg, bg), bg))
        out[key] = {
            'ratio': round(contrast(composite(fg, worst), worst), 2),
            'fg': r['color'], 'bg': worst, 'large': r['large'],
            'floor': 3.0 if r['large'] else 4.5,
        }
    return out


def run():
    worst = {}
    with sync_playwright() as play:
        browser = play.chromium.launch(executable_path=CHROME, headless=True)
        for theme in THEMES:
            ctx = browser.new_context(viewport={'width': 1440, 'height': 900},
                                      device_scale_factor=1)
            ctx.add_init_script(f"localStorage.setItem('mm-theme','{theme}')")
            page = ctx.new_page()
            page.goto(f'{ORIGIN}/en', wait_until='networkidle')
            # Instant scrolling and no transitions: every sample is a settled
            # state, never a frame of the header's own .4s background ease.
            page.add_style_tag(content='html{scroll-behavior:auto!important}'
                                       '*{transition:none!important}')
            page.wait_for_timeout(900)
            applied = page.evaluate("document.documentElement.dataset.theme||'dark'")
            assert applied == theme, f'asked for {theme}, got {applied}'
            bar = page.evaluate("Math.ceil(document.querySelector('.nav').getBoundingClientRect().height)")
            top = page.evaluate('document.documentElement.scrollHeight-innerHeight')
            rows = []
            for i in range(SAMPLES):
                page.evaluate(f'scrollTo(0,{int(top * i / (SAMPLES - 1))})')
                page.wait_for_timeout(110)
                row = measure(page, bar)
                row['y'] = page.evaluate('Math.round(scrollY)')
                rows.append(row)
            for key in CONTROLS:
                have = [r for r in rows if key in r]
                bad = min(have, key=lambda r: r[key]['ratio'])
                worst.setdefault(theme, {})[key] = dict(bad[key], y=bad['y'])
            line = '  '.join(
                f"{k}={worst[theme][k]['ratio']}@y{worst[theme][k]['y']}" for k in CONTROLS)
            print(f'{theme:10} {line}')
            ctx.close()
        browser.close()
    fails = [(t, k, v) for t, d in worst.items() for k, v in d.items()
             if v['ratio'] < v['floor']]
    print(f'\n{len(fails)} below the WCAG 1.4.3 floor for their size')
    for t, k, v in sorted(fails, key=lambda x: x[2]['ratio']):
        print(f"  {t:10} {k:6} {v['ratio']}:1 < {v['floor']}  fg={v['fg']}  bg={v['bg']}  y={v['y']}")
    return worst, fails


if __name__ == '__main__':
    result, failures = run()
    with open('nav-contrast.json', 'w', encoding='utf-8') as fh:
        json.dump(result, fh, indent=1)
    raise SystemExit(1 if failures else 0)
