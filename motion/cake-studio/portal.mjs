import { clamp, mediaMode } from './core.mjs';

const query = new URLSearchParams(location.search);
export const LANG = query.get('lang') === 'ar' ? 'ar' : 'en';
export const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches || query.get('view') === 'calm';
export const AR_CHAPTERS = ['كل فرحة تبدأ بفكرة', 'امنح فكرتك شكلًا', 'اجعلها على ذوقك', 'قلها بشكل جميل', 'صمّم. اعتمد. أنتج.', 'استوديو الكعك المتكامل', 'من الفكرة إلى الاحتفال'];
const words = {
  en: {skip:'Skip to the film and world links', motion:'← Motion', calmView:'Calm view', scrollView:'Scroll view', portalEyebrow:'THE LAST FRAME IS A DOOR', portalTitle:'Your idea has<br>another world.', portalHint:'Keep scrolling to step inside. Scroll back to return.', enter:'Enter Cake World ↓', invitation:'There is more beyond the frame ↓', calmEyebrow:'CAKE STUDIO · 28 SECONDS', calmTitle:'A little idea.<br>A big celebration.', calmDescription:'Shape a cake, make it yours, and carry the design into production. Play a short glimpse, watch the full film, or explore the world at your own pace.', fullFilm:'Watch the full film', worldLink:'Explore Cake World →', calmNote:'A quiet version of the experience. Motion begins only when you press play.', back:'↑ Back through the frame', standalone:'Open world on its own ↗', loadingDesktop:'Loading desktop film', loadingPhone:'Loading phone film', ready:'Film ready. Scroll, choose a chapter, or use the timeline.', note:'Then scroll to bring it to life.', preparing:'Downloaded · preparing frames', retry:'Let’s try that again', originalSound:'MK Cake · 28 seconds · Original soundtrack', pressPlay:'Press play to watch with the original soundtrack.', worldLoading:'Opening Cake World. The return control is always available.', worldReady:'Cake World is ready. Scroll upward from its beginning to return to the film.', worldSlow:'Cake World is taking a moment. You can open it on its own or return to the film.'},
  ar: {skip:'انتقل إلى روابط الفيلم والعالم', motion:'الحركة →', calmView:'عرض هادئ', scrollView:'عرض بالتمرير', portalEyebrow:'الإطار الأخير هو باب', portalTitle:'لفكرتك<br>عالم آخر.', portalHint:'تابع التمرير لتدخل. مرّر للخلف لتعود.', enter:'ادخل عالم الكعك ↓', invitation:'هناك المزيد خلف الإطار ↓', calmEyebrow:'استوديو الكعك · ٢٨ ثانية', calmTitle:'فكرة صغيرة.<br>احتفال كبير.', calmDescription:'شكّل كعكتك، وضع لمستك، وانقل التصميم إلى الإنتاج. شاهد لمحة قصيرة أو الفيلم كاملًا، أو استكشف العالم على راحتك.', fullFilm:'شاهد الفيلم كاملًا', worldLink:'استكشف عالم الكعك ←', calmNote:'نسخة هادئة من التجربة. تبدأ الحركة فقط عند الضغط على التشغيل.', back:'↑ عُد عبر الإطار', standalone:'افتح العالم في صفحة مستقلة ↗', loadingDesktop:'جارٍ تحميل فيلم الحاسوب', loadingPhone:'جارٍ تحميل فيلم الهاتف', ready:'الفيلم جاهز. مرّر أو اختر فصلًا أو استخدم الشريط الزمني.', note:'ثم مرّر لتحرّك الفكرة.', preparing:'تم التحميل · جارٍ تجهيز الإطارات', retry:'لنحاول مرة أخرى', originalSound:'استوديو الكعك · ٢٨ ثانية · الموسيقى الأصلية', pressPlay:'اضغط التشغيل للمشاهدة مع الموسيقى الأصلية.', worldLoading:'جارٍ فتح عالم الكعك. زر العودة متاح دائمًا.', worldReady:'عالم الكعك جاهز. مرّر للأعلى من بدايته لتعود إلى الفيلم.', worldSlow:'يستغرق فتح العالم بعض الوقت. يمكنك فتحه مستقلًا أو العودة للفيلم.'}
};
export const copy = key => words[LANG][key] || words.en[key] || key;
words.en.preview = '▶ Play a 4-second glimpse';
words.ar.preview = '▶ شاهد لمحة من ٤ ثوانٍ';

