(() => {
  'use strict';

  const scene = document.getElementById('academy-reel');
  const proof = document.querySelector('[data-proof-instrument]');
  if (!scene || !proof) return;

  const definitions = [...scene.querySelectorAll('.shot-data figure')];
  const videos = [...scene.querySelectorAll('.film-frame video')];
  if (definitions.length !== 14 || videos.length !== 2) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const solo = new URLSearchParams(location.search).has('solo');
  const clamp = (value) => value < 0 ? 0 : value > 1 ? 1 : value;
  const smoothstep = (value) => value * value * (3 - 2 * value);
  const readProgress = (element) => clamp(Number.parseFloat(element.style.getPropertyValue('--p') || '0'));
  const TAU = 140;
  const SNAP_SHOTS = 1.5;
  const IDLE_EPS = 1e-4;
  const IDLE_FRAMES = 3;

  const floor = scene.querySelector('.floor');
  const backdrop = scene.querySelector('.backdrop');
  const cue = document.getElementById('academy-cue');
  const shotNumber = document.getElementById('academy-shot-number');
  const chapterEn = document.getElementById('academy-chapter-en');
  const chapterAr = document.getElementById('academy-chapter-ar');
  const titleEn = document.getElementById('academy-title-en');
  const titleAr = document.getElementById('academy-title-ar');
  const storyEn = document.getElementById('academy-story-en');
  const storyAr = document.getElementById('academy-story-ar');
  const mediaStatus = document.getElementById('academy-media-status');
  const chapterButtons = [...scene.querySelectorAll('.chapter-nav button')];
  const chapterStarts = chapterButtons.map((button) => Number(button.dataset.shot));

  const shots = definitions.map((figure) => ({
    id: figure.dataset.sourceId,
    clip: figure.dataset.clip,
    poster: figure.dataset.poster,
    chapterEn: figure.dataset.chapterEn,
    chapterAr: figure.dataset.chapterAr,
    titleEn: figure.dataset.titleEn,
    titleAr: figure.dataset.titleAr,
    storyEn: figure.querySelector('.L.en')?.textContent.trim() ?? '',
    storyAr: figure.querySelector('.L.ar')?.textContent.trim() ?? '',
  }));

  // Questions and proof beats hold longer; travel between rooms runs lighter.
  const weights = Object.freeze([
    1.35, 1.05,
    1.15, .90, 1.00, 1.10,
    1.45, 1.70, 1.45,
    1.05, 1.15, 1.15,
    1.45, 1.65,
  ]);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const stops = weights.reduce((all, weight) => {
    all.push(all.at(-1) + weight);
    return all;
  }, [0]);
  const progressForIndex = (index, fraction = 0) => (
    stops[index] + weights[index] * clamp(fraction)
  ) / totalWeight;
  const locate = (progress) => {
    const target = Math.min(progress, .999999) * totalWeight;
    let index = weights.findIndex((_, candidate) => target < stops[candidate + 1]);
    if (index < 0) index = shots.length - 1;
    return {
      index,
      fraction: clamp((target - stops[index]) / weights[index]),
    };
  };

  let currentShot = -1;
  let activeSlot = -1;
  let filmLive = solo || scene.classList.contains('is-live');
  let cameraFrame = 0;
  let lastCameraTime = 0;
  let lastFrameWall = performance.now();
  let settledFrames = 0;
  let rawTarget = readProgress(scene);
  let smoothProgress = rawTarget;
  let travelDirection = 1;
  let cameraFallback = 0;

  const slots = videos.map((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.pause();
    return {
      video,
      shot: -1,
      token: 0,
      ready: false,
      seeking: false,
      wanted: -1,
    };
  });

  const markPainted = (slot) => {
    if (slot.video.readyState < 2) return;
    const token = slot.token;
    const shot = slot.shot;
    const commit = (_now, metadata = {}) => {
      // A delayed rVFC/timer from a decoder slot that has since been reused
      // must never certify the replacement clip as painted.
      if (
        slot !== slots[activeSlot]
        || slot.token !== token
        || slot.shot !== shot
        || shot !== currentShot
        || slot.video.readyState < 2
      ) return;
      scene.dataset.mediaState = 'painted';
      scene.dataset.frameTime = Number(metadata.mediaTime ?? slot.video.currentTime).toFixed(3);
      mediaStatus.textContent = `Shot ${currentShot + 1} of 14 ready.`;
    };
    if (typeof slot.video.requestVideoFrameCallback === 'function') {
      slot.video.requestVideoFrameCallback(commit);
    }
    setTimeout(() => commit(performance.now()), 90);
  };

  const seek = (slot, time) => {
    if (!slot.ready) return;
    if (slot.seeking) {
      slot.wanted = time;
      return;
    }
    if (Math.abs(slot.video.currentTime - time) < .012) {
      markPainted(slot);
      return;
    }
    slot.seeking = true;
    try { slot.video.currentTime = time <= .001 ? .001 : time; }
    catch { slot.seeking = false; }
  };

  const load = (slot, shotIndex) => {
    if (slot.shot === shotIndex && slot.video.getAttribute('src')) return slot;
    slot.token += 1;
    const token = slot.token;
    slot.shot = shotIndex;
    slot.ready = false;
    slot.seeking = false;
    slot.wanted = -1;
    slot.video.classList.remove('on');
    slot.video.pause();
    slot.video.poster = shots[shotIndex].poster;
    slot.video.preload = 'auto';
    slot.video.src = shots[shotIndex].clip;
    slot.video.dataset.sourceId = shots[shotIndex].id;

    const ready = () => {
      if (slot.token !== token) return;
      slot.ready = true;
      if (slot.shot === currentShot) render(smoothProgress, rawTarget);
    };
    slot.video.addEventListener('loadeddata', ready, { once: true });
    slot.video.addEventListener('seeked', () => {
      if (slot.token !== token) return;
      slot.seeking = false;
      markPainted(slot);
      if (slot.wanted >= 0) {
        const wanted = slot.wanted;
        slot.wanted = -1;
        seek(slot, wanted);
      }
    });
    slot.video.addEventListener('error', () => {
      if (slot.token !== token) return;
      slot.ready = false;
      slot.video.classList.remove('on');
      scene.dataset.mediaState = 'poster';
      mediaStatus.textContent = `Shot ${shotIndex + 1} poster shown; video unavailable.`;
    }, { once: true });
    slot.video.load();
    return slot;
  };

  const slotFor = (shotIndex) => {
    const existing = slots.find((slot) => slot.shot === shotIndex);
    if (existing) return existing;
    const candidate = activeSlot === 0 ? slots[1] : slots[0];
    return load(candidate, shotIndex);
  };

  const show = (slot) => {
    const index = slots.indexOf(slot);
    if (activeSlot === index) return;
    activeSlot = index;
    slots.forEach((candidate, candidateIndex) => {
      candidate.video.classList.toggle('on', candidateIndex === index);
    });
  };

  const setShot = (index) => {
    if (index === currentShot) return;
    currentShot = index;
    const shot = shots[index];
    const chapterIndex = chapterStarts.reduce((active, start, candidate) => start <= index ? candidate : active, 0);
    chapterButtons.forEach((button, buttonIndex) => button.classList.toggle('on', buttonIndex === chapterIndex));
    chapterEn.textContent = shot.chapterEn;
    chapterAr.textContent = shot.chapterAr;
    titleEn.textContent = shot.titleEn;
    titleAr.textContent = shot.titleAr;
    storyEn.textContent = shot.storyEn;
    storyAr.textContent = shot.storyAr;
    shotNumber.textContent = `${String(index + 1).padStart(2, '0')} / 14`;
    floor.src = shot.poster;
    backdrop.src = shot.poster;
    scene.dataset.currentShot = String(index + 1);
    scene.dataset.currentSource = shot.id;
    scene.dataset.currentClip = shot.clip;
    scene.dataset.mediaState = reduced ? 'poster' : 'loading';
    cue.classList.remove('swap');
    void cue.offsetWidth;
    cue.classList.add('swap');
  };

  function render(progress, raw = progress) {
    const paintedProgress = clamp(progress);
    const beat = locate(paintedProgress);
    const easedJourney = smoothstep(paintedProgress);
    const pan = .37 + easedJourney * .26;
    const tilt = .46 + easedJourney * .08;
    scene.style.setProperty('--f', beat.fraction.toFixed(4));
    scene.style.setProperty('--journey', paintedProgress.toFixed(5));
    scene.style.setProperty('--pan', pan.toFixed(5));
    scene.style.setProperty('--tilt', tilt.toFixed(5));
    setShot(beat.index);
    if (reduced || (!filmLive && !solo)) return;

    const slot = slotFor(beat.index);
    show(slot);
    if (slot.ready) {
      const duration = slot.video.duration || 5.062;
      seek(slot, Math.min(duration - .045, Math.max(.001, beat.fraction * duration)));
    }

    const hand = raw - paintedProgress;
    if (hand > IDLE_EPS) travelDirection = 1;
    else if (hand < -IDLE_EPS) travelDirection = -1;
    const neighbour = beat.index + travelDirection;
    if (neighbour >= 0 && neighbour < shots.length) {
      const hidden = slots.find((candidate) => candidate !== slot);
      if (hidden && hidden.shot !== neighbour) load(hidden, neighbour);
    }
  }

  const parkCamera = () => {
    if (cameraFrame) cancelAnimationFrame(cameraFrame);
    cameraFrame = 0;
    lastCameraTime = 0;
    settledFrames = 0;
    scene.dataset.cameraState = 'idle';
  };

  const cameraTick = (time) => {
    cameraFrame = 0;
    lastFrameWall = performance.now();
    rawTarget = readProgress(scene);
    const gap = rawTarget - smoothProgress;
    if (solo || Math.abs(gap) * shots.length > SNAP_SHOTS) {
      smoothProgress = rawTarget;
    } else if (Math.abs(gap) < IDLE_EPS) {
      smoothProgress = rawTarget;
    } else {
      const delta = lastCameraTime ? Math.min(64, time - lastCameraTime) : 1000 / 60;
      smoothProgress += gap * (1 - Math.exp(-delta / TAU));
    }
    lastCameraTime = time;
    render(smoothProgress, rawTarget);
    if (Math.abs(rawTarget - smoothProgress) < IDLE_EPS) settledFrames += 1;
    else settledFrames = 0;
    if ((!filmLive && !solo) || settledFrames >= IDLE_FRAMES) {
      parkCamera();
      return;
    }
    cameraFrame = requestAnimationFrame(cameraTick);
  };

  const startCamera = () => {
    scene.dataset.cameraState = 'running';
    settledFrames = 0;
    if (cameraFrame) return;
    lastCameraTime = 0;
    cameraFrame = requestAnimationFrame(cameraTick);
  };

  const onFilmScroll = () => {
    rawTarget = readProgress(scene);
    filmLive = solo || scene.classList.contains('is-live');
    if (filmLive) startCamera();
    clearTimeout(cameraFallback);
    cameraFallback = setTimeout(() => {
      if (cameraFrame && performance.now() - lastFrameWall > 120) {
        smoothProgress = rawTarget;
        render(smoothProgress, rawTarget);
        parkCamera();
      }
    }, 150);
  };

  addEventListener('scroll', onFilmScroll, { passive: true });
  scene.addEventListener('scene:live', () => { filmLive = true; startCamera(); });
  scene.addEventListener('scene:idle', () => { filmLive = false; parkCamera(); });

  /* A rotation changes both the sticky viewport and every vh runway before
     the browser can preserve a normalized position. Keep the logical film
     progress, recompute its document Y after layout, then repaint that frame. */
  let viewportSnapshot = null;
  let viewportToken = 0;
  let viewportRevision = 0;
  const scheduleViewportRestore = () => {
    if (!viewportSnapshot) {
      viewportSnapshot = {
        progress: rawTarget,
        active: solo || filmLive || (rawTarget > .0001 && rawTarget < .9999),
      };
    }
    const token = ++viewportToken;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (token !== viewportToken) return;
      const snapshot = viewportSnapshot;
      viewportSnapshot = null;
      if (snapshot?.active) {
        const top = scrollY + scene.getBoundingClientRect().top;
        const span = Math.max(1, scene.offsetHeight - innerHeight);
        scrollTo({ top: top + snapshot.progress * span, behavior: 'auto' });
        scene.style.setProperty('--p', snapshot.progress.toFixed(4));
        rawTarget = snapshot.progress;
        smoothProgress = snapshot.progress;
        filmLive = true;
        render(smoothProgress, rawTarget);
        if (activeSlot >= 0) markPainted(slots[activeSlot]);
      }
      scene.dataset.viewportRevision = `${++viewportRevision}:${innerWidth}x${innerHeight}`;
      scene.dataset.viewportOrientation = innerWidth > innerHeight ? 'landscape' : 'portrait';
      if (filmLive && !solo) startCamera();
    }));
  };
  addEventListener('resize', scheduleViewportRestore, { passive: true });
  addEventListener('orientationchange', scheduleViewportRestore, { passive: true });
  window.visualViewport?.addEventListener('resize', scheduleViewportRestore, { passive: true });

  chapterButtons.forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.shot);
    const progress = progressForIndex(index, .08);
    const top = scrollY + scene.getBoundingClientRect().top;
    const span = Math.max(1, scene.offsetHeight - innerHeight);
    scrollTo({ top: top + progress * span, behavior: reduced ? 'auto' : 'smooth' });
  }));

  const proofStateEn = document.getElementById('proof-state-en');
  const proofStateAr = document.getElementById('proof-state-ar');
  const proofNoteEn = document.getElementById('proof-note-en');
  const proofNoteAr = document.getElementById('proof-note-ar');
  const proofStates = {
    attempt: {
      en: 'Attempt', ar: 'محاولة',
      noteEn: 'Run the mechanism.', noteAr: 'شغّل الآلية.',
    },
    observe: {
      en: 'Evidence kept', ar: 'حُفظ الدليل',
      noteEn: 'The fracture remains visible.', noteAr: 'يبقى الكسر ظاهرًا.',
    },
    proven: {
      en: 'Proven', ar: 'مُثبت',
      noteEn: 'The second pass closes the ring.', noteAr: 'تُغلق المحاولة الثانية الحلقة.',
    },
  };
  let lastProofState = '';
  const paintProof = () => {
    const progress = readProgress(proof);
    proof.style.setProperty('--proof', clamp(progress * 1.06).toFixed(4));
    const state = progress < .34 ? 'attempt' : progress < .69 ? 'observe' : 'proven';
    if (state === lastProofState) return;
    lastProofState = state;
    proof.dataset.proofState = state;
    const copy = proofStates[state];
    proofStateEn.textContent = copy.en;
    proofStateAr.textContent = copy.ar;
    proofNoteEn.textContent = copy.noteEn;
    proofNoteAr.textContent = copy.noteAr;
  };
  let proofTick = 0;
  const scheduleProof = () => {
    if (proofTick) return;
    proofTick = requestAnimationFrame(() => {
      proofTick = requestAnimationFrame(() => {
        proofTick = 0;
        paintProof();
      });
    });
  };
  addEventListener('scroll', scheduleProof, { passive: true });
  addEventListener('resize', scheduleProof, { passive: true });
  proof.addEventListener('scene:live', scheduleProof);

  window.__academyDirector = Object.freeze({
    version: '2.0.0',
    cameraMode: 'weighted-monotonic-full-bleed',
    acceptedSourceIds: shots.map((shot) => shot.id),
    heldSourceIds: ['ACA-002', 'ACA-016'],
    weights,
    panRange: [.37, .63],
    tiltRange: [.46, .54],
    panForProgress: (progress) => .37 + smoothstep(clamp(Number(progress))) * .26,
    progressForShot: (shot, fraction = .5) => progressForIndex(
      Math.max(0, Math.min(shots.length - 1, Number(shot) - 1)),
      fraction,
    ),
  });

  scene.dataset.viewportRevision = `0:${innerWidth}x${innerHeight}`;
  scene.dataset.viewportOrientation = innerWidth > innerHeight ? 'landscape' : 'portrait';
  rawTarget = readProgress(scene);
  smoothProgress = rawTarget;
  render(smoothProgress, rawTarget);
  paintProof();
  parkCamera();
  if (filmLive) startCamera();
})();
