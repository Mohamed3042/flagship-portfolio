#!/usr/bin/env python3
"""Custody wrapper for the rendered one-playhead verifier.

The v1 gate asserted forty independent slot pins. V2 deliberately retires
those assertions: it proves the same accepted media are present, then delegates
rendered continuity to verify-strings-one-playhead.py.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


REPO = Path(__file__).resolve().parents[1]
PUBLIC = REPO / "public"
REVIEW = PUBLIC / "worlds/assets/strings/review"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def media_root(root: Path) -> Path:
    direct = root / "worlds/assets/strings"
    return direct if direct.is_dir() else root / "flagship-portfolio/worlds/assets/strings"


def custody(root: Path) -> dict[str, object]:
    assets = media_root(root)
    masters = [assets / f"wan-production/accepted/CTS-A-{index:03d}.mp4" for index in range(1, 41)]
    keyframes = sorted((assets / "keyframes").glob("CTS-KF[0-9][0-9]-*.png"))
    final = assets / "CUT-THE-STRINGS-FINAL.mp4"
    rows = [
        {"path": str(path.relative_to(root)).replace("\\", "/"), "bytes": path.stat().st_size, "sha256": sha256(path)}
        for path in [*masters, final, *keyframes]
        if path.is_file()
    ]
    counts = {
        "acceptedMasters": sum(path.is_file() for path in masters),
        "silentMaster": int(final.is_file()),
        "coreKeyframes": len(keyframes),
        "total": len(rows),
    }
    return {
        "result": "GREEN" if counts == {"acceptedMasters": 40, "silentMaster": 1, "coreKeyframes": 41, "total": 82} else "RED",
        "counts": counts,
        "ledgerSha256": hashlib.sha256(json.dumps(rows, sort_keys=True).encode()).hexdigest(),
        "files": rows,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", required=True)
    parser.add_argument("--root", type=Path)
    parser.add_argument("--base-url")
    parser.add_argument("--port", type=int, default=4602)
    parser.add_argument("--full-scrub", action="store_true", help="Retained for CLI compatibility; V2 always runs 401 samples in both directions.")
    args = parser.parse_args()
    if bool(args.root) == bool(args.base_url):
        raise SystemExit("Provide exactly one of --root or --base-url")

    server = None
    root = args.root.resolve() if args.root else PUBLIC
    if args.root:
        server = subprocess.Popen(
            ["node", "scripts/serve-static.mjs", str(root), str(args.port)],
            cwd=REPO,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
        )
        base_url = f"http://127.0.0.1:{args.port}"
        page_path = "/worlds/strings.html" if root == PUBLIC.resolve() else "/flagship-portfolio/worlds/strings.html"
        for _ in range(80):
            try:
                urllib.request.urlopen(f"{base_url}{page_path}", timeout=1).close()
                break
            except Exception:
                time.sleep(.1)
        else:
            raise RuntimeError("Static server did not start")
    else:
        base_url = args.base_url.rstrip("/")
        page_path = "/worlds/strings.html"

    REVIEW.mkdir(parents=True, exist_ok=True)
    page_url = f"{base_url}{page_path}"
    proof_dir = REVIEW / "one-playhead-proof"
    command = [
        sys.executable,
        str(REPO / "scripts/verify-strings-one-playhead.py"),
        page_url,
        "--label", args.label,
        "--profile", "strings",
        "--film-selector", "#strings-reel",
        "--expected-clips", "40",
        "--runtime", "200",
        "--samples", "401",
        "--output-dir", str(proof_dir),
    ]
    try:
        completed = subprocess.run(command, cwd=REPO, text=True, capture_output=True, timeout=360)
    finally:
        if server:
            server.terminate()
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()

    media = custody(root) if args.root else {"result": "REMOTE", "counts": "See rendered 206 gate."}
    child_report = proof_dir / f"one-playhead-{args.label}.json"
    rendered = json.loads(child_report.read_text(encoding="utf-8")) if child_report.is_file() else {"result": "RED"}
    result = "GREEN" if completed.returncode == 0 and rendered.get("result") == "GREEN" and media.get("result") in {"GREEN", "REMOTE"} else "RED"
    report = {
        "schema": "cut-the-strings-page-proof/v2",
        "label": args.label,
        "verifiedAtUtc": datetime.now(timezone.utc).isoformat(),
        "result": result,
        "pageUrl": page_url,
        "retiredAssertion": "forty independent slot pins",
        "replacementAssertion": "one pinned film stage and one 200-second scroll playhead",
        "mediaCustody": media,
        "renderedReport": str(child_report.relative_to(REPO)).replace("\\", "/"),
        "renderedSummary": completed.stdout.strip().splitlines(),
        "renderedErrors": completed.stderr.strip().splitlines(),
        "sourceHtmlSha256": sha256(PUBLIC / "worlds/strings.html"),
        "sourcePlayTokenCount": (PUBLIC / "worlds/strings.js").read_text(encoding="utf-8").count(".play(") + (PUBLIC / "worlds/strings.html").read_text(encoding="utf-8").count(".play("),
    }
    output = REVIEW / f"page-proof-{args.label}.json"
    output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"PAGE_PROOF_{result} label={args.label} custody={media.get('result')} one_playhead={rendered.get('result')} report={output}")
    for line in completed.stdout.strip().splitlines()[-2:]:
        print(line)
    if result != "GREEN":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
