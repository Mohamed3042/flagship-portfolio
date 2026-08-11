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


def settle_group(page, progress: float, group: str) -> None:
    settle(page, progress)
    page.wait_for_function(
        """group => window.__cakeStudioCoda?.residentModelGroups?.includes(group)""",
        arg=group,
        timeout=30_000,
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
        "window.__cakeStudioCoda?.residentModelGroups?.includes('forms') && window.__cakeStudioCoda?.setStatus === 'ready'",
        timeout=30_000,
    )
    model_state = page.evaluate(
        """() => ({
          status: window.__cakeStudioCoda.modelStatus,
          loaded: window.__cakeStudioCoda.modelsLoaded,
          resident: window.__cakeStudioCoda.modelsResident,
          groups: window.__cakeStudioCoda.residentModelGroups,
          expected: window.__cakeStudioCoda.modelsExpected,
          source: window.__cakeStudioCoda.modelSource,
          setStatus: window.__cakeStudioCoda.setStatus,
          setSource: window.__cakeStudioCoda.setSource,
          cameraSource: window.__cakeStudioCoda.cameraSource,
          waferSource: window.__cakeStudioCoda.waferSource,
          waferModels: window.__cakeStudioCoda.waferModels,
          wordmarkModels: window.__cakeStudioCoda.wordmarkModels,
          handoffArtifactSource: window.__cakeStudioCoda.handoffArtifactSource,
          handoffArtifactModels: window.__cakeStudioCoda.handoffArtifactModels,
          dataset: document.querySelector('[data-object-coda]').dataset.models,
          triangles: window.__cakeStudioCoda.triangles,
        })"""
    )
    check("forms group staged", model_state["status"] == "ready" and model_state["resident"] == 10 and model_state["groups"] == ["forms"] and model_state["expected"] == 24, model_state)
    check("GLB stage active", model_state["source"] == "staged-glb" and model_state["dataset"] == "ready", model_state)
    check(
        "authored set and camera active",
        model_state["setStatus"] == "ready"
        and model_state["setSource"] == "cake-studio-proof-room.glb"
        and model_state["cameraSource"] == "authored-clip",
        model_state,
    )

    settle(page, 0.18)
    opening_camera = page.evaluate("window.__cakeStudioCoda.cameraPosition")
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

    residency = []
    settle_group(page, 0.52, "assembly")
    residency.append(page.evaluate("""() => ({
      progress:.52,
      groups:window.__cakeStudioCoda.residentModelGroups,
      resident:window.__cakeStudioCoda.modelsResident,
      loaded:window.__cakeStudioCoda.modelsLoaded,
      wafers:window.__cakeStudioCoda.waferModels,
      wordmarks:window.__cakeStudioCoda.wordmarkModels,
      fov:window.__cakeStudioCoda.cameraFov,
    })"""))
    settle_group(page, 0.84, "handoff")
    residency.append(page.evaluate("""() => ({
      progress:.84,
      groups:window.__cakeStudioCoda.residentModelGroups,
      resident:window.__cakeStudioCoda.modelsResident,
      loaded:window.__cakeStudioCoda.modelsLoaded,
      artifacts:window.__cakeStudioCoda.handoffArtifactModels,
      wordmarks:window.__cakeStudioCoda.wordmarkModels,
      fov:window.__cakeStudioCoda.cameraFov,
    })"""))
    settle_group(page, 0.18, "forms")
    residency.append(page.evaluate("""() => ({
      progress:.18,
      groups:window.__cakeStudioCoda.residentModelGroups,
      resident:window.__cakeStudioCoda.modelsResident,
      loaded:window.__cakeStudioCoda.modelsLoaded,
      wordmarks:window.__cakeStudioCoda.wordmarkModels,
      fov:window.__cakeStudioCoda.cameraFov,
    })"""))
    reverse_camera = page.evaluate("window.__cakeStudioCoda.cameraPosition")
    check(
        "act-bounded model residency",
        residency[0]["groups"] == ["assembly"] and residency[0]["resident"] == 10 and residency[0]["wafers"] == 17
        and residency[1]["groups"] == ["handoff"] and residency[1]["resident"] == 5 and residency[1]["artifacts"] == 3
        and residency[2]["groups"] == ["forms"] and residency[2]["resident"] == 10
        and all(row["wordmarks"] == 1 for row in residency)
        and residency[1]["loaded"] == 24,
        residency,
    )
    check(
        "authored FOV curve is sampled",
        abs(residency[0]["fov"] - 33.165) <= 0.1
        and abs(residency[1]["fov"] - 34.770) <= 0.1
        and abs(residency[2]["fov"] - 32.611) <= 0.1,
        [row["fov"] for row in residency],
    )
    check("authored camera reverses deterministically", distance(opening_camera, reverse_camera) <= 0.004, {"distance": distance(opening_camera, reverse_camera)})

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
        settle_group(page, progress, expected_act)
        actual_act = page.evaluate("window.__cakeStudioCoda.wordmarkAct")
        wordmark_states.append({"progress": progress, "expected": expected_act, "actual": actual_act})
    check("physical wordmarks follow acts", all(row["actual"] == row["expected"] for row in wordmark_states), wordmark_states)
    check("render has no JavaScript errors", not page_errors, page_errors[:3])

    failure_context = browser.new_context(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    failure_page = failure_context.new_page()
    failed_requests: list[str] = []

    def abort_one_model(route) -> None:
        failed_requests.append(route.request.url)
        route.abort()

    failure_page.route("**/cake-01-ivory-spiral.glb", abort_one_model)
    failure_page.goto(URL, wait_until="domcontentloaded", timeout=30_000)
    set_progress(failure_page, 0.18)
    failure_page.wait_for_function("window.__cakeStudioCoda?.modelStatus === 'fallback'", timeout=30_000)
    failure_page.wait_for_function("window.__cakeStudioCoda?.cameraState === 'idle'", timeout=8_000)
    failure_before = failure_page.evaluate("window.__cakeStudioCoda.renders")
    failure_page.wait_for_timeout(1_000)
    failure_state = failure_page.evaluate(
        """() => ({
          status: window.__cakeStudioCoda.modelStatus,
          groups: window.__cakeStudioCoda.residentModelGroups,
          resident: window.__cakeStudioCoda.modelsResident,
          renders: window.__cakeStudioCoda.renders,
          error: window.__cakeStudioCoda.modelError,
        })"""
    )
    check(
        "failed GLB is terminal without retry storm",
        len(failed_requests) == 1
        and failure_state["status"] == "fallback"
        and "forms" not in failure_state["groups"]
        and failure_state["resident"] == 0
        and failure_state["renders"] - failure_before <= 2,
        {"requests": len(failed_requests), "renderDelta": failure_state["renders"] - failure_before, **failure_state},
    )
    failure_context.close()

    preference_context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=1,
        reduced_motion="reduce",
    )
    preference_page = preference_context.new_page()
    preference_requests: list[str] = []
    preference_errors: list[str] = []
    preference_page.on("request", lambda request: preference_requests.append(request.url))
    preference_page.on("pageerror", lambda error: preference_errors.append(str(error)))
    preference_page.goto(URL, wait_until="networkidle", timeout=30_000)
    preference_page.wait_for_function("window.__cakeStudioCoda?.ready === true", timeout=10_000)
    preference_page.evaluate(
        """() => {
          const reel = document.querySelector('#cake-reel');
          const top = reel.getBoundingClientRect().top + scrollY;
          const span = Math.max(0, reel.offsetHeight - innerHeight);
          document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
          scrollTo(0, top + span * .12);
        }"""
    )
    preference_page.wait_for_function(
        "[...document.querySelectorAll('#cake-reel video')].some(video => Boolean(video.currentSrc) && video.readyState >= 2)",
        timeout=30_000,
    )
    set_progress(preference_page, 0.985)
    preference_page.evaluate("""() => {
      const scene = document.querySelector('[data-object-coda]');
      scene.style.setProperty('--p', '.985');
      scene.dispatchEvent(new Event('scene:live'));
    }""")
    preference_page.wait_for_function(
        "window.__cakeStudioCoda?.act === 'handoff' && window.__cakeStudioCoda?.setStatus === 'ready' && window.__cakeStudioCoda?.modelStatus === 'ready' && window.__cakeStudioCoda?.portalCrossed === true",
        timeout=30_000,
    )
    preference_state = preference_page.evaluate(
        """() => ({
          runtime: window.__cakeStudioCoda,
          videos: [...document.querySelectorAll('#cake-reel video')].map(video => video.currentSrc),
          canvasHidden: document.querySelector('[data-cake-canvas]').hidden,
          canvasDisplay: getComputedStyle(document.querySelector('[data-cake-canvas]')).display,
          reducedPosterExists: Boolean(document.querySelector('[data-coda-reduced-poster]')),
          portalHidden: document.querySelector('[data-proof-portal]').getAttribute('aria-hidden'),
          portalInert: document.querySelector('[data-proof-portal]').inert,
        })"""
    )
    moving_media = [url for url in preference_requests if ".mp4" in url.lower()]
    dimensional_assets = [url for url in preference_requests if url.lower().endswith((".glb", ".wasm"))]
    three_runtime = [url for url in preference_requests if any(token in url for token in ("three.module", "three.core", "GLTFLoader", "KTX2Loader"))]
    check(
        "OS reduced preference still requests the full experience",
        bool(moving_media) and bool(dimensional_assets) and bool(three_runtime),
        {"media": moving_media[:2], "dimensional": dimensional_assets[:3], "three": three_runtime[:3]},
    )
    check(
        "OS reduced preference cannot replace full motion",
        preference_state["runtime"]["fullMotion"] is True
        and preference_state["runtime"]["modelSource"] == "staged-glb"
        and preference_state["runtime"]["cameraSource"] == "authored-clip"
        and preference_state["runtime"]["sheetSource"] == "blender-skinned-glb"
        and preference_state["runtime"]["renders"] > 0
        and preference_state["runtime"]["modelsLoaded"] > 0
        and not preference_state["canvasHidden"]
        and preference_state["canvasDisplay"] != "none"
        and not preference_state["reducedPosterExists"]
        and preference_state["portalHidden"] == "false"
        and preference_state["portalInert"] is False
        and not preference_errors,
        preference_state,
    )
    preference_context.close()
    browser.close()

if failures:
    print(f"CAKE_STUDIO_CODA_FAILED {len(failures)}: {json.dumps(failures)}")
    sys.exit(1)

print("CAKE_STUDIO_CODA_GREEN")
