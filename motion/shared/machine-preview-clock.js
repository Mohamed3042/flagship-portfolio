/*! © 2026 Mohamed Mahmoud. All rights reserved. */



(() => {
  if (!document.documentElement.hasAttribute('data-world-preview')) return;
  const host = window.frameElement;
  if (!host || parent === window) return;

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
