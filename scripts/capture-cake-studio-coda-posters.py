"""Capture the authored proof-room endpoints used by the no-motion coda path."""

from __future__ import annotations

import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "worlds" / "cake-studio" / "posters"
URL = os.environ.get("CAKE_STUDIO_URL", "http://127.0.0.1:4622/worlds/cake-studio.html")
STATES = (("forms", 0.22), ("assembly", 0.52), ("handoff", 0.84))
VIEWPORTS = (
    ("desktop", {"width": 1440, "height": 1000}),
    ("phone", {"width": 390, "height": 844}),
)


def set_progress(page, progress: float, act: str) -> None:
    page.evaluate(
        """progress => {
          const scene = document.querySelector('[data-object-coda]');
          const top = scene.getBoundingClientRect().top + scrollY;
          const travel = Math.max(0, scene.offsetHeight - innerHeight);
          scrollTo(0, top + travel * progress);
        }""",
        progress,
    )
    page.wait_for_function(
        """({progress, act}) => {
          const runtime = window.__cakeStudioCoda;
          return runtime?.ready
            && runtime.cameraState === 'idle'
            && Math.abs(runtime.progress - progress) < .002
            && runtime.act === act
            && runtime.residentModelGroups?.length === 1
            && runtime.residentModelGroups[0] === act;
        }""",
        arg={"progress": progress, "act": act},
        timeout=30_000,
    )


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        for viewport_name, viewport in VIEWPORTS:
            page = browser.new_page(viewport=viewport, device_scale_factor=1)
            page.goto(URL, wait_until="networkidle", timeout=30_000)
            page.wait_for_function("window.__cakeStudioCoda?.ready === true", timeout=20_000)
            page.evaluate(
                """() => {
                  for (const selector of ['.chrome', '.coda-origin', '.object-acts', '.artifact-names', '.proof-portal']) {
                    document.querySelector(selector)?.style.setProperty('display', 'none', 'important');
                  }
                }"""
            )
            for act, progress in STATES:
                set_progress(page, progress, act)
                output = OUTPUT / f"coda-{act}-{viewport_name}.jpg"
                page.locator(".object-window").screenshot(path=str(output), type="jpeg", quality=88)
                print(f"CODA_POSTER_OK {viewport_name} {act} {output.stat().st_size} {output}", flush=True)
            page.close()
        browser.close()


if __name__ == "__main__":
    main()
