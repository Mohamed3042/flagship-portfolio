#!/usr/bin/env python3
"""Rendered phone gates for The Academy of Proven Spells.

Grades the owner addendum on a served or deployed URL:
- 390x844 portrait and 844x390 landscape use the same full-bleed cover film;
- the pinned stage and picture frame equal the live viewport with no mattes;
- the complete fourteen-shot reel scrubs forward and backward in both orientations;
- one smoothed, monotonic camera track crosses chapter joins without reversing;
- resize/orientation preserves the logical scrub position and repaints the clip;
- opening, four act bridges, and ending are captured in both orientations.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError, sync_playwright


EXPECTED_SOURCES = [
    "ACA-001", "ACA-003", "ACA-004", "ACA-005", "ACA-006", "ACA-007", "ACA-008",
    "ACA-009", "ACA-010", "ACA-011", "ACA-012", "ACA-013", "ACA-014", "ACA-015",
]
PROFILES = {
    "portrait": (390, 844),
    "landscape": (844, 390),
}
BRIDGES = ((3, "archive"), (7, "failure"), (10, "record"), (13, "loop"))


class Verification:
    def __init__(self, url: str, output_dir: Path) -> None:
        self.url = url
        self.output_dir = output_dir
        self.checks: list[dict[str, object]] = []
        self.failures: list[str] = []
        self.console_errors: list[str] = []
        self.page_errors: list[str] = []
        self.request_errors: list[str] = []
        self.http_errors: list[str] = []
        self.profile_observations: dict[str, object] = {}

    def check(self, label: str, condition: bool, detail: object) -> None:
        entry = {"label": label, "passed": bool(condition), "detail": detail}
        self.checks.append(entry)
        if not condition:
            self.failures.append(f"{label}: {detail}")

    def attach_diagnostics(self, page: Page) -> None:
        page.on("console", lambda message: self.console_errors.append(message.text)
                if message.type == "error" else None)
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))

        def failed(request) -> None:
            reason = (request.failure or "unknown").strip()
            path = urlsplit(request.url).path.lower()
            if "err_aborted" in reason.lower() and path.endswith((".mp4", ".jpg", ".png")):
                return
            self.request_errors.append(f"{reason}: {request.url}")

        page.on("requestfailed", failed)
        page.on("response", lambda response: self.http_errors.append(f"HTTP {response.status}: {response.url}")
                if response.status >= 400 else None)

    def open_page(self, context: BrowserContext) -> Page:
        page = context.new_page()
        self.attach_diagnostics(page)
        page.goto(self.url, wait_until="networkidle", timeout=60_000)
        page.wait_for_function("window.__academyDirector && window.__academyDirector.acceptedSourceIds", timeout=20_000)
        # CSS smooth scrolling would turn large deterministic proof jumps into
        # multi-second animations and grade the harness between destinations.
        page.evaluate("document.documentElement.style.scrollBehavior = 'auto'")
        return page

    @staticmethod
    def scene_progress(page: Page, selector: str, progress: float) -> None:
        page.evaluate(
            """arg => {
              const scene = document.querySelector(arg.selector);
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(1, scene.offsetHeight - innerHeight);
              scrollTo(0, top + span * arg.progress);
            }""",
            {"selector": selector, "progress": progress},
        )

    @staticmethod
    def shot_progress(page: Page, ordinal: int, fraction: float) -> float:
        return float(page.evaluate(
            "([ordinal, fraction]) => window.__academyDirector.progressForShot(ordinal, fraction)",
            [ordinal, fraction],
        ))

    def go_shot(self, page: Page, ordinal: int, fraction: float = 0.5, *, timeout: int = 30_000) -> dict[str, object]:
        progress = self.shot_progress(page, ordinal, fraction)
        self.scene_progress(page, "#academy-reel", progress)
        try:
            page.wait_for_function(
                """arg => {
                  const scene = document.querySelector('#academy-reel');
                  const video = scene.querySelector('video.on');
                  return scene.dataset.currentShot === String(arg.ordinal)
                    && scene.dataset.mediaState === 'painted'
                    && video && video.readyState >= 2 && !video.seeking
                    && getComputedStyle(video).display !== 'none'
                    && parseFloat(getComputedStyle(video).opacity) > .9;
                }""",
                arg={"ordinal": ordinal},
                timeout=timeout,
            )
        except TimeoutError as error:
            state = page.locator("#academy-reel").evaluate(
                """scene => ({
                  live: scene.classList.contains('is-live'),
                  camera: scene.dataset.cameraState,
                  shot: scene.dataset.currentShot,
                  source: scene.dataset.currentSource,
                  media: scene.dataset.mediaState,
                  p: scene.style.getPropertyValue('--p'),
                  journey: scene.style.getPropertyValue('--journey'),
                  videos: [...scene.querySelectorAll('video')].map(video => ({
                    on: video.classList.contains('on'), ready: video.readyState,
                    seeking: video.seeking, time: video.currentTime, src: video.currentSrc,
                    display: getComputedStyle(video).display, opacity: getComputedStyle(video).opacity,
                  })),
                })"""
            )
            raise RuntimeError(f"shot {ordinal} paint timeout: {state}") from error
        try:
            page.wait_for_function(
                """target => {
                  const scene = document.querySelector('#academy-reel');
                  const journey = parseFloat(scene.style.getPropertyValue('--journey'));
                  return Number.isFinite(journey) && Math.abs(journey - target) <= .001;
                }""",
                arg=progress,
                timeout=2_000,
            )
        except TimeoutError:
            pass
        page.wait_for_timeout(90)
        return page.locator("#academy-reel").evaluate(
            """scene => {
              const video = scene.querySelector('video.on');
              return {
                ordinal: Number(scene.dataset.currentShot),
                source: scene.dataset.currentSource,
                mediaState: scene.dataset.mediaState,
                currentTime: video?.currentTime || 0,
                duration: video?.duration || 0,
                videoWidth: video?.videoWidth || 0,
                videoHeight: video?.videoHeight || 0,
                fit: video ? getComputedStyle(video).objectFit : '',
                display: video ? getComputedStyle(video).display : '',
                opacity: video ? parseFloat(getComputedStyle(video).opacity) : 0,
                objectPosition: video ? getComputedStyle(video).objectPosition : '',
                pan: parseFloat(scene.style.getPropertyValue('--pan')),
                journey: parseFloat(scene.style.getPropertyValue('--journey')),
              };
            }"""
        )

    def screenshot(self, page: Page, profile: str, name: str) -> None:
        path = self.output_dir / profile / f"{profile}-{name}.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(path), full_page=False)
        self.check(f"{profile} screenshot {name}", path.exists() and path.stat().st_size > 10_000,
                   path.stat().st_size if path.exists() else "missing")

    def geometry(self, page: Page, profile: str) -> dict[str, object]:
        values = page.locator("#academy-reel").evaluate(
            """scene => {
              const stage = scene.querySelector('.stage');
              const frame = scene.querySelector('.film-frame');
              const video = scene.querySelector('video.on') || scene.querySelector('video');
              const floor = scene.querySelector('.floor');
              const cue = scene.querySelector('.film-cue');
              const sr = stage.getBoundingClientRect();
              const fr = frame.getBoundingClientRect();
              const cr = cue.getBoundingClientRect();
              const mattes = [...document.querySelectorAll('.matte')].map(matte => {
                const rect = matte.getBoundingClientRect();
                const style = getComputedStyle(matte);
                return {height: rect.height, display: style.display, visibility: style.visibility, transform: style.transform};
              });
              return {
                viewport: [innerWidth, innerHeight],
                stage: [sr.left, sr.top, sr.width, sr.height],
                frame: [fr.left, fr.top, fr.width, fr.height],
                videoFit: getComputedStyle(video).objectFit,
                floorFit: getComputedStyle(floor).objectFit,
                cue: [cr.left, cr.top, cr.right, cr.bottom, cr.width, cr.height],
                cueOpacity: parseFloat(getComputedStyle(cue).opacity),
                cueText: cue.innerText.trim(),
                mattes,
                bodyLetterbox: document.body.hasAttribute('data-letterbox'),
                overflow: document.documentElement.scrollWidth - innerWidth,
              };
            }"""
        )
        vw, vh = values["viewport"]

        def exact(rect: list[float]) -> bool:
            left, top, width, height = rect
            return all(abs(value) <= 1.1 for value in (left, top, width - vw, height - vh))

        self.check(f"{profile} stage equals viewport", exact(values["stage"]), values)
        self.check(f"{profile} film frame equals viewport", exact(values["frame"]), values)
        self.check(f"{profile} picture uses cover", values["videoFit"] == values["floorFit"] == "cover", values)
        matte_visible = any(
            matte["display"] != "none" and matte["visibility"] != "hidden"
            and matte["height"] > 1 and matte["transform"] not in ("none", "matrix(1, 0, 0, 0, 0, 0)")
            for matte in values["mattes"]
        )
        self.check(f"{profile} zero letterbox mattes", not values["bodyLetterbox"] and not matte_visible, values)
        left, top, right, bottom, width, height = values["cue"]
        cue_ok = left >= -1 and top >= -1 and right <= vw + 1 and bottom <= vh + 1 and width > 180 and height > 24
        self.check(f"{profile} caption readable inside viewport", cue_ok and values["cueOpacity"] > .9 and bool(values["cueText"]), values)
        self.check(f"{profile} zero horizontal overflow", abs(values["overflow"]) <= 1, values["overflow"])
        return values

    def traverse(self, page: Page, profile: str) -> dict[str, object]:
        forward: list[str] = []
        reverse: list[str] = []
        mobile_variants: list[str] = []
        for ordinal in range(1, 15):
            state = self.go_shot(page, ordinal, 0.52)
            forward.append(str(state["source"]))
            self.check(f"{profile} forward shot {ordinal:02d} painted", state["mediaState"] == "painted", state)
            self.check(f"{profile} forward shot {ordinal:02d} same landscape clip",
                       state["videoWidth"] == 1280 and state["videoHeight"] == 720, state)
        for ordinal in range(14, 0, -1):
            state = self.go_shot(page, ordinal, 0.48)
            reverse.append(str(state["source"]))
            self.check(f"{profile} reverse shot {ordinal:02d} painted", state["mediaState"] == "painted", state)
        mobile_variants = page.locator("#academy-reel video").evaluate_all(
            "videos => videos.map(video => video.currentSrc || video.src).filter(src => /(?:-m|mobile)\\.mp4/i.test(src))"
        )
        self.check(f"{profile} full forward source order", forward == EXPECTED_SOURCES, forward)
        self.check(f"{profile} full reverse source order", reverse == list(reversed(EXPECTED_SOURCES)), reverse)
        self.check(f"{profile} no separate mobile media chain", not mobile_variants, mobile_variants)
        return {"forward": forward, "reverse": reverse}

    def camera_grammar(self, page: Page, profile: str) -> dict[str, object]:
        forward_pan: list[float] = []
        reverse_pan: list[float] = []
        rendered_positions: list[str] = []
        for ordinal in range(1, 15):
            state = self.go_shot(page, ordinal, 0.5)
            forward_pan.append(float(state["pan"]) if isinstance(state["pan"], (int, float)) else math.nan)
            rendered_positions.append(str(state["objectPosition"]))
        for ordinal in range(14, 0, -1):
            state = self.go_shot(page, ordinal, 0.5)
            reverse_pan.append(float(state["pan"]) if isinstance(state["pan"], (int, float)) else math.nan)
        finite = all(math.isfinite(value) for value in forward_pan + reverse_pan)
        forward_monotonic = finite and all(b + 1e-4 >= a for a, b in zip(forward_pan, forward_pan[1:]))
        reverse_monotonic = finite and all(b <= a + 1e-4 for a, b in zip(reverse_pan, reverse_pan[1:]))
        self.check(f"{profile} camera pan monotonic forward", forward_monotonic, forward_pan)
        self.check(f"{profile} camera pan monotonic reverse", reverse_monotonic, reverse_pan)
        self.check(f"{profile} camera track reaches cover renderer",
                   len(set(rendered_positions)) >= 10 and rendered_positions[0] != rendered_positions[-1],
                   rendered_positions)

        joins: list[dict[str, object]] = []
        for next_ordinal in (3, 7, 10, 13):
            before = self.go_shot(page, next_ordinal - 1, 0.985)
            after = self.go_shot(page, next_ordinal, 0.015)
            delta = float(after["pan"]) - float(before["pan"])
            joins.append({"join": f"{next_ordinal - 1}->{next_ordinal}", "before": before["pan"], "after": after["pan"], "delta": delta})
        joins_ok = all(math.isfinite(float(item["delta"])) and -1e-4 <= float(item["delta"]) <= .04 for item in joins)
        self.check(f"{profile} adjacent scenes preserve camera direction", joins_ok, joins)

        start = self.shot_progress(page, 8, 0.24)
        target = self.shot_progress(page, 8, 0.76)
        self.scene_progress(page, "#academy-reel", start)
        page.wait_for_timeout(700)
        samples = page.evaluate(
            """target => new Promise(resolve => {
              const scene = document.querySelector('#academy-reel');
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(1, scene.offsetHeight - innerHeight);
              const values = [];
              const started = performance.now();
              const read = now => values.push({
                ms: now - started,
                pan: parseFloat(scene.style.getPropertyValue('--pan')),
                journey: parseFloat(scene.style.getPropertyValue('--journey')),
              });
              read(started);
              scrollTo(0, top + span * target);
              const frame = now => {
                read(now);
                if (now - started < 680) requestAnimationFrame(frame); else resolve(values);
              };
              requestAnimationFrame(frame);
            })""",
            target,
        )
        pan_values = [float(sample["pan"]) for sample in samples if isinstance(sample.get("pan"), (int, float))]
        journey_values = [float(sample["journey"]) for sample in samples if isinstance(sample.get("journey"), (int, float))]
        pan_moves = sum(abs(b - a) > 1e-5 for a, b in zip(pan_values, pan_values[1:]))
        journey_moves = sum(abs(b - a) > 1e-5 for a, b in zip(journey_values, journey_values[1:]))
        no_wrong_way = (
            len(pan_values) == len(samples) and len(journey_values) == len(samples)
            and all(b + 1e-5 >= a for a, b in zip(pan_values, pan_values[1:]))
            and all(b + 1e-5 >= a for a, b in zip(journey_values, journey_values[1:]))
        )
        self.check(f"{profile} eased camera spreads a scrub step", pan_moves >= 6 and journey_moves >= 6,
                   {"panFrames": pan_moves, "journeyFrames": journey_moves})
        self.check(f"{profile} eased camera step never reverses", no_wrong_way,
                   {"first": samples[:4], "last": samples[-4:]})
        return {"forwardPan": forward_pan, "reversePan": reverse_pan,
                "renderedPositions": rendered_positions, "joins": joins,
                "stepPanFrames": pan_moves, "stepJourneyFrames": journey_moves}

    def capture_story(self, page: Page, profile: str) -> None:
        self.scene_progress(page, ".opening", 0.56)
        page.wait_for_timeout(180)
        self.screenshot(page, profile, "opening")
        for ordinal, name in BRIDGES:
            self.go_shot(page, ordinal, 0.08)
            self.screenshot(page, profile, f"act-bridge-{name}")
        self.scene_progress(page, ".coda", 0.64)
        page.wait_for_timeout(180)
        ending = page.locator(".coda").evaluate(
            """scene => {
              const stage = scene.querySelector('.stage').getBoundingClientRect();
              const copy = scene.querySelector('.coda-copy').getBoundingClientRect();
              const title = scene.querySelector('h2').getBoundingClientRect();
              const links = [...scene.querySelectorAll('.coda-links a')].map(link => link.getBoundingClientRect());
              const visible = rect => rect.top >= -1 && rect.left >= -1 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1;
              return {
                viewport: [innerWidth, innerHeight],
                stage: [stage.left, stage.top, stage.width, stage.height],
                copy: [copy.left, copy.top, copy.right, copy.bottom],
                titleVisible: visible(title),
                linksVisible: links.every(visible),
                text: scene.querySelector('.coda-copy').innerText.trim(),
              };
            }"""
        )
        vw, vh = ending["viewport"]
        left, top, width, height = ending["stage"]
        stage_exact = all(abs(value) <= 1.1 for value in (left, top, width - vw, height - vh))
        self.check(f"{profile} ending stage equals viewport", stage_exact, ending)
        self.check(f"{profile} ending composition intact",
                   ending["titleVisible"] and ending["linksVisible"] and bool(ending["text"]), ending)
        self.screenshot(page, profile, "ending")

    def profile_pass(self, browser: Browser, profile: str, width: int, height: int) -> None:
        context = browser.new_context(
            viewport={"width": width, "height": height},
            screen={"width": width, "height": height},
            is_mobile=True,
            has_touch=True,
            device_scale_factor=1,
            locale="en-US",
        )
        page = self.open_page(context)
        version = page.evaluate("window.__academyDirector.version")
        self.check(f"{profile} Academy director exposes phone contract", version == "2.0.0", version)
        first = self.go_shot(page, 8, 0.56)
        geometry = self.geometry(page, profile)
        traversal = self.traverse(page, profile)
        camera = self.camera_grammar(page, profile)
        self.capture_story(page, profile)
        self.profile_observations[profile] = {
            "viewport": [width, height], "first": first, "geometry": geometry,
            "traversal": traversal, "camera": camera,
        }
        page.close()
        context.close()

    def orientation_pass(self, browser: Browser) -> None:
        context = browser.new_context(
            viewport={"width": 390, "height": 844}, screen={"width": 844, "height": 844},
            is_mobile=True, has_touch=True, device_scale_factor=1, locale="en-US",
        )
        page = self.open_page(context)
        before = self.go_shot(page, 8, 0.63)
        revision_before = page.locator("#academy-reel").get_attribute("data-viewport-revision")
        page.set_viewport_size({"width": 844, "height": 390})
        page.wait_for_timeout(800)
        after = page.locator("#academy-reel").evaluate(
            """scene => {
              const video = scene.querySelector('video.on');
              return {
                source: scene.dataset.currentSource,
                mediaState: scene.dataset.mediaState,
                journey: parseFloat(scene.style.getPropertyValue('--journey')),
                timeRatio: video?.duration ? video.currentTime / video.duration : -1,
                revision: scene.dataset.viewportRevision || '',
              };
            }"""
        )
        wanted = self.shot_progress(page, 8, 0.63)
        preserved = (
            after["source"] == before["source"] and after["mediaState"] == "painted"
            and isinstance(after["journey"], (int, float)) and abs(float(after["journey"]) - wanted) <= .005
            and abs(float(after["timeRatio"]) - .63) <= .06
        )
        self.check("orientation resize preserves scrub position", preserved,
                   {"before": before, "after": after, "wantedJourney": wanted})
        self.check("orientation resize records a repaint",
                   bool(after["revision"]) and after["revision"] != (revision_before or ""),
                   {"before": revision_before, "after": after["revision"]})
        self.geometry(page, "orientation-landscape")
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(800)
        back = page.locator("#academy-reel").evaluate(
            """scene => ({
              source: scene.dataset.currentSource,
              mediaState: scene.dataset.mediaState,
              journey: parseFloat(scene.style.getPropertyValue('--journey')),
            })"""
        )
        self.check("orientation return preserves scrub position",
                   back["source"] == before["source"] and back["mediaState"] == "painted"
                   and isinstance(back["journey"], (int, float)) and abs(float(back["journey"]) - wanted) <= .005,
                   back)
        page.close()
        context.close()

    def run(self, browser: Browser, profiles: list[str] | None = None, *, orientation: bool = True) -> int:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        selected = profiles or list(PROFILES)
        for profile in selected:
            width, height = PROFILES[profile]
            try:
                self.profile_pass(browser, profile, width, height)
            except Exception as error:  # keep the other orientation and report alive
                self.check(f"{profile} pass completed", False, repr(error))
        if orientation:
            try:
                self.orientation_pass(browser)
            except Exception as error:
                self.check("orientation pass completed", False, repr(error))

        self.check("console clean", not self.console_errors, self.console_errors or "0 errors")
        self.check("page exceptions", not self.page_errors, self.page_errors or "0 exceptions")
        self.check("request failures clean", not self.request_errors, self.request_errors or "0 failures")
        self.check("HTTP responses clean", not self.http_errors, self.http_errors or "0 HTTP errors")

        report = {
            "url": self.url,
            "verifiedAtUtc": datetime.now(timezone.utc).isoformat(),
            "profiles": {name: list(size) for name, size in PROFILES.items()},
            "checks": self.checks,
            "failures": self.failures,
            "consoleErrors": self.console_errors,
            "pageErrors": self.page_errors,
            "requestErrors": self.request_errors,
            "httpErrors": self.http_errors,
            "observations": self.profile_observations,
        }
        report_path = self.output_dir / "academy-phone-verification.json"
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"report: {report_path}")
        if self.failures:
            print(f"ACADEMY_PHONE_GATE_RED failures={len(self.failures)} checks={len(self.checks)}", file=sys.stderr)
            for failure in self.failures:
                print(f"- {failure}", file=sys.stderr)
            return 1
        print(f"ACADEMY_PHONE_GATE_GREEN checks={len(self.checks)}")
        return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--profile", action="append", choices=tuple(PROFILES))
    parser.add_argument("--skip-orientation", action="store_true")
    args = parser.parse_args()
    verification = Verification(args.url, args.output_dir.resolve())
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            return verification.run(browser, args.profile, orientation=not args.skip_orientation)
        finally:
            browser.close()


if __name__ == "__main__":
    raise SystemExit(main())
