#!/usr/bin/env python3
"""Rendered desktop/phone gate for Cake Studio v1.6 cinematic bookends."""

from __future__ import annotations

import argparse
import base64
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from PIL import Image, ImageChops, ImageDraw, ImageFilter
from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError, sync_playwright


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


FORBIDDEN_REQUESTS = (
    "cake-studio-coda",
    ".glb",
    "three.module",
    "gltfloader",
    "ktx2loader",
    ".ktx2",
    "basis_transcoder",
)


def mean_luma(image: Image.Image) -> float:
    histogram = image.histogram()
    count = sum(histogram)
    return sum(index * frequency for index, frequency in enumerate(histogram)) / count


def boundary_metrics(before: Path, after: Path) -> tuple[float, float]:
    first = Image.open(before).convert("L").resize((192, 108))
    second = Image.open(after).convert("L").resize((192, 108))
    raw = mean_luma(ImageChops.difference(first, second))
    edge = mean_luma(
        ImageChops.difference(
            first.filter(ImageFilter.FIND_EDGES),
            second.filter(ImageFilter.FIND_EDGES),
        )
    )
    return raw, edge


class Verification:
    def __init__(self, url: str, output: Path, sabotage: bool) -> None:
        self.url = url
        self.output = output
        self.sabotage = sabotage
        self.checks: list[dict[str, object]] = []
        self.failures: list[str] = []
        self.console_errors: list[str] = []
        self.page_errors: list[str] = []
        self.request_failures: list[str] = []
        self.http_errors: list[str] = []
        self.request_urls: set[str] = set()
        self.screenshots: list[Path] = []
        self.local = urlsplit(url).hostname in {"127.0.0.1", "localhost"}
        self.output.mkdir(parents=True, exist_ok=True)

    def check(self, name: str, passed: bool, detail: object) -> None:
        detail_text = str(detail)
        self.checks.append({"name": name, "pass": bool(passed), "detail": detail_text})
        print(f"{'PASS' if passed else 'FAIL'} {name}: {detail_text}")
        if not passed:
            self.failures.append(f"{name}: {detail_text}")

    def instrument(self, context: BrowserContext) -> None:
        context.add_init_script(
            """(() => {
              window.__cakePlayAttempts = 0;
              const original = HTMLMediaElement.prototype.play;
              HTMLMediaElement.prototype.play = function(...args) {
                window.__cakePlayAttempts += 1;
                return original.apply(this, args);
              };
            })()"""
        )

    def observe(self, page: Page) -> None:
        def console(message: object) -> None:
            if message.type != "error":
                return
            if self.local and any(marker in message.text for marker in ("ERR_INVALID_HTTP_RESPONSE", "ERR_CONTENT_LENGTH_MISMATCH")):
                return
            self.console_errors.append(message.text)

        page.on("console", console)
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))
        page.on("request", lambda request: self.request_urls.add(request.url))

        def failed(request: object) -> None:
            failure = request.failure or "unknown"
            url = request.url
            expected_media_cancel = any(
                marker in failure
                for marker in ("ERR_ABORTED", "ERR_INVALID_HTTP_RESPONSE", "ERR_CONTENT_LENGTH_MISMATCH")
            ) and (url.endswith(".mp4") or url.startswith("blob:"))
            if expected_media_cancel and (self.local or "ERR_ABORTED" in failure):
                return
            self.request_failures.append(f"{failure} {url}")

        page.on("requestfailed", failed)
        page.on(
            "response",
            lambda response: self.http_errors.append(f"{response.status} {response.url}")
            if response.status >= 400
            else None,
        )

    def open_page(self, context: BrowserContext) -> Page:
        page = context.new_page()
        self.observe(page)
        page.goto(self.url, wait_until="domcontentloaded", timeout=45_000)
        page.wait_for_timeout(700)
        if self.sabotage:
            page.add_style_tag(
                content="""
                  .bookend-intro .plate { display:none !important; }
                  .film-frame { transform:translateX(96px) !important; }
                """
            )
            page.evaluate("document.querySelector('.bookend-links')?.remove()")
        return page

    def screenshot(self, page: Page, name: str) -> Path:
        path = self.output / name
        page.screenshot(path=str(path), full_page=False)
        self.screenshots.append(path)
        return path

    @staticmethod
    def set_progress(page: Page, selector: str, progress: float) -> None:
        page.evaluate(
            """({selector, progress}) => {
              const scene = document.querySelector(selector);
              if (!scene) return false;
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const prior = document.documentElement.style.scrollBehavior;
              document.documentElement.style.scrollBehavior = 'auto';
              scrollTo({top: top + span * progress, behavior: 'auto'});
              document.documentElement.style.scrollBehavior = prior;
              dispatchEvent(new Event('scroll'));
              return true;
            }""",
            {"selector": selector, "progress": progress},
        )

    def structure_pass(self, page: Page, label: str) -> bool:
        state = page.evaluate(
            """() => ({
              bodyVersion: document.body.dataset.version || '',
              directorVersion: window.__cakeStudioDirector?.version || '',
              bookends: [...document.querySelectorAll('[data-bookend]')].map(el => el.dataset.bookend),
              shots: document.querySelectorAll('#cake-reel [data-clip]').length,
              buffers: document.querySelectorAll('#cake-reel .film-frame video').length,
              legacy: document.querySelectorAll('.dimensional-coda,[data-object-coda],[data-proof-portal],[data-cake-canvas]').length,
              codaRuntime: Boolean(window.__cakeStudioCoda),
              introWords: (document.querySelector('[data-bookend="intro"] h1 .L.en')?.innerText || '').trim().split(/\\s+/).filter(Boolean).length,
              ctaCount: [...document.querySelectorAll('.bookend-links a')].filter(a => a.getBoundingClientRect().width > 0).length,
              overflow: document.documentElement.scrollWidth - innerWidth,
            })"""
        )
        self.check(f"{label} v1.6 release", state["bodyVersion"] == "1.6.0" and state["directorVersion"] == "1.6.0", state)
        self.check(f"{label} intro/outro order", state["bookends"] == ["intro", "outro"], state["bookends"])
        self.check(f"{label} core reel preserved", state["shots"] == 50 and state["buffers"] == 2, f"shots={state['shots']} buffers={state['buffers']}")
        self.check(f"{label} legacy coda absent", state["legacy"] == 0 and not state["codaRuntime"], f"nodes={state['legacy']} runtime={state['codaRuntime']}")
        self.check(f"{label} intro copy is concise", 1 <= state["introWords"] <= 6, f"words={state['introWords']}")
        self.check(f"{label} closing links visible", state["ctaCount"] == 2, f"visible={state['ctaCount']}")
        self.check(f"{label} no horizontal overflow", state["overflow"] <= 1, f"overflow={state['overflow']}px")
        return state["bookends"] == ["intro", "outro"]

    def transport_pass(self, context: BrowserContext, label: str) -> None:
        paths = (
            "cake-studio/bookends/cake-studio-intro.mp4",
            "cake-studio/bookends/cake-studio-outro.mp4",
            "cake-studio/clips/CST-001.mp4",
            "cake-studio/clips/CST-050.mp4",
        )
        for relative in paths:
            response = context.request.get(
                urljoin(self.url, relative),
                headers={"Range": "bytes=0-1023"},
                timeout=30_000,
            )
            content_range = response.headers.get("content-range", "")
            content_type = response.headers.get("content-type", "")
            accept_ranges = response.headers.get("accept-ranges", "")
            passed = (
                response.status == 206
                and content_range.startswith("bytes 0-1023/")
                and content_type.startswith("video/mp4")
                and accept_ranges.lower() == "bytes"
            )
            self.check(f"{label} range {relative.rsplit('/', 1)[-1]}", passed, f"{response.status} {content_range} {content_type} ranges={accept_ranges}")
            response.dispose()

    def plate_pass(self, page: Page, selector: str, progress: float, label: str, shot_name: str) -> dict[str, object] | None:
        if page.locator(selector).count() != 1:
            self.check(f"{label} {shot_name} scene exists", False, "missing")
            return None
        self.set_progress(page, selector, progress)
        try:
            page.wait_for_function(
                """({selector, target}) => {
                  const scene = document.querySelector(selector);
                  const video = scene?.querySelector('.plate video');
                  const p = parseFloat(scene?.style.getPropertyValue('--p') || '-1');
                  if (!video || !Number.isFinite(video.duration) || video.readyState < 2 || video.seeking) return false;
                  const time = Math.min(video.duration - .04, Math.max(0, target * video.duration));
                  const painted = parseFloat(scene.dataset.plateTime || '-1');
                  return Math.abs(p - target) < .015
                    && Math.abs(video.currentTime - time) < .20
                    && Math.abs(painted - time) < .20;
                }""",
                arg={"selector": selector, "target": progress},
                timeout=25_000,
            )
        except TimeoutError:
            detail = page.locator(selector).evaluate(
                """scene => {
                  const video = scene.querySelector('.plate video');
                  return {
                    p: scene.style.getPropertyValue('--p'),
                    plateTime: scene.dataset.plateTime || '',
                    classes: scene.className,
                    currentTime: video?.currentTime,
                    duration: video?.duration,
                    readyState: video?.readyState,
                    seeking: video?.seeking,
                    src: video?.currentSrc,
                    error: video?.error?.message || '',
                  };
                }"""
            )
            self.check(f"{label} {shot_name} seek settles", False, detail)
            return None
        page.wait_for_timeout(350)
        info = page.locator(selector).evaluate(
            """scene => {
              const stage = scene.querySelector('.stage');
              const plate = scene.querySelector('.plate');
              const video = plate.querySelector('video');
              const surface = plate.querySelector('.plate-frame') || video;
              const sr = stage.getBoundingClientRect();
              const pr = plate.getBoundingClientRect();
              const vr = surface.getBoundingClientRect();
              const style = getComputedStyle(surface);
              return {
                progress: parseFloat(scene.style.getPropertyValue('--p')),
                time: video.currentTime, duration: video.duration,
                width: video.videoWidth, height: video.videoHeight,
                paused: video.paused, opacity: parseFloat(style.opacity),
                objectFit: style.objectFit, filter: style.filter,
                canvas: surface.matches('.plate-frame') ? {width: surface.width, height: surface.height} : null,
                stage: {top: sr.top, left: sr.left, width: sr.width, height: sr.height},
                plate: {top: pr.top, left: pr.left, width: pr.width, height: pr.height},
                videoRect: {top: vr.top, left: vr.left, width: vr.width, height: vr.height},
                viewport: {width: innerWidth, height: innerHeight},
              };
            }"""
        )
        viewport = info["viewport"]
        stage = info["stage"]
        plate = info["plate"]
        coverage = (
            abs(stage["top"]) <= 1
            and abs(stage["left"]) <= 1
            and abs(stage["width"] - viewport["width"]) <= 1
            and abs(stage["height"] - viewport["height"]) <= 1
            and abs(plate["width"] - viewport["width"]) <= 1
            and abs(plate["height"] - viewport["height"]) <= 1
        )
        self.check(f"{label} {shot_name} metadata", info["width"] == 1280 and info["height"] == 720 and abs(info["duration"] - 6) <= .08, f"{info['width']}x{info['height']} {info['duration']:.3f}s")
        self.check(f"{label} {shot_name} scrubbed and paused", info["paused"] and abs(info["time"] - min(5.96, progress * 6)) <= .20, f"p={info['progress']:.3f} t={info['time']:.3f} paused={info['paused']}")
        painted = info["canvas"] == {"width": 1280, "height": 720}
        self.check(f"{label} {shot_name} film-grade presentation", painted and info["objectFit"] == "cover" and info["filter"] == "none" and info["opacity"] >= .99, f"canvas={info['canvas']} fit={info['objectFit']} filter={info['filter']} opacity={info['opacity']}")
        self.check(f"{label} {shot_name} covers viewport", coverage, f"stage={stage} plate={plate} viewport={viewport}")
        return info

    def core_shot(self, page: Page, shot: int, fraction: float, label: str) -> dict[str, object] | None:
        progress = page.evaluate("([shot, fraction]) => window.__cakeStudioDirector.progressForShot(shot, fraction)", [shot, fraction])
        self.set_progress(page, "#cake-reel", progress)
        try:
            page.wait_for_function(
                """({shot, fraction}) => {
                  const scene = document.querySelector('#cake-reel');
                  const video = scene?.querySelector('.film-frame video.on');
                  if (scene?.dataset.currentShot !== String(shot) || !video || video.readyState < 2 || video.seeking) return false;
                  const target = Math.min(video.duration - .04, fraction * video.duration);
                  return Math.abs(video.currentTime - target) < .7 && scene.dataset.cameraState === 'idle';
                }""",
                arg={"shot": shot, "fraction": fraction},
                timeout=35_000,
            )
        except TimeoutError:
            self.check(f"{label} core shot {shot:02d} settles", False, "timeout")
            return None
        info = page.locator("#cake-reel").evaluate(
            """scene => {
              const videos = [...scene.querySelectorAll('.film-frame video')];
              const active = videos.find(video => video.classList.contains('on'));
              return {
                shot: Number(scene.dataset.currentShot), clip: active?.dataset.clip || '',
                active: videos.filter(video => video.classList.contains('on')).length,
                paused: active?.paused, time: active?.currentTime, duration: active?.duration,
                fit: active ? getComputedStyle(active).objectFit : '',
                frame: (() => { const r = scene.querySelector('.film-frame').getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width}; })(),
                viewportWidth: innerWidth,
              };
            }"""
        )
        target = min(info["duration"] - .04, fraction * info["duration"])
        passed = (
            info["shot"] == shot
            and info["clip"].endswith(f"CST-{shot:03d}.mp4")
            and info["active"] == 1
            and info["paused"]
            and abs(info["time"] - target) <= .7
            and info["fit"] == "contain"
            and info["frame"]["left"] >= -1
            and info["frame"]["right"] <= info["viewportWidth"] + 1
        )
        self.check(f"{label} core shot {shot:02d}", passed, info)
        return info

    def video_frame(self, page: Page, selector: str, filename: str) -> Path:
        data_url = page.locator(selector).evaluate(
            """video => {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth; canvas.height = video.videoHeight;
              canvas.getContext('2d').drawImage(video, 0, 0);
              return canvas.toDataURL('image/png');
            }"""
        )
        path = self.output / filename
        path.write_bytes(base64.b64decode(data_url.split(",", 1)[1]))
        return path

    def canvas_frame(self, page: Page, selector: str, filename: str) -> Path:
        data_url = page.locator(selector).evaluate("canvas => canvas.toDataURL('image/png')")
        path = self.output / filename
        path.write_bytes(base64.b64decode(data_url.split(",", 1)[1]))
        return path

    def seam_pass(self, page: Page, label: str) -> None:
        self.plate_pass(page, '[data-bookend="intro"]', .993, label, "intro endpoint")
        intro = self.video_frame(page, '[data-bookend="intro"] .plate video', f"{label}-intro-endpoint.png")
        self.core_shot(page, 1, .001, label)
        first = self.video_frame(page, '#cake-reel .film-frame video.on', f"{label}-frame-001-start.png")
        raw, edge = boundary_metrics(intro, first)
        self.check(f"{label} intro-to-frame-1 continuity", raw <= 6 and edge <= 16, f"raw={raw:.2f} edge={edge:.2f}")

        self.core_shot(page, 50, .999, label)
        last = self.video_frame(page, '#cake-reel .film-frame video.on', f"{label}-frame-050-end.png")
        self.plate_pass(page, '[data-bookend="outro"]', .001, label, "outro endpoint")
        outro = self.video_frame(page, '[data-bookend="outro"] .plate video', f"{label}-outro-endpoint.png")
        raw, edge = boundary_metrics(last, outro)
        self.check(f"{label} frame-50-to-outro continuity", raw <= 6 and edge <= 16, f"raw={raw:.2f} edge={edge:.2f}")

    def cta_pass(self, page: Page, label: str) -> None:
        if page.locator(".bookend-links").count() != 1:
            self.check(f"{label} closing CTA hit areas", False, "CTA container missing")
            return
        sizes = page.locator(".bookend-links a").evaluate_all(
            "els => els.map(el => { const r = el.getBoundingClientRect(); return {w:r.width,h:r.height}; }).filter(r => r.w > 0)"
        )
        self.check(f"{label} closing CTA hit areas", len(sizes) == 2 and all(size["h"] >= 44 and size["w"] >= 44 for size in sizes), sizes)

    def language_pass(self, page: Page, label: str) -> None:
        page.locator("[data-lang-toggle]").click()
        page.wait_for_function("document.documentElement.lang === 'ar' && document.documentElement.dir === 'rtl'")
        self.set_progress(page, '[data-bookend="outro"]', .72)
        page.wait_for_timeout(250)
        state = page.evaluate(
            """() => ({
              ar: getComputedStyle(document.querySelector('[data-bookend="outro"] h2 .L.ar')).display,
              en: getComputedStyle(document.querySelector('[data-bookend="outro"] h2 .L.en')).display,
              overflow: document.documentElement.scrollWidth - innerWidth,
            })"""
        )
        self.check(f"{label} Arabic bookend", state["ar"] != "none" and state["en"] == "none" and state["overflow"] <= 1, state)
        self.screenshot(page, f"{label}-outro-arabic.png")

    def visual_pass(self, page: Page, label: str, include_seams: bool) -> None:
        if not self.structure_pass(page, label):
            return
        self.plate_pass(page, '[data-bookend="intro"]', .15, label, "intro")
        self.screenshot(page, f"{label}-intro.png")
        self.core_shot(page, 1, .50, label)
        self.screenshot(page, f"{label}-film-001.png")
        self.core_shot(page, 17, .50, label)
        self.core_shot(page, 50, .50, label)
        self.screenshot(page, f"{label}-film-050.png")
        self.plate_pass(page, '[data-bookend="outro"]', .15, label, "outro opening")
        self.screenshot(page, f"{label}-outro-opening.png")
        hero = self.plate_pass(page, '[data-bookend="outro"]', .72, label, "outro hero")
        self.cta_pass(page, label)
        if hero:
            hero_media = self.video_frame(page, '[data-bookend="outro"] .plate video', f"{label}-outro-hero-media.png")
            hero_surface = self.canvas_frame(page, '[data-bookend="outro"] .plate-frame', f"{label}-outro-hero-surface.png")
            raw, edge = boundary_metrics(hero_media, hero_surface)
            self.check(f"{label} outro canvas paints decoded hero", raw <= 2 and edge <= 5, f"raw={raw:.2f} edge={edge:.2f}")
            self.screenshot(page, f"{label}-outro-hero.png")
        self.plate_pass(page, '[data-bookend="outro"]', .18, label, "outro reverse")
        if include_seams:
            self.seam_pass(page, label)
        self.language_pass(page, label)
        self.check(f"{label} zero play attempts", page.evaluate("window.__cakePlayAttempts") == 0, page.evaluate("window.__cakePlayAttempts"))

    def contact_sheet(self) -> None:
        if not self.screenshots:
            return
        thumbs: list[tuple[Path, Image.Image]] = []
        for path in self.screenshots:
            image = Image.open(path).convert("RGB")
            image.thumbnail((440, 300))
            thumbs.append((path, image.copy()))
        cols = 3
        rows = (len(thumbs) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * 460, rows * 340), "#07110f")
        draw = ImageDraw.Draw(sheet)
        for index, (path, image) in enumerate(thumbs):
            x = (index % cols) * 460 + 10
            y = (index // cols) * 340 + 26
            sheet.paste(image, (x, y))
            draw.text((x, 7 + (index // cols) * 340), path.stem, fill="#f0dfc7")
        sheet.save(self.output / "contact-sheet.jpg", quality=90)

    def run(self, browser: Browser) -> int:
        desktop = browser.new_context(viewport={"width": 1440, "height": 1000}, locale="en-US")
        self.instrument(desktop)
        desktop_page = self.open_page(desktop)
        self.transport_pass(desktop, "desktop")
        self.visual_pass(desktop_page, "desktop", include_seams=True)
        desktop.close()

        phone = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=1,
            locale="en-US",
            reduced_motion="reduce",
            is_mobile=True,
            has_touch=True,
        )
        self.instrument(phone)
        phone_page = self.open_page(phone)
        self.visual_pass(phone_page, "phone-reduced", include_seams=False)
        phone.close()

        forbidden = sorted(
            url for url in self.request_urls if any(marker in url.lower() for marker in FORBIDDEN_REQUESTS)
        )
        self.check("no legacy 3D requests", not forbidden, forbidden[:8])
        self.check("no page errors", not self.page_errors, self.page_errors[:6])
        self.check("no console errors", not self.console_errors, self.console_errors[:6])
        self.check("no HTTP errors", not self.http_errors, self.http_errors[:6])
        self.check("no genuine request failures", not self.request_failures, self.request_failures[:6])
        self.contact_sheet()

        report = {
            "schema": "cake-studio-bookends-browser/v1",
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "url": self.url,
            "sabotage": self.sabotage,
            "checks": self.checks,
            "failures": self.failures,
        }
        (self.output / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        if self.failures:
            print(f"CAKE_STUDIO_BOOKENDS_BROWSER_FAIL: {len(self.failures)} failing gate(s)", file=sys.stderr)
            return 1
        print(f"CAKE_STUDIO_BOOKENDS_BROWSER_PASS: {len(self.checks)} checks")
        return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--sabotage", action="store_true")
    args = parser.parse_args()
    verification = Verification(args.url, args.output.resolve(), args.sabotage)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        try:
            return verification.run(browser)
        finally:
            browser.close()


if __name__ == "__main__":
    raise SystemExit(main())
