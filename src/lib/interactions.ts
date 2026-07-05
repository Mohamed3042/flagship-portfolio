/* =====================================================================
   Progressive-enhancement interactions — ported from the flagship engine.
   · scroll reveal (.reveal -> .in)
   · animated number counters ([data-count] with format/decimals/prefix/suffix)
   · subtle hero parallax ([data-parallax])
   · nav "scrolled" state + top scroll-progress bar
   All respect prefers-reduced-motion and are safe to call after every
   Astro View Transition (no duplicate listeners, no double-count).
   ===================================================================== */

import { themeMotion } from './theme';

const reduce = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---- counters ---- */
function trim(x: number): string {
  return (Math.round(x * 10) / 10).toString().replace(/\.0$/, '');
}
function abbr(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e6) return trim(n / 1e6) + 'M';
  if (a >= 1e3) return trim(n / 1e3) + 'K';
  return String(Math.round(n));
}
function fmt(n: number, el: HTMLElement): string {
  const dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
  if (el.getAttribute('data-format') === 'abbr') return abbr(n);
  if (dec > 0) return n.toFixed(dec);
  return Math.round(n).toLocaleString('en-US');
}
function runCounter(el: HTMLElement) {
  if (el.dataset.counted === 'true') return;
  el.dataset.counted = 'true';
  const target = parseFloat(el.getAttribute('data-count') || '');
  const pre = el.getAttribute('data-prefix') || '';
  const suf = el.getAttribute('data-suffix') || '';
  if (isNaN(target)) return;
  if (reduce()) { el.textContent = pre + fmt(target, el) + suf; return; }
  const dur = parseInt(el.getAttribute('data-duration') || '1500', 10);
  let t0: number | null = null;
  function tick(t: number) {
    if (t0 === null) t0 = t;
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + fmt(target * eased, el) + suf;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = pre + fmt(target, el) + suf;
  }
  requestAnimationFrame(tick);
}
function initCounters() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (!('IntersectionObserver' in window)) { els.forEach(runCounter); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { runCounter(en.target as HTMLElement); io.unobserve(en.target); }
    });
  }, { threshold: 0.5 });
  els.forEach((el) => { if (el.dataset.counted !== 'true') io.observe(el); });
}

/* ---- reveal ---- */
function initReveal() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal,.scale-in'));
  if (reduce() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  // Reveal anything already in (or near) the viewport right away, so the hero
  // and other above-the-fold content never wait on a delayed observer tick.
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.95 && r.bottom > 0) el.classList.add('in');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
  // Safety net: never leave content hidden for long on a slow cold load.
  window.setTimeout(() => {
    els.forEach((el) => el.classList.add('in'));
  }, 1200);
}

/* ---- hero parallax ---- */
let parallaxBound = false;
function initParallax() {
  if (reduce() || parallaxBound) return;
  parallaxBound = true;
  let ticking = false;
  const apply = () => {
    ticking = false;
    const y = window.scrollY || 0;
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((l) => {
      const s = parseFloat(l.getAttribute('data-parallax') || '0.2') || 0.2;
      l.style.transform = 'translate3d(0,' + (y * s) + 'px,0)';
    });
  };
  // rAF-batched so it fires once per frame, not on every (Lenis-multiplied) scroll event
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
  }, { passive: true });
}

/* ---- scroll-scrubbed sections ----
   Any [data-scrub] element gets a live `--p` custom property from 0 (just
   entering the viewport from the bottom) to 1 (just left through the top).
   CSS then maps --p to rotation / staggered reveals, so the animation is
   driven BY the scroll position itself — more scroll, more revealed. */
let scrubBound = false;
function updateScrub() {
  const els = document.querySelectorAll<HTMLElement>('[data-scrub]');
  if (!els.length) return;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    const total = r.height + vh || 1;
    const p = Math.min(1, Math.max(0, (vh - r.top) / total));
    el.style.setProperty('--p', p.toFixed(4));
  });
}
function initScrub() {
  if (reduce()) {
    document
      .querySelectorAll<HTMLElement>('[data-scrub]')
      .forEach((el) => el.style.setProperty('--p', '1'));
    return;
  }
  let ticking = false;
  if (!scrubBound) {
    scrubBound = true;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            updateScrub();
          });
        }
      },
      { passive: true },
    );
    window.addEventListener('resize', updateScrub, { passive: true });
  }
  updateScrub();
}

/* ---- Cosmic Keynote: scroll-driven Apple-Intelligence glow ----
   Each element matching GLOW_SEL gets a live `--glow` (0→1) that peaks as its
   centre nears the viewport centre, then fades. CSS maps --glow to a clean text
   drop-shadow (headlines) or the soft colour aura (shapes). Glow is therefore
   driven BY scroll — never a constant animation. Reduced-motion pins --glow:0. */
