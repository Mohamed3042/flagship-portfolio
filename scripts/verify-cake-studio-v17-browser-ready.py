#!/usr/bin/env python3
"""Rendered v1.8 gate for Cake Studio's direct decoded-video bookends.

The gate samples every keyed bookend clip forward and reverse on desktop,
samples the opening/middle/ending keys in both phone orientations, proves the
visible surface is one of three paused video slots, rejects every retired proxy,
checks endpoint pixels, byte ranges, reduced motion, bilingual layout, and zero
play calls. Cadence under a moving hand is graded separately by
``verify-cake-studio-cadence.py``.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import math
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlsplit

import cv2
import numpy as np
from PIL import Image, ImageDraw
from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError, sync_playwright


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


VERSION = "1.8.0"
MANIFEST_REF = "cake-studio/v17/manifest.json?v=1.8.0-direct"
INTRO_IDS = [f"I{index:02d}" for index in range(1, 11)]
OUTRO_IDS = [f"O{index:02d}" for index in range(1, 6)]
EXPECTED_IDS = {"intro": INTRO_IDS, "outro": OUTRO_IDS}
EXPECTED_ALL = INTRO_IDS + OUTRO_IDS
PROBE_WIDTH = 320
PROBE_HEIGHT = 180
ANCHOR_MIN_SSIM = 0.970
ANCHOR_MAX_MAE = 6.0
DETERMINISTIC_MIN_SSIM = 0.998
DETERMINISTIC_MAX_MAE = 0.5
PROXY_SELECTOR = (
    "[data-bookend-canvas],[data-bookend-phone-video],"
    "[data-phone-scrub-atlas],[data-phone-terminal-landing],"
    ".bookend-canvas,.bookend-phone-video,.bookend-phone-scrub-atlas,"
    ".bookend-phone-terminal-landing"
)
RETIRED_FILES = {
    "CST17-INTRO-PHONE-v172.mp4",
    "CST17-OUTRO-PHONE-v172.mp4",
    "CST17-INTRO-PHONE-SCRUB-v172.webp",
    "CST17-OUTRO-PHONE-SCRUB-v172.webp",
    "CST17-INTRO-PHONE-TERMINAL-v172.webp",
    "CST17-OUTRO-PHONE-TERMINAL-v172.webp",
}


@dataclass(frozen=True)
class Profile:
    name: str
    width: int
    height: int
    mobile: bool
    reduced: bool = False

    @property
    def dpr(self) -> int:
        return 3 if self.mobile else 1


PROFILES = (
    Profile("desktop", 1440, 1000, False),
    Profile("phone-portrait", 390, 844, True),
    Profile("phone-landscape", 844, 390, True),
    Profile("reduced-desktop", 1440, 1000, False, True),
    Profile("reduced-phone-portrait", 390, 844, True, True),
    Profile("reduced-phone-landscape", 844, 390, True, True),
)


def data_url_bytes(value: str) -> bytes:
    prefix = "data:image/png;base64,"
    if not value.startswith(prefix):
        raise ValueError("frame probe is not a PNG data URL")
    return base64.b64decode(value[len(prefix) :])


def decode_png(payload: bytes) -> np.ndarray:
    image = cv2.imdecode(np.frombuffer(payload, dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("PNG probe did not decode")
    return image


def similarity(first: bytes, second: bytes) -> tuple[float, float]:
    left = decode_png(first)
    right = decode_png(second)
    if left.shape != right.shape:
        raise ValueError(f"probe shapes differ: {left.shape} vs {right.shape}")
    mae = float(np.mean(np.abs(left.astype(np.float32) - right.astype(np.float32))))
    left_gray = cv2.cvtColor(left, cv2.COLOR_BGR2GRAY).astype(np.float64)
    right_gray = cv2.cvtColor(right, cv2.COLOR_BGR2GRAY).astype(np.float64)
    left_mean = cv2.GaussianBlur(left_gray, (11, 11), 1.5)
    right_mean = cv2.GaussianBlur(right_gray, (11, 11), 1.5)
    left_var = cv2.GaussianBlur(left_gray * left_gray, (11, 11), 1.5) - left_mean**2
    right_var = cv2.GaussianBlur(right_gray * right_gray, (11, 11), 1.5) - right_mean**2
    covariance = cv2.GaussianBlur(left_gray * right_gray, (11, 11), 1.5) - left_mean * right_mean
    c1 = (0.01 * 255) ** 2
    c2 = (0.03 * 255) ** 2
    score = ((2 * left_mean * right_mean + c1) * (2 * covariance + c2)) / (
        (left_mean**2 + right_mean**2 + c1) * (left_var + right_var + c2)
    )
    return float(np.mean(score)), mae


def frame_digest(payload: bytes) -> str:
    return hashlib.sha256(decode_png(payload).tobytes()).hexdigest()


def frame_energy(payload: bytes) -> tuple[float, float]:
    image = decode_png(payload).astype(np.float32)
    return float(image.mean()), float(image.std())


class NetworkAudit:
    def __init__(self, page: Page, target_url: str) -> None:
        self.local = urlsplit(target_url).hostname in {"127.0.0.1", "localhost"}
        self.console: list[str] = []
        self.page: list[str] = []
        self.failed: list[dict[str, str]] = []
        self.local_media_artifacts: list[dict[str, str]] = []
        self.http: list[dict[str, Any]] = []
        self.requests: list[str] = []
        page.on("console", self._console)
        page.on("pageerror", lambda error: self.page.append(str(error)))
        page.on("request", lambda request: self.requests.append(request.url))
        page.on("requestfailed", self._failed)
        page.on("response", self._response)

    def _console(self, message: Any) -> None:
        if message.type != "error":
            return
        if self.local and message.text in {
            "Failed to load resource: net::ERR_INVALID_HTTP_RESPONSE",
            "Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH",
        }:
            return
        self.console.append(message.text)

    def _failed(self, request: Any) -> None:
        item = {"url": request.url, "failure": request.failure or "unknown"}
        parsed = urlsplit(request.url)
        if (
            self.local
            and parsed.path.lower().endswith(".mp4")
            and item["failure"]
            in {"net::ERR_INVALID_HTTP_RESPONSE", "net::ERR_CONTENT_LENGTH_MISMATCH"}
        ):
            self.local_media_artifacts.append(item)
            return
        self.failed.append(item)

    def _response(self, response: Any) -> None:
        if response.status >= 400:
            self.http.append({"url": response.url, "status": response.status})

    def result(self) -> dict[str, Any]:
        return {
            "consoleErrors": self.console,
            "pageErrors": self.page,
            "requestFailures": self.failed,
            "httpErrors": self.http,
            "localMediaTransportBoundary": {
                "label": "[SERVER_ARTIFACT]" if self.local_media_artifacts else None,
                "count": len(self.local_media_artifacts),
                "items": self.local_media_artifacts,
            },
            "requests": self.requests,
        }


class Verification:
    def __init__(
        self,
        url: str,
        output: Path,
        sabotage: bool,
        profiles: tuple[Profile, ...],
    ) -> None:
        self.url = url
        self.output = output
        self.sabotage = sabotage
        self.profiles = profiles
        self.output.mkdir(parents=True, exist_ok=True)
        self.checks: list[dict[str, Any]] = []
        self.failures: list[str] = []
        self.reports: dict[str, Any] = {}
        self.screenshots: list[tuple[str, Path]] = []
        self.manifest: dict[str, Any] | None = None

    def check(self, name: str, passed: bool, detail: Any, kind: str = "general") -> bool:
        passed = bool(passed)
        if isinstance(detail, (dict, list, tuple)):
            text = json.dumps(detail, ensure_ascii=False, sort_keys=True)
        else:
            text = str(detail)
        self.checks.append({"name": name, "pass": passed, "kind": kind, "detail": text})
        print(f"{'PASS' if passed else 'FAIL'} {name}: {text}")
        if not passed:
            self.failures.append(f"{name}: {text}")
        return passed

    @staticmethod
    def make_context(browser: Browser, profile: Profile) -> BrowserContext:
        context = browser.new_context(
            viewport={"width": profile.width, "height": profile.height},
            screen={"width": profile.width, "height": profile.height},
            locale="en-US",
            reduced_motion="reduce" if profile.reduced else "no-preference",
            is_mobile=profile.mobile,
            has_touch=profile.mobile,
            device_scale_factor=profile.dpr,
        )
        context.add_init_script(
            """(() => {
              try { localStorage.removeItem('mm-lang'); } catch {}
              window.__cakeV18PlayAttempts = [];
              const original = HTMLMediaElement.prototype.play;
              HTMLMediaElement.prototype.play = function(...args) {
                if (this.closest?.('[data-cake-bookend]')) {
                  window.__cakeV18PlayAttempts.push({
                    clip:this.dataset.sequenceClip || '',
                    src:this.currentSrc || this.getAttribute('src') || ''
                  });
                }
                return original.apply(this, args);
              };
            })()"""
        )
        return context

    def open_page(
        self,
        context: BrowserContext,
        profile: Profile,
    ) -> tuple[Page, NetworkAudit]:
        page = context.new_page()
        audit = NetworkAudit(page, self.url)
        page.goto(self.url, wait_until="domcontentloaded", timeout=45_000)
        try:
            page.wait_for_function(
                """() => window.__cakeStudioBookends?.state === 'ready'
                  && window.__cakeStudioBookends?.manifestReady === true
                  && window.__cakeStudioBookends?.units?.length === 2""",
                timeout=60_000,
            )
        except TimeoutError as error:
            state = page.evaluate(
                """() => ({
                  runtime:window.__cakeStudioBookends?.state || 'missing',
                  error:window.__cakeStudioBookends?.error || '',
                  units:window.__cakeStudioBookends?.units?.length || 0,
                  body:document.body.dataset.version || ''
                })"""
            )
            raise RuntimeError(f"{profile.name} runtime did not become ready: {state}") from error
        if self.sabotage:
            page.evaluate(
                """() => {
                  const proxy = document.createElement('canvas');
                  proxy.dataset.phoneScrubAtlas = 'sabotage';
                  proxy.className = 'bookend-phone-scrub-atlas';
                  proxy.width = 16; proxy.height = 9;
                  document.querySelector('.bookend-intro .bookend-aperture')?.append(proxy);
                }"""
            )
        return page, audit

    def preflight(self, page: Page, profile: Profile) -> dict[str, Any]:
        state = page.evaluate(
            f"""async () => {{
              const runtime = window.__cakeStudioBookends;
              const scenes = [...document.querySelectorAll('[data-cake-bookend]')];
              const response = await fetch(scenes[0].dataset.bookendManifest, {{cache:'no-cache'}});
              const manifest = await response.json();
              return {{
                bodyVersion:document.body.dataset.version || '',
                runtimeVersion:runtime?.version || '',
                runtimeState:runtime?.state || '',
                manifestReady:runtime?.manifestReady,
                manifestRefs:scenes.map(scene => scene.dataset.bookendManifest || ''),
                manifest,
                tracks:scenes.map(scene => scene.dataset.bookendTrack || ''),
                videos:document.querySelectorAll('[data-bookend-video]').length,
                posters:document.querySelectorAll('[data-bookend-poster]').length,
                proxies:document.querySelectorAll({json.dumps(PROXY_SELECTOR)}).length,
                snapshots:runtime?.snapshot?.() || [],
                units:(runtime?.units || []).map(unit => ({{
                  track:unit.trackName,
                  slots:unit.slots.length,
                  ids:unit.clips.map(clip => clip.id),
                  sources:unit.clips.map(clip => clip.src),
                }})),
                reelShots:document.querySelectorAll('#cake-reel [data-clip]').length,
                reelVideos:document.querySelectorAll('#cake-reel .film-frame video').length,
                reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
                viewport:{{width:innerWidth,height:innerHeight,dpr:devicePixelRatio}},
              }};
            }}"""
        )
        manifest = state["manifest"]
        scrub = manifest.get("delivery", {}).get("scrubTransport")
        contract = (
            state["bodyVersion"] == VERSION
            and state["runtimeVersion"] == VERSION
            and state["runtimeState"] == "ready"
            and state["manifestReady"] is True
            and state["manifestRefs"] == [MANIFEST_REF, MANIFEST_REF]
            and manifest.get("schema") == "cake-studio-bookends/v2"
            and manifest.get("version") == VERSION
            and manifest.get("ready") is True
            and scrub
            == {
                "engine": "direct-video-anchor-three-slot",
                "clock": "scroll",
                "slots": 3,
                "preloadWindow": 1,
                "blobWarmAhead": 2,
                "seekCoalescing": "last-write-wins",
                "visibleProxy": "none",
                "profiles": ["desktop", "phone-portrait", "phone-landscape"],
            }
            and state["tracks"] == ["intro", "outro"]
            and state["videos"] == 6
            and state["posters"] == 2
            and state["proxies"] == 0
            and state["reelShots"] == 50
            and state["reelVideos"] == 2
            and state["reduced"] == profile.reduced
            and state["viewport"]
            == {"width": profile.width, "height": profile.height, "dpr": profile.dpr}
            and all(snapshot.get("phone") is None for snapshot in state["snapshots"])
        )
        mappings = {item["track"]: item for item in state["units"]}
        mapping_ok = set(mappings) == {"intro", "outro"}
        for track, ids in EXPECTED_IDS.items():
            unit = mappings.get(track, {})
            mapping_ok = mapping_ok and unit.get("slots") == 3 and unit.get("ids") == ids
            mapping_ok = mapping_ok and unit.get("sources") == [
                f"cake-studio/v17/clips/CST17-{clip_id}.mp4" for clip_id in ids
            ]
            mapping_ok = mapping_ok and "phoneMaster" not in manifest["tracks"][track]
        retired = manifest.get("retiredDelivery", {})
        retired_ok = set(retired) == {
            "phoneMaster", "phoneScrubAtlas", "phoneTerminalStill"
        } and all(
            value.get("status") == "inert"
            and value.get("active") is False
            and value.get("since") == VERSION
            for value in retired.values()
        )
        self.check(f"{profile.name} strict v1.8 direct shell", contract, state, "structure")
        self.check(f"{profile.name} exact 10 plus 5 mapping", mapping_ok, mappings, "mapping")
        self.check(f"{profile.name} retired proxy ledger is inert", retired_ok, retired, "retirement")
        if self.manifest is None:
            self.manifest = manifest
        return state

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
    def set_progress(page: Page, track: str, progress: float) -> None:
        selector = f'[data-cake-bookend="{track}"]'
        found = page.evaluate(
            """({selector,progress}) => {
              const scene = document.querySelector(selector);
              if (!scene) return false;
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const prior = document.documentElement.style.scrollBehavior;
              document.documentElement.style.scrollBehavior = 'auto';
              scrollTo({top:top + span * progress,behavior:'instant'});
              document.documentElement.style.scrollBehavior = prior;
              scene.dispatchEvent(new CustomEvent('scene:live'));
              dispatchEvent(new Event('scroll'));
              return true;
            }""",
            {"selector": selector, "progress": progress},
        )
        if not found:
            raise RuntimeError(f"missing bookend {track}")
        page.wait_for_function(
            """({selector,progress}) => {
              const p = Number.parseFloat(document.querySelector(selector)
                ?.style.getPropertyValue('--p') || '-1');
              return Math.abs(p - progress) <= .002;
            }""",
            arg={"selector": selector, "progress": progress},
            timeout=8_000,
        )

    def capture(
        self,
        page: Page,
        profile: Profile,
        track: str,
        index: int,
        fraction: float,
        label: str,
    ) -> dict[str, Any]:
        ids = EXPECTED_IDS[track]
        clip = ids[index]
        progress = (index + fraction) / len(ids)
        self.set_progress(page, track, progress)
        selector = f'[data-cake-bookend="{track}"]'
        try:
            page.wait_for_function(
                """({selector,clip}) => {
                  const scene = document.querySelector(selector);
                  const video = scene?.querySelector('[data-bookend-video].on');
                  const target = Number(scene?.dataset.sequenceTargetTime || -1);
                  return scene?.dataset.sequenceTransport === 'direct-video'
                    && scene.dataset.sequenceMode === 'motion'
                    && scene.dataset.sequenceState === 'ready'
                    && scene.dataset.sequenceClip === clip
                    && scene.classList.contains('sequence-painted')
                    && video?.dataset.sequenceClip === clip
                    && video.videoWidth === 1280 && video.videoHeight === 720
                    && video.paused && !video.seeking && video.readyState >= 2
                    && Math.abs(video.currentTime - target) <= .055;
                }""",
                arg={"selector": selector, "clip": clip},
                timeout=30_000,
            )
        except TimeoutError as error:
            detail = page.locator(selector).evaluate(
                """scene => {
                  const video = scene.querySelector('[data-bookend-video].on');
                  return {
                    clip:scene.dataset.sequenceClip || '',
                    transport:scene.dataset.sequenceTransport || '',
                    state:scene.dataset.sequenceState || '',
                    target:scene.dataset.sequenceTargetTime || '',
                    time:scene.dataset.sequenceTime || '',
                    painted:scene.classList.contains('sequence-painted'),
                    videoClip:video?.dataset.sequenceClip || '',
                    currentTime:video?.currentTime, readyState:video?.readyState,
                    seeking:video?.seeking, src:video?.currentSrc || ''
                  };
                }"""
            )
            raise RuntimeError(f"{label} did not settle: {detail}") from error
        page.wait_for_timeout(35)
        state = page.locator(selector).evaluate(
            f"""scene => {{
              const video = scene.querySelector('[data-bookend-video].on');
              const poster = scene.querySelector('[data-bookend-poster]');
              const aperture = scene.querySelector('.bookend-aperture');
              const unit = window.__cakeStudioBookends.units.find(
                item => item.trackName === scene.dataset.bookendTrack
              );
              const vr = video.getBoundingClientRect();
              const ar = aperture.getBoundingClientRect();
              const probe = document.createElement('canvas');
              probe.width = {PROBE_WIDTH}; probe.height = {PROBE_HEIGHT};
              probe.getContext('2d', {{alpha:false}}).drawImage(
                video, 0, 0, probe.width, probe.height
              );
              return {{
                track:unit.trackName, clip:scene.dataset.sequenceClip || '',
                index:Number(scene.dataset.sequenceIndex || 0),
                progress:Number.parseFloat(scene.style.getPropertyValue('--p') || '-1'),
                target:Number(scene.dataset.sequenceTargetTime || -1),
                time:Number(scene.dataset.sequenceTime || -1),
                lag:Number(scene.dataset.sequenceLag || -1),
                transport:scene.dataset.sequenceTransport || '',
                mode:scene.dataset.sequenceMode || '',
                state:scene.dataset.sequenceState || '',
                proxyCount:scene.querySelectorAll({json.dumps(PROXY_SELECTOR)}).length,
                videoCount:scene.querySelectorAll('[data-bookend-video]').length,
                onCount:scene.querySelectorAll('[data-bookend-video].on').length,
                slots:unit.slots.length, phone:window.__cakeStudioBookends.snapshot()
                  .find(item => item.track === unit.trackName)?.phone,
                video:{{width:video.videoWidth,height:video.videoHeight,
                  currentTime:video.currentTime,duration:video.duration,
                  readyState:video.readyState,seeking:video.seeking,paused:video.paused,
                  fit:getComputedStyle(video).objectFit,
                  opacity:Number(getComputedStyle(video).opacity),
                  src:video.currentSrc,rect:{{left:vr.left,top:vr.top,right:vr.right,
                    bottom:vr.bottom,width:vr.width,height:vr.height}}}},
                posterOpacity:Number(getComputedStyle(poster).opacity),
                aperture:{{left:ar.left,top:ar.top,right:ar.right,bottom:ar.bottom,
                  width:ar.width,height:ar.height}},
                viewport:{{width:innerWidth,height:innerHeight}},
                pixels:probe.toDataURL('image/png'),
              }};
            }}"""
        )
        pixels = data_url_bytes(state.pop("pixels"))
        mean, spread = frame_energy(pixels)
        state["digest"] = frame_digest(pixels)
        state["pixelMean"] = mean
        state["pixelStdDev"] = spread
        state["pixels"] = pixels
        aperture = state["aperture"]
        video_rect = state["video"]["rect"]
        base_ok = (
            state["clip"] == clip
            and state["index"] == index + 1
            and state["transport"] == "direct-video"
            and state["mode"] == "motion"
            and state["state"] == "ready"
            and state["proxyCount"] == 0
            and state["videoCount"] == 3
            and state["onCount"] == 1
            and state["slots"] == 3
            and state["phone"] is None
            and state["video"]["paused"]
            and not state["video"]["seeking"]
            and state["video"]["readyState"] >= 2
            and state["video"]["opacity"] >= 0.99
            and state["posterOpacity"] <= 0.01
            and abs(state["video"]["currentTime"] - state["target"]) <= 0.055
            and spread >= 2.0
        )
        if profile.mobile:
            layout_ok = (
                state["video"]["fit"] == "cover"
                and abs(aperture["left"]) <= 1.5
                and abs(aperture["top"]) <= 1.5
                and abs(aperture["width"] - profile.width) <= 1.5
                and abs(aperture["height"] - profile.height) <= 1.5
                and abs(video_rect["left"]) <= 1.5
                and abs(video_rect["top"]) <= 1.5
                and abs(video_rect["width"] - profile.width) <= 1.5
                and abs(video_rect["height"] - profile.height) <= 1.5
            )
        else:
            layout_ok = (
                state["video"]["fit"] == "contain"
                and abs(aperture["width"] / aperture["height"] - 16 / 9) <= 0.01
                and aperture["left"] >= -1
                and aperture["right"] <= profile.width + 1
                and aperture["top"] >= -1
                and aperture["bottom"] <= profile.height + 1
            )
        report_state = {key: value for key, value in state.items() if key != "pixels"}
        self.check(f"{profile.name} {label} decoded direct video", base_ok, report_state, "render")
        self.check(f"{profile.name} {label} presentation geometry", layout_ok, report_state, "layout")
        screenshot = self.output / f"{profile.name}-{label}.png"
        page.screenshot(path=str(screenshot), full_page=False)
        self.screenshots.append((f"{profile.name} / {label}", screenshot))
        return state

    @staticmethod
    def endpoint_probe(page: Page, track: str, endpoint: str) -> bytes:
        selector = f'[data-cake-bookend="{track}"]'
        value = page.locator(selector).evaluate(
            f"""async (scene, endpoint) => {{
              const response = await fetch(endpoint, {{cache:'no-cache'}});
              if (!response.ok) throw new Error(`endpoint HTTP ${{response.status}}`);
              const bitmap = await createImageBitmap(await response.blob());
              const probe = document.createElement('canvas');
              probe.width = {PROBE_WIDTH}; probe.height = {PROBE_HEIGHT};
              probe.getContext('2d', {{alpha:false}}).drawImage(
                bitmap, 0, 0, probe.width, probe.height
              );
              bitmap.close();
              return probe.toDataURL('image/png');
            }}""",
            endpoint,
        )
        return data_url_bytes(value)

    def range_pass(self, context: BrowserContext) -> dict[str, Any]:
        assert self.manifest is not None
        results: dict[str, Any] = {}
        for track in ("intro", "outro"):
            for clip in self.manifest["tracks"][track]["clips"]:
                response = context.request.get(
                    urljoin(self.url, clip["src"]),
                    headers={"Range": "bytes=0-1023"},
                    timeout=30_000,
                )
                headers = {key.lower(): value for key, value in response.headers.items()}
                body = response.body()
                detail = {
                    "status": response.status,
                    "contentRange": headers.get("content-range", ""),
                    "acceptRanges": headers.get("accept-ranges", ""),
                    "contentType": headers.get("content-type", ""),
                    "bytes": len(body),
                }
                passed = (
                    response.status == 206
                    and detail["contentRange"].startswith("bytes 0-1023/")
                    and detail["acceptRanges"].lower() == "bytes"
                    and detail["contentType"].lower().startswith("video/mp4")
                    and detail["bytes"] == 1024
                )
                self.check(f"{clip['id']} explicit 206 byte range", passed, detail, "transport")
                results[clip["id"]] = detail
                response.dispose()
        self.check("all 15 active clips support byte ranges", len(results) == 15, sorted(results), "transport")
        return results

    def language_pass(self, page: Page, profile: Profile) -> dict[str, Any]:
        self.set_language(page, "ar")
        state = page.evaluate(
            """() => {
              const visible = node => {
                const style = getComputedStyle(node);
                const rect = node.getBoundingClientRect();
                return style.display !== 'none' && style.visibility !== 'hidden'
                  && Number(style.opacity || 1) > .05 && rect.width > 0 && rect.height > 0;
              };
              const scenes = [...document.querySelectorAll('[data-cake-bookend]')];
              return {
                lang:document.documentElement.lang, dir:document.documentElement.dir,
                selected:scenes.map(scene => [...scene.querySelectorAll('.L.ar')].filter(visible).length),
                rejected:scenes.map(scene => [...scene.querySelectorAll('.L.en')].filter(visible).length),
                overflow:document.documentElement.scrollWidth - innerWidth,
              };
            }"""
        )
        passed = (
            state["lang"] == "ar"
            and state["dir"] == "rtl"
            and all(value >= 3 for value in state["selected"])
            and state["rejected"] == [0, 0]
            and state["overflow"] <= 1
        )
        self.check(f"{profile.name} Arabic parity", passed, state, "language")
        self.set_language(page, "en")
        return state

    def motion_pass(
        self,
        browser: Browser,
        profile: Profile,
        include_all: bool,
    ) -> None:
        context = self.make_context(browser, profile)
        try:
            page, audit = self.open_page(context, profile)
            preflight = self.preflight(page, profile)
            if include_all:
                sequence = [
                    (track, index, 0.4, clip_id)
                    for track, ids in EXPECTED_IDS.items()
                    for index, clip_id in enumerate(ids)
                ]
            else:
                sequence = [
                    ("intro", 0, 0.4, "I01"),
                    ("intro", 4, 0.4, "I05"),
                    ("intro", 9, 0.4, "I10"),
                    ("outro", 0, 0.4, "O01"),
                    ("outro", 2, 0.4, "O03"),
                    ("outro", 4, 0.4, "O05"),
                ]
            forward: dict[str, dict[str, Any]] = {}
            for track, index, fraction, clip_id in sequence:
                forward[clip_id] = self.capture(
                    page, profile, track, index, fraction, f"forward-{clip_id}"
                )
            reverse: dict[str, Any] = {}
            for track, index, fraction, clip_id in reversed(sequence):
                state = self.capture(
                    page, profile, track, index, fraction, f"reverse-{clip_id}"
                )
                ssim, mae = similarity(forward[clip_id]["pixels"], state["pixels"])
                same = forward[clip_id]["digest"] == state["digest"]
                passed = same or (
                    ssim >= DETERMINISTIC_MIN_SSIM and mae <= DETERMINISTIC_MAX_MAE
                )
                detail = {"digestEqual": same, "ssim": ssim, "mae": mae}
                self.check(f"{profile.name} {clip_id} forward reverse deterministic", passed, detail, "reverse")
                reverse[clip_id] = detail
            self.check(
                f"{profile.name} keyed frames are visually distinct",
                len({state["digest"] for state in forward.values()}) == len(forward),
                {clip: state["digest"] for clip, state in forward.items()},
                "pixel",
            )

            anchors: dict[str, Any] = {}
            if include_all:
                assert self.manifest is not None
                for track, index, fraction, name, endpoint_key in (
                    ("intro", 9, 0.999, "I10-to-CST-001", "last"),
                    ("outro", 0, 0.001, "CST-050-to-O01", "first"),
                ):
                    state = self.capture(page, profile, track, index, fraction, name)
                    endpoint = self.manifest["tracks"][track]["clips"][index][endpoint_key]
                    endpoint_pixels = self.endpoint_probe(page, track, endpoint)
                    ssim, mae = similarity(state["pixels"], endpoint_pixels)
                    passed = ssim >= ANCHOR_MIN_SSIM and mae <= ANCHOR_MAX_MAE
                    detail = {"endpoint": endpoint, "ssim": ssim, "mae": mae}
                    self.check(f"browser decoded seam {name}", passed, detail, "anchor")
                    anchors[name] = detail
            language = self.language_pass(page, profile)
            ranges = self.range_pass(context) if include_all else None
            network = audit.result()
            retired_requests = sorted(
                url for url in network["requests"]
                if Path(urlsplit(url).path).name in RETIRED_FILES
            )
            play_attempts = page.evaluate("window.__cakeV18PlayAttempts || []")
            self.check(f"{profile.name} never calls play", not play_attempts, play_attempts, "network")
            self.check(f"{profile.name} requests no retired proxy media", not retired_requests, retired_requests, "network")
            self.check(
                f"{profile.name} has no browser/network errors",
                not network["consoleErrors"]
                and not network["pageErrors"]
                and not network["requestFailures"]
                and not network["httpErrors"],
                network,
                "network",
            )
            self.reports[profile.name] = {
                "preflight": preflight,
                "forward": {
                    key: {field: value for field, value in state.items() if field != "pixels"}
                    for key, state in forward.items()
                },
                "reverse": reverse,
                "anchors": anchors,
                "language": language,
                "ranges": ranges,
                "network": network,
            }
        finally:
            context.close()

    def reduced_pass(self, browser: Browser, profile: Profile) -> None:
        context = self.make_context(browser, profile)
        try:
            page, audit = self.open_page(context, profile)
            preflight = self.preflight(page, profile)
            endpoints: dict[str, Any] = {}
            for track, progress in (("intro", 0.0), ("outro", 1.0)):
                self.set_progress(page, track, progress)
                page.wait_for_function(
                    """track => {
                      const scene = document.querySelector(`[data-cake-bookend="${track}"]`);
                      const poster = scene?.querySelector('[data-bookend-poster]');
                      return scene?.dataset.sequenceMode === 'still'
                        && scene.dataset.sequenceTransport === 'poster'
                        && scene.dataset.sequenceState === 'reduced-motion'
                        && poster?.complete && poster.naturalWidth === 1280;
                    }""",
                    arg=track,
                    timeout=10_000,
                )
                state = page.locator(f'[data-cake-bookend="{track}"]').evaluate(
                    f"""scene => {{
                      const aperture = scene.querySelector('.bookend-aperture');
                      const poster = scene.querySelector('[data-bookend-poster]');
                      const videos = [...scene.querySelectorAll('[data-bookend-video]')];
                      const ar = aperture.getBoundingClientRect();
                      const pr = poster.getBoundingClientRect();
                      return {{
                        mode:scene.dataset.sequenceMode || '',
                        transport:scene.dataset.sequenceTransport || '',
                        state:scene.dataset.sequenceState || '',
                        painted:scene.classList.contains('sequence-painted'),
                        proxyCount:scene.querySelectorAll({json.dumps(PROXY_SELECTOR)}).length,
                        videoSources:videos.map(video => ({{src:video.getAttribute('src') || '',
                          currentSrc:video.currentSrc || '',display:getComputedStyle(video).display}})),
                        poster:{{opacity:Number(getComputedStyle(poster).opacity),
                          fit:getComputedStyle(poster).objectFit,width:poster.naturalWidth,
                          height:poster.naturalHeight,rect:{{left:pr.left,top:pr.top,
                            width:pr.width,height:pr.height}}}},
                        aperture:{{left:ar.left,top:ar.top,width:ar.width,height:ar.height}},
                      }};
                    }}"""
                )
                layout_ok = (
                    state["poster"]["fit"] == ("cover" if profile.mobile else "contain")
                    and state["poster"]["opacity"] >= 0.99
                )
                if profile.mobile:
                    layout_ok = layout_ok and (
                        abs(state["aperture"]["left"]) <= 1.5
                        and abs(state["aperture"]["top"]) <= 1.5
                        and abs(state["aperture"]["width"] - profile.width) <= 1.5
                        and abs(state["aperture"]["height"] - profile.height) <= 1.5
                    )
                passed = (
                    state["mode"] == "still"
                    and state["transport"] == "poster"
                    and state["state"] == "reduced-motion"
                    and not state["painted"]
                    and state["proxyCount"] == 0
                    and all(
                        not video["src"] and not video["currentSrc"]
                        and video["display"] == "none"
                        for video in state["videoSources"]
                    )
                    and state["poster"]["width"] == 1280
                    and state["poster"]["height"] == 720
                    and layout_ok
                )
                self.check(f"{profile.name} {track} poster-only reduced motion", passed, state, "reduced")
                screenshot = self.output / f"{profile.name}-{track}.png"
                page.screenshot(path=str(screenshot), full_page=False)
                self.screenshots.append((f"{profile.name} / {track}", screenshot))
                endpoints[track] = state
            network = audit.result()
            v17_mp4 = [
                url for url in network["requests"]
                if "/cake-studio/v17/clips/" in url.lower()
                and urlsplit(url).path.lower().endswith(".mp4")
            ]
            play_attempts = page.evaluate("window.__cakeV18PlayAttempts || []")
            self.check(f"{profile.name} requests zero v1.8 motion media", not v17_mp4, v17_mp4, "reduced")
            self.check(f"{profile.name} makes zero play calls", not play_attempts, play_attempts, "reduced")
            self.check(
                f"{profile.name} has no browser/network errors",
                not network["consoleErrors"]
                and not network["pageErrors"]
                and not network["requestFailures"]
                and not network["httpErrors"],
                network,
                "network",
            )
            self.reports[profile.name] = {
                "preflight": preflight,
                "endpoints": endpoints,
                "network": network,
            }
        finally:
            context.close()

    def contact_sheet(self) -> Path | None:
        if not self.screenshots:
            return None
        width, height, columns = 440, 330, 3
        rows = math.ceil(len(self.screenshots) / columns)
        sheet = Image.new("RGB", (width * columns, height * rows), "#07110f")
        draw = ImageDraw.Draw(sheet)
        for index, (label, path) in enumerate(self.screenshots):
            image = Image.open(path).convert("RGB")
            image.thumbnail((width - 20, height - 42))
            x0 = (index % columns) * width
            y0 = (index // columns) * height
            x = x0 + (width - image.width) // 2
            y = y0 + 30 + (height - 34 - image.height) // 2
            sheet.paste(image, (x, y))
            draw.text((x0 + 8, y0 + 7), label, fill="#f0dfc7")
        path = self.output / "contact-sheet.jpg"
        sheet.save(path, quality=90, optimize=True)
        return path

    def finish(self) -> int:
        contact = self.contact_sheet()
        report = {
            "schema": "cake-studio-v18-browser-ready/v2",
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "url": self.url,
            "sabotage": self.sabotage,
            "profiles": self.reports,
            "checks": self.checks,
            "failures": self.failures,
            "screenshots": [str(path) for _, path in self.screenshots],
            "contactSheet": str(contact) if contact else None,
        }
        report_path = self.output / ("report-sabotage.json" if self.sabotage else "report.json")
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        if self.failures:
            print(
                f"CAKE_STUDIO_V18_BROWSER_READY_FAIL failures={len(self.failures)} "
                f"checks={len(self.checks)} report={report_path}",
                file=sys.stderr,
            )
            return 1
        print(
            f"CAKE_STUDIO_V18_BROWSER_READY_OK checks={len(self.checks)} "
            f"profiles={len(self.reports)} screenshots={len(self.screenshots)} "
            f"report={report_path}"
        )
        return 0

    def run(self, playwright: Any) -> int:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            for profile in self.profiles:
                try:
                    if profile.reduced:
                        self.reduced_pass(browser, profile)
                    else:
                        self.motion_pass(browser, profile, include_all=profile.name == "desktop")
                except Exception as error:
                    self.check(
                        f"{profile.name} verification completed",
                        False,
                        f"{type(error).__name__}: {error}",
                        "runtime",
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

    require(EXPECTED_ALL == [f"I{n:02d}" for n in range(1, 11)] + [f"O{n:02d}" for n in range(1, 6)], "clip order")
    require(len(PROFILES) == 6, "profile matrix")
    require(MANIFEST_REF.endswith("v=1.8.0-direct"), "cache key")
    require(len(RETIRED_FILES) == 6, "retired asset ledger")
    frame = np.zeros((PROBE_HEIGHT, PROBE_WIDTH, 3), dtype=np.uint8)
    frame[:, :, 1] = 96
    ok, encoded = cv2.imencode(".png", frame)
    require(bool(ok), "PNG encode")
    payload = encoded.tobytes()
    ssim, mae = similarity(payload, payload)
    require(ssim >= 0.999999 and mae == 0, "identical similarity")
    changed = frame.copy()
    changed[:, : PROBE_WIDTH // 2, 2] = 255
    ok, encoded_changed = cv2.imencode(".png", changed)
    require(bool(ok), "changed PNG encode")
    changed_ssim, changed_mae = similarity(payload, encoded_changed.tobytes())
    require(changed_ssim < DETERMINISTIC_MIN_SSIM and changed_mae > DETERMINISTIC_MAX_MAE, "pixel gate fail-capable")
    require(frame_digest(payload) == frame_digest(payload), "deterministic digest")
    print(f"CAKE_STUDIO_V18_BROWSER_READY_SELF_TEST_OK tests={tests}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url")
    parser.add_argument("--output", type=Path)
    parser.add_argument(
        "--sabotage",
        action="store_true",
        help="Inject one retired scrub-atlas node; the strict shell must fail",
    )
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument(
        "--profile",
        choices=[profile.name for profile in PROFILES],
        help="Run one named profile for diagnosis",
    )
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if not args.url or not args.output:
        parser.error("--url and --output are required unless --self-test is used")
    profiles = tuple(
        profile for profile in PROFILES
        if args.profile is None or profile.name == args.profile
    )
    verification = Verification(args.url, args.output.resolve(), args.sabotage, profiles)
    with sync_playwright() as playwright:
        return verification.run(playwright)


if __name__ == "__main__":
    raise SystemExit(main())
