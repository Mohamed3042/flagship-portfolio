#!/usr/bin/env python3
"""Normalize and fail-closed publish the Cake Studio v1.7.2 media contract.

The original WAN downloads stay under production/. Outputs are built in a new,
ignored staging directory, validated with the media gate, then copied into the
single public runtime directory. Existing runtime clips are never overwritten.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


REPO = Path(__file__).resolve().parents[1]
PACK = REPO / "production/cake-studio-v17/wan-production"
DEFAULT_SOURCE = PACK / "accepted"
RUNTIME = REPO / "public/worlds/cake-studio/v17/clips"
MANIFEST = REPO / "public/worlds/cake-studio/v17/manifest.json"
VERIFY = REPO / "scripts/verify-cake-studio-v17-media.py"
PHONE_BUILD = REPO / "scripts/build-cake-studio-v17-phone-masters.py"
RELEASE_VERSION = "1.7.2"
PHONE_DELIVERY = {
    "codec": "H.264",
    "pixelFormat": "yuv420p",
    "width": 640,
    "height": 360,
    "fps": 15,
    "beatFrames": 68,
    "finalTailExtraFrames": 7,
    "keyframeInterval": 8,
    "terminalFrameOffset": 2,
    "silent": True,
    "faststart": True,
}
PHONE_SCRUB_DELIVERY = {
    "mimeType": "image/webp",
    "tileWidth": 384,
    "tileHeight": 216,
    "quality": 85,
}
PHONE_TERMINAL_DELIVERY = {
    "mimeType": "image/webp",
    "width": 640,
    "height": 360,
    "quality": 100,
}
PHONE_TRACKS = {
    "intro": {
        "file": "CST17-INTRO-PHONE-v172.mp4",
        "beats": 10,
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
        "file": "CST17-OUTRO-PHONE-v172.mp4",
        "beats": 5,
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
PHONE_OUTPUTS = tuple(
    output
    for contract in PHONE_TRACKS.values()
    for output in (
        str(contract["file"]),
        str(contract["scrubAtlas"]["file"]),
        str(contract["terminalStill"]["file"]),
    )
)
EXPECTED = tuple(
    [f"CST17-I{number:02d}.mp4" for number in range(1, 11)]
    + [f"CST17-O{number:02d}.mp4" for number in range(1, 6)]
)


class BuildFailure(RuntimeError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise BuildFailure(message)


def command(args: list[str], label: str) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if result.returncode != 0:
        detail = (result.stderr or result.stdout).strip()
        raise BuildFailure(f"{label} failed ({result.returncode}): {detail}")
    return result


def probe(path: Path, ffprobe: str) -> tuple[int, int]:
    result = command(
        [
            ffprobe,
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "json",
            str(path),
        ],
        f"ffprobe {path.name}",
    )
    payload = json.loads(result.stdout)
    streams = payload.get("streams", [])
    require(len(streams) == 1, f"{path.name} must contain exactly one video stream")
    return int(streams[0]["width"]), int(streams[0]["height"])


def run_gate(media_dir: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VERIFY), "--media-dir", str(media_dir)],
        cwd=REPO,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_manifest_ready(ready: bool) -> None:
    payload = json.loads(MANIFEST.read_text(encoding="utf-8-sig"))
    payload["ready"] = ready
    temporary = MANIFEST.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, MANIFEST)


def validate_runtime_phone_contract(payload: dict) -> None:
    require(payload.get("version") == RELEASE_VERSION, f"runtime manifest version must be {RELEASE_VERSION}")
    require(
        payload.get("delivery", {}).get("phoneMaster") == PHONE_DELIVERY,
        "runtime manifest phone delivery contract mismatch",
    )
    require(
        payload.get("delivery", {}).get("phoneScrubAtlas") == PHONE_SCRUB_DELIVERY,
        "runtime manifest phone scrub atlas delivery contract mismatch",
    )
    require(
        payload.get("delivery", {}).get("phoneTerminalStill") == PHONE_TERMINAL_DELIVERY,
        "runtime manifest phone terminal still delivery contract mismatch",
    )
    tracks = payload.get("tracks", {})
    for name, contract in PHONE_TRACKS.items():
        expected_frames = (
            int(contract["beats"]) * int(PHONE_DELIVERY["beatFrames"])
            + int(PHONE_DELIVERY["finalTailExtraFrames"])
        )
        atlas = contract["scrubAtlas"]
        terminal = contract["terminalStill"]
        require(
            tracks.get(name, {}).get("phoneMaster")
            == {
                "src": f"cake-studio/v17/clips/{contract['file']}",
                "width": PHONE_DELIVERY["width"],
                "height": PHONE_DELIVERY["height"],
                "fps": PHONE_DELIVERY["fps"],
                "beatFrames": PHONE_DELIVERY["beatFrames"],
                "finalTailExtraFrames": PHONE_DELIVERY["finalTailExtraFrames"],
                "keyframeInterval": PHONE_DELIVERY["keyframeInterval"],
                "terminalFrameOffset": PHONE_DELIVERY["terminalFrameOffset"],
                "frames": expected_frames,
                "duration": round(expected_frames / int(PHONE_DELIVERY["fps"]), 6),
                "scrubAtlas": {
                    "src": f"cake-studio/v17/clips/{atlas['file']}",
                    "bytes": int(atlas["bytes"]),
                    "sha256": str(atlas["sha256"]),
                    "width": int(atlas["columns"]) * PHONE_SCRUB_DELIVERY["tileWidth"],
                    "height": int(atlas["rows"]) * PHONE_SCRUB_DELIVERY["tileHeight"],
                    "tileWidth": PHONE_SCRUB_DELIVERY["tileWidth"],
                    "tileHeight": PHONE_SCRUB_DELIVERY["tileHeight"],
                    "quality": PHONE_SCRUB_DELIVERY["quality"],
                    "columns": int(atlas["columns"]),
                    "rows": int(atlas["rows"]),
                    "samples": len(atlas["frames"]),
                    "frames": [int(index) for index in atlas["frames"]],
                },
                "terminalStill": {
                    "src": f"cake-studio/v17/clips/{terminal['file']}",
                    "bytes": int(terminal["bytes"]),
                    "sha256": str(terminal["sha256"]),
                    "width": PHONE_TERMINAL_DELIVERY["width"],
                    "height": PHONE_TERMINAL_DELIVERY["height"],
                    "quality": PHONE_TERMINAL_DELIVERY["quality"],
                    "frame": int(terminal["frame"]),
                    "time": round(int(terminal["frame"]) / int(PHONE_DELIVERY["fps"]), 6),
                },
            },
            f"runtime {name} phone master contract mismatch",
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument(
        "--provider-mark",
        choices=("auto", "wan27", "none"),
        default="wan27",
        help="WAN 2.7 corner cleanup is on by default; use none only after visual proof",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source_dir = args.source_dir.resolve() if args.source_dir.is_absolute() else (REPO / args.source_dir).resolve()
    require(source_dir.is_dir(), f"source directory missing: {source_dir}")
    inputs = {path.name: path for path in source_dir.glob("*.mp4") if path.is_file()}
    missing = [name for name in EXPECTED if name not in inputs]
    extras = sorted(set(inputs) - set(EXPECTED))
    require(not missing, f"missing owner downloads: {','.join(missing)}")
    require(not extras, f"unexpected MP4 files: {','.join(extras)}")
    require(
        MANIFEST.is_file() and VERIFY.is_file() and PHONE_BUILD.is_file(),
        "runtime manifest, media verifier, or phone builder missing",
    )
    runtime_manifest = json.loads(MANIFEST.read_text(encoding="utf-8-sig"))
    validate_runtime_phone_contract(runtime_manifest)
    runtime_records = [
        *runtime_manifest.get("tracks", {}).get("intro", {}).get("clips", []),
        *runtime_manifest.get("tracks", {}).get("outro", {}).get("clips", []),
    ]
    require(len(runtime_records) == 15, "runtime manifest does not expose 15 clips")
    records_by_output = {f"CST17-{record.get('id', '')}.mp4": record for record in runtime_records}
    require(tuple(records_by_output) == EXPECTED, "runtime manifest order does not match expected outputs")
    ffmpeg = shutil.which("ffmpeg")
    ffprobe = shutil.which("ffprobe")
    require(ffmpeg is not None and ffprobe is not None, "ffmpeg/ffprobe are not on PATH")

    staging_parent = PACK / "runtime-staging"
    staging_parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix="normalized-", dir=staging_parent))
    print(f"V17_MEDIA_BUILD_STAGE {staging}")

    for index, name in enumerate(EXPECTED, start=1):
        source = inputs[name]
        output = staging / name
        record = records_by_output[name]
        first_anchor = PACK / "keyframes" / f"{Path(record['first']).stem}.png"
        last_anchor = PACK / "keyframes" / f"{Path(record['last']).stem}.png"
        require(first_anchor.is_file() and last_anchor.is_file(), f"endpoint anchors missing for {name}")
        width, height = probe(source, ffprobe)
        use_delogo = args.provider_mark == "wan27" or (
            args.provider_mark == "auto" and (width, height) == (1274, 722)
        )
        filters: list[str] = []
        if use_delogo:
            require(width >= 1234 and height >= 712, f"{name} is too small for WAN corner cleanup")
            filters.append("delogo=x=1182:y=666:w=52:h=46")
        filters.extend(
            (
                "scale=1280:720:flags=lanczos",
                "setsar=1",
                "fps=30",
                "trim=end_frame=150",
                "setpts=PTS-STARTPTS",
            )
        )
        filter_complex = (
            f"[0:v]{','.join(filters)}[source];"
            "[1:v]scale=1280:720:flags=lanczos,setsar=1,fps=30,trim=end_frame=150,setpts=PTS-STARTPTS,split=2[firstblend][firstexact];"
            "[2:v]scale=1280:720:flags=lanczos,setsar=1,fps=30,trim=end_frame=150,setpts=PTS-STARTPTS,split=2[lastblend][lastexact];"
            "[firstblend][source]blend=all_expr='if(lt(N\\,10)\\,A*(1-(N-1)/9)+B*(N-1)/9\\,B)'[opened];"
            "[opened][lastblend]blend=all_expr='if(lt(N\\,127)\\,A\\,if(lt(N\\,136)\\,A*(1-(N-127)/9)+B*((N-127)/9)\\,B))'[conditioned];"
            "[firstexact]trim=end_frame=1,setpts=PTS-STARTPTS[head];"
            "[conditioned]trim=start_frame=1:end_frame=135,setpts=PTS-STARTPTS[middle];"
            "[lastexact]trim=end_frame=15,setpts=PTS-STARTPTS[tail];"
            "[head][middle][tail]concat=n=3:v=1:a=0[final]"
        )
        command(
            [
                ffmpeg,
                "-nostdin",
                "-v",
                "error",
                "-i",
                str(source),
                "-loop",
                "1",
                "-framerate",
                "30",
                "-i",
                str(first_anchor),
                "-loop",
                "1",
                "-framerate",
                "30",
                "-i",
                str(last_anchor),
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
                "15",
                "-keyint_min",
                "15",
                "-sc_threshold",
                "0",
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                "-frames:v",
                "150",
                str(output),
            ],
            f"normalize {name}",
        )
        print(f"[{index:02d}/15] {name} {width}x{height} delogo={str(use_delogo).lower()}")

    phone_build = command(
        [sys.executable, str(PHONE_BUILD), "--media-dir", str(staging), "--force"],
        "build v1.7.2 phone masters and companions",
    )
    print(phone_build.stdout.strip())

    staged_gate = run_gate(staging)
    staged_output = (staged_gate.stdout + staged_gate.stderr).strip()
    require(
        staged_gate.returncode == 3 and "V17_MEDIA_GATE_SOURCE_OK_NEEDS_INTEGRATION" in staged_output,
        f"normalized staging gate did not reach the integration boundary: {staged_output}",
    )

    write_manifest_ready(False)
    RUNTIME.mkdir(parents=True, exist_ok=True)
    for name in (*EXPECTED, *PHONE_OUTPUTS):
        source = staging / name
        target = RUNTIME / name
        if target.exists():
            require(sha256(target) == sha256(source), f"runtime conflict differs from validated staging: {name}")
            continue
        incoming = RUNTIME / f".{name}.incoming"
        shutil.copy2(source, incoming)
        os.replace(incoming, target)

    pending_gate = run_gate(RUNTIME)
    pending_output = (pending_gate.stdout + pending_gate.stderr).strip()
    require(
        pending_gate.returncode == 1
        and "all 15 desktop clips validate, but runtime manifest ready is false" in pending_output,
        f"runtime validation did not stop only at readiness: {pending_output}",
    )

    write_manifest_ready(True)
    final_gate = run_gate(RUNTIME)
    final_output = (final_gate.stdout + final_gate.stderr).strip()
    if final_gate.returncode != 0 or "V17_MEDIA_GATE_OK" not in final_output:
        write_manifest_ready(False)
        raise BuildFailure(f"final runtime gate failed; manifest returned to ready=false: {final_output}")
    print(final_output)
    print(
        f"V17_MEDIA_BUILD_OK desktop_clips=15 phone_masters=2 phone_atlases=2 "
        f"phone_terminal_stills=2 runtime={RUNTIME} staging_preserved={staging}"
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except BuildFailure as error:
        print(f"V17_MEDIA_BUILD_FAIL {error}", file=sys.stderr)
        raise SystemExit(1)
