#!/usr/bin/env python3
"""Rendered Cake Studio phone-orientation gate.

Grades the actual browser geometry and painted media surfaces at DPR3/touch,
then rotates a live mid-scroll page to prove progress survives reflow.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.request
from pathlib import Path
from typing import Any

from playwright.sync_api import Browser, BrowserContext, Page, sync_playwright


PROFILE_SPECS = (
    ("portrait", 390, 844, "portraitPrimary", 0),
    ("landscape", 844, 390, "landscapePrimary", 90),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--label", default="orientation")
    parser.add_argument("--expect", choices=("red", "green"), default="green")
    parser.add_argument("--traverse-steps", type=int, default=72)
    parser.add_argument(
        "--allow-local-cancel-errors",
        action="store_true",
        help=(
            "Record but do not grade localhost MP4 response corruption caused by "
            "deliberate superseding seeks. Never use this for the deployed URL."
        ),
    )
    return parser.parse_args()


def range_probe(url: str) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        headers={"Range": "bytes=0-1", "User-Agent": "CakeOrientationGate/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        headers = {key.lower(): value for key, value in response.headers.items()}
        return {
            "status": response.status,
            "acceptRanges": headers.get("accept-ranges", ""),
            "contentRange": headers.get("content-range", ""),
            "contentLength": headers.get("content-length", ""),
            "pass": response.status == 206
            and headers.get("accept-ranges", "").lower() == "bytes"
            and headers.get("content-range", "").startswith("bytes 0-1/"),
        }


class NetworkAudit:
    def __init__(self, page: Page) -> None:
        self.console_errors: list[str] = []
        self.page_errors: list[str] = []
        self.bad_responses: list[dict[str, Any]] = []
        self.failed_requests: list[dict[str, Any]] = []
        self.media_206: list[dict[str, Any]] = []
        self.v17_mp4_requests: list[str] = []
        page.on("console", self._console)
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))
        page.on("response", self._response)
        page.on("requestfailed", self._request_failed)
        page.on("request", self._request)

    def _console(self, message: Any) -> None:
        if message.type == "error" and "net::ERR_ABORTED" not in message.text:
            self.console_errors.append(message.text)

    def _response(self, response: Any) -> None:
        url = response.url.split("?", 1)[0]
        if response.status >= 400:
            self.bad_responses.append({"status": response.status, "url": response.url})
        if url.lower().endswith(".mp4") and response.status == 206:
            headers = response.headers
            self.media_206.append(
                {
                    "url": response.url,
                    "status": response.status,
                    "acceptRanges": headers.get("accept-ranges", ""),
                    "contentRange": headers.get("content-range", ""),
                }
            )

    def _request_failed(self, request: Any) -> None:
        failure = request.failure or "unknown"
        clean_url = request.url.split("?", 1)[0].lower()
        expected_abort = "ERR_ABORTED" in failure and (
            clean_url.startswith("blob:")
            or request.resource_type in ("media", "image")
            or clean_url.endswith((".mp4", ".webp", ".jpg", ".jpeg", ".png"))
        )
        if not expected_abort:
            self.failed_requests.append({"failure": failure, "url": request.url})

    def _request(self, request: Any) -> None:
        clean_url = request.url.split("?", 1)[0].lower()
        if "/cake-studio/v17/clips/" in clean_url and clean_url.endswith(".mp4"):
            self.v17_mp4_requests.append(request.url)

    def result(self) -> dict[str, Any]:
        return {
            "consoleErrors": self.console_errors,
            "pageErrors": self.page_errors,
            "badResponses": self.bad_responses,
            "failedRequests": self.failed_requests,
            "media206": self.media_206,
            "v17Mp4Requests": self.v17_mp4_requests,
        }


def new_phone_context(
    browser: Browser,
    width: int,
    height: int,
    reduced_motion: str = "no-preference",
) -> BrowserContext:
    return browser.new_context(
        viewport={"width": width, "height": height},
        screen={"width": width, "height": height},
        device_scale_factor=3,
        is_mobile=True,
        has_touch=True,
        locale="en-US",
        reduced_motion=reduced_motion,
    )


def set_metrics(
    context: BrowserContext,
    page: Page,
    width: int,
    height: int,
    orientation: str,
    angle: int,
) -> Any:
    cdp = context.new_cdp_session(page)
    cdp.send(
        "Emulation.setDeviceMetricsOverride",
        {
            "width": width,
            "height": height,
            "deviceScaleFactor": 3,
            "mobile": True,
            "screenWidth": width,
            "screenHeight": height,
            "screenOrientation": {"type": orientation, "angle": angle},
        },
    )
    return cdp


def open_page(page: Page, url: str) -> None:
    page.goto(url, wait_until="domcontentloaded", timeout=60_000)
    page.wait_for_selector(".bookend-intro .bookend-aperture", timeout=30_000)
    page.wait_for_function(
        "() => window.__cakeStudioBookends && "
        "['ready','awaiting-media'].includes(window.__cakeStudioBookends.state)",
        timeout=30_000,
    )
    page.evaluate("() => document.fonts?.ready")
    page.wait_for_timeout(400)


def browser_media_range_probe(page: Page) -> dict[str, Any]:
    return page.evaluate(
        """async () => {
          const response = await fetch(
            'cake-studio/v17/clips/CST17-I01.mp4',
            {headers:{Range:'bytes=0-1'}, cache:'no-store'}
          );
          const bytes = (await response.arrayBuffer()).byteLength;
          return {
            status:response.status,
            acceptRanges:response.headers.get('accept-ranges') || '',
            contentRange:response.headers.get('content-range') || '',
            bytes,
          };
        }"""
    )


def settle(page: Page, milliseconds: int = 900) -> None:
    page.evaluate(
        "() => new Promise(resolve => requestAnimationFrame(() => "
        "requestAnimationFrame(() => requestAnimationFrame(resolve))))"
    )
    page.wait_for_timeout(milliseconds)


def scroll_scene(page: Page, selector: str, progress: float) -> None:
    page.evaluate(
        """({selector, progress}) => {
          const scene = document.querySelector(selector);
          if (!scene) throw new Error(`missing scene ${selector}`);
          const travel = Math.max(1, scene.offsetHeight - innerHeight);
          scrollTo({top: scene.offsetTop + travel * progress, behavior: 'instant'});
        }""",
        {"selector": selector, "progress": progress},
    )
    settle(page)


def scroll_mid_seam(page: Page) -> float:
    progress = page.evaluate(
        # Stay just inside shot 26. The shared cinema bus publishes four
        # decimals, so a sub-rounding boundary sample can resolve to shot 25.
        "() => window.__cakeStudioDirector.progressForShot(26, 0.04)"
    )
    scroll_scene(page, "#cake-reel", float(progress))
    page.wait_for_function(
        "() => document.querySelector('#cake-reel')?.dataset.currentShot === '26'",
        timeout=20_000,
    )
    settle(page, 1_300)
    return float(progress)


def surface_diagnostics(page: Page, checkpoint: str) -> dict[str, Any]:
    selectors = {
        "opening": (".bookend-intro", ".bookend-aperture"),
        "same-scene": (".bookend-intro", ".bookend-aperture"),
        "mid-seam": ("#cake-reel", ".film-frame"),
        "ending": (".bookend-outro", ".bookend-aperture"),
    }
    scene_selector, surface_selector = selectors[checkpoint]
    return page.evaluate(
        """({checkpoint, sceneSelector, surfaceSelector}) => {
          const rect = element => {
            const value = element.getBoundingClientRect();
            return {
              left:value.left, top:value.top, right:value.right, bottom:value.bottom,
              width:value.width, height:value.height,
            };
          };
          const scene = document.querySelector(sceneSelector);
          const stage = scene?.querySelector('.stage');
          const surface = scene?.querySelector(surfaceSelector);
          if (!scene || !stage || !surface) throw new Error(`missing surface for ${checkpoint}`);
          const candidates = checkpoint === 'mid-seam'
            ? [...surface.querySelectorAll('video.on,.floor')]
            : [...surface.querySelectorAll(
                '.bookend-video.on,.bookend-poster'
              )];
          const visible = candidates
            .map(element => ({element, style:getComputedStyle(element)}))
            .filter(item => item.style.display !== 'none'
              && item.style.visibility !== 'hidden'
              && Number(item.style.opacity || 1) > .05)
            .sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0))[0];
          const viewport = {width:innerWidth, height:innerHeight};
          const stageRect = rect(stage);
          const surfaceRect = rect(surface);
          const mediaRect = visible ? rect(visible.element) : null;
          const tolerance = 1.5;
          const boundsEqual = value => Math.abs(value.left) <= tolerance
            && Math.abs(value.top) <= tolerance
            && Math.abs(value.width - viewport.width) <= tolerance
            && Math.abs(value.height - viewport.height) <= tolerance;
          const bars = {
            left:Math.max(0, surfaceRect.left), top:Math.max(0, surfaceRect.top),
            right:Math.max(0, viewport.width - surfaceRect.right),
            bottom:Math.max(0, viewport.height - surfaceRect.bottom),
          };
          const style = visible ? visible.style : null;
          const objectFit = style?.objectFit || null;
          const objectPosition = style?.objectPosition || null;
          const centerAnchored = objectPosition === '50% 50%' || objectPosition === 'center center';
          const mediaCovers = !!mediaRect && mediaRect.left <= tolerance && mediaRect.top <= tolerance
            && mediaRect.right >= viewport.width - tolerance
            && mediaRect.bottom >= viewport.height - tolerance
            && objectFit === 'cover';
          const progress = Number.parseFloat(scene.style.getPropertyValue('--p') || '0');
          const activeVideo = surface.querySelector('video.on');
          const sourceSize = visible ? {
            width:visible.element.videoWidth || visible.element.naturalWidth || visible.element.width || 0,
            height:visible.element.videoHeight || visible.element.naturalHeight || visible.element.height || 0,
          } : {width:0,height:0};
          return {
            checkpoint,
            viewport,
            visualViewport:visualViewport ? {
              width:visualViewport.width, height:visualViewport.height, scale:visualViewport.scale,
            } : null,
            dpr:devicePixelRatio,
            touchPoints:navigator.maxTouchPoints,
            coarsePointer:matchMedia('(pointer: coarse)').matches,
            orientation:screen.orientation ? {
              type:screen.orientation.type, angle:screen.orientation.angle,
            } : null,
            progress,
            stage:stageRect,
            surface:surfaceRect,
            media:visible ? {
              className:visible.element.className,
              rect:mediaRect,
              objectFit,
              objectPosition,
              opacity:style.opacity,
              sourceSize,
            } : null,
            bars,
            sceneData:{...scene.dataset},
            activeMediaTime:activeVideo?.currentTime ?? null,
            activeMediaReadyState:activeVideo?.readyState ?? null,
            assertions:{
              stageBounds:boundsEqual(stageRect),
              surfaceBounds:boundsEqual(surfaceRect),
              mediaCovers,
              noLetterbox:Math.max(bars.left,bars.top,bars.right,bars.bottom) <= tolerance,
              centerAnchored,
            },
            fullBleed:boundsEqual(stageRect) && boundsEqual(surfaceRect) && mediaCovers
              && Math.max(bars.left,bars.top,bars.right,bars.bottom) <= tolerance
              && centerAnchored,
          };
        }""",
        {
            "checkpoint": checkpoint,
            "sceneSelector": scene_selector,
            "surfaceSelector": surface_selector,
        },
    )


def capture_checkpoint(
    page: Page,
    output: Path,
    label: str,
    profile: str,
    checkpoint: str,
) -> dict[str, Any]:
    result = surface_diagnostics(page, checkpoint)
    screenshot = output / f"{label}-{profile}-{checkpoint}.png"
    page.screenshot(path=str(screenshot), full_page=False)
    result["screenshot"] = screenshot.name
    return result


def traverse_document(page: Page, direction: str, steps: int) -> dict[str, Any]:
    maximum = page.evaluate("() => document.documentElement.scrollHeight - innerHeight")
    positions = range(steps + 1) if direction == "forward" else range(steps, -1, -1)
    started = time.monotonic()
    for index in positions:
        target = maximum * index / steps
        page.evaluate("top => scrollTo({top, behavior:'instant'})", target)
        # Let the two-buffer transport cancel and settle each superseded leg.
        # A faster synthetic jump can corrupt an otherwise valid local range
        # response and would grade the server harness instead of the page.
        page.wait_for_timeout(180)
    settle(page, 700)
    return {
        "direction": direction,
        "steps": steps,
        "maximum": maximum,
        "finalScrollY": page.evaluate("() => scrollY"),
        "seconds": round(time.monotonic() - started, 3),
    }


def run_profile(
    browser: Browser,
    args: argparse.Namespace,
    spec: tuple[str, int, int, str, int],
) -> dict[str, Any]:
    profile, width, height, orientation, angle = spec
    context = new_phone_context(browser, width, height)
    page = context.new_page()
    audit = NetworkAudit(page)
    set_metrics(context, page, width, height, orientation, angle)
    open_page(page, args.url)
    explicit_range_probe = browser_media_range_probe(page)

    scroll_scene(page, ".bookend-intro", 0.015)
    opening = capture_checkpoint(page, args.output, args.label, profile, "opening")
    scroll_scene(page, ".bookend-intro", 0.46)
    same_scene = capture_checkpoint(page, args.output, args.label, profile, "same-scene")
    seam_progress = scroll_mid_seam(page)
    middle = capture_checkpoint(page, args.output, args.label, profile, "mid-seam")
    scroll_scene(page, ".bookend-outro", 0.995)
    ending = capture_checkpoint(page, args.output, args.label, profile, "ending")

    reverse_points = []
    scroll_mid_seam(page)
    reverse_points.append(document_state(page, "mid-seam"))
    scroll_scene(page, ".bookend-intro", 0.015)
    reverse_points.append(document_state(page, "opening"))
    forward = traverse_document(page, "forward", args.traverse_steps)
    reverse = traverse_document(page, "reverse", args.traverse_steps)
    network = audit.result()
    context.close()
    return {
        "profile": profile,
        "viewport": {"width": width, "height": height, "dpr": 3, "touch": True},
        "sameSceneProgress": 0.46,
        "midSeamProgress": seam_progress,
        "checkpoints": [opening, same_scene, middle, ending],
        "reversePoints": reverse_points,
        "traversal": [forward, reverse],
        "explicitRangeProbe": explicit_range_probe,
        "network": network,
    }


def document_state(page: Page, label: str) -> dict[str, Any]:
    return page.evaluate(
        """label => ({
          label,
          scrollY,
          maxScroll:document.documentElement.scrollHeight - innerHeight,
          intro:{...document.querySelector('.bookend-intro').dataset},
          film:{...document.querySelector('#cake-reel').dataset},
          outro:{...document.querySelector('.bookend-outro').dataset},
        })""",
        label,
    )


def rotation_state(page: Page) -> dict[str, Any]:
    return page.evaluate(
        """() => {
          const scene = document.querySelector('#cake-reel');
          const active = scene.querySelector('video.on');
          return {
            viewport:{width:innerWidth,height:innerHeight},
            progress:Number.parseFloat(scene.style.getPropertyValue('--p') || '0'),
            currentShot:scene.dataset.currentShot || null,
            currentClip:scene.dataset.currentClip || null,
            currentTime:active?.currentTime ?? null,
            readyState:active?.readyState ?? null,
            restoreCount:Number(document.documentElement.dataset.cakeOrientationRestoreCount || 0),
            restoreState:document.documentElement.dataset.cakeOrientationState || null,
            restoreStage:document.documentElement.dataset.cakeOrientationStage || null,
            restoreBefore:Number.parseFloat(
              document.documentElement.dataset.cakeOrientationProgressBefore || 'NaN'
            ),
            restoreAfter:Number.parseFloat(
              document.documentElement.dataset.cakeOrientationProgressAfter || 'NaN'
            ),
          };
        }"""
    )


def run_rotation(browser: Browser, args: argparse.Namespace) -> dict[str, Any]:
    context = new_phone_context(browser, 390, 844)
    page = context.new_page()
    audit = NetworkAudit(page)
    cdp = set_metrics(context, page, 390, 844, "portraitPrimary", 0)
    open_page(page, args.url)
    progress = page.evaluate("() => window.__cakeStudioDirector.progressForShot(26, .35)")
    scroll_scene(page, "#cake-reel", float(progress))
    page.wait_for_function(
        "() => document.querySelector('#cake-reel')?.dataset.currentShot === '26'",
        timeout=20_000,
    )
    settle(page, 1_300)
    before = rotation_state(page)

    cdp.send(
        "Emulation.setDeviceMetricsOverride",
        {
            "width": 844,
            "height": 390,
            "deviceScaleFactor": 3,
            "mobile": True,
            "screenWidth": 844,
            "screenHeight": 390,
            "screenOrientation": {"type": "landscapePrimary", "angle": 90},
        },
    )
    page.wait_for_function("() => innerWidth === 844 && innerHeight === 390", timeout=10_000)
    settle(page, 1_800)
    landscape = rotation_state(page)
    landscape_surface = surface_diagnostics(page, "mid-seam")
    page.screenshot(
        path=str(args.output / f"{args.label}-rotation-landscape-mid-scroll.png"),
        full_page=False,
    )

    cdp.send(
        "Emulation.setDeviceMetricsOverride",
        {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 3,
            "mobile": True,
            "screenWidth": 390,
            "screenHeight": 844,
            "screenOrientation": {"type": "portraitPrimary", "angle": 0},
        },
    )
    page.wait_for_function("() => innerWidth === 390 && innerHeight === 844", timeout=10_000)
    settle(page, 1_800)
    portrait = rotation_state(page)
    portrait_surface = surface_diagnostics(page, "mid-seam")
    page.screenshot(
        path=str(args.output / f"{args.label}-rotation-portrait-return.png"),
        full_page=False,
    )
    network = audit.result()
    context.close()

    landscape_delta = abs(landscape["progress"] - before["progress"])
    portrait_delta = abs(portrait["progress"] - before["progress"])
    return {
        "targetProgress": progress,
        "before": before,
        "landscape": landscape,
        "portraitReturn": portrait,
        "landscapeSurface": landscape_surface,
        "portraitSurface": portrait_surface,
        "landscapeProgressDelta": landscape_delta,
        "portraitProgressDelta": portrait_delta,
        "assertions": {
            "restoreInstrumented": landscape["restoreCount"] >= 1
            and portrait["restoreCount"] >= 2,
            "landscapeProgressPreserved": landscape_delta <= 0.003,
            "portraitProgressPreserved": portrait_delta <= 0.003,
            "shotPreserved": before["currentShot"] == landscape["currentShot"]
            == portrait["currentShot"] == "26",
            "clipPreserved": before["currentClip"] == landscape["currentClip"]
            == portrait["currentClip"],
            "landscapeFullBleed": landscape_surface["fullBleed"],
            "portraitFullBleed": portrait_surface["fullBleed"],
        },
        "network": network,
    }


def run_reduced_profile(
    browser: Browser,
    args: argparse.Namespace,
    spec: tuple[str, int, int, str, int],
) -> dict[str, Any]:
    profile, width, height, orientation, angle = spec
    context = new_phone_context(browser, width, height, reduced_motion="reduce")
    page = context.new_page()
    audit = NetworkAudit(page)
    set_metrics(context, page, width, height, orientation, angle)
    open_page(page, args.url)
    scroll_scene(page, ".bookend-intro", 0)
    opening = surface_diagnostics(page, "opening")
    scroll_scene(page, ".bookend-outro", 1)
    ending = surface_diagnostics(page, "ending")
    state = document_state(page, "reduced-endpoints")
    network = audit.result()
    context.close()
    return {
        "profile": profile,
        "opening": opening,
        "ending": ending,
        "state": state,
        "network": network,
        "assertions": {
            "openingPoster": opening["media"]
            and "bookend-poster" in opening["media"]["className"],
            "endingPoster": ending["media"]
            and "bookend-poster" in ending["media"]["className"],
            "openingFullBleed": opening["fullBleed"],
            "endingFullBleed": ending["fullBleed"],
            "zeroV17Mp4Requests": len(network["v17Mp4Requests"]) == 0,
        },
    }


def collect_failures(report: dict[str, Any]) -> list[str]:
    failures: list[str] = []
    allow_local_cancel_errors = report["allowLocalCancelErrors"]

    def fatal_network(network: dict[str, Any]) -> dict[str, list[Any]]:
        console_errors = list(network["consoleErrors"])
        failed_requests = list(network["failedRequests"])
        if allow_local_cancel_errors:
            console_errors = [
                message
                for message in console_errors
                if "ERR_INVALID_HTTP_RESPONSE" not in message
                and "ERR_CONTENT_LENGTH_MISMATCH" not in message
            ]
            failed_requests = [
                item
                for item in failed_requests
                if not (
                    item["url"].startswith(("http://127.0.0.1:", "http://localhost:"))
                    and item["url"].split("?", 1)[0].lower().endswith(".mp4")
                    and (
                        "ERR_INVALID_HTTP_RESPONSE" in item["failure"]
                        or "ERR_CONTENT_LENGTH_MISMATCH" in item["failure"]
                    )
                )
            ]
        return {
            "consoleErrors": console_errors,
            "pageErrors": list(network["pageErrors"]),
            "badResponses": list(network["badResponses"]),
            "failedRequests": failed_requests,
        }

    if not report["rangeProbe"]["pass"]:
        failures.append("range probe")
    for profile in report["profiles"]:
        for checkpoint in profile["checkpoints"]:
            if not checkpoint["fullBleed"]:
                failures.append(f"{profile['profile']} {checkpoint['checkpoint']} full bleed")
        network = profile["network"]
        fatal = fatal_network(network)
        if fatal["consoleErrors"]:
            failures.append(f"{profile['profile']} console errors")
        if fatal["pageErrors"]:
            failures.append(f"{profile['profile']} page errors")
        if fatal["badResponses"]:
            failures.append(f"{profile['profile']} HTTP errors")
        if fatal["failedRequests"]:
            failures.append(f"{profile['profile']} request failures")
        range_ok = any(
            item["acceptRanges"].lower() == "bytes"
            and item["contentRange"].lower().startswith("bytes ")
            for item in network["media206"]
        )
        explicit = profile["explicitRangeProbe"]
        explicit_ok = (
            explicit["status"] == 206
            and explicit["acceptRanges"].lower() == "bytes"
            and explicit["contentRange"].lower().startswith("bytes 0-1/")
            and explicit["bytes"] == 2
        )
        if not range_ok or not explicit_ok:
            failures.append(f"{profile['profile']} MP4 byte ranges")
    for key, passed in report["rotation"]["assertions"].items():
        if not passed:
            failures.append(f"rotation {key}")
    rotation_network = report["rotation"]["network"]
    rotation_fatal = fatal_network(rotation_network)
    if any(rotation_fatal.values()):
        failures.append("rotation browser/network errors")
    for reduced in report["reducedMotion"]:
        for key, passed in reduced["assertions"].items():
            if not passed:
                failures.append(f"reduced {reduced['profile']} {key}")
        network = reduced["network"]
        if any(fatal_network(network).values()):
            failures.append(f"reduced {reduced['profile']} browser/network errors")
    return failures


def main() -> int:
    args = parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    report: dict[str, Any] = {
        "gate": "cake-studio-orientation-full-bleed/v1",
        "url": args.url,
        "label": args.label,
        "expected": args.expect.upper(),
        "allowLocalCancelErrors": args.allow_local_cancel_errors,
        "rangeProbe": range_probe(args.url),
        "profiles": [],
        "rotation": {},
        "reducedMotion": [],
    }
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            report["profiles"] = [
                run_profile(browser, args, spec) for spec in PROFILE_SPECS
            ]
            report["rotation"] = run_rotation(browser, args)
            report["reducedMotion"] = [
                run_reduced_profile(browser, args, spec) for spec in PROFILE_SPECS
            ]
        finally:
            browser.close()
    failures = collect_failures(report)
    report["failures"] = failures
    report["actual"] = "RED" if failures else "GREEN"
    report_path = args.output / f"{args.label}-report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(
        f"CAKE_ORIENTATION_{report['actual']} failures={len(failures)} "
        f"report={report_path}"
    )
    for failure in failures:
        print(f"- {failure}")
    if args.expect.upper() == report["actual"]:
        return 0
    print(f"EXPECTED_{args.expect.upper()}_GOT_{report['actual']}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
