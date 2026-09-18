"""Measured checks for the Round 02 claims, taken from the rendered page.

Each number here is read off a pixel or a computed style in a served production
build, not from source. Run after `node scripts/serve-static.mjs dist 4618`.
"""
from pathlib import Path
import argparse
import json
import sys

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4618')
parser.add_argument('--out', default=str(ROOT / 'docs' / 'signal-review' / 'round02' / 'measured.json'))
args = parser.parse_args()

FREEZE = '''
(() => {
  const raf = window.requestAnimationFrame.bind(window);
  window.__signalFrozenAt = null;
  window.requestAnimationFrame = (cb) => raf((t) => cb(window.__signalFrozenAt ?? t));
  window.__signalFreeze = (on) => { window.__signalFrozenAt = on ? 100000 : null; };
})();
'''

# Reading the drawn canvas back. preserveDrawingBuffer is not set, so the read
# has to happen inside a rAF callback, before the compositor clears it.
SAMPLE_CANVAS = '''(points) => new Promise((resolve) => {
  const canvas = document.querySelector('[data-signal-canvas]');
  requestAnimationFrame(() => {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const out = {};
    const dpr = canvas.width / canvas.clientWidth;
    for (const [name, fx, fy] of points) {
      const x = Math.round(fx * canvas.width);
      const y = Math.round((1 - fy) * canvas.height);
      const px = new Uint8Array(4);
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      out[name] = [px[0], px[1], px[2], px[3]];
    }
    out._dpr = dpr;
    resolve(out);
  });
})'''


def luminance(rgb):
    def channel(v):
        v = v / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (channel(c) for c in rgb[:3])
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


report = {}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, headless=True)

    for name, w, h in [('desktop', 1440, 900), ('portrait', 390, 844)]:
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1,
                                  is_mobile=w < 700, has_touch=w < 700)
        ctx.add_init_script(FREEZE)
        page = ctx.new_page()
        page.goto(f'{args.base_url}/en', wait_until='networkidle')
        page.wait_for_timeout(1800)
        page.evaluate('() => window.__signalFreeze(true)')
        page.wait_for_timeout(300)

        # Where the rim crest lands, and what is above and below it, read from the
        # canvas the renderer actually drew.
        crest = page.evaluate('''() => {
          const canvas = document.querySelector('[data-signal-canvas]');
          return {w: canvas.clientWidth, h: canvas.clientHeight};
        }''')
        sky = float(page.evaluate(
            "() => getComputedStyle(document.querySelector('[data-signal]')).getPropertyValue('--signal-sky')"))
        # Just under the reserved band's top edge is mass; well above it is sky.
        px = page.evaluate(SAMPLE_CANVAS, [
            ['mass', 0.5, sky * 0.45],
            ['sky', 0.5, 0.92],
            ['justBelowCrest', 0.5, sky * 0.9],
        ])
        report[f'{name}-opening'] = {
            'skyBandFraction': sky,
            'canvas': crest,
            'massRGBA': px['mass'],
            'skyRGBA': px['sky'],
            'justBelowCrestRGBA': px['justBelowCrest'],
            'note': 'canvas is alpha-composited over --signal-bg #05070A; alpha is the 4th value',
        }

        # The opening: is every required element inside the first viewport?
        report[f'{name}-opening']['firstViewport'] = page.evaluate('''() => {
          const vh = innerHeight;
          const box = (sel) => { const e = document.querySelector(sel);
            if (!e) return null; const r = e.getBoundingClientRect();
            return {top: Math.round(r.top), bottom: Math.round(r.bottom), inside: r.bottom <= vh + 1 && r.top >= 0}; };
          return {
            viewportHeight: vh,
            headline: box('#signal-title'),
            role: box('.signal__role'),
            primaryAction: box('.signal__cta'),
            secondaryAction: box('.signal__cta--quiet'),
            namedPreview: box('.signal__intro-artifact'),
            previewCaption: document.querySelector('.signal__intro-artifact span')?.textContent?.trim() || null,
            documentOverflowX: document.documentElement.scrollWidth - innerWidth,
          };
        }''')
        ctx.close()

    # The close: the tile washes and the live-status dot, measured on screen.
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.goto(f'{args.base_url}/en', wait_until='networkidle')
    page.wait_for_timeout(600)
    page.evaluate("() => document.querySelector('#contact').scrollIntoView({block:'center'})")
    page.wait_for_timeout(1400)
    report['close'] = page.evaluate('''() => {
      const cards = [...document.querySelectorAll('.cf-card')];
      const read = (el) => { const cs = getComputedStyle(el);
        return {background: cs.backgroundImage.slice(0, 120), color: cs.color, boxShadow: cs.boxShadow.slice(0, 80)}; };
      const pulse = document.querySelector('.cf-pulse');
      const fx = document.querySelector('.cf-fx');
      return {
        tiles: cards.map(c => ({
          label: c.querySelector('strong')?.textContent?.trim() || c.textContent.trim().slice(0, 18),
          chip: read(c.querySelector('.cf-card__ic')),
          acc: getComputedStyle(c).getPropertyValue('--acc').trim(),
        })),
        pulse: pulse ? {background: getComputedStyle(pulse).backgroundColor,
                        boxShadow: getComputedStyle(pulse).boxShadow.slice(0, 60)} : null,
        canvasFilter: fx ? getComputedStyle(fx).filter : 'absent',
        headingColor: getComputedStyle(document.querySelector('.cf-l2')).color,
        tokensResolve: getComputedStyle(document.querySelector('.sr-contact'))
          .getPropertyValue('--signal-accent').trim(),
      };
    }''')
    # The seam rules that were failing silently.
    report['seam'] = page.evaluate('''() => {
      const g = (sel, prop) => { const e = document.querySelector(sel);
        return e ? getComputedStyle(e)[prop] : 'absent'; };
      return {
        cardMediaBackground: g('.sr-projects .sr-card__media', 'backgroundImage').slice(0, 110),
        atlasWordmarkColor: g('.sr-atlas__wordmark', 'color'),
        proofStrongColor: g('.sr-projects .sr-proof strong', 'color'),
      };
    }''')
    ctx.close()
    browser.close()

for name in ('desktop-opening', 'portrait-opening'):
    block = report[name]
    block['massMinusSkyLuminance'] = round(luminance(block['massRGBA']) - luminance(block['skyRGBA']), 6)

Path(args.out).write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
