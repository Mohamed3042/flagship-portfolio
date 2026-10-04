/**
 * Living text, 2026-10-04. Big titles anywhere on the site become a sticky, elastic material under
 * the pointer (or a finger): the letters burst into particles, scatter from the touch, get dragged
 * along with it like goo, and snap back into the word when you let go. The real text stays in the
 * DOM (selectable, read by screen readers); a canvas only exists while you play with it.
 *
 * Auto-attaches to h1, h2 and [data-living-text] whose text is at least 30px (data-living-text="off"
 * opts out). Rasterises each word where the browser laid it out (Range rects), in the element's own
 * font, colour or gradient. Reduced motion: nothing happens. No dependencies.
 */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || window.__livingText) return;
  window.__livingText = true;
  const MIN = 30, MAX_PARTICLES = 14000, SPREAD = 90;
  const live = new Map(); // element → state
  const dpr = () => Math.min(2, devicePixelRatio || 1);

  const candidate = el => {
    const h = el?.closest?.('[data-living-text],h1,h2');
    if (!h || h.dataset.livingText === 'off' || h.closest('[data-living-text="off"],dialog,button,a[href] h1,a[href] h2')) return null;
    if (h.closest('a[href],button') && !h.hasAttribute('data-living-text')) return null; // headings inside links stay links
    const size = parseFloat(getComputedStyle(h).fontSize);
    return size >= MIN && h.textContent.trim() ? h : null;
  };

  function gradientStops(el) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundImage;
      if (bg && bg.includes('gradient')) return bg.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}/gi) || null;
      if (getComputedStyle(n).webkitBackgroundClip !== 'text' && n !== el) break;
    }
    return null;
  }

  function rasterise(el, box) {
    const ratio = dpr(), w = Math.ceil(box.width + SPREAD * 2), h = Math.ceil(box.height + SPREAD * 2);
    const off = document.createElement('canvas');
    off.width = Math.ceil(w * ratio); off.height = Math.ceil(h * ratio);
    const g = off.getContext('2d', {willReadFrequently: true});
    g.scale(ratio, ratio);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let size = 0;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const host = node.parentElement, cs = getComputedStyle(host);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      size = Math.max(size, parseFloat(cs.fontSize));
      g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      try {g.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;} catch {}
      const rtl = cs.direction === 'rtl';
      g.direction = rtl ? 'rtl' : 'ltr'; g.textAlign = rtl ? 'right' : 'left'; g.textBaseline = 'alphabetic';
      const transparent = /rgba\(\d+, \d+, \d+, 0\)|transparent/.test(cs.webkitTextFillColor || '') || /rgba\(\d+, \d+, \d+, 0\)/.test(cs.color);
      const stops = transparent ? gradientStops(host) : null;
      const m = g.measureText('Hg'), asc = m.fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * .8, desc = m.fontBoundingBoxDescent ?? parseFloat(cs.fontSize) * .2;
      const text = node.data;
      for (const word of text.matchAll(/\S+/g)) {
        range.setStart(node, word.index); range.setEnd(node, word.index + word[0].length);
        for (const r of range.getClientRects()) {
          if (r.width < 1) continue;
          const x = (rtl ? r.right : r.left) - box.left + SPREAD, top = r.top - box.top + SPREAD;
          const y = top + (r.height - (asc + desc)) / 2 + asc;
          if (stops && stops.length) {
            const grad = g.createLinearGradient(0, top, 0, top + r.height);
            stops.forEach((c, i) => grad.addColorStop(stops.length === 1 ? 0 : i / (stops.length - 1), c));
            g.fillStyle = grad;
          } else g.fillStyle = transparent ? '#ffffff' : cs.color;
          g.fillText(word[0], x, y);
          break; // one rect per word is enough; wrapped words are rare in titles
        }
      }
    }
    // sample the drawn letters into particles
    const step = Math.max(2, Math.round(size / 26)) * ratio;
    const data = g.getImageData(0, 0, off.width, off.height).data;
    let s = step, parts = [];
    for (;;) {
      parts = [];
      for (let y = 0; y < off.height; y += s) for (let x = 0; x < off.width; x += s) {
        const i = (y * off.width + x) * 4;
        if (data[i + 3] > 110) parts.push(x / ratio, y / ratio, data[i], data[i + 1], data[i + 2]);
      }
      if (parts.length / 5 <= MAX_PARTICLES) break;
      s += ratio;
    }
    return {parts, cell: s / ratio, w, h};
  }

  function activate(el) {
    if (live.has(el)) {const st = live.get(el); st.releasing = false; return st;}
    const box = el.getBoundingClientRect();
    if (box.width < 4 || box.height < 4) return null;
    const {parts, cell, w, h} = rasterise(el, box);
    const n = parts.length / 5;
    if (!n) return null;
    const ratio = dpr();
    const canvas = document.createElement('canvas');
    canvas.className = 'living-text-canvas';
    canvas.width = Math.ceil(w * ratio); canvas.height = Math.ceil(h * ratio);
    Object.assign(canvas.style, {position: 'absolute', left: `${box.left + scrollX - SPREAD}px`, top: `${box.top + scrollY - SPREAD}px`, width: `${w}px`, height: `${h}px`, pointerEvents: 'none', zIndex: '2147482000'});
    document.body.append(canvas);
    const g = canvas.getContext('2d');
    g.scale(ratio, ratio);
    const hx = new Float32Array(n), hy = new Float32Array(n), px = new Float32Array(n), py = new Float32Array(n), vx = new Float32Array(n), vy = new Float32Array(n), col = new Array(n);
    const groups = new Map();
    for (let i = 0; i < n; i++) {
      hx[i] = px[i] = parts[i * 5]; hy[i] = py[i] = parts[i * 5 + 1];
      const a = Math.random() * Math.PI * 2, burst = 1.2 + Math.random() * 2.6;                    // the dissolve: a soft burst
      vx[i] = Math.cos(a) * burst; vy[i] = Math.sin(a) * burst;
      const key = `${parts[i * 5 + 2] >> 4},${parts[i * 5 + 3] >> 4},${parts[i * 5 + 4] >> 4}`;    // batch draws by colour
      if (!groups.has(key)) groups.set(key, {fill: `rgb(${parts[i * 5 + 2]},${parts[i * 5 + 3]},${parts[i * 5 + 4]})`, idx: []});
      groups.get(key).idx.push(i);
    }
    const prevOpacity = el.style.opacity;
    el.style.opacity = '0';
    const st = {el, canvas, g, n, hx, hy, px, py, vx, vy, groups: [...groups.values()], cell, size: parseFloat(getComputedStyle(el).fontSize), origin: {x: box.left - SPREAD, y: box.top - SPREAD}, releasing: false, prevOpacity, raf: 0, ptr: {x: -1e5, y: -1e5, vx: 0, vy: 0, t: 0}};
    live.set(el, st);
    st.raf = requestAnimationFrame(() => tick(st));
    return st;
  }

  function finish(st) {
    cancelAnimationFrame(st.raf);
    st.canvas.remove();
    st.el.style.opacity = st.prevOpacity;
    live.delete(st.el);
  }

  function tick(st) {
    const {n, hx, hy, px, py, vx, vy, g, ptr} = st;
    const R = Math.max(60, Math.min(170, st.size * 1.15)), R2 = R * R;
    const k = st.releasing ? .085 : .028, damp = st.releasing ? .8 : .88;
    let energy = 0;
    for (let i = 0; i < n; i++) {
      let ax = (hx[i] - px[i]) * k, ay = (hy[i] - py[i]) * k;
      if (!st.releasing) {
        const dx = px[i] - ptr.x, dy = py[i] - ptr.y, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) + .001, f = 1 - d / R;
          ax += (dx / d) * f * f * 6.5;                       // pushed away from the touch…
          ay += (dy / d) * f * f * 6.5;
          ax += ptr.vx * f * .32; ay += ptr.vy * f * .32;     // …and dragged along with it, like goo
        }
      }
      vx[i] = (vx[i] + ax) * damp; vy[i] = (vy[i] + ay) * damp;
      px[i] += vx[i]; py[i] += vy[i];
      energy += Math.abs(hx[i] - px[i]) + Math.abs(hy[i] - py[i]) + Math.abs(vx[i]) + Math.abs(vy[i]);
    }
    ptr.vx *= .7; ptr.vy *= .7;
    g.clearRect(0, 0, st.canvas.width, st.canvas.height);
    const s = st.cell * .92;
    for (const grp of st.groups) {
      g.fillStyle = grp.fill;
      g.beginPath();
      for (const i of grp.idx) g.rect(px[i] - s / 2, py[i] - s / 2, s, s);
      g.fill();
    }
    if (st.releasing && energy / n < .06) return finish(st);
    st.raf = requestAnimationFrame(() => tick(st));
  }

  // pointer: hover (mouse) or press-and-drag (touch, pen)
  let current = null;
  const move = e => {
    if (!current) return;
    const st = live.get(current); if (!st) return;
    const x = e.clientX - st.origin.x, y = e.clientY - st.origin.y;
    if (st.ptr.x > -1e4) {st.ptr.vx = x - st.ptr.x; st.ptr.vy = y - st.ptr.y;}
    st.ptr.x = x; st.ptr.y = y;
    // left the play area (the title plus some margin): let it reassemble
    const b = current.getBoundingClientRect(), m = 40;
    if (e.pointerType === 'mouse' && (e.clientX < b.left - m || e.clientX > b.right + m || e.clientY < b.top - m || e.clientY > b.bottom + m)) release();
  };
  const release = () => {if (current && live.get(current)) live.get(current).releasing = true; current = null;};
  addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const el = candidate(e.target);
    if (!el || el === current) return;
    release();
    if (activate(el)) {current = el; move(e);}
  }, {passive: true});
  addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    const el = candidate(e.target);
    if (!el) return;
    release();
    if (activate(el)) {current = el; move(e);}
  }, {passive: true});
  addEventListener('pointermove', move, {passive: true});
  addEventListener('pointerup', e => {if (e.pointerType !== 'mouse') release();}, {passive: true});
  addEventListener('pointercancel', release, {passive: true});
  addEventListener('scroll', () => {for (const st of live.values()) if (!st.releasing && st.el !== current) st.releasing = true;}, {passive: true});
  // a title whose text changes (e.g. the gallery billboard) is rebuilt the next time it is touched
  addEventListener('living:refresh', e => {const st = live.get(e.target); if (st) finish(st);});
})();
