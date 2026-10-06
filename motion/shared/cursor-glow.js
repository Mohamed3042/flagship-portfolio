/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/**
 * Cursor light on the flat pages, the World's way (engine.ts wake; recipe 8): one faint light that follows the pointer
 * like a liquid drop, a little behind (lag 1 - exp(-dt·14)), stretched along the stroke while it moves. Its size is the
 * World's glow, about a fiftieth of the view's height, so it never grows on a big screen. The owner, 2026-10-06, on the
 * iMac: the old trail of light blobs was "huge … not like the World's way … not that thing". There is no picture to bend
 * on a flat page; Home's room bends its own (cinema-room.js sets data-glow=off). Fine pointers only, off for reduced
 * motion. Colour: html[data-glow] (r,g,b) or a warm white; data-glow=off: none.
 */
(() => {
  if (window.top !== window || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  const dot = document.createElement('div');
  dot.setAttribute('aria-hidden', 'true');
  dot.style.cssText = 'position:fixed;left:0;top:0;border-radius:50%;z-index:2147480000;pointer-events:none;mix-blend-mode:screen;opacity:0;transition:opacity .4s;will-change:transform';
  const mount = () => document.body ? document.body.append(dot) : requestAnimationFrame(mount);
  mount();

  let size = 0, tint = '';
  const fit = () => {size = Math.round(Math.min(innerHeight, 1600) * .1); dot.style.width = dot.style.height = size + 'px';};
  const paint = () => {
    const c = root.dataset.glow && root.dataset.glow !== 'off' ? root.dataset.glow : '232,230,226';
    if (c === tint) return; tint = c;
    dot.style.background = `radial-gradient(closest-side, rgba(${c},.2), rgba(${c},.11) 30%, rgba(${c},.03) 60%, rgba(${c},0))`;
  };
  fit(); paint(); addEventListener('resize', fit, {passive: true});

  const p = {x: 0, y: 0}, d = {x: 0, y: 0};
  let raf = 0, t0 = 0, inside = false;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    if (!inside) {d.x = e.clientX; d.y = e.clientY;}   // entering the window is not a stroke
    p.x = e.clientX; p.y = e.clientY; inside = true;
    if (!raf) {t0 = performance.now(); raf = requestAnimationFrame(step);}
  }, {passive: true});
  addEventListener('mouseout', e => {if (!e.relatedTarget) {inside = false; dot.style.opacity = '0';}}, {passive: true});   // left the window

  function step(now) {
    raf = 0;
    const dt = Math.min(.05, (now - t0) / 1000); t0 = now;
    if (root.dataset.glow === 'off' || !inside) {dot.style.opacity = '0'; return;}
    paint();
    const k = 1 - Math.exp(-dt * 14);
    d.x += (p.x - d.x) * k; d.y += (p.y - d.y) * k;
    const lx = p.x - d.x, ly = p.y - d.y, lag = Math.hypot(lx, ly);
    const s = 1 + Math.min(.6, lag / (size * .6));   // the drag: longer along the stroke, a little thinner across
    dot.style.transform = `translate(${d.x - size / 2}px,${d.y - size / 2}px) rotate(${Math.atan2(ly, lx)}rad) scale(${s},${1 / Math.sqrt(s)})`;
    dot.style.opacity = '1';
    if (lag > .3) raf = requestAnimationFrame(step);   // at rest it stays put and draws nothing
  }
})();
