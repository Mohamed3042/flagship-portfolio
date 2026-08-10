"""Focused rendered gate for Cake Studio's real-model coda and weighted camera."""

from __future__ import annotations

import json
import math
import os
import sys

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError, sync_playwright


URL = os.environ.get("CAKE_STUDIO_URL", "http://127.0.0.1:4617/worlds/cake-studio.html")
failures: list[str] = []


def check(name: str, passed: bool, detail: object) -> None:
    marker = "PASS" if passed else "FAIL"
    print(f"{marker} {name}: {detail}")
    if not passed:
        failures.append(name)


def set_progress(page, progress: float) -> None:
    page.evaluate(
        """progress => {
          const scene = document.querySelector('[data-object-coda]');
          const top = scene.getBoundingClientRect().top + scrollY;
          const span = Math.max(0, scene.offsetHeight - innerHeight);
          scrollTo(0, top + span * progress);
        }""",
        progress,
    )


def settle(page, progress: float) -> None:
    set_progress(page, progress)
    page.wait_for_function(
        """target => {
          const runtime = window.__cakeStudioCoda;
          return runtime && Math.abs(runtime.progress - target) < .0015
            && runtime.cameraState === 'idle';
        }""",
        arg=progress,
        timeout=8_000,
    )


def distance(a: dict[str, float], b: dict[str, float]) -> float:
    return math.sqrt(sum((float(a[key]) - float(b[key])) ** 2 for key in ("x", "y", "z")))


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    console_errors: list[str] = []
    page_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.goto(URL, wait_until="networkidle", timeout=30_000)
    try:
        page.wait_for_function("window.__cakeStudioCoda?.ready === true", timeout=15_000)
    except PlaywrightTimeoutError:
        print(f"CODA_STARTUP_TIMEOUT runtime={page.evaluate('window.__cakeStudioCoda || null')}")
        print(f"CODA_CONSOLE_ERRORS {console_errors[:5]}")
        raise

    set_progress(page, 0.18)
    page.wait_for_function(
        "['ready', 'fallback'].includes(window.__cakeStudioCoda?.modelStatus)",
        timeout=30_000,
    )
    model_state = page.evaluate(
        """() => ({
          status: window.__cakeStudioCoda.modelStatus,
          loaded: window.__cakeStudioCoda.modelsLoaded,
          expected: window.__cakeStudioCoda.modelsExpected,
          source: window.__cakeStudioCoda.modelSource,
          waferSource: window.__cakeStudioCoda.waferSource,
          waferModels: window.__cakeStudioCoda.waferModels,
          wordmarkModels: window.__cakeStudioCoda.wordmarkModels,
          handoffArtifactSource: window.__cakeStudioCoda.handoffArtifactSource,
          handoffArtifactModels: window.__cakeStudioCoda.handoffArtifactModels,
          dataset: document.querySelector('[data-object-coda]').dataset.models,
          triangles: window.__cakeStudioCoda.triangles,
        })"""
    )
    check("24 real models loaded", model_state["status"] == "ready" and model_state["loaded"] == 24 and model_state["expected"] == 24, model_state)
    check("GLB stage active", model_state["source"] == "glb" and model_state["dataset"] == "ready", model_state)
    check(
        "cinematic GLB roles active",
        model_state["waferSource"] == "glb"
        and model_state["waferModels"] == 17
        and model_state["wordmarkModels"] == 3
        and model_state["handoffArtifactSource"] == "glb"
        and model_state["handoffArtifactModels"] == 3,
        model_state,
    )

    settle(page, 0.18)
    samples = page.evaluate(
        """target => new Promise(resolve => {
          const scene = document.querySelector('[data-object-coda]');
          const top = scene.getBoundingClientRect().top + scrollY;
          const span = Math.max(0, scene.offsetHeight - innerHeight);
          const values = [];
          const started = performance.now();
          const read = now => values.push({
            ms: now - started,
            raw: window.__cakeStudioCoda.rawProgress,
            smooth: window.__cakeStudioCoda.progress,
            object: parseFloat(scene.style.getPropertyValue('--object-p') || '-1'),
            state: window.__cakeStudioCoda.cameraState,
          });
          read(started);
          scrollTo(0, top + span * target);
          const frame = now => {
            read(now);
            if (now - started < 700) requestAnimationFrame(frame); else resolve(values);
          };
          requestAnimationFrame(frame);
        })""",
        0.30,
    )
    deltas = [abs(float(current["smooth"]) - float(previous["smooth"])) for previous, current in zip(samples, samples[1:])]
    movement = [delta for delta in deltas if delta >= 0.0001]
    step_size = abs(0.30 - float(samples[0]["smooth"]))
    max_share = max(movement, default=0) / max(step_size, 1e-9)
    post_input_motion = sum(
        abs(float(current["smooth"]) - float(previous["smooth"])) >= 0.0001
        for previous, current in zip(samples, samples[1:])
        if float(current["ms"]) >= 50
    )
    final_error = abs(float(samples[-1]["smooth"]) - float(samples[-1]["raw"]))
    lockstep_error = max(abs(float(sample["smooth"]) - float(sample["object"])) for sample in samples)
    check("weighted step spans frames", len(movement) >= 6 and max_share <= 0.35, {"frames": len(movement), "maxShare": round(max_share, 3)})
    check("camera glides after input", post_input_motion >= 3, {"postInputFrames": post_input_motion})
    check("camera settles accurately", final_error <= 0.002, {"error": round(final_error, 6), "state": samples[-1]["state"]})
    check("one playhead drives objects", lockstep_error <= 0.0001, {"maxError": round(lockstep_error, 7)})

    joins = []
    for boundary in (0.36, 0.69):
        settle(page, boundary - 0.001)
        before = page.evaluate("window.__cakeStudioCoda.cameraPosition")
        settle(page, boundary + 0.001)
        after = page.evaluate("window.__cakeStudioCoda.cameraPosition")
        joins.append({"boundary": boundary, "distance": distance(before, after)})
    check("act joins are continuous", all(join["distance"] <= 0.16 for join in joins), joins)
    wordmark_states = []
    for progress, expected_act in ((0.18, "forms"), (0.52, "assembly"), (0.84, "handoff")):
        settle(page, progress)
        actual_act = page.evaluate("window.__cakeStudioCoda.wordmarkAct")
        wordmark_states.append({"progress": progress, "expected": expected_act, "actual": actual_act})
    check("physical wordmarks follow acts", all(row["actual"] == row["expected"] for row in wordmark_states), wordmark_states)
    check("render has no JavaScript errors", not page_errors, page_errors[:3])
    browser.close()

if failures:
    print(f"CAKE_STUDIO_CODA_FAILED {len(failures)}: {json.dumps(failures)}")
    sys.exit(1)

print("CAKE_STUDIO_CODA_GREEN")
