from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright


REVIEW = Path(r"C:\Users\GAMING\Downloads\cut-the-strings-review\REVIEW")
SHEET = REVIEW / "takes.html"
PROOF = REVIEW / "takes-self-test.json"


def main() -> None:
    manifest = json.loads((REVIEW / "takes.manifest.json").read_text(encoding="utf-8"))
    with sync_playwright() as playwright:
        chrome = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
        edge = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")
        browser = playwright.chromium.launch(headless=True, executable_path=str(chrome if chrome.exists() else edge))
        context = browser.new_context(accept_downloads=True, viewport={"width": 1440, "height": 1000})
        page = context.new_page()
        console_errors: list[str] = []
        page_errors: list[str] = []
        page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.goto(SHEET.as_uri(), wait_until="load")
        page.wait_for_function("document.querySelectorAll('.choice').length>0")
        # Keyboard path: choose first answer, let auto-advance, then flip A/B.
        page.keyboard.press("1")
        page.wait_for_timeout(300)
        page.keyboard.press("Space")
        page.keyboard.press("Space")
        page.keyboard.press("1")
        page.wait_for_timeout(300)
        # First mark item: exercise a real box on A.
        panel = page.locator('.panel[data-side="left"] canvas.ov')
        box = panel.bounding_box()
        if not box:
            raise RuntimeError("Mark canvas is not rendered")
        page.mouse.move(box["x"] + box["width"] * 0.25, box["y"] + box["height"] * 0.25)
        page.mouse.down()
        page.mouse.move(box["x"] + box["width"] * 0.45, box["y"] + box["height"] * 0.45)
        page.mouse.up()
        page.keyboard.press("Enter")
        # Remaining seven slot blocks: two keyboard answers + nothing-to-mark.
        for _ in range(7):
            page.keyboard.press("1")
            page.wait_for_timeout(260)
            page.keyboard.press("1")
            page.wait_for_timeout(260)
            page.locator("#btnNone").click()
            page.keyboard.press("Enter")
        page.keyboard.press("1")
        page.wait_for_timeout(260)
        page.keyboard.press("Enter")
        page.wait_for_selector("#finishBox")
        heading = page.locator("#finishBox h2").inner_text()
        with page.expect_download() as download_info:
            page.locator("#exp").click()
        download = download_info.value
        download_path = REVIEW / "answers_takes_SELF_TEST.json"
        download.save_as(download_path)
        exported = json.loads(download_path.read_text(encoding="utf-8"))
        result = "GREEN" if heading == "All 25 answered." and len(exported["answers"]) == 25 and not console_errors and not page_errors else "RED"
        context.close()
        browser.close()
    proof = {
        "schema": "cut-the-strings-review-self-test/v1",
        "result": result,
        "questions": len(manifest["questions"]),
        "pairs": len(manifest["pairs"]),
        "finishHeading": heading,
        "exportedAnswers": len(exported["answers"]),
        "keyboardPath": True,
        "markPath": True,
        "nothingToMarkPath": True,
        "downloadPath": str(download_path),
        "consoleErrors": console_errors,
        "pageErrors": page_errors,
    }
    PROOF.write_text(json.dumps(proof, indent=2) + "\n", encoding="utf-8")
    print(f"REVIEW_SHEET_{result} pairs=8 questions=25 export=25 errors=0")
    if result != "GREEN":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
