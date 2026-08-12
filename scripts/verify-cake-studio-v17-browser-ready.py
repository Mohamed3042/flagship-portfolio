#!/usr/bin/env python3
"""Final rendered-browser gate for the ready Cake Studio v1.7.2 bookends.

Run behind ``scripts/serve-static.mjs`` via the webapp-testing skill's
``with_server.py`` helper.  This verifier is intentionally separate from the
pending-shell gate: it fails closed until the canonical manifest is
``ready:true`` and the page points at its final cache key.

The full desktop motion pass retains the fifteen-clip canvas proof. Phone
motion proves the two persistent direct-video masters, decoded scrub atlases,
terminal landing stills, rendered pixels, logical samples, endpoint anchors,
URL isolation, and no-poster reentry. Desktop and phone reduced-motion
contexts must request zero v1.7 MP4, atlas, or terminal media.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import math
import re
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
EXPECTED_VERSION = "1.7.2"
EXPECTED_FINAL_MANIFEST = "cake-studio/v17/manifest.json?v=1.7.2-phone-final"
V17_CLIP_MARKER = "/cake-studio/v17/clips/"
PHONE_MASTER_FILES = {
    "intro": "CST17-INTRO-PHONE-v172.mp4",
    "outro": "CST17-OUTRO-PHONE-v172.mp4",
}
PHONE_MASTER_BYTES = {
    "intro": 5_091_536,
    "outro": 2_479_879,
}
PHONE_MASTER_SHA256 = {
    "intro": "6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670",
    "outro": "65e51883d99862fd86ca159bda4fd1c7bdd0f394734be422cb650516f31dca15",
}
PHONE_SCRUB_FILES = {
    "intro": "CST17-INTRO-PHONE-SCRUB-v172.webp",
    "outro": "CST17-OUTRO-PHONE-SCRUB-v172.webp",
}
PHONE_SCRUB_BYTES = {"intro": 326_692, "outro": 179_822}
PHONE_SCRUB_SHA256 = {
    "intro": "1e94474cee9abdd7e0af7ea7679d4b004cf5d3313287c06c358f4368e3c1f1c5",
    "outro": "5717337b6e0674f08f99a945fc4aa2dee69f2ab09380bdd04c2da6218a0b9c2c",
}
PHONE_SCRUB_FRAMES = {
    "intro": [
        0, 22, 44, 66, 88, 110, 133, 155, 177, 199, 221, 243, 265, 287,
        309, 331, 354, 376, 398, 420, 442, 464, 486, 508, 530, 552, 575,
        597, 619, 641, 663, 685,
    ],
    "outro": [
        0, 23, 46, 69, 92, 115, 138, 161, 184, 207, 230, 253, 276, 299,
        322, 345,
    ],
}
PHONE_TERMINAL_FILES = {
    "intro": "CST17-INTRO-PHONE-TERMINAL-v172.webp",
    "outro": "CST17-OUTRO-PHONE-TERMINAL-v172.webp",
}
PHONE_TERMINAL_BYTES = {"intro": 106_416, "outro": 91_242}
PHONE_TERMINAL_SHA256 = {
    "intro": "513bcc97d522d84cb0ead674be5aa59b8b04d8cbb62527c1e63a4d9afe1fc4ee",
    "outro": "df40c40bbaf66b867bcdb4ffc95d095f1b7d5a97f7815498f2f122ee380037eb",
}
PHONE_AUX_FILES = set(PHONE_SCRUB_FILES.values()) | set(PHONE_TERMINAL_FILES.values())
PHONE_WIDTH = 640
PHONE_HEIGHT = 360
PHONE_FPS = 15
PHONE_BEAT_FRAMES = 68
PHONE_FINAL_TAIL_EXTRA_FRAMES = 7
PHONE_TERMINAL_FRAME_OFFSET = 2
PHONE_KEYFRAME_INTERVAL = 8
PHONE_SCRUB_TILE_WIDTH = 384
PHONE_SCRUB_TILE_HEIGHT = 216
PHONE_SCRUB_QUALITY = 85
PHONE_TERMINAL_QUALITY = 100
PHONE_DISPLAY_WIDTH = 390
PHONE_DISPLAY_HEIGHT = 219
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
# Chrome's native-video compositor and Canvas readback use different YUV and
# subpixel raster paths at the 390x219.375 CSS aperture. Focused same-frame
# measurements bottomed at .823 SSIM / 6.942 MAE, while a deliberately wrong
# decoded frame measured .105 / 66.495. rVFC mediaTime independently proves
# the presented PTS, so these limits grade compositor identity without treating
# the two rasterizers as bit-equivalent.
PHONE_RENDER_MIN_SSIM = 0.800
PHONE_RENDER_MAX_MAE = 7.5
# Exact frame-0 rVFC and terminal-landing identity are checked independently.
# Focused Chromium compositor/readback measurements of those correct surfaces
# bottomed at .960219 SSIM / 3.097 MAE against the legacy 1280 endpoint stills,
# while the deliberately opposite endpoint measured about .17-.19 / 46-48.
# Grade the intended visual match and require that large wrong-frame separation;
# the MAE ceiling is tighter than the prior 7.0 allowance.
PHONE_ANCHOR_MIN_SSIM = 0.950
PHONE_ANCHOR_MAX_MAE = 4.0
PHONE_ANCHOR_MIN_SSIM_MARGIN = 0.50
PHONE_ANCHOR_MIN_MAE_MARGIN = 20.0
# The same terminal WebP decoded through an <img> versus createImageBitmap has
# a small Chromium colour-management delta (.998006 SSIM / .661 MAE measured).
PHONE_TERMINAL_IDENTITY_MIN_SSIM = 0.997
PHONE_TERMINAL_IDENTITY_MAX_MAE = 1.0
# Accepted CRF28 v1.7.2 browser-decoded joins measured a .982033 SSIM floor
# and 2.464 MAE ceiling. Keep a narrow truthful allowance while the deliberate
# wrong-frame sabotage remains far outside either boundary.
PHONE_JOIN_MIN_SSIM = 0.982
PHONE_JOIN_MAX_MAE = 2.5
PHONE_PRESENTATION_TOLERANCE = 1 / PHONE_FPS + .002

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


def normalize_probe(payload: bytes) -> bytes:
    """Resize a rendered element screenshot to the decoded 320x180 probe."""
    frame = decode_png(payload)
    resized = cv2.resize(frame, (PROBE_WIDTH, PROBE_HEIGHT), interpolation=cv2.INTER_AREA)
    ok, encoded = cv2.imencode(".png", resized)
    if not ok:
        raise ValueError("normalized phone probe could not be encoded")
    return encoded.tobytes()


def normalize_phone_join(payload: bytes) -> bytes:
    """Match the accepted phone-media gate's 390x219 display raster."""
    frame = decode_png(payload)
    resized = cv2.resize(
        frame,
        (PHONE_DISPLAY_WIDTH, PHONE_DISPLAY_HEIGHT),
        interpolation=cv2.INTER_AREA,
    )
    ok, encoded = cv2.imencode(".png", resized)
    if not ok:
        raise ValueError("normalized phone join probe could not be encoded")
    return encoded.tobytes()


def clip_progress(index: int, count: int, fraction: float) -> float:
    if index < 0 or index >= count:
        raise ValueError(f"clip index {index} outside 0..{count - 1}")
    if fraction < 0 or fraction >= 1:
        raise ValueError(f"clip fraction {fraction} outside [0,1)")
    return (index + fraction) / count


def phone_terminal_target(duration: float) -> float:
    """Visually exact I-frame with a bounded two-frame-duration EOF margin."""
    return duration - PHONE_TERMINAL_FRAME_OFFSET / PHONE_FPS


def phone_progress_target(duration: float, progress: float) -> float:
    if progress < 0 or progress > 1:
        raise ValueError(f"phone progress {progress} outside 0..1")
    return min(phone_terminal_target(duration), progress * duration)


def expected_phone_scrub_contract(track: str) -> dict[str, Any]:
    frames = PHONE_SCRUB_FRAMES[track]
    rows = 4 if track == "intro" else 2
    return {
        "src": f"cake-studio/v17/clips/{PHONE_SCRUB_FILES[track]}",
        "bytes": PHONE_SCRUB_BYTES[track],
        "sha256": PHONE_SCRUB_SHA256[track],
        "width": 8 * PHONE_SCRUB_TILE_WIDTH,
        "height": rows * PHONE_SCRUB_TILE_HEIGHT,
        "tileWidth": PHONE_SCRUB_TILE_WIDTH,
        "tileHeight": PHONE_SCRUB_TILE_HEIGHT,
        "quality": PHONE_SCRUB_QUALITY,
        "columns": 8,
        "rows": rows,
        "samples": len(frames),
        "frames": frames,
    }


def expected_phone_terminal_contract(track: str) -> dict[str, Any]:
    frame = 685 if track == "intro" else 345
    return {
        "src": f"cake-studio/v17/clips/{PHONE_TERMINAL_FILES[track]}",
        "bytes": PHONE_TERMINAL_BYTES[track],
        "sha256": PHONE_TERMINAL_SHA256[track],
        "width": PHONE_WIDTH,
        "height": PHONE_HEIGHT,
        "quality": PHONE_TERMINAL_QUALITY,
        "frame": frame,
        "time": round(frame / PHONE_FPS, 6),
    }


def phone_join_accepted(ssim: float, mae: float) -> bool:
    return ssim >= PHONE_JOIN_MIN_SSIM and mae <= PHONE_JOIN_MAX_MAE


def phone_anchor_accepted(
    correct_ssim: float,
    correct_mae: float,
    wrong_ssim: float,
    wrong_mae: float,
) -> bool:
    """Accept a compositor anchor only when the opposite endpoint is far worse."""
    return (
        correct_ssim >= PHONE_ANCHOR_MIN_SSIM
        and correct_mae <= PHONE_ANCHOR_MAX_MAE
        and correct_ssim - wrong_ssim >= PHONE_ANCHOR_MIN_SSIM_MARGIN
        and wrong_mae - correct_mae >= PHONE_ANCHOR_MIN_MAE_MARGIN
    )


def phone_presentation_matches(media_time: float, target_time: float) -> bool:
    """Accept the decoded 15 fps frame containing an arbitrary seek target."""
    return abs(media_time - target_time) <= PHONE_PRESENTATION_TOLERANCE


def expected_joins() -> list[tuple[str, str]]:
    joins = [(f"I{index:02d}", f"I{index + 1:02d}") for index in range(1, 10)]
    joins.extend((f"O{index:02d}", f"O{index + 1:02d}") for index in range(1, 5))
    return joins


def phone_transport_response_kind(response: dict[str, Any]) -> str | None:
    """Classify the two intentional v1.7.2 phone delivery modes."""
    content_type = str(response.get("contentType", "")).lower()
    if not content_type.startswith("video/mp4"):
        return None
    if (
        response.get("status") == 206
        and str(response.get("range", "")).lower().startswith("bytes=")
        and str(response.get("acceptRanges", "")).lower() == "bytes"
        and str(response.get("contentRange", "")).lower().startswith("bytes ")
    ):
        return "range"
    if response.get("status") == 200 and not response.get("range"):
        return "full-warm"
    return None


