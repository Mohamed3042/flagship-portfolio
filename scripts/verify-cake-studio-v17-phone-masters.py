#!/usr/bin/env python3
"""Fail-capable media/runtime contract for Cake Studio v1.7.1 phone masters."""

from __future__ import annotations

import argparse
from fractions import Fraction
import json
from pathlib import Path
import subprocess

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public" / "worlds" / "cake-studio" / "v17" / "clips"
MANIFEST = ROOT / "public" / "worlds" / "cake-studio" / "v17" / "manifest.json"
FPS = 30.0
BEAT_FRAMES = 136
FINAL_TAIL_EXTRA_FRAMES = 14
PHONE_WIDTH = 854
PHONE_HEIGHT = 480
DISPLAY_WIDTH = 390
DISPLAY_HEIGHT = 219
MAX_GOP = 15.25
JOIN_MIN_SSIM = 0.984
JOIN_MAX_MAE = 2.4
OUTER_MIN_SSIM = 0.989
OUTER_MAX_MAE = 2.0

TRACKS = {
    "intro": {
        "prefix": "I",
        "beats": 10,
        "file": "CST17-INTRO-PHONE-v171.mp4",
        "max_bytes": 12 * 1024 * 1024,
    },
    "outro": {
        "prefix": "O",
        "beats": 5,
        "file": "CST17-OUTRO-PHONE-v171.mp4",
        "max_bytes": 7 * 1024 * 1024,
    },
}


