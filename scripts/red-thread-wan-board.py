#!/usr/bin/env python3
"""Build and verify the Red Thread WAN 2.7 comparison board."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import textwrap
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageOps


REPO = Path(__file__).resolve().parents[1]
WAN_ROOT = REPO / "public/worlds/assets/netflix/red-thread/wan"
MANIFEST = WAN_ROOT / "wan-5s-run-manifest.json"
BOARD = WAN_ROOT / "WAN-5S-COMPARISON-BOARD.png"
MASTER_SIZE = (1920, 1088)
INPUT_SIZE = (1280, 720)
MASTER_CROP = (0, 4, 1920, 1084)
STYLE_LOCK = "absolute black void, single signal-red light, cinematic haze, black glass reflection, film grain"
AUDIO_LOCK = "No dialogue. No background music."
PROMPT_PREFIX = "Generate single shot."
MAX_PROMPT_WORDS = 110


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


def resolve_from_wan(relative: str) -> Path:
    return (WAN_ROOT / relative).resolve()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def prompt_word_count(prompt: str) -> int:
    return len(re.findall(r"\b[\w.-]+\b", prompt))


def make_input(source: Image.Image) -> Image.Image:
    return source.convert("RGB").crop(MASTER_CROP).resize(INPUT_SIZE, Image.Resampling.LANCZOS)


def build_inputs(manifest: dict) -> None:
    for shot in manifest["shots"]:
        source_path = resolve_from_wan(shot["sourceMaster"])
        target_path = resolve_from_wan(shot["input720"])
        with Image.open(source_path) as source:
            if source.size != MASTER_SIZE:
                raise SystemExit(f"source must be {MASTER_SIZE}: {source_path} is {source.size}")
            image = make_input(source)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(target_path, format="PNG", optimize=True)
        print(f"WROTE_WAN_INPUT {shot['id']} {target_path.name} {image.width}x{image.height}")


def build_prompt_files(manifest: dict) -> None:
    prompt_dir = WAN_ROOT / "prompts"
    prompt_dir.mkdir(parents=True, exist_ok=True)
    for shot in manifest["shots"]:
        path = prompt_dir / f"NRT-WAN-{shot['id']}-prompt.txt"
        path.write_text(shot["prompt"].strip() + "\n", encoding="utf-8")
        print(f"WROTE_WAN_PROMPT {shot['id']} {path.name}")


def truncate(text: str, width: int = 58) -> str:
    return textwrap.shorten(text, width=width, placeholder="...")


def draw_board(manifest: dict) -> None:
    width, height = 1920, 1080
    header_height = 80
    card_width = 480
    card_height = 500
    canvas = Image.new("RGB", (width, height), "#020202")
    draw = ImageDraw.Draw(canvas)

    draw.text((24, 10), "WAN 2.7 - RED THREAD BOARD", fill="#fff2f2", font=font(34, bold=True))
    draw.text(
        (24, 49),
        "8 x 5s | 720p IMAGE-TO-VIDEO | 2 HARD FLF ANCHORS | NO RUNS YET | 0 CREDITS",
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
        if shot.get("flf"):
            draw.rounded_rectangle((x0 + 389, y0 + 10, x0 + 459, y0 + 39), radius=5, fill="#8a1010")
            draw.text((x0 + 405, y0 + 15), "FLF", fill="#ffffff", font=font(15, bold=True))

        input_path = resolve_from_wan(shot["input720"])
        with Image.open(input_path) as source:
            thumbnail = ImageOps.fit(source.convert("RGB"), (440, 248), method=Image.Resampling.LANCZOS)
        canvas.paste(thumbnail, (x0 + 20, y0 + 48))
        draw.rectangle((x0 + 20, y0 + 48, x0 + 459, y0 + 295), outline="#6b1111", width=1)

        segments = [
            ("0-1 SETUP", "#3b0808", 100),
            ("1-4.5 ACTION", "#680e0e", 240),
            ("4.5-5 HOLD", "#3b0808", 100),
        ]
        cursor = x0 + 20
        for label, color, segment_width in segments:
            draw.rectangle((cursor, y0 + 309, cursor + segment_width - 1, y0 + 346), fill=color)
            box = draw.textbbox((0, 0), label, font=font(14, bold=True))
            text_width = box[2] - box[0]
            draw.text(
                (cursor + (segment_width - text_width) // 2, y0 + 319),
                label,
                fill="#fff0f0",
                font=font(14, bold=True),
            )
            cursor += segment_width

        summaries = [
            ("0-1", shot["timeline"]["setup0to1"]),
            ("1-4.5", shot["timeline"]["action1to4_5"]),
            ("4.5-5", shot["timeline"]["hold4_5to5"]),
        ]
        for line_index, (timecode, summary) in enumerate(summaries):
            y = y0 + 361 + line_index * 39
            draw.text((x0 + 20, y), timecode, fill="#ef4d4d", font=font(16, bold=True))
            draw.text((x0 + 83, y), truncate(summary, 55), fill="#d7caca", font=font(15))

        draw.text((x0 + 20, y0 + 474), shot["outputName"], fill="#7e6b6b", font=font(13))

    BOARD.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(BOARD, format="PNG", optimize=True)
    print(f"WROTE_WAN_BOARD {BOARD.name} {canvas.width}x{canvas.height}")


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
    if manifest.get("product") != "WAN 2.7":
        errors.append("product must be WAN 2.7")
    settings = manifest.get("settings", {})
    if settings.get("durationSeconds") != 5 or settings.get("resolution") != "720p":
        errors.append("settings must be 5 seconds at 720p")
    if settings.get("promptExtend") is not False:
        errors.append("promptExtend must be false")
    generation = manifest.get("generation", {})
    for field in ("callsMade", "clipsGenerated", "generatedSeconds", "creditsSpent"):
        if generation.get(field) != 0:
            errors.append(f"zero-use board violated: generation.{field}={generation.get(field)}")
    flf_ids = [shot.get("id") for shot in shots if shot.get("flf")]
    if flf_ids != ["N04", "N08"]:
        errors.append(f"hard FLF anchors must be N04 and N08, got {flf_ids}")
    if next((shot for shot in shots if shot.get("id") == "N08"), {}).get("lastFrame") != "inputs/NRT-WAN-N01-keyframe-1280x720.png":
        errors.append("N08 must bind the exact N01 input as lastFrame")

    hashes: set[str] = set()
    for shot in shots:
        source_path = resolve_from_wan(shot["sourceMaster"])
        target_path = resolve_from_wan(shot["input720"])
        prompt_path = WAN_ROOT / "prompts" / f"NRT-WAN-{shot['id']}-prompt.txt"
        prompt = shot.get("prompt", "")
        word_count = prompt_word_count(prompt)
        if not prompt.startswith(PROMPT_PREFIX):
            errors.append(f"{shot['id']}: literal prompt prefix missing")
        if STYLE_LOCK not in prompt:
            errors.append(f"{shot['id']}: exact style lock missing")
        if AUDIO_LOCK not in prompt:
            errors.append(f"{shot['id']}: audio lock missing")
        if "4.5 seconds" not in prompt or "hold" not in prompt.lower():
            errors.append(f"{shot['id']}: 4.5-second settle/final hold missing")
        if word_count > MAX_PROMPT_WORDS:
            errors.append(f"{shot['id']}: prompt has {word_count} words > {MAX_PROMPT_WORDS}")
        prompt_file_matches = prompt_path.is_file() and prompt_path.read_text(encoding="utf-8").strip() == prompt.strip()
        if not prompt_file_matches:
            errors.append(f"{shot['id']}: prompt file missing or does not match manifest")
        source_exists = source_path.is_file()
        target_exists = target_path.is_file()
        pixel_exact_derivation = False
        target_hash = ""
        if not source_exists:
            errors.append(f"{shot['id']}: missing source master")
        if not target_exists:
            errors.append(f"{shot['id']}: missing 720p input")
        if source_exists and target_exists:
            with Image.open(source_path) as source, Image.open(target_path) as target:
                expected = make_input(source)
                actual = target.convert("RGB")
                if source.size != MASTER_SIZE:
                    errors.append(f"{shot['id']}: source dimensions {source.size} != {MASTER_SIZE}")
                if actual.size != INPUT_SIZE:
                    errors.append(f"{shot['id']}: input dimensions {actual.size} != {INPUT_SIZE}")
                pixel_exact_derivation = ImageChops.difference(expected, actual).getbbox() is None
                if not pixel_exact_derivation:
                    errors.append(f"{shot['id']}: input is not the exact center-crop plus Lanczos derivation")
            target_hash = sha256(target_path)
            if target_hash in hashes:
                errors.append(f"{shot['id']}: duplicate 720p input bytes")
            hashes.add(target_hash)
        rows.append(
            {
                "id": shot["id"],
                "sourceExists": source_exists,
                "inputExists": target_exists,
                "pixelExactDerivation": pixel_exact_derivation,
                "inputSha256": target_hash,
                "promptFileMatches": prompt_file_matches,
                "promptWords": word_count,
                "flf": shot.get("flf", False),
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
        "schema": "netflix-red-thread-wan-board-qa/v1",
        "status": "RED" if errors else "GREEN",
        "errors": errors,
        "product": manifest.get("product"),
        "durationSeconds": settings.get("durationSeconds"),
        "resolution": settings.get("resolution"),
        "promptExtend": settings.get("promptExtend"),
        "shots": rows,
        "board": board_result,
        "callsMade": generation.get("callsMade"),
        "creditsSpent": generation.get("creditsSpent"),
    }
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if errors:
        print("RED_WAN_BOARD_VERIFY")
        for error in errors:
            print(f"  {error}")
        return 1
    print("GREEN_WAN_BOARD_VERIFY 8/8 exact 1280x720 inputs + board; calls 0, credits 0")
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
