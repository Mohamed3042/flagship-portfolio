"""Capture 16 rendered Cake Studio coda frames and assemble contact sheets."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright


PROGRESS = (0.08, 0.18, 0.30, 0.39, 0.50, 0.62, 0.76, 0.94)
VIEWS = {
    "desktop": {"width": 1440, "height": 1000},
    "phone": {"width": 430, "height": 932},
}


def set_progress(page, progress: float) -> None:
    page.evaluate(
        """progress => {
          const scene = document.querySelector('[data-object-coda]');
          const top = scene.getBoundingClientRect().top + scrollY;
          const span = Math.max(0, scene.offsetHeight - innerHeight);
          scrollTo(0, top + span * progress);
        }""",
        progress,
    )
    page.wait_for_function(
        """target => Math.abs(window.__cakeStudioCoda.progress - target) < .0015
          && window.__cakeStudioCoda.cameraState === 'idle'""",
        arg=progress,
        timeout=10_000,
    )
    page.wait_for_timeout(100)


def contact_sheet(paths: list[Path], output: Path, columns: int) -> None:
    with Image.open(paths[0]) as first:
        ratio = first.height / first.width
    tile_width = 600 if ratio < 1 else 300
    image_height = round(tile_width * ratio)
    label_height = 34
    rows = (len(paths) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * tile_width, rows * (image_height + label_height)), "#07100d")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, path in enumerate(paths):
        with Image.open(path) as source:
            image = source.convert("RGB").resize((tile_width, image_height), Image.Resampling.LANCZOS)
        x = (index % columns) * tile_width
        y = (index // columns) * (image_height + label_height)
        sheet.paste(image, (x, y + label_height))
        draw.rectangle((x, y, x + tile_width, y + label_height), fill="#13231d")
        draw.text((x + 12, y + 11), path.stem, fill="#f4e7d4", font=font)
    sheet.save(output, quality=94)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:4617/worlds/cake-studio.html")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        for view, viewport in VIEWS.items():
            page = browser.new_page(viewport=viewport, device_scale_factor=1)
            page.goto(args.url, wait_until="networkidle", timeout=30_000)
            page.wait_for_function("window.__cakeStudioCoda?.ready === true", timeout=15_000)
            set_progress(page, 0.08)
            page.wait_for_function("window.__cakeStudioCoda.modelStatus === 'ready'", timeout=30_000)
            paths = []
            for index, progress in enumerate(PROGRESS, start=1):
                set_progress(page, progress)
                path = args.output / f"{view}-{index:02d}-p{round(progress * 100):02d}.png"
                page.screenshot(path=str(path))
                paths.append(path)
            contact_sheet(paths, args.output / f"cake-studio-{view}-coda-contact-sheet.jpg", 4)
            page.close()
        browser.close()

    print(f"CAKE_STUDIO_DAILIES_OK frames=16 output={args.output}")


if __name__ == "__main__":
    main()
