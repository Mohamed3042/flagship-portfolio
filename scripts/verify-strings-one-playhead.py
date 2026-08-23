#!/usr/bin/env python3
"""Rendered gate for the one-stage, one-playhead scroll-film contract."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

from playwright.sync_api import BrowserContext, Page, TimeoutError, sync_playwright


REPO = Path(__file__).resolve().parents[1]
DEFAULT_REPORT = REPO / "public/worlds/assets/strings/review"
ACADEMY_SCROLL_VIEWPORTS_PER_SECOND = 15 / 70
VIEWPORTS = (
    ("desktop", 1440, 1000, 1, False),
    ("portrait", 390, 844, 3, True),
    ("landscape", 844, 390, 3, True),
)


class Gate:
    def __init__(self, label: str) -> None:
        self.label = label
        self.checks: list[dict[str, object]] = []
        self.failures: list[str] = []

    def check(self, name: str, passed: bool, detail: object) -> None:
        self.checks.append({"name": name, "pass": bool(passed), "detail": detail})
        if not passed:
            self.failures.append(f"{name}: {detail}")


def install_instruments(context: BrowserContext) -> None:
    context.add_init_script(
        """(() => {
          const nativePlay = HTMLMediaElement.prototype.play;
          window.__onePlayheadPlayAttempts = 0;
          HTMLMediaElement.prototype.play = function() {
            window.__onePlayheadPlayAttempts += 1;
            return nativePlay.call(this);
          };
        })();"""
    )


def observe(page: Page, errors: dict[str, list[str]]) -> None:
    page.on(
        "console",
        lambda message: errors["console"].append(message.text)
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: errors["page"].append(str(error)))
    page.on(
        "requestfailed",
        lambda request: errors["request"].append(
            f"{request.url} :: {request.failure or 'failed'}"
        ),
    )


def open_page(context: BrowserContext, url: str, errors: dict[str, list[str]]) -> Page:
    page = context.new_page()
    observe(page, errors)
    response = page.goto(url, wait_until="domcontentloaded", timeout=60_000)
    if not response or not response.ok:
        raise RuntimeError(f"page HTTP {response.status if response else 'none'}")
    page.evaluate("document.documentElement.style.scrollBehavior='auto'")
    return page


def structure(page: Page, selector: str) -> dict[str, object]:
    return page.evaluate(
        """selector => {
          const films = [...document.querySelectorAll(selector)];
          const film = films[0] || null;
          const clips = film ? [...film.querySelectorAll('figure[data-clip]')] : [];
          const videos = film ? [...film.querySelectorAll('video')] : [];
          const stage = film ? film.querySelector('.stage') : null;
          const picture = film ? film.querySelector('.film-frame') : null;
          const visibleOverlays = picture ? [...picture.querySelectorAll('*')].filter(el => {
            if (el.matches('video,img')) return false;
            const cs = getComputedStyle(el), r = el.getBoundingClientRect();
            return cs.display !== 'none' && cs.visibility !== 'hidden' &&
              parseFloat(cs.opacity || '1') > .02 && r.width > 1 && r.height > 1;
          }).map(el => el.className || el.tagName) : [];
          return {
            filmStages: films.length,
            stageCount: film ? film.querySelectorAll(':scope > .stage').length : 0,
            videos: videos.length,
            clips: clips.map(el => ({
              id: el.dataset.sourceId || '',
              clip: el.dataset.clip || '',
              poster: el.dataset.poster || '',
            })),
            perSlotPins: document.querySelectorAll('[data-slot], section[id^="slot-"]').length,
            pinnedScenes: document.querySelectorAll('section[data-scene="pin"]').length,
            filmFrames: film ? film.querySelectorAll('.film-frame').length : 0,
            visibleOverlays,
            stage: stage ? true : false,
            picture: picture ? true : false,
            runway: film && stage ? {
              spanPx: Math.max(0, film.offsetHeight - innerHeight),
              viewportHeight: innerHeight,
            } : null,
          };
        }""",
        selector,
    )


def range_checks(context: BrowserContext, page_url: str, clips: list[dict[str, str]]) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for clip in clips:
        url = urljoin(page_url, clip["clip"])
        response = context.request.get(url, headers={"Range": "bytes=0-63"}, timeout=30_000)
        content_range = response.headers.get("content-range", "")
        passed = response.status == 206 and content_range.startswith("bytes 0-63/")
        rows.append(
            {
                "clip": clip["id"],
                "url": url,
                "status": response.status,
                "contentRange": content_range,
                "acceptRanges": response.headers.get("accept-ranges", ""),
                "pass": passed,
            }
        )
        response.dispose()
    return rows


def scroll_to_progress(page: Page, selector: str, progress: float) -> None:
    page.locator(selector).evaluate(
        """(scene, progress) => {
          const top = scene.getBoundingClientRect().top + scrollY;
          const span = Math.max(1, scene.offsetHeight - innerHeight);
          scrollTo({top: top + span * progress, behavior: 'auto'});
        }""",
        progress,
    )
    page.wait_for_function(
        """arg => {
          const scene = document.querySelector(arg.selector);
          const p = parseFloat(scene?.style.getPropertyValue('--p') || '-1');
          return Math.abs(p - arg.progress) <= .003;
        }""",
        arg={"selector": selector, "progress": progress},
        timeout=10_000,
    )


def sample_state(page: Page, selector: str, clip_ids: list[str]) -> dict[str, object]:
    return page.evaluate(
        """arg => {
          const scene = document.querySelector(arg.selector);
          const stage = scene.querySelector('.stage');
          const frame = scene.querySelector('.film-frame');
          const videos = [...scene.querySelectorAll('video')];
          const active = scene.querySelector('video.on') || videos.find(video =>
            parseFloat(getComputedStyle(video).opacity || '0') > .5
          ) || null;
          const clipPath = active?.dataset.clip || scene.dataset.currentClip || active?.currentSrc || '';
          const sourceId = active?.dataset.sourceId || scene.dataset.currentSource || '';
          let index = arg.clipIds.indexOf(sourceId);
          if (index < 0) index = arg.clipIds.findIndex(id => clipPath.includes(id));
          const time = Number(active?.currentTime || 0);
          const api = window.CTS_ONE_PLAYHEAD?.snapshot?.();
          const stageRect = stage.getBoundingClientRect();
          const frameRect = frame.getBoundingClientRect();
          const visibleVideos = videos.filter(video => {
            const cs = getComputedStyle(video), r = video.getBoundingClientRect();
            return cs.display !== 'none' && cs.visibility !== 'hidden' &&
              parseFloat(cs.opacity || '0') > .5 && r.width > 1 && r.height > 1;
          }).length;
          const overlays = [...frame.querySelectorAll('*')].filter(el => {
            if (el.matches('video,img')) return false;
            const cs = getComputedStyle(el), r = el.getBoundingClientRect();
            return cs.display !== 'none' && cs.visibility !== 'hidden' &&
              parseFloat(cs.opacity || '1') > .02 && r.width > 1 && r.height > 1;
          }).map(el => el.className || el.tagName);
          return {
            progress: Number(api?.progress ?? (scene.style.getPropertyValue('--journey') || scene.style.getPropertyValue('--p') || 0)),
            index,
            sourceId,
            clipPath,
            currentTime: Number(api?.currentTime ?? time),
            globalTime: Number(api?.globalTime ?? (Math.max(0, index) * 5 + Math.min(5, time))),
            duration: Number(active?.duration || 0),
            paused: active ? active.paused : null,
            seeking: active ? active.seeking : null,
            readyState: active ? active.readyState : 0,
            visibleVideos,
            overlays,
            stageRect: [stageRect.left, stageRect.top, stageRect.width, stageRect.height],
            frameRect: [frameRect.left, frameRect.top, frameRect.width, frameRect.height],
            viewport: [innerWidth, innerHeight],
          };
        }""",
        {"selector": selector, "clipIds": clip_ids},
    )


def trace(
    page: Page,
    selector: str,
    clip_ids: list[str],
    samples: int,
    reverse: bool,
    settle_ms: int,
) -> list[dict[str, object]]:
    progress_values = [0.001 + 0.998 * index / (samples - 1) for index in range(samples)]
    if reverse:
        progress_values.reverse()
    rows: list[dict[str, object]] = []
    last_index = -1
    for progress in progress_values:
        scroll_to_progress(page, selector, progress)
        page.wait_for_timeout(settle_ms)
        state = sample_state(page, selector, clip_ids)
        if state["index"] != last_index or state["readyState"] < 1:
            try:
                page.wait_for_function(
                    """arg => {
                      const scene = document.querySelector(arg.selector);
                      const active = scene.querySelector('video.on');
                      return active && active.readyState >= 1 && !active.seeking;
                    }""",
                    arg={"selector": selector},
                    timeout=20_000,
                )
            except TimeoutError:
                pass
            state = sample_state(page, selector, clip_ids)
        last_index = int(state["index"])
        rows.append(state)
    page.wait_for_timeout(700)
    rows[-1] = sample_state(page, selector, clip_ids)
    return rows


def grade_trace(rows: list[dict[str, object]], runtime: float, reverse: bool) -> dict[str, object]:
    times = [float(row["globalTime"]) for row in rows]
    directed = [-value for value in times] if reverse else times
    deltas = [right - left for left, right in zip(directed, directed[1:])]
    stage = rows[0]["stageRect"]
    max_stage_drift = max(
        max(abs(float(a) - float(b)) for a, b in zip(stage, row["stageRect"]))
        for row in rows
    )
    holds = 0
    longest_hold = 0
    for delta in deltas:
        if delta < 0.02:
            holds += 1
            longest_hold = max(longest_hold, holds)
        else:
            holds = 0
    expected_step = runtime / max(1, len(rows) - 1)
    monotonic = min(deltas, default=0) >= -0.08
    continuous = max(deltas, default=0) <= expected_step * 5 + 0.35
    one_picture = all(row["visibleVideos"] == 1 for row in rows)
    paused = all(row["paused"] is True for row in rows)
    no_overlays = all(not row["overlays"] for row in rows)
    indices = [int(row["index"]) for row in rows]
    return {
        "samples": len(rows),
        "reverse": reverse,
        "startGlobalTime": times[0],
        "endGlobalTime": times[-1],
        "minDirectedDelta": min(deltas, default=0),
        "maxDirectedDelta": max(deltas, default=0),
        "longestHoldSamples": longest_hold,
        "maxStageDriftPx": max_stage_drift,
        "minClipIndex": min(indices),
        "maxClipIndex": max(indices),
        "monotonic": monotonic,
        "continuous": continuous,
        "onePicture": one_picture,
        "paused": paused,
        "noPictureOverlays": no_overlays,
        "pass": monotonic and continuous and one_picture and paused and max_stage_drift <= 1.25,
        "rows": rows,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--label", required=True)
    parser.add_argument("--profile", choices=("strings", "academy"), required=True)
    parser.add_argument("--film-selector", default="#strings-reel")
    parser.add_argument("--expected-clips", type=int, required=True)
    parser.add_argument("--runtime", type=float, required=True)
    parser.add_argument("--samples", type=int, default=401)
    parser.add_argument("--settle-ms", type=int, default=45)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_REPORT)
    args = parser.parse_args()
    if args.samples < 400:
        raise SystemExit("samples must be >= 400")

    gate = Gate(args.label)
    errors = {"console": [], "page": [], "request": []}
    report: dict[str, object] = {
        "schema": "strings-one-playhead/v1",
        "label": args.label,
        "profile": args.profile,
        "url": args.url,
        "verifiedAtUtc": datetime.now(timezone.utc).isoformat(),
    }
    args.output_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            context = browser.new_context(viewport={"width": 1440, "height": 1000})
            install_instruments(context)
            page = open_page(context, args.url, errors)
            info = structure(page, args.film_selector)
            report["structure"] = info
            clips = info["clips"]
            ordered = len({clip["clip"] for clip in clips}) == len(clips)
            if args.profile == "strings":
                ordered = ordered and [clip["id"] for clip in clips] == [
                    f"CTS-A-{index:03d}" for index in range(1, 41)
                ]
            gate.check("exactly one film stage", info["filmStages"] == 1 and info["stageCount"] == 1, info)
            gate.check("double buffer only", 2 <= info["videos"] <= 3, info["videos"])
            gate.check("ordered clip chain", len(clips) == args.expected_clips and ordered, len(clips))
            gate.check("one film frame", info["filmFrames"] == 1, info["filmFrames"])
            gate.check("no per-slot pins", info["perSlotPins"] == 0, info["perSlotPins"])
            gate.check("zero visible overlays in picture", not info["visibleOverlays"], info["visibleOverlays"])
            if args.profile == "strings":
                gate.check("opening film closing only", info["pinnedScenes"] == 3, info["pinnedScenes"])
                runway = info["runway"] or {"spanPx": 0, "viewportHeight": 1}
                measured = runway["spanPx"] / runway["viewportHeight"] / args.runtime
                gate.check(
                    "Academy px-per-second runway",
                    abs(measured - ACADEMY_SCROLL_VIEWPORTS_PER_SECOND) <= 0.005,
                    {"measuredViewportPerSecond": measured, "academy": ACADEMY_SCROLL_VIEWPORTS_PER_SECOND},
                )

            if gate.failures:
                report.update({"result": "RED", "checks": gate.checks, "errors": errors})
            else:
                ranges = range_checks(context, args.url, clips)
                report["ranges"] = ranges
                gate.check("all clips return HTTP 206", all(row["pass"] for row in ranges), f"{sum(row['pass'] for row in ranges)}/{len(ranges)}")
                clip_ids = [clip["id"] for clip in clips]
                forward = grade_trace(
                    trace(page, args.film_selector, clip_ids, args.samples, False, args.settle_ms),
                    args.runtime,
                    False,
                )
                reverse = grade_trace(
                    trace(page, args.film_selector, clip_ids, args.samples, True, args.settle_ms),
                    args.runtime,
                    True,
                )
                report["desktopTrace"] = {"forward": forward, "reverse": reverse}
                gate.check("forward continuity", forward["pass"], {key: value for key, value in forward.items() if key != "rows"})
                gate.check("reverse continuity", reverse["pass"], {key: value for key, value in reverse.items() if key != "rows"})
                gate.check("desktop full chain coverage", forward["maxClipIndex"] == args.expected_clips - 1 and reverse["minClipIndex"] == 0, {"forward": forward["maxClipIndex"], "reverse": reverse["minClipIndex"]})
                gate.check("zero play attempts", page.evaluate("window.__onePlayheadPlayAttempts || 0") == 0, page.evaluate("window.__onePlayheadPlayAttempts || 0"))
                page.screenshot(path=str(args.output_dir / f"{args.label}-desktop-film.png"))
                context.close()

                if args.profile == "strings":
                    viewport_rows = []
                    for name, width, height, dpr, mobile in VIEWPORTS[1:]:
                        ctx = browser.new_context(
                            viewport={"width": width, "height": height},
                            screen={"width": width, "height": height},
                            device_scale_factor=dpr,
                            is_mobile=mobile,
                            has_touch=mobile,
                        )
                        install_instruments(ctx)
                        vp_page = open_page(ctx, args.url, errors)
                        scroll_to_progress(vp_page, args.film_selector, 0.5)
                        vp_page.wait_for_timeout(900)
                        state = sample_state(vp_page, args.film_selector, clip_ids)
                        row = {
                            "name": name,
                            "viewport": [width, height, dpr],
                            "state": state,
                            "overflow": vp_page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth"),
                            "playAttempts": vp_page.evaluate("window.__onePlayheadPlayAttempts || 0"),
                        }
                        row["pass"] = (
                            state["visibleVideos"] == 1
                            and not state["overlays"]
                            and state["paused"] is True
                            and row["overflow"] <= 1
                            and row["playAttempts"] == 0
                        )
                        viewport_rows.append(row)
                        vp_page.screenshot(path=str(args.output_dir / f"{args.label}-{name}-film.png"))
                        ctx.close()
                    report["phoneViewports"] = viewport_rows
                    gate.check("portrait and landscape one-picture contract", all(row["pass"] for row in viewport_rows), viewport_rows)

                gate.check("console clean", not errors["console"], errors["console"])
                gate.check("page exceptions clean", not errors["page"], errors["page"])
                gate.check("request failures clean", not errors["request"], errors["request"])
                report.update({"result": "GREEN" if not gate.failures else "RED", "checks": gate.checks, "errors": errors})
        finally:
            browser.close()

    output = args.output_dir / f"one-playhead-{args.label}.json"
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    result = report["result"]
    structure_info = report.get("structure", {})
    print(
        f"ONE_PLAYHEAD_{result} label={args.label} film_stages={structure_info.get('filmStages', 0)} "
        f"per_slot_pins={structure_info.get('perSlotPins', 0)} videos={structure_info.get('videos', 0)} "
        f"clips={len(structure_info.get('clips', []))} report={output}"
    )
    if gate.failures:
        print(f"DECISIVE {gate.failures[0]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
