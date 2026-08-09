#!/usr/bin/env python3
"""Capture weighted-camera motion dailies from the rendered Disney world."""

from __future__ import annotations

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import Browser, BrowserContext, Page, sync_playwright


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


VIEWPORTS = {
    "desktop": {
        "context": {"viewport": {"width": 1440, "height": 900}, "locale": "en-US"},
        "tile_width": 300,
    },
    "phone": {
        "context": {
            "viewport": {"width": 390, "height": 844},
            "screen": {"width": 390, "height": 844},
            "is_mobile": True,
            "has_touch": True,
            "device_scale_factor": 1,
            "locale": "en-US",
        },
        "tile_width": 150,
    },
}


def with_cache_buster(url: str) -> str:
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query["burst"] = str(int(time.time() * 1000))
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in (
        Path("C:/Windows/Fonts/segoeuib.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf"),
    ):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def install_play_instrument(context: BrowserContext) -> None:
    context.add_init_script(
        """(() => {
          const nativePlay = HTMLMediaElement.prototype.play;
          window.__playAttempts = 0;
          HTMLMediaElement.prototype.play = function() {
            window.__playAttempts += 1;
            return nativePlay.call(this);
          };
        })();"""
    )


def settle(page: Page, progress: float) -> None:
    page.locator("#book").evaluate(
        """(scene, target) => {
          const top = scene.getBoundingClientRect().top + scrollY;
          const span = Math.max(0, scene.offsetHeight - innerHeight);
          scrollTo(0, top + span * target);
        }""",
        progress,
    )
    page.wait_for_function(
        """target => {
          const scene = document.querySelector('#book');
          const video = scene.querySelector('video.on');
          const journey = parseFloat(scene.style.getPropertyValue('--journey') || '-1');
          if (Math.abs(journey - target) > 1e-4 || !video || video.readyState < 2 || video.seeking) return false;
          const g = Math.min(target, .999999) * 20;
          const wanted = (g - Math.floor(g)) * video.duration;
          return Math.abs(video.currentTime - wanted) <= .12;
        }""",
        arg=progress,
        timeout=30_000,
    )
    page.wait_for_function(
        "document.querySelector('#book').dataset.cameraState === 'idle'",
        timeout=5_000,
    )


def capture_view(
    browser: Browser, url: str, output_dir: Path, name: str, config: dict[str, object]
) -> dict[str, object]:
    context = browser.new_context(**config["context"])
    install_play_instrument(context)
    page = context.new_page()
    console_errors: list[str] = []
    page_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))

    response = page.goto(with_cache_buster(url), wait_until="domcontentloaded", timeout=60_000)
    if not response or not response.ok:
        raise RuntimeError(f"{name}: page HTTP {response.status if response else 'none'}")
    page.wait_for_load_state("networkidle", timeout=20_000)
    page.evaluate("document.documentElement.style.scrollBehavior = 'auto'")
    page.wait_for_selector("#book.mode-scrub")

    # One 1.5-leg move covers the full odd-leg sweep, its parked join, and the
    # even-leg reversal. Ten equal inputs are roughly wheel-detent sized.
    start_global, target_global = 9.25, 10.75
    start_progress = start_global / 20
    target_progress = target_global / 20
    settle(page, start_progress)

    targets = [
        (start_global + (target_global - start_global) * step / 15) / 20
        for step in range(1, 16)
    ]
    page.evaluate(
        """arg => {
          const scene = document.querySelector('#book');
          const top = scene.getBoundingClientRect().top + scrollY;
          const span = Math.max(0, scene.offsetHeight - innerHeight);
          window.__burstStarted = performance.now();
          arg.targets.forEach((target, index) => setTimeout(
            () => scrollTo(0, top + span * target), arg.lead + index * arg.cadence
          ));
        }""",
        {"targets": targets, "cadence": 290, "lead": 500},
    )

    frame_dir = output_dir / "frames" / name
    frame_dir.mkdir(parents=True, exist_ok=True)
    records: list[dict[str, object]] = []
    capture_started = time.perf_counter()
    for index in range(16):
        due = capture_started + index * 0.340
        remaining = due - time.perf_counter()
        if remaining > 0:
            page.wait_for_timeout(int(remaining * 1000))
        path = frame_dir / f"{index + 1:02d}.png"
        page.screenshot(path=str(path), full_page=False)
        state = page.locator("#book").evaluate(
            """scene => {
              const video = scene.querySelector('video.on');
              return {
                browserMs: performance.now() - window.__burstStarted,
                raw: parseFloat(scene.style.getPropertyValue('--p') || '0'),
                journey: parseFloat(scene.style.getPropertyValue('--journey') || '0'),
                pan: parseFloat(scene.style.getPropertyValue('--pan') || '.5'),
                currentTime: video ? video.currentTime : 0,
                cameraState: scene.dataset.cameraState || 'missing',
              };
            }"""
        )
        state["frame"] = index + 1
        state["file"] = str(path)
        records.append(state)

    page.wait_for_timeout(350)
    final = page.locator("#book").evaluate(
        """scene => ({
          raw: parseFloat(scene.style.getPropertyValue('--p') || '0'),
          journey: parseFloat(scene.style.getPropertyValue('--journey') || '0'),
          pan: parseFloat(scene.style.getPropertyValue('--pan') || '.5'),
          cameraState: scene.dataset.cameraState || 'missing',
          playAttempts: window.__playAttempts || 0,
        })"""
    )
    context.close()

    pans = [float(record["pan"]) for record in records]
    expected_size = tuple(config["context"]["viewport"].values())
    dimensions = [Image.open(record["file"]).size for record in records]
    ok = (
        not console_errors
        and not page_errors
        and final["playAttempts"] == 0
        and abs(float(final["journey"]) - target_progress) <= 1e-4
        and max(pans) - min(pans) >= 0.70
        and all(size == expected_size for size in dimensions)
    )
    return {
        "name": name,
        "ok": ok,
        "viewport": list(expected_size),
        "targetProgress": target_progress,
        "records": records,
        "final": final,
        "consoleErrors": console_errors,
        "pageErrors": page_errors,
    }


