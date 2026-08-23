/* Cake Studio v1.8 bookends: one direct, scroll-clocked video transport.
   Desktop and phone use the same two-slot paused-seek window as the 50-shot
   reel, plus one hidden decoded first-touch anchor. No atlas, landing still,
   poster swap, playback clock, or canvas sits between the visitor's hand and
   the decoded frame. */
(() => {
  'use strict';

  const scenes = [...document.querySelectorAll('[data-cake-bookend]')];
  if (!scenes.length) return;

  const manifestUrl = scenes[0].dataset.bookendManifest;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const solo = new URLSearchParams(location.search).has('solo');
  const clamp = (value) => value < 0 ? 0 : value > 1 ? 1 : value;
  const runtime = {
    version: '1.8.0',
    state: 'loading',
    manifestReady: false,
    units: [],
    snapshot: (trackName = null, compact = false) => runtime.units
      .filter((unit) => !trackName || unit.trackName === trackName)
      .map((unit) => {
        const value = {
          track: unit.trackName,
          transport: unit.scene.dataset.sequenceTransport || '',
          mode: unit.scene.dataset.sequenceMode || '',
          state: unit.scene.dataset.sequenceState || '',
          index: Number(unit.scene.dataset.sequenceIndex || 0),
          clip: unit.scene.dataset.sequenceClip || '',
          fraction: unit.currentFraction,
          targetTime: unit.targetTime,
          time: unit.scene.dataset.sequenceTime
            ? Number(unit.scene.dataset.sequenceTime)
            : null,
          lag: unit.scene.dataset.sequenceLag
            ? Number(unit.scene.dataset.sequenceLag)
            : null,
          painted: unit.scene.classList.contains('sequence-painted'),
          warmState: unit.warmState,
          activeSlot: unit.active ? unit.slots.indexOf(unit.active) : -1,
          phone: null,
        };
        if (!compact) {
          value.slots = unit.slots.map((slot) => ({
            index: slot.index,
            ready: slot.ready,
            seeking: slot.seeking,
            wanted: slot.wanted,
            target: slot.target,
            currentTime: slot.video.currentTime,
            readyState: slot.video.readyState,
          }));
        }
        return value;
      }),
  };
  window.__cakeStudioBookends = runtime;

  if (!manifestUrl
    || scenes.some((scene) => scene.dataset.bookendManifest !== manifestUrl)) {
    runtime.state = 'manifest-error';
    runtime.error = 'bookend scenes do not share one manifest URL';
    return;
  }

  const validateManifest = (manifest) => {
    if (manifest.schema !== 'cake-studio-bookends/v2'
      || manifest.version !== '1.8.0') {
      throw new Error('bookend manifest version mismatch');
    }
    if (manifest.width !== 1280 || manifest.height !== 720
      || manifest.fps !== 30 || manifest.duration !== 5) {
      throw new Error('bookend manifest media contract mismatch');
    }
    const delivery = manifest.delivery;
    const conditioning = delivery?.endpointConditioning;
    const scrub = delivery?.scrubTransport;
    if (delivery?.codec !== 'H.264'
      || delivery?.pixelFormat !== 'yuv420p'
      || delivery?.silent !== true
      || delivery?.keyframeInterval !== 15
      || delivery?.faststart !== true
      || conditioning?.openingConvergenceFrames !== 9
      || conditioning?.closingConvergenceStartFrame !== 126
      || conditioning?.closingConvergenceEndFrame !== 135
      || conditioning?.exactFinalHoldFrames !== 15
      || scrub?.engine !== 'direct-video-anchor-three-slot'
      || scrub?.clock !== 'scroll'
      || scrub?.slots !== 3
      || scrub?.preloadWindow !== 1
      || scrub?.blobWarmAhead !== 2
      || scrub?.seekCoalescing !== 'last-write-wins'
      || scrub?.visibleProxy !== 'none'
      || scrub?.profiles?.join(',') !== 'desktop,phone-portrait,phone-landscape') {
      throw new Error('bookend direct scrub delivery contract mismatch');
    }
    if ('phoneMaster' in delivery
      || 'phoneScrubAtlas' in delivery
      || 'phoneTerminalStill' in delivery) {
      throw new Error('retired phone delivery fields remain active');
    }
    const retired = manifest.retiredDelivery;
    const expectedRetired = [
      'phoneMaster',
      'phoneScrubAtlas',
      'phoneTerminalStill',
    ];
    if (!retired || Object.keys(retired).sort().join(',')
      !== expectedRetired.sort().join(',')) {
      throw new Error('retired phone delivery ledger mismatch');
    }
    for (const name of expectedRetired) {
      if (retired[name]?.status !== 'inert'
        || retired[name]?.active !== false
        || retired[name]?.since !== '1.8.0') {
        throw new Error('retired phone delivery status mismatch: ' + name);
      }
    }
    if (typeof manifest.ready !== 'boolean'
      || !manifest.tracks
      || typeof manifest.tracks !== 'object') {
      throw new Error('bookend manifest readiness or tracks missing');
    }
    if (Object.keys(manifest.tracks).sort().join(',') !== 'intro,outro') {
      throw new Error('bookend manifest must expose exactly intro and outro tracks');
    }
    const expected = {
      intro: Array.from({ length: 10 }, (_, index) =>
        'I' + String(index + 1).padStart(2, '0')),
      outro: Array.from({ length: 5 }, (_, index) =>
        'O' + String(index + 1).padStart(2, '0')),
    };
    const sources = new Set();
    for (const [trackName, ids] of Object.entries(expected)) {
      const track = manifest.tracks[trackName];
      if (!track || !Array.isArray(track.clips)
        || track.clips.length !== ids.length) {
        throw new Error('bookend ' + trackName + ' clip count mismatch');
      }
      if ('phoneMaster' in track) {
        throw new Error('bookend ' + trackName + ' retains active phone master');
      }
      if (!/^cake-studio\/v17\/stills\/CST17-[IO][0-9]{2}-.+\.webp$/
        .test(track.poster || '')) {
        throw new Error('bookend ' + trackName + ' poster path mismatch');
      }
      track.clips.forEach((clip, index) => {
        if (clip.id !== ids[index]) {
          throw new Error('bookend ' + trackName + ' order mismatch');
        }
        if (!/^cake-studio\/v17\/clips\/CST17-[IO][0-9]{2}\.mp4$/
          .test(clip.src || '')) {
          throw new Error('bookend ' + clip.id + ' media path mismatch');
        }
        if (!/^cake-studio\/v17\/stills\/CST17-[IO][0-9]{2}-.+\.webp$/
          .test(clip.first || '')
          || !/^cake-studio\/v17\/stills\/CST17-[IO][0-9]{2}-.+\.webp$/
            .test(clip.last || '')) {
          throw new Error('bookend ' + clip.id + ' endpoint path mismatch');
        }
        if (index && track.clips[index - 1].last !== clip.first) {
          throw new Error('bookend ' + trackName
            + ' endpoint continuity mismatch');
        }
        if (sources.has(clip.src)) {
          throw new Error('bookend duplicate media source ' + clip.src);
        }
        sources.add(clip.src);
      });
    }
    if (sources.size !== 15) {
      throw new Error('bookend media source count mismatch');
    }
    return manifest;
  };

  const readProgress = (scene) =>
    clamp(Number.parseFloat(scene.style.getPropertyValue('--p') || '0'));
  const blobCache = new Map();
  const clipBlob = (source) => {
    if (blobCache.has(source)) return blobCache.get(source);
    const request = fetch(source, { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('bookend clip HTTP ' + response.status);
        }
        return response.blob();
      })
      .catch((error) => {
        blobCache.delete(source);
        throw error;
      });
    blobCache.set(source, request);
    return request;
  };
  const locate = (clips, progress) => {
    if (progress >= .999999) {
      return { index: clips.length - 1, fraction: 1 };
    }
    const scaled = progress * clips.length;
    const index = Math.min(clips.length - 1, Math.floor(scaled));
    return { index, fraction: scaled - index };
  };

  const release = (slot) => {
    slot.fetchId += 1;
    slot.loading = false;
    clearTimeout(slot.retryTimer);
    slot.retryTimer = 0;
    if (slot.objectUrl) URL.revokeObjectURL(slot.objectUrl);
    slot.objectUrl = '';
    slot.generation += 1;
    slot.ready = false;
    slot.seeking = false;
    slot.wanted = -1;
    slot.target = 0;
    slot.index = -1;
    slot.video.classList.remove('on');
    slot.video.removeAttribute('src');
    slot.video.load();
  };

  const show = (unit, slot) => {
    if (unit.active === slot) return;
    unit.active = slot;
    for (const candidate of unit.slots) {
      candidate.video.classList.toggle('on', candidate === slot);
    }
  };

  const showDecoded = (unit, slot) => {
    if ((!solo && !unit.live)
      || !slot.ready || slot.video.videoWidth < 1) return;
    show(unit, slot);
    unit.scene.dataset.sequencePreviewMode = 'direct-video';
    unit.scene.classList.add('sequence-painted');
    if (!unit.firstFramePainted) {
      unit.firstFramePainted = true;
      unit.firstFrameResolve();
    }
  };

  const commit = (unit, slot) => {
    if (!slot.ready || slot.video.readyState < 2
      || slot.index !== unit.currentIndex) return;
    const tolerance = 1 / 30 + .012;
    if (Math.abs(slot.video.currentTime - slot.target) > tolerance) return;
    showDecoded(unit, slot);
    const mediaTime = slot.video.currentTime;
    unit.scene.dataset.sequenceTime = mediaTime.toFixed(4);
    unit.scene.dataset.sequenceLag =
      Math.abs(mediaTime - unit.targetTime).toFixed(4);
    unit.scene.dataset.sequenceState = 'ready';
    unit.scene.dataset.sequencePreviewMode = 'direct-video';
  };

  const seek = (unit, slot, time) => {
    if (!slot.ready) return;
    const duration = slot.video.duration || unit.duration;
    const target = Math.min(
      duration - 1 / 30,
      Math.max(.001, time),
    );
    slot.target = target;
    if (slot.seeking) {
      // A moving hand can deliver a newer target before Chromium emits
      // `seeked`. Assign it immediately: paused media coalesces to the latest
      // scroll position instead of visibly holding an obsolete decode.
      try {
        slot.video.currentTime = target;
      } catch {
        slot.seeking = false;
        unit.scene.dataset.sequenceState = 'seek-error';
      }
      return;
    }
    if (Math.abs(slot.video.currentTime - target) < .009) {
      commit(unit, slot);
      return;
    }
    slot.seeking = true;
    try {
      slot.video.currentTime = target;
    } catch {
      slot.seeking = false;
      unit.scene.dataset.sequenceState = 'seek-error';
    }
  };

  const arm = (unit, slot, index) => {
    if (slot.index === index && (slot.objectUrl || slot.loading)) return slot;
    release(slot);
    slot.index = index;
    slot.generation += 1;
    const generation = slot.generation;
    const clip = unit.clips[index];
    slot.video.dataset.sequenceClip = clip.id;
    slot.video.preload = 'auto';
    slot.video.addEventListener('loadeddata', () => {
      if (generation !== slot.generation || slot.index !== index) return;
      slot.ready = true;
      if (unit.currentIndex === index) {
        unit.scene.dataset.sequenceState = 'decoded';
        seek(unit, slot, unit.targetTime);
      }
    }, { once: true });
    slot.video.addEventListener('error', () => {
      if (generation !== slot.generation || slot.index !== index) return;
      slot.ready = false;
      unit.scene.dataset.sequenceState = 'media-error';
      if (!unit.active) {
        unit.scene.classList.remove('sequence-painted');
      }
    }, { once: true });
    const fetchId = slot.fetchId;
    const load = (attempt) => {
      slot.loading = true;
      clipBlob(clip.src)
        .then((blob) => {
          if (slot.fetchId !== fetchId) return;
          slot.loading = false;
          slot.objectUrl = URL.createObjectURL(blob);
          slot.video.src = slot.objectUrl;
          slot.video.load();
        })
        .catch(() => {
          if (slot.fetchId !== fetchId) return;
          if (attempt < 2) {
            slot.retryTimer = setTimeout(() => {
              slot.retryTimer = 0;
              if (slot.fetchId === fetchId) load(attempt + 1);
            }, 120 * (attempt + 1));
            return;
          }
          slot.loading = false;
          slot.ready = false;
          unit.scene.dataset.sequenceState = 'media-error';
        });
    };
    load(0);
    return slot;
  };

  const chooseSlot = (unit, index) => {
    if (unit.active?.index === index) return unit.active;
    const existing = unit.slots.find((slot) => slot.index === index);
    if (existing) return existing;
    const available = unit.slots.find((slot) =>
      slot !== unit.anchorSlot && slot !== unit.active)
      || unit.slots.find((slot) => slot !== unit.anchorSlot);
    return arm(unit, available, index);
  };

  const setPoster = (unit, source) => {
    if (source && unit.poster.getAttribute('src') !== source) {
      unit.poster.src = source;
    }
  };

  function renderUnit(unit, progress) {
    const beat = locate(unit.clips, progress);
    const clip = unit.clips[beat.index];
    const previousProgress = unit.lastProgress;
    unit.direction = progress >= previousProgress ? 1 : -1;
    unit.lastProgress = progress;
    unit.currentIndex = beat.index;
    unit.currentFraction = beat.fraction;
    unit.targetTime = Math.min(
      unit.duration - 1 / 30,
      beat.fraction * unit.duration,
    );
    if (unit.displayIndex !== beat.index) {
      unit.displayIndex = beat.index;
      unit.scene.dataset.sequenceIndex = String(beat.index + 1);
      unit.scene.dataset.sequenceClip = clip.id;
      unit.counter.textContent = String(beat.index + 1).padStart(2, '0')
        + ' / ' + String(unit.clips.length).padStart(2, '0');
    }
    unit.scene.dataset.sequenceTargetTime = unit.targetTime.toFixed(4);
    unit.meter.style.setProperty('--sequence-progress', progress.toFixed(5));

    const endpointIndex = Math.min(
      unit.clips.length,
      Math.round(progress * unit.clips.length),
    );
    if (reducedMotion.matches) {
      setPoster(unit, unit.endpoints[endpointIndex]);
      unit.scene.dataset.sequenceMode = 'still';
      unit.scene.dataset.sequenceTransport = 'poster';
      unit.scene.dataset.sequenceState = 'reduced-motion';
      unit.scene.dataset.sequencePreviewMode = 'poster';
      unit.scene.classList.remove('sequence-painted');
      for (const slot of unit.slots) slot.video.classList.remove('on');
      return;
    }

    unit.scene.dataset.sequenceMode = 'motion';
    unit.scene.dataset.sequenceTransport = 'direct-video';
    if (!solo && !unit.live) return;
    const warmKey = beat.index + ':' + unit.direction;
    if (unit.warmKey !== warmKey) {
      unit.warmKey = warmKey;
      for (let offset = 1; offset <= 2; offset += 1) {
        const warmIndex = beat.index + unit.direction * offset;
        if (warmIndex >= 0 && warmIndex < unit.clips.length) {
          clipBlob(unit.clips[warmIndex].src).catch(() => {});
        }
      }
    }
    const slot = chooseSlot(unit, beat.index);
    if (slot.ready) {
      // Match the unchanged 50-shot reel: the already-decoded neighbour takes
      // the aperture at the exact endpoint, then paused seeks follow the hand.
      // The clips share byte-verified endpoint frames, so this handoff is
      // visually continuous while avoiding an old-frame hold at the seam.
      showDecoded(unit, slot);
      seek(unit, slot, unit.targetTime);
    }

    const neighbour = beat.index + unit.direction;
    if (unit.active === slot
      && neighbour >= 0
      && neighbour < unit.clips.length) {
      const preload = unit.slots.find((candidate) =>
        candidate !== unit.anchorSlot && candidate !== slot);
      if (preload && preload.index !== neighbour) {
        arm(unit, preload, neighbour);
      }
    }
  }

  const createUnit = (scene, manifest) => {
    const trackName = scene.dataset.bookendTrack;
    const track = manifest.tracks[trackName];
    if (!track || !track.clips?.length) return null;
    const aperture = scene.querySelector('.bookend-aperture');
    const poster = scene.querySelector('[data-bookend-poster]');
    const meter = scene.querySelector('[data-bookend-meter]');
    const counter = scene.querySelector('[data-bookend-count]');
    const videos = [...scene.querySelectorAll('[data-bookend-video]')];
    if (!aperture || !poster || !meter || !counter || videos.length !== 3) {
      return null;
    }
    let firstFrameResolve;
    const firstFramePromise = new Promise((resolve) => {
      firstFrameResolve = resolve;
    });
    const unit = {
      scene,
      aperture,
      poster,
      meter,
      counter,
      trackName,
      clips: track.clips,
      endpoints: [track.clips[0].first, ...track.clips.map((clip) => clip.last)],
      duration: manifest.duration,
      mediaReady: manifest.ready === true,
      active: null,
      live: solo || scene.classList.contains('is-live'),
      direction: 1,
      lastProgress: readProgress(scene),
      currentIndex: -1,
      currentFraction: 0,
      displayIndex: -1,
      targetTime: 0,
      firstFramePainted: false,
      firstFrameResolve,
      firstFramePromise,
      warmState: 'idle',
      warmKey: '',
      anchorSlot: null,
      slots: [],
    };
    unit.slots = videos.map((video) => {
      const slot = {
        video,
        index: -1,
        generation: 0,
        ready: false,
        seeking: false,
        wanted: -1,
        target: 0,
        fetchId: 0,
        loading: false,
        retryTimer: 0,
        objectUrl: '',
      };
      video.addEventListener('seeked', () => {
        slot.seeking = false;
        commit(unit, slot);
      });
      return slot;
    });
    unit.anchorSlot = unit.slots[0];
    scene.dataset.sequenceCount = String(unit.clips.length);
    scene.dataset.sequenceMode = reducedMotion.matches ? 'still' : 'motion';
    scene.dataset.sequenceTransport =
      reducedMotion.matches ? 'poster' : 'direct-video';
    scene.dataset.sequenceState =
      unit.mediaReady ? 'warming' : 'awaiting-media';
    scene.dataset.sequencePreviewMode =
      reducedMotion.matches ? 'poster' : 'direct-video';
    scene.addEventListener('scene:live', () => {
      unit.live = true;
      renderUnit(unit, readProgress(scene));
    });
    scene.addEventListener('scene:idle', () => {
      unit.live = false;
      unit.active = null;
      for (const slot of unit.slots) {
        slot.video.classList.remove('on');
      }
    });
    renderUnit(unit, unit.lastProgress);
    return unit;
  };

  let ticking = false;
  const paint = () => {
    ticking = false;
    for (const unit of runtime.units) {
      renderUnit(unit, readProgress(unit.scene));
    }
  };
  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };

  fetch(manifestUrl, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) {
        throw new Error('bookend manifest HTTP ' + response.status);
      }
      return response.json();
    })
    .then((manifest) => {
      validateManifest(manifest);
      runtime.manifestReady = manifest.ready === true;
      runtime.units = scenes
        .map((scene) => createUnit(scene, manifest))
        .filter(Boolean);
      if (runtime.units.length !== 2) {
        throw new Error('bookend runtime did not create both tracks');
      }
      addEventListener('scroll', schedule, { passive: true });
      addEventListener('resize', schedule, { passive: true });

      if (reducedMotion.matches || manifest.ready !== true) {
        runtime.state = manifest.ready === true ? 'ready' : 'awaiting-media';
        paint();
        return;
      }

      const intro = runtime.units.find((unit) => unit.trackName === 'intro');
      const outro = runtime.units.find((unit) => unit.trackName === 'outro');
      intro.warmState = 'loading';
      intro.scene.dataset.sequenceWarm = 'loading';
      arm(intro, intro.anchorSlot, 0);
      arm(intro, intro.slots[1], 1);
      renderUnit(intro, readProgress(intro.scene));
      intro.firstFramePromise.then(() => {
        intro.warmState = 'ready';
        intro.scene.dataset.sequenceWarm = 'ready';
        runtime.state = 'ready';
        if (outro) {
          outro.warmState = 'loading';
          outro.scene.dataset.sequenceWarm = 'loading';
          arm(outro, outro.anchorSlot, 0);
          arm(outro, outro.slots[1], 1);
          Promise.race([
            outro.firstFramePromise,
            new Promise((resolve) => setTimeout(resolve, 12_000)),
          ]).then(() => {
            outro.warmState = outro.firstFramePainted ? 'ready' : 'neighbour-ready';
            outro.scene.dataset.sequenceWarm = outro.warmState;
          });
        }
      });
      setTimeout(() => {
        if (runtime.state === 'loading') {
          runtime.state = 'media-error';
          runtime.error = 'intro direct video did not decode before readiness deadline';
        }
      }, 30_000);
      paint();
    })
    .catch((error) => {
      runtime.state = 'manifest-error';
      runtime.error = error instanceof Error ? error.message : String(error);
      for (const scene of scenes) {
        scene.dataset.sequenceMode = 'still';
        scene.dataset.sequenceTransport = 'poster';
        scene.dataset.sequenceState = 'manifest-error';
        scene.dataset.sequencePreviewMode = 'poster';
      }
    });

  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) {
      for (const unit of runtime.units) {
        unit.active = null;
        unit.scene.classList.remove('sequence-painted');
        for (const slot of unit.slots) release(slot);
      }
    }
    paint();
  });
  addEventListener('pagehide', () => {
    for (const unit of runtime.units) {
      for (const slot of unit.slots) release(slot);
    }
  }, { once: true });
})();
