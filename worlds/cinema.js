/* cinema.js — shared scroll-cinema engine for the Worlds pages.
   Dependency-free. One passive scroll listener + rAF, IntersectionObserver
   for media, CSS custom properties as the animation bus.

   Contract (what a world page provides):
     [data-scene]            a full-height scroll chapter; gets --p set 0..1 as
                             it travels the viewport (0 = entering, 1 = leaving)
                             and .is-live while any part is on screen.
     [data-scene="pin"]      the scene wraps a position:sticky .stage; --p spans
                             the whole sticky travel.
     [data-film]             <video muted playsinline preload="none"> with
                             data-src (assigned lazily) + poster. Plays while
                             its scene is live, pauses+rewinds when far away.
                             data-next="#id" optionally names the video to
                             prefetch while this one plays.
     [data-rail]             page progress bar; gets --p 0..1 for whole page.
     [data-counter]          counts data-from → data-to as its scene scrubs.
     [data-lang-toggle]      button that flips en/ar. Copy is authored as
                             <span class="L en">…</span><span class="L ar">…</span>;
                             CSS shows one. <html> gets lang+dir swapped and the
                             choice persists in localStorage("mm-lang").
     [data-theater]          button that opens the master film in a <dialog>
                             with src from data-master.
   Reduced motion: no autoplay, posters hold, --p still updates (CSS decides
   how much to move; keep transforms tiny under prefers-reduced-motion). */
