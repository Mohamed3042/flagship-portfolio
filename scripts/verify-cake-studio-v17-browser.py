#!/usr/bin/env python3
"""Rendered browser gate for the Cake Studio v1.7 pending-media shell.

Run this behind the webapp-testing skill's with_server.py helper. The gate is
deliberately limited to the state before the fifteen WAN clips arrive: the
manifest must be present and mapped, but it must not cause any v1.7 MP4 request.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from PIL import Image, ImageDraw
from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError, sync_playwright


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


INTRO_IDS = [f"I{index:02d}" for index in range(1, 11)]
OUTRO_IDS = [f"O{index:02d}" for index in range(1, 6)]
EXPECTED_IDS = {"intro": INTRO_IDS, "outro": OUTRO_IDS}
EXPECTED_ENDPOINTS = {
    "intro": {
        "first": "CST17-I00-edge-in-darkness.webp",
        "last": "CST17-I10-exact-cst001-frame000.webp",
    },
    "outro": {
        "first": "CST17-O00-exact-cst050-frame149.webp",
        "last": "CST17-O05-finished-mobius-cake.webp",
    },
}
MANIFEST_SUFFIX = "cake-studio/v17/manifest.json?v=1.7.0-pending"
V17_CLIP_MARKER = "/cake-studio/v17/clips/"


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


PROFILES = (
    Profile("desktop-motion", 1440, 1000, False, False),
    Profile("desktop-reduced", 1440, 1000, True, False),
    Profile("phone-motion", 390, 844, False, True),
    Profile("phone-reduced", 390, 844, True, True),
)


class Verification:
    def __init__(self, url: str, output: Path, sabotage: bool, profiles: tuple[Profile, ...]) -> None:
        self.url = url
        self.output = output
        self.sabotage = sabotage
        self.profiles = profiles
        self.output.mkdir(parents=True, exist_ok=True)
        self.checks: list[dict[str, Any]] = []
        self.failures: list[str] = []
        self.profile_reports: dict[str, Any] = {}
        self.screenshots: list[tuple[str, Path]] = []
        self.structure_results: list[bool] = []
        self.presentation_failures = 0

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
        if kind == "structure":
            self.structure_results.append(passed)
        if kind == "presentation" and not passed:
            self.presentation_failures += 1
        if not passed:
            self.failures.append(f"{name}: {detail_text}")
        return passed

    @staticmethod
    def observe(page: Page) -> dict[str, list[Any]]:
        events: dict[str, list[Any]] = {
            "console_errors": [],
            "page_errors": [],
            "manifest_requests": [],
            "v17_mp4_requests": [],
            "v17_failures": [],
            "v17_http_errors": [],
        }

        def on_console(message: Any) -> None:
            if message.type == "error":
                events["console_errors"].append(message.text)

        def on_request(request: Any) -> None:
            url = request.url
            if url.endswith(MANIFEST_SUFFIX):
                events["manifest_requests"].append(url)
            if V17_CLIP_MARKER in url.lower() and urlsplit(url).path.lower().endswith(".mp4"):
                events["v17_mp4_requests"].append(url)

        def on_request_failed(request: Any) -> None:
            if "/cake-studio/v17/" in request.url.lower():
                events["v17_failures"].append(
                    {"url": request.url, "failure": request.failure or "unknown"}
                )

        def on_response(response: Any) -> None:
            if "/cake-studio/v17/" in response.url.lower() and response.status >= 400:
                events["v17_http_errors"].append(
                    {"url": response.url, "status": response.status}
                )

        page.on("console", on_console)
        page.on("pageerror", lambda error: events["page_errors"].append(str(error)))
        page.on("request", on_request)
        page.on("requestfailed", on_request_failed)
        page.on("response", on_response)
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
        context.add_init_script(
            """(() => {
              try { localStorage.removeItem('mm-lang'); } catch {}
              window.__cakeV17PlayAttempts = 0;
              const originalPlay = HTMLMediaElement.prototype.play;
              HTMLMediaElement.prototype.play = function(...args) {
                if (this.classList.contains('bookend-buffer')) {
                  window.__cakeV17PlayAttempts += 1;
                }
                return originalPlay.apply(this, args);
              };
            })()"""
        )
        return context

    def open_page(self, context: BrowserContext, profile: Profile) -> tuple[Page, dict[str, list[Any]]]:
        page = context.new_page()
        events = self.observe(page)
        page.goto(self.url, wait_until="networkidle", timeout=45_000)
        try:
            page.wait_for_function(
                """() => window.__cakeStudioBookends?.state === 'awaiting-media'
                  && window.__cakeStudioBookends.units?.length === 2""",
                timeout=15_000,
            )
        except TimeoutError:
            self.check(
                f"{profile.name} runtime boot",
                False,
                page.evaluate(
                    """() => ({
                      runtime: window.__cakeStudioBookends?.state || 'missing',
                      units: window.__cakeStudioBookends?.units?.length || 0,
                      bodyVersion: document.body.dataset.version || ''
                    })"""
                ),
                kind="structure",
            )
        if self.sabotage:
            page.add_style_tag(
                content="""
                  .bookend-poster,
                  .bookend-canvas { object-fit: cover !important; }
                """
            )
            applied = page.evaluate(
                """() => [...document.querySelectorAll('.bookend-poster')]
                  .length === 2
                  && [...document.querySelectorAll('.bookend-poster')]
                    .every(node => getComputedStyle(node).objectFit === 'cover')"""
            )
            self.check(f"{profile.name} sabotage applied", applied, "object-fit=cover")
        return page, events

    @staticmethod
    def set_language(page: Page, language: str) -> None:
        current = page.evaluate("document.documentElement.lang")
        if current != language:
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
              dispatchEvent(new Event('scroll'));
              return true;
            }""",
            {"selector": selector, "progress": progress},
        )
        if not found:
            raise RuntimeError(f"missing Cake Studio v1.7 track: {track}")
        page.wait_for_function(
            """({selector, progress}) => {
              const scene = document.querySelector(selector);
              const p = Number.parseFloat(scene?.style.getPropertyValue('--p') || '-1');
              return Math.abs(p - progress) <= .002;
            }""",
            arg={"selector": selector, "progress": progress},
            timeout=7_000,
        )
        page.wait_for_function(
            """selector => {
              const poster = document.querySelector(selector)?.querySelector('[data-bookend-poster]');
              return Boolean(poster?.complete && poster.naturalWidth === 1280 && poster.naturalHeight === 720);
            }""",
            arg=selector,
            timeout=7_000,
        )
        page.wait_for_timeout(80)

    @staticmethod
    def endpoint_state(page: Page, track: str) -> dict[str, Any]:
        return page.locator(f'[data-cake-bookend="{track}"]').evaluate(
            """scene => {
              const poster = scene.querySelector('[data-bookend-poster]');
              return {
                progress: Number.parseFloat(scene.style.getPropertyValue('--p') || '-1'),
                sequenceProgress: Number.parseFloat(scene.style.getPropertyValue('--sequence-progress') || '-1'),
                mode: scene.dataset.sequenceMode || '',
                state: scene.dataset.sequenceState || '',
                index: Number(scene.dataset.sequenceIndex || 0),
                clip: scene.dataset.sequenceClip || '',
                count: Number(scene.dataset.sequenceCount || 0),
                counter: scene.querySelector('[data-bookend-count]')?.textContent.trim() || '',
                poster: poster?.getAttribute('src') || '',
                posterCurrent: poster?.currentSrc || '',
                posterReady: Boolean(poster?.complete && poster.naturalWidth === 1280 && poster.naturalHeight === 720),
              };
            }"""
        )

    def structure_pass(self, page: Page, profile: Profile) -> dict[str, Any]:
        state = page.evaluate(
            """() => {
              const runtime = window.__cakeStudioBookends;
              const scenes = [...document.querySelectorAll('[data-cake-bookend]')];
              return {
                bodyVersion: document.body.dataset.version || '',
                runtimeVersion: runtime?.version || '',
                runtimeState: runtime?.state || '',
                manifestReady: runtime?.manifestReady,
                manifestRefs: scenes.map(scene => scene.dataset.bookendManifest || ''),
                tracks: scenes.map(scene => scene.dataset.bookendTrack || ''),
                sequenceNodes: document.querySelectorAll('[data-bookend-sequence]').length,
                apertureNodes: document.querySelectorAll('.bookend-aperture').length,
                canvasNodes: document.querySelectorAll('[data-bookend-canvas]').length,
                posterNodes: document.querySelectorAll('[data-bookend-poster]').length,
                bufferNodes: document.querySelectorAll('.bookend-buffer').length,
                viewport: {width: innerWidth, height: innerHeight},
                reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
                snapshot: runtime?.snapshot?.() || [],
                mappings: (runtime?.units || []).map(unit => ({
                  track: unit.trackName,
                  count: unit.clips.length,
                  ids: unit.clips.map(clip => clip.id),
                  sources: unit.clips.map(clip => clip.src),
                  first: unit.clips.map(clip => clip.first),
                  last: unit.clips.map(clip => clip.last),
                })),
              };
            }"""
        )
        shell_ok = (
            state["bodyVersion"] == "1.7.0"
            and state["runtimeVersion"] == "1.7.0"
            and state["runtimeState"] == "awaiting-media"
            and state["manifestReady"] is False
            and state["tracks"] == ["intro", "outro"]
            and state["sequenceNodes"] == 2
            and state["apertureNodes"] == 2
            and state["canvasNodes"] == 2
            and state["posterNodes"] == 2
            and state["bufferNodes"] == 4
            and state["manifestRefs"] == [MANIFEST_SUFFIX, MANIFEST_SUFFIX]
        )
        self.check(f"{profile.name} v1.7 pending shell", shell_ok, state, kind="structure")

        viewport_ok = (
            state["viewport"] == {"width": profile.width, "height": profile.height}
            and state["reduced"] == profile.reduced
        )
        self.check(
            f"{profile.name} viewport and motion profile",
            viewport_ok,
            {"viewport": state["viewport"], "reduced": state["reduced"]},
            kind="structure",
        )

        mappings = {item["track"]: item for item in state["mappings"]}
        mapping_ok = set(mappings) == {"intro", "outro"}
        for track, expected_ids in EXPECTED_IDS.items():
            item = mappings.get(track, {})
            ids = item.get("ids", [])
            sources = item.get("sources", [])
            first = item.get("first", [])
            last = item.get("last", [])
            mapping_ok = mapping_ok and (
                ids == expected_ids
                and item.get("count") == len(expected_ids)
                and len(sources) == len(first) == len(last) == len(expected_ids)
                and all(source.endswith(f"CST17-{clip_id}.mp4") for source, clip_id in zip(sources, expected_ids))
                and all(path.endswith(".webp") for path in first + last)
            )
        all_ids = [clip_id for item in state["mappings"] for clip_id in item["ids"]]
        mapping_ok = mapping_ok and len(all_ids) == 15 and len(set(all_ids)) == 15
        self.check(
            f"{profile.name} 15 manifest mappings",
            mapping_ok,
            {track: mappings.get(track, {}).get("ids", []) for track in EXPECTED_IDS},
            kind="structure",
        )
        return state

    def progress_pass(self, page: Page, profile: Profile, track: str) -> list[dict[str, Any]]:
        ids = EXPECTED_IDS[track]
        endpoint = EXPECTED_ENDPOINTS[track]
        observations: list[dict[str, Any]] = []
        for direction, progress, expected_index, expected_poster in (
            ("forward-start", 0.0, 1, endpoint["first"]),
            ("forward-end", 1.0, len(ids), endpoint["last"]),
            ("reverse-start", 0.0, 1, endpoint["first"]),
        ):
            self.set_progress(page, track, progress)
            state = self.endpoint_state(page, track)
            state["direction"] = direction
            observations.append(state)
            expected_clip = ids[expected_index - 1]
            passed = (
                math.isclose(state["progress"], progress, abs_tol=0.002)
                and math.isclose(state["sequenceProgress"], progress, abs_tol=0.002)
                and state["mode"] == "still"
                and state["state"] == "awaiting-media"
                and state["index"] == expected_index
                and state["clip"] == expected_clip
                and state["count"] == len(ids)
                and state["counter"] == f"{expected_index:02d} / {len(ids):02d}"
                and state["poster"].endswith(expected_poster)
                and state["posterCurrent"].endswith(expected_poster)
                and state["posterReady"]
            )
            self.check(
                f"{profile.name} {track} {direction}",
                passed,
                state,
                kind="behavior",
            )
        deterministic = all(
            observations[0][field] == observations[2][field]
            for field in ("mode", "state", "index", "clip", "count", "counter", "poster")
        )
        self.check(
            f"{profile.name} {track} reverse is deterministic",
            deterministic,
            {"before": observations[0], "after": observations[2]},
            kind="behavior",
        )
        return observations

    def layout_pass(self, page: Page, profile: Profile, track: str, language: str) -> dict[str, Any]:
        self.set_progress(page, track, 1.0)
        info = page.locator(f'[data-cake-bookend="{track}"]').evaluate(
            """scene => {
              const aperture = scene.querySelector('.bookend-aperture');
              const poster = scene.querySelector('[data-bookend-poster]');
              const canvas = scene.querySelector('[data-bookend-canvas]');
              const stage = scene.querySelector('.stage');
              const ar = aperture.getBoundingClientRect();
              const sr = stage.getBoundingClientRect();
              const style = getComputedStyle(aperture);
              const posterStyle = getComputedStyle(poster);
              const sourceWidth = poster.naturalWidth;
              const sourceHeight = poster.naturalHeight;
              const scale = posterStyle.objectFit === 'cover'
                ? Math.max(ar.width / sourceWidth, ar.height / sourceHeight)
                : Math.min(ar.width / sourceWidth, ar.height / sourceHeight);
              const visibleSourceWidth = Math.min(sourceWidth, ar.width / scale);
              const visibleSourceHeight = Math.min(sourceHeight, ar.height / scale);
              const sourceVisible = sourceWidth > 0 && sourceHeight > 0
                ? (visibleSourceWidth * visibleSourceHeight) / (sourceWidth * sourceHeight)
                : 0;
              const intersectionWidth = Math.max(0, Math.min(ar.right, innerWidth) - Math.max(ar.left, 0));
              const intersectionHeight = Math.max(0, Math.min(ar.bottom, innerHeight) - Math.max(ar.top, 0));
              return {
                lang: document.documentElement.lang,
                dir: document.documentElement.dir,
                progress: Number.parseFloat(scene.style.getPropertyValue('--p') || '-1'),
                mode: scene.dataset.sequenceMode || '',
                state: scene.dataset.sequenceState || '',
                aperture: {left: ar.left, top: ar.top, right: ar.right, bottom: ar.bottom, width: ar.width, height: ar.height},
                stage: {left: sr.left, top: sr.top, right: sr.right, bottom: sr.bottom, width: sr.width, height: sr.height},
                ratio: ar.width / ar.height,
                areaFraction: (ar.width * ar.height) / (innerWidth * innerHeight),
                intersectionFraction: (intersectionWidth * intersectionHeight) / (ar.width * ar.height),
                display: style.display,
                visibility: style.visibility,
                opacity: Number.parseFloat(style.opacity),
                posterFit: posterStyle.objectFit,
                posterOpacity: Number.parseFloat(posterStyle.opacity),
                source: {width: sourceWidth, height: sourceHeight, visibleFraction: sourceVisible},
                canvas: {width: canvas.width, height: canvas.height, fit: getComputedStyle(canvas).objectFit},
                viewport: {width: innerWidth, height: innerHeight},
                overflow: document.documentElement.scrollWidth - innerWidth,
              };
            }"""
        )
        aperture = info["aperture"]
        visible_and_contained = (
            info["display"] != "none"
            and info["visibility"] != "hidden"
            and info["opacity"] >= 0.99
            and info["intersectionFraction"] >= 0.999
            and aperture["left"] >= -1
            and aperture["right"] <= profile.width + 1
            and aperture["top"] >= -1
            and aperture["bottom"] <= profile.height + 1
            and abs(info["ratio"] - (16 / 9)) <= 0.01
            and info["areaFraction"] >= profile.minimum_aperture_area
        )
        self.check(
            f"{profile.name} {language} {track} contained 16:9 aperture",
            visible_and_contained,
            info,
            kind="presentation",
        )
        source_ok = (
            info["posterFit"] == "contain"
            and info["canvas"]["fit"] == "contain"
            and info["source"]["width"] == 1280
            and info["source"]["height"] == 720
            and info["source"]["visibleFraction"] >= 0.95
            and info["canvas"]["width"] == 1280
            and info["canvas"]["height"] == 720
        )
        self.check(
            f"{profile.name} {language} {track} full source presentation",
            source_ok,
            {
                "fit": info["posterFit"],
                "canvasFit": info["canvas"]["fit"],
                "source": info["source"],
            },
            kind="presentation",
        )
        self.check(
            f"{profile.name} {language} {track} no horizontal overflow",
            info["overflow"] <= 1,
            f"{info['overflow']}px",
            kind="presentation",
        )
        return info

    def language_pass(self, page: Page, profile: Profile, language: str) -> dict[str, Any]:
        self.set_language(page, language)
        state = page.evaluate(
            """language => {
              const visible = node => {
                if (!node) return false;
                const style = getComputedStyle(node);
                const rect = node.getBoundingClientRect();
                return style.display !== 'none' && style.visibility !== 'hidden'
                  && Number.parseFloat(style.opacity || '1') > 0 && rect.width > 0 && rect.height > 0;
              };
              const sections = [...document.querySelectorAll('[data-cake-bookend]')];
              return {
                lang: document.documentElement.lang,
                dir: document.documentElement.dir,
                togglePressed: document.querySelector('[data-lang-toggle]')?.getAttribute('aria-pressed'),
                sections: sections.map(scene => ({
                  track: scene.dataset.bookendTrack,
                  selected: [...scene.querySelectorAll(`.L.${language}`)].filter(visible).length,
                  rejected: [...scene.querySelectorAll(`.L.${language === 'ar' ? 'en' : 'ar'}`)].filter(visible).length,
                })),
                overflow: document.documentElement.scrollWidth - innerWidth,
              };
            }""",
            language,
        )
        expected_dir = "rtl" if language == "ar" else "ltr"
        passed = (
            state["lang"] == language
            and state["dir"] == expected_dir
            and state["togglePressed"] == ("true" if language == "ar" else "false")
            and len(state["sections"]) == 2
            and all(section["selected"] >= 3 and section["rejected"] == 0 for section in state["sections"])
            and state["overflow"] <= 1
        )
        self.check(
            f"{profile.name} {language} language parity",
            passed,
            state,
            kind="presentation",
        )
        return state

    def outro_pass(self, page: Page, profile: Profile, language: str) -> dict[str, Any]:
        self.set_progress(page, "outro", 1.0)
        state = page.locator('[data-cake-bookend="outro"]').evaluate(
            """(scene, language) => {
              const copy = scene.querySelector('.bookend-copy-outro');
              const heading = scene.querySelector(`h2 .L.${language}`);
              const thesis = scene.querySelector(`.bookend-thesis .L.${language}`);
              const cr = copy.getBoundingClientRect();
              const visibleAnchors = [...scene.querySelectorAll('.bookend-links a')].filter(anchor => {
                const style = getComputedStyle(anchor);
                const rect = anchor.getBoundingClientRect();
                return style.display !== 'none' && style.visibility !== 'hidden'
                  && rect.width > 0 && rect.height > 0;
              });
              return {
                opacity: Number.parseFloat(getComputedStyle(copy).opacity),
                copyRect: {left: cr.left, top: cr.top, right: cr.right, bottom: cr.bottom, width: cr.width, height: cr.height},
                heading: heading?.textContent.trim() || '',
                headingDisplay: heading ? getComputedStyle(heading).display : 'missing',
                thesis: thesis?.textContent.trim() || '',
                thesisDisplay: thesis ? getComputedStyle(thesis).display : 'missing',
                anchors: visibleAnchors.map(anchor => {
                  const rect = anchor.getBoundingClientRect();
                  return {text: anchor.textContent.trim(), width: rect.width, height: rect.height, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom};
                }),
                counter: scene.querySelector('[data-bookend-count]')?.textContent.trim() || '',
                index: Number(scene.dataset.sequenceIndex || 0),
                clip: scene.dataset.sequenceClip || '',
              };
            }""",
            language,
        )
        copy = state["copyRect"]
        copy_contained = (
            copy["left"] >= -1
            and copy["right"] <= profile.width + 1
            and copy["top"] >= -1
            and copy["bottom"] <= profile.height + 1
        )
        anchors_ok = len(state["anchors"]) == 2 and all(
            anchor["width"] >= 44
            and anchor["height"] >= 44
            and anchor["left"] >= -1
            and anchor["right"] <= profile.width + 1
            and anchor["top"] >= -1
            and anchor["bottom"] <= profile.height + 1
            and bool(anchor["text"])
            for anchor in state["anchors"]
        )
        passed = (
            state["opacity"] >= 0.99
            and copy_contained
            and state["headingDisplay"] != "none"
            and state["thesisDisplay"] != "none"
            and bool(state["heading"])
            and bool(state["thesis"])
            and anchors_ok
            and state["counter"] == "05 / 05"
            and state["index"] == 5
            and state["clip"] == "O05"
        )
        self.check(
            f"{profile.name} {language} final outro copy and CTA",
            passed,
            state,
            kind="presentation",
        )
        return state

    def screenshot(self, page: Page, profile: Profile, language: str, track: str) -> None:
        self.set_progress(page, track, 0.0 if track == "intro" else 1.0)
        name = f"{profile.name}-{language}-{track}.png"
        path = self.output / name
        page.screenshot(path=str(path), full_page=False)
        self.screenshots.append((f"{profile.name} / {language.upper()} / {track}", path))

    def network_pass(self, profile: Profile, events: dict[str, list[Any]], page: Page) -> dict[str, Any]:
        state = page.evaluate(
            """() => ({
              v17PlayAttempts: window.__cakeV17PlayAttempts || 0,
              bufferSources: [...document.querySelectorAll('.bookend-buffer')].map(video => ({
                attribute: video.getAttribute('src'),
                current: video.currentSrc,
                error: video.error ? {code: video.error.code, message: video.error.message} : null,
              })),
            })"""
        )
        self.check(
            f"{profile.name} page fetched pending manifest",
            len(events["manifest_requests"]) >= 1,
            events["manifest_requests"],
            kind="network",
        )
        no_media = (
            not events["v17_mp4_requests"]
            and state["v17PlayAttempts"] == 0
            and len(state["bufferSources"]) == 4
            and all(not source["attribute"] and not source["current"] and source["error"] is None for source in state["bufferSources"])
        )
        self.check(
            f"{profile.name} pending shell requests no v1.7 MP4",
            no_media,
            {"requests": events["v17_mp4_requests"], **state},
            kind="network",
        )
        self.check(
            f"{profile.name} no v1.7 resource failures",
            not events["v17_failures"] and not events["v17_http_errors"],
            {"requestFailures": events["v17_failures"], "httpErrors": events["v17_http_errors"]},
            kind="network",
        )
        self.check(
            f"{profile.name} no page or console errors",
            not events["page_errors"] and not events["console_errors"],
            {"page": events["page_errors"], "console": events["console_errors"]},
            kind="network",
        )
        return {"events": events, "media": state}

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
            y0 = (index // columns) * tile_height
            y = y0 + 30 + (tile_height - 36 - image.height) // 2
            sheet.paste(image, (x, y))
            draw.text((index % columns * tile_width + 10, y0 + 8), label, fill="#f0dfc7")
        path = self.output / "contact-sheet.jpg"
        sheet.save(path, quality=91, optimize=True)
        return path

    def run_profile(self, browser: Browser, profile: Profile) -> None:
        context = self.make_context(browser, profile)
        try:
            page, events = self.open_page(context, profile)
            structure = self.structure_pass(page, profile)
            progress = {
                track: self.progress_pass(page, profile, track)
                for track in ("intro", "outro")
            }

            languages: dict[str, Any] = {}
            for language in ("en", "ar"):
                language_state = self.language_pass(page, profile, language)
                layouts = {
                    track: self.layout_pass(page, profile, track, language)
                    for track in ("intro", "outro")
                }
                outro = self.outro_pass(page, profile, language)
                self.screenshot(page, profile, language, "intro")
                self.screenshot(page, profile, language, "outro")
                languages[language] = {
                    "language": language_state,
                    "layouts": layouts,
                    "outro": outro,
                }

            network = self.network_pass(profile, events, page)
            self.profile_reports[profile.name] = {
                "structure": structure,
                "progress": progress,
                "languages": languages,
                "network": network,
            }
        finally:
            context.close()

    def finish(self) -> int:
        contact_sheet = self.build_contact_sheet()
        if contact_sheet:
            self.check("rendered contact sheet written", contact_sheet.is_file(), str(contact_sheet))
        if self.sabotage:
            self.check(
                "sabotage preserved structural checks",
                bool(self.structure_results) and all(self.structure_results),
                f"{sum(self.structure_results)}/{len(self.structure_results)} structural checks passed",
            )
            self.check(
                "sabotage tripped presentation gate",
                self.presentation_failures > 0,
                f"{self.presentation_failures} presentation failures observed",
            )

        report = {
            "schema": "cake-studio-v17-browser/v1",
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "url": self.url,
            "sabotage": self.sabotage,
            "checks": self.checks,
            "failures": self.failures,
            "profiles": self.profile_reports,
            "screenshots": [str(path) for _, path in self.screenshots],
            "contactSheet": str(contact_sheet) if contact_sheet else None,
        }
        report_path = self.output / ("report-sabotage.json" if self.sabotage else "report.json")
        report_path.write_text(
            json.dumps(report, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        if self.failures:
            print(
                f"CAKE_STUDIO_V17_BROWSER_FAIL failures={len(self.failures)} "
                f"checks={len(self.checks)} report={report_path}",
                file=sys.stderr,
            )
            return 1
        print(
            f"CAKE_STUDIO_V17_BROWSER_OK checks={len(self.checks)} "
            f"profiles={len(self.profiles)} screenshots={len(self.screenshots)} "
            f"report={report_path} contact={contact_sheet}"
        )
        return 0

    def run(self, playwright: Any) -> int:
        for profile in self.profiles:
            browser = playwright.chromium.launch(channel="chrome", headless=True)
            try:
                self.run_profile(browser, profile)
            finally:
                browser.close()
        return self.finish()


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify the rendered Cake Studio v1.7 pending-media bookend runtime."
    )
    parser.add_argument("--url", required=True, help="Local Cake Studio page URL")
    parser.add_argument("--output", required=True, type=Path, help="Proof output directory")
    parser.add_argument(
        "--sabotage",
        action="store_true",
        help="Force object-fit:cover; the presentation gate must fail while structure passes",
    )
    parser.add_argument(
        "--profile",
        choices=[profile.name for profile in PROFILES],
        help="Run one named profile for diagnosis; the default runs the full matrix",
    )
    args = parser.parse_args()

    selected_profiles = tuple(
        profile for profile in PROFILES if args.profile is None or profile.name == args.profile
    )
    verification = Verification(
        args.url,
        args.output.resolve(),
        args.sabotage,
        selected_profiles,
    )
    with sync_playwright() as playwright:
        return verification.run(playwright)


if __name__ == "__main__":
    raise SystemExit(main())
