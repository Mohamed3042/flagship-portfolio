(() => {
  'use strict';

  const scene = document.getElementById('cake-reel');
  if (!scene) return;

  const definitions = [...scene.querySelectorAll('.shot-data figure')];
  const videos = [...scene.querySelectorAll('.film-frame video')];
  const floor = scene.querySelector('.floor');
  const backdrop = scene.querySelector('.backdrop');
  const cue = document.getElementById('cake-cue');
  const shotNumber = document.getElementById('shot-number');
  const chapterEn = document.getElementById('chapter-en');
  const chapterAr = document.getElementById('chapter-ar');
  const titleEn = document.getElementById('title-en');
  const titleAr = document.getElementById('title-ar');
  const storyEn = document.getElementById('story-en');
  const storyAr = document.getElementById('story-ar');
  const directorNoteEn = document.getElementById('director-note-en');
  const directorNoteAr = document.getElementById('director-note-ar');
  const chapterButtons = [...scene.querySelectorAll('.chapter-nav button')];
  const chapterStarts = chapterButtons.map((button) => Number(button.dataset.shot));
  const count = definitions.length;
  if (count !== 50 || videos.length !== 2 || !directorNoteEn || !directorNoteAr) return;

  // The score is the product argument. Browsing ready forms is deliberately
  // quick; committing, catching an error, and closing the loop earn a hold.
  const DIRECTOR_WEIGHTS = Object.freeze([
    1.45, 1.25, 1.15, 1.45, 0.95, 1.05, 1.25,
    0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.60, 0.60,
    1.65, 1.85, 1.10, 1.25,
    1.00, 1.15, 1.00, 0.90, 1.05, 1.30,
    1.45, 1.65, 1.15, 1.15, 1.00, 1.30,
    1.10, 1.30, 1.55, 1.40, 1.45, 1.25,
    1.65, 1.35, 1.15, 1.45, 1.20, 1.20,
    1.05, 1.00, 1.10, 1.35, 1.25, 1.35, 1.65
  ]);

  const DIRECTOR_CHAPTERS = Object.freeze([
    {
      key: 'brief', rhythm: 'question', labelEn: 'The brief', labelAr: 'الطلب',
      purposeEn: 'A blank order becomes a visual specification before the kitchen touches it.',
      purposeAr: 'يتحوّل الطلب الفارغ إلى مواصفة بصرية قبل أن يلمسه المطبخ.',
    },
    {
      key: 'ready-forms', rhythm: 'rush', labelEn: 'Ready forms', labelAr: 'أشكال جاهزة',
      purposeEn: 'Reusable forms make the first choice quick, visible and reversible.',
      purposeAr: 'تجعل الأشكال القابلة لإعادة الاستخدام الاختيار الأول سريعًا ومرئيًا وقابلًا للرجوع.',
    },
    {
      key: 'flexible-design', rhythm: 'decision', labelEn: 'Flexible design', labelAr: 'تصميم مرن',
      purposeEn: 'Change the design without rebuilding the cake geometry.',
      purposeAr: 'غيّر التصميم من دون إعادة بناء هندسة الكعكة.',
    },
    {
      key: 'place-exactly', rhythm: 'craft', labelEn: 'Place exactly', labelAr: 'وضع دقيق',
      purposeEn: 'Images, type and decoration follow the real surface instead of a guess.',
      purposeAr: 'تتبع الصور والنصوص والزينة السطح الحقيقي بدل التخمين.',
    },
    {
      key: 'protect-colour', rhythm: 'protect', labelEn: 'Protect colour', labelAr: 'حماية اللون',
      purposeEn: 'Correct the screen before edible ink and material are spent.',
      purposeAr: 'صحّح الشاشة قبل إنفاق الحبر الصالح للأكل والخامة.',
    },
    {
      key: 'measurable', rhythm: 'proof', labelEn: 'Make it measurable', labelAr: 'اجعله قابلًا للقياس',
      purposeEn: 'Turn the approved picture into a true-size, version-bound handoff.',
      purposeAr: 'حوّل الصورة المعتمدة إلى تسليم بالحجم الحقيقي مرتبط بمراجعة محددة.',
    },
    {
      key: 'catch-mistakes', rhythm: 'gate', labelEn: 'Catch mistakes', labelAr: 'اكتشاف الأخطاء',
      purposeEn: 'Reject the expensive mistake before it reaches the baker.',
      purposeAr: 'ارفض الخطأ المكلف قبل أن يصل إلى الخباز.',
    },
    {
      key: 'make-real', rhythm: 'release', labelEn: 'Make it real', labelAr: 'اجعله حقيقة',
      purposeEn: 'Software ends where physical craft begins, then saves the result for reuse.',
      purposeAr: 'تنتهي البرمجيات حيث تبدأ الحرفة المادية، ثم تحفظ النتيجة لإعادة استخدامها.',
    },
  ]);

  const totalDirectorWeight = DIRECTOR_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  const directorStops = DIRECTOR_WEIGHTS.reduce((stops, weight) => {
    stops.push(stops.at(-1) + weight);
    return stops;
  }, [0]);
  const progressForIndex = (shotIndex, fraction = 0) => (
    directorStops[shotIndex] + DIRECTOR_WEIGHTS[shotIndex] * Math.max(0, Math.min(1, fraction))
  ) / totalDirectorWeight;
  const locateDirectorProgress = (progress) => {
    const target = Math.min(progress, .999999) * totalDirectorWeight;
    let index = DIRECTOR_WEIGHTS.findIndex((_, candidate) => target < directorStops[candidate + 1]);
    if (index < 0) index = count - 1;
    return {
      index,
      fraction: (target - directorStops[index]) / DIRECTOR_WEIGHTS[index],
      weight: DIRECTOR_WEIGHTS[index],
    };
  };

  window.__cakeStudioDirector = Object.freeze({
    version: '1.6.0',
    weights: DIRECTOR_WEIGHTS,
    chapters: DIRECTOR_CHAPTERS,
    progressForShot: (shotNumber, fraction = .5) => progressForIndex(
      Math.max(0, Math.min(count - 1, Number(shotNumber) - 1)),
      fraction,
    ),
  });
  scene.dataset.directorVersion = '1.6.0';

  const shots = definitions.map((figure) => ({
    clip: figure.dataset.clip,
    poster: figure.dataset.poster,
    chapterEn: figure.dataset.chapterEn,
    chapterAr: figure.dataset.chapterAr,
    titleEn: figure.dataset.titleEn,
    titleAr: figure.dataset.titleAr,
    storyEn: figure.querySelector('.L.en')?.textContent.trim() ?? '',
    storyAr: figure.querySelector('.L.ar')?.textContent.trim() ?? '',
  }));

  const solo = new URLSearchParams(location.search).has('solo');
  const clamp = (value) => value < 0 ? 0 : value > 1 ? 1 : value;
  const readRaw = () => clamp(Number.parseFloat(scene.style.getPropertyValue('--p') || '0'));
  const slots = videos.map((video) => ({
    video,
    shot: -1,
    ready: false,
    seeking: false,
    wanted: -1,
    fetchId: 0,
    abort: null,
    retryTimer: 0,
    objectUrl: '',
  }));

  let shown = -1;
  let currentShot = -1;
  let direction = 1;
  let smoothProgress = readRaw();
  let live = solo || scene.classList.contains('is-live');
  let cameraFrame = 0;
  let lastTimestamp = 0;
  let lastFrameWall = performance.now();
  let settledFrames = 0;
  let fallback = 0;

  const release = (slot) => {
    slot.fetchId += 1;
    slot.abort?.abort();
    slot.abort = null;
    clearTimeout(slot.retryTimer);
    slot.retryTimer = 0;
    if (slot.objectUrl) URL.revokeObjectURL(slot.objectUrl);
    slot.objectUrl = '';
    slot.ready = false;
    slot.seeking = false;
    slot.wanted = -1;
    slot.video.classList.remove('on');
    delete slot.video.dataset.firstFrameDecoded;
    slot.video.removeAttribute('src');
    slot.video.load();
  };

  const arm = (slot, shotIndex) => {
    if (slot.shot === shotIndex && (slot.objectUrl || slot.abort)) return slot;
    release(slot);
    slot.shot = shotIndex;
    slot.fetchId += 1;
    slot.video.poster = shots[shotIndex].poster;
    slot.video.dataset.clip = shots[shotIndex].clip;
    const fetchId = slot.fetchId;

    const load = (attempt) => {
      const controller = new AbortController();
      slot.abort = controller;
      const timeout = setTimeout(() => controller.abort(), 10_000);
      fetch(shots[shotIndex].clip, { signal: controller.signal, cache: 'force-cache' })
        .then((response) => {
          if (!response.ok) throw new Error(`clip HTTP ${response.status}`);
          return response.blob();
        })
        .then((blob) => {
          clearTimeout(timeout);
          if (slot.fetchId !== fetchId) return;
          slot.abort = null;
          slot.objectUrl = URL.createObjectURL(blob);
          slot.video.src = slot.objectUrl;
          slot.video.load();
        })
        .catch(() => {
          clearTimeout(timeout);
          if (slot.fetchId !== fetchId) return;
          if (attempt < 2) {
            // Blob transport occasionally loses an abandoned range while the
            // scroll hand jumps chapters. Keep recovery bounded, but give the
            // active shot one extra chance before falling back to its poster.
            slot.retryTimer = setTimeout(() => {
              slot.retryTimer = 0;
              if (slot.fetchId === fetchId) load(attempt + 1);
            }, 120 * (attempt + 1));
            return;
          }
          slot.abort = null;
          slot.ready = false;
          scene.dataset.mediaState = 'poster';
        });
    };
    load(0);
    return slot;
  };

  const seek = (slot, time) => {
    if (!slot.ready) return;
    if (slot.seeking) {
      slot.wanted = time;
      return;
    }
    const firstDecode = time <= .012
      && slot.video.currentTime === 0
      && slot.video.dataset.firstFrameDecoded !== 'true';
    if (!firstDecode && Math.abs(slot.video.currentTime - time) < 0.012) return;
    slot.seeking = true;
    if (firstDecode) slot.video.dataset.firstFrameDecoded = 'true';
    try {
      // A tiny non-zero seek forces Chromium to replace the poster with the
      // decoded first frame while preserving frame zero visually.
      slot.video.currentTime = firstDecode ? .001 : time;
    } catch {
      slot.seeking = false;
    }
  };

  for (const slot of slots) {
    slot.video.addEventListener('loadedmetadata', () => {
      if (!slot.objectUrl || slot.video.currentSrc !== slot.objectUrl) return;
      slot.ready = true;
      scene.dataset.mediaState = 'ready';
      // A first-visit clip may finish loading after the scroll camera has parked.
      // Seek from the hand's actual position so the first decoded frame never
      // inherits an earlier eased fraction.
      smoothProgress = readRaw();
      render(smoothProgress, smoothProgress);
    });
    slot.video.addEventListener('seeked', () => {
      slot.seeking = false;
      if (slot.wanted >= 0) {
        const wanted = slot.wanted;
        slot.wanted = -1;
        seek(slot, wanted);
      }
    });
    slot.video.addEventListener('error', () => {
      if (!slot.objectUrl || slot.video.currentSrc !== slot.objectUrl) return;
      slot.ready = false;
      slot.video.classList.remove('on');
      scene.dataset.mediaState = 'poster';
    }, true);
  }

  const slotFor = (shotIndex) => {
    const existing = slots.find((slot) => slot.shot === shotIndex);
    if (existing) return existing;
    const next = shown === 0 ? slots[1] : slots[0];
    return arm(next, shotIndex);
  };

  const show = (slot) => {
    const index = slots.indexOf(slot);
    if (index === shown) return;
    shown = index;
    for (const other of slots) other.video.classList.toggle('on', other === slot);
  };

  const setShot = (index) => {
    if (index === currentShot) return;
    currentShot = index;
    const shot = shots[index];
    const chapterIndex = chapterStarts.reduce((active, start, candidate) => start <= index ? candidate : active, 0);
    const chapter = DIRECTOR_CHAPTERS[chapterIndex];
    chapterButtons.forEach((button, buttonIndex) => button.classList.toggle('on', buttonIndex === chapterIndex));
    chapterEn.textContent = chapter.labelEn;
    chapterAr.textContent = chapter.labelAr;
    directorNoteEn.textContent = chapter.purposeEn;
    directorNoteAr.textContent = chapter.purposeAr;
    titleEn.textContent = shot.titleEn;
    titleAr.textContent = shot.titleAr;
    storyEn.textContent = shot.storyEn;
    storyAr.textContent = shot.storyAr;
    shotNumber.textContent = `${String(index + 1).padStart(2, '0')} / 50`;
    floor.src = shot.poster;
    backdrop.src = shot.poster;
    scene.dataset.currentShot = String(index + 1);
    scene.dataset.currentClip = shot.clip;
    scene.dataset.chapterKey = chapter.key;
    scene.dataset.rhythm = chapter.rhythm;
    scene.dataset.shotWeight = DIRECTOR_WEIGHTS[index].toFixed(2);
    cue.classList.remove('swap');
    void cue.offsetWidth;
    cue.classList.add('swap');
  };

  function render(progress, raw) {
    const beat = locateDirectorProgress(progress);
    const { index, fraction, weight } = beat;
    scene.style.setProperty('--f', fraction.toFixed(4));
    scene.style.setProperty('--journey', progress.toFixed(5));
    scene.style.setProperty('--pace-weight', weight.toFixed(2));
    setShot(index);
    if (!live && !solo) return;

    const slot = slotFor(index);
    show(slot);
    if (slot.ready) {
      const duration = slot.video.duration || 5;
      seek(slot, Math.min(duration - .04, Math.max(0, fraction * duration)));
    }

    const hand = raw - progress;
    if (hand > .0001) direction = 1;
    else if (hand < -.0001) direction = -1;
    const neighbour = index + direction;
    if (neighbour >= 0 && neighbour < count) {
      const other = slots[1 - slots.indexOf(slot)];
      if (other.shot !== neighbour) arm(other, neighbour);
    }
  }

  const park = () => {
    if (cameraFrame) cancelAnimationFrame(cameraFrame);
    cameraFrame = 0;
    lastTimestamp = 0;
    settledFrames = 0;
    scene.dataset.cameraState = 'idle';
  };

  const camera = (timestamp) => {
    cameraFrame = 0;
    lastFrameWall = performance.now();
    const raw = readRaw();
    const gap = raw - smoothProgress;
    if (solo || Math.abs(gap) * totalDirectorWeight > 2) {
      smoothProgress = raw;
    } else if (Math.abs(gap) < .0001) {
      smoothProgress = raw;
    } else {
      const delta = lastTimestamp ? Math.min(64, timestamp - lastTimestamp) : 1000 / 60;
      smoothProgress += gap * (1 - Math.exp(-delta / 110));
    }
    lastTimestamp = timestamp;
    render(smoothProgress, raw);
    if (Math.abs(raw - smoothProgress) < .0001) settledFrames += 1;
    else settledFrames = 0;
    if (!live || settledFrames >= 3) {
      park();
      return;
    }
    cameraFrame = requestAnimationFrame(camera);
  };

  const start = () => {
    scene.dataset.cameraState = 'running';
    settledFrames = 0;
    if (cameraFrame) return;
    lastTimestamp = 0;
    cameraFrame = requestAnimationFrame(camera);
  };

  const onScroll = () => {
    if (solo) {
      smoothProgress = readRaw();
      render(smoothProgress, smoothProgress);
      park();
      return;
    }
    live = scene.classList.contains('is-live');
    if (live) start();
    clearTimeout(fallback);
    fallback = setTimeout(() => {
      if (cameraFrame && performance.now() - lastFrameWall > 120) {
        smoothProgress = readRaw();
        render(smoothProgress, smoothProgress);
        park();
      }
    }, 150);
  };

  chapterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const shotIndex = Number(button.dataset.shot);
      const progress = progressForIndex(shotIndex, .02);
      const top = scene.getBoundingClientRect().top + scrollY;
      const travel = Math.max(0, scene.offsetHeight - innerHeight);
      scrollTo({
        top: top + travel * progress,
        behavior: 'smooth',
      });
    });
  });

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  scene.addEventListener('scene:live', () => {
    live = true;
    start();
  });
  scene.addEventListener('scene:idle', () => {
    live = false;
    park();
  });
  addEventListener('pagehide', () => slots.forEach(release), { once: true });

  if (solo) {
    let holds = 0;
    const hold = setInterval(() => {
      smoothProgress = readRaw();
      render(smoothProgress, smoothProgress);
      park();
      if (++holds > 60) clearInterval(hold);
    }, 100);
  }

  render(smoothProgress, smoothProgress);
  park();
  if (live && !solo) start();
})();

