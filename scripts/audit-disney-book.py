"""Fail-closed rendered audit for the cinematic Disney storybook world."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4327")
    parser.add_argument("--output", type=Path, default=Path("artifacts/disney-book"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    base = args.base_url.rstrip("/")
    failures: list[str] = []
    evidence: dict[str, object] = {}

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=str(CHROME), args=["--disable-gpu"])

        for lang, viewport in (("en", {"width": 1440, "height": 900}), ("ar", {"width": 390, "height": 844})):
            context = browser.new_context(viewport=viewport, device_scale_factor=1)
            context.add_init_script("localStorage.setItem('mm-world','disney')")
            page = context.new_page()
            console_errors: list[str] = []
            bad_responses: list[str] = []
            page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
            page.on("pageerror", lambda error: console_errors.append(str(error)))
            page.on("response", lambda response: bad_responses.append(f"{response.status} {response.url}") if response.status >= 400 else None)

            page.goto(f"{base}/{lang}", wait_until="networkidle")
            home = page.locator("[data-disney-book-home]")
            if home.count() != 1:
                failures.append(f"{lang}: cinematic book home missing")
                context.close()
                continue
            if home.get_attribute("aria-hidden") != "false":
                failures.append(f"{lang}: cinematic book home is not active")
            chapters = home.locator("[data-project-chapter]")
            slugs = chapters.evaluate_all("els => els.map(el => el.getAttribute('data-project-chapter'))")
            if len(slugs) != 30 or len(set(slugs)) != 30:
                failures.append(f"{lang}: expected 30 unique project chapters, found {len(slugs)}/{len(set(slugs))}")
            scenes = chapters.evaluate_all("els => [...new Set(els.map(el => el.getAttribute('data-scene')))]")
            if len(scenes) < 8:
                failures.append(f"{lang}: only {len(scenes)} visual realms found")
            home_kinetics = home.locator("[data-project-kinetic]").count()
            if home_kinetics != 30:
                failures.append(f"{lang}: every home chapter must have one unique kinetic mechanism")
            if page.locator("main h1").count() != 1:
                failures.append(f"{lang}: one-h1 contract failed")
            overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
            if overflow > 2:
                failures.append(f"{lang}: home has {overflow}px horizontal overflow")

            first_stage = home.locator("[data-world-stage]").first
            before = float(first_stage.evaluate("el => getComputedStyle(el).getPropertyValue('--p') || '0'"))
            page.evaluate("window.scrollTo({top: innerHeight * 1.12, behavior: 'instant'})")
            page.wait_for_timeout(350)
            after = float(first_stage.evaluate("el => getComputedStyle(el).getPropertyValue('--p') || '0'"))
            if after <= before + 0.15:
                failures.append(f"{lang}: cover camera did not advance enough ({before} -> {after})")

            page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
            page.wait_for_timeout(250)
            page.screenshot(path=str(args.output / f"{lang}-01-cover.jpg"), type="jpeg", quality=90)
            portal = home.locator(".db-portal")
            portal.evaluate("el => scrollTo({top: scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * .56, behavior: 'instant'})")
            page.wait_for_timeout(350)
            page.screenshot(path=str(args.output / f"{lang}-02-book-portal.jpg"), type="jpeg", quality=90)
            manuscript = home.locator(".db-manuscript__title")
            manuscript.scroll_into_view_if_needed()
            page.wait_for_timeout(250)
            page.screenshot(path=str(args.output / f"{lang}-03-manuscript.jpg"), type="jpeg", quality=90)
            chapter = home.locator('[data-project-chapter="career-autopilot"]')
            chapter.evaluate("el => scrollTo({top: scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * .48, behavior: 'instant'})")
            page.wait_for_timeout(400)
            progress = float(chapter.evaluate("el => getComputedStyle(el).getPropertyValue('--chapter-p') || '0'"))
            if progress <= 0.05:
                failures.append(f"{lang}: project page did not receive scroll-linked chapter progress")
            page.screenshot(path=str(args.output / f"{lang}-04-project-page.jpg"), type="jpeg", quality=90)

            page.goto(f"{base}/{lang}/work/career-autopilot", wait_until="networkidle")
            story = page.locator("[data-disney-project-book]")
            if story.count() != 1 or story.get_attribute("aria-hidden") != "false":
                failures.append(f"{lang}: cinematic project book missing or inactive")
            step_count = story.locator("[data-book-step]").count()
            if step_count != 4:
                failures.append(f"{lang}: expected four story scenes, found {step_count}")
            kinetic_count = story.locator('[data-project-kinetic][data-kinetic="career-autopilot"]').count()
            if kinetic_count < 6:
                failures.append(f"{lang}: expected project-specific art on cover, opening, and four scenes; found {kinetic_count}")
            if story.locator("[data-story-stage]").count() != 7:
                failures.append(f"{lang}: storybook must expose seven cinematic scroll stages")
            story_overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
            if story_overflow > 2:
                failures.append(f"{lang}: story has {story_overflow}px horizontal overflow")
            if page.locator("main h1").count() != 1:
                failures.append(f"{lang}: story broke the one-h1 contract")
            page.screenshot(path=str(args.output / f"{lang}-05-story-cover.jpg"), type="jpeg", quality=90)
            opening = story.locator(".dpb-opening-stage")
            opening.evaluate("el => scrollTo({top: scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * .56, behavior: 'instant'})")
            page.wait_for_timeout(400)
            page.screenshot(path=str(args.output / f"{lang}-06-story-opening.jpg"), type="jpeg", quality=90)
            first_step = story.locator('[data-book-step="1"]')
            first_step.evaluate("el => scrollTo({top: scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * .52, behavior: 'instant'})")
            page.wait_for_timeout(400)
            page.screenshot(path=str(args.output / f"{lang}-07-story-scene.jpg"), type="jpeg", quality=90)

            if console_errors:
                failures.append(f"{lang}: console errors: {console_errors}")
            if bad_responses:
                failures.append(f"{lang}: bad responses: {bad_responses}")
            evidence[lang] = {
                "viewport": viewport,
                "chapters": len(slugs),
                "realms": len(scenes),
                "home_kinetics": home_kinetics,
                "story_stages": story.locator("[data-story-stage]").count(),
                "story_kinetics": kinetic_count,
                "cover_progress": [before, after],
                "chapter_progress": progress,
                "console_errors": len(console_errors),
                "bad_responses": len(bad_responses),
            }
            context.close()

        browser.close()

    result = {"evidence": evidence, "failures": failures}
    print(json.dumps(result, indent=2, ensure_ascii=False))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