const $ = id => document.getElementById(id), root = document.documentElement;
root.lang = LANG;
root.dir = LANG === 'ar' ? 'rtl' : 'ltr';
document.body.classList.toggle('calm-mode', CALM);
document.querySelectorAll('[data-copy]').forEach(el => { el.innerHTML = copy(el.dataset.copy); });
$('motion-home').href = `../../${LANG}/motion/`;
const languageURL = new URL(location.href);
languageURL.searchParams.set('lang', LANG === 'ar' ? 'en' : 'ar');
$('language').href = languageURL.href;
$('language').textContent = LANG === 'ar' ? 'English' : 'العربية';
$('language').lang = LANG === 'ar' ? 'en' : 'ar';
const viewURL = new URL(location.href);
if (CALM) viewURL.searchParams.delete('view'); else viewURL.searchParams.set('view', 'calm');
$('view-toggle').href = viewURL.href;
$('view-toggle').textContent = copy(CALM ? 'scrollView' : 'calmView');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) $('view-toggle').hidden = true;
const worldURL = new URL('../../worlds/cake-studio.html', location.href);
worldURL.searchParams.set('lang', LANG);
for (const id of ['standalone-world', 'calm-world']) $(id).href = worldURL.href;
if (LANG === 'ar') {
  document.title = 'استوديو الكعك — من الفكرة إلى عالم آخر';
  document.querySelector('.edition').textContent = 'من الفكرة إلى الاحتفال';
  $('watch').innerHTML = '<span aria-hidden="true">▶</span> شاهد مع الصوت';
  $('restart').setAttribute('aria-label', 'استوديو الكعك — عُد إلى البداية');
  document.querySelector('h1').textContent = 'استوديو الكعك. من الفكرة إلى الاحتفال — فيلم يتحرك بالتمرير.';
  document.querySelector('.loader .eyebrow').textContent = 'فكرة صغيرة. يوم كبير.';
  document.querySelector('.loader h2').innerHTML = 'قليل من الصبر.<br><em>قليل من السحر.</em>';
  $('loader-note').textContent = copy('note');
  $('loading-label').textContent = 'جارٍ تحميل الفيلم';
  $('retry').textContent = 'حاول مجددًا';
  $('fallback').textContent = 'افتح الفيلم';
  $('cue').innerHTML = 'مرّر لتحرّك الفكرة <span aria-hidden="true">↓</span>';
  $('watch-title').textContent = 'من الفكرة إلى الاحتفال';
  $('close-dialog').innerHTML = 'إغلاق <span aria-hidden="true">×</span>';
  $('close-dialog').setAttribute('aria-label', 'إغلاق الفيلم');
  $('scrubber').previousElementSibling.textContent = 'موضع الفيلم. استخدم مفاتيح الأسهم أو اسحب للاستكشاف.';
  const short = ['الفكرة', 'الشكل', 'اللون', 'الكلمات', 'الخطوات', 'الاستوديو', 'الاحتفال'];
  $('chapters').querySelectorAll('button').forEach((button, index) => { button.innerHTML = `${String(index + 1).padStart(2, '0')} <span>${short[index]}</span>`; button.setAttribute('aria-label', AR_CHAPTERS[index]); });
  $('runway').setAttribute('aria-label', 'مرّر لاستكشاف فيلم استوديو الكعك');
  $('download').setAttribute('aria-label', 'نسبة تحميل الفيلم');
  $('chapters').setAttribute('aria-label', 'فصول الفيلم');
  document.querySelector('.transport').setAttribute('aria-label', 'التحكم في الفيلم');
  document.querySelector('.portfolio-nav').setAttribute('aria-label', 'التنقل في الموقع');
  $('calm-video').setAttribute('aria-label', 'لمحة من فيلم استوديو الكعك مدتها أربع ثوانٍ');
  $('cake-world').title = 'عالم الكعك — تُصنع الكعكة مرتين';
}