(() => {
  'use strict';
  const doc = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- language ---------- */
  const LANG_KEY = 'mm-lang';
  const setLang = (lang) => {
    const ar = lang === 'ar';
    doc.lang = ar ? 'ar' : 'en';
    doc.dir = ar ? 'rtl' : 'ltr';
    doc.classList.toggle('lang-ar', ar);
    try { localStorage.setItem(LANG_KEY, ar ? 'ar' : 'en'); } catch {}
    document.querySelectorAll('[data-lang-toggle]').forEach(b => {
      b.setAttribute('aria-pressed', ar ? 'true' : 'false');
    });
  };
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch {}
  if (!saved) saved = (navigator.language || '').startsWith('ar') ? 'ar' : 'en';
  setLang(saved);
  addEventListener('click', (e) => {
    const t = e.target.closest('[data-lang-toggle]');
    if (t) setLang(doc.lang === 'ar' ? 'en' : 'ar');
  });

  /* ---------- scenes: --p progress ---------- */
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const rails = [...document.querySelectorAll('[data-rail]')];
  const counters = [...document.querySelectorAll('[data-counter]')].map(el => ({
    el,
    from: parseFloat(el.dataset.from || '0'),
    to: parseFloat(el.dataset.to || '100'),
    dp: (el.dataset.to || '').includes('.') ? 1 : 0,
    scene: el.closest('[data-scene]'),
  }));
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  let ticking = false;

  /* Solo mode (?solo=N&p=0.7): isolate scene N at progress p — a QA harness
     for reviewing any scene as a still, without scrolling. */
  const q = new URLSearchParams(location.search);
  const soloMode = q.has('solo');

  /* Liveness is computed in the scroll loop, NOT IntersectionObserver — some
     embedded webviews never fire IO, and the loop already has every rect.
     A scene is "live" while it overlaps the middle band of the viewport; the
     engine toggles .is-live and dispatches scene:live / scene:idle on it. */
  const paint = () => {
    ticking = false;
    if (soloMode) return;
    const vh = innerHeight;
    const total = doc.scrollHeight - vh;
    const page = total > 0 ? clamp01(scrollY / total) : 0;
    rails.forEach(r => r.style.setProperty('--p', page.toFixed(4)));
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      const live = r.top < vh * 0.62 && r.bottom > vh * 0.38;
      if (live !== s.__live) {
        s.__live = live;
        s.classList.toggle('is-live', live);
        s.dispatchEvent(new CustomEvent(live ? 'scene:live' : 'scene:idle'));
        const v = s.querySelector('[data-film]');
        if (v) live ? filmOn(v) : filmOff(v);
      }
      if (r.bottom < -vh || r.top > vh * 2) continue; // far away: skip the maths
      if (r.top < vh * 3) { const v = s.querySelector('[data-film]'); if (v) arm(v); }
      // progress of the scene's travel: 0 when top hits viewport bottom,
      // 1 when bottom leaves viewport top (pin scenes: sticky travel span)
      const span = s.dataset.scene === 'pin' ? r.height - vh : r.height + vh;
      const passed = s.dataset.scene === 'pin' ? -r.top : vh - r.top;
      const p = clamp01(span > 0 ? passed / span : 0);
      s.style.setProperty('--p', p.toFixed(4));
    }
    for (const c of counters) {
      const p = c.scene ? parseFloat(c.scene.style.getPropertyValue('--p') || '0') : page;
      const v = c.from + (c.to - c.from) * clamp01(p * 1.15);
      c.el.textContent = v.toFixed(c.dp);
    }
  };
  let paintFallback = 0;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
    // safety: some embedded webviews stall rAF; a timer keeps scenes honest
    clearTimeout(paintFallback);
    paintFallback = setTimeout(() => { if (ticking) paint(); }, 120);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });

  /* ---------- films (lazy video director) ---------- */
  const arm = (v) => {                 // attach src once, near viewport
    if (v && !v.src && v.dataset.src) { v.src = v.dataset.src; v.load(); }
  };

  const filmOn = (v) => {
    arm(v);
    if (reduced.matches) return;       // posters hold under reduced motion
    const go = v.play();
    if (go) go.catch(() => {});
    if (v.dataset.next) arm(document.querySelector(v.dataset.next));
    v.closest('[data-scene]')?.classList.add('has-played');
  };
  const filmOff = (v) => { v.pause(); try { v.currentTime = 0; } catch {} };

  /* loop-hold: when a clip ends, hold its last frame (no rewind flash) */
  addEventListener('ended', (e) => {
    const v = e.target;
    if (v.matches && v.matches('[data-film]')) v.closest('[data-scene]')?.classList.add('is-held');
  }, true);

  /* ---------- theater (master film dialog) ---------- */
  const theaterBtns = document.querySelectorAll('[data-theater]');
  if (theaterBtns.length) {
    const dlg = document.createElement('dialog');
    dlg.className = 'theater';
    dlg.innerHTML = '<button class="theater__close" aria-label="Close">✕</button><video controls playsinline></video>';
    document.body.appendChild(dlg);
    const tv = dlg.querySelector('video');
    dlg.querySelector('.theater__close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('close', () => { tv.pause(); tv.removeAttribute('src'); tv.load(); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    theaterBtns.forEach(b => b.addEventListener('click', () => {
      tv.src = b.dataset.theater;
      dlg.showModal();
      tv.play().catch(() => {});
    }));
  }

  if (soloMode) {
    const idx = parseInt(q.get('solo'), 10) || 0;
    const p = q.get('p') || '0.5';
    document.querySelectorAll('.act, footer, .chrome').forEach(el => { el.style.display = 'none'; });
    scenes.forEach((s, i) => {
      if (i !== idx) { s.style.display = 'none'; return; }
      s.style.height = '100vh';
      s.style.setProperty('--p', p);
      s.classList.add('is-live');
      s.dispatchEvent(new CustomEvent('scene:live'));
    });
  } else {
    paint();
  }
})();