const GLOW_SEL =
  '.glow-text,.glow-frame,.display,.h-xl,.h-lg,.metric__num,.hook__num b,.climb,' +
  '.statement p,.handoff__num,.handoff__label,.hook__title,.metric,.role,.fcard,' +
  '.build__item,.feat,.step,.asset-slot,.badge,.note';
let glowEls: HTMLElement[] = [];
let glowBound = false;
function updateGlow() {
  if (!glowEls.length) return;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const vc = vh / 2;
  const span = vh * 0.62 || 1;
  // per-theme glow curve (dark/light = 1; hotter under neon, calmer in cinema)
  const gain = themeMotion().glowGain;
  for (const el of glowEls) {
    const r = el.getBoundingClientRect();
    let g = 0;
    if (r.bottom > 0 && r.top < vh) {
      const ctr = r.top + r.height / 2;
      g = 1 - Math.min(1, Math.abs(ctr - vc) / span);
      if (g < 0) g = 0;
      g = Math.min(1, g * gain);
    }
    const gs = g.toFixed(2);
    if (el.dataset.g !== gs) {
      el.dataset.g = gs;
      el.style.setProperty('--glow', gs);
    }
  }
}
function initGlow() {
  glowEls = Array.from(document.querySelectorAll<HTMLElement>(GLOW_SEL));
  if (reduce()) {
    glowEls.forEach((el) => el.style.setProperty('--glow', '0'));
    glowEls = [];
    return;
  }
  if (!glowBound) {
    glowBound = true;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            updateGlow();
          });
        }
      },
      { passive: true },
    );
    window.addEventListener('resize', updateGlow, { passive: true });
  }
  updateGlow();
}

/* ---- Read-along: scroll-driven word highlight ----
   Any [data-read] block has its text split into per-word spans (once). As the
   block scrolls up through a "reading line", words light from muted → ink and
   the word currently on the line tints to the page accent and lifts/zooms — a
   karaoke read-through tied to scroll. HTML inside (e.g. <b>) is preserved; the
   split walks text nodes only. RTL-safe (words are space-separated either way).
   No-JS / pre-init state = fully readable (dimming only applies once .is-reading
   is set). Runs on every width — it IS the parallax motion for the briefs. */
function splitReadWords(el: HTMLElement): void {
  if (el.dataset.readReady === '1') return;
  const walk = (node: Node): void => {
    const kids = Array.from(node.childNodes);
    for (const k of kids) {
      if (k.nodeType === Node.TEXT_NODE) {
        const text = k.textContent || '';
        if (!text.trim()) continue;
        const frag = document.createDocumentFragment();
        for (const part of text.split(/(\s+)/)) {
          if (part === '') continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.className = 'rw';
            span.textContent = part;
            frag.appendChild(span);
          }
        }
        node.replaceChild(frag, k);
      } else if (k.nodeType === Node.ELEMENT_NODE && (k as HTMLElement).childNodes.length) {
        walk(k);
      }
    }
  };
  walk(el);
  el.dataset.readReady = '1';
  el.classList.add('is-reading');
}
let readEls: { el: HTMLElement; words: HTMLElement[] }[] = [];
let readBound = false;
function updateReadAlong(): void {
  if (!readEls.length) return;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const enter = vh * 0.86; // a word starts reading when it rises to here
  const line = vh * 0.42; // …and is fully read once it passes this line
  for (const { el, words } of readEls) {
    const n = words.length;
    if (!n) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) continue; // offscreen — skip the per-word work
    const span = enter - line + r.height || 1;
    const p = (enter - r.top) / span; // 0 (untouched) → 1 (fully read)
    const litRaw = p * n;
    for (let i = 0; i < n; i++) {
      const lit = litRaw - i < 0 ? 0 : litRaw - i > 1 ? 1 : litRaw - i; // 0..1 across this word
      const act = 1 - Math.abs(lit - 0.5) * 2; // peaks while the word is on the line
      const w = words[i];
      w.style.setProperty('--lit', lit.toFixed(3));
      w.style.setProperty('--act', (act < 0 ? 0 : act).toFixed(3));
    }
  }
}
function initReadAlong(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-read]'));
  els.forEach(splitReadWords);
  readEls = els.map((el) => ({ el, words: Array.from(el.querySelectorAll<HTMLElement>('.rw')) }));
  if (!readBound) {
    readBound = true;
    let ticking = false;
    const onScroll = (): void => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          updateReadAlong();
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  updateReadAlong();
}

/* ---- nav scrolled state + scroll-progress bar ---- */
let chromeBound = false;
function initScrollChrome() {
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    const nav = document.querySelector('.nav');
    const bar = document.querySelector<HTMLElement>('.progress');
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  };
  if (!chromeBound) {
    chromeBound = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  onScroll();
}

export function initInteractions(): void {
  initReveal();
  initCounters();
  initParallax();
  initScrub();
  initGlow();
  initReadAlong();
  initScrollChrome();
}
