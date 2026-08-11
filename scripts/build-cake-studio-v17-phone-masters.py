#!/usr/bin/env python3
"""Build the two phone-safe Cake Studio v1.7.1 bookend masters.

The fifteen accepted v1.7 clips remain the source of truth and are never
modified.  Every master beat keeps frames 0..134 plus the exact held endpoint
at frame 149.  That removes only the fourteen redundant tail-hold frames while
retaining every generated action frame and decoded continuity anchor.
"""

from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import tempfile


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MEDIA = ROOT / "public" / "worlds" / "cake-studio" / "v17" / "clips"
FPS = 30
MASTER_BEAT_FRAMES = 136
FINAL_TAIL_EXTRA_FRAMES = 14
KEYFRAME_INTERVAL = 15
WIDTH = 854
HEIGHT = 480

TRACKS = {
    "intro": {
        "ids": [f"I{index:02d}" for index in range(1, 11)],
        "output": "CST17-INTRO-PHONE-v171.mp4",
    },
    "outro": {
        "ids": [f"O{index:02d}" for index in range(1, 6)],
        "output": "CST17-OUTRO-PHONE-v171.mp4",
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
        selection = "lte(n\\,149)" if index == len(sources) - 1 else "lte(n\\,134)+eq(n\\,149)"
        filtered.append(f"[{index}:v]select='{selection}',setpts=N/(30*TB)[{label}]")
        labels.append(f"[{label}]")
    filter_graph = (
        ";".join(filtered)
        + ";"
        + "".join(labels)
        + f"concat=n={len(sources)}:v=1:a=0,"
        + f"scale={WIDTH}:{HEIGHT}:flags=lanczos,format=yuv420p[outv]"
    )

    total_frames = len(sources) * MASTER_BEAT_FRAMES + FINAL_TAIL_EXTRA_FRAMES
    # Keep each logical boundary keyed while avoiding a broad lossless window
    # that would inflate random-access delivery. The final outer seam gets its
    # own exact 15-frame tail below.
    zones = ["0,0,q=0"]
    for index in range(len(sources) - 1):
        endpoint = index * MASTER_BEAT_FRAMES + MASTER_BEAT_FRAMES - 1
        zones.append(f"{endpoint},{endpoint + 1},q=0")
    zones.append(f"{total_frames - 16},{total_frames - 1},q=0")

    command.extend([
        "-filter_complex", filter_graph,
        "-map", "[outv]",
        "-frames:v", str(total_frames),
        "-fps_mode", "cfr",
        "-r", str(FPS),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "28",
        "-profile:v", "high",
        "-level:v", "3.1",
        "-refs", "3",
        "-bf", "2",
        "-g", str(KEYFRAME_INTERVAL),
        "-keyint_min", str(KEYFRAME_INTERVAL),
        "-sc_threshold", "0",
        "-force_key_frames", f"expr:eq(mod(n,{MASTER_BEAT_FRAMES}),0)+eq(mod(n,{MASTER_BEAT_FRAMES}),{MASTER_BEAT_FRAMES - 1})+eq(n,{total_frames - 1})",
        "-x264-params", "zones=" + "/".join(zones),
        "-pix_fmt", "yuv420p",
        "-an",
        "-movflags", "+faststart",
        str(target),
    ])
    run(command)


def build_track(ffmpeg: str, media_dir: Path, track_name: str, force: bool) -> Path:
    contract = TRACKS[track_name]
    output = media_dir / str(contract["output"])
    if output.exists() and not force:
        raise FileExistsError(f"refusing to overwrite generated master without --force: {output}")

    source_paths = [media_dir / f"CST17-{clip_id}.mp4" for clip_id in contract["ids"]]
    missing = [str(path) for path in source_paths if not path.is_file()]
    if missing:
        raise FileNotFoundError("missing accepted v1.7 clips: " + ", ".join(missing))

    media_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=f"cake-studio-{track_name}-") as temp_name:
        temp_dir = Path(temp_name)
        assembled = temp_dir / str(contract["output"])
        encode_track(ffmpeg, source_paths, assembled)
        staged = output.with_suffix(".mp4.staging")
        shutil.copyfile(assembled, staged)
        os.replace(staged, output)
    return output


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--media-dir", type=Path, default=DEFAULT_MEDIA)
    parser.add_argument("--force", action="store_true", help="replace only the two generated master outputs")
    args = parser.parse_args()

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("ffmpeg is not available on PATH")
    media_dir = args.media_dir.resolve()

    outputs = [build_track(ffmpeg, media_dir, track_name, args.force) for track_name in TRACKS]
    for output in outputs:
        print(f"BUILT {output.name} bytes={output.stat().st_size} sha256={sha256(output)}")
    print(
        "CAKE_STUDIO_V17_PHONE_MASTERS_BUILT "
        f"tracks=2 fps={FPS} size={WIDTH}x{HEIGHT} beat_frames={MASTER_BEAT_FRAMES} "
        f"final_tail_extra_frames={FINAL_TAIL_EXTRA_FRAMES} gop={KEYFRAME_INTERVAL}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
