import { CHAPTERS as EN_CHAPTERS, clamp, scrollProgress, mediaMode, chapterAt, formatTime, downloadProgress } from './core.mjs';
import { MEDIA } from './media.mjs';
import { LANG, CALM, AR_CHAPTERS, copy } from './portal.mjs';
const CHAPTERS = LANG === 'ar' ? AR_CHAPTERS : EN_CHAPTERS;

const $ = id => document.getElementById(id);
const video = $('decoder'), canvas = $('film'), ctx = canvas.getContext('2d', { alpha: false });
const runway = $('runway'), scrubber = $('scrubber'), dialog = $('watch-dialog'), watchVideo = $('watch-video');
const chapterButtons = [...$('chapters').querySelectorAll('button')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let mode, xhr, blobURL, generation = 0, ready = false, pendingFrame = 0, progress = 0, targetTime = 0;
let duration = 28, distance = 5600, chapter = -1, resizeFrame = 0, lastWidth = innerWidth, dialogProgress = 0;
let previousPortalDistance = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--portal-distance')) || 1600;
let savedPortalProgress = 0;

function announce(message) { $('status').textContent = message; }
function setControls(enabled) {
  scrubber.disabled = !enabled;
  $('watch').disabled = !enabled;
  chapterButtons.forEach(button => { button.disabled = !enabled; });
}
function runwayStart() { return runway.getBoundingClientRect().top + scrollY; }
function updateTimeline(time) {
  const shownTime = time >= duration - 0.04 ? duration : time;
  const position = clamp(shownTime / duration);
  scrubber.value = String(Math.round(position * 1000));
  scrubber.style.setProperty('--position', `${position * 100}%`);
  scrubber.setAttribute('aria-valuetext', LANG === 'ar' ? `${shownTime.toFixed(1)} من ${duration} ثانية. ${CHAPTERS[chapterAt(shownTime)]}` : `${shownTime.toFixed(1)} seconds of ${duration} seconds. ${CHAPTERS[chapterAt(shownTime)]}`);
  $('elapsed').textContent = formatTime(shownTime);
  const nextChapter = chapterAt(shownTime);
  if (chapter !== nextChapter) {
    chapter = nextChapter;
    $('chapter-number').textContent = String(chapter + 1).padStart(2, '0');
    $('chapter-title').textContent = CHAPTERS[chapter];
    canvas.setAttribute('aria-label', `${LANG === 'ar' ? 'فيلم استوديو الكعك' : 'MK Cake film'}. ${CHAPTERS[chapter]}.`);
    chapterButtons.forEach((button, index) => {
      if (index === chapter) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }
  $('cue').hidden = !ready || position > 0.025;
}
function draw() {
  if (video.readyState < 2 || !video.videoWidth) return;
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  if (video.currentTime > 27.7) {
    const [r, g, b] = ctx.getImageData(5, 5, 1, 1).data;
    document.documentElement.style.setProperty('--portal-paper', `rgb(${r},${g},${b})`);
  }
  updateTimeline(video.currentTime);
}
function seek() {
  pendingFrame = 0;
  if (!ready || video.seeking) return;
  const next = clamp(targetTime, 0.001, duration - 1 / 60);
  if (Math.abs(video.currentTime - next) > 0.007) video.currentTime = next;
  else draw();
}
function scheduleSeek() { if (!pendingFrame) pendingFrame = requestAnimationFrame(seek); }
video.addEventListener('seeked', () => { if (ready) { draw(); scheduleSeek(); } });
function scrollFilm() {
  if (Math.abs(innerWidth - lastWidth) < 1) savedPortalProgress = clamp((scrollY - runwayStart() - distance) / previousPortalDistance);
  progress = scrollProgress(scrollY, runwayStart(), distance);
  targetTime = progress * duration;
  scheduleSeek();
}
function goTo(position) {
  progress = clamp(position);
  targetTime = progress * duration;
  window.scrollTo({ top: runwayStart() + progress * distance, behavior: 'instant' });
  scheduleSeek();
}
function showProgress(loaded, total, complete = false) {
  const info = downloadProgress(loaded, total, complete);
  $('percent').textContent = info.percent === null ? '—' : String(info.percent);
  $('bytes').textContent = info.label;
  $('download-fill').style.width = `${info.percent ?? 0}%`;
  if (info.percent === null) $('download').removeAttribute('aria-valuenow');
  else $('download').setAttribute('aria-valuenow', String(info.percent));
  $('download').setAttribute('aria-valuetext', LANG === 'ar' ? (info.percent === null ? `تم تحميل ${info.label}` : `تم تحميل ${info.percent}٪. ${info.label}`) : (info.percent === null ? `${info.label} downloaded` : `${info.percent}% downloaded. ${info.label}`));
}
function downloadFile(source, run) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    xhr = request;
    request.open('GET', source.scroll);
    request.responseType = 'blob';
    request.timeout = 120000;
    request.onprogress = event => {
      if (run !== generation) return;
      showProgress(event.loaded, event.lengthComputable ? event.total : source.bytes);
    };
    request.onload = () => {
      if (request.status < 200 || request.status >= 300 || !request.response?.size) {
        reject(new Error(LANG === 'ar' ? 'تعذّر تحميل الفيلم.' : 'The film could not be downloaded.')); return;
      }
      if (run === generation) showProgress(request.response.size, request.response.size, true);
      resolve(request.response);
    };
    request.onerror = () => reject(new Error(LANG === 'ar' ? 'انقطع الاتصال.' : 'Your connection was interrupted.'));
    request.ontimeout = () => reject(new Error(LANG === 'ar' ? 'استغرق التحميل وقتًا طويلًا.' : 'The download took too long.'));
    request.onabort = () => reject(new DOMException('Download replaced', 'AbortError'));
    request.send();
  });
}
function prepareVideo(url, run) {
  return new Promise((resolve, reject) => {
    const cleanup = () => { clearTimeout(timer); video.removeEventListener('loadeddata', loaded); video.removeEventListener('seeked', painted); video.removeEventListener('error', failed); };
    const painted = () => { cleanup(); if (run === generation) resolve(); else reject(new DOMException('Film replaced', 'AbortError')); };
    // Force a decoded first frame before uncovering the canvas. Some Chromium
    // builds announce loadeddata before drawImage can read the initial frame.
    const loaded = () => { video.addEventListener('seeked', painted, {once:true}); video.currentTime = clamp(targetTime, 0.001, video.duration - 1 / 60); };
    const failed = () => { cleanup(); reject(new Error(LANG === 'ar' ? 'تعذّر تجهيز الفيلم في هذا المتصفح.' : 'This browser could not prepare the film.')); };
    const timer = setTimeout(failed, 20000);
    video.addEventListener('loadeddata', loaded);
    video.addEventListener('error', failed);
    video.src = url;
    video.load();
  });
}
async function loadFilm(nextMode) {
  const run = ++generation;
  xhr?.abort();
  ready = false;
  mode = nextMode;
  const source = MEDIA[mode];
  setControls(false);
  document.body.classList.remove('ready');
  $('loader').hidden = false;
  $('cue').hidden = true;
  $('recovery').hidden = true;
  $('fallback').href = source.watch;
  $('loading-label').textContent = copy(mode === 'portrait' ? 'loadingPhone' : 'loadingDesktop');
  $('loader-note').textContent = copy('note');
  showProgress(0, source.bytes);
  announce(copy(mode === 'portrait' ? 'loadingPhone' : 'loadingDesktop'));
  try {
    const blob = await downloadFile(source, run);
    if (run !== generation) return;
    const previousURL = blobURL;
    blobURL = URL.createObjectURL(blob);
    $('loading-label').textContent = copy('preparing');
    await prepareVideo(blobURL, run);
    if (previousURL) URL.revokeObjectURL(previousURL);
    if (run !== generation) return;
    duration = video.duration;
    video.pause();
    ready = true;
    document.body.classList.add('ready');
    $('loader').hidden = true;
    setControls(true);
    draw();
    scrollFilm();
    announce(copy('ready'));
  } catch (error) {
    if (run !== generation || error.name === 'AbortError') return;
    $('loading-label').textContent = copy('retry');
    $('loader-note').textContent = `${error.message} ${LANG === 'ar' ? 'حاول مجددًا أو افتح الفيلم مباشرة.' : 'Retry or open the film directly.'}`;
    $('recovery').hidden = false;
    announce($('loader-note').textContent);
  }
}

