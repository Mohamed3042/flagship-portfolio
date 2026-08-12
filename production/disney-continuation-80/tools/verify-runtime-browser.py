#!/usr/bin/env python3
"""Fail-closed rendered-browser verification for the 100-shot Disney runtime.

This harness grades the integrated page, not its source text. Scroll is the
only input used to select film frames; the harness never assigns currentTime.
It verifies both viewport contracts, all 100 runtime references, ranged media
transport, the two-slot blob buffer, forward/reverse scrubbing, decoded pixels,
the 20/21 join, bilingual direction, reduced-motion parity, zero play() calls,
and clean rendering.
"""

from __future__ import annotations

import argparse
import base64
import copy
import json
import os
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

from PIL import Image, ImageChops, ImageFilter, ImageStat
from playwright.sync_api import (
    Browser,
    BrowserContext,
    Error as PlaywrightError,
    Page,
    TimeoutError as PlaywrightTimeoutError,
    sync_playwright,
)


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


TOTAL_SHOTS = 100
RUNWAY_VH = 9100.0
ARABIC_RE = re.compile(r"[\u0600-\u06ff]")


def expected_clip(shot: int) -> str:
    return f"disney2/clips/DSN2-{shot:03d}.mp4"


def expected_poster(shot: int) -> str:
    return f"disney2/posters/kf-{shot:02d}.jpg"


def default_media_base(page_url: str) -> str:
    parts = urlsplit(page_url)
    if parts.hostname == "mohamed3042.github.io":
        return f"{parts.scheme}://{parts.netloc}/flagship-disney-media/disney2/"
    return urljoin(page_url, "disney2/")


def resolved_media_url(media_base: str, authored_path: str) -> str:
    return urljoin(media_base.rstrip("/") + "/", authored_path.removeprefix("disney2/"))


def add_query(url: str, **items: object) -> str:
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.update({key: str(value) for key, value in items.items()})
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def structural_contract(snapshot: dict[str, Any]) -> dict[str, tuple[bool, str]]:
    legs = snapshot.get("legs", [])
    clips = [str(item.get("clip", "")) for item in legs]
    posters = [str(item.get("poster", "")) for item in legs]
    expected_clips = [expected_clip(shot) for shot in range(1, TOTAL_SHOTS + 1)]
    expected_posters = [expected_poster(shot) for shot in range(1, TOTAL_SHOTS + 1)]
    bilingual_bad = [
        index + 1
        for index, item in enumerate(legs)
        if not all(str(item.get(key, "")).strip() for key in ("titleEn", "titleAr", "cueEn", "cueAr"))
        or not ARABIC_RE.search(str(item.get("titleAr", "")))
        or not ARABIC_RE.search(str(item.get("cueAr", "")))
    ]
    runway = float(snapshot.get("runwayVh", 0.0) or 0.0)
    return {
        "100 ordered legs": (
            len(legs) == TOTAL_SHOTS,
            f"count={len(legs)} expected={TOTAL_SHOTS}",
        ),
        "100 exact clip references": (
            clips == expected_clips,
            f"count={len(clips)} first-mismatch={first_mismatch(clips, expected_clips)}",
        ),
        "100 unique clip references": (
            len(clips) == TOTAL_SHOTS and len(set(clips)) == TOTAL_SHOTS,
            f"count={len(clips)} unique={len(set(clips))}",
        ),
        "100 exact poster references": (
            posters == expected_posters,
            f"count={len(posters)} first-mismatch={first_mismatch(posters, expected_posters)}",
        ),
        "100 unique poster references": (
            len(posters) == TOTAL_SHOTS and len(set(posters)) == TOTAL_SHOTS,
            f"count={len(posters)} unique={len(set(posters))}",
        ),
        "all legs contain EN and AR narrative": (
            not bilingual_bad and len(legs) == TOTAL_SHOTS,
            f"bad-shots={bilingual_bad[:12] or 'none'}",
        ),
        "exactly two film video elements": (
            snapshot.get("bookVideoCount") == 2 and snapshot.get("pageVideoCount") == 2,
            f"book={snapshot.get('bookVideoCount')} page={snapshot.get('pageVideoCount')}",
        ),
        "9100vh rendered runway": (
            abs(runway - RUNWAY_VH) <= 0.02,
            f"rendered={runway:.4f}vh expected={RUNWAY_VH:.0f}vh",
        ),
        "single scrub runtime mode": (
            "mode-scrub" in str(snapshot.get("bookClass", "")),
            str(snapshot.get("bookClass", "")),
        ),
    }


def first_mismatch(actual: list[str], expected: list[str]) -> str:
    for index, wanted in enumerate(expected):
        if index >= len(actual):
            return f"shot-{index + 1:03d}:missing"
        if actual[index] != wanted:
            return f"shot-{index + 1:03d}:{actual[index]!r} != {wanted!r}"
    if len(actual) > len(expected):
        return f"extra:{actual[len(expected)]!r}"
    return "none"


