#!/usr/bin/env python3
"""Rendered browser gates for The Kingdom of Running Things, Parallax Edition.

The suite grades four ordered depth planes, timeline-independent scroll,
decoded media, identical desktop/phone behavior at every motion preference,
byte-range delivery, narrative continuity, and the final rendered frames.
"""

from __future__ import annotations

import argparse
import base64
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

from PIL import Image, ImageChops, ImageFilter
from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError, sync_playwright


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


EXPECTED_TITLES = {
    1: "The Waiting Book",
    5: "A Cause Is Drawn",
    10: "The Chosen Light",
    11: "The Golden Thread",
    19: "The Human Gate",
    20: "Proof, Vault, Return",
}


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
            if local and "ERR_INVALID_HTTP_RESPONSE" in message.text:
                self.console_warnings.append(entry)
                return
            self.console_errors.append(entry)

        page.on("console", on_console)
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))

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
    def set_progress(page: Page, selector: str, progress: float, delay_ms: int = 180) -> float:
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

    def wait_leg(self, page: Page, leg: int, fraction: float | None = None) -> dict[str, object]:
        payload = {"leg": leg}
        handle = page.wait_for_function(
            """arg => {
              const expected = String(arg.leg).padStart(3, '0');
              const chip = document.querySelector('#book .chip .id');
              const floor = document.querySelector('#book .floor');
              const video = document.querySelector('#book video.on');
              if (!chip || chip.textContent.trim() !== 'SHOT ' + expected.slice(-2)) return false;
              if (!floor || !floor.complete || !floor.currentSrc.endsWith('kf-' + expected.slice(-2) + '.jpg')) return false;
              if (!video || !video.currentSrc.endsWith('DSN2-' + expected + '.mp4')) return false;
              if (video.readyState < 1 || !Number.isFinite(video.duration) || video.seekable.length < 1) return false;
              return {
                clip: video.currentSrc.split('/').pop(), poster: floor.currentSrc.split('/').pop(),
                currentTime: video.currentTime, duration: video.duration,
                seekable: video.seekable.length, readyState: video.readyState,
                title: document.querySelector('#leg-title .en')?.textContent.trim() || ''
              };
            }""",
            arg=payload,
            timeout=30_000,
        )
        info = handle.json_value()
        if fraction is not None:
            frame = page.locator("#book video.on").evaluate(
                """(video, fraction) => new Promise(resolve => {
                  video.pause();
                  const target = Math.min(video.duration - .04, Math.max(.04, fraction * video.duration));
                  let settled = false;
                  const done = () => {
                    if (settled || video.readyState < 2 || video.videoWidth < 1) return;
                    settled = true;
                    resolve({currentTime:video.currentTime, target, readyState:video.readyState});
                  };
                  video.addEventListener('loadeddata', done, {once:true});
                  video.addEventListener('seeked', () => {
                    if ('requestVideoFrameCallback' in video) video.requestVideoFrameCallback(done);
                    else requestAnimationFrame(done);
                  }, {once:true});
                  video.currentTime = target;
                  if (Math.abs(video.currentTime - target) <= .01) requestAnimationFrame(done);
                  setTimeout(() => {
                    if (!settled) resolve({currentTime:video.currentTime, target, readyState:video.readyState});
                  }, 5000);
                })""",
                fraction,
            )
            info["currentTime"] = frame["currentTime"]
            info["target"] = frame["target"]
            info["readyState"] = frame["readyState"]
        expected_title = EXPECTED_TITLES.get(leg)
        if expected_title:
            self.check(f"leg {leg:02d} caption", info["title"] == expected_title, info["title"])
        self.check(
            f"leg {leg:02d} decoded frame",
            info["readyState"] >= 1 and info["seekable"] >= 1,
            f"{info['clip']} t={info['currentTime']:.3f}/{info['duration']:.3f}",
        )
        self.check(f"leg {leg:02d} floor poster", info["poster"] == f"kf-{leg:02d}.jpg", info["poster"])
        return info

    def check_cover(self, page: Page, label: str) -> None:
        values = page.locator("#book").evaluate(
            """scene => {
              const stage = scene.querySelector('.film-frame');
              const floor = scene.querySelector('.floor');
              const video = scene.querySelector('video.on');
              const sr = stage.getBoundingClientRect();
              const fr = floor.getBoundingClientRect();
              const vr = video.getBoundingClientRect();
              const scale = Math.max(vr.width / video.videoWidth, vr.height / video.videoHeight);
              return {
                objectFitFloor: getComputedStyle(floor).objectFit,
                objectFitVideo: getComputedStyle(video).objectFit,
                stage: [sr.width, sr.height], floor: [fr.width, fr.height], video: [vr.width, vr.height],
                natural: [video.videoWidth, video.videoHeight],
                scaled: [video.videoWidth * scale, video.videoHeight * scale],
                opacity: parseFloat(getComputedStyle(video).opacity)
              };
            }"""
        )
        sw, sh = values["stage"]
        fw, fh = values["floor"]
        vw, vh = values["video"]
        scaled_w, scaled_h = values["scaled"]
        no_gap = (
            values["objectFitFloor"] == "cover"
            and values["objectFitVideo"] == "cover"
            and abs(sw - fw) <= 3
            and abs(sh - fh) <= 3
            and abs(sw - vw) <= 3
            and abs(sh - vh) <= 3
            and scaled_w + 0.5 >= vw
            and scaled_h + 0.5 >= vh
            and values["opacity"] >= 0.99
        )
        self.check(
            f"{label} no letterbox",
            no_gap,
            f"stage={sw:.0f}x{sh:.0f} media={values['natural']} fit=cover",
        )

    @staticmethod
    def depth_snapshot(page: Page) -> dict[str, object]:
        return page.locator("#book").evaluate(
            """scene => {
              const names = ['.depth-far', '.film-frame', '.depth-near', '.depth-front'];
              const rects = Object.fromEntries(names.map(name => {
                const el = scene.querySelector(name);
                if (!el) return [name, null];
                const rect = el.getBoundingClientRect();
                return [name, {top:rect.top, left:rect.left, transform:getComputedStyle(el).transform}];
              }));
              const video = scene.querySelector('video.on');
              return {
                classes:scene.className,
                depth:getComputedStyle(scene).getPropertyValue('--depth').trim(),
                rects,
                currentTime:video ? video.currentTime : null,
                clip:video ? video.currentSrc.split('/').pop() : null,
              };
            }"""
        )

    def check_parallax_contract(self, page: Page, label: str) -> None:
        classes = page.locator("#book").get_attribute("class") or ""
        self.check(f"{label} parallax mode", "mode-parallax" in classes, classes)
        self.check(
            f"{label} has no alternate motion mode",
            all(name not in classes for name in ("mode-scrub", "mode-chain", "mode-still")),
            classes,
        )

        self.set_progress(page, "#book", 0.462)
        self.wait_leg(page, 10, 0.25)
        first = self.depth_snapshot(page)
        layers_present = all(first["rects"].values())
        self.check(f"{label} four depth planes", layers_present, first["rects"])
        if not layers_present:
            return
        if label in {"desktop", "phone"}:
            self.screenshot(page, f"{label}-parallax-before.png")

        self.set_progress(page, "#book", 0.488)
        self.wait_leg(page, 10)
        second = self.depth_snapshot(page)
        deltas = {
            name: abs(second["rects"][name]["top"] - first["rects"][name]["top"])
            for name in first["rects"]
        }
        ordered = (
            deltas[".depth-far"] >= 5
            and deltas[".film-frame"] > deltas[".depth-far"] * 1.6
            and deltas[".depth-near"] > deltas[".film-frame"] * 1.5
            and deltas[".depth-front"] > deltas[".depth-near"] * 1.2
        )
        self.check(f"{label} ordered parallax travel", ordered, deltas)
        timeline_free = (
            first["clip"] == second["clip"]
            and abs(float(second["currentTime"]) - float(first["currentTime"])) <= 0.08
        )
        self.check(
            f"{label} scroll leaves clip timeline independent",
            timeline_free,
            f"{first['clip']} t={first['currentTime']:.3f}->{second['currentTime']:.3f}",
        )
        self.screenshot(page, f"{label}-parallax-depth.png")

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

    def transport_and_master(self, context: BrowserContext, page: Page) -> None:
        clip_url = urljoin(self.url, "disney2/clips/DSN2-010.mp4")
        head = context.request.head(clip_url, timeout=30_000)
        accept_ranges = head.headers.get("accept-ranges", "")
        self.check("clip HEAD status", head.status == 200, head.status)
        self.check("Accept-Ranges header", accept_ranges.lower() == "bytes", accept_ranges or "missing")
        head.dispose()

        ranged = context.request.get(clip_url, headers={"Range": "bytes=0-1023"}, timeout=30_000)
        self.check("clip byte-range response", ranged.status == 206, ranged.status)
        self.check("clip Content-Range", ranged.headers.get("content-range", "").startswith("bytes 0-1023/"), ranged.headers.get("content-range", "missing"))
        ranged.dispose()

        label = page.locator("[data-theater] .en").text_content().strip()
        page.locator("[data-theater]").click()
        page.wait_for_function(
            """() => {
              const v = document.querySelector('dialog[open] video');
              return v && v.readyState >= 1 && Number.isFinite(v.duration);
            }""",
            timeout=30_000,
        )
        duration = float(page.locator("dialog[open] video").evaluate("v => v.duration"))
        expected_label = f"{int(duration // 60)}:{int(round(duration % 60)):02d}"
        self.check("master duration", abs(duration - 100.0) <= 0.02, f"{duration:.3f}s")
        self.check("master label matches media", expected_label in label, f"label={label!r}, media={expected_label}")
        page.locator(".theater__close").click()

    def desktop_pass(self, browser: Browser) -> None:
        context = browser.new_context(viewport={"width": 1440, "height": 900}, locale="en-US")
        page = self.open_page(context, self.url)
        page.wait_for_selector("#book.mode-parallax")
        self.transport_and_master(context, page)

        runway = page.locator("#book").evaluate("el => ({height:el.offsetHeight, vh:innerHeight})")
        ratio = runway["height"] / runway["vh"]
        self.check("rendered film runway", ratio + 0.01 >= self.minimum_runway_vh, f"{ratio:.2f}vh")

        self.set_progress(page, "#top", 0.56)
        self.screenshot(page, "desktop-cold-open.png")

        self.set_progress(page, "#book", 0.025)
        self.wait_leg(page, 1, 0.5)
        self.check_cover(page, "desktop")
        self.screenshot(page, "desktop-leg-01.png")

        self.check_parallax_contract(page, "desktop")
        page.locator("[data-lang-toggle]").click()
        page.wait_for_function("document.documentElement.lang === 'ar' && document.documentElement.dir === 'rtl'")
        language_state = page.locator("#book").evaluate(
            """scene => ({
              mode:scene.className,
              kick:scene.querySelector('#leg-kick .ar').textContent.trim(),
              visible:getComputedStyle(scene.querySelector('#leg-kick .ar')).display
            })"""
        )
        self.check(
            "Arabic parallax copy and direction",
            "mode-parallax" in language_state["mode"]
            and "المسرح الورقي يتحرّك في العمق" in language_state["kick"]
            and language_state["visible"] != "none",
            language_state,
        )
        page.locator("[data-lang-toggle]").click()
        page.wait_for_function("document.documentElement.lang === 'en' && document.documentElement.dir === 'ltr'")

        self.set_progress(page, "#book", 0.475)
        self.wait_leg(page, 10, 0.5)
        self.screenshot(page, "desktop-leg-10.png")

        self.set_progress(page, "#book", 0.4999)
        self.wait_leg(page, 10, 0.998)
        self.screenshot(page, "desktop-boundary-10-before.png")
        before = self.media_screenshot(page, "desktop-boundary-10-before-media.png")
        self.set_progress(page, "#book", 0.5001)
        self.wait_leg(page, 11, 0.0)
        self.screenshot(page, "desktop-boundary-10-after.png")
        after = self.media_screenshot(page, "desktop-boundary-10-after-media.png")
        raw, edge = boundary_metrics(before, after)
        self.check("desktop boundary continuity", raw <= 20 and edge <= 50, f"raw={raw:.1f}, edge={edge:.1f}")

        self.set_progress(page, "#book", 0.925)
        self.wait_leg(page, 19, 0.5)
        self.screenshot(page, "desktop-leg-19-gate.png")
        forward_y = self.set_progress(page, "#book", 0.975)
        self.wait_leg(page, 20, 0.5)
        self.screenshot(page, "desktop-leg-20.png")
        reverse_y = self.set_progress(page, "#book", 0.225)
        self.wait_leg(page, 5, 0.5)
        self.check("reverse parallax navigation to leg 05", reverse_y < forward_y, f"scrollY {forward_y:.0f} -> {reverse_y:.0f}")

        self.find_fin(page, "desktop")
        page.close()

        solo = self.open_page(context, with_query(self.url, solo=2, p=0.5))
        solo.wait_for_selector("#book.mode-parallax")
        self.wait_leg(solo, 11, 0.5)
        visible_scenes = solo.locator("[data-scene]").evaluate_all(
            "els => els.filter(el => getComputedStyle(el).display !== 'none').length"
        )
        solo_height = solo.locator("#book").evaluate("el => el.offsetHeight / innerHeight")
        self.check("solo harness isolates film", visible_scenes == 1 and abs(solo_height - 1) < 0.01, f"scenes={visible_scenes}, height={solo_height:.2f}vh")
        self.screenshot(solo, "desktop-solo-p050.png")
        solo.close()
        context.close()

    def motion_preference_pass(self, browser: Browser) -> None:
        context = browser.new_context(
            viewport={"width": 1440, "height": 900}, reduced_motion="reduce", locale="en-US"
        )
        page = self.open_page(context, self.url)
        page.wait_for_selector("#book.mode-parallax")
        self.set_progress(page, "#book", 0.475)
        self.wait_leg(page, 10, 0.5)
        state = page.locator("#book").evaluate(
            """scene => ({
              videos:[...scene.querySelectorAll('video')].map(v => getComputedStyle(v).display),
              floor:scene.querySelector('.floor').currentSrc.split('/').pop(),
              title:scene.querySelector('#leg-title .en').textContent.trim(),
              candleDuration:getComputedStyle(document.querySelector('.open .candle')).animationDuration
            })"""
        )
        self.check(
            "motion preference keeps full video experience",
            state["videos"] != ["none", "none"]
            and state["floor"] == "kf-10.jpg"
            and state["title"] == EXPECTED_TITLES[10]
            and state["candleDuration"] != "0.001s",
            state,
        )
        self.check_parallax_contract(page, "motion-preference")
        self.screenshot(page, "desktop-motion-preference-parallax.png")
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
            "img => ({src:img.currentSrc.split('/').slice(-3).join('/'), width:img.naturalWidth, height:img.naturalHeight})"
        )
        body = page.locator("body").inner_text()
        badge = card.locator(".badge .en").inner_text().strip()
        spec = card.locator(".spec").inner_text().strip()
        description = page.locator("meta[name='description']").get_attribute("content") or ""
        badge_facts = " ".join(badge.split()).casefold()
        spec_facts = " ".join(spec.split()).casefold()
        self.check("lobby Edition II poster", state["src"] == "disney2/posters/kf-19.jpg", state)
        self.check(
            "lobby Edition II truth copy",
            "Edition II from 20 real WAN 2.7" in body and "32-shot first edition is retired" in body,
            "20 current / 32 retired",
        )
        self.check(
            "lobby card runtime facts",
            badge_facts == "20 real wan shots"
            and "1 parallax journey" in spec_facts
            and "20 real shots" in spec_facts
            and "master cut 1:40" in spec_facts
            and "Edition II cut from 20 real WAN 2.7" in description,
            {"badge": badge, "spec": spec, "description": description},
        )
        card.scroll_into_view_if_needed()
        self.screenshot(page, "desktop-worlds-lobby.png")
        context.close()

    @staticmethod
    def install_autoplay_block(context: BrowserContext) -> None:
        context.add_init_script(
            """(() => {
              const nativePlay = HTMLMediaElement.prototype.play;
              let unlocked = false;
              addEventListener('pointerdown', () => { unlocked = true; }, {capture:true});
              HTMLMediaElement.prototype.play = function() {
                window.__playAttempts = (window.__playAttempts || 0) + 1;
                if (!unlocked) {
                  window.__blockedPlayAttempts = (window.__blockedPlayAttempts || 0) + 1;
                  return Promise.reject(new DOMException('Autoplay blocked by QA policy', 'NotAllowedError'));
                }
                return nativePlay.call(this);
              };
            })();"""
        )

    def phone_pass(self, browser: Browser) -> None:
        context = browser.new_context(
            viewport={"width": 390, "height": 844}, screen={"width": 390, "height": 844},
            is_mobile=True, has_touch=True, device_scale_factor=1, locale="en-US"
        )
        self.install_autoplay_block(context)
        page = self.open_page(context, self.url)
        page.wait_for_selector("#book.mode-parallax")

        self.set_progress(page, "#top", 0.56)
        self.screenshot(page, "phone-cold-open.png")

        self.set_progress(page, "#book", 0.02)
        page.wait_for_selector("#book.needs-tap", timeout=20_000)
        blocked = page.evaluate("window.__blockedPlayAttempts || 0")
        self.check("phone autoplay-block branch", blocked >= 1, f"blocked attempts={blocked}")
        page.locator("#book .playbtn").click()
        page.wait_for_function("!document.querySelector('#book').classList.contains('needs-tap')")
        self.wait_leg(page, 1)
        page.wait_for_function(
            """() => {
              const v = document.querySelector('#book video.on');
              return v && !v.paused && v.currentTime > 0.03;
            }""",
            timeout=20_000,
        )
        self.check("phone tap starts playback", True, f"play attempts={page.evaluate('window.__playAttempts || 0')}")
        self.check_cover(page, "phone")
        self.screenshot(page, "phone-leg-01.png")

        self.check_parallax_contract(page, "phone")

        self.set_progress(page, "#book", 0.4999)
        self.wait_leg(page, 10, 0.998)
        self.screenshot(page, "phone-boundary-10-before.png")
        phone_before = self.media_screenshot(page, "phone-boundary-10-before-media.png")
        self.set_progress(page, "#book", 0.5001)
        self.wait_leg(page, 11, 0.0)
        self.screenshot(page, "phone-boundary-10-after.png")
        phone_after = self.media_screenshot(page, "phone-boundary-10-after-media.png")
        raw, edge = boundary_metrics(phone_before, phone_after)
        self.check("phone boundary continuity", raw <= 20 and edge <= 50, f"raw={raw:.1f}, edge={edge:.1f}")

        self.set_progress(page, "#book", 0.925)
        self.wait_leg(page, 19, 0.5)
        self.screenshot(page, "phone-leg-19-gate.png")
        self.set_progress(page, "#book", 0.975)
        self.wait_leg(page, 20, 0.5)
        self.screenshot(page, "phone-leg-20.png")
        page.locator("#book video.on").evaluate(
            "v => { v.playbackRate = 8; v.currentTime = Math.max(0, v.duration - 0.40); return v.play(); }"
        )
        page.wait_for_function("document.querySelector('#book video.on')?.ended", timeout=20_000)
        self.check("phone parallax holds final leg", page.locator("#book .chip .id").text_content().strip() == "SHOT 20", page.locator("#book .chip .id").text_content().strip())

        self.find_fin(page, "phone")
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
