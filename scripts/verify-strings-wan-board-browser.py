from __future__ import annotations

import argparse
import functools
import http.server
import json
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright


REPO = Path(__file__).resolve().parents[1]
PUBLIC = REPO / "public"
STRINGS = PUBLIC / "worlds" / "assets" / "strings"
PROOF = REPO / ".tmp" / "strings-final-board-proof"
REPORT = STRINGS / "review" / "final-board-browser-qa.json"
BOARDS = (
    {"file": "WAN-GENERATION-BOARD.html", "mode": "shipped", "cards": 40, "images": 80},
    {"file": "WAN-R3-GENERATION-BOARD.html", "mode": "archive", "cards": 10, "images": 20},
)
VIEWPORTS = (
    {"name": "desktop", "width": 1440, "height": 1100},
    {"name": "phone", "width": 390, "height": 844},
)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        if self.path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        super().do_GET()

    def log_message(self, _format: str, *_args: object) -> None:
        return


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sabotage", action="store_true")
    args = parser.parse_args()
    failures: list[str] = []
    checks = 0

    def check(condition: bool, message: str) -> None:
        nonlocal checks
        checks += 1
        if not condition:
            failures.append(message)

    handler = functools.partial(QuietHandler, directory=str(PUBLIC))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    audits = []
    with sync_playwright() as playwright:
        browser_candidates = (
            Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
            Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
        )
        browser_path = next((path for path in browser_candidates if path.exists()), None)
        if browser_path is None:
            raise RuntimeError("Installed Chrome or Edge executable not found")
        browser = playwright.chromium.launch(headless=True, executable_path=str(browser_path))
        try:
            for board in BOARDS:
                for viewport in VIEWPORTS:
                    context = browser.new_context(
                        viewport={"width": viewport["width"], "height": viewport["height"]},
                        device_scale_factor=1,
                        reduced_motion="reduce",
                    )
                    page = context.new_page()
                    console_errors: list[str] = []
                    page_errors: list[str] = []
                    request_errors: list[str] = []
                    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
                    page.on("pageerror", lambda error: page_errors.append(str(error)))
                    page.on("requestfailed", lambda request: request_errors.append(f"{request.url} :: failed"))
                    url = (
                        f"http://127.0.0.1:{server.server_port}/worlds/assets/strings/"
                        f"wan-production/{board['file']}"
                    )
                    page.goto(url, wait_until="networkidle")
                    page.wait_for_function(
                        "[...document.images].every(image => image.complete && image.naturalWidth > 0)",
                        timeout=30000,
                    )
                    if args.sabotage and board["mode"] == "shipped" and viewport["name"] == "desktop":
                        page.evaluate("document.querySelector('.card:last-child')?.remove()")
                        print("SABOTAGE_APPLIED: removed final shipped card")
                    data = page.evaluate("window.CTS_WAN_DATA")
                    card_count = page.locator(".card").count()
                    image_results = page.evaluate(
                        "[...document.images].map(image => ({width:image.naturalWidth,height:image.naturalHeight}))"
                    )
                    overflow = page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
                    prefix = f"{board['mode']}/{viewport['name']}"
                    check(card_count == board["cards"], f"{prefix}: cards {card_count}/{board['cards']}")
                    check(len(image_results) == board["images"], f"{prefix}: images {len(image_results)}/{board['images']}")
                    check(all(image["width"] == 1920 and image["height"] == 1088 for image in image_results), f"{prefix}: endpoint dimensions")
                    check(data["mode"] == board["mode"], f"{prefix}: embedded mode")
                    check(data["filmClipCount"] == 40, f"{prefix}: film count")
                    check(data["boardClipCount"] == board["cards"], f"{prefix}: data card count")
                    check(data["jobsSubmitted"] is None and data["creditsSpent"] is None, f"{prefix}: unknown accounting must remain null")
                    check(overflow <= 1, f"{prefix}: horizontal overflow {overflow}")
                    check(not console_errors and not page_errors and not request_errors, f"{prefix}: browser errors")
                    if board["mode"] == "archive":
                        check(page.locator(".archive-banner").count() == 1, f"{prefix}: archive banner")
                        check("NOT_PRODUCED" in page.locator(".archive-banner").inner_text(), f"{prefix}: closed status")
                        check(page.locator("button:not([disabled])").count() == 0, f"{prefix}: active generation control")
                    else:
                        check(page.locator("#CTS-A-001").count() == 1 and page.locator("#CTS-A-040").count() == 1, f"{prefix}: boundary slots")
                        check(page.locator(".defect:not(.green)").count() == 4, f"{prefix}: named best-available defects")
                    if not args.sabotage:
                        PROOF.mkdir(parents=True, exist_ok=True)
                        page.screenshot(path=PROOF / f"{board['mode']}-{viewport['name']}.png", full_page=False)
                    audits.append(
                        {
                            "board": board["file"], "mode": board["mode"],
                            "viewport": f"{viewport['width']}x{viewport['height']}",
                            "cards": card_count, "images": len(image_results), "overflow": overflow,
                            "consoleErrors": console_errors, "pageErrors": page_errors,
                            "requestErrors": request_errors,
                        }
                    )
                    context.close()
        finally:
            browser.close()
            server.shutdown()
            server.server_close()
    report = {
        "schema": "cut-the-strings-final-board-browser/v1",
        "result": "RED" if failures else "GREEN",
        "checks": checks,
        "passed": checks - len(failures),
        "failures": failures,
        "sabotage": args.sabotage,
        "audits": audits,
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if failures:
        print(f"BOARD_BROWSER_RED {checks - len(failures)}/{checks}")
        for failure in failures:
            print(f"- {failure}")
        raise SystemExit(1)
    print(f"BOARD_BROWSER_GREEN {checks}/{checks} boards=2 viewports=2 errors=0")


if __name__ == "__main__":
    main()
