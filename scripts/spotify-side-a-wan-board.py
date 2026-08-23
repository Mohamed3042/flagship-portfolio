#!/usr/bin/env python3
"""Build deterministic WAN 720p FLF inputs and visual board."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "public/worlds/assets/spotify-side-a-recut"
FINAL = ASSET_ROOT / "keyframes/final"
WAN = ASSET_ROOT / "wan"
INPUT = WAN / "input"

SHOTS = [
    ("W01", "First Light", "KF01.png", "KF02.png", "point 0-3.2 | LED 3.2 | settle 4.5-5"),
    ("W02", "Contact", "KF02.png", "KF03.png", "crane 0-3.4 | contact 3.4 | settle 4.5-5"),
    ("W03", "The Sundial", "STYLE.png", "KF04.png", "climb/rotate 0-4.2 | settle 4.2-5"),
    ("W04", "The Aligned Desk", "KF05.png", "KF05.png", "track 0-4 | align mid-shot | settle 4.5-5"),
    ("W05", "The Passing Car", "KF06.png", "KF06.png", "sweep 0-4.2 | swell mid-shot | settle 4.5-5"),
    ("W06", "The Synchronized Room", "KF05.png", "KF07.png", "open-out 0-3.8 | pulse/dim 2.3-4.3 | hold 4.5-5"),
    ("W07", "Needle Up", "KF03.png", "KF01.png", "lift 0-2.8 | tilt 2.8-4.2 | loop hold 4.5-5"),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = ["seguisb.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(Path(r"C:\Windows\Fonts") / name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def exact_720(source: Path) -> Image.Image:
    with Image.open(source) as image:
        rgb = image.convert("RGB")
        if rgb.size != (1920, 1088):
            raise ValueError(f"{source.name}: expected 1920x1088, got {rgb.size}")
        cropped = rgb.crop((0, 4, 1920, 1084))
        return cropped.resize((1280, 720), Image.Resampling.LANCZOS)


def build_inputs() -> list[dict]:
    INPUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for shot, title, first_name, last_name, timing in SHOTS:
        first_path = INPUT / f"{shot}-first.png"
        last_path = INPUT / f"{shot}-last.png"
        exact_720(FINAL / first_name).save(first_path, format="PNG", optimize=True)
        exact_720(FINAL / last_name).save(last_path, format="PNG", optimize=True)
        manifest.append(
            {
                "shot": shot,
                "title": title,
                "first": str(first_path.relative_to(WAN)).replace("\\", "/"),
                "last": str(last_path.relative_to(WAN)).replace("\\", "/"),
                "firstSource": f"../keyframes/final/{first_name}",
                "lastSource": f"../keyframes/final/{last_name}",
                "timing": timing,
                "firstSha256": hashlib.sha256(first_path.read_bytes()).hexdigest(),
                "lastSha256": hashlib.sha256(last_path.read_bytes()).hexdigest(),
            }
        )
    return manifest


def thumb(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as image:
        return ImageOps.fit(image.convert("RGB"), size, method=Image.Resampling.LANCZOS)


def build_board(manifest: list[dict]) -> Path:
    width, top, row_height = 1920, 150, 230
    board = Image.new("RGB", (width, top + row_height * len(SHOTS) + 30), "#050a0b")
    draw = ImageDraw.Draw(board)
    draw.text((40, 24), "WAN 2.7 — 720P / 5S FLF MOTION BOARD", fill="#53f9a2", font=font(44, True))
    draw.text(
        (42, 84),
        "7 approved first/last pairs · exact 5-second landings · same motion studies as the Grok comparison",
        fill="#a7b2b5",
        font=font(24),
    )
    size = (350, 197)
    for index, ((shot, title, first_name, last_name, timing), row) in enumerate(zip(SHOTS, manifest)):
        y = top + index * row_height
        if index % 2:
            draw.rectangle((20, y, width - 20, y + row_height - 8), fill="#081113")
        board.paste(thumb(FINAL / first_name, size), (40, y + 24))
        board.paste(thumb(FINAL / last_name, size), (450, y + 24))
        draw.text((48, y + 27), "FIRST", fill="#53f9a2", font=font(17, True), stroke_width=2, stroke_fill="#050a0b")
        draw.text((458, y + 27), "LAST", fill="#b99cff", font=font(17, True), stroke_width=2, stroke_fill="#050a0b")
        draw.line((405, y + 122, 437, y + 122), fill="#53f9a2", width=4)
        draw.polygon([(437, y + 122), (425, y + 114), (425, y + 130)], fill="#53f9a2")
        draw.text((845, y + 40), f"{shot}  {title}", fill="#f0f4f4", font=font(30, True))
        draw.text((845, y + 92), timing, fill="#53f9a2", font=font(20))
        draw.text((845, y + 132), f"input/{shot}-first.png  →  input/{shot}-last.png", fill="#a7b2b5", font=font(20))
        draw.text((845, y + 172), "1280x720 · 5s · FLF · prompt_extend false", fill="#69777a", font=font(20))
    output = WAN / "WAN-720P-5S-BOARD.png"
    board.save(output, format="PNG", optimize=True)
    return output


def main() -> int:
    manifest = build_inputs()
    board = build_board(manifest)
    payload = {
        "schema": "spotify-side-a-wan-board/v1",
        "model": "WAN 2.7",
        "mode": "first-and-last-frame image-to-video",
        "resolution": "720p",
        "durationSeconds": 5,
        "aspectRatio": "16:9",
        "promptExtend": False,
        "userApproved": "2026-08-21",
        "videoGenerated": False,
        "shots": manifest,
    }
    (WAN / "WAN-720P-5S-manifest.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"GREEN_WAN_BOARD pairs={len(manifest)} exact=1280x720 board={board.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