class GateFailure(RuntimeError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise GateFailure(message)


def probe(path: Path, *arguments: str) -> dict:
    completed = subprocess.run(
        ["ffprobe", "-v", "error", *arguments, "-of", "json", str(path)],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    require(completed.returncode == 0, f"ffprobe failed for {path.name}: {completed.stderr.strip()}")
    return json.loads(completed.stdout)


def faststart(path: Path) -> bool:
    payload = path.read_bytes()
    moov = payload.find(b"moov")
    mdat = payload.find(b"mdat")
    return moov >= 0 and mdat >= 0 and moov < mdat


def media_contract(path: Path, expected_frames: int, max_bytes: int) -> dict:
    require(path.is_file(), f"phone master missing: {path}")
    require(path.stat().st_size <= max_bytes, f"{path.name} is too large: {path.stat().st_size} bytes")
    payload = probe(path, "-count_frames", "-show_streams", "-show_format")
    streams = payload.get("streams", [])
    videos = [stream for stream in streams if stream.get("codec_type") == "video"]
    audios = [stream for stream in streams if stream.get("codec_type") == "audio"]
    require(len(videos) == 1 and not audios, f"{path.name} must contain one silent video stream")
    stream = videos[0]
    require(stream.get("codec_name") == "h264", f"{path.name} codec is not H.264")
    require(stream.get("pix_fmt") == "yuv420p", f"{path.name} pixel format is not yuv420p")
    require((int(stream.get("width", 0)), int(stream.get("height", 0))) == (PHONE_WIDTH, PHONE_HEIGHT), f"{path.name} dimensions drifted")
    fps = float(Fraction(stream.get("avg_frame_rate", "0/1")))
    frames = int(stream.get("nb_read_frames", 0))
    duration = float(payload.get("format", {}).get("duration", 0))
    require(abs(fps - FPS) < 0.001, f"{path.name} fps is {fps}")
    require(frames == expected_frames, f"{path.name} has {frames} frames, expected {expected_frames}")
    require(abs(duration - expected_frames / FPS) <= 0.002, f"{path.name} duration is {duration:.6f}")
    require(faststart(path), f"{path.name} is not faststart")

    key_payload = probe(
        path,
        "-skip_frame", "nokey",
        "-select_streams", "v:0",
        "-show_frames",
        "-show_entries", "frame=best_effort_timestamp_time",
    )
    key_times = [float(frame["best_effort_timestamp_time"]) for frame in key_payload.get("frames", [])]
    require(key_times and abs(key_times[0]) <= 0.001, f"{path.name} does not start on a keyframe")
    gaps = [(right - left) * fps for left, right in zip(key_times, key_times[1:])]
    gaps.append((duration - key_times[-1]) * fps)
    maximum_gop = max(gaps)
    require(maximum_gop <= MAX_GOP, f"{path.name} GOP reaches {maximum_gop:.2f} frames")
    return {"frames": frames, "duration": duration, "bytes": path.stat().st_size, "max_gop": maximum_gop}


def decode_indices(path: Path, indices: set[int]) -> tuple[dict[int, np.ndarray], int]:
    capture = cv2.VideoCapture(str(path))
    require(capture.isOpened(), f"OpenCV cannot open {path.name}")
    decoded: dict[int, np.ndarray] = {}
    index = 0
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        if index in indices:
            decoded[index] = frame
        index += 1
    capture.release()
    require(indices.issubset(decoded), f"{path.name} did not decode indices {sorted(indices - decoded.keys())}")
    return decoded, index


def phone_frame(frame: np.ndarray) -> np.ndarray:
    return cv2.resize(frame, (DISPLAY_WIDTH, DISPLAY_HEIGHT), interpolation=cv2.INTER_AREA)


def similarity(first: np.ndarray, second: np.ndarray) -> tuple[float, float]:
    require(first.shape == second.shape, f"frame shapes differ: {first.shape} vs {second.shape}")
    mae = float(np.mean(np.abs(first.astype(np.float32) - second.astype(np.float32))))
    first_gray = cv2.cvtColor(first, cv2.COLOR_BGR2GRAY).astype(np.float64)
    second_gray = cv2.cvtColor(second, cv2.COLOR_BGR2GRAY).astype(np.float64)
    mu_first = cv2.GaussianBlur(first_gray, (11, 11), 1.5)
    mu_second = cv2.GaussianBlur(second_gray, (11, 11), 1.5)
    mu_first_sq = mu_first * mu_first
    mu_second_sq = mu_second * mu_second
    mu_both = mu_first * mu_second
    sigma_first = cv2.GaussianBlur(first_gray * first_gray, (11, 11), 1.5) - mu_first_sq
    sigma_second = cv2.GaussianBlur(second_gray * second_gray, (11, 11), 1.5) - mu_second_sq
    sigma_both = cv2.GaussianBlur(first_gray * second_gray, (11, 11), 1.5) - mu_both
    c1 = (0.01 * 255) ** 2
    c2 = (0.03 * 255) ** 2
    score = ((2 * mu_both + c1) * (2 * sigma_both + c2)) / (
        (mu_first_sq + mu_second_sq + c1) * (sigma_first + sigma_second + c2)
    )
    return float(np.mean(score)), mae


def check_similarity(first: np.ndarray, second: np.ndarray, label: str, min_ssim: float, max_mae: float) -> tuple[float, float]:
    ssim, mae = similarity(phone_frame(first), phone_frame(second))
    require(ssim >= min_ssim and mae <= max_mae, f"{label} drifted: SSIM={ssim:.6f}, MAE={mae:.3f}")
    return ssim, mae


def verify_track(name: str, sabotage: bool) -> dict:
    contract = TRACKS[name]
    beats = int(contract["beats"])
    expected_frames = beats * BEAT_FRAMES + FINAL_TAIL_EXTRA_FRAMES
    path = MEDIA / str(contract["file"])
    metadata = media_contract(path, expected_frames, int(contract["max_bytes"]))
    wanted = {0, expected_frames - 1}
    for boundary in range(1, beats):
        wanted.update({boundary * BEAT_FRAMES - 1, boundary * BEAT_FRAMES})
        if sabotage and boundary == 1:
            wanted.add(boundary * BEAT_FRAMES + BEAT_FRAMES // 2)
    decoded, decoded_count = decode_indices(path, wanted)
    require(decoded_count == expected_frames, f"{path.name} decoded {decoded_count} frames")

    joins = []
    for boundary in range(1, beats):
        left_index = boundary * BEAT_FRAMES - 1
        right_index = boundary * BEAT_FRAMES
        if sabotage and boundary == 1:
            right_index += BEAT_FRAMES // 2
        joins.append(check_similarity(decoded[left_index], decoded[right_index], f"{name} join {boundary}", JOIN_MIN_SSIM, JOIN_MAX_MAE))

    prefix = str(contract["prefix"])
    first_source = MEDIA / f"CST17-{prefix}01.mp4"
    last_source = MEDIA / f"CST17-{prefix}{beats:02d}.mp4"
    first_decoded, _ = decode_indices(first_source, {0})
    last_decoded, _ = decode_indices(last_source, {149})
    outer_first = check_similarity(decoded[0], first_decoded[0], f"{name} first outer seam", OUTER_MIN_SSIM, OUTER_MAX_MAE)
    outer_last = check_similarity(decoded[expected_frames - 1], last_decoded[149], f"{name} last outer seam", OUTER_MIN_SSIM, OUTER_MAX_MAE)
    return {
        **metadata,
        "min_join_ssim": min(value[0] for value in joins),
        "max_join_mae": max(value[1] for value in joins),
        "outer_first_ssim": outer_first[0],
        "outer_last_ssim": outer_last[0],
    }


def verify_manifest() -> None:
    payload = json.loads(MANIFEST.read_text(encoding="utf-8-sig"))
    require(payload.get("version") == "1.7.1", "runtime manifest version is not 1.7.1")
    require(payload.get("ready") is True, "runtime manifest is not ready")
    for name, contract in TRACKS.items():
        phone = payload.get("tracks", {}).get(name, {}).get("phoneMaster")
        require(isinstance(phone, dict), f"manifest {name}.phoneMaster missing")
        require(phone.get("src") == f"cake-studio/v17/clips/{contract['file']}", f"manifest {name} phone src drifted")
        require(phone.get("width") == PHONE_WIDTH and phone.get("height") == PHONE_HEIGHT, f"manifest {name} phone dimensions drifted")
        require(phone.get("fps") == int(FPS) and phone.get("beatFrames") == BEAT_FRAMES, f"manifest {name} phone timing drifted")
        require(
            phone.get("frames") == int(contract["beats"]) * BEAT_FRAMES + FINAL_TAIL_EXTRA_FRAMES,
            f"manifest {name} phone frame count drifted",
        )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--media-only", action="store_true", help="skip runtime manifest activation checks")
    parser.add_argument("--sabotage", action="store_true", help="compare one join against a mid-beat frame in memory")
    args = parser.parse_args()
    try:
        results = {name: verify_track(name, args.sabotage) for name in TRACKS}
        if not args.media_only:
            verify_manifest()
        if args.sabotage:
            raise GateFailure("sabotage unexpectedly passed")
    except GateFailure as error:
        print(f"CAKE_STUDIO_V17_PHONE_MASTERS_FAIL {error}")
        return 1
    summary = " ".join(
        f"{name}=frames:{result['frames']}/bytes:{result['bytes']}/join:{result['min_join_ssim']:.6f}/outer:{result['outer_first_ssim']:.6f},{result['outer_last_ssim']:.6f}"
        for name, result in results.items()
    )
    print(f"CAKE_STUDIO_V17_PHONE_MASTERS_OK {summary}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