def compose_view_sheet(output_dir: Path, phase: str, result: dict[str, object], tile_width: int) -> Path:
    paths = [Path(record["file"]) for record in result["records"]]
    with Image.open(paths[0]) as first:
        tile_height = round(tile_width * first.height / first.width)
    margin, gap, label_height, columns = 24, 10, 58, 8
    width = margin * 2 + columns * tile_width + (columns - 1) * gap
    height = margin * 2 + label_height + 2 * tile_height + gap
    sheet = Image.new("RGB", (width, height), "#080b0d")
    draw = ImageDraw.Draw(sheet)
    draw.text((margin, margin), f"{phase.upper()} · {result['name'].upper()} · 16-FRAME WEIGHTED-CAMERA BURST", fill="#e2b13c", font=font(24))
    for index, path in enumerate(paths):
        with Image.open(path).convert("RGB") as source:
            tile = source.resize((tile_width, tile_height), Image.Resampling.LANCZOS)
        x = margin + (index % columns) * (tile_width + gap)
        y = margin + label_height + (index // columns) * (tile_height + gap)
        sheet.paste(tile, (x, y))
        draw.rectangle((x + 7, y + 7, x + 43, y + 37), fill="#080b0d")
        draw.text((x + 13, y + 9), f"{index + 1:02d}", fill="#ffffff", font=font(18))
    path = output_dir / f"{phase.lower()}-{result['name']}-motion-sheet.png"
    sheet.save(path, optimize=True)
    return path


def compose_combined(output_dir: Path, phase: str, sheets: list[Path]) -> Path:
    images = [Image.open(path).convert("RGB") for path in sheets]
    width = max(image.width for image in images)
    gap = 26
    height = sum(image.height for image in images) + gap * (len(images) - 1)
    combined = Image.new("RGB", (width, height), "#080b0d")
    y = 0
    for image in images:
        x = (width - image.width) // 2
        combined.paste(image, (x, y))
        y += image.height + gap
        image.close()
    path = output_dir / f"{phase.lower()}-weighted-camera-contact-sheet.png"
    combined.save(path, optimize=True)
    return path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--phase", required=True)
    args = parser.parse_args()
    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            results = [
                capture_view(browser, args.url, output_dir, name, config)
                for name, config in VIEWPORTS.items()
            ]
        finally:
            browser.close()

    sheets = [
        compose_view_sheet(output_dir, args.phase, result, VIEWPORTS[result["name"]]["tile_width"])
        for result in results
    ]
    combined = compose_combined(output_dir, args.phase, sheets)
    manifest = {
        "phase": args.phase,
        "url": args.url,
        "capturedAtUtc": datetime.now(timezone.utc).isoformat(),
        "combinedSheet": str(combined),
        "results": results,
    }
    manifest_path = output_dir / f"{args.phase.lower()}-burst-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for result in results:
        print(
            f"{'PASS' if result['ok'] else 'FAIL'} {result['name']}: "
            f"pan {min(r['pan'] for r in result['records']):.3f} -> "
            f"{max(r['pan'] for r in result['records']):.3f}, "
            f"play={result['final']['playAttempts']}, "
            f"console={len(result['consoleErrors'])}, page={len(result['pageErrors'])}"
        )
    print(f"contact sheet: {combined}")
    if not all(result["ok"] for result in results):
        print("DISNEY_WEIGHTED_BURST_FAIL", file=sys.stderr)
        return 1
    print("DISNEY_WEIGHTED_BURST_PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
