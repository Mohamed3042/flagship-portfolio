from __future__ import annotations

import concurrent.futures
import hashlib
import json
import shutil
import subprocess
from pathlib import Path


REPO = Path(__file__).resolve().parents[1]
INTAKE = Path(
    r"C:\Users\GAMING\.codex\visualizations\2026\08\21"
    r"\01a024df-35f2-7a90-af90-81b5a20a300e\cut-the-strings\intake"
)
FINAL_CUT = INTAKE / "final-cut"
PRODUCTION = REPO / "public/worlds/assets/strings/wan-production"
RAW = PRODUCTION / "raw"
ACCEPTED = PRODUCTION / "accepted"
REJECTED = PRODUCTION / "rejected"
STANDALONE = REPO / "public/worlds/assets/strings/CUT-THE-STRINGS-FINAL.mp4"
CONTESTED = {9, 12, 14, 16, 20, 22, 31, 39}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize(row: dict) -> dict:
    clip = row["clip"]
    source = Path(row["sourcePath"])
    output = ACCEPTED / f"{clip}.mp4"
    video_filter = (
        "[0:v]fps=30,crop=1174:660:50:0,scale=1280:720:flags=lanczos,split=2[main][end];"
        "[main]trim=end_frame=135,setpts=PTS-STARTPTS[head];"
        "[end]trim=start_frame=149:end_frame=150,setpts=PTS-STARTPTS,"
        "tpad=stop_mode=clone:stop_duration=0.466667[tail];"
        "[head][tail]concat=n=2:v=1:a=0[out]"
    )
    command = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-nostdin",
        "-i", str(source),
        "-filter_complex", video_filter, "-map", "[out]",
        "-an", "-frames:v", "150", "-c:v", "libx264", "-preset", "slow",
        "-crf", "16", "-pix_fmt", "yuv420p", "-g", "15", "-keyint_min", "15",
        "-sc_threshold", "0", "-movflags", "+faststart", str(output),
    ]
    subprocess.run(command, check=True)
    result = dict(row)
    result.update(
        {
            "rawCustodyPath": str((RAW / f"{clip}-{row['take']}-source.mp4").relative_to(REPO)).replace("\\", "/"),
            "acceptedPath": str(output.relative_to(REPO)).replace("\\", "/"),
            "acceptedSha256": sha256(output),
            "normalization": (
                "crop source x=50,y=0,w=1174,h=660; Lanczos 1280x720; "
                "H.264 yuv420p; 30 fps; 150 frames; silent; final 0.5 s frozen from the measured final endpoint; "
                "GOP 15; fast-start"
            ),
        }
    )
    print(f"NORMALIZED {clip} {row['take']}", flush=True)
    return result


def main() -> None:
    ledger = json.loads((FINAL_CUT / "hash-ledger-56.json").read_text(encoding="utf-8"))
    picks_doc = json.loads((FINAL_CUT / "take-picks.json").read_text(encoding="utf-8"))
    picks = {row["clip"]: row for row in picks_doc["picks"]}
    by_key = {(row["clip"], row["take"]): row for row in ledger["files"]}

    selected = []
    for number in range(1, 41):
        clip = f"CTS-A-{number:03d}"
        take = picks[clip]["pick"] if number in CONTESTED else "R1"
        source = dict(by_key[(clip, take)])
        eye = picks.get(clip)
        source.update(
            {
                "selectionStatus": "BEST_OF_THREE" if eye else "SOLE_RETURN",
                "eyeVerdict": eye["eyeVerdict"] if eye else "GREEN_UNCONTESTED",
                "reason": eye["reason"] if eye else "Only submitted return for this slot.",
                "defect": eye["defect"] if eye else None,
                "runnerUp": eye["runnerUp"] if eye else None,
            }
        )
        selected.append(source)

    for directory in (RAW, ACCEPTED, REJECTED):
        directory.mkdir(parents=True, exist_ok=True)

    # Copy custody bytes; source downloads remain untouched.
    for row in selected:
        source = Path(row["sourcePath"])
        target = RAW / f"{row['clip']}-{row['take']}-source.mp4"
        shutil.copy2(source, target)
        if sha256(target) != row["sha256"]:
            raise RuntimeError(f"custody hash mismatch: {target}")

    rejected_rows = []
    for number in sorted(CONTESTED):
        clip = f"CTS-A-{number:03d}"
        chosen = next(row for row in selected if row["clip"] == clip)
        for take in ("R1", "R2a", "R2b"):
            if take == chosen["take"]:
                continue
            source = by_key[(clip, take)]
            target = REJECTED / f"{clip}-{take}.mp4"
            shutil.copy2(source["sourcePath"], target)
            if sha256(target) != source["sha256"]:
                raise RuntimeError(f"rejected hash mismatch: {target}")
            rejected_rows.append(
                {
                    "clip": clip,
                    "take": take,
                    "path": str(target.relative_to(REPO)).replace("\\", "/"),
                    "sha256": source["sha256"],
                    "disposition": "not selected after three-way instrument and eye comparison",
                }
            )

    normalized_by_clip: dict[str, dict] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = [executor.submit(normalize, row) for row in selected]
        for future in concurrent.futures.as_completed(futures):
            row = future.result()
            normalized_by_clip[row["clip"]] = row
    normalized = [normalized_by_clip[f"CTS-A-{number:03d}"] for number in range(1, 41)]

    concat_list = FINAL_CUT / "standalone-concat.txt"
    concat_list.write_text(
        "".join(f"file '{(ACCEPTED / f'CTS-A-{number:03d}.mp4').as_posix()}'\n" for number in range(1, 41)),
        encoding="utf-8",
    )
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-nostdin",
            "-f", "concat", "-safe", "0", "-i", str(concat_list), "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p",
            "-g", "15", "-keyint_min", "15", "-sc_threshold", "0",
            "-movflags", "+faststart", str(STANDALONE),
        ],
        check=True,
    )

    # Re-read every oracle source and prove that custody work did not mutate it.
    changed_sources = []
    for source in ledger["files"]:
        if sha256(Path(source["sourcePath"])) != source["sha256"]:
            changed_sources.append(source["sourcePath"])

    report = {
        "schema": "cut-the-strings-custody-normalization/v1",
        "result": "GREEN" if not changed_sources else "RED",
        "sourceReturns": 56,
        "selectedMasters": 40,
        "rejectedCandidates": 16,
        "sourceMutations": changed_sources,
        "selected": normalized,
        "rejected": rejected_rows,
        "standalone": {
            "path": str(STANDALONE.relative_to(REPO)).replace("\\", "/"),
            "sha256": sha256(STANDALONE),
        },
    }
    report_text = json.dumps(report, indent=2) + "\n"
    (FINAL_CUT / "custody-normalization.json").write_text(report_text, encoding="utf-8")
    (PRODUCTION / "custody-normalization.json").write_text(report_text, encoding="utf-8")
    print(
        f"CUSTODY_{report['result']} raw={len(selected)} accepted={len(normalized)} "
        f"rejected={len(rejected_rows)} sourceMutations={len(changed_sources)}",
        flush=True,
    )
    if changed_sources:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
