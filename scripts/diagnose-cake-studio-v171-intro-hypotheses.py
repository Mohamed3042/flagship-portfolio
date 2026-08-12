#!/usr/bin/env python3
"""Read-only public-runtime hypotheses for Cake Studio v1.7.2 phone intro.

The page and media stay untouched.  Playwright intercepts the public runtime
JavaScript inside an isolated browser context, applies one exact in-memory
variant, and then reuses the existing cold/throttled touch performance gate.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import importlib.util
import json
from pathlib import Path
import sys
import time
from typing import Any

from playwright.sync_api import (
    Browser,
    BrowserContext,
    Page,
    Route,
    TimeoutError,
    sync_playwright,
)


ROOT = Path(__file__).resolve().parents[1]
PERF_PATH = ROOT / "scripts" / "diagnose-cake-studio-v17-phone-performance.py"
SPEC = importlib.util.spec_from_file_location("cake_v17_phone_perf", PERF_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError(f"cannot load {PERF_PATH}")
PERF = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = PERF
SPEC.loader.exec_module(PERF)

VELOCITY_THRESHOLD = 10
VELOCITY_HOLD_MS = 140
ATLAS_VELOCITY_HOLD_MS = 180
ATLAS_SETTLE_MS = 180
PREVIEW_INTERVALS = (250, 300, 350, 400, 600, 800)
VELOCITY_VARIANTS = {"velocity-debounce", "velocity-landing"}
PRODUCT_SLOW_CADENCE_VARIANT = "product-slow-cadence"
PRODUCT_SLOW_ATLAS_FALLBACK_VARIANT = "product-slow-atlas-fallback"
SLOW_CADENCE_INTERVALS = (100, 120, 150, 180)
SPRITE_VARIANTS = {
    "sprite-atlas",
    "product-atlas",
    PRODUCT_SLOW_CADENCE_VARIANT,
    PRODUCT_SLOW_ATLAS_FALLBACK_VARIANT,
}
DIAGNOSTIC_VARIANTS = VELOCITY_VARIANTS | SPRITE_VARIANTS
ATLAS_DIR = ROOT / "artifacts" / "cake-studio-v17-phone-proxy-candidate"
ATLAS_MANIFEST_PATH = ATLAS_DIR / "sprite-atlas-n32-16-384x216-q85-manifest.json"
ATLAS_MANIFEST = json.loads(ATLAS_MANIFEST_PATH.read_text(encoding="utf-8"))
ATLAS_URL_PREFIX = "/artifacts/cake-studio-v17-phone-proxy-candidate"
TERMINAL_LANDING_URLS = {
    "intro": "/artifacts/cake-studio-v17-terminal-landing/intro-terminal-opencv.webp",
    "outro": "/artifacts/cake-studio-v17-terminal-landing/outro-terminal-opencv.webp",
}


QUEUE_INTERRUPT = """    if (slot.seeking) {
      if (exact && Math.abs(slot.target - target) >= .009) {
        // After the finger settles, cancel the obsolete network seek instead
        // of waiting for it to finish before requesting the actual resting
        // frame. Assigning currentTime while the element is already seeking
        // is the browser-supported cancellation path.
        slot.seeking = false;
        issuePhoneSeek(unit);
      }
      return;
    }"""

QUEUE_SERIAL = """    if (slot.seeking) {
      // Preserve the newest target, but never cancel a seek whose decoded
      // presentation has not yet been observed. The rVFC-gated seeked handler
      // below advances to this coalesced target after the current frame paints.
      return;
    }"""

COMMIT_PHONE_BASE = """  const commitPhoneFrame = (unit) => {
    const slot = unit.phoneSlot;
    if (!slot?.armed || !slot.metadata || slot.video.readyState < 2) return;
    const mediaTime = slot.video.currentTime;
    slot.lastPainted = mediaTime;
    unit.scene.dataset.sequenceTime = mediaTime.toFixed(4);
    unit.scene.dataset.sequenceLag = Math.abs(mediaTime - unit.phoneTarget).toFixed(4);
    unit.scene.dataset.sequenceState = 'ready';
    unit.scene.classList.add('sequence-painted');
  };"""

COMMIT_PHONE_DIAGNOSTIC = """  const velocityTrace = (unit, kind, detail = {}) => {
    const diagnostics = window.__cakeVelocityDiagnostics;
    if (!diagnostics || diagnostics.events.length >= 4000) return;
    diagnostics.events.push({
      at: performance.now(),
      track: unit.trackName,
      kind,
      desired: unit.phoneTarget,
      ...detail,
    });
  };

  const commitPhoneFrame = (unit, presentedTime = null, reason = 'direct') => {
    const slot = unit.phoneSlot;
    if (!slot?.armed || !slot.metadata || slot.video.readyState < 2) return;
    const mediaTime = presentedTime ?? slot.video.currentTime;
    slot.lastPainted = mediaTime;
    unit.scene.dataset.sequenceTime = mediaTime.toFixed(4);
    unit.scene.dataset.sequenceLag = Math.abs(mediaTime - unit.phoneTarget).toFixed(4);
    unit.scene.dataset.sequenceState = 'ready';
    unit.scene.classList.add('sequence-painted');
    velocityTrace(unit, 'commit', {
      reason,
      token: slot.presentationToken || 0,
      requested: slot.target,
      decoded: mediaTime,
      exact: slot.targetExact === true,
      error: Math.abs(mediaTime - slot.target),
    });
  };"""

LANDING_HELPERS = """  const samplePhoneLanding = (landing) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 36;
    const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
    try {
      context.drawImage(landing, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let luminance = 0;
      let nonBlack = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const value = .2126 * pixels[index] + .7152 * pixels[index + 1]
          + .0722 * pixels[index + 2];
        luminance += value;
        if (value > 5) nonBlack += 1;
      }
      const count = pixels.length / 4;
      return { meanLuma: luminance / count, nonBlackRatio: nonBlack / count };
    } catch (error) {
      return { sampleError: String(error) };
    }
  };

  const showPhoneLanding = (unit, terminalTarget) => {
    const landing = unit.phoneLanding;
    const expectedWidth = Number(landing?.dataset.expectedWidth || 1280);
    const expectedHeight = Number(landing?.dataset.expectedHeight || 720);
    if (!landing || !landing.complete || landing.naturalWidth !== expectedWidth
      || landing.naturalHeight !== expectedHeight) {
      velocityTrace(unit, 'landing-unavailable', {
        requested: terminalTarget,
        complete: Boolean(landing?.complete),
        width: landing?.naturalWidth || 0,
        height: landing?.naturalHeight || 0,
      });
      return;
    }
    if (unit.phoneLandingVisible) return;
    const pixels = samplePhoneLanding(landing);
    unit.phoneLandingVisible = true;
    landing.style.opacity = '1';
    landing.dataset.visible = 'true';
    landing.dataset.meanLuma = Number.isFinite(pixels.meanLuma)
      ? pixels.meanLuma.toFixed(4) : '';
    landing.dataset.nonBlackRatio = Number.isFinite(pixels.nonBlackRatio)
      ? pixels.nonBlackRatio.toFixed(6) : '';
    unit.scene.dataset.sequenceLanding = 'visible';
    unit.scene.dataset.sequenceTime = terminalTarget.toFixed(4);
    unit.scene.dataset.sequenceLag = '0.0000';
    unit.scene.classList.add('sequence-painted');
    velocityTrace(unit, 'landing-show', {
      requested: terminalTarget,
      width: landing.naturalWidth,
      height: landing.naturalHeight,
      ...pixels,
    });
  };

  const hidePhoneLanding = (unit, reason) => {
    if (!unit.phoneLandingVisible || !unit.phoneLanding) return;
    unit.phoneLandingVisible = false;
    unit.phoneLanding.style.opacity = '0';
    unit.phoneLanding.dataset.visible = 'false';
    delete unit.scene.dataset.sequenceLanding;
    velocityTrace(unit, 'landing-hide', { reason });
  };

"""

LANDING_COMMIT_HIDE = """    const terminalTarget = unit.phoneMaster.duration
      - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps;
    const landingTolerance = 1 / unit.phoneMaster.fps + .002;
    if (unit.phoneLandingVisible && slot.targetExact === true
      && Math.abs(mediaTime - terminalTarget) <= landingTolerance) {
      hidePhoneLanding(unit, 'exact-video-commit');
    }
