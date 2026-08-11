from __future__ import annotations

import hashlib
import csv
import json
import struct
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "shot-manifest.json"
KEYFRAMES = ROOT / "keyframes"
PROMPTS = ROOT / "prompts"
RUN_MANIFEST = ROOT / "RUN-MANIFEST.csv"
BOARD_DIR = (
    ROOT.parents[1]
    / "public"
    / "worlds"
    / "assets"
    / "disney2"
    / "wan-production"
)
BOARD_HTML = BOARD_DIR / "WAN-GENERATION-BOARD.html"
BOARD_JOBS = BOARD_DIR / "wan-jobs.js"
REMOTE_KEYFRAME_ROOT = (
    "https://raw.githubusercontent.com/Mohamed3042/flagship-portfolio/"
    "b61e3f878c11851f65e4f2bd4c2425fd812a44c0/"
    "production/disney-continuation-80/keyframes"
)
EXPECTED_FIELDS = {
    "shot",
    "act",
    "act_title",
    "title",
    "first",
    "last",
    "still_prompt",
    "video_prompt",
}
EXPECTED_ACTS = {
    **{number: "VII" for number in range(21, 31)},
    **{number: "VIII" for number in range(31, 41)},
    **{number: "IX" for number in range(41, 51)},
    **{number: "X" for number in range(51, 61)},
    **{number: "XI" for number in range(61, 71)},
    **{number: "XII" for number in range(71, 81)},
    **{number: "XIII" for number in range(81, 91)},
    **{number: "XIV" for number in range(91, 101)},
}


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as handle:
        header = handle.read(24)
    if len(header) != 24 or header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
        raise ValueError("not a valid PNG")
    return struct.unpack(">II", header[16:24])


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def expected_prompt_text(shot: dict) -> str:
    number = shot["shot"]
    return (
        f"DSN2-{number:03d} | {shot['title']}\n"
        f"FIRST FRAME: keyframes/{shot['first']}.png\n"
        f"LAST FRAME: keyframes/{shot['last']}.png\n\n"
        "PROMPT\n"
        f"{shot['video_prompt'].strip()}\n"
    )


def load_board_jobs(errors: list[str]) -> list[dict]:
    if not BOARD_JOBS.exists():
        fail(errors, "missing WAN board jobs")
        return []
    text = BOARD_JOBS.read_text(encoding="utf-8")
    prefix = (
        "// Generated from production/disney-continuation-80/shot-manifest.json\n"
        "window.DSN2_WAN_JOBS = "
    )
    if not text.startswith(prefix) or not text.endswith(";\n"):
        fail(errors, "WAN board jobs wrapper is invalid")
        return []
    try:
        payload = json.loads(text[len(prefix) : -2])
    except Exception as exc:
        fail(errors, f"WAN board jobs JSON is invalid: {exc}")
        return []
    if not isinstance(payload, list):
        fail(errors, "WAN board jobs payload is not a list")
        return []
    return payload


