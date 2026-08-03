"""Verify that GitHub Pages is a self-contained portfolio, not a Netlify redirect."""

from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get(
    "GH_PAGES_BASE",
    "https://mohamed3042.github.io/flagship-portfolio",
).rstrip("/")
OUT = ROOT / "artifacts" / "github-pages"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    parsed = urlparse(BASE)
    expected_origin = f"{parsed.scheme}://{parsed.netloc}"
    expected_base = parsed.path.rstrip("/")
    slugs = sorted(
        path.stem.removesuffix("-action")
        for path in (ROOT / "public" / "images" / "storybook-motion").glob("*-action.webp")
    )
    assert len(slugs) == 30, f"expected 30 project action frames, found {len(slugs)}"

    console_errors: list[str] = []
    failed_responses: list[str] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on(
            "response",
            lambda response: failed_responses.append(f"{response.status} {response.url}")
            if response.status >= 400
            else None,
        )

        page.goto(f"{BASE}/", wait_until="domcontentloaded")
        page.wait_for_timeout(500)
        root_url = urlparse(page.url)
        assert f"{root_url.scheme}://{root_url.netloc}" == expected_origin, page.url
        assert root_url.path.rstrip("/") == f"{expected_base}/en", page.url
        assert "netlify" not in page.url.lower(), f"GitHub Pages escaped to Netlify: {page.url}"

        for lang in ("en", "ar"):
            page.goto(f"{BASE}/{lang}", wait_until="domcontentloaded")
            page.locator("main h1").wait_for(state="attached")
            assert page.locator("main h1").count() == 1, f"/{lang} lost its main heading"
            assert page.locator("html").get_attribute("dir") == ("rtl" if lang == "ar" else "ltr")
            page.evaluate(
                """
                document.documentElement.dataset.world = 'disney';
                localStorage.setItem('mm-world', 'disney');
                document.dispatchEvent(new CustomEvent('mm:worldchange', {detail:{world:'disney'}}));
                """
            )
            page.wait_for_timeout(500)
            root = page.locator("[data-disney-book-home]")
            assert root.get_attribute("aria-hidden") == "false", f"Disney storybook did not activate on /{lang}"
            action_sources = root.locator("[data-action-frame]").evaluate_all(
                "els => els.map(el => new URL(el.getAttribute('src'), location.href).pathname)"
            )
            assert len(set(action_sources)) == 30, f"/{lang} exposes {len(set(action_sources))}/30 action frames"
            assert all(source.startswith(f"{expected_base}/images/") for source in action_sources), action_sources[:3]
            page.screenshot(path=OUT / f"{lang}-github-pages.png", full_page=False)

        page.close()
        request = playwright.request.new_context()
        for lang in ("en", "ar"):
            for slug in slugs:
                response = request.get(f"{BASE}/{lang}/work/{slug}")
                assert response.ok, f"route failed: /{lang}/work/{slug} {response.status}"
                html = response.text()
                lower_html = html.lower()
                assert not (
                    "http-equiv=\"refresh\"" in lower_html and "netlify.app" in lower_html
                ), f"Netlify refresh redirect leaked into {lang}/{slug}"
                assert "location.replace('https://mohamed-mahmoud-kuwait.netlify.app" not in lower_html
                assert f"{expected_base}/images/storybook-motion/{slug}-action.webp" in html

        request.dispose()
        browser.close()

    assert not console_errors, f"console errors: {console_errors}"
    assert not failed_responses, f"failed responses: {failed_responses}"
    print(json.dumps({
        "host": expected_origin,
        "base": expected_base,
        "routes": len(slugs) * 2,
        "action_frames": len(slugs),
        "redirects_to_netlify": 0,
        "console_errors": 0,
        "failed_responses": 0,
    }, indent=2))


if __name__ == "__main__":
    main()
