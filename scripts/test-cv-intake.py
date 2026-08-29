#!/usr/bin/env python3
"""Browser acceptance gate for the static CV facts intake."""

from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import Browser, Locator, Page, Playwright, sync_playwright


BASE_URL = os.environ.get(
    "CV_INTAKE_BASE_URL", "http://127.0.0.1:4173/cv-intake/"
)
ARTIFACT_DIR = Path(__file__).resolve().parents[1] / "artifacts" / "cv-intake"


def launch_browser(playwright: Playwright) -> Browser:
    """Prefer Playwright Chromium, then the machine's installed Chrome."""
    try:
        return playwright.chromium.launch(headless=True)
    except Exception as chromium_error:
        try:
            return playwright.chromium.launch(channel="chrome", headless=True)
        except Exception as chrome_error:
            raise AssertionError(
                "No Playwright Chromium or installed Chrome could launch. "
                f"chromium={chromium_error}; chrome={chrome_error}"
            ) from chrome_error


def first_visible(locator: Locator, label: str) -> Locator:
    for index in range(locator.count()):
        candidate = locator.nth(index)
        if candidate.is_visible():
            return candidate
    raise AssertionError(f"No visible {label} found")


def reveal_collapsed_content(page: Page) -> None:
    show_all = page.locator('button[data-filter="all"]')
    if show_all.count() == 1 and show_all.is_visible():
        show_all.click()
    page.locator("details").evaluate_all(
        "elements => elements.forEach(element => { element.open = true; })"
    )


def owning_card(page: Page, control: Locator) -> tuple[str, Locator]:
    field_id = control.evaluate(
        "element => element.closest('article.fact-card[data-field-id]')?.dataset.fieldId"
    )
    assert field_id, "Interactive control is not owned by a fact card"
    return field_id, card_by_field_id(page, field_id)


def card_by_field_id(page: Page, field_id: str) -> Locator:
    assert '"' not in field_id, f"Unsafe quote in field id: {field_id}"
    return page.locator(
        f'article.fact-card[data-field-id="{field_id}"]'
    ).first


def assert_no_horizontal_overflow(page: Page, viewport_name: str) -> None:
    overflow = page.evaluate(
        """() => ({
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth
        })"""
    )
    widest = max(overflow["document"], overflow["body"])
    assert widest <= overflow["viewport"] + 1, (
        f"{viewport_name} has horizontal overflow: "
        f"viewport={overflow['viewport']} widest={widest}"
    )


def exercise_locked_fact(page: Page) -> str:
    change = first_visible(
        page.locator('button[data-action="change"]'), "Change button"
    )
    field_id, _ = owning_card(page, change)
    change.click()

    card = card_by_field_id(page, field_id)
    editor = first_visible(
        card.locator(
            "input:not([type=hidden]):not([type=button]):not([type=submit]), "
            "textarea, select"
        ),
        f"editor for {field_id}",
    )
    assert editor.is_enabled(), f"Editor for {field_id} stayed disabled after Change"
    assert not editor.get_attribute("readonly"), (
        f"Editor for {field_id} stayed readonly after Change"
    )

    tag_name = editor.evaluate("element => element.tagName.toLowerCase()")
    input_type = (editor.get_attribute("type") or "").lower()
    if tag_name == "select":
        current = editor.input_value()
        options = editor.locator("option").all()
        replacement = next(
            (
                option.get_attribute("value")
                for option in options
                if option.get_attribute("value") not in {None, "", current, "other"}
            ),
            current,
        )
        if replacement:
            editor.select_option(replacement)
    elif input_type in {"checkbox", "radio"}:
        if input_type == "checkbox":
            editor.set_checked(editor.is_checked())
        else:
            editor.check()
    else:
        current = editor.input_value()
        editor.fill(current or "Browser test")

    save = first_visible(
        card.locator('button[data-action="save-lock"]'),
        f"Save & lock button for {field_id}",
    )
    save.click()

    card = card_by_field_id(page, field_id)
    first_visible(
        card.locator('button[data-action="change"]'),
        f"restored Change button for {field_id}",
    )
    visible_editors = [
        card.locator(
            "input:not([type=hidden]):not([type=button]):not([type=submit]), "
            "textarea, select"
        ).nth(index)
        for index in range(
            card.locator(
                "input:not([type=hidden]):not([type=button]):not([type=submit]), "
                "textarea, select"
            ).count()
        )
    ]
    assert not any(editor.is_visible() and editor.is_enabled() for editor in visible_editors), (
        f"Editable control for {field_id} remained open after Save & lock"
    )
    return field_id


