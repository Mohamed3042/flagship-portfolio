from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import Page, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "review"
STATE_KEY = "disney2-continuation-80-wan-done-v1"
CHROME_CANDIDATES = (
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Rendered browser gate for the Disney WAN board")
    parser.add_argument(
        "--url",
        default=(
            "http://127.0.0.1:41874/public/worlds/assets/disney2/"
            "wan-production/WAN-GENERATION-BOARD.html"
        ),
    )
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    executable = next((path for path in CHROME_CANDIDATES if path.exists()), None)
    if executable is None:
        print("WAN_BOARD_BROWSER_RED no installed Chrome or Edge executable")
        return 1

    checks: list[dict[str, object]] = []
    failures: list[str] = []
    console_errors: list[str] = []
    page_errors: list[str] = []
    failed_requests: list[str] = []

    def check(name: str, condition: bool, detail: object) -> None:
        checks.append({"name": name, "pass": condition, "detail": str(detail)})
        print(f"{'PASS' if condition else 'FAIL'} {name}: {detail}")
        if not condition:
            failures.append(f"{name}: {detail}")

    def observe(page: Page) -> None:
        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on(
            "requestfailed",
            lambda request: failed_requests.append(
                f"{request.url}: {request.failure or 'request failed'}"
            ),
        )

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=str(executable))
        context = browser.new_context(
            viewport={"width": 1440, "height": 1000},
            device_scale_factor=1,
            permissions=["clipboard-read", "clipboard-write"],
        )
        page = context.new_page()
        observe(page)
        page.goto(args.url, wait_until="networkidle")
        page.evaluate("key => localStorage.removeItem(key)", STATE_KEY)

        metrics = page.evaluate(
            """() => ({
              title: document.title,
              cards: document.querySelectorAll('.card').length,
              images: document.images.length,
              jobs: window.DSN2_WAN_JOBS?.length || 0,
              firstId: document.querySelector('.card')?.id,
              lastId: document.querySelector('.card:last-of-type')?.id,
              firstNames: [...document.querySelectorAll('.card:first-of-type figcaption')].map(x => x.textContent),
              lastNames: [...document.querySelectorAll('.card:last-of-type figcaption')].map(x => x.textContent),
              overflow: document.documentElement.scrollWidth - innerWidth,
              settingsColumns: getComputedStyle(document.querySelector('.settings')).gridTemplateColumns.split(' ').length,
              firstImage: {
                width: document.images[0]?.naturalWidth || 0,
                height: document.images[0]?.naturalHeight || 0
              },
              secondImage: {
                width: document.images[1]?.naturalWidth || 0,
                height: document.images[1]?.naturalHeight || 0
              }
            })"""
        )
        check("desktop title", metrics["title"] == "Disney II · WAN Generation Board", metrics["title"])
        check("desktop jobs", metrics["jobs"] == 80 and metrics["cards"] == 80, metrics)
        check("desktop image elements", metrics["images"] == 160, metrics["images"])
        check("desktop first boundary", metrics["firstId"] == "DSN2-021" and metrics["firstNames"] == ["KF01.png", "KF21.png"], metrics["firstNames"])
        check("desktop last boundary", metrics["lastId"] == "DSN2-100" and metrics["lastNames"] == ["KF99.png", "KF100.png"], metrics["lastNames"])
        check("desktop reference pixels", metrics["firstImage"] == {"width": 1920, "height": 960} and metrics["secondImage"] == {"width": 1920, "height": 960}, (metrics["firstImage"], metrics["secondImage"]))
        check("desktop six settings", metrics["settingsColumns"] == 6, metrics["settingsColumns"])
        check("desktop no overflow", metrics["overflow"] <= 0, metrics["overflow"])

        page.evaluate("key => localStorage.setItem(key, JSON.stringify({stale: true}))", STATE_KEY)
        corrupt_page = context.new_page()
        observe(corrupt_page)
        corrupt_page.goto(args.url, wait_until="networkidle")
        corrupt_state = corrupt_page.evaluate(
            """() => ({
              cards: document.querySelectorAll('.card').length,
              done: document.querySelector('#done-count').textContent
            })"""
        )
        check("corrupt stored state recovers", corrupt_state == {"cards": 80, "done": "0"}, corrupt_state)
        corrupt_page.wait_for_load_state("networkidle")
        corrupt_page.close()
        page.evaluate("key => localStorage.removeItem(key)", STATE_KEY)

        page.locator('[data-act-filter="VII"]').click()
        visible_act = page.locator(".card:not([hidden])").count()
        check("Act VII filter", visible_act == 10, visible_act)
        page.locator('[data-act-filter="all"]').click()

        first_card = page.locator("#DSN2-021")
        first_card.locator("button.done").click()
        progress = page.evaluate(
            """key => ({
              count: document.querySelector('#done-count').textContent,
              width: parseFloat(document.querySelector('#bar-fill').style.width),
              stored: JSON.parse(localStorage.getItem(key) || '[]')
            })""",
            STATE_KEY,
        )
        check("generated progress", progress == {"count": "1", "width": 1.25, "stored": ["DSN2-021"]}, progress)
        persisted_page = context.new_page()
        observe(persisted_page)
        persisted_page.goto(args.url, wait_until="networkidle")
        persisted = persisted_page.locator("#DSN2-021 button.done").get_attribute("aria-pressed")
        check("generated state persists", persisted == "true", persisted)
        persisted_page.close()

        page.locator('[data-state-filter="pending"]').click()
        pending_count = page.locator(".card:not([hidden])").count()
        page.locator('[data-state-filter="generated"]').click()
        generated_count = page.locator(".card:not([hidden])").count()
        check("status filters", pending_count == 79 and generated_count == 1, (pending_count, generated_count))
        page.locator('[data-state-filter="all"]').click()

        prompt = page.evaluate("() => window.DSN2_WAN_JOBS[0].prompt")
        copy_button = page.locator("#DSN2-021 button.copy")
        copy_button.click()
        copied = page.evaluate("() => navigator.clipboard.readText()")
        check("copy exact prompt", copied == prompt and copy_button.text_content() == "Copied", len(copied))

        # Capture pristine operator views on a fresh page, independent of the
        # exercised page's reload scroll restoration and focused controls.
        page.evaluate("key => localStorage.removeItem(key)", STATE_KEY)
        proof_page = context.new_page()
        observe(proof_page)
        proof_page.goto(args.url, wait_until="networkidle")
        proof_page.screenshot(path=str(args.output / "wan-board-desktop.png"))

        page.set_viewport_size({"width": 390, "height": 844})
        phone = page.evaluate(
            """() => {
              const figures = document.querySelectorAll('.card:first-of-type figure');
              const first = figures[0].getBoundingClientRect();
              const second = figures[1].getBoundingClientRect();
              return {
                overflow: document.documentElement.scrollWidth - innerWidth,
                settingsColumns: getComputedStyle(document.querySelector('.settings')).gridTemplateColumns.split(' ').length,
                framesStacked: second.top > first.bottom,
                cardWidth: document.querySelector('.card').getBoundingClientRect().width,
                viewport: innerWidth
              };
            }"""
        )
        check("phone two settings columns", phone["settingsColumns"] == 2, phone)
        check("phone frames stack", phone["framesStacked"], phone)
        check("phone no overflow", phone["overflow"] <= 0 and phone["cardWidth"] <= phone["viewport"], phone)
        proof_page.set_viewport_size({"width": 390, "height": 844})
        proof_page.evaluate(
            """() => {
              document.documentElement.style.scrollBehavior = 'auto';
              const card = document.querySelector('.card');
              scrollTo(0, Math.max(0, card.offsetTop - 76));
            }"""
        )
        proof_page.screenshot(path=str(args.output / "wan-board-phone.png"))
        proof_page.wait_for_load_state("networkidle")
        proof_page.close()

        page.evaluate("key => localStorage.removeItem(key)", STATE_KEY)
        check("console errors", not console_errors, console_errors)
        check("page errors", not page_errors, page_errors)
        check("failed requests", not failed_requests, failed_requests)
        browser.close()

    result = {
        "url": args.url,
        "checks": checks,
        "failures": failures,
        "consoleErrors": console_errors,
        "pageErrors": page_errors,
        "failedRequests": failed_requests,
    }
    (args.output / "wan-board-browser.json").write_text(
        json.dumps(result, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    if failures:
        print(f"WAN_BOARD_BROWSER_RED {len(failures)} failure(s)")
        return 1
    print(f"WAN_BOARD_BROWSER_GREEN {len(checks)}/{len(checks)} desktop+phone")
    return 0


if __name__ == "__main__":
    sys.exit(main())
