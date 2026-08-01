"""Click every bilingual portfolio story with native Playwright.

Run against a local preview (default) or a deployed origin:
  python scripts/test-portfolio.py --base-url http://127.0.0.1:4321 --viewport desktop
"""

import argparse
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright


AUTOMATION = [
    "career-autopilot",
    "lifeos",
    "medmac-document-studio",
    "medmac-box-studio",
    "cake-studio",
    "quotations-locker",
    "reclaim",
    "sheep-cycle",
    "resume-builder-skill",
    "polyblast-arena",
]
FOUNDATION = [
    "meta-ads",
    "al-maali",
    "crm",
    "brand-system",
    "sheep-app",
    "hr-system",
    "medmac-website",
    "ai-workflow",
    "my-resume",
]
LAB = [
    "b2mh",
    "artillery3d",
    "war-strikes",
    "uberstrike-restoration",
    "cocolani-3d",
    "job-apply-engine",
    "portfolio-design-system",
]
SLUGS = AUTOMATION + FOUNDATION + LAB
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4321")
    parser.add_argument("--viewport", choices=("desktop", "mobile"), default="desktop")
    parser.add_argument("--screenshots", default="artifacts/screenshots")
    parser.add_argument("--screenshots-only", action="store_true")
    args = parser.parse_args()

    viewport = {"width": 1440, "height": 1000} if args.viewport == "desktop" else {"width": 390, "height": 844}
    failures: list[str] = []
    console_errors: list[str] = []
    bad_responses: list[str] = []
    clicked = 0
    screenshot_dir = Path(args.screenshots)
    screenshot_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=str(CHROME),
            args=["--disable-gpu"],
        )
        context = browser.new_context(viewport=viewport, device_scale_factor=1)
        page = context.new_page()
        page.on("console", lambda msg: console_errors.append(f"{page.url}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda error: console_errors.append(f"{page.url}: {error}"))
        page.on("response", lambda response: bad_responses.append(f"{response.status} {response.url}") if response.status >= 400 else None)

        for lang in ("en", "ar"):
            home_url = f"{args.base_url.rstrip('/')}/{lang}"
            page.goto(home_url, wait_until="networkidle")
            expected_dir = "rtl" if lang == "ar" else "ltr"
            if page.locator("html").get_attribute("dir") != expected_dir:
                failures.append(f"/{lang} has the wrong direction")

            found = {
                urlparse(href).path.rstrip("/")
                for href in page.locator(f'a[href*="/{lang}/work/"]').evaluate_all(
                    "els => els.map(el => el.href)"
                )
            }
            expected = {f"/{lang}/work/{slug}" for slug in SLUGS}
            if found != expected:
                failures.append(f"/{lang} story-link set differs: missing={sorted(expected-found)}, extra={sorted(found-expected)}")

            page.wait_for_timeout(1_600)
            page.screenshot(path=str(screenshot_dir / f"home-{lang}-{args.viewport}.png"), full_page=False)

            for section in ("work", "foundation", "lab"):
                page.locator(f"#{section}").evaluate("el => el.scrollIntoView({block: 'start'})")
                # The incumbent site uses inertial Lenis scrolling; wait for the
                # destination to settle before capturing the viewport.
                page.wait_for_timeout(1_800)
                page.screenshot(path=str(screenshot_dir / f"{section}-{lang}-{args.viewport}.png"), full_page=False)

            for slug in ([] if args.screenshots_only else SLUGS):
                page.goto(home_url, wait_until="networkidle")
                href = f"/{lang}/work/{slug}"
                link = page.locator(f'a[href="{href}"]').first
                try:
                    if args.viewport == "mobile" and slug in AUTOMATION:
                        progress = AUTOMATION.index(slug) / (len(AUTOMATION) - 1)
                        page.evaluate(
                            """p => {
                              const section = document.querySelector('#work');
                              const travel = section.offsetHeight - innerHeight;
                              window.scrollTo(0, section.offsetTop + travel * p);
                            }""",
                            progress,
                        )
                        page.wait_for_timeout(350)
                    else:
                        link.scroll_into_view_if_needed(timeout=10_000)
                    link.click(timeout=10_000)
                    page.wait_for_url(f"**{href}", timeout=10_000)
                    page.wait_for_load_state("networkidle")
                    clicked += 1
                except Exception as error:  # Playwright includes route and action context.
                    failures.append(f"click failed for {href}: {error}")
                    continue

                if page.locator("html").get_attribute("lang") != lang:
                    failures.append(f"{href} has the wrong html language")
                if page.locator("html").get_attribute("dir") != expected_dir:
                    failures.append(f"{href} has the wrong direction")
                if page.locator("h1").count() != 1 or not page.locator("h1").inner_text().strip():
                    failures.append(f"{href} does not have one visible h1")
                main_text = page.locator("main").inner_text().strip()
                if len(main_text) < 250:
                    failures.append(f"{href} does not render substantive story content")
                if slug in AUTOMATION + LAB and page.locator("article.system-story").count() != 1:
                    failures.append(f"{href} does not render the shared systems-story spine")
                overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                if overflow > 2:
                    failures.append(f"{href} has {overflow}px horizontal overflow at {args.viewport}")
                mirror = "ar" if lang == "en" else "en"
                if page.locator(f'a[href="/{mirror}/work/{slug}"]').count() < 1:
                    failures.append(f"{href} is missing its mirrored-language route")

        for lang, slug in (("en", "career-autopilot"), ("ar", "lifeos"), ("en", "b2mh"), ("ar", "job-apply-engine")):
            page.goto(f"{args.base_url.rstrip('/')}/{lang}/work/{slug}", wait_until="networkidle")
            page.screenshot(path=str(screenshot_dir / f"story-{lang}-{slug}-{args.viewport}.png"), full_page=False)

        browser.close()

    # A browser may cancel assets during Astro view transitions; only HTTP errors
    # are collected here, and duplicates are collapsed for a readable report.
    bad_responses = sorted(set(bad_responses))
    console_errors = sorted(set(console_errors))
    if console_errors:
        failures.extend(f"console: {message}" for message in console_errors)
    if bad_responses:
        failures.extend(f"response: {message}" for message in bad_responses)

    report = {
        "viewport": args.viewport,
        "clicked": clicked,
        "expected_clicks": 0 if args.screenshots_only else len(SLUGS) * 2,
        "console_errors": len(console_errors),
        "bad_responses": len(bad_responses),
        "failures": failures,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    expected_clicks = 0 if args.screenshots_only else len(SLUGS) * 2
    if failures or clicked != expected_clicks:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
