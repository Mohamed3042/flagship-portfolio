/*! © 2026 Mohamed Mahmoud. All rights reserved. */


(() => {
  const r = document.documentElement;
  let mode = 'crow', pal = 'opus';
  try {mode = localStorage.getItem('mk-mode') === 'white' ? 'white' : 'crow'; pal = localStorage.getItem('mk-companion') || 'opus';} catch {}
  r.dataset.siteMode = mode;
  r.dataset.companion = ['opus', 'crow', 'off'].includes(pal) ? pal : 'opus';

  let ed = '';
  try {const q = new URLSearchParams(location.search).get('edition'); if (q !== null) {ed = q; sessionStorage.setItem('mk-edition', q);} else ed = sessionStorage.getItem('mk-edition') || localStorage.getItem('mk-edition') || '';} catch {}
  if (['halloween', 'heaven', 'rgb', 'tactical', 'comic', 'clay', 'keynote'].includes(ed)) r.dataset.edition = ed; else delete r.dataset.edition;



  if (r.dataset.motionPreference === 'native') return;
  try {
    if (!window.__mmNativeMedia) {
      const mm = window.__mmNativeMedia = window.matchMedia.bind(window);
      window.matchMedia = window.__mmForcedMedia = q => (typeof q === 'string' && q.includes('prefers-reduced-motion')
        ? {matches: q.includes('no-preference'), media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false}
        : mm(q));
    }
  } catch {}
})();
