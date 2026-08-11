from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DRAFTS = ROOT / "drafts"
PROMPTS = ROOT / "prompts"
MANIFEST = ROOT / "shot-manifest.json"
RUN_MANIFEST = ROOT / "RUN-MANIFEST.csv"


def load_shots() -> list[dict]:
    shots: list[dict] = []
    for path in sorted(DRAFTS.glob("shots-*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            raise SystemExit(f"{path.name}: expected a JSON array")
        shots.extend(payload)
    shots.sort(key=lambda item: item["shot"])
    expected = list(range(21, 101))
    actual = [item["shot"] for item in shots]
    if actual != expected:
        raise SystemExit(f"shot sequence mismatch: expected 21..100, got {actual}")
    for shot in shots:
        number = shot["shot"]
        expected_first = "KF01" if number == 21 else f"KF{number - 1}"
        expected_last = f"KF{number}"
        if shot["first"] != expected_first or shot["last"] != expected_last:
            raise SystemExit(
                f"shot {number}: expected {expected_first}->{expected_last}, "
                f"got {shot['first']}->{shot['last']}"
            )
        for field in ("act", "act_title", "title", "still_prompt", "video_prompt"):
            if not str(shot.get(field, "")).strip():
                raise SystemExit(f"shot {number}: missing {field}")
        if "no text" not in shot["video_prompt"].lower():
            shot["video_prompt"] = (
                shot["video_prompt"].rstrip()
                + " No text, letters, numbers, logos, subtitles, faces or watermark."
            )
        if "no cut" not in shot["video_prompt"].lower():
            shot["video_prompt"] = shot["video_prompt"].rstrip() + " No cut."
    return shots


def write_prompt_files(shots: list[dict]) -> None:
    PROMPTS.mkdir(parents=True, exist_ok=True)
    for shot in shots:
        number = shot["shot"]
        text = (
            f"DSN2-{number:03d} | {shot['title']}\n"
            f"FIRST FRAME: keyframes/{shot['first']}.png\n"
            f"LAST FRAME: keyframes/{shot['last']}.png\n\n"
            "PROMPT\n"
            f"{shot['video_prompt'].strip()}\n"
        )
        (PROMPTS / f"DSN2-{number:03d}.txt").write_text(text, encoding="utf-8", newline="\n")


def write_run_manifest(shots: list[dict]) -> None:
    with RUN_MANIFEST.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=(
                "clip",
                "act",
                "title",
                "first",
                "last",
                "duration_seconds",
                "frames",
                "status",
                "task_id",
                "seed",
                "file",
            ),
        )
        writer.writeheader()
        for shot in shots:
            number = shot["shot"]
            writer.writerow(
                {
                    "clip": f"DSN2-{number:03d}",
                    "act": shot["act"],
                    "title": shot["title"],
                    "first": shot["first"],
                    "last": shot["last"],
                    "duration_seconds": "5.000",
                    "frames": "150",
                    "status": "reference-ready",
                    "task_id": "",
                    "seed": "",
                    "file": f"wan/DSN2-{number:03d}.mp4",
                }
            )


def main() -> None:
    shots = load_shots()
    MANIFEST.write_text(
        json.dumps(shots, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    write_prompt_files(shots)
    write_run_manifest(shots)
    print(f"PACK_BUILT {len(shots)}/80 prompts={len(list(PROMPTS.glob('DSN2-*.txt')))}")


if __name__ == "__main__":
    main()
