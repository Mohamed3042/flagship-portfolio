#!/usr/bin/env python3
"""Fail-before phone performance gate for Cake Studio v1.7.2 bookends.

This is deliberately separate from the final correctness verifier.  It uses a
cold, throttled 390x844 Chrome context and real CDP touch input to measure what
is visible *during* continuous scrolling, rather than waiting for every seek to
settle.  The four required profiles are intro/outro x rapid/slow touch.

The script is diagnostic-only: it does not route, replace, or mutate product
resources.  A non-zero exit is the expected result until the live runtime meets
the transition-performance contract below.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import statistics
import sys
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Iterable
from urllib.parse import urlsplit, urlunsplit

from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError, sync_playwright


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


V17_CLIP_MARKER = "/cake-studio/v17/clips/"
EXPECTED_VERSION = "1.7.2"
EXPECTED_MANIFEST = "cake-studio/v17/manifest.json?v=1.7.2-phone-final"
PHONE_MASTER_FILES = {
    "intro": "CST17-INTRO-PHONE-v172.mp4",
    "outro": "CST17-OUTRO-PHONE-v172.mp4",
}
PHONE_MASTER_BYTES = {"intro": 5_091_536, "outro": 2_479_879}
PHONE_MASTER_SHA256 = {
    "intro": "6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670",
    "outro": "65e51883d99862fd86ca159bda4fd1c7bdd0f394734be422cb650516f31dca15",
}
PHONE_WIDTH = 640
PHONE_HEIGHT = 360
PHONE_FPS = 15
PHONE_BEAT_FRAMES = 68
PHONE_FINAL_TAIL_EXTRA_FRAMES = 7
PHONE_TERMINAL_FRAME_OFFSET = 2
PHONE_KEYFRAME_INTERVAL = 8
PHONE_TRACK_CLIPS = {"intro": 10, "outro": 5}
PHONE_MASTER_FRAMES = {
    track: count * PHONE_BEAT_FRAMES + PHONE_FINAL_TAIL_EXTRA_FRAMES
    for track, count in PHONE_TRACK_CLIPS.items()
}
PHONE_MASTER_DURATIONS = {
    track: frames / PHONE_FPS for track, frames in PHONE_MASTER_FRAMES.items()
}
CLIP_RE = re.compile(
    r"CST17-(?:(?P<clip>[IO]\d{2})|(?P<master>INTRO|OUTRO)-PHONE-v\d+)\.mp4",
    re.IGNORECASE,
)
VIEWPORT = {"width": 390, "height": 844}
CPU_THROTTLE_RATE = 4
NETWORK_DOWNLOAD_BPS = 1_000_000  # 8 Mbit/s
NETWORK_UPLOAD_BPS = 500_000
NETWORK_LATENCY_MS = 100
SAMPLE_PERIOD_MS = 40
RECOVERY_WINDOW_MS = 5_000


@dataclass(frozen=True)
class TouchProfile:
    name: str
    track: str
    pace: str
    move_steps: int
    move_delay_ms: int
    between_swipes_ms: int
    max_swipes: int

    @property
    def rapid(self) -> bool:
        return self.pace == "rapid"


PROFILES = (
    TouchProfile("intro-rapid-cold", "intro", "rapid", 6, 28, 55, 16),
    TouchProfile("intro-slow-cold", "intro", "slow", 10, 90, 130, 16),
    TouchProfile("outro-rapid-cold", "outro", "rapid", 6, 28, 55, 10),
    TouchProfile("outro-slow-cold", "outro", "slow", 10, 90, 130, 10),
)


# Installed before any product JavaScript.  The recorder observes only the two
# bookend canvases/videos and remains inert until begin(track) is called.
INSTRUMENTATION = rf"""
(() => {{
  'use strict';
  const finite = (value) => Number.isFinite(value) ? value : null;
  const opacity = (node) => node ? Number.parseFloat(getComputedStyle(node).opacity || '0') : 0;
  const now = () => performance.now();
  const diag = {{
    samplePeriodMs: {SAMPLE_PERIOD_MS},
    activeTrack: null,
    startedAt: 0,
    samples: [],
    draws: [],
    targets: [],
    marks: [],
    playCalls: [],
    lastDraw: null,
    lastTargetKey: '',
    observer: null,
    timer: null,

    scene() {{
      return this.activeTrack
        ? document.querySelector(`[data-cake-bookend="${{this.activeTrack}}"]`)
        : null;
    }},

    relativeTime() {{ return Math.max(0, now() - this.startedAt); }},

    captureTarget() {{
      const scene = this.scene();
      if (!scene) return;
      const clip = scene.dataset.sequenceClip || '';
      const target = Number.parseFloat(scene.dataset.sequenceTargetTime || 'NaN');
      const key = clip && Number.isFinite(target) ? `${{clip}}|${{target.toFixed(4)}}` : '';
      if (!key || key === this.lastTargetKey) return;
      this.lastTargetKey = key;
      this.targets.push({{
        t: this.relativeTime(), key, clip, target, completedAt: null,
        progress: Number.parseFloat(scene.style.getPropertyValue('--p') || '0')
      }});
    }},

    recordPaint(scene, video, kind) {{
      if (!scene || scene.dataset.cakeBookend !== this.activeTrack) return;
      this.captureTarget();
      const t = this.relativeTime();
      const clip = scene.dataset.sequenceClip || video?.dataset?.sequenceClip || '';
      const target = Number.parseFloat(scene.dataset.sequenceTargetTime || 'NaN');
      const mediaTime = Number.parseFloat(video?.currentTime ?? 'NaN');
      const error = Number.isFinite(target) && Number.isFinite(mediaTime)
        ? Math.abs(target - mediaTime) : null;
      const key = clip && Number.isFinite(target) ? `${{clip}}|${{target.toFixed(4)}}` : '';
      const targetEvent = [...this.targets].reverse()
        .find(event => event.key === key && event.completedAt === null);
      const latencyMs = targetEvent ? t - targetEvent.t : null;
      if (targetEvent) targetEvent.completedAt = t;
      const paint = {{
        t, kind, clip, target: finite(target), mediaTime: finite(mediaTime),
        error: finite(error), fresh: error !== null && error <= .25,
        targetKey: key, latencyMs: finite(latencyMs)
      }};
      this.draws.push(paint);
      this.lastDraw = paint;
    }},

    sample() {{
      const scene = this.scene();
      if (!scene) return;
      this.captureTarget();
      const t = this.relativeTime();
      const clip = scene.dataset.sequenceClip || '';
      const target = Number.parseFloat(scene.dataset.sequenceTargetTime || 'NaN');
      const painted = Number.parseFloat(scene.dataset.sequenceTime || 'NaN');
      const canvas = scene.querySelector('[data-bookend-canvas]');
      const phoneVideo = scene.querySelector('[data-bookend-phone-video]');
      const poster = scene.querySelector('[data-bookend-poster]');
      const videos = [...scene.querySelectorAll('.bookend-buffer')];
      const transport = scene.dataset.sequenceTransport || '';
      const active = transport === 'phone-master'
        ? phoneVideo
        : videos.find(video => video.dataset.sequenceClip === clip) || null;
      const canvasOpacity = opacity(canvas);
      const phoneVideoOpacity = opacity(phoneVideo);
      const posterOpacity = opacity(poster);
      const canvasVisible = canvasOpacity >= .5;
      const phoneVideoVisible = phoneVideoOpacity >= .5;
      const surfaceVisible = transport === 'phone-master' ? phoneVideoVisible : canvasVisible;
      const posterVisible = posterOpacity >= .5;
      const error = Number.isFinite(target) && Number.isFinite(painted)
        ? Math.abs(target - painted) : null;
      const lastDrawAge = this.lastDraw ? t - this.lastDraw.t : null;
      this.samples.push({{
        t,
        phase: this.marks.length ? this.marks[this.marks.length - 1].label : 'setup',
        scrollY,
        progress: Number.parseFloat(scene.style.getPropertyValue('--p') || '0'),
        live: scene.classList.contains('is-live'),
        mode: scene.dataset.sequenceMode || '',
        transport,
        state: scene.dataset.sequenceState || '',
        clip,
        target: finite(target),
        painted: finite(painted),
        error: finite(error),
        paintedClass: scene.classList.contains('sequence-painted'),
        canvasOpacity,
        phoneVideoOpacity,
        posterOpacity,
        canvasVisible,
        phoneVideoVisible,
        surfaceVisible,
        posterVisible,
        fresh: surfaceVisible && error !== null && error <= .25,
        staleVisible: surfaceVisible && (error === null || error > .25),
        frameAgeMs: surfaceVisible ? finite(lastDrawAge) : null,
        posterComplete: Boolean(poster?.complete),
        posterWidth: poster?.naturalWidth || 0,
        posterHeight: poster?.naturalHeight || 0,
        video: active ? {{
          clip: active.dataset.sequenceClip || '',
          currentTime: finite(active.currentTime),
          readyState: active.readyState,
          networkState: active.networkState,
          seeking: active.seeking,
          src: active.currentSrc || active.getAttribute('src') || ''
        }} : null
      }});
    }},

    begin(track) {{
      this.stop(false);
      this.activeTrack = track;
      this.startedAt = now();
      this.samples = [];
      this.draws = [];
      this.targets = [];
      this.marks = [];
      this.playCalls = [];
      this.lastDraw = null;
      this.lastTargetKey = '';
      const scene = this.scene();
      if (scene) {{
        this.observer = new MutationObserver(() => this.captureTarget());
        this.observer.observe(scene, {{
          attributes: true,
          attributeFilter: ['data-sequence-target-time', 'data-sequence-clip']
        }});
      }}
      this.timer = setInterval(() => this.sample(), this.samplePeriodMs);
      this.mark('recording-start');
      this.sample();
    }},

    mark(label) {{
      if (!this.activeTrack) return;
      this.captureTarget();
      this.marks.push({{t: this.relativeTime(), label}});
      this.sample();
    }},

    stop(clearTrack = true) {{
      if (this.activeTrack) this.sample();
      if (this.timer) clearInterval(this.timer);
      if (this.observer) this.observer.disconnect();
      this.timer = null;
      this.observer = null;
      const result = {{
        samplePeriodMs: this.samplePeriodMs,
        track: this.activeTrack,
        samples: this.samples,
        draws: this.draws,
        targets: this.targets,
        marks: this.marks,
        playCalls: this.playCalls
      }};
      if (clearTrack) this.activeTrack = null;
      return result;
    }}
  }};

  const originalPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function(...args) {{
    if (this.closest?.('[data-bookend-sequence]') && diag.activeTrack) {{
      diag.playCalls.push({{
        t: diag.relativeTime(),
        clip: this.dataset.sequenceClip || '',
        src: this.currentSrc || this.getAttribute('src') || ''
      }});
    }}
    return originalPlay.apply(this, args);
  }};

  const originalDraw = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function(...args) {{
    const canvas = this.canvas;
    if (canvas?.matches?.('[data-bookend-canvas]') && diag.activeTrack) {{
      const scene = canvas.closest('[data-cake-bookend]');
      if (scene?.dataset.cakeBookend === diag.activeTrack) {{
        diag.recordPaint(scene, args[0], 'canvas-draw');
      }}
    }}
    return originalDraw.apply(this, args);
  }};

  const recordNative = (event) => {{
    const video = event.target;
    if (!video?.matches?.('[data-bookend-phone-video]') || !diag.activeTrack) return;
    const scene = video.closest('[data-cake-bookend]');
    if (scene?.dataset.sequenceTransport !== 'phone-master') return;
    // The decoded native frame is already composited when these events fire.
    queueMicrotask(() => diag.recordPaint(scene, video, `native-${{event.type}}`));
  }};
  document.addEventListener('loadeddata', recordNative, true);
  document.addEventListener('seeked', recordNative, true);

  window.__cakePhonePerf = diag;
}})();
"""


def clean_url(url: str) -> str:
    parts = urlsplit(url)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, parts.query, ""))


def phone_terminal_target(duration: float) -> float:
    return duration - PHONE_TERMINAL_FRAME_OFFSET / PHONE_FPS


def expected_contract() -> dict[str, Any]:
    return {
        "version": EXPECTED_VERSION,
        "manifest": EXPECTED_MANIFEST,
        "delivery": {
            "width": PHONE_WIDTH,
            "height": PHONE_HEIGHT,
            "fps": PHONE_FPS,
            "beatFrames": PHONE_BEAT_FRAMES,
            "finalTailExtraFrames": PHONE_FINAL_TAIL_EXTRA_FRAMES,
            "terminalFrameOffset": PHONE_TERMINAL_FRAME_OFFSET,
            "keyframeInterval": PHONE_KEYFRAME_INTERVAL,
        },
        "tracks": {
            track: {
                "file": PHONE_MASTER_FILES[track],
                "bytes": PHONE_MASTER_BYTES[track],
                "sha256": PHONE_MASTER_SHA256[track],
                "frames": PHONE_MASTER_FRAMES[track],
                "duration": PHONE_MASTER_DURATIONS[track],
                "terminalTarget": phone_terminal_target(PHONE_MASTER_DURATIONS[track]),
            }
            for track in ("intro", "outro")
        },
    }


def runtime_contract_failures(state: dict[str, Any]) -> list[str]:
    failures: list[str] = []
    if state.get("bodyVersion") != EXPECTED_VERSION:
        failures.append("body version")
    if state.get("runtimeVersion") != EXPECTED_VERSION:
        failures.append("runtime version")
    if state.get("references") != [EXPECTED_MANIFEST, EXPECTED_MANIFEST]:
        failures.append("manifest cache key")
    manifest = state.get("manifest") or {}
    if manifest.get("version") != EXPECTED_VERSION or manifest.get("ready") is not True:
        failures.append("manifest readiness/version")
    delivery = (manifest.get("delivery") or {}).get("phoneMaster") or {}
    expected_delivery = expected_contract()["delivery"]
    if any(delivery.get(key) != value for key, value in expected_delivery.items()):
        failures.append("manifest phone delivery")
    units = {unit.get("track"): unit.get("phoneMaster") or {} for unit in state.get("units", [])}
    if set(units) != {"intro", "outro"}:
        failures.append("runtime phone tracks")
        return failures
    for track, master in units.items():
        expected_source = f"cake-studio/v17/clips/{PHONE_MASTER_FILES[track]}"
        if (
            master.get("src") != expected_source
            or master.get("width") != PHONE_WIDTH
            or master.get("height") != PHONE_HEIGHT
            or master.get("fps") != PHONE_FPS
            or master.get("beatFrames") != PHONE_BEAT_FRAMES
            or master.get("finalTailExtraFrames") != PHONE_FINAL_TAIL_EXTRA_FRAMES
            or master.get("terminalFrameOffset") != PHONE_TERMINAL_FRAME_OFFSET
            or master.get("keyframeInterval") != PHONE_KEYFRAME_INTERVAL
            or master.get("frames") != PHONE_MASTER_FRAMES[track]
            or abs(float(master.get("duration", -1)) - PHONE_MASTER_DURATIONS[track]) > .001
        ):
            failures.append(f"{track} phone master")
    return failures


def read_runtime_contract(page: Page) -> dict[str, Any]:
    return page.evaluate(
        """async () => {
          const runtime = window.__cakeStudioBookends;
          const scenes = [...document.querySelectorAll('[data-cake-bookend]')];
          const references = scenes.map(scene => scene.dataset.bookendManifest || '');
          let manifest = null;
          let manifestError = '';
          try {
            const response = await fetch(references[0], {cache: 'no-cache'});
            if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
            manifest = await response.json();
          } catch (error) {
            manifestError = String(error);
          }
          return {
            bodyVersion: document.body.dataset.version || '',
            runtimeVersion: runtime?.version || '',
            references,
            manifest,
            manifestError,
            units: (runtime?.units || []).map(unit => ({
              track: unit.trackName,
              phoneMaster: unit.phoneMaster,
            })),
          };
        }"""
    )


def percentile(values: Iterable[float], fraction: float) -> float | None:
    ordered = sorted(float(value) for value in values if value is not None and math.isfinite(float(value)))
    if not ordered:
        return None
    if len(ordered) == 1:
        return ordered[0]
    rank = (len(ordered) - 1) * fraction
    lower = math.floor(rank)
    upper = math.ceil(rank)
    if lower == upper:
        return ordered[lower]
    return ordered[lower] + (ordered[upper] - ordered[lower]) * (rank - lower)


def ratio(items: list[dict[str, Any]], predicate: Callable[[dict[str, Any]], bool]) -> float:
    if not items:
        return 0.0
    return sum(1 for item in items if predicate(item)) / len(items)


def between(items: Iterable[dict[str, Any]], start: float, end: float) -> list[dict[str, Any]]:
    return [item for item in items if start <= float(item.get("t", -1)) <= end]


def longest_run_ms(
    samples: list[dict[str, Any]],
    predicate: Callable[[dict[str, Any]], bool],
    *,
    start: float,
    end: float,
) -> float:
    bounded = between(samples, start, end)
    if not bounded:
        return 0.0
    longest = 0.0
    run_start: float | None = None
    for sample in bounded:
        t = float(sample["t"])
        if predicate(sample):
            if run_start is None:
                run_start = t
        elif run_start is not None:
            longest = max(longest, t - run_start)
            run_start = None
    if run_start is not None:
        longest = max(longest, min(end, float(bounded[-1]["t"])) - run_start)
    return longest


def count_runs(
    samples: list[dict[str, Any]],
    predicate: Callable[[dict[str, Any]], bool],
) -> int:
    runs = 0
    active = False
    for sample in samples:
        matched = predicate(sample)
        if matched and not active:
            runs += 1
        active = matched
    return runs


def clip_id(url: str) -> str | None:
    match = CLIP_RE.search(url)
    if not match:
        return None
    if match.group("clip"):
        return match.group("clip").upper()
    return f"{match.group('master').upper()}_PHONE"


def cancellation_reason(url: str, failure: str) -> str | None:
    parsed = urlsplit(url)
    local_harness = parsed.hostname in {"127.0.0.1", "localhost"}
    if parsed.scheme == "blob" and failure == "net::ERR_ABORTED":
        return "core-blob-rearm"
    if (
        V17_CLIP_MARKER in url.lower()
        and parsed.path.lower().endswith(".mp4")
        and (
            any(marker in failure for marker in ("ERR_ABORTED", "ERR_CONTENT_LENGTH_MISMATCH"))
            or (local_harness and "ERR_INVALID_HTTP_RESPONSE" in failure)
        )
    ):
        return "v17-local-range-cancel" if local_harness and "ERR_INVALID_HTTP_RESPONSE" in failure else "v17-media-rearm"
    if (
        "/cake-studio/v17/stills/" in parsed.path.lower()
        and parsed.path.lower().endswith(".webp")
        and (failure == "net::ERR_ABORTED" or (local_harness and failure == "net::ERR_INVALID_HTTP_RESPONSE"))
    ):
        # setPoster replaces the endpoint on every rounded clip boundary.
        # These cancellations are transition churn and remain visible in the
        # report, but they are not a console/page/HTTP failure.
        return "v17-poster-replace"
    if (
        re.search(r"/worlds/cake-studio/(?:clips/CST-\d{3}\.mp4|posters/CST-\d{3}\.(?:jpg|webp))$", parsed.path, re.IGNORECASE)
        and (
            failure == "net::ERR_ABORTED"
            or (
                local_harness
                and failure in {"net::ERR_INVALID_HTTP_RESPONSE", "net::ERR_CONTENT_LENGTH_MISMATCH"}
            )
        )
    ):
        # Exact core-cinema media cancelled while the diagnostic jumps to the
        # outro setup position.  Keep it separate from bookend churn.
        return "core-scene-rearm"
    return None


def expected_cancel(url: str, failure: str) -> bool:
    return cancellation_reason(url, failure) is not None


def mark_time(recording: dict[str, Any], label: str) -> float:
    marks = [mark for mark in recording["marks"] if mark["label"] == label]
    if len(marks) != 1:
        raise ValueError(f"expected one {label!r} mark, got {len(marks)}")
    return float(marks[0]["t"])


def summarize_recording(
    recording: dict[str, Any],
    network: dict[str, Any],
    profile: TouchProfile,
) -> dict[str, Any]:
    samples = recording["samples"]
    draws = recording["draws"]
    targets = recording["targets"]
    gesture_start = mark_time(recording, "gesture-start")
    gesture_end = mark_time(recording, "gesture-end")
    recovery_end = mark_time(recording, "recovery-end")
    active_samples = between(samples, gesture_start, gesture_end)
    recovery_samples = between(samples, gesture_end, recovery_end)
    active_draws = between(draws, gesture_start, gesture_end)
    active_targets = between(targets, gesture_start, gesture_end)

    clips = [sample.get("clip", "") for sample in active_samples if sample.get("clip")]
    clip_switches = sum(1 for first, second in zip(clips, clips[1:]) if first != second)
    traversed_clips = list(dict.fromkeys(clips))

    first_fresh_after = next(
        (sample for sample in recovery_samples if sample.get("fresh")),
        None,
    )
    recovery_latency = (
        max(0.0, float(first_fresh_after["t"]) - gesture_end)
        if first_fresh_after is not None
        else None
    )

    draw_times = [float(draw["t"]) for draw in active_draws]
    draw_intervals = [second - first for first, second in zip(draw_times, draw_times[1:])]
    decode_latencies = [
        float(draw["latencyMs"])
        for draw in active_draws
        if draw.get("fresh") and draw.get("latencyMs") is not None
    ]
    visible_errors = [
        float(sample["error"])
        for sample in active_samples
        if sample.get("surfaceVisible") and sample.get("error") is not None
    ]
    visible_ages = [
        float(sample["frameAgeMs"])
        for sample in active_samples
        if sample.get("surfaceVisible") and sample.get("frameAgeMs") is not None
    ]

    first_surface_sample = next(
        (sample for sample in samples if float(sample.get("t", -1)) <= recovery_end and sample.get("surfaceVisible")),
        None,
    )
    after_first_surface = (
        between(samples, float(first_surface_sample["t"]), recovery_end)
        if first_surface_sample is not None else []
    )

    prefix = "I" if profile.track == "intro" else "O"
    requests = [event for event in network["requests"] if (clip_id(event["url"]) or "").startswith(prefix)]
    responses = [event for event in network["responses"] if (clip_id(event["url"]) or "").startswith(prefix)]
    aborts = [
        event
        for event in network["expected_cancellations"]
        if (clip_id(event["url"]) or "").startswith(prefix)
    ]
    unexpected = [event for event in network["unexpected_failures"] if (clip_id(event["url"]) or "").startswith(prefix)]
    master_id = "INTRO_PHONE" if profile.track == "intro" else "OUTRO_PHONE"
    unique_media_urls = sorted({clean_url(event["url"]) for event in requests})
    individual_requests = [event for event in requests if re.fullmatch(r"[IO]\d{2}", clip_id(event["url"]) or "")]
    master_requests = [event for event in requests if clip_id(event["url"]) == master_id]
    response_206 = [response for response in responses if response["status"] == 206]
    correct_ranges = [
        response
        for response in response_206
        if response.get("range", "").lower().startswith("bytes=")
        and response.get("contentRange", "").lower().startswith("bytes ")
        and response.get("acceptRanges", "").lower() == "bytes"
    ]
    full_warm_responses = [
        response
        for response in responses
        if response["status"] == 200
        and not response.get("range")
        and response.get("contentType", "").lower().startswith("video/")
    ]

    completed_targets = [target for target in active_targets if target.get("completedAt") is not None]
    dropped_targets = len(active_targets) - len(completed_targets)
    progress_values = [float(sample.get("progress") or 0) for sample in active_samples]
    metric = {
        "gestureDurationMs": gesture_end - gesture_start,
        "measuredDurationMs": recovery_end - gesture_start,
        "sampleCount": len(active_samples),
        "startProgress": min(progress_values) if progress_values else 0.0,
        "endProgress": max(progress_values) if progress_values else 0.0,
        "transportModes": sorted({sample.get("transport", "") for sample in active_samples if sample.get("transport")}),
        "surfaceVisibleRatio": ratio(active_samples, lambda sample: bool(sample.get("surfaceVisible"))),
        "phoneVideoVisibleRatio": ratio(active_samples, lambda sample: bool(sample.get("phoneVideoVisible"))),
        "canvasVisibleRatio": ratio(active_samples, lambda sample: bool(sample.get("canvasVisible"))),
        "freshDecodedRatio": ratio(active_samples, lambda sample: bool(sample.get("fresh"))),
        "posterVisibleRatio": ratio(active_samples, lambda sample: bool(sample.get("posterVisible"))),
        "staleVisibleRatio": ratio(active_samples, lambda sample: bool(sample.get("staleVisible"))),
        "freshPaintsDuringTouch": sum(1 for draw in active_draws if draw.get("fresh")),
        "paintsDuringTouch": len(active_draws),
        "paintIntervalP95Ms": percentile(draw_intervals, .95),
        "decodeLatencyP95Ms": percentile(decode_latencies, .95),
        "visibleFrameAgeP95Ms": percentile(visible_ages, .95),
        "desiredVsPaintedP95Sec": percentile(visible_errors, .95),
        "desiredVsPaintedMaxSec": max(visible_errors) if visible_errors else None,
        "longestPosterRunDuringTouchMs": longest_run_ms(
            samples, lambda sample: bool(sample.get("posterVisible")),
            start=gesture_start, end=gesture_end,
        ),
        "longestPosterRunAfterTouchMs": longest_run_ms(
            samples, lambda sample: bool(sample.get("posterVisible")),
            start=gesture_end, end=recovery_end,
        ),
        "posterFlashRunsDuringTouch": count_runs(
            active_samples, lambda sample: bool(sample.get("posterVisible"))
        ),
        "posterVisibleAfterFirstPaintRatio": (
            ratio(after_first_surface, lambda sample: bool(sample.get("posterVisible")))
            if after_first_surface else 1.0
        ),
        "longestPosterRunAfterFirstPaintMs": (
            longest_run_ms(
                after_first_surface,
                lambda sample: bool(sample.get("posterVisible")),
                start=float(after_first_surface[0]["t"]),
                end=float(after_first_surface[-1]["t"]),
            )
            if after_first_surface else recovery_end - gesture_start
        ),
        "recoveryLatencyMs": recovery_latency,
        "targetUpdatesDuringTouch": len(active_targets),
        "targetCompletionRatio": len(completed_targets) / len(active_targets) if active_targets else 0.0,
        "supersededTargetUpdates": dropped_targets,
        "supersededTargetRatio": dropped_targets / len(active_targets) if active_targets else 1.0,
        "clipSwitches": clip_switches,
        "traversedClips": traversed_clips,
        "clipRequests": len(requests),
        "clipResponses": len(responses),
        "clipResponses206": len(response_206),
        "correctRangeResponses": len(correct_ranges),
        "fullWarmResponses": len(full_warm_responses),
        "correctTransportResponses": len(correct_ranges) + len(full_warm_responses),
        "clipAborts": len(aborts),
        "abortPerClipSwitch": len(aborts) / max(1, clip_switches),
        "requestsPerTraversedClip": len(requests) / max(1, len(traversed_clips)),
        "uniqueMediaUrls": unique_media_urls,
        "uniqueMediaUrlCount": len(unique_media_urls),
        "individualClipRequests": len(individual_requests),
        "phoneMasterRequests": len(master_requests),
        "unexpectedClipFailures": unexpected,
        "playCalls": len(recording["playCalls"]),
    }
    return {
        "metrics": metric,
        "recording": recording,
        "network": {
            "requests": requests,
            "responses": responses,
            "expectedCancellations": aborts,
            "unexpectedFailures": unexpected,
        },
    }


def performance_contract(profile: TouchProfile, metric: dict[str, Any]) -> list[dict[str, Any]]:
    if profile.rapid:
        minimum_surface = .98
        minimum_fresh = 0
        maximum_poster_ms = 0
        maximum_recovery_ms = 1_200
        maximum_decode_ms = 500
        maximum_frame_age_ms = 700
        maximum_lag_sec = None
        minimum_target_completion = .02
    else:
        minimum_surface = .99
        minimum_fresh = .75
        maximum_poster_ms = 0
        maximum_recovery_ms = 750
        maximum_decode_ms = 350
        maximum_frame_age_ms = 250
        maximum_lag_sec = .50
        minimum_target_completion = .05

    def check(name: str, passed: bool, actual: Any, limit: Any) -> dict[str, Any]:
        return {"name": name, "pass": bool(passed), "actual": actual, "limit": limit}

    recovery = metric["recoveryLatencyMs"]
    decode = metric["decodeLatencyP95Ms"]
    frame_age = metric["visibleFrameAgeP95Ms"]
    p95_error = metric["desiredVsPaintedP95Sec"]
    responses = metric["clipResponses"]
    expected_filename = PHONE_MASTER_FILES[profile.track]
    exact_media_urls = bool(metric["uniqueMediaUrls"]) and all(
        urlsplit(url).path.endswith(f"/{expected_filename}")
        for url in metric["uniqueMediaUrls"]
    )
    terminal_target = metric.get("terminalTargetSec")
    expected_terminal_target = metric.get("expectedTerminalTargetSec")
    valid_phone_delivery = (
        metric["correctRangeResponses"] > 0
        if profile.track == "intro"
        else (
            metric["correctRangeResponses"] > 0
            or metric["fullWarmResponses"] == 1
        )
    )
    checks = [
        check("touch traversed scene", metric["endProgress"] >= .90, metric["endProgress"], ">= 0.90"),
        check("persistent phone-master transport", metric["transportModes"] == ["phone-master"], metric["transportModes"], "['phone-master']"),
        check("active decoded surface coverage", metric["surfaceVisibleRatio"] >= minimum_surface, metric["surfaceVisibleRatio"], f">= {minimum_surface}"),
        check("active fresh decoded coverage", metric["freshDecodedRatio"] >= minimum_fresh, metric["freshDecodedRatio"], f">= {minimum_fresh}"),
        check("fresh decoded paints during touch", metric["freshPaintsDuringTouch"] >= 2, metric["freshPaintsDuringTouch"], ">= 2"),
        check("poster run during touch", metric["longestPosterRunDuringTouchMs"] <= maximum_poster_ms, metric["longestPosterRunDuringTouchMs"], f"<= {maximum_poster_ms} ms"),
        check("poster never returns after first decoded frame", metric["posterVisibleAfterFirstPaintRatio"] == 0 and metric["longestPosterRunAfterFirstPaintMs"] == 0, {"ratio": metric["posterVisibleAfterFirstPaintRatio"], "longestMs": metric["longestPosterRunAfterFirstPaintMs"]}, "ratio 0 and longest 0 ms"),
        check("post-touch recovery", recovery is not None and recovery <= maximum_recovery_ms, recovery, f"<= {maximum_recovery_ms} ms"),
        check("poster run after touch", metric["longestPosterRunAfterTouchMs"] <= maximum_recovery_ms, metric["longestPosterRunAfterTouchMs"], f"<= {maximum_recovery_ms} ms"),
        check("p95 target-to-paint latency", decode is not None and decode <= maximum_decode_ms, decode, f"<= {maximum_decode_ms} ms"),
        check("p95 visible frame age", frame_age is not None and frame_age <= maximum_frame_age_ms, frame_age, f"<= {maximum_frame_age_ms} ms"),
        check(
            "p95 visible timeline lag",
            maximum_lag_sec is None or (p95_error is not None and p95_error <= maximum_lag_sec),
            p95_error,
            "rapid fling judged by surface continuity/recovery" if maximum_lag_sec is None else f"<= {maximum_lag_sec} sec",
        ),
        check("bounded dropped target updates", metric["targetCompletionRatio"] >= minimum_target_completion, {"completedRatio": metric["targetCompletionRatio"], "superseded": metric["supersededTargetUpdates"]}, f">= {minimum_target_completion} completed"),
        check("one persistent media URL", metric["uniqueMediaUrlCount"] == 1, metric["uniqueMediaUrls"], "exactly one URL"),
        check(
            "exact v1.7.2 phone master URL",
            exact_media_urls,
            metric["uniqueMediaUrls"],
            expected_filename,
        ),
        check(
            "EOF-safe terminal target",
            terminal_target is not None
            and expected_terminal_target is not None
            and abs(float(terminal_target) - float(expected_terminal_target)) <= .002,
            {"actual": terminal_target, "expected": expected_terminal_target},
            "duration - terminalFrameOffset/fps",
        ),
        check("phone master requested without individual clips", metric["phoneMasterRequests"] > 0 and metric["individualClipRequests"] == 0, {"master": metric["phoneMasterRequests"], "individual": metric["individualClipRequests"]}, "master > 0 and individual = 0"),
        check("bounded same-source range cancellations", metric["clipAborts"] <= metric["paintsDuringTouch"] + 2, {"cancellations": metric["clipAborts"], "paints": metric["paintsDuringTouch"]}, "cancellations <= paints + 2"),
        check(
            "valid phone-master delivery for active source mode",
            responses > 0
            and valid_phone_delivery
            and metric["fullWarmResponses"] <= 1
            and metric["correctTransportResponses"] == responses,
            {
                "responses": responses,
                "ranges206": metric["correctRangeResponses"],
                "fullWarm200": metric["fullWarmResponses"],
            },
            "intro has 206 range; warmed outro may use one full 200; all responses valid",
        ),
        check("zero bookend play calls", metric["playCalls"] == 0, metric["playCalls"], "0"),
        check("zero unexpected clip failures", not metric["unexpectedClipFailures"], metric["unexpectedClipFailures"], "[]"),
    ]
    return checks


class PhonePerformanceGate:
    def __init__(self, url: str, output: Path, *, throttled: bool = True) -> None:
        self.url = clean_url(url)
        self.output = output
        self.throttled = throttled
        self.output.mkdir(parents=True, exist_ok=True)
        self.profile_reports: dict[str, Any] = {}
        self.failures: list[str] = []

    @staticmethod
    def make_context(browser: Browser) -> BrowserContext:
        context = browser.new_context(
            viewport=VIEWPORT,
            screen=VIEWPORT,
            is_mobile=True,
            has_touch=True,
            device_scale_factor=2,
            locale="en-US",
            reduced_motion="no-preference",
            service_workers="block",
            user_agent=(
                "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36"
            ),
        )
        context.add_init_script(INSTRUMENTATION)
        return context

    @staticmethod
    def observe(page: Page, started: float) -> dict[str, Any]:
        events: dict[str, Any] = {
            "requests": [],
            "responses": [],
            "expected_cancellations": [],
            "unexpected_failures": [],
            "http_errors": [],
            "console_errors": [],
            "page_errors": [],
        }

        def elapsed() -> float:
            return (time.perf_counter() - started) * 1000

        def on_request(request: Any) -> None:
            url = request.url
            if V17_CLIP_MARKER not in url.lower() or not urlsplit(url).path.lower().endswith(".mp4"):
                return
            headers = {key.lower(): value for key, value in request.headers.items()}
            events["requests"].append({
                "tMs": elapsed(), "url": url, "clip": clip_id(url),
                "range": headers.get("range", ""),
            })

        def on_response(response: Any) -> None:
            url = response.url
            if response.status >= 400:
                events["http_errors"].append({"tMs": elapsed(), "url": url, "status": response.status})
            if V17_CLIP_MARKER not in url.lower() or not urlsplit(url).path.lower().endswith(".mp4"):
                return
            headers = {key.lower(): value for key, value in response.headers.items()}
            request_headers = {key.lower(): value for key, value in response.request.headers.items()}
            events["responses"].append({
                "tMs": elapsed(), "url": url, "clip": clip_id(url),
                "status": response.status,
                "range": request_headers.get("range", ""),
                "acceptRanges": headers.get("accept-ranges", ""),
                "contentRange": headers.get("content-range", ""),
                "contentType": headers.get("content-type", ""),
            })

        def on_failed(request: Any) -> None:
            failure = request.failure or "unknown"
            reason = cancellation_reason(request.url, failure)
            record = {
                "tMs": elapsed(), "url": request.url, "clip": clip_id(request.url),
                "failure": failure, "reason": reason,
            }
            key = "expected_cancellations" if reason else "unexpected_failures"
            events[key].append(record)

        page.on("request", on_request)
        page.on("response", on_response)
        page.on("requestfailed", on_failed)
        def on_console(message: Any) -> None:
            if message.type != "error":
                return
            if (
                urlsplit(page.url).hostname in {"127.0.0.1", "localhost"}
                and message.text == "Failed to load resource: net::ERR_INVALID_HTTP_RESPONSE"
            ):
                # The local range harness closes a to-EOF stream after Chrome
                # has decoded the requested keyframe. requestfailed remains
                # URL-attributed above; suppress only its duplicate console
                # line locally, never on the deployed host.
                return
            events["console_errors"].append(message.text)

        page.on("console", on_console)
        page.on("pageerror", lambda error: events["page_errors"].append(str(error)))
        return events

    @staticmethod
    def configure_cdp(page: Page, throttled: bool) -> Any:
        cdp = page.context.new_cdp_session(page)
        cdp.send("Network.enable")
        if throttled:
            cdp.send("Network.setCacheDisabled", {"cacheDisabled": True})
            cdp.send("Network.emulateNetworkConditions", {
                "offline": False,
                "latency": NETWORK_LATENCY_MS,
                "downloadThroughput": NETWORK_DOWNLOAD_BPS,
                "uploadThroughput": NETWORK_UPLOAD_BPS,
                "connectionType": "cellular4g",
            })
            cdp.send("Emulation.setCPUThrottlingRate", {"rate": CPU_THROTTLE_RATE})
        return cdp

    @staticmethod
    def touch_swipe(cdp: Any, profile: TouchProfile) -> None:
        x = 195
        start_y = 735
        end_y = 105
        point = lambda y: [{"x": x, "y": y, "radiusX": 7, "radiusY": 7, "force": .7, "id": 1}]
        cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": point(start_y)})
        for step in range(1, profile.move_steps + 1):
            y = start_y + (end_y - start_y) * step / profile.move_steps
            cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": point(y)})
            time.sleep(profile.move_delay_ms / 1000)
        cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        time.sleep(profile.between_swipes_ms / 1000)

    @staticmethod
    def scene_geometry(page: Page, track: str) -> dict[str, float]:
        return page.evaluate(
            """track => {
              const scene = document.querySelector(`[data-cake-bookend="${track}"]`);
              if (!scene) throw new Error(`missing ${track} bookend`);
              return {
                top: scene.offsetTop,
                height: scene.offsetHeight,
                viewport: innerHeight,
                end: scene.offsetTop + Math.max(0, scene.offsetHeight - innerHeight)
              };
            }""",
            track,
        )

    def run_profile(self, browser: Browser, profile: TouchProfile) -> None:
        context = self.make_context(browser)
        page = context.new_page()
        session_started = time.perf_counter()
        network = self.observe(page, session_started)
        cdp = self.configure_cdp(page, self.throttled)
        try:
            page.goto(self.url, wait_until="domcontentloaded", timeout=45_000)
            page.wait_for_function(
                "() => window.__cakeStudioBookends?.state === 'ready' && window.__cakePhonePerf",
                timeout=20_000,
            )
            contract_state = read_runtime_contract(page)
            contract_errors = runtime_contract_failures(contract_state)
            geometry = self.scene_geometry(page, profile.track)
            warm_latency_ms = None
            if profile.track == "outro":
                warm_started = time.perf_counter()
                # Reproduce the real navigation order: leaving the intro starts
                # the small outro warm-up while the 50-shot reel is viewed.
                page.evaluate(
                    """() => document.querySelector('[data-cake-bookend="intro"]')
                      ?.dispatchEvent(new CustomEvent('scene:idle'))"""
                )
                page.wait_for_function(
                    """() => {
                      const scene = document.querySelector('[data-cake-bookend="outro"]');
                      const video = scene?.querySelector('[data-bookend-phone-video]');
                      return scene?.dataset.sequenceWarm === 'ready'
                        && video?.currentSrc?.startsWith('blob:');
                    }""",
                    timeout=10_000,
                )
                warm_latency_ms = (time.perf_counter() - warm_started) * 1000
            prime_started = time.perf_counter()
            page.evaluate("({top}) => scrollTo(0, top)", {"top": geometry["top"]})
            page.wait_for_function(
                """track => {
                  const scene = document.querySelector(`[data-cake-bookend="${track}"]`);
                  return scene?.dataset.sequenceTransport === 'phone-master'
                    && scene.classList.contains('sequence-painted')
                    && Number.isFinite(Number.parseFloat(scene.dataset.sequenceTime || 'NaN'));
                }""",
                arg=profile.track,
                timeout=8_000,
            )
            prime_latency_ms = (time.perf_counter() - prime_started) * 1000
            page.evaluate(
                """({track, top}) => {
                  scrollTo(0, top);
                  window.__cakePhonePerf.begin(track);
                }""",
                {"track": profile.track, "top": geometry["top"]},
            )
            page.wait_for_timeout(80)
            page.evaluate("() => window.__cakePhonePerf.mark('gesture-start')")

            swipes = 0
            while swipes < profile.max_swipes:
                state = page.evaluate(
                    """track => {
                      const scene = document.querySelector(`[data-cake-bookend="${track}"]`);
                      return {
                        y: scrollY,
                        progress: Number.parseFloat(scene.style.getPropertyValue('--p') || '0')
                      };
                    }""",
                    profile.track,
                )
                if state["progress"] >= .985 or state["y"] >= geometry["end"] - 8:
                    break
                self.touch_swipe(cdp, profile)
                swipes += 1

            page.evaluate("() => window.__cakePhonePerf.mark('gesture-end')")
            page.wait_for_timeout(RECOVERY_WINDOW_MS)
            page.evaluate("() => window.__cakePhonePerf.mark('recovery-end')")
            recording = page.evaluate("() => window.__cakePhonePerf.stop()")
            screenshot = self.output / f"{profile.name}.png"
            page.screenshot(path=str(screenshot), full_page=False)

            report = summarize_recording(recording, network, profile)
            expected_terminal_target = phone_terminal_target(
                PHONE_MASTER_DURATIONS[profile.track]
            )
            # Keep the touch metrics untouched, then make one deterministic
            # settled-position probe at the exact scene end. Sampling alone is
            # not proof: a 40 ms recorder tick can legitimately miss progress
            # 1.0 even when the gesture reached the end.
            page.evaluate("end => scrollTo(0, end)", geometry["end"])
            terminal_probe_timed_out = False
            try:
                page.wait_for_function(
                    """({track, expected}) => {
                      const scene = document.querySelector(`[data-cake-bookend="${track}"]`);
                      const target = Number.parseFloat(
                        scene?.dataset.sequenceTargetTime || 'NaN'
                      );
                      return Number.isFinite(target) && Math.abs(target - expected) <= .002;
                    }""",
                    arg={"track": profile.track, "expected": expected_terminal_target},
                    timeout=3_000,
                )
            except TimeoutError:
                terminal_probe_timed_out = True
            terminal_probe = page.evaluate(
                """track => {
                  const scene = document.querySelector(`[data-cake-bookend="${track}"]`);
                  const unit = window.__cakeStudioBookends?.units?.find(
                    item => item.trackName === track
                  );
                  const target = Number.parseFloat(
                    scene?.dataset.sequenceTargetTime || 'NaN'
                  );
                  return {
                    progress: Number.parseFloat(
                      scene?.style.getPropertyValue('--p') || 'NaN'
                    ),
                    target: Number.isFinite(target) ? target : null,
                    duration: unit?.phoneMaster?.duration ?? null,
                    finalTailExtraFrames: unit?.phoneMaster?.finalTailExtraFrames ?? null,
                    fps: unit?.phoneMaster?.fps ?? null,
                  };
                }""",
                profile.track,
            )
            terminal_target = terminal_probe["target"]
            report["metrics"]["terminalTargetSec"] = terminal_target
            report["metrics"]["expectedTerminalTargetSec"] = expected_terminal_target
            report["terminalProbe"] = {
                **terminal_probe,
                "expected": expected_terminal_target,
                "waitTimedOut": terminal_probe_timed_out,
            }
            report["profile"] = asdict(profile)
            report["contract"] = {
                "expected": expected_contract(),
                "observed": contract_state,
                "failures": contract_errors,
            }
            report["environment"] = {
                "url": self.url,
                "viewport": VIEWPORT,
                "deviceScaleFactor": 2,
                "cpuThrottleRate": CPU_THROTTLE_RATE if self.throttled else 1,
                "throttled": self.throttled,
                "network": {
                    "downloadBps": NETWORK_DOWNLOAD_BPS if self.throttled else None,
                    "uploadBps": NETWORK_UPLOAD_BPS if self.throttled else None,
                    "latencyMs": NETWORK_LATENCY_MS if self.throttled else 0,
                    "cacheDisabled": self.throttled,
                },
                "sceneGeometry": geometry,
                "actualSwipes": swipes,
                "primeLatencyMs": prime_latency_ms,
                "warmLatencyMs": warm_latency_ms,
                "screenshot": str(screenshot),
            }
            report["browserErrors"] = {
                "console": network["console_errors"],
                "page": network["page_errors"],
                "http": network["http_errors"],
                "unexpectedRequests": network["unexpected_failures"],
            }
            checks = performance_contract(profile, report["metrics"])
            checks.insert(0, {
                "name": "exact v1.7.2 phone runtime contract",
                "pass": not contract_errors,
                "actual": contract_errors or contract_state,
                "limit": "version/cache/media mapping exactly match v1.7.2",
            })
            checks.append({
                "name": "bounded cold first-frame prime",
                "pass": prime_latency_ms <= 3_000,
                "actual": prime_latency_ms,
                "limit": "<= 3000 ms",
            })
            if profile.track == "outro":
                checks.append({
                    "name": "outro warmed during prior cinema path",
                    "pass": warm_latency_ms is not None and warm_latency_ms <= 7_000,
                    "actual": warm_latency_ms,
                    "limit": "<= 7000 ms",
                })
            checks.append({
                "name": "zero browser or HTTP errors",
                "pass": not any(report["browserErrors"].values()),
                "actual": report["browserErrors"],
                "limit": "all empty",
            })
            report["checks"] = checks
            self.profile_reports[profile.name] = report
            failed = [check for check in checks if not check["pass"]]
            self.failures.extend(f"{profile.name}: {check['name']}" for check in failed)

            metric = report["metrics"]
            print(
                f"{'FAIL' if failed else 'PASS'} {profile.name}: "
                f"surface={metric['surfaceVisibleRatio']:.1%} fresh={metric['freshDecodedRatio']:.1%} "
                f"poster_max={metric['longestPosterRunDuringTouchMs']:.0f}ms "
                f"recovery={metric['recoveryLatencyMs']}ms paints={metric['freshPaintsDuringTouch']} "
                f"urls={metric['uniqueMediaUrlCount']} aborts={metric['clipAborts']} "
                f"checks_failed={len(failed)}"
            )
            for check in failed:
                print(
                    f"  FAIL {check['name']}: actual={json.dumps(check['actual'], ensure_ascii=False)} "
                    f"limit={check['limit']}"
                )
        except Exception as error:
            failure = f"{profile.name}: {type(error).__name__}: {error}"
            self.failures.append(failure)
            self.profile_reports[profile.name] = {
                "profile": asdict(profile),
                "fatal": failure,
                "network": network,
            }
            print(f"FAIL {failure}")
        finally:
            context.close()

    def finish(self) -> int:
        report = {
            "schema": "cake-studio-v17-phone-performance/v1",
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "url": self.url,
            "expectedCurrentResult": "pass only with the exact v1.7.2 persistent native phone-master transport",
            "expectedContract": expected_contract(),
            "scope": {
                "profiles": [asdict(profile) for profile in PROFILES],
                "measurement": "visible transition performance during real touch scroll plus bounded recovery",
                "separateFrom": "settled pixel, seam, endpoint, layout, language, and reduced-motion correctness",
                "whySettledGateMissed": [
                    "It assigned one progress value and then allowed up to 30 seconds for sequence-painted.",
                    "It did not sample poster exposure, draw cadence, or desired-vs-painted time during movement.",
                    "Its full cinema pass reused a warm context and did not apply phone CPU/network throttling.",
                    "It used deterministic seeks rather than rapid and slow physical touch-scroll input.",
                ],
            },
            "profiles": self.profile_reports,
            "failures": self.failures,
        }
        report_path = self.output / "report.json"
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
        if self.failures:
            print(
                f"CAKE_STUDIO_V17_PHONE_PERF_FAIL profiles={len(self.profile_reports)} "
                f"failures={len(self.failures)} report={report_path}",
                file=sys.stderr,
            )
            return 1
        print(
            f"CAKE_STUDIO_V17_PHONE_PERF_OK profiles={len(self.profile_reports)} "
            f"report={report_path}"
        )
        return 0

    def run(self, playwright: Any, selected: tuple[TouchProfile, ...]) -> int:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            for profile in selected:
                self.run_profile(browser, profile)
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

    require(clean_url("https://x/a?b=1#frag") == "https://x/a?b=1", "fragment removal")
    require(clip_id("https://x/cake-studio/v17/clips/CST17-I09.mp4") == "I09", "intro clip id")
    require(clip_id("https://x/CST17-o05.mp4?v=1") == "O05", "outro clip id")
    require(
        clip_id("https://x/cake-studio/v17/clips/CST17-INTRO-PHONE-v172.mp4") == "INTRO_PHONE",
        "intro phone master id",
    )
    require(
        PHONE_MASTER_FILES
        == {
            "intro": "CST17-INTRO-PHONE-v172.mp4",
            "outro": "CST17-OUTRO-PHONE-v172.mp4",
        }
        and PHONE_MASTER_BYTES == {"intro": 5_091_536, "outro": 2_479_879}
        and PHONE_MASTER_SHA256
        == {
            "intro": "6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670",
            "outro": "65e51883d99862fd86ca159bda4fd1c7bdd0f394734be422cb650516f31dca15",
        },
        "exact v1.7.2 media identity",
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
        == (640, 360, 15, 68, 7, 2, 8)
        and PHONE_MASTER_FRAMES == {"intro": 687, "outro": 347},
        "exact v1.7.2 phone cadence",
    )
    require(
        math.isclose(phone_terminal_target(PHONE_MASTER_DURATIONS["intro"]), 45.666666666666664)
        and math.isclose(phone_terminal_target(PHONE_MASTER_DURATIONS["outro"]), 23.0),
        "EOF-safe terminal targets",
    )
    valid_state = {
        "bodyVersion": EXPECTED_VERSION,
        "runtimeVersion": EXPECTED_VERSION,
        "references": [EXPECTED_MANIFEST, EXPECTED_MANIFEST],
        "manifest": {
            "version": EXPECTED_VERSION,
            "ready": True,
            "delivery": {"phoneMaster": expected_contract()["delivery"]},
        },
        "units": [
            {
                "track": track,
                "phoneMaster": {
                    "src": f"cake-studio/v17/clips/{PHONE_MASTER_FILES[track]}",
                    "width": PHONE_WIDTH,
                    "height": PHONE_HEIGHT,
                    "fps": PHONE_FPS,
                    "beatFrames": PHONE_BEAT_FRAMES,
                    "finalTailExtraFrames": PHONE_FINAL_TAIL_EXTRA_FRAMES,
                    "terminalFrameOffset": PHONE_TERMINAL_FRAME_OFFSET,
                    "keyframeInterval": PHONE_KEYFRAME_INTERVAL,
                    "frames": PHONE_MASTER_FRAMES[track],
                    "duration": PHONE_MASTER_DURATIONS[track],
                },
            }
            for track in ("intro", "outro")
        ],
    }
    require(not runtime_contract_failures(valid_state), "passing runtime contract")
    wrong_state = json.loads(json.dumps(valid_state))
    wrong_state["units"][0]["phoneMaster"]["src"] = "cake-studio/v17/clips/CST17-INTRO-PHONE-v171.mp4"
    require(
        "intro phone master" in runtime_contract_failures(wrong_state),
        "runtime contract rejects stale phone master",
    )
    require(clip_id("https://x/not-media.webp") is None, "non clip")
    require(percentile([0, 10, 20], .95) == 19, "linear percentile")
    require(percentile([], .95) is None, "empty percentile")
    synthetic = [
        {"t": 0, "posterVisible": False},
        {"t": 40, "posterVisible": True},
        {"t": 80, "posterVisible": True},
        {"t": 120, "posterVisible": False},
        {"t": 160, "posterVisible": True},
        {"t": 200, "posterVisible": False},
    ]
    require(
        longest_run_ms(synthetic, lambda sample: sample["posterVisible"], start=0, end=200) == 80,
        "longest poster run",
    )
    require(count_runs(synthetic, lambda sample: sample["posterVisible"]) == 2, "poster run count")
    require(math.isclose(ratio(synthetic, lambda sample: sample["posterVisible"]), .5), "visible ratio")
    require(expected_cancel("blob:https://x/id", "net::ERR_ABORTED"), "exact blob cancel")
    require(not expected_cancel("blob:https://x/id", "net::ERR_FAILED"), "blob failure remains fatal")
    require(
        expected_cancel("https://x/cake-studio/v17/clips/CST17-I01.mp4", "net::ERR_ABORTED"),
        "v17 rearm cancel",
    )
    require(
        not expected_cancel("https://x/ordinary.mp4", "net::ERR_ABORTED"),
        "ordinary abort remains fatal",
    )
    require(
        cancellation_reason("https://x/worlds/cake-studio/v17/stills/CST17-I03-edge.webp", "net::ERR_ABORTED")
        == "v17-poster-replace",
        "exact v17 poster replacement",
    )
    require(
        cancellation_reason("https://x/worlds/cake-studio/posters/CST-039.jpg", "net::ERR_ABORTED")
        == "core-scene-rearm",
        "exact core poster rearm",
    )
    rapid_metric = {
        "endProgress": 1,
        "transportModes": ["phone-master"],
        "surfaceVisibleRatio": 1,
        "canvasVisibleRatio": 1,
        "freshDecodedRatio": 1,
        "freshPaintsDuringTouch": 3,
        "paintsDuringTouch": 3,
        "longestPosterRunDuringTouchMs": 0,
        "posterVisibleAfterFirstPaintRatio": 0,
        "longestPosterRunAfterFirstPaintMs": 0,
        "recoveryLatencyMs": 0,
        "longestPosterRunAfterTouchMs": 0,
        "decodeLatencyP95Ms": 10,
        "visibleFrameAgeP95Ms": 10,
        "desiredVsPaintedP95Sec": .01,
        "targetCompletionRatio": 1,
        "supersededTargetUpdates": 0,
        "staleVisibleRatio": 0,
        "desiredVsPaintedMaxSec": .01,
        "uniqueMediaUrlCount": 1,
        "uniqueMediaUrls": ["https://x/CST17-INTRO-PHONE-v172.mp4"],
        "terminalTargetSec": phone_terminal_target(PHONE_MASTER_DURATIONS["intro"]),
        "expectedTerminalTargetSec": phone_terminal_target(PHONE_MASTER_DURATIONS["intro"]),
        "phoneMasterRequests": 1,
        "individualClipRequests": 0,
        "clipAborts": 0,
        "clipResponses": 1,
        "correctRangeResponses": 1,
        "fullWarmResponses": 0,
        "correctTransportResponses": 1,
        "playCalls": 0,
        "unexpectedClipFailures": [],
    }
    require(all(check["pass"] for check in performance_contract(PROFILES[0], rapid_metric)), "passing contract")
    warmed_outro_metric = dict(rapid_metric)
    warmed_outro_metric.update({
        "uniqueMediaUrls": ["https://x/CST17-OUTRO-PHONE-v172.mp4"],
        "correctRangeResponses": 0,
        "fullWarmResponses": 1,
        "correctTransportResponses": 1,
    })
    require(
        all(check["pass"] for check in performance_contract(PROFILES[2], warmed_outro_metric)),
        "warmed outro full 200 contract",
    )
    require(
        any(
            not check["pass"]
            and check["name"] == "valid phone-master delivery for active source mode"
            for check in performance_contract(PROFILES[0], warmed_outro_metric)
        ),
        "intro rejects full-only warm delivery",
    )
    rapid_metric["surfaceVisibleRatio"] = 0
    require(
        any(not check["pass"] and check["name"] == "active decoded surface coverage" for check in performance_contract(PROFILES[0], rapid_metric)),
        "contract is fail capable",
    )
    rapid_metric["surfaceVisibleRatio"] = 1
    rapid_metric["terminalTargetSec"] = PHONE_MASTER_DURATIONS["intro"] - 1 / PHONE_FPS
    require(
        any(
            not check["pass"] and check["name"] == "EOF-safe terminal target"
            for check in performance_contract(PROFILES[0], rapid_metric)
        ),
        "terminal target contract rejects final PTS",
    )
    print(f"CAKE_STUDIO_V17_PHONE_PERF_SELF_TEST_OK tests={tests}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Measure Cake Studio v1.7.2 phone transition performance under cold throttled touch scroll."
    )
    parser.add_argument("--url", help="Public or local Cake Studio page URL")
    parser.add_argument("--output", type=Path, help="Diagnostic artifact directory")
    parser.add_argument(
        "--profile",
        action="append",
        choices=[profile.name for profile in PROFILES],
        help="Run only the named profile (repeatable); default runs all four.",
    )
    parser.add_argument("--self-test", action="store_true", help="Run helper/contract tests only")
    parser.add_argument("--unthrottled", action="store_true", help="Run the same touch profiles without CDP CPU/network throttling")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if not args.url or not args.output:
        parser.error("--url and --output are required unless --self-test is used")
    selected_names = set(args.profile or [])
    selected = tuple(profile for profile in PROFILES if not selected_names or profile.name in selected_names)
    gate = PhonePerformanceGate(args.url, args.output.resolve(), throttled=not args.unthrottled)
    with sync_playwright() as playwright:
        return gate.run(playwright, selected)


if __name__ == "__main__":
    raise SystemExit(main())
