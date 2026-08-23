#!/usr/bin/env python3
"""Verify THE ALBUM Side A low-key approval stills.

The generic Cake Studio gate is intentionally tuned for brighter food imagery.
This gate keeps its exact-format and detail checks, but uses explicit low-key
profiles for the listening-room opening where pure black is part of the shot.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat


TARGET = (1920, 1088)
EXPECTED = ["STYLE.png", *[f"KF{i:02d}.png" for i in range(1, 8)]]
MIN_CENTER_P95 = {
    "STYLE.png": 35,
    "KF01.png": 18,
    "KF02.png": 18,
    "KF03.png": 35,
    "KF04.png": 35,
    "KF05.png": 25,
    "KF06.png": 55,
    "KF07.png": 30,
}


def percentile(image: Image.Image, fraction: float) -> int:
    histogram = image.histogram()
    threshold = sum(histogram) * fraction
    running = 0
    for value, count in enumerate(histogram):
        running += count
        if running >= threshold:
            return value
    return 255


def green_peaks(image: Image.Image) -> tuple[int, int]:
    """Return strongest signal-green excess inside and outside center 50%."""
    sample = image.convert("RGB").resize((480, 272), Image.Resampling.BILINEAR)
    center_peak = 0
    outer_peak = 0
    for y in range(sample.height):
        for x in range(sample.width):
            red, green, blue = sample.getpixel((x, y))
            excess = max(0, green - max(red, blue))
            if sample.width // 4 <= x < sample.width * 3 // 4:
                center_peak = max(center_peak, excess)
            else:
                outer_peak = max(outer_peak, excess)
    return center_peak, outer_peak


def metrics(path: Path) -> dict:
    payload = path.read_bytes()
    with Image.open(path) as source:
        image = source.convert("RGB")
        gray = image.convert("L")
        center = gray.crop((TARGET[0] // 4, 0, TARGET[0] * 3 // 4, TARGET[1]))
        center_green, outer_green = green_peaks(image)
        return {
            "file": path.name,
            "sha256": hashlib.sha256(payload).hexdigest(),
            "width": source.width,
            "height": source.height,
            "mode": source.mode,
            "meanLuma": round(ImageStat.Stat(gray).mean[0], 2),
            "lumaStdDev": round(ImageStat.Stat(gray).stddev[0], 2),
            "edgeStdDev": round(ImageStat.Stat(gray.filter(ImageFilter.FIND_EDGES)).stddev[0], 2),
            "centerLumaP95": percentile(center, 0.95),
            "centerGreenPeak": center_green,
            "outerGreenPeak": outer_green,
        }


def verify(directory: Path, report_path: Path | None) -> int:
    actual = sorted(path.name for path in directory.glob("*.png"))
    errors: list[str] = []
    if actual != sorted(EXPECTED):
        errors.append(
            f"name set mismatch missing={sorted(set(EXPECTED) - set(actual))} "
            f"extra={sorted(set(actual) - set(EXPECTED))}"
        )

    rows: list[dict] = []
    hashes: dict[str, str] = {}
    for name in EXPECTED:
        path = directory / name
        if not path.exists():
            continue
        row = metrics(path)
        rows.append(row)
        if (row["width"], row["height"]) != TARGET:
            errors.append(f"{name}: {row['width']}x{row['height']} != 1920x1088")
        if row["mode"] != "RGB":
            errors.append(f"{name}: mode {row['mode']} != RGB")
        if row["centerLumaP95"] < MIN_CENTER_P95[name]:
            errors.append(
                f"{name}: center detail too dark p95={row['centerLumaP95']} "
                f"minimum={MIN_CENTER_P95[name]}"
            )
        if row["edgeStdDev"] < 8:
            errors.append(f"{name}: suspiciously soft edgeStdDev={row['edgeStdDev']}")
        if name != "STYLE.png" and row["centerGreenPeak"] < 18:
            errors.append(f"{name}: no readable signal-green action in center 50%")
        previous = hashes.get(row["sha256"])
        if previous:
            errors.append(f"{name}: duplicate pixels match {previous}")
        hashes[row["sha256"]] = name

    report = {
        "schema": "spotify-side-a-keyframe-qa/v1",
        "target": {"width": TARGET[0], "height": TARGET[1], "mode": "RGB"},
        "expected": EXPECTED,
        "actual": actual,
        "profiles": {"minimumCenterLumaP95": MIN_CENTER_P95, "minimumEdgeStdDev": 8},
        "errors": errors,
        "frames": rows,
    }
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if errors:
        print("RED_SPOTIFY_KEYFRAMES")
        for error in errors:
            print(f"  {error}")
        return 1
    print("GREEN_SPOTIFY_KEYFRAMES 8/8 exact 1920x1088 RGB unique center-safe")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", type=Path)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    return verify(args.directory, args.report)


if __name__ == "__main__":
    raise SystemExit(main())
