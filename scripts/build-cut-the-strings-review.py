from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


INTAKE = Path(
    r"C:\Users\GAMING\.codex\visualizations\2026\08\21"
    r"\01a024df-35f2-7a90-af90-81b5a20a300e\cut-the-strings\intake"
)
CONTEST = INTAKE / "final-cut" / "contest"
PICKS = INTAKE / "final-cut" / "take-picks.json"
ROOT = Path(r"C:\Users\GAMING\Downloads\cut-the-strings-review")
REVIEW = ROOT / "REVIEW"
IMAGES = REVIEW / "blind"
MANIFEST = REVIEW / "takes.manifest.json"
PICK_IS_A = {"CTS-A-009", "CTS-A-014", "CTS-A-020", "CTS-A-031"}


def crop_blind(source: Path, target: Path) -> None:
    with Image.open(source) as image:
        # The instrument label occupies the first 72 pixels. Remove it so the
        # owner sees only the same sixteen timed frames under neutral A/B labels.
        blind = image.convert("RGB").crop((0, 72, image.width, image.height))
        blind.save(target, "JPEG", quality=92, optimize=True)


def main() -> None:
    picks = json.loads(PICKS.read_text(encoding="utf-8"))["picks"]
    REVIEW.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)
    images: dict[str, str] = {}
    pairs: dict[str, dict] = {}
    questions: list[dict] = []
    blind_key = []
    for row in picks:
        clip = row["clip"]
        number = clip.removeprefix("CTS-A-")
        pick, runner = row["pick"], row["runnerUp"]
        order = (pick, runner) if clip in PICK_IS_A else (runner, pick)
        side_by_take = {take: side for take, side in zip(order, ("A", "B"))}
        for side, take in zip(("A", "B"), order):
            key = f"slot{number}_{side.lower()}"
            target = IMAGES / f"slot-{number}-{side}.jpg"
            crop_blind(CONTEST / f"{clip}-{take}-16.jpg", target)
            images[key] = str(target)
        pair_id = f"slot_{number}"
        pairs[pair_id] = {
            "left": {"img": f"slot{number}_a", "label": "A"},
            "right": {"img": f"slot{number}_b", "label": "B"},
            "diff": False,
        }
        intent = f"slot_{number}_take"
        pick_side = side_by_take[pick]
        runner_side = side_by_take[runner]
        questions.extend(
            [
                {
                    "id": f"q_{number}_solid", "intent": intent, "type": "single", "pair": pair_id,
                    "view": "normal",
                    "text": f"Slot {number}: Which one is SOLID — no ghost, no double body, no fade?",
                    "choices": [
                        {"id": "A", "label": "A is solid", "score": 1 if pick_side == "A" else -1},
                        {"id": "B", "label": "B is solid", "score": 1 if pick_side == "B" else -1},
                        {"id": "same", "label": "Same solidity", "score": 0},
                    ],
                    "unsure": True,
                },
                {
                    "id": f"q_{number}_ghost", "intent": intent, "type": "single", "pair": pair_id,
                    "view": "ab", "reverse": True,
                    "text": f"Slot {number}: Which one has a GHOST or a second body?",
                    "choices": [
                        {"id": "A", "label": "A has the ghost", "score": 1 if runner_side == "A" else -1},
                        {"id": "B", "label": "B has the ghost", "score": 1 if runner_side == "B" else -1},
                        {"id": "neither", "label": "Neither has one", "score": 0},
                    ],
                    "unsure": True,
                },
                {
                    "id": f"q_{number}_mark", "intent": intent, "type": "mark", "pair": pair_id,
                    "panel": "both", "view": "normal",
                    "text": f"Slot {number}: Mark the ghost, fade, or second body anywhere in A or B.",
                    "none_label": "Nothing to mark",
                },
            ]
        )
        blind_key.append(
            {
                "clip": clip, "A": order[0], "B": order[1], "pick": pick,
                "runnerUp": runner, "pickSide": pick_side,
            }
        )

    questions.append(
        {
            "id": "q_overall", "intent": "whole_film", "type": "single",
            "text": "The whole film now:",
            "choices": [
                {"id": "finished", "label": "Finished", "score": 1},
                {"id": "almost", "label": "Almost", "score": 0.5},
                {"id": "not_yet", "label": "Not yet", "score": -1},
            ],
            "unsure": True,
        }
    )
    manifest = {
        "sheet_id": "cut-the-strings-takes-v1",
        "job": "CUT THE STRINGS",
        "tag": "takes",
        "title": "CUT THE STRINGS — final take review",
        "intro": "Eight blind A/B comparisons. Judge only what you see. Same and I can't tell are always valid.",
        "answers_dir": str(REVIEW),
        "images": images,
        "pairs": pairs,
        "questions": questions,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    (INTAKE / "final-cut" / "review-blind-key.json").write_text(
        json.dumps({"schema": "cut-the-strings-review-blind-key/v1", "rows": blind_key}, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"REVIEW_MANIFEST_GREEN pairs={len(pairs)} questions={len(questions)} path={MANIFEST}")


if __name__ == "__main__":
    main()