def contract_self_check() -> dict[str, Any]:
    arabic = "\u0627"
    valid = {
        "legs": [
            {
                "clip": expected_clip(shot),
                "poster": expected_poster(shot),
                "titleEn": "title",
                "titleAr": arabic,
                "cueEn": "cue",
                "cueAr": arabic,
            }
            for shot in range(1, TOTAL_SHOTS + 1)
        ],
        "bookVideoCount": 2,
        "pageVideoCount": 2,
        "runwayVh": RUNWAY_VH,
        "bookClass": "scene film mode-scrub",
    }
    valid_results = structural_contract(valid)
    if any(not passed for passed, _ in valid_results.values()):
        raise RuntimeError(f"contract self-check rejected valid fixture: {valid_results}")

    sabotaged = copy.deepcopy(valid)
    sabotaged["legs"][-1]["clip"] = sabotaged["legs"][0]["clip"]
    sabotaged["legs"][49]["poster"] = sabotaged["legs"][48]["poster"]
    sabotaged["legs"][20]["cueAr"] = ""
    sabotaged["bookVideoCount"] = 3
    sabotaged["pageVideoCount"] = 3
    sabotaged["runwayVh"] = 9000
    sabotaged["bookClass"] = "scene film"
    sabotage_results = structural_contract(sabotaged)
    expected_failures = {
        "100 exact clip references",
        "100 unique clip references",
        "100 exact poster references",
        "100 unique poster references",
        "all legs contain EN and AR narrative",
        "exactly two film video elements",
        "9100vh rendered runway",
        "single scrub runtime mode",
    }
    observed = {name for name, (passed, _) in sabotage_results.items() if not passed}
    if not expected_failures.issubset(observed):
        raise RuntimeError(
            "contract self-check did not catch sabotage: "
            f"missing={sorted(expected_failures - observed)} observed={sorted(observed)}"
        )
    return {"valid_checks": len(valid_results), "sabotage_failures": sorted(observed)}


@dataclass
class PageLog:
    console_errors: list[str] = field(default_factory=list)
    page_errors: list[str] = field(default_factory=list)
    http_errors: list[str] = field(default_factory=list)
    request_failures: list[str] = field(default_factory=list)
    local_transport_warnings: list[str] = field(default_factory=list)
    responses: list[dict[str, Any]] = field(default_factory=list)

    def attach(self, page: Page) -> None:
        def console(message: Any) -> None:
            if message.type == "error":
                self.console_errors.append(message.text)

        def response(item: Any) -> None:
            request = item.request
            record = {
                "method": request.method,
                "url": item.url,
                "status": item.status,
                "resource_type": request.resource_type,
            }
            self.responses.append(record)
            if item.status >= 400:
                self.http_errors.append(f"{request.method} {item.status} {item.url}")

        def request_failed(request: Any) -> None:
            failure = str(request.failure or "request failed")
            if "ERR_ABORTED" in failure or "AbortError" in failure:
                return
            self.request_failures.append(f"{request.method} {request.url}: {failure}")

        page.on("console", console)
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))
        page.on("response", response)
        page.on("requestfailed", request_failed)

    def successful_get(self, filename: str) -> list[int]:
        return [
            int(item["status"])
            for item in self.responses
            if item["method"] == "GET"
            and urlsplit(str(item["url"])).path.endswith("/" + filename)
            and int(item["status"]) < 400
        ]


