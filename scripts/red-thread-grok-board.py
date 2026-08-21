#!/usr/bin/env python3
"""Build and verify the Red Thread Grok 1.5 comparison board."""

from __future__ import annotations

import argparse
import hashlib
import json
import textwrap
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageOps


REPO = Path(__file__).resolve().parents[1]
GROK_ROOT = REPO / "public/worlds/assets/netflix/red-thread/grok"
MANIFEST = GROK_ROOT / "grok-15s-run-manifest.json"
BOARD = GROK_ROOT / "GROK-15S-COMPARISON-BOARD.png"
MASTER_SIZE = (1920, 1088)
INPUT_SIZE = (1920, 1080)
INPUT_CROP = (0, 4, 1920, 1084)
STYLE_LOCK = "absolute black void, single signal-red light, cinematic haze, black glass reflection, film grain"


def font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = ["seguisb.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(Path(r"C:\Windows\Fonts") / name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def resolve_from_grok(relative: str) -> Path:
    return (GROK_ROOT / relative).resolve()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build_inputs(manifest: dict) -> None:
    for shot in manifest["shots"]:
        source_path = resolve_from_grok(shot["sourceMaster"])
        target_path = resolve_from_grok(shot["input1080"])
        with Image.open(source_path) as source:
            if source.size != MASTER_SIZE:
                raise SystemExit(f"source must be {MASTER_SIZE}: {source_path} is {source.size}")
            image = source.convert("RGB").crop(INPUT_CROP)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(target_path, format="PNG", optimize=True)
        print(f"WROTE_GROK_INPUT {shot['id']} {target_path.name} {image.width}x{image.height}")


def build_prompt_files(manifest: dict) -> None:
    prompt_dir = GROK_ROOT / "prompts"
    prompt_dir.mkdir(parents=True, exist_ok=True)
    for shot in manifest["shots"]:
        path = prompt_dir / f"NRT-GROK-{shot['id']}-prompt.txt"
        path.write_text(shot["prompt"].strip() + "\n", encoding="utf-8")
        print(f"WROTE_GROK_PROMPT {shot['id']} {path.name}")


def truncate(text: str, width: int = 58) -> str:
    return textwrap.shorten(text, width=width, placeholder="...")


def draw_board(manifest: dict) -> None:
    width, height = 1920, 1080
    header_height = 80
    card_width = 480
    card_height = 500
    canvas = Image.new("RGB", (width, height), "#020202")
    draw = ImageDraw.Draw(canvas)

    draw.text((24, 10), "GROK IMAGINE VIDEO 1.5 - RED THREAD BOARD", fill="#fff2f2", font=font(34, bold=True))
    draw.text(
        (24, 49),
        "8 x 15s | 1080p IMAGE-TO-VIDEO | SAME PHASE-1 INPUTS | NO RUNS YET | $0 SPENT",
        fill="#dc5252",
        font=font(18, bold=True),
    )

    for position, shot in enumerate(manifest["shots"]):
        column = position % 4
        row = position // 4
        x0 = column * card_width
        y0 = header_height + row * card_height
        draw.rectangle(
            (x0 + 1, y0 + 1, x0 + card_width - 2, y0 + card_height - 2),
            fill="#050505",
            outline="#430707",
            width=2,
        )
        draw.text(
            (x0 + 18, y0 + 10),
            f"{shot['id']}  {shot['title'].upper()}",
            fill="#f7dede",
            font=font(23, bold=True),
        )

        input_path = resolve_from_grok(shot["input1080"])
        with Image.open(input_path) as source:
            thumbnail = ImageOps.fit(source.convert("RGB"), (440, 248), method=Image.Resampling.LANCZOS)
        canvas.paste(thumbnail, (x0 + 20, y0 + 48))
        draw.rectangle((x0 + 20, y0 + 48, x0 + 459, y0 + 295), outline="#6b1111", width=1)

        segments = [
            ("0-5 SETUP", "#3b0808"),
            ("5-12 ILLUSION", "#680e0e"),
            ("12-15 LAND", "#3b0808"),
        ]
        segment_widths = (134, 172, 134)
        cursor = x0 + 20
        for (label, color), segment_width in zip(segments, segment_widths, strict=True):
            draw.rectangle((cursor, y0 + 309, cursor + segment_width - 1, y0 + 346), fill=color)
            box = draw.textbbox((0, 0), label, font=font(15, bold=True))
            text_width = box[2] - box[0]
            draw.text(
                (cursor + (segment_width - text_width) // 2, y0 + 318),
                label,
                fill="#fff0f0",
                font=font(15, bold=True),
            )
            cursor += segment_width

        summaries = [
            ("0-5", shot["timeline"]["setup0to5"]),
            ("5-12", shot["timeline"]["illusion5to12"]),
            ("12-15", shot["timeline"]["landing12to15"]),
        ]
        for line_index, (timecode, summary) in enumerate(summaries):
            y = y0 + 361 + line_index * 39
            draw.text((x0 + 20, y), timecode, fill="#ef4d4d", font=font(16, bold=True))
            draw.text((x0 + 76, y), truncate(summary), fill="#d7caca", font=font(15))

        draw.text(
            (x0 + 20, y0 + 474),
            shot["outputName"],
            fill="#7e6b6b",
            font=font(13),
        )

    BOARD.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(BOARD, format="PNG", optimize=True)
    print(f"WROTE_GROK_BOARD {BOARD.name} {canvas.width}x{canvas.height}")


def build() -> None:
    manifest = load_manifest()
    build_inputs(manifest)
    build_prompt_files(manifest)
    draw_board(manifest)


def verify(report_path: Path | None) -> int:
    manifest = load_manifest()
    errors: list[str] = []
    rows: list[dict] = []
    shots = manifest.get("shots", [])
    if len(shots) != 8:
        errors.append(f"shot count {len(shots)} != 8")
    ids = [shot.get("id") for shot in shots]
    if ids != [f"N{index:02d}" for index in range(1, 9)]:
        errors.append(f"shot sequence mismatch: {ids}")
    if manifest.get("model") != "grok-imagine-video-1.5":
        errors.append("model must be grok-imagine-video-1.5")
    settings = manifest.get("settings", {})
    if settings.get("durationSeconds") != 15 or settings.get("resolution") != "1080p":
        errors.append("settings must be 15 seconds at 1080p")
    generation = manifest.get("generation", {})
    for field in ("callsMade", "clipsGenerated", "generatedSeconds", "apiSpendUsd"):
        if generation.get(field) != 0:
            errors.append(f"no-spend board violated: generation.{field}={generation.get(field)}")

    hashes: set[str] = set()
    for shot in shots:
        source_path = resolve_from_grok(shot["sourceMaster"])
        target_path = resolve_from_grok(shot["input1080"])
        prompt_path = GROK_ROOT / "prompts" / f"NRT-GROK-{shot['id']}-prompt.txt"
        prompt = shot.get("prompt", "")
        if STYLE_LOCK not in prompt:
            errors.append(f"{shot['id']}: exact style lock missing")
        if "No dialogue. No music." not in prompt:
            errors.append(f"{shot['id']}: audio lock missing")
        if not prompt.startswith("Animate the supplied still as the exact first frame"):
            errors.append(f"{shot['id']}: first-frame instruction missing")
        prompt_file_matches = prompt_path.is_file() and prompt_path.read_text(encoding="utf-8").strip() == prompt.strip()
        if not prompt_file_matches:
            errors.append(f"{shot['id']}: prompt file missing or does not match manifest")
        source_exists = source_path.is_file()
        target_exists = target_path.is_file()
        pixel_exact_crop = False
        target_hash = ""
        if not source_exists:
            errors.append(f"{shot['id']}: missing source master")
        if not target_exists:
            errors.append(f"{shot['id']}: missing 1080p input")
        if source_exists and target_exists:
            with Image.open(source_path) as source, Image.open(target_path) as target:
                expected = source.convert("RGB").crop(INPUT_CROP)
                actual = target.convert("RGB")
                if source.size != MASTER_SIZE:
                    errors.append(f"{shot['id']}: source dimensions {source.size} != {MASTER_SIZE}")
                if actual.size != INPUT_SIZE:
                    errors.append(f"{shot['id']}: input dimensions {actual.size} != {INPUT_SIZE}")
                pixel_exact_crop = ImageChops.difference(expected, actual).getbbox() is None
                if not pixel_exact_crop:
                    errors.append(f"{shot['id']}: input is not the exact four-pixel top/bottom crop")
            target_hash = sha256(target_path)
            if target_hash in hashes:
                errors.append(f"{shot['id']}: duplicate 1080p input bytes")
            hashes.add(target_hash)
        rows.append(
            {
                "id": shot["id"],
                "sourceExists": source_exists,
                "inputExists": target_exists,
                "pixelExactCrop": pixel_exact_crop,
                "inputSha256": target_hash,
                "promptFileMatches": prompt_file_matches,
            }
        )

    board_result = {"exists": BOARD.is_file(), "dimensions": [0, 0], "sha256": ""}
    if not BOARD.is_file():
        errors.append("comparison board is missing")
    else:
        with Image.open(BOARD) as board:
            board_result["dimensions"] = list(board.size)
            if board.size != (1920, 1080):
                errors.append(f"board dimensions {board.size} != (1920, 1080)")
        board_result["sha256"] = sha256(BOARD)

    report = {
        "schema": "netflix-red-thread-grok-board-qa/v1",
        "status": "RED" if errors else "GREEN",
        "errors": errors,
        "model": manifest.get("model"),
        "durationSeconds": settings.get("durationSeconds"),
        "resolution": settings.get("resolution"),
        "shots": rows,
        "board": board_result,
        "callsMade": generation.get("callsMade"),
        "apiSpendUsd": generation.get("apiSpendUsd"),
    }
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if errors:
        print("RED_GROK_BOARD_VERIFY")
        for error in errors:
            print(f"  {error}")
        return 1
    print("GREEN_GROK_BOARD_VERIFY 8/8 exact 1920x1080 inputs + board; calls 0, spend $0")
    return 0


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser()
    commands = result.add_subparsers(dest="command", required=True)
    commands.add_parser("build")
    check = commands.add_parser("verify")
    check.add_argument("--report", type=Path)
    return result


def main() -> int:
    args = parser().parse_args()
    if args.command == "build":
        build()
        return 0
    return verify(args.report)


if __name__ == "__main__":
    raise SystemExit(main())
