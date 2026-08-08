#!/usr/bin/env python3
"""Rendered browser gates for The Kingdom of Running Things, Edition II.

The suite grades the live DOM, decoded media, real scroll positions, mobile
chain controls, reduced-motion mode, and byte-range delivery. It also captures
the exact proof frames named by the production handoff.
"""

from __future__ import annotations

import argparse
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
        payload = {"leg": leg, "fraction": fraction}
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
              let target = null;
              if (arg.fraction !== null) {
                target = Math.min(video.duration - 0.04, Math.max(0, arg.fraction * video.duration));
                if (video.seeking || Math.abs(video.currentTime - target) > 0.24) return false;
              }
              return {
                clip: video.currentSrc.split('/').pop(), poster: floor.currentSrc.split('/').pop(),
                currentTime: video.currentTime, duration: video.duration, target,
                seekable: video.seekable.length, readyState: video.readyState,
                title: document.querySelector('#leg-title .en')?.textContent.trim() || ''
              };
            }""",
            arg=payload,
            timeout=30_000,
        )
        info = handle.json_value()
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
              const stage = scene.querySelector('.stage');
              const floor = scene.querySelector('.floor');
              const video = scene.querySelector('video.on');
              const sr = stage.getBoundingClientRect();
              const fr = floor.getBoundingClientRect();
              const vr = video.getBoundingClientRect();
              const scale = Math.max(sr.width / video.videoWidth, sr.height / video.videoHeight);
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
            and abs(sw - fw) <= 1
            and abs(sh - fh) <= 1
            and abs(sw - vw) <= 1
            and abs(sh - vh) <= 1
            and scaled_w + 0.5 >= sw
            and scaled_h + 0.5 >= sh
            and values["opacity"] >= 0.99
        )
        self.check(
            f"{label} no letterbox",
            no_gap,
            f"stage={sw:.0f}x{sh:.0f} media={values['natural']} fit=cover",
        )

    def screenshot(self, page: Page, name: str) -> Path:
        path = self.output_dir / name
        page.screenshot(path=str(path), full_page=False)
        self.check(f"screenshot {name}", path.exists() and path.stat().st_size > 10_000, path.stat().st_size)
        return path

    def media_screenshot(self, page: Page, name: str) -> Path:
        path = self.output_dir / name
        page.locator("#book video.on").screenshot(path=str(path))
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
        page.wait_for_selector("#book.mode-scrub")
        self.transport_and_master(context, page)

        runway = page.locator("#book").evaluate("el => ({height:el.offsetHeight, vh:innerHeight})")
        ratio = runway["height"] / runway["vh"]
        self.check("desktop scrub mode", "mode-scrub" in page.locator("#book").get_attribute("class"), page.locator("#book").get_attribute("class"))
        self.check("rendered film runway", ratio + 0.01 >= self.minimum_runway_vh, f"{ratio:.2f}vh")

        self.set_progress(page, "#top", 0.56)
        self.screenshot(page, "desktop-cold-open.png")

        self.set_progress(page, "#book", 0.025)
        self.wait_leg(page, 1, 0.5)
        self.check_cover(page, "desktop")
        self.screenshot(page, "desktop-leg-01.png")

        self.set_progress(page, "#book", 0.475)
        self.wait_leg(page, 10, 0.5)
        self.screenshot(page, "desktop-leg-10.png")

        self.set_progress(page, "#book", 0.4999)
        self.wait_leg(page, 10, 0.998)
        self.screenshot(page, "desktop-boundary-10-before.png")
        before = self.media_screenshot(page, "desktop-boundary-10-before-media.png")
        self.set_progress(page, "#book", 0.5001)
        self.wait_leg(page, 11, 0.002)
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
        self.check("reverse scrub to leg 05", reverse_y < forward_y, f"scrollY {forward_y:.0f} -> {reverse_y:.0f}")

        self.find_fin(page, "desktop")
        page.close()

        solo = self.open_page(context, with_query(self.url, solo=2, p=0.5))
        solo.wait_for_selector("#book.mode-scrub")
        self.wait_leg(solo, 11, 0.0)
        visible_scenes = solo.locator("[data-scene]").evaluate_all(
            "els => els.filter(el => getComputedStyle(el).display !== 'none').length"
        )
        solo_height = solo.locator("#book").evaluate("el => el.offsetHeight / innerHeight")
        self.check("solo harness isolates film", visible_scenes == 1 and abs(solo_height - 1) < 0.01, f"scenes={visible_scenes}, height={solo_height:.2f}vh")
        self.screenshot(solo, "desktop-solo-p050.png")
        solo.close()
        context.close()

    def reduced_motion_pass(self, browser: Browser) -> None:
        context = browser.new_context(
            viewport={"width": 1440, "height": 900}, reduced_motion="reduce", locale="en-US"
        )
        page = self.open_page(context, with_query(self.url, solo=2, p=0.475))
        page.wait_for_selector("#book.mode-still")
        page.wait_for_function("document.querySelector('#book .chip .id')?.textContent.trim() === 'SHOT 10'")
        state = page.locator("#book").evaluate(
            """scene => ({
              videos:[...scene.querySelectorAll('video')].map(v => getComputedStyle(v).display),
              floor:scene.querySelector('.floor').currentSrc.split('/').pop(),
              title:scene.querySelector('#leg-title .en').textContent.trim()
            })"""
        )
        self.check("reduced-motion still mode", state["videos"] == ["none", "none"], state)
        self.check("reduced-motion poster and caption", state["floor"] == "kf-10.jpg" and state["title"] == EXPECTED_TITLES[10], state)
        self.screenshot(page, "desktop-reduced-motion.png")
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
            and "1 scrubbed take" in spec_facts
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

    def advance_chain(self, page: Page, target: int) -> None:
        while True:
            current = int(page.locator("#book .chip .id").text_content().strip().split()[-1])
            if current >= target:
                return
            page.locator("#book video.on").evaluate(
                """v => {
                  v.playbackRate = 8;
                  v.currentTime = Math.max(0, v.duration - 0.40);
                  return v.play();
                }"""
            )
            expected = current + 1
            page.wait_for_function(
                "n => document.querySelector('#book .chip .id')?.textContent.trim() === 'SHOT ' + String(n).padStart(2, '0')",
                arg=expected,
                timeout=20_000,
            )
            self.wait_leg(page, expected)

    def phone_pass(self, browser: Browser) -> None:
        context = browser.new_context(
            viewport={"width": 390, "height": 844}, screen={"width": 390, "height": 844},
            is_mobile=True, has_touch=True, device_scale_factor=1, locale="en-US"
        )
        self.install_autoplay_block(context)
        page = self.open_page(context, self.url)
        page.wait_for_selector("#book.mode-chain")
        self.check("phone chain mode", "mode-chain" in page.locator("#book").get_attribute("class"), page.locator("#book").get_attribute("class"))

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

        self.advance_chain(page, 10)
        page.locator("#book video.on").evaluate(
            "v => { v.pause(); v.currentTime = Math.max(0, v.duration - 0.20); }"
        )
        page.wait_for_function("!document.querySelector('#book video.on').seeking")
        self.screenshot(page, "phone-boundary-10-before.png")
        phone_before = self.media_screenshot(page, "phone-boundary-10-before-media.png")
        page.locator("#book video.on").evaluate("v => { v.playbackRate = 4; return v.play(); }")
        page.wait_for_function("document.querySelector('#book .chip .id')?.textContent.trim() === 'SHOT 11'")
        self.wait_leg(page, 11)
        self.screenshot(page, "phone-boundary-10-after.png")
        phone_after = self.media_screenshot(page, "phone-boundary-10-after-media.png")
        raw, edge = boundary_metrics(phone_before, phone_after)
        self.check("phone boundary continuity", raw <= 20 and edge <= 50, f"raw={raw:.1f}, edge={edge:.1f}")

        self.advance_chain(page, 19)
        self.screenshot(page, "phone-leg-19-gate.png")
        self.advance_chain(page, 20)
        self.screenshot(page, "phone-leg-20.png")
        page.locator("#book video.on").evaluate(
            "v => { v.playbackRate = 8; v.currentTime = Math.max(0, v.duration - 0.40); return v.play(); }"
        )
        page.wait_for_function("document.querySelector('#book video.on')?.ended", timeout=20_000)
        self.check("phone chain holds final leg", page.locator("#book .chip .id").text_content().strip() == "SHOT 20", page.locator("#book .chip .id").text_content().strip())

        self.find_fin(page, "phone")
        context.close()

    def run(self, browser: Browser) -> int:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.desktop_pass(browser)
        self.reduced_motion_pass(browser)
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