/* v1.7 bookend director: two page-local, manifest-driven micro-films. */
(() => {
  'use strict';

  const scenes = [...document.querySelectorAll('[data-cake-bookend]')];
  if (!scenes.length) return;

  const bookendManifest = scenes[0].dataset.bookendManifest;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const query = new URLSearchParams(location.search);
  const solo = query.has('solo');
  const phoneMedia = matchMedia('(max-width: 700px), (pointer: coarse)');
  const usePhoneMaster = phoneMedia.matches && !query.has('bookendDesktop');
  const clamp = (value) => value < 0 ? 0 : value > 1 ? 1 : value;
  const phoneVelocityThreshold = 10;
  const phoneVelocityHoldMs = 180;
  const phoneSettleMs = 180;
  const runtime = {
    version: '1.7.2',
    state: 'loading',
    manifestReady: false,
    units: [],
    snapshot: () => runtime.units.map((unit) => ({
      track: unit.trackName,
      transport: unit.scene.dataset.sequenceTransport || '',
      mode: unit.scene.dataset.sequenceMode,
      state: unit.scene.dataset.sequenceState,
      index: Number(unit.scene.dataset.sequenceIndex || 0),
      clip: unit.scene.dataset.sequenceClip || '',
      fraction: Number(unit.scene.dataset.sequenceFraction || 0),
      targetTime: Number(unit.scene.dataset.sequenceTargetTime || 0),
      time: unit.scene.dataset.sequenceTime ? Number(unit.scene.dataset.sequenceTime) : null,
      lag: unit.scene.dataset.sequenceLag ? Number(unit.scene.dataset.sequenceLag) : null,
      painted: unit.scene.classList.contains('sequence-painted'),
      phone: unit.phoneMode ? {
        armed: unit.phoneSlot.armed,
        metadata: unit.phoneSlot.metadata,
        seeking: unit.phoneSlot.seeking,
        wanted: unit.phoneSlot.wanted,
        wantedExact: unit.phoneSlot.wantedExact,
        slotTarget: unit.phoneSlot.target,
        seekTimer: Boolean(unit.phoneSlot.seekTimer),
        currentTime: unit.phoneSlot.video.currentTime,
        readyState: unit.phoneSlot.video.readyState,
        warmState: unit.warmState,
        sourceMode: unit.phoneSlot.sourceOverride ? 'blob' : 'network',
        previewMode: unit.scene.dataset.sequencePreviewMode || '',
        atlasReady: unit.phoneAtlasReady,
        atlasVisible: unit.phoneAtlasVisible,
        atlasTile: unit.phoneAtlasTile,
        landingReady: unit.phoneLandingReady,
        landingVisible: unit.phoneLandingVisible,
      } : null,
    })),
  };
  window.__cakeStudioBookends = runtime;

  if (!bookendManifest || scenes.some((scene) => scene.dataset.bookendManifest !== bookendManifest)) {
    runtime.state = 'manifest-error';
    runtime.error = 'bookend scenes do not share one manifest URL';
    return;
  }

  const validateManifest = (manifest) => {
    if (manifest.schema !== 'cake-studio-bookends/v1' || manifest.version !== '1.7.2') {
      throw new Error('bookend manifest version mismatch');
    }
    if (manifest.width !== 1280 || manifest.height !== 720 || manifest.fps !== 30 || manifest.duration !== 5) {
      throw new Error('bookend manifest media contract mismatch');
    }
    const delivery = manifest.delivery;
    const conditioning = delivery?.endpointConditioning;
    const phoneDelivery = delivery?.phoneMaster;
    const scrubDelivery = delivery?.phoneScrubAtlas;
    const terminalDelivery = delivery?.phoneTerminalStill;
    if (delivery?.codec !== 'H.264' || delivery?.pixelFormat !== 'yuv420p'
      || delivery?.silent !== true || delivery?.keyframeInterval !== 15 || delivery?.faststart !== true
      || conditioning?.openingConvergenceFrames !== 9
      || conditioning?.closingConvergenceStartFrame !== 126
      || conditioning?.closingConvergenceEndFrame !== 135
      || conditioning?.exactFinalHoldFrames !== 15
      || phoneDelivery?.codec !== 'H.264'
      || phoneDelivery?.pixelFormat !== 'yuv420p'
      || phoneDelivery?.width !== 640 || phoneDelivery?.height !== 360
      || phoneDelivery?.fps !== 15 || phoneDelivery?.beatFrames !== 68
      || phoneDelivery?.finalTailExtraFrames !== 7
      || phoneDelivery?.terminalFrameOffset !== 2
      || phoneDelivery?.keyframeInterval !== 8
      || phoneDelivery?.silent !== true || phoneDelivery?.faststart !== true
      || scrubDelivery?.mimeType !== 'image/webp'
      || scrubDelivery?.tileWidth !== 384 || scrubDelivery?.tileHeight !== 216
      || scrubDelivery?.quality !== 85
      || terminalDelivery?.mimeType !== 'image/webp'
      || terminalDelivery?.width !== 640 || terminalDelivery?.height !== 360
      || terminalDelivery?.quality !== 100) {
      throw new Error('bookend manifest delivery contract mismatch');
    }
    if (typeof manifest.ready !== 'boolean' || !manifest.tracks || typeof manifest.tracks !== 'object') {
      throw new Error('bookend manifest readiness or tracks missing');
    }
    const expected = {
      intro: Array.from({ length: 10 }, (_, index) => `I${String(index + 1).padStart(2, '0')}`),
      outro: Array.from({ length: 5 }, (_, index) => `O${String(index + 1).padStart(2, '0')}`),
    };
    if (Object.keys(manifest.tracks).sort().join(',') !== 'intro,outro') {
      throw new Error('bookend manifest must expose exactly intro and outro tracks');
    }
    const sources = new Set();
    for (const [trackName, ids] of Object.entries(expected)) {
      const track = manifest.tracks[trackName];
      if (!track || !Array.isArray(track.clips) || track.clips.length !== ids.length) {
        throw new Error(`bookend ${trackName} clip count mismatch`);
      }
      if (!/^cake-studio\/v17\/stills\/CST17-[IO][0-9]{2}-.+\.webp$/.test(track.poster || '')) {
        throw new Error(`bookend ${trackName} poster path mismatch`);
      }
      const phone = track.phoneMaster;
      const phoneFrames = ids.length * phoneDelivery.beatFrames + phoneDelivery.finalTailExtraFrames;
      const phoneSource = `cake-studio/v17/clips/CST17-${trackName === 'intro' ? 'INTRO' : 'OUTRO'}-PHONE-v172.mp4`;
      const phonePrefix = `cake-studio/v17/clips/CST17-${trackName === 'intro' ? 'INTRO' : 'OUTRO'}-PHONE`;
      const expectedSamples = trackName === 'intro' ? 32 : 16;
      const expectedRows = trackName === 'intro' ? 4 : 2;
      if (!phone
        || phone.src !== phoneSource
        || phone.width !== phoneDelivery.width || phone.height !== phoneDelivery.height
        || phone.fps !== phoneDelivery.fps || phone.beatFrames !== phoneDelivery.beatFrames
        || phone.finalTailExtraFrames !== phoneDelivery.finalTailExtraFrames
        || phone.terminalFrameOffset !== phoneDelivery.terminalFrameOffset
        || phone.keyframeInterval !== phoneDelivery.keyframeInterval
        || phone.frames !== phoneFrames
        || Math.abs(phone.duration - phoneFrames / phone.fps) > .001) {
        throw new Error(`bookend ${trackName} phone master contract mismatch`);
      }
      const atlas = phone.scrubAtlas;
      const terminal = phone.terminalStill;
      if (!atlas
        || atlas.src !== `${phonePrefix}-SCRUB-v172.webp`
        || atlas.width !== 8 * scrubDelivery.tileWidth
        || atlas.height !== expectedRows * scrubDelivery.tileHeight
        || atlas.tileWidth !== scrubDelivery.tileWidth || atlas.tileHeight !== scrubDelivery.tileHeight
        || atlas.quality !== scrubDelivery.quality
        || atlas.columns !== 8 || atlas.rows !== expectedRows
        || atlas.samples !== expectedSamples
        || !Array.isArray(atlas.frames) || atlas.frames.length !== expectedSamples
        || atlas.frames[0] !== 0 || atlas.frames.at(-1) !== phoneFrames - phoneDelivery.terminalFrameOffset
        || atlas.frames.some((frame, index) => !Number.isInteger(frame)
          || frame < 0 || frame >= phoneFrames
          || (index > 0 && frame <= atlas.frames[index - 1]))
        || !Number.isInteger(atlas.bytes) || atlas.bytes <= 0
        || !/^[0-9a-f]{64}$/.test(atlas.sha256 || '')) {
        throw new Error(`bookend ${trackName} scrub atlas contract mismatch`);
      }
      if (!terminal
        || terminal.src !== `${phonePrefix}-TERMINAL-v172.webp`
        || terminal.width !== terminalDelivery.width || terminal.height !== terminalDelivery.height
        || terminal.quality !== terminalDelivery.quality
        || terminal.frame !== phoneFrames - phoneDelivery.terminalFrameOffset
        || Math.abs(terminal.time - terminal.frame / phoneDelivery.fps) > .001
        || !Number.isInteger(terminal.bytes) || terminal.bytes <= 0
        || !/^[0-9a-f]{64}$/.test(terminal.sha256 || '')) {
        throw new Error(`bookend ${trackName} terminal still contract mismatch`);
      }
      track.clips.forEach((clip, index) => {
        if (clip.id !== ids[index]) throw new Error(`bookend ${trackName} order mismatch`);
        if (!/^cake-studio\/v17\/clips\/CST17-[IO][0-9]{2}\.mp4$/.test(clip.src || '')) {
          throw new Error(`bookend ${clip.id} media path mismatch`);
        }
        if (!/^cake-studio\/v17\/stills\/CST17-[IO][0-9]{2}-.+\.webp$/.test(clip.first || '')
          || !/^cake-studio\/v17\/stills\/CST17-[IO][0-9]{2}-.+\.webp$/.test(clip.last || '')) {
          throw new Error(`bookend ${clip.id} endpoint path mismatch`);
        }
        if (index && track.clips[index - 1].last !== clip.first) {
          throw new Error(`bookend ${trackName} endpoint continuity mismatch`);
        }
        if (sources.has(clip.src)) throw new Error(`bookend duplicate media source ${clip.src}`);
        sources.add(clip.src);
      });
    }
    if (sources.size !== 15) throw new Error('bookend media source count mismatch');
    return manifest;
  };

  const readProgress = (scene) => clamp(Number.parseFloat(scene.style.getPropertyValue('--p') || '0'));
  const locate = (clips, progress) => {
    if (progress >= .999999) return { index: clips.length - 1, fraction: 1 };
    const scaled = progress * clips.length;
    const index = Math.min(clips.length - 1, Math.floor(scaled));
    return { index, fraction: scaled - index };
  };

  const release = (slot) => {
    slot.generation += 1;
    slot.ready = false;
    slot.seeking = false;
    slot.wanted = -1;
    slot.index = -1;
    slot.video.removeAttribute('src');
    slot.video.load();
  };

  const setPoster = (unit, source) => {
    if (!source || unit.poster.getAttribute('src') === source) return;
    unit.poster.src = source;
  };

  const setPhoneCounter = (unit, frame) => {
    const index = Math.min(
      unit.clips.length - 1,
      Math.max(0, Math.floor(frame / unit.phoneMaster.beatFrames)),
    );
    unit.counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(unit.clips.length).padStart(2, '0')}`;
    unit.scene.dataset.sequencePresentedIndex = String(index + 1);
  };

  const hidePhoneAtlas = (unit, state = 'hidden') => {
    if (!unit.phoneAtlasCanvas) return;
    unit.phoneAtlasVisible = false;
    unit.phoneAtlasCanvas.dataset.visible = 'false';
    unit.scene.classList.remove('sequence-scrub-preview');
    unit.scene.dataset.sequenceAtlas = state;
  };

  const hidePhoneLanding = (unit, state = 'hidden') => {
    if (!unit.phoneLanding) return;
    unit.phoneLandingVisible = false;
    unit.phoneLanding.dataset.visible = 'false';
    unit.scene.classList.remove('sequence-terminal-landing');
    unit.scene.dataset.sequenceLanding = state;
  };

  const releasePhoneAtlas = (unit, preserveSurface = false) => {
    if (!unit?.phoneMode) return;
    unit.phoneAtlasGeneration += 1;
    unit.phoneAtlasReady = false;
    unit.phoneAtlasLoading = false;
    unit.phoneAtlasImage?.removeAttribute('src');
    unit.phoneAtlasImage = null;
    if (preserveSurface && unit.phoneAtlasVisible) {
      unit.scene.dataset.sequenceAtlas = 'held';
    } else {
      unit.phoneAtlasTile = -1;
      unit.phoneAtlasContext.clearRect(0, 0, unit.phoneAtlasCanvas.width, unit.phoneAtlasCanvas.height);
      hidePhoneAtlas(unit, 'released');
    }
  };

  const drawPhoneAtlas = (unit, target) => {
    const atlas = unit.phoneAtlas;
    const image = unit.phoneAtlasImage;
    if (!unit.phoneAtlasReady || !image?.complete || !image.naturalWidth) return false;
    let tileIndex = 0;
    let tileFrame = atlas.frames[0];
    let tileTime = tileFrame / unit.phoneMaster.fps;
    for (let index = 1; index < atlas.frames.length; index += 1) {
      const candidateFrame = atlas.frames[index];
      const candidateTime = candidateFrame / unit.phoneMaster.fps;
      if (Math.abs(candidateTime - target) < Math.abs(tileTime - target)) {
        tileIndex = index;
        tileFrame = candidateFrame;
        tileTime = candidateTime;
      }
    }
    const sameTile = unit.phoneAtlasVisible && unit.phoneAtlasTile === tileIndex;
    if (!sameTile) {
      const column = tileIndex % atlas.columns;
      const row = Math.floor(tileIndex / atlas.columns);
      unit.phoneAtlasContext.drawImage(
        image,
        column * atlas.tileWidth,
        row * atlas.tileHeight,
        atlas.tileWidth,
        atlas.tileHeight,
        0,
        0,
        unit.phoneAtlasCanvas.width,
        unit.phoneAtlasCanvas.height,
      );
    }
    unit.phoneAtlasTile = tileIndex;
    unit.phoneAtlasVisible = true;
    unit.phoneAtlasCanvas.dataset.visible = 'true';
    unit.phoneAtlasCanvas.dataset.tile = String(tileIndex);
    unit.phoneAtlasCanvas.dataset.frame = String(tileFrame);
    unit.phoneAtlasCanvas.dataset.time = tileTime.toFixed(6);
    unit.scene.dataset.sequenceAtlas = 'visible';
    unit.scene.dataset.sequenceTime = tileTime.toFixed(4);
    unit.scene.dataset.sequenceLag = Math.abs(tileTime - target).toFixed(4);
    unit.scene.classList.add('sequence-painted', 'sequence-scrub-preview');
    setPhoneCounter(unit, tileFrame);
    return true;
  };

  const showPhoneLanding = (unit, terminalTarget) => {
    const landing = unit.phoneLanding;
    if (!unit.phoneLandingReady || !landing.complete
      || landing.naturalWidth !== unit.phoneTerminal.width
      || landing.naturalHeight !== unit.phoneTerminal.height) return false;
    if (!unit.phoneLandingVisible) {
      unit.phoneLandingVisible = true;
      landing.dataset.visible = 'true';
      unit.scene.dataset.sequenceLanding = 'visible';
      unit.scene.classList.add('sequence-painted', 'sequence-terminal-landing');
    }
    unit.scene.dataset.sequenceTime = terminalTarget.toFixed(4);
    unit.scene.dataset.sequenceLag = '0.0000';
    setPhoneCounter(unit, unit.phoneTerminal.frame);
    return true;
  };

  const loadPhoneLanding = (unit) => {
    if (!unit?.phoneMode || reducedMotion.matches || unit.phoneLandingReady
      || unit.phoneLandingLoading) return unit?.phoneLandingPromise;
    unit.phoneLandingLoading = true;
    unit.phoneLanding.fetchPriority = 'high';
    unit.phoneLanding.src = unit.phoneTerminal.src;
    const decoded = typeof unit.phoneLanding.decode === 'function'
      ? unit.phoneLanding.decode()
      : Promise.resolve();
    unit.phoneLandingPromise = decoded.then(() => {
      unit.phoneLandingLoading = false;
      unit.phoneLandingReady = unit.phoneLanding.naturalWidth === unit.phoneTerminal.width
        && unit.phoneLanding.naturalHeight === unit.phoneTerminal.height;
      unit.scene.dataset.sequenceLanding = unit.phoneLandingReady ? 'ready' : 'error';
      if (unit.live) renderUnit(unit, readProgress(unit.scene));
    }).catch(() => {
      unit.phoneLandingLoading = false;
      unit.phoneLandingReady = false;
      unit.scene.dataset.sequenceLanding = 'error';
    });
    return unit.phoneLandingPromise;
  };

  const loadPhoneAtlas = (unit) => {
    if (!unit?.phoneMode || reducedMotion.matches || unit.phoneAtlasReady
      || unit.phoneAtlasLoading) return unit?.phoneAtlasPromise;
    for (const other of runtime.units) {
      if (other !== unit && (other.phoneAtlasReady || other.phoneAtlasLoading)) releasePhoneAtlas(other, true);
    }
    unit.phoneAtlasLoading = true;
    unit.scene.dataset.sequenceAtlas = 'loading';
    const generation = ++unit.phoneAtlasGeneration;
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = 'high';
    unit.phoneAtlasImage = image;
    image.src = unit.phoneAtlas.src;
    const decoded = typeof image.decode === 'function' ? image.decode() : Promise.resolve();
    unit.phoneAtlasPromise = decoded.then(() => {
      if (generation !== unit.phoneAtlasGeneration || unit.phoneAtlasImage !== image) return;
      const ready = image.naturalWidth === unit.phoneAtlas.width
        && image.naturalHeight === unit.phoneAtlas.height;
      if (ready) {
        unit.phoneAtlasContext.drawImage(
          image,
          0,
          0,
          unit.phoneAtlas.tileWidth,
          unit.phoneAtlas.tileHeight,
          0,
          0,
          unit.phoneAtlasCanvas.width,
          unit.phoneAtlasCanvas.height,
        );
        unit.phoneAtlasContext.getImageData(0, 0, 1, 1);
        unit.phoneAtlasContext.clearRect(0, 0, unit.phoneAtlasCanvas.width, unit.phoneAtlasCanvas.height);
      }
      unit.phoneAtlasLoading = false;
      unit.phoneAtlasReady = ready;
      unit.scene.dataset.sequenceAtlas = ready ? 'ready' : 'error';
      loadPhoneLanding(unit);
      if (ready && unit.live) {
        // A cold atlas can finish just after the last touch sample. Paint its
        // current tile before the exact master catches up so the generic
        // poster never remains exposed merely because the velocity hold
        // expired while the image was decoding.
        if (!unit.scene.classList.contains('sequence-painted')
          && readProgress(unit.scene) < .999) {
          drawPhoneAtlas(unit, unit.phoneTarget);
        }
        renderUnit(unit, readProgress(unit.scene));
      }
    }).catch(() => {
      if (generation !== unit.phoneAtlasGeneration) return;
      unit.phoneAtlasLoading = false;
      unit.phoneAtlasReady = false;
      unit.scene.dataset.sequenceAtlas = 'error';
      loadPhoneLanding(unit);
    });
    return unit.phoneAtlasPromise;
  };

  const commitPhoneFrame = (unit) => {
    const slot = unit.phoneSlot;
    if (!slot?.armed || !slot.metadata || slot.video.readyState < 2) return;
    const mediaTime = slot.video.currentTime;
    slot.lastPainted = mediaTime;
    const terminalTarget = unit.phoneMaster.duration
      - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps;
    const tolerance = 1 / unit.phoneMaster.fps + .002;
    const exactVisible = Math.abs(mediaTime - slot.target) <= tolerance
      && Math.abs(slot.target - unit.phoneTarget) < .009;
    const mayReplacePreview = unit.phoneTarget < terminalTarget - .009
      && slot.targetExact === true && unit.phoneSettleAt > 0 && exactVisible;
    if ((unit.phoneAtlasVisible || unit.phoneLandingVisible) && !mayReplacePreview) return;
    unit.scene.dataset.sequenceTime = mediaTime.toFixed(4);
    unit.scene.dataset.sequenceLag = Math.abs(mediaTime - unit.phoneTarget).toFixed(4);
    unit.scene.dataset.sequenceState = 'ready';
    unit.scene.classList.add('sequence-painted');
    setPhoneCounter(unit, Math.round(mediaTime * unit.phoneMaster.fps));
    if (mayReplacePreview) {
      hidePhoneAtlas(unit, 'exact-video');
      hidePhoneLanding(unit, 'exact-video');
      unit.scene.dataset.sequencePreviewMode = 'exact-follow';
    }
  };

  const issuePhoneSeek = (unit) => {
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
  };

  const queuePhoneSeek = (unit, time, exact = false) => {
    const slot = unit.phoneSlot;
    if (!slot?.armed) return;
    const duration = slot.video.duration || unit.phoneMaster.duration;
    // The final packet sits at EOF and can leave Chromium seeking forever.
    // The penultimate keyed frame is the same conditioned endpoint, so stop
    // there without changing what the visitor sees.
    const terminalTime = duration - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps;
    const target = Math.min(terminalTime, Math.max(.001, time));
    slot.wanted = target;
    slot.wantedExact ||= exact;
    if (!slot.metadata) return;
    if (slot.seeking) {
      if (exact && Math.abs(slot.target - target) >= .009) {
        // After the finger settles, cancel the obsolete network seek instead
        // of waiting for it to finish before requesting the actual resting
        // frame. Assigning currentTime while the element is already seeking
        // is the browser-supported cancellation path.
        slot.seeking = false;
        issuePhoneSeek(unit);
      }
      return;
    }
    const minimumInterval = slot.wantedExact ? 0 : 66;
    const delay = Math.max(0, minimumInterval - (performance.now() - slot.lastIssued));
    if (!delay) {
      issuePhoneSeek(unit);
      return;
    }
    if (slot.seekTimer) return;
    slot.seekTimer = setTimeout(() => {
      slot.seekTimer = 0;
      issuePhoneSeek(unit);
    }, delay);
  };

  const armPhoneMaster = (unit) => {
    const slot = unit.phoneSlot;
    if (!slot || slot.armed || reducedMotion.matches) return;
    slot.armed = true;
    slot.generation += 1;
    slot.video.preload = unit.trackName === 'intro' ? 'auto' : 'metadata';
    slot.video.src = slot.sourceOverride || unit.phoneMaster.src;
    slot.video.dataset.sequenceClip = `${unit.trackName}-phone-master`;
    unit.scene.dataset.sequenceState = 'phone-loading';
    slot.video.load();
  };

  const releasePhoneMaster = (unit) => {
    const slot = unit.phoneSlot;
    if (!slot) return;
    slot.generation += 1;
    clearTimeout(slot.seekTimer);
    clearTimeout(unit.phoneSettleTimer);
    slot.seekTimer = 0;
    unit.phoneSettleTimer = 0;
    slot.armed = false;
    slot.metadata = false;
    slot.seeking = false;
    slot.wanted = -1;
    slot.wantedExact = false;
    slot.targetExact = false;
    slot.lastPainted = null;
    slot.video.removeAttribute('src');
    slot.video.load();
    unit.scene.classList.remove('sequence-painted');
    delete unit.scene.dataset.sequenceTime;
    delete unit.scene.dataset.sequenceLag;
  };

  const activatePhoneBlob = (unit, source) => {
    const slot = unit.phoneSlot;
    if (!slot) return;
    if (unit.live || reducedMotion.matches) {
      slot.pendingSource = source;
      return;
    }
    clearTimeout(slot.seekTimer);
    slot.seekTimer = 0;
    slot.generation += 1;
    slot.armed = false;
    slot.metadata = false;
    slot.seeking = false;
    slot.wanted = -1;
    slot.wantedExact = false;
    slot.targetExact = false;
    slot.sourceOverride = source;
    slot.pendingSource = '';
    slot.video.removeAttribute('src');
    slot.video.load();
    unit.scene.classList.remove('sequence-painted');
    delete unit.scene.dataset.sequenceTime;
    armPhoneMaster(unit);
    queuePhoneSeek(unit, unit.phoneTarget, true);
  };

  const warmPhoneMaster = (unit) => {
    if (!unit?.phoneMode || reducedMotion.matches || unit.warmState !== 'idle') return unit?.warmPromise;
    unit.warmState = 'loading';
    unit.scene.dataset.sequenceWarm = 'loading';
    unit.warmAbort = new AbortController();
    unit.warmPromise = fetch(unit.phoneMaster.src, {
      cache: 'force-cache',
      signal: unit.warmAbort.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`phone warm HTTP ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        if (reducedMotion.matches) return;
        unit.phoneBlobUrl = URL.createObjectURL(blob);
        unit.warmState = 'ready';
        unit.scene.dataset.sequenceWarm = 'ready';
        unit.scene.dataset.sequenceWarmBytes = String(blob.size);
        activatePhoneBlob(unit, unit.phoneBlobUrl);
      })
      .catch((error) => {
        if (error?.name === 'AbortError') {
          unit.warmState = 'idle';
          unit.scene.dataset.sequenceWarm = 'idle';
          return;
        }
        unit.warmState = 'network-fallback';
        unit.scene.dataset.sequenceWarm = 'network-fallback';
      });
    return unit.warmPromise;
  };

  const renderPhoneMaster = (unit, progress) => {
    const now = performance.now();
    const priorTarget = unit.phoneTarget;
    const priorAt = unit.phoneVelocityAt;
    const terminalTarget = unit.phoneMaster.duration
      - unit.phoneMaster.terminalFrameOffset / unit.phoneMaster.fps;
    unit.phoneTarget = Math.min(terminalTarget, progress * unit.phoneMaster.duration);
    const elapsed = now - priorAt;
    const targetChanged = Math.abs(unit.phoneTarget - priorTarget) >= .001;
    const velocityWindow = Math.min(50, Math.max(1, elapsed));
    const velocity = targetChanged
      ? Math.abs(unit.phoneTarget - priorTarget) * 1000 / velocityWindow
      : 0;
    unit.phoneVelocityAt = now;
    if (targetChanged) {
      unit.phoneLastTargetAt = now;
      unit.phoneSettleAt = 0;
    }
    if (velocity >= phoneVelocityThreshold) {
      unit.phoneHighVelocitySamples += 1;
    } else {
      unit.phoneHighVelocitySamples = 0;
    }
    if (unit.phoneHighVelocitySamples >= 1) {
      unit.phoneVelocityUntil = now + phoneVelocityHoldMs;
    }
    const highVelocity = now < unit.phoneVelocityUntil;
    unit.phoneAtlasHighVelocity = highVelocity;
    unit.scene.dataset.sequenceTargetTime = unit.phoneTarget.toFixed(4);
    unit.scene.dataset.sequenceVelocity = velocity.toFixed(3);
    unit.scene.dataset.sequencePreviewMode = highVelocity ? 'sprite-atlas' : 'exact-follow';
    if (!solo && !unit.live) return;
    armPhoneMaster(unit);
    loadPhoneAtlas(unit);
    loadPhoneLanding(unit);

    const terminal = progress >= .999;
    if (terminal && showPhoneLanding(unit, terminalTarget)) {
      hidePhoneAtlas(unit, 'terminal');
      clearTimeout(unit.phoneSlot.seekTimer);
      unit.phoneSlot.seekTimer = 0;
      unit.phoneSlot.wanted = -1;
      unit.phoneSlot.wantedExact = false;
      unit.scene.dataset.sequencePreviewMode = 'terminal-landing';
    }
    const terminalHold = unit.phoneLandingVisible
      && unit.phoneTarget >= terminalTarget - .009;
    if (terminalHold) unit.scene.dataset.sequencePreviewMode = 'terminal-landing';

    if (highVelocity) {
      clearTimeout(unit.phoneSlot.seekTimer);
      unit.phoneSlot.seekTimer = 0;
      unit.phoneSlot.wanted = -1;
      unit.phoneSlot.wantedExact = false;
      if (!terminalHold) {
        const drewAtlas = drawPhoneAtlas(unit, unit.phoneTarget);
        if (drewAtlas && unit.phoneLandingVisible) {
          hidePhoneLanding(unit, 'reverse-atlas');
        }
      }
    } else if (!unit.phoneAtlasVisible && !unit.phoneLandingVisible) {
      queuePhoneSeek(unit, unit.phoneTarget);
    } else if (unit.phoneLandingVisible && !terminalHold) {
      unit.scene.dataset.sequenceLanding = 'exit-pending';
      queuePhoneSeek(unit, unit.phoneTarget);
    }

    clearTimeout(unit.phoneSettleTimer);
    unit.phoneSettleTimer = setTimeout(() => {
      unit.phoneSettleTimer = 0;
      unit.phoneHighVelocitySamples = 0;
      unit.phoneVelocityUntil = 0;
      unit.phoneAtlasHighVelocity = false;
      if (progress >= .999 || terminalHold) {
        unit.scene.dataset.sequencePreviewMode = unit.phoneLandingVisible
          ? 'terminal-landing'
          : unit.phoneAtlasVisible ? 'sprite-atlas' : 'terminal-pending';
        return;
      }
      unit.phoneSettleAt = performance.now();
      queuePhoneSeek(unit, unit.phoneTarget, true);
    }, phoneSettleMs);
  };

  const draw = (unit, slot, immediate = false) => {
    if (unit.active !== slot || !slot.ready || slot.video.readyState < 2) return;
    const generation = slot.generation;
    const target = slot.target;
    const commit = (_now, metadata = {}) => {
      if (generation !== slot.generation || unit.active !== slot || slot.video.readyState < 2) return;
      if (target !== slot.target) return;
      const mediaTime = metadata.mediaTime ?? slot.video.currentTime;
      if (Math.abs(mediaTime - target) > .05) return;
      const width = slot.video.videoWidth || 1280;
      const height = slot.video.videoHeight || 720;
      if (unit.canvas.width !== width || unit.canvas.height !== height) {
        unit.canvas.width = width;
        unit.canvas.height = height;
      }
      unit.context.drawImage(slot.video, 0, 0, width, height);
      unit.scene.dataset.sequenceTime = mediaTime.toFixed(4);
      unit.scene.classList.add('sequence-painted');
    };
    if (immediate) {
      commit(performance.now(), { mediaTime: slot.video.currentTime });
    } else if (typeof slot.video.requestVideoFrameCallback === 'function') {
      slot.video.requestVideoFrameCallback(commit);
    } else {
      setTimeout(() => commit(performance.now()), 90);
    }
  };

  const seek = (unit, slot, time) => {
    if (!slot.ready) return;
    const duration = slot.video.duration || unit.duration;
    const target = Math.min(Math.max(.001, duration - 1 / 30), Math.max(.001, time));
    slot.target = target;
    if (slot.seeking) {
      slot.wanted = target;
      return;
    }
    if (Math.abs(slot.video.currentTime - target) < .009) {
      // A paused frame that is already at the requested time will not emit a
      // future video-frame callback. It is decoded now, so commit it through
      // the same generation, active-slot and target-distance guards.
      draw(unit, slot, true);
      return;
    }
    slot.seeking = true;
    try {
      slot.video.currentTime = target;
    } catch {
      slot.seeking = false;
    }
  };

  const arm = (unit, slot, index) => {
    if (slot.index === index && slot.video.getAttribute('src')) return slot;
    release(slot);
    slot.index = index;
    slot.generation += 1;
    const generation = slot.generation;
    const clip = unit.clips[index];
    slot.video.dataset.sequenceClip = clip.id;
    // Arm before assigning the URL, and wait for a decoded frame rather than
    // metadata alone. A paused video can reach loadedmetadata at readyState 1;
    // rendering there would be dropped and no later scroll event is assured.
    slot.video.addEventListener('loadeddata', () => {
      if (generation !== slot.generation) return;
      slot.ready = true;
      unit.scene.dataset.sequenceState = 'ready';
      renderUnit(unit, readProgress(unit.scene));
    }, { once: true });
    slot.video.src = clip.src;
    slot.video.load();
    return slot;
  };

  const chooseSlot = (unit, index) => {
    const existing = unit.slots.find((slot) => slot.index === index);
    if (existing) return existing;
    const available = unit.slots.find((slot) => slot !== unit.active) || unit.slots[0];
    return arm(unit, available, index);
  };

  function renderUnit(unit, progress) {
    const beat = locate(unit.clips, progress);
    const clip = unit.clips[beat.index];
    const clipChanged = unit.currentIndex !== beat.index;
    const targetTime = Math.min(unit.duration - 1 / 30, beat.fraction * unit.duration);
    const targetChanged = clipChanged || Math.abs(unit.targetTime - targetTime) >= .009;
    unit.currentIndex = beat.index;
    unit.targetTime = targetTime;
    const previousProgress = unit.lastProgress;
    unit.direction = progress >= previousProgress ? 1 : -1;
    unit.lastProgress = progress;
    unit.scene.style.setProperty('--sequence-progress', progress.toFixed(5));
    unit.scene.style.setProperty('--sequence-local', beat.fraction.toFixed(5));
    unit.scene.dataset.sequenceIndex = String(beat.index + 1);
    unit.scene.dataset.sequenceClip = clip.id;
    unit.scene.dataset.sequenceFraction = beat.fraction.toFixed(5);
    unit.scene.dataset.sequenceTargetTime = targetTime.toFixed(4);
    if (!unit.phoneMode || reducedMotion.matches) {
      unit.counter.textContent = `${String(beat.index + 1).padStart(2, '0')} / ${String(unit.clips.length).padStart(2, '0')}`;
    }
    unit.meter.style.setProperty('--sequence-progress', progress.toFixed(5));

    const endpointIndex = Math.min(unit.clips.length, Math.round(progress * unit.clips.length));
    if (reducedMotion.matches || !unit.phoneMode) {
      setPoster(unit, unit.endpoints[endpointIndex]);
    }

    if (targetChanged && !unit.phoneMode) {
      unit.scene.classList.remove('sequence-painted');
      delete unit.scene.dataset.sequenceTime;
    }

    if (reducedMotion.matches || !unit.mediaReady) {
      unit.scene.dataset.sequenceMode = 'still';
      unit.scene.dataset.sequenceTransport = 'poster';
      unit.scene.dataset.sequenceState = unit.mediaReady ? 'reduced-motion' : 'awaiting-media';
      unit.scene.classList.remove('sequence-painted');
      return;
    }

    unit.scene.dataset.sequenceMode = 'motion';
    if (unit.phoneMode) {
      unit.scene.dataset.sequenceTransport = 'phone-master';
      renderPhoneMaster(unit, progress);
      return;
    }
    unit.scene.dataset.sequenceTransport = 'clip-canvas';
    if (!solo && !unit.live) return;

    const slot = chooseSlot(unit, beat.index);
    if (unit.active !== slot) {
      unit.active = slot;
      unit.scene.classList.remove('sequence-painted');
    }
    if (slot.ready) {
      const duration = slot.video.duration || unit.duration;
      seek(unit, slot, beat.fraction >= .999999 ? duration - 1 / 30 : beat.fraction * duration);
    }

    const neighbour = beat.index + unit.direction;
    if (neighbour >= 0 && neighbour < unit.clips.length) {
      const preload = unit.slots.find((candidate) => candidate !== slot);
      if (preload && preload.index !== neighbour) arm(unit, preload, neighbour);
    }
  }

  const createUnit = (scene, manifest) => {
    const trackName = scene.dataset.bookendTrack;
    const track = manifest.tracks[trackName];
    if (!track || !Array.isArray(track.clips) || !track.clips.length) return null;
    const sequence = scene.querySelector('[data-bookend-sequence]');
    const canvas = scene.querySelector('[data-bookend-canvas]');
    const phoneVideo = scene.querySelector('[data-bookend-phone-video]');
    const phoneAtlasCanvas = scene.querySelector('[data-phone-scrub-atlas]');
    const phoneLanding = scene.querySelector('[data-phone-terminal-landing]');
    const poster = scene.querySelector('[data-bookend-poster]');
    const meter = scene.querySelector('[data-bookend-meter]');
    const counter = scene.querySelector('[data-bookend-count]');
    const context = canvas?.getContext('2d', { alpha: false });
    const phoneAtlasContext = phoneAtlasCanvas?.getContext('2d', { alpha: false, willReadFrequently: true });
    if (!sequence || !canvas || !phoneVideo || !phoneAtlasCanvas || !phoneLanding
      || !poster || !meter || !counter || !context || !phoneAtlasContext) return null;

    const unit = {
      scene,
      sequence,
      canvas,
      context,
      poster,
      meter,
      counter,
      trackName,
      clips: track.clips,
      phoneMode: usePhoneMaster,
      phoneMaster: track.phoneMaster,
      phoneAtlas: track.phoneMaster.scrubAtlas,
      phoneTerminal: track.phoneMaster.terminalStill,
      phoneAtlasCanvas,
      phoneAtlasContext,
      phoneAtlasImage: null,
      phoneAtlasPromise: null,
      phoneAtlasGeneration: 0,
      phoneAtlasLoading: false,
      phoneAtlasReady: false,
      phoneAtlasVisible: false,
      phoneAtlasTile: -1,
      phoneLanding,
      phoneLandingPromise: null,
      phoneLandingLoading: false,
      phoneLandingReady: false,
      phoneLandingVisible: false,
      phoneSlot: null,
      phoneTarget: 0,
      phoneSettleTimer: 0,
      phoneSettleAt: 0,
      phoneVelocityAt: performance.now(),
      phoneVelocityUntil: 0,
      phoneHighVelocitySamples: 0,
      phoneAtlasHighVelocity: false,
      phoneLastTargetAt: performance.now(),
      warmState: 'idle',
      warmPromise: null,
      warmAbort: null,
      phoneBlobUrl: '',
      endpoints: [track.clips[0].first, ...track.clips.map((clip) => clip.last)],
      duration: manifest.duration,
      mediaReady: manifest.ready === true,
      active: null,
      live: solo || scene.classList.contains('is-live'),
      direction: 1,
      lastProgress: readProgress(scene),
      currentIndex: -1,
      targetTime: -1,
      slots: [],
    };

    phoneAtlasCanvas.dataset.visible = 'false';
    phoneLanding.dataset.visible = 'false';

    unit.phoneSlot = {
      video: phoneVideo,
      armed: false,
      metadata: false,
      seeking: false,
      wanted: -1,
      wantedExact: false,
      target: 0,
      targetExact: false,
      lastPainted: null,
      lastIssued: -Infinity,
      seekTimer: 0,
      generation: 0,
      sourceOverride: '',
      pendingSource: '',
    };
    phoneVideo.addEventListener('loadedmetadata', () => {
      const slot = unit.phoneSlot;
      if (!slot.armed || !phoneVideo.getAttribute('src')) return;
      slot.metadata = true;
      unit.scene.dataset.sequenceState = 'phone-metadata';
      if (unit.phoneAtlasHighVelocity) {
        slot.wanted = -1;
        slot.wantedExact = false;
        return;
      }
      queuePhoneSeek(unit, unit.phoneTarget, true);
    });
    phoneVideo.addEventListener('loadeddata', () => {
      const slot = unit.phoneSlot;
      if (!slot.armed || !slot.metadata) return;
      if (Math.abs(phoneVideo.currentTime - unit.phoneTarget) < .05) commitPhoneFrame(unit);
    });
    phoneVideo.addEventListener('seeked', () => {
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
    });
    phoneVideo.addEventListener('error', () => {
      const slot = unit.phoneSlot;
      if (!slot.armed || !phoneVideo.getAttribute('src')) return;
      clearTimeout(slot.seekTimer);
      slot.seekTimer = 0;
      slot.seeking = false;
      unit.scene.dataset.sequenceState = 'phone-media-error';
      if (!unit.phoneAtlasVisible && !unit.phoneLandingVisible) {
        unit.scene.classList.remove('sequence-painted');
        delete unit.scene.dataset.sequenceTime;
        delete unit.scene.dataset.sequenceLag;
      }
    });

    unit.slots = unit.phoneMode ? [] : Array.from({ length: 2 }, () => {
      const video = document.createElement('video');
      video.className = 'bookend-buffer';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.disablePictureInPicture = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('aria-hidden', 'true');
      sequence.appendChild(video);
      const slot = {
        video,
        index: -1,
        generation: 0,
        ready: false,
        seeking: false,
        wanted: -1,
        target: 0,
      };
      video.addEventListener('seeked', () => {
        slot.seeking = false;
        if (slot.wanted >= 0) {
          const wanted = slot.wanted;
          slot.wanted = -1;
          seek(unit, slot, wanted);
          return;
        }
        // `seeked` means this paused frame is decoded. Waiting for another
        // requestVideoFrameCallback would stall until playback, which this
        // scroll-scrubber deliberately never starts.
        draw(unit, slot, true);
      });
      video.addEventListener('error', () => {
        if (!video.getAttribute('src')) return;
        const activeFailure = unit.active === slot;
        release(slot);
        if (activeFailure) {
          unit.active = null;
          unit.scene.dataset.sequenceState = 'poster';
          unit.scene.classList.remove('sequence-painted');
          delete unit.scene.dataset.sequenceTime;
        }
      });
      return slot;
    });

    scene.dataset.sequenceMode = reducedMotion.matches || !unit.mediaReady ? 'still' : 'motion';
    scene.dataset.sequenceTransport = reducedMotion.matches
      ? 'poster'
      : unit.phoneMode ? 'phone-master' : 'clip-canvas';
    scene.dataset.sequenceState = unit.mediaReady ? 'ready' : 'awaiting-media';
    scene.dataset.sequenceCount = String(unit.clips.length);
    scene.addEventListener('scene:live', () => {
      unit.live = true;
      if (unit.phoneMode && !reducedMotion.matches) {
        loadPhoneAtlas(unit);
        loadPhoneLanding(unit);
      }
      renderUnit(unit, readProgress(scene));
    });
    scene.addEventListener('scene:idle', () => {
      unit.live = false;
      if (unit.phoneMode) {
        clearTimeout(unit.phoneSettleTimer);
        clearTimeout(unit.phoneSlot.seekTimer);
        unit.phoneSettleTimer = 0;
        unit.phoneSlot.seekTimer = 0;
        unit.phoneSlot.wanted = -1;
        unit.phoneSlot.wantedExact = false;
        unit.phoneHighVelocitySamples = 0;
        unit.phoneVelocityUntil = 0;
        unit.phoneAtlasHighVelocity = false;
        releasePhoneAtlas(unit, true);
      }
      if (unit.phoneMode && unit.phoneSlot.pendingSource) {
        activatePhoneBlob(unit, unit.phoneSlot.pendingSource);
      } else if (!unit.phoneMode) {
        unit.scene.classList.remove('sequence-painted');
        delete unit.scene.dataset.sequenceTime;
      }
    });
    renderUnit(unit, unit.lastProgress);
    return unit;
  };

  let ticking = false;
  const paint = () => {
    ticking = false;
    for (const unit of runtime.units) renderUnit(unit, readProgress(unit.scene));
  };
  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };

  fetch(bookendManifest, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`bookend manifest HTTP ${response.status}`);
      return response.json();
    })
    .then((manifest) => {
      validateManifest(manifest);
      runtime.manifestReady = manifest.ready === true;
      const units = scenes.map((scene) => createUnit(scene, manifest)).filter(Boolean);
      if (units.length !== 2) throw new Error('bookend runtime did not create both tracks');
      runtime.units = units;
      if (usePhoneMaster && manifest.ready === true && !reducedMotion.matches) {
        const intro = runtime.units.find((unit) => unit.trackName === 'intro');
        const outro = runtime.units.find((unit) => unit.trackName === 'outro');
        const openingUnit = runtime.units.find((unit) => unit.live) || intro;
        loadPhoneAtlas(openingUnit);
        loadPhoneLanding(openingUnit);
        // Prime only the bookend that is actually opening. Arming the distant
        // master here competes with the small scrub atlas when a visitor lands
        // directly on the outro. The normal intro path warms the outro after
        // the intro has left the viewport.
        armPhoneMaster(openingUnit);
        queuePhoneSeek(openingUnit, openingUnit.phoneTarget, true);
        let warmOutroTimer = 0;
        const warmOutro = () => {
          clearTimeout(warmOutroTimer);
          warmOutroTimer = setTimeout(() => {
            warmOutroTimer = 0;
            if (outro && !outro.live) warmPhoneMaster(outro);
          }, phoneSettleMs);
        };
        const cancelLiveOutroWarm = () => {
          clearTimeout(warmOutroTimer);
          warmOutroTimer = 0;
          if (outro?.warmState === 'loading' && !outro.phoneBlobUrl) {
            outro.warmAbort?.abort();
            outro.warmState = 'idle';
            outro.scene.dataset.sequenceWarm = 'idle';
          }
        };
        intro?.scene.addEventListener('scene:idle', warmOutro, { once: true });
        intro?.scene.addEventListener('scene:idle', () => {
          loadPhoneAtlas(outro);
          loadPhoneLanding(outro);
        }, { once: true });
        outro?.scene.addEventListener('scene:live', cancelLiveOutroWarm);
      }
      runtime.state = manifest.ready === true ? 'ready' : 'awaiting-media';
      addEventListener('scroll', schedule, { passive: true });
      addEventListener('resize', schedule, { passive: true });
      reducedMotion.addEventListener?.('change', () => {
        if (reducedMotion.matches) {
          for (const unit of runtime.units) {
            unit.warmAbort?.abort();
            unit.slots.forEach(release);
            if (unit.phoneMode) {
              releasePhoneMaster(unit);
              releasePhoneAtlas(unit);
              hidePhoneLanding(unit, 'reduced-motion');
              unit.phoneLanding.removeAttribute('src');
              unit.phoneLandingReady = false;
            }
          }
        }
        paint();
      });
      paint();
    })
    .catch((error) => {
      runtime.state = 'manifest-error';
      runtime.error = error instanceof Error ? error.message : String(error);
      for (const scene of scenes) {
        scene.dataset.sequenceMode = 'still';
        scene.dataset.sequenceTransport = 'poster';
        scene.dataset.sequenceState = 'manifest-error';
      }
    });

  addEventListener('pagehide', () => {
    for (const unit of runtime.units) {
      unit.warmAbort?.abort();
      unit.slots.forEach(release);
      if (unit.phoneMode) {
        releasePhoneMaster(unit);
        releasePhoneAtlas(unit);
        hidePhoneLanding(unit, 'pagehide');
      }
      if (unit.phoneBlobUrl) URL.revokeObjectURL(unit.phoneBlobUrl);
    }
  }, { once: true });
})();
