from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build a labeled Disney keyframe contact sheet")
    parser.add_argument("--start", type=int, required=True)
    parser.add_argument("--end", type=int, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--columns", type=int, default=4)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    root = Path(__file__).resolve().parents[1]
    paths = [root / "keyframes" / f"KF{number}.png" for number in range(args.start, args.end + 1)]
    missing = [path.name for path in paths if not path.exists()]
    if missing:
        raise SystemExit(f"missing keyframes: {', '.join(missing)}")

    thumb_width = 480
    thumb_height = 240
    label_height = 34
    columns = max(1, args.columns)
    rows = math.ceil(len(paths) / columns)
    sheet = Image.new("RGB", (columns * thumb_width, rows * (thumb_height + label_height)), "#070503")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 22)
    except OSError:
        font = ImageFont.load_default()

    for index, path in enumerate(paths):
        with Image.open(path) as source:
            frame = source.convert("RGB").resize((thumb_width, thumb_height), Image.Resampling.LANCZOS)
        x = (index % columns) * thumb_width
        y = (index // columns) * (thumb_height + label_height)
        sheet.paste(frame, (x, y))
        label = path.stem
        draw.rectangle((x, y + thumb_height, x + thumb_width, y + thumb_height + label_height), fill="#070503")
        draw.text((x + 10, y + thumb_height + 4), label, font=font, fill="#e8dcc0")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(args.out, optimize=True)
    print(f"CONTACT_SHEET_OK {args.start}-{args.end} {len(paths)} frames {sheet.width}x{sheet.height} {args.out}")


if __name__ == "__main__":
    main()
