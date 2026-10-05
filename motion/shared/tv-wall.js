/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/* TV wall: a playable carousel of TVs for the endings of the pages (the films home, Space).
   Any [data-tv-wall] element whose children are links becomes a CSS-3D ring of TVs, one per link;
   each TV is the link itself (keyboard and screen readers get real links) and loops its own motion
   graphics in a canvas: mail, chat, profile, the World, Space, the films. Drag to spin it (it coasts,
   then settles on a TV), hover to bring a TV forward, click to go; left alone it steps to the next
   TV every few seconds. Without JS the links stay a simple row. The World's ending does the same in
   WebGL (src/scripts/world/scenes/finale.ts) and shares this look (src/scripts/world/tv.ts). */
(() => {
  const walls = document.querySelectorAll('[data-tv-wall]');
  if (!walls.length) return;
  const root = document.documentElement, ar = root.lang === 'ar', still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = document.createElement('style');
  css.textContent = `
  .has-tv-wall{display:block!important}
  .tvw{position:relative;width:100%;height:var(--tvh);margin:18px auto 0;perspective:1500px;touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;--tvh:clamp(300px,40vw,520px)}
  .tvw.is-drag{cursor:grabbing}
  .tvw-ring{position:absolute;left:50%;top:46%;transform-style:preserve-3d}
  .tvw-tv{position:absolute;left:calc(var(--w) / -2);top:calc(var(--h) / -2);width:var(--w);height:var(--h);padding:11px;border-radius:24px;box-sizing:border-box;display:block;background:linear-gradient(160deg,#2a2d31,#0b0d0f 70%);box-shadow:0 34px 70px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.14),inset 0 0 0 1px rgba(255,255,255,.05);transform:rotateY(var(--a)) translateZ(calc(var(--r) + var(--pop,0px))) scale(var(--s,1));backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:transform .45s cubic-bezier(.2,.8,.2,1);outline:none;-webkit-tap-highlight-color:transparent}
  .tvw-tv canvas{display:block;width:100%;height:100%;border-radius:15px;pointer-events:none}
  .tvw-tv::after{content:'';position:absolute;left:50%;bottom:4px;width:7px;height:3px;margin-left:-3px;border-radius:2px;background:var(--led,#7cff9a);box-shadow:0 0 8px var(--led,#7cff9a)}
  .tvw-tv:hover,.tvw-tv:focus-visible{--pop:46px;--s:1.04}
  .tvw-tv:focus-visible{box-shadow:0 0 0 3px var(--led,#7cff9a),0 34px 70px rgba(0,0,0,.5)}
  .tvw-hint{position:absolute;left:50%;bottom:0;translate:-50% 0;margin:0;font:500 13px/1.4 'Inter Variable',Inter,system-ui,sans-serif;color:rgba(255,255,255,.55);white-space:nowrap;pointer-events:none}
  [data-site-mode=white] .tvw-hint{color:rgba(0,0,0,.5)}
  @media (prefers-reduced-motion:reduce) and (prefers-reduced-motion:no-preference){.tvw-tv{transition:none}}`;
  document.head.append(css);

  // ── drawing (virtual 1600 × 900; the same studio look as the World's TVs) ──
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease3 = x => 1 - Math.pow(1 - clamp(x), 3);
  const rgba = (hex, a) => {const m = /#?([0-9a-f]{6})/i.exec(hex), n = m ? parseInt(m[1], 16) : 0xffffff; return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;};
  const DISPLAY = (w, s) => `${w} ${s}px "Space Grotesk Variable", "Inter Variable", sans-serif`;
  const TEXT = (w, s) => (ar ? `${Math.max(w, 500)} ${s}px "Cairo Variable", "Cairo", sans-serif` : `${w} ${s}px "Inter Variable", Inter, sans-serif`);
  const L = 120, R = 1480, SX = ar ? R : L;
  function backdrop(g, w, bg, a, b, t) {
    g.setTransform(w / 1600, 0, 0, w / 1600, 0, 0);
    g.globalAlpha = 1; g.textAlign = 'left'; g.direction = 'ltr';
    g.fillStyle = bg; g.fillRect(0, 0, 1600, 900);
    [[0, a], [1, b]].forEach(([j, c]) => {
      const x = (j ? 380 : 1180) + Math.sin(t * (.35 + j * .2) + j) * 170, y = (j ? 700 : 320) + Math.cos(t * (.3 + j * .15)) * 110;
      const rg = g.createRadialGradient(x, y, 0, x, y, j ? 620 : 820);
      rg.addColorStop(0, rgba(c, j ? .22 : .36)); rg.addColorStop(1, rgba(c, 0));
      g.fillStyle = rg; g.fillRect(0, 0, 1600, 900);
    });
    g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 1.5; g.beginPath();
    for (let x = 80; x < 1600; x += 80) {g.moveTo(x, 0); g.lineTo(x, 900);}
    for (let y = 60; y < 900; y += 80) {g.moveTo(0, y); g.lineTo(1600, y);}
    g.stroke();
    g.strokeStyle = rgba(a, .16); g.lineWidth = 2; g.beginPath();
    for (let j = 0; j < 5; j++) {const o = ((t * 70 + j * 420) % 2300) - 500; g.moveTo(o, 900); g.lineTo(o + 520, 0);}
    g.stroke();
  }
  const isRtl = s => [...s].some(c => c.charCodeAt(0) >= 0x590 && c.charCodeAt(0) <= 0x8ff);   // Hebrew/Arabic: letters join
  function kinetic(g, text, y, size, k, t, accent) {
    g.font = DISPLAY(700, size);
    while (g.measureText(text).width > 1360 && size > 60) {size -= 6; g.font = DISPLAY(700, size);}
    const lw = g.measureText(text).width, top = y + size * .8, sweep = ((t * .32) % 1.7) * 1900 - 150;
    const gr = g.createLinearGradient(sweep - 240, 0, sweep + 240, 0);
    gr.addColorStop(0, rgba(accent, 0)); gr.addColorStop(.5, 'rgba(255,255,255,.95)'); gr.addColorStop(1, rgba(accent, 0));
    if (isRtl(text)) {   // Arabic joins its letters: it rises as a whole word
      const p = ease3(k * 2.2), y2 = top + (1 - p) * 60;
      g.textAlign = ar ? 'right' : 'left'; g.direction = 'rtl';
      g.globalAlpha = p; g.fillStyle = '#fff'; g.fillText(text, ar ? R : L, y2);
      g.globalAlpha = p * .9; g.fillStyle = gr; g.fillText(text, ar ? R : L, y2);
      g.globalAlpha = 1; g.direction = 'ltr'; g.textAlign = 'left';
      return;
    }
    let x = ar ? R - lw : L, c = 0;
    g.textAlign = 'left'; g.direction = 'ltr';
    for (const ch of text) {
      const p = ease3(k * 2.4 - c++ * .045);
      if (p > 0) {g.globalAlpha = p; g.fillStyle = '#fff'; g.fillText(ch, x, top + (1 - p) * 70); g.globalAlpha = p * .9; g.fillStyle = gr; g.fillText(ch, x, top + (1 - p) * 70);}
      x += g.measureText(ch).width;
    }
    g.globalAlpha = 1;
  }
  function open(g, k, color) {
    g.globalAlpha = ease3(k * 1.5 - .5); g.font = TEXT(700, 34); g.fillStyle = color;
    g.textAlign = ar ? 'left' : 'right'; g.direction = ar ? 'rtl' : 'ltr';
    g.fillText(ar ? 'افتح ↗' : 'Open ↗', ar ? L : R, 838);
    g.textAlign = 'left'; g.direction = 'ltr'; g.globalAlpha = 1;
  }
  function bubble(g, text, mine, y, pop, color) {
    g.font = TEXT(500, 42);
    const w = Math.min(980, g.measureText(text).width + 64), right = mine !== ar, x = right ? R - w : L, s = .85 + .15 * ease3(pop);
    g.save(); g.globalAlpha = Math.min(1, pop * 1.4);
    g.translate(right ? x + w : x, y + 40); g.scale(s, s); g.translate(-(right ? x + w : x), -(y + 40));
    g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, 84, 30); else g.rect(x, y, w, 84);
    g.fillStyle = mine ? color : 'rgba(255,255,255,.12)'; g.fill();
    g.fillStyle = mine ? '#04130b' : '#fff'; g.textAlign = ar ? 'right' : 'left'; g.direction = ar ? 'rtl' : 'ltr';
    g.fillText(text, ar ? x + w - 32 : x + 32, y + 56);
    g.restore();
  }
  const NODES = Array.from({length: 18}, (_, i) => [((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1, ((Math.sin(i * 78.233) * 12543.21) % 1 + 1) % 1]);
  const STARS = Array.from({length: 70}, (_, i) => [((Math.sin(i * 3.7) * 9301.7) % 1 + 1) % 1, ((Math.sin(i * 9.1) * 4871.3) % 1 + 1) % 1, (i % 5) / 5]);
  const LOOK = {
    mail: {bg: '#0d1016', c: '#ffd166', b: '#b9dacc'}, chat: {bg: '#06140d', c: '#25d366', b: '#9be564'},
    profile: {bg: '#08111c', c: '#4c9aff', b: '#b9dacc'}, world: {bg: '#07120e', c: '#b9dacc', b: '#5b8eff'},
    space: {bg: '#03060d', c: '#8fb4ff', b: '#c084fc'}, films: {bg: '#120a10', c: '#ff7a8a', b: '#5b8eff'}, link: {bg: '#0e0f12', c: '#e9e9ee', b: '#5b8eff'},
  };
  const kindOf = a => a.dataset.kind || (a.href.startsWith('mailto:') ? 'mail' : /wa\.me|whatsapp/i.test(a.href) ? 'chat' : /linkedin/i.test(a.href) ? 'profile' : /\/world(\/|\?|$)/.test(a.href) ? 'world' : /\/space(\/|\?|$)/.test(a.href) ? 'space' : 'link');
  function draw(tv, t, k) {
    const {g, w, kind, look, label, href, cards} = tv;
    backdrop(g, w, look.bg, look.c, look.b, t);
    if (kind === 'mail') {
      const ex = ar ? R - 330 : L, ey = 110, o = .5 + .5 * Math.sin(t * 1.7);
      g.lineWidth = 9; g.lineJoin = 'round'; g.strokeStyle = look.c;
      g.fillStyle = rgba(look.c, .12); g.fillRect(ex + 40, ey + 40 - o * 90, 250, 150); g.strokeRect(ex + 40, ey + 40 - o * 90, 250, 150);
      g.fillStyle = look.bg; g.fillRect(ex, ey + 70, 330, 200); g.strokeRect(ex, ey + 70, 330, 200);
      g.beginPath(); g.moveTo(ex, ey + 70); g.lineTo(ex + 165, ey + 70 + 120 * (1 - o) - 60 * o); g.lineTo(ex + 330, ey + 70); g.stroke();
      const email = href.replace(/^mailto:/, '').split('?')[0], typed = email.slice(0, Math.min(email.length, Math.floor((t * 9) % (email.length + 22))));
      g.font = TEXT(500, 46); g.fillStyle = 'rgba(255,255,255,.88)'; g.textAlign = ar ? 'right' : 'left'; g.direction = 'ltr';
      g.fillText(typed + (t % 1 < .5 ? '|' : ''), SX, 470);
      kinetic(g, label, 560, 104, k, t, look.c);
    } else if (kind === 'chat') {
      const msgs = ar ? ['مرحباً محمد!', 'أهلاً! ماذا سنبني؟', 'شيئاً مفيداً.'] : ['Hi Mohamed!', 'Hey! What are we building?', 'Something useful.'], cyc = t % 7.5;
      msgs.forEach((m, j) => {const at = .4 + j * 1.5; if (cyc > at) bubble(g, m, j % 2 === 0, 90 + j * 128, (cyc - at) / .35, look.c);});
      kinetic(g, label, 520, 116, k, t, look.c);
    } else if (kind === 'profile') {
      g.lineWidth = 2;
      const P = NODES.map(([x, y], i) => [160 + x * 1280 + Math.sin(t * .6 + i) * 18, 80 + y * 420 + Math.cos(t * .5 + i * 2) * 14]);
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]);
        if (d < 330) {g.strokeStyle = rgba(look.c, .35 * (1 - d / 330)); g.beginPath(); g.moveTo(P[i][0], P[i][1]); g.lineTo(P[j][0], P[j][1]); g.stroke();}
      }
      P.forEach(([x, y], i) => {const p = (Math.sin(t * 2 + i) + 1) / 2; g.fillStyle = i === 7 ? '#fff' : rgba(look.c, .6 + .4 * p); g.beginPath(); g.arc(x, y, i === 7 ? 22 : 7 + p * 5, 0, Math.PI * 2); g.fill();});
      kinetic(g, label, 560, 116, k, t, look.c);
    } else if (kind === 'world') {
      // a glass MK turning in the studio
      const cx = ar ? 480 : 1120, cy = 300, turn = Math.sin(t * .8);
      g.save(); g.translate(cx, cy); g.scale(.55 + .45 * Math.abs(Math.cos(t * .4)), 1);
      g.font = DISPLAY(700, 300); g.textAlign = 'center';
      const gr = g.createLinearGradient(-260, -200, 260, 120); gr.addColorStop(0, 'rgba(216,255,240,.9)'); gr.addColorStop(.5 + turn * .3, 'rgba(255,255,255,.15)'); gr.addColorStop(1, 'rgba(185,218,204,.75)');
      g.fillStyle = gr; g.fillText('MK', 0, 100); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; g.strokeText('MK', 0, 100);
      g.restore();
      kinetic(g, label, 560, 116, k, t, look.c);
    } else if (kind === 'space') {
      STARS.forEach(([x, y, z]) => {g.globalAlpha = .4 + .6 * ((Math.sin(t * (1 + z * 3) + x * 40) + 1) / 2); g.fillStyle = '#fff'; g.fillRect(x * 1600, y * 520 + (t * 6 * (z + .2)) % 520, 3 + z * 3, 3 + z * 3);});
      g.globalAlpha = 1;
      const rg = g.createRadialGradient(800, 1700, 900, 800, 1700, 1180); rg.addColorStop(0, '#05070d'); rg.addColorStop(.86, '#0a1020'); rg.addColorStop(.97, rgba(look.c, .9)); rg.addColorStop(1, rgba(look.c, 0));
      g.fillStyle = rg; g.fillRect(0, 300, 1600, 600);
      const sun = 300 + Math.sin(t * .5) * 10; g.fillStyle = 'rgba(255,248,230,.9)'; g.beginPath(); g.arc(800, 520 + sun * .01, 9, 0, Math.PI * 2); g.fill();
      kinetic(g, label, 140, 130, k, t, look.c);
    } else if (kind === 'films' && cards.length) {
      const i = Math.floor(t / 1.6), f = (t / 1.6) % 1, img = card(tv, i), next = card(tv, i + 1); card(tv, i + 2);
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (img) g.drawImage(img, f > .86 ? (f - .86) * -tv.c.width * 4 : 0, 0, tv.c.width, tv.c.height);
      if (next && f > .86) g.drawImage(next, tv.c.width - (f - .86) * tv.c.width * 7.2, 0, tv.c.width, tv.c.height);
      g.setTransform(w / 1600, 0, 0, w / 1600, 0, 0);
      const gr = g.createLinearGradient(0, 380, 0, 900); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.85)'); g.fillStyle = gr; g.fillRect(0, 380, 1600, 520);
      kinetic(g, label, 600, 104, k, t, look.c);
    } else kinetic(g, label, 560, 116, k, t, look.c);
    open(g, k, look.c);
  }
  function card(tv, i) {
    const n = tv.cards.length, j = ((i % n) + n) % n;
    if (!tv.imgs[j]) {const im = new Image(); im.src = tv.cards[j]; tv.imgs[j] = im;}
    const im = tv.imgs[j];
    return im.complete && im.naturalWidth ? im : null;
  }

  // ── one wall ──
  walls.forEach(host => {
    const links = [...host.querySelectorAll('a[href]')];
    if (links.length < 2) return;
    const n = links.length, step = 360 / n;
    const stage = document.createElement('div'), ring = document.createElement('div');
    stage.className = 'tvw'; ring.className = 'tvw-ring';
    stage.append(ring);
    const hint = document.createElement('p');
    hint.className = 'tvw-hint'; hint.textContent = ar ? 'اسحب لتدوير الشاشات، واضغط لتفتح' : 'Drag to spin the TVs. Click one to open it.';
    stage.append(hint);
    const tvs = links.map((a, i) => {
      const kind = kindOf(a), look = LOOK[kind] || LOOK.link, label = (a.dataset.label || a.textContent || '').replace(/[↗→←]/g, '').trim();
      a.className = 'tvw-tv'; a.style.setProperty('--a', `${i * step}deg`); a.style.setProperty('--led', look.c);
      a.setAttribute('aria-label', label); a.draggable = false;
      a.textContent = '';
      const c = document.createElement('canvas'); a.append(c);
      ring.append(a);
      return {a, c, g: c.getContext('2d'), w: 0, kind, look, label, href: a.href, cards: JSON.parse(a.dataset.cards || '[]'), imgs: [], drawnAt: -1};
    });
    host.textContent = '';
    host.append(stage);
    host.classList.add('has-tv-wall');

    let W = 0, Hh = 0, r = 0;
    function size() {
      W = Math.round(Math.min(480, stage.clientWidth * (innerWidth < 640 ? .74 : .4)));
      Hh = Math.round(W * 9 / 16);
      r = Math.round(W / 2 / Math.tan(Math.PI / n) + Math.max(16, W * .06));
      stage.style.setProperty('--tvh', `${Math.round(Hh * 1.55 + 40)}px`);
      ring.style.setProperty('--w', `${W}px`); ring.style.setProperty('--h', `${Hh}px`); ring.style.setProperty('--r', `${r}px`);
      const dpr = Math.min(1.6, devicePixelRatio || 1);
      for (const tv of tvs) {tv.c.width = Math.round((W - 22) * dpr); tv.c.height = Math.round((Hh - 22) * dpr); tv.w = tv.c.width; tv.drawnAt = -1;}
    }
    size(); addEventListener('resize', size, {passive: true});

    // spin: drag (with momentum), settle on the nearest TV, step on when left alone
    let spin = 0, vel = 0, target = 0, drag = null, moved = 0, idleAt = performance.now(), visible = false, born = -1, last = performance.now();
    const setSpin = () => {ring.style.transform = `translateZ(${-r}px) rotateY(${-spin}deg)`;};
    // a press is a click until it moves; only then does the ring take the pointer (so links still open)
    stage.addEventListener('pointerdown', e => {drag = {x: e.clientX, at: performance.now(), spin, id: e.pointerId, live: false}; moved = 0; vel = 0;});
    stage.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x; moved = Math.max(moved, Math.abs(dx));
      if (!drag.live) {if (moved < 6) return; drag.live = true; stage.setPointerCapture?.(drag.id); stage.classList.add('is-drag');}
      const next = drag.spin - dx * (360 / (W * n * .9)) * (ar ? -1 : 1), now = performance.now();
      vel = (next - spin) / Math.max(.008, (now - (drag.t || now - 16)) / 1000); drag.t = now;
      spin = next; target = spin; idleAt = now;
    });
    const up = () => {if (!drag) return; drag = null; stage.classList.remove('is-drag'); idleAt = performance.now();};
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    stage.addEventListener('click', e => {if (moved > 6) {e.preventDefault(); e.stopPropagation();}}, true);   // a drag is not a click
    tvs.forEach((tv, i) => tv.a.addEventListener('focus', () => {target = Math.round((spin - i * step) / 360) * 360 + i * step; idleAt = performance.now();}));
    new IntersectionObserver(es => {visible = es[0].isIntersecting; if (visible && born < 0) born = performance.now() / 1000;}, {threshold: .2}).observe(stage);

    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (!visible || document.hidden) return;
      if (!drag) {
        if (Math.abs(vel) > 20) {vel *= Math.exp(-3 * dt); spin += vel * dt; target = Math.round(spin / step) * step; idleAt = now;}
        else {
          vel = 0;
          if (!still && now - idleAt > 3600) {target = Math.round(spin / step) * step + step; idleAt = now;}
          spin += (target - spin) * (1 - Math.exp(-dt * 5));
        }
      }
      setSpin();
      const t = now / 1000, odd = (Math.floor(now / 33) & 1) === 0;
      tvs.forEach((tv, i) => {
        const face = Math.cos((i * step - spin) * Math.PI / 180);
        tv.a.style.filter = `brightness(${(.45 + .55 * Math.max(0, face)).toFixed(3)})`;
        if (tv.drawnAt < 0 || (!still && odd && face > .05)) {draw(tv, t, born < 0 ? 0 : t - born - i * .12); tv.drawnAt = t;}
      });
    }
    requestAnimationFrame(frame);
  });
})();
