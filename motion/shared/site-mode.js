/* Site mode, applied before first paint on every page (tiny, synchronous).
   html[data-site-mode] = crow (dark, default) | white;  html[data-companion] = opus | crow | off.
   companion.js owns the toggle and the companion; this only restores the saved choice early. */
(() => {
  const r = document.documentElement;
  let mode = 'crow', pal = 'opus';
  try {mode = localStorage.getItem('mk-mode') === 'white' ? 'white' : 'crow'; pal = localStorage.getItem('mk-companion') || 'opus';} catch {}
  r.dataset.siteMode = mode;
  r.dataset.companion = ['opus', 'crow', 'off'].includes(pal) ? pal : 'opus';
})();