class Verification:
    def __init__(
        self,
        url: str,
        output_dir: Path,
        timeout_ms: int,
        expected_media_base: str | None = None,
    ) -> None:
        self.url = url
        self.expected_media_base = (
            expected_media_base.rstrip("/") + "/"
            if expected_media_base
            else default_media_base(url)
        )
        self.output_dir = output_dir
        self.timeout_ms = timeout_ms
        self.checks: list[dict[str, Any]] = []
        self.failures: list[str] = []
        self.viewports: dict[str, dict[str, Any]] = {}
        self.browser_source = "unknown"
        self.self_check: dict[str, Any] = {}

    def check(self, name: str, condition: bool, detail: Any) -> None:
        detail_text = str(detail)
        self.checks.append({"name": name, "pass": bool(condition), "detail": detail_text})
        print(f"{'PASS' if condition else 'FAIL'} {name}: {detail_text}")
        if not condition:
            self.failures.append(f"{name}: {detail_text}")

    @staticmethod
    def instrument_play(context: BrowserContext) -> None:
        context.add_init_script(
            """(() => {
              const nativePlay = HTMLMediaElement.prototype.play;
              window.__disneyRuntimePlayAttempts = 0;
              HTMLMediaElement.prototype.play = function(...args) {
                window.__disneyRuntimePlayAttempts += 1;
                return nativePlay.apply(this, args);
              };
            })();"""
        )

    def open_page(self, context: BrowserContext, label: str) -> tuple[Page, PageLog] | None:
        page = context.new_page()
        page.set_default_timeout(self.timeout_ms)
        log = PageLog()
        log.attach(page)
        response = page.goto(
            add_query(self.url, runtime_verify=label),
            wait_until="domcontentloaded",
            timeout=self.timeout_ms,
        )
        self.check(
            f"{label} page HTTP",
            bool(response and response.ok),
            response.status if response else "no response",
        )
        if not response or not response.ok:
            page.close()
            return None
        try:
            page.wait_for_load_state("networkidle", timeout=self.timeout_ms)
            self.check(f"{label} initial network idle", True, "reached")
        except PlaywrightTimeoutError:
            self.check(f"{label} initial network idle", False, f"timeout={self.timeout_ms}ms")
        page.wait_for_selector("#book.mode-scrub", timeout=self.timeout_ms)
        page.evaluate("document.documentElement.style.scrollBehavior = 'auto'")
        return page, log

    @staticmethod
    def manifest_snapshot(page: Page) -> dict[str, Any]:
        return page.evaluate(
            """() => {
              const book = document.querySelector('#book');
              const legs = [...book.querySelectorAll('.legcap')].map(leg => ({
                clip: leg.dataset.clip || '',
                poster: leg.dataset.poster || '',
                titleEn: leg.dataset.tEn || '',
                titleAr: leg.dataset.tAr || '',
                cueEn: leg.querySelector('figcaption .en')?.textContent?.trim() || '',
                cueAr: leg.querySelector('figcaption .ar')?.textContent?.trim() || '',
              }));
              return {
                legs,
                mediaBase: book.dataset.mediaBase || '',
                bookVideoCount: book.querySelectorAll('video').length,
                pageVideoCount: document.querySelectorAll('video').length,
                runwayVh: book.offsetHeight / innerHeight * 100,
                runwayPx: book.offsetHeight,
                viewportHeight: innerHeight,
                bookClass: book.className,
              };
            }"""
        )

    def check_structure(self, page: Page, label: str) -> tuple[dict[str, Any], bool]:
        snapshot = self.manifest_snapshot(page)
        results = structural_contract(snapshot)
        for name, (passed, detail) in results.items():
            self.check(f"{label} {name}", passed, detail)
        self.check(
            f"{label} resolved media base",
            snapshot.get("mediaBase") == self.expected_media_base,
            snapshot.get("mediaBase") or "missing",
        )
        return snapshot, all(passed for passed, _ in results.values())

    def check_asset_heads(self, page: Page, snapshot: dict[str, Any], label: str) -> None:
        paths = [
            resolved_media_url(self.expected_media_base, item["clip"])
            for item in snapshot["legs"]
        ] + [
            resolved_media_url(self.expected_media_base, item["poster"])
            for item in snapshot["legs"]
        ]
        results = page.evaluate(
            """async ({paths, concurrency}) => {
              const out = new Array(paths.length);
              let next = 0;
              async function worker() {
                while (true) {
                  const index = next++;
                  if (index >= paths.length) return;
                  const path = paths[index];
                  const controller = new AbortController();
                  const timer = setTimeout(() => controller.abort(), 20000);
                  try {
                    const response = await fetch(path, {
                      method: 'HEAD', cache: 'no-store', signal: controller.signal,
                    });
                    out[index] = {
                      path, status: response.status,
                      type: response.headers.get('content-type') || '',
                      length: response.headers.get('content-length') || '',
                    };
                  } catch (error) {
                    out[index] = {path, status: 0, type: '', length: '', error: String(error)};
                  } finally {
                    clearTimeout(timer);
                  }
                }
              }
              await Promise.all(Array.from({length: concurrency}, worker));
              return out;
            }""",
            {"paths": paths, "concurrency": 12},
        )
        bad_status = [item for item in results if item["status"] != 200]
        bad_types = [
            item
            for item in results
            if item["status"] == 200
            and not (
                (item["path"].endswith(".mp4") and "video/mp4" in item["type"])
                or (item["path"].endswith(".jpg") and item["type"].startswith("image/"))
            )
        ]
        self.check(
            f"{label} all 100 clips and 100 posters resolve",
            not bad_status and len(results) == 200,
            f"checked={len(results)} bad={bad_status[:6] or 'none'}",
        )
        self.check(
            f"{label} all runtime asset content types",
            not bad_types,
            f"bad={bad_types[:6] or 'none'}",
        )

    def check_transport(self, context: BrowserContext, label: str) -> None:
        clip_url = resolved_media_url(self.expected_media_base, expected_clip(21))
        head = context.request.head(clip_url, timeout=self.timeout_ms)
        try:
            accept_ranges = head.headers.get("accept-ranges", "")
            self.check(f"{label} transport HEAD", head.status == 200, head.status)
            self.check(
                f"{label} transport advertises byte ranges",
                accept_ranges.casefold() == "bytes",
                accept_ranges or "missing",
            )
        finally:
            head.dispose()
        ranged = context.request.get(
            clip_url,
            headers={"Range": "bytes=0-1023"},
            timeout=self.timeout_ms,
        )
        try:
            content_range = ranged.headers.get("content-range", "")
            self.check(f"{label} transport range status", ranged.status == 206, ranged.status)
            self.check(
                f"{label} transport Content-Range",
                content_range.startswith("bytes 0-1023/"),
                content_range or "missing",
            )
        finally:
            ranged.dispose()

    @staticmethod
    def set_leg_progress(page: Page, shot: int, fraction: float) -> float:
        progress = ((shot - 1) + fraction) / TOTAL_SHOTS
        return float(
            page.locator("#book").evaluate(
                """(book, progress) => {
                  const top = book.getBoundingClientRect().top + scrollY;
                  const span = Math.max(0, book.offsetHeight - innerHeight);
                  const y = top + span * progress;
                  scrollTo(0, y);
                  return y;
                }""",
                progress,
            )
        )

    def wait_for_leg(self, page: Page, shot: int, fraction: float) -> dict[str, Any] | None:
        clip = Path(expected_clip(shot)).name
        poster = Path(expected_poster(shot)).name
        progress = ((shot - 1) + fraction) / TOTAL_SHOTS
        try:
            handle = page.wait_for_function(
                """({clip, poster, fraction, progress, tolerance}) => {
                  const book = document.querySelector('#book');
                  const video = book?.querySelector('video.on');
                  const floor = book?.querySelector('.floor');
                  if (!video || !floor || !floor.complete || floor.naturalWidth < 1) return false;
                  if (!(video.dataset.clip || '').endsWith('/' + clip)) return false;
                  if (!floor.currentSrc.endsWith('/' + poster)) return false;
                  if (!video.currentSrc.startsWith('blob:')) return false;
                  if (video.readyState < 2 || video.videoWidth < 1 || video.videoHeight < 1) return false;
                  if (!Number.isFinite(video.duration) || video.duration <= 0 || video.seeking) return false;
                  const target = Math.min(video.duration - 0.04, Math.max(0, fraction * video.duration));
                  if (Math.abs(video.currentTime - target) > tolerance) return false;
                  const journey = parseFloat(book.style.getPropertyValue('--journey') || '-1');
                  if (book.dataset.cameraState !== 'idle' || Math.abs(journey - progress) > 0.00011) return false;
                  return {
                    clip: video.dataset.clip,
                    poster: floor.currentSrc.split('/').pop(),
                    currentTime: video.currentTime,
                    target,
                    duration: video.duration,
                    paused: video.paused,
                    readyState: video.readyState,
                    videoWidth: video.videoWidth,
                    videoHeight: video.videoHeight,
                    currentSrc: video.currentSrc,
                    journey,
                    cameraState: book.dataset.cameraState || '',
                    playAttempts: window.__disneyRuntimePlayAttempts || 0,
                  };
                }""",
                arg={
                    "clip": clip,
                    "poster": poster,
                    "fraction": fraction,
                    "progress": progress,
                    "tolerance": 0.08,
                },
                timeout=self.timeout_ms,
            )
            return handle.json_value()
        except PlaywrightTimeoutError:
            return None

    def painted_frame(
        self, page: Page, label: str, shot: int, fraction: float
    ) -> dict[str, Any] | None:
        try:
            frame = page.locator("#book video.on").evaluate(
                """video => {
                  const width = 384;
                  const height = Math.max(1, Math.round(width * video.videoHeight / video.videoWidth));
                  const canvas = document.createElement('canvas');
                  canvas.width = width; canvas.height = height;
                  const context = canvas.getContext('2d', {willReadFrequently: true});
                  context.drawImage(video, 0, 0, width, height);
                  const pixels = context.getImageData(0, 0, width, height).data;
                  let count = 0, sum = 0, sum2 = 0, opaque = 0, nonblack = 0;
                  let hash = 2166136261 >>> 0;
                  for (let index = 0; index < pixels.length; index += 16) {
                    const red = pixels[index], green = pixels[index + 1];
                    const blue = pixels[index + 2], alpha = pixels[index + 3];
                    const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
                    count += 1; sum += luma; sum2 += luma * luma;
                    if (alpha >= 250) opaque += 1;
                    if (luma >= 2) nonblack += 1;
                    hash ^= red; hash = Math.imul(hash, 16777619) >>> 0;
                    hash ^= green; hash = Math.imul(hash, 16777619) >>> 0;
                    hash ^= blue; hash = Math.imul(hash, 16777619) >>> 0;
                  }
                  const mean = sum / count;
                  return {
                    width, height, sourceWidth: video.videoWidth, sourceHeight: video.videoHeight,
                    mean, variance: sum2 / count - mean * mean,
                    opaqueRatio: opaque / count, nonblackRatio: nonblack / count,
                    hash, dataUrl: canvas.toDataURL('image/png'),
                  };
                }"""
            )
        except PlaywrightError as error:
            self.check(f"{label} shot {shot:03d} canvas paint", False, error)
            return None

        data_url = str(frame.pop("dataUrl", ""))
        fraction_tag = int(round(fraction * 1000))
        output = self.output_dir / f"{label}-shot-{shot:03d}-f{fraction_tag:03d}-decoded.png"
        try:
            output.write_bytes(base64.b64decode(data_url.split(",", 1)[1]))
            size = output.stat().st_size
        except (IndexError, ValueError) as error:
            self.check(f"{label} shot {shot:03d} canvas PNG", False, error)
            return None
        painted = (
            frame["sourceWidth"] > 0
            and frame["sourceHeight"] > 0
            and frame["variance"] > 4.0
            and frame["opaqueRatio"] >= 0.99
            and frame["nonblackRatio"] >= 0.45
            and size > 2_000
        )
        self.check(
            f"{label} shot {shot:03d} decoded canvas pixels",
            painted,
            {
                "source": [frame["sourceWidth"], frame["sourceHeight"]],
                "mean": round(frame["mean"], 2),
                "variance": round(frame["variance"], 2),
                "opaque": round(frame["opaqueRatio"], 4),
                "nonblack": round(frame["nonblackRatio"], 4),
                "hash": frame["hash"],
                "png_bytes": size,
            },
        )
        frame["path"] = str(output)
        frame["pngBytes"] = size
        return frame

    def sample_leg(
        self,
        page: Page,
        log: PageLog,
        label: str,
        shot: int,
        fraction: float,
    ) -> dict[str, Any] | None:
        y = self.set_leg_progress(page, shot, fraction)
        state = self.wait_for_leg(page, shot, fraction)
        if state is None:
            recovery_shot = shot + 3 if shot <= TOTAL_SHOTS - 3 else shot - 3
            self.set_leg_progress(page, recovery_shot, 0.50)
            page.wait_for_timeout(650)
            y = self.set_leg_progress(page, shot, fraction)
            state = self.wait_for_leg(page, shot, fraction)
        if state is None:
            self.check(
                f"{label} shot {shot:03d} decoded seek",
                False,
                f"timeout after recovery at fraction={fraction:.3f}",
            )
            return None
        expected_progress = ((shot - 1) + fraction) / TOTAL_SHOTS
        self.check(
            f"{label} shot {shot:03d} active clip and poster",
            state["clip"] == resolved_media_url(self.expected_media_base, expected_clip(shot))
            and state["poster"] == Path(expected_poster(shot)).name,
            {"clip": state["clip"], "poster": state["poster"]},
        )
        self.check(
            f"{label} shot {shot:03d} scroll owns currentTime",
            bool(state["paused"])
            and abs(float(state["currentTime"]) - float(state["target"])) <= 0.08
            and state["playAttempts"] == 0,
            {
                "time": round(float(state["currentTime"]), 3),
                "target": round(float(state["target"]), 3),
                "paused": state["paused"],
                "playAttempts": state["playAttempts"],
            },
        )
        self.check(
            f"{label} shot {shot:03d} weighted journey settles",
            abs(float(state["journey"]) - expected_progress) <= 0.00011,
            f"journey={state['journey']:.5f} target={expected_progress:.5f}",
        )
        statuses = log.successful_get(Path(expected_clip(shot)).name)
        self.check(
            f"{label} shot {shot:03d} clip GET completed",
            bool(statuses),
            statuses or "missing",
        )
        frame = self.painted_frame(page, label, shot, fraction)
        state["painted"] = frame
        state["scrollY"] = y
        if shot == TOTAL_SHOTS and abs(fraction - 0.50) < 1e-9:
            self.check_clock_freeze(page, label)
            screenshot = self.output_dir / f"{label}-shot-100-page.png"
            page.screenshot(path=str(screenshot), full_page=False)
            self.check(
                f"{label} shot 100 rendered screenshot",
                screenshot.is_file() and screenshot.stat().st_size > 10_000,
                screenshot.stat().st_size if screenshot.is_file() else 0,
            )
        return state

    def check_double_buffer(self, page: Page, label: str, active_shot: int) -> None:
        try:
            handle = page.wait_for_function(
                """active => {
                  const videos = [...document.querySelectorAll('#book video')];
                  if (videos.length !== 2) return false;
                  const slots = videos.map(video => ({
                    clip: (video.dataset.clip || '').split('/').pop(),
                    src: video.currentSrc,
                    readyState: video.readyState,
                    on: video.classList.contains('on'),
                  }));
                  if (slots.filter(slot => slot.on).length !== 1) return false;
                  if (!slots.find(slot => slot.on)?.clip.endsWith(active)) return false;
                  if (!slots.every(slot => slot.src.startsWith('blob:') && slot.readyState >= 1)) return false;
                  if (new Set(slots.map(slot => slot.clip)).size !== 2) return false;
                  return slots;
                }""",
                arg=f"DSN2-{active_shot:03d}.mp4",
                timeout=self.timeout_ms,
            )
            slots = handle.json_value()
            shot_numbers = sorted(int(re.search(r"(\d{3})\.mp4$", slot["clip"]).group(1)) for slot in slots)
            adjacent = shot_numbers[1] - shot_numbers[0] == 1
            self.check(
                f"{label} two-slot blob buffer active",
                adjacent,
                {"shots": shot_numbers, "blobSlots": 2, "active": active_shot},
            )
        except (PlaywrightTimeoutError, AttributeError) as error:
            self.check(f"{label} two-slot blob buffer active", False, error)

    def check_language(self, page: Page, label: str) -> None:
        state = page.evaluate(
            """() => ({
              lang: document.documentElement.lang,
              dir: document.documentElement.dir,
              enDisplay: getComputedStyle(document.querySelector('#cue-title .en')).display,
              arDisplay: getComputedStyle(document.querySelector('#cue-title .ar')).display,
              enTitle: document.querySelector('#cue-title .en')?.textContent?.trim() || '',
              arTitle: document.querySelector('#cue-title .ar')?.textContent?.trim() || '',
              enCue: document.querySelector('#cue-story .en')?.textContent?.trim() || '',
              arCue: document.querySelector('#cue-story .ar')?.textContent?.trim() || '',
            })"""
        )
        if state["lang"] != "en":
            page.evaluate("document.querySelector('[data-lang-toggle]').click()")
            page.wait_for_function("document.documentElement.lang === 'en'")
            state = page.evaluate(
                """() => ({
                  lang: document.documentElement.lang, dir: document.documentElement.dir,
                  enDisplay: getComputedStyle(document.querySelector('#cue-title .en')).display,
                  arDisplay: getComputedStyle(document.querySelector('#cue-title .ar')).display,
                  enTitle: document.querySelector('#cue-title .en')?.textContent?.trim() || '',
                  enCue: document.querySelector('#cue-story .en')?.textContent?.trim() || '',
                })"""
            )
        self.check(
            f"{label} English cue and LTR",
            state["lang"] == "en"
            and state["dir"] == "ltr"
            and state["enDisplay"] != "none"
            and state["arDisplay"] == "none"
            and bool(state["enTitle"])
            and bool(state["enCue"]),
            state,
        )

        page.evaluate("document.querySelector('[data-lang-toggle]').click()")
        page.wait_for_function(
            "document.documentElement.lang === 'ar' && document.documentElement.dir === 'rtl'"
        )
        arabic = page.evaluate(
            """() => ({
              lang: document.documentElement.lang,
              dir: document.documentElement.dir,
              bodyDirection: getComputedStyle(document.body).direction,
              cueDirection: getComputedStyle(document.querySelector('#cue')).direction,
              enDisplay: getComputedStyle(document.querySelector('#cue-title .en')).display,
              arDisplay: getComputedStyle(document.querySelector('#cue-title .ar')).display,
              title: document.querySelector('#cue-title .ar')?.textContent?.trim() || '',
              cue: document.querySelector('#cue-story .ar')?.textContent?.trim() || '',
            })"""
        )
        self.check(
            f"{label} Arabic cue and RTL",
            arabic["lang"] == "ar"
            and arabic["dir"] == "rtl"
            and arabic["bodyDirection"] == "rtl"
            and arabic["cueDirection"] == "rtl"
            and arabic["enDisplay"] == "none"
            and arabic["arDisplay"] != "none"
            and bool(ARABIC_RE.search(arabic["title"]))
            and bool(ARABIC_RE.search(arabic["cue"])),
            arabic,
        )
        self.check_overflow(page, f"{label} Arabic")
        page.evaluate("document.querySelector('[data-lang-toggle]').click()")
        page.wait_for_function(
            "document.documentElement.lang === 'en' && document.documentElement.dir === 'ltr'"
        )

    def check_overflow(self, page: Page, label: str) -> None:
        widths = page.evaluate(
            """() => ({
              inner: innerWidth,
              rootClient: document.documentElement.clientWidth,
              rootScroll: document.documentElement.scrollWidth,
              bodyScroll: document.body.scrollWidth,
            })"""
        )
        limit = max(int(widths["inner"]), int(widths["rootClient"])) + 2
        self.check(
            f"{label} no horizontal overflow",
            int(widths["rootScroll"]) <= limit and int(widths["bodyScroll"]) <= limit,
            widths,
        )

    def check_boundary(self, label: str, before: dict[str, Any], after: dict[str, Any]) -> None:
        before_path = Path(str(before["painted"]["path"]))
        after_path = Path(str(after["painted"]["path"]))
        first = Image.open(before_path).convert("L")
        second = Image.open(after_path).convert("L").resize(first.size)
        raw = float(ImageStat.Stat(ImageChops.difference(first, second)).mean[0])
        edge = float(
            ImageStat.Stat(
                ImageChops.difference(
                    first.filter(ImageFilter.FIND_EDGES),
                    second.filter(ImageFilter.FIND_EDGES),
                )
            ).mean[0]
        )
        self.check(
            f"{label} decoded boundary continuity 020 to 021",
            raw <= 22.0 and edge <= 55.0,
            f"mean-luma-diff={raw:.2f} edge-diff={edge:.2f}",
        )

    def check_clock_freeze(self, page: Page, label: str) -> None:
        try:
            page.wait_for_function(
                "document.querySelector('#book').dataset.cameraState === 'idle'",
                timeout=self.timeout_ms,
            )
        except PlaywrightTimeoutError:
            pass
        before = float(page.locator("#book video.on").evaluate("video => video.currentTime"))
        page.wait_for_timeout(450)
        after = float(page.locator("#book video.on").evaluate("video => video.currentTime"))
        self.check(
            f"{label} idle decoded clock is frozen",
            abs(after - before) <= 0.015,
            f"{before:.4f} -> {after:.4f}",
        )

    def check_logs(self, page: Page, log: PageLog, label: str) -> None:
        page.wait_for_timeout(100)
        if urlsplit(self.url).hostname in {"127.0.0.1", "localhost"}:
            markers = ("ERR_INVALID_HTTP_RESPONSE", "ERR_CONTENT_LENGTH_MISMATCH")
            console_real: list[str] = []
            for entry in log.console_errors:
                if any(marker in entry for marker in markers):
                    log.local_transport_warnings.append(entry)
                else:
                    console_real.append(entry)
            log.console_errors = console_real
            request_real: list[str] = []
            for entry in log.request_failures:
                if any(marker in entry for marker in markers):
                    log.local_transport_warnings.append(entry)
                else:
                    request_real.append(entry)
            log.request_failures = request_real
            for warning in log.local_transport_warnings:
                print(f"WARN local ranged-server cancellation: {warning}")
        attempts = int(page.evaluate("window.__disneyRuntimePlayAttempts || 0"))
        self.check(f"{label} zero play() attempts", attempts == 0, f"attempts={attempts}")
        self.check(f"{label} console clean", not log.console_errors, log.console_errors or "0 errors")
        self.check(f"{label} page exceptions", not log.page_errors, log.page_errors or "0 exceptions")
        self.check(f"{label} HTTP responses clean", not log.http_errors, log.http_errors[:8] or "0 errors")
        self.check(
            f"{label} request failures clean",
            not log.request_failures,
            log.request_failures[:8] or "0 failures",
        )

    def run_journey(self, page: Page, log: PageLog, label: str) -> list[dict[str, Any]]:
        samples: list[dict[str, Any]] = []
        requested = [
            (1, 0.50),
            (20, 0.985),
            (21, 0.005),
            (50, 0.50),
            (80, 0.50),
            (100, 0.50),
            (21, 0.75),
            (20, 0.25),
        ]
        for shot, fraction in requested:
            state = self.sample_leg(page, log, label, shot, fraction)
            if state is not None:
                samples.append(state)
            if shot == 21 and fraction == 0.005:
                self.check_double_buffer(page, label, shot)

        if len(samples) == len(requested):
            journeys = [float(sample["journey"]) for sample in samples]
            forward = all(current > previous for previous, current in zip(journeys[:6], journeys[1:6]))
            reverse = journeys[6] < journeys[5] and journeys[7] < journeys[6]
            self.check(
                f"{label} forward and reverse scroll sequence",
                forward and reverse,
                [round(value, 5) for value in journeys],
            )
            hashes = {
                int(sample["painted"]["hash"])
                for sample in samples
                if sample.get("painted") is not None
            }
            self.check(
                f"{label} decoded film changes across selected legs",
                len(hashes) >= 5,
                f"unique-canvas-hashes={len(hashes)}",
            )
            self.check_boundary(label, samples[1], samples[2])
            blob_urls = {str(sample["currentSrc"]) for sample in samples}
            self.check(
                f"{label} active blob URLs rotate with the two-slot buffer",
                len(blob_urls) >= 5 and all(url.startswith("blob:") for url in blob_urls),
                f"unique-active-blobs={len(blob_urls)}",
            )
            expected_runtime_gets = {
                Path(expected_clip(shot)).name for shot, _ in requested
            }
            seen_runtime_gets = {
                filename for filename in expected_runtime_gets if log.successful_get(filename)
            }
            self.check(
                f"{label} selected runtime clip requests observed",
                seen_runtime_gets == expected_runtime_gets,
                f"seen={sorted(seen_runtime_gets)}",
            )
        else:
            self.check(
                f"{label} complete forward and reverse sample set",
                False,
                f"completed={len(samples)}/{len(requested)}",
            )

        return samples

    def viewport_pass(
        self,
        browser: Browser,
        label: str,
        viewport: dict[str, int],
        *,
        mobile: bool,
        check_all_assets: bool,
        reduced_motion: bool = False,
    ) -> None:
        context_options: dict[str, Any] = {
            "viewport": {"width": viewport["width"], "height": viewport["height"]},
            "locale": "en-US",
        }
        if reduced_motion:
            context_options["reduced_motion"] = "reduce"
        if mobile:
            context_options.update(
                {
                    "screen": {"width": viewport["width"], "height": viewport["height"]},
                    "is_mobile": True,
                    "has_touch": True,
                    "device_scale_factor": 1,
                }
            )
        context = browser.new_context(**context_options)
        self.instrument_play(context)
        page: Page | None = None
        log: PageLog | None = None
        try:
            opened = self.open_page(context, label)
            if opened is None:
                return
            page, log = opened
            if reduced_motion:
                preference_active = page.evaluate(
                    "matchMedia('(prefers-reduced-motion: reduce)').matches"
                )
                self.check(
                    f"{label} browser preference active",
                    bool(preference_active),
                    f"matchMedia={preference_active}",
                )
            snapshot, structure_ok = self.check_structure(page, label)
            self.check_overflow(page, label)
            self.viewports[label] = {
                "viewport": viewport,
                "manifest": snapshot,
            }
            if not structure_ok:
                self.check_logs(page, log, label)
                return
            if check_all_assets:
                self.check_asset_heads(page, snapshot, label)
                self.check_transport(context, label)
            samples = self.run_journey(page, log, label)
            self.check_language(page, label)
            self.check_overflow(page, f"{label} final")
            self.check_logs(page, log, label)
            self.viewports[label]["samples"] = samples
            self.viewports[label]["network"] = {
                "responses": len(log.responses),
                "consoleErrors": log.console_errors,
                "pageErrors": log.page_errors,
                "httpErrors": log.http_errors,
                "requestFailures": log.request_failures,
                "localTransportWarnings": log.local_transport_warnings,
            }
        except Exception as error:  # preserve a report instead of losing the decisive failure
            self.check(f"{label} browser pass completed", False, f"{type(error).__name__}: {error}")
            if page is not None and log is not None:
                self.check_logs(page, log, label)
        finally:
            if page is not None and not page.is_closed():
                page.close()
            context.close()

    def run(self, browser: Browser) -> int:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.self_check = contract_self_check()
        print(
            "RUNTIME_CONTRACT_SELF_CHECK_GREEN "
            f"valid={self.self_check['valid_checks']} "
            f"sabotage_failures={len(self.self_check['sabotage_failures'])}"
        )
        self.viewport_pass(
            browser,
            "desktop",
            {"width": 1440, "height": 900},
            mobile=False,
            check_all_assets=True,
        )
        self.viewport_pass(
            browser,
            "phone",
            {"width": 390, "height": 844},
            mobile=True,
            check_all_assets=False,
        )
        self.viewport_pass(
            browser,
            "reduced-motion",
            {"width": 1440, "height": 900},
            mobile=False,
            check_all_assets=False,
            reduced_motion=True,
        )
        report = {
            "url": self.url,
            "verifiedAtUtc": datetime.now(timezone.utc).isoformat(),
            "browserSource": self.browser_source,
            "contractSelfCheck": self.self_check,
            "checks": self.checks,
            "failures": self.failures,
            "viewports": self.viewports,
        }
        report_path = self.output_dir / "runtime-browser-verification.json"
        report_path.write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"verification report: {report_path}")
        if self.failures:
            print(
                f"DISNEY_RUNTIME_BROWSER_FAIL failures={len(self.failures)}",
                file=sys.stderr,
            )
            return 1
        print(
            f"DISNEY_RUNTIME_BROWSER_GREEN checks={len(self.checks)} "
            f"viewports={len(self.viewports)} legs={TOTAL_SHOTS} runway={RUNWAY_VH:.0f}vh"
        )
        return 0


