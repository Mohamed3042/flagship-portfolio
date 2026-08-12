#!/usr/bin/env python3
"""Fail-capable media/runtime contract for Cake Studio v1.7.2 phone masters."""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import subprocess

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public" / "worlds" / "cake-studio" / "v17" / "clips"
MANIFEST = ROOT / "public" / "worlds" / "cake-studio" / "v17" / "manifest.json"
FPS = 15.0
BEAT_FRAMES = 68
FINAL_TAIL_EXTRA_FRAMES = 7
KEYFRAME_INTERVAL = 8
TERMINAL_FRAME_OFFSET = 2
PHONE_WIDTH = 640
PHONE_HEIGHT = 360
DISPLAY_WIDTH = 390
DISPLAY_HEIGHT = 219
MAX_GOP = 8.25
JOIN_MIN_SSIM = 0.982
JOIN_MAX_MAE = 2.5
OUTER_MIN_SSIM = 0.995
OUTER_MAX_MAE = 1.0
TERMINAL_MIN_SSIM = 0.9995
TERMINAL_MAX_MAE = 0.1
ATLAS_TILE_WIDTH = 384
ATLAS_TILE_HEIGHT = 216
ATLAS_QUALITY = 85
ATLAS_MAX_TEMPORAL_ERROR_FRAMES = 11
ATLAS_MIN_SAMPLE_SSIM = 0.94
ATLAS_MIN_MEAN_SSIM = 0.96
ATLAS_MAX_SAMPLE_MAE = 4.0
ATLAS_MAX_MEAN_MAE = 2.5
TERMINAL_STILL_QUALITY = 100
TERMINAL_STILL_MIN_SSIM = 0.995
TERMINAL_STILL_MAX_MAE = 0.8

