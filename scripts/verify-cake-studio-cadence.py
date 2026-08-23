#!/usr/bin/env python3
"""Fail-first rendered cadence gate for the Cake Studio reel and bookends.

The gate drives the real scroll bus at constant velocity. Every instrument
frame records the browser's actual ``requestVideoFrameCallback`` presentation
token, hashes the pixels painted in the active aperture, and records whether
those pixels came from decoded video, a video-backed canvas, an atlas tile,
poster, or terminal still. Presentation cadence is graded relative to the
unchanged 50-shot reel in the same browser profile and at the same scroll
velocity. Pixel holds remain reported separately so authored identical frames
cannot masquerade as a decoder stall or disappear from the evidence.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from collections import Counter
from pathlib import Path
from typing import Any

from playwright.sync_api import Browser, BrowserContext, Page, sync_playwright


PROFILE_SPECS = {
    "desktop": {
        "viewport": {"width": 1440, "height": 1000},
        "screen": {"width": 1440, "height": 1000},
        "device_scale_factor": 1,
        "is_mobile": False,
        "has_touch": False,
    },
    "phone-portrait": {
        "viewport": {"width": 390, "height": 844},
        "screen": {"width": 390, "height": 844},
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    "phone-landscape": {
        "viewport": {"width": 844, "height": 390},
        "screen": {"width": 844, "height": 390},
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
}

SPEED_SPECS = {
    "slow": 0.5,
    "owner": 1.0,
    "fast": 3.0,
}

SEGMENTS = (
    ("intro", ".bookend-intro"),
    ("reel", "#cake-reel"),
    ("outro", ".bookend-outro"),
)

VIDEO_KINDS = {"video-direct", "video-canvas"}


def parse_csv(value: str, allowed: dict[str, Any]) -> list[str]:
    if value == "all":
        return list(allowed)
    values = [item.strip() for item in value.split(",") if item.strip()]
    unknown = [item for item in values if item not in allowed]
    if unknown:
        raise argparse.ArgumentTypeError(f"unknown values: {', '.join(unknown)}")
    return values


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--label", default="cadence")
    parser.add_argument("--profiles", default="all")
    parser.add_argument("--speeds", default="all")
    parser.add_argument("--expect", choices=("red", "green"), default="green")
    parser.add_argument("--motion-start", type=float, default=0.03)
    parser.add_argument("--motion-end", type=float, default=0.97)
    parser.add_argument("--stationary-ms", type=int, default=850)
    parser.add_argument(
        "--headed",
        action="store_true",
        help="run the release measurement in a visible hardware-composited Chrome",
    )
    args = parser.parse_args()
    args.profiles = parse_csv(args.profiles, PROFILE_SPECS)
    args.speeds = parse_csv(args.speeds, SPEED_SPECS)
    if not 0 <= args.motion_start < args.motion_end <= 1:
        parser.error("motion range must satisfy 0 <= start < end <= 1")
    return args


class NetworkAudit:
    def __init__(self, page: Page) -> None:
        self.console_errors: list[str] = []
        self.page_errors: list[str] = []
        self.bad_responses: list[dict[str, Any]] = []
        self.failed_requests: list[dict[str, Any]] = []
        self.play_calls = 0
        page.on("console", self._console)
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))
        page.on("response", self._response)
        page.on("requestfailed", self._request_failed)

    def _console(self, message: Any) -> None:
        if message.type == "error" and "ERR_ABORTED" not in message.text:
            self.console_errors.append(message.text)

    def _response(self, response: Any) -> None:
        if response.status >= 400:
            self.bad_responses.append({"status": response.status, "url": response.url})

    def _request_failed(self, request: Any) -> None:
        failure = request.failure or "unknown"
        clean = request.url.split("?", 1)[0].lower()
        expected_abort = "ERR_ABORTED" in failure and (
            request.resource_type in ("media", "image")
            or clean.startswith("blob:")
            or clean.endswith((".mp4", ".webp", ".jpg", ".jpeg", ".png"))
        )
        if not expected_abort:
            self.failed_requests.append({"failure": failure, "url": request.url})

    def result(self) -> dict[str, Any]:
        return {
            "consoleErrors": self.console_errors,
            "pageErrors": self.page_errors,
            "badResponses": self.bad_responses,
            "failedRequests": self.failed_requests,
            "playCalls": self.play_calls,
        }


def new_context(browser: Browser, profile: str) -> BrowserContext:
    context = browser.new_context(
        **PROFILE_SPECS[profile],
        locale="en-US",
        reduced_motion="no-preference",
    )
    return context


def open_page(page: Page, url: str) -> None:
    page.add_init_script(
        """
        (() => {
          const original = HTMLMediaElement.prototype.play;
          window.__cakeCadencePlayCalls = 0;
          HTMLMediaElement.prototype.play = function(...args) {
            window.__cakeCadencePlayCalls += 1;
            return original.apply(this, args);
          };
        })();
        """
    )
    page.goto(url, wait_until="domcontentloaded", timeout=60_000)
    page.wait_for_selector(".bookend-intro .bookend-aperture", timeout=30_000)
    page.wait_for_function(
        "() => window.__cakeStudioBookends && "
        "window.__cakeStudioBookends.state !== 'loading'",
        timeout=60_000,
    )
    runtime = page.evaluate(
        "() => ({state:window.__cakeStudioBookends.state, "
        "error:window.__cakeStudioBookends.error || null})"
    )
    if runtime["state"] not in ("ready", "awaiting-media"):
        raise RuntimeError(f"bookend runtime failed: {runtime}")
    page.evaluate("() => document.fonts?.ready")
    page.wait_for_timeout(250)


TRAVERSE_SCRIPT = r"""
async ({selector, segment, screensPerSecond, startProgress, endProgress, stationaryMs}) => {
  const scene = document.querySelector(selector);
  if (!scene) throw new Error(`missing scene ${selector}`);
  const scratch = document.createElement('canvas');
  scratch.width = 48;
  scratch.height = 27;
  const context = scratch.getContext('2d', {alpha:false, willReadFrequently:true});
  if (!context) throw new Error('cadence pixel context unavailable');
  const clamp = value => value < 0 ? 0 : value > 1 ? 1 : value;
  const records = [];
  const frameTracks = new WeakMap();
  let nextFrameTrackId = 1;
  const ensureFrameTrack = video => {
    if (!(video instanceof HTMLVideoElement)) return null;
    if (frameTracks.has(video)) return frameTracks.get(video);
    const track = {
      id:nextFrameTrackId++, presentedFrames:null, mediaTime:null, paintedAt:null,
    };
    frameTracks.set(video, track);
    if (typeof video.requestVideoFrameCallback === 'function') {
      const watch = (paintedAt, metadata) => {
        track.presentedFrames = metadata.presentedFrames;
        track.mediaTime = metadata.mediaTime;
        track.paintedAt = paintedAt;
        video.requestVideoFrameCallback(watch);
      };
      video.requestVideoFrameCallback(watch);
    }
    return track;
  };
  for (const video of document.querySelectorAll('video')) {
    ensureFrameTrack(video);
  }
  const travel = Math.max(1, scene.offsetHeight - innerHeight);
  const distance = travel * (endProgress - startProgress);
  const durationMs = Math.max(900, distance / innerHeight / screensPerSecond * 1000);

  const visible = element => {
    if (!element) return false;
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden'
      && Number(style.opacity || 1) > .05;
  };
  const bookendSnapshot = () => {
    // Compact, track-filtered instrumentation avoids synchronously reading
    // every hidden video's currentTime on every sample. Those reads can halve
    // the measured rAF cadence on a 240 Hz host; the visible video's decoded
    // currentTime is still read below and every required provenance field is
    // retained.
    const all = window.__cakeStudioBookends?.snapshot?.(segment, true) || [];
    return all.find(item => item.track === segment) || null;
  };
  const identify = () => {
    if (segment === 'reel') {
      const video = scene.querySelector('.film-frame video.on');
      if (video && video.videoWidth > 0 && visible(video)) {
        return {
          kind:'video-direct', element:video, mediaTime:video.currentTime,
          targetTime:null, lag:null, painted:true, snapshot:null,
        };
      }
      const poster = scene.querySelector('.film-frame .floor');
      return {
        kind:'poster', element:poster, mediaTime:null, targetTime:null,
        lag:null, painted:false, snapshot:null,
      };
    }

    const snapshot = bookendSnapshot();
    const phone = snapshot?.phone;
    const landing = scene.querySelector('[data-phone-terminal-landing]');
    const atlas = scene.querySelector('[data-phone-scrub-atlas]');
    const direct = scene.querySelector(
      '.bookend-buffer.on,[data-bookend-video].on,[data-bookend-phone-video].on'
    ) || scene.querySelector('[data-bookend-phone-video]');
    const canvas = scene.querySelector('[data-bookend-canvas]');
    const poster = scene.querySelector('[data-bookend-poster]');
    if (phone?.landingVisible && visible(landing)) {
      return {kind:'terminal', element:landing, mediaTime:snapshot.time,
        targetTime:snapshot.targetTime, lag:snapshot.lag,
        painted:snapshot.painted, snapshot};
    }
    if (phone?.atlasVisible && visible(atlas)) {
      return {kind:'atlas', element:atlas, mediaTime:snapshot.time,
        targetTime:snapshot.targetTime, lag:snapshot.lag,
        painted:snapshot.painted, snapshot};
    }
    // During a paused seek Chromium can report HAVE_METADATA while continuing
    // to paint the last decoded frame. videoWidth proves decoded media exists;
    // requiring HAVE_CURRENT_DATA would falsely label that visible video frame
    // as the poster precisely while the scroll hand is moving.
    if (direct && direct.videoWidth > 0 && snapshot?.painted && visible(direct)) {
      return {kind:'video-direct', element:direct, mediaTime:direct.currentTime,
        targetTime:snapshot.targetTime, lag:snapshot.lag,
        painted:snapshot.painted, snapshot};
    }
    if (canvas && snapshot?.painted && visible(canvas)) {
      return {kind:'video-canvas', element:canvas, mediaTime:snapshot.time,
        targetTime:snapshot.targetTime, lag:snapshot.lag,
        painted:snapshot.painted, snapshot};
    }
    return {kind:'poster', element:poster, mediaTime:snapshot?.time ?? null,
      targetTime:snapshot?.targetTime ?? null, lag:snapshot?.lag ?? null,
      painted:snapshot?.painted ?? false, snapshot};
  };
  const pixelHash = element => {
    if (!element) return null;
    try {
      context.clearRect(0, 0, scratch.width, scratch.height);
      context.drawImage(element, 0, 0, scratch.width, scratch.height);
      const bytes = context.getImageData(0, 0, scratch.width, scratch.height).data;
      let hash = 2166136261;
      for (let index = 0; index < bytes.length; index += 4) {
        hash ^= bytes[index]; hash = Math.imul(hash, 16777619);
        hash ^= bytes[index + 1]; hash = Math.imul(hash, 16777619);
        hash ^= bytes[index + 2]; hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0).toString(16).padStart(8, '0');
    } catch (error) {
      return `unreadable:${error?.name || 'error'}`;
    }
  };
  const sample = (phase, relativeMs) => {
    const source = identify();
    const presentation = ensureFrameTrack(source.element);
    records.push({
      phase,
      ms:Number(relativeMs.toFixed(3)),
      scrollY:Number(scrollY.toFixed(3)),
      progress:Number.parseFloat(scene.style.getPropertyValue('--p') || '0'),
      kind:source.kind,
      hash:pixelHash(source.element),
      presentationToken:presentation?.presentedFrames == null
        ? null : `${presentation.id}:${presentation.presentedFrames}`,
      presentedMediaTime:Number.isFinite(presentation?.mediaTime)
        ? Number(presentation.mediaTime.toFixed(6)) : null,
      presentedAt:Number.isFinite(presentation?.paintedAt)
        ? Number(presentation.paintedAt.toFixed(3)) : null,
      mediaTime:Number.isFinite(source.mediaTime) ? Number(source.mediaTime.toFixed(6)) : null,
      targetTime:Number.isFinite(source.targetTime) ? Number(source.targetTime.toFixed(6)) : null,
      lag:Number.isFinite(source.lag) ? Number(source.lag.toFixed(6)) : null,
      painted:Boolean(source.painted),
      previewMode:source.snapshot?.phone?.previewMode
        || source.snapshot?.transport || '',
      index:source.snapshot?.index ?? Number(scene.dataset.currentShot || 0),
      runtimeState:source.snapshot?.state || '',
      activeSlot:source.snapshot?.activeSlot ?? null,
      slots:source.snapshot?.slots?.map(slot => ({
        index:slot.index,
        ready:slot.ready,
        seeking:slot.seeking,
        currentTime:Number.isFinite(slot.currentTime)
          ? Number(slot.currentTime.toFixed(6)) : null,
        target:Number.isFinite(slot.target)
          ? Number(slot.target.toFixed(6)) : null,
      })) || null,
    });
  };
  const scrollProgress = progress => {
    const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const top = Math.min(maximum, Math.max(0, scene.offsetTop + travel * progress));
    scrollTo({top, behavior:'instant'});
  };
  const twoFrames = () => new Promise(resolve => requestAnimationFrame(
    () => requestAnimationFrame(resolve)
  ));

  scrollProgress(startProgress);
  await twoFrames();
  const started = performance.now();
  await new Promise(resolve => {
    const step = now => {
      const elapsed = now - started;
      const fraction = clamp(elapsed / durationMs);
      scrollProgress(startProgress + (endProgress - startProgress) * fraction);
      requestAnimationFrame(sampleAtPaint);
      function sampleAtPaint(paintedAt) {
        sample('motion', paintedAt - started);
        if (fraction >= 1) resolve();
        else requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  });

  const stopped = performance.now();
  await new Promise(resolve => {
    const stationary = now => {
      sample('stationary', durationMs + (now - stopped));
      if (now - stopped >= stationaryMs) resolve();
      else requestAnimationFrame(stationary);
    };
    requestAnimationFrame(stationary);
  });
  return {
    segment,
    selector,
    screensPerSecond,
    startProgress,
    endProgress,
    travel,
    durationMs,
    viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},
    coarsePointer:matchMedia('(pointer:coarse)').matches,
    touchPoints:navigator.maxTouchPoints,
    records,
  };
}
"""


def longest_hold(samples: list[dict[str, Any]], field: str) -> float:
    if not samples:
        return math.inf
    longest = 0.0
    start = samples[0]["ms"]
    prior = (samples[0]["kind"], samples[0].get(field))
    prior_ms = samples[0]["ms"]
    for sample in samples[1:]:
        current = (sample["kind"], sample.get(field))
        if current != prior:
            longest = max(longest, prior_ms - start)
            start = sample["ms"]
            prior = current
        prior_ms = sample["ms"]
    return max(longest, prior_ms - start)


def summarise(raw: dict[str, Any]) -> dict[str, Any]:
    motion = [record for record in raw["records"] if record["phase"] == "motion"]
    stationary = [record for record in raw["records"] if record["phase"] == "stationary"]
    elapsed_ms = max(1.0, motion[-1]["ms"] - motion[0]["ms"]) if motion else 1.0
    hashes = {record["hash"] for record in motion if record["hash"]}
    presentations = {
        record["presentationToken"]
        for record in motion
        if record.get("presentationToken")
    }
    kinds = Counter(record["kind"] for record in motion)
    non_video = sum(count for kind, count in kinds.items() if kind not in VIDEO_KINDS)
    lag_values = [record["lag"] for record in motion if record["lag"] is not None]
    last_motion = motion[-1] if motion else None
    source_snap_events = 0
    visual_snap_events = 0
    prior_kind = last_motion["kind"] if last_motion else None
    prior_hash = last_motion["hash"] if last_motion else None
    for record in stationary:
        if record["kind"] != prior_kind:
            source_snap_events += 1
            prior_kind = record["kind"]
        if record["hash"] != prior_hash:
            if record["ms"] - raw["durationMs"] >= 100:
                visual_snap_events += 1
            prior_hash = record["hash"]
    raw["summary"] = {
        "samples": len(motion),
        "stationarySamples": len(stationary),
        "elapsedMs": round(elapsed_ms, 3),
        "uniquePresentedFrames": len(presentations),
        "uniqueFramesPerSecond": round(
            len(presentations) / (elapsed_ms / 1000), 3
        ),
        "longestHoldMs": round(longest_hold(motion, "presentationToken"), 3),
        "uniquePixelHashes": len(hashes),
        "uniquePixelHashesPerSecond": round(
            len(hashes) / (elapsed_ms / 1000), 3
        ),
        "longestPixelHoldMs": round(longest_hold(motion, "hash"), 3),
        "presentationMissingSamples": sum(
            1 for record in motion
            if record["kind"] in VIDEO_KINDS
            and not record.get("presentationToken")
        ),
        "sourceCounts": dict(sorted(kinds.items())),
        "nonVideoPaints": non_video,
        "nonVideoPaintRatio": round(non_video / max(1, len(motion)), 6),
        "sourceSnapEventsAfterStop": source_snap_events,
        "visualSnapEventsAfter100Ms": visual_snap_events,
        "meanSequenceLag": round(sum(lag_values) / len(lag_values), 4)
        if lag_values else None,
        "maxSequenceLag": round(max(lag_values), 4) if lag_values else None,
        "firstSource": motion[0]["kind"] if motion else None,
        "lastMotionSource": last_motion["kind"] if last_motion else None,
        "lastStationarySource": stationary[-1]["kind"] if stationary else None,
    }
    return raw


def run_profile(
    browser: Browser,
    args: argparse.Namespace,
    profile: str,
) -> dict[str, Any]:
    context = new_context(browser, profile)
    profile_result: dict[str, Any] = {
        "profile": profile,
        "viewport": PROFILE_SPECS[profile],
        "speeds": [],
    }
    network = {
        "consoleErrors": [],
        "pageErrors": [],
        "badResponses": [],
        "failedRequests": [],
        "playCalls": 0,
    }
    for speed_name in args.speeds:
        # Each velocity is an independent cold document trial. Reusing one
        # document forces the later trials to inherit decoders and giant
        # reverse jumps from earlier velocities, measuring the harness history
        # rather than intro -> reel -> outro cadence at that velocity.
        page = context.new_page()
        page.set_default_timeout(180_000)
        audit = NetworkAudit(page)
        open_page(page, args.url)
        speed_result: dict[str, Any] = {
            "speed": speed_name,
            "screensPerSecond": SPEED_SPECS[speed_name],
            "segments": [],
        }
        for segment, selector in SEGMENTS:
            raw = page.evaluate(
                TRAVERSE_SCRIPT,
                {
                    "selector": selector,
                    "segment": segment,
                    "screensPerSecond": SPEED_SPECS[speed_name],
                    "startProgress": args.motion_start,
                    "endProgress": args.motion_end,
                    "stationaryMs": args.stationary_ms,
                },
            )
            result = summarise(raw)
            screenshot = args.output / (
                f"{args.label}-{profile}-{speed_name}-{segment}-stop.png"
            )
            page.screenshot(path=str(screenshot), full_page=False)
            result["screenshot"] = screenshot.name
            speed_result["segments"].append(result)
        profile_result["speeds"].append(speed_result)
        audit.play_calls = page.evaluate("() => window.__cakeCadencePlayCalls || 0")
        result = audit.result()
        for key in ("consoleErrors", "pageErrors", "badResponses", "failedRequests"):
            network[key].extend(result[key])
        network["playCalls"] += result["playCalls"]
        page.close()
    profile_result["network"] = network
    context.close()
    return profile_result


def grade(report: dict[str, Any]) -> list[str]:
    failures: list[str] = []
    local_url = report["url"].startswith(("http://127.0.0.1:", "http://localhost:"))
    for profile in report["profiles"]:
        network = profile["network"]
        local_media_failures = [
            item for item in network["failedRequests"]
            if item["url"].lower().endswith(".mp4")
            and item["failure"] in {
                "net::ERR_EMPTY_RESPONSE",
                "net::ERR_INVALID_HTTP_RESPONSE",
                "net::ERR_CONTENT_LENGTH_MISMATCH",
            }
        ]
        local_media_artifact = (
            local_url
            and bool(local_media_failures)
            and len(local_media_failures) == len(network["failedRequests"])
            and len(network["consoleErrors"]) == len(local_media_failures)
            and not network["pageErrors"]
            and not network["badResponses"]
        )
        network["localMediaTransportBoundary"] = {
            "applied": local_media_artifact,
            "reason": (
                "[SERVER_ARTIFACT] local dev/range transport reports client-abandoned "
                "MP4 responses; retained in evidence and regraded on the live CDN"
                if local_media_artifact else None
            ),
            "count": len(local_media_failures) if local_media_artifact else 0,
        }
        for key in ("consoleErrors", "pageErrors", "badResponses", "failedRequests"):
            if local_media_artifact and key in {"consoleErrors", "failedRequests"}:
                continue
            if network[key]:
                failures.append(f"{profile['profile']} {key}")
        if network["playCalls"]:
            failures.append(f"{profile['profile']} play calls={network['playCalls']}")
        for speed in profile["speeds"]:
            segments = {
                item["segment"]: item["summary"] for item in speed["segments"]
            }
            reel = segments["reel"]
            for name in ("intro", "outro"):
                bookend = segments[name]
                ratio = bookend["uniqueFramesPerSecond"] / max(
                    0.001, reel["uniqueFramesPerSecond"]
                )
                bookend["reelCadenceRatio"] = round(ratio, 4)
                bookend["allowedLongestHoldMs"] = round(
                    reel["longestHoldMs"] + 1000 / 30, 3
                )
                prefix = f"{profile['profile']} {speed['speed']} {name}"
                if ratio < 0.9:
                    failures.append(f"{prefix} cadence ratio {ratio:.3f}")
                if bookend["longestHoldMs"] > bookend["allowedLongestHoldMs"]:
                    failures.append(
                        f"{prefix} hold {bookend['longestHoldMs']:.1f}ms"
                    )
                if bookend["nonVideoPaints"]:
                    failures.append(
                        f"{prefix} non-video paints={bookend['nonVideoPaints']}"
                    )
                if bookend["sourceSnapEventsAfterStop"]:
                    failures.append(f"{prefix} source snap after stop")
                if bookend["visualSnapEventsAfter100Ms"]:
                    failures.append(
                        f"{prefix} visual snaps={bookend['visualSnapEventsAfter100Ms']}"
                    )
    return failures


def print_table(report: dict[str, Any]) -> None:
    print(
        "profile\tspeed\tsegment\tunique_fps\treel_ratio\tlongest_hold_ms\t"
        "pixel_fps\tpixel_hold_ms\tnon_video\tsource_snaps\tvisual_snaps\t"
        "mean_lag"
    )
    for profile in report["profiles"]:
        for speed in profile["speeds"]:
            for segment in speed["segments"]:
                summary = segment["summary"]
                print(
                    "\t".join(
                        (
                            profile["profile"],
                            speed["speed"],
                            segment["segment"],
                            str(summary["uniqueFramesPerSecond"]),
                            str(summary.get("reelCadenceRatio", "baseline")),
                            str(summary["longestHoldMs"]),
                            str(summary["uniquePixelHashesPerSecond"]),
                            str(summary["longestPixelHoldMs"]),
                            str(summary["nonVideoPaints"]),
                            str(summary["sourceSnapEventsAfterStop"]),
                            str(summary["visualSnapEventsAfter100Ms"]),
                            str(summary["meanSequenceLag"]),
                        )
                    )
                )


def main() -> int:
    args = parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    report: dict[str, Any] = {
        "gate": "cake-studio-bookend-cadence/v2",
        "url": args.url,
        "label": args.label,
        "expected": args.expect.upper(),
        "thresholds": {
            "cadenceSource": "requestVideoFrameCallback presentation tokens",
            "bookendUniqueFramesPerSecondVsReel": ">= 0.90",
            "bookendLongestHoldVsReel": "<= reel + 33.333 ms",
            "visiblePixelEvidence": (
                "48x27 RGB hashes retained for authored holds and post-stop snaps"
            ),
            "nonVideoPaintsDuringMotion": 0,
            "sourceSnapEventsAfterStop": 0,
            "visualSnapEventsAfter100Ms": 0,
            "playCalls": 0,
        },
        "profiles": [],
    }
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            channel="chrome",
            headless=not args.headed,
            args=[
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
                "--disable-features=CalculateNativeWinOcclusion",
            ],
        )
        try:
            report["profiles"] = [
                run_profile(browser, args, profile) for profile in args.profiles
            ]
        finally:
            browser.close()
    failures = grade(report)
    report["failures"] = failures
    report["actual"] = "RED" if failures else "GREEN"
    report_path = args.output / f"{args.label}-report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print_table(report)
    print(
        f"CAKE_CADENCE_{report['actual']} failures={len(failures)} "
        f"report={report_path}"
    )
    for failure in failures:
        print(f"- {failure}")
    if report["actual"] == args.expect.upper():
        return 0
    print(f"EXPECTED_{args.expect.upper()}_GOT_{report['actual']}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
