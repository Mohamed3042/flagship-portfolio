#!/usr/bin/env python3
"""Rendered browser gate for the offline ARCANE WORLD WAN owner board."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
REVIEW = REPO / "public" / "worlds" / "assets" / "arcane" / "review"
DEFAULT_URL = "http://127.0.0.1:4317/production/arcane-world/wan-production/WAN-GENERATION-BOARD.html"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")


def require(condition: bool, message: str, failures: list[str]) -> None:
    if not condition:
        failures.append(message)


def main() -> int:
    url = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_URL
    origin = "/".join(url.split("/")[:3])
    failures: list[str] = []
    console_errors: list[str] = []
    external_requests: list[str] = []
    REVIEW.mkdir(parents=True, exist_ok=True)
    executable = CHROME if CHROME.exists() else EDGE
    if not executable.exists():
        raise SystemExit("no installed Chrome or Edge executable")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=str(executable),
            args=["--disable-gpu"],
        )
        desktop = browser.new_context(
            viewport={"width": 1440, "height": 1100},
            device_scale_factor=1,
            permissions=["clipboard-read", "clipboard-write"],
        )
        page = desktop.new_page()
        page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: console_errors.append(str(error)))
        page.on("request", lambda request: external_requests.append(request.url) if not request.url.startswith(origin) else None)
        response = page.goto(url, wait_until="networkidle")
        require(response is not None and response.status == 200, "board HTTP status is not 200", failures)
        require(page.locator(".card").count() == 40, "rendered card count is not 40", failures)
        require(page.locator(".frame-link img").count() == 80, "rendered endpoint image count is not 80", failures)
        require(page.locator("#now-job").inner_text() == "NOW: ARC-001", "initial NOW marker is not ARC-001", failures)

        for index in range(1, 41):
            card_id = f"ARC-{index:03d}"
            page.locator(f"#{card_id}").scroll_into_view_if_needed()
            page.wait_for_function(
                "cardId => [...document.querySelectorAll(`#${cardId} img`)].every(image => image.complete && image.naturalWidth === 1920 && image.naturalHeight === 1088)",
                arg=card_id,
            )
        decoded = page.locator(".frame-link img").evaluate_all(
            "images => images.every(image => image.complete && image.naturalWidth === 1920 && image.naturalHeight === 1088)"
        )
        require(decoded, "one or more rendered endpoints failed decoded 1920x1088 gate", failures)

        page.locator("#ARC-040").evaluate("element => element.remove()")
        sabotage_detected = page.locator(".card").count() == 39
        if not sabotage_detected:
            raise RuntimeError("browser selftest did not detect the removed card")
        print("RED_BROWSER_SELFTEST rendered gate detects a removed card")
        page.reload(wait_until="networkidle")
        require(page.locator(".card").count() == 40, "board did not recover to 40 cards after selftest", failures)

        require(page.locator("#done-count").inner_text() == "0", "fresh desktop state is not 0/40", failures)
        expected_prompt = page.locator("#ARC-001 .prompt").inner_text()
        page.locator("#ARC-001 .copy-prompt").click()
        copied_prompt = page.evaluate("navigator.clipboard.readText()")
        require(copied_prompt == expected_prompt, "copied prompt differs from visible exact prompt", failures)

        page.locator("#ARC-001 .status").select_option("done")
        page.locator("#ARC-001 .task-id").fill("QA-TASK-001")
        page.locator("#ARC-001 .seed-used").fill("173201")
        page.locator("#ARC-001 .attempts").fill("1")
        page.locator("#ARC-001 .notes").fill("browser persistence witness")
        page.reload(wait_until="networkidle")
        require(page.locator("#done-count").inner_text() == "1", "done state did not persist across reload", failures)
        require(page.locator("#now-job").inner_text() == "NOW: ARC-002", "NOW marker did not advance to ARC-002", failures)
        require(page.locator("#ARC-001 .task-id").input_value() == "QA-TASK-001", "task ID did not persist", failures)
        page.get_by_role("button", name="Done", exact=True).click()
        require(page.locator(".card:visible").count() == 1, "Done filter did not isolate one card", failures)
        page.get_by_role("button", name="Pending", exact=True).click()
        require(page.locator(".card:visible").count() == 39, "Pending filter did not isolate 39 cards", failures)

        page.evaluate("localStorage.clear()")
        page.reload(wait_until="networkidle")
        page.evaluate("() => { document.documentElement.style.scrollBehavior = 'auto'; document.scrollingElement.scrollTop = 0; }")
        page.wait_for_function("scrollY === 0")
        page.screenshot(path=str(REVIEW / "ARC-WAN-board-desktop.png"), full_page=False)
        page.locator("#ARC-001").screenshot(path=str(REVIEW / "ARC-WAN-board-card-001.png"))
        desktop.close()

        mobile = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
        )
        mobile_page = mobile.new_page()
        mobile_page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        mobile_page.on("pageerror", lambda error: console_errors.append(str(error)))
        mobile_page.on("request", lambda request: external_requests.append(request.url) if not request.url.startswith(origin) else None)
        mobile_response = mobile_page.goto(url, wait_until="networkidle")
        require(mobile_response is not None and mobile_response.status == 200, "mobile board HTTP status is not 200", failures)
        require(mobile_page.locator(".card").count() == 40, "mobile card count is not 40", failures)
        overflow = mobile_page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        require(overflow <= 0, f"mobile horizontal overflow is {overflow}px", failures)
        require(mobile_page.locator(".toolbar").evaluate("element => getComputedStyle(element).position") == "static", "mobile toolbar obscures card content", failures)
        mobile_page.screenshot(path=str(REVIEW / "ARC-WAN-board-mobile.png"), full_page=False)
        mobile_page.locator("#ARC-001").scroll_into_view_if_needed()
        mobile_page.locator("#ARC-001").screenshot(path=str(REVIEW / "ARC-WAN-board-mobile-card-001.png"))
        mobile.close()
        browser.close()

    report = {
        "schema": "arcane-world-wan-board-browser-qa/v1",
        "status": "RED" if failures or console_errors or external_requests else "GREEN",
        "desktopViewport": "1440x1100@1",
        "mobileViewport": "390x844@3",
        "renderedCards": 40,
        "decodedEndpointImages": 80,
        "removedCardSabotageDetected": sabotage_detected,
        "persistenceTest": True,
        "copyTest": True,
        "filterTest": True,
        "nowMarkerTest": True,
        "externalRequests": external_requests,
        "consoleErrors": console_errors,
        "failures": failures,
        "wanClipsGenerated": 0,
        "wanCreditsSpent": 0,
    }
    (REVIEW / "wan-board-browser-qa.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if report["status"] == "RED":
        for failure in [*failures, *console_errors, *external_requests]:
            print(f"RED {failure}")
        return 1
    print("GREEN_BROWSER 40/40 cards, 80/80 decoded endpoints, copy + persistence + filters, 390x844 DPR3 no overflow, 0 external requests")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
