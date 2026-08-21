#!/usr/bin/env python3
"""Rendered acceptance gate for the Academy WAN generation board."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import Browser, Page, sync_playwright


REPO = Path(__file__).resolve().parents[1]
DEFAULT_URL = (
    "http://127.0.0.1:4616/worlds/assets/academy/wan-production/"
    "WAN-GENERATION-BOARD.html"
)
STYLE_LOCK = (
    "candlelit wizarding academy storybook, parchment and brass, "
    "warm candle-gold against deep slate shadow, soft film grain"
)
NEGATIVE_LOCK = (
    "Negative prompt: blur, watermark, captions, extra limbs, morphing, "
    "flicker, unintended cut."
)
FRAME_NAMES = [
    "ACA-KF01-owl-letter.png",
    "ACA-KF02-gates-admit.png",
    "ACA-KF03-moving-staircases.png",
    "ACA-KF04-library-grimoires.png",
    "ACA-KF05-self-writing-quill.png",
    "ACA-KF06-sorting-mirror.png",
    "ACA-KF07-six-portraits.png",
    "ACA-KF08-potion-lab.png",
    "ACA-KF09-failed-cast.png",
    "ACA-KF10-proven-cast.png",
    "ACA-KF11-standing-lights.png",
    "ACA-KF12-owl-post.png",
    "ACA-KF13-restricted-section.png",
    "ACA-KF14-ledger-casts.png",
    "ACA-KF15-astronomy-tower.png",
    "ACA-KF16-through-lens.png",
]
CHROME_CANDIDATES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def wait_for_all_images(page: Page) -> list[dict[str, object]]:
    page.eval_on_selector_all(
        ".frame-link img",
        "imgs => imgs.forEach(img => { img.loading = 'eager'; })",
    )
    page.wait_for_function(
        """() => [...document.querySelectorAll('.frame-link img')].length === 32 &&
        [...document.querySelectorAll('.frame-link img')]
          .every(img => img.complete && img.naturalWidth > 0)""",
        timeout=60_000,
    )
    return page.eval_on_selector_all(
        ".frame-link img",
        """imgs => imgs.map(img => ({
          src: img.getAttribute('src'),
          width: img.naturalWidth,
          height: img.naturalHeight,
          alt: img.alt
        }))""",
    )


def validate_job_contracts(page: Page) -> list[dict[str, object]]:
    jobs = page.evaluate("window.ACADEMY_WAN_JOBS")
    require(isinstance(jobs, list), "window.ACADEMY_WAN_JOBS is missing")
    require(len(jobs) == 16, f"expected 16 WAN jobs, got {len(jobs)}")
    expected_ids = [f"ACA-{index:03d}" for index in range(1, 17)]
    require([job["id"] for job in jobs] == expected_ids, "job IDs are not ACA-001..ACA-016")
    require(
        [job["output"] for job in jobs] == [f"ACA-{index:03d}.mp4" for index in range(1, 17)],
        "output filenames are not the frozen ACA-001..ACA-016 contract",
    )
    expected_pairs = [
        (FRAME_NAMES[index], FRAME_NAMES[(index + 1) % len(FRAME_NAMES)])
        for index in range(len(FRAME_NAMES))
    ]
    actual_pairs = [(job["firstName"], job["lastName"]) for job in jobs]
    require(actual_pairs == expected_pairs, "first/last frame chain is not KF01→...→KF16→KF01")
    prompts = [job["prompt"] for job in jobs]
    require(len(set(prompts)) == 16, "WAN prompts are not unique")
    for job in jobs:
        prompt = job["prompt"]
        require(prompt.startswith("Generate single shot."), f"{job['id']} prompt prefix drift")
        require("@Image1 is the immutable" in prompt, f"{job['id']} missing Image1 geometry lock")
        require("@Image2 is the immutable destination frame." in prompt, f"{job['id']} missing Image2 lock")
        require("settles by 4.5 seconds, matching @Image2 exactly." in prompt, f"{job['id']} missing landing lock")
        require(STYLE_LOCK in prompt, f"{job['id']} missing verbatim style lock")
        require("No dialogue. No background music." in prompt, f"{job['id']} missing audio lock")
        require(NEGATIVE_LOCK in prompt, f"{job['id']} missing shared negative lock")
        require("camera" in prompt.lower(), f"{job['id']} missing measured camera move")
        require(len(prompt.split()) <= 95, f"{job['id']} exceeds the 95-word WAN motion budget")
    return jobs


def validate_desktop(browser: Browser, url: str, proof_dir: Path) -> dict[str, object]:
    errors: list[str] = []
    failed: list[str] = []
    context = browser.new_context(viewport={"width": 1440, "height": 1100})
    origin = url.split("/worlds/", 1)[0]
    context.grant_permissions(["clipboard-read", "clipboard-write"], origin=origin)
    page = context.new_page()
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.on("requestfailed", lambda request: failed.append(f"{request.url}: {request.failure}"))
    response = page.goto(url, wait_until="networkidle")
    require(response is not None and response.status == 200, f"board response was {response.status if response else 'none'}")
    page.wait_for_selector(".card", state="attached")
    jobs = validate_job_contracts(page)
    require(page.locator(".card").count() == 16, "rendered card count is not 16")
    require(page.locator(".copy").count() == 16, "copy button count is not 16")
    require(page.locator(".done").count() == 16, "done button count is not 16")
    require(page.locator("#job-count").inner_text() == "16", "progress total is not 16")
    require(page.locator("#done-count").inner_text() == "0", "new browser did not start at 0 done")
    require(page.locator(".prompt").all_inner_texts() == [job["prompt"] for job in jobs], "rendered prompts drifted from board data")
    require(page.locator(".output code").all_inner_texts() == [job["output"] for job in jobs], "rendered filenames drifted from board data")

    images = wait_for_all_images(page)
    require(len(images) == 32, f"expected 32 rendered frame images, got {len(images)}")
    wrong_size = [image for image in images if (image["width"], image["height"]) != (1920, 1088)]
    require(not wrong_size, f"frame dimensions drifted: {wrong_size}")

    first_copy = page.locator(".copy").first
    first_copy.click()
    copied = page.evaluate("navigator.clipboard.readText()")
    require(copied == jobs[0]["prompt"], "copy button did not place the exact first prompt on clipboard")

    first_done = page.locator(".done").first
    first_done.click()
    require(page.locator("#done-count").inner_text() == "1", "done tracking did not increment")
    page.reload(wait_until="networkidle")
    require(page.locator("#done-count").inner_text() == "1", "done tracking did not persist after reload")
    page.locator('[data-state-filter="done"]').click()
    require(page.locator(".card:visible").count() == 1, "Done filter did not isolate one card")
    page.locator('[data-state-filter="pending"]').click()
    require(page.locator(".card:visible").count() == 15, "Pending filter did not show fifteen cards")
    page.locator('[data-state-filter="all"]').click()

    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    require(overflow <= 1, f"desktop horizontal overflow is {overflow}px")
    page.evaluate("window.scrollTo(0, 0)")
    page.screenshot(path=str(proof_dir / "academy-wan-board-desktop.png"), full_page=False)
    require(not errors, f"browser console errors: {errors}")
    require(not failed, f"failed browser requests: {failed}")
    context.close()
    return {"cards": 16, "images": 32, "clipboard": "exact", "tracking": "persisted", "overflow": overflow}


def validate_phone(browser: Browser, url: str, proof_dir: Path) -> dict[str, object]:
    errors: list[str] = []
    failed: list[str] = []
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=3,
        is_mobile=True,
        has_touch=True,
    )
    page = context.new_page()
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.on("requestfailed", lambda request: failed.append(f"{request.url}: {request.failure}"))
    response = page.goto(url, wait_until="networkidle")
    require(response is not None and response.status == 200, "phone board did not return 200")
    page.wait_for_selector(".card", state="attached")
    require(page.locator(".card").count() == 16, "phone card count is not 16")
    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    require(overflow <= 1, f"phone horizontal overflow is {overflow}px")
    columns = page.locator(".pair").first.evaluate("el => getComputedStyle(el).gridTemplateColumns")
    require(" " not in columns.strip(), f"phone frame pair did not stack: {columns}")
    page.screenshot(path=str(proof_dir / "academy-wan-board-phone.png"), full_page=False)
    first_pair = page.locator(".pair").first
    first_pair.scroll_into_view_if_needed()
    page.wait_for_function(
        """() => [...document.querySelector('.pair').querySelectorAll('img')]
          .every(img => img.complete && img.naturalWidth === 1920 && img.naturalHeight === 1088)""",
        timeout=60_000,
    )
    first_pair.evaluate("async el => Promise.all([...el.querySelectorAll('img')].map(img => img.decode()))")
    page.evaluate("document.querySelector('.pair').scrollIntoView({block: 'start', behavior: 'instant'})")
    page.evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
    page.screenshot(path=str(proof_dir / "academy-wan-board-phone-frame-pair.png"), full_page=False)
    first_pair.locator("figure").nth(0).screenshot(path=str(proof_dir / "academy-wan-board-phone-first-frame.png"))
    first_pair.locator("figure").nth(1).screenshot(path=str(proof_dir / "academy-wan-board-phone-last-frame.png"))
    require(not errors, f"phone console errors: {errors}")
    require(not failed, f"phone failed browser requests: {failed}")
    context.close()
    return {"cards": 16, "viewport": "390x844@3", "pair": "stacked", "overflow": overflow}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--proof-dir", type=Path, default=REPO / "production" / "academy" / "wan-board-proof")
    args = parser.parse_args()
    args.proof_dir.mkdir(parents=True, exist_ok=True)
    try:
        chrome = next((candidate for candidate in CHROME_CANDIDATES if candidate.exists()), None)
        require(chrome is not None, "no installed Chrome or Edge executable was found")
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True, executable_path=str(chrome))
            desktop = validate_desktop(browser, args.url, args.proof_dir)
            phone = validate_phone(browser, args.url, args.proof_dir)
            browser.close()
        report = {"status": "VERIFIED", "url": args.url, "desktop": desktop, "phone": phone}
        (args.proof_dir / "academy-wan-board-verification.json").write_text(
            json.dumps(report, indent=2) + "\n", encoding="utf-8"
        )
        print("ACADEMY_WAN_BOARD_OK cards=16 frames=32 copy=exact tracking=persisted phone=390x844@3")
        return 0
    except Exception as error:
        print(f"ACADEMY_WAN_BOARD_RED: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
