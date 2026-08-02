"""Render and validate the eight homepage hero states."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright


WORLDS = ["astronomy", "razer", "disney", "cod", "netflix", "spotify", "apple", "samsung"]
MOTION_TARGETS = {
    "razer": ".ih-rz__board",
    "disney": ".ih-ds__book",
    "cod": ".ih-cod__map",
    "netflix": ".ih-nf__backdrop",
    "spotify": ".ih-sp__art",
    "apple": ".ih-ap__product",
    "samsung": ".ih-sm__device",
}
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")


def make_sheet(paths: list[Path], destination: Path, title: str) -> None:
    images = [Image.open(path).convert("RGB") for path in paths]
    width = 520
    height = round(images[0].height * width / images[0].width)
    header = 54
    sheet = Image.new("RGB", (width * 2, height * 4 + header), "#050507")
    draw = ImageDraw.Draw(sheet)
    draw.text((20, 18), title, fill="#f5f1e8")
    for index, image in enumerate(images):
        image.thumbnail((width, height), Image.Resampling.LANCZOS)
        x = index % 2 * width
        y = index // 2 * height + header
        sheet.paste(image, (x, y))
        draw.rectangle((x + 8, y + 8, x + 122, y + 34), fill="#050507")
        draw.text((x + 16, y + 14), WORLDS[index].upper(), fill="#f5f1e8")
    sheet.save(destination, quality=91)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4323")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--language", choices=("en", "ar"), default="en")
    parser.add_argument("--width", type=int, default=1440)
    parser.add_argument("--height", type=int, default=900)
    parser.add_argument("--settle-ms", type=int, default=5200)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    failures: list[str] = []
    reports: dict[str, object] = {}
    headings: dict[str, str] = {}
    screenshots: list[Path] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=str(CHROME), headless=True)
        for world in WORLDS:
            context = browser.new_context(viewport={"width": args.width, "height": args.height})
            context.add_init_script(f"localStorage.setItem('mm-world', {json.dumps(world)})")
            page = context.new_page()
            console_errors: list[str] = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.goto(f"{args.base_url.rstrip('/')}/{args.language}", wait_until="networkidle")
            page.wait_for_timeout(550)

            shell_display = page.locator("[data-identity-heroes]").evaluate("el => getComputedStyle(el).display")
            base_display = page.locator(".hh-wrap").evaluate("el => getComputedStyle(el).display")
            visible = page.locator("[data-hero-world]").evaluate_all(
                "els => els.filter(el => getComputedStyle(el).display !== 'none').map(el => el.dataset.heroWorld)"
            )
            if page.locator("main h1").count() != 1:
                failures.append(f"{world} changed the document h1 contract")
            if world == "astronomy":
                headings[world] = page.locator(".hh-h").inner_text().strip()
                if shell_display != "none" or base_display == "none" or visible:
                    failures.append(f"astronomy isolation failed: shell={shell_display}, base={base_display}, visible={visible}")
            else:
                headings[world] = " | ".join(
                    text.strip()
                    for text in page.locator(
                        f'[data-hero-world="{world}"] [role="heading"][aria-level="1"]'
                    ).all_inner_texts()
                )
                if shell_display == "none" or base_display != "none" or visible != [world]:
                    failures.append(f"{world} isolation failed: shell={shell_display}, base={base_display}, visible={visible}")
                active = page.locator(f'[data-hero-world="{world}"]')
                box = active.bounding_box()
                if not box or box["width"] < args.width * .9 or box["height"] < args.height * .8:
                    failures.append(f"{world} hero collapsed: {box}")

                target = page.locator(MOTION_TARGETS[world])
                motion = target.evaluate(
                    """el => {
                      const shell = el.closest('[data-identity-heroes]');
                      shell.style.setProperty('--hero-p', '0');
                      const start = getComputedStyle(el).transform;
                      shell.style.setProperty('--hero-p', '.72');
                      const end = getComputedStyle(el).transform;
                      shell.style.setProperty('--hero-p', '0');
                      return {start, end};
                    }"""
                )
                if motion["start"] == motion["end"]:
                    failures.append(f"{world} hero does not respond to scroll progress")

                page.evaluate("window.scrollTo({top: innerHeight * .36, behavior: 'instant'})")
                page.wait_for_timeout(300)
                live_progress = float(
                    page.locator("[data-identity-heroes]").evaluate(
                        "el => getComputedStyle(el).getPropertyValue('--hero-p') || '0'"
                    )
                )
                if live_progress < .2:
                    failures.append(f"{world} hero scroll listener did not advance: {live_progress}")
                page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
                page.wait_for_timeout(180)

            if world == "netflix":
                early = args.output / f"netflix-{args.language}-profile.jpg"
                page.screenshot(path=str(early), type="jpeg", quality=86)
            page.wait_for_timeout(max(0, args.settle_ms - 550))
            destination = args.output / f"{world}-{args.language}-hero.jpg"
            page.screenshot(path=str(destination), type="jpeg", quality=86)
            screenshots.append(destination)

            if console_errors:
                failures.append(f"{world} console errors: {console_errors}")
            reports[world] = {
                "shell_display": shell_display,
                "base_display": base_display,
                "visible_identity_hero": visible,
                "console_errors": console_errors,
            }
            context.close()
        browser.close()

    if len(set(headings.values())) != len(WORLDS):
        failures.append(f"hero headlines are not unique: {headings}")

    make_sheet(screenshots, args.output / f"contact-heroes-{args.language}.jpg", f"IDENTITY HEROES / {args.language.upper()}")
    result = {"reports": reports, "failures": failures}
    print(json.dumps(result, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