TRACKS = {
    "intro": {
        "prefix": "I",
        "beats": 10,
        "file": "CST17-INTRO-PHONE-v172.mp4",
        "bytes": 5_091_536,
        "sha256": "6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670",
        "scrubAtlas": {
            "file": "CST17-INTRO-PHONE-SCRUB-v172.webp",
            "bytes": 326_692,
            "sha256": "1e94474cee9abdd7e0af7ea7679d4b004cf5d3313287c06c358f4368e3c1f1c5",
            "columns": 8,
            "rows": 4,
            "frames": [0, 22, 44, 66, 88, 110, 133, 155, 177, 199, 221, 243, 265, 287, 309, 331, 354, 376, 398, 420, 442, 464, 486, 508, 530, 552, 575, 597, 619, 641, 663, 685],
        },
        "terminalStill": {
            "file": "CST17-INTRO-PHONE-TERMINAL-v172.webp",
            "bytes": 106_416,
            "sha256": "513bcc97d522d84cb0ead674be5aa59b8b04d8cbb62527c1e63a4d9afe1fc4ee",
            "frame": 685,
        },
    },
    "outro": {
        "prefix": "O",
        "beats": 5,
        "file": "CST17-OUTRO-PHONE-v172.mp4",
        "bytes": 2_479_879,
        "sha256": "65e51883d99862fd86ca159bda4fd1c7bdd0f394734be422cb650516f31dca15",
        "scrubAtlas": {
            "file": "CST17-OUTRO-PHONE-SCRUB-v172.webp",
            "bytes": 179_822,
            "sha256": "5717337b6e0674f08f99a945fc4aa2dee69f2ab09380bdd04c2da6218a0b9c2c",
            "columns": 8,
            "rows": 2,
            "frames": [0, 23, 46, 69, 92, 115, 138, 161, 184, 207, 230, 253, 276, 299, 322, 345],
        },
        "terminalStill": {
            "file": "CST17-OUTRO-PHONE-TERMINAL-v172.webp",
            "bytes": 91_242,
            "sha256": "df40c40bbaf66b867bcdb4ffc95d095f1b7d5a97f7815498f2f122ee380037eb",
            "frame": 345,
        },
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


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def media_contract(path: Path, expected_frames: int, expected_bytes: int, expected_hash: str) -> dict:
    require(path.is_file(), f"phone master missing: {path}")
    actual_bytes = path.stat().st_size
    actual_hash = sha256(path)
    require(actual_bytes == expected_bytes, f"{path.name} byte size is {actual_bytes}, expected {expected_bytes}")
    require(actual_hash == expected_hash, f"{path.name} SHA-256 drifted: {actual_hash}")
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
    return {
        "frames": frames,
        "duration": duration,
        "bytes": actual_bytes,
        "sha256": actual_hash,
        "max_gop": maximum_gop,
    }


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


def image_contract(path: Path, expected_bytes: int, expected_hash: str, width: int, height: int) -> np.ndarray:
    require(path.is_file(), f"phone companion missing: {path}")
    actual_bytes = path.stat().st_size
    actual_hash = sha256(path)
    require(actual_bytes == expected_bytes, f"{path.name} byte size is {actual_bytes}, expected {expected_bytes}")
    require(actual_hash == expected_hash, f"{path.name} SHA-256 drifted: {actual_hash}")
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    require(image is not None, f"OpenCV cannot decode {path.name}")
    require(image.shape[:2] == (height, width), f"{path.name} dimensions are {image.shape[1]}x{image.shape[0]}")
    return image


def verify_scrub_atlas(
    media_dir: Path,
    name: str,
    contract: dict,
    decoded: dict[int, np.ndarray],
    terminal_index: int,
    sabotage: bool,
) -> dict:
    atlas_contract = contract["scrubAtlas"]
    columns = int(atlas_contract["columns"])
    rows = int(atlas_contract["rows"])
    sample_frames = [int(index) for index in atlas_contract["frames"]]
    require(len(sample_frames) == columns * rows, f"{name} atlas grid/sample count drifted")
    require(sample_frames == sorted(set(sample_frames)), f"{name} atlas frame indices must be unique and increasing")
    require(sample_frames[0] == 0 and sample_frames[-1] == terminal_index, f"{name} atlas endpoints drifted")
    temporal_error = max(
        min(abs(frame_index - sample) for sample in sample_frames)
        for frame_index in range(terminal_index + 1)
    )
    require(
        temporal_error <= ATLAS_MAX_TEMPORAL_ERROR_FRAMES,
        f"{name} atlas temporal error reaches {temporal_error} frames",
    )
    atlas = image_contract(
        media_dir / str(atlas_contract["file"]),
        int(atlas_contract["bytes"]),
        str(atlas_contract["sha256"]),
        columns * ATLAS_TILE_WIDTH,
        rows * ATLAS_TILE_HEIGHT,
    )
    scores: list[tuple[float, float]] = []
    for tile_index, frame_index in enumerate(sample_frames):
        row, column = divmod(tile_index, columns)
        top = row * ATLAS_TILE_HEIGHT
        left = column * ATLAS_TILE_WIDTH
        tile = atlas[top : top + ATLAS_TILE_HEIGHT, left : left + ATLAS_TILE_WIDTH]
        reference_index = sample_frames[-2] if sabotage and tile_index == 1 else frame_index
        scores.append(similarity(phone_frame(tile), phone_frame(decoded[reference_index])))
    min_ssim = min(value[0] for value in scores)
    mean_ssim = float(np.mean([value[0] for value in scores]))
    max_mae = max(value[1] for value in scores)
    mean_mae = float(np.mean([value[1] for value in scores]))
    require(
        min_ssim >= ATLAS_MIN_SAMPLE_SSIM
        and mean_ssim >= ATLAS_MIN_MEAN_SSIM
        and max_mae <= ATLAS_MAX_SAMPLE_MAE
        and mean_mae <= ATLAS_MAX_MEAN_MAE,
        f"{name} atlas fidelity drifted: min/mean SSIM={min_ssim:.6f}/{mean_ssim:.6f}, "
        f"max/mean MAE={max_mae:.3f}/{mean_mae:.3f}",
    )
    return {
        "bytes": int(atlas_contract["bytes"]),
        "samples": len(sample_frames),
        "temporal_error_frames": temporal_error,
        "min_ssim": min_ssim,
        "mean_ssim": mean_ssim,
        "max_mae": max_mae,
        "mean_mae": mean_mae,
    }


def verify_terminal_still(media_dir: Path, name: str, contract: dict, decoded: dict[int, np.ndarray]) -> tuple[float, float]:
    still_contract = contract["terminalStill"]
    still_frame = int(still_contract["frame"])
    still = image_contract(
        media_dir / str(still_contract["file"]),
        int(still_contract["bytes"]),
        str(still_contract["sha256"]),
        PHONE_WIDTH,
        PHONE_HEIGHT,
    )
    return check_similarity(
        still,
        decoded[still_frame],
        f"{name} terminal still",
        TERMINAL_STILL_MIN_SSIM,
        TERMINAL_STILL_MAX_MAE,
    )


def verify_track(media_dir: Path, name: str, sabotage: bool) -> dict:
    contract = TRACKS[name]
    beats = int(contract["beats"])
    expected_frames = beats * BEAT_FRAMES + FINAL_TAIL_EXTRA_FRAMES
    path = media_dir / str(contract["file"])
    metadata = media_contract(path, expected_frames, int(contract["bytes"]), str(contract["sha256"]))
    terminal_index = expected_frames - TERMINAL_FRAME_OFFSET
    wanted = {
        0,
        terminal_index,
        expected_frames - 1,
        *[int(index) for index in contract["scrubAtlas"]["frames"]],
    }
    for boundary in range(1, beats):
        wanted.update({boundary * BEAT_FRAMES - 1, boundary * BEAT_FRAMES})
    decoded, decoded_count = decode_indices(path, wanted)
    require(decoded_count == expected_frames, f"{path.name} decoded {decoded_count} frames")

    joins = []
    for boundary in range(1, beats):
        left_index = boundary * BEAT_FRAMES - 1
        right_index = boundary * BEAT_FRAMES
        joins.append(check_similarity(decoded[left_index], decoded[right_index], f"{name} join {boundary}", JOIN_MIN_SSIM, JOIN_MAX_MAE))

    prefix = str(contract["prefix"])
    first_source = media_dir / f"CST17-{prefix}01.mp4"
    last_source = media_dir / f"CST17-{prefix}{beats:02d}.mp4"
    first_decoded, _ = decode_indices(first_source, {0})
    last_decoded, _ = decode_indices(last_source, {149})
    outer_first = check_similarity(decoded[0], first_decoded[0], f"{name} first outer seam", OUTER_MIN_SSIM, OUTER_MAX_MAE)
    outer_last = check_similarity(decoded[expected_frames - 1], last_decoded[149], f"{name} last outer seam", OUTER_MIN_SSIM, OUTER_MAX_MAE)
    terminal = check_similarity(
        decoded[terminal_index],
        decoded[expected_frames - 1],
        f"{name} terminal offset frame",
        TERMINAL_MIN_SSIM,
        TERMINAL_MAX_MAE,
    )
    atlas = verify_scrub_atlas(media_dir, name, contract, decoded, terminal_index, sabotage)
    terminal_still = verify_terminal_still(media_dir, name, contract, decoded)
    return {
        **metadata,
        "min_join_ssim": min(value[0] for value in joins),
        "max_join_mae": max(value[1] for value in joins),
        "outer_first_ssim": outer_first[0],
        "outer_last_ssim": outer_last[0],
        "terminal_ssim": terminal[0],
        "terminal_mae": terminal[1],
        "atlas": atlas,
        "terminal_still_ssim": terminal_still[0],
        "terminal_still_mae": terminal_still[1],
    }


def verify_manifest(manifest: Path) -> None:
    payload = json.loads(manifest.read_text(encoding="utf-8-sig"))
    require(payload.get("version") == "1.7.2", "runtime manifest version is not 1.7.2")
    require(payload.get("ready") is True, "runtime manifest is not ready")
    require(
        payload.get("delivery", {}).get("phoneMaster")
        == {
            "codec": "H.264",
            "pixelFormat": "yuv420p",
            "width": PHONE_WIDTH,
            "height": PHONE_HEIGHT,
            "fps": int(FPS),
            "beatFrames": BEAT_FRAMES,
            "finalTailExtraFrames": FINAL_TAIL_EXTRA_FRAMES,
            "keyframeInterval": KEYFRAME_INTERVAL,
            "terminalFrameOffset": TERMINAL_FRAME_OFFSET,
            "silent": True,
            "faststart": True,
        },
        "runtime manifest phone delivery contract drifted",
    )
    require(
        payload.get("delivery", {}).get("phoneScrubAtlas")
        == {
            "mimeType": "image/webp",
            "tileWidth": ATLAS_TILE_WIDTH,
            "tileHeight": ATLAS_TILE_HEIGHT,
            "quality": ATLAS_QUALITY,
        },
        "runtime manifest phone scrub atlas delivery contract drifted",
    )
    require(
        payload.get("delivery", {}).get("phoneTerminalStill")
        == {
            "mimeType": "image/webp",
            "width": PHONE_WIDTH,
            "height": PHONE_HEIGHT,
            "quality": TERMINAL_STILL_QUALITY,
        },
        "runtime manifest phone terminal still delivery contract drifted",
    )
    for name, contract in TRACKS.items():
        phone = payload.get("tracks", {}).get(name, {}).get("phoneMaster")
        require(isinstance(phone, dict), f"manifest {name}.phoneMaster missing")
        expected_frames = int(contract["beats"]) * BEAT_FRAMES + FINAL_TAIL_EXTRA_FRAMES
        atlas_contract = contract["scrubAtlas"]
        still_contract = contract["terminalStill"]
        require(
            phone
            == {
                "src": f"cake-studio/v17/clips/{contract['file']}",
                "width": PHONE_WIDTH,
                "height": PHONE_HEIGHT,
                "fps": int(FPS),
                "beatFrames": BEAT_FRAMES,
                "finalTailExtraFrames": FINAL_TAIL_EXTRA_FRAMES,
                "keyframeInterval": KEYFRAME_INTERVAL,
                "terminalFrameOffset": TERMINAL_FRAME_OFFSET,
                "frames": expected_frames,
                "duration": round(expected_frames / FPS, 6),
                "scrubAtlas": {
                    "src": f"cake-studio/v17/clips/{atlas_contract['file']}",
                    "bytes": int(atlas_contract["bytes"]),
                    "sha256": str(atlas_contract["sha256"]),
                    "width": int(atlas_contract["columns"]) * ATLAS_TILE_WIDTH,
                    "height": int(atlas_contract["rows"]) * ATLAS_TILE_HEIGHT,
                    "tileWidth": ATLAS_TILE_WIDTH,
                    "tileHeight": ATLAS_TILE_HEIGHT,
                    "quality": ATLAS_QUALITY,
                    "columns": int(atlas_contract["columns"]),
                    "rows": int(atlas_contract["rows"]),
                    "samples": len(atlas_contract["frames"]),
                    "frames": [int(index) for index in atlas_contract["frames"]],
                },
                "terminalStill": {
                    "src": f"cake-studio/v17/clips/{still_contract['file']}",
                    "bytes": int(still_contract["bytes"]),
                    "sha256": str(still_contract["sha256"]),
                    "width": PHONE_WIDTH,
                    "height": PHONE_HEIGHT,
                    "quality": TERMINAL_STILL_QUALITY,
                    "frame": int(still_contract["frame"]),
                    "time": round(int(still_contract["frame"]) / FPS, 6),
                },
            },
            f"manifest {name} phone contract drifted",
        )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--media-dir", type=Path, default=MEDIA, help="directory containing the 15 clips and six phone outputs")
    parser.add_argument("--manifest", type=Path, default=MANIFEST, help="runtime manifest to validate")
    parser.add_argument("--media-only", action="store_true", help="skip runtime manifest activation checks")
    parser.add_argument("--sabotage", action="store_true", help="compare one atlas tile against the wrong master frame in memory")
    args = parser.parse_args()
    media_dir = args.media_dir.resolve()
    manifest = args.manifest.resolve()
    try:
        results = {name: verify_track(media_dir, name, args.sabotage) for name in TRACKS}
        if not args.media_only:
            verify_manifest(manifest)
        if args.sabotage:
            raise GateFailure("sabotage unexpectedly passed")
    except GateFailure as error:
        print(f"CAKE_STUDIO_V17_PHONE_MASTERS_FAIL {error}")
        return 1
    summary = " ".join(
        f"{name}=frames:{result['frames']}/bytes:{result['bytes']}/join:{result['min_join_ssim']:.6f}/"
        f"outer:{result['outer_first_ssim']:.6f},{result['outer_last_ssim']:.6f}/"
        f"terminal:{result['terminal_ssim']:.6f},{result['terminal_mae']:.3f}/"
        f"atlas:{result['atlas']['samples']},{result['atlas']['mean_ssim']:.6f},{result['atlas']['temporal_error_frames']}f/"
        f"still:{result['terminal_still_ssim']:.6f},{result['terminal_still_mae']:.3f}"
        for name, result in results.items()
    )
    print(f"CAKE_STUDIO_V17_PHONE_MASTERS_OK {summary}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