def expected_cancellation_reason(url: str, failure: str) -> str | None:
    """Classify only bounded, URL-attributed media-rearm cancellations."""
    parsed = urlsplit(url)
    local_harness = parsed.hostname in {"127.0.0.1", "localhost"}
    if parsed.scheme == "blob" and failure == "net::ERR_ABORTED":
        return "core-blob-rearm"
    if (
        V17_CLIP_MARKER in url.lower()
        and parsed.path.lower().endswith(".mp4")
        and (
            any(
                marker in failure
                for marker in ("ERR_ABORTED", "ERR_CONTENT_LENGTH_MISMATCH")
            )
            or (
                local_harness
                and failure == "net::ERR_INVALID_HTTP_RESPONSE"
            )
        )
    ):
        return (
            "v17-local-range-cancel"
            if local_harness and failure == "net::ERR_INVALID_HTTP_RESPONSE"
            else "v17-media-rearm"
        )
    if (
        local_harness
        and failure
        in {
            "net::ERR_INVALID_HTTP_RESPONSE",
            "net::ERR_CONTENT_LENGTH_MISMATCH",
        }
        and re.search(
            r"/worlds/cake-studio/clips/CST-\d{3}\.mp4$",
            parsed.path,
            re.IGNORECASE,
        )
    ):
        # The local range harness closes a canceled to-EOF response after the
        # core cinema jumps chapters. The performance gate records the same
        # exact localhost-only case as core-scene-rearm. Never exempt it on a
        # deployed host or for an arbitrary URL/error.
        return "core-local-range-cancel"
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
            "phone_asset_requests": [],
            "phone_asset_responses": [],
            "request_failures": [],
            "expected_cancellations": [],
            "http_errors": [],
        }

    def observe(self, page: Page) -> dict[str, Any]:
        events = self.new_events()

        def on_console(message: Any) -> None:
            if message.type == "error":
                if (
                    urlsplit(page.url).hostname in {"127.0.0.1", "localhost"}
                    and message.text
                    == "Failed to load resource: net::ERR_INVALID_HTTP_RESPONSE"
                ):
                    return
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
            if Path(urlsplit(url).path).name in PHONE_AUX_FILES:
                events["phone_asset_requests"].append({"url": url})

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
            if Path(urlsplit(url).path).name in PHONE_AUX_FILES:
                headers = {key.lower(): value for key, value in response.headers.items()}
                events["phone_asset_responses"].append(
                    {
                        "url": url,
                        "status": response.status,
                        "contentType": headers.get("content-type", ""),
                        "contentLength": headers.get("content-length", ""),
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
              window.__cakeV17AtlasDrawAttempts = 0;
              window.__cakeV17FrozenDraws = 0;
              window.__cakeV17FrozenAtlasDraws = 0;
              const originalPlay = HTMLMediaElement.prototype.play;
              HTMLMediaElement.prototype.play = function(...args) {{
                if (this.closest?.('[data-bookend-sequence]')) {{
                  window.__cakeV17PlayAttempts.push({{
                    className: this.className || '',
                    src: this.currentSrc || this.getAttribute('src') || ''
                  }});
                }}
                return originalPlay.apply(this, args);
              }};
              const originalDraw = CanvasRenderingContext2D.prototype.drawImage;
              CanvasRenderingContext2D.prototype.drawImage = function(...args) {{
                if (this.canvas?.matches?.('[data-phone-scrub-atlas]')) {{
                  window.__cakeV17AtlasDrawAttempts += 1;
                  if ({str(freeze).lower()}) {{
                    window.__cakeV17FrozenAtlasDraws += 1;
                    return;
                  }}
                }}
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
        # Replace the actual intro frame-0 anchor so the phone rVFC identity and
        # opposite-endpoint separation gate are exercised, not only a desktop
        # intermediate join.
        pattern = "**/CST17-I00-edge-in-darkness.webp*"

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
                  phoneMode: unit.phoneMode,
                  phoneMaster: unit.phoneMaster,
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
            state["bodyVersion"] == EXPECTED_VERSION
            and state["runtimeVersion"] == EXPECTED_VERSION
            and state["runtimeState"] == "ready"
            and state["manifestReady"] is True
            and state["tracks"] == ["intro", "outro"]
            and state["manifest"] is not None
            and state["manifest"].get("version") == EXPECTED_VERSION
            and state["manifest"].get("ready") is True
            and (state["manifest"].get("delivery") or {}).get("phoneMaster")
            == {
                "codec": "H.264",
                "pixelFormat": "yuv420p",
                "width": PHONE_WIDTH,
                "height": PHONE_HEIGHT,
                "fps": PHONE_FPS,
                "beatFrames": PHONE_BEAT_FRAMES,
                "finalTailExtraFrames": PHONE_FINAL_TAIL_EXTRA_FRAMES,
                "terminalFrameOffset": PHONE_TERMINAL_FRAME_OFFSET,
                "keyframeInterval": PHONE_KEYFRAME_INTERVAL,
                "silent": True,
                "faststart": True,
            }
            and (state["manifest"].get("delivery") or {}).get("phoneScrubAtlas")
            == {
                "mimeType": "image/webp",
                "tileWidth": PHONE_SCRUB_TILE_WIDTH,
                "tileHeight": PHONE_SCRUB_TILE_HEIGHT,
                "quality": PHONE_SCRUB_QUALITY,
            }
            and (state["manifest"].get("delivery") or {}).get("phoneTerminalStill")
            == {
                "mimeType": "image/webp",
                "width": PHONE_WIDTH,
                "height": PHONE_HEIGHT,
                "quality": PHONE_TERMINAL_QUALITY,
            }
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
        phone_mapping_ok = set(mappings) == {"intro", "outro"}
        phone_mapping: dict[str, Any] = {}
        for track, ids in EXPECTED_IDS.items():
            master = mappings.get(track, {}).get("phoneMaster") or {}
            expected_frames = len(ids) * PHONE_BEAT_FRAMES + PHONE_FINAL_TAIL_EXTRA_FRAMES
            expected_duration = expected_frames / PHONE_FPS
            expected_source = f"cake-studio/v17/clips/{PHONE_MASTER_FILES[track]}"
            valid = (
                master.get("src") == expected_source
                and master.get("width") == PHONE_WIDTH
                and master.get("height") == PHONE_HEIGHT
                and master.get("fps") == PHONE_FPS
                and master.get("beatFrames") == PHONE_BEAT_FRAMES
                and master.get("finalTailExtraFrames") == PHONE_FINAL_TAIL_EXTRA_FRAMES
                and master.get("terminalFrameOffset") == PHONE_TERMINAL_FRAME_OFFSET
                and master.get("keyframeInterval") == PHONE_KEYFRAME_INTERVAL
                and master.get("frames") == expected_frames
                and abs(float(master.get("duration", -1)) - expected_duration) <= .001
                and master.get("scrubAtlas") == expected_phone_scrub_contract(track)
                and master.get("terminalStill") == expected_phone_terminal_contract(track)
            )
            phone_mapping_ok = phone_mapping_ok and valid
            phone_mapping[track] = master
        self.check(
            "exact two phone master mapping",
            phone_mapping_ok,
            phone_mapping,
            kind="readiness",
        )
        self.manifest = state["manifest"]
        return final_reference and runtime_ready and mapping_ok and phone_mapping_ok, state

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

    def seek_phone_bookend(
        self,
        page: Page,
        track: str,
        progress: float,
    ) -> dict[str, Any]:
        if not 0 <= progress <= 1:
            raise ValueError(f"phone progress outside 0..1: {progress}")
        ids = EXPECTED_IDS[track]
        index = min(len(ids) - 1, math.floor(min(progress, .999999) * len(ids)))
        expected_clip = ids[index]
        expected_source = PHONE_MASTER_FILES[track]
        assert self.manifest is not None
        duration = float(self.manifest["tracks"][track]["phoneMaster"]["duration"])
        expected_target = phone_progress_target(duration, progress)
        terminal_surface = progress >= .999
        selector = f'[data-cake-bookend="{track}"]'
        presentation = page.evaluate(
            """track => {
              window.__cakeV17PresentedFrames ||= {};
              const unit = window.__cakeStudioBookends.units.find(
                item => item.trackName === track
              );
              const video = unit.phoneSlot.video;
              let watch = window.__cakeV17PresentedFrames[track];
              if (!watch) {
                watch = {count: 0, mediaTime: -1, now: -1, callbackId: 0};
                const sample = (now, metadata) => {
                  watch.count += 1;
                  watch.mediaTime = metadata.mediaTime;
                  watch.now = now;
                  watch.callbackId = video.requestVideoFrameCallback(sample);
                };
                if (typeof video.requestVideoFrameCallback !== 'function') {
                  throw new Error('requestVideoFrameCallback unavailable');
                }
                watch.callbackId = video.requestVideoFrameCallback(sample);
                window.__cakeV17PresentedFrames[track] = watch;
              }
              return {count: watch.count, currentTime: video.currentTime};
            }""",
            track,
        )
        self.set_progress(page, selector, progress)
        try:
            page.wait_for_function(
                """({selector, clip, source, expectedTarget, terminalTarget}) => {
                  const scene = document.querySelector(selector);
                  const unit = window.__cakeStudioBookends?.units?.find(
                    item => item.trackName === scene?.dataset.bookendTrack
                  );
                  const video = unit?.phoneSlot?.video;
                  const landing = unit?.phoneLanding;
                  const target = Number.parseFloat(scene?.dataset.sequenceTargetTime || '-1');
                  const painted = Number.parseFloat(scene?.dataset.sequenceTime || '-9');
                  const actualProgress = Number.parseFloat(
                    scene?.style.getPropertyValue('--p') || '-1'
                  );
                  const duration = unit?.phoneMaster?.duration || video?.duration || 0;
                  const sourceOk = video?.currentSrc.endsWith(source)
                    || (unit?.trackName === 'outro'
                      && unit?.phoneSlot?.sourceOverride?.startsWith('blob:')
                      && video?.currentSrc.startsWith('blob:'));
                  const terminalSurface = expectedTarget >= terminalTarget - .002;
                  const surfaceOk = terminalSurface
                    ? unit?.phoneLandingReady === true
                      && unit?.phoneLandingVisible === true
                      && landing?.complete
                      && landing.naturalWidth === 640
                      && landing.naturalHeight === 360
                      && landing.dataset.visible === 'true'
                      && scene.classList.contains('sequence-terminal-landing')
                      && Math.abs(painted - terminalTarget) <= .002
                    : unit?.phoneLandingVisible !== true
                      && unit?.phoneAtlasVisible !== true
                      && !video?.seeking
                      && Math.abs(video.currentTime - target) <= .05
                      && Math.abs(painted - target) <= .05;
                  return unit?.phoneMode === true
                    && unit.slots.length === 0
                    && scene?.dataset.sequenceTransport === 'phone-master'
                    && scene.dataset.sequenceMode === 'motion'
                    && scene.dataset.sequenceState === 'ready'
                    && scene.dataset.sequenceClip === clip
                    && scene.classList.contains('sequence-painted')
                    && video?.readyState >= 2
                    && video.paused
                    && unit.phoneMaster.src.endsWith(source)
                    && sourceOk
                    && Math.abs(target - expectedTarget) <= .02
                    && Math.abs(target - Math.min(terminalTarget, actualProgress * duration)) <= .002
                    && surfaceOk;
                }""",
                arg={
                    "selector": selector,
                    "clip": expected_clip,
                    "source": expected_source,
                    "expectedTarget": expected_target,
                    "terminalTarget": phone_terminal_target(duration),
                },
                timeout=30_000,
            )
        except TimeoutError:
            detail = page.locator(selector).evaluate(
                """scene => {
                  const unit = window.__cakeStudioBookends?.units?.find(
                    item => item.trackName === scene.dataset.bookendTrack
                  );
                  const video = unit?.phoneSlot?.video;
                  return {
                    phoneMode: unit?.phoneMode,
                    live: unit?.live,
                    phoneTarget: unit?.phoneTarget,
                    phoneSettleTimer: unit?.phoneSettleTimer,
                    legacySlots: unit?.slots?.length,
                    transport: scene.dataset.sequenceTransport || '',
                    mode: scene.dataset.sequenceMode || '',
                    state: scene.dataset.sequenceState || '',
                    clip: scene.dataset.sequenceClip || '',
                    target: scene.dataset.sequenceTargetTime || '',
                    painted: scene.dataset.sequenceTime || '',
                    lag: scene.dataset.sequenceLag || '',
                    className: scene.className,
                    src: video?.getAttribute('src') || '',
                    currentSrc: video?.currentSrc || '',
                    currentTime: video?.currentTime,
                    duration: video?.duration,
                    readyState: video?.readyState,
                    seeking: video?.seeking,
                    paused: video?.paused,
                    error: video?.error?.message || '',
                    canonicalSource: unit?.phoneMaster?.src || '',
                    warmState: unit?.warmState || '',
                    phoneBlobUrl: unit?.phoneBlobUrl || '',
                    slot: unit?.phoneSlot ? {
                      armed: unit.phoneSlot.armed,
                      metadata: unit.phoneSlot.metadata,
                      seeking: unit.phoneSlot.seeking,
                      wanted: unit.phoneSlot.wanted,
                      wantedExact: unit.phoneSlot.wantedExact,
                      target: unit.phoneSlot.target,
                      lastPainted: unit.phoneSlot.lastPainted,
                      lastIssued: unit.phoneSlot.lastIssued,
                      seekTimer: unit.phoneSlot.seekTimer,
                      generation: unit.phoneSlot.generation,
                      sourceOverride: unit.phoneSlot.sourceOverride,
                      pendingSource: unit.phoneSlot.pendingSource,
                    } : null,
                  };
                }"""
            )
            raise RuntimeError(
                f"phone {track} {expected_clip} at {progress:.6f} did not settle: "
                + json.dumps(detail, ensure_ascii=False, sort_keys=True)
            )
        if (
            not terminal_surface
            and abs(float(presentation["currentTime"]) - expected_target) >= .009
        ):
            try:
                page.wait_for_function(
                    """({track, before, tolerance}) => {
                      const unit = window.__cakeStudioBookends.units.find(
                        item => item.trackName === track
                      );
                      const watch = window.__cakeV17PresentedFrames[track];
                      return watch.count > before
                        && Math.abs(
                          watch.mediaTime - unit.phoneSlot.video.currentTime
                        ) <= tolerance;
                    }""",
                    arg={
                        "track": track,
                        "before": presentation["count"],
                        "tolerance": PHONE_PRESENTATION_TOLERANCE,
                    },
                    timeout=10_000,
                )
            except TimeoutError:
                detail = page.evaluate(
                    """track => {
                      const unit = window.__cakeStudioBookends.units.find(
                        item => item.trackName === track
                      );
                      const watch = window.__cakeV17PresentedFrames?.[track];
                      const video = unit?.phoneSlot?.video;
                      return {
                        watchCount: watch?.count ?? -1,
                        watchMediaTime: watch?.mediaTime ?? -1,
                        currentTime: video?.currentTime ?? -1,
                        readyState: video?.readyState ?? -1,
                        seeking: video?.seeking,
                        slotTarget: unit?.phoneSlot?.target ?? -1,
                        lastPainted: unit?.phoneSlot?.lastPainted ?? -1,
                      };
                    }""",
                    track,
                )
                raise RuntimeError(
                    f"phone {track} {expected_clip} produced no matching new "
                    f"{PHONE_FPS} fps presentation: "
                    + json.dumps(detail, ensure_ascii=False, sort_keys=True)
                )
        page.wait_for_timeout(35)
        return self.capture_phone_bookend(page, track)

    @staticmethod
    def capture_phone_bookend(page: Page, track: str) -> dict[str, Any]:
        selector = f'[data-cake-bookend="{track}"]'
        capture = page.locator(selector).evaluate(
            f"""scene => {{
              const unit = window.__cakeStudioBookends.units.find(
                item => item.trackName === scene.dataset.bookendTrack
              );
              const video = unit.phoneSlot.video;
              const canvas = unit.canvas;
              const poster = unit.poster;
              const atlas = unit.phoneAtlasCanvas;
              const landing = unit.phoneLanding;
              const presented = window.__cakeV17PresentedFrames?.[unit.trackName];
              const aperture = scene.querySelector('.bookend-aperture');
              const videoStyle = getComputedStyle(video);
              const canvasStyle = getComputedStyle(canvas);
              const posterStyle = getComputedStyle(poster);
              const atlasStyle = getComputedStyle(atlas);
              const landingStyle = getComputedStyle(landing);
              const apertureRect = aperture.getBoundingClientRect();
              const videoRect = video.getBoundingClientRect();
              const atlasRect = atlas.getBoundingClientRect();
              const landingRect = landing.getBoundingClientRect();
              const surfaceKind = unit.phoneLandingVisible
                ? 'terminal-landing'
                : unit.phoneAtlasVisible ? 'scrub-atlas' : 'video';
              const surface = surfaceKind === 'terminal-landing'
                ? landing : surfaceKind === 'scrub-atlas' ? atlas : video;
              const sourceWidth = surfaceKind === 'terminal-landing'
                ? landing.naturalWidth
                : surfaceKind === 'scrub-atlas' ? atlas.width : video.videoWidth;
              const sourceHeight = surfaceKind === 'terminal-landing'
                ? landing.naturalHeight
                : surfaceKind === 'scrub-atlas' ? atlas.height : video.videoHeight;
              const probe = document.createElement('canvas');
              probe.width = {PROBE_WIDTH};
              probe.height = {PROBE_HEIGHT};
              probe.getContext('2d', {{alpha: false}}).drawImage(
                surface, 0, 0, probe.width, probe.height
              );
              const joinProbe = document.createElement('canvas');
              joinProbe.width = sourceWidth;
              joinProbe.height = sourceHeight;
              joinProbe.getContext('2d', {{alpha: false}}).drawImage(
                surface, 0, 0, joinProbe.width, joinProbe.height
              );
              return {{
                track: unit.trackName,
                transport: scene.dataset.sequenceTransport || '',
                clip: scene.dataset.sequenceClip || '',
                index: Number(scene.dataset.sequenceIndex || 0),
                fraction: Number(scene.dataset.sequenceFraction || 0),
                targetTime: Number(scene.dataset.sequenceTargetTime || 0),
                paintedTime: Number(scene.dataset.sequenceTime || -1),
                lag: Number(scene.dataset.sequenceLag || -1),
                mode: scene.dataset.sequenceMode || '',
                state: scene.dataset.sequenceState || '',
                painted: scene.classList.contains('sequence-painted'),
                legacySlots: unit.slots.length,
                live: unit.live,
                canonicalSource: unit.phoneMaster.src,
                warmState: unit.warmState,
                phoneBlobUrl: unit.phoneBlobUrl,
                sourceMode: unit.phoneSlot.sourceOverride ? 'blob' : 'network',
                sourceOverride: unit.phoneSlot.sourceOverride,
                pendingSource: unit.phoneSlot.pendingSource,
                presentedTime: presented?.mediaTime ?? -1,
                presentedCount: presented?.count ?? 0,
                surfaceKind,
                surfaceData: probe.toDataURL('image/png'),
                joinVideoData: joinProbe.toDataURL('image/png'),
                phone: {{
                  width: video.videoWidth,
                  height: video.videoHeight,
                  duration: video.duration,
                  currentTime: video.currentTime,
                  paused: video.paused,
                  seeking: video.seeking,
                  readyState: video.readyState,
                  seekable: video.seekable.length,
                  src: video.getAttribute('src') || '',
                  currentSrc: video.currentSrc || '',
                  display: videoStyle.display,
                  opacity: Number.parseFloat(videoStyle.opacity),
                  fit: videoStyle.objectFit,
                  rect: {{
                    left: videoRect.left, top: videoRect.top,
                    right: videoRect.right, bottom: videoRect.bottom,
                    width: videoRect.width, height: videoRect.height,
                  }},
                }},
                canvas: {{
                  width: canvas.width,
                  height: canvas.height,
                  display: canvasStyle.display,
                  opacity: Number.parseFloat(canvasStyle.opacity),
                  fit: canvasStyle.objectFit,
                }},
                atlas: {{
                  visible: unit.phoneAtlasVisible,
                  ready: unit.phoneAtlasReady,
                  tile: unit.phoneAtlasTile,
                  frame: Number(atlas.dataset.frame || -1),
                  time: Number(atlas.dataset.time || -1),
                  width: atlas.width,
                  height: atlas.height,
                  display: atlasStyle.display,
                  opacity: Number.parseFloat(atlasStyle.opacity),
                  fit: atlasStyle.objectFit,
                  rect: {{
                    left: atlasRect.left, top: atlasRect.top,
                    right: atlasRect.right, bottom: atlasRect.bottom,
                    width: atlasRect.width, height: atlasRect.height,
                  }},
                }},
                landing: {{
                  visible: unit.phoneLandingVisible,
                  ready: unit.phoneLandingReady,
                  src: landing.getAttribute('src') || '',
                  complete: landing.complete,
                  width: landing.naturalWidth,
                  height: landing.naturalHeight,
                  display: landingStyle.display,
                  opacity: Number.parseFloat(landingStyle.opacity),
                  fit: landingStyle.objectFit,
                  rect: {{
                    left: landingRect.left, top: landingRect.top,
                    right: landingRect.right, bottom: landingRect.bottom,
                    width: landingRect.width, height: landingRect.height,
                  }},
                }},
                poster: {{
                  src: poster.getAttribute('src') || '',
                  width: poster.naturalWidth,
                  height: poster.naturalHeight,
                  opacity: Number.parseFloat(posterStyle.opacity),
                  fit: posterStyle.objectFit,
                }},
                aperture: {{
                  left: apertureRect.left, top: apertureRect.top,
                  right: apertureRect.right, bottom: apertureRect.bottom,
                  width: apertureRect.width, height: apertureRect.height,
                }},
              }};
            }}"""
        )
        surface_selector = {
            "video": "[data-bookend-phone-video]",
            "scrub-atlas": "[data-phone-scrub-atlas]",
            "terminal-landing": "[data-phone-terminal-landing]",
        }[capture["surfaceKind"]]
        surface_locator = page.locator(f"{selector} {surface_selector}")
        surface_bytes = data_url_bytes(capture.pop("surfaceData"))
        join_bytes = data_url_bytes(capture.pop("joinVideoData"))
        attempts: list[dict[str, float]] = []
        best: tuple[float, bytes, bytes] | None = None
        for attempt in range(21):
            if attempt:
                page.wait_for_timeout(50)
            rendered = surface_locator.screenshot(animations="allow")
            rendered_frame = decode_png(rendered)
            render_height, render_width = rendered_frame.shape[:2]
            render_reference = data_url_bytes(
                surface_locator.evaluate(
                    """(surface, size) => {
                      const probe = document.createElement('canvas');
                      probe.width = size.width;
                      probe.height = size.height;
                      const context = probe.getContext('2d', {alpha: false});
                      context.fillStyle = getComputedStyle(surface).backgroundColor;
                      context.fillRect(0, 0, probe.width, probe.height);
                      const rect = surface.getBoundingClientRect();
                      const sourceWidth = surface instanceof HTMLVideoElement
                        ? surface.videoWidth
                        : surface instanceof HTMLImageElement
                          ? surface.naturalWidth : surface.width;
                      const sourceHeight = surface instanceof HTMLVideoElement
                        ? surface.videoHeight
                        : surface instanceof HTMLImageElement
                          ? surface.naturalHeight : surface.height;
                      const scale = Math.min(
                        rect.width / sourceWidth,
                        rect.height / sourceHeight
                      );
                      const drawWidth = sourceWidth * scale * size.width / rect.width;
                      const drawHeight = sourceHeight * scale * size.height / rect.height;
                      const x = (size.width - drawWidth) / 2;
                      const y = (size.height - drawHeight) / 2;
                      context.drawImage(surface, x, y, drawWidth, drawHeight);
                      return probe.toDataURL('image/png');
                    }""",
                    {"width": render_width, "height": render_height},
                )
            )
            ssim, mae = similarity(rendered, render_reference)
            attempts.append({"ssim": ssim, "mae": mae})
            penalty = mae + max(0.0, PHONE_RENDER_MIN_SSIM - ssim) * 100
            if best is None or penalty < best[0]:
                best = (penalty, rendered, render_reference)
            if ssim >= PHONE_RENDER_MIN_SSIM and mae <= PHONE_RENDER_MAX_MAE:
                break
        assert best is not None
        capture["renderedBytes"] = best[1]
        capture["renderExpectedBytes"] = best[2]
        # Historical field name retained for report consumers; it now carries
        # the actual visible phone surface (video, atlas tile, or landing).
        capture["videoBytes"] = surface_bytes
        capture["joinBytes"] = join_bytes
        capture["renderAttempts"] = attempts
        return capture

    def capture_exact_phone_frame(
        self,
        page: Page,
        track: str,
        frame_index: int,
    ) -> dict[str, Any]:
        """Seek the already-visible native master to one exact frame PTS.

        Scroll progress is pixel-quantized, so it cannot address the two sides
        of every N-1/N join reliably. The controller traversal is still proved
        independently; this helper only obtains the exact browser-decoded join
        pixels from the same attached, visible video element.
        """
        target = (frame_index + .01) / PHONE_FPS
        selector = f'[data-cake-bookend="{track}"]'
        page.wait_for_function(
            """track => {
              const unit = window.__cakeStudioBookends?.units?.find(
                item => item.trackName === track
              );
              return unit?.live && unit.phoneSlot?.armed && unit.phoneSlot.metadata
                && !unit.phoneSlot.seeking && !unit.phoneSlot.seekTimer
                && !unit.phoneSettleTimer && unit.phoneSlot.video.readyState >= 2;
            }""",
            arg=track,
            timeout=10_000,
        )
        presentation_count = page.evaluate(
            "track => window.__cakeV17PresentedFrames?.[track]?.count ?? -1",
            track,
        )
        page.locator(selector).evaluate(
            """(scene, target) => new Promise((resolve, reject) => {
              const unit = window.__cakeStudioBookends.units.find(
                item => item.trackName === scene.dataset.bookendTrack
              );
              const video = unit.phoneSlot.video;
              let timer = 0;
              const cleanup = () => {
                clearTimeout(timer);
                video.removeEventListener('seeked', finish);
                video.removeEventListener('error', fail);
              };
              const finish = () => {
                cleanup();
                requestAnimationFrame(() => resolve(video.currentTime));
              };
              const fail = () => {
                cleanup();
                reject(new Error(`exact phone frame failed at ${target}`));
              };
              timer = setTimeout(() => {
                cleanup();
                reject(new Error(`exact phone frame timed out at ${target}`));
              }, 10000);
              video.addEventListener('seeked', finish, {once: true});
              video.addEventListener('error', fail, {once: true});
              if (Math.abs(video.currentTime - target) <= .0002 && !video.seeking) {
                finish();
                return;
              }
              video.currentTime = target;
            })""",
            target,
        )
        page.wait_for_function(
            """({track, target}) => {
              const unit = window.__cakeStudioBookends.units.find(
                item => item.trackName === track
              );
              const video = unit.phoneSlot.video;
              return video.readyState >= 2 && !video.seeking
                && Math.abs(video.currentTime - target) <= .002;
            }""",
            arg={"track": track, "target": target},
            timeout=10_000,
        )
        page.wait_for_function(
            """({track, before, target}) => {
              const watch = window.__cakeV17PresentedFrames?.[track];
              return watch?.count > before
                && Math.abs(watch.mediaTime - target) <= .02;
            }""",
            arg={"track": track, "before": presentation_count, "target": target},
            timeout=10_000,
        )
        page.wait_for_timeout(35)
        capture = self.capture_phone_bookend(page, track)
        capture["exactFrame"] = frame_index
        capture["exactTarget"] = target
        capture["presentedTime"] = page.evaluate(
            "track => window.__cakeV17PresentedFrames[track].mediaTime",
            track,
        )
        return capture

    def check_phone_capture(
        self,
        label: str,
        capture: dict[str, Any],
        profile: Profile,
        *,
        expected_target: float | None = None,
    ) -> tuple[float, float]:
        phone = capture["phone"]
        canvas = capture["canvas"]
        atlas = capture["atlas"]
        landing = capture["landing"]
        poster = capture["poster"]
        aperture = capture["aperture"]
        assert self.manifest is not None
        expected_duration = float(
            self.manifest["tracks"][capture["track"]]["phoneMaster"]["duration"]
        )
        expected_source = PHONE_MASTER_FILES[capture["track"]]
        network_source = (
            phone["src"].endswith(expected_source)
            and phone["currentSrc"].endswith(expected_source)
            and capture["sourceMode"] == "network"
            and not capture["sourceOverride"]
        )
        blob_source = (
            capture["track"] == "outro"
            and capture["sourceMode"] == "blob"
            and phone["src"].startswith("blob:")
            and phone["currentSrc"].startswith("blob:")
            and capture["sourceOverride"] == phone["src"]
            and capture["phoneBlobUrl"] == phone["src"]
            and capture["warmState"] == "ready"
        )
        ssim, mae = similarity(
            capture["renderedBytes"], capture["renderExpectedBytes"]
        )
        mean, spread = frame_energy(capture["renderedBytes"])
        terminal_surface = capture["surfaceKind"] == "terminal-landing"
        video_surface_ok = (
            capture["surfaceKind"] == "video"
            and not atlas["visible"]
            and not landing["visible"]
            and not phone["seeking"]
            and abs(phone["currentTime"] - capture["targetTime"]) <= .05
            and abs(phone["rect"]["width"] - aperture["width"]) <= 1
            and abs(phone["rect"]["height"] - aperture["height"]) <= 1
        )
        landing_surface_ok = (
            terminal_surface
            and landing["visible"]
            and landing["ready"]
            and landing["complete"]
            and landing["src"].endswith(PHONE_TERMINAL_FILES[capture["track"]])
            and landing["width"] == PHONE_WIDTH
            and landing["height"] == PHONE_HEIGHT
            and landing["display"] != "none"
            and landing["opacity"] >= .99
            and landing["fit"] == "contain"
            and abs(landing["rect"]["width"] - aperture["width"]) <= 1
            and abs(landing["rect"]["height"] - aperture["height"]) <= 1
            and not atlas["visible"]
        )
        visible = (
            capture["transport"] == "phone-master"
            and capture["mode"] == "motion"
            and capture["state"] == "ready"
            and capture["painted"]
            and capture["legacySlots"] == 0
            and phone["display"] != "none"
            and phone["opacity"] >= .99
            and phone["fit"] == "contain"
            and phone["width"] == PHONE_WIDTH
            and phone["height"] == PHONE_HEIGHT
            and abs(phone["duration"] - expected_duration) <= .08
            and phone["paused"]
            and phone["readyState"] >= 2
            and phone["seekable"] >= 1
            and capture["canonicalSource"].endswith(expected_source)
            and (network_source or blob_source)
            and abs(capture["paintedTime"] - capture["targetTime"]) <= .05
            and 0 <= capture["lag"] <= .05
            and canvas["opacity"] <= .01
            and canvas["fit"] == "contain"
            and poster["opacity"] <= .01
            and poster["fit"] == "contain"
            and poster["width"] == 1280
            and poster["height"] == 720
            and aperture["left"] >= -1
            and aperture["right"] <= profile.width + 1
            and aperture["top"] >= -1
            and aperture["bottom"] <= profile.height + 1
            and abs(aperture["width"] / aperture["height"] - 16 / 9) <= .01
            and (video_surface_ok or landing_surface_ok)
            and (expected_target is None or abs(capture["targetTime"] - expected_target) <= .02)
        )
        self.check(
            f"{label} visible phone master surface",
            visible and spread >= 2.0,
            {
                "track": capture["track"],
                "sourceMode": capture["sourceMode"],
                "canonicalSource": capture["canonicalSource"],
                "warmState": capture["warmState"],
                "clip": capture["clip"],
                "target": round(capture["targetTime"], 4),
                "painted": round(capture["paintedTime"], 4),
                "lag": round(capture["lag"], 4),
                "phone": phone,
                "canvas": canvas,
                "surfaceKind": capture["surfaceKind"],
                "atlas": atlas,
                "landing": landing,
                "poster": poster,
                "aperture": aperture,
                "pixelMean": round(mean, 3),
                "pixelStdDev": round(spread, 3),
                "renderAttempts": capture["renderAttempts"],
            },
            kind="render",
        )
        self.check(
            f"{label} rendered pixels equal decoded phone surface",
            ssim >= PHONE_RENDER_MIN_SSIM and mae <= PHONE_RENDER_MAX_MAE,
            f"SSIM={ssim:.6f} MAE={mae:.3f}",
            kind="pixel",
        )
        return ssim, mae

    @staticmethod
    def start_phone_visibility_watch(page: Page, track: str) -> None:
        page.evaluate(
            """track => {
              window.__cakeV17PhoneWatches ||= {};
              const prior = window.__cakeV17PhoneWatches[track];
              if (prior) {
                clearInterval(prior.timer);
                prior.observer?.disconnect();
              }
              const scene = document.querySelector(`[data-cake-bookend="${track}"]`);
              const unit = window.__cakeStudioBookends.units.find(item => item.trackName === track);
              const video = scene.querySelector('[data-bookend-phone-video]');
              const poster = scene.querySelector('[data-bookend-poster]');
              const atlas = scene.querySelector('[data-phone-scrub-atlas]');
              const landing = scene.querySelector('[data-phone-terminal-landing]');
              const initialSrc = video.getAttribute('src') || '';
              const watch = {
                track, initialSrc, lastSrc: initialSrc, samples: 0, visibleSamples: 0,
                 violations: [], srcMutations: 0, visibleSrcMutations: 0,
                 offscreenSrcMutations: 0, atlasVisibleSamples: 0,
                 landingVisibleSamples: 0,
                sample(reason) {
                  this.samples += 1;
                  const videoOpacity = Number.parseFloat(getComputedStyle(video).opacity || '0');
                   const posterOpacity = Number.parseFloat(getComputedStyle(poster).opacity || '0');
                   const atlasOpacity = Number.parseFloat(getComputedStyle(atlas).opacity || '0');
                   const landingOpacity = Number.parseFloat(getComputedStyle(landing).opacity || '0');
                   const atlasVisible = unit.phoneAtlasVisible && atlasOpacity >= .99;
                   const landingVisible = unit.phoneLandingVisible && landingOpacity >= .99;
                  const currentSrc = video.getAttribute('src') || '';
                  if (!unit.live) {
                    this.lastSrc = currentSrc;
                    return;
                  }
                   this.visibleSamples += 1;
                   if (atlasVisible) this.atlasVisibleSamples += 1;
                   if (landingVisible) this.landingVisibleSamples += 1;
                   if (!scene.classList.contains('sequence-painted')
                     || videoOpacity < .99 || posterOpacity > .01
                     || (unit.phoneAtlasVisible && !atlasVisible)
                     || (unit.phoneLandingVisible && (!landingVisible || !landing.complete))) {
                    if (this.violations.length < 100) this.violations.push({
                      at: performance.now(), reason, painted: scene.classList.contains('sequence-painted'),
                       videoOpacity, posterOpacity, atlasOpacity, landingOpacity,
                       atlasVisible, landingVisible, currentSrc, live: unit.live,
                      target: scene.dataset.sequenceTargetTime || '',
                      time: scene.dataset.sequenceTime || '',
                    });
                  }
                  this.lastSrc = currentSrc;
                }
              };
              watch.timer = setInterval(() => watch.sample('interval'), 8);
              watch.observer = new MutationObserver(records => {
                if (records.some(record => record.target === video && record.attributeName === 'src')) {
                  watch.srcMutations += 1;
                  if (unit.live) {
                    watch.visibleSrcMutations += 1;
                    if (watch.violations.length < 100) watch.violations.push({
                      at: performance.now(), reason: 'visible-src-mutation', live: true,
                      currentSrc: video.getAttribute('src') || '',
                    });
                  } else {
                    watch.offscreenSrcMutations += 1;
                  }
                }
                watch.sample('mutation');
              });
              watch.observer.observe(scene, {attributes: true, attributeFilter: ['class']});
              watch.observer.observe(video, {attributes: true, attributeFilter: ['src']});
              window.__cakeV17PhoneWatches[track] = watch;
              watch.sample('start');
            }""",
            track,
        )

    @staticmethod
    def stop_phone_visibility_watches(page: Page) -> dict[str, Any]:
        return page.evaluate(
            """() => Object.fromEntries(Object.entries(window.__cakeV17PhoneWatches || {}).map(
              ([track, watch]) => {
                clearInterval(watch.timer);
                watch.observer?.disconnect();
                watch.sample('stop');
                return [track, {
                  initialSrc: watch.initialSrc,
                  finalSrc: watch.lastSrc,
                  samples: watch.samples,
                  visibleSamples: watch.visibleSamples,
                  srcMutations: watch.srcMutations,
                  visibleSrcMutations: watch.visibleSrcMutations,
                   offscreenSrcMutations: watch.offscreenSrcMutations,
                   atlasVisibleSamples: watch.atlasVisibleSamples,
                   landingVisibleSamples: watch.landingVisibleSamples,
                  violations: watch.violations,
                }];
              }
            ))"""
        )

    def phone_master_pass(self, page: Page, profile: Profile) -> dict[str, Any]:
        assert self.manifest is not None
        endpoint_frames: dict[str, bytes] = {}
        sample_report: dict[str, Any] = {}
        persistence: dict[str, Any] = {}
        for track in ("intro", "outro"):
            clips = self.manifest["tracks"][track]["clips"]
            for relative in (clips[0]["first"], clips[-1]["last"]):
                endpoint_frames[relative] = self.fetch_endpoint(page, relative)

            first_progress = .000001
            master_duration = float(
                self.manifest["tracks"][track]["phoneMaster"]["duration"]
            )
            first_target = first_progress * master_duration
            first = self.seek_phone_bookend(page, track, first_progress)
            self.check_phone_capture(
                f"phone {track} first", first, profile, expected_target=first_target
            )
            self.start_phone_visibility_watch(page, track)
            # Force an independently witnessed frame-0 presentation. The
            # controller's already-at-zero branch can legitimately paint the
            # paused frame without causing a new rVFC callback.
            first_anchor = self.capture_exact_phone_frame(page, track, 0)
            first_ssim, first_mae = similarity(
                first_anchor["videoBytes"], endpoint_frames[clips[0]["first"]]
            )
            first_wrong_ssim, first_wrong_mae = similarity(
                first_anchor["videoBytes"], endpoint_frames[clips[-1]["last"]]
            )
            first_detail = {
                "surfaceKind": first_anchor["surfaceKind"],
                "target": first_anchor["exactTarget"],
                "currentTime": first_anchor["phone"]["currentTime"],
                "presentedTime": first_anchor["presentedTime"],
                "presentedCount": first_anchor["presentedCount"],
                "correct": {"ssim": first_ssim, "mae": first_mae},
                "oppositeEndpoint": {
                    "ssim": first_wrong_ssim,
                    "mae": first_wrong_mae,
                },
            }
            self.check(
                f"phone {track} first endpoint sample",
                first_anchor["surfaceKind"] == "video"
                and phone_presentation_matches(
                    first_anchor["presentedTime"], first_anchor["exactTarget"]
                )
                and phone_anchor_accepted(
                    first_ssim,
                    first_mae,
                    first_wrong_ssim,
                    first_wrong_mae,
                ),
                first_detail,
                kind="anchor",
            )

            track_samples: dict[str, Any] = {}
            for index, clip_id in enumerate(EXPECTED_IDS[track]):
                progress = (index + .4) / len(clips)
                expected_target = progress * master_duration
                capture = self.seek_phone_bookend(page, track, progress)
                ssim, mae = self.check_phone_capture(
                    f"phone {clip_id} sample", capture, profile,
                    expected_target=expected_target,
                )
                track_samples[clip_id] = {
                    "target": capture["targetTime"],
                    "painted": capture["paintedTime"],
                    "lag": capture["lag"],
                    "renderSsim": ssim,
                    "renderMae": mae,
                    "digest": frame_digest(capture["videoBytes"]),
                }

            track_joins: dict[str, Any] = {}
            for boundary in range(1, len(clips)):
                left_frame = boundary * PHONE_BEAT_FRAMES - 1
                right_frame = boundary * PHONE_BEAT_FRAMES
                left_target = left_frame / PHONE_FPS
                right_target = right_frame / PHONE_FPS
                prepare_target = max(.001, (left_frame - 6) / PHONE_FPS)
                self.seek_phone_bookend(
                    page, track, prepare_target / master_duration
                )
                left = self.capture_exact_phone_frame(page, track, left_frame)
                right = self.capture_exact_phone_frame(page, track, right_frame)
                join_ssim, join_mae = similarity(
                    normalize_phone_join(left["joinBytes"]),
                    normalize_phone_join(right["joinBytes"]),
                )
                join_name = f"{clips[boundary - 1]['id']}->{clips[boundary]['id']}"
                join_detail = {
                    "leftFrame": left_frame,
                    "rightFrame": right_frame,
                    "leftTarget": left["exactTarget"],
                    "rightTarget": right["exactTarget"],
                    "leftCurrentTime": left["phone"]["currentTime"],
                    "rightCurrentTime": right["phone"]["currentTime"],
                    "leftPresentedTime": left["presentedTime"],
                    "rightPresentedTime": right["presentedTime"],
                    "ssim": join_ssim,
                    "mae": join_mae,
                }
                self.check(
                    f"phone {join_name} decoded master join",
                    phone_join_accepted(join_ssim, join_mae),
                    join_detail,
                    kind="join",
                )
                track_joins[join_name] = join_detail

            last_progress = .999999
            expected_duration = master_duration
            last_target = phone_terminal_target(expected_duration)
            last = self.seek_phone_bookend(page, track, last_progress)
            self.check_phone_capture(
                f"phone {track} last", last, profile, expected_target=last_target
            )
            last_ssim, last_mae = similarity(
                last["videoBytes"], endpoint_frames[clips[-1]["last"]]
            )
            last_wrong_ssim, last_wrong_mae = similarity(
                last["videoBytes"], endpoint_frames[clips[0]["first"]]
            )
            terminal_reference = self.fetch_endpoint(
                page,
                f"cake-studio/v17/clips/{PHONE_TERMINAL_FILES[track]}",
            )
            terminal_ssim, terminal_mae = similarity(
                last["videoBytes"], terminal_reference
            )
            last_detail = {
                "surfaceKind": last["surfaceKind"],
                "target": last["targetTime"],
                "painted": last["paintedTime"],
                "presentedTime": last["presentedTime"],
                "landing": last["landing"],
                "terminalAsset": {"ssim": terminal_ssim, "mae": terminal_mae},
                "correct": {"ssim": last_ssim, "mae": last_mae},
                "oppositeEndpoint": {
                    "ssim": last_wrong_ssim,
                    "mae": last_wrong_mae,
                },
            }
            self.check(
                f"phone {track} last endpoint sample",
                last["surfaceKind"] == "terminal-landing"
                and last["landing"]["visible"]
                and last["landing"]["ready"]
                and last["landing"]["complete"]
                and last["landing"]["width"] == PHONE_WIDTH
                and last["landing"]["height"] == PHONE_HEIGHT
                and terminal_ssim >= PHONE_TERMINAL_IDENTITY_MIN_SSIM
                and terminal_mae <= PHONE_TERMINAL_IDENTITY_MAX_MAE
                and phone_anchor_accepted(
                    last_ssim,
                    last_mae,
                    last_wrong_ssim,
                    last_wrong_mae,
                ),
                last_detail,
                kind="anchor",
            )
            page.locator(f'[data-cake-bookend="{track}"]').evaluate(
                "scene => scene.dispatchEvent(new CustomEvent('scene:idle'))"
            )
            if track in {"intro", "outro"}:
                try:
                    page.wait_for_function(
                    """() => {
                      const unit = window.__cakeStudioBookends.units.find(
                        item => item.trackName === 'outro'
                      );
                      const slot = unit?.phoneSlot;
                      const video = slot?.video;
                      const target = Number.parseFloat(
                        unit?.scene.dataset.sequenceTargetTime || '-1'
                      );
                      const painted = Number.parseFloat(
                        unit?.scene.dataset.sequenceTime || '-9'
                      );
                      return unit?.live === false
                        && unit.warmState === 'ready'
                        && unit.phoneBlobUrl?.startsWith('blob:')
                        && slot?.sourceOverride === unit.phoneBlobUrl
                        && !slot.pendingSource
                        && video?.getAttribute('src') === unit.phoneBlobUrl
                        && video.currentSrc.startsWith('blob:')
                        && video.readyState >= 2
                        && !video.seeking
                        && unit.scene.classList.contains('sequence-painted')
                        && Math.abs(painted - target) <= .05;
                    }""",
                    timeout=30_000,
                )
                except TimeoutError:
                    warm_failure = page.locator(
                        '[data-cake-bookend="outro"]'
                    ).evaluate(
                        """scene => {
                          const unit = window.__cakeStudioBookends.units.find(
                            item => item.trackName === 'outro'
                          );
                          const slot = unit.phoneSlot;
                          const video = slot.video;
                          return {
                            afterIdleTrack: scene.dataset.bookendTrack,
                            live: unit.live,
                            warmState: unit.warmState,
                            warmBytes: scene.dataset.sequenceWarmBytes || '',
                            phoneBlobUrl: unit.phoneBlobUrl,
                            canonicalSource: unit.phoneMaster.src,
                            sourceOverride: slot.sourceOverride,
                            pendingSource: slot.pendingSource,
                            armed: slot.armed,
                            metadata: slot.metadata,
                            slotSeeking: slot.seeking,
                            wanted: slot.wanted,
                            target: slot.target,
                            currentTime: video.currentTime,
                            currentSrc: video.currentSrc || '',
                            src: video.getAttribute('src') || '',
                            readyState: video.readyState,
                            videoSeeking: video.seeking,
                            state: scene.dataset.sequenceState || '',
                            sequenceTarget: scene.dataset.sequenceTargetTime || '',
                            sequenceTime: scene.dataset.sequenceTime || '',
                            painted: scene.classList.contains('sequence-painted'),
                          };
                        }"""
                    )
                    raise RuntimeError(
                        f"phone outro offscreen warm->blob failed after {track} idle: "
                        + json.dumps(
                            warm_failure,
                            ensure_ascii=False,
                            sort_keys=True,
                        )
                    )
                if track == "intro":
                    warm_outro = page.locator(
                        '[data-cake-bookend="outro"]'
                    ).evaluate(
                        """scene => {
                          const unit = window.__cakeStudioBookends.units.find(
                            item => item.trackName === 'outro'
                          );
                          const slot = unit.phoneSlot;
                          const video = slot.video;
                          return {
                            live: unit.live,
                            warmState: unit.warmState,
                            warmBytes: scene.dataset.sequenceWarmBytes || '',
                            canonicalSource: unit.phoneMaster.src,
                            phoneBlobUrl: unit.phoneBlobUrl,
                            sourceOverride: slot.sourceOverride,
                            pendingSource: slot.pendingSource,
                            src: video.getAttribute('src') || '',
                            currentSrc: video.currentSrc || '',
                            readyState: video.readyState,
                            seeking: video.seeking,
                            painted: scene.classList.contains('sequence-painted'),
                          };
                        }"""
                    )
                    self.check(
                        "phone outro warm master swaps to blob while offscreen",
                        not warm_outro["live"]
                        and warm_outro["warmState"] == "ready"
                        and int(warm_outro["warmBytes"] or 0)
                        == PHONE_MASTER_BYTES["outro"]
                        and warm_outro["canonicalSource"].endswith(
                            PHONE_MASTER_FILES["outro"]
                        )
                        and warm_outro["phoneBlobUrl"].startswith("blob:")
                        and warm_outro["sourceOverride"]
                        == warm_outro["phoneBlobUrl"]
                        == warm_outro["src"]
                        and warm_outro["currentSrc"].startswith("blob:")
                        and not warm_outro["pendingSource"]
                        and warm_outro["readyState"] >= 2
                        and not warm_outro["seeking"]
                        and warm_outro["painted"],
                        warm_outro,
                        kind="transport",
                    )
            idle = page.locator(f'[data-cake-bookend="{track}"]').evaluate(
                """scene => {
                  const unit = window.__cakeStudioBookends.units.find(
                    item => item.trackName === scene.dataset.bookendTrack
                  );
                  const video = scene.querySelector('[data-bookend-phone-video]');
                  const poster = scene.querySelector('[data-bookend-poster]');
                  return {
                    live: unit.live,
                    painted: scene.classList.contains('sequence-painted'),
                    hasTime: Object.hasOwn(scene.dataset, 'sequenceTime'),
                    canonicalSource: unit.phoneMaster.src,
                    sourceMode: unit.phoneSlot.sourceOverride ? 'blob' : 'network',
                    sourceOverride: unit.phoneSlot.sourceOverride,
                    pendingSource: unit.phoneSlot.pendingSource,
                    phoneBlobUrl: unit.phoneBlobUrl,
                    warmState: unit.warmState,
                    src: video.getAttribute('src') || '',
                    currentSrc: video.currentSrc || '',
                    currentTime: video.currentTime,
                    readyState: video.readyState,
                    videoOpacity: Number.parseFloat(getComputedStyle(video).opacity),
                    posterOpacity: Number.parseFloat(getComputedStyle(poster).opacity),
                  };
                }"""
            )
            source_ok = (
                idle["sourceMode"] == "network"
                and idle["src"].endswith(PHONE_MASTER_FILES[track])
                and idle["currentSrc"].endswith(PHONE_MASTER_FILES[track])
                if track == "intro"
                else idle["sourceMode"] == "blob"
                and idle["warmState"] == "ready"
                and idle["src"].startswith("blob:")
                and idle["currentSrc"].startswith("blob:")
                and idle["sourceOverride"] == idle["phoneBlobUrl"] == idle["src"]
                and not idle["pendingSource"]
            )
            self.check(
                f"phone {track} offscreen transport stabilizes",
                not idle["live"]
                and idle["canonicalSource"].endswith(PHONE_MASTER_FILES[track])
                and source_ok
                and idle["painted"]
                and idle["hasTime"]
                and idle["readyState"] >= 2
                and idle["videoOpacity"] >= .99
                and idle["posterOpacity"] <= .01,
                idle,
                kind="stale",
            )
            persistence[track] = idle
            sample_report[track] = {
                "samples": track_samples,
                "joins": track_joins,
                "first": first_detail,
                "last": last_detail,
            }

        # Return to an already armed intro master. Its URL and last decoded
        # surface must survive the outro traversal; no poster may flash while
        # the persistent native video seeks to the new target.
        reentry = self.seek_phone_bookend(page, "intro", .64)
        self.check_phone_capture("phone intro persistent reentry", reentry, profile)
        final_state = page.evaluate(
            """() => Object.fromEntries(window.__cakeStudioBookends.units.map(unit => {
              const video = unit.phoneSlot.video;
              const poster = unit.poster;
              return [unit.trackName, {
                live: unit.live,
                canonicalSource: unit.phoneMaster.src,
                sourceMode: unit.phoneSlot.sourceOverride ? 'blob' : 'network',
                sourceOverride: unit.phoneSlot.sourceOverride,
                pendingSource: unit.phoneSlot.pendingSource,
                warmState: unit.warmState,
                phoneBlobUrl: unit.phoneBlobUrl,
                src: video.getAttribute('src') || '',
                currentSrc: video.currentSrc || '',
                readyState: video.readyState,
                painted: unit.scene.classList.contains('sequence-painted'),
                videoOpacity: Number.parseFloat(getComputedStyle(video).opacity),
                posterOpacity: Number.parseFloat(getComputedStyle(poster).opacity),
                legacySlots: unit.slots.length,
              }];
            }))"""
        )
        persistent = (
            final_state["intro"]["canonicalSource"].endswith(PHONE_MASTER_FILES["intro"])
            and final_state["intro"]["sourceMode"] == "network"
            and final_state["intro"]["src"].endswith(PHONE_MASTER_FILES["intro"])
            and final_state["intro"]["currentSrc"].endswith(PHONE_MASTER_FILES["intro"])
            and final_state["outro"]["canonicalSource"].endswith(PHONE_MASTER_FILES["outro"])
            and final_state["outro"]["sourceMode"] == "blob"
            and final_state["outro"]["warmState"] == "ready"
            and final_state["outro"]["src"].startswith("blob:")
            and final_state["outro"]["currentSrc"].startswith("blob:")
            and final_state["outro"]["sourceOverride"]
            == final_state["outro"]["phoneBlobUrl"]
            == final_state["outro"]["src"]
            and not final_state["outro"]["pendingSource"]
            and all(
                final_state[track]["readyState"] >= 2
                and final_state[track]["painted"]
                and final_state[track]["videoOpacity"] >= .99
                and final_state[track]["posterOpacity"] <= .01
                and final_state[track]["legacySlots"] == 0
                for track in ("intro", "outro")
            )
        )
        self.check(
            "both phone masters remain attached after cross-track reentry",
            persistent,
            final_state,
            kind="stale",
        )
        watches = self.stop_phone_visibility_watches(page)
        for track in ("intro", "outro"):
            watch = watches.get(track, {})
            self.check(
                f"phone {track} never re-exposes poster after first decode",
                watch.get("visibleSamples", 0) >= 20
                and watch.get("visibleSrcMutations") == 0
                and (track != "intro" or watch.get("srcMutations") == 0)
                and not watch.get("violations"),
                watch,
                kind="stale",
            )
        return {
            "samples": sample_report,
            "persistence": persistence,
            "finalState": final_state,
            "visibilityWatches": watches,
        }

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
        requested_names = {
            Path(urlsplit(request["url"]).path).name
            for request in events["media_requests"]
        }
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
            "desktop uses legacy clips and no phone delivery assets",
            not (requested_names & set(PHONE_MASTER_FILES.values()))
            and not events["phone_asset_requests"],
            {
                "media": sorted(requested_names),
                "phoneAssets": events["phone_asset_requests"],
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

    def phone_network_pass(
        self,
        page: Page,
        context: BrowserContext,
        events: dict[str, Any],
    ) -> dict[str, Any]:
        expected_urls = {
            without_fragment(urljoin(self.url, f"cake-studio/v17/clips/{filename}"))
            for filename in PHONE_MASTER_FILES.values()
        }
        expected_asset_urls = {
            without_fragment(urljoin(self.url, f"cake-studio/v17/clips/{filename}"))
            for filename in PHONE_AUX_FILES
        }
        request_urls = {
            without_fragment(request["url"])
            for request in events["media_requests"]
        }
        response_urls = {
            without_fragment(response["url"])
            for response in events["media_responses"]
        }
        range_urls = {
            without_fragment(response["url"])
            for response in events["media_responses"]
            if phone_transport_response_kind(response) == "range"
        }
        full_warm_urls = {
            without_fragment(response["url"])
            for response in events["media_responses"]
            if phone_transport_response_kind(response) == "full-warm"
        }
        invalid_transport_responses = [
            response
            for response in events["media_responses"]
            if phone_transport_response_kind(response) is None
        ]
        intro_url = without_fragment(
            urljoin(
                self.url,
                f"cake-studio/v17/clips/{PHONE_MASTER_FILES['intro']}",
            )
        )
        outro_url = without_fragment(
            urljoin(
                self.url,
                f"cake-studio/v17/clips/{PHONE_MASTER_FILES['outro']}",
            )
        )
        asset_request_urls = {
            without_fragment(request["url"])
            for request in events["phone_asset_requests"]
        }
        asset_response_urls = {
            without_fragment(response["url"])
            for response in events["phone_asset_responses"]
        }
        good_asset_urls = {
            without_fragment(response["url"])
            for response in events["phone_asset_responses"]
            if response["status"] == 200
            and response["contentType"].lower().startswith("image/webp")
        }
        state = page.evaluate(
            """() => {
              const units = {};
              for (const unit of window.__cakeStudioBookends.units) {
                const video = unit.phoneSlot.video;
                units[unit.trackName] = {
                  canonicalSource: unit.phoneMaster.src,
                  sourceMode: unit.phoneSlot.sourceOverride ? 'blob' : 'network',
                  sourceOverride: unit.phoneSlot.sourceOverride,
                  pendingSource: unit.phoneSlot.pendingSource,
                  warmState: unit.warmState,
                  phoneBlobUrl: unit.phoneBlobUrl,
                  src: video.getAttribute('src') || '',
                  currentSrc: video.currentSrc || '',
                  readyState: video.readyState,
                  paused: video.paused,
                };
              }
              return {
                playAttempts: window.__cakeV17PlayAttempts || [],
                drawAttempts: window.__cakeV17DrawAttempts || 0,
                atlasDrawAttempts: window.__cakeV17AtlasDrawAttempts || 0,
                frozenDraws: window.__cakeV17FrozenDraws || 0,
                frozenAtlasDraws: window.__cakeV17FrozenAtlasDraws || 0,
                buffers: document.querySelectorAll('.bookend-buffer').length,
                units,
              };
            }"""
        )
        self.check(
            "phone runtime requests exactly one media URL per track",
            request_urls == expected_urls,
            {"expected": sorted(expected_urls), "requested": sorted(request_urls)},
            kind="network",
        )
        self.check(
            "phone masters use intro 206 range plus outro full warm 200",
            response_urls == expected_urls
            and intro_url in range_urls
            and full_warm_urls == {outro_url}
            and not invalid_transport_responses,
            {
                "expected": sorted(expected_urls),
                "responded": sorted(response_urls),
                "ranges206": sorted(range_urls),
                "fullWarm200": sorted(full_warm_urls),
                "invalid": invalid_transport_responses,
            },
            kind="network",
        )
        self.check(
            "phone runtime requests each canonical atlas and terminal still",
            asset_request_urls == expected_asset_urls
            and asset_response_urls == expected_asset_urls
            and good_asset_urls == expected_asset_urls,
            {
                "expected": sorted(expected_asset_urls),
                "requested": sorted(asset_request_urls),
                "responded": sorted(asset_response_urls),
                "good": sorted(good_asset_urls),
            },
            kind="network",
        )
        self.check(
            "phone runtime has persistent network intro plus warmed blob outro",
            state["buffers"] == 0
            and set(state["units"]) == {"intro", "outro"}
            and state["units"]["intro"]["canonicalSource"].endswith(PHONE_MASTER_FILES["intro"])
            and state["units"]["intro"]["sourceMode"] == "network"
            and state["units"]["intro"]["src"].endswith(PHONE_MASTER_FILES["intro"])
            and state["units"]["intro"]["currentSrc"].endswith(PHONE_MASTER_FILES["intro"])
            and state["units"]["outro"]["canonicalSource"].endswith(PHONE_MASTER_FILES["outro"])
            and state["units"]["outro"]["sourceMode"] == "blob"
            and state["units"]["outro"]["warmState"] == "ready"
            and state["units"]["outro"]["src"].startswith("blob:")
            and state["units"]["outro"]["currentSrc"].startswith("blob:")
            and state["units"]["outro"]["sourceOverride"]
            == state["units"]["outro"]["phoneBlobUrl"]
            == state["units"]["outro"]["src"]
            and not state["units"]["outro"]["pendingSource"]
            and all(
                state["units"][track]["readyState"] >= 2
                and state["units"][track]["paused"]
                for track in ("intro", "outro")
            ),
            state,
            kind="network",
        )
        hashes: dict[str, Any] = {}
        for track, filename in PHONE_MASTER_FILES.items():
            url = urljoin(self.url, f"cake-studio/v17/clips/{filename}")
            response = context.request.get(url, timeout=45_000)
            payload = response.body()
            headers = {key.lower(): value for key, value in response.headers.items()}
            detail = {
                "url": url,
                "status": response.status,
                "contentType": headers.get("content-type", ""),
                "bytes": len(payload),
                "sha256": hashlib.sha256(payload).hexdigest(),
            }
            self.check(
                f"phone {track} exact accepted master bytes",
                response.status == 200
                and detail["contentType"].lower().startswith("video/mp4")
                and detail["bytes"] == PHONE_MASTER_BYTES[track]
                and detail["sha256"] == PHONE_MASTER_SHA256[track],
                detail,
                kind="transport",
            )
            hashes[track] = detail
            response.dispose()
        asset_hashes: dict[str, Any] = {}
        for kind, files, sizes, digests in (
            ("scrub atlas", PHONE_SCRUB_FILES, PHONE_SCRUB_BYTES, PHONE_SCRUB_SHA256),
            (
                "terminal still",
                PHONE_TERMINAL_FILES,
                PHONE_TERMINAL_BYTES,
                PHONE_TERMINAL_SHA256,
            ),
        ):
            for track, filename in files.items():
                url = urljoin(self.url, f"cake-studio/v17/clips/{filename}")
                response = context.request.get(url, timeout=45_000)
                payload = response.body()
                headers = {key.lower(): value for key, value in response.headers.items()}
                detail = {
                    "url": url,
                    "status": response.status,
                    "contentType": headers.get("content-type", ""),
                    "bytes": len(payload),
                    "sha256": hashlib.sha256(payload).hexdigest(),
                }
                self.check(
                    f"phone {track} exact accepted {kind} bytes",
                    response.status == 200
                    and detail["contentType"].lower().startswith("image/webp")
                    and detail["bytes"] == sizes[track]
                    and detail["sha256"] == digests[track],
                    detail,
                    kind="transport",
                )
                asset_hashes[f"{track}-{kind.replace(' ', '-')}"] = detail
                response.dispose()
        self.check(
            "phone runtime never calls play or legacy canvas draw",
            not state["playAttempts"]
            and state["drawAttempts"] == 0
            and state["atlasDrawAttempts"] >= 2,
            state,
            kind="network",
        )
        self.check(
            "phone motion has no browser errors",
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
        return {
            "events": events,
            "state": state,
            "hashes": hashes,
            "assetHashes": asset_hashes,
        }

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
        elif profile.mobile:
            index = 4 if track == "intro" else 2
            progress = (index + .4) / len(EXPECTED_IDS[track])
            capture = self.seek_phone_bookend(page, track, progress)
            self.check_phone_capture(
                f"{profile.name} {language} {track}", capture, profile
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
              const phone = scene.querySelector('[data-bookend-phone-video]');
              const unit = window.__cakeStudioBookends?.units?.find(
                item => item.trackName === scene.dataset.bookendTrack
              );
              const ar = aperture.getBoundingClientRect();
              const posterStyle = getComputedStyle(poster);
              const canvasStyle = getComputedStyle(canvas);
              const phoneStyle = getComputedStyle(phone);
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
                transport: scene.dataset.sequenceTransport || '',
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
                phone: {
                  fit: phoneStyle.objectFit,
                  opacity: Number.parseFloat(phoneStyle.opacity),
                  display: phoneStyle.display,
                  width: phone.videoWidth,
                  height: phone.videoHeight,
                   src: phone.getAttribute('src') || '',
                   currentSrc: phone.currentSrc || '',
                   canonicalSource: unit?.phoneMaster?.src || '',
                   sourceMode: unit?.phoneSlot?.sourceOverride ? 'blob' : 'network',
                   warmState: unit?.warmState || '',
                   phoneBlobUrl: unit?.phoneBlobUrl || '',
                   sourceOverride: unit?.phoneSlot?.sourceOverride || '',
                   pendingSource: unit?.phoneSlot?.pendingSource || '',
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
                info["transport"] == "poster"
                and not info["painted"]
                and info["canvas"]["display"] == "none"
                and info["phone"]["display"] == "none"
                and not info["phone"]["src"]
                and not info["phone"]["currentSrc"]
                and info["poster"]["opacity"] >= 0.99
            )
        elif profile.mobile:
            expected_source = PHONE_MASTER_FILES[track]
            network_source = (
                info["phone"]["sourceMode"] == "network"
                and not info["phone"]["sourceOverride"]
                and info["phone"]["src"].endswith(expected_source)
                and info["phone"]["currentSrc"].endswith(expected_source)
            )
            blob_source = (
                track == "outro"
                and info["phone"]["sourceMode"] == "blob"
                and info["phone"]["warmState"] == "ready"
                and info["phone"]["src"].startswith("blob:")
                and info["phone"]["currentSrc"].startswith("blob:")
                and info["phone"]["sourceOverride"]
                == info["phone"]["phoneBlobUrl"]
                == info["phone"]["src"]
                and not info["phone"]["pendingSource"]
            )
            passed = passed and (
                info["transport"] == "phone-master"
                and info["painted"]
                and info["phone"]["display"] != "none"
                and info["phone"]["opacity"] >= 0.99
                and info["phone"]["fit"] == "contain"
                and info["phone"]["width"] == PHONE_WIDTH
                and info["phone"]["height"] == PHONE_HEIGHT
                and info["phone"]["canonicalSource"].endswith(expected_source)
                and (network_source or blob_source)
                and info["canvas"]["opacity"] <= 0.01
                and info["poster"]["opacity"] <= 0.01
            )
        else:
            passed = passed and (
                info["transport"] == "clip-canvas"
                and info["painted"]
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
            elif profile.mobile:
                report["phoneMaster"] = self.phone_master_pass(page, profile)
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
                report["network"] = self.phone_network_pass(page, context, events)
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
                  phoneVideos: [...document.querySelectorAll('[data-bookend-phone-video]')].map(video => ({
                    src: video.getAttribute('src') || '',
                    currentSrc: video.currentSrc || '',
                    readyState: video.readyState,
                  })),
                  transports: [...document.querySelectorAll('[data-cake-bookend]')].map(
                    scene => scene.dataset.sequenceTransport || ''
                  ),
                  phoneState: (window.__cakeStudioBookends?.units || []).map(unit => ({
                    track: unit.trackName,
                    warmState: unit.warmState,
                    phoneBlobUrl: unit.phoneBlobUrl,
                    sourceOverride: unit.phoneSlot.sourceOverride,
                    pendingSource: unit.phoneSlot.pendingSource,
                    atlasReady: unit.phoneAtlasReady,
                    atlasLoading: unit.phoneAtlasLoading,
                    atlasSrc: unit.phoneAtlasImage?.src || '',
                    landingReady: unit.phoneLandingReady,
                    landingLoading: unit.phoneLandingLoading,
                    landingSrc: unit.phoneLanding?.getAttribute('src') || '',
                  })),
                })"""
            )
            expected_buffers = 0 if profile.mobile else 4
            self.check(
                f"{profile.name} ready runtime uses still mode",
                state["runtime"] == "ready"
                and state["manifestReady"] is True
                and len(state["slots"]) == expected_buffers
                and all(not slot["src"] and not slot["currentSrc"] for slot in state["slots"])
                and len(state["phoneVideos"]) == 2
                and all(not video["src"] and not video["currentSrc"] for video in state["phoneVideos"])
                and state["transports"] == ["poster", "poster"]
                and len(state["phoneState"]) == 2
                and all(
                    unit["warmState"] == "idle"
                    and not unit["phoneBlobUrl"]
                    and not unit["sourceOverride"]
                    and not unit["pendingSource"]
                    and not unit["atlasReady"]
                    and not unit["atlasLoading"]
                    and not unit["atlasSrc"]
                    and not unit["landingReady"]
                    and not unit["landingLoading"]
                    and not unit["landingSrc"]
                    for unit in state["phoneState"]
                ),
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
                  atlasDrawAttempts: window.__cakeV17AtlasDrawAttempts || 0,
                  slots: [...document.querySelectorAll('.bookend-buffer')].map(video => ({
                    src: video.getAttribute('src') || '',
                    currentSrc: video.currentSrc || '',
                    readyState: video.readyState,
                  })),
                  phoneVideos: [...document.querySelectorAll('[data-bookend-phone-video]')].map(video => ({
                    src: video.getAttribute('src') || '',
                    currentSrc: video.currentSrc || '',
                    readyState: video.readyState,
                  })),
                  phoneState: (window.__cakeStudioBookends?.units || []).map(unit => ({
                    track: unit.trackName,
                    warmState: unit.warmState,
                    phoneBlobUrl: unit.phoneBlobUrl,
                    sourceOverride: unit.phoneSlot.sourceOverride,
                    pendingSource: unit.phoneSlot.pendingSource,
                    atlasReady: unit.phoneAtlasReady,
                    atlasLoading: unit.phoneAtlasLoading,
                    atlasSrc: unit.phoneAtlasImage?.src || '',
                    landingReady: unit.phoneLandingReady,
                    landingLoading: unit.phoneLandingLoading,
                    landingSrc: unit.phoneLanding?.getAttribute('src') || '',
                  })),
                })"""
            )
            no_media = (
                not events["media_requests"]
                and not events["media_responses"]
                and not events["phone_asset_requests"]
                and not events["phone_asset_responses"]
                and not after["playAttempts"]
                and after["atlasDrawAttempts"] == 0
                and all(not slot["src"] and not slot["currentSrc"] for slot in after["slots"])
                and all(not video["src"] and not video["currentSrc"] for video in after["phoneVideos"])
                and all(
                    unit["warmState"] == "idle"
                    and not unit["phoneBlobUrl"]
                    and not unit["sourceOverride"]
                    and not unit["pendingSource"]
                    and not unit["atlasReady"]
                    and not unit["atlasLoading"]
                    and not unit["atlasSrc"]
                    and not unit["landingReady"]
                    and not unit["landingLoading"]
                    and not unit["landingSrc"]
                    for unit in after["phoneState"]
                )
            )
            self.check(
                f"{profile.name} requests zero phone motion media and creates zero blob",
                no_media,
                {
                    "mp4Requests": events["media_requests"],
                    "mp4Responses": events["media_responses"],
                    "imageRequests": events["phone_asset_requests"],
                    "imageResponses": events["phone_asset_responses"],
                    **after,
                },
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
            phone_state = (
                self.profile_reports.get(PHONE_MOTION.name, {})
                .get("network", {})
                .get("state", {})
            )
            self.check(
                "freeze-draw sabotage intercepted phone atlas canvas",
                int(phone_state.get("frozenAtlasDraws", 0)) > 0,
                {
                    "attempts": phone_state.get("atlasDrawAttempts", 0),
                    "frozen": phone_state.get("frozenAtlasDraws", 0),
                },
                kind="sabotage",
            )
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
            "expectedContract": {
                "version": EXPECTED_VERSION,
                "manifest": EXPECTED_FINAL_MANIFEST,
                "phoneFiles": PHONE_MASTER_FILES,
                "phoneBytes": PHONE_MASTER_BYTES,
                "phoneSha256": PHONE_MASTER_SHA256,
                "phoneDelivery": {
                    "width": PHONE_WIDTH,
                    "height": PHONE_HEIGHT,
                    "fps": PHONE_FPS,
                    "beatFrames": PHONE_BEAT_FRAMES,
                    "finalTailExtraFrames": PHONE_FINAL_TAIL_EXTRA_FRAMES,
                    "terminalFrameOffset": PHONE_TERMINAL_FRAME_OFFSET,
                    "keyframeInterval": PHONE_KEYFRAME_INTERVAL,
                },
                "terminalTargets": {
                    "intro": phone_terminal_target(687 / PHONE_FPS),
                    "outro": phone_terminal_target(347 / PHONE_FPS),
                },
                "phoneJoinThreshold": {
                    "minSsim": PHONE_JOIN_MIN_SSIM,
                    "maxMae": PHONE_JOIN_MAX_MAE,
                },
            },
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
    require(EXPECTED_VERSION == "1.7.2", "v1.7.2 version")
    require(EXPECTED_FINAL_MANIFEST.endswith("v=1.7.2-phone-final"), "v1.7.2 cache key")
    require(
        PHONE_MASTER_FILES
        == {
            "intro": "CST17-INTRO-PHONE-v172.mp4",
            "outro": "CST17-OUTRO-PHONE-v172.mp4",
        },
        "phone master filenames",
    )
    require(
        PHONE_MASTER_BYTES == {"intro": 5_091_536, "outro": 2_479_879},
        "accepted phone master byte sizes",
    )
    require(
        PHONE_MASTER_SHA256
        == {
            "intro": "6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670",
            "outro": "65e51883d99862fd86ca159bda4fd1c7bdd0f394734be422cb650516f31dca15",
        },
        "accepted phone master hashes",
    )
    require(
        PHONE_SCRUB_BYTES == {"intro": 326_692, "outro": 179_822}
        and PHONE_TERMINAL_BYTES == {"intro": 106_416, "outro": 91_242}
        and len(PHONE_AUX_FILES) == 4,
        "accepted phone atlas and terminal sizes",
    )
    require(
        expected_phone_scrub_contract("intro")["frames"][-1] == 685
        and expected_phone_scrub_contract("outro")["frames"][-1] == 345
        and expected_phone_scrub_contract("intro")["samples"] == 32
        and expected_phone_scrub_contract("outro")["samples"] == 16,
        "phone scrub atlas terminal tiles",
    )
    require(
        expected_phone_terminal_contract("intro")["time"] == 45.666667
        and expected_phone_terminal_contract("outro")["time"] == 23.0
        and expected_phone_terminal_contract("intro")["quality"] == 100,
        "phone terminal landing contract",
    )
    require(
        (
            PHONE_WIDTH,
            PHONE_HEIGHT,
            PHONE_FPS,
            PHONE_BEAT_FRAMES,
            PHONE_FINAL_TAIL_EXTRA_FRAMES,
            PHONE_TERMINAL_FRAME_OFFSET,
            PHONE_KEYFRAME_INTERVAL,
        )
        == (640, 360, 15, 68, 7, 2, 8),
        "accepted phone delivery geometry and cadence",
    )
    require(
        10 * PHONE_BEAT_FRAMES + PHONE_FINAL_TAIL_EXTRA_FRAMES == 687
        and 5 * PHONE_BEAT_FRAMES + PHONE_FINAL_TAIL_EXTRA_FRAMES == 347,
        "phone frame counts",
    )
    require(
        math.isclose(687 / PHONE_FPS, 45.8)
        and math.isclose(347 / PHONE_FPS, 23.133333333333333),
        "phone durations",
    )
    require(
        math.isclose(phone_terminal_target(45.8), 45.666666666666664)
        and math.isclose(phone_terminal_target(347 / PHONE_FPS), 23.0)
        and math.isclose(phone_progress_target(45.8, 1), 45.666666666666664),
        "EOF-safe terminal targets",
    )
    require(
        phone_join_accepted(.982033, 2.464),
        "measured accepted CRF28 join remains green",
    )
    require(
        not phone_join_accepted(.981999, 2.464)
        and not phone_join_accepted(.982033, 2.501)
        and not phone_join_accepted(.737486, 15.531),
        "phone join thresholds remain fail capable",
    )
    require(
        phone_anchor_accepted(.960219, 2.878, .174524, 47.583),
        "measured browser compositor anchor remains green",
    )
    require(
        not phone_anchor_accepted(.174524, 47.583, .960219, 2.878)
        and not phone_anchor_accepted(.949999, 2.878, .174524, 47.583)
        and not phone_anchor_accepted(.960219, 4.001, .174524, 47.583),
        "wrong and out-of-bound phone anchors remain red",
    )
    require(
        .998005 >= PHONE_TERMINAL_IDENTITY_MIN_SSIM
        and .661 <= PHONE_TERMINAL_IDENTITY_MAX_MAE
        and not (
            .996999 >= PHONE_TERMINAL_IDENTITY_MIN_SSIM
            and .661 <= PHONE_TERMINAL_IDENTITY_MAX_MAE
        )
        and not (
            .998005 >= PHONE_TERMINAL_IDENTITY_MIN_SSIM
            and 1.001 <= PHONE_TERMINAL_IDENTITY_MAX_MAE
        ),
        "terminal image decode identity remains calibrated and fail capable",
    )
    require(
        phone_presentation_matches(10.933333, 10.987420)
        and not phone_presentation_matches(10.866667, 10.987420),
        "15 fps presentation tolerance accepts containing frame and rejects stale frame",
    )
    require(
        phone_transport_response_kind({
            "status": 206,
            "range": "bytes=0-",
            "acceptRanges": "bytes",
            "contentRange": "bytes 0-99/100",
            "contentType": "video/mp4",
        }) == "range",
        "phone range response classification",
    )
    require(
        phone_transport_response_kind({
            "status": 200,
            "range": "",
            "acceptRanges": "bytes",
            "contentRange": "",
            "contentType": "video/mp4",
        }) == "full-warm",
        "phone full warm response classification",
    )
    require(
        phone_transport_response_kind({
            "status": 200,
            "range": "bytes=0-",
            "acceptRanges": "bytes",
            "contentRange": "",
            "contentType": "video/mp4",
        }) is None,
        "malformed phone transport remains fatal",
    )

    first = np.zeros((PROBE_HEIGHT, PROBE_WIDTH, 3), dtype=np.uint8)
    first[:, :, 1] = 96
    ok, encoded = cv2.imencode(".png", first)
    require(bool(ok), "synthetic PNG encode")
    payload = encoded.tobytes()
    large = cv2.resize(first, (390, 219), interpolation=cv2.INTER_NEAREST)
    ok, encoded_large = cv2.imencode(".png", large)
    require(bool(ok), "large synthetic PNG encode")
    normalized = normalize_probe(encoded_large.tobytes())
    require(decode_png(normalized).shape[:2] == (PROBE_HEIGHT, PROBE_WIDTH), "phone probe normalization")
    normalized_join = normalize_phone_join(payload)
    require(
        decode_png(normalized_join).shape[:2]
        == (PHONE_DISPLAY_HEIGHT, PHONE_DISPLAY_WIDTH),
        "phone join display normalization",
    )
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
    require(
        changed_ssim < PHONE_RENDER_MIN_SSIM
        or changed_mae > PHONE_RENDER_MAX_MAE,
        "phone render threshold rejects wrong pixels",
    )

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
            "http://127.0.0.1/worlds/cake-studio/v17/clips/CST17-INTRO-PHONE-v172.mp4",
            "net::ERR_ABORTED",
        )
        == "v17-media-rearm",
        "phone master rearm cancellation",
    )
    require(
        expected_cancellation_reason(
            "http://127.0.0.1/worlds/cake-studio/v17/clips/CST17-INTRO-PHONE-v172.mp4",
            "net::ERR_INVALID_HTTP_RESPONSE",
        )
        == "v17-local-range-cancel",
        "exact local range harness cancellation",
    )
    require(
        expected_cancellation_reason(
            "https://example.com/worlds/cake-studio/v17/clips/CST17-INTRO-PHONE-v172.mp4",
            "net::ERR_INVALID_HTTP_RESPONSE",
        )
        is None,
        "remote invalid response remains fatal",
    )
    require(
        expected_cancellation_reason(
            "http://127.0.0.1/worlds/cake-studio/clips/ordinary.mp4",
            "net::ERR_INVALID_HTTP_RESPONSE",
        )
        is None,
        "ordinary local invalid response remains fatal",
    )
    require(
        expected_cancellation_reason(
            "http://127.0.0.1/worlds/cake-studio/clips/CST-050.mp4",
            "net::ERR_INVALID_HTTP_RESPONSE",
        )
        == "core-local-range-cancel",
        "exact local core range cancellation",
    )
    require(
        expected_cancellation_reason(
            "http://localhost:4711/worlds/cake-studio/clips/CST-001.mp4",
            "net::ERR_CONTENT_LENGTH_MISMATCH",
        )
        == "core-local-range-cancel",
        "exact localhost core length cancellation",
    )
    require(
        expected_cancellation_reason(
            "https://example.com/worlds/cake-studio/clips/CST-050.mp4",
            "net::ERR_INVALID_HTTP_RESPONSE",
        )
        is None,
        "remote core invalid response remains fatal",
    )
    require(
        expected_cancellation_reason(
            "http://127.0.0.1/worlds/cake-studio/clips/CST-050.mp4",
            "net::ERR_FAILED",
        )
        is None,
        "unrecognized local core failure remains fatal",
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
        description="Verify the final ready Cake Studio v1.7.2 split bookend runtime."
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
