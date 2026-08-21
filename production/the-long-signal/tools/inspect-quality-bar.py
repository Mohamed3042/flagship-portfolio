from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright


URL = "https://mohamed3042.github.io/flagship-portfolio/worlds/spotify.html"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "research"


def inspect(page, label: str) -> dict:
    console_errors: list[str] = []
    failed_requests: list[str] = []
    page.on(
        "console",
        lambda msg: console_errors.append(msg.text) if msg.type == "error" else None,
    )
    page.on(
        "requestfailed",
        lambda request: failed_requests.append(
            f"{request.method} {request.url} :: {request.failure}"
        ),
    )
    page.goto(URL, wait_until="domcontentloaded", timeout=60_000)
    page.wait_for_timeout(2_000)
    page.evaluate(
        """
        async () => {
          const max = document.documentElement.scrollHeight - innerHeight;
          for (let i = 0; i <= 48; i++) {
            scrollTo({ top: max * i / 48, behavior: 'instant' });
            await new Promise(resolve => setTimeout(resolve, 90));
          }
        }
        """
    )
    page.wait_for_timeout(1_500)
    screenshot = OUT / f"quality-bar-spotify-{label}-ending.png"
    page.screenshot(path=str(screenshot), full_page=False)
    state = page.evaluate(
        """
        () => ({
          title: document.title,
          href: location.href,
          viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
          scrollY,
          maxScroll: document.documentElement.scrollHeight - innerHeight,
          lang: document.documentElement.lang,
          dir: document.documentElement.dir,
          cinemaScript: document.querySelector('script[src*="cinema.js"]')?.src || null,
          sceneCount: document.querySelectorAll('[data-scene]').length,
          finalScene: [...document.querySelectorAll('[data-scene]')].at(-1)?.dataset.slate || null,
          liveScenes: [...document.querySelectorAll('[data-scene].is-live')].map(
            scene => scene.dataset.slate || scene.getAttribute('aria-label')
          ),
          endingText: document.querySelector('.credits .roll')?.innerText.slice(-500) || null,
          flightMode: document.querySelector('#flight')?.className || null,
        })
        """
    )
    state["screenshot"] = str(screenshot)
    state["consoleErrors"] = console_errors
    state["failedRequests"] = failed_requests
    return state


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        desktop = browser.new_page(viewport={"width": 1440, "height": 900})
        phone = browser.new_page(
            viewport={"width": 390, "height": 844},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
        )
        report = {
            "url": URL,
            "desktop": inspect(desktop, "desktop"),
            "phone": inspect(phone, "phone"),
        }
        browser.close()
    report_path = OUT / "quality-bar-spotify.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=True))


if __name__ == "__main__":
    main()
