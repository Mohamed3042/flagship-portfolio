(() => {
  'use strict';

  const arabic = new URLSearchParams(location.search).get('lang') === 'ar';
  const copy = arabic ? {
    skip: 'تجاوز الفيلم', portfolioLabel: 'مشروع Reclaim في معرض الأعمال', navigation: 'التنقل في الفيلم',
    title: 'القرص الثقيل — فيلم Reclaim', filmLabel: 'فيلم Reclaim كاملًا، مدته ٩٠ ثانية',
    filmName: 'القرص الثقيل', start: 'مرّر الصفحة لتحريك الفيلم',
    watch: 'شاهد مع الصوت', scrollMode: 'تحكّم بالتمرير',
    scrollHint: 'مرّر لأسفل للتقدم، ولأعلى للرجوع.', nativeHint: 'شغّل الفيلم كاملًا مع الصوت.',
    loading: 'جارٍ تحميل الفيلم…', failed: 'تعذّر تحميل نسخة التمرير. اختر «شاهد مع الصوت» لفتح الفيلم الأصلي.',
    buffered: 'تم تحميله من الفيلم', bufferedDescription: 'النسبة المتاحة للمشاهدة من مدة الفيلم بعد تحميلها.',
    nativeFailed: 'تعذّر تحميل الفيلم. يمكنك فتح النسخة الأصلية من رابط التنزيل أدناه.',
    position: 'موضع الفيلم', openFilm: 'افتح الفيلم', endTitle: 'مساحة لفصل جديد.',
    endBody: 'اعرف ما يملأ قرصك. وقرر ما يستحق البقاء.', preview: 'استكشف Reclaim',
    portfolio: 'المشروع في معرض الأعمال ↗', restart: 'عد إلى البداية ↑',
    previewNote: 'تستخدم معاينة المتصفح ملفات تجريبية.', download: 'نزّل الفيلم الأصلي · 1080p / 60 fps'
  } : {
    watch: 'Watch with sound', scrollMode: 'Use scroll controls',
    scrollHint: 'Scroll down to advance. Scroll up to rewind.', nativeHint: 'Play the complete film with sound.',
    loading: 'Loading film…', failed: 'The scroll version could not load. Choose “Watch with sound” for the original film.',
    buffered: 'Film buffered', bufferedDescription: 'Percentage of the film currently loaded and available to view.',
    nativeFailed: 'The film could not load. You can open the original using the download link below.'
  };

  if (arabic) {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.title = 'Reclaim — تحكّم في الفيلم بالتمرير';
    for (const element of document.querySelectorAll('[data-copy]')) {
      if (copy[element.dataset.copy]) element.textContent = copy[element.dataset.copy];
    }
    for (const element of document.querySelectorAll('[data-label]')) {
      if (copy[element.dataset.label]) element.setAttribute('aria-label', copy[element.dataset.label]);
    }
    for (const link of document.querySelectorAll('[data-portfolio]')) link.href = '../ar/work/reclaim';
    const language = document.querySelector('#language-link');
    language.textContent = 'English';
    language.href = '?lang=en';
    language.lang = language.hreflang = 'en';
  }

  const track = document.querySelector('.film-track');
  const stage = document.querySelector('.film-stage');
  const film = document.querySelector('#film');
  const toggle = document.querySelector('#mode-toggle');
  const range = document.querySelector('#film-position');
  const rangeWrap = document.querySelector('.scrub-control');
  const cue = document.querySelector('.opening-cue');
  const status = document.querySelector('#film-status');
  const loading = document.querySelector('.film-loading');
  const loadingProgress = document.querySelector('#film-loading-progress');
  const loadingPercent = document.querySelector('#film-loading-percent');
  const instruction = document.querySelector('#instruction');
  const clock = document.querySelector('#film-time');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const frameDuration = 1 / 30;
  let scrolling = false;
  let target = 0;
  let trackStart = 0;
  let travel = 18000;
  let scheduled = false;
  let restoreTime = null;
  let metadataReady = false;
  let initialized = false;
  let seekPending = false;
  let modeVersion = 0;

  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const duration = () => Number.isFinite(film.duration) ? film.duration : 90;
  const lastFrame = () => Math.max(0, duration() - frameDuration);
  const timecode = (time) => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

  function updateLoading() {
    let seconds = 0;
    const length = film.duration;
    if (metadataReady && Number.isFinite(length) && length > 0) {
      // Buffered ranges can be disconnected after a seek. Count only loaded parts,
      // not the last endpoint, which could imply a fully loaded movie after a jump.
      const ranges = film.buffered;
      for (let i = 0; i < ranges.length; i += 1) {
        seconds += Math.max(0, Math.min(length, ranges.end(i)) - Math.max(0, ranges.start(i)));
      }
    }
    const percent = seconds > 0 ? Math.floor(clamp(seconds / length, 0, 1) * 100) : 0;
    loadingProgress.value = percent;
    loadingProgress.textContent = `${percent}%`;
    loadingPercent.textContent = `${percent}%`;
  }

  function updateReadout(time) {
    clock.textContent = timecode(time);
    range.max = String(lastFrame());
    range.value = String(time);
    range.style.setProperty('--position', `${time / duration() * 100}%`);
    range.setAttribute('aria-valuetext', arabic ? `${timecode(time)} من 1:30` : `${timecode(time)} of 1:30`);
  }

  function measure() {
    // A fixed document distance avoids mobile browser-chrome changes shifting the film.
    track.style.setProperty('--scroll-distance', '18000px');
    trackStart = track.getBoundingClientRect().top + window.scrollY;
    travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
  }

  function seekLatest() {
    // Only one seek at a time. The next seek always uses the newest scroll position.
    if (!scrolling || !metadataReady || film.seeking || seekPending) return;
    if (Math.abs(film.currentTime - target) >= frameDuration / 2) {
      seekPending = true;
      film.currentTime = target;
    }
  }

  function updateFromScroll() {
    scheduled = false;
    if (!scrolling) return;
    const position = clamp((window.scrollY - trackStart) / travel, 0, 1) * lastFrame();
    target = Math.round(position / frameDuration) * frameDuration;
    updateReadout(target);
    cue.hidden = target > 0.3;
    seekLatest();
  }

  function schedule() {
    if (!scheduled && scrolling) {
      scheduled = true;
      requestAnimationFrame(updateFromScroll);
    }
  }

  function useMode(scroll, play = false) {
    const firstMount = !initialized;
    initialized = true;
    const keepTime = scrolling ? target : restoreTime ?? film.currentTime ?? 0;
    modeVersion += 1;
    seekPending = false;
    film.pause();
    scrolling = scroll;
    scheduled = false;
    metadataReady = false;
    updateLoading();
    document.documentElement.classList.toggle('scroll-mode', scroll);
    film.controls = !scroll;
    film.muted = scroll;
    film.preload = scroll ? 'auto' : 'metadata';
    rangeWrap.hidden = !scroll;
    toggle.textContent = scroll ? copy.watch : copy.scrollMode;
    instruction.textContent = scroll ? copy.scrollHint : copy.nativeHint;
    cue.hidden = !scroll || keepTime > 0.3;
    status.textContent = copy.loading;
    restoreTime = scroll ? null : keepTime;
    film.src = scroll ? film.dataset.scrollSrc : film.dataset.fullSrc;
    film.load();
    measure();
    if (scroll) {
      if (!firstMount) window.scrollTo({ top: trackStart + clamp(keepTime / lastFrame(), 0, 1) * travel, behavior: 'instant' });
      updateFromScroll();
    } else {
      if (!firstMount) window.scrollTo({ top: trackStart, behavior: 'instant' });
      updateReadout(keepTime);
    }
    if (play) film.play().catch(() => { /* Native play remains available if the browser requires it. */ });
  }

  film.addEventListener('loadedmetadata', () => {
    metadataReady = true;
    updateLoading();
    if (scrolling) updateFromScroll();
    else if (restoreTime !== null) {
      film.currentTime = clamp(restoreTime, 0, lastFrame());
      restoreTime = null;
    }
  });
  film.addEventListener('loadeddata', () => { status.textContent = ''; seekLatest(); });
  film.addEventListener('canplay', () => { status.textContent = ''; seekLatest(); });
  for (const event of ['progress', 'durationchange', 'loadeddata', 'canplay', 'seeked', 'suspend', 'stalled', 'emptied']) {
    film.addEventListener(event, updateLoading);
  }
  film.addEventListener('seeked', () => {
    // Decoding completes before presentation. Give the paused frame a paint before
    // draining the latest target, including targets received during rapid reversals.
    const version = modeVersion;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (version !== modeVersion) return;
      seekPending = false;
      seekLatest();
    }));
  });
  film.addEventListener('timeupdate', () => { if (!scrolling) updateReadout(film.currentTime); });
  film.addEventListener('error', () => {
    status.textContent = scrolling ? copy.failed : copy.nativeFailed;
    cue.hidden = true;
  });
  film.addEventListener('play', () => { if (scrolling) film.pause(); });
  toggle.addEventListener('click', () => useMode(!scrolling, scrolling));
  range.addEventListener('input', () => {
    if (!scrolling) return;
    window.scrollTo({ top: trackStart + Number(range.value) / lastFrame() * travel, behavior: 'instant' });
    updateFromScroll();
  });
  document.querySelector('#restart').addEventListener('click', () => {
    if (!scrolling) { restoreTime = null; film.pause(); film.currentTime = 0; updateReadout(0); }
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { measure(); schedule(); }, { passive: true });
  window.addEventListener('pageshow', () => { measure(); schedule(); });
  motion.addEventListener('change', () => useMode(!motion.matches));
  toggle.disabled = false;
  toggle.hidden = false;
  loading.hidden = false;
  useMode(!motion.matches);
})();