function calmMedia() {
  const mode = mediaMode(innerWidth, innerHeight);
  const preview = $('calm-video');
  if (preview.dataset.mode === mode) return;
  preview.dataset.mode = mode;
  preview.poster = `./media/poster-${mode}.jpg`;
  $('calm-poster').src = preview.poster;
  preview.dataset.src = `./media/preview-${mode}.mp4`;
  if (!preview.hidden) preview.src = preview.dataset.src;
}
if (CALM) calmMedia();
$('preview-button').addEventListener('click', () => {
  const preview = $('calm-video');
  $('calm-poster').hidden = true;
  $('preview-button').hidden = true;
  preview.hidden = false;
  preview.src = preview.dataset.src;
  preview.play().catch(() => { preview.focus(); });
});
$('calm-watch').addEventListener('click', () => $('watch').click());
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  document.body.classList.add('native-view');
  $('watch').disabled = false;
  $('world-controls').hidden = true;
  calmMedia();
  $('calm').focus();
  $('calm').scrollIntoView();
});

const frame = $('cake-world');
let pending = 0, loaded = false, started = false, entered = false, lastPortal = -1;
let loadingTimer, touchStart = 0;
const filmDistance = () => parseFloat(root.style.getPropertyValue('--distance')) || (innerWidth < 700 ? 4400 : 5600);
const portalDistance = () => parseFloat(getComputedStyle(root).getPropertyValue('--portal-distance')) || 1600;
const start = () => $('runway').getBoundingClientRect().top + scrollY;
const announce = text => { $('status').textContent = text; };
const move = (top) => window.scrollTo({ top, behavior:'instant' });
function returnToFilm() {
  frame.contentWindow?.scrollTo({ top:0, behavior:'instant' });
  move(start() + filmDistance() + portalDistance() * .28);
  $('enter-world').focus({ preventScroll:true });
  history.replaceState(null, '', `${location.pathname}${location.search}#portal`);
  requestPaint();
}

function bridgeWorld() {
  // Both pages are part of this static site. Existing standalone world code stays intact.
  const win = frame.contentWindow, doc = frame.contentDocument;
  if (!doc?.body) return;
  doc.documentElement.lang = LANG;
  doc.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';
  doc.documentElement.classList.toggle('lang-ar', LANG === 'ar');
  doc.documentElement.classList.toggle('cake-portal-preview', !entered);
  const previewStyle = doc.createElement('style');
  previewStyle.textContent = '.cake-portal-preview .chrome,.cake-portal-preview .bookend-copy,.cake-portal-preview .bookend-meter,.cake-portal-preview .cake-film-token{visibility:hidden!important}';
  doc.head.append(previewStyle);
  doc.querySelectorAll('a[href]').forEach(link => {
    if (!link.getAttribute('href').startsWith('#')) link.target = '_top';
  });
  doc.querySelector('[data-cake-film-token]')?.addEventListener('click', event => { event.preventDefault(); returnToFilm(); });
  const toParent = delta => {
    if (!entered || delta >= 0 || win.scrollY > 1) return false;
    move(Math.max(start() + filmDistance(), scrollY + delta));
    requestPaint();
    return true;
  };
  doc.addEventListener('wheel', event => {
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (toParent(delta)) event.preventDefault();
  }, {passive:false});
  doc.addEventListener('touchstart', event => { touchStart = event.touches[0]?.clientY || 0; }, {passive:true});
  doc.addEventListener('touchmove', event => {
    const y = event.touches[0]?.clientY || touchStart;
    if (toParent(touchStart - y)) event.preventDefault();
    touchStart = y;
  }, {passive:false});
  doc.addEventListener('keydown', event => {
    if (event.target.closest('input,textarea,select,[contenteditable=true]') || doc.querySelector('dialog[open]')) return;
    if (event.key === 'Escape') { event.preventDefault(); returnToFilm(); }
    else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      if (toParent(event.key === 'ArrowUp' ? -100 : -innerHeight * .7)) event.preventDefault();
    }
  });
}
function loadWorld() {
  if (started || CALM) return;
  started = true;
  frame.src = worldURL.href;
  announce(copy('worldLoading'));
  loadingTimer = setTimeout(() => { if (!loaded) announce(copy('worldSlow')); }, 12000);
}
frame.addEventListener('load', () => {
  if (!started) return;
  try { bridgeWorld(); loaded = true; }
  catch { announce(copy('worldSlow')); return; }
  clearTimeout(loadingTimer);
  frame.tabIndex = entered ? 0 : -1;
  document.body.classList.add('world-loaded');
  announce(copy('worldReady'));
  requestPaint();
});