/* ════════════════════════════════════════════════════════════════════
   CINEMA v3 — projection-booth chrome. Opt-in via body[data-*]:
     data-film="DSN"        slate HUD reel id (+ scene counter + timecode)
     data-runtime="480"     virtual reel length in seconds for the timecode
     data-ticks             scene tick rail (click to jump)
     data-letterbox         projector mattes while a scene is live
   Keyboard: ← / → step scenes (RTL-aware). No opt-in attrs → inert.
   ════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';
  const body = document.body, doc = document.documentElement;
  const wantHud = body.hasAttribute('data-film');
  const wantTicks = body.hasAttribute('data-ticks');
  const wantBox = body.hasAttribute('data-letterbox');
  if (!wantHud && !wantTicks && !wantBox) return;
  if (new URLSearchParams(location.search).has('solo')) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = [...document.querySelectorAll('[data-scene]')];
  if (!scenes.length) return;

  /* ---- letterbox mattes ---- */
  if (wantBox) {
    ['top', 'btm'].forEach(k => {
      const m = document.createElement('div');
      m.className = 'matte ' + k; m.setAttribute('aria-hidden', 'true');
      body.appendChild(m);
    });
  }

  /* ---- slate HUD ---- */
  let hud, hudSc, hudTc;
  const runtime = parseFloat(body.dataset.runtime || '300');
  const pad = n => String(n).padStart(2, '0');
  if (wantHud) {
    hud = document.createElement('div');
    hud.className = 'hud'; hud.setAttribute('aria-hidden', 'true');
    hud.innerHTML = '<span class="reel"></span><span class="sc"></span><span class="tc"></span>';
    hud.querySelector('.reel').textContent = body.dataset.film;
    hudSc = hud.querySelector('.sc'); hudTc = hud.querySelector('.tc');
    body.appendChild(hud);
  }

  /* ---- tick rail ---- */
  let tickBtns = [];
  if (wantTicks) {
    const rail = document.createElement('nav');
    rail.className = 'ticks';
    rail.setAttribute('aria-label', doc.lang === 'ar' ? 'مشاهد الفيلم' : 'Film scenes');
    scenes.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      const label = s.dataset.slate || ('Scene ' + (i + 1));
      b.setAttribute('aria-label', label);
      b.title = label;
      b.addEventListener('click', () =>
        s.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }));
      rail.appendChild(b);
    });
    body.appendChild(rail);
    tickBtns = [...rail.children];
  }

  /* ---- keyboard: step scenes (RTL-aware ←/→) ---- */
  const jump = (dir) => {
    const vh = innerHeight;
    let cur = 0;
    scenes.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.5) cur = i; });
    const next = Math.min(scenes.length - 1, Math.max(0, cur + dir));
    scenes[next].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };
  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.target.closest('input, textarea, select, dialog')) return;
    const rtl = doc.dir === 'rtl';
    if (e.key === 'ArrowRight') { e.preventDefault(); jump(rtl ? -1 : 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); jump(rtl ? 1 : -1); }
  });

  /* ---- booth loop: active scene, mattes, timecode ---- */
  let ticking = false, lastCur = -1, lastBox = null, lastTc = '';
  const boothPaint = () => {
    ticking = false;
    const vh = innerHeight;
    let cur = 0, anyLive = false;
    for (let i = 0; i < scenes.length; i++) {
      const r = scenes[i].getBoundingClientRect();
      if (r.top < vh * 0.5) cur = i;
      if (!anyLive && scenes[i].classList.contains('is-live')) anyLive = true;
    }
    if (wantBox && anyLive !== lastBox) { lastBox = anyLive; doc.classList.toggle('boxed', anyLive); }
    if (wantHud) {
      if (cur !== lastCur) {
        lastCur = cur;
        hudSc.textContent = 'SC ' + pad(cur + 1) + '/' + pad(scenes.length);
        if (tickBtns.length) tickBtns.forEach((b, i) => b.classList.toggle('on', i === cur));
      }
      const total = doc.scrollHeight - vh;
      const page = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0;
      const t = page * runtime;
      const tc = pad(Math.floor(t / 60)) + ':' + pad(Math.floor(t % 60)) + ':' + pad(Math.floor((t % 1) * 24));
      if (tc !== lastTc) { lastTc = tc; hudTc.textContent = tc; }
    } else if (tickBtns.length && cur !== lastCur) {
      lastCur = cur;
      tickBtns.forEach((b, i) => b.classList.toggle('on', i === cur));
    }
  };
  let boothFallback = 0;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(boothPaint);
    // same safety as the engine: some embedded webviews stall rAF
    clearTimeout(boothFallback);
    boothFallback = setTimeout(() => { if (ticking) boothPaint(); }, 120);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  boothPaint();
})();
