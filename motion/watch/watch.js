/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/**
 * The watch page for the film the portfolio features (MK Launcher > Cinema publishes ../program.json).
 *   watch/?id=<item key>&lang=en|ar[#chapter-id]
 * Plays the full film (16:9, or the portrait cut on a phone held upright) full-bleed with the browser's controls.
 * No dependencies; the program is data from outside the build, so every path is checked before it is used.
 */
(() => {
  const q = new URLSearchParams(location.search), ar = q.get('lang') === 'ar', id = q.get('id') || '';
  const $ = s => document.querySelector(s);
  const root = document.documentElement, stage = $('[data-w]'), video = $('[data-video]'), play = $('[data-play]'), bar = $('[data-bar]');
  const home = `../../${ar ? 'ar' : 'en'}/`;
  root.lang = ar ? 'ar' : 'en'; root.dir = ar ? 'rtl' : 'ltr';
  $('[data-back]').href = home; $('[data-home]').href = home;
  $('[data-back-label]').textContent = ar ? 'رجوع' : 'Back';
  $('[data-gone-label]').textContent = ar ? 'هذا الفيلم غير متاح.' : 'This film is not available.';
  $('[data-home]').textContent = ar ? 'العودة إلى الرئيسية' : 'Back to the home';
  play.setAttribute('aria-label', ar ? 'تشغيل' : 'Play');

  const gone = () => {stage.classList.remove('is-idle'); bar.hidden = true; video.hidden = true; $('[data-gone]').hidden = false;};
  // paths in the program are relative to motion/ and live under program/<film>/ only
  const media = v => (typeof v === 'string' && !v.includes('..') && /^program\/[\w.-]+\/[\w.-]+\.(?:mp4|jpe?g|webp|png)$/.test(v) ? new URL(`../${v}`, location.href).href : '');

  // ?v= is the minute, as on the home: Pages caches a URL for 10 minutes, so a fresh publish needs a fresh URL to be seen at once
  fetch(`../program.json?v=${Math.floor(Date.now() / 60000)}`, {cache: 'no-store'}).then(r => (r.ok ? r.json() : null)).catch(() => null).then(program => {
    const item = program?.version === 1 && program.items && Object.hasOwn(program.items, id) ? program.items[id] : null;
    const wide = media(item?.film), tall = media(item?.filmTall), name = typeof item?.name === 'string' ? item.name.trim().slice(0, 80) : '';
    if (!item || !wide || !name) return gone();

    $('[data-title]').textContent = name;
    if (item.dir === 'ltr' || item.dir === 'rtl') $('[data-title]').dir = item.dir;
    document.title = `${name} — Mohamed Mahmoud`;
    video.poster = media(item.card);

    // a phone held upright gets the portrait cut when there is one; turning it keeps the place in the film
    const upright = matchMedia('(orientation: portrait) and (max-width: 820px)');
    const source = () => (upright.matches && tall ? tall : wide);
    video.src = source();
    upright.addEventListener('change', () => {
      if (video.src === source()) return;
      const at = video.currentTime, was = !video.paused;
      video.src = source();
      video.addEventListener('loadedmetadata', () => {video.currentTime = at; if (was) start();}, {once: true});
    });

    // #chapter-id starts at that chapter
    const want = location.hash.slice(1);
    const chapter = want && Array.isArray(item.chapters) ? item.chapters.find(c => c && c.id === want && Number.isFinite(c.start)) : null;
    if (chapter) video.addEventListener('loadedmetadata', () => {video.currentTime = Math.max(0, chapter.start);}, {once: true});

    // start with sound; if the browser says no, a big play button asks for the tap
    const start = () => video.play().then(() => {play.hidden = true;}).catch(() => {play.hidden = false;});
    play.addEventListener('click', start);
    video.addEventListener('play', () => {play.hidden = true;});
    start();

    // the back pill and title fade out while the film plays and come back on any touch, key or pause
    let idle = 0;
    const wake = () => {
      stage.classList.remove('is-idle'); clearTimeout(idle);
      if (!video.paused) idle = setTimeout(() => stage.classList.add('is-idle'), 2800);
    };
    for (const type of ['pointermove', 'pointerdown', 'keydown']) addEventListener(type, wake, {passive: true});
    video.addEventListener('play', wake); video.addEventListener('pause', wake);
    bar.addEventListener('focusin', wake);
    wake();
  });
})();
