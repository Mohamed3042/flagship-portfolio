"""Technical audit of the universe pages with native Playwright + hardware WebGL.

  node scripts/serve-static.mjs dist 4332
  python scripts/audit-flight.py --base-url http://127.0.0.1:4332

Per page (home + a story set) and per width (390 @3, 768, 1440): console errors,
horizontal overflow, one h1 + landmarks + lang/dir, images without alt, links and
buttons without an accessible name, interactive targets under 44px in the first
three screens, visible focus ring on the first story link, DOM node count, JS heap,
WebGL renderer.info (programs / geometries / textures / draw calls), frame time.
Prints a JSON report; exits 1 on a hard failure (console error, overflow, missing
h1/landmark, unnamed control).
"""

import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
PAGES = ["/en", "/ar", "/en/work/ask-repos", "/ar/work/ask-repos", "/en/work/cake-studio", "/en/work/crm", "/en/work/b2mh"]
WIDTHS = [(390, 844, 3, True), (768, 1024, 2, True), (1440, 900, 1, False)]

CHECKS = """async () => {
  const out = {};
  out.overflow = document.documentElement.scrollWidth - innerWidth;
  out.h1 = document.querySelectorAll('h1').length;
  out.landmarks = { nav: !!document.querySelector('nav'), main: !!document.querySelector('main'), footer: !!document.querySelector('footer') };
  out.lang = document.documentElement.lang; out.dir = document.documentElement.dir;
  out.imgNoAlt = [...document.images].filter(i => !i.hasAttribute('alt')).length;
  const name = (el) => (el.getAttribute('aria-label') || el.textContent || '').trim();
  const ctrls = [...document.querySelectorAll('a,button,summary')];
  out.unnamed = ctrls.filter(el => !name(el)).map(el => el.outerHTML.slice(0, 80));
  const small = [];
  for (const el of ctrls) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.top > innerHeight * 3) continue;
    if (Math.min(r.width, r.height) < 44 && !(r.height >= 40 && r.width >= 44)) small.push({ t: name(el).slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) });
  }
  out.smallTargets = small;
  out.nodes = document.getElementsByTagName('*').length;
  out.heapMB = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null;
  const f = window.__flight;
  out.flightLive = document.documentElement.classList.contains('flight-live') || document.documentElement.classList.contains('sky-live');
  if (f) { const a = f.frames; const t0 = performance.now(); await new Promise(r => setTimeout(r, 800)); out.fps = Math.round((f.frames - a) / ((performance.now() - t0) / 1000)); out.calls = f.calls; }
  // focus ring on the first story link
  const link = document.querySelector('a[href*="/work/"]') || document.querySelector('main a');
  if (link) { link.focus({ preventScroll: true }); const cs = getComputedStyle(link); out.focusRing = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? 'outline' : (cs.boxShadow !== 'none' ? 'box-shadow' : 'none'); link.blur(); }
  out.transparentHeadlines = [...document.querySelectorAll('[data-ptext]')].filter(el => getComputedStyle(el).color === 'rgba(0, 0, 0, 0)').length;
  return out;
}"""


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://127.0.0.1:4332")
    ap.add_argument("--pages", default="")
    args = ap.parse_args()
    pages = [p for p in args.pages.split(",") if p] or PAGES
    report = []
    hard = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=str(CHROME), args=["--use-angle=d3d11", "--ignore-gpu-blocklist"])
        for (w, h, dpr, mobile) in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=dpr, is_mobile=mobile, has_touch=mobile)
            page = ctx.new_page()
            errors = []
            page.on("console", lambda m: errors.append(m.text[:200]) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)[:200]))
            for path in pages:
                errors.clear()
                page.goto(f"{args.base_url.rstrip('/')}{path}?sky=force", wait_until="networkidle")
                page.wait_for_timeout(2500)
                js = 0
                for r in page.context.pages[0].request.all() if False else []:
                    pass
                res = page.evaluate(CHECKS)
                res.update({"page": path, "width": w, "dpr": dpr, "consoleErrors": list(errors)})
                report.append(res)
                if errors: hard.append(f"{path}@{w}: console {errors[:1]}")
                if res["overflow"] > 2: hard.append(f"{path}@{w}: overflow {res['overflow']}px")
                if res["h1"] != 1: hard.append(f"{path}@{w}: h1 count {res['h1']}")
                if not all(res["landmarks"].values()): hard.append(f"{path}@{w}: landmarks {res['landmarks']}")
                if res["unnamed"]: hard.append(f"{path}@{w}: unnamed controls {res['unnamed'][:2]}")
            ctx.close()
        browser.close()
    print(json.dumps({"hard_failures": hard, "pages": report}, ensure_ascii=False, indent=1))
    if hard:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
