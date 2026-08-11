#!/usr/bin/env python3
"""Final rendered-browser gate for the ready Cake Studio v1.7 bookends.

Run behind ``scripts/serve-static.mjs`` via the webapp-testing skill's
``with_server.py`` helper.  This verifier is intentionally separate from the
pending-shell gate: it fails closed until the canonical manifest is
``ready:true`` and the page points at its final cache key.

The full desktop motion pass decodes every one of the fifteen clips, compares
the visible runtime canvas with the paused source video, checks both supplied
endpoints, traverses the clips again in reverse, and measures all thirteen
internal joins plus the two joins to CST-001/CST-050.  Phone motion and two
reduced-motion contexts then cover presentation, language, and transport
isolation without weakening that cinema pass.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import math
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlsplit, urlunsplit

import cv2
import numpy as np
from PIL import Image, ImageDraw
from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError, sync_playwright


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


INTRO_IDS = [f"I{index:02d}" for index in range(1, 11)]
OUTRO_IDS = [f"O{index:02d}" for index in range(1, 6)]
EXPECTED_IDS = {"intro": INTRO_IDS, "outro": OUTRO_IDS}
EXPECTED_CLIP_IDS = INTRO_IDS + OUTRO_IDS
EXPECTED_FINAL_MANIFEST = "cake-studio/v17/manifest.json?v=1.7.0-final"
V17_CLIP_MARKER = "/cake-studio/v17/clips/"
PROBE_WIDTH = 320
PROBE_HEIGHT = 180

# The source/media gate checks full-resolution anchors at SSIM .985.  Browser
# proof uses 320x180 captures after two independent browser colour conversions,
# so the anchor limit is slightly lower while decoded clip-to-clip joins retain
# the stricter production threshold.
ANCHOR_MIN_SSIM = 0.975
ANCHOR_MAX_MAE = 6.0
JOIN_MIN_SSIM = 0.990
JOIN_MAX_MAE = 4.5
CANVAS_MIN_SSIM = 0.999
CANVAS_MAX_MAE = 0.35
DETERMINISTIC_MIN_SSIM = 0.999
DETERMINISTIC_MAX_MAE = 0.35

SABOTAGE_FREEZE = "freeze-draw"
SABOTAGE_ENDPOINT = "wrong-endpoint"
SABOTAGE_CHOICES = (SABOTAGE_FREEZE, SABOTAGE_ENDPOINT)


@dataclass(frozen=True)
class Profile:
    name: str
    width: int
    height: int
    reduced: bool
    mobile: bool

    @property
    def minimum_aperture_area(self) -> float:
        return 0.20 if self.mobile else 0.55


DESKTOP_MOTION = Profile("desktop-motion", 1440, 1000, False, False)
PHONE_MOTION = Profile("phone-motion", 390, 844, False, True)
REDUCED_PROFILES = (
    Profile("desktop-reduced", 1440, 1000, True, False),
    Profile("phone-reduced", 390, 844, True, True),
)


def without_fragment(url: str) -> str:
    parts = urlsplit(url)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, parts.query, ""))


def data_url_bytes(data_url: str) -> bytes:
    if not data_url.startswith("data:image/png;base64,"):
        raise ValueError("browser frame was not a PNG data URL")
    return base64.b64decode(data_url.split(",", 1)[1])


def decode_png(payload: bytes) -> np.ndarray:
    frame = cv2.imdecode(np.frombuffer(payload, dtype=np.uint8), cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("browser PNG could not be decoded")
    return frame


def similarity(first_payload: bytes, second_payload: bytes) -> tuple[float, float]:
    first = decode_png(first_payload)
    second = decode_png(second_payload)
    if first.shape != second.shape:
        raise ValueError(f"frame shapes differ: {first.shape} vs {second.shape}")
    mae = float(np.mean(np.abs(first.astype(np.float32) - second.astype(np.float32))))
    first_gray = cv2.cvtColor(first, cv2.COLOR_BGR2GRAY).astype(np.float64)
    second_gray = cv2.cvtColor(second, cv2.COLOR_BGR2GRAY).astype(np.float64)
    mu_first = cv2.GaussianBlur(first_gray, (11, 11), 1.5)
    mu_second = cv2.GaussianBlur(second_gray, (11, 11), 1.5)
    mu_first_sq = mu_first * mu_first
    mu_second_sq = mu_second * mu_second
    mu_both = mu_first * mu_second
    sigma_first = cv2.GaussianBlur(first_gray * first_gray, (11, 11), 1.5) - mu_first_sq
    sigma_second = cv2.GaussianBlur(second_gray * second_gray, (11, 11), 1.5) - mu_second_sq
    sigma_both = cv2.GaussianBlur(first_gray * second_gray, (11, 11), 1.5) - mu_both
    c1 = (0.01 * 255) ** 2
    c2 = (0.03 * 255) ** 2
    score_map = ((2 * mu_both + c1) * (2 * sigma_both + c2)) / (
        (mu_first_sq + mu_second_sq + c1)
        * (sigma_first + sigma_second + c2)
    )
    return float(np.mean(score_map)), mae


def frame_digest(payload: bytes) -> str:
    return hashlib.sha256(decode_png(payload).tobytes()).hexdigest()


def frame_energy(payload: bytes) -> tuple[float, float]:
    frame = decode_png(payload).astype(np.float32)
    return float(frame.mean()), float(frame.std())


def clip_progress(index: int, count: int, fraction: float) -> float:
    if index < 0 or index >= count:
        raise ValueError(f"clip index {index} outside 0..{count - 1}")
    if fraction < 0 or fraction >= 1:
        raise ValueError(f"clip fraction {fraction} outside [0,1)")
    return (index + fraction) / count


def expected_joins() -> list[tuple[str, str]]:
    joins = [(f"I{index:02d}", f"I{index + 1:02d}") for index in range(1, 10)]
    joins.extend((f"O{index:02d}", f"O{index + 1:02d}") for index in range(1, 5))
    return joins


def expected_cancellation_reason(url: str, failure: str) -> str | None:
    """Classify only the two bounded media-rearm cancellation cases."""
    parsed = urlsplit(url)
    if parsed.scheme == "blob" and failure == "net::ERR_ABORTED":
        return "core-blob-rearm"
    if (
        V17_CLIP_MARKER in url.lower()
        and parsed.path.lower().endswith(".mp4")
        and any(
            marker in failure
            for marker in ("ERR_ABORTED", "ERR_CONTENT_LENGTH_MISMATCH")
        )
    ):
        return "v17-media-rearm"
    return None


class Verification:
    def __init__(self, url: str, output: Path, sabotage: str | None) -> None:
        self.url = without_fragment(url)
        self.output = output
        self.sabotage = sabotage
        self.output.mkdir(parents=True, exist_ok=True)
        self.checks: list[dict[str, Any]] = []
        self.failures: list[str] = []
        self.profile_reports: dict[str, Any] = {}
        self.screenshots: list[tuple[str, Path]] = []
        self.endpoint_sabotage_hits = 0
        self.manifest: dict[str, Any] | None = None

    def check(self, name: str, passed: bool, detail: Any, *, kind: str = "general") -> bool:
        passed = bool(passed)
        if isinstance(detail, (dict, list, tuple)):
            detail_text = json.dumps(detail, ensure_ascii=False, sort_keys=True)
        else:
            detail_text = str(detail)
        self.checks.append(
            {"name": name, "pass": passed, "kind": kind, "detail": detail_text}
        )
        print(f"{'PASS' if passed else 'FAIL'} {name}: {detail_text}")
        if not passed:
            self.failures.append(f"{name}: {detail_text}")
        return passed

    @staticmethod
    def new_events() -> dict[str, Any]:
        return {
            "console_errors": [],
            "page_errors": [],
            "manifest_requests": [],
            "media_requests": [],
            "media_responses": [],
            "request_failures": [],
            "expected_cancellations": [],
            "http_errors": [],
        }

    def observe(self, page: Page) -> dict[str, Any]:
        events = self.new_events()

        def on_console(message: Any) -> None:
            if message.type == "error":
                events["console_errors"].append(message.text)

        def on_request(request: Any) -> None:
            url = request.url
            if "/cake-studio/v17/manifest.json" in url:
                events["manifest_requests"].append(url)
            if V17_CLIP_MARKER in url.lower() and urlsplit(url).path.lower().endswith(".mp4"):
                headers = {key.lower(): value for key, value in request.headers.items()}
                events["media_requests"].append(
                    {"url": url, "range": headers.get("range", "")}
                )

        def on_response(response: Any) -> None:
            url = response.url
            if V17_CLIP_MARKER in url.lower() and urlsplit(url).path.lower().endswith(".mp4"):
                headers = {key.lower(): value for key, value in response.headers.items()}
                request_headers = {
                    key.lower(): value for key, value in response.request.headers.items()
                }
                events["media_responses"].append(
                    {
                        "url": url,
                        "status": response.status,
                        "range": request_headers.get("range", ""),
                        "acceptRanges": headers.get("accept-ranges", ""),
                        "contentRange": headers.get("content-range", ""),
                        "contentType": headers.get("content-type", ""),
                    }
                )
            if response.status >= 400:
                events["http_errors"].append({"url": url, "status": response.status})

        def on_failed(request: Any) -> None:
            failure = request.failure or "unknown"
            url = request.url
            reason = expected_cancellation_reason(url, failure)
            if reason:
                events["expected_cancellations"].append(
                    {"url": url, "failure": failure, "reason": reason}
                )
            else:
                events["request_failures"].append({"url": url, "failure": failure})

        page.on("console", on_console)
        page.on("pageerror", lambda error: events["page_errors"].append(str(error)))
        page.on("request", on_request)
        page.on("response", on_response)
        page.on("requestfailed", on_failed)
        return events

    def make_context(self, browser: Browser, profile: Profile) -> BrowserContext:
        context = browser.new_context(
            viewport={"width": profile.width, "height": profile.height},
            locale="en-US",
            reduced_motion="reduce" if profile.reduced else "no-preference",
            is_mobile=profile.mobile,
            has_touch=profile.mobile,
            device_scale_factor=1,
        )
        freeze = self.sabotage == SABOTAGE_FREEZE
        context.add_init_script(
            f"""(() => {{
              try {{ localStorage.removeItem('mm-lang'); }} catch {{}}
              window.__cakeV17PlayAttempts = [];
              window.__cakeV17DrawAttempts = 0;
              window.__cakeV17FrozenDraws = 0;
              const originalPlay = HTMLMediaElement.prototype.play;
              HTMLMediaElement.prototype.play = function(...args) {{
                window.__cakeV17PlayAttempts.push({{
                  className: this.className || '',
                  src: this.currentSrc || this.getAttribute('src') || ''
                }});
                return originalPlay.apply(this, args);
              }};
              const originalDraw = CanvasRenderingContext2D.prototype.drawImage;
              CanvasRenderingContext2D.prototype.drawImage = function(...args) {{
                if (this.canvas?.matches?.('[data-bookend-canvas]')) {{
                  window.__cakeV17DrawAttempts += 1;
                  if ({str(freeze).lower()}) {{
                    window.__cakeV17FrozenDraws += 1;
                    return;
                  }}
                }}
                return originalDraw.apply(this, args);
              }};
            }})()"""
        )
        if self.sabotage == SABOTAGE_ENDPOINT:
            self.install_endpoint_sabotage(context)
        return context

    def install_endpoint_sabotage(self, context: BrowserContext) -> None:
        pattern = "**/CST17-I01-edge-reveals-sheet.webp*"

        def replace_endpoint(route: Any) -> None:
            wrong_url = urljoin(
                route.request.url,
                "CST17-O05-finished-mobius-cake.webp",
            )
            response = route.fetch(url=wrong_url)
            self.endpoint_sabotage_hits += 1
            route.fulfill(response=response)

        context.route(pattern, replace_endpoint)

    def open_page(
        self,
        context: BrowserContext,
        profile: Profile,
    ) -> tuple[Page, dict[str, Any]]:
        page = context.new_page()
        events = self.observe(page)
        page.goto(self.url, wait_until="networkidle", timeout=45_000)
        try:
            page.wait_for_function(
                "() => window.__cakeStudioBookends?.state !== 'loading'",
                timeout=15_000,
            )
        except TimeoutError:
            pass
        return page, events

    def preflight(self, page: Page) -> tuple[bool, dict[str, Any]]:
        state = page.evaluate(
            """async () => {
              const runtime = window.__cakeStudioBookends;
              const scenes = [...document.querySelectorAll('[data-cake-bookend]')];
              const reference = scenes[0]?.dataset.bookendManifest || '';
              let manifest = null;
              let manifestError = '';
              try {
                const response = await fetch(reference, {cache: 'no-cache'});
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                manifest = await response.json();
              } catch (error) {
                manifestError = String(error);
              }
              return {
                bodyVersion: document.body.dataset.version || '',
                runtimeVersion: runtime?.version || '',
                runtimeState: runtime?.state || 'missing',
                runtimeError: runtime?.error || '',
                manifestReady: runtime?.manifestReady,
                references: scenes.map(scene => scene.dataset.bookendManifest || ''),
                tracks: scenes.map(scene => scene.dataset.bookendTrack || ''),
                units: (runtime?.units || []).map(unit => ({
                  track: unit.trackName,
                  ids: unit.clips.map(clip => clip.id),
                  sources: unit.clips.map(clip => clip.src),
                })),
                manifest,
                manifestError,
              };
            }"""
        )
        final_reference = (
            state["references"] == [EXPECTED_FINAL_MANIFEST, EXPECTED_FINAL_MANIFEST]
        )
        self.check(
            "final manifest cache key",
            final_reference,
            state["references"],
            kind="readiness",
        )
        runtime_ready = (
            state["bodyVersion"] == "1.7.0"
            and state["runtimeVersion"] == "1.7.0"
            and state["runtimeState"] == "ready"
            and state["manifestReady"] is True
            and state["tracks"] == ["intro", "outro"]
            and state["manifest"] is not None
            and state["manifest"].get("ready") is True
        )
        self.check(
            "ready manifest and runtime",
            runtime_ready,
            {
                "bodyVersion": state["bodyVersion"],
                "runtimeVersion": state["runtimeVersion"],
                "runtimeState": state["runtimeState"],
                "runtimeError": state["runtimeError"],
                "manifestReady": state["manifestReady"],
                "manifestFlag": (state["manifest"] or {}).get("ready"),
                "manifestError": state["manifestError"],
            },
            kind="readiness",
        )
        mappings = {unit["track"]: unit for unit in state["units"]}
        mapping_ok = set(mappings) == {"intro", "outro"}
        all_sources: list[str] = []
        for track, ids in EXPECTED_IDS.items():
            unit = mappings.get(track, {})
            mapping_ok = mapping_ok and unit.get("ids") == ids
            sources = unit.get("sources", [])
            mapping_ok = mapping_ok and len(sources) == len(ids)
            mapping_ok = mapping_ok and all(
                source.endswith(f"CST17-{clip_id}.mp4")
                for source, clip_id in zip(sources, ids)
            )
            all_sources.extend(sources)
        mapping_ok = mapping_ok and len(all_sources) == 15 and len(set(all_sources)) == 15
        self.check(
            "exact 10 plus 5 runtime mapping",
            mapping_ok,
            {track: mappings.get(track, {}).get("ids", []) for track in EXPECTED_IDS},
            kind="readiness",
        )
        self.manifest = state["manifest"]
        return final_reference and runtime_ready and mapping_ok, state

    @staticmethod
    def set_language(page: Page, language: str) -> None:
        if page.evaluate("document.documentElement.lang") != language:
            page.locator("[data-lang-toggle]").click()
            page.wait_for_function(
                "language => document.documentElement.lang === language",
                arg=language,
                timeout=5_000,
            )

    @staticmethod
    def set_progress(page: Page, selector: str, progress: float) -> None:
        found = page.evaluate(
            """({selector, progress}) => {
              const scene = document.querySelector(selector);
              if (!scene) return false;
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const root = document.documentElement;
              const prior = root.style.scrollBehavior;
              root.style.scrollBehavior = 'auto';
              scrollTo({top: top + span * progress, behavior: 'auto'});
              root.style.scrollBehavior = prior;
              scene.dispatchEvent(new CustomEvent('scene:live'));
              dispatchEvent(new Event('scroll'));
              return true;
            }""",
            {"selector": selector, "progress": progress},
        )
        if not found:
            raise RuntimeError(f"missing scene {selector}")
        page.wait_for_function(
            """({selector, progress}) => {
              const scene = document.querySelector(selector);
              const actual = Number.parseFloat(scene?.style.getPropertyValue('--p') || '-1');
              return Math.abs(actual - progress) <= .002;
            }""",
            arg={"selector": selector, "progress": progress},
            timeout=8_000,
        )

    def seek_bookend(
        self,
        page: Page,
        track: str,
        index: int,
        fraction: float,
    ) -> dict[str, Any]:
        ids = EXPECTED_IDS[track]
        expected_id = ids[index]
        progress = clip_progress(index, len(ids), fraction)
        selector = f'[data-cake-bookend="{track}"]'
        self.set_progress(page, selector, progress)
        try:
            page.wait_for_function(
                """({selector, clip}) => {
                  const scene = document.querySelector(selector);
                  const runtime = window.__cakeStudioBookends;
                  const unit = runtime?.units?.find(item => item.trackName === scene?.dataset.bookendTrack);
                  const video = unit?.active?.video;
                  const target = Number.parseFloat(scene?.dataset.sequenceTargetTime || '-1');
                  const painted = Number.parseFloat(scene?.dataset.sequenceTime || '-9');
                  return scene?.dataset.sequenceMode === 'motion'
                    && scene?.dataset.sequenceState === 'ready'
                    && scene?.dataset.sequenceClip === clip
                    && scene.classList.contains('sequence-painted')
                    && video?.readyState >= 2
                    && !video.seeking
                    && video.dataset.sequenceClip === clip
                    && Math.abs(painted - target) <= .05;
                }""",
                arg={"selector": selector, "clip": expected_id},
                timeout=30_000,
            )
        except TimeoutError:
            detail = page.locator(selector).evaluate(
                """scene => {
                  const unit = window.__cakeStudioBookends?.units?.find(
                    item => item.trackName === scene.dataset.bookendTrack
                  );
                  const video = unit?.active?.video;
                  return {
                    mode: scene.dataset.sequenceMode || '',
                    state: scene.dataset.sequenceState || '',
                    clip: scene.dataset.sequenceClip || '',
                    index: scene.dataset.sequenceIndex || '',
                    target: scene.dataset.sequenceTargetTime || '',
                    painted: scene.dataset.sequenceTime || '',
                    className: scene.className,
                    videoClip: video?.dataset.sequenceClip || '',
                    currentTime: video?.currentTime,
                    duration: video?.duration,
                    readyState: video?.readyState,
                    seeking: video?.seeking,
                    error: video?.error?.message || '',
                  };
                }"""
            )
            raise RuntimeError(
                f"{track} {expected_id} at {fraction:.3f} did not paint: "
                + json.dumps(detail, ensure_ascii=False, sort_keys=True)
            )
        # The poster is the fail-safe while a new paused video frame decodes.
        # Local disk usually resolves it before the canvas, but a cold public
        # CDN does not.  Grade the fallback only after the currently selected
        # endpoint has decoded instead of racing it with an arbitrary sleep.
        page.wait_for_function(
            """selector => {
              const poster = document.querySelector(selector)
                ?.querySelector('[data-bookend-poster]');
              return Boolean(
                poster?.complete
                && poster.naturalWidth === 1280
                && poster.naturalHeight === 720
              );
            }""",
            arg=selector,
            timeout=15_000,
        )
        page.wait_for_timeout(40)
        return self.capture_bookend(page, track)

    @staticmethod
    def capture_bookend(page: Page, track: str) -> dict[str, Any]:
        selector = f'[data-cake-bookend="{track}"]'
        capture = page.locator(selector).evaluate(
            f"""scene => {{
              const unit = window.__cakeStudioBookends.units.find(
                item => item.trackName === scene.dataset.bookendTrack
              );
              const canvas = unit.canvas;
              const video = unit.active?.video;
              const poster = unit.poster;
              const aperture = scene.querySelector('.bookend-aperture');
              const canvasStyle = getComputedStyle(canvas);
              const posterStyle = getComputedStyle(poster);
              const apertureRect = aperture.getBoundingClientRect();
              const makeProbe = source => {{
                const probe = document.createElement('canvas');
                probe.width = {PROBE_WIDTH};
                probe.height = {PROBE_HEIGHT};
                probe.getContext('2d', {{alpha: false}}).drawImage(
                  source, 0, 0, probe.width, probe.height
                );
                return probe.toDataURL('image/png');
              }};
              return {{
                track: unit.trackName,
                clip: scene.dataset.sequenceClip || '',
                index: Number(scene.dataset.sequenceIndex || 0),
                fraction: Number(scene.dataset.sequenceFraction || 0),
                targetTime: Number(scene.dataset.sequenceTargetTime || 0),
                paintedTime: Number(scene.dataset.sequenceTime || -1),
                mode: scene.dataset.sequenceMode || '',
                state: scene.dataset.sequenceState || '',
                painted: scene.classList.contains('sequence-painted'),
                canvasData: makeProbe(canvas),
                videoData: makeProbe(video),
                canvas: {{
                  width: canvas.width,
                  height: canvas.height,
                  display: canvasStyle.display,
                  opacity: Number.parseFloat(canvasStyle.opacity),
                  fit: canvasStyle.objectFit,
                }},
                poster: {{
                  width: poster.naturalWidth,
                  height: poster.naturalHeight,
                  opacity: Number.parseFloat(posterStyle.opacity),
                  fit: posterStyle.objectFit,
                }},
                aperture: {{
                  left: apertureRect.left,
                  top: apertureRect.top,
                  right: apertureRect.right,
                  bottom: apertureRect.bottom,
                  width: apertureRect.width,
                  height: apertureRect.height,
                }},
                video: {{
                  width: video.videoWidth,
                  height: video.videoHeight,
                  duration: video.duration,
                  currentTime: video.currentTime,
                  paused: video.paused,
                  seeking: video.seeking,
                  readyState: video.readyState,
                  seekable: video.seekable.length,
                  src: video.currentSrc,
                }},
              }};
            }}"""
        )
        capture["canvasBytes"] = data_url_bytes(capture.pop("canvasData"))
        capture["videoBytes"] = data_url_bytes(capture.pop("videoData"))
        return capture

    @staticmethod
    def fetch_endpoint(page: Page, relative: str) -> bytes:
        data_url = page.evaluate(
            f"""async relative => {{
              const response = await fetch(relative, {{cache: 'no-cache'}});
              if (!response.ok) throw new Error(`endpoint HTTP ${{response.status}}: ${{relative}}`);
              const bitmap = await createImageBitmap(await response.blob());
              const canvas = document.createElement('canvas');
              canvas.width = {PROBE_WIDTH};
              canvas.height = {PROBE_HEIGHT};
              canvas.getContext('2d', {{alpha: false}}).drawImage(
                bitmap, 0, 0, canvas.width, canvas.height
              );
              bitmap.close();
              return canvas.toDataURL('image/png');
            }}""",
            relative,
        )
        return data_url_bytes(data_url)

    def check_canvas_capture(
        self,
        label: str,
        capture: dict[str, Any],
        profile: Profile,
    ) -> tuple[float, float]:
        canvas_bytes = capture["canvasBytes"]
        video_bytes = capture["videoBytes"]
        ssim, mae = similarity(canvas_bytes, video_bytes)
        mean, spread = frame_energy(canvas_bytes)
        aperture = capture["aperture"]
        visible = (
            capture["painted"]
            and capture["mode"] == "motion"
            and capture["state"] == "ready"
            and capture["canvas"]["display"] != "none"
            and capture["canvas"]["opacity"] >= 0.99
            and capture["poster"]["opacity"] <= 0.01
            and capture["canvas"]["fit"] == "contain"
            and capture["poster"]["fit"] == "contain"
            and capture["canvas"]["width"] == 1280
            and capture["canvas"]["height"] == 720
            and capture["poster"]["width"] == 1280
            and capture["poster"]["height"] == 720
            and aperture["left"] >= -1
            and aperture["right"] <= profile.width + 1
            and aperture["top"] >= -1
            and aperture["bottom"] <= profile.height + 1
            and abs(aperture["width"] / aperture["height"] - 16 / 9) <= 0.01
            and capture["video"]["width"] == 1280
            and capture["video"]["height"] == 720
            and abs(capture["video"]["duration"] - 5) <= 0.08
            and capture["video"]["paused"]
            and not capture["video"]["seeking"]
            and capture["video"]["readyState"] >= 2
            and capture["video"]["seekable"] >= 1
            and abs(capture["paintedTime"] - capture["targetTime"]) <= 0.05
        )
        self.check(
            f"{label} visible decoded canvas",
            visible and spread >= 2.0,
            {
                "clip": capture["clip"],
                "target": round(capture["targetTime"], 4),
                "painted": round(capture["paintedTime"], 4),
                "canvas": capture["canvas"],
                "poster": capture["poster"],
                "aperture": aperture,
                "video": capture["video"],
                "pixelMean": round(mean, 3),
                "pixelStdDev": round(spread, 3),
            },
            kind="render",
        )
        self.check(
            f"{label} canvas equals decoded video",
            ssim >= CANVAS_MIN_SSIM and mae <= CANVAS_MAX_MAE,
            f"SSIM={ssim:.6f} MAE={mae:.3f}",
            kind="pixel",
        )
        return ssim, mae

    def full_cinema_pass(
        self,
        page: Page,
        profile: Profile,
        context: BrowserContext,
        events: dict[str, Any],
    ) -> dict[str, Any]:
        assert self.manifest is not None
        endpoint_frames: dict[str, bytes] = {}
        for track in ("intro", "outro"):
            for clip in self.manifest["tracks"][track]["clips"]:
                for relative in (clip["first"], clip["last"]):
                    if relative not in endpoint_frames:
                        endpoint_frames[relative] = self.fetch_endpoint(page, relative)
        self.check(
            "browser decoded all 17 endpoint stills",
            len(endpoint_frames) == 17,
            sorted(endpoint_frames),
            kind="anchor",
        )

        starts: dict[str, bytes] = {}
        ends: dict[str, bytes] = {}
        forward_middle: dict[str, bytes] = {}
        frame_report: dict[str, Any] = {}
        media_dir = self.output / "decoded-clip-probes"
        media_dir.mkdir(parents=True, exist_ok=True)

        for track in ("intro", "outro"):
            ids = EXPECTED_IDS[track]
            manifest_clips = self.manifest["tracks"][track]["clips"]
            for index, clip_id in enumerate(ids):
                clip = manifest_clips[index]
                start = self.seek_bookend(page, track, index, 0.002)
                self.check_canvas_capture(
                    f"desktop forward {clip_id} first", start, profile
                )
                start_anchor_ssim, start_anchor_mae = similarity(
                    start["canvasBytes"], endpoint_frames[clip["first"]]
                )
                self.check(
                    f"{clip_id} browser first endpoint",
                    start_anchor_ssim >= ANCHOR_MIN_SSIM
                    and start_anchor_mae <= ANCHOR_MAX_MAE,
                    f"SSIM={start_anchor_ssim:.6f} MAE={start_anchor_mae:.3f}",
                    kind="anchor",
                )
                starts[clip_id] = start["canvasBytes"]

                middle = self.seek_bookend(page, track, index, 0.4)
                self.check_canvas_capture(
                    f"desktop forward {clip_id} middle", middle, profile
                )
                forward_middle[clip_id] = middle["canvasBytes"]
                (media_dir / f"{clip_id}-middle.png").write_bytes(middle["canvasBytes"])

                end = self.seek_bookend(page, track, index, 0.999)
                self.check_canvas_capture(
                    f"desktop forward {clip_id} last", end, profile
                )
                end_anchor_ssim, end_anchor_mae = similarity(
                    end["canvasBytes"], endpoint_frames[clip["last"]]
                )
                self.check(
                    f"{clip_id} browser last endpoint",
                    end_anchor_ssim >= ANCHOR_MIN_SSIM
                    and end_anchor_mae <= ANCHOR_MAX_MAE,
                    f"SSIM={end_anchor_ssim:.6f} MAE={end_anchor_mae:.3f}",
                    kind="anchor",
                )
                ends[clip_id] = end["canvasBytes"]
                frame_report[clip_id] = {
                    "first": {
                        "ssim": start_anchor_ssim,
                        "mae": start_anchor_mae,
                        "digest": frame_digest(start["canvasBytes"]),
                    },
                    "middle": {"digest": frame_digest(middle["canvasBytes"])},
                    "last": {
                        "ssim": end_anchor_ssim,
                        "mae": end_anchor_mae,
                        "digest": frame_digest(end["canvasBytes"]),
                    },
                }

        reverse_metrics: dict[str, Any] = {}
        for track in ("outro", "intro"):
            ids = EXPECTED_IDS[track]
            for index in reversed(range(len(ids))):
                clip_id = ids[index]
                reverse = self.seek_bookend(page, track, index, 0.4)
                self.check_canvas_capture(
                    f"desktop reverse {clip_id} middle", reverse, profile
                )
                ssim, mae = similarity(reverse["canvasBytes"], forward_middle[clip_id])
                same_digest = frame_digest(reverse["canvasBytes"]) == frame_digest(
                    forward_middle[clip_id]
                )
                self.check(
                    f"{clip_id} forward reverse deterministic",
                    same_digest
                    or (ssim >= DETERMINISTIC_MIN_SSIM and mae <= DETERMINISTIC_MAX_MAE),
                    f"digest_equal={str(same_digest).lower()} SSIM={ssim:.6f} MAE={mae:.3f}",
                    kind="determinism",
                )
                reverse_metrics[clip_id] = {
                    "digestEqual": same_digest,
                    "ssim": ssim,
                    "mae": mae,
                }

        join_report: dict[str, Any] = {}
        for left, right in expected_joins():
            ssim, mae = similarity(ends[left], starts[right])
            self.check(
                f"decoded browser join {left}->{right}",
                ssim >= JOIN_MIN_SSIM and mae <= JOIN_MAX_MAE,
                f"SSIM={ssim:.6f} MAE={mae:.3f}",
                kind="join",
            )
            join_report[f"{left}->{right}"] = {"ssim": ssim, "mae": mae}

        # Probe frame 50 first. It has no forward-neighbour preload; probing
        # frame 1 last lets the unchanged reel's CST-002 preload finish instead
        # of aborting it through an artificial verifier-only 1 -> 50 jump.
        cst050 = self.capture_core_frame(page, 50, 0.999)
        ssim, mae = similarity(cst050, starts["O01"])
        self.check(
            "decoded browser join CST-050->O01",
            ssim >= JOIN_MIN_SSIM and mae <= JOIN_MAX_MAE,
            f"SSIM={ssim:.6f} MAE={mae:.3f}",
            kind="join",
        )
        join_report["CST-050->O01"] = {"ssim": ssim, "mae": mae}

        cst001 = self.capture_core_frame(page, 1, 0.001)
        ssim, mae = similarity(ends["I10"], cst001)
        self.check(
            "decoded browser join I10->CST-001",
            ssim >= JOIN_MIN_SSIM and mae <= JOIN_MAX_MAE,
            f"SSIM={ssim:.6f} MAE={mae:.3f}",
            kind="join",
        )
        join_report["I10->CST-001"] = {"ssim": ssim, "mae": mae}

        self.check(
            "all 15 decoded browser joins measured",
            len(join_report) == 15,
            sorted(join_report),
            kind="join",
        )
        stale_report = self.idle_reentry_pass(page, profile)
        transport_report = self.transport_pass(context)
        network_report = self.motion_network_pass(page, events)
        return {
            "frames": frame_report,
            "reverse": reverse_metrics,
            "joins": join_report,
            "idleReentry": stale_report,
            "transport": transport_report,
            "network": network_report,
        }

    def capture_core_frame(self, page: Page, shot: int, fraction: float) -> bytes:
        progress = page.evaluate(
            "([shot, fraction]) => window.__cakeStudioDirector.progressForShot(shot, fraction)",
            [shot, fraction],
        )
        self.set_progress(page, "#cake-reel", progress)
        try:
            page.wait_for_function(
                """({shot, fraction}) => {
                  const scene = document.getElementById('cake-reel');
                  const video = scene?.querySelector('.film-frame video.on');
                  if (scene?.dataset.currentShot !== String(shot)
                    || !video || video.readyState < 2 || video.seeking) return false;
                  const target = Math.min(video.duration - .04, Math.max(0, fraction * video.duration));
                  if (!video.paused || Math.abs(video.currentTime - target) > .20) return false;
                  // `readyState` and `currentTime` can advance one task before
                  // Chromium exposes the newly decoded paused frame to canvas.
                  // Poll the delivered pixels so a transient black surface can
                  // never masquerade as the CST-001/CST-050 boundary.
                  const proof = document.createElement('canvas');
                  proof.width = 32;
                  proof.height = 18;
                  const context = proof.getContext('2d', {alpha: false});
                  try { context.drawImage(video, 0, 0, proof.width, proof.height); }
                  catch { return false; }
                  const pixels = context.getImageData(0, 0, proof.width, proof.height).data;
                  let sum = 0;
                  let sumSquares = 0;
                  let count = 0;
                  for (let index = 0; index < pixels.length; index += 4) {
                    const value = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
                    sum += value;
                    sumSquares += value * value;
                    count += 1;
                  }
                  const mean = sum / count;
                  const variance = Math.max(0, sumSquares / count - mean * mean);
                  return mean > 2 && variance > 4;
                }""",
                arg={"shot": shot, "fraction": fraction},
                timeout=30_000,
            )
        except TimeoutError:
            detail = page.locator("#cake-reel").evaluate(
                """scene => {
                  const video = scene.querySelector('.film-frame video.on');
                  return {
                    shot: scene.dataset.currentShot || '',
                    clip: scene.dataset.currentClip || '',
                    state: scene.dataset.mediaState || '',
                    camera: scene.dataset.cameraState || '',
                    currentTime: video?.currentTime,
                    duration: video?.duration,
                    readyState: video?.readyState,
                    seeking: video?.seeking,
                    paused: video?.paused,
                  };
                }"""
            )
            raise RuntimeError(
                f"CST-{shot:03d} boundary did not decode: "
                + json.dumps(detail, ensure_ascii=False, sort_keys=True)
            )
        data_url = page.locator("#cake-reel .film-frame video.on").evaluate(
            f"""video => {{
              const canvas = document.createElement('canvas');
              canvas.width = {PROBE_WIDTH};
              canvas.height = {PROBE_HEIGHT};
              canvas.getContext('2d', {{alpha: false}}).drawImage(
                video, 0, 0, canvas.width, canvas.height
              );
              return canvas.toDataURL('image/png');
            }}"""
        )
        return data_url_bytes(data_url)

    def idle_reentry_pass(self, page: Page, profile: Profile) -> dict[str, Any]:
        before = self.seek_bookend(page, "intro", 2, 0.4)
        before_digest = frame_digest(before["canvasBytes"])
        hidden = page.locator('[data-cake-bookend="intro"]').evaluate(
            """scene => {
              scene.dispatchEvent(new CustomEvent('scene:idle'));
              const canvas = scene.querySelector('[data-bookend-canvas]');
              const poster = scene.querySelector('[data-bookend-poster]');
              return {
                painted: scene.classList.contains('sequence-painted'),
                hasTime: Object.hasOwn(scene.dataset, 'sequenceTime'),
                canvasOpacity: Number.parseFloat(getComputedStyle(canvas).opacity),
                posterOpacity: Number.parseFloat(getComputedStyle(poster).opacity),
                clip: scene.dataset.sequenceClip || '',
              };
            }"""
        )
        self.check(
            "idle hides the last decoded canvas",
            not hidden["painted"]
            and not hidden["hasTime"]
            and hidden["canvasOpacity"] <= 0.01
            and hidden["posterOpacity"] >= 0.99,
            hidden,
            kind="stale",
        )

        immediate = page.locator('[data-cake-bookend="intro"]').evaluate(
            """scene => {
              scene.style.setProperty('--p', '0.74');
              scene.dispatchEvent(new CustomEvent('scene:live'));
              const canvas = scene.querySelector('[data-bookend-canvas]');
              const poster = scene.querySelector('[data-bookend-poster]');
              return {
                painted: scene.classList.contains('sequence-painted'),
                hasTime: Object.hasOwn(scene.dataset, 'sequenceTime'),
                canvasOpacity: Number.parseFloat(getComputedStyle(canvas).opacity),
                posterOpacity: Number.parseFloat(getComputedStyle(poster).opacity),
                clip: scene.dataset.sequenceClip || '',
              };
            }"""
        )
        self.check(
            "reentry does not expose a stale clip",
            immediate["clip"] == "I08"
            and not immediate["painted"]
            and not immediate["hasTime"]
            and immediate["canvasOpacity"] <= 0.01
            and immediate["posterOpacity"] >= 0.99,
            immediate,
            kind="stale",
        )
        page.wait_for_function(
            """() => {
              const scene = document.querySelector('[data-cake-bookend="intro"]');
              const target = Number.parseFloat(scene?.dataset.sequenceTargetTime || '-1');
              const painted = Number.parseFloat(scene?.dataset.sequenceTime || '-9');
              return scene?.dataset.sequenceClip === 'I08'
                && scene.classList.contains('sequence-painted')
                && Math.abs(target - painted) <= .05;
            }""",
            timeout=30_000,
        )
        after = self.capture_bookend(page, "intro")
        self.check_canvas_capture("desktop reentry I08", after, profile)
        after_digest = frame_digest(after["canvasBytes"])
        self.check(
            "reentry replaces stale pixels",
            after_digest != before_digest,
            {"before": before_digest, "after": after_digest},
            kind="stale",
        )
        return {
            "hidden": hidden,
            "immediate": immediate,
            "beforeDigest": before_digest,
            "afterDigest": after_digest,
        }

    def transport_pass(self, context: BrowserContext) -> dict[str, Any]:
        assert self.manifest is not None
        results: dict[str, Any] = {}
        for track in ("intro", "outro"):
            for clip in self.manifest["tracks"][track]["clips"]:
                url = urljoin(self.url, clip["src"])
                response = context.request.get(
                    url,
                    headers={"Range": "bytes=0-1023"},
                    timeout=30_000,
                )
                headers = {key.lower(): value for key, value in response.headers.items()}
                detail = {
                    "status": response.status,
                    "contentRange": headers.get("content-range", ""),
                    "acceptRanges": headers.get("accept-ranges", ""),
                    "contentType": headers.get("content-type", ""),
                    "bytes": len(response.body()),
                }
                passed = (
                    response.status == 206
                    and detail["contentRange"].startswith("bytes 0-1023/")
                    and detail["acceptRanges"].lower() == "bytes"
                    and detail["contentType"].lower().startswith("video/mp4")
                    and detail["bytes"] == 1024
                )
                self.check(
                    f"{clip['id']} explicit byte range",
                    passed,
                    detail,
                    kind="transport",
                )
                results[clip["id"]] = detail
                response.dispose()
        self.check(
            "15 explicit 206 byte-range probes",
            len(results) == 15,
            sorted(results),
            kind="transport",
        )
        return results

    def motion_network_pass(self, page: Page, events: dict[str, Any]) -> dict[str, Any]:
        state = page.evaluate(
            """() => ({
              playAttempts: window.__cakeV17PlayAttempts || [],
              drawAttempts: window.__cakeV17DrawAttempts || 0,
              frozenDraws: window.__cakeV17FrozenDraws || 0,
            })"""
        )
        response_ids: set[str] = set()
        request_ids: set[str] = set()
        good_response_ids: set[str] = set()
        for request in events["media_requests"]:
            name = Path(urlsplit(request["url"]).path).stem
            clip_id = name.removeprefix("CST17-")
            if clip_id in EXPECTED_CLIP_IDS:
                request_ids.add(clip_id)
        for response in events["media_responses"]:
            name = Path(urlsplit(response["url"]).path).stem
            clip_id = name.removeprefix("CST17-")
            if clip_id not in EXPECTED_CLIP_IDS:
                continue
            response_ids.add(clip_id)
            if (
                response["status"] == 206
                and response["range"].lower().startswith("bytes=")
                and response["acceptRanges"].lower() == "bytes"
                and response["contentRange"].lower().startswith("bytes ")
                and response["contentType"].lower().startswith("video/mp4")
            ):
                good_response_ids.add(clip_id)
        self.check(
            "active browser requested all 15 clips",
            request_ids == set(EXPECTED_CLIP_IDS),
            sorted(request_ids),
            kind="network",
        )
        self.check(
            "active browser received 206 ranges for all 15 clips",
            good_response_ids == set(EXPECTED_CLIP_IDS),
            {
                "good": sorted(good_response_ids),
                "responded": sorted(response_ids),
            },
            kind="network",
        )
        self.check(
            "runtime never calls media play",
            not state["playAttempts"],
            state["playAttempts"],
            kind="network",
        )
        self.check(
            "runtime committed decoded canvas draws",
            state["drawAttempts"] >= 45,
            state,
            kind="pixel",
        )
        self.check(
            "desktop motion has no browser errors",
            not events["console_errors"]
            and not events["page_errors"]
            and not events["request_failures"]
            and not events["http_errors"],
            {
                "console": events["console_errors"],
                "page": events["page_errors"],
                "request": events["request_failures"],
                "http": events["http_errors"],
            },
            kind="network",
        )
        return {"events": events, "state": state}

    def language_layout_pass(
        self,
        page: Page,
        profile: Profile,
        language: str,
        track: str,
        *,
        reduced: bool,
    ) -> dict[str, Any]:
        self.set_language(page, language)
        if reduced:
            index = 0 if track == "intro" else len(EXPECTED_IDS[track]) - 1
            fraction = 0.0 if track == "intro" else 0.99
            self.set_progress(
                page,
                f'[data-cake-bookend="{track}"]',
                clip_progress(index, len(EXPECTED_IDS[track]), fraction),
            )
            page.wait_for_function(
                """track => {
                  const poster = document.querySelector(
                    `[data-cake-bookend="${track}"] [data-bookend-poster]`
                  );
                  return Boolean(
                    poster?.complete
                    && poster.naturalWidth === 1280
                    && poster.naturalHeight === 720
                  );
                }""",
                arg=track,
                timeout=8_000,
            )
        else:
            index = 4 if track == "intro" else 2
            capture = self.seek_bookend(page, track, index, 0.4)
            self.check_canvas_capture(
                f"{profile.name} {language} {track}", capture, profile
            )

        info = page.locator(f'[data-cake-bookend="{track}"]').evaluate(
            """(scene, language) => {
              const aperture = scene.querySelector('.bookend-aperture');
              const poster = scene.querySelector('[data-bookend-poster]');
              const canvas = scene.querySelector('[data-bookend-canvas]');
              const ar = aperture.getBoundingClientRect();
              const posterStyle = getComputedStyle(poster);
              const canvasStyle = getComputedStyle(canvas);
              const visible = node => {
                const style = getComputedStyle(node);
                const rect = node.getBoundingClientRect();
                return style.display !== 'none' && style.visibility !== 'hidden'
                  && Number.parseFloat(style.opacity || '1') > 0
                  && rect.width > 0 && rect.height > 0;
              };
              const sourceWidth = poster.naturalWidth;
              const sourceHeight = poster.naturalHeight;
              const scale = posterStyle.objectFit === 'cover'
                ? Math.max(ar.width / sourceWidth, ar.height / sourceHeight)
                : Math.min(ar.width / sourceWidth, ar.height / sourceHeight);
              const visibleWidth = Math.min(sourceWidth, ar.width / scale);
              const visibleHeight = Math.min(sourceHeight, ar.height / scale);
              return {
                lang: document.documentElement.lang,
                dir: document.documentElement.dir,
                mode: scene.dataset.sequenceMode || '',
                state: scene.dataset.sequenceState || '',
                painted: scene.classList.contains('sequence-painted'),
                selectedCopy: [...scene.querySelectorAll(`.L.${language}`)].filter(visible).length,
                rejectedCopy: [...scene.querySelectorAll(`.L.${language === 'ar' ? 'en' : 'ar'}`)].filter(visible).length,
                aperture: {left: ar.left, top: ar.top, right: ar.right, bottom: ar.bottom, width: ar.width, height: ar.height},
                ratio: ar.width / ar.height,
                areaFraction: (ar.width * ar.height) / (innerWidth * innerHeight),
                poster: {
                  fit: posterStyle.objectFit,
                  opacity: Number.parseFloat(posterStyle.opacity),
                  width: sourceWidth,
                  height: sourceHeight,
                  visibleFraction: (visibleWidth * visibleHeight) / (sourceWidth * sourceHeight),
                },
                canvas: {
                  fit: canvasStyle.objectFit,
                  opacity: Number.parseFloat(canvasStyle.opacity),
                  display: canvasStyle.display,
                  width: canvas.width,
                  height: canvas.height,
                },
                overflow: document.documentElement.scrollWidth - innerWidth,
              };
            }""",
            language,
        )
        aperture = info["aperture"]
        expected_mode = "still" if reduced else "motion"
        expected_state = "reduced-motion" if reduced else "ready"
        passed = (
            info["lang"] == language
            and info["dir"] == ("rtl" if language == "ar" else "ltr")
            and info["mode"] == expected_mode
            and info["state"] == expected_state
            and info["selectedCopy"] >= 3
            and info["rejectedCopy"] == 0
            and aperture["left"] >= -1
            and aperture["right"] <= profile.width + 1
            and aperture["top"] >= -1
            and aperture["bottom"] <= profile.height + 1
            and abs(info["ratio"] - 16 / 9) <= 0.01
            and info["areaFraction"] >= profile.minimum_aperture_area
            and info["poster"]["fit"] == "contain"
            and info["canvas"]["fit"] == "contain"
            and info["poster"]["width"] == 1280
            and info["poster"]["height"] == 720
            and info["poster"]["visibleFraction"] >= 0.95
            and info["canvas"]["width"] == 1280
            and info["canvas"]["height"] == 720
            and info["overflow"] <= 1
        )
        if reduced:
            passed = passed and (
                not info["painted"]
                and info["canvas"]["display"] == "none"
                and info["poster"]["opacity"] >= 0.99
            )
        else:
            passed = passed and (
                info["painted"]
                and info["canvas"]["display"] != "none"
                and info["canvas"]["opacity"] >= 0.99
                and info["poster"]["opacity"] <= 0.01
            )
        self.check(
            f"{profile.name} {language} {track} uncropped language parity",
            passed,
            info,
            kind="presentation",
        )
        screenshot_path = self.output / f"{profile.name}-{language}-{track}.png"
        page.screenshot(path=str(screenshot_path), full_page=False)
        self.screenshots.append(
            (f"{profile.name} / {language.upper()} / {track}", screenshot_path)
        )
        return info

    def run_motion_profile(
        self,
        browser: Browser,
        profile: Profile,
        *,
        full_cinema: bool,
        existing: tuple[BrowserContext, Page, dict[str, Any]] | None = None,
    ) -> None:
        if existing is None:
            context = self.make_context(browser, profile)
            page, events = self.open_page(context, profile)
        else:
            context, page, events = existing
        try:
            report: dict[str, Any] = {}
            if full_cinema:
                report["cinema"] = self.full_cinema_pass(
                    page, profile, context, events
                )
            languages: dict[str, Any] = {}
            for language in ("en", "ar"):
                languages[language] = {
                    track: self.language_layout_pass(
                        page, profile, language, track, reduced=False
                    )
                    for track in ("intro", "outro")
                }
            report["languages"] = languages
            if not full_cinema:
                state = page.evaluate(
                    """() => ({
                      playAttempts: window.__cakeV17PlayAttempts || [],
                      drawAttempts: window.__cakeV17DrawAttempts || 0,
                    })"""
                )
                self.check(
                    f"{profile.name} never calls media play",
                    not state["playAttempts"],
                    state,
                    kind="network",
                )
                self.check(
                    f"{profile.name} has no browser errors",
                    not events["console_errors"]
                    and not events["page_errors"]
                    and not events["request_failures"]
                    and not events["http_errors"],
                    events,
                    kind="network",
                )
                report["network"] = {"events": events, "state": state}
            self.profile_reports[profile.name] = report
        finally:
            context.close()

    def run_reduced_profile(self, browser: Browser, profile: Profile) -> None:
        context = self.make_context(browser, profile)
        try:
            page, events = self.open_page(context, profile)
            state = page.evaluate(
                """() => ({
                  runtime: window.__cakeStudioBookends?.state || 'missing',
                  manifestReady: window.__cakeStudioBookends?.manifestReady,
                  slots: [...document.querySelectorAll('.bookend-buffer')].map(video => ({
                    src: video.getAttribute('src') || '',
                    currentSrc: video.currentSrc || '',
                    readyState: video.readyState,
                  })),
                })"""
            )
            self.check(
                f"{profile.name} ready runtime uses still mode",
                state["runtime"] == "ready"
                and state["manifestReady"] is True
                and len(state["slots"]) == 4
                and all(not slot["src"] and not slot["currentSrc"] for slot in state["slots"]),
                state,
                kind="reduced",
            )
            languages: dict[str, Any] = {}
            for language in ("en", "ar"):
                languages[language] = {
                    track: self.language_layout_pass(
                        page, profile, language, track, reduced=True
                    )
                    for track in ("intro", "outro")
                }
            after = page.evaluate(
                """() => ({
                  playAttempts: window.__cakeV17PlayAttempts || [],
                  slots: [...document.querySelectorAll('.bookend-buffer')].map(video => ({
                    src: video.getAttribute('src') || '',
                    currentSrc: video.currentSrc || '',
                    readyState: video.readyState,
                  })),
                })"""
            )
            no_media = (
                not events["media_requests"]
                and not events["media_responses"]
                and not after["playAttempts"]
                and all(not slot["src"] and not slot["currentSrc"] for slot in after["slots"])
            )
            self.check(
                f"{profile.name} requests zero v1.7 MP4",
                no_media,
                {"requests": events["media_requests"], "responses": events["media_responses"], **after},
                kind="reduced",
            )
            self.check(
                f"{profile.name} has no browser errors",
                not events["console_errors"]
                and not events["page_errors"]
                and not events["request_failures"]
                and not events["http_errors"],
                events,
                kind="network",
            )
            self.profile_reports[profile.name] = {
                "initial": state,
                "languages": languages,
                "network": {"events": events, "state": after},
            }
        finally:
            context.close()

    def build_contact_sheet(self) -> Path | None:
        if not self.screenshots:
            return None
        tile_width = 440
        tile_height = 340
        columns = 2
        rows = math.ceil(len(self.screenshots) / columns)
        sheet = Image.new("RGB", (columns * tile_width, rows * tile_height), "#07110f")
        draw = ImageDraw.Draw(sheet)
        for index, (label, path) in enumerate(self.screenshots):
            image = Image.open(path).convert("RGB")
            image.thumbnail((tile_width - 20, tile_height - 42))
            x = (index % columns) * tile_width + (tile_width - image.width) // 2
            row_y = (index // columns) * tile_height
            y = row_y + 30 + (tile_height - 36 - image.height) // 2
            sheet.paste(image, (x, y))
            draw.text(
                ((index % columns) * tile_width + 10, row_y + 8),
                label,
                fill="#f0dfc7",
            )
        path = self.output / "contact-sheet.jpg"
        sheet.save(path, quality=91, optimize=True)
        return path

    def finish(self) -> int:
        contact_sheet = self.build_contact_sheet()
        if contact_sheet is not None:
            self.check(
                "rendered contact sheet written",
                contact_sheet.is_file(),
                str(contact_sheet),
            )
        if self.sabotage == SABOTAGE_FREEZE:
            sensitive = [
                check
                for check in self.checks
                if check["kind"] == "pixel" and not check["pass"]
            ]
            self.check(
                "freeze-draw sabotage tripped decoded pixel gate",
                bool(sensitive),
                [check["name"] for check in sensitive[:8]],
                kind="sabotage",
            )
        elif self.sabotage == SABOTAGE_ENDPOINT:
            sensitive = [
                check
                for check in self.checks
                if check["kind"] == "anchor" and not check["pass"]
            ]
            self.check(
                "wrong-endpoint sabotage was served",
                self.endpoint_sabotage_hits > 0,
                f"hits={self.endpoint_sabotage_hits}",
                kind="sabotage",
            )
            self.check(
                "wrong-endpoint sabotage tripped anchor gate",
                bool(sensitive),
                [check["name"] for check in sensitive[:8]],
                kind="sabotage",
            )

        report = {
            "schema": "cake-studio-v17-browser-ready/v1",
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "url": self.url,
            "sabotage": self.sabotage,
            "checks": self.checks,
            "failures": self.failures,
            "profiles": self.profile_reports,
            "screenshots": [str(path) for _, path in self.screenshots],
            "contactSheet": str(contact_sheet) if contact_sheet else None,
        }
        suffix = f"-{self.sabotage}" if self.sabotage else ""
        report_path = self.output / f"report{suffix}.json"
        report_path.write_text(
            json.dumps(report, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        if self.failures:
            print(
                f"CAKE_STUDIO_V17_BROWSER_READY_FAIL failures={len(self.failures)} "
                f"checks={len(self.checks)} report={report_path}",
                file=sys.stderr,
            )
            return 1
        print(
            f"CAKE_STUDIO_V17_BROWSER_READY_OK checks={len(self.checks)} "
            f"profiles={len(self.profile_reports)} screenshots={len(self.screenshots)} "
            f"report={report_path} contact={contact_sheet}"
        )
        return 0

    def run(self, playwright: Any) -> int:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            context = self.make_context(browser, DESKTOP_MOTION)
            page, events = self.open_page(context, DESKTOP_MOTION)
            ready, state = self.preflight(page)
            if not ready:
                self.profile_reports["preflight"] = state
                context.close()
                return self.finish()
            self.run_motion_profile(
                browser,
                DESKTOP_MOTION,
                full_cinema=True,
                existing=(context, page, events),
            )
            self.run_motion_profile(browser, PHONE_MOTION, full_cinema=False)
            for profile in REDUCED_PROFILES:
                self.run_reduced_profile(browser, profile)
            return self.finish()
        except Exception as error:  # fail closed with a durable report, not a traceback-only result
            self.check(
                "browser verification completed",
                False,
                f"{type(error).__name__}: {error}",
                kind="runtime",
            )
            return self.finish()
        finally:
            browser.close()


def self_test() -> int:
    tests = 0

    def require(condition: bool, message: str) -> None:
        nonlocal tests
        tests += 1
        if not condition:
            raise AssertionError(message)

    require(EXPECTED_CLIP_IDS == [f"I{n:02d}" for n in range(1, 11)] + [f"O{n:02d}" for n in range(1, 6)], "clip ids")
    require(len(expected_joins()) == 13, "internal join count")
    require(clip_progress(0, 10, 0.4) == 0.04, "first clip progress")
    require(math.isclose(clip_progress(9, 10, 0.999), 0.9999), "last clip progress")
    require(without_fragment("http://x/a?b=1#c") == "http://x/a?b=1", "fragment removal")

    first = np.zeros((PROBE_HEIGHT, PROBE_WIDTH, 3), dtype=np.uint8)
    first[:, :, 1] = 96
    ok, encoded = cv2.imencode(".png", first)
    require(bool(ok), "synthetic PNG encode")
    payload = encoded.tobytes()
    ssim, mae = similarity(payload, payload)
    require(ssim >= 0.999999 and mae == 0.0, "identical similarity")
    require(frame_digest(payload) == frame_digest(payload), "deterministic digest")
    mean, spread = frame_energy(payload)
    require(mean > 0 and spread > 0, "synthetic frame energy")

    changed = first.copy()
    changed[:, : PROBE_WIDTH // 2, 2] = 255
    ok, encoded_changed = cv2.imencode(".png", changed)
    require(bool(ok), "changed PNG encode")
    changed_ssim, changed_mae = similarity(payload, encoded_changed.tobytes())
    require(changed_ssim < 0.99 and changed_mae > 1.0, "sabotage-sensitive pixels")

    data_url = "data:image/png;base64," + base64.b64encode(payload).decode("ascii")
    require(data_url_bytes(data_url) == payload, "data URL decode")
    require(
        expected_cancellation_reason("blob:http://127.0.0.1/id", "net::ERR_ABORTED")
        == "core-blob-rearm",
        "exact blob rearm cancellation",
    )
    require(
        expected_cancellation_reason(
            "blob:http://127.0.0.1/id", "net::ERR_CONTENT_LENGTH_MISMATCH"
        )
        is None,
        "blob cancellation is not broad",
    )
    require(
        expected_cancellation_reason(
            "http://127.0.0.1/ordinary.mp4", "net::ERR_ABORTED"
        )
        is None,
        "ordinary HTTP abort remains fatal",
    )
    require(
        expected_cancellation_reason(
            "http://127.0.0.1/worlds/cake-studio/v17/clips/CST17-I01.mp4",
            "net::ERR_ABORTED",
        )
        == "v17-media-rearm",
        "v17 MP4 rearm cancellation",
    )
    require(
        expected_cancellation_reason(
            "http://127.0.0.1/worlds/cake-studio/v17/stills/CST17-I00.webp",
            "net::ERR_ABORTED",
        )
        is None,
        "v17 non-MP4 abort remains fatal",
    )
    print(f"CAKE_STUDIO_V17_BROWSER_READY_SELF_TEST_OK tests={tests}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify the final ready Cake Studio v1.7 decoded bookend runtime."
    )
    parser.add_argument("--url", help="Local or public Cake Studio page URL")
    parser.add_argument("--output", type=Path, help="Proof output directory")
    parser.add_argument(
        "--sabotage",
        choices=SABOTAGE_CHOICES,
        help="Inject a non-mutating failure; the normal gate must exit nonzero",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run deterministic helper tests without opening a browser",
    )
    args = parser.parse_args()

    if args.self_test:
        return self_test()
    if not args.url or not args.output:
        parser.error("--url and --output are required unless --self-test is used")
    verification = Verification(args.url, args.output.resolve(), args.sabotage)
    with sync_playwright() as playwright:
        return verification.run(playwright)


if __name__ == "__main__":
    raise SystemExit(main())
