"""Capture and verify the real rendered home and story cinematics for every world."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright


WORLDS = ["astronomy", "razer", "disney", "cod", "netflix", "spotify", "apple", "samsung"]
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4322")
    parser.add_argument("--output", type=Path, default=Path("artifacts/cinematic-worlds"))
    parser.add_argument("--language", choices=("en", "ar"), default="en")
    parser.add_argument("--width", type=int, default=1440)
    parser.add_argument("--height", type=int, default=900)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    failures: list[str] = []
    report: dict[str, object] = {}
    base = args.base_url.rstrip("/")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=str(CHROME), args=["--disable-gpu"])
        for world in WORLDS:
            context = browser.new_context(viewport={"width": args.width, "height": args.height}, device_scale_factor=1)
            context.add_init_script(f"localStorage.setItem('mm-world', {json.dumps(world)})")
            page = context.new_page()
            console_errors: list[str] = []
            bad_responses: list[str] = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda error: console_errors.append(str(error)))
            page.on("response", lambda response: bad_responses.append(f"{response.status} {response.url}") if response.status >= 400 else None)

            page.goto(f"{base}/{args.language}", wait_until="networkidle")
            if page.locator("html").get_attribute("data-world") != world:
                failures.append(f"{world}: home did not load the requested world")
            if page.locator("main h1").count() != 1:
                failures.append(f"{world}: home changed the one-h1 contract")

            if world == "astronomy":
                if page.locator(".hh").evaluate("el => getComputedStyle(el).display") == "none":
                    failures.append("astronomy: incumbent hero is hidden")
                if page.locator(".astronomy-journey").evaluate("el => getComputedStyle(el).display") == "none":
                    failures.append("astronomy: incumbent journey is hidden")
            else:
                active = page.locator(f'[data-world-journey="{world}"]')
                if active.evaluate("el => getComputedStyle(el).display") == "none":
                    failures.append(f"{world}: cinematic home is hidden")
                if page.locator(".hh").evaluate("el => getComputedStyle(el).display") != "none":
                    failures.append(f"{world}: incumbent hero leaked through")
                if page.locator(".astronomy-journey").evaluate("el => getComputedStyle(el).display") != "none":
                    failures.append(f"{world}: astronomy journey leaked through")
                if active.locator('[role="heading"][aria-level="1"]').count() < 1:
                    failures.append(f"{world}: cinematic home has no active lead heading")

            overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
            if overflow > 2:
                failures.append(f"{world}: home has {overflow}px horizontal overflow")
            page.wait_for_timeout(500)
            page.screenshot(path=str(args.output / f"{world}-{args.language}-home.jpg"), type="jpeg", quality=88)

            if world != "astronomy":
                stage = page.locator(f'[data-world-journey="{world}"] [data-world-stage]').first
                before = float(stage.evaluate("el => getComputedStyle(el).getPropertyValue('--p') || '0'"))
                page.evaluate("window.scrollTo({top: innerHeight * 1.15, behavior: 'instant'})")
                page.wait_for_timeout(450)
                after = float(stage.evaluate("el => getComputedStyle(el).getPropertyValue('--p') || '0'"))
                if after <= before:
                    failures.append(f"{world}: scroll did not advance the cinematic stage ({before} -> {after})")
                page.screenshot(path=str(args.output / f"{world}-{args.language}-motion.jpg"), type="jpeg", quality=88)

            page.goto(f"{base}/{args.language}/work/career-autopilot", wait_until="networkidle")
            if world == "astronomy":
                if page.locator(".system-story--astronomy").evaluate("el => getComputedStyle(el).display") == "none":
                    failures.append("astronomy: original project spine is hidden")
            else:
                active_story = page.locator(f'[data-story-world="{world}"]')
                if active_story.evaluate("el => getComputedStyle(el).display") == "none":
                    failures.append(f"{world}: project cinematic is hidden")
                if page.locator(".system-story--astronomy").evaluate("el => getComputedStyle(el).display") != "none":
                    failures.append(f"{world}: original project spine leaked through")
            if page.locator("main h1").count() != 1:
                failures.append(f"{world}: story changed the one-h1 contract")
            overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
            if overflow > 2:
                failures.append(f"{world}: story has {overflow}px horizontal overflow")
            page.wait_for_timeout(500)
            page.screenshot(path=str(args.output / f"{world}-{args.language}-story.jpg"), type="jpeg", quality=88)

            if console_errors:
                failures.append(f"{world}: console errors: {console_errors}")
            if bad_responses:
                failures.append(f"{world}: bad responses: {bad_responses}")
            report[world] = {"console_errors": len(console_errors), "bad_responses": len(bad_responses)}
            context.close()
        browser.close()

    print(json.dumps({"worlds": report, "failures": failures}, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
