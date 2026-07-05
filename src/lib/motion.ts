/* =====================================================================
   Motion core — Lenis smooth-scroll + GSAP ScrollTrigger.

   GSAP + Lenis are CODE-SPLIT: dynamically imported ONLY on desktop with
   motion enabled (the only place pins/scrub run). On mobile / reduced-motion
   they never load — the spine + home render their static end-states with zero
   GSAP/Lenis cost (protects mobile Lighthouse).

   · ScrollTriggers are killed + rebuilt on every astro:page-load (fresh DOM).
   · The light [data-px] depth parallax has no dependency on GSAP.
   ===================================================================== */
import { initStoryScroll, renderStoryStatic } from './storyscroll';
import { initHomeMotion, renderHomeStatic } from './home';
import { themeMotion } from './theme';

export const prefersReduced = (): boolean =>
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);

// Heavy motion (GSAP pins + Lenis smooth-scroll) runs on EVERY width, phones
// included — the owner wants the story-spine parallax visible on mobile and
// accepts the performance cost. Only prefers-reduced-motion disables it (an
// accessibility guarantee we keep). Previously this also bailed out at
// <=820px, which is why the spine flattened to a static layout on phones.
const heavyOff = (): boolean => prefersReduced();
export const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

/* ---- lazily-loaded engine ---- */
/* eslint-disable @typescript-eslint/no-explicit-any */
let gsap: any = null;
let ST: any = null;
let lenis: any = null;
let LenisCtor: any = null;
let tickerCb: ((time: number) => void) | null = null;
let modulesReady = false;

/** The ScrollTrigger constructor, or null until the engine is loaded. */
export function getST(): any {
  return ST;
}

async function loadEngine(): Promise<void> {
  if (!modulesReady) {
    const [g, s, L] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
    gsap = g.gsap;
    ST = s.ScrollTrigger;
    LenisCtor = L.default;
    gsap.registerPlugin(ST);
    gsap.ticker.lagSmoothing(0);
    // Phones: the address bar showing/hiding fires resize and changes the
    // viewport height. Ignore those so pinned beats don't recalc mid-scroll.
    ST.config({ ignoreMobileResize: true });
    modulesReady = true;
  }
  // (re)create Lenis only when it's actually wanted (desktop + motion).
  // Smoothing comes from the THEME_MOTION map (dark/light keep 0.1).
  if (!lenis) {
    lenis = new LenisCtor({ lerp: themeMotion().lenisLerp, wheelMultiplier: 1, smoothWheel: true, autoRaf: false });
    lenis.on('scroll', ST.update);
    tickerCb = (time: number) => {
      if (lenis) lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
  }
}

/** Tear Lenis down so mobile / reduced-motion uses NATIVE scroll, and resizing
 *  desktop→mobile doesn't leave smooth-scroll hijacking the now-static layout. */
function destroyLenis(): void {
  if (!lenis) return;
  if (tickerCb && gsap) gsap.ticker.remove(tickerCb);
  if (ST) lenis.off('scroll', ST.update);
  lenis.destroy();
  lenis = null;
  tickerCb = null;
}

export function killTriggers(): void {
  if (ST) ST.getAll().forEach((t: any) => t.kill());
}

/* ---- Depth parallax ([data-px] = speed; center-of-element based) ----
   Light + transform-only. Skipped entirely under reduced-motion / mobile. */
let pxBound = false;
function applyParallax(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-px]');
  if (!els.length) return;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  // Per-theme parallax identity: depth scale + storybook's curved (sine) drift.
  const m = themeMotion();
  const rtl = document.documentElement.getAttribute('dir') === 'rtl';
  els.forEach((el) => {
    const sp = (parseFloat(el.getAttribute('data-px') || '0') || 0) * m.pxScale;
    const r = el.getBoundingClientRect();
    const c = r.top + r.height / 2 - vh / 2;
    const x = m.curve ? Math.sin((c / (vh || 1)) * 4.712) * sp * m.curve * (rtl ? -1 : 1) : 0;
    el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (-c * sp).toFixed(1) + 'px,0)';
  });
}
function initParallaxDepth(): void {
  if (heavyOff()) {
    document.querySelectorAll<HTMLElement>('[data-px]').forEach((el) => (el.style.transform = 'none'));
    return;
  }
  if (!pxBound) {
    pxBound = true;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            applyParallax();
          });
        }
      },
      { passive: true },
    );
    window.addEventListener('resize', applyParallax, { passive: true });
  }
  applyParallax();
}

/* ---- Orchestrator — called by BaseLayout boot() on load + page-load ---- */
let lifecycleBound = false;
let resizeTimer = 0;
let lastHeavyOff = false;
let lastWidth = 0;
export async function initMotion(): Promise<void> {
  initParallaxDepth();

  const off = heavyOff();
  lastHeavyOff = off;
  lastWidth = window.innerWidth;
  if (off) {
    // mobile / reduced-motion → static end-state; kill pins AND stop Lenis so
    // native scroll resumes (covers a desktop→mobile resize, not just first load)
    killTriggers();
    destroyLenis();
    renderStoryStatic();
    renderHomeStatic();
  } else {
    await loadEngine();
    killTriggers();
    initStoryScroll();
    initHomeMotion();
    ST.refresh();
  }

  if (!lifecycleBound) {
    lifecycleBound = true;
    window.addEventListener('load', () => {
      if (ST) ST.refresh();
    });
    // Theme switch: rebuild Lenis (new smoothing) + triggers (new scrub) and
    // re-run the depth pass so THEME_MOTION takes effect immediately.
    document.addEventListener('mm:themechange', () => {
      destroyLenis();
      void initMotion();
    });
    // Re-evaluate only when it matters: a reduced-motion toggle flips the heavy
    // state (full rebuild); an orientation / real width change needs a refresh.
    // A height-only change (mobile URL bar) is ignored so pins don't thrash.
    window.addEventListener(
      'resize',
      () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (heavyOff() !== lastHeavyOff) {
            void initMotion();
          } else if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            if (ST) ST.refresh();
          }
        }, 250);
      },
      { passive: true },
    );
  }
}
