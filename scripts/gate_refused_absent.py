"""Fail closed until the four owner-refused Spotify plates are fully retired.

The same gate accepts source, built, staged Pages, and public HTML targets.  A
plate is retired only when its path is absent from the HTML and its media URL
or local file is absent (HTTP 404 for URL targets).
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


REFUSED = (
    "spotify/shots/s01-line.mp4",
    "spotify/shots/s03-room.mp4",
    "spotify/shots/s08-lanes.mp4",
    "spotify/shots/s14-chorus.mp4",
)


def is_url(value: str) -> bool:
    return urlparse(value).scheme in {"http", "https"}


def read_html(target: str) -> str:
    if is_url(target):
        request = Request(target, headers={"User-Agent": "spotify-retirement-gate/1"})
        with urlopen(request, timeout=30) as response:
            return response.read().decode("utf-8")
    return Path(target).read_text(encoding="utf-8")


def asset_state(html_target: str, asset: str) -> tuple[bool, str]:
    if is_url(html_target):
        target = urljoin(html_target, asset)
        request = Request(
            target,
            headers={"Range": "bytes=0-1", "User-Agent": "spotify-retirement-gate/1"},
        )
        try:
            with urlopen(request, timeout=30) as response:
                status = response.status
                return status != 404, f"HTTP {status}"
        except HTTPError as error:
            return error.code != 404, f"HTTP {error.code}"
        except URLError as error:
            raise RuntimeError(f"network error for {target}: {error.reason}") from error

    html = Path(html_target)
    asset_path = html.parent / asset.removeprefix("spotify/")
    exists = asset_path.is_file()
    return exists, "present" if exists else "absent"


def parse_target(value: str) -> tuple[str, str]:
    if "=" not in value:
        raise argparse.ArgumentTypeError("target must be LABEL=PATH_OR_URL")
    label, target = value.split("=", 1)
    if not label or not target:
        raise argparse.ArgumentTypeError("target must be LABEL=PATH_OR_URL")
    return label, target


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--target",
        action="append",
        required=True,
        type=parse_target,
        help="LABEL=path/to/worlds/spotify.html or LABEL=https://.../spotify.html",
    )
    args = parser.parse_args()

    total_retired = 0
    total_checks = len(args.target) * len(REFUSED)
    for label, target in args.target:
        html = read_html(target)
        retired = 0
        print(f"[{label}] {target}")
        for asset in REFUSED:
            referenced = asset in html
            available, state = asset_state(target, asset)
            clean = not referenced and not available
            retired += int(clean)
            print(
                f"  {'GREEN' if clean else 'RED'} {asset} "
                f"reference={'yes' if referenced else 'no'} asset={state}"
            )
        total_retired += retired
        if retired == len(REFUSED):
            print(f"REFUSED_ABSENT GREEN {retired}/{len(REFUSED)} [{label}]")
        else:
            print(f"REFUSED_ABSENT RED {len(REFUSED) - retired}/{len(REFUSED)} [{label}]")

    if total_retired == total_checks:
        print(f"REFUSED_ABSENT GREEN {total_retired}/{total_checks} [all targets]")
    else:
        print(f"REFUSED_ABSENT RED {total_checks - total_retired}/{total_checks} [all targets]")
    return 0 if total_retired == total_checks else 1


if __name__ == "__main__":
    sys.exit(main())
