#!/usr/bin/env python3
"""Build the two phone-safe Cake Studio v1.7.2 bookend masters.

The fifteen accepted v1.7 clips remain the source of truth and are never
modified.  At 15 fps, every non-final beat keeps source frames 0,2..132 plus
the exact conditioned endpoint at frame 149.  The final beat keeps 0,2..144
plus frames 148 and 149, preserving the exact outer endpoint and duration.
"""

from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MEDIA = ROOT / "public" / "worlds" / "cake-studio" / "v17" / "clips"
FPS = 15
MASTER_BEAT_FRAMES = 68
FINAL_TAIL_EXTRA_FRAMES = 7
KEYFRAME_INTERVAL = 8
TERMINAL_FRAME_OFFSET = 2
CRF = 28
WIDTH = 640
HEIGHT = 360
ATLAS_TILE_WIDTH = 384
ATLAS_TILE_HEIGHT = 216
ATLAS_QUALITY = 85
TERMINAL_STILL_QUALITY = 100

TRACKS = {
    "intro": {
        "ids": [f"I{index:02d}" for index in range(1, 11)],
        "output": "CST17-INTRO-PHONE-v172.mp4",
        "bytes": 5_091_536,
        "sha256": "6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670",
        "scrubAtlas": {
            "output": "CST17-INTRO-PHONE-SCRUB-v172.webp",
            "bytes": 326_692,
            "sha256": "1e94474cee9abdd7e0af7ea7679d4b004cf5d3313287c06c358f4368e3c1f1c5",
            "columns": 8,
            "rows": 4,
            "frames": [0, 22, 44, 66, 88, 110, 133, 155, 177, 199, 221, 243, 265, 287, 309, 331, 354, 376, 398, 420, 442, 464, 486, 508, 530, 552, 575, 597, 619, 641, 663, 685],
        },
        "terminalStill": {
            "output": "CST17-INTRO-PHONE-TERMINAL-v172.webp",
            "bytes": 106_416,
            "sha256": "513bcc97d522d84cb0ead674be5aa59b8b04d8cbb62527c1e63a4d9afe1fc4ee",
            "frame": 685,
        },
    },
    "outro": {
        "ids": [f"O{index:02d}" for index in range(1, 6)],
        "output": "CST17-OUTRO-PHONE-v172.mp4",
        "bytes": 2_479_879,
        "sha256": "65e51883d99862fd86ca159bda4fd1c7bdd0f394734be422cb650516f31dca15",
        "scrubAtlas": {
            "output": "CST17-OUTRO-PHONE-SCRUB-v172.webp",
            "bytes": 179_822,
            "sha256": "5717337b6e0674f08f99a945fc4aa2dee69f2ab09380bdd04c2da6218a0b9c2c",
            "columns": 8,
            "rows": 2,
            "frames": [0, 23, 46, 69, 92, 115, 138, 161, 184, 207, 230, 253, 276, 299, 322, 345],
        },
        "terminalStill": {
            "output": "CST17-OUTRO-PHONE-TERMINAL-v172.webp",
            "bytes": 91_242,
            "sha256": "df40c40bbaf66b867bcdb4ffc95d095f1b7d5a97f7815498f2f122ee380037eb",
            "frame": 345,
        },
    },
}


def run(command: list[str]) -> None:
    completed = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    if completed.returncode:
        detail = (completed.stderr or completed.stdout).strip()
        raise RuntimeError(f"command failed ({completed.returncode}): {' '.join(command)}\n{detail}")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def require_binary(path: Path, expected_bytes: int, expected_hash: str) -> None:
    actual_bytes = path.stat().st_size
    actual_hash = sha256(path)
    if actual_bytes != expected_bytes or actual_hash != expected_hash:
        raise RuntimeError(
            f"generated {path.name} differs from the accepted v1.7.2 binary: "
            f"bytes={actual_bytes} sha256={actual_hash}"
        )


