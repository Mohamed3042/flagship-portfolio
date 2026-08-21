#!/usr/bin/env python3
"""Build the deterministic Grok 1080p handoff inputs and visual board."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "public/worlds/assets/spotify-side-a-recut"
FINAL = ASSET_ROOT / "keyframes/final"
GROK = ASSET_ROOT / "grok"
INPUT = GROK / "input"

SHOTS = [
    ("G01", "First Light", "KF01.png", "KF02.png", "hold 0-2 | reveal 2-8 | LED 8-10.5 | settle 11-15"),
    ("G02", "Contact", "KF02.png", "KF03.png", "wide 0-1.5 | crane/contact 1.5-9.5 | hold 11.5-15"),
    ("G03", "The Sundial", "STYLE.png", "KF04.png", "hold 0-2 | climb/rotate 2-10.5 | hold 11.5-15"),
    ("G04", "The Aligned Desk", "KF05.png", "KF05.png", "random 0-4 | align 4-8.5 | ghost/hold 8.5-15"),
    ("G05", "The Passing Car", "KF06.png", "KF06.png", "still 0-3 | sweep 3-10.5 | settle 11.5-15"),
    ("G06", "The Synchronized Room", "KF05.png", "KF07.png", "desk 0-2 | open-out 2-10 | dim/hold 9-15"),
    ("G07", "Needle Up", "KF03.png", "KF01.png", "macro 0-2 | lift/dust 2-8 | loop hold 11.5-15"),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = ["seguisb.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for name in candidates:
        path = Path(r"C:\Windows\Fonts") / name
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def exact_1080(source: Path) -> Image.Image:
    with Image.open(source) as image:
        rgb = image.convert("RGB")
        if rgb.size != (1920, 1088):
            raise ValueError(f"{source.name}: expected 1920x1088, got {rgb.size}")
        # Phase-1 normalization deliberately added 4 black pixels top/bottom.
        return rgb.crop((0, 4, 1920, 1084))


def build_inputs() -> list[dict]:
    INPUT.mkdir(parents=True, exist_ok=True)
    manifest: list[dict] = []
    for shot, title, start_name, target_name, timing in SHOTS:
        output = INPUT / f"{shot}-start.png"
        exact_1080(FINAL / start_name).save(output, format="PNG", optimize=True)
        payload = output.read_bytes()
        manifest.append(
            {
                "shot": shot,
                "title": title,
                "input": str(output.relative_to(GROK)).replace("\\", "/"),
                "source": f"../keyframes/final/{start_name}",
                "editorialTarget": f"../keyframes/final/{target_name}",
                "timing": timing,
                "width": 1920,
                "height": 1080,
                "sha256": hashlib.sha256(payload).hexdigest(),
            }
        )
    return manifest


def thumbnail(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as image:
        return ImageOps.fit(image.convert("RGB"), size, method=Image.Resampling.LANCZOS)


def build_board(manifest: list[dict]) -> Path:
    width = 1920
    top = 150
    row_height = 230
    height = top + row_height * len(SHOTS) + 30
    board = Image.new("RGB", (width, height), "#050a0b")
    draw = ImageDraw.Draw(board)
    title_font = font(44, True)
    subtitle_font = font(24)
    row_title_font = font(30, True)
    meta_font = font(20)
    label_font = font(17, True)

    draw.text((40, 24), "GROK IMAGINE 1.5 — 1080P / 15S MOTION STUDY", fill="#dcff47", font=title_font)
    draw.text(
        (42, 84),
        "7 single shots · upload START only · TARGET is editorial intent · compare best 5s later against WAN",
        fill="#a7b2b5",
        font=subtitle_font,
    )

    thumb_size = (350, 197)
    for index, ((shot, title, start_name, target_name, timing), row) in enumerate(zip(SHOTS, manifest)):
        y = top + index * row_height
        if index % 2:
            draw.rectangle((20, y, width - 20, y + row_height - 8), fill="#081113")
        start = thumbnail(FINAL / start_name, thumb_size)
        target = thumbnail(FINAL / target_name, thumb_size)
        board.paste(start, (40, y + 24))
        board.paste(target, (450, y + 24))
        draw.text((48, y + 27), "START", fill="#dcff47", font=label_font, stroke_width=2, stroke_fill="#050a0b")
        draw.text((458, y + 27), "TARGET", fill="#b99cff", font=label_font, stroke_width=2, stroke_fill="#050a0b")
        draw.line((405, y + 122, 437, y + 122), fill="#dcff47", width=4)
        draw.polygon([(437, y + 122), (425, y + 114), (425, y + 130)], fill="#dcff47")
        draw.text((845, y + 40), f"{shot}  {title}", fill="#f0f4f4", font=row_title_font)
        draw.text((845, y + 92), timing, fill="#dcff47", font=meta_font)
        draw.text(
            (845, y + 132),
            f"input/{shot}-start.png  ·  1920x1080  ·  15s  ·  image-to-video",
            fill="#a7b2b5",
            font=meta_font,
        )
        draw.text((845, y + 172), f"SHA-256 {row['sha256'][:20]}…", fill="#69777a", font=meta_font)

    output = GROK / "GROK-1080P-15S-BOARD.png"
    board.save(output, format="PNG", optimize=True)
    return output


def main() -> int:
    manifest = build_inputs()
    board = build_board(manifest)
    payload = {
        "schema": "spotify-side-a-grok-board/v1",
        "model": "grok-imagine-video-1.5",
        "mode": "image-to-video",
        "resolution": "1080p",
        "durationSeconds": 15,
        "aspectRatio": "16:9",
        "videoGenerated": False,
        "shots": manifest,
    }
    manifest_path = GROK / "GROK-1080P-15S-manifest.json"
    manifest_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"GREEN_GROK_BOARD inputs={len(manifest)} exact=1920x1080 board={board.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
