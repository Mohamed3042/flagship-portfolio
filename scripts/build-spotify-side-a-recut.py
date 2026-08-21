#!/usr/bin/env python3
"""Audit, normalize, and stage THE ALBUM — Side A Recut WAN returns.

House media behavior is reused from the proven Disney intake and Cake Studio
V17 endpoint-conditioning pipelines: hash-bound raw mapping, common WAN mark
intersection, identical top-anchored crop, exact first frame, blended endpoint
conditioning, a 15-frame exact final hold, silent H.264/yuv420p/faststart, and
decoded endpoint verification.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


DEFAULT_REPO = Path(r"C:\Users\GAMING\Downloads\flagship-portfolio-git")
DEFAULT_SOURCE = Path(r"C:\Users\GAMING\Downloads\spotify stuffff")
FFMPEG = Path(
    r"C:\Users\GAMING\AppData\Local\Microsoft\WinGet\Packages"
    r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
    r"\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
)
FFPROBE = FFMPEG.with_name("ffprobe.exe")

RAW_FILES = [
    {
        "index": 0,
        "filename": "Wan_First&LastFrame_Generate single shot. @Image1 is the immutable listening.mp4",
        "sha256": "96d2a32aebed6ce0b4e33a99aa0e9b9661dbba10a97a306ce0214fea54085c8c",
        "canonical": "SPT-A01-WAN-RAW.mp4",
    },
    {
        "index": 1,
        "filename": "Wan_First&LastFrame_Generate single shot. @Image1 is the immutable listening (1).mp4",
        "sha256": "eb2e918ba23964754e14999a5c9dd72a2c14284cdc61f7d4d5659a1078204686",
        "canonical": "SPT-A02-WAN-RAW.mp4",
    },
    {
        "index": 2,
        "filename": "Wan_First&LastFrame_Generate single shot. @Image1 is the immutable listening (2).mp4",
        "sha256": "500f054db7182aac7aa025a98f2f2642fb41f5ff88d033134ca907b37c90d4a2",
        "canonical": "SPT-A03-WAN-RAW.mp4",
    },
    {
        "index": 3,
        "filename": "Wan_First&LastFrame_Generate single shot. @Image1 is the immutable listening (3).mp4",
        "sha256": "df39c9c36c28dad3dae4b80557400dd362d9bc32111b444f0ed81aa2d045b33e",
        "canonical": "SPT-A04-WAN-REJECTED-DETACHED-EFFECT.mp4",
    },
    {
        "index": 4,
        "filename": "Wan_First&LastFrame_Generate single shot. @Image1 is the immutable listening (4).mp4",
        "sha256": "86668be2c72138cbb62c0f577e544ffe762b5440a622f4ed795a7ecf1f68dbdd",
        "canonical": "SPT-A05-WAN-RAW.mp4",
    },
    {
        "index": 5,
        "filename": "Wan_First&LastFrame_Generate single shot. @Image1 is the immutable listening (5).mp4",
        "sha256": "aac36b3145de68638a027eb21d1a09cc6ce96e9ec58f67cfe0ec3abd9d3c8067",
        "canonical": "SPT-A06-WAN-RAW.mp4",
    },
    {
        "index": 6,
        "filename": "Wan_First&LastFrame_Generate single shot. @Image1 is the immutable listening (6).mp4",
        "sha256": "230eca09ff6981e7b0dea115fc8aed1cf0860d551b9f196597a4430f56239405",
        "canonical": "SPT-A07-WAN-RAW.mp4",
    },
    {
        "index": 7,
        "filename": "Wan_First&LastFrame_Generate single shot. @Image1 is the immutable listening (7).mp4",
        "sha256": "cef1a287c25a7ac8c9348d1257cefcffad11989093c07a8211cb092d7a4c0e87",
        "canonical": "SPT-A04-WAN-RAW-RETAKE.mp4",
    },
]

CLIPS = [
    {"id": "A01", "raw": 0, "title": "First Light", "first": "W01-first.png", "last": "W01-last.png", "stem": "room01-silence-recut", "legacy": "live/room01-silence"},
    {"id": "A02", "raw": 1, "title": "Contact", "first": "W02-first.png", "last": "W02-last.png", "stem": "room02-contact-recut", "legacy": "live/room02-contact"},
    {"id": "A03", "raw": 2, "title": "The Sundial", "first": "W03-first.png", "last": "W03-last.png", "stem": "room03-runway-recut", "legacy": "live/room03-runway"},
    {"id": "A04", "raw": 7, "title": "The Aligned Desk", "first": "W04-first.png", "last": "W04-last.png", "stem": "room04-build-recut", "legacy": "live/room04-build"},
    {"id": "A05", "raw": 4, "title": "The Passing Car", "first": "W05-first.png", "last": "W05-last.png", "stem": "room05-lounge-recut", "legacy": "live/room05-lounge"},
    {"id": "A06", "raw": 5, "title": "The Synchronized Room", "first": "W06-first.png", "last": "W06-last.png", "stem": "room06-chorus-recut", "legacy": "live/room06-chorus"},
    {"id": "A07", "raw": 6, "title": "Needle Up", "first": "W07-first.png", "last": "W07-last.png", "stem": "room07-needle-up-recut", "legacy": "shots/s15-outro"},
]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def command(args: list[str | os.PathLike[str]], label: str, capture: bool = False) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        [str(arg) for arg in args],
        stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE if capture else subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode:
        raise RuntimeError(f"{label} failed ({result.returncode}): {result.stderr.strip()[:1200]}")
    return result


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def probe(path: Path) -> dict:
    result = command(
        [
            FFPROBE,
            "-v",
            "error",
            "-show_entries",
            "format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt,nb_frames",
            "-of",
            "json",
            path,
        ],
        f"probe {path.name}",
        capture=True,
    )
    data = json.loads(result.stdout)
    video = next((stream for stream in data.get("streams", []) if stream.get("codec_type") == "video"), {})
    audio = next((stream for stream in data.get("streams", []) if stream.get("codec_type") == "audio"), None)
    keyframe_result = command(
        [
            FFPROBE,
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-skip_frame",
            "nokey",
            "-show_entries",
            "frame=best_effort_timestamp_time",
            "-of",
            "csv=p=0",
            path,
        ],
        f"keyframes {path.name}",
        capture=True,
    )
    return {
        "codec": video.get("codec_name"),
        "width": int(video.get("width") or 0),
        "height": int(video.get("height") or 0),
        "frameRate": video.get("r_frame_rate"),
        "pixelFormat": video.get("pix_fmt"),
        "frames": int(video.get("nb_frames") or 0),
        "duration": round(float(data.get("format", {}).get("duration") or 0), 6),
        "bytes": int(data.get("format", {}).get("size") or 0),
        "audioCodec": audio.get("codec_name") if audio else None,
        "keyframes": len([line for line in keyframe_result.stdout.splitlines() if line.strip()]),
        "faststart": faststart(path),
    }


def faststart(path: Path) -> bool:
    with path.open("rb") as handle:
        head = handle.read(min(path.stat().st_size, 2_000_000))
    moov = head.find(b"moov")
    mdat = head.find(b"mdat")
    return moov >= 0 and (mdat < 0 or moov < mdat)


def frame(path: Path, timestamp: float, output: Path) -> Path:
    output.parent.mkdir(parents=True, exist_ok=True)
    command(
        [
            FFMPEG,
            "-nostdin",
            "-v",
            "error",
            "-ss",
            f"{timestamp:.6f}",
            "-i",
            path,
            "-an",
            "-frames:v",
            "1",
            "-y",
            output,
        ],
        f"extract {path.name} @ {timestamp:.3f}",
    )
    return output


def selected_paths(source: Path) -> list[Path]:
    return [source / RAW_FILES[clip["raw"]]["filename"] for clip in CLIPS]


def verify_sources(source: Path) -> list[dict]:
    actual = sorted(path.name for path in source.glob("*.mp4"))
    expected = sorted(record["filename"] for record in RAW_FILES)
    require(actual == expected, f"raw file set mismatch missing={sorted(set(expected)-set(actual))} extra={sorted(set(actual)-set(expected))}")
    rows = []
    for record in RAW_FILES:
        path = source / record["filename"]
        actual_hash = sha256(path)
        require(actual_hash == record["sha256"], f"raw hash mismatch: {path.name}")
        rows.append({**record, "path": str(path), "metadata": probe(path)})
    return rows


def detect_watermark(source: Path, scratch: Path) -> dict:
    masks = []
    origin_x = origin_y = 0
    for clip, path in zip(CLIPS, selected_paths(source), strict=True):
        image_path = frame(path, 3.8, scratch / f"wm-{clip['id']}.png")
        pixels = np.asarray(Image.open(image_path).convert("L"), dtype=np.uint8)
        height, width = pixels.shape
        origin_y = int(height * 0.85)
        origin_x = int(width * 0.75)
        masks.append(pixels[origin_y:, origin_x:] > 160)
    common = masks[0]
    for mask in masks[1:]:
        common = common & mask
    ys, xs = np.where(common)
    require(len(xs) >= 24, f"common WAN mark not measurable: commonBrightPixels={len(xs)}")
    top = origin_y + int(ys.min())
    left = origin_x + int(xs.min())
    bottom = origin_y + int(ys.max())
    right = origin_x + int(xs.max())
    crop_band = 720 - top + 8
    if crop_band % 2:
        crop_band += 1
    require(40 <= crop_band <= 90, f"implausible WAN crop band: {crop_band}px box={left},{top}-{right},{bottom}")
    return {
        "threshold": 160,
        "commonBrightPixels": int(len(xs)),
        "box": {"left": left, "top": top, "right": right, "bottom": bottom},
        "cropBottomPixels": crop_band,
        "outputHeight": 720 - crop_band,
    }


def raw_gate(rows: list[dict], watermark: dict) -> list[str]:
    errors = []
    for row in rows:
        meta = row["metadata"]
        if meta["width"] != 1280 or meta["height"] != 720:
            errors.append(f"{row['index']}: raw resolution {meta['width']}x{meta['height']}")
        if meta["codec"] != "h264" or meta["frameRate"] != "30/1":
            errors.append(f"{row['index']}: raw codec/fps {meta['codec']} {meta['frameRate']}")
        if meta["audioCodec"] is not None:
            errors.append(f"{row['index']}: raw audio present ({meta['audioCodec']})")
        if meta["frames"] != 150 or abs(meta["duration"] - 5.0) > 0.02:
            errors.append(f"{row['index']}: raw timing frames={meta['frames']} duration={meta['duration']}")
    if watermark["cropBottomPixels"]:
        errors.append(f"common WAN mark occupies bottom band ({watermark['cropBottomPixels']}px)")
    return errors


def normalize(source: Path, repo: Path, clip: dict, output_height: int) -> Path:
    raw = source / RAW_FILES[clip["raw"]]["filename"]
    anchors = repo / "public/worlds/assets/spotify-side-a-recut/wan/input"
    first_anchor = anchors / clip["first"]
    last_anchor = anchors / clip["last"]
    require(first_anchor.is_file() and last_anchor.is_file(), f"anchors missing for {clip['id']}")
    output = repo / "public/worlds/spotify/live" / f"{clip['stem']}.mp4"
    output.parent.mkdir(parents=True, exist_ok=True)
    base = f"crop=1280:{output_height}:0:0,setsar=1,fps=30,trim=end_frame=150,setpts=PTS-STARTPTS"
    filter_complex = (
        f"[0:v]{base}[source];"
        f"[1:v]{base},split=2[firstblend][firstexact];"
        f"[2:v]{base},split=2[lastblend][lastexact];"
        "[firstblend][source]blend=all_expr='if(lt(N\\,10)\\,A*(1-(N-1)/9)+B*(N-1)/9\\,B)'[opened];"
        "[opened][lastblend]blend=all_expr='if(lt(N\\,127)\\,A\\,if(lt(N\\,136)\\,A*(1-(N-127)/9)+B*((N-127)/9)\\,B))'[conditioned];"
        "[firstexact]trim=end_frame=1,setpts=PTS-STARTPTS[head];"
        "[conditioned]trim=start_frame=1:end_frame=135,setpts=PTS-STARTPTS[middle];"
        "[lastexact]trim=end_frame=15,setpts=PTS-STARTPTS[tail];"
        "[head][middle][tail]concat=n=3:v=1:a=0[final]"
    )
    command(
        [
            FFMPEG,
            "-nostdin",
            "-v",
            "error",
            "-i",
            raw,
            "-loop",
            "1",
            "-framerate",
            "30",
            "-i",
            first_anchor,
            "-loop",
            "1",
            "-framerate",
            "30",
            "-i",
            last_anchor,
            "-filter_complex",
            filter_complex,
            "-map",
            "[final]",
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-crf",
            "18",
            "-x264-params",
            "zones=0,0,q=0/135,149,q=0",
            "-g",
            "12",
            "-keyint_min",
            "12",
            "-sc_threshold",
            "0",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-frames:v",
            "150",
            "-y",
            output,
        ],
        f"normalize {clip['id']}",
    )
    return output


def make_poster(video: Path, poster: Path) -> None:
    poster.parent.mkdir(parents=True, exist_ok=True)
    command(
        [FFMPEG, "-nostdin", "-v", "error", "-i", video, "-frames:v", "1", "-q:v", "2", "-y", poster],
        f"poster {poster.name}",
    )


def image_mad(actual_path: Path, expected_path: Path, output_height: int) -> dict:
    actual = Image.open(actual_path).convert("RGB")
    expected = Image.open(expected_path).convert("RGB").crop((0, 0, 1280, output_height))
    require(actual.size == expected.size, f"endpoint size mismatch {actual.size} != {expected.size}")
    sample_size = (192, max(1, round(output_height * 192 / 1280)))
    a = actual.resize(sample_size, Image.Resampling.BILINEAR)
    b = expected.resize(sample_size, Image.Resampling.BILINEAR)
    raw = np.asarray(ImageChops.difference(a, b), dtype=np.float32).mean()
    edge_a = a.convert("L").filter(ImageFilter.FIND_EDGES)
    edge_b = b.convert("L").filter(ImageFilter.FIND_EDGES)
    edge = np.asarray(ImageChops.difference(edge_a, edge_b), dtype=np.float32).mean()
    return {"rawMeanAbsDiff": round(float(raw), 3), "edgeMeanAbsDiff": round(float(edge), 3)}


def endpoints(video: Path, first_anchor: Path, last_anchor: Path, output_height: int, scratch: Path) -> dict:
    first_frame = frame(video, 0.0, scratch / f"{video.stem}-first.png")
    last_frame = frame(video, 4.966, scratch / f"{video.stem}-last.png")
    first = image_mad(first_frame, first_anchor, output_height)
    last = image_mad(last_frame, last_anchor, output_height)
    require(first["rawMeanAbsDiff"] <= 4.0, f"{video.name}: first endpoint drift {first}")
    require(last["rawMeanAbsDiff"] <= 4.0, f"{video.name}: last endpoint drift {last}")
    return {"first": first, "last": last}


def archive_legacy(repo: Path) -> list[dict]:
    world = repo / "public/worlds/spotify"
    archive_root = world / "archive/side-a-pre-recut-20260821"
    records = []
    for clip in CLIPS:
        legacy = Path(clip["legacy"])
        for suffix in (".mp4", ".jpg"):
            original = world / f"{legacy}{suffix}"
            archived = archive_root / f"{legacy}{suffix}"
            require(original.is_file(), f"legacy source missing: {original}")
            archived.parent.mkdir(parents=True, exist_ok=True)
            if archived.exists():
                require(sha256(archived) == sha256(original), f"archive conflict: {archived}")
            else:
                shutil.copy2(original, archived)
            records.append(
                {
                    "original": original.relative_to(repo).as_posix(),
                    "archive": archived.relative_to(repo).as_posix(),
                    "sha256": sha256(original),
                    "bytes": original.stat().st_size,
                }
            )
    return records


def copy_raw_returns(source: Path, repo: Path) -> list[dict]:
    raw_root = repo / "production/spotify-side-a-recut/wan-returns/raw"
    raw_root.mkdir(parents=True, exist_ok=True)
    records = []
    for raw in RAW_FILES:
        source_path = source / raw["filename"]
        target = raw_root / raw["canonical"]
        if target.exists():
            require(sha256(target) == raw["sha256"], f"raw custody conflict: {target}")
        else:
            shutil.copy2(source_path, target)
        records.append(
            {
                "downloadFilename": raw["filename"],
                "custodyPath": target.relative_to(repo).as_posix(),
                "sha256": raw["sha256"],
                "bytes": target.stat().st_size,
            }
        )
    return records


def contact_sheet(rows: list[tuple[str, Path]], output: Path, timestamps: list[float]) -> None:
    thumb = (384, 216)
    label_height = 26
    canvas = Image.new("RGB", (thumb[0] * len(timestamps), (thumb[1] + label_height) * len(rows)), "#050505")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    with tempfile.TemporaryDirectory(prefix="spt-contact-") as temp_name:
        temp = Path(temp_name)
        for row_index, (label, video) in enumerate(rows):
            for column, timestamp in enumerate(timestamps):
                image_path = frame(video, timestamp, temp / f"{row_index}-{column}.png")
                image = Image.open(image_path).convert("RGB")
                image.thumbnail(thumb, Image.Resampling.LANCZOS)
                x = column * thumb[0]
                y = row_index * (thumb[1] + label_height)
                canvas.paste(image, (x + (thumb[0] - image.width) // 2, y + (thumb[1] - image.height) // 2))
                draw.text((x + 8, y + thumb[1] + 7), f"{label}  t={timestamp:.2f}s", fill="#bfffd5", font=font)
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, quality=90, subsampling=0)


def update_board_manifest(repo: Path, run_manifest: dict) -> None:
    path = repo / "public/worlds/assets/spotify-side-a-recut/wan/WAN-720P-5S-manifest.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    data["videoGenerated"] = True
    data["rawReturnsObserved"] = 8
    data["acceptedReturns"] = 7
    data["selectedA04RawIndex"] = 7
    data["runManifest"] = "../../../spotify-side-a-recut/WAN-RECUT-RUN-MANIFEST.json"
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    public_manifest = repo / "public/worlds/assets/spotify-side-a-recut/WAN-RECUT-RUN-MANIFEST.json"
    public_manifest.write_text(json.dumps(run_manifest, indent=2) + "\n", encoding="utf-8")


def preflight(source: Path) -> int:
    require(FFMPEG.is_file() and FFPROBE.is_file(), "installed FFmpeg 8.1.2 runtime missing")
    rows = verify_sources(source)
    with tempfile.TemporaryDirectory(prefix="spt-preflight-") as temp_name:
        watermark = detect_watermark(source, Path(temp_name))
    errors = raw_gate(rows, watermark)
    print(json.dumps({"rawReturns": len(rows), "watermark": watermark, "errors": errors}, indent=2))
    if errors:
        print(f"RAW_NORMALIZATION_GATE_RED errors={len(errors)}")
        return 3
    print("RAW_NORMALIZATION_GATE_GREEN")
    return 0


def build(source: Path, repo: Path) -> int:
    require(FFMPEG.is_file() and FFPROBE.is_file(), "installed FFmpeg 8.1.2 runtime missing")
    require((repo / ".git").exists(), f"repo missing: {repo}")
    raw_rows = verify_sources(source)
    production = repo / "production/spotify-side-a-recut"
    review = production / "review"
    scratch = production / "wan-returns/intake"
    scratch.mkdir(parents=True, exist_ok=True)
    watermark = detect_watermark(source, scratch)
    output_height = watermark["outputHeight"]
    raw_custody = copy_raw_returns(source, repo)
    archive = archive_legacy(repo)

    normalized_records = []
    anchors = repo / "public/worlds/assets/spotify-side-a-recut/wan/input"
    for clip in CLIPS:
        output = normalize(source, repo, clip, output_height)
        poster = output.with_suffix(".jpg")
        make_poster(output, poster)
        metadata = probe(output)
        require(
            metadata["codec"] == "h264"
            and metadata["width"] == 1280
            and metadata["height"] == output_height
            and metadata["frameRate"] == "30/1"
            and metadata["pixelFormat"] == "yuv420p"
            and metadata["frames"] == 150
            and abs(metadata["duration"] - 5.0) <= 0.02
            and metadata["audioCodec"] is None
            and metadata["keyframes"] >= 12
            and metadata["faststart"],
            f"normalized contract failed for {clip['id']}: {metadata}",
        )
        endpoint = endpoints(output, anchors / clip["first"], anchors / clip["last"], output_height, scratch)
        normalized_records.append(
            {
                "id": clip["id"],
                "title": clip["title"],
                "selectedRawIndex": clip["raw"],
                "sourceFilename": RAW_FILES[clip["raw"]]["filename"],
                "sourceSha256": RAW_FILES[clip["raw"]]["sha256"],
                "firstAnchor": f"public/worlds/assets/spotify-side-a-recut/wan/input/{clip['first']}",
                "lastAnchor": f"public/worlds/assets/spotify-side-a-recut/wan/input/{clip['last']}",
                "video": output.relative_to(repo).as_posix(),
                "poster": poster.relative_to(repo).as_posix(),
                "sha256": sha256(output),
                "posterSha256": sha256(poster),
                "metadata": metadata,
                "endpointEvidence": endpoint,
            }
        )
        print(f"[{clip['id']}] GREEN {output.name} {metadata['width']}x{metadata['height']} 150f silent")

    raw_sheet_rows = [(f"RAW-{row['index']}", source / row["filename"]) for row in RAW_FILES]
    normalized_sheet_rows = [(record["id"], repo / record["video"]) for record in normalized_records]
    timestamps = [0.0, 1.2, 2.5, 3.8, 4.95]
    contact_sheet(raw_sheet_rows, review / "WAN-RAW-MIDDLES.jpg", timestamps)
    contact_sheet(normalized_sheet_rows, review / "WAN-NORMALIZED-MIDDLES.jpg", timestamps)

    run_manifest = {
        "schema": "spotify-side-a-recut-wan-run/v1",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "NORMALIZED_READY_FOR_RUNTIME_REVIEW",
        "provider": "WAN 2.7 First & Last Frame",
        "rawReturnCount": 8,
        "acceptedClipCount": 7,
        "rejectedReturnCount": 1,
        "selection": {
            "A04": {
                "acceptedRawIndex": 7,
                "rejectedRawIndex": 3,
                "reason": "Retake keeps the generated waveform inside the monitor plane; the earlier return lets the effect detach into the room.",
            }
        },
        "creditReconciliation": {
            "zeroRetakePlan": 70,
            "plannedAtOnePointFive": 105,
            "observedOutputs": 8,
            "creditsPerOutputFromLockedContract": 10,
            "actualCredits": 80,
            "claimStatus": "INFERRED_FROM_8_OBSERVED_OUTPUT_FILES_AT_THE_LOCKED_10_CREDIT_RATE",
        },
        "rawGate": {"status": "RED_BEFORE_NORMALIZATION", "reasons": raw_gate(raw_rows, watermark)},
        "watermarkTreatment": {
            **watermark,
            "method": "Bright-pixel intersection across seven selected returns at t=3.8s, followed by one identical top-anchored crop; no scaling or delogo.",
        },
        "normalization": {
            "codec": "H.264",
            "pixelFormat": "yuv420p",
            "frameRate": 30,
            "frames": 150,
            "durationSeconds": 5.0,
            "silent": True,
            "faststart": True,
            "gopFrames": 12,
            "endpointConditioning": "frame 0 exact; 9-frame opening blend; 9-frame landing blend; final 15 frames exact destination hold",
        },
        "rawCustody": raw_custody,
        "legacyArchive": archive,
        "clips": normalized_records,
        "reviewSheets": [
            "production/spotify-side-a-recut/review/WAN-RAW-MIDDLES.jpg",
            "production/spotify-side-a-recut/review/WAN-NORMALIZED-MIDDLES.jpg",
        ],
    }
    manifest_path = production / "wan-returns/WAN-RECUT-RUN-MANIFEST.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(run_manifest, indent=2) + "\n", encoding="utf-8")
    update_board_manifest(repo, run_manifest)
    print(
        f"SPOTIFY_SIDE_A_MEDIA_GREEN clips=7 raw=8 rejected=1 crop=1280x{output_height} "
        f"frames=150 audio=none manifest={manifest_path}"
    )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--repo", type=Path, default=DEFAULT_REPO)
    parser.add_argument("--preflight", action="store_true")
    parser.add_argument("--build", action="store_true")
    args = parser.parse_args()
    require(args.preflight != args.build, "choose exactly one of --preflight or --build")
    source = args.source.resolve()
    repo = args.repo.resolve()
    require(source.is_dir(), f"source folder missing: {source}")
    return preflight(source) if args.preflight else build(source, repo)


if __name__ == "__main__":
    raise SystemExit(main())
