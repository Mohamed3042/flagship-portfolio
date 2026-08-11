from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "shot-manifest.json"
BOARD_DIR = (
    ROOT.parents[1]
    / "public"
    / "worlds"
    / "assets"
    / "disney2"
    / "wan-production"
)
OUTPUT = BOARD_DIR / "wan-jobs.js"
LOCAL_KEYFRAME_ROOT = "../../../../../production/disney-continuation-80/keyframes"
LOCAL_PROMPT_ROOT = "../../../../../production/disney-continuation-80/prompts"
REMOTE_ROOT = (
    "https://raw.githubusercontent.com/Mohamed3042/flagship-portfolio/"
    "b61e3f878c11851f65e4f2bd4c2425fd812a44c0/"
    "production/disney-continuation-80"
)


def main() -> None:
    shots = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if [shot.get("shot") for shot in shots] != list(range(21, 101)):
        raise SystemExit("manifest must contain exact shots 21..100")

    jobs = []
    for position, shot in enumerate(shots, 1):
        number = shot["shot"]
        first_name = f"{shot['first']}.png"
        last_name = f"{shot['last']}.png"
        prompt_name = f"DSN2-{number:03d}.txt"
        jobs.append(
            {
                "id": f"DSN2-{number:03d}",
                "position": position,
                "shot": number,
                "act": shot["act"],
                "actTitle": shot["act_title"],
                "title": shot["title"],
                "output": f"DSN2-{number:03d}.mp4",
                "firstName": first_name,
                "lastName": last_name,
                "first": f"{LOCAL_KEYFRAME_ROOT}/{first_name}",
                "last": f"{LOCAL_KEYFRAME_ROOT}/{last_name}",
                "firstRemote": f"{REMOTE_ROOT}/keyframes/{first_name}",
                "lastRemote": f"{REMOTE_ROOT}/keyframes/{last_name}",
                "promptFile": f"{LOCAL_PROMPT_ROOT}/{prompt_name}",
                "prompt": shot["video_prompt"],
            }
        )

    BOARD_DIR.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(jobs, ensure_ascii=False, indent=2)
    OUTPUT.write_text(
        "// Generated from production/disney-continuation-80/shot-manifest.json\n"
        f"window.DSN2_WAN_JOBS = {payload};\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"BOARD_JOBS_BUILT {len(jobs)}/80 {OUTPUT}")


if __name__ == "__main__":
    main()
