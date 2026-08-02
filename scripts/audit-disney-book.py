"""Fail closed on the rendered bilingual storybook experience."""

from __future__ import annotations

import json
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = os.environ.get("STORYBOOK_BASE", "http://127.0.0.1:4321").rstrip("/")
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "storybook-cinema"


def activate_disney(page) -> None:
    page.evaluate(
        """
        document.documentElement.dataset.world = 'disney';
        localStorage.setItem('mm-world', 'disney');
        document.dispatchEvent(new CustomEvent('mm:worldchange', {detail:{world:'disney'}}));
        """
    )
    page.wait_for_timeout(450)


def scroll_to_progress(page, selector: str, progress: float) -> None:
    page.eval_on_selector(
        selector,
        """(element, progress) => {
          const top = element.getBoundingClientRect().top + scrollY;
          const travel = Math.max(element.offsetHeight - innerHeight, 1);
          scrollTo({top: top + travel * progress, behavior: 'instant'});
        }""",
        progress,
    )
    page.wait_for_timeout(500)


def capture_home(browser, lang: str, width: int, height: int) -> dict:
    page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
    errors: list[str] = []
    failed: list[str] = []
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("response", lambda response: failed.append(f"{response.status} {response.url}") if response.status >= 400 else None)
    page.goto(f"{BASE}/{lang}", wait_until="networkidle")
    activate_disney(page)

    root = page.locator("[data-disney-book-home]")
    assert root.get_attribute("aria-hidden") == "false", "Disney home did not activate"
    assert root.locator("[data-story-panorama]").count() == 30
    sources = root.locator(".sb-panorama:not(.sb-panorama--near)").evaluate_all(
        "els => els.map(el => new URL(el.getAttribute('src'), location.href).pathname)"
    )
    assert len(set(sources)) == 30, f"expected 30 unique panorama sources, got {len(set(sources))}"
    for src in sources:
        response = page.request.get(f"{BASE}{src}")
        assert response.ok, f"art failed: {src} {response.status}"

    film = "[data-book-film]"
    scroll_to_progress(page, film, 0.02)
    page.screenshot(path=OUT / f"{lang}-{'mobile' if width < 700 else 'desktop'}-book-closed.png", full_page=False)
    scroll_to_progress(page, film, 0.48)
    page.screenshot(path=OUT / f"{lang}-{'mobile' if width < 700 else 'desktop'}-book-opening.png", full_page=False)

    first = '[data-project-chapter="career-autopilot"]'
    scroll_to_progress(page, first, 0.08)
    before = page.locator(f"{first} .sb-camera").evaluate("el => getComputedStyle(el).transform")
    assert page.locator(first).get_attribute("data-active-beat") == "problem"
    scroll_to_progress(page, first, 0.52)
    middle = page.locator(f"{first} .sb-camera").evaluate("el => getComputedStyle(el).transform")
    assert before != middle, "camera did not scrub with scroll"
    assert page.locator(first).get_attribute("data-active-beat") == "intervention"
    page.screenshot(path=OUT / f"{lang}-{'mobile' if width < 700 else 'desktop'}-career-intervention.png", full_page=False)
    scroll_to_progress(page, first, 0.78)
    assert page.locator(first).get_attribute("data-active-beat") == "outcome"

    reclaim = '[data-project-chapter="reclaim"]'
    scroll_to_progress(page, reclaim, 0.76)
    page.screenshot(path=OUT / f"{lang}-{'mobile' if width < 700 else 'desktop'}-reclaim-outcome.png", full_page=False)
    overflow = page.evaluate("Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth")
    assert overflow <= 2, f"horizontal overflow: {overflow}px"
    if lang == "ar":
        assert page.locator("html").get_attribute("dir") == "rtl"
    page.close()
    return {"lang": lang, "viewport": [width, height], "errors": errors, "failed": failed, "unique_art": len(set(sources))}


def capture_detail(browser, lang: str, slug: str, width: int, height: int) -> dict:
    page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
    errors: list[str] = []
    failed: list[str] = []
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("response", lambda response: failed.append(f"{response.status} {response.url}") if response.status >= 400 else None)
    page.goto(f"{BASE}/{lang}/work/{slug}", wait_until="networkidle")
    activate_disney(page)
    root = page.locator(f'[data-project-film="{slug}"]')
    assert root.get_attribute("aria-hidden") == "false"
    assert root.locator("[data-film-act]").count() == 4
    assert root.locator("[data-film-step]").count() == 4
    intervention = '[data-project-film] [data-film-act="intervention"]'
    scroll_to_progress(page, intervention, 0.62)
    active_step = page.locator(intervention).get_attribute("data-active-step")
    geometry = page.locator(intervention).evaluate(
        "el => ({top:el.getBoundingClientRect().top,height:el.getBoundingClientRect().height,scrollY,viewport:innerHeight,filmP:getComputedStyle(el).getPropertyValue('--film-p')})"
    )
    assert active_step == "2", f"expected intervention step 2, got {active_step}; geometry={geometry}"
    page.screenshot(path=OUT / f"{lang}-{slug}-detail.png", full_page=False)
    overflow = page.evaluate("Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth")
    assert overflow <= 2, f"detail horizontal overflow: {overflow}px"
    page.close()
    return {"lang": lang, "slug": slug, "errors": errors, "failed": failed}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    project_slugs = sorted(path.stem for path in (ROOT / "public" / "images" / "storybook").glob("*.webp") if path.stem != "opening-book")
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, channel="chrome")
        results = [
            capture_home(browser, "en", 1440, 900),
            capture_home(browser, "ar", 390, 844),
            capture_detail(browser, "en", "career-autopilot", 1440, 900),
            capture_detail(browser, "ar", "reclaim", 390, 844),
        ]
        page = browser.new_page()
        for lang in ("en", "ar"):
            for slug in project_slugs:
                response = page.request.get(f"{BASE}/{lang}/work/{slug}")
                assert response.ok, f"route failed: {lang}/{slug} {response.status}"
                html = response.text()
                assert f'data-project-film="{slug}"' in html, f"film missing: {lang}/{slug}"
        page.close()
        browser.close()
    all_errors = [item for result in results for item in result["errors"]]
    all_failed = [item for result in results for item in result["failed"]]
    assert not all_errors, f"console errors: {all_errors}"
    assert not all_failed, f"failed responses: {all_failed}"
    print(json.dumps({"passes": len(results), "routes": len(project_slugs) * 2, "screenshots": len(list(OUT.glob('*.png'))), "errors": 0, "failed_responses": 0}, indent=2))


if __name__ == "__main__":
    main()
