#!/usr/bin/env python3
"""Normalize, fail-check, and contact-sheet THE LONG SIGNAL still chain."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageStat


TARGET = (1920, 1088)
ROOT = Path(__file__).resolve().parents[3]
DEFAULT_PLAN = ROOT / "public/worlds/assets/signal/prompts/keyframe-plan.json"


def load_plan(path: Path) -> dict:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if payload.get("schema") != "the-long-signal-keyframe-plan/v1":
        raise SystemExit(f"unsupported plan schema: {payload.get('schema')!r}")
    frames = payload.get("frames", [])
    if len(frames) != 41:
        raise SystemExit(f"plan must declare exactly 41 stills, found {len(frames)}")
    ids = [frame["id"] for frame in frames]
    if ids != [f"KF{index:02d}" for index in range(41)]:
        raise SystemExit(f"plan ids are not exact KF00..KF40: {ids}")
    return payload


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


def center_crop_resize(source: Image.Image) -> Image.Image:
    image = ImageOps.exif_transpose(source).convert("RGB")
    target_ratio = TARGET[0] / TARGET[1]
    source_ratio = image.width / image.height
    if source_ratio > target_ratio:
        crop_width = round(image.height * target_ratio)
        left = (image.width - crop_width) // 2
        image = image.crop((left, 0, left + crop_width, image.height))
    else:
        crop_height = round(image.width / target_ratio)
        top = (image.height - crop_height) // 2
        image = image.crop((0, top, image.width, top + crop_height))
    return image.resize(TARGET, Image.Resampling.LANCZOS)


def normalize(input_path: Path, output_path: Path) -> None:
    with Image.open(input_path) as source:
        normalized = center_crop_resize(source)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    normalized.save(output_path, format="PNG", optimize=True)
    print(f"GREEN_NORMALIZED {input_path.name} -> {output_path.name} {normalized.width}x{normalized.height}")


def visual_metrics(rgb: Image.Image) -> dict:
    gray = rgb.convert("L")
    # FIND_EDGES paints the outer image boundary. Exclude it so a flat frame
    # cannot pass the detail check on border pixels alone.
    edges = gray.filter(ImageFilter.FIND_EDGES).crop((8, 8, gray.width - 8, gray.height - 8))
    center = gray.crop((TARGET[0] // 4, 0, TARGET[0] * 3 // 4, TARGET[1]))
    return {
        "meanLuma": round(ImageStat.Stat(gray).mean[0], 2),
        "lumaStdDev": round(ImageStat.Stat(gray).stddev[0], 2),
        "edgeStdDev": round(ImageStat.Stat(edges).stddev[0], 2),
        "centerMeanLuma": round(ImageStat.Stat(center).mean[0], 2),
        "centerLumaP95": percentile(center, 0.95),
        # Sparse space frames can be intentionally near-black while retaining
        # a legible craft, ring, or signal in the brightest one percent.
        "centerLumaP99": percentile(center, 0.99),
    }


def metrics(path: Path) -> dict:
    payload = path.read_bytes()
    with Image.open(path) as source:
        rgb = source.convert("RGB")
        return {
            "file": path.name,
            "sha256": hashlib.sha256(payload).hexdigest(),
            "width": source.width,
            "height": source.height,
            "mode": source.mode,
            **visual_metrics(rgb),
        }


def quality_errors(row: dict) -> list[str]:
    errors = []
    if row["meanLuma"] < 18 and row["centerLumaP99"] < 30:
        errors.append(
            f"accidentally unreadable dark frame mean={row['meanLuma']} centerP99={row['centerLumaP99']}"
        )
    if row["edgeStdDev"] < 4:
        errors.append(f"suspiciously flat/soft frame internalEdgeStdDev={row['edgeStdDev']}")
    return errors


def verify(directory: Path, plan_path: Path, report_path: Path | None) -> int:
    plan = load_plan(plan_path)
    declared = [frame["file"] for frame in plan["frames"]]
    actual = sorted(path.name for path in directory.glob("SIG-KF*.png")) if directory.exists() else []
    errors: list[str] = []
    missing = [name for name in declared if name not in actual]
    extra = [name for name in actual if name not in declared]
    if missing:
        errors.append(f"missing {len(missing)} declared stills: {missing}")
    if extra:
        errors.append(f"unexpected stills: {extra}")
    rows = []
    for filename in declared:
        path = directory / filename
        if not path.exists():
            continue
        row = metrics(path)
        rows.append(row)
        if (row["width"], row["height"]) != TARGET:
            errors.append(f"{filename}: {row['width']}x{row['height']} != {TARGET[0]}x{TARGET[1]}")
        if row["mode"] != "RGB":
            errors.append(f"{filename}: mode {row['mode']} != RGB")
        errors.extend(f"{filename}: {error}" for error in quality_errors(row))
    hashes = [row["sha256"] for row in rows]
    if len(hashes) != len(set(hashes)):
        errors.append("duplicate accepted still hashes detected")
    report = {
        "schema": "the-long-signal-keyframe-qa/v2",
        "target": {"width": TARGET[0], "height": TARGET[1], "mode": "RGB"},
        "qualityRules": {
            "darkFrame": "meanLuma < 18 and centerLumaP99 < 30",
            "flatOrSoftFrame": "internal edgeStdDev < 4 after excluding 8px border",
        },
        "expectedCount": 41,
        "actualCount": len(rows),
        "uniqueHashes": len(set(hashes)),
        "missing": missing,
        "extra": extra,
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
    print(f"GREEN_VERIFY 41/41 unique RGB frames exact {TARGET[0]}x{TARGET[1]}")
    return 0


def selftest() -> int:
    black = {"file": "synthetic-black", **visual_metrics(Image.new("RGB", TARGET, "black"))}
    flat = {"file": "synthetic-flat", **visual_metrics(Image.new("RGB", TARGET, "#808080"))}
    black_errors = quality_errors(black)
    flat_errors = quality_errors(flat)
    if not any("dark frame" in error for error in black_errors):
        print("RED_SELFTEST synthetic black frame escaped dark-frame gate")
        return 1
    if not any("flat/soft" in error for error in black_errors + flat_errors):
        print("RED_SELFTEST synthetic uniform frame escaped detail gate")
        return 1
    print("GREEN_SELFTEST quality gate rejects synthetic black and uniform frames")
    return 0


def ordered_paths(directory: Path, plan_path: Path) -> list[Path]:
    plan = load_plan(plan_path)
    paths = [directory / frame["file"] for frame in plan["frames"]]
    missing = [path.name for path in paths if not path.exists()]
    if missing:
        raise SystemExit(f"cannot build contacts; missing {missing}")
    return paths


def landscape_tile(path: Path, width: int, label_height: int) -> Image.Image:
    height = round(width * TARGET[1] / TARGET[0])
    tile = Image.new("RGB", (width, height + label_height), "#050708")
    with Image.open(path) as source:
        image = ImageOps.fit(source.convert("RGB"), (width, height), Image.Resampling.LANCZOS)
    tile.paste(image, (0, label_height))
    ImageDraw.Draw(tile).text((10, 5), path.stem.replace("SIG-", ""), fill="#edb46a", font=font(max(16, label_height - 11), True))
    return tile


def portrait_tile(path: Path, width: int, label_height: int) -> Image.Image:
    height = round(width * 16 / 9)
    tile = Image.new("RGB", (width, height + label_height), "#050708")
    with Image.open(path) as source:
        image = ImageOps.fit(source.convert("RGB"), (width, height), Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    tile.paste(image, (0, label_height))
    ImageDraw.Draw(tile).text((8, 5), path.stem.replace("SIG-", ""), fill="#edb46a", font=font(max(15, label_height - 11), True))
    return tile


def write_sheet(paths: list[Path], output: Path, cols: int, width: int, portrait: bool) -> None:
    label_height = max(32, width // (8 if portrait else 12))
    tile_height = round(width * (16 / 9 if portrait else TARGET[1] / TARGET[0])) + label_height
    rows = (len(paths) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * width, rows * tile_height), "#020304")
    for index, path in enumerate(paths):
        tile = portrait_tile(path, width, label_height) if portrait else landscape_tile(path, width, label_height)
        sheet.paste(tile, ((index % cols) * width, (index // cols) * tile_height))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="PNG", optimize=True)
    print(f"WROTE_{'PORTRAIT_' if portrait else ''}CONTACT {output} {sheet.width}x{sheet.height} frames={len(paths)}")


def contacts(directory: Path, review_dir: Path, plan_path: Path, portrait: bool) -> None:
    paths = ordered_paths(directory, plan_path)
    if portrait:
        write_sheet(paths, review_dir / "SIG-contact-sheet-portrait-master.png", 5, 240, True)
        for start in range(0, len(paths), 10):
            write_sheet(paths[start:start + 10], review_dir / f"SIG-contact-sheet-portrait-{start // 10 + 1:02d}.png", 5, 300, True)
    else:
        write_sheet(paths, review_dir / "SIG-contact-sheet-master.png", 5, 384, False)
        for start in range(0, len(paths), 10):
            write_sheet(paths[start:start + 10], review_dir / f"SIG-contact-sheet-{start // 10 + 1:02d}.png", 2, 800, False)


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    commands = result.add_subparsers(dest="command", required=True)
    normal = commands.add_parser("normalize")
    normal.add_argument("input", type=Path)
    normal.add_argument("output", type=Path)
    check = commands.add_parser("verify")
    check.add_argument("directory", type=Path)
    check.add_argument("--plan", type=Path, default=DEFAULT_PLAN)
    check.add_argument("--report", type=Path)
    commands.add_parser("selftest")
    for name in ("contact", "portrait"):
        sheet = commands.add_parser(name)
        sheet.add_argument("directory", type=Path)
        sheet.add_argument("review_dir", type=Path)
        sheet.add_argument("--plan", type=Path, default=DEFAULT_PLAN)
    return result


def main() -> int:
    args = parser().parse_args()
    if args.command == "normalize":
        normalize(args.input, args.output)
        return 0
    if args.command == "verify":
        return verify(args.directory, args.plan, args.report)
    if args.command == "selftest":
        return selftest()
    contacts(args.directory, args.review_dir, args.plan, args.command == "portrait")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