def exercise_other_answer(page: Page, marker: str) -> None:
    choose_other = first_visible(
        page.locator('button[data-action="choose-other"]'), "Other button"
    )
    field_id, _ = owning_card(page, choose_other)
    choose_other.click()
    card = card_by_field_id(page, field_id)
    custom = first_visible(
        card.locator('[data-role="other-input"]'), f"Other input for {field_id}"
    )
    assert custom.is_enabled(), f"Other input for {field_id} is disabled"
    custom.fill(marker)
    assert custom.input_value() == marker, f"Other input for {field_id} lost its value"


def exercise_proposed_default(page: Page) -> str:
    accept = first_visible(
        page.locator('button[data-action="accept-default"]'), "Accept default button"
    )
    field_id, _ = owning_card(page, accept)
    accept.click()
    card = card_by_field_id(page, field_id)
    first_visible(
        card.locator('button[data-action="change"]'),
        f"Change button after accepting {field_id}",
    )
    assert card.locator('button[data-action="accept-default"]').count() == 0 or not any(
        card.locator('button[data-action="accept-default"]').nth(index).is_visible()
        for index in range(card.locator('button[data-action="accept-default"]').count())
    ), f"Proposed value {field_id} did not leave the proposed state"
    return field_id


def exercise_language_toggle(page: Page) -> None:
    language_toggle = page.locator("#language-toggle")
    assert language_toggle.count() == 1 and language_toggle.is_visible(), (
        "Language toggle is missing"
    )
    language_toggle.click()
    page.wait_for_function("document.documentElement.dir === 'rtl'")
    assert page.locator("html").get_attribute("lang") == "ar", (
        "Arabic mode did not set lang=ar"
    )
    language_toggle.click()
    page.wait_for_function("document.documentElement.dir !== 'rtl'")
    assert page.locator("html").get_attribute("lang") == "en", (
        "English mode did not restore lang=en"
    )


def download_exports(page: Page, viewport_name: str) -> None:
    with page.expect_download() as json_download_info:
        page.locator("#export-json").click()
    json_download = json_download_info.value
    json_path = ARTIFACT_DIR / f"{viewport_name}-draft.json"
    json_download.save_as(json_path)
    json_payload = json.loads(json_path.read_text(encoding="utf-8"))
    assert isinstance(json_payload, (dict, list)), "JSON export has no structured payload"

    with page.expect_download() as markdown_download_info:
        page.locator("#export-markdown").click()
    markdown_download = markdown_download_info.value
    markdown_path = ARTIFACT_DIR / f"{viewport_name}-draft.md"
    markdown_download.save_as(markdown_path)
    markdown = markdown_path.read_text(encoding="utf-8")
    assert markdown.strip(), "Markdown export is empty"
    assert "[NEEDS INPUT]" in markdown, (
        "Working Markdown export must preserve unresolved facts as [NEEDS INPUT]"
    )


def storage_snapshot(page: Page) -> dict[str, dict[str, str]]:
    return page.evaluate(
        """() => {
          const copy = storage => Object.fromEntries(
            Array.from({ length: storage.length }, (_, index) => storage.key(index))
              .filter(Boolean)
              .map(key => [key, storage.getItem(key)])
          );
          return { local: copy(localStorage), session: copy(sessionStorage) };
        }"""
    )


