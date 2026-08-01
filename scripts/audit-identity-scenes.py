"""Render and inspect every homepage scene in every identity world.

This is intentionally a visual-regression aid rather than a snapshot test: it
creates one 3x3 contact sheet per world and validates the isolation contract
between the incumbent Astronomy artwork and the seven replacement art systems.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright


WORLDS = ["astronomy", "razer", "disney", "cod", "netflix", "spotify", "apple", "samsung"]
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")


def make_contact_sheet(paths: list[Path], destination: Path, title: str) -> None:
    images = [Image.open(path).convert("RGB") for path in paths]
    thumb_width = 480
    thumb_height = round(images[0].height * thumb_width / images[0].width)
    header = 58
    sheet = Image.new("RGB", (thumb_width * 3, thumb_height * 3 + header), "#070a12")
    draw = ImageDraw.Draw(sheet)
    draw.text((22, 18), title, fill="#f5f1e8")
    for index, image in enumerate(images):
        image.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
        x = index % 3 * thumb_width
        y = index // 3 * thumb_height + header
        sheet.paste(image, (x, y))
        draw.rectangle((x + 8, y + 8, x + 54, y + 38), fill="#080b12")
        draw.text((x + 22, y + 15), f"{index + 1:02d}", fill="#f5f1e8")
    sheet.save(destination, quality=90)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4323")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--language", choices=("en", "ar"), default="en")
    parser.add_argument("--width", type=int, default=1440)
    parser.add_argument("--height", type=int, default=900)
    parser.add_argument("--progress", type=float, default=.58, help="Pinned-scene scroll progress (0-1)")
    parser.add_argument("--worlds", default=",".join(WORLDS), help="Comma-separated identity worlds")
    parser.add_argument("--scenes", default="1,2,3,4,5,6,7,8,9", help="Comma-separated scene numbers")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    worlds = [world.strip() for world in args.worlds.split(",") if world.strip()]
    unknown = sorted(set(worlds) - set(WORLDS))
    if unknown:
        raise SystemExit(f"Unknown worlds: {', '.join(unknown)}")
    scenes = [int(scene.strip()) for scene in args.scenes.split(",") if scene.strip()]
    if any(scene < 1 or scene > 9 for scene in scenes):
        raise SystemExit("Scenes must be between 1 and 9")
    if not 0 <= args.progress <= 1:
        raise SystemExit("Progress must be between 0 and 1")

    failures: list[str] = []
    reports: dict[str, object] = {}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=str(CHROME), headless=True)
        for world in worlds:
            context = browser.new_context(viewport={"width": args.width, "height": args.height})
            context.add_init_script(f"localStorage.setItem('mm-world', {json.dumps(world)})")
            page = context.new_page()
            console_errors: list[str] = []
            page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
            page.goto(f"{args.base_url.rstrip('/')}/{args.language}", wait_until="networkidle")
            page.wait_for_timeout(500)

            scene_count = page.locator("[data-identity-scene]").count()
            if scene_count != 9:
                failures.append(f"{world}: expected 9 identity scenes, found {scene_count}")

            scene_displays = page.locator("[data-identity-scene]").evaluate_all(
                "els => els.map(el => getComputedStyle(el).display)"
            )
            astro_visibility = page.locator(".astro-art").evaluate_all(
                "els => els.map(el => getComputedStyle(el).visibility)"
            )
            if world == "astronomy":
                if any(display != "none" for display in scene_displays):
                    failures.append("astronomy: replacement scene became visible")
                if any(value == "hidden" for value in astro_visibility):
                    failures.append("astronomy: incumbent art was hidden")
            else:
                if any(display == "none" for display in scene_displays):
                    failures.append(f"{world}: replacement scene is hidden")
                if any(value != "hidden" for value in astro_visibility):
                    failures.append(f"{world}: astronomy art leaked into the world")

            screenshots: list[Path] = []
            for number in scenes:
                selector = f'[data-identity-scene="{number}"]'
                scene = page.locator(selector)
                pin = scene.locator("xpath=ancestor::*[@data-pin][1]")
                page.evaluate(
                    """([pin, progress]) => {
                      const travel = Math.max(0, pin.offsetHeight - innerHeight);
                      window.scrollTo(0, pin.offsetTop + travel * progress);
                    }""",
                    [pin.element_handle(), args.progress],
                )
                # The slowest identity deliberately uses a 1.45s scrub. Waiting
                # here makes the contact sheet show the requested stage rather
                # than the previous stage's eased-out tail.
                page.wait_for_timeout(1600)
                destination = args.output / f"{world}-{args.language}-{number:02d}.jpg"
                page.screenshot(path=str(destination), type="jpeg", quality=82)
                screenshots.append(destination)

                if world != "astronomy":
                    dimensions = scene.locator(".ids-object").evaluate(
                        "el => ({width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height})"
                    )
                    if dimensions["width"] < 120 or dimensions["height"] < 120:
                        failures.append(f"{world} scene {number}: central artifact collapsed ({dimensions})")
                    stage = scene.locator("xpath=parent::*")
                    motion = stage.evaluate(
                        """(stage) => {
                          const object = stage.querySelector('.ids-object');
                          const previous = stage.style.getPropertyValue('--p');
                          stage.style.setProperty('--p', '.12');
                          const start = getComputedStyle(object).transform;
                          stage.style.setProperty('--p', '.88');
                          const end = getComputedStyle(object).transform;
                          if (previous) stage.style.setProperty('--p', previous);
                          else stage.style.removeProperty('--p');
                          return {start, end};
                        }"""
                    )
                    if motion["start"] == motion["end"]:
                        failures.append(f"{world} scene {number}: artifact does not respond to scroll progress")

            if len(screenshots) == 9:
                make_contact_sheet(screenshots, args.output / f"contact-{world}-{args.language}.jpg", f"{world.upper()} / {args.language.upper()} / scenes 01-09")
            reports[world] = {
                "scene_count": scene_count,
                "replacement_display": sorted(set(scene_displays)),
                "astronomy_visibility": sorted(set(astro_visibility)),
                "console_errors": console_errors,
            }
            if console_errors:
                failures.append(f"{world}: console errors: {console_errors}")
            context.close()
        browser.close()

    result = {"reports": reports, "failures": failures}
    print(json.dumps(result, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
