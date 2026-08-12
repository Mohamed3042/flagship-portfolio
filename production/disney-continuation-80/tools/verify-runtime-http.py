#!/usr/bin/env python3
"""Verify Disney runtime HTML and byte-range delivery against a real HTTP server."""

from __future__ import annotations

import argparse
import concurrent.futures
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin


def request(url: str, method: str = "GET", headers: dict[str, str] | None = None):
    req = urllib.request.Request(url, method=method, headers=headers or {})
    return urllib.request.urlopen(req, timeout=20)


def check_clip(media_base: str, local: Path, number: int) -> tuple[int, list[str]]:
    name = f"DSN2-{number:03d}.mp4"
    url = urljoin(media_base.rstrip("/") + "/", f"disney2/clips/{name}")
    failures: list[str] = []
    if not local.is_file():
        return number, [f"{name}: missing local file {local}"]
    size = local.stat().st_size
    try:
        with request(url, "HEAD") as response:
            if response.status != 200:
                failures.append(f"HEAD status {response.status}")
            if response.headers.get_content_type() != "video/mp4":
                failures.append(f"MIME {response.headers.get('Content-Type')}")
            if response.headers.get("Accept-Ranges", "").lower() != "bytes":
                failures.append(f"Accept-Ranges {response.headers.get('Accept-Ranges')!r}")
            if int(response.headers.get("Content-Length", -1)) != size:
                failures.append(f"Content-Length {response.headers.get('Content-Length')} != {size}")
    except Exception as error:  # network errors belong in the gate report
        return number, [f"{name}: HEAD failed: {error}"]

    ranges = ((0, min(1023, size - 1)), (max(0, size - 1024), size - 1))
    for start, end in ranges:
        try:
            with request(url, headers={"Range": f"bytes={start}-{end}"}) as response:
                payload = response.read()
                expected_range = f"bytes {start}-{end}/{size}"
                if response.status != 206:
                    failures.append(f"range {start}-{end} status {response.status}")
                if response.headers.get("Content-Range") != expected_range:
                    failures.append(
                        f"range {start}-{end} Content-Range {response.headers.get('Content-Range')!r}"
                    )
                if len(payload) != end - start + 1:
                    failures.append(f"range {start}-{end} bytes {len(payload)}")
        except urllib.error.HTTPError as error:
            failures.append(f"range {start}-{end} HTTP {error.code}")
        except Exception as error:
            failures.append(f"range {start}-{end} failed: {error}")
    return number, [f"{name}: {failure}" for failure in failures]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", required=True, help="Server root, e.g. http://127.0.0.1:4610/")
    parser.add_argument(
        "--media-base-url",
        help="Media host root; defaults to <base-url>/worlds/ for local verification.",
    )
    parser.add_argument("--root", required=True, type=Path, help="Local public directory")
    parser.add_argument("--page", default="worlds/disney.html")
    parser.add_argument("--media-only", action="store_true")
    parser.add_argument("--allow-pending", action="store_true", help="Allow DSN2-080 to be absent")
    args = parser.parse_args()
    media_base_url = args.media_base_url or urljoin(args.base_url.rstrip("/") + "/", "worlds/")

    failures: list[str] = []
    if not args.media_only:
        page_url = urljoin(args.base_url.rstrip("/") + "/", args.page.lstrip("/"))
        try:
            with request(page_url) as response:
                markup = response.read().decode("utf-8")
            clips = re.findall(r'data-clip="disney2/clips/(DSN2-\d{3}\.mp4)"', markup)
            posters = re.findall(r'data-poster="disney2/posters/(kf-\d{2,3}\.jpg)"', markup)
            expected_clips = [f"DSN2-{number:03d}.mp4" for number in range(1, 101)]
            expected_posters = [f"kf-{number:02d}.jpg" for number in range(1, 101)]
            if args.allow_pending:
                allowed_clip_manifests = [expected_clips[:20], expected_clips[:79] + expected_clips[80:]]
                allowed_poster_manifests = [expected_posters[:20], expected_posters[:79] + expected_posters[80:]]
                if clips not in allowed_clip_manifests:
                    failures.append(f"pending page clip manifest is not current-20 or staged-99 (count={len(clips)})")
                if posters not in allowed_poster_manifests:
                    failures.append(f"pending page poster manifest is not current-20 or staged-99 (count={len(posters)})")
            else:
                if clips != expected_clips:
                    failures.append(f"page clip manifest is not exact 001..100 (count={len(clips)})")
                if posters != expected_posters:
                    failures.append(f"page poster manifest is not exact 01..100 (count={len(posters)})")
            if markup.count("<video muted playsinline") != 2:
                failures.append("page does not mount exactly two film videos")
            if not args.allow_pending and ".film{ height:9100vh;" not in markup:
                failures.append("page runway is not 9100vh")
        except Exception as error:
            failures.append(f"page request failed: {error}")

    numbers = [number for number in range(1, 101) if not (args.allow_pending and number == 80)]
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
        checks = [
            executor.submit(
                check_clip,
                media_base_url,
                args.root / "worlds" / "disney2" / "clips" / f"DSN2-{number:03d}.mp4",
                number,
            )
            for number in numbers
        ]
        for future in concurrent.futures.as_completed(checks):
            _, clip_failures = future.result()
            failures.extend(clip_failures)

    pending_path = args.root / "worlds" / "disney2" / "clips" / "DSN2-080.mp4"
    if args.allow_pending and pending_path.exists():
        failures.append("allow-pending expected DSN2-080 to be absent")

    if failures:
        for failure in failures:
            print("FAIL", failure)
        return 1
    mode = "PARTIAL" if args.allow_pending else "COMPLETE"
    print(f"DISNEY_RUNTIME_HTTP_{mode}_GREEN clips={len(numbers)} head=200 ranges=206 first+last")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
