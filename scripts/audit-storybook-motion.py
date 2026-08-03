from __future__ import annotations

import hashlib
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "public" / "images" / "storybook"
MOTION = ROOT / "public" / "images" / "storybook-motion"
HOME = ROOT / "src" / "components" / "worlds" / "DisneyBookHome.astro"
DETAIL = ROOT / "src" / "components" / "work" / "worlds" / "DisneyProjectBook.astro"
SCENES = ROOT / "src" / "data" / "storybook-scenes.ts"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    base = {path.stem: path for path in BASE.glob("*.webp") if path.stem != "opening-book"}
    action = {path.stem.removesuffix("-action"): path for path in MOTION.glob("*-action.webp")}
    require(len(base) == 30, f"expected 30 base chapter frames, found {len(base)}")
    require(len(action) == 30, f"expected 30 character-action frames, found {len(action)}")
    require(base.keys() == action.keys(), f"base/action slug mismatch: {sorted(base.keys() ^ action.keys())}")

    action_hashes = {hashlib.sha256(path.read_bytes()).hexdigest() for path in action.values()}
    require(len(action_hashes) == 30, "character-action art contains duplicate files")
    for slug in base:
        require(base[slug].stat().st_size > 100_000, f"base frame is suspiciously small: {slug}")
        require(action[slug].stat().st_size > 100_000, f"action frame is suspiciously small: {slug}")
        require(
            hashlib.sha256(base[slug].read_bytes()).digest() != hashlib.sha256(action[slug].read_bytes()).digest(),
            f"action frame does not change the actor: {slug}",
        )
        with Image.open(base[slug]) as base_image, Image.open(action[slug]) as action_image:
            require(base_image.size == action_image.size,
                    f"action frame breaks registration for {slug}: {base_image.size} != {action_image.size}")

    scenes = SCENES.read_text(encoding="utf-8")
    require("actionImage: `/images/storybook-motion/${project.slug}-action.webp`" in scenes,
            "scene data does not derive each project's paired action frame")
    declared_slugs = set(re.findall(r"^\s{2}'([^']+)':", scenes, re.MULTILINE))
    require(declared_slugs == set(base), "scene data does not map every project to its action frame")

    home = HOME.read_text(encoding="utf-8")
    detail = DETAIL.read_text(encoding="utf-8")
    for label, source in (("home", home), ("detail", detail)):
        require("data-character-action" in source, f"{label} has no character-action layer")
        require("data-action-frame" in source, f"{label} exposes no rendered action frame")
        require("--action-p" in source, f"{label} does not scrub character motion with scroll")
        require("scene.actionImage" in source, f"{label} does not render project-specific action art")

    print("PASS storybook motion: 30 paired action frames, unique actor changes, and scroll-scrubbed home/detail layers")


if __name__ == "__main__":
    main()
