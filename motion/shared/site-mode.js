/* Site mode, applied before first paint on every page (tiny, synchronous).
   html[data-site-mode] = crow (dark, default) | white;  html[data-companion] = opus | crow | off;
   html[data-edition] = halloween | heaven | rgb | tactical | comic | clay (optional special edition).
   companion.js owns the toggle and the companion; this only restores the saved choice early. */
(() => {
  const r = document.documentElement;
  let mode = 'crow', pal = 'opus';
  try {mode = localStorage.getItem('mk-mode') === 'white' ? 'white' : 'crow'; pal = localStorage.getItem('mk-companion') || 'opus';} catch {}
  r.dataset.siteMode = mode;
  r.dataset.companion = ['opus', 'crow', 'off'].includes(pal) ? pal : 'opus';
  // special editions (?edition=halloween|heaven|…): kept for the visit, or saved by the edition picker
  let ed = '';
  try {const q = new URLSearchParams(location.search).get('edition'); if (q !== null) {ed = q; sessionStorage.setItem('mk-edition', q);} else ed = sessionStorage.getItem('mk-edition') || localStorage.getItem('mk-edition') || '';} catch {}
  if (['halloween', 'heaven', 'rgb', 'tactical', 'comic', 'clay'].includes(ed)) r.dataset.edition = ed; else delete r.dataset.edition;
})();
