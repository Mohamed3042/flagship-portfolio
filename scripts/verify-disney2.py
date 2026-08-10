#!/usr/bin/env python3
"""Rendered browser gates for The Kingdom of Running Things — the Parallax Cut.

Owner contract this suite grades:
  * the film is SCRUBBED — scroll writes video.currentTime, forward and reverse;
  * play() is never called on the film (instrumented, must stay at zero);
  * four depth planes travel with the same scroll (parallax around the picture);
  * no side chrome exists on the film — no chip, shot number, rails, ticks,
    HUD, theater button, play overlays, or district popups;
  * desktop, phone and reduced-motion share the one mode — mode-scrub;
  * byte-range delivery, narrative cue continuity, credits FIN intact.
"""

from __future__ import annotations

import argparse
import base64
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from statistics import median
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

from PIL import Image, ImageChops, ImageFilter
from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError, sync_playwright


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


EXPECTED_TITLES = {
    1: "The Waiting Book",
    3: "The Latch Yields",
    5: "A Cause Is Drawn",
    10: "The Chosen Light",
    11: "The Golden Thread",
    19: "The Human Gate",
    20: "Proof, Vault, Return",
}

FORBIDDEN_CHROME = (
    "#book .chip, #book .legno, #book .playbtn, #book .legrail, "
    ".ticks, .hud, [data-rail], [data-theater], .district, "
    "#book .depth-near, #book .depth-front, #book .wing, #book .ridge, "
    "#book .bough, #book .glint"
)


def with_query(url: str, **items: object) -> str:
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.update({key: str(value) for key, value in items.items()})
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def mean_luma(image: Image.Image) -> float:
    histogram = image.histogram()
    count = sum(histogram)
    return sum(index * frequency for index, frequency in enumerate(histogram)) / count


def boundary_metrics(before: Path, after: Path) -> tuple[float, float]:
    first = Image.open(before).convert("L").resize((192, 96))
    second = Image.open(after).convert("L").resize((192, 96))
    raw = mean_luma(ImageChops.difference(first, second))
    edge = mean_luma(
        ImageChops.difference(
            first.filter(ImageFilter.FIND_EDGES), second.filter(ImageFilter.FIND_EDGES)
        )
    )
    return raw, edge


