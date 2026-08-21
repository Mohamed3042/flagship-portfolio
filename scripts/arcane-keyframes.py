#!/usr/bin/env python3
"""Verify and review ARCANE WORLD Phase-1 keyframes."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageStat


TARGET = (1920, 1088)
PHONE = (612, 1088)
FRAME_RE = re.compile(r"^ARC-KF(?P<index>\d{2})-[a-z0-9-]+\.png$")
REVIEW_CROPS = {0, 1, 2, 8, 14, 16, 22, 25, 31, 33, 34, 37, 40}


def ui_font(size: int, bold: bool = False):
    names = ["seguisb.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for name in names:
        path = Path(r"C:\Windows\Fonts") / name
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def frame_files(directory: Path) -> list[tuple[int, Path]]:
    rows: list[tuple[int, Path]] = []
    for path in directory.glob("ARC-KF*.png"):
        match = FRAME_RE.match(path.name)
        if match:
            rows.append((int(match.group("index")), path))
    return sorted(rows)


def dhash(image: Image.Image) -> int:
    gray = image.convert("L").resize((9, 8), Image.Resampling.LANCZOS)
    pixels = list(gray.get_flattened_data())
    value = 0
    for row in range(8):
        offset = row * 9
        for column in range(8):
            value = (value << 1) | int(pixels[offset + column] > pixels[offset + column + 1])
    return value


def metrics(path: Path) -> dict:
    payload = path.read_bytes()
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        gray = image.convert("L")
        edges = gray.filter(ImageFilter.FIND_EDGES)
        phone = gray.crop(((image.width - PHONE[0]) // 2, 0, (image.width + PHONE[0]) // 2, image.height))
        return {
            "file": path.name,
            "sha256": hashlib.sha256(payload).hexdigest(),
            "width": source.width,
            "height": source.height,
            "mode": source.mode,
            "meanLuma": round(ImageStat.Stat(gray).mean[0], 2),
            "phoneMeanLuma": round(ImageStat.Stat(phone).mean[0], 2),
            "edgeStdDev": round(ImageStat.Stat(edges).stddev[0], 2),
            "dhash": f"{dhash(image):016x}",
        }


def verify(directory: Path, expected_count: int, report_path: Path | None) -> int:
    frames = frame_files(directory)
    indices = [index for index, _ in frames]
    expected = list(range(expected_count))
    errors: list[str] = []
    if indices != expected:
        errors.append(
            "sequence mismatch "
            f"missing={sorted(set(expected) - set(indices))} "
            f"extra={sorted(set(indices) - set(expected))}"
        )

    rows = [metrics(path) for _, path in frames]
    hashes: dict[str, list[str]] = {}
    for row in rows:
        if (row["width"], row["height"]) != TARGET:
            errors.append(
                f"{row['file']}: {row['width']}x{row['height']} != {TARGET[0]}x{TARGET[1]}"
            )
        if row["mode"] != "RGB":
            errors.append(f"{row['file']}: mode={row['mode']} != RGB")
        if row["edgeStdDev"] < 10:
            errors.append(f"{row['file']}: suspiciously soft edgeStdDev={row['edgeStdDev']}")
        if row["meanLuma"] < 18 or row["phoneMeanLuma"] < 18:
            errors.append(
                f"{row['file']}: suspiciously dark mean={row['meanLuma']} "
                f"phoneMean={row['phoneMeanLuma']}"
            )
        hashes.setdefault(row["sha256"], []).append(row["file"])
    for names in hashes.values():
        if len(names) > 1:
            errors.append(f"byte-identical frames={names}")

    closest = None
    for left in range(len(rows)):
        lhs = int(rows[left]["dhash"], 16)
        for right in range(left + 1, len(rows)):
            distance = (lhs ^ int(rows[right]["dhash"], 16)).bit_count()
            candidate = (distance, rows[left]["file"], rows[right]["file"])
            if closest is None or candidate < closest:
                closest = candidate

    report = {
        "schema": "arcane-keyframe-qa/v1",
        "target": {"width": TARGET[0], "height": TARGET[1], "mode": "RGB"},
        "phoneCrop": {"width": PHONE[0], "height": PHONE[1], "centering": 0.5},
        "expectedCount": expected_count,
        "actualCount": len(frames),
        "errors": errors,
        "closestPerceptualPair": (
            {"distance": closest[0], "left": closest[1], "right": closest[2]} if closest else None
        ),
        "frames": rows,
    }
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if errors:
        print("RED_ARCANE_KEYFRAMES")
        for error in errors:
            print(f"  {error}")
        return 1
    print(
        f"GREEN_ARCANE_KEYFRAMES count={len(frames)}/{expected_count} "
        f"dimensions={TARGET[0]}x{TARGET[1]} mode=RGB unique_sha={len(hashes)}"
    )
    if closest:
        print(f"CLOSEST_DHASH distance={closest[0]} left={closest[1]} right={closest[2]}")
    return 0


def probe(path: Path) -> int:
    with Image.open(path) as image:
        ok = image.size == TARGET and image.mode == "RGB"
        state = "GREEN_FRAME" if ok else "RED_FRAME"
        print(f"{state} file={path.name} dimensions={image.width}x{image.height} mode={image.mode}")
        return 0 if ok else 1


def label(path: Path) -> str:
    match = FRAME_RE.match(path.name)
    assert match
    suffix = path.stem.split("-", 2)[-1].replace("-", " ")
    return f"KF{match.group('index')}  {suffix.upper()}"


def landscape_tile(path: Path, width: int) -> Image.Image:
    picture_height = round(width * TARGET[1] / TARGET[0])
    label_height = max(34, width // 12)
    tile = Image.new("RGB", (width, picture_height + label_height), "#071014")
    with Image.open(path) as source:
        picture = ImageOps.fit(source.convert("RGB"), (width, picture_height), Image.Resampling.LANCZOS)
    tile.paste(picture, (0, label_height))
    ImageDraw.Draw(tile).text((10, 5), label(path), fill="#d7b36a", font=ui_font(max(16, label_height - 13), True))
    return tile


def phone_tile(path: Path, width: int) -> Image.Image:
    picture_height = round(width * 16 / 9)
    label_height = max(32, width // 8)
    tile = Image.new("RGB", (width, picture_height + label_height), "#071014")
    with Image.open(path) as source:
        picture = ImageOps.fit(
            source.convert("RGB"),
            (width, picture_height),
            Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
    tile.paste(picture, (0, label_height))
    ImageDraw.Draw(tile).text((8, 5), label(path), fill="#73cbe6", font=ui_font(max(14, label_height - 12), True))
    return tile


def make_sheet(paths: list[Path], output: Path, columns: int, tile_width: int, phone: bool) -> None:
    builder = phone_tile if phone else landscape_tile
    tiles = [builder(path, tile_width) for path in paths]
    rows = (len(tiles) + columns - 1) // columns
    tile_height = tiles[0].height
    sheet = Image.new("RGB", (columns * tile_width, rows * tile_height), "#020507")
    for index, tile in enumerate(tiles):
        sheet.paste(tile, ((index % columns) * tile_width, (index // columns) * tile_height))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="PNG", optimize=True)
    print(
        f"WROTE_{'PHONE_' if phone else ''}CONTACT file={output.name} "
        f"dimensions={sheet.width}x{sheet.height} frames={len(paths)}"
    )


def contacts(directory: Path, review_dir: Path) -> None:
    frames = frame_files(directory)
    paths = [path for _, path in frames]
    if not paths:
        raise SystemExit("no ARCANE WORLD keyframes found")

    make_sheet(paths, review_dir / "ARC-contact-sheet-master.png", 5, 384, False)
    make_sheet(paths, review_dir / "ARC-contact-sheet-phone-master.png", 5, 240, True)
    for start in range(0, len(paths), 10):
        page = start // 10 + 1
        chunk = paths[start : start + 10]
        make_sheet(chunk, review_dir / f"ARC-contact-sheet-{page:02d}.png", 2, 960, False)
        make_sheet(chunk, review_dir / f"ARC-contact-sheet-phone-{page:02d}.png", 5, 300, True)

    crop_dir = review_dir / "phone-crops"
    crop_dir.mkdir(parents=True, exist_ok=True)
    for index, path in frames:
        if index not in REVIEW_CROPS:
            continue
        with Image.open(path) as source:
            crop = ImageOps.fit(
                source.convert("RGB"), PHONE, Image.Resampling.LANCZOS, centering=(0.5, 0.5)
            )
        destination = crop_dir / path.name
        crop.save(destination, format="PNG", optimize=True)
        print(f"WROTE_PHONE_CROP file={destination.name} dimensions={PHONE[0]}x{PHONE[1]}")


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    commands = result.add_subparsers(dest="command", required=True)
    single = commands.add_parser("probe")
    single.add_argument("path", type=Path)
    check = commands.add_parser("verify")
    check.add_argument("directory", type=Path)
    check.add_argument("--expected", type=int, default=41)
    check.add_argument("--report", type=Path)
    sheets = commands.add_parser("contact")
    sheets.add_argument("directory", type=Path)
    sheets.add_argument("review_dir", type=Path)
    return result


def main() -> int:
    args = parser().parse_args()
    if args.command == "probe":
        return probe(args.path)
    if args.command == "verify":
        return verify(args.directory, args.expected, args.report)
    contacts(args.directory, args.review_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