def decode_master(path: Path, expected_frames: int) -> list[np.ndarray]:
    capture = cv2.VideoCapture(str(path))
    if not capture.isOpened():
        raise RuntimeError(f"OpenCV cannot open generated master: {path}")
    frames: list[np.ndarray] = []
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        frames.append(frame)
    capture.release()
    if len(frames) != expected_frames:
        raise RuntimeError(f"generated {path.name} decoded {len(frames)} frames, expected {expected_frames}")
    return frames


def build_companion_images(master: Path, temp_dir: Path, contract: dict) -> list[Path]:
    expected_frames = len(contract["ids"]) * MASTER_BEAT_FRAMES + FINAL_TAIL_EXTRA_FRAMES
    frames = decode_master(master, expected_frames)
    atlas_contract = contract["scrubAtlas"]
    atlas = np.zeros(
        (
            int(atlas_contract["rows"]) * ATLAS_TILE_HEIGHT,
            int(atlas_contract["columns"]) * ATLAS_TILE_WIDTH,
            3,
        ),
        dtype=np.uint8,
    )
    for tile_index, frame_index in enumerate(atlas_contract["frames"]):
        row, column = divmod(tile_index, int(atlas_contract["columns"]))
        tile = cv2.resize(
            frames[int(frame_index)],
            (ATLAS_TILE_WIDTH, ATLAS_TILE_HEIGHT),
            interpolation=cv2.INTER_AREA,
        )
        top = row * ATLAS_TILE_HEIGHT
        left = column * ATLAS_TILE_WIDTH
        atlas[top : top + ATLAS_TILE_HEIGHT, left : left + ATLAS_TILE_WIDTH] = tile
    atlas_path = temp_dir / str(atlas_contract["output"])
    if not cv2.imwrite(str(atlas_path), atlas, [cv2.IMWRITE_WEBP_QUALITY, ATLAS_QUALITY]):
        raise RuntimeError(f"failed to encode {atlas_path.name}")
    require_binary(atlas_path, int(atlas_contract["bytes"]), str(atlas_contract["sha256"]))

    still_contract = contract["terminalStill"]
    still_path = temp_dir / str(still_contract["output"])
    if not cv2.imwrite(
        str(still_path),
        frames[int(still_contract["frame"])],
        [cv2.IMWRITE_WEBP_QUALITY, TERMINAL_STILL_QUALITY],
    ):
        raise RuntimeError(f"failed to encode {still_path.name}")
    require_binary(still_path, int(still_contract["bytes"]), str(still_contract["sha256"]))
    return [atlas_path, still_path]


def encode_track(ffmpeg: str, sources: list[Path], target: Path) -> None:
    # Encode the complete master once.  Independently encoding then joining
    # segments quantizes the two copies of an endpoint differently and can
    # create a phone-visible gamma/detail pop even when their source pixels are
    # identical.
    command = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y"]
    for source in sources:
        command.extend(["-i", str(source)])

    filtered = []
    labels = []
    for index in range(len(sources)):
        label = f"v{index}"
        if index == len(sources) - 1:
            selection = "not(mod(n\\,2))*lte(n\\,144)+eq(n\\,148)+eq(n\\,149)"
        else:
            selection = "not(mod(n\\,2))*lte(n\\,132)+eq(n\\,149)"
        filtered.append(f"[{index}:v]select='{selection}',setpts=N/({FPS}*TB)[{label}]")
        labels.append(f"[{label}]")
    filter_graph = (
        ";".join(filtered)
        + ";"
        + "".join(labels)
        + f"concat=n={len(sources)}:v=1:a=0,"
        + f"scale={WIDTH}:{HEIGHT}:flags=lanczos,format=yuv420p[outv]"
    )

    total_frames = len(sources) * MASTER_BEAT_FRAMES + FINAL_TAIL_EXTRA_FRAMES
    # Each conditioned join pair is both keyed and protected.  The final pair
    # is source frames 148,149 so the outer endpoint remains frame-exact while
    # the master retains the accepted 15 fps cadence.
    zones = ["0,0,q=0", f"{total_frames - 2},{total_frames - 1},q=0"]
    forced_indices = {0, total_frames - 2, total_frames - 1}
    for boundary in range(1, len(sources)):
        endpoint = boundary * MASTER_BEAT_FRAMES - 1
        start = boundary * MASTER_BEAT_FRAMES
        zones.append(f"{endpoint},{start},q=0")
        forced_indices.update((endpoint, start))
    forced_times = ",".join(f"{index / FPS:.9f}" for index in sorted(forced_indices))

    command.extend([
        "-filter_complex", filter_graph,
        "-map", "[outv]",
        "-frames:v", str(total_frames),
        "-fps_mode", "cfr",
        "-r", str(FPS),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", str(CRF),
        "-profile:v", "high",
        "-level:v", "3.1",
        "-refs", "3",
        "-bf", "2",
        "-g", str(KEYFRAME_INTERVAL),
        "-keyint_min", "1",
        "-sc_threshold", "0",
        "-force_key_frames", forced_times,
        "-x264-params", "zones=" + "/".join(zones),
        "-pix_fmt", "yuv420p",
        "-an",
        "-movflags", "+faststart",
        str(target),
    ])
    run(command)