class Verification:
    def __init__(self, url: str, output_dir: Path, minimum_runway_vh: float) -> None:
        self.url = url
        self.output_dir = output_dir
        self.minimum_runway_vh = minimum_runway_vh
        self.checks: list[dict[str, object]] = []
        self.failures: list[str] = []
        self.console_errors: list[str] = []
        self.console_warnings: list[str] = []
        self.page_errors: list[str] = []

    def check(self, name: str, condition: bool, detail: object) -> None:
        state = "PASS" if condition else "FAIL"
        detail_text = str(detail)
        self.checks.append({"name": name, "pass": condition, "detail": detail_text})
        print(f"{state} {name}: {detail_text}")
        if not condition:
            self.failures.append(f"{name}: {detail_text}")

    def observe(self, page: Page) -> None:
        def on_console(message: object) -> None:
            if message.type != "error":
                return
            location = message.location.get("url", "")
            entry = f"{message.text} [{location}]" if location else message.text
            local = urlsplit(self.url).hostname in {"127.0.0.1", "localhost"}
            if local and any(
                marker in message.text
                for marker in ("ERR_INVALID_HTTP_RESPONSE", "ERR_CONTENT_LENGTH_MISMATCH")
            ):
                self.console_warnings.append(entry)
                return
            self.console_errors.append(entry)

        page.on("console", on_console)
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))

    @staticmethod
    def install_play_instrument(context: BrowserContext) -> None:
        """Count every play() on any media element. The scrub contract is
        zero attempts, ever — this is the no-autoplay instrument."""
        context.add_init_script(
            """(() => {
              const nativePlay = HTMLMediaElement.prototype.play;
              window.__playAttempts = 0;
              HTMLMediaElement.prototype.play = function() {
                window.__playAttempts += 1;
                return nativePlay.call(this);
              };
            })();"""
        )

    def open_page(self, context: BrowserContext, url: str) -> Page:
        page = context.new_page()
        self.observe(page)
        response = page.goto(url, wait_until="domcontentloaded", timeout=60_000)
        self.check("page HTTP", bool(response and response.ok), response.status if response else "none")
        try:
            page.wait_for_load_state("networkidle", timeout=20_000)
            self.check("initial network idle", True, "reached")
        except TimeoutError:
            self.check("initial network idle", False, "20s timeout")
        page.evaluate("document.documentElement.style.scrollBehavior = 'auto'")
        return page

    @staticmethod
    def set_progress(page: Page, selector: str, progress: float, delay_ms: int = 550) -> float:
        y = page.locator(selector).evaluate(
            """(el, p) => {
              const top = el.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, el.offsetHeight - innerHeight);
              const y = top + span * p;
              scrollTo(0, y);
              return y;
            }""",
            progress,
        )
        page.wait_for_timeout(delay_ms)
        return float(y)

    def wait_leg(self, page: Page, leg: int, fraction: float | None = None,
                 tolerance: float = 0.40, label: str | None = None) -> dict[str, object]:
        """Wait until the PAGE ITSELF has put leg N on screen at the scrubbed
        time. The harness never writes currentTime — scroll is the only input,
        so a pass is evidence about the page, not about this script."""
        prefix = f"{label} " if label else ""
        handle = page.wait_for_function(
            """arg => {
              const n = String(arg.leg).padStart(3, '0');
              const floor = document.querySelector('#book .floor');
              const video = document.querySelector('#book video.on');
              if (!floor || !floor.complete || !floor.currentSrc.endsWith('kf-' + n.slice(-2) + '.jpg')) return false;
              if (!video || !(video.dataset.clip || '').endsWith('DSN2-' + n + '.mp4')) return false;
              if (video.readyState < 1 || !Number.isFinite(video.duration) || video.seekable.length < 1) return false;
              if (video.seeking) return false;
              if (arg.fraction !== null) {
                /* the page's own seek must have SETTLED at the scrubbed time —
                   a t=0 sampled between metadata-load and the queued seek is
                   "not yet", not a verdict */
                const target = Math.min(video.duration - 0.04, Math.max(0, arg.fraction * video.duration));
                if (Math.abs(video.currentTime - target) > arg.tolerance) return false;
              }
              return {
                clip: video.dataset.clip.split('/').pop(),
                poster: floor.currentSrc.split('/').pop(),
                currentTime: video.currentTime, duration: video.duration,
                paused: video.paused, readyState: video.readyState,
                title: document.querySelector('#cue-title .en')?.textContent.trim() || ''
              };
            }""",
            arg={"leg": leg, "fraction": fraction, "tolerance": tolerance},
            timeout=30_000,
        )
        info = handle.json_value()
        expected_title = EXPECTED_TITLES.get(leg)
        if expected_title:
            self.check(f"{prefix}leg {leg:02d} cue", info["title"] == expected_title, info["title"])
        self.check(f"{prefix}leg {leg:02d} floor poster", info["poster"] == f"kf-{leg:02d}.jpg", info["poster"])
        self.check(
            f"{prefix}leg {leg:02d} film paused (scrub, not playback)",
            bool(info["paused"]),
            f"paused={info['paused']}",
        )
        if fraction is not None:
            target = min(info["duration"] - 0.04, max(0.0, fraction * info["duration"]))
            close = abs(float(info["currentTime"]) - target) <= tolerance
            self.check(
                f"{prefix}leg {leg:02d} scrubbed to t≈{target:.2f}",
                close,
                f"{info['clip']} t={info['currentTime']:.3f} (target {target:.3f})",
            )
        return info

    def assert_zero_autoplay(self, page: Page, label: str) -> None:
        attempts = page.evaluate("window.__playAttempts || 0")
        self.check(f"{label} zero play() attempts", attempts == 0, f"attempts={attempts}")

    def assert_no_side_chrome(self, page: Page, label: str) -> None:
        count = page.locator(FORBIDDEN_CHROME).count()
        self.check(f"{label} no side chrome elements", count == 0, f"forbidden elements={count}")
        cue = page.locator("#cue").count()
        self.check(f"{label} cue present", cue == 1, f"cue={cue}")

    def assert_mode(self, page: Page, label: str) -> None:
        classes = page.locator("#book").get_attribute("class") or ""
        self.check(f"{label} scrub mode", "mode-scrub" in classes, classes)
        self.check(
            f"{label} no alternate motion mode",
            all(name not in classes for name in ("mode-parallax", "mode-chain", "mode-still")),
            classes,
        )

    def check_clock_freeze(self, page: Page, label: str) -> None:
        """The film must not advance without the hand: hold still, time holds."""
        first = page.locator("#book video.on").evaluate("v => v.currentTime")
        page.wait_for_timeout(2_500)
        second = page.locator("#book video.on").evaluate("v => v.currentTime")
        drift = abs(float(second) - float(first))
        self.check(f"{label} film frozen without scroll", drift <= 0.05, f"drift={drift:.4f}s over 2.5s")

    def depth_snapshot(self, page: Page) -> dict[str, object]:
        return page.locator("#book").evaluate(
            """scene => {
              const names = ['.depth-far', '.film-frame'];
              const rects = Object.fromEntries(names.map(name => {
                const el = scene.querySelector(name);
                if (!el) return [name, null];
                const rect = el.getBoundingClientRect();
                return [name, {top: rect.top, left: rect.left}];
              }));
              const video = scene.querySelector('video.on');
              return {
                journey: scene.style.getPropertyValue('--journey').trim(),
                rects,
                currentTime: video ? video.currentTime : null,
                clip: video ? (video.dataset.clip || video.currentSrc).split('/').pop() : null,
              };
            }"""
        )

    def check_parallax_travel(self, page: Page, label: str) -> None:
        """The glow plane and the picture must move at DIFFERENT rates on the
        same scroll (that difference is the parallax), the glow must drift
        across the whole film, and the film time must move WITH the same
        scroll — unlike the retired autoplay edition."""
        self.set_progress(page, "#book", 0.462)
        first_info = self.wait_leg(page, 10, 0.24, label=label)
        first = self.depth_snapshot(page)
        planes = all(first["rects"].values())
        self.check(f"{label} glow + picture planes present", planes, first["rects"])
        if not planes:
            return
        self.screenshot(page, f"{label}-parallax-before.png")

        self.set_progress(page, "#book", 0.488)
        second_info = self.wait_leg(page, 10, 0.76, label=label)
        second = self.depth_snapshot(page)
        deltas = {
            name: abs(second["rects"][name]["top"] - first["rects"][name]["top"])
            for name in first["rects"]
        }
        relative = abs(deltas[".depth-far"] - deltas[".film-frame"])
        # the picture's own motion is the rostrum PAN (object-position), so its
        # rect may hold still; the glow plane must travel relative to it
        moving = deltas[".depth-far"] >= 4 and relative >= 2
        self.check(f"{label} planes travel at distinct rates", moving,
                   {**deltas, "relative": round(relative, 2)})
        scrub_delta = abs(float(second_info["currentTime"]) - float(first_info["currentTime"]))
        self.check(
            f"{label} scroll drives the clip clock",
            scrub_delta >= 1.8,
            f"t {first_info['currentTime']:.2f} -> {second_info['currentTime']:.2f} for Δp=0.026",
        )
        self.screenshot(page, f"{label}-parallax-depth.png")

        self.set_progress(page, "#book", 0.912)
        self.wait_leg(page, 19)
        long_run = self.depth_snapshot(page)
        far_drift = abs(long_run["rects"][".depth-far"]["left"] - second["rects"][".depth-far"]["left"])
        journey_moved = abs(float(long_run["journey"] or 0) - float(second["journey"] or 0))
        self.check(
            f"{label} whole-film journey travel",
            far_drift >= 20 and journey_moved >= 0.3,
            f"glow x-drift={far_drift:.0f}px, Δjourney={journey_moved:.2f}",
        )

    def check_chrome_fade(self, page: Page, label: str) -> None:
        self.set_progress(page, "#book", 0.3)
        state = page.evaluate(
            """() => ({
              boxed: document.documentElement.classList.contains('boxed'),
              opacity: parseFloat(getComputedStyle(document.querySelector('.chrome')).opacity),
              pe: getComputedStyle(document.querySelector('.chrome')).pointerEvents,
            })"""
        )
        self.check(
            f"{label} chrome invisible during the film",
            state["boxed"] and state["opacity"] <= 0.02 and state["pe"] == "none",
            state,
        )
        page.evaluate("document.querySelector('.chrome a').focus()")
        try:
            page.wait_for_function(
                "parseFloat(getComputedStyle(document.querySelector('.chrome')).opacity) >= 0.98",
                timeout=3_000,
            )
            focused = True
        except TimeoutError:
            focused = False
        focus_opacity = page.evaluate(
            "parseFloat(getComputedStyle(document.querySelector('.chrome')).opacity)"
        )
        page.evaluate("document.querySelector('.chrome a').blur()")
        self.check(f"{label} chrome returns for keyboard focus", focused, f"opacity={focus_opacity}")

    def check_frame_geometry(self, page: Page, label: str) -> None:
        """Rostrum-camera contract, one rule for every screen: the picture is
        full-bleed COVER — the frame fills the viewport with no gap — and the
        cue is a single quiet focus at the foot, clear of the matte."""
        values = page.locator("#book").evaluate(
            """scene => {
              const stage = scene.querySelector('.film-frame');
              const video = scene.querySelector('video.on') || scene.querySelector('video');
              const cue = scene.querySelector('#cue');
              const sr = stage.getBoundingClientRect();
              const cr = cue.getBoundingClientRect();
              return {
                fit: getComputedStyle(video).objectFit,
                frame: [sr.left, sr.top, sr.width, sr.height],
                vw: innerWidth, vh: innerHeight,
                cueTop: cr.top, cueBottom: cr.bottom, cueHeight: cr.height,
              };
            }"""
        )
        left, top, width, height = values["frame"]
        vw, vh = values["vw"], values["vh"]
        full_bleed = (
            values["fit"] == "cover"
            and left <= 2 and top <= 2
            and left + width >= vw - 2 and top + height >= vh - 2
        )
        self.check(
            f"{label} full-bleed cover frame",
            full_bleed,
            f"frame={left:.0f},{top:.0f} {width:.0f}x{height:.0f} vs viewport {vw}x{vh} fit={values['fit']}",
        )
        matte = min(46.0, max(22.0, vh * 0.042))
        cue_ok = (
            values["cueHeight"] > 4
            and values["cueHeight"] <= 110
            and values["cueBottom"] <= vh - matte + 2
        )
        self.check(
            f"{label} single quiet cue at the foot, clear of the matte",
            cue_ok,
            f"cueBottom={values['cueBottom']:.0f} h={values['cueHeight']:.0f} matteTop={vh - matte:.0f}",
        )

    @staticmethod
    def pan_position(page: Page) -> float:
        return float(page.locator("#book").evaluate(
            "scene => parseFloat(scene.style.getPropertyValue('--pan') || '0.5')"
        ))

    def settle_progress(self, page: Page, progress: float) -> None:
        """Move only by scroll, then wait for the page's own camera and seek
        queue to reach the requested film position."""
        self.set_progress(page, "#book", progress, delay_ms=0)
        page.wait_for_function(
            """target => {
              const scene = document.querySelector('#book');
              const journey = parseFloat(scene.style.getPropertyValue('--journey') || '-1');
              const g = Math.min(target, .999999) * 20;
              const leg = Math.floor(g);
              const fraction = g - leg;
              const video = scene.querySelector('video.on');
              if (Math.abs(journey - target) > 1e-4 || !video || video.readyState < 1 || video.seeking) return false;
              if (!(video.dataset.clip || '').endsWith('DSN2-' + String(leg + 1).padStart(3, '0') + '.mp4')) return false;
              const wanted = Math.min(video.duration - .04, Math.max(0, fraction * video.duration));
              return Math.abs(video.currentTime - wanted) <= .12;
            }""",
            arg=progress,
            timeout=30_000,
        )

    @staticmethod
    def camera_sample_metrics(
        samples: list[dict[str, object]], key: str, target: float
    ) -> dict[str, object]:
        values = [float(sample[key]) for sample in samples]
        start = values[0]
        total = target - start
        magnitude = abs(total)
        direction = 1.0 if total >= 0 else -1.0
        deltas = [values[index] - values[index - 1] for index in range(1, len(values))]
        movement_floor = max(magnitude * 0.002, 0.0001 if key == "pan" else 0.002)
        movement_frames = sum(abs(delta) >= movement_floor for delta in deltas)
        max_share = max((abs(delta) for delta in deltas), default=0.0) / max(magnitude, 1e-9)
        wrong_way = max((max(0.0, -direction * delta) for delta in deltas), default=0.0)
        by_500 = next(
            (float(sample[key]) for sample in reversed(samples) if float(sample["ms"]) <= 500),
            values[0],
        )
        remaining_500 = abs(target - by_500) / max(magnitude, 1e-9)
        crossing = next(
            (
                index
                for index, value in enumerate(values)
                if direction * (value - start) >= magnitude * 0.5
            ),
            None,
        )
        return {
            "start": start,
            "target": target,
            "final": values[-1],
            "movement_frames": movement_frames,
            "max_share": max_share,
            "wrong_way_share": wrong_way / max(magnitude, 1e-9),
            "remaining_500": remaining_500,
            "crossing": crossing,
        }

    def sample_step_response(self, page: Page) -> tuple[list[dict[str, object]], float, float]:
        """Instantly move half a leg and sample the rendered camera once per rAF."""
        leg_index = 10  # leg 11, even: pan travels left -> right
        start_fraction, target_fraction = 0.25, 0.75
        start_progress = (leg_index + start_fraction) / 20
        target_progress = (leg_index + target_fraction) / 20
        self.settle_progress(page, start_progress)
        duration = float(page.locator("#book video.on").evaluate("video => video.duration"))
        samples = page.evaluate(
            """arg => new Promise(resolve => {
              const scene = document.querySelector('#book');
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const samples = [];
              const started = performance.now();
              const read = now => {
                const video = scene.querySelector('video.on');
                samples.push({
                  ms: now - started,
                  pan: parseFloat(scene.style.getPropertyValue('--pan') || '.5'),
                  journey: parseFloat(scene.style.getPropertyValue('--journey') || '0'),
                  time: video ? video.currentTime : 0,
                });
              };
              read(started);
              scrollTo(0, top + span * arg.target);
              const frame = now => {
                read(now);
                if (now - started < 620) requestAnimationFrame(frame);
                else resolve(samples);
              };
              requestAnimationFrame(frame);
            })""",
            {"target": target_progress},
        )
        u = (target_fraction - 0.12) / 0.76
        target_pan = u * u * (3 - 2 * u)
        target_time = target_fraction * duration
        return samples, target_pan, target_time

    def check_step_response(self, page: Page, label: str) -> None:
        samples, target_pan, target_time = self.sample_step_response(page)
        pan = self.camera_sample_metrics(samples, "pan", target_pan)
        clock = self.camera_sample_metrics(samples, "time", target_time)
        self.check(
            f"{label} weighted step spreads motion over frames",
            pan["movement_frames"] >= 6 and clock["movement_frames"] >= 6,
            f"pan={pan['movement_frames']} frames, clock={clock['movement_frames']} frames",
        )
        self.check(
            f"{label} weighted step has no teleport",
            pan["max_share"] <= 0.35 and clock["max_share"] <= 0.35,
            f"largest pan={pan['max_share']:.1%}, clock={clock['max_share']:.1%} of step",
        )
        self.check(
            f"{label} weighted step reaches 95% by 500ms",
            pan["remaining_500"] <= 0.05 and clock["remaining_500"] <= 0.05,
            f"remaining pan={pan['remaining_500']:.1%}, clock={clock['remaining_500']:.1%}",
        )
        self.check(
            f"{label} weighted step approaches monotonically",
            pan["wrong_way_share"] <= 0.01 and clock["wrong_way_share"] <= 0.01,
            f"reverse pan={pan['wrong_way_share']:.2%}, clock={clock['wrong_way_share']:.2%}",
        )
        pan_cross, time_cross = pan["crossing"], clock["crossing"]
        lockstep = pan_cross is not None and time_cross is not None and abs(pan_cross - time_cross) <= 3
        self.check(
            f"{label} pan and film clock stay in lockstep",
            lockstep,
            f"50% crossing frames pan={pan_cross}, clock={time_cross}",
        )

    def check_glide_to_rest(self, page: Page, label: str) -> None:
        """A short equal-step wheel burst must leave camera motion after the
        hand stops, then converge and park its rAF loop."""
        start = (10 + 0.20) / 20
        targets = [(10 + fraction) / 20 for fraction in (0.30, 0.40, 0.50)]
        self.settle_progress(page, start)
        result = page.evaluate(
            """arg => new Promise(resolve => {
              const scene = document.querySelector('#book');
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const samples = [];
              const started = performance.now();
              const stopMs = 110;
              const read = now => samples.push({
                ms: now - started,
                pan: parseFloat(scene.style.getPropertyValue('--pan') || '.5'),
                journey: parseFloat(scene.style.getPropertyValue('--journey') || '0'),
                time: scene.querySelector('video.on')?.currentTime || 0,
              });
              read(started);
              arg.targets.forEach((target, index) => setTimeout(
                () => scrollTo(0, top + span * target), index * 55
              ));
              const frame = now => {
                read(now);
                if (now - started < 850) requestAnimationFrame(frame);
                else resolve({samples, stopMs, finalTarget: arg.targets.at(-1)});
              };
              requestAnimationFrame(frame);
            })""",
            {"targets": targets},
        )
        samples = result["samples"]
        post_stop_moves = 0
        for previous, current in zip(samples, samples[1:]):
            if float(current["ms"]) < float(result["stopMs"]) + 34:
                continue
            if abs(float(current["journey"]) - float(previous["journey"])) >= 1e-5:
                post_stop_moves += 1
        final_error_legs = abs(float(samples[-1]["journey"]) - float(result["finalTarget"])) * 20
        self.check(
            f"{label} camera glides after input stops",
            post_stop_moves >= 2,
            f"moving post-stop frames={post_stop_moves}",
        )
        self.check(
            f"{label} glide settles within 0.5% of a leg",
            final_error_legs <= 0.005,
            f"final error={final_error_legs:.4f} leg",
        )
        page.wait_for_timeout(450)
        state = page.locator("#book").get_attribute("data-camera-state") or "missing"
        self.check(f"{label} camera loop parks when idle", state == "idle", state)

    def check_steady_scroll_evenness(self, page: Page, label: str) -> None:
        """A constant-rate train of wheel-sized inputs must not appear as
        event-sized pan spikes."""
        start = (10 + 0.30) / 20
        targets = [(10 + 0.30 + 0.05 * step) / 20 for step in range(1, 9)]
        self.settle_progress(page, start)
        result = page.evaluate(
            """arg => new Promise(resolve => {
              const scene = document.querySelector('#book');
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const samples = [];
              const started = performance.now();
              const inputEnd = (arg.targets.length - 1) * 70;
              const read = now => samples.push({
                ms: now - started,
                pan: parseFloat(scene.style.getPropertyValue('--pan') || '.5'),
              });
              read(started);
              arg.targets.forEach((target, index) => setTimeout(
                () => scrollTo(0, top + span * target), index * 70
              ));
              const frame = now => {
                read(now);
                if (now - started < inputEnd + 180) requestAnimationFrame(frame);
                else resolve({samples, inputEnd});
              };
              requestAnimationFrame(frame);
            })""",
            {"targets": targets},
        )
        samples = result["samples"]
        deltas = [
            abs(float(current["pan"]) - float(previous["pan"]))
            for previous, current in zip(samples, samples[1:])
            if 70 <= float(current["ms"]) <= float(result["inputEnd"]) + 120
        ]
        middle = median(deltas) if deltas else 0.0
        spike = max(deltas, default=0.0)
        even = middle > 1e-5 and spike <= 3 * middle
        self.check(
            f"{label} steady scroll has even per-frame pan",
            even,
            f"max={spike:.5f}, median={middle:.5f}, ratio={spike / max(middle, 1e-9):.2f}x",
        )

    def check_chapter_grammar(self, page: Page, label: str) -> None:
        values: dict[str, float] = {}
        for name, leg_index, fraction in (
            ("even_arrive", 10, 0.10), ("even_mid", 10, 0.50), ("even_settle", 10, 0.90),
            ("odd_arrive", 9, 0.10), ("odd_mid", 9, 0.50), ("odd_settle", 9, 0.90),
        ):
            self.settle_progress(page, (leg_index + fraction) / 20)
            values[name] = self.pan_position(page)
        parked = (
            values["even_arrive"] <= 0.02 and values["even_settle"] >= 0.98
            and values["odd_arrive"] >= 0.98 and values["odd_settle"] <= 0.02
        )
        self.check(f"{label} chapters arrive and settle on parked edges", parked, values)
        midpoint = abs(values["even_mid"] - 0.5) <= 0.05 and abs(values["odd_mid"] - 0.5) <= 0.05
        self.check(f"{label} chapter cross is centered at halfway", midpoint, values)

    def check_jump_snap(self, page: Page, label: str) -> None:
        start, target = (2 + 0.5) / 20, (6 + 0.5) / 20  # four-leg navigation jump
        self.settle_progress(page, start)
        samples = page.evaluate(
            """target => new Promise(resolve => {
              const scene = document.querySelector('#book');
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const values = [];
              scrollTo(0, top + span * target);
              const frame = () => {
                values.push(parseFloat(scene.style.getPropertyValue('--journey') || '0'));
                if (values.length < 4) requestAnimationFrame(frame); else resolve(values);
              };
              requestAnimationFrame(frame);
            })""",
            target,
        )
        self.check(
            f"{label} large navigation jump snaps the camera",
            abs(float(samples[-1]) - target) <= 1e-4,
            f"journey frames={samples}, target={target:.4f}",
        )

    def check_rostrum_pan(self, page: Page, label: str) -> None:
        """The scroll must PAN the frame's hidden width inside each chapter,
        serpentine across chapters so the camera never jumps at a join."""
        self.set_progress(page, "#book", 0.4575)  # leg 10 (index 9, odd), f=.15
        self.wait_leg(page, 10, 0.15, label=label)
        early = self.pan_position(page)
        self.set_progress(page, "#book", 0.4925)  # f=.85; plateaus sit outside this window
        self.wait_leg(page, 10, 0.85, label=label)
        late = self.pan_position(page)
        sweep = abs(late - early)
        self.check(
            f"{label} scroll pans the hidden width",
            sweep >= 0.6,
            f"pan {early:.2f} -> {late:.2f} inside leg 10 (sweep {sweep:.2f})",
        )
        rendered = page.locator("#book video.on").evaluate(
            "v => getComputedStyle(v).objectPosition"
        )
        self.check(
            f"{label} pan reaches the renderer",
            "%" in str(rendered),
            f"object-position={rendered} at pan={late:.2f}",
        )
        boundary_before = self.pan_position(page)
        self.set_progress(page, "#book", 0.5005)
        self.wait_leg(page, 11, 0.01, tolerance=0.45, label=label)
        boundary_after = self.pan_position(page)
        self.check(
            f"{label} serpentine continuity at the join",
            abs(boundary_after - boundary_before) <= 0.04,
            f"pan {boundary_before:.3f} -> {boundary_after:.3f} across 10→11",
        )

    def check_truth_copy(self, page: Page) -> None:
        body = page.locator("body").inner_text()
        stale = "its own clock" in body or "بتوقيته الخاص" in body
        self.check("no own-clock claims survive", not stale, "own-clock phrase present" if stale else "clean")
        self.check(
            "cold open states the scrub truth",
            "moves only under your hand" in body,
            "phrase found" if "moves only under your hand" in body else "missing",
        )
        credits = page.locator(".credits").inner_text()
        self.check(
            "credits state never-autoplayed",
            "never autoplayed" in credits,
            "found" if "never autoplayed" in credits else "missing",
        )

    def check_weighted_version(self, page: Page) -> None:
        badge = " ".join(page.locator(".ver").inner_text().split())
        title = (page.locator(".ver").get_attribute("title") or "").casefold()
        self.check(
            "weighted camera version badge",
            badge == "v3.3 · II" and "weighted camera" in title,
            {"badge": badge, "title": title},
        )

    def screenshot(self, page: Page, name: str) -> Path:
        path = self.output_dir / name
        page.screenshot(path=str(path), full_page=False)
        self.check(f"screenshot {name}", path.exists() and path.stat().st_size > 10_000, path.stat().st_size)
        return path

    def media_screenshot(self, page: Page, name: str) -> Path:
        path = self.output_dir / name
        data_url = page.locator("#book video.on").evaluate(
            """video => new Promise(resolve => {
              const paint = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                resolve(canvas.toDataURL('image/png'));
              };
              if ('requestVideoFrameCallback' in video) video.requestVideoFrameCallback(paint);
              else requestAnimationFrame(paint);
              setTimeout(paint, 1500);
            })"""
        )
        path.write_bytes(base64.b64decode(data_url.split(",", 1)[1]))
        self.check(f"media screenshot {name}", path.exists() and path.stat().st_size > 10_000, path.stat().st_size)
        return path

    def find_fin(self, page: Page, prefix: str) -> None:
        best: tuple[float, float, dict[str, float]] | None = None
        for step in range(45, 100):
            progress = step / 100
            self.set_progress(page, ".credits", progress, delay_ms=55)
            rect = page.locator(".credits .fin").evaluate(
                """el => {
                  const r = el.getBoundingClientRect();
                  const visible = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
                  return {top:r.top, bottom:r.bottom, height:r.height, vh:innerHeight, ratio:visible/r.height};
                }"""
            )
            candidate = (float(rect["ratio"]), progress, rect)
            if best is None or candidate[0] > best[0]:
                best = candidate
            if rect["top"] >= 0 and rect["bottom"] <= rect["vh"]:
                best = candidate
                break
        assert best is not None
        ratio, progress, rect = best
        text = page.locator(".credits .fin .en").text_content().strip()
        self.check(
            f"{prefix} FIN intact",
            ratio >= 0.99 and text == "FIN",
            f"p={progress:.2f} visible={ratio:.2f} top={rect['top']:.1f} bottom={rect['bottom']:.1f}",
        )
        self.screenshot(page, f"{prefix}-credits.png")

    def transport_pass(self, context: BrowserContext) -> None:
        clip_url = urljoin(self.url, "disney2/clips/DSN2-010.mp4")
        head = context.request.head(clip_url, timeout=30_000)
        accept_ranges = head.headers.get("accept-ranges", "")
        self.check("clip HEAD status", head.status == 200, head.status)
        self.check("Accept-Ranges header", accept_ranges.lower() == "bytes", accept_ranges or "missing")
        head.dispose()

        ranged = context.request.get(clip_url, headers={"Range": "bytes=0-1023"}, timeout=30_000)
        self.check("clip byte-range response", ranged.status == 206, ranged.status)
        self.check(
            "clip Content-Range",
            ranged.headers.get("content-range", "").startswith("bytes 0-1023/"),
            ranged.headers.get("content-range", "missing"),
        )
        ranged.dispose()

    def scrub_journey(self, page: Page, label: str) -> None:
        """The heart of the contract: positions on the runway map to exact
        film times, forward AND reverse, with the film always paused."""
        self.set_progress(page, "#book", 0.025)
        self.wait_leg(page, 1, 0.5, label=label)
        self.check_frame_geometry(page, label)
        self.screenshot(page, f"{label}-leg-01.png")

        self.set_progress(page, "#book", 0.125)
        self.wait_leg(page, 3, 0.5, label=label)

        self.set_progress(page, "#book", 0.475)
        self.wait_leg(page, 10, 0.5, label=label)
        self.check_clock_freeze(page, label)
        self.screenshot(page, f"{label}-leg-10.png")

        # chapter boundary 10 -> 11: the join must land on the same drawn frame
        self.set_progress(page, "#book", 0.4995)
        self.wait_leg(page, 10, 0.99, tolerance=0.45, label=label)
        before = self.media_screenshot(page, f"{label}-boundary-10-before-media.png")
        self.set_progress(page, "#book", 0.5005)
        self.wait_leg(page, 11, 0.01, tolerance=0.45, label=label)
        after = self.media_screenshot(page, f"{label}-boundary-10-after-media.png")
        raw, edge = boundary_metrics(before, after)
        self.check(f"{label} boundary continuity 10→11", raw <= 20 and edge <= 50, f"raw={raw:.1f}, edge={edge:.1f}")

        self.set_progress(page, "#book", 0.975)
        self.wait_leg(page, 20, 0.5, label=label)
        self.screenshot(page, f"{label}-leg-20.png")

        # reverse: the film must obey the hand backwards too
        self.set_progress(page, "#book", 0.225)
        self.wait_leg(page, 5, 0.5, label=label)
        self.screenshot(page, f"{label}-reverse-leg-05.png")

    def desktop_pass(self, browser: Browser) -> None:
        context = browser.new_context(viewport={"width": 1440, "height": 900}, locale="en-US")
        self.install_play_instrument(context)
        page = self.open_page(context, self.url)
        page.wait_for_selector("#book.mode-scrub")
        self.transport_pass(context)

        runway = page.locator("#book").evaluate("el => ({height: el.offsetHeight, vh: innerHeight})")
        ratio = runway["height"] / runway["vh"]
        self.check("rendered film runway", ratio + 0.01 >= self.minimum_runway_vh, f"{ratio:.2f}vh")

        self.assert_mode(page, "desktop")
        self.assert_no_side_chrome(page, "desktop")
        self.check_truth_copy(page)
        self.check_weighted_version(page)

        self.set_progress(page, "#top", 0.56)
        self.screenshot(page, "desktop-cold-open.png")

        self.scrub_journey(page, "desktop")
        self.check_parallax_travel(page, "desktop")
        self.check_step_response(page, "desktop")
        self.check_glide_to_rest(page, "desktop")
        self.check_steady_scroll_evenness(page, "desktop")
        self.check_chapter_grammar(page, "desktop")
        self.check_jump_snap(page, "desktop")
        self.check_rostrum_pan(page, "desktop")
        self.check_chrome_fade(page, "desktop")

        # bilingual: the cue must re-render in Arabic with RTL direction
        self.set_progress(page, "#book", 0.475)
        self.wait_leg(page, 10, label="desktop")
        page.evaluate("document.querySelector('[data-lang-toggle]').click()")
        page.wait_for_function("document.documentElement.lang === 'ar' && document.documentElement.dir === 'rtl'")
        arabic = page.evaluate(
            """() => ({
              en: getComputedStyle(document.querySelector('#cue-title .en')).display,
              ar: getComputedStyle(document.querySelector('#cue-title .ar')).display,
              text: document.querySelector('#cue-title .ar').textContent.trim(),
            })"""
        )
        self.check(
            "Arabic cue and direction",
            arabic["en"] == "none" and arabic["ar"] != "none" and arabic["text"] == "الضوء المختار",
            arabic,
        )
        self.screenshot(page, "desktop-arabic-leg-10.png")
        page.evaluate("document.querySelector('[data-lang-toggle]').click()")
        page.wait_for_function("document.documentElement.lang === 'en' && document.documentElement.dir === 'ltr'")

        self.find_fin(page, "desktop")
        self.assert_zero_autoplay(page, "desktop")
        page.close()

        solo = self.open_page(context, with_query(self.url, solo=2, p=0.525))
        solo.wait_for_selector("#book.mode-scrub")
        self.wait_leg(solo, 11, 0.5, tolerance=0.6, label="solo")
        visible_scenes = solo.locator("[data-scene]").evaluate_all(
            "els => els.filter(el => getComputedStyle(el).display !== 'none').length"
        )
        solo_height = solo.locator("#book").evaluate("el => el.offsetHeight / innerHeight")
        self.check(
            "solo harness isolates film",
            visible_scenes == 1 and abs(solo_height - 1) < 0.01,
            f"scenes={visible_scenes}, height={solo_height:.2f}vh",
        )
        self.screenshot(solo, "desktop-solo-p050.png")
        self.assert_zero_autoplay(solo, "solo")
        solo.close()
        context.close()

    def motion_preference_pass(self, browser: Browser) -> None:
        context = browser.new_context(
            viewport={"width": 1440, "height": 900}, reduced_motion="reduce", locale="en-US"
        )
        self.install_play_instrument(context)
        page = self.open_page(context, self.url)
        page.wait_for_selector("#book.mode-scrub")
        self.assert_mode(page, "motion-preference")
        self.check_step_response(page, "motion-preference")
        self.check_glide_to_rest(page, "motion-preference")
        self.set_progress(page, "#book", 0.475)
        self.wait_leg(page, 10, 0.5, label="motion-preference")
        candle = page.evaluate(
            "getComputedStyle(document.querySelector('.open .candle')).animationDuration"
        )
        self.check("motion preference keeps the living candle", candle != "0.001s", candle)
        self.screenshot(page, "desktop-motion-preference.png")
        self.assert_zero_autoplay(page, "motion-preference")
        context.close()

    def lobby_pass(self, browser: Browser) -> None:
        context = browser.new_context(viewport={"width": 1440, "height": 900}, locale="en-US")
        page = self.open_page(context, urljoin(self.url, "./"))
        card = page.locator("a.card.feature[href='disney.html']")
        card.wait_for()
        image = card.locator("img")
        page.wait_for_function(
            "img => img.complete && img.naturalWidth > 0", arg=image.element_handle(), timeout=20_000
        )
        state = image.evaluate(
            "img => ({src: img.currentSrc.split('/').slice(-3).join('/'), width: img.naturalWidth})"
        )
        body = page.locator("body").inner_text()
        spec = " ".join(card.locator(".spec").inner_text().split()).casefold()
        self.check("lobby Edition II poster", state["src"] == "disney2/posters/kf-19.jpg", state)
        self.check(
            "lobby Edition II truth copy",
            "Edition II from 20 real WAN 2.7" in body and "32-shot first edition is retired" in body,
            "20 current / 32 retired",
        )
        self.check(
            "lobby card names the scrub, not a master button",
            "scroll-scrubbed" in spec and "master cut" not in spec,
            spec,
        )
        card.scroll_into_view_if_needed()
        self.screenshot(page, "desktop-worlds-lobby.png")
        context.close()

    def phone_pass(self, browser: Browser) -> None:
        context = browser.new_context(
            viewport={"width": 390, "height": 844}, screen={"width": 390, "height": 844},
            is_mobile=True, has_touch=True, device_scale_factor=1, locale="en-US"
        )
        self.install_play_instrument(context)
        page = self.open_page(context, self.url)
        page.wait_for_selector("#book.mode-scrub")

        self.assert_mode(page, "phone")
        self.assert_no_side_chrome(page, "phone")

        self.set_progress(page, "#top", 0.56)
        self.screenshot(page, "phone-cold-open.png")

        self.scrub_journey(page, "phone")
        self.check_parallax_travel(page, "phone")
        self.check_step_response(page, "phone")
        self.check_glide_to_rest(page, "phone")
        self.check_steady_scroll_evenness(page, "phone")
        self.check_chapter_grammar(page, "phone")
        self.check_jump_snap(page, "phone")
        self.check_rostrum_pan(page, "phone")

        self.find_fin(page, "phone")
        self.assert_zero_autoplay(page, "phone")
        context.close()

    def run(self, browser: Browser) -> int:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.desktop_pass(browser)
        self.motion_preference_pass(browser)
        self.lobby_pass(browser)
        self.phone_pass(browser)
        self.check("console clean", not self.console_errors, self.console_errors or "0 errors")
        self.check("page exceptions", not self.page_errors, self.page_errors or "0 exceptions")
        for warning in self.console_warnings:
            print(f"WARN local ranged-server cancellation: {warning}")

        report = {
            "url": self.url,
            "verified_at_utc": datetime.now(timezone.utc).isoformat(),
            "viewport_desktop": [1440, 900],
            "viewport_phone": [390, 844],
            "checks": self.checks,
            "failures": self.failures,
            "console_errors": self.console_errors,
            "console_warnings": self.console_warnings,
            "page_errors": self.page_errors,
        }
        report_path = self.output_dir / "verification.json"
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"verification report: {report_path}")
        if self.failures:
            print(f"DISNEY2_VERIFY_FAIL: {len(self.failures)} failing gate(s)", file=sys.stderr)
            return 1
        print(f"DISNEY2_VERIFY_PASS: {len(self.checks)} checks")
        return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--minimum-runway-vh", type=float, default=19.0)
    args = parser.parse_args()

    verification = Verification(args.url, args.output_dir.resolve(), args.minimum_runway_vh)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            return verification.run(browser)
        finally:
            browser.close()


if __name__ == "__main__":
    raise SystemExit(main())
