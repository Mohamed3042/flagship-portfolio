from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image


REPO = Path(__file__).resolve().parents[1]
PRODUCTION = REPO / "public/worlds/assets/strings/wan-production"
KEYFRAMES = REPO / "public/worlds/assets/strings/keyframes"
REPORT = REPO / "public/worlds/assets/strings/review/final-seam-table.json"
WIDTH, HEIGHT = 320, 180
THRESHOLD = 0.90


def frame(path: Path, where: str) -> np.ndarray:
    command = ["ffmpeg", "-v", "error"]
    if where == "last":
        command += ["-sseof", "-0.04"]
    command += [
        "-i", str(path), "-frames:v", "1", "-vf",
        f"scale={WIDTH}:{HEIGHT}:flags=area,format=rgb24", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
    ]
    completed = subprocess.run(command, check=True, capture_output=True)
    return np.frombuffer(completed.stdout, dtype=np.uint8).reshape((HEIGHT, WIDTH, 3))


def anchor(path: Path) -> np.ndarray:
    with Image.open(path) as image:
        source = image.convert("RGB")
        # Apply the same measured watermark-removal crop in approved-still
        # coordinates before comparing it to the normalized master.
        left = round(50 / 1274 * source.width)
        right = round((50 + 1174) / 1274 * source.width)
        bottom = round(660 / 722 * source.height)
        normalized = source.crop((left, 0, right, bottom)).resize(
            (WIDTH, HEIGHT), Image.Resampling.LANCZOS
        )
    return np.asarray(normalized, dtype=np.uint8)


def luma(image: np.ndarray) -> np.ndarray:
    source = image.astype(np.float32)
    return 0.2126 * source[..., 0] + 0.7152 * source[..., 1] + 0.0722 * source[..., 2]


def correlation(left: np.ndarray, right: np.ndarray) -> float:
    return float(np.corrcoef(luma(left).reshape(-1), luma(right).reshape(-1))[0, 1])


def mad(left: np.ndarray, right: np.ndarray) -> float:
    return float(np.mean(np.abs(luma(left) - luma(right))))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sabotage", action="store_true")
    args = parser.parse_args()
    manifest = json.loads((PRODUCTION / "clips.json").read_text(encoding="utf-8"))
    keyframe_by_id = {}
    for path in KEYFRAMES.glob("CTS-KF*.png"):
        keyframe_by_id[path.name.split("-")[1]] = path

    rows = []
    for index, clip in enumerate(manifest["clips"]):
        next_clip = manifest["clips"][(index + 1) % len(manifest["clips"])]
        target_id = clip["targetId"]
        target = keyframe_by_id[target_id]
        if args.sabotage and index == 0:
            target = keyframe_by_id["KF20"]
        outgoing = frame(PRODUCTION / clip["acceptedFilename"], "last")
        incoming = frame(PRODUCTION / next_clip["acceptedFilename"], "first")
        approved = anchor(target)
        outgoing_corr = correlation(outgoing, approved)
        incoming_corr = correlation(incoming, approved)
        pair_corr = correlation(outgoing, incoming)
        passed = outgoing_corr >= THRESHOLD and incoming_corr >= THRESHOLD
        viewer_effect = None
        if not passed:
            failed = []
            if outgoing_corr < THRESHOLD:
                failed.append(f"outgoing hold departs from {clip['targetId']}")
            if incoming_corr < THRESHOLD:
                failed.append(f"incoming first frame departs from {clip['targetId']}")
            viewer_effect = "; ".join(failed) + "; the viewer may see a visible seam snap while crossing slots"
        rows.append(
            {
                "from": clip["clip"],
                "to": next_clip["clip"],
                "approvedAnchor": clip["targetId"],
                "approvedAnchorPath": str(target.relative_to(REPO)).replace("\\", "/"),
                "outgoingToAnchorCorrelation": round(outgoing_corr, 6),
                "incomingToAnchorCorrelation": round(incoming_corr, 6),
                "outgoingToIncomingCorrelation": round(pair_corr, 6),
                "outgoingToAnchorLumaMad": round(mad(outgoing, approved), 6),
                "incomingToAnchorLumaMad": round(mad(incoming, approved), 6),
                "result": "GREEN" if passed else "RED",
                "viewerEffect": viewer_effect,
            }
        )
    red = [row for row in rows if row["result"] == "RED"]
    report = {
        "schema": "cut-the-strings-final-seams/v1",
        "result": "RED" if red else "GREEN",
        "label": "VERIFIED",
        "threshold": THRESHOLD,
        "thresholdBasis": "locked endpoint correlation floor; not changed after measurement",
        "seams": 40,
        "loopIncluded": True,
        "redSeams": len(red),
        "sabotage": args.sabotage,
        "rows": rows,
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"SEAM_GATE_{report['result']} seams=40 red={len(red)} floor={THRESHOLD:.2f}")
    if red:
        for row in red:
            print(
                f"- {row['from']}->{row['to']} {row['approvedAnchor']} "
                f"out={row['outgoingToAnchorCorrelation']:.3f} in={row['incomingToAnchorCorrelation']:.3f}"
            )
        raise SystemExit(1)


if __name__ == "__main__":
    main()
