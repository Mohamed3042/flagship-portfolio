#!/usr/bin/env python3
"""Normalize, verify, and contact-sheet CUT THE STRINGS keyframes."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageStat


TARGET = (1920, 1088)
FRAME_RE = re.compile(r"^CTS-KF(?P<index>\d{2})-[a-z0-9-]+\.png$")


def font(size: int, bold: bool = False):
    names = ["seguisb.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(Path(r"C:\Windows\Fonts") / name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def percentile(image: Image.Image, fraction: float) -> int:
    threshold = sum(image.histogram()) * fraction
    running = 0
    for value, count in enumerate(image.histogram()):
        running += count
        if running >= threshold:
            return value
    return 255


def normalized(source: Image.Image) -> Image.Image:
    image = ImageOps.exif_transpose(source).convert("RGB")
    src_w, src_h = image.size
    target_ratio = TARGET[0] / TARGET[1]
    src_ratio = src_w / src_h
    if src_ratio > target_ratio:
        crop_w = round(src_h * target_ratio)
        left = (src_w - crop_w) // 2
        image = image.crop((left, 0, left + crop_w, src_h))
    else:
        crop_h = round(src_w / target_ratio)
        top = (src_h - crop_h) // 2
        image = image.crop((0, top, src_w, top + crop_h))
    return image.resize(TARGET, Image.Resampling.LANCZOS)


def normalize(input_path: Path, output_path: Path) -> None:
    with Image.open(input_path) as source:
        image = normalized(source)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, format="PNG", optimize=True)
    print(f"GREEN_NORMALIZED {input_path.name} -> {output_path.name} {image.width}x{image.height}")


def frames(directory: Path) -> list[tuple[int, Path]]:
    found: list[tuple[int, Path]] = []
    for path in directory.glob("CTS-KF*.png"):
        match = FRAME_RE.match(path.name)
        if match:
            found.append((int(match.group("index")), path))
    return sorted(found)


def metrics(path: Path) -> dict:
    payload = path.read_bytes()
    with Image.open(path) as image:
        gray = image.convert("RGB").convert("L")
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
            "meanLuma": round(ImageStat.Stat(gray).mean[0], 2),
            "lumaStdDev": round(ImageStat.Stat(gray).stddev[0], 2),
            "edgeStdDev": round(ImageStat.Stat(gray.filter(ImageFilter.FIND_EDGES)).stddev[0], 2),
            "centerMeanLuma": round(ImageStat.Stat(center).mean[0], 2),
            "centerLumaP95": percentile(center, 0.95),
            "outerMeanLuma": round(ImageStat.Stat(outer).mean[0], 2),
        }


def verify(directory: Path, expected_count: int, report_path: Path | None) -> int:
    found = frames(directory)
    indices = [index for index, _ in found]
    expected = list(range(expected_count))
    errors: list[str] = []
    if indices != expected:
        errors.append(
            "sequence mismatch missing=%s extra=%s"
            % (sorted(set(expected) - set(indices)), sorted(set(indices) - set(expected)))
        )
    rows = []
    hashes: dict[str, str] = {}
    for _, path in found:
        row = metrics(path)
        rows.append(row)
        if (row["width"], row["height"]) != TARGET:
            errors.append(f"{path.name}: {row['width']}x{row['height']} != {TARGET[0]}x{TARGET[1]}")
        if row["meanLuma"] < 20 and row["centerLumaP95"] < 70:
            errors.append(
                f"{path.name}: accidentally dark meanLuma={row['meanLuma']} "
                f"centerLumaP95={row['centerLumaP95']}"
            )
        if row["edgeStdDev"] < 10:
            errors.append(f"{path.name}: suspiciously soft edgeStdDev={row['edgeStdDev']}")
        if row["sha256"] in hashes:
            errors.append(f"{path.name}: duplicate pixels with {hashes[row['sha256']]}")
        hashes[row["sha256"]] = path.name
    report = {
        "schema": "cut-the-strings-keyframe-qa/v1",
        "target": {"width": TARGET[0], "height": TARGET[1]},
        "expectedCount": expected_count,
        "actualCount": len(found),
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
    print(f"GREEN_VERIFY {len(found)}/{expected_count} frames exact {TARGET[0]}x{TARGET[1]}")
    return 0


def landscape_tile(path: Path, width: int, label_height: int) -> Image.Image:
    height = round(width * TARGET[1] / TARGET[0])
    tile = Image.new("RGB", (width, height + label_height), "#0b0805")
    with Image.open(path) as source:
        tile.paste(ImageOps.fit(source.convert("RGB"), (width, height), Image.Resampling.LANCZOS), (0, label_height))
    ImageDraw.Draw(tile).text((10, 5), path.stem.replace("CTS-", ""), fill="#d8b16b", font=font(max(16, label_height - 12), True))
    return tile


def portrait_tile(path: Path, width: int, label_height: int) -> Image.Image:
    height = round(width * 844 / 390)
    tile = Image.new("RGB", (width, height + label_height), "#0b0805")
    with Image.open(path) as source:
        crop = ImageOps.fit(source.convert("RGB"), (width, height), Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    tile.paste(crop, (0, label_height))
    ImageDraw.Draw(tile).text((8, 5), path.stem.replace("CTS-", ""), fill="#d8b16b", font=font(max(15, label_height - 12), True))
    return tile


def sheet(paths: list[Path], output: Path, portrait: bool, cols: int, tile_width: int) -> None:
    label_height = max(34, tile_width // (8 if portrait else 12))
    make_tile = portrait_tile if portrait else landscape_tile
    sample = make_tile(paths[0], tile_width, label_height)
    rows = (len(paths) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * sample.width, rows * sample.height), "#030201")
    for index, path in enumerate(paths):
        tile = make_tile(path, tile_width, label_height)
        canvas.paste(tile, ((index % cols) * tile.width, (index // cols) * tile.height))
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, format="PNG", optimize=True)
    print(f"WROTE_CONTACT {output} {canvas.width}x{canvas.height} frames={len(paths)} portrait={portrait}")


def contacts(directory: Path, review_dir: Path, portrait: bool) -> None:
    paths = [path for _, path in frames(directory)]
    if not paths:
        raise SystemExit("no normalized keyframes found")
    stem = "CTS-contact-sheet-portrait" if portrait else "CTS-contact-sheet"
    sheet(paths, review_dir / f"{stem}-master.png", portrait, 5, 240 if portrait else 384)
    chunk = 10
    for start in range(0, len(paths), chunk):
        sheet(paths[start : start + chunk], review_dir / f"{stem}-{start // chunk + 1:02d}.png", portrait, 5 if portrait else 2, 300 if portrait else 720)


def portrait_one(input_path: Path, output_path: Path) -> None:
    with Image.open(input_path) as source:
        image = ImageOps.fit(source.convert("RGB"), (390, 844), Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, format="PNG", optimize=True)
    print(f"WROTE_PORTRAIT_PREVIEW {output_path} 390x844")


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    commands = result.add_subparsers(dest="command", required=True)
    normal = commands.add_parser("normalize")
    normal.add_argument("input", type=Path)
    normal.add_argument("output", type=Path)
    check = commands.add_parser("verify")
    check.add_argument("directory", type=Path)
    check.add_argument("--expected", type=int, default=41)
    check.add_argument("--report", type=Path)
    for name in ("contact", "portrait"):
        command = commands.add_parser(name)
        command.add_argument("directory", type=Path)
        command.add_argument("review_dir", type=Path)
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
    if args.command == "portrait-one":
        portrait_one(args.input, args.output)
        return 0
    contacts(args.directory, args.review_dir, args.command == "portrait")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