def main() -> int:
    errors: list[str] = []
    if not MANIFEST.exists():
        print("PACK_RED missing shot-manifest.json")
        return 1
    try:
        shots = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"PACK_RED invalid manifest: {exc}")
        return 1
    if not isinstance(shots, list) or len(shots) != 80:
        fail(errors, f"manifest count expected 80, got {len(shots) if isinstance(shots, list) else 'non-list'}")
        shots = shots if isinstance(shots, list) else []
    expected_numbers = list(range(21, 101))
    actual_numbers = [shot.get("shot") for shot in shots]
    if actual_numbers != expected_numbers:
        fail(errors, "manifest numbers are not exact 21..100")

    hashes: dict[str, str] = {}
    for shot in shots:
        number = shot.get("shot")
        if not isinstance(number, int):
            continue
        if set(shot) != EXPECTED_FIELDS:
            fail(errors, f"shot {number}: schema differs from exact eight fields")
        if shot.get("act") != EXPECTED_ACTS.get(number):
            fail(errors, f"shot {number}: wrong act {shot.get('act')!r}")
        expected_first = "KF01" if number == 21 else f"KF{number - 1}"
        expected_last = f"KF{number}"
        if shot.get("first") != expected_first or shot.get("last") != expected_last:
            fail(errors, f"shot {number}: broken endpoint chain")
        still_prompt = str(shot.get("still_prompt", ""))
        video_prompt = str(shot.get("video_prompt", ""))
        if len(still_prompt) < 120:
            fail(errors, f"shot {number}: still prompt too short")
        still_lower = still_prompt.lower()
        if "2:1" not in still_lower:
            fail(errors, f"shot {number}: still prompt missing '2:1'")
        if not any(token in still_lower for token in ("paper", "parchment", "handcrafted", "storybook", "wax", "brass")):
            fail(errors, f"shot {number}: still prompt lacks material/style lock")
        if not any(
            token in still_lower
            for token in (
                "no text",
                "no readable text",
                "text,",
                "no writing",
                "no written",
                "no inscriptions",
                "no readable marks",
                "no readable symbols",
                "no face, readable marks",
                "no labels",
            )
        ):
            fail(errors, f"shot {number}: still prompt lacks text exclusion")
        if len(video_prompt) < 220:
            fail(errors, f"shot {number}: video prompt too short")
        lower = video_prompt.lower()
        for token in ("wan 2.7", "5-second", "immutable", "4.5", "no text", "no cut"):
            if token not in lower:
                fail(errors, f"shot {number}: video prompt missing {token!r}")
        if not any(token in lower for token in ("camera", "push", "pull", "track", "truck", "crane", "orbit", "rack of depth", "tilt", "move", "drift", "glide", "follow", "locked")):
            fail(errors, f"shot {number}: video prompt lacks a single camera instruction")
        if not any(token in lower for token in ("new objects", "new object", "new bird", "invent", "beyond the supplied endpoints", "beyond the endpoint frames", "unshown objects", "extra ", "added ", "spawning", "empty space")):
            fail(errors, f"shot {number}: video prompt lacks new-object exclusion")

        prompt_file = PROMPTS / f"DSN2-{number:03d}.txt"
        if not prompt_file.exists():
            fail(errors, f"shot {number}: missing one-prompt file")
        else:
            prompt_text = prompt_file.read_text(encoding="utf-8")
            if prompt_text != expected_prompt_text(shot):
                fail(errors, f"shot {number}: one-prompt file differs from manifest")

        frame = KEYFRAMES / f"KF{number}.png"
        if not frame.exists():
            fail(errors, f"shot {number}: missing {frame.name}")
            continue
        if frame.stat().st_size < 100_000:
            fail(errors, f"shot {number}: {frame.name} unexpectedly small")
        try:
            dimensions = png_size(frame)
        except Exception as exc:
            fail(errors, f"shot {number}: {frame.name} {exc}")
            continue
        if dimensions != (1920, 960):
            fail(errors, f"shot {number}: {frame.name} is {dimensions[0]}x{dimensions[1]}")
        with Image.open(frame) as image:
            if image.mode != "RGB":
                fail(errors, f"shot {number}: {frame.name} mode is {image.mode}, expected RGB")
        digest = hashlib.sha256(frame.read_bytes()).hexdigest()
        if digest in hashes:
            fail(errors, f"shot {number}: duplicate pixels with {hashes[digest]}")
        hashes[digest] = frame.name

    anchor = KEYFRAMES / "KF01.png"
    if not anchor.exists():
        fail(errors, "missing self-contained KF01 first-frame anchor")
    elif png_size(anchor) != (1920, 960):
        fail(errors, "KF01 anchor is not 1920x960")

    prompt_names = sorted(path.name for path in PROMPTS.glob("DSN2-*.txt"))
    expected_prompt_names = [f"DSN2-{number:03d}.txt" for number in range(21, 101)]
    if prompt_names != expected_prompt_names:
        fail(errors, "prompt directory is not exact DSN2-021..100")

    keyframe_names = sorted(
        (path.name for path in KEYFRAMES.glob("KF*.png")),
        key=lambda name: int(name[2:-4]),
    )
    expected_keyframe_names = ["KF01.png"] + [f"KF{number}.png" for number in range(21, 101)]
    if keyframe_names != expected_keyframe_names:
        fail(errors, "keyframe directory contains a missing or unexpected PNG")

    if not RUN_MANIFEST.exists():
        fail(errors, "missing RUN-MANIFEST.csv")
    else:
        with RUN_MANIFEST.open("r", encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
        if len(rows) != 80:
            fail(errors, f"run manifest expected 80 rows, got {len(rows)}")
        for index, row in enumerate(rows, 21):
            first = "KF01" if index == 21 else f"KF{index - 1}"
            expected = {
                "clip": f"DSN2-{index:03d}",
                "first": first,
                "last": f"KF{index}",
                "duration_seconds": "5.000",
                "frames": "150",
                "status": "reference-ready",
                "file": f"wan/DSN2-{index:03d}.mp4",
            }
            for field, value in expected.items():
                if row.get(field) != value:
                    fail(errors, f"run manifest row {index}: {field} is {row.get(field)!r}")

    if not BOARD_HTML.exists():
        fail(errors, "missing WAN-GENERATION-BOARD.html")
    else:
        board_html = BOARD_HTML.read_text(encoding="utf-8")
        for marker in (
            "Disney II · WAN Generation Board",
            "First frame → last frame. One prompt.",
            "window.DSN2_WAN_JOBS",
            "disney2-continuation-80-wan-done-v1",
            "loading=\"${index < 2 ? 'eager' : 'lazy'}\"",
            "data-state-filter=\"pending\"",
            "Act ${job.act}",
        ):
            if marker not in board_html:
                fail(errors, f"WAN board HTML missing {marker!r}")
        if "Cake Studio" in board_html or "CST17" in board_html:
            fail(errors, "WAN board contains Cake Studio residue")

    board_jobs = load_board_jobs(errors)
    if len(board_jobs) != 80:
        fail(errors, f"WAN board expected 80 jobs, got {len(board_jobs)}")
    for position, (shot, job) in enumerate(zip(shots, board_jobs), 1):
        number = shot["shot"]
        expected_first = f"{shot['first']}.png"
        expected_last = f"{shot['last']}.png"
        expected = {
            "id": f"DSN2-{number:03d}",
            "position": position,
            "shot": number,
            "act": shot["act"],
            "actTitle": shot["act_title"],
            "title": shot["title"],
            "output": f"DSN2-{number:03d}.mp4",
            "firstName": expected_first,
            "lastName": expected_last,
            "first": (
                "../../../../../production/disney-continuation-80/keyframes/"
                + expected_first
            ),
            "last": (
                "../../../../../production/disney-continuation-80/keyframes/"
                + expected_last
            ),
            "promptFile": (
                "../../../../../production/disney-continuation-80/prompts/"
                f"DSN2-{number:03d}.txt"
            ),
            "firstRemote": f"{REMOTE_KEYFRAME_ROOT}/{expected_first}",
            "lastRemote": f"{REMOTE_KEYFRAME_ROOT}/{expected_last}",
            "prompt": shot["video_prompt"],
        }
        for field, value in expected.items():
            if job.get(field) != value:
                fail(errors, f"WAN board job {number}: {field} differs from manifest")

    if errors:
        print(f"PACK_RED {len(errors)} error(s)")
        for error in errors[:25]:
            print(f"- {error}")
        if len(errors) > 25:
            print(f"- ... {len(errors) - 25} more")
        return 1
    print("WAN_BOARD_GREEN 80/80 cards=80 filters=act+status progress=localStorage")
    print("DISNEY_CONTINUATION_GREEN 80/80 keyframes=80 prompts=80 chain=KF01->KF100 canvas=1920x960")
    return 0


if __name__ == "__main__":
    sys.exit(main())