def build_track(ffmpeg: str, media_dir: Path, track_name: str, force: bool) -> list[Path]:
    contract = TRACKS[track_name]
    targets = [
        media_dir / str(contract["output"]),
        media_dir / str(contract["scrubAtlas"]["output"]),
        media_dir / str(contract["terminalStill"]["output"]),
    ]
    conflicts = [str(path) for path in targets if path.exists()]
    if conflicts and not force:
        raise FileExistsError("refusing to overwrite generated phone outputs without --force: " + ", ".join(conflicts))

    source_paths = [media_dir / f"CST17-{clip_id}.mp4" for clip_id in contract["ids"]]
    missing = [str(path) for path in source_paths if not path.is_file()]
    if missing:
        raise FileNotFoundError("missing accepted v1.7 clips: " + ", ".join(missing))

    media_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=f"cake-studio-{track_name}-") as temp_name:
        temp_dir = Path(temp_name)
        assembled = temp_dir / str(contract["output"])
        encode_track(ffmpeg, source_paths, assembled)
        require_binary(assembled, int(contract["bytes"]), str(contract["sha256"]))
        generated = [assembled, *build_companion_images(assembled, temp_dir, contract)]
        for source, output in zip(generated, targets, strict=True):
            staged = output.with_name(output.name + ".staging")
            shutil.copyfile(source, staged)
            os.replace(staged, output)
    return targets


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--media-dir", type=Path, default=DEFAULT_MEDIA)
    parser.add_argument("--force", action="store_true", help="replace only the two generated master outputs")
    args = parser.parse_args()

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("ffmpeg is not available on PATH")
    media_dir = args.media_dir.resolve()

    outputs = [
        output
        for track_name in TRACKS
        for output in build_track(ffmpeg, media_dir, track_name, args.force)
    ]
    for output in outputs:
        print(f"BUILT {output.name} bytes={output.stat().st_size} sha256={sha256(output)}")
    print(
        "CAKE_STUDIO_V17_PHONE_MASTERS_BUILT "
        f"tracks=2 fps={FPS} size={WIDTH}x{HEIGHT} beat_frames={MASTER_BEAT_FRAMES} "
        f"final_tail_extra_frames={FINAL_TAIL_EXTRA_FRAMES} gop={KEYFRAME_INTERVAL} "
        f"terminal_frame_offset={TERMINAL_FRAME_OFFSET} crf={CRF} "
        f"scrub_atlases=2 atlas_tile={ATLAS_TILE_WIDTH}x{ATLAS_TILE_HEIGHT} atlas_quality={ATLAS_QUALITY} "
        f"terminal_stills=2 terminal_quality={TERMINAL_STILL_QUALITY}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
