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
    version: '1.5.0',
    weights: DIRECTOR_WEIGHTS,
    chapters: DIRECTOR_CHAPTERS,
    progressForShot: (shotNumber, fraction = .5) => progressForIndex(
      Math.max(0, Math.min(count - 1, Number(shotNumber) - 1)),
      fraction,
    ),
  });
  scene.dataset.directorVersion = '1.5.0';

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
    if (Math.abs(slot.video.currentTime - time) < 0.012) return;
    slot.seeking = true;
    try {
      slot.video.currentTime = time;
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
