"""Fly story pages with native Playwright and prove the flight mounted.

Run against the built dist served by scripts/serve-static.mjs (the dev
toolbar injects a console error of its own):

  node scripts/serve-static.mjs dist 4332
  python scripts/test-flight.py --base-url http://127.0.0.1:4332 --viewport desktop
  python scripts/test-flight.py --base-url http://127.0.0.1:4332 --viewport mobile --all
  python scripts/test-flight.py ... --shots artifacts/flight   # one capture per stop

Per page and language it checks: html.flight-live within 15 s, six flight
stops resolved, the frame loop advancing, the camera reaching the boundary
(u >= 4.9) at the bottom of the page, the canvas sized to the viewport at
the device pixel ratio (no reduced resolution on the phone profile), zero
console errors and zero 4xx/5xx responses.
"""

import argparse
import importlib.util
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")

# the same story set the portfolio gate walks
_spec = importlib.util.spec_from_file_location("portfolio_gate", HERE / "test-portfolio.py")
_gate = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(_gate)
ALL_SLUGS = list(_gate.SLUGS)

# a representative subset: public with screens, the GLB page, a dieline, a
# foundation story with a bespoke centerpiece, two lab studies, two systems
DEFAULT_SLUGS = ["ask-repos", "cake-studio", "medmac-box-studio", "crm", "b2mh", "lifeos", "spaceframe-world", "al-maali"]

STOPS = [
    ("hook", "0"),
    ("brief", "(() => { const b = document.querySelector('[data-flight-stop=\"brief\"]'); return b.getBoundingClientRect().top + scrollY - innerHeight * 0.35; })()"),
    ("build", "(() => { const b = document.querySelector('[data-flight-stop=\"build\"]'); const t = b.getBoundingClientRect().top + scrollY; return t + (b.offsetHeight - innerHeight) * 0.55; })()"),
    ("proof", "(() => { const b = document.querySelector('[data-flight-stop=\"proof\"]'); const t = b.getBoundingClientRect().top + scrollY; return t + (b.offsetHeight - innerHeight) * 0.7; })()"),
    ("honesty", "(() => { const b = document.querySelector('[data-flight-stop=\"honesty\"]'); return b.getBoundingClientRect().top + scrollY - innerHeight * 0.15; })()"),
    ("next", "document.documentElement.scrollHeight"),
]

PROBE = """async () => {
  const f = window.__flight;
  if (!f) return null;
  const a = f.frames;
  const t0 = performance.now();
  await new Promise((r) => setTimeout(r, 1000));
  const c = document.querySelector('[data-flight-canvas]');
  return {
    fps: (f.frames - a) / ((performance.now() - t0) / 1000),
    ms: f.ms,
    calls: f.calls,
    stops: f.stops,
    canvas: [c.width, c.height],
    inner: [innerWidth, innerHeight],
    dpr: devicePixelRatio,
  };
}"""


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4332")
    parser.add_argument("--viewport", choices=("desktop", "mobile"), default="desktop")
    parser.add_argument("--slugs", default="")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--langs", default="en,ar")
    parser.add_argument("--shots", default="")
    parser.add_argument("--min-fps", type=float, default=4.0)
    parser.add_argument("--theme", default="", help="dark (default), light, neon, cinema, storybook or wave")
    parser.add_argument("--hop", action="store_true", help="also follow each page's handoff link and require the flight to remount")
    args = parser.parse_args()

    slugs = ALL_SLUGS if args.all else ([s for s in args.slugs.split(",") if s] or DEFAULT_SLUGS)
    langs = [l for l in args.langs.split(",") if l]
    mobile = args.viewport == "mobile"
    viewport = {"width": 390, "height": 844} if mobile else {"width": 1440, "height": 900}
    dpr = 3 if mobile else 1
    shots = Path(args.shots) if args.shots else None
    if shots:
        shots.mkdir(parents=True, exist_ok=True)

    failures: list[str] = []
    console_errors: list[str] = []
    bad_responses: list[str] = []
    pages: list[dict] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=str(CHROME),
            args=["--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-webgl", "--enable-unsafe-swiftshader"],
        )
        context = browser.new_context(viewport=viewport, device_scale_factor=dpr, is_mobile=mobile, has_touch=mobile)
        if args.theme:
            context.add_init_script(f"try {{ localStorage.setItem('mm-theme', {json.dumps(args.theme)}) }} catch (e) {{}}")
        page = context.new_page()
        page.on("console", lambda msg: console_errors.append(f"{page.url}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda error: console_errors.append(f"{page.url}: {error}"))
        page.on("response", lambda response: bad_responses.append(f"{response.status} {response.url}") if response.status >= 400 else None)

        for lang in langs:
            for slug in slugs:
                href = f"/{lang}/work/{slug}"
                url = f"{args.base_url.rstrip('/')}{href}?sky=force"
                page.goto(url, wait_until="networkidle")
                try:
                    page.wait_for_function("document.documentElement.classList.contains('flight-live')", timeout=15_000)
                except Exception:
                    failures.append(f"{href} never went flight-live")
                    continue
                page.wait_for_timeout(600)
                probe = page.evaluate(PROBE) or {}
                record = {"page": href, **probe}
                if probe.get("stops") != 6:
                    failures.append(f"{href} resolved {probe.get('stops')} flight stops, expected 6")
                if (probe.get("fps") or 0) < args.min_fps:
                    failures.append(f"{href} frame loop at {probe.get('fps', 0):.1f} fps")
                canvas = probe.get("canvas") or [0, 0]
                inner = probe.get("inner") or [0, 0]
                want = [round(inner[0] * probe.get("dpr", 1)), round(inner[1] * probe.get("dpr", 1))]
                if abs(canvas[0] - want[0]) > 2 or abs(canvas[1] - want[1]) > 2:
                    failures.append(f"{href} canvas {canvas} is not the viewport at native resolution {want}")
                for name, expr in STOPS:
                    page.evaluate(f"window.scrollTo(0, {expr})")
                    page.wait_for_timeout(1_100)
                    if shots:
                        page.screenshot(path=str(shots / f"{slug}-{lang}-{args.viewport}-{name}.png"), full_page=False)
                u_end = page.evaluate("window.__flight ? window.__flight.u : -1")
                record["u_end"] = u_end
                if u_end < 4.9:
                    failures.append(f"{href} camera stopped at u={u_end:.2f} before the boundary")
                overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                if overflow > 2:
                    failures.append(f"{href} has {overflow}px horizontal overflow at {args.viewport}")
                if args.hop:
                    # a client-side navigation must tear the flight down and mount the next one
                    before = page.url
                    page.locator('[data-flight-stop="next"]').first.click(timeout=10_000)
                    page.wait_for_function(f"location.href !== {json.dumps(before)}", timeout=10_000)
                    try:
                        page.wait_for_function("document.documentElement.classList.contains('flight-live') && !!window.__flight", timeout=15_000)
                        record["hop"] = page.url
                    except Exception:
                        failures.append(f"{href} → handoff did not remount the flight at {page.url}")
                pages.append(record)

        browser.close()

    bad_responses = sorted(set(bad_responses))
    console_errors = sorted(set(console_errors))
    failures.extend(f"console: {m}" for m in console_errors)
    failures.extend(f"response: {m}" for m in bad_responses)
    report = {"viewport": args.viewport, "pages": pages, "failures": failures}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if failures or not pages:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