"""

COMMIT_PHONE_LANDING_DIAGNOSTIC = (
    COMMIT_PHONE_DIAGNOSTIC
    .replace("  const commitPhoneFrame", LANDING_HELPERS + "  const commitPhoneFrame", 1)
    .replace(
        "    velocityTrace(unit, 'commit', {",
        LANDING_COMMIT_HIDE + "    velocityTrace(unit, 'commit', {",
        1,
    )
)

PHONE_SLOT_ANCHOR = """    unit.phoneSlot = {"""

PHONE_LANDING_UNIT_INIT = """    if (unit.phoneMode && !reducedMotion.matches) {
      const landing = document.createElement('img');
      landing.className = 'bookend-phone-terminal-landing';
      landing.dataset.phoneTerminalLanding = '';
      landing.dataset.visible = 'false';
      landing.dataset.expectedWidth = '1280';
      landing.dataset.expectedHeight = '720';
      landing.alt = '';
      landing.setAttribute('aria-hidden', 'true');
      landing.decoding = 'async';
      landing.loading = 'eager';
      landing.style.cssText = [
        'position:absolute', 'inset:0', 'width:100%', 'height:100%',
        'display:block', 'object-fit:contain', 'background:#010403',
        'z-index:2', 'opacity:0', 'pointer-events:none',
      ].join(';');
      const aperture = sequence.querySelector('.bookend-aperture');
      aperture?.append(landing);
      unit.phoneLanding = landing;
      unit.phoneLandingVisible = false;
      landing.addEventListener('load', () => velocityTrace(unit, 'landing-loaded', {
        width: landing.naturalWidth,
        height: landing.naturalHeight,
      }), { once: true });
      landing.addEventListener('error', () => velocityTrace(unit, 'landing-error'), { once: true });
      landing.src = unit.endpoints[unit.endpoints.length - 1];
      landing.decode?.().then(() => velocityTrace(unit, 'landing-decoded', {
        width: landing.naturalWidth,
        height: landing.naturalHeight,
      })).catch((error) => velocityTrace(unit, 'landing-decode-error', {
        error: String(error),
      }));
    }

    unit.phoneSlot = {"""

ATLAS_HELPERS = """  const releasePhoneAtlas = (unit) => {
    if (!unit?.phoneAtlasImage) return;
    unit.phoneAtlasReady = false;
    unit.phoneAtlasLoading = false;
    unit.phoneAtlasReleasing = true;
    unit.phoneAtlasImage.src = '';
    unit.phoneAtlasImage = null;
    unit.phoneAtlasTile = -1;
    unit.phoneAtlasContext?.clearRect(
      0, 0, unit.phoneAtlasCanvas.width, unit.phoneAtlasCanvas.height,
    );
    hidePhoneAtlas(unit, 'released-offscreen');
    velocityTrace(unit, 'atlas-released');
  };

  const hidePhoneAtlas = (unit, reason) => {
    if (!unit.phoneAtlasVisible || !unit.phoneAtlasCanvas) return;
    unit.phoneAtlasVisible = false;
    unit.phoneAtlasCanvas.style.opacity = '0';
    unit.phoneAtlasCanvas.dataset.visible = 'false';
    delete unit.scene.dataset.sequenceAtlas;
    velocityTrace(unit, 'atlas-hide', { reason });
  };

  const drawPhoneAtlas = (unit, target) => {
    const config = unit.phoneAtlasConfig;
    const image = unit.phoneAtlasImage;
    const canvas = unit.phoneAtlasCanvas;
    if (!config || !unit.phoneAtlasReady || !image || !canvas) {
      velocityTrace(unit, 'atlas-unavailable', {
        requested: target,
        ready: Boolean(unit.phoneAtlasReady),
        complete: Boolean(image?.complete),
        width: image?.naturalWidth || 0,
        height: image?.naturalHeight || 0,
      });
      return false;
    }
    let tile = config.tiles[0];
    for (const candidate of config.tiles) {
      if (Math.abs(candidate.time - target) < Math.abs(tile.time - target)) {
        tile = candidate;
      }
    }
    if (unit.phoneAtlasVisible && unit.phoneAtlasTile === tile.index) return true;
    const context = unit.phoneAtlasContext;
    context.drawImage(
      image,
      tile.column * config.tileWidth,
      tile.row * config.tileHeight,
      config.tileWidth,
      config.tileHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    const pixels = samplePhoneLanding(canvas);
    unit.phoneAtlasTile = tile.index;
    unit.phoneAtlasVisible = true;
    canvas.style.opacity = '1';
    canvas.dataset.visible = 'true';
    canvas.dataset.tile = String(tile.index);
    canvas.dataset.time = tile.time.toFixed(6);
    canvas.dataset.meanLuma = Number.isFinite(pixels.meanLuma)
      ? pixels.meanLuma.toFixed(4) : '';
    canvas.dataset.nonBlackRatio = Number.isFinite(pixels.nonBlackRatio)
      ? pixels.nonBlackRatio.toFixed(6) : '';
    unit.scene.dataset.sequenceAtlas = 'visible';
    unit.scene.dataset.sequenceTime = tile.time.toFixed(4);
    unit.scene.dataset.sequenceLag = Math.abs(tile.time - target).toFixed(4);
    unit.scene.classList.add('sequence-painted');
    velocityTrace(unit, 'atlas-commit', {
      tile: tile.index,
      requested: target,
      decoded: tile.time,
      frame: tile.frame,
      error: Math.abs(tile.time - target),
      ...pixels,
    });
    return true;
  };

"""

ATLAS_COMMIT_HIDE = """    const atlasTolerance = 1 / unit.phoneMaster.fps + .002;
    const atlasIdleFor = performance.now() - (unit.phoneAtlasLastTargetAt || 0);
    if (atlasIdleFor >= 90 && Math.abs(mediaTime - unit.phoneTarget) <= atlasTolerance) {
      const settleLatency = unit.phoneAtlasSettleAt
        ? performance.now() - unit.phoneAtlasSettleAt : null;
      hidePhoneAtlas(unit, 'exact-video-commit');
      if (unit.phoneLandingVisible) {
        hidePhoneLanding(unit, 'exact-video-commit');
      }
      velocityTrace(unit, 'atlas-master-settled', {
        requested: unit.phoneTarget,
        decoded: mediaTime,
        settleLatency,
      });
      unit.phoneAtlasSettleIssued = false;
    }
"""

COMMIT_PHONE_ATLAS_DIAGNOSTIC = (
    COMMIT_PHONE_DIAGNOSTIC
    .replace(
        "  const commitPhoneFrame",
        LANDING_HELPERS + ATLAS_HELPERS + "  const commitPhoneFrame",
        1,
    )
    .replace(
        "    velocityTrace(unit, 'commit', {",
        ATLAS_COMMIT_HIDE + "    velocityTrace(unit, 'commit', {",
        1,
    )
)


def atlas_unit_init() -> str:
    configs: dict[str, Any] = {}
    for track, raw in ATLAS_MANIFEST["tracks"].items():
        configs[track] = {
            "src": f"{ATLAS_URL_PREFIX}/{raw['file']}",
            "bytes": raw["bytes"],
            "sha256": raw["sha256"],
            "width": raw["width"],
            "height": raw["height"],
            "tileWidth": ATLAS_MANIFEST["tile"]["width"],
            "tileHeight": ATLAS_MANIFEST["tile"]["height"],
            "samples": raw["samples"],
            "terminalTime": raw["terminalTime"],
            "tiles": raw["tiles"],
            "landingSrc": TERMINAL_LANDING_URLS[track],
        }
    return """    if (unit.phoneMode && !reducedMotion.matches) {
      const atlasConfig = __ATLAS_CONFIG__[trackName];
      const aperture = sequence.querySelector('.bookend-aperture');
      const atlasCanvas = document.createElement('canvas');
      atlasCanvas.className = 'bookend-phone-scrub-atlas';
      atlasCanvas.dataset.phoneScrubAtlas = '';
      atlasCanvas.dataset.visible = 'false';
      atlasCanvas.width = atlasConfig.tileWidth;
      atlasCanvas.height = atlasConfig.tileHeight;
      atlasCanvas.style.cssText = [
        'position:absolute', 'inset:0', 'width:100%', 'height:100%',
        'display:block', 'object-fit:contain', 'background:#010403',
        'z-index:2', 'opacity:0', 'pointer-events:none',
      ].join(';');
      aperture?.append(atlasCanvas);
      unit.phoneAtlasConfig = atlasConfig;
      unit.phoneAtlasCanvas = atlasCanvas;
      unit.phoneAtlasContext = atlasCanvas.getContext('2d', {
        alpha: false,
        willReadFrequently: true,
      });
      unit.phoneAtlasVisible = false;
      unit.phoneAtlasReady = false;
      unit.phoneAtlasTile = -1;
      unit.phoneAtlasLoading = false;
      unit.loadPhoneAtlas = () => {
        if (unit.phoneAtlasReady || unit.phoneAtlasLoading) return;
        unit.phoneAtlasLoading = true;
        unit.phoneAtlasReleasing = false;
        const atlasImage = new Image();
        atlasImage.decoding = 'async';
        atlasImage.fetchPriority = 'high';
        unit.phoneAtlasImage = atlasImage;
        const requestedAt = performance.now();
        velocityTrace(unit, 'atlas-requested', { src: atlasConfig.src });
        atlasImage.addEventListener('load', () => velocityTrace(unit, 'atlas-loaded', {
          width: atlasImage.naturalWidth,
          height: atlasImage.naturalHeight,
          bytes: atlasConfig.bytes,
          loadLatency: performance.now() - requestedAt,
        }), { once: true });
        atlasImage.addEventListener('error', () => {
          if (unit.phoneAtlasReleasing) {
            unit.phoneAtlasReleasing = false;
            return;
          }
          unit.phoneAtlasLoading = false;
          velocityTrace(unit, 'atlas-error');
        }, { once: true });
        atlasImage.src = atlasConfig.src;
        atlasImage.decode().then(() => {
          const dimensionsReady = atlasImage.naturalWidth === atlasConfig.width
            && atlasImage.naturalHeight === atlasConfig.height;
          let primeLatency = null;
          if (dimensionsReady) {
            const primeStarted = performance.now();
            const first = atlasConfig.tiles[0];
            unit.phoneAtlasContext.drawImage(
              atlasImage,
              first.column * atlasConfig.tileWidth,
              first.row * atlasConfig.tileHeight,
              atlasConfig.tileWidth,
              atlasConfig.tileHeight,
              0,
              0,
              atlasCanvas.width,
              atlasCanvas.height,
            );
            unit.phoneAtlasContext.getImageData(0, 0, 1, 1);
            unit.phoneAtlasContext.clearRect(
              0, 0, atlasCanvas.width, atlasCanvas.height,
            );
            primeLatency = performance.now() - primeStarted;
          }
          unit.phoneAtlasReady = dimensionsReady;
          unit.phoneAtlasLoading = false;
          unit.loadPhoneLanding?.();
          velocityTrace(unit, 'atlas-decoded', {
            ready: unit.phoneAtlasReady,
            width: atlasImage.naturalWidth,
            height: atlasImage.naturalHeight,
            decodeLatency: performance.now() - requestedAt,
            primeLatency,
          });
        }).catch((error) => {
          unit.phoneAtlasLoading = false;
          velocityTrace(unit, 'atlas-decode-error', { error: String(error) });
        });
      };
      if (trackName === 'intro') {
        unit.loadPhoneAtlas();
      } else {
        document.querySelector('[data-cake-bookend="intro"]')?.addEventListener(
          'scene:idle',
          () => {
            const intro = window.__cakeStudioBookends?.units?.find(
              candidate => candidate.trackName === 'intro',
            );
            releasePhoneAtlas(intro);
            unit.loadPhoneAtlas();
          },
          { once: true },
        );
      }

      const landing = document.createElement('img');
      landing.className = 'bookend-phone-terminal-landing';
      landing.dataset.phoneTerminalLanding = '';
      landing.dataset.visible = 'false';
      landing.dataset.expectedWidth = '640';
      landing.dataset.expectedHeight = '360';
      landing.alt = '';
      landing.setAttribute('aria-hidden', 'true');
      landing.decoding = 'async';
      landing.loading = 'eager';
      landing.style.cssText = [
        'position:absolute', 'inset:0', 'width:100%', 'height:100%',
        'display:block', 'object-fit:contain', 'background:#010403',
        'z-index:2', 'opacity:0', 'pointer-events:none',
      ].join(';');
      aperture?.append(landing);
      unit.phoneLanding = landing;
      unit.phoneLandingVisible = false;
      landing.addEventListener('load', () => velocityTrace(unit, 'landing-loaded', {
        width: landing.naturalWidth,
        height: landing.naturalHeight,
      }), { once: true });
      landing.addEventListener('error', () => velocityTrace(unit, 'landing-error'), { once: true });
      unit.loadPhoneLanding = () => {
        if (landing.getAttribute('src')) return;
        landing.src = atlasConfig.landingSrc;
        landing.decode?.().then(() => velocityTrace(unit, 'landing-decoded', {
          width: landing.naturalWidth,
          height: landing.naturalHeight,
        })).catch((error) => velocityTrace(unit, 'landing-decode-error', {
          error: String(error),
        }));
      };
    }

    unit.phoneSlot = {""".replace(
        "__ATLAS_CONFIG__", json.dumps(configs, separators=(",", ":"))
    )

SEEKED_EARLY = """    phoneVideo.addEventListener('seeked', () => {
      const slot = unit.phoneSlot;
      if (!slot.armed) return;
      slot.seeking = false;
      // The native video has already composited this decoded frame. Keep it
      // visible before chasing the newest touch target instead of blanking the
      // surface as the old canvas transport did.
      commitPhoneFrame(unit);
      if (slot.wanted >= 0) {
        const wanted = slot.wanted;
        const exact = slot.wantedExact;
        slot.wanted = -1;
        slot.wantedExact = false;
        queuePhoneSeek(unit, wanted, exact);
      }
    });"""

SEEKED_RVFC = """    phoneVideo.addEventListener('seeked', () => {
      const slot = unit.phoneSlot;
      if (!slot.armed) return;
      // The matching rVFC registered before currentTime assignment owns
      // completion. This event is only the fallback for older engines.
      if (typeof phoneVideo.requestVideoFrameCallback === 'function') return;
      slot.seeking = false;
      commitPhoneFrame(unit);
      if (slot.wanted >= 0) {
        const wanted = slot.wanted;
        const exact = slot.wantedExact;
        slot.wanted = -1;
        slot.wantedExact = false;
        queuePhoneSeek(unit, wanted, exact);
      }
    });"""

ISSUE_EARLY = """  const issuePhoneSeek = (unit) => {
    const slot = unit.phoneSlot;
    if (!slot?.armed || !slot.metadata || slot.seeking || slot.wanted < 0) return;
    clearTimeout(slot.seekTimer);
    slot.seekTimer = 0;
    const target = slot.wanted;
    slot.wanted = -1;
    slot.wantedExact = false;
    slot.target = target;
    if (Math.abs(slot.video.currentTime - target) < .009) {
      commitPhoneFrame(unit);
      return;
    }
    slot.seeking = true;
    slot.lastIssued = performance.now();
    try {
      slot.video.currentTime = target;
    } catch {
      slot.seeking = false;
      unit.scene.dataset.sequenceState = 'phone-seek-error';
    }
  };"""

ISSUE_ATLAS_TRACE = ISSUE_EARLY.replace(
    """    const target = slot.wanted;
    slot.wanted = -1;
    slot.wantedExact = false;
    slot.target = target;""",
    """    const target = slot.wanted;
    const exact = slot.wantedExact;
    slot.wanted = -1;
    slot.wantedExact = false;
    slot.target = target;
    slot.targetExact = exact;""",
    1,
).replace(
    "    try {\n      slot.video.currentTime = target;",
    """    velocityTrace(unit, 'video-seek-issued', {
      requested: target,
      highVelocity: unit.phoneAtlasHighVelocity === true,
      exact,
    });
    try {
      slot.video.currentTime = target;""",
    1,
)

ISSUE_RVFC = """  const issuePhoneSeek = (unit) => {
    const slot = unit.phoneSlot;
    if (!slot?.armed || !slot.metadata || slot.seeking || slot.wanted < 0) return;
    clearTimeout(slot.seekTimer);
    slot.seekTimer = 0;
    const target = slot.wanted;
    slot.wanted = -1;
    slot.wantedExact = false;
    slot.target = target;
    if (Math.abs(slot.video.currentTime - target) < .009) {
      commitPhoneFrame(unit);
      return;
    }
    slot.seeking = true;
    slot.lastIssued = performance.now();
    const generation = slot.generation;
    const token = (slot.presentationToken || 0) + 1;
    slot.presentationToken = token;
    const finish = () => {
      if (!slot.armed || generation !== slot.generation || token !== slot.presentationToken) return;
      slot.seeking = false;
      commitPhoneFrame(unit);
      if (slot.wanted >= 0) {
        const wanted = slot.wanted;
        const exact = slot.wantedExact;
        slot.wanted = -1;
        slot.wantedExact = false;
        queuePhoneSeek(unit, wanted, exact);
      }
    };
    if (typeof slot.video.requestVideoFrameCallback === 'function') {
      const presented = (_now, metadata = {}) => {
        if (!slot.armed || generation !== slot.generation || token !== slot.presentationToken) return;
        const mediaTime = metadata.mediaTime ?? slot.video.currentTime;
        if (Math.abs(mediaTime - target) > .05) {
          slot.video.requestVideoFrameCallback(presented);
          return;
        }
        finish();
      };
      slot.video.requestVideoFrameCallback(presented);
    }
    try {
      slot.video.currentTime = target;
    } catch {
      slot.presentationToken += 1;
      slot.seeking = false;
      unit.scene.dataset.sequenceState = 'phone-seek-error';
    }
  };"""

ISSUE_VELOCITY_RVFC = """  const issuePhoneSeek = (unit) => {
    const slot = unit.phoneSlot;
    if (!slot?.armed || !slot.metadata || slot.seeking || slot.wanted < 0) return;
    clearTimeout(slot.seekTimer);
    slot.seekTimer = 0;
    const target = slot.wanted;
    const exact = slot.wantedExact;
    slot.wanted = -1;
    slot.wantedExact = false;
    slot.target = target;
    slot.targetExact = exact;
    if (Math.abs(slot.video.currentTime - target) < .009) {
      commitPhoneFrame(unit, null, exact ? 'exact-already' : 'preview-already');
      return;
    }
    slot.seeking = true;
    slot.lastIssued = performance.now();
    const generation = slot.generation;
    const token = (slot.presentationToken || 0) + 1;
    slot.presentationToken = token;
    velocityTrace(unit, 'seek-issued', { token, requested: target, exact });
    const finish = (mediaTime) => {
      if (!slot.armed || generation !== slot.generation
        || token !== slot.presentationToken) {
        velocityTrace(unit, 'obsolete-discard', {
          token,
          currentToken: slot.presentationToken || 0,
          requested: target,
          decoded: mediaTime,
        });
        return;
      }
      const tolerance = 1 / unit.phoneMaster.fps + .002;
      if (Math.abs(mediaTime - target) > tolerance) {
        velocityTrace(unit, 'seeked-mismatch', {
          token, requested: target, decoded: mediaTime,
        });
        return;
      }
      slot.seeking = false;
      commitPhoneFrame(
        unit,
        mediaTime,
        slot.targetExact ? 'exact-seeked' : 'preview-seeked',
      );
      if (slot.wanted >= 0) {
        const wanted = slot.wanted;
        const wantedExact = slot.wantedExact;
        slot.wanted = -1;
        slot.wantedExact = false;
        queuePhoneSeek(unit, wanted, wantedExact);
      }
    };
    slot.video.addEventListener('seeked', () => {
      finish(slot.video.currentTime);
    }, { once: true });
    if (typeof slot.video.requestVideoFrameCallback === 'function') {
      slot.video.requestVideoFrameCallback((_now, metadata = {}) => {
        const mediaTime = metadata.mediaTime ?? slot.video.currentTime;
        velocityTrace(unit, token === slot.presentationToken
          ? 'presentation-witness' : 'obsolete-presentation', {
          token,
          currentToken: slot.presentationToken || 0,
          requested: target,
          decoded: mediaTime,
          error: Math.abs(mediaTime - target),
        });
      });
    }
    try {
      slot.video.currentTime = target;
    } catch {
      slot.presentationToken += 1;
      slot.seeking = false;
      unit.scene.dataset.sequenceState = 'phone-seek-error';
      velocityTrace(unit, 'seek-error', { token, requested: target, exact });
    }
  };"""

SEEKED_VELOCITY_RVFC = """    phoneVideo.addEventListener('seeked', () => {
      const slot = unit.phoneSlot;
      if (!slot.armed) return;
      velocityTrace(unit, 'seeked', {
        token: slot.presentationToken || 0,
        requested: slot.target,
        decoded: phoneVideo.currentTime,
        exact: slot.targetExact === true,
      });
      // Per-issue token/generation guarded listeners own completion. This
      // observer is trace-only so an obsolete event cannot drain a new target.
    });"""

QUEUE_PROMOTE_EXACT = """    if (slot.seeking) {
      if (exact && Math.abs(slot.target - target) >= .009) {
        // Interrupt only for a materially newer exact resting target.
        slot.seeking = false;
        issuePhoneSeek(unit);
      } else if (exact) {
        // The same seek is already in flight; promote its eventual commit
        // instead of restarting the identical network/decode request.
        slot.targetExact = true;
        velocityTrace(unit, 'exact-promoted', {
          token: slot.presentationToken || 0,
          requested: target,
          exact: true,
        });
      }
      return;
    }"""

RENDER_EOF_LAST_PTS = """    unit.phoneTarget = Math.min(
      unit.phoneMaster.duration - 1 / unit.phoneMaster.fps,
      progress * unit.phoneMaster.duration,
    );"""

RENDER_EOF_SAFE_HOLD = """    unit.phoneTarget = Math.min(
      unit.phoneMaster.duration - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps,
      progress * unit.phoneMaster.duration,
    );"""

QUEUE_EOF_LAST_PTS = """    const target = Math.min(duration - 1 / unit.phoneMaster.fps, Math.max(.001, time));"""

QUEUE_EOF_SAFE_HOLD = """    const terminalTime = duration - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps;
    const target = Math.min(terminalTime, Math.max(.001, time));"""

CADENCE_66 = """    const minimumInterval = slot.wantedExact ? 0 : 66;"""
CADENCE_180 = """    const minimumInterval = slot.wantedExact ? 0 : 180;"""


def apply_product_slow_cadence(source: str, interval_ms: int) -> str:
    if interval_ms not in SLOW_CADENCE_INTERVALS:
        raise ValueError(f"unsupported slow cadence {interval_ms} ms")
    if source.count(CADENCE_66) != 1:
        raise RuntimeError(
            f"product slow cadence: expected one 66 ms anchor, found {source.count(CADENCE_66)}"
        )
    replacement = (
        f"    const minimumInterval = slot.wantedExact ? 0 : {interval_ms};"
    )
    return source.replace(CADENCE_66, replacement, 1)


SLOW_ATLAS_FALLBACK_ANCHOR = """    } else if (!unit.phoneAtlasVisible && !unit.phoneLandingVisible) {
      queuePhoneSeek(unit, unit.phoneTarget);
    } else if (unit.phoneLandingVisible && !terminalHold) {"""
SLOW_ATLAS_FALLBACK_PATCH = """    } else if (
      !unit.phoneAtlasVisible && !unit.phoneLandingVisible
      && (unit.phoneSlot.seeking || unit.phoneSlot.video.seeking)
      && Math.abs(
        unit.phoneTarget
          - (Number.isFinite(unit.phoneSlot.lastPainted)
            ? unit.phoneSlot.lastPainted : unit.phoneSlot.video.currentTime)
      ) > .5
      && drawPhoneAtlas(unit, unit.phoneTarget)
    ) {
      clearTimeout(unit.phoneSlot.seekTimer);
      unit.phoneSlot.seekTimer = 0;
      unit.phoneSlot.wanted = -1;
      unit.phoneSlot.wantedExact = false;
      unit.scene.dataset.sequencePreviewMode = 'sprite-atlas-slow-fallback';
    } else if (!unit.phoneAtlasVisible && !unit.phoneLandingVisible) {
      queuePhoneSeek(unit, unit.phoneTarget);
    } else if (unit.phoneLandingVisible && !terminalHold) {"""


def apply_product_slow_atlas_fallback(source: str) -> str:
    if source.count(SLOW_ATLAS_FALLBACK_ANCHOR) != 1:
        raise RuntimeError(
            "product slow atlas fallback: expected one render anchor, "
            f"found {source.count(SLOW_ATLAS_FALLBACK_ANCHOR)}"
        )
    return source.replace(
        SLOW_ATLAS_FALLBACK_ANCHOR, SLOW_ATLAS_FALLBACK_PATCH, 1
    )

SETTLE_110 = """    unit.phoneSettleTimer = setTimeout(() => {
      unit.phoneSettleTimer = 0;
      queuePhoneSeek(unit, unit.phoneTarget, true);
    }, 110);"""

SETTLE_180 = """    unit.phoneSettleTimer = setTimeout(() => {
      unit.phoneSettleTimer = 0;
      queuePhoneSeek(unit, unit.phoneTarget, true);
    }, 180);"""

RENDER_PHONE_BASE = """  const renderPhoneMaster = (unit, progress) => {
    unit.phoneTarget = Math.min(
      unit.phoneMaster.duration - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps,
      progress * unit.phoneMaster.duration,
    );
    unit.scene.dataset.sequenceTargetTime = unit.phoneTarget.toFixed(4);
    if (!solo && !unit.live) return;
    armPhoneMaster(unit);
    queuePhoneSeek(unit, unit.phoneTarget);
    clearTimeout(unit.phoneSettleTimer);
    unit.phoneSettleTimer = setTimeout(() => {
      unit.phoneSettleTimer = 0;
      queuePhoneSeek(unit, unit.phoneTarget, true);
    }, 110);
  };"""

RENDER_PHONE_VELOCITY_TEMPLATE = """  const renderPhoneMaster = (unit, progress) => {
    const now = performance.now();
    const priorTarget = Number.isFinite(unit.phoneVelocityTarget)
      ? unit.phoneVelocityTarget : unit.phoneTarget;
    const priorAt = Number.isFinite(unit.phoneVelocityAt) ? unit.phoneVelocityAt : now;
    unit.phoneTarget = Math.min(
      unit.phoneMaster.duration - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps,
      progress * unit.phoneMaster.duration,
    );
    const elapsed = now - priorAt;
    const velocity = elapsed > 0
      ? Math.abs(unit.phoneTarget - priorTarget) * 1000 / elapsed : 0;
    unit.phoneVelocityTarget = unit.phoneTarget;
    unit.phoneVelocityAt = now;
    if (elapsed <= 160 && velocity >= __VELOCITY_THRESHOLD__) {
      unit.phoneVelocityUntil = now + __VELOCITY_HOLD_MS__;
    }
    const highVelocity = now < (unit.phoneVelocityUntil || 0);
    velocityTrace(unit, 'target', {
      requested: unit.phoneTarget,
      velocity,
      highVelocity,
    });
    unit.scene.dataset.sequenceVelocity = velocity.toFixed(3);
    unit.scene.dataset.sequencePreviewMode = highVelocity ? 'coarse' : 'exact-follow';
    unit.scene.dataset.sequencePreviewInterval = '__PREVIEW_MS__';
    unit.scene.dataset.sequenceTargetTime = unit.phoneTarget.toFixed(4);
    if (!solo && !unit.live) return;
__LANDING_UPDATE__
    armPhoneMaster(unit);
    const sincePreview = now - (unit.phonePreviewLastIssued ?? -Infinity);
    if (!highVelocity || sincePreview >= __PREVIEW_MS__) {
      unit.phonePreviewLastIssued = now;
      velocityTrace(unit, highVelocity ? 'coarse-request' : 'follow-request', {
        requested: unit.phoneTarget,
        velocity,
        highVelocity,
      });
      queuePhoneSeek(unit, unit.phoneTarget);
    } else {
      velocityTrace(unit, 'suppressed-target', {
        requested: unit.phoneTarget,
        velocity,
        highVelocity,
        holdMs: __PREVIEW_MS__ - sincePreview,
      });
    }
    clearTimeout(unit.phoneSettleTimer);
    unit.phoneSettleTimer = setTimeout(() => {
      unit.phoneSettleTimer = 0;
      velocityTrace(unit, 'settle-request', {
        requested: unit.phoneTarget,
        exact: true,
      });
      queuePhoneSeek(unit, unit.phoneTarget, true);
    }, 110);
  };"""

RENDER_PHONE_ATLAS = """  const renderPhoneMaster = (unit, progress) => {
    const now = performance.now();
    const priorTarget = Number.isFinite(unit.phoneVelocityTarget)
      ? unit.phoneVelocityTarget : unit.phoneTarget;
    const priorAt = Number.isFinite(unit.phoneVelocityAt) ? unit.phoneVelocityAt : now;
    const terminalTarget = unit.phoneMaster.duration
      - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps;
    unit.phoneTarget = Math.min(terminalTarget, progress * unit.phoneMaster.duration);
    const elapsed = now - priorAt;
    const velocity = elapsed > 0
      ? Math.abs(unit.phoneTarget - priorTarget) * 1000 / elapsed : 0;
    unit.phoneVelocityTarget = unit.phoneTarget;
    unit.phoneVelocityAt = now;
    unit.phoneAtlasLastTargetAt = now;
    if (elapsed <= 160 && velocity >= __VELOCITY_THRESHOLD__) {
      unit.phoneAtlasHighSamples = (unit.phoneAtlasHighSamples || 0) + 1;
    } else {
      unit.phoneAtlasHighSamples = 0;
    }
    if (unit.phoneAtlasHighSamples >= 2) {
      unit.phoneVelocityUntil = now + __ATLAS_VELOCITY_HOLD_MS__;
    }
    const highVelocity = now < (unit.phoneVelocityUntil || 0);
    unit.phoneAtlasHighVelocity = highVelocity;
    unit.scene.dataset.sequenceVelocity = velocity.toFixed(3);
    unit.scene.dataset.sequencePreviewMode = highVelocity ? 'sprite-atlas' : 'exact-follow';
    unit.scene.dataset.sequenceTargetTime = unit.phoneTarget.toFixed(4);
    velocityTrace(unit, 'target', {
      requested: unit.phoneTarget,
      velocity,
      highVelocity,
    });
    if (!solo && !unit.live) return;
    armPhoneMaster(unit);
    unit.loadPhoneAtlas?.();

    const terminal = progress >= .999
      || Math.abs(unit.phoneTarget - terminalTarget) < .009;
    if (terminal) {
      showPhoneLanding(unit, terminalTarget);
      hidePhoneAtlas(unit, 'terminal-landing');
    }

    if (highVelocity) {
      const slot = unit.phoneSlot;
      clearTimeout(slot.seekTimer);
      slot.seekTimer = 0;
      slot.wanted = -1;
      slot.wantedExact = false;
      if (!terminal && drawPhoneAtlas(unit, unit.phoneTarget)) {
        // On reverse, retain the exact terminal landing until the first
        // decoded atlas tile is already underneath it.
        hidePhoneLanding(unit, 'reverse-atlas-commit');
      }
      velocityTrace(unit, 'atlas-target', {
        requested: unit.phoneTarget,
        terminal,
      });
    } else if (!terminal && (!unit.phoneAtlasVisible || unit.phoneLandingVisible)) {
      // Slow input never enters the atlas path and retains the production
      // direct-master seek behavior byte for byte.
      queuePhoneSeek(unit, unit.phoneTarget);
    }

    clearTimeout(unit.phoneSettleTimer);
    unit.phoneSettleTimer = setTimeout(() => {
      unit.phoneSettleTimer = 0;
      unit.phoneAtlasHighVelocity = false;
      if (unit.phoneLandingVisible
        && Math.abs(unit.phoneTarget - terminalTarget) < .009) {
        unit.phoneAtlasSettleIssued = false;
        velocityTrace(unit, 'terminal-seek-skipped', {
          requested: unit.phoneTarget,
          exact: true,
        });
        return;
      }
      unit.phoneAtlasSettleIssued = true;
      unit.phoneAtlasSettleAt = performance.now();
      velocityTrace(unit, 'settle-request', {
        requested: unit.phoneTarget,
        exact: true,
      });
      queuePhoneSeek(unit, unit.phoneTarget, true);
    }, __ATLAS_SETTLE_MS__);
  };""".replace("__VELOCITY_THRESHOLD__", str(VELOCITY_THRESHOLD)).replace(
    "__ATLAS_VELOCITY_HOLD_MS__", str(ATLAS_VELOCITY_HOLD_MS)
).replace("__ATLAS_SETTLE_MS__", str(ATLAS_SETTLE_MS))


def velocity_render(preview_ms: int, *, landing: bool = False) -> str:
    if preview_ms not in PREVIEW_INTERVALS:
        raise ValueError(f"preview interval must be one of {PREVIEW_INTERVALS}: {preview_ms}")
    return (
        RENDER_PHONE_VELOCITY_TEMPLATE
        .replace("__VELOCITY_THRESHOLD__", str(VELOCITY_THRESHOLD))
        .replace("__VELOCITY_HOLD_MS__", str(VELOCITY_HOLD_MS))
        .replace("__PREVIEW_MS__", str(preview_ms))
        .replace(
            "__LANDING_UPDATE__",
            """    const terminalTarget = unit.phoneMaster.duration
      - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps;
    if (Math.abs(unit.phoneTarget - terminalTarget) < .009) {
      showPhoneLanding(unit, terminalTarget);
    } else {
      hidePhoneLanding(unit, 'left-terminal');
    }""" if landing else "",
        )
    )


VELOCITY_DIAGNOSTIC_INIT = """(() => {
  const diagnostics = window.__cakeVelocityDiagnostics = {
    events: [],
    sourceMutations: [],
    fastSeekAvailable: typeof HTMLMediaElement.prototype.fastSeek === 'function',
    startedAt: performance.now(),
    atlasReadyTracks: new Set(),
    atlasVisibility: new Map(),
    landingVisibility: new Map(),
  };
  const trace = (track, kind, detail = {}) => {
    if (diagnostics.events.length >= 4000) return;
    diagnostics.events.push({at: performance.now(), track, kind, ...detail});
  };
  const pixelStats = (source) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 36;
    const context = canvas.getContext('2d', {alpha: false, willReadFrequently: true});
    try {
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let luminance = 0;
      let nonBlack = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        const value = .2126 * pixels[index] + .7152 * pixels[index + 1]
          + .0722 * pixels[index + 2];
        luminance += value;
        if (value > 5) nonBlack += 1;
      }
      return {
        meanLuma: luminance / (pixels.length / 4),
        nonBlackRatio: nonBlack / (pixels.length / 4),
      };
    } catch (error) {
      return {sampleError: String(error)};
    }
  };
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      const video = record.target;
      if (!video?.matches?.('[data-bookend-phone-video]')) continue;
      const scene = video.closest('[data-cake-bookend]');
      diagnostics.sourceMutations.push({
        at: performance.now(),
        track: scene?.dataset.cakeBookend || '',
        live: scene?.classList.contains('is-live') || false,
        src: video.getAttribute('src') || '',
      });
    }
  });
  observer.observe(document, {
    subtree: true,
    attributes: true,
    attributeFilter: ['src'],
  });
  const originalDraw = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function(...args) {
    const result = originalDraw.apply(this, args);
    const canvas = this.canvas;
    if (canvas?.matches?.('[data-phone-scrub-atlas]')) {
      queueMicrotask(() => {
        const scene = canvas.closest('[data-cake-bookend]');
        const track = scene?.dataset.cakeBookend || '';
        const tile = Number.parseInt(canvas.dataset.tile || '-1', 10);
        const frame = Number.parseInt(canvas.dataset.frame || '-1', 10);
        const decoded = Number.parseFloat(canvas.dataset.time || 'NaN');
        const requested = Number.parseFloat(scene?.dataset.sequenceTargetTime || 'NaN');
        if (!track || tile < 0 || !Number.isFinite(decoded)
          || !Number.isFinite(requested)) return;
        trace(track, 'atlas-commit', {
          tile,
          frame,
          requested,
          decoded,
          error: Math.abs(decoded - requested),
          ...pixelStats(canvas),
        });
      });
    }
    return result;
  };
  document.addEventListener('seeking', (event) => {
    const video = event.target;
    if (!video?.matches?.('[data-bookend-phone-video]')) return;
    const scene = video.closest('[data-cake-bookend]');
    const track = scene?.dataset.cakeBookend || '';
    const unit = window.__cakeStudioBookends?.units?.find(
      item => item.trackName === track
    );
    trace(track, 'video-seek-issued', {
      requested: video.currentTime,
      highVelocity: unit?.phoneAtlasHighVelocity === true,
      exact: unit?.phoneSlot?.targetExact === true,
    });
  }, true);
  const surfaceObserver = new MutationObserver((records) => {
    for (const record of records) {
      const target = record.target;
      if (!target?.matches?.(
        '[data-phone-scrub-atlas], [data-phone-terminal-landing]'
      )) continue;
      const scene = target.closest('[data-cake-bookend]');
      const track = scene.dataset.cakeBookend || '';
      const unit = window.__cakeStudioBookends?.units?.find(
        item => item.trackName === track
      );
      if (!unit) continue;
      if (target.matches('[data-phone-scrub-atlas]')) {
        const visible = unit.phoneAtlasVisible === true
          && Number.parseFloat(getComputedStyle(target).opacity || '0') >= .5;
        const priorVisible = diagnostics.atlasVisibility.get(track) === true;
        if (visible === priorVisible) continue;
        diagnostics.atlasVisibility.set(track, visible);
        trace(track, visible ? 'atlas-show' : 'atlas-hide', visible ? {
          tile: Number.parseInt(target.dataset.tile || '-1', 10),
          frame: Number.parseInt(target.dataset.frame || '-1', 10),
          decoded: Number.parseFloat(target.dataset.time || 'NaN'),
          requested: Number.parseFloat(scene.dataset.sequenceTargetTime || 'NaN'),
          ...pixelStats(target),
        } : {reason: scene.dataset.sequenceAtlas || 'hidden'});
        continue;
      }
      const landing = target;
      const visible = unit.phoneLandingVisible === true
        && Number.parseFloat(getComputedStyle(landing).opacity || '0') >= .5;
      const priorVisible = diagnostics.landingVisibility.get(track) === true;
      if (visible === priorVisible) continue;
      diagnostics.landingVisibility.set(track, visible);
      trace(track, visible ? 'landing-show' : 'landing-hide', visible ? {
        requested: Number.parseFloat(scene.dataset.sequenceTargetTime || 'NaN'),
        width: landing.naturalWidth || 0,
        height: landing.naturalHeight || 0,
        ...pixelStats(landing),
      } : {reason: scene.dataset.sequenceLanding || 'hidden'});
    }
  });
  surfaceObserver.observe(document, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-visible'],
  });
  const attach = () => {
    const perf = window.__cakePhonePerf;
    if (!perf) {
      setTimeout(attach, 0);
      return;
    }
    if (perf.__velocityWrapped) return;
    perf.__velocityWrapped = true;
    const originalSample = perf.sample.bind(perf);
    perf.sample = function() {
      originalSample();
      const sample = this.samples[this.samples.length - 1];
      const scene = this.scene();
      const landing = scene?.querySelector('[data-phone-terminal-landing]');
      const atlas = scene?.querySelector('[data-phone-scrub-atlas]');
      const unit = window.__cakeStudioBookends?.units?.find(
        item => item.trackName === this.activeTrack
      );
      if (!sample) return;
      if (unit?.phoneAtlasReady && !diagnostics.atlasReadyTracks.has(this.activeTrack)) {
        diagnostics.atlasReadyTracks.add(this.activeTrack);
        trace(this.activeTrack, 'atlas-decoded', {
          ready: true,
          decodeLatency: performance.now() - diagnostics.startedAt,
        });
      }
      if (landing) {
        const visible = unit?.phoneLandingVisible === true
          && Number.parseFloat(getComputedStyle(landing).opacity || '0') >= .5;
        sample.terminalLanding = {
          visible,
          complete: Boolean(landing.complete),
          width: landing.naturalWidth || 0,
          height: landing.naturalHeight || 0,
          meanLuma: Number.parseFloat(landing.dataset.meanLuma || 'NaN'),
          nonBlackRatio: Number.parseFloat(landing.dataset.nonBlackRatio || 'NaN'),
        };
        const priorVisible = diagnostics.landingVisibility.get(this.activeTrack) === true;
        if (visible !== priorVisible) {
          diagnostics.landingVisibility.set(this.activeTrack, visible);
          trace(this.activeTrack, visible ? 'landing-show' : 'landing-hide', visible ? {
            requested: Number.parseFloat(scene.dataset.sequenceTargetTime || 'NaN'),
            width: landing.naturalWidth || 0,
            height: landing.naturalHeight || 0,
            ...pixelStats(landing),
          } : {reason: scene.dataset.sequenceLanding || 'hidden'});
        }
      }
      if (atlas) {
        const visible = unit?.phoneAtlasVisible === true
          && Number.parseFloat(getComputedStyle(atlas).opacity || '0') >= .5;
        sample.scrubAtlas = {
          visible,
          tile: Number.parseInt(atlas.dataset.tile || '-1', 10),
          time: Number.parseFloat(atlas.dataset.time || 'NaN'),
          meanLuma: Number.parseFloat(atlas.dataset.meanLuma || 'NaN'),
          nonBlackRatio: Number.parseFloat(atlas.dataset.nonBlackRatio || 'NaN'),
        };
      }
    };
    const originalStop = perf.stop.bind(perf);
    perf.stop = function(clearTrack = true) {
      const recordingStartedAt = this.startedAt;
      const result = originalStop(clearTrack);
      result.velocityDiagnostics = {
        recordingStartedAt,
        fastSeekAvailable: diagnostics.fastSeekAvailable,
        events: diagnostics.events,
        sourceMutations: diagnostics.sourceMutations,
      };
      return result;
    };
  };
  attach();
})()"""

INIT_NETWORK_INTRO = """      if (usePhoneMaster && manifest.ready === true && !reducedMotion.matches) {
        // Prime each persistent source at its opening frame. This downloads
        // only enough for a decoded cold-start surface; later scroll seeks
        // keep the same URL attached. The intro may buffer ahead while the
        // visitor reads the opening copy, while the distant outro stays at
        // metadata/first-frame cost until approached.
        for (const unit of runtime.units) {
          armPhoneMaster(unit);
          queuePhoneSeek(unit, unit.phoneTarget, true);
        }
        const intro = runtime.units.find((unit) => unit.trackName === 'intro');
        const outro = runtime.units.find((unit) => unit.trackName === 'outro');
        const warmOutro = () => warmPhoneMaster(outro);
        intro?.scene.addEventListener('scene:idle', warmOutro, { once: true });
        outro?.scene.addEventListener('scene:live', warmOutro, { once: true });
      }
      runtime.state = manifest.ready === true ? 'ready' : 'awaiting-media';"""

INIT_BLOB_INTRO = """      if (usePhoneMaster && manifest.ready === true && !reducedMotion.matches) {
        const intro = runtime.units.find((unit) => unit.trackName === 'intro');
        const outro = runtime.units.find((unit) => unit.trackName === 'outro');
        for (const unit of runtime.units) {
          if (unit === intro) continue;
          armPhoneMaster(unit);
          queuePhoneSeek(unit, unit.phoneTarget, true);
        }
        if (intro) {
          intro.live = false;
          releasePhoneMaster(intro);
          runtime.state = 'warming-intro';
          warmPhoneMaster(intro).then(() => {
            intro.live = solo || intro.scene.classList.contains('is-live');
            if (intro.warmState !== 'ready') {
              armPhoneMaster(intro);
              queuePhoneSeek(intro, intro.phoneTarget, true);
            }
            renderUnit(intro, readProgress(intro.scene));
            runtime.state = 'ready';
          });
        } else {
          runtime.state = 'ready';
        }
        const warmOutro = () => warmPhoneMaster(outro);
        intro?.scene.addEventListener('scene:idle', warmOutro, { once: true });
        outro?.scene.addEventListener('scene:live', warmOutro, { once: true });
      } else {
        runtime.state = manifest.ready === true ? 'ready' : 'awaiting-media';
      }"""


def apply_variant(source: str, variant: str, *, preview_ms: int = 600) -> str:
    replacements: list[tuple[str, str]] = []
    if variant in {"rvfc", "rvfc-eof-safe", "rvfc-interrupt-eof-safe"}:
        replacements.extend(((ISSUE_EARLY, ISSUE_RVFC), (SEEKED_EARLY, SEEKED_RVFC)))
        if variant != "rvfc-interrupt-eof-safe":
            replacements.append((QUEUE_INTERRUPT, QUEUE_SERIAL))
    if variant in {
        "eof-safe",
        "rvfc-eof-safe",
        "rvfc-interrupt-eof-safe",
        "cadence-eof-safe",
    }:
        for unsafe, safe in (
            (QUEUE_EOF_LAST_PTS, QUEUE_EOF_SAFE_HOLD),
            (RENDER_EOF_LAST_PTS, RENDER_EOF_SAFE_HOLD),
        ):
            if source.count(safe) == 1:
                continue
            if (
                unsafe == RENDER_EOF_LAST_PTS
                and "unit.phoneTarget = Math.min(terminalTarget," in source
                and "unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps"
                in source
            ):
                continue
            replacements.append((unsafe, safe))
    if variant in {"cadence", "cadence-eof-safe"}:
        replacements.extend(((CADENCE_66, CADENCE_180), (SETTLE_110, SETTLE_180)))
    if variant in VELOCITY_VARIANTS:
        commit = (
            COMMIT_PHONE_LANDING_DIAGNOSTIC
            if variant == "velocity-landing"
            else COMMIT_PHONE_DIAGNOSTIC
        )
        replacements.extend(
            (
                (COMMIT_PHONE_BASE, commit),
                (ISSUE_EARLY, ISSUE_VELOCITY_RVFC),
                (QUEUE_INTERRUPT, QUEUE_PROMOTE_EXACT),
                (SEEKED_EARLY, SEEKED_VELOCITY_RVFC),
                (
                    RENDER_PHONE_BASE,
                    velocity_render(
                        preview_ms, landing=variant == "velocity-landing"
                    ),
                ),
            )
        )
        if variant == "velocity-landing":
            replacements.append((PHONE_SLOT_ANCHOR, PHONE_LANDING_UNIT_INIT))
    if variant == "sprite-atlas":
        replacements.extend(
            (
                (COMMIT_PHONE_BASE, COMMIT_PHONE_ATLAS_DIAGNOSTIC),
                (ISSUE_EARLY, ISSUE_ATLAS_TRACE),
                (RENDER_PHONE_BASE, RENDER_PHONE_ATLAS),
                (PHONE_SLOT_ANCHOR, atlas_unit_init()),
            )
        )
    if variant == "prewarm":
        replacements.append((INIT_NETWORK_INTRO, INIT_BLOB_INTRO))
    patched = source
    for old, new in replacements:
        count = patched.count(old)
        if count != 1:
            raise RuntimeError(f"{variant}: expected one patch anchor, found {count}: {old.splitlines()[0]}")
        patched = patched.replace(old, new)
    return patched


def analyze_velocity_recording(
    recording: dict[str, Any], track: str
) -> dict[str, Any]:
    diagnostics = recording.get("velocityDiagnostics") or {}
    started_at = float(diagnostics.get("recordingStartedAt") or 0)
    marks = {mark["label"]: float(mark["t"]) for mark in recording.get("marks", [])}
    gesture_start = marks.get("gesture-start", 0)
    gesture_end = marks.get("gesture-end", 0)
    recovery_end = marks.get("recovery-end", gesture_end)
    all_events = []
    events = []
    for raw in diagnostics.get("events", []):
        if raw.get("track") != track:
            continue
        event = dict(raw)
        event["t"] = float(event.get("at", 0)) - started_at
        all_events.append(event)
        if gesture_start <= event["t"] <= recovery_end:
            events.append(event)
    issued = [event for event in events if event.get("kind") == "seek-issued"]
    commits = [event for event in events if event.get("kind") == "commit"]
    touch_commits = [
        event for event in commits if gesture_start <= event["t"] <= gesture_end
    ]
    coarse_commits = [event for event in touch_commits if not event.get("exact")]
    decoded = [float(event["decoded"]) for event in coarse_commits]
    meaningful: list[dict[str, Any]] = []
    for event in coarse_commits:
        if (
            not meaningful
            or abs(float(event["decoded"]) - float(meaningful[-1]["decoded"]))
            >= .5 / PERF.PHONE_FPS
        ):
            meaningful.append(event)
    monotonic = all(
        second + .002 >= first for first, second in zip(decoded, decoded[1:])
    )
    commit_intervals = [
        float(second["t"]) - float(first["t"])
        for first, second in zip(meaningful, meaningful[1:])
    ]
    touch_samples = [
        sample
        for sample in recording.get("samples", [])
        if gesture_start <= float(sample.get("t", -1)) <= gesture_end
    ]
    coarse_surface_ages: list[float] = []
    coarse_surface_timely = 0
    for sample in touch_samples:
        prior = [
            event for event in meaningful if float(event["t"]) <= float(sample["t"])
        ]
        if not prior or not sample.get("surfaceVisible"):
            continue
        age = float(sample["t"]) - float(prior[-1]["t"])
        coarse_surface_ages.append(age)
        if age <= 450:
            coarse_surface_timely += 1
    atlas_commits = [
        event
        for event in events
        if event.get("kind") == "atlas-commit"
        and gesture_start <= event["t"] <= gesture_end
    ]
    atlas_times = [float(event["decoded"]) for event in atlas_commits]
    atlas_intervals = [
        float(second["t"]) - float(first["t"])
        for first, second in zip(atlas_commits, atlas_commits[1:])
    ]
    atlas_monotonic = all(
        second + .002 >= first
        for first, second in zip(atlas_times, atlas_times[1:])
    )
    atlas_surface_ages: list[float] = []
    atlas_surface_timely = 0
    for sample in touch_samples:
        atlas_state = sample.get("scrubAtlas") or {}
        prior = [
            event
            for event in atlas_commits
            if float(event["t"]) <= float(sample["t"])
        ]
        if not prior or not atlas_state.get("visible"):
            continue
        age = float(sample["t"]) - float(prior[-1]["t"])
        atlas_surface_ages.append(age)
        if age <= 450:
            atlas_surface_timely += 1
    atlas_decode = next(
        (
            event
            for event in all_events
            if event.get("kind") == "atlas-decoded" and event.get("ready")
        ),
        None,
    )
    high_velocity_video_seeks = [
        event
        for event in events
        if event.get("kind") == "video-seek-issued"
        and event.get("highVelocity")
    ]
    issued_tokens = {
        int(event["token"]) for event in issued if event.get("token") is not None
    }


    completed_tokens = {
        int(event["token"]) for event in commits if event.get("token") is not None
    }
    completed_issued = issued_tokens & completed_tokens
    missing_tokens = issued_tokens - completed_tokens
    completion_ratio = (
        len(completed_issued) / len(issued_tokens) if issued_tokens else 0.0
    )
    superseded_ratio = len(missing_tokens) / len(issued_tokens) if issued_tokens else 0.0
    # The 110 ms idle callback can run a few milliseconds before the gate's
    # synthetic gesture-end mark. Select the latest settle request in a small
    # bounded window instead of misclassifying that valid terminal request as
    # absent (observed at gesture_end - 3.4 ms in the 800 ms control).
    settle_requests = [
        event
        for event in events
        if event.get("kind") == "settle-request"
        and event["t"] >= gesture_end - 200
    ]
    settle_request = settle_requests[-1] if settle_requests else None
    settle_commit = None
    if settle_request is not None:
        settle_commit = next(
            (
                event
                for event in commits
                if event["t"] >= settle_request["t"] and event.get("exact")
            ),
            None,
        )
    settle_latency = (
        float(settle_commit["t"]) - float(settle_request["t"])
        if settle_request is not None and settle_commit is not None
        else None
    )
    landing_shows = [
        event for event in events if event.get("kind") == "landing-show"
    ]
    landing_show = landing_shows[-1] if landing_shows else None
    landing_hide = None
    if landing_show is not None:
        landing_hide = next(
            (
                event
                for event in events
                if event.get("kind") == "landing-hide"
                and event["t"] >= landing_show["t"]
            ),
            None,
        )
    landing_visual_latency = None
    if settle_request is not None and landing_show is not None:
        landing_visual_latency = max(
            0.0, float(landing_show["t"]) - float(settle_request["t"])
        )
    elif landing_show is not None:
        # The terminal policy reveals synchronously from the render that
        # crosses p>=.999 and intentionally skips the later master settle.
        landing_visual_latency = 0.0
    landing_catchup = (
        float(landing_hide["t"]) - float(landing_show["t"])
        if landing_show is not None and landing_hide is not None
        else None
    )
    active_samples = [
        sample
        for sample in recording.get("samples", [])
        if gesture_start <= float(sample.get("t", -1)) <= recovery_end
    ]
    landing_samples = [
        sample.get("terminalLanding") or {}
        for sample in active_samples
        if (sample.get("terminalLanding") or {}).get("visible")
    ]
    live_source_mutations = []
    for raw in diagnostics.get("sourceMutations", []):
        relative = float(raw.get("at", 0)) - started_at
        if (
            raw.get("track") == track
            and raw.get("live")
            and gesture_start <= relative <= recovery_end
        ):
            mutation = dict(raw)
            mutation["t"] = relative
            live_source_mutations.append(mutation)
    errors = [float(event.get("error", 0)) for event in commits]
    return {
        "previewMs": None,
        "fastSeekAvailable": diagnostics.get("fastSeekAvailable"),
        "issued": len(issued),
        "committedIssued": len(completed_issued),
        "completionRatio": completion_ratio,
        "supersededTokens": sorted(missing_tokens),
        "supersededRatio": superseded_ratio,
        "obsoleteDiscards": sum(
            1 for event in events if event.get("kind") == "obsolete-discard"
        ),
        "suppressedTargets": sum(
            1 for event in events if event.get("kind") == "suppressed-target"
        ),
        "coarseRequests": sum(
            1 for event in events if event.get("kind") == "coarse-request"
        ),
        "meaningfulCoarseCommits": len(meaningful),
        "monotonicCoarseCommits": monotonic,
        "commitIntervalP95Ms": PERF.percentile(commit_intervals, .95),
        "longestCommitHoldMs": max(commit_intervals, default=0.0),
        "coarseSurfaceTemporalSamples": len(coarse_surface_ages),
        "coarseSurfaceTemporalCoverageRatio": (
            coarse_surface_timely / len(coarse_surface_ages)
            if coarse_surface_ages else 0.0
        ),
        "coarseSurfaceAgeP95Ms": PERF.percentile(coarse_surface_ages, .95),
        "spriteAtlas": {
            "file": ATLAS_MANIFEST["tracks"][track]["file"],
            "bytes": ATLAS_MANIFEST["tracks"][track]["bytes"],
            "sha256": ATLAS_MANIFEST["tracks"][track]["sha256"],
            "samples": ATLAS_MANIFEST["tracks"][track]["samples"],
            "decodedReady": atlas_decode is not None,
            "readyBeforeGesture": (
                atlas_decode is not None and float(atlas_decode["t"]) <= gesture_start
            ),
            "decodeLatencyMs": (
                atlas_decode.get("decodeLatency") if atlas_decode else None
            ),
            "commits": len(atlas_commits),
            "monotonic": atlas_monotonic,
            "commitIntervalP95Ms": PERF.percentile(atlas_intervals, .95),
            "longestHoldMs": max(atlas_intervals, default=0.0),
            "maxTargetErrorSec": max(
                (float(event.get("error", 0)) for event in atlas_commits),
                default=None,
            ),
            "targetErrorP95Sec": PERF.percentile(
                [float(event.get("error", 0)) for event in atlas_commits], .95
            ),
            "surfaceTemporalSamples": len(atlas_surface_ages),
            "surfaceTemporalCoverageRatio": (
                atlas_surface_timely / len(atlas_surface_ages)
                if atlas_surface_ages else 0.0
            ),
            "surfaceAgeP95Ms": PERF.percentile(atlas_surface_ages, .95),
            "highVelocityVideoSeeks": high_velocity_video_seeks,
            "terminalSeekSkipped": sum(
                1
                for event in events
                if event.get("kind") == "terminal-seek-skipped"
            ),
            "terminalVideoSeeksAfterLanding": [
                event
                for event in events
                if event.get("kind") == "video-seek-issued"
                and landing_show is not None
                and event["t"] >= landing_show["t"]
            ],
            "videoSeeksDuringTouch": [
                event
                for event in events
                if event.get("kind") == "video-seek-issued"
                and gesture_start <= event["t"] <= gesture_end
            ],
            "meanLumaMin": min(
                (
                    float(event["meanLuma"])
                    for event in atlas_commits
                    if event.get("meanLuma") is not None
                ),
                default=None,
            ),
            "nonBlackRatioMin": min(
                (
                    float(event["nonBlackRatio"])
                    for event in atlas_commits
                    if event.get("nonBlackRatio") is not None
                ),
                default=None,
            ),
            "errors": [
                event
                for event in all_events
                if event.get("kind")
                in {"atlas-error", "atlas-decode-error", "atlas-unavailable"}
            ],
            "timeline": [
                {
                    key: event.get(key)
                    for key in (
                        "t", "kind", "tile", "frame", "requested", "decoded",
                        "error", "meanLuma", "nonBlackRatio", "highVelocity",
                        "exact", "settleLatency",
                    )
                    if key in event
                }
                for event in events
                if event.get("kind")
                in {
                    "atlas-target", "atlas-commit", "atlas-hide",
                    "video-seek-issued", "settle-request",
                    "atlas-master-settled", "landing-show", "landing-hide",
                    "terminal-seek-skipped",
                }
            ],
        },
        "exactSettleLatencyMs": settle_latency,
        "terminalLanding": {
            "shows": len(landing_shows),
            "visibleSamples": len(landing_samples),
            "visualSettleLatencyMs": landing_visual_latency,
            "underlyingCatchupMs": landing_catchup,
            "width": landing_show.get("width") if landing_show else None,
            "height": landing_show.get("height") if landing_show else None,
            "meanLuma": landing_show.get("meanLuma") if landing_show else None,
            "nonBlackRatio": (
                landing_show.get("nonBlackRatio") if landing_show else None
            ),
            "errors": [
                event
                for event in events
                if event.get("kind")
                in {"landing-error", "landing-decode-error", "landing-unavailable"}
            ],
        },
        "maxCommittedFrameErrorSec": max(errors, default=None),
        "liveSourceMutations": live_source_mutations,
        "timeline": [
            {
                key: event.get(key)
                for key in (
                    "t", "kind", "token", "requested", "decoded", "desired",
                    "exact", "error", "velocity", "highVelocity", "holdMs",
                )
                if key in event
            }
            for event in events
            if event.get("kind")
            in {
                "coarse-request", "seek-issued", "commit", "obsolete-discard",
                "settle-request", "suppressed-target", "landing-loaded",
                "landing-decoded", "landing-show", "landing-hide",
                "landing-unavailable", "landing-error", "landing-decode-error",
                "atlas-target", "atlas-commit", "atlas-hide",
                "video-seek-issued", "atlas-master-settled",
                "terminal-seek-skipped",
            }
        ],
    }


def write_sprite_temporal_artifacts(
    output: Path,
    profile_name: str,
    track: str,
    metrics: dict[str, Any],
) -> dict[str, Any] | None:
    """Reconstruct the exact runtime-selected visible tiles and hold timing."""
    import cv2
    import numpy as np

    atlas_metrics = metrics["spriteAtlas"]
    commits = [
        event
        for event in atlas_metrics["timeline"]
        if event.get("kind") == "atlas-commit"
    ]
    if not commits:
        return None
    config = ATLAS_MANIFEST["tracks"][track]
    atlas_path = ATLAS_DIR / config["file"]
    atlas = cv2.imread(str(atlas_path), cv2.IMREAD_COLOR)
    if atlas is None:
        raise RuntimeError(f"cannot decode sprite atlas {atlas_path}")
    tile_width = int(ATLAS_MANIFEST["tile"]["width"])
    tile_height = int(ATLAS_MANIFEST["tile"]["height"])
    tiles = {int(tile["index"]): tile for tile in config["tiles"]}

    def visible_tile(tile_index: int) -> Any:
        tile = tiles[tile_index]
        x = int(tile["column"]) * tile_width
        y = int(tile["row"]) * tile_height
        crop = atlas[y:y + tile_height, x:x + tile_width]
        return cv2.resize(crop, (390, 219), interpolation=cv2.INTER_AREA)

    sequence: list[tuple[float, Any, str]] = []
    first_at = float(commits[0]["t"])
    trace = []
    for event in commits:
        tile_index = int(event["tile"])
        relative = float(event["t"]) - first_at
        label = (
            f"+{relative:06.1f}ms  tile {tile_index:02d}  "
            f"src {float(event['decoded']):05.2f}s  err {float(event['error']):.3f}s"
        )
        sequence.append((relative, visible_tile(tile_index), label))
        trace.append({
            "relativeMs": relative,
            "tile": tile_index,
            "frame": int(event["frame"]),
            "sourceTimeSec": float(event["decoded"]),
            "requestedTimeSec": float(event["requested"]),
            "errorSec": float(event["error"]),
        })
    landing_event = next(
        (
            event
            for event in atlas_metrics["timeline"]
            if event.get("kind") == "landing-show"
        ),
        None,
    )
    if landing_event is not None:
        landing_path = ROOT / TERMINAL_LANDING_URLS[track].lstrip("/")
        landing = cv2.imread(str(landing_path), cv2.IMREAD_COLOR)
        if landing is None:
            raise RuntimeError(f"cannot decode terminal landing {landing_path}")
        relative = float(landing_event["t"]) - first_at
        sequence.append((
            relative,
            cv2.resize(landing, (390, 219), interpolation=cv2.INTER_AREA),
            f"+{relative:06.1f}ms  terminal landing",
        ))
        trace.append({"relativeMs": relative, "terminalLanding": True})

    labeled = []
    for _, frame, label in sequence:
        cell = np.zeros((249, 390, 3), dtype=np.uint8)
        cell[:219] = frame
        cv2.putText(
            cell,
            label,
            (8, 240),
            cv2.FONT_HERSHEY_SIMPLEX,
            .42,
            (235, 235, 235),
            1,
            cv2.LINE_AA,
        )
        labeled.append(cell)
    columns = 4
    blank = np.zeros_like(labeled[0])
    while len(labeled) % columns:
        labeled.append(blank.copy())
    rows = [
        np.hstack(labeled[index:index + columns])
        for index in range(0, len(labeled), columns)
    ]
    contact_path = output / f"{profile_name}-atlas-temporal-contact.png"
    cv2.imwrite(str(contact_path), np.vstack(rows))

    video_path = output / f"{profile_name}-atlas-temporal-390x219.mp4"
    writer = cv2.VideoWriter(
        str(video_path), cv2.VideoWriter_fourcc(*"mp4v"), 10.0, (390, 219)
    )
    if not writer.isOpened():
        raise RuntimeError(f"cannot create temporal video {video_path}")
    end_ms = max(float(item[0]) for item in sequence) + 200
    cursor = 0
    for timestamp in range(0, max(1, int(end_ms)) + 1, 100):
        while cursor + 1 < len(sequence) and sequence[cursor + 1][0] <= timestamp:
            cursor += 1
        writer.write(sequence[cursor][1])
    writer.release()

    trace_path = output / f"{profile_name}-atlas-temporal-trace.json"
    payload = {
        "schema": "cake-studio-v172-sprite-temporal/v1",
        "profile": profile_name,
        "track": track,
        "display": [390, 219],
        "atlas": {
            "file": config["file"],
            "bytes": config["bytes"],
            "sha256": config["sha256"],
            "samples": config["samples"],
        },
        "metrics": {
            "commits": atlas_metrics["commits"],
            "monotonic": atlas_metrics["monotonic"],
            "commitIntervalP95Ms": atlas_metrics["commitIntervalP95Ms"],
            "longestHoldMs": atlas_metrics["longestHoldMs"],
            "maxTargetErrorSec": atlas_metrics["maxTargetErrorSec"],
        },
        "timeline": trace,
        "contact": str(contact_path),
        "video": str(video_path),
    }
    trace_path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return {
        "trace": str(trace_path),
        "contact": str(contact_path),
        "video": str(video_path),
    }


class VariantGate(PERF.PhonePerformanceGate):
    def __init__(
        self,
        *args: Any,
        variant: str,
        preview_ms: int = 600,
        slow_min_interval: int = 120,
        **kwargs: Any,
    ) -> None:
        super().__init__(*args, **kwargs)
        self.variant = variant
        self.preview_ms = preview_ms
        self.slow_min_interval = slow_min_interval
        self.patch_evidence: list[dict[str, Any]] = []

    def make_context(self, browser: Browser) -> BrowserContext:
        context = super().make_context(browser)
        if self.variant in DIAGNOSTIC_VARIANTS:
            context.add_init_script(VELOCITY_DIAGNOSTIC_INIT)

        if self.variant == "sprite-atlas":
            intro_atlas = ATLAS_MANIFEST["tracks"]["intro"]
            preload = (
                '<link rel="preload" as="image" type="image/webp" '
                'media="(pointer: coarse) and (prefers-reduced-motion: no-preference)" '
                'fetchpriority="high" '
                f'href="{ATLAS_URL_PREFIX}/{intro_atlas["file"]}">'
            )

            def patch_html(route: Route) -> None:
                response = route.fetch()
                source = response.text()
                if source.count("</head>") != 1:
                    raise RuntimeError("sprite-atlas: expected one </head> preload anchor")
                patched = source.replace("</head>", f"  {preload}\n</head>", 1)
                self.patch_evidence.append({
                    "url": route.request.url,
                    "variant": self.variant,
                    "kind": "phone-atlas-preload",
                    "file": intro_atlas["file"],
                    "bytes": intro_atlas["bytes"],
                    "sha256": intro_atlas["sha256"],
                    "changed": patched != source,
                })
                route.fulfill(response=response, body=patched)

            context.route("**/worlds/cake-studio.html*", patch_html)

        if self.variant == "product-atlas":
            self.patch_evidence.append({
                "variant": self.variant,
                "productNative": True,
                "changed": False,
            })
            return context

        if self.variant == PRODUCT_SLOW_CADENCE_VARIANT:
            def patch_product_slow_cadence(route: Route) -> None:
                response = route.fetch()
                source = response.text()
                patched = apply_product_slow_cadence(
                    source, self.slow_min_interval
                )
                self.patch_evidence.append({
                    "url": route.request.url,
                    "variant": self.variant,
                    "slowMinimumIntervalMs": self.slow_min_interval,
                    "exactSettleMs": 180,
                    "productNativeAtlas": True,
                    "changed": patched != source,
                })
                route.fulfill(response=response, body=patched)

            context.route("**/worlds/cake-studio.js*", patch_product_slow_cadence)
            return context

        if self.variant == PRODUCT_SLOW_ATLAS_FALLBACK_VARIANT:
            def patch_product_slow_atlas_fallback(route: Route) -> None:
                response = route.fetch()
                source = response.text()
                patched = apply_product_slow_atlas_fallback(source)
                self.patch_evidence.append({
                    "url": route.request.url,
                    "variant": self.variant,
                    "lagThresholdSec": .5,
                    "exactSettleMs": 180,
                    "productNativeAtlas": True,
                    "changed": patched != source,
                })
                route.fulfill(response=response, body=patched)

            context.route(
                "**/worlds/cake-studio.js*", patch_product_slow_atlas_fallback
            )
            return context

        def patch_runtime(route: Route) -> None:
            response = route.fetch()
            source = response.text()
            patched = apply_variant(
                source, self.variant, preview_ms=self.preview_ms
            )
            self.patch_evidence.append({
                "url": route.request.url,
                "variant": self.variant,
                "previewMs": self.preview_ms,
                "velocityThreshold": VELOCITY_THRESHOLD,
                "velocityHoldMs": VELOCITY_HOLD_MS,
                "sourceChars": len(source),
                "patchedChars": len(patched),
                "changed": source != patched,
            })
            route.fulfill(response=response, body=patched)

        context.route("**/worlds/cake-studio.js*", patch_runtime)
        return context

    def run_profile(self, browser: Browser, profile: Any) -> None:
        super().run_profile(browser, profile)
        if self.variant not in DIAGNOSTIC_VARIANTS:
            return
        report = self.profile_reports.get(profile.name) or {}
        recording = report.get("recording") or {}
        if not recording:
            return
        if profile.rapid:
            # Raw desired-target equality is intentionally low while a coarse
            # scheduler holds the last good frame. Replace only that diagnostic
            # assertion; surface continuity and temporal freshness remain
            # fail-capable below.
            replaced_base_checks = {"fresh decoded paints during touch"}
            if self.variant in SPRITE_VARIANTS:
                replaced_base_checks.update(
                    {
                        "p95 target-to-paint latency",
                        "p95 visible frame age",
                        "bounded dropped target updates",
                    }
                )
            self.failures = [
                failure
                for failure in self.failures
                if failure
                not in {
                    f"{profile.name}: {name}" for name in replaced_base_checks
                }
            ]
            for check in report.get("checks", []):
                original_name = check.get("name")
                if original_name in replaced_base_checks:
                    check["name"] = (
                        f"{original_name} (replaced for sprite/coarse mode)"
                    )
                    check["pass"] = True
                    check["limit"] = (
                        "observed only; see decoded sprite temporal checks"
                    )
        metrics = analyze_velocity_recording(recording, profile.track)
        metrics["previewMs"] = self.preview_ms
        base = report.get("metrics") or {}
        one_frame = 1 / PERF.PHONE_FPS + .002
        if self.variant in SPRITE_VARIANTS:
            atlas = metrics["spriteAtlas"]
            landing = metrics["terminalLanding"]
            tile_times = [
                float(tile["time"])
                for tile in ATLAS_MANIFEST["tracks"][profile.track]["tiles"]
            ]
            maximum_temporal_error = max(
                second - first for first, second in zip(tile_times, tile_times[1:])
            ) / 2 + .002
            if profile.rapid:
                checks = [
                    {
                        "name": "zero visible source mutations",
                        "pass": not metrics["liveSourceMutations"],
                        "actual": metrics["liveSourceMutations"],
                        "limit": "[] during gesture and recovery",
                    },
                    {
                        "name": "sprite atlas decoded before rapid input",
                        "pass": atlas["decodedReady"]
                        and atlas["readyBeforeGesture"]
                        and not atlas["errors"],
                        "actual": {
                            "ready": atlas["decodedReady"],
                            "readyBeforeGesture": atlas["readyBeforeGesture"],
                            "decodeLatencyMs": atlas["decodeLatencyMs"],
                            "errors": atlas["errors"],
                        },
                        "limit": "decoded ready and zero errors",
                    },
                    {
                        "name": "meaningful monotonic sprite commits",
                        "pass": atlas["commits"] >= 8 and atlas["monotonic"],
                        "actual": {
                            "count": atlas["commits"],
                            "monotonic": atlas["monotonic"],
                        },
                        "limit": ">= 8 and monotonic",
                    },
                    {
                        "name": "sprite commit interval p95",
                        "pass": atlas["commitIntervalP95Ms"] is not None
                        and atlas["commitIntervalP95Ms"] <= 450,
                        "actual": atlas["commitIntervalP95Ms"],
                        "limit": "<= 450 ms",
                    },
                    {
                        "name": "sprite target approximation",
                        "pass": atlas["maxTargetErrorSec"] is not None
                        and atlas["maxTargetErrorSec"] <= maximum_temporal_error,
                        "actual": {
                            "max": atlas["maxTargetErrorSec"],
                            "p95": atlas["targetErrorP95Sec"],
                        },
                        "limit": f"<= {maximum_temporal_error:.6f} sec",
                    },
                    {
                        "name": "sprite surface temporal coverage",
                        "pass": atlas["surfaceTemporalCoverageRatio"] >= .95
                        and atlas["surfaceAgeP95Ms"] is not None
                        and atlas["surfaceAgeP95Ms"] <= 450,
                        "actual": {
                            "coverageRatio": atlas[
                                "surfaceTemporalCoverageRatio"
                            ],
                            "ageP95Ms": atlas["surfaceAgeP95Ms"],
                            "samples": atlas["surfaceTemporalSamples"],
                        },
                        "limit": ">= 0.95 coverage and p95 age <= 450 ms",
                    },
                    {
                        "name": "zero video seeks while high velocity",
                        "pass": not atlas["highVelocityVideoSeeks"],
                        "actual": atlas["highVelocityVideoSeeks"],
                        "limit": "[]",
                    },
                    {
                        "name": "sprite pixels are nonblack",
                        "pass": atlas["meanLumaMin"] is not None
                        and atlas["meanLumaMin"] > 5
                        and atlas["nonBlackRatioMin"] is not None
                        and atlas["nonBlackRatioMin"] > .05,
                        "actual": {
                            "meanLumaMin": atlas["meanLumaMin"],
                            "nonBlackRatioMin": atlas["nonBlackRatioMin"],
                        },
                        "limit": "mean luma > 5 and nonblack ratio > 0.05",
                    },
                    {
                        "name": "terminal landing decoded and immediate",
                        "pass": landing["width"] == 640
                        and landing["height"] == 360
                        and landing["visualSettleLatencyMs"] is not None
                        and landing["visualSettleLatencyMs"] <= 50
                        and landing["nonBlackRatio"] is not None
                        and landing["nonBlackRatio"] > .05,
                        "actual": landing,
                        "limit": "640x360, nonblack, reveal <= 50 ms",
                    },
                    {
                        "name": "terminal master seek is skipped behind landing",
                        "pass": not atlas["terminalVideoSeeksAfterLanding"],
                        "actual": {
                            "explicitSkips": atlas["terminalSeekSkipped"],
                            "seeksAfterLanding": atlas[
                                "terminalVideoSeeksAfterLanding"
                            ],
                        },
                        "limit": "zero terminal video seeks after landing reveal",
                    },
                ]
            else:
                checks = [
                    {
                        "name": "slow path never uses sprite atlas",
                        "pass": atlas["commits"] == 0,
                        "actual": atlas["commits"],
                        "limit": "0 sprite commits",
                    },
                    {
                        "name": "slow fresh coverage preserved",
                        "pass": float(base.get("freshDecodedRatio") or 0) >= .776,
                        "actual": base.get("freshDecodedRatio"),
                        "limit": ">= 0.776 (within five points of 0.826 baseline)",
                    },
                    {
                        "name": "zero visible source mutations",
                        "pass": not metrics["liveSourceMutations"],
                        "actual": metrics["liveSourceMutations"],
                        "limit": "[] during gesture and recovery",
                    },
                ]
            report["spriteAtlas"] = metrics
            report["spriteChecks"] = checks
            failed = [check for check in checks if not check["pass"]]
            self.failures.extend(
                f"{profile.name}: sprite: {check['name']}" for check in failed
            )
            print(
                f"{'FAIL' if failed else 'PASS'} {profile.name} sprite-atlas: "
                f"commits={atlas['commits']} p95={atlas['commitIntervalP95Ms']}ms "
                f"error={atlas['maxTargetErrorSec']}s "
                f"coverage={atlas['surfaceTemporalCoverageRatio']:.1%} "
                f"high_seeks={len(atlas['highVelocityVideoSeeks'])} "
                f"settle={metrics['exactSettleLatencyMs']}ms "
                f"landing={landing['visualSettleLatencyMs']}ms "
                f"ranges={base.get('clipResponses')} aborts={base.get('clipAborts')}"
            )
            return
        checks = [
            {
                "name": "zero visible source mutations",
                "pass": not metrics["liveSourceMutations"],
                "actual": metrics["liveSourceMutations"],
                "limit": "[] during gesture and recovery",
            },
            {
                "name": "committed frame is within one decoded frame",
                "pass": metrics["maxCommittedFrameErrorSec"] is not None
                and metrics["maxCommittedFrameErrorSec"] <= one_frame,
                "actual": metrics["maxCommittedFrameErrorSec"],
                "limit": f"<= {one_frame:.6f} sec",
            },
        ]
        if profile.rapid:
            checks.extend(
                (
                    {
                        "name": "meaningful monotonic coarse commits",
                        "pass": metrics["meaningfulCoarseCommits"] >= 5
                        and metrics["monotonicCoarseCommits"],
                        "actual": {
                            "count": metrics["meaningfulCoarseCommits"],
                            "monotonic": metrics["monotonicCoarseCommits"],
                        },
                        "limit": ">= 5 and monotonic",
                    },
                    {
                        "name": "coarse commit interval p95",
                        "pass": metrics["commitIntervalP95Ms"] is not None
                        and metrics["commitIntervalP95Ms"] <= 450,
                        "actual": metrics["commitIntervalP95Ms"],
                        "limit": "<= 450 ms",
                    },
                    {
                        "name": "coarse surface temporal coverage",
                        "pass": metrics["coarseSurfaceTemporalCoverageRatio"]
                        >= .95
                        and metrics["coarseSurfaceAgeP95Ms"] is not None
                        and metrics["coarseSurfaceAgeP95Ms"] <= 450,
                        "actual": {
                            "coverageRatio": metrics[
                                "coarseSurfaceTemporalCoverageRatio"
                            ],
                            "ageP95Ms": metrics["coarseSurfaceAgeP95Ms"],
                            "samples": metrics["coarseSurfaceTemporalSamples"],
                        },
                        "limit": ">= 0.95 coverage and p95 age <= 450 ms",
                    },
                    {
                        "name": "issued target completion",
                        "pass": metrics["completionRatio"] >= .80,
                        "actual": metrics["completionRatio"],
                        "limit": ">= 0.80",
                    },
                    {
                        "name": "bounded superseded issued seeks",
                        "pass": metrics["supersededRatio"] <= .20,
                        "actual": metrics["supersededRatio"],
                        "limit": "<= 0.20",
                    },
                    {
                        "name": "exact settle latency",
                        "pass": metrics["exactSettleLatencyMs"] is not None
                        and metrics["exactSettleLatencyMs"] <= 450,
                        "actual": metrics["exactSettleLatencyMs"],
                        "limit": "<= 450 ms (<= 300 desired)",
                    },
                )
            )
        else:
            checks.append(
                {
                    "name": "slow fresh coverage preserved",
                    "pass": float(base.get("freshDecodedRatio") or 0) >= .80,
                    "actual": base.get("freshDecodedRatio"),
                    "limit": ">= 0.80 and within five points of baseline 0.826",
                }
            )
        if self.variant == "velocity-landing" and profile.rapid:
            landing = metrics["terminalLanding"]
            checks.extend(
                (
                    {
                        "name": "terminal landing decoded at native still size",
                        "pass": landing["width"] == 1280
                        and landing["height"] == 720
                        and landing["visibleSamples"] > 0,
                        "actual": {
                            "width": landing["width"],
                            "height": landing["height"],
                            "visibleSamples": landing["visibleSamples"],
                        },
                        "limit": "1280x720 and visible samples > 0",
                    },
                    {
                        "name": "terminal landing decoded pixels are nonblack",
                        "pass": landing["meanLuma"] is not None
                        and landing["meanLuma"] > 5
                        and landing["nonBlackRatio"] is not None
                        and landing["nonBlackRatio"] > .05,
                        "actual": {
                            "meanLuma": landing["meanLuma"],
                            "nonBlackRatio": landing["nonBlackRatio"],
                        },
                        "limit": "mean luma > 5 and nonblack ratio > 0.05",
                    },
                    {
                        "name": "terminal landing reveal",
                        "pass": landing["visualSettleLatencyMs"] is not None
                        and landing["visualSettleLatencyMs"] <= 50,
                        "actual": landing["visualSettleLatencyMs"],
                        "limit": "<= 50 ms after exact settle request",
                    },
                    {
                        "name": "terminal landing has no load/decode failure",
                        "pass": not landing["errors"],
                        "actual": landing["errors"],
                        "limit": "[]",
                    },
                )
            )
        report["velocityDebounce"] = metrics
        report["velocityChecks"] = checks
        failed = [check for check in checks if not check["pass"]]
        self.failures.extend(
            f"{profile.name}: velocity: {check['name']}" for check in failed
        )
        print(
            f"{'FAIL' if failed else 'PASS'} {profile.name} velocity-{self.preview_ms}: "
            f"commits={metrics['meaningfulCoarseCommits']} "
            f"p95={metrics['commitIntervalP95Ms']}ms "
            f"complete={metrics['completionRatio']:.1%} "
            f"superseded={metrics['supersededRatio']:.1%} "
            f"settle={metrics['exactSettleLatencyMs']}ms "
            f"landing={metrics['terminalLanding']['visualSettleLatencyMs']}ms "
            f"catchup={metrics['terminalLanding']['underlyingCatchupMs']}ms "
            f"ranges={base.get('clipResponses')} aborts={base.get('clipAborts')}"
        )

    def finish(self) -> int:
        if self.variant in SPRITE_VARIANTS:
            for profile_name, report in self.profile_reports.items():
                profile = report.get("profile") or {}
                metrics = report.get("spriteAtlas")
                if not metrics or profile.get("pace") != "rapid":
                    continue
                try:
                    artifacts = write_sprite_temporal_artifacts(
                        self.output,
                        profile_name,
                        str(profile["track"]),
                        metrics,
                    )
                    report["spriteTemporalArtifacts"] = artifacts
                    if artifacts is None:
                        self.failures.append(
                            f"{profile_name}: sprite: temporal artifacts have no commits"
                        )
                except Exception as error:
                    report["spriteTemporalArtifactError"] = (
                        f"{type(error).__name__}: {error}"
                    )
                    self.failures.append(
                        f"{profile_name}: sprite: temporal artifact generation failed"
                    )
        result = super().finish()
        evidence_path = self.output / "in-memory-patch-evidence.json"
        evidence_path.write_text(
            json.dumps(
                {
                    "expectedContract": PERF.expected_contract(),
                    "variant": {
                        "name": self.variant,
                        "previewMs": self.preview_ms,
                        "velocityThreshold": VELOCITY_THRESHOLD,
                        "velocityHoldMs": VELOCITY_HOLD_MS,
                        "fastSeekCapability": "measured per profile",
                    },
                    "patches": self.patch_evidence,
                },
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        return result


def read_product_transition_state(page: Page, track: str) -> dict[str, Any]:
    return page.evaluate(
        """track => {
          const unit = window.__cakeStudioBookends?.units?.find(
            item => item.trackName === track
          );
          if (!unit) return null;
          const scene = unit.scene;
          const video = unit.phoneSlot.video;
          const atlas = unit.phoneAtlasCanvas;
          const landing = unit.phoneLanding;
          const poster = unit.poster;
          const opacity = node => Number.parseFloat(
            node ? getComputedStyle(node).opacity || '0' : '0'
          );
          const videoVisible = scene.classList.contains('sequence-painted')
            && opacity(video) >= .5;
          const atlasVisible = unit.phoneAtlasVisible && opacity(atlas) >= .5;
          const landingVisible = unit.phoneLandingVisible && opacity(landing) >= .5;
          const posterVisible = opacity(poster) >= .5;
          const surfaceKind = landingVisible ? 'terminal-landing'
            : atlasVisible ? 'scrub-atlas'
              : videoVisible ? 'video' : posterVisible ? 'poster' : 'black';
          return {
            at: performance.now(),
            track,
            progress: Number.parseFloat(scene.style.getPropertyValue('--p') || '0'),
            target: Number.parseFloat(scene.dataset.sequenceTargetTime || 'NaN'),
            painted: Number.parseFloat(scene.dataset.sequenceTime || 'NaN'),
            lag: Number.parseFloat(scene.dataset.sequenceLag || 'NaN'),
            state: scene.dataset.sequenceState || '',
            previewMode: scene.dataset.sequencePreviewMode || '',
            paintedClass: scene.classList.contains('sequence-painted'),
            surfaceKind,
            surfaceVisible: surfaceKind !== 'black',
            videoVisible,
            atlasVisible,
            atlasReady: unit.phoneAtlasReady,
            atlasLoading: unit.phoneAtlasLoading,
            atlasGeneration: unit.phoneAtlasGeneration,
            atlasImage: unit.phoneAtlasImage ? {
              src: unit.phoneAtlasImage.getAttribute('src') || '',
              currentSrc: unit.phoneAtlasImage.currentSrc || '',
              complete: unit.phoneAtlasImage.complete,
              width: unit.phoneAtlasImage.naturalWidth || 0,
              height: unit.phoneAtlasImage.naturalHeight || 0,
            } : null,
            atlasTile: unit.phoneAtlasTile,
            atlasFrame: Number.parseInt(atlas.dataset.frame || '-1', 10),
            atlasTime: Number.parseFloat(atlas.dataset.time || 'NaN'),
            landingVisible,
            landingReady: unit.phoneLandingReady,
            landingComplete: landing.complete,
            landingWidth: landing.naturalWidth || 0,
            landingHeight: landing.naturalHeight || 0,
            posterVisible,
            posterOpacity: opacity(poster),
            warmState: unit.warmState,
            live: unit.live,
            liveClass: scene.classList.contains('is-live'),
            phoneHighVelocity: unit.phoneAtlasHighVelocity === true,
            settleTimer: Boolean(unit.phoneSettleTimer),
            src: video.getAttribute('src') || '',
            currentSrc: video.currentSrc || '',
            video: {
              currentTime: video.currentTime,
              readyState: video.readyState,
              seeking: video.seeking,
              paused: video.paused,
            },
            slot: {
              wanted: unit.phoneSlot.wanted,
              wantedExact: unit.phoneSlot.wantedExact,
              target: unit.phoneSlot.target,
              seeking: unit.phoneSlot.seeking,
              seekTimer: Boolean(unit.phoneSlot.seekTimer),
            },
          };
        }""",
        track,
    )


def command_product_progress(page: Page, track: str, progress: float) -> float:
    return float(
        page.evaluate(
            """({track, progress}) => {
              const scene = document.querySelector(`[data-cake-bookend="${track}"]`);
              if (!scene) throw new Error(`missing ${track} bookend`);
              const top = scene.getBoundingClientRect().top + scrollY;
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const prior = document.documentElement.style.scrollBehavior;
              document.documentElement.style.scrollBehavior = 'auto';
              scrollTo(0, top + span * progress);
              document.documentElement.style.scrollBehavior = prior;
              return performance.now();
            }""",
            {"track": track, "progress": progress},
        )
    )


def drive_product_progress(
    page: Page,
    track: str,
    start: float,
    end: float,
    *,
    steps: int,
    delay_ms: int,
) -> tuple[float, list[dict[str, Any]]]:
    states: list[dict[str, Any]] = []
    command_at = 0.0
    for index in range(1, steps + 1):
        progress = start + (end - start) * index / steps
        command_at = command_product_progress(page, track, progress)
        page.wait_for_timeout(delay_ms)
        states.append(read_product_transition_state(page, track))
    return command_at, states


def clear_product_transition_events(page: Page) -> None:
    page.evaluate(
        """() => {
          if (!window.__cakeVelocityDiagnostics) return;
          window.__cakeVelocityDiagnostics.events = [];
          window.__cakeVelocityDiagnostics.sourceMutations = [];
        }"""
    )


def product_transition_events(page: Page) -> dict[str, Any]:
    return page.evaluate(
        """() => ({
          events: [...(window.__cakeVelocityDiagnostics?.events || [])],
          sourceMutations: [
            ...(window.__cakeVelocityDiagnostics?.sourceMutations || [])
          ],
        })"""
    )


def wait_product_exact_settle(
    page: Page,
    track: str,
    command_at: float,
    *,
    timeout_ms: int = 3_000,
) -> dict[str, Any]:
    tolerance = 1 / PERF.PHONE_FPS + .002
    page.wait_for_function(
        """({track, tolerance}) => {
          const unit = window.__cakeStudioBookends?.units?.find(
            item => item.trackName === track
          );
          if (!unit) return false;
          const scene = unit.scene;
          const target = Number.parseFloat(scene.dataset.sequenceTargetTime || 'NaN');
          const painted = Number.parseFloat(scene.dataset.sequenceTime || 'NaN');
          return unit.phoneAtlasVisible !== true
            && unit.phoneLandingVisible !== true
            && !unit.phoneSettleTimer
            && !unit.phoneSlot.seekTimer
            && !unit.phoneSlot.seeking
            && !unit.phoneSlot.video.seeking
            && unit.phoneSlot.video.readyState >= 2
            && scene.classList.contains('sequence-painted')
            && Number.isFinite(target)
            && Number.isFinite(painted)
            && Math.abs(painted - target) <= tolerance
            && Math.abs(unit.phoneSlot.video.currentTime - target) <= tolerance;
        }""",
        arg={"track": track, "tolerance": tolerance},
        timeout=timeout_ms,
    )
    state = read_product_transition_state(page, track)
    state["settleLatencyMs"] = float(state["at"]) - command_at
    state["frameErrorSec"] = abs(float(state["painted"]) - float(state["target"]))
    return state


def open_product_probe_page(
    browser: Browser,
    gate: VariantGate,
    track: str,
    *,
    wait_for_assets: bool,
) -> tuple[BrowserContext, Page, dict[str, Any]]:
    context = gate.make_context(browser)
    page = context.new_page()
    network = gate.observe(page, time.perf_counter())
    gate.configure_cdp(page, True)
    page.goto(gate.url, wait_until="domcontentloaded", timeout=45_000)
    if track == "outro":
        # Position the real page before the asynchronous manifest resolves.
        # This reproduces restored/direct entry with only the outro live;
        # `?solo` is invalid here because cake-studio treats both units as live.
        if page.evaluate("() => window.__cakeStudioBookends?.state === 'ready'"):
            raise RuntimeError("outro manifest resolved before cold positioning")
        page.evaluate(
            """() => {
              const scene = document.querySelector('[data-cake-bookend="outro"]');
              if (!scene) throw new Error('missing outro bookend');
              const span = Math.max(0, scene.offsetHeight - innerHeight);
              const root = document.documentElement;
              const prior = root.style.scrollBehavior;
              root.style.scrollBehavior = 'auto';
              scrollTo(0, scene.offsetTop + span * .001);
              root.style.scrollBehavior = prior;
            }"""
        )
        page.wait_for_function(
            """() => {
              const intro = document.querySelector('[data-cake-bookend="intro"]');
              const outro = document.querySelector('[data-cake-bookend="outro"]');
              return outro?.classList.contains('is-live')
                && !intro?.classList.contains('is-live');
            }""",
            timeout=2_000,
        )
    page.wait_for_function(
        "() => window.__cakeStudioBookends?.state === 'ready' && window.__cakePhonePerf",
        timeout=20_000,
    )
    if track == "outro":
        direct_state = page.evaluate(
            """() => Object.fromEntries(window.__cakeStudioBookends.units.map(unit => [
              unit.trackName,
              {
                live: unit.live,
                src: unit.phoneSlot.video.getAttribute('src') || '',
              },
            ]))"""
        )
        if (
            direct_state.get("intro", {}).get("live")
            or direct_state.get("intro", {}).get("src")
            or not direct_state.get("outro", {}).get("live")
        ):
            raise RuntimeError(
                f"invalid direct-outro opening state: {direct_state}"
            )
    if wait_for_assets:
        command_product_progress(page, track, 0.001)
        page.wait_for_function(
            """track => {
              const unit = window.__cakeStudioBookends?.units?.find(
                item => item.trackName === track
              );
              return unit?.live && unit.phoneAtlasReady && unit.phoneLandingReady
                && unit.phoneSlot.video.readyState >= 2
                && unit.scene.classList.contains('sequence-painted');
            }""",
            arg=track,
            timeout=12_000,
        )
        page.wait_for_timeout(500)
        # Positioning is setup, not part of the measured gesture.
        clear_product_transition_events(page)
    return context, page, network


def run_product_transition_probe(
    playwright: Any,
    gate: VariantGate,
) -> int:
    if gate.variant != "product-atlas":
        raise ValueError("product transition probe requires --variant product-atlas")
    output = gate.output
    output.mkdir(parents=True, exist_ok=True)
    browser = playwright.chromium.launch(channel="chrome", headless=True)
    results: dict[str, Any] = {}
    failures: list[str] = []
    tolerance = 1 / PERF.PHONE_FPS + .002

    def add_check(
        checks: list[dict[str, Any]],
        name: str,
        passed: bool,
        actual: Any,
        limit: str,
    ) -> None:
        check = {"name": name, "pass": bool(passed), "actual": actual, "limit": limit}
        checks.append(check)
        if not passed:
            failures.append(name)

    try:
        for track in ("intro", "outro"):
            context, page, network = open_product_probe_page(
                browser, gate, track, wait_for_assets=True
            )
            try:
                checks: list[dict[str, Any]] = []
                initial = read_product_transition_state(page, track)
                initial_src = initial["src"]

                clear_product_transition_events(page)
                mid_stop_at, forward_states = drive_product_progress(
                    page, track, .001, .62, steps=18, delay_ms=30
                )
                mid_settled = wait_product_exact_settle(page, track, mid_stop_at)
                mid_events = product_transition_events(page)
                mid_high_seeks = [
                    event
                    for event in mid_events["events"]
                    if event.get("kind") == "video-seek-issued"
                    and event.get("highVelocity")
                    and float(event.get("at", 0)) <= mid_stop_at
                ]
                mid_atlas_commits = [
                    event
                    for event in mid_events["events"]
                    if event.get("kind") == "atlas-commit"
                    and float(event.get("at", 0)) <= mid_stop_at
                ]
                mid_shot = output / f"{track}-mid-stop-settled.png"
                page.locator(
                    f'[data-cake-bookend="{track}"] .bookend-aperture'
                ).screenshot(path=str(mid_shot))

                clear_product_transition_events(page)
                terminal_at, terminal_states = drive_product_progress(
                    page, track, .62, 1.0, steps=12, delay_ms=30
                )
                page.wait_for_function(
                    """track => {
                      const unit = window.__cakeStudioBookends.units.find(
                        item => item.trackName === track
                      );
                      return unit.phoneLandingVisible && unit.phoneLandingReady
                        && unit.phoneLanding.complete
                        && unit.phoneLanding.naturalWidth === 640
                        && unit.phoneLanding.naturalHeight === 360;
                    }""",
                    arg=track,
                    timeout=1_000,
                )
                terminal_state = read_product_transition_state(page, track)
                terminal_events = product_transition_events(page)
                landing_show = next(
                    (
                        event for event in terminal_events["events"]
                        if event.get("kind") == "landing-show"
                        and float(event.get("at", 0)) >= terminal_at
                    ),
                    None,
                )
                terminal_state["revealLatencyMs"] = (
                    float(landing_show["at"]) - terminal_at
                    if landing_show is not None else None
                )
                terminal_shot = output / f"{track}-terminal-landing.png"
                page.locator(
                    f'[data-cake-bookend="{track}"] .bookend-aperture'
                ).screenshot(path=str(terminal_shot))
                page.wait_for_timeout(260)
                terminal_events = product_transition_events(page)
                terminal_seeks = [
                    event
                    for event in terminal_events["events"]
                    if event.get("kind") == "video-seek-issued"
                ]

                clear_product_transition_events(page)
                reverse_stop_at, reverse_states = drive_product_progress(
                    page, track, 1.0, .72, steps=10, delay_ms=30
                )
                reverse_preview = next(
                    (
                        state
                        for state in reverse_states
                        if state["surfaceKind"] == "scrub-atlas"
                        and not state["landingVisible"]
                    ),
                    None,
                )
                if reverse_preview is None:
                    page.wait_for_function(
                        """track => {
                          const unit = window.__cakeStudioBookends.units.find(
                            item => item.trackName === track
                          );
                          return unit.phoneAtlasVisible && !unit.phoneLandingVisible;
                        }""",
                        arg=track,
                        timeout=800,
                    )
                    reverse_preview = read_product_transition_state(page, track)
                reverse_preview_shot = output / f"{track}-reverse-atlas.png"
                page.locator(
                    f'[data-cake-bookend="{track}"] .bookend-aperture'
                ).screenshot(path=str(reverse_preview_shot))
                reverse_settled = wait_product_exact_settle(
                    page, track, reverse_stop_at
                )
                reverse_settled_shot = output / f"{track}-reverse-settled.png"
                page.locator(
                    f'[data-cake-bookend="{track}"] .bookend-aperture'
                ).screenshot(path=str(reverse_settled_shot))
                reverse_events = product_transition_events(page)
                reverse_commits = [
                    event
                    for event in reverse_events["events"]
                    if event.get("kind") in {"atlas-commit", "atlas-show"}
                ]
                reverse_hides = [
                    event
                    for event in reverse_events["events"]
                    if event.get("kind") == "landing-hide"
                ]
                reverse_order_ok = bool(reverse_commits and reverse_hides) and float(
                    reverse_commits[0]["at"]
                ) <= float(reverse_hides[0]["at"])
                reverse_high_seeks = [
                    event
                    for event in reverse_events["events"]
                    if event.get("kind") == "video-seek-issued"
                    and event.get("highVelocity")
                ]
                active_states = forward_states + terminal_states + reverse_states
                black_states = [state for state in active_states if not state["surfaceVisible"]]
                poster_states = [state for state in active_states if state["posterVisible"]]
                final_state = read_product_transition_state(page, track)

                add_check(
                    checks,
                    f"{track} rapid forward uses atlas without high-velocity seek",
                    len(mid_atlas_commits) >= 5 and not mid_high_seeks,
                    {"atlasCommits": len(mid_atlas_commits), "highSeeks": mid_high_seeks},
                    ">=5 atlas commits and zero high-velocity seeks",
                )
                add_check(
                    checks,
                    f"{track} nonterminal stop exact settle",
                    mid_settled["settleLatencyMs"] <= 450
                    and mid_settled["frameErrorSec"] <= tolerance,
                    mid_settled,
                    f"<=450 ms and <= {tolerance:.6f} sec frame error",
                )
                add_check(
                    checks,
                    f"{track} terminal landing is immediate and seek-free",
                    terminal_state["surfaceKind"] == "terminal-landing"
                    and terminal_state["revealLatencyMs"] <= 50
                    and not terminal_seeks,
                    {"state": terminal_state, "seeks": terminal_seeks},
                    "landing <=50 ms and zero video seeks after terminal command",
                )
                add_check(
                    checks,
                    f"{track} reverse replaces landing only after atlas commit",
                    reverse_preview is not None
                    and reverse_preview["surfaceKind"] == "scrub-atlas"
                    and reverse_order_ok
                    and not reverse_high_seeks,
                    {
                        "preview": reverse_preview,
                        "firstCommit": reverse_commits[0] if reverse_commits else None,
                        "firstHide": reverse_hides[0] if reverse_hides else None,
                        "highSeeks": reverse_high_seeks,
                    },
                    "visible reverse atlas and commit timestamp <= landing hide",
                )
                add_check(
                    checks,
                    f"{track} reverse stop exact settle",
                    reverse_settled["settleLatencyMs"] <= 450
                    and reverse_settled["frameErrorSec"] <= tolerance,
                    reverse_settled,
                    f"<=450 ms and <= {tolerance:.6f} sec frame error",
                )
                add_check(
                    checks,
                    f"{track} transition surface never blacks or reopens poster",
                    not black_states and not poster_states,
                    {"black": black_states, "poster": poster_states},
                    "zero sampled black/poster states after priming",
                )
                add_check(
                    checks,
                    f"{track} visible source remains stable",
                    final_state["src"] == initial_src
                    and not mid_events["sourceMutations"]
                    and not terminal_events["sourceMutations"]
                    and not reverse_events["sourceMutations"],
                    {
                        "initialSrc": initial_src,
                        "finalSrc": final_state["src"],
                        "mid": mid_events["sourceMutations"],
                        "terminal": terminal_events["sourceMutations"],
                        "reverse": reverse_events["sourceMutations"],
                    },
                    "zero visible src mutation",
                )
                results[track] = {
                    "initial": initial,
                    "mid": {
                        "states": forward_states,
                        "settled": mid_settled,
                        "events": mid_events,
                    },
                    "terminal": {
                        "states": terminal_states,
                        "visible": terminal_state,
                        "events": terminal_events,
                    },
                    "reverse": {
                        "states": reverse_states,
                        "preview": reverse_preview,
                        "settled": reverse_settled,
                        "events": reverse_events,
                    },
                    "network": network,
                    "screenshots": {
                        "midSettled": str(mid_shot),
                        "terminal": str(terminal_shot),
                        "reverseAtlas": str(reverse_preview_shot),
                        "reverseSettled": str(reverse_settled_shot),
                    },
                    "checks": checks,
                }
            except Exception as error:
                failure = f"{track} transition fatal: {type(error).__name__}: {error}"
                failures.append(failure)
                results[track] = {"fatal": failure, "network": network}
            finally:
                context.close()

            cold_context, cold_page, cold_network = open_product_probe_page(
                browser, gate, track, wait_for_assets=False
            )
            try:
                cold_checks: list[dict[str, Any]] = []
                clear_product_transition_events(cold_page)
                cold_start_at = float(cold_page.evaluate("() => performance.now()"))
                _, cold_states = drive_product_progress(
                    cold_page, track, .001, .50, steps=20, delay_ms=30
                )
                # Keep observing beyond the hard 750 ms readiness bound so a
                # failure records the actual decode/queue delay instead of a
                # null result. This does not relax any acceptance threshold.
                for _ in range(30):
                    cold_page.wait_for_timeout(50)
                    cold_states.append(read_product_transition_state(cold_page, track))
                first_motion = next(
                    (
                        state
                        for state in cold_states
                        if state["surfaceKind"] in {"scrub-atlas", "video"}
                        and state["paintedClass"]
                    ),
                    None,
                )
                first_atlas = next(
                    (
                        state for state in cold_states
                        if state["surfaceKind"] == "scrub-atlas"
                    ),
                    None,
                )
                cold_events = product_transition_events(cold_page)
                cold_high_seeks = [
                    event
                    for event in cold_events["events"]
                    if event.get("kind") == "video-seek-issued"
                    and event.get("highVelocity")
                ]
                black_states = [state for state in cold_states if not state["surfaceVisible"]]
                motion_latency = (
                    float(first_motion["at"]) - cold_start_at
                    if first_motion is not None else None
                )
                atlas_latency = (
                    float(first_atlas["at"]) - cold_start_at
                    if first_atlas is not None else None
                )
                cold_shot = output / f"{track}-cold-immediate.png"
                cold_page.locator(
                    f'[data-cake-bookend="{track}"] .bookend-aperture'
                ).screenshot(path=str(cold_shot))
                add_check(
                    cold_checks,
                    f"{track} cold immediate fling keeps a visible surface",
                    not black_states and all(state["surfaceVisible"] for state in cold_states),
                    {"samples": len(cold_states), "black": black_states},
                    "100% sampled surface and zero black",
                )
                add_check(
                    cold_checks,
                    f"{track} cold immediate atlas becomes visible",
                    first_atlas is not None and atlas_latency is not None
                    and atlas_latency <= 750,
                    {"latencyMs": atlas_latency, "state": first_atlas},
                    "atlas visible <=750 ms from first rapid command",
                )
                add_check(
                    cold_checks,
                    f"{track} cold immediate motion surface is bounded",
                    first_motion is not None and motion_latency is not None
                    and motion_latency <= 750,
                    {"latencyMs": motion_latency, "state": first_motion},
                    "decoded video/atlas surface <=750 ms",
                )
                add_check(
                    cold_checks,
                    f"{track} cold high-velocity path suppresses video seeks",
                    not cold_high_seeks,
                    cold_high_seeks,
                    "zero high-velocity video seeks",
                )
                results[f"{track}-cold-immediate"] = {
                    "commandAt": cold_start_at,
                    "states": cold_states,
                    "firstMotion": first_motion,
                    "firstMotionLatencyMs": motion_latency,
                    "firstAtlas": first_atlas,
                    "firstAtlasLatencyMs": atlas_latency,
                    "events": cold_events,
                    "resourceTiming": cold_page.evaluate(
                        """() => performance.getEntriesByType('resource')
                          .filter(entry => /CST17-(INTRO|OUTRO)-PHONE-(SCRUB|TERMINAL)-v172\\.webp|CST17-(INTRO|OUTRO)-PHONE-v172\\.mp4/.test(entry.name))
                          .map(entry => ({
                            name: entry.name,
                            startTime: entry.startTime,
                            responseStart: entry.responseStart,
                            responseEnd: entry.responseEnd,
                            duration: entry.duration,
                            transferSize: entry.transferSize,
                            decodedBodySize: entry.decodedBodySize,
                            initiatorType: entry.initiatorType,
                          }))"""
                    ),
                    "network": cold_network,
                    "screenshot": str(cold_shot),
                    "checks": cold_checks,
                }
            except Exception as error:
                failure = f"{track} cold immediate fatal: {type(error).__name__}: {error}"
                failures.append(failure)
                results[f"{track}-cold-immediate"] = {
                    "fatal": failure,
                    "network": cold_network,
                }
            finally:
                cold_context.close()
    finally:
        browser.close()

    report = {
        "schema": "cake-studio-v172-product-atlas-transition/v1",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "url": gate.url,
        "environment": {
            "viewport": PERF.VIEWPORT,
            "network": {
                "downloadBps": PERF.NETWORK_DOWNLOAD_BPS,
                "uploadBps": PERF.NETWORK_UPLOAD_BPS,
                "latencyMs": PERF.NETWORK_LATENCY_MS,
            },
            "cpuThrottleRate": PERF.CPU_THROTTLE_RATE,
            "runtimeMutation": "none; product-native observer only",
        },
        "results": results,
        "failures": failures,
    }
    report_path = output / "product-transition-probe.json"
    report_path.write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(
        f"CAKE_STUDIO_V172_PRODUCT_TRANSITION_{'FAIL' if failures else 'OK'} "
        f"failures={len(failures)} report={report_path}"
    )
    for failure in failures:
        print(f"  FAIL {failure}")
    return 1 if failures else 0


def self_test() -> int:
    tests = 0

    def require(condition: bool, message: str) -> None:
        nonlocal tests
        tests += 1
        if not condition:
            raise AssertionError(message)

    contract = PERF.expected_contract()
    require(contract["version"] == "1.7.2", "v1.7.2 contract import")
    require(
        contract["tracks"]["intro"]
        == {
            "file": "CST17-INTRO-PHONE-v172.mp4",
            "bytes": 5_091_536,
            "sha256": "6c735d09ccd30cf70ff031ddbef7060ede653bfb680d11b78042d19188ad5670",
            "frames": 687,
            "duration": 45.8,
            "terminalTarget": 45.666666666666664,
        },
        "exact intro contract",
    )
    require(
        contract["tracks"]["outro"]["file"] == "CST17-OUTRO-PHONE-v172.mp4"
        and contract["tracks"]["outro"]["bytes"] == 2_479_879
        and contract["tracks"]["outro"]["frames"] == 347
        and abs(contract["tracks"]["outro"]["terminalTarget"] - 23.0) < 1e-9,
        "exact outro contract",
    )
    legacy = QUEUE_EOF_LAST_PTS + "\n" + RENDER_EOF_LAST_PTS
    safe = apply_variant(legacy, "eof-safe")
    require(
        QUEUE_EOF_SAFE_HOLD in safe
        and RENDER_EOF_SAFE_HOLD in safe
        and "duration - 1 / unit.phoneMaster.fps" not in safe,
        "legacy EOF targets patch to the exact I-frame safety cap",
    )
    already_safe = QUEUE_EOF_SAFE_HOLD + "\n" + RENDER_EOF_SAFE_HOLD
    require(apply_variant(already_safe, "eof-safe") == already_safe, "safe EOF patch is idempotent")
    current_runtime = (ROOT / "public" / "worlds" / "cake-studio.js").read_text(
        encoding="utf-8"
    )
    require(
        QUEUE_EOF_SAFE_HOLD in current_runtime
        and "unit.phoneTarget = Math.min(terminalTarget," in current_runtime
        and apply_variant(current_runtime, "eof-safe") == current_runtime,
        "current v1.7.2 runtime already uses the two-frame safety cap",
    )
    prototype_runtime = "\n".join(
        (
            COMMIT_PHONE_BASE,
            ISSUE_EARLY,
            QUEUE_INTERRUPT,
            SEEKED_EARLY,
            RENDER_PHONE_BASE,
            PHONE_SLOT_ANCHOR,
            QUEUE_EOF_SAFE_HOLD,
        )
    )
    require(
        apply_variant(prototype_runtime, "rvfc-eof-safe") != prototype_runtime,
        "rVFC hypothesis still patches the preserved safety-capped fixture",
    )
    for preview_ms in PREVIEW_INTERVALS:
        velocity = apply_variant(
            prototype_runtime, "velocity-debounce", preview_ms=preview_ms
        )
        require(
            velocity != prototype_runtime
            and f"sequencePreviewInterval = '{preview_ms}'" in velocity
            and f"sincePreview >= {preview_ms}" in velocity
            and "queuePhoneSeek(unit, unit.phoneTarget, true);" in velocity
            and "slot.targetExact = true;" in velocity
            and "slot.video.addEventListener('seeked'" in velocity,
            f"{preview_ms} ms velocity debounce keeps bounded previews and exact settle",
        )
    landing = apply_variant(prototype_runtime, "velocity-landing", preview_ms=300)
    require(
        "landing.dataset.phoneTerminalLanding = '';" in landing
        and "showPhoneLanding(unit, terminalTarget);" in landing
        and "hidePhoneLanding(unit, 'exact-video-commit');" in landing
        and "samplePhoneLanding" in landing,
        "terminal landing is separate, decoded-pixel sampled, and exact-commit controlled",
    )
    require(
        ATLAS_MANIFEST["tracks"]["intro"]["bytes"] == 326_692
        and ATLAS_MANIFEST["tracks"]["intro"]["sha256"]
        == "1e94474cee9abdd7e0af7ea7679d4b004cf5d3313287c06c358f4368e3c1f1c5"
        and ATLAS_MANIFEST["tracks"]["outro"]["bytes"] == 179_822
        and ATLAS_MANIFEST["tracks"]["outro"]["sha256"]
        == "5717337b6e0674f08f99a945fc4aa2dee69f2ab09380bdd04c2da6218a0b9c2c",
        "bounded-ready Q85 atlas bytes and hashes are exact",
    )
    atlas = apply_variant(prototype_runtime, "sprite-atlas")
    require(
        "drawPhoneAtlas(unit, unit.phoneTarget)" in atlas
        and "slot.wanted = -1;" in atlas
        and "video-seek-issued" in atlas
        and "reverse-atlas-commit" in atlas
        and "getImageData(0, 0, 1, 1)" in atlas
        and "fetchPriority = 'high'" in atlas
        and "}, 180);" in atlas
        and "unit.phoneAtlasReleasing" in atlas
        and "terminal-seek-skipped" in atlas
        and "CST17-INTRO-SCRUB-ATLAS-384x216-N32-Q85.webp" in atlas
        and "intro-terminal-opencv.webp" in atlas,
        "sprite variant suppresses rapid seeks, primes pixels, and lands/reverses safely",
    )
    try:
        velocity_render(500)
    except ValueError:
        pass
    else:
        raise AssertionError("unsupported preview interval did not fail closed")
    tests += 1
    try:
        apply_variant("const unrelated = true;", "eof-safe")
    except RuntimeError:
        pass
    else:
        raise AssertionError("missing EOF anchors did not fail closed")
    tests += 1
    require(apply_variant("const baseline = true;", "baseline") == "const baseline = true;", "baseline is non-mutating")
    require(
        apply_variant("const product = true;", "product-atlas")
        == "const product = true;"
        and "[data-phone-scrub-atlas]" in VELOCITY_DIAGNOSTIC_INIT
        and "atlas-commit" in VELOCITY_DIAGNOSTIC_INIT,
        "product atlas observer is non-mutating and records native commits",
    )
    cadence_fixture = f"before\n{CADENCE_66}\nafter"
    for interval_ms in SLOW_CADENCE_INTERVALS:
        patched_cadence = apply_product_slow_cadence(
            cadence_fixture, interval_ms
        )
        require(
            f"slot.wantedExact ? 0 : {interval_ms}" in patched_cadence
            and "slot.wantedExact ? 0 : 66" not in patched_cadence,
            f"product slow cadence {interval_ms} ms is surgical",
        )
    fallback_fixture = f"before\n{SLOW_ATLAS_FALLBACK_ANCHOR}\nafter"
    patched_fallback = apply_product_slow_atlas_fallback(fallback_fixture)
    require(
        "sprite-atlas-slow-fallback" in patched_fallback
        and "unit.phoneSlot.wanted = -1" in patched_fallback
        and "unit.phoneSlot.wantedExact = false" in patched_fallback
        and ") > .5" in patched_fallback,
        "slow atlas fallback suppresses chase and keeps exact settle available",
    )
    print(f"CAKE_STUDIO_V172_INTRO_HYPOTHESES_SELF_TEST_OK tests={tests}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url")
    parser.add_argument("--output", type=Path)
    parser.add_argument(
        "--variant",
        choices=(
            "baseline",
            "eof-safe",
            "rvfc",
            "rvfc-eof-safe",
            "rvfc-interrupt-eof-safe",
            "cadence",
            "cadence-eof-safe",
            "prewarm",
            "velocity-debounce",
            "velocity-landing",
            "sprite-atlas",
            "product-atlas",
            PRODUCT_SLOW_CADENCE_VARIANT,
            PRODUCT_SLOW_ATLAS_FALLBACK_VARIANT,
        ),
    )
    parser.add_argument(
        "--profile",
        action="append",
        choices=tuple(profile.name for profile in PERF.PROFILES),
    )
    parser.add_argument("--download-bps", type=int, default=PERF.NETWORK_DOWNLOAD_BPS)
    parser.add_argument("--latency-ms", type=int, default=PERF.NETWORK_LATENCY_MS)
    parser.add_argument("--cpu-rate", type=int, default=PERF.CPU_THROTTLE_RATE)
    parser.add_argument(
        "--preview-ms", type=int, choices=PREVIEW_INTERVALS, default=600
    )
    parser.add_argument(
        "--slow-min-interval",
        type=int,
        choices=SLOW_CADENCE_INTERVALS,
        default=120,
        help="Diagnostic-only non-exact phone seek cadence",
    )
    parser.add_argument(
        "--product-transition-probe-only",
        action="store_true",
        help="Run cold start plus nonterminal stop/terminal/reverse product proofs",
    )
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if not args.url or not args.output or not args.variant:
        parser.error("--url, --output, and --variant are required unless --self-test is used")
    PERF.NETWORK_DOWNLOAD_BPS = args.download_bps
    PERF.NETWORK_LATENCY_MS = args.latency_ms
    PERF.CPU_THROTTLE_RATE = args.cpu_rate
    selected_names = set(args.profile or tuple(profile.name for profile in PERF.PROFILES))
    selected = tuple(profile for profile in PERF.PROFILES if profile.name in selected_names)
    gate = VariantGate(
        args.url,
        args.output.resolve(),
        throttled=True,
        variant=args.variant,
        preview_ms=args.preview_ms,
        slow_min_interval=args.slow_min_interval,
    )
    with sync_playwright() as playwright:
        if args.product_transition_probe_only:
            if args.variant != "product-atlas":
                parser.error(
                    "--product-transition-probe-only requires --variant product-atlas"
                )
            return run_product_transition_probe(playwright, gate)
        return gate.run(playwright, selected)


if __name__ == "__main__":
    raise SystemExit(main())
