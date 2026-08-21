#!/usr/bin/env python3
"""Fail-fast verifier for the Red Thread WAN and Grok HTML generation boards."""

from __future__ import annotations

import argparse
import json
import urllib.error
import urllib.request
from pathlib import Path


REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "public/worlds/assets/netflix/red-thread"
CSS = ROOT / "generation-board.css"
JS = ROOT / "generation-board.js"
BOARDS = {
    "wan": {
        "path": ROOT / "wan/WAN-GENERATION-BOARD.html",
        "title": "Red Thread · WAN 2.7 Generation Board",
        "manifest": "wan-5s-run-manifest.json",
        "cross": "../grok/GROK-IMAGINE-2-GENERATION-BOARD.html",
        "url": "/worlds/assets/netflix/red-thread/wan/WAN-GENERATION-BOARD.html",
        "manifest_path": ROOT / "wan/wan-5s-run-manifest.json",
    },
    "grok": {
        "path": ROOT / "grok/GROK-IMAGINE-2-GENERATION-BOARD.html",
        "title": "Red Thread · Grok Imagine 2.0 Generation Board",
        "manifest": "grok-15s-run-manifest.json",
        "cross": "../wan/WAN-GENERATION-BOARD.html",
        "url": "/worlds/assets/netflix/red-thread/grok/GROK-IMAGINE-2-GENERATION-BOARD.html",
        "manifest_path": ROOT / "grok/grok-15s-run-manifest.json",
    },
}


def check_runtime(base_url: str, route: str, title: str, errors: list[str]) -> dict:
    url = base_url.rstrip("/") + route
    result = {"url": url, "status": 0, "bytes": 0, "titleFound": False}
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            body = response.read().decode("utf-8")
            result["status"] = response.status
            result["bytes"] = len(body.encode("utf-8"))
            result["titleFound"] = f"<title>{title}</title>" in body
            if response.status != 200:
                errors.append(f"{url}: HTTP {response.status}")
            if not result["titleFound"]:
                errors.append(f"{url}: expected title missing")
    except (urllib.error.URLError, TimeoutError) as exc:
        errors.append(f"{url}: runtime request failed: {exc}")
    return result


def verify(report_path: Path | None, base_url: str | None) -> int:
    errors: list[str] = []
    board_rows: dict[str, dict] = {}

    for asset, required in (
        (CSS, [".masthead", ".card", ".copy", "@media"]),
        (JS, ["fetch(", "navigator.clipboard", "localStorage", "renderCard"]),
    ):
        if not asset.is_file():
            errors.append(f"missing shared asset: {asset.relative_to(REPO)}")
            continue
        text = asset.read_text(encoding="utf-8")
        for token in required:
            if token not in text:
                errors.append(f"{asset.name}: required token missing: {token}")

    for provider, contract in BOARDS.items():
        path = contract["path"]
        row = {"exists": path.is_file(), "manifestShots": 0, "runtime": None}
        if not path.is_file():
            errors.append(f"{provider}: missing HTML board: {path.relative_to(REPO)}")
        else:
            body = path.read_text(encoding="utf-8")
            required = [
                f"<title>{contract['title']}</title>",
                f'data-provider="{provider}"',
                f'data-manifest="{contract["manifest"]}"',
                contract["cross"],
                '../generation-board.css',
                '../generation-board.js',
                'id="cards"',
                'id="act-filters"',
                'id="continue"',
            ]
            for token in required:
                if token not in body:
                    errors.append(f"{provider}: required HTML token missing: {token}")
        manifest = json.loads(contract["manifest_path"].read_text(encoding="utf-8"))
        row["manifestShots"] = len(manifest.get("shots", []))
        if row["manifestShots"] != 8:
            errors.append(f"{provider}: manifest shot count {row['manifestShots']} != 8")
        if base_url:
            row["runtime"] = check_runtime(base_url, contract["url"], contract["title"], errors)
        board_rows[provider] = row

    report = {
        "schema": "netflix-red-thread-html-boards-qa/v1",
        "status": "RED" if errors else "GREEN",
        "errors": errors,
        "boards": board_rows,
    }
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if errors:
        print("RED_RED_THREAD_HTML_BOARDS")
        for error in errors:
            print(f"  {error}")
        return 1
    print("GREEN_RED_THREAD_HTML_BOARDS 2/2 HTML boards; 8 WAN + 8 Grok jobs")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", type=Path)
    parser.add_argument("--base-url")
    args = parser.parse_args()
    return verify(args.report, args.base_url)


if __name__ == "__main__":
    raise SystemExit(main())