def stable_storage_value(value: str) -> object:
    """Ignore intentionally volatile export timestamps in saved JSON."""
    try:
        payload = json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return value
    if isinstance(payload, dict):
        payload.pop("exportedAt", None)
    return payload


def exercise_opt_in_persistence(page: Page, network_phase: dict[str, bool]) -> str:
    remember = page.locator("#remember-device")
    if remember.count() != 1 or not remember.is_visible():
        return "not exposed"

    if not remember.is_checked():
        remember.check()
    page.wait_for_timeout(300)
    before = storage_snapshot(page)
    populated = {
        scope: values for scope, values in before.items() if any(values.values())
    }
    if not populated:
        return "memory-only"

    network_phase["post_load"] = False
    page.reload(wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    network_phase["post_load"] = True
    after = storage_snapshot(page)
    for scope, values in populated.items():
        for key, value in values.items():
            restored = after[scope].get(key)
            assert restored is not None and stable_storage_value(restored) == stable_storage_value(value), (
                f"Opt-in {scope} persistence did not survive reload for {key}"
            )
    return "+".join(sorted(populated))


def run_viewport(
    browser: Browser,
    name: str,
    viewport: dict[str, int],
    is_mobile: bool,
) -> str:
    context = browser.new_context(
        viewport=viewport,
        is_mobile=is_mobile,
        locale="en-US",
        accept_downloads=True,
        reduced_motion="reduce",
    )
    page = context.new_page()
    base = urlsplit(BASE_URL)
    external_requests: list[str] = []
    interaction_requests: list[str] = []
    network_phase = {"post_load": False}

    def record_request(request) -> None:
        parsed = urlsplit(request.url)
        if parsed.scheme not in {"http", "https"}:
            return
        if (parsed.scheme, parsed.netloc) != (base.scheme, base.netloc):
            external_requests.append(request.url)
        if network_phase["post_load"]:
            interaction_requests.append(request.url)

    page.on("request", record_request)
    response = page.goto(BASE_URL, wait_until="domcontentloaded")
    assert response is not None and response.ok, f"{BASE_URL} did not return HTTP success"
    page.wait_for_load_state("networkidle")
    network_phase["post_load"] = True

    assert page.locator("#facts-form").count() == 1, "Facts form is missing"
    assert page.locator("#privacy-note").count() == 1, "Privacy notice is missing"
    assert not external_requests, f"External network requests detected: {external_requests}"
    assert_no_horizontal_overflow(page, name)
    locked_filter = page.locator('button[data-filter="confirmed"]')
    assert locked_filter.count() == 1 and locked_filter.is_visible(), (
        "Locked-facts filter is missing"
    )
    locked_filter.click()
    locked_field = exercise_locked_fact(page)
    reveal_collapsed_content(page)
    exercise_other_answer(page, f"Browser test {name}")
    proposed_field = exercise_proposed_default(page)
    exercise_language_toggle(page)
    persistence = exercise_opt_in_persistence(page, network_phase)

    reveal_collapsed_content(page)
    download_exports(page, name)
    assert_no_horizontal_overflow(page, name)
    assert not interaction_requests, (
        f"Network request occurred after initial load in {name}: {interaction_requests}"
    )

    page.evaluate("scrollTo(0, 0)")
    page.screenshot(path=ARTIFACT_DIR / f"{name}.png", full_page=False)
    context.close()
    return (
        f"{name}:{viewport['width']}x{viewport['height']} "
        f"locked={locked_field} proposed={proposed_field} persistence={persistence}"
    )


def main() -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = launch_browser(playwright)
        try:
            results = [
                run_viewport(
                    browser,
                    "desktop",
                    {"width": 1440, "height": 1000},
                    is_mobile=False,
                ),
                run_viewport(
                    browser,
                    "mobile",
                    {"width": 390, "height": 844},
                    is_mobile=True,
                ),
            ]
        finally:
            browser.close()
    print("CV_INTAKE_BROWSER_GREEN " + " | ".join(results))


if __name__ == "__main__":
    main()