function layout() {
  if (CALM || document.body.classList.contains('native-view')) { mode = mediaMode(innerWidth, innerHeight); $('watch').disabled = false; return; }
  const savedProgress = progress;
  const portalOffset = Math.max(0, scrollY - runwayStart() - distance);
  const currentPortalDistance = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--portal-distance')) || 1600;
  distance = innerWidth < 700 ? 4400 : 5600;
  document.documentElement.style.setProperty('--distance', `${distance}px`);
  const nextMode = mediaMode(innerWidth, innerHeight);
  // A rotation can change the runway length; keep the same point in the story.
  if (Math.abs(innerWidth - lastWidth) > 30) {
    if (portalOffset > 0 || savedPortalProgress > 0) window.scrollTo({ top:runwayStart() + distance + savedPortalProgress * currentPortalDistance, behavior:'instant' });
    else goTo(savedProgress);
  }
  lastWidth = innerWidth;
  previousPortalDistance = currentPortalDistance;
  if (mode !== nextMode) loadFilm(nextMode);
  else scheduleSeek();
}
window.addEventListener('scroll', scrollFilm, { passive: true });
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(layout);
}, { passive: true });
scrubber.addEventListener('input', () => goTo(Number(scrubber.value) / 1000));
chapterButtons.forEach((button, index) => button.addEventListener('click', () => { goTo(Number(button.dataset.time) / duration); history.replaceState(null, '', `${location.pathname}${location.search}#chapter-${index + 1}`); }));
window.addEventListener('cake:seek', event => goTo(event.detail));
$('restart').addEventListener('click', event => { event.preventDefault(); goTo(0); });
$('retry').addEventListener('click', () => loadFilm(mediaMode(innerWidth, innerHeight)));
$('watch').addEventListener('click', () => {
  dialogProgress = progress;
  watchVideo.src = MEDIA[mode].watch;
  watchVideo.currentTime = 0;
  $('watch-status').textContent = copy('originalSound');
  dialog.showModal();
  document.documentElement.style.overflow = 'hidden';
  watchVideo.play().catch(() => { $('watch-status').textContent = copy('pressPlay'); });
});
watchVideo.addEventListener('error', () => { $('watch-status').textContent = LANG === 'ar' ? 'تعذّر تحميل الفيلم. أغلق المشغّل وحاول مجددًا.' : 'The film could not load. Close this player and try again.'; });
dialog.addEventListener('close', () => {
  watchVideo.pause();
  watchVideo.removeAttribute('src');
  watchVideo.load();
  document.documentElement.style.overflow = '';
  if (!CALM && !document.body.classList.contains('native-view')) requestAnimationFrame(() => goTo(dialogProgress));
  (CALM || document.body.classList.contains('native-view') ? $('calm-watch') : $('watch')).focus({ preventScroll: true });
});
$('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
window.addEventListener('pagehide', event => { if (!event.persisted) { xhr?.abort(); if (blobURL) URL.revokeObjectURL(blobURL); } });
if (!CALM) scrollFilm();
layout();
