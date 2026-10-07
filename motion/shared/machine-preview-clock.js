/*! © 2026 Mohamed Mahmoud. All rights reserved. */
// The preview also feeds the full-page LED wall. Browsers can suspend an
// iframe's animation callbacks when its hero scrolls out of view, so the
// visible home page owns this embedded preview's clock.
(() => {
  if (!document.documentElement.hasAttribute('data-world-preview')) return;
  const host = window.frameElement;
  if (!host || parent === window) return;
  // Only the same-origin home page may supply the animation clock.
  try { if (parent.location.origin !== location.origin) return; } catch { return; }

  const request = parent.requestAnimationFrame.bind(parent);
  const cancel = parent.cancelAnimationFrame.bind(parent);
  const pending = new Set();
  window.requestAnimationFrame = callback => {
    if (!host.isConnected) return 0;
    const id = request(() => {
      pending.delete(id);
      if (host.isConnected) callback(performance.now());
    });
    pending.add(id);
    return id;
  };
  window.cancelAnimationFrame = id => { pending.delete(id); cancel(id); };
  addEventListener('pagehide', event => {
    if (event.persisted) return;
    for (const id of pending) cancel(id);
    pending.clear();
  });
  document.documentElement.dataset.previewClock = 'parent';
})();
