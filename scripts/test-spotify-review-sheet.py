"""Runtime smoke test for the Spotify owner review sheet."""
from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright


SHEET = Path(r"C:\Users\GAMING\Downloads\spotify-review\REVIEW\seams.html")
SCREEN = Path(r"C:\Users\GAMING\Downloads\spotify-review\REVIEW\runtime-smoke.png")
EXPORT = Path(r"C:\Users\GAMING\Downloads\spotify-review\REVIEW\review-sheet-smoke-answers.json")


def main() -> None:
    failures: list[str] = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.on("pageerror", lambda error: failures.append(f"pageerror:{error}"))
        page.on("console", lambda message: failures.append(f"console.error:{message.text}")
                if message.type == "error" else None)
        page.goto(SHEET.as_uri(), wait_until="load")
        page.evaluate("localStorage.clear()")
        page.reload(wait_until="load")

        assert page.evaluate("Q.length") == 40
        for key in "123456789":
            page.evaluate("go(0)")
            page.keyboard.press(key)
            page.wait_for_timeout(260)
            current = page.evaluate("cur")
            expected = 1 if key in "123" else 0
            assert current == expected, (key, current, expected)

        page.evaluate("go(0)")
        page.keyboard.press("Enter")
        assert page.evaluate("cur") == 1
        page.evaluate("go(0); view='normal'")
        for key, expected in (("Space", "ab"), ("x", "xray"), ("i", "invert"), ("d", "diff")):
            page.evaluate("view='normal'")
            page.keyboard.press(key)
            assert page.evaluate("view") == expected, key
        page.evaluate("zoom=2")
        page.keyboard.press("0")
        assert page.evaluate("zoom") == 1

        page.evaluate("state.answers={}; save(); go(0); view='normal'")
        page.screenshot(path=str(SCREEN), full_page=False)
        for index in range(40):
            meta = page.evaluate("({cur,type:Q[cur].type,id:Q[cur].id})")
            assert meta["cur"] == index, meta
            if meta["type"] == "mark":
                page.click("#btnNone")
                page.keyboard.press("Enter")
            else:
                page.keyboard.press("1")
                page.wait_for_timeout(260)
        page.keyboard.press("Enter")
        page.wait_for_selector("#finishBox")
        assert page.evaluate("Q.filter(answered).length") == 40
        with page.expect_download() as download_info:
            page.click("#exp")
        download_info.value.save_as(EXPORT)
        browser.close()

    payload = json.loads(EXPORT.read_text(encoding="utf-8"))
    assert len(payload["answers"]) == 40
    assert not failures, failures
    print(f"REVIEW_SHEET_RUNTIME PASS questions=40 keys=1-9,Enter,Space,X,I,D,0 export={EXPORT}")


if __name__ == "__main__":
    main()
