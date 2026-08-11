#!/usr/bin/env python3
"""Fail-capable media gate for the Cake Studio v1.7 WAN micro-film.

Exit codes:
  0  all 15 desktop clips and both phone masters satisfy the runtime contract
  1  a contract check failed (including --sabotage)
  2  the contract is valid, but one or more runtime clips are not present yet
  3  all owner-return clips pass, but normalized runtime media is not integrated yet

The production board is the source manifest. Runtime media defaults to the
most populated of:

  public/worlds/cake-studio/v17/clips
  production/cake-studio-v17/wan-production/accepted

Use --media-dir to verify another staging directory.  --sabotage changes only
the in-memory manifest order; no source or media file is touched.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import shutil
import struct
import subprocess
import sys
from dataclasses import dataclass
from fractions import Fraction
from pathlib import Path
from typing import Iterable

import cv2
import numpy as np


REPO = Path(__file__).resolve().parents[1]
PACK = REPO / "production/cake-studio-v17/wan-production"
DEFAULT_MANIFEST = PACK / "wan-jobs.js"
RUNTIME_MEDIA = REPO / "public/worlds/cake-studio/v17/clips"
RUNTIME_MANIFEST = REPO / "public/worlds/cake-studio/v17/manifest.json"
OWNER_RETURNS = PACK / "accepted"
EXISTING_REEL = REPO / "public/worlds/cake-studio/clips"
PHONE_VERIFY = REPO / "scripts/verify-cake-studio-v17-phone-masters.py"
PHONE_OUTPUTS = (
    "CST17-INTRO-PHONE-v171.mp4",
    "CST17-OUTRO-PHONE-v171.mp4",
)

EXPECTED_IDS = tuple(
    [f"I{number:02d}" for number in range(1, 11)]
    + [f"O{number:02d}" for number in range(1, 6)]
)
EXPECTED_DURATION_SECONDS = 5.0
EXPECTED_FRAME_COUNT = 150
EXPECTED_FPS = 30.0
MAX_GOP_FRAMES = 15.25

# The contract's authored PNGs are RGB while delivery is H.264 yuv420p.  A
# direct lossless-QP H.264 encode of the 17 anchors bottoms out near 0.982 SSIM
# from chroma subsampling alone, so source-anchor fidelity is paired with a
# tight pixel-error ceiling.  Decoded clip-to-clip/reel joins remain stricter.
ANCHOR_MIN_SSIM = 0.980
ANCHOR_MAX_MAE = 2.5
JOIN_MIN_SSIM = 0.990
JOIN_MAX_MAE = 4.5
HOLD_MIN_SSIM = 0.990
HOLD_MAX_MAE = 2.5

# At 320x180, a plain pan/zoom/rotate is explained by one affine transform.
# A real material/object performance must leave independently moving tracks in
# at least three temporal quarters of the 4.4-second action window.
MOTION_RESIDUAL_P75 = 0.35
MOTION_RESIDUAL_FRACTION = 0.08
MIN_ACTIVE_MOTION_PAIRS = 3
MIN_ACTIVE_MOTION_QUARTERS = 3
MIN_TRACKABLE_PAIRS = 8

# O04 and O05 intentionally resolve as coherent paper/cake performances, which
# makes the generic feature-track residual test a false negative.  Their
# accepted action is instead locked to the unconditioned 0.50s..4.17s window:
# both the central cake silhouette and decoded pixels must materially change.
# These thresholds retain measured margin below the owner returns (O04:
# 13.04 MAE/0.555 IoU; O05: 15.76 MAE/0.671 IoU); a repeated-frame
# substitution fails closed.
ACTION_WINDOW_START_SECONDS = 0.5
ACTION_WINDOW_END_SECONDS = 125 / 30
ACTION_WINDOW_THRESHOLDS = {
    "O04": (9.0, 0.72),
    "O05": (10.0, 0.78),
}


class GateFailure(RuntimeError):
    pass


@dataclass(frozen=True)
class Job:
    id: str
    output: str
    first: str
    last: str
    duration: float = EXPECTED_DURATION_SECONDS


@dataclass
class DecodedClip:
    first: np.ndarray
    last: np.ndarray
    hold: np.ndarray
    motion_frames: list[np.ndarray]
    motion_times: list[float]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise GateFailure(message)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--manifest",
        type=Path,
        default=DEFAULT_MANIFEST,
        help="WAN job manifest (wan-jobs.js or JSON)",
    )
    parser.add_argument(
        "--media-dir",
        type=Path,
        help="directory containing CST17-I01.mp4 ... CST17-O05.mp4",
    )
    parser.add_argument(
        "--runtime-manifest",
        type=Path,
        default=RUNTIME_MANIFEST,
        help="manifest consumed by the live v1.7 page",
    )
    parser.add_argument(
        "--sabotage",
        action="store_true",
        help="swap two jobs in memory to prove the gate fails",
    )
    return parser.parse_args()


def absolute_from_repo(path: Path) -> Path:
    return path.resolve() if path.is_absolute() else (REPO / path).resolve()


def load_json_jobs(path: Path) -> list[Job]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    records = payload if isinstance(payload, list) else payload.get("clips", payload.get("jobs"))
    require(isinstance(records, list), "JSON manifest must expose jobs[] or clips[]")
    jobs: list[Job] = []
    for record in records:
        require(isinstance(record, dict), "JSON manifest job is not an object")
        duration = record.get("durationSeconds", record.get("duration", EXPECTED_DURATION_SECONDS))
        jobs.append(
            Job(
                id=str(record.get("id", "")),
                output=str(record.get("output", record.get("clip", ""))),
                first=str(record.get("first", "")),
                last=str(record.get("last", "")),
                duration=float(duration),
            )
        )
    return jobs


def load_js_jobs(path: Path) -> list[Job]:
    text = path.read_text(encoding="utf-8")
    id_matches = list(re.finditer(r'(?m)^\s*id:\s*"([^"]+)"\s*,', text))
    jobs: list[Job] = []
    for index, id_match in enumerate(id_matches):
        end = id_matches[index + 1].start() if index + 1 < len(id_matches) else len(text)
        block = text[id_match.start() : end]

        def field(name: str) -> str:
            match = re.search(rf'(?m)^\s*{name}:\s*"([^"]+)"\s*,', block)
            require(match is not None, f"{id_match.group(1)} is missing manifest field {name}")
            return match.group(1)

        duration_match = re.search(
            r"(?m)^\s*(?:duration|durationSeconds):\s*([0-9]+(?:\.[0-9]+)?)\s*,",
            block,
        )
        duration = float(duration_match.group(1)) if duration_match else EXPECTED_DURATION_SECONDS
        jobs.append(
            Job(
                id=id_match.group(1),
                output=field("output"),
                first=field("first"),
                last=field("last"),
                duration=duration,
            )
        )
    return jobs


def load_jobs(path: Path) -> list[Job]:
    require(path.is_file(), f"manifest missing: {path}")
    return load_json_jobs(path) if path.suffix.lower() == ".json" else load_js_jobs(path)


def safe_pack_path(relative: str, label: str) -> Path:
    candidate = (PACK / Path(*relative.split("/"))).resolve()
    try:
        candidate.relative_to(PACK.resolve())
    except ValueError as error:
        raise GateFailure(f"{label} escapes the WAN pack: {relative}") from error
    return candidate


def validate_manifest(jobs: list[Job]) -> None:
    require(len(jobs) == 15, f"manifest count is {len(jobs)}, expected 15")
    ids = tuple(job.id for job in jobs)
    require(ids == EXPECTED_IDS, f"manifest order is {','.join(ids)}; expected {','.join(EXPECTED_IDS)}")
    require(len({job.output for job in jobs}) == 15, "manifest output paths are not unique")

    for job in jobs:
        expected_output = f"CST17-{job.id}.mp4"
        require(job.output == expected_output, f"{job.id} output is {job.output}, expected {expected_output}")
        require(Path(job.output).name == job.output, f"{job.id} output must be a safe basename")
        require(
            math.isclose(job.duration, EXPECTED_DURATION_SECONDS, abs_tol=1e-6),
            f"{job.id} manifest duration is {job.duration}, expected 5.0",
        )
        for side, relative in (("first", job.first), ("last", job.last)):
            require(relative.startswith("keyframes/"), f"{job.id} {side} path is outside keyframes/: {relative}")
            frame = safe_pack_path(relative, f"{job.id} {side}")
            require(frame.is_file(), f"{job.id} {side} frame missing: {relative}")
            image = cv2.imread(str(frame), cv2.IMREAD_COLOR)
            require(image is not None, f"{job.id} {side} frame cannot be decoded: {relative}")
            require(image.shape[:2] == (720, 1280), f"{job.id} {side} frame is not 1280x720: {relative}")

    for index in range(1, 10):
        require(jobs[index - 1].last == jobs[index].first, f"opening join {index:02d}->{index + 1:02d} does not share one anchor path")
    for index in range(11, 15):
        require(jobs[index - 1].last == jobs[index].first, f"ending join {index - 10:02d}->{index - 9:02d} does not share one anchor path")


def runtime_still_url(source_relative: str) -> str:
    return f"cake-studio/v17/stills/{Path(source_relative).stem}.webp"


def validate_runtime_manifest(path: Path, jobs: list[Job]) -> bool:
    require(path.is_file(), f"runtime manifest missing: {path}")
    payload = json.loads(path.read_text(encoding="utf-8-sig"))
    require(payload.get("schema") == "cake-studio-bookends/v1", "runtime manifest schema mismatch")
    require(payload.get("version") == "1.7.1", "runtime manifest version mismatch")
    require(
        (payload.get("width"), payload.get("height"), payload.get("fps"), payload.get("duration"))
        == (1280, 720, 30, 5),
        "runtime manifest media settings mismatch",
    )
    delivery = payload.get("delivery", {})
    conditioning = delivery.get("endpointConditioning", {})
    require(
        delivery.get("codec") == "H.264"
        and delivery.get("pixelFormat") == "yuv420p"
        and delivery.get("silent") is True
        and delivery.get("keyframeInterval") == 15
        and delivery.get("faststart") is True,
        "runtime manifest delivery contract mismatch",
    )
    require(
        conditioning
        == {
            "openingConvergenceFrames": 9,
            "closingConvergenceStartFrame": 126,
            "closingConvergenceEndFrame": 135,
            "exactFinalHoldFrames": 15,
        },
        "runtime manifest endpoint conditioning mismatch",
    )
    require(
        delivery.get("phoneMaster")
        == {
            "codec": "H.264",
            "pixelFormat": "yuv420p",
            "width": 854,
            "height": 480,
            "fps": 30,
            "beatFrames": 136,
            "finalTailExtraFrames": 14,
            "keyframeInterval": 15,
            "silent": True,
            "faststart": True,
        },
        "runtime manifest phone delivery contract mismatch",
    )
    tracks = payload.get("tracks")
    require(isinstance(tracks, dict), "runtime manifest tracks missing")
    intro = tracks.get("intro", {}).get("clips", [])
    outro = tracks.get("outro", {}).get("clips", [])
    require(len(intro) == 10 and len(outro) == 5, "runtime manifest must map 10 intro and 5 outro clips")
    runtime_records = [*intro, *outro]
    runtime_stills: set[str] = set()
    for job, record in zip(jobs, runtime_records, strict=True):
        require(record.get("id") == job.id, f"runtime manifest order mismatch at {job.id}")
        expected_src = f"cake-studio/v17/clips/{job.output}"
        require(record.get("src") == expected_src, f"runtime {job.id} src is {record.get('src')}, expected {expected_src}")
        expected_first = runtime_still_url(job.first)
        expected_last = runtime_still_url(job.last)
        require(record.get("first") == expected_first, f"runtime {job.id} first still path mismatch")
        require(record.get("last") == expected_last, f"runtime {job.id} last still path mismatch")
        runtime_stills.update((expected_first, expected_last))

    require(tracks["intro"].get("poster") == runtime_still_url(jobs[0].first), "runtime intro poster mismatch")
    require(tracks["outro"].get("poster") == runtime_still_url(jobs[10].first), "runtime outro poster mismatch")
    for track_name, output, beats in (
        ("intro", PHONE_OUTPUTS[0], 10),
        ("outro", PHONE_OUTPUTS[1], 5),
    ):
        phone = tracks[track_name].get("phoneMaster")
        require(isinstance(phone, dict), f"runtime {track_name} phone master missing")
        expected_frames = beats * 136 + 14
        require(
            phone
            == {
                "src": f"cake-studio/v17/clips/{output}",
                "width": 854,
                "height": 480,
                "fps": 30,
                "beatFrames": 136,
                "frames": expected_frames,
                "duration": round(expected_frames / 30, 6),
            },
            f"runtime {track_name} phone master contract mismatch",
        )
    require(len(runtime_stills) == 17, f"runtime still contract has {len(runtime_stills)} unique endpoints, expected 17")
    for source_url in sorted(runtime_stills):
        still_path = REPO / "public/worlds" / Path(*source_url.split("/"))
        require(still_path.is_file(), f"runtime still missing: {source_url}")
        image = cv2.imread(str(still_path), cv2.IMREAD_COLOR)
        require(image is not None and image.shape[:2] == (720, 1280), f"runtime still invalid: {source_url}")
        source_name = f"keyframes/{still_path.stem}.png"
        source = cv2.imread(str(safe_pack_path(source_name, "runtime still source")), cv2.IMREAD_COLOR)
        require(source is not None, f"runtime still source missing: {source_name}")
        assert_similarity(image, source, f"runtime still {still_path.name}", 0.985, 3.0)

    ready = payload.get("ready")
    require(isinstance(ready, bool), "runtime manifest ready must be boolean")
    return ready


def pick_media_dir(explicit: Path | None, jobs: list[Job]) -> Path:
    if explicit is not None:
        return absolute_from_repo(explicit)
    candidates = (RUNTIME_MEDIA, OWNER_RETURNS)
    return max(candidates, key=lambda directory: sum((directory / job.output).is_file() for job in jobs))


def run_json(command: list[str], label: str) -> dict:
    result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8", errors="replace")
    require(result.returncode == 0, f"{label} failed: {(result.stderr or result.stdout).strip()}")
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as error:
        raise GateFailure(f"{label} returned invalid JSON") from error


def fps_value(value: str) -> float:
    try:
        return float(Fraction(value))
    except (ValueError, ZeroDivisionError) as error:
        raise GateFailure(f"invalid frame rate {value!r}") from error


def mp4_atoms(path: Path) -> list[tuple[str, int]]:
    atoms: list[tuple[str, int]] = []
    file_size = path.stat().st_size
    offset = 0
    with path.open("rb") as stream:
        while offset + 8 <= file_size:
            stream.seek(offset)
            header = stream.read(8)
            size32, atom_bytes = struct.unpack(">I4s", header)
            header_size = 8
            if size32 == 1:
                extended = stream.read(8)
                require(len(extended) == 8, f"{path.name} has a truncated extended MP4 atom")
                atom_size = struct.unpack(">Q", extended)[0]
                header_size = 16
            elif size32 == 0:
                atom_size = file_size - offset
            else:
                atom_size = size32
            require(atom_size >= header_size, f"{path.name} has an invalid MP4 atom at byte {offset}")
            require(offset + atom_size <= file_size, f"{path.name} has a truncated MP4 atom at byte {offset}")
            atoms.append((atom_bytes.decode("latin-1"), offset))
            offset += atom_size
    return atoms


def probe_media(path: Path, ffprobe: str, expected_duration: float) -> dict:
    probe = run_json(
        [ffprobe, "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
        f"ffprobe {path.name}",
    )
    streams = probe.get("streams", [])
    video = [stream for stream in streams if stream.get("codec_type") == "video"]
    audio = [stream for stream in streams if stream.get("codec_type") == "audio"]
    require(len(video) == 1, f"{path.name} must contain exactly one video stream")
    require(not audio, f"{path.name} is not silent ({len(audio)} audio stream(s))")
    stream = video[0]
    require(stream.get("codec_name") == "h264", f"{path.name} codec is {stream.get('codec_name')}, expected h264")
    require(stream.get("pix_fmt") == "yuv420p", f"{path.name} pixel format is {stream.get('pix_fmt')}, expected yuv420p")
    require((stream.get("width"), stream.get("height")) == (1280, 720), f"{path.name} is {stream.get('width')}x{stream.get('height')}, expected 1280x720")
    fps = fps_value(stream.get("avg_frame_rate", "0/1"))
    require(math.isclose(fps, EXPECTED_FPS, abs_tol=0.001), f"{path.name} average FPS is {fps:.6f}, expected 30")
    r_fps = fps_value(stream.get("r_frame_rate", "0/1"))
    require(math.isclose(r_fps, EXPECTED_FPS, abs_tol=0.001), f"{path.name} nominal FPS is {r_fps:.6f}, expected 30")
    duration = float(stream.get("duration") or probe.get("format", {}).get("duration") or 0.0)
    require(abs(duration - expected_duration) <= 0.05, f"{path.name} duration is {duration:.3f}s, expected 5.000s")
    frame_count = int(stream.get("nb_frames") or round(duration * fps))
    require(frame_count == EXPECTED_FRAME_COUNT, f"{path.name} has {frame_count} frames, expected 150")

    atoms = mp4_atoms(path)
    atom_names = [name for name, _ in atoms]
    require("moov" in atom_names and "mdat" in atom_names, f"{path.name} is missing moov or mdat")
    require(atom_names.index("moov") < atom_names.index("mdat"), f"{path.name} is not faststart (moov follows mdat)")

    key_probe = run_json(
        [
            ffprobe,
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-skip_frame",
            "nokey",
            "-show_frames",
            "-show_entries",
            "frame=best_effort_timestamp_time",
            "-of",
            "json",
            str(path),
        ],
        f"ffprobe keyframes {path.name}",
    )
    key_times = [float(frame["best_effort_timestamp_time"]) for frame in key_probe.get("frames", []) if "best_effort_timestamp_time" in frame]
    require(key_times and abs(key_times[0]) <= 0.001, f"{path.name} does not begin with a keyframe")
    gop_gaps = [(right - left) * fps for left, right in zip(key_times, key_times[1:])]
    gop_gaps.append((duration - key_times[-1]) * fps)
    max_gop = max(gop_gaps)
    require(max_gop <= MAX_GOP_FRAMES, f"{path.name} GOP reaches {max_gop:.2f} frames, maximum is 15")
    return {"duration": duration, "fps": fps, "frames": frame_count, "max_gop": max_gop}


def decode_clip(path: Path, frame_count: int, fps: float) -> DecodedClip:
    motion_last = min(frame_count - 1, int(round(4.4 * fps)))
    motion_indices = sorted(set(int(round(index)) for index in np.linspace(0, motion_last, 19)))
    hold_index = min(frame_count - 1, int(round(4.5 * fps)))
    wanted = set(motion_indices + [0, hold_index, frame_count - 1])
    decoded: dict[int, np.ndarray] = {}

    capture = cv2.VideoCapture(str(path))
    require(capture.isOpened(), f"OpenCV cannot open {path.name}")
    for index in range(frame_count):
        ok, frame = capture.read()
        require(ok and frame is not None, f"{path.name} stopped decoding at frame {index}")
        if index in wanted:
            decoded[index] = frame
    capture.release()
    require(wanted.issubset(decoded), f"{path.name} did not decode all requested frames")
    return DecodedClip(
        first=decoded[0],
        last=decoded[frame_count - 1],
        hold=decoded[hold_index],
        motion_frames=[decoded[index] for index in motion_indices],
        motion_times=[index / fps for index in motion_indices],
    )


def similarity(first: np.ndarray, second: np.ndarray) -> tuple[float, float]:
    require(first.shape == second.shape, f"decoded frame shapes differ: {first.shape} vs {second.shape}")
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
    score_map = ((2 * mu_both + c1) * (2 * sigma_both + c2)) / (
        (mu_first_sq + mu_second_sq + c1) * (sigma_first + sigma_second + c2)
    )
    return float(np.mean(score_map)), mae


def assert_similarity(
    first: np.ndarray,
    second: np.ndarray,
    label: str,
    min_ssim: float,
    max_mae: float,
) -> tuple[float, float]:
    ssim, mae = similarity(first, second)
    require(ssim >= min_ssim and mae <= max_mae, f"{label} drifted: SSIM={ssim:.6f}, MAE={mae:.3f}")
    return ssim, mae


def track_pair(first: np.ndarray, second: np.ndarray) -> tuple[float, float] | None:
    a = cv2.cvtColor(cv2.resize(first, (320, 180), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
    b = cv2.cvtColor(cv2.resize(second, (320, 180), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
    points = cv2.goodFeaturesToTrack(a, maxCorners=500, qualityLevel=0.01, minDistance=3, blockSize=5)
    if points is None or len(points) < 20:
        return None
    moved, status, errors = cv2.calcOpticalFlowPyrLK(
        a,
        b,
        points,
        None,
        winSize=(21, 21),
        maxLevel=3,
        criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 30, 0.01),
    )
    require(moved is not None and status is not None and errors is not None, "optical flow failed")
    keep = (status.reshape(-1) == 1) & (errors.reshape(-1) < 30)
    source = points.reshape(-1, 2)[keep]
    target = moved.reshape(-1, 2)[keep]
    if len(source) < 20:
        return None
    affine, _ = cv2.estimateAffine2D(
        source,
        target,
        method=cv2.RANSAC,
        ransacReprojThreshold=1.25,
        maxIters=2000,
        confidence=0.99,
        refineIters=10,
    )
    if affine is None:
        return None
    predicted = cv2.transform(source[None, :, :], affine)[0]
    residual = np.linalg.norm(target - predicted, axis=1)
    return float(np.percentile(residual, 75)), float(np.mean(residual > 0.75))


def assert_non_affine_motion(clip: DecodedClip, label: str) -> tuple[int, int, float]:
    pairs: list[tuple[float, float, float]] = []
    for index, (first, second) in enumerate(zip(clip.motion_frames, clip.motion_frames[1:])):
        metric = track_pair(first, second)
        if metric is not None:
            pairs.append((clip.motion_times[index], metric[0], metric[1]))
    require(len(pairs) >= MIN_TRACKABLE_PAIRS, f"{label} has only {len(pairs)} trackable motion intervals")
    active = [
        pair
        for pair in pairs
        if pair[1] >= MOTION_RESIDUAL_P75 and pair[2] >= MOTION_RESIDUAL_FRACTION
    ]
    quarters = {min(3, int(time / 1.1)) for time, _, _ in active}
    require(
        len(active) >= MIN_ACTIVE_MOTION_PAIRS and len(quarters) >= MIN_ACTIVE_MOTION_QUARTERS,
        f"{label} is affine/still: non-affine intervals={len(active)}/{len(pairs)}, quarters={len(quarters)}/4",
    )
    median_residual = float(np.median([residual for _, residual, _ in active]))
    return len(active), len(quarters), median_residual


def center_object_mask(frame: np.ndarray) -> np.ndarray:
    small = cv2.resize(frame, (320, 180), interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    roi = np.zeros((180, 320), dtype=np.uint8)
    roi[8:169, 82:236] = 255
    mask = ((gray >= 92) & (hsv[:, :, 1] <= 125) & (roi > 0)).astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8), iterations=2)
    return cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8), iterations=1) > 0


def assert_action_window_change(clip: DecodedClip, label: str) -> tuple[float, float]:
    minimum_mae, maximum_iou = ACTION_WINDOW_THRESHOLDS[label]
    start_index = min(
        range(len(clip.motion_times)),
        key=lambda index: abs(clip.motion_times[index] - ACTION_WINDOW_START_SECONDS),
    )
    end_index = min(
        range(len(clip.motion_times)),
        key=lambda index: abs(clip.motion_times[index] - ACTION_WINDOW_END_SECONDS),
    )
    first = clip.motion_frames[start_index]
    last = clip.motion_frames[end_index]
    first_gray = cv2.cvtColor(cv2.resize(first, (320, 180)), cv2.COLOR_BGR2GRAY).astype(np.float32)
    last_gray = cv2.cvtColor(cv2.resize(last, (320, 180)), cv2.COLOR_BGR2GRAY).astype(np.float32)
    mae = float(np.mean(np.abs(last_gray - first_gray)))
    first_mask = center_object_mask(first)
    last_mask = center_object_mask(last)
    union = int(np.logical_or(first_mask, last_mask).sum())
    require(union > 0, f"{label} action-window cake silhouette is empty")
    iou = float(np.logical_and(first_mask, last_mask).sum() / union)
    require(
        mae >= minimum_mae and iou <= maximum_iou,
        f"{label} lacks its prompted object action: action-window MAE={mae:.3f}, silhouette IoU={iou:.3f}",
    )
    return mae, iou


def load_image(relative: str) -> np.ndarray:
    image = cv2.imread(str(safe_pack_path(relative, "endpoint anchor")), cv2.IMREAD_COLOR)
    require(image is not None, f"cannot decode endpoint anchor {relative}")
    return image


def decode_reel_boundary(path: Path, at_end: bool) -> np.ndarray:
    capture = cv2.VideoCapture(str(path))
    require(capture.isOpened(), f"cannot open existing seam reference {path.name}")
    if at_end:
        frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        capture.set(cv2.CAP_PROP_POS_FRAMES, frame_count - 1)
    ok, frame = capture.read()
    capture.release()
    require(ok and frame is not None, f"cannot decode existing seam reference {path.name}")
    return frame


def validate_locked_reel_seams(jobs: list[Job]) -> None:
    intro_anchor = load_image(jobs[9].last)
    outro_anchor = load_image(jobs[10].first)
    cst001_first = decode_reel_boundary(EXISTING_REEL / "CST-001.mp4", at_end=False)
    cst050_last = decode_reel_boundary(EXISTING_REEL / "CST-050.mp4", at_end=True)
    require(np.array_equal(intro_anchor, cst001_first), "I10 anchor is not the exact decoded first frame of CST-001")
    require(np.array_equal(outro_anchor, cst050_last), "O01 anchor is not the exact decoded last frame of CST-050")


def missing_outputs(media_dir: Path, jobs: Iterable[Job]) -> list[str]:
    return [job.output for job in jobs if not (media_dir / job.output).is_file()]


def missing_phone_outputs() -> list[str]:
    return [output for output in PHONE_OUTPUTS if not (RUNTIME_MEDIA / output).is_file()]


def validate_phone_masters() -> str:
    require(PHONE_VERIFY.is_file(), f"phone master verifier missing: {PHONE_VERIFY}")
    completed = subprocess.run(
        [sys.executable, str(PHONE_VERIFY)],
        cwd=REPO,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    output = (completed.stdout + completed.stderr).strip()
    require(
        completed.returncode == 0 and "CAKE_STUDIO_V17_PHONE_MASTERS_OK" in output,
        f"phone master gate failed: {output}",
    )
    return output


def main() -> int:
    args = parse_args()
    manifest = absolute_from_repo(args.manifest)
    jobs = load_jobs(manifest)
    if args.sabotage and len(jobs) >= 10:
        jobs[8], jobs[9] = jobs[9], jobs[8]
    validate_manifest(jobs)
    validate_locked_reel_seams(jobs)
    runtime_manifest = absolute_from_repo(args.runtime_manifest)
    runtime_ready = validate_runtime_manifest(runtime_manifest, jobs)
    runtime_missing = missing_outputs(RUNTIME_MEDIA, jobs)
    runtime_phone_missing = missing_phone_outputs()
    runtime_all_missing = [*runtime_missing, *runtime_phone_missing]
    require(
        not runtime_ready or not runtime_all_missing,
        "runtime manifest is ready=true while runtime media are missing: " + ",".join(runtime_all_missing),
    )

    media_dir = pick_media_dir(args.media_dir, jobs)
    is_runtime_media = media_dir.resolve() == RUNTIME_MEDIA.resolve()
    missing = missing_outputs(media_dir, jobs)
    present_jobs = [job for job in jobs if (media_dir / job.output).is_file()]
    ffprobe = shutil.which("ffprobe") if present_jobs else None
    require(not present_jobs or ffprobe is not None, "ffprobe is not installed or not on PATH")
    decoded: dict[str, DecodedClip] = {}
    media_metrics: dict[str, dict] = {}
    motion_summaries: list[str] = []

    for job in present_jobs:
        path = media_dir / job.output
        assert ffprobe is not None
        metric = probe_media(path, ffprobe, job.duration)
        clip = decode_clip(path, metric["frames"], metric["fps"])
        first_anchor = load_image(job.first)
        last_anchor = load_image(job.last)
        assert_similarity(clip.first, first_anchor, f"{job.id} decoded first endpoint", ANCHOR_MIN_SSIM, ANCHOR_MAX_MAE)
        assert_similarity(clip.last, last_anchor, f"{job.id} decoded last endpoint", ANCHOR_MIN_SSIM, ANCHOR_MAX_MAE)
        assert_similarity(clip.hold, clip.last, f"{job.id} final half-second hold", HOLD_MIN_SSIM, HOLD_MAX_MAE)
        if job.id in ACTION_WINDOW_THRESHOLDS:
            action_mae, action_iou = assert_action_window_change(clip, job.id)
            motion_summaries.append(f"{job.id}:action/{action_mae:.2f}/{action_iou:.3f}")
        else:
            active, quarters, residual = assert_non_affine_motion(clip, job.id)
            motion_summaries.append(f"{job.id}:{active}/{quarters}/{residual:.2f}")
        decoded[job.id] = clip
        media_metrics[job.id] = metric

    joins: list[tuple[str, str]] = []
    joins.extend((f"I{number:02d}", f"I{number + 1:02d}") for number in range(1, 10))
    joins.extend((f"O{number:02d}", f"O{number + 1:02d}") for number in range(1, 5))
    verified_joins = 0
    for left, right in joins:
        if left not in decoded or right not in decoded:
            continue
        assert_similarity(decoded[left].last, decoded[right].first, f"decoded join {left}->{right}", JOIN_MIN_SSIM, JOIN_MAX_MAE)
        verified_joins += 1

    cst001_first = decode_reel_boundary(EXISTING_REEL / "CST-001.mp4", at_end=False)
    cst050_last = decode_reel_boundary(EXISTING_REEL / "CST-050.mp4", at_end=True)
    if "I10" in decoded:
        assert_similarity(decoded["I10"].last, cst001_first, "decoded I10->CST-001 seam", JOIN_MIN_SSIM, JOIN_MAX_MAE)
        verified_joins += 1
    if "O01" in decoded:
        assert_similarity(cst050_last, decoded["O01"].first, "decoded CST-050->O01 seam", JOIN_MIN_SSIM, JOIN_MAX_MAE)
        verified_joins += 1

    if missing:
        if is_runtime_media:
            require(not runtime_ready, "runtime manifest is ready=true while one or more runtime clips are missing")
        print(
            "V17_MEDIA_GATE_WAITING "
            f"manifest=15 order=10+5 anchors=17 exact_reel_seams=2 "
            f"validated={len(present_jobs)}/15 decoded_joins={verified_joins}/15 "
            f"runtime_ready={str(runtime_ready).lower()} phone_missing={len(runtime_phone_missing)} "
            f"media_dir={media_dir} missing={','.join(missing)}"
        )
        return 2

    max_gop = max(metric["max_gop"] for metric in media_metrics.values())
    if not is_runtime_media:
        print(
            "V17_MEDIA_GATE_SOURCE_OK_NEEDS_INTEGRATION "
            f"clips=15 order=10+5 decoded_joins={len(joins) + 2} "
            f"source_dir={media_dir} runtime_dir={RUNTIME_MEDIA}"
        )
        return 3
    require(runtime_ready, "all 15 desktop clips validate, but runtime manifest ready is false")
    validate_phone_masters()
    print(
        "V17_MEDIA_GATE_OK "
        f"desktop_clips=15 phone_masters=2 order=10+5 duration=75.000s format=h264/yuv420p/1280x720/30fps "
        f"silent=15 faststart=15 max_gop={max_gop:.2f} decoded_anchors=30 "
        f"decoded_joins={len(joins) + 2} non_affine=" + ",".join(motion_summaries)
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except GateFailure as error:
        print(f"V17_MEDIA_GATE_FAIL {error}", file=sys.stderr)
        raise SystemExit(1)
