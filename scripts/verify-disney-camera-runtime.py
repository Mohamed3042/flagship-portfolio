#!/usr/bin/env python3
"""Rendered desktop/phone proof for the Disney camera-tracking release."""

from __future__ import annotations

import argparse
import json
import re
import sys
import tempfile
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import BrowserContext, Page, Route, sync_playwright


CAMERA_SPANS = [
    (0, 4, "Act I — the sealed book wakes"),
    (4, 9, "Act II — ink answers"),
    (9, 16, "Act III — the true fibre"),
    (16, 20, "Acts IV–VI — handoff, gate, ember"),
    (20, 30, "Act VII — the second journey"),
    (30, 40, "Act VIII — the torn route"),
    (40, 50, "Act IX — storm and relay"),
    (50, 60, "Act X — the archive descends"),
    (60, 70, "Act XI — the deep supports"),
    (70, 80, "Act XII — the observatory"),
    (80, 90, "Act XIII — the other volumes"),
    (90, 100, "Act XIV — the open horizon"),
]


def with_query(raw_url: str, **updates: str) -> str:
    parts = urlsplit(raw_url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    query.update(updates)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def media_suffix(url: str) -> str:
    return urlsplit(url).path.lower()


def install_observers(page: Page, errors: dict[str, list[str]], ignore_media_console: bool = False) -> None:
    page.on("pageerror", lambda error: errors["page"].append(str(error)))
    def console_message(message) -> None:
        if message.type != "error":
            return
        if ignore_media_console and message.text == "Failed to load resource: net::ERR_FAILED":
            return
        errors["console"].append(message.text)
    page.on("console", console_message)
    def request_failed(request) -> None:
        path = media_suffix(request.url)
        failure = str(request.failure)
        if path.endswith(".mp4"):
            return
        if "ERR_ABORTED" in failure and path.endswith((".jpg", ".webp", ".png")):
            return
        errors["request"].append(f"{request.url} :: {request.failure}")
    page.on(
        "requestfailed",
        request_failed,
    )
    page.on(
        "response",
        lambda response: errors["http"].append(f"{response.status} {response.url}")
        if response.status >= 400 else None,
    )


def install_media_route(page: Page, media_fallback: str | None, abort_video: bool) -> None:
    fallback = media_fallback.rstrip("/") + "/" if media_fallback else None

    def handler(route: Route) -> None:
        request_url = route.request.url
        path = media_suffix(request_url)
        if abort_video and path.endswith(".mp4"):
            route.abort()
            return
        marker = "/worlds/disney2/"
        original_path = urlsplit(request_url).path
        if fallback and marker in original_path:
            relative = original_path.split(marker, 1)[1]
            response = route.fetch(url=fallback + relative)
            route.fulfill(response=response)
            return
        route.continue_()

    page.route("**/*", handler)


def assert_no_errors(errors: dict[str, list[str]], label: str) -> None:
    findings = [f"{kind}: {item}" for kind, items in errors.items() for item in items]
    if findings:
        raise AssertionError(f"{label} browser failures: " + " | ".join(findings[:12]))


def sweep_profile(context: BrowserContext, url: str, label: str, media_fallback: str | None, duration_ms: int) -> dict:
    page = context.new_page()
    errors = {"page": [], "console": [], "request": [], "http": []}
    install_observers(page, errors, ignore_media_console=True)
    install_media_route(page, media_fallback, abort_video=True)
    page.goto(url, wait_until="domcontentloaded", timeout=60_000)
    page.wait_for_selector("#book", timeout=20_000)
    page.wait_for_function("document.querySelectorAll('#book .legcap').length === 100")

    def drive(direction: str) -> dict:
        return page.evaluate(
            r"""async ({ direction, durationMs }) => {
              const book = document.getElementById('book');
              const floor = book.querySelector('.floor');
              document.documentElement.style.scrollBehavior = 'auto';
              const startY = book.offsetTop;
              const endY = startY + book.offsetHeight - innerHeight;
              const from = direction === 'forward' ? startY : endY;
              const to = direction === 'forward' ? endY : startY;
              window.scrollTo(0, from);
              await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
              const visited = [];
              const seen = new Set();
              const samples = [];
              const began = performance.now();
              await new Promise(resolve => {
                const step = now => {
                  const t = Math.min(1, (now - began) / durationMs);
                  window.scrollTo(0, from + (to - from) * t);
                  const journey = Number.parseFloat(book.style.getPropertyValue('--journey') || '0');
                  const raw = Number.parseFloat(book.style.getPropertyValue('--p') || '0');
                  const pan = Number.parseFloat(book.style.getPropertyValue('--pan') || '0');
                  const match = floor.src.match(/kf-(\d+)\.jpg/i);
                  const leg = match ? Number.parseInt(match[1], 10) : 0;
                  if (leg && !seen.has(leg)) { seen.add(leg); visited.push(leg); }
                  if (!samples.length || now - samples[samples.length - 1].wall >= 80 || t === 1) {
                    samples.push({ wall: now, t, raw, journey, pan, leg });
                  }
                  if (t < 1) requestAnimationFrame(step); else resolve();
                };
                requestAnimationFrame(step);
              });
              await new Promise(resolve => setTimeout(resolve, 1000));
              const journey = Number.parseFloat(book.style.getPropertyValue('--journey') || '0');
              const pan = Number.parseFloat(book.style.getPropertyValue('--pan') || '0');
              const settledMatch = floor.src.match(/kf-(\d+)\.jpg/i);
              const settledLeg = settledMatch ? Number.parseInt(settledMatch[1], 10) : 0;
              if (settledLeg && !seen.has(settledLeg)) { seen.add(settledLeg); visited.push(settledLeg); }
              const overflow = Math.max(0, document.documentElement.scrollWidth - innerWidth);
              return {
                direction, visited, samples, journey, pan, overflow, settledLeg,
                cameraState: book.dataset.cameraState,
                cameraTrack: book.dataset.cameraTrack,
                playCalls: window.__cameraPlayCalls || 0,
              };
            }""",
            {"direction": direction, "durationMs": duration_ms},
        )

    forward = drive("forward")
    reverse = drive("reverse")
    expected_forward = list(range(1, 101))
    expected_reverse = list(range(100, 0, -1))
    if forward["visited"] != expected_forward:
        raise AssertionError(f"{label} forward visited {len(forward['visited'])}/100: {forward['visited']}")
    if reverse["visited"] != expected_reverse:
        raise AssertionError(f"{label} reverse visited {len(reverse['visited'])}/100: {reverse['visited']}")
    if forward["overflow"] > 1 or reverse["overflow"] > 1:
        raise AssertionError(f"{label} horizontal overflow: {forward['overflow']} / {reverse['overflow']}")
    if forward["playCalls"] or reverse["playCalls"]:
        raise AssertionError(f"{label} called play(): {forward['playCalls']} / {reverse['playCalls']}")
    if forward["cameraTrack"] != "story-blocks-v1" or reverse["cameraTrack"] != "story-blocks-v1":
        raise AssertionError(f"{label} wrong camera track marker")
    assert_no_errors(errors, label)
    page.close()
    return {"label": label, "forward": forward, "reverse": reverse, "errors": errors}


def wait_for_frame(page: Page, scene_number: int, local_progress: float) -> dict:
    global_progress = ((scene_number - 1) + local_progress) / 100
    page.evaluate(
        """p => {
          const book = document.getElementById('book');
          book.style.setProperty('--p', p.toFixed(8));
          window.dispatchEvent(new Event('scroll'));
        }""",
        global_progress,
    )
    page.wait_for_function(
        r"""({ sceneNumber }) => {
          const floor = document.querySelector('#book .floor');
          const match = floor.src.match(/kf-(\d+)\.jpg/i);
          return match && Number.parseInt(match[1], 10) === sceneNumber && floor.complete && floor.naturalWidth > 0;
        }""",
        arg={"sceneNumber": scene_number},
        timeout=25_000,
    )
    page.wait_for_function(
        """({ sceneNumber, localProgress }) => {
          const videos = [...document.querySelectorAll('#book video')];
          const active = videos.find(video => video.classList.contains('on'));
          if (!active || active.readyState < 2 || !active.dataset.clip.endsWith(`DSN2-${String(sceneNumber).padStart(3, '0')}.mp4`)) return false;
          const expected = Math.min(active.duration - .04, localProgress * active.duration);
          return Number.isFinite(expected) && Math.abs(active.currentTime - expected) < .35;
        }""",
        arg={"sceneNumber": scene_number, "localProgress": local_progress},
        timeout=30_000,
    )
    page.wait_for_timeout(140)
    return page.evaluate(
        """sceneNumber => {
          const book = document.getElementById('book');
          const active = [...book.querySelectorAll('video')].find(video => video.classList.contains('on'));
          const cue = document.querySelector('#cue-title .L.en')?.textContent.trim() || '';
          return {
            scene: sceneNumber,
            cue,
            pan: Number.parseFloat(book.style.getPropertyValue('--pan')),
            journey: Number.parseFloat(book.style.getPropertyValue('--journey')),
            cameraTrack: book.dataset.cameraTrack,
            videoReadyState: active ? active.readyState : -1,
            videoTime: active ? active.currentTime : -1,
            videoDuration: active ? active.duration : -1,
            clip: active ? active.dataset.clip : '',
            videoWidth: active ? active.videoWidth : 0,
            videoHeight: active ? active.videoHeight : 0,
            overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
            playCalls: window.__cameraPlayCalls || 0,
          };
        }""",
        scene_number,
    )


def label_image(path: Path, label: str) -> None:
    with Image.open(path) as source:
        image = source.convert("RGB")
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()
    box_height = 30
    draw.rectangle((0, 0, image.width, box_height), fill=(8, 6, 4))
    draw.text((10, 9), label, fill=(232, 220, 192), font=font)
    image.save(path, quality=88, optimize=True)


def contact_sheet(paths: list[Path], destination: Path, columns: int = 3) -> None:
    thumbs = []
    for path in paths:
        with Image.open(path) as source:
            image = source.convert("RGB")
        image.thumbnail((480, 300), Image.Resampling.LANCZOS)
        thumbs.append(image)
    cell_w = max(image.width for image in thumbs)
    cell_h = max(image.height for image in thumbs)
    rows = (len(thumbs) + columns - 1) // columns
    sheet = Image.new("RGB", (cell_w * columns, cell_h * rows), (8, 6, 4))
    for index, image in enumerate(thumbs):
        x = (index % columns) * cell_w + (cell_w - image.width) // 2
        y = (index // columns) * cell_h + (cell_h - image.height) // 2
        sheet.paste(image, (x, y))
    sheet.save(destination, quality=88, optimize=True)


def capture_peaks(context: BrowserContext, url: str, out: Path, media_fallback: str | None) -> list[dict]:
    peaks_dir = out / "fixed-section-peaks"
    peaks_dir.mkdir(parents=True, exist_ok=True)
    page = context.new_page()
    errors = {"page": [], "console": [], "request": [], "http": []}
    install_observers(page, errors)
    install_media_route(page, media_fallback, abort_video=False)
    page.goto(with_query(url, solo="2", p="0"), wait_until="domcontentloaded", timeout=60_000)
    page.wait_for_selector("#book")
    records = []
    paths = []
    for index, (start, end, reason) in enumerate(CAMERA_SPANS, start=1):
        scene_zero = (start + end - 1) // 2
        scene_number = scene_zero + 1
        record = wait_for_frame(page, scene_number, 0.5)
        record.update({"span": index, "spanStart": start + 1, "spanEnd": end, "reason": reason})
        if record["cameraTrack"] != "story-blocks-v1" or record["videoReadyState"] < 2 or record["overflow"] > 1 or record["playCalls"]:
            raise AssertionError(f"peak {index} failed: {record}")
        path = peaks_dir / f"span-{index:02d}-scene-{scene_number:03d}.jpg"
        page.screenshot(path=str(path), type="jpeg", quality=82)
        label_image(path, f"SPAN {index:02d} · SCENE {scene_number:03d} · {reason}")
        paths.append(path)
        records.append(record)
    assert_no_errors(errors, "fixed-section peaks")
    contact_sheet(paths, out / "fixed-section-peaks-contact-sheet.jpg")
    page.close()
    return records


def capture_phone_end(context: BrowserContext, url: str, out: Path, media_fallback: str | None) -> dict:
    page = context.new_page()
    errors = {"page": [], "console": [], "request": [], "http": []}
    install_observers(page, errors)
    install_media_route(page, media_fallback, abort_video=False)
    page.goto(with_query(url, solo="2", p="0.9992"), wait_until="domcontentloaded", timeout=60_000)
    page.wait_for_selector("#book")
    record = wait_for_frame(page, 100, 0.92)
    page.screenshot(path=str(out / "phone-film-ending-390x844.png"))
    if record["cue"] != "The Open Circle" or abs(record["pan"] - 0.5) > 0.02 or record["overflow"] > 1 or record["playCalls"]:
        raise AssertionError(f"phone film ending failed: {record}")
    assert_no_errors(errors, "phone film ending")
    page.close()

    page = context.new_page()
    errors = {"page": [], "console": [], "request": [], "http": []}
    install_observers(page, errors, ignore_media_console=True)
    install_media_route(page, media_fallback, abort_video=True)
    page.goto(url, wait_until="domcontentloaded", timeout=60_000)
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    page.wait_for_timeout(700)
    fin = page.locator(".credits .fin")
    fin.scroll_into_view_if_needed()
    page.wait_for_timeout(150)
    page.screenshot(path=str(out / "phone-page-ending-390x844.png"))
    fin_visible = fin.is_visible()
    page_overflow = page.evaluate("Math.max(0, document.documentElement.scrollWidth - innerWidth)")
    page_play_calls = page.evaluate("window.__cameraPlayCalls || 0")
    if not fin_visible or page_overflow > 1 or page_play_calls:
        raise AssertionError(f"phone page ending failed: fin={fin_visible} overflow={page_overflow} play={page_play_calls}")
    assert_no_errors(errors, "phone page ending")
    page.close()
    return {**record, "finVisible": fin_visible, "pageOverflow": page_overflow, "pagePlayCalls": page_play_calls}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--media-fallback")
    parser.add_argument("--sweep-ms", type=int, default=12_000)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    init_script = """
      (() => {
        window.__cameraPlayCalls = 0;
        const original = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function(...args) {
          window.__cameraPlayCalls += 1;
          return original.apply(this, args);
        };
      })();
    """
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        desktop = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        desktop.add_init_script(init_script)
        phone = browser.new_context(
            viewport={"width": 390, "height": 844},
            screen={"width": 390, "height": 844},
            device_scale_factor=1,
            is_mobile=True,
            has_touch=True,
        )
        phone.add_init_script(init_script)
        # The sweep contexts intentionally abort every MP4 request. Keep the
        # decoded-frame proof in fresh contexts so a force-cache lookup cannot
        # inherit an intentionally aborted request from the sweep.
        desktop_media = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        desktop_media.add_init_script(init_script)
        phone_media = browser.new_context(
            viewport={"width": 390, "height": 844},
            screen={"width": 390, "height": 844},
            device_scale_factor=1,
            is_mobile=True,
            has_touch=True,
        )
        phone_media.add_init_script(init_script)
        report = {
            "target": args.url,
            "desktopSweep": sweep_profile(desktop, args.url, "desktop", args.media_fallback, args.sweep_ms),
            "phoneSweep": sweep_profile(phone, args.url, "phone-390x844", args.media_fallback, args.sweep_ms),
            "fixedSectionPeaks": capture_peaks(desktop_media, args.url, args.out, args.media_fallback),
            "phoneEnding": capture_phone_end(phone_media, args.url, args.out, args.media_fallback),
        }
        desktop.close()
        phone.close()
        desktop_media.close()
        phone_media.close()
        browser.close()
    (args.out / "runtime-browser-verification.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(
        "DISNEY_CAMERA_RUNTIME_GREEN "
        f"desktop_forward={len(report['desktopSweep']['forward']['visited'])}/100 "
        f"desktop_reverse={len(report['desktopSweep']['reverse']['visited'])}/100 "
        f"phone_forward={len(report['phoneSweep']['forward']['visited'])}/100 "
        f"phone_reverse={len(report['phoneSweep']['reverse']['visited'])}/100 "
        f"peaks={len(report['fixedSectionPeaks'])}/12 phone_ending=GREEN"
    )
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(f"DISNEY_CAMERA_RUNTIME_RED {error}", file=sys.stderr)
        raise
