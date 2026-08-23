from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import time
import urllib.request
from pathlib import Path

from playwright.sync_api import Page, sync_playwright


REPO = Path(__file__).resolve().parents[1]
PUBLIC = REPO / "public"
REVIEW = PUBLIC / "worlds/assets/strings/review"
VIEWPORTS = (
    {"name": "desktop", "width": 1440, "height": 1000, "dpr": 1},
    {"name": "portrait", "width": 390, "height": 844, "dpr": 3},
    {"name": "landscape", "width": 844, "height": 390, "dpr": 3},
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def range_probe(url: str) -> dict:
    request = urllib.request.Request(url, headers={"Range": "bytes=0-63", "User-Agent": "CTS-final-proof"})
    with urllib.request.urlopen(request, timeout=30) as response:
        body = response.read()
        return {
            "url": url,
            "status": response.status,
            "acceptRanges": response.headers.get("Accept-Ranges"),
            "contentRange": response.headers.get("Content-Range"),
            "bytes": len(body),
            "result": "GREEN" if response.status == 206 and response.headers.get("Accept-Ranges") == "bytes" and len(body) == 64 else "RED",
        }


def browser_errors(page: Page) -> tuple[list[str], list[str], list[str]]:
    console_errors: list[str] = []
    page_errors: list[str] = []
    request_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on("requestfailed", lambda request: request_errors.append(f"{request.url} :: {request.failure or 'failed'}"))
    return console_errors, page_errors, request_errors


def traverse(page: Page) -> None:
    page.evaluate("document.documentElement.style.scrollBehavior='auto'")
    page.evaluate("window.scrollTo(0,0)")
    for number in range(1, 41):
        page.locator(f"#slot-{number:02d}").scroll_into_view_if_needed(timeout=15000)
        page.wait_for_timeout(20)
    page.locator(".epilogue").scroll_into_view_if_needed(timeout=15000)
    page.wait_for_timeout(80)
    for number in range(40, 0, -1):
        page.locator(f"#slot-{number:02d}").scroll_into_view_if_needed(timeout=15000)
        page.wait_for_timeout(20)
    page.evaluate("window.scrollTo(0,0)")


def scrub_all(page: Page) -> list[dict]:
    rows = []
    duration = 4.966
    for slot in range(1, 41):
        page.evaluate("([slot,p])=>window.CTS_SCROLL_FILM.seekSlot(slot,p)", [slot, 0])
        page.wait_for_function(
            "slot=>{const s=window.CTS_SCROLL_FILM.snapshot()[slot-1];return s&&s.decoded&&s.duration>=4.99&&!s.error}",
            arg=slot,
            timeout=20000,
        )
        times = []
        for target in (0.0, 2.5, 4.9):
            progress = target / duration
            page.evaluate("([slot,p])=>window.CTS_SCROLL_FILM.seekSlot(slot,p)", [slot, progress])
            page.wait_for_function(
                "([slot,target])=>Math.abs(window.CTS_SCROLL_FILM.snapshot()[slot-1].currentTime-target)<.06",
                arg=[slot, target],
                timeout=15000,
            )
            current = page.evaluate("slot=>window.CTS_SCROLL_FILM.snapshot()[slot-1].currentTime", slot)
            times.append(round(float(current), 4))
        before = times[-1]
        page.wait_for_timeout(180)
        after = page.evaluate("slot=>window.CTS_SCROLL_FILM.snapshot()[slot-1].currentTime", slot)
        rows.append(
            {
                "clip": f"CTS-A-{slot:03d}",
                "requested": [0.0, 2.5, 4.9],
                "observed": times,
                "ownClockDelta": round(abs(float(after) - before), 6),
                "result": "GREEN" if all(abs(value - target) < 0.06 for value, target in zip(times, (0.0, 2.5, 4.9))) and abs(float(after) - before) < 0.01 else "RED",
            }
        )
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", required=True)
    parser.add_argument("--root", type=Path)
    parser.add_argument("--base-url")
    parser.add_argument("--port", type=int, default=4602)
    parser.add_argument("--full-scrub", action="store_true")
    args = parser.parse_args()
    if bool(args.root) == bool(args.base_url):
        raise SystemExit("Provide exactly one of --root or --base-url")

    server = None
    if args.root:
        server = subprocess.Popen(
            ["node", "scripts/serve-static.mjs", str(args.root.resolve()), str(args.port)],
            cwd=REPO,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
        )
        base_url = f"http://127.0.0.1:{args.port}"
        page_path = "/worlds/strings.html" if args.root.resolve() == PUBLIC.resolve() else "/flagship-portfolio/worlds/strings.html"
        for _ in range(50):
            try:
                urllib.request.urlopen(f"{base_url}{page_path}", timeout=1).close()
                break
            except Exception:
                time.sleep(0.1)
        else:
            raise RuntimeError("Static server did not start")
    else:
        base_url = args.base_url.rstrip("/")
        page_path = "/worlds/strings.html"

    page_url = f"{base_url}{page_path}"
    media_prefix = page_url.rsplit("/worlds/strings.html", 1)[0]
    range_rows = [
        range_probe(f"{media_prefix}/worlds/assets/strings/wan-production/accepted/CTS-A-{number:03d}.mp4")
        for number in range(1, 41)
    ]
    failures = [row["url"] for row in range_rows if row["result"] != "GREEN"]
    viewport_rows = []
    scrub_rows = []
    proof_dir = REVIEW / "page-proof" / args.label
    proof_dir.mkdir(parents=True, exist_ok=True)
    try:
        with sync_playwright() as playwright:
            chrome = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
            edge = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")
            executable = chrome if chrome.exists() else edge
            browser = playwright.chromium.launch(headless=True, executable_path=str(executable))
            try:
                for viewport in VIEWPORTS:
                    context = browser.new_context(
                        viewport={"width": viewport["width"], "height": viewport["height"]},
                        device_scale_factor=viewport["dpr"],
                        reduced_motion="reduce",
                    )
                    context.add_init_script(
                        "window.__ctsPlayCalls=0;const p=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__ctsPlayCalls++;return p.call(this)};"
                    )
                    page = context.new_page()
                    console_errors, page_errors, request_errors = browser_errors(page)
                    page.goto(page_url, wait_until="domcontentloaded", timeout=60000)
                    page.wait_for_function("window.CTS_SCROLL_FILM?.slots===40", timeout=30000)
                    page.wait_for_function("document.querySelector('[data-anchor=KF00]').complete", timeout=30000)
                    page.screenshot(path=proof_dir / f"{viewport['name']}-opening.png", full_page=False)
                    traverse(page)
                    page.locator(".epilogue").scroll_into_view_if_needed()
                    page.screenshot(path=proof_dir / f"{viewport['name']}-ending.png", full_page=False)
                    if viewport["name"] == "desktop":
                        for slot in (11, 21, 31):
                            page.locator(f"#slot-{slot:02d}").scroll_into_view_if_needed()
                            page.screenshot(path=proof_dir / f"desktop-act-bridge-{slot:02d}.png", full_page=False)
                        if args.full_scrub:
                            scrub_rows = scrub_all(page)
                    overflow = page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
                    play_calls = page.evaluate("window.__ctsPlayCalls")
                    anchors = page.locator("[data-anchor]").count()
                    slots = page.locator("[data-slot]").count()
                    videos = page.locator("[data-scrub-film]").count()
                    anchor_decode_failures = page.evaluate(
                        "[...document.querySelectorAll('[data-anchor]')].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.dataset.anchor)"
                    )
                    row = {
                        "viewport": f"{viewport['width']}x{viewport['height']}@{viewport['dpr']}",
                        "slots": slots,
                        "videos": videos,
                        "anchors": anchors,
                        "anchorDecodeFailures": anchor_decode_failures,
                        "overflow": overflow,
                        "playCalls": play_calls,
                        "consoleErrors": console_errors,
                        "pageErrors": page_errors,
                        "requestErrors": request_errors,
                    }
                    row["result"] = "GREEN" if slots == 40 and videos == 40 and anchors == 41 and not anchor_decode_failures and overflow <= 1 and play_calls == 0 and not console_errors and not page_errors and not request_errors else "RED"
                    viewport_rows.append(row)
                    context.close()
            finally:
                browser.close()
    finally:
        if server:
            server.terminate()
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()

    source_page = PUBLIC / "worlds/strings.html"
    report = {
        "schema": "cut-the-strings-page-proof/v1",
        "label": args.label,
        "result": "GREEN" if not failures and all(row["result"] == "GREEN" for row in viewport_rows) and (not args.full_scrub or all(row["result"] == "GREEN" for row in scrub_rows)) else "RED",
        "pageUrl": page_url,
        "sourceHtmlSha256": sha256(source_page),
        "range": range_rows,
        "viewports": viewport_rows,
        "scrubs": scrub_rows,
        "fullScrub": args.full_scrub,
        "sourcePlayTokenCount": (PUBLIC / "worlds/strings.js").read_text(encoding="utf-8").count(".play(") + source_page.read_text(encoding="utf-8").count(".play("),
        "screenshots": sorted(str(path.relative_to(REPO)).replace("\\", "/") for path in proof_dir.glob("*.png")),
    }
    report_path = REVIEW / f"page-proof-{args.label}.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(
        f"PAGE_PROOF_{report['result']} label={args.label} ranges={sum(r['result']=='GREEN' for r in range_rows)}/40 "
        f"viewports={sum(r['result']=='GREEN' for r in viewport_rows)}/3 scrubs={sum(r['result']=='GREEN' for r in scrub_rows)}/{len(scrub_rows)}"
    )
    if report["result"] != "GREEN":
        for row in viewport_rows:
            if row["result"] != "GREEN":
                print(f"- viewport {row}")
        for row in scrub_rows:
            if row["result"] != "GREEN":
                print(f"- scrub {row}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
