/**
 * Cursor glow (Alche's flat pages): moving the mouse leaves a soft wake of light behind the content,
 * a smear that stretches along the stroke, drifts on a little and fades. One fixed canvas under the
 * page, screen-blended so it only adds light (pointer-events: none), drawn only while something glows. Fine pointers only;
 * off for reduced motion. Colour: html[data-glow] or the default teal-blue.
 */
(() => {
  if (window.top !== window || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:2147480000;pointer-events:none;mix-blend-mode:screen;filter:blur(14px)';
  const g = cv.getContext('2d');
  const mount = () => document.body ? document.body.prepend(cv) : requestAnimationFrame(mount);
  mount();
  let w = 0, h = 0;
  const S = .5;   // drawn at half resolution: it is all blur anyway
  const fit = () => {w = cv.width = Math.round(innerWidth * S); h = cv.height = Math.round(innerHeight * S);};
  fit(); addEventListener('resize', fit, {passive: true});

  const blobs = [];   // {x, y, vx, vy, r, life}
  let last = null, raf = 0;
  addEventListener('pointermove', e => {
    const x = e.clientX * S, y = e.clientY * S;
    if (last) {
      const dx = x - last.x, dy = y - last.y, d = Math.hypot(dx, dy);
      if (d > 120) {last = {x, y}; return;}   // a jump, not a stroke
      const steps = Math.min(8, Math.ceil(d / 6));
      for (let i = 1; i <= steps; i++) blobs.push({x: last.x + dx * i / steps, y: last.y + dy * i / steps, vx: dx * .08, vy: dy * .08, r: 10 + Math.min(40, d * .9), life: 1});
      if (blobs.length > 260) blobs.splice(0, blobs.length - 260);
    }
    last = {x, y};
    if (!raf) raf = requestAnimationFrame(draw);
  }, {passive: true});
  addEventListener('pointerleave', () => {last = null;}, {passive: true});

  const colour = () => (root.dataset.glow || '72,170,255').split(',').map(Number);
  function draw() {
    raf = 0;
    g.clearRect(0, 0, w, h);
    g.globalCompositeOperation = 'lighter';
    const [r0, g0, b0] = colour();
    for (let i = blobs.length - 1; i >= 0; i--) {
      const b = blobs[i];
      b.x += b.vx; b.y += b.vy; b.vx *= .94; b.vy *= .94; b.r *= 1.012; b.life *= .955;
      if (b.life < .03) {blobs.splice(i, 1); continue;}
      const grad = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `rgba(${r0},${g0},${b0},${.24 * b.life})`);
      grad.addColorStop(1, `rgba(${r0},${g0},${b0},0)`);
      g.fillStyle = grad;
      g.beginPath(); g.ellipse(b.x, b.y, b.r * 1.6, b.r * .7, Math.atan2(b.vy, b.vx), 0, Math.PI * 2); g.fill();   // stretched along the stroke
    }
    if (blobs.length) raf = requestAnimationFrame(draw);
  }
})();
