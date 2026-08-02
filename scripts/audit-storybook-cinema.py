from __future__ import annotations

import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "images" / "storybook"
HOME = ROOT / "src" / "components" / "worlds" / "DisneyBookHome.astro"
DETAIL = ROOT / "src" / "components" / "work" / "worlds" / "DisneyProjectBook.astro"
SCENES = ROOT / "src" / "data" / "storybook-scenes.ts"

PROJECT_SLUGS = {
    "career-autopilot", "lifeos", "medmac-document-studio", "medmac-box-studio",
    "cake-studio", "quotations-locker", "reclaim", "sheep-cycle",
    "resume-builder-skill", "polyblast-arena", "petpoint-ops-hub", "relayops",
    "statement-styler", "meta-ads", "al-maali", "crm", "brand-system",
    "sheep-app", "hr-system", "medmac-website", "ai-workflow", "my-resume",
    "spaceframe-world", "b2mh", "artillery3d", "war-strikes",
    "uberstrike-restoration", "cocolani-3d", "job-apply-engine",
    "portfolio-design-system",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    files = sorted(ASSETS.glob("*.webp"))
    require(len(files) == 31, f"expected 31 storybook WebP assets, found {len(files)}")
    require((ASSETS / "opening-book.webp").exists(), "opening book art is missing")
    project_files = {path.stem for path in files if path.stem != "opening-book"}
    require(project_files == PROJECT_SLUGS, f"project art mismatch: {sorted(PROJECT_SLUGS ^ project_files)}")
    digests = {hashlib.sha256(path.read_bytes()).hexdigest() for path in files}
    require(len(digests) == 31, "storybook art contains duplicate files")

    home = HOME.read_text(encoding="utf-8")
    detail = DETAIL.read_text(encoding="utf-8")
    combined = home + detail
    for banned in ("ProjectKinetic", "db-scene-arch", "db-scene-front", "dpb-scene-back", "dpb-pop-architecture"):
        require(banned not in combined, f"legacy repeated visual remains: {banned}")
    require("data-story-panorama" in home, "home lacks scroll panoramas")
    require("data-story-beat=\"problem\"" in home, "home lacks a human problem beat")
    require("data-story-beat=\"intervention\"" in home, "home lacks an intervention beat")
    require("data-story-beat=\"outcome\"" in home, "home lacks an outcome beat")
    require("data-book-film" in home, "home lacks the connected opening book film")
    require("data-project-film" in detail, "detail pages lack project-specific film")

    scenes = SCENES.read_text(encoding="utf-8")
    for slug in PROJECT_SLUGS:
        require(f"'{slug}'" in scenes, f"missing art direction for {slug}")
    entries = re.findall(r"^\s{2}'[^']+': \{ image:.*transition:", scenes, re.MULTILINE)
    require(len(entries) == 30, f"every project must declare one image and transition, found {len(entries)}")
    transitions = re.findall(r"transition: '([^']+)'", scenes)
    require(len(transitions) == 31, f"expected 30 directed transitions plus one fallback, found {len(transitions)}")
    require(len(set(transitions[:-1])) == 30, "project films reuse a transition identity")
    camera_signatures = re.findall(
        r"motion: '([^']+)', startX: (-?[\d.]+), endX: (-?[\d.]+), lift: (-?[\d.]+), zoom: ([\d.]+), tilt: (-?[\d.]+)",
        scenes,
    )
    require(len(camera_signatures) == 31, f"camera direction is incomplete: {len(camera_signatures)}")
    require(len(set(camera_signatures[:-1])) == 30, "project films reuse an identical camera move")
    print("PASS storybook cinema: 30 unique project films, art assets, transitions, and camera moves; no legacy schematics")


if __name__ == "__main__":
    main()
