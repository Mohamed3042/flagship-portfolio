#!/usr/bin/env python3
"""Verify and present the Red Thread Cut Phase 1 still gate."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageStat


TARGET = (1920, 1088)
PORTRAIT_BOX = (654, 0, 1266, 1088)  # Exact centered 9:16 crop: 612x1088.
FRAME_RE = re.compile(r"^NRT-KF(?P<index>\d{2})-[a-z0-9-]+\.png$")


def font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = ["seguisb.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for name in candidates:
        try:
            return ImageFont.truetype(Path(r"C:\Windows\Fonts") / name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def frame_files(directory: Path) -> list[tuple[int, Path]]:
    frames: list[tuple[int, Path]] = []
    for path in directory.glob("NRT-KF*.png"):
        match = FRAME_RE.match(path.name)
        if match:
            frames.append((int(match.group("index")), path))
    return sorted(frames)


def sampled_signal_metrics(image: Image.Image) -> dict[str, float | int]:
    sample = image.convert("RGB").resize((480, 272), Image.Resampling.LANCZOS)
    center_left = round(PORTRAIT_BOX[0] / TARGET[0] * sample.width)
    center_right = round(PORTRAIT_BOX[2] / TARGET[0] * sample.width)
    bright = 0
    red = 0
    center_red = 0
    max_luma = 0
    center_max_luma = 0
    for y in range(sample.height):
        for x in range(sample.width):
            r, g, b = sample.getpixel((x, y))
            luma = round(0.2126 * r + 0.7152 * g + 0.0722 * b)
            max_luma = max(max_luma, luma)
            if center_left <= x < center_right:
                center_max_luma = max(center_max_luma, luma)
            if luma >= 40:
                bright += 1
            is_red = r >= 65 and r >= g + 24 and r >= b + 12
            if is_red:
                red += 1
                if center_left <= x < center_right:
                    center_red += 1
    pixels = sample.width * sample.height
    return {
        "sampleWidth": sample.width,
        "sampleHeight": sample.height,
        "brightFraction": round(bright / pixels, 6),
        "redSignalFraction": round(red / pixels, 6),
        "centerRedSignalPixels": center_red,
        "maxLuma": max_luma,
        "centerMaxLuma": center_max_luma,
    }


def metrics(path: Path) -> dict:
    payload = path.read_bytes()
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        gray = image.convert("L")
        row = {
            "file": path.name,
            "sha256": hashlib.sha256(payload).hexdigest(),
            "width": source.width,
            "height": source.height,
            "sourceMode": source.mode,
            "meanLuma": round(ImageStat.Stat(gray).mean[0], 2),
            "lumaStdDev": round(ImageStat.Stat(gray).stddev[0], 2),
        }
        row.update(sampled_signal_metrics(image))
        return row


def verify(directory: Path, expected: int, report_path: Path | None) -> int:
    frames = frame_files(directory)
    indices = [index for index, _ in frames]
    wanted = list(range(expected))
    errors: list[str] = []
    if indices != wanted:
        errors.append(
            f"sequence mismatch expected={wanted} actual={indices}"
        )

    rows = [metrics(path) for _, path in frames]
    hashes: dict[str, list[str]] = {}
    for row in rows:
        hashes.setdefault(str(row["sha256"]), []).append(str(row["file"]))
        if (row["width"], row["height"]) != TARGET:
            errors.append(
                f"{row['file']}: {row['width']}x{row['height']} != {TARGET[0]}x{TARGET[1]}"
            )
        if row["maxLuma"] < 60 or row["brightFraction"] < 0.0001:
            errors.append(f"{row['file']}: accidental-black gate failed")
        if row["redSignalFraction"] < 0.0001:
            errors.append(f"{row['file']}: signal-red continuity gate failed")
        if row["centerRedSignalPixels"] < 3 or row["centerMaxLuma"] < 55:
            errors.append(f"{row['file']}: centered portrait-safe signal gate failed")

    for duplicate_names in hashes.values():
        if len(duplicate_names) > 1:
            errors.append(f"duplicate frame bytes: {duplicate_names}")

    report = {
        "schema": "netflix-red-thread-phase1-qa/v1",
        "target": {"width": TARGET[0], "height": TARGET[1]},
        "portraitCrop": {
            "left": PORTRAIT_BOX[0],
            "top": PORTRAIT_BOX[1],
            "right": PORTRAIT_BOX[2],
            "bottom": PORTRAIT_BOX[3],
            "width": PORTRAIT_BOX[2] - PORTRAIT_BOX[0],
            "height": PORTRAIT_BOX[3] - PORTRAIT_BOX[1],
        },
        "expectedCount": expected,
        "actualCount": len(frames),
        "errors": errors,
        "frames": rows,
    }
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if errors:
        print("RED_PHASE1_VERIFY")
        for error in errors:
            print(f"  {error}")
        return 1
    print(
        f"GREEN_PHASE1_VERIFY {len(frames)}/{expected} unique frames exact "
        f"{TARGET[0]}x{TARGET[1]} with centered signal"
    )
    return 0


def write_portrait_crops(keyframe_dir: Path, crop_dir: Path) -> None:
    crop_dir.mkdir(parents=True, exist_ok=True)
    for _, path in frame_files(keyframe_dir):
        with Image.open(path) as source:
            crop = source.convert("RGB").crop(PORTRAIT_BOX)
        crop.save(crop_dir / path.name, format="PNG", optimize=True)
        print(f"WROTE_9X16 {path.name} {crop.width}x{crop.height}")


def label_for(path: Path) -> str:
    index = int(FRAME_RE.match(path.name).group("index"))  # type: ignore[union-attr]
    return "STYLE ANCHOR" if index == 0 else f"N{index:02d}  {path.stem.split('-', 2)[2].replace('-', ' ').upper()}"


def labeled_tile(path: Path, image_size: tuple[int, int], label_height: int) -> Image.Image:
    tile = Image.new("RGB", (image_size[0], image_size[1] + label_height), "#050505")
    with Image.open(path) as source:
        image = ImageOps.fit(source.convert("RGB"), image_size, method=Image.Resampling.LANCZOS)
    tile.paste(image, (0, label_height))
    draw = ImageDraw.Draw(tile)
    draw.rectangle((0, 0, tile.width - 1, tile.height - 1), outline="#2a0000", width=1)
    label = label_for(path)
    font_size = max(16, label_height - 18)
    label_font = font(font_size, bold=True)
    while font_size > 12 and draw.textbbox((0, 0), label, font=label_font)[2] > tile.width - 24:
        font_size -= 1
        label_font = font(font_size, bold=True)
    draw.text((12, 8), label, fill="#f2d9d9", font=label_font)
    return tile


def contact_sheet(
    paths: list[Path],
    output: Path,
    *,
    image_size: tuple[int, int],
    label_height: int,
    columns: int = 3,
) -> None:
    rows = (len(paths) + columns - 1) // columns
    tile_width = image_size[0]
    tile_height = image_size[1] + label_height
    sheet = Image.new("RGB", (columns * tile_width, rows * tile_height), "#020202")
    for position, path in enumerate(paths):
        tile = labeled_tile(path, image_size, label_height)
        x = (position % columns) * tile_width
        y = (position // columns) * tile_height
        sheet.paste(tile, (x, y))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="PNG", optimize=True)
    print(f"WROTE_CONTACT {output.name} {sheet.width}x{sheet.height} frames={len(paths)}")


def contacts(keyframe_dir: Path, crop_dir: Path, output_dir: Path) -> None:
    desktop = [path for _, path in frame_files(keyframe_dir)]
    portrait = [path for _, path in frame_files(crop_dir)]
    if len(desktop) != 9 or len(portrait) != 9:
        raise SystemExit(f"expected 9 desktop and portrait frames; got {len(desktop)} and {len(portrait)}")
    contact_sheet(
        desktop,
        output_dir / "NRT-contact-sheet-desktop-3x3.png",
        image_size=(640, 363),
        label_height=48,
    )
    contact_sheet(
        portrait,
        output_dir / "NRT-contact-sheet-portrait-9x16-3x3.png",
        image_size=(306, 544),
        label_height=48,
    )


def rejection_contact(root: Path, output: Path) -> None:
    items = [
        (
            root / "review/rejected/NRT-KF04-v1-portrait-crop-failed-9x16.png",
            "N04 V1 - OUTER DOORS CROPPED",
        ),
        (
            root / "review/rejected/NRT-KF06-v1-organic-smoke-rejected.png",
            "N06 V1 - ORGANIC SMOKE",
        ),
        (
            root / "review/rejected/NRT-KF06-v2-portrait-crop-failed-9x16.png",
            "N06 V2 - LAMP CROPPED",
        ),
        (
            root / "review/rejected/NRT-KF07-v1-missing-dust-rail-rejected.png",
            "N07 V1 - DUST RAIL MISSING",
        ),
    ]
    cell_size = (640, 430)
    label_height = 58
    sheet = Image.new("RGB", (cell_size[0] * 2, cell_size[1] * 2), "#020202")
    for position, (path, label) in enumerate(items):
        if not path.is_file():
            raise SystemExit(f"missing rejected still: {path}")
        cell = Image.new("RGB", cell_size, "#050505")
        with Image.open(path) as source:
            image = ImageOps.contain(
                source.convert("RGB"),
                (cell_size[0] - 24, cell_size[1] - label_height - 16),
                method=Image.Resampling.LANCZOS,
            )
        x = (cell_size[0] - image.width) // 2
        y = label_height + (cell_size[1] - label_height - image.height) // 2
        cell.paste(image, (x, y))
        draw = ImageDraw.Draw(cell)
        draw.rectangle((0, 0, cell.width - 1, cell.height - 1), outline="#5c0909", width=2)
        label_font = font(25, bold=True)
        draw.text((12, 12), label, fill="#ffd9d9", font=label_font)
        sheet.paste(
            cell,
            ((position % 2) * cell_size[0], (position // 2) * cell_size[1]),
        )
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="PNG", optimize=True)
    print(f"WROTE_REJECTED_CONTACT {output.name} {sheet.width}x{sheet.height} frames={len(items)}")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify_gate(root: Path, manifest_path: Path, report_path: Path | None) -> int:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    errors: list[str] = []
    frame_results: list[dict[str, str | bool]] = []

    frames = manifest.get("frames", [])
    if len(frames) != 9:
        errors.append(f"manifest frame count {len(frames)} != 9")
    for frame in frames:
        master = root / frame["file"]
        crop = root / "review" / "crops-9x16" / master.name
        expected_hash = frame["sha256"]
        master_exists = master.is_file()
        crop_exists = crop.is_file()
        actual_hash = sha256(master) if master_exists else ""
        if not master_exists:
            errors.append(f"missing master: {master}")
        elif actual_hash != expected_hash:
            errors.append(f"hash mismatch: {master.name}")
        if not crop_exists:
            errors.append(f"missing portrait crop: {crop}")
        else:
            with Image.open(crop) as image:
                if image.size != (PORTRAIT_BOX[2] - PORTRAIT_BOX[0], TARGET[1]):
                    errors.append(f"portrait dimensions mismatch: {crop.name} {image.size}")
        frame_results.append(
            {
                "id": frame["id"],
                "masterExists": master_exists,
                "cropExists": crop_exists,
                "hashMatches": actual_hash == expected_hash,
            }
        )

    proof = manifest.get("proof", {})
    contact_contracts = [
        (
            proof.get("desktopContactSheet"),
            proof.get("desktopContactSheetSha256"),
            (1920, 1233),
        ),
        (
            proof.get("portraitContactSheet"),
            proof.get("portraitContactSheetSha256"),
            (918, 1776),
        ),
        (
            proof.get("rejectedContactSheet"),
            proof.get("rejectedContactSheetSha256"),
            (1280, 860),
        ),
    ]
    contacts_result: list[dict[str, str | bool | list[int]]] = []
    for relative, expected_hash, expected_size in contact_contracts:
        if not relative:
            errors.append("missing contact-sheet path in manifest")
            continue
        path = root / relative
        exists = path.is_file()
        actual_hash = sha256(path) if exists else ""
        actual_size = (0, 0)
        if not exists:
            errors.append(f"missing contact sheet: {path}")
        else:
            with Image.open(path) as image:
                actual_size = image.size
            if actual_hash != expected_hash:
                errors.append(f"contact-sheet hash mismatch: {path.name}")
            if actual_size != expected_size:
                errors.append(f"contact-sheet dimensions mismatch: {path.name} {actual_size}")
        contacts_result.append(
            {
                "file": str(relative),
                "exists": exists,
                "hashMatches": actual_hash == expected_hash,
                "dimensions": list(actual_size),
            }
        )

    generation = manifest.get("generation", {})
    rejections = manifest.get("rejections", [])
    if generation.get("acceptedStillCount") != 9:
        errors.append("accepted still count is not 9")
    if generation.get("rejectedStillCount") != len(rejections):
        errors.append("rejected still count does not match rejection records")
    if generation.get("totalStillGenerationCount") != len(frames) + len(rejections):
        errors.append("total still generation count does not reconcile")

    video = manifest.get("video", {})
    for field in ("callsMade", "clipsGenerated", "creditsSpent"):
        if video.get(field) != 0:
            errors.append(f"hard stop violated: video.{field}={video.get(field)}")
    approval = manifest.get("approval", {})
    if approval.get("received") is not False:
        errors.append("Phase 1 manifest must remain unapproved until user response")

    report = {
        "schema": "netflix-red-thread-phase1-gate/v1",
        "status": "RED" if errors else "GREEN",
        "errors": errors,
        "frames": frame_results,
        "contactSheets": contacts_result,
        "wanCalls": video.get("callsMade"),
        "wanCreditsSpent": video.get("creditsSpent"),
        "userApprovalReceived": approval.get("received"),
    }
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if errors:
        print("RED_PHASE1_GATE")
        for error in errors:
            print(f"  {error}")
        return 1
    print("GREEN_PHASE1_GATE 9 masters + 9 portrait crops + 3 contact sheets; WAN 0 credits")
    return 0


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    commands = result.add_subparsers(dest="command", required=True)
    check = commands.add_parser("verify")
    check.add_argument("directory", type=Path)
    check.add_argument("--expected", type=int, default=9)
    check.add_argument("--report", type=Path)
    crop = commands.add_parser("crops")
    crop.add_argument("keyframe_dir", type=Path)
    crop.add_argument("crop_dir", type=Path)
    sheet = commands.add_parser("contacts")
    sheet.add_argument("keyframe_dir", type=Path)
    sheet.add_argument("crop_dir", type=Path)
    sheet.add_argument("output_dir", type=Path)
    gate = commands.add_parser("gate")
    gate.add_argument("root", type=Path)
    gate.add_argument("manifest", type=Path)
    gate.add_argument("--report", type=Path)
    rejected = commands.add_parser("rejected-contact")
    rejected.add_argument("root", type=Path)
    rejected.add_argument("output", type=Path)
    return result


def main() -> int:
    args = parser().parse_args()
    if args.command == "verify":
        return verify(args.directory, args.expected, args.report)
    if args.command == "crops":
        write_portrait_crops(args.keyframe_dir, args.crop_dir)
        return 0
    if args.command == "gate":
        return verify_gate(args.root, args.manifest, args.report)
    if args.command == "rejected-contact":
        rejection_contact(args.root, args.output)
        return 0
    contacts(args.keyframe_dir, args.crop_dir, args.output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
