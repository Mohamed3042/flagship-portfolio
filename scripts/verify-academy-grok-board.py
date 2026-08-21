#!/usr/bin/env python3
"""Rendered acceptance gate for the Academy Grok comparison board."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import Browser, Page, sync_playwright


REPO = Path(__file__).resolve().parents[1]
DEFAULT_URL = (
    "http://127.0.0.1:4616/worlds/assets/academy/grok-production/"
    "GROK-GENERATION-BOARD.html"
)
STYLE_LOCK = (
    "candlelit wizarding academy storybook, parchment and brass, "
    "warm candle-gold against deep slate shadow, soft film grain"
)
PROMPT_PREFIX = "Create one continuous 15-second 16:9 cinematic video at 1080p."
DESTINATION_LOCK = (
    "If a second image is attached, treat it as the immutable final composition; "
    "otherwise follow this destination:"
)
LANDING_LOCK = "Settle by 12 seconds and hold the final composition through 15 seconds."
NEGATIVE_LOCK = (
    "No cuts, dissolves, morphing, teleportation, extra subjects, readable text, "
    "logos, subtitles, dialogue, music, or watermark."
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


def validate_jobs(page: Page) -> list[dict[str, object]]:
    jobs = page.evaluate("window.ACADEMY_GROK_JOBS")
    require(isinstance(jobs, list), "window.ACADEMY_GROK_JOBS is missing")
    require(len(jobs) == 16, f"expected 16 Grok jobs, got {len(jobs)}")
    expected_ids = [f"ACA-GROK-{index:03d}" for index in range(1, 17)]
    expected_outputs = [f"ACA-GROK-{index:03d}.mp4" for index in range(1, 17)]
    expected_pairs = [
        (FRAME_NAMES[index], FRAME_NAMES[(index + 1) % len(FRAME_NAMES)])
        for index in range(len(FRAME_NAMES))
    ]
    require([job["id"] for job in jobs] == expected_ids, "Grok IDs are not frozen")
    require([job["output"] for job in jobs] == expected_outputs, "Grok filenames are not frozen")
    require([(job["firstName"], job["lastName"]) for job in jobs] == expected_pairs, "Grok frame chain drifted")
    require(len({job["prompt"] for job in jobs}) == 16, "Grok prompts are not unique")
    for job in jobs:
        prompt = job["prompt"]
        require(prompt.startswith(PROMPT_PREFIX), f"{job['id']} prefix drift")
        require("first attached image as immutable opening geometry and art direction" in prompt, f"{job['id']} missing opening lock")
        require(DESTINATION_LOCK in prompt, f"{job['id']} missing optional second-image contract")
        require("From 1 to 12 seconds," in prompt, f"{job['id']} missing timed action")
        require(LANDING_LOCK in prompt, f"{job['id']} missing 15-second landing")
        require(STYLE_LOCK in prompt, f"{job['id']} missing style lock")
        require(NEGATIVE_LOCK in prompt, f"{job['id']} missing negative lock")
        require("camera" in prompt.lower(), f"{job['id']} missing camera move")
        require(len(prompt.split()) <= 145, f"{job['id']} exceeds 145 words")
    return jobs


def wait_for_images(page: Page) -> list[dict[str, object]]:
    page.eval_on_selector_all(".frame-link img", "imgs => imgs.forEach(img => { img.loading = 'eager'; })")
    page.wait_for_function(
        """() => [...document.querySelectorAll('.frame-link img')].length === 32 &&
        [...document.querySelectorAll('.frame-link img')]
          .every(img => img.complete && img.naturalWidth === 1920 && img.naturalHeight === 1088)""",
        timeout=60_000,
    )
    return page.eval_on_selector_all(
        ".frame-link img",
        "imgs => imgs.map(img => ({width: img.naturalWidth, height: img.naturalHeight, src: img.src}))",
    )


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
    jobs = validate_jobs(page)
    require(page.locator(".card").count() == 16, "rendered Grok card count is not 16")
    require(page.locator(".copy").count() == 16, "Grok copy button count is not 16")
    require(page.locator(".done").count() == 16, "Grok done button count is not 16")
    require(page.locator(".prompt").all_inner_texts() == [job["prompt"] for job in jobs], "rendered Grok prompts drifted")
    require(page.locator(".output code").all_inner_texts() == [job["output"] for job in jobs], "rendered Grok filenames drifted")
    require(page.locator("#job-count").inner_text() == "16", "Grok progress total is not 16")
    require(page.locator("#done-count").inner_text() == "0", "new Grok context did not start at zero")
    require(page.locator('[data-setting="resolution"]').inner_text() == "1080p", "resolution setting drifted")
    require(page.locator('[data-setting="duration"]').inner_text() == "15 seconds", "duration setting drifted")
    require(page.locator('[data-setting="aspect"]').inner_text() == "16:9", "aspect setting drifted")
    images = wait_for_images(page)
    require(len(images) == 32, "Grok board did not decode all 32 images")

    page.locator(".copy").first.click()
    require(page.evaluate("navigator.clipboard.readText()") == jobs[0]["prompt"], "Grok copy button changed prompt bytes")
    page.locator(".done").first.click()
    require(page.locator("#done-count").inner_text() == "1", "Grok done count did not increment")
    page.reload(wait_until="networkidle")
    require(page.locator("#done-count").inner_text() == "1", "Grok done state did not persist")
    page.locator('[data-state-filter="done"]').click()
    require(page.locator(".card:visible").count() == 1, "Grok Done filter failed")
    page.locator('[data-state-filter="pending"]').click()
    require(page.locator(".card:visible").count() == 15, "Grok Pending filter failed")
    page.locator('[data-state-filter="all"]').click()
    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    require(overflow <= 1, f"desktop Grok overflow is {overflow}px")
    page.evaluate("document.querySelector('.card').scrollIntoView({block: 'start', behavior: 'instant'})")
    page.evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
    page.screenshot(path=str(proof_dir / "academy-grok-board-desktop.png"), full_page=False)
    require(not errors, f"Grok desktop console errors: {errors}")
    require(not failed, f"Grok desktop failed requests: {failed}")
    context.close()
    return {"cards": 16, "images": 32, "clipboard": "exact", "tracking": "persisted", "overflow": overflow}


def validate_phone(browser: Browser, url: str, proof_dir: Path) -> dict[str, object]:
    errors: list[str] = []
    failed: list[str] = []
    context = browser.new_context(
        viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True, has_touch=True
    )
    page = context.new_page()
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.on("requestfailed", lambda request: failed.append(f"{request.url}: {request.failure}"))
    response = page.goto(url, wait_until="networkidle")
    require(response is not None and response.status == 200, "phone Grok board did not return 200")
    page.wait_for_selector(".card", state="attached")
    require(page.locator(".card").count() == 16, "phone Grok card count is not 16")
    overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    require(overflow <= 1, f"phone Grok overflow is {overflow}px")
    columns = page.locator(".pair").first.evaluate("el => getComputedStyle(el).gridTemplateColumns")
    require(" " not in columns.strip(), f"phone Grok frames did not stack: {columns}")
    page.screenshot(path=str(proof_dir / "academy-grok-board-phone.png"), full_page=False)
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
    page.screenshot(path=str(proof_dir / "academy-grok-board-phone-frame-pair.png"), full_page=False)
    require(not errors, f"Grok phone console errors: {errors}")
    require(not failed, f"Grok phone failed requests: {failed}")
    context.close()
    return {"cards": 16, "viewport": "390x844@3", "pair": "stacked", "overflow": overflow}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--proof-dir", type=Path, default=REPO / "production" / "academy" / "grok-board-proof")
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
        (args.proof_dir / "academy-grok-board-verification.json").write_text(
            json.dumps(report, indent=2) + "\n", encoding="utf-8"
        )
        print("ACADEMY_GROK_BOARD_OK cards=16 frames=32 1080p=locked duration=15s aspect=16:9 copy=exact tracking=persisted")
        return 0
    except Exception as error:
        print(f"ACADEMY_GROK_BOARD_RED: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