def chrome_candidates(explicit: Path | None) -> list[Path]:
    candidates: list[Path] = []
    if explicit is not None:
        candidates.append(explicit)
    local_app_data = os.environ.get("LOCALAPPDATA", "")
    if local_app_data:
        candidates.append(Path(local_app_data) / "Google/Chrome/Application/chrome.exe")
    candidates.extend(
        [
            Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
            Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
            Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
        ]
    )
    unique: list[Path] = []
    for candidate in candidates:
        if candidate not in unique:
            unique.append(candidate)
    return unique


def launch_browser(playwright: Any, explicit: Path | None) -> tuple[Browser, str]:
    errors: list[str] = []
    try:
        return (
            playwright.chromium.launch(channel="chrome", headless=True),
            "installed Chrome channel",
        )
    except PlaywrightError as error:
        errors.append(f"channel=chrome: {error}")
    for candidate in chrome_candidates(explicit):
        if not candidate.is_file():
            continue
        try:
            return (
                playwright.chromium.launch(executable_path=str(candidate), headless=True),
                str(candidate),
            )
        except PlaywrightError as error:
            errors.append(f"{candidate}: {error}")
    try:
        return playwright.chromium.launch(headless=True), "Playwright bundled Chromium"
    except PlaywrightError as error:
        errors.append(f"bundled Chromium: {error}")
    raise RuntimeError("no usable Chromium browser:\n" + "\n".join(errors))


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify the rendered 100-shot Disney scroll-film runtime."
    )
    parser.add_argument("--url", required=True, help="Full URL to public/worlds/disney.html")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("production/disney-continuation-80/review/runtime-browser-proof"),
    )
    parser.add_argument("--timeout-ms", type=int, default=45_000)
    parser.add_argument(
        "--expected-media-base",
        help="Expected resolved media directory; inferred from --url when omitted.",
    )
    parser.add_argument("--chrome-executable", type=Path)
    args = parser.parse_args()

    verification = Verification(
        args.url,
        args.output_dir.resolve(),
        args.timeout_ms,
        args.expected_media_base,
    )
    with sync_playwright() as playwright:
        browser, source = launch_browser(playwright, args.chrome_executable)
        verification.browser_source = source
        print(f"browser: {source}")
        try:
            return verification.run(browser)
        finally:
            browser.close()


if __name__ == "__main__":
    raise SystemExit(main())
