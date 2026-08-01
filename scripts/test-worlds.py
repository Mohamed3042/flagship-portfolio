"""Exercise the shared identity-world engine in both languages and viewports.

The 26-story click test proves route/content integrity. This companion test
proves that a world can be selected once, survives navigation, preserves the
same content, remains bilingual, and does not introduce viewport overflow.
"""

import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


WORLDS = ["astronomy", "razer", "disney", "cod", "netflix", "spotify", "apple", "samsung"]
AUTOMATION = ["career-autopilot", "lifeos", "medmac-document-studio", "medmac-box-studio", "cake-studio", "quotations-locker", "reclaim", "sheep-cycle", "resume-builder-skill", "polyblast-arena"]
FOUNDATION = ["meta-ads", "al-maali", "crm", "brand-system", "sheep-app", "hr-system", "medmac-website", "ai-workflow", "my-resume"]
LAB = ["b2mh", "artillery3d", "war-strikes", "uberstrike-restoration", "cocolani-3d", "job-apply-engine", "portfolio-design-system"]
ALL_STORIES = AUTOMATION + FOUNDATION + LAB
REPRESENTATIVE_STORIES = [AUTOMATION[0], LAB[-1]]
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4321")
    parser.add_argument("--viewport", choices=("desktop", "mobile"), default="desktop")
    parser.add_argument("--all-stories", action="store_true")
    parser.add_argument("--worlds", default=",".join(WORLDS), help="Comma-separated world shard")
    args = parser.parse_args()

    viewport = {"width": 1440, "height": 900} if args.viewport == "desktop" else {"width": 390, "height": 844}
    base = args.base_url.rstrip("/")
    worlds = [world.strip() for world in args.worlds.split(",") if world.strip()]
    unknown = sorted(set(worlds) - set(WORLDS))
    if unknown:
        raise SystemExit(f"Unknown worlds: {', '.join(unknown)}")
    stories = ALL_STORIES if args.all_stories else REPRESENTATIVE_STORIES
    failures: list[str] = []
    console_errors: list[str] = []
    bad_responses: list[str] = []
    checks = 0

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=str(CHROME), args=["--disable-gpu"])
        context = browser.new_context(viewport=viewport, device_scale_factor=1)

        def fresh_page():
            candidate = context.new_page()
            candidate.on("console", lambda msg: console_errors.append(f"{candidate.url}: {msg.text}") if msg.type == "error" else None)
            candidate.on("pageerror", lambda error: console_errors.append(f"{candidate.url}: {error}"))
            candidate.on("response", lambda response: bad_responses.append(f"{response.status} {response.url}") if response.status >= 400 else None)
            return candidate

        page = fresh_page()

        page.goto(f"{base}/en", wait_until="networkidle")
        page.evaluate("localStorage.setItem('mm-world','astronomy'); localStorage.setItem('mm-mode','dark')")
        page.reload(wait_until="networkidle")

        # Select through the real listbox once per world, then prove the choice
        # survives both language and story-route navigation.
        for world in worlds:
            page.goto(f"{base}/en", wait_until="networkidle")
            page.locator("[data-world-btn]").click()
            if page.locator("[data-world-opt]").count() != len(WORLDS):
                failures.append(f"{args.viewport}: selector does not expose eight worlds")
            page.locator(f'[data-world-opt="{world}"]').click()
            page.wait_for_timeout(900)
            if page.locator("html").get_attribute("data-world") != world:
                failures.append(f"{args.viewport}: selector failed to apply {world}")
            selected = page.locator('[data-world-opt][aria-selected="true"]')
            if selected.count() != 1 or selected.get_attribute("data-world-opt") != world:
                failures.append(f"{args.viewport}: {world} does not have one selected option")

            for lang in ("en", "ar"):
                direction = "ltr" if lang == "en" else "rtl"
                page.goto(f"{base}/{lang}", wait_until="networkidle")
                if page.locator("html").get_attribute("data-world") != world:
                    failures.append(f"{args.viewport}: {world} did not persist to /{lang}")
                if page.locator("html").get_attribute("dir") != direction:
                    failures.append(f"{args.viewport}: /{lang} direction changed under {world}")
                if page.locator("main h1").count() != 1:
                    failures.append(f"{args.viewport}: /{lang} has the wrong main h1 count under {world}")
                overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
                if overflow > 2:
                    failures.append(f"{args.viewport}: /{lang} has {overflow}px overflow under {world}")
                mode_hidden = page.locator("[data-mode-btn]").get_attribute("hidden") is not None
                if mode_hidden != (world != "astronomy"):
                    failures.append(f"{args.viewport}: appearance control visibility is wrong under {world}")

                for story_index, slug in enumerate(stories):
                    # The portfolio intentionally runs several perpetual canvas
                    # and GSAP engines. Recycling the page keeps exhaustive
                    # multi-world audits bounded without losing localStorage.
                    if args.all_stories and story_index and story_index % 8 == 0:
                        page.close()
                        page = fresh_page()
                    page.goto(f"{base}/{lang}/work/{slug}", wait_until="networkidle")
                    if page.locator("html").get_attribute("data-world") != world:
                        failures.append(f"{args.viewport}: {world} did not persist to /{lang}/work/{slug}")
                    if page.locator("main h1").count() != 1:
                        failures.append(f"{args.viewport}: /{lang}/work/{slug} lost its h1 under {world}")
                    if slug in AUTOMATION + LAB and page.locator("article.system-story").count() != 1:
                        failures.append(f"{args.viewport}: /{lang}/work/{slug} lost its shared story spine under {world}")
                    overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
                    if overflow > 2:
                        failures.append(f"{args.viewport}: /{lang}/work/{slug} has {overflow}px overflow under {world}")
                    checks += 1

        # Astronomy alone owns light/dark appearance; the stored choice should
        # return after a branded world forces its authored dark environment.
        page.goto(f"{base}/en", wait_until="networkidle")
        page.evaluate("localStorage.setItem('mm-world','astronomy'); localStorage.setItem('mm-mode','light')")
        page.reload(wait_until="networkidle")
        if page.locator("html").get_attribute("data-theme") != "light":
            failures.append(f"{args.viewport}: Astronomy did not restore its stored light appearance")
        page.locator("[data-world-btn]").click()
        page.locator('[data-world-opt="razer"]').click()
        page.wait_for_timeout(900)
        if page.locator("html").get_attribute("data-theme") is not None:
            failures.append(f"{args.viewport}: branded world inherited Astronomy light mode")
        page.locator("[data-world-btn]").click()
        page.locator('[data-world-opt="astronomy"]').click()
        page.wait_for_timeout(900)
        if page.locator("html").get_attribute("data-theme") != "light":
            failures.append(f"{args.viewport}: Astronomy light mode did not return after world travel")

        context.close()
        browser.close()

    failures.extend(f"console: {message}" for message in sorted(set(console_errors)))
    failures.extend(f"response: {message}" for message in sorted(set(bad_responses)))
    report = {
        "viewport": args.viewport,
        "worlds": len(worlds),
        "stories_per_language": len(stories),
        "story_language_world_checks": checks,
        "console_errors": len(set(console_errors)),
        "bad_responses": len(set(bad_responses)),
        "failures": failures,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