function paintPortal() {
  pending = 0;
  if (CALM || document.body.classList.contains('native-view')) return;
  const delta = scrollY - start() - filmDistance();
  const p = clamp(delta / portalDistance());
  if (p > .015) loadWorld();
  $('portal-invitation').hidden = delta < -250 || p > .025;
  if (p === lastPortal) return;
  lastPortal = p;
  const aperture = clamp((p - .06) / .92);
  const eased = aperture * aperture * (3 - 2 * aperture);
  root.style.setProperty('--portal', p.toFixed(4));
  root.style.setProperty('--portal-door', String(clamp(p * 10)));
  root.style.setProperty('--portal-nav', String(1 - clamp(p * 7)));
  root.style.setProperty('--portal-copy', String(clamp(p / .15) * (1 - clamp((p - .28) / .12))));
  root.style.setProperty('--portal-inset-x', `${(1 - eased) * 39}%`);
  root.style.setProperty('--portal-inset-y', `${(1 - eased) * 20}%`);
  root.style.setProperty('--portal-radius', `${(1 - eased) * 28}vw`);
  const nextEntered = p >= .995;
  if (nextEntered !== entered) {
    entered = nextEntered;
    document.body.classList.toggle('world-entered', entered);
    frame.tabIndex = entered && loaded ? 0 : -1;
    if (loaded) frame.contentDocument.documentElement.classList.toggle('cake-portal-preview', !entered);
  }
  $('portal-layer').setAttribute('aria-hidden', String(p < .05));
  $('world-controls').hidden = p < .75;
  // Disable the masked frame for keyboard focus until the doorway fills the screen.
  frame.inert = !entered;
  document.querySelector('.header').inert = p > .08;
  document.querySelector('.transport').inert = p > .08;
  document.querySelector('.portfolio-nav').inert = p > .08;
  $('portal-copy').inert = p < .05 || p >= .4;
  $('enter-world').tabIndex = p > .05 && p < .4 ? 0 : -1;
}
function requestPaint() { if (!pending) pending = requestAnimationFrame(paintPortal); }
function goWorld(event) {
  event?.preventDefault();
  loadWorld();
  move(start() + filmDistance() + portalDistance());
  history.replaceState(null, '', `${location.pathname}${location.search}#world`);
  requestPaint();
}
$('enter-world').addEventListener('click', goWorld);
$('back-to-film').addEventListener('click', returnToFilm);
$('portal-invitation').addEventListener('click', event => {
  event.preventDefault();
  move(start() + filmDistance() + portalDistance() * .28);
  history.replaceState(null, '', `${location.pathname}${location.search}#portal`);
  requestPaint();
});
addEventListener('scroll', requestPaint, {passive:true});
addEventListener('resize', () => { if (CALM) calmMedia(); requestPaint(); }, {passive:true});
addEventListener('keydown', event => {
  if (event.key === 'Escape' && entered && !$('watch-dialog').open) returnToFilm();
});
function applyDeepLink() {
  if (CALM) return;
  const hash = location.hash.slice(1);
  if (hash === 'world') goWorld();
  else if (hash === 'portal') move(start() + filmDistance() + portalDistance() * .28);
  else if (/^chapter-[1-7]$/.test(hash)) window.dispatchEvent(new CustomEvent('cake:seek', {detail:(Number(hash.at(-1)) - 1) * 4 / 28}));
  else if (query.has('t')) window.dispatchEvent(new CustomEvent('cake:seek', {detail:clamp(Number(query.get('t')) / 28)}));
  requestPaint();
}
addEventListener('hashchange', applyDeepLink);
requestAnimationFrame(applyDeepLink);
$('language').addEventListener('click', () => {
  const url = new URL($('language').href);
  if (!CALM && !entered) url.searchParams.set('t', (clamp((scrollY - start()) / filmDistance()) * 28).toFixed(1));
  url.hash = entered ? 'world' : lastPortal > .01 ? 'portal' : '';
  $('language').href = url.href;
});
addEventListener('pagehide', () => clearTimeout(loadingTimer));
