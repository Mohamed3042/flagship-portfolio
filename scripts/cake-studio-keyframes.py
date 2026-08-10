#!/usr/bin/env python3
"""Normalize, verify, and contact-sheet Cake Studio cinematic keyframes."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageStat


TARGET = (1920, 1088)
FRAME_RE = re.compile(r"^CST-KF(?P<index>\d{2})-[a-z0-9-]+\.png$")


def percentile(image: Image.Image, fraction: float) -> int:
    """Return an integer luminance percentile for a single-channel image."""
    histogram = image.histogram()
    threshold = sum(histogram) * fraction
    running = 0
    for value, count in enumerate(histogram):
        running += count
        if running >= threshold:
            return value
    return 255


def font(size: int, bold: bool = False):
    names = ["seguisb.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for name in names:
        path = Path(r"C:\Windows\Fonts") / name
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def center_crop_resize(source: Image.Image) -> Image.Image:
    image = ImageOps.exif_transpose(source).convert("RGB")
    src_w, src_h = image.size
    target_ratio = TARGET[0] / TARGET[1]
    src_ratio = src_w / src_h
    if src_ratio > target_ratio:
        crop_w = round(src_h * target_ratio)
        left = (src_w - crop_w) // 2
        box = (left, 0, left + crop_w, src_h)
    else:
        crop_h = round(src_w / target_ratio)
        top = (src_h - crop_h) // 2
        box = (0, top, src_w, top + crop_h)
    return image.crop(box).resize(TARGET, Image.Resampling.LANCZOS)


def normalize(input_path: Path, output_path: Path) -> None:
    with Image.open(input_path) as source:
        normalized = center_crop_resize(source)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    normalized.save(output_path, format="PNG", optimize=True)
    print(f"GREEN_NORMALIZED {input_path.name} -> {output_path.name} {normalized.width}x{normalized.height}")


def frame_files(directory: Path) -> list[tuple[int, Path]]:
    found: list[tuple[int, Path]] = []
    for path in directory.glob("CST-KF*.png"):
        match = FRAME_RE.match(path.name)
        if match:
            found.append((int(match.group("index")), path))
    return sorted(found)


def metrics(path: Path) -> dict:
    payload = path.read_bytes()
    with Image.open(path) as image:
        rgb = image.convert("RGB")
        gray = rgb.convert("L")
        luma = ImageStat.Stat(gray)
        edges = gray.filter(ImageFilter.FIND_EDGES)
        edge_stat = ImageStat.Stat(edges)
        center = gray.crop((TARGET[0] // 4, 0, TARGET[0] * 3 // 4, TARGET[1]))
        outer = Image.new("L", (TARGET[0] // 2, TARGET[1]))
        outer.paste(gray.crop((0, 0, TARGET[0] // 4, TARGET[1])), (0, 0))
        outer.paste(gray.crop((TARGET[0] * 3 // 4, 0, TARGET[0], TARGET[1])), (TARGET[0] // 4, 0))
        return {
            "file": path.name,
            "sha256": hashlib.sha256(payload).hexdigest(),
            "width": image.width,
            "height": image.height,
            "mode": image.mode,
            "meanLuma": round(luma.mean[0], 2),
            "lumaStdDev": round(luma.stddev[0], 2),
            "edgeStdDev": round(edge_stat.stddev[0], 2),
            "centerMeanLuma": round(ImageStat.Stat(center).mean[0], 2),
            "centerLumaP95": percentile(center, 0.95),
            "outerMeanLuma": round(ImageStat.Stat(outer).mean[0], 2),
        }


def verify(directory: Path, expected_count: int, report_path: Path | None) -> int:
    frames = frame_files(directory)
    indices = [index for index, _ in frames]
    expected = list(range(expected_count))
    errors: list[str] = []
    if indices != expected:
        missing = sorted(set(expected) - set(indices))
        extra = sorted(set(indices) - set(expected))
        errors.append(f"sequence mismatch missing={missing} extra={extra}")
    rows = []
    for _, path in frames:
        row = metrics(path)
        rows.append(row)
        if (row["width"], row["height"]) != TARGET:
            errors.append(f"{path.name}: {row['width']}x{row['height']} != {TARGET[0]}x{TARGET[1]}")
        # A whole-frame mean alone rejects intentional dark-room wide shots.
        # Require both a dark average and an underexposed central subject.
        if row["meanLuma"] < 25 and row["centerLumaP95"] < 75:
            errors.append(
                f"{path.name}: accidentally dark meanLuma={row['meanLuma']} "
                f"centerLumaP95={row['centerLumaP95']}"
            )
        if row["edgeStdDev"] < 12:
            errors.append(f"{path.name}: suspiciously soft edgeStdDev={row['edgeStdDev']}")
    report = {
        "schema": "cake-studio-keyframe-qa/v1",
        "target": {"width": TARGET[0], "height": TARGET[1]},
        "expectedCount": expected_count,
        "actualCount": len(frames),
        "errors": errors,
        "frames": rows,
    }
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if errors:
        print("RED_VERIFY")
        for error in errors:
            print(f"  {error}")
        return 1
    print(f"GREEN_VERIFY {len(frames)}/{expected_count} frames exact {TARGET[0]}x{TARGET[1]}")
    return 0


def labeled_tile(path: Path, size: tuple[int, int], label_height: int) -> Image.Image:
    tile = Image.new("RGB", (size[0], size[1] + label_height), "#071112")
    with Image.open(path) as source:
        image = ImageOps.fit(source.convert("RGB"), size, method=Image.Resampling.LANCZOS)
    tile.paste(image, (0, label_height))
    draw = ImageDraw.Draw(tile)
    draw.text((12, 5), path.stem.replace("CST-", ""), fill="#e5b3a6", font=font(max(18, label_height - 12), True))
    return tile


def contact_sheet(paths: list[Path], output: Path, cols: int, tile_width: int) -> None:
    tile_height = round(tile_width * TARGET[1] / TARGET[0])
    label_height = max(36, tile_width // 12)
    rows = (len(paths) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tile_width, rows * (tile_height + label_height)), "#030708")
    for index, path in enumerate(paths):
        tile = labeled_tile(path, (tile_width, tile_height), label_height)
        x = (index % cols) * tile_width
        y = (index // cols) * (tile_height + label_height)
        sheet.paste(tile, (x, y))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="PNG", optimize=True)
    print(f"WROTE_CONTACT {output} {sheet.width}x{sheet.height} frames={len(paths)}")


def portrait_tile(path: Path, width: int, label_height: int) -> Image.Image:
    height = round(width * 16 / 9)
    tile = Image.new("RGB", (width, height + label_height), "#071112")
    with Image.open(path) as source:
        image = ImageOps.fit(
            source.convert("RGB"),
            (width, height),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
    tile.paste(image, (0, label_height))
    draw = ImageDraw.Draw(tile)
    draw.text(
        (8, 5),
        path.stem.replace("CST-", ""),
        fill="#e5b3a6",
        font=font(max(16, label_height - 12), True),
    )
    return tile


def portrait_preview(input_path: Path, output_path: Path) -> None:
    height = TARGET[1]
    width = round(height * 9 / 16)
    with Image.open(input_path) as source:
        image = ImageOps.fit(
            source.convert("RGB"),
            (width, height),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, format="PNG", optimize=True)
    print(f"WROTE_PORTRAIT_PREVIEW {output_path} {image.width}x{image.height}")


def portrait_contact_sheet(paths: list[Path], output: Path, cols: int, tile_width: int) -> None:
    label_height = max(34, tile_width // 8)
    tile_height = round(tile_width * 16 / 9) + label_height
    rows = (len(paths) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tile_width, rows * tile_height), "#030708")
    for index, path in enumerate(paths):
        tile = portrait_tile(path, tile_width, label_height)
        x = (index % cols) * tile_width
        y = (index // cols) * tile_height
        sheet.paste(tile, (x, y))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="PNG", optimize=True)
    print(f"WROTE_PORTRAIT_CONTACT {output} {sheet.width}x{sheet.height} frames={len(paths)}")


def contacts(directory: Path, review_dir: Path) -> None:
    paths = [path for _, path in frame_files(directory)]
    if not paths:
        raise SystemExit("no normalized keyframes found")
    contact_sheet(paths, review_dir / "CST-contact-sheet-master.png", cols=5, tile_width=384)
    chunk = 12
    for start in range(0, len(paths), chunk):
        page = start // chunk + 1
        contact_sheet(
            paths[start : start + chunk],
            review_dir / f"CST-contact-sheet-{page:02d}.png",
            cols=3,
            tile_width=640,
        )


def portrait_contacts(directory: Path, review_dir: Path) -> None:
    paths = [path for _, path in frame_files(directory)]
    if not paths:
        raise SystemExit("no normalized keyframes found")
    portrait_contact_sheet(
        paths,
        review_dir / "CST-contact-sheet-portrait-master.png",
        cols=5,
        tile_width=240,
    )
    chunk = 12
    for start in range(0, len(paths), chunk):
        page = start // chunk + 1
        portrait_contact_sheet(
            paths[start : start + chunk],
            review_dir / f"CST-contact-sheet-portrait-{page:02d}.png",
            cols=4,
            tile_width=320,
        )


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    commands = result.add_subparsers(dest="command", required=True)
    normal = commands.add_parser("normalize")
    normal.add_argument("input", type=Path)
    normal.add_argument("output", type=Path)
    check = commands.add_parser("verify")
    check.add_argument("directory", type=Path)
    check.add_argument("--expected", type=int, default=51)
    check.add_argument("--report", type=Path)
    sheet = commands.add_parser("contact")
    sheet.add_argument("directory", type=Path)
    sheet.add_argument("review_dir", type=Path)
    portrait = commands.add_parser("portrait")
    portrait.add_argument("directory", type=Path)
    portrait.add_argument("review_dir", type=Path)
    preview = commands.add_parser("portrait-one")
    preview.add_argument("input", type=Path)
    preview.add_argument("output", type=Path)
    return result


def main() -> int:
    args = parser().parse_args()
    if args.command == "normalize":
        normalize(args.input, args.output)
        return 0
    if args.command == "verify":
        return verify(args.directory, args.expected, args.report)
    if args.command == "portrait":
        portrait_contacts(args.directory, args.review_dir)
        return 0
    if args.command == "portrait-one":
        portrait_preview(args.input, args.output)
        return 0
    contacts(args.directory, args.review_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
