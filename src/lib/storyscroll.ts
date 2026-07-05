/* =====================================================================
   StoryScroll spine driver — the reusable 5-beat scroll engine.
   Hook · Brief are plain-flow (reveals + [data-px] depth parallax, handled
   by interactions.ts + motion.ts). This file owns the two HEAVY beats:

   · BUILD  — pin [data-build-sticky], scrub; reveal each [data-build-item]
              in sequence (item i active once progress p >= i/n) + progress bar.
   · PROOF  — pin [data-proof-sticky], scrub; expose progress as --q on the
              section (CSS centerpieces read it) + bespoke JS for the two
              comp centerpieces (cost-fall, climb). Count-ups are the existing
              [data-count] counters (interactions.ts), fired on view-enter.

   DOM contract (mirrored verbatim by the spine components):
     <section data-spine> … beats …
       <section data-build data-mult="2.6">
         <div data-build-sticky>
           <i data-build-bar></i>
           <div data-build-item>…</div> …
       <section data-proof data-mult="2.4" data-center="cost-fall|climb|…">
         <div data-proof-sticky> … centerpiece markup … </div>

   prefers-reduced-motion OR viewport <= 820px → no pins; render static end-state.
   All scrub motion is Y-axis; RTL only flips the 3D rotateY sign (cost-fall).
   ===================================================================== */
import { getST, clamp01 } from './motion';
import { themeMotion } from './theme';

const isRTL = (): boolean => document.documentElement.getAttribute('dir') === 'rtl';

/* html.beat-pinned while any Build/Proof pin is engaged — the cinema theme's
   letterbox bars key off it (pure CSS everywhere else). */
let pinnedCount = 0;
function setPinned(on: boolean): void {
  pinnedCount = Math.max(0, pinnedCount + (on ? 1 : -1));
  document.documentElement.classList.toggle('beat-pinned', pinnedCount > 0);
}
function resetPinned(): void {
  pinnedCount = 0;
  document.documentElement.classList.remove('beat-pinned');
}

/* ---------- BUILD: stepped item reveal ---------- */
function stepBuild(items: HTMLElement[], bar: HTMLElement | null, p: number): void {
  const n = items.length || 1;
  const active = Math.min(n - 1, Math.floor(p * n + 0.0001));
  items.forEach((el, i) => {
    const on = i <= active;
    el.style.opacity = on ? '1' : '0.22';
    el.style.transform = on ? 'translateY(0)' : 'translateY(8px)';
    el.dataset.state = i === active ? 'active' : on ? 'past' : 'future';
  });
  if (bar) bar.style.width = (((active + 1) / n) * 100).toFixed(0) + '%';
}
function buildStatic(items: HTMLElement[], bar: HTMLElement | null): void {
  items.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.dataset.state = 'past';
  });
  if (bar) bar.style.width = '100%';
}

/* ---------- PROOF: centerpiece updaters ---------- */
function fmtClimb(v: number): string {
  if (v >= 1e6) return '1M+';
  if (v >= 1e5) return Math.round(v / 1000) + 'K';
  if (v >= 1e3) return (v / 1000).toFixed(1) + 'K';
  return String(Math.round(v));
}
function makeProof(sec: HTMLElement): (q: number) => void {
  const type = sec.getAttribute('data-center') || '';
  const costs = Array.from(sec.querySelectorAll<HTMLElement>('[data-cost]'));
  const shot = sec.querySelector<HTMLElement>('[data-adshot]');
  const num = sec.querySelector<HTMLElement>('[data-climb-num]');
  const fill = sec.querySelector<HTMLElement>('[data-climb-fill]');
  const chips = Array.from(sec.querySelectorAll<HTMLElement>('[data-chip]'));
  return (q: number) => {
    sec.style.setProperty('--q', q.toFixed(4));
    if (type === 'cost-fall') {
      costs.forEach((el, i) => {
        const center = (i + 0.5) / (costs.length || 1);
        const k = Math.max(0, 1 - Math.abs(q - center) * 3.2);
        el.style.opacity = (0.3 + 0.7 * k).toFixed(2);
        el.style.transform = 'scale(' + (0.9 + 0.16 * k).toFixed(3) + ')';
      });
      if (shot) {
        const ease = 1 - Math.pow(1 - q, 2);
        const rx = (14 * (1 - ease)).toFixed(1);
        const ry = ((isRTL() ? 18 : -18) * (1 - ease)).toFixed(1);
        shot.style.transform = 'perspective(1200px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      }
    } else if (type === 'climb') {
      const v = 9200 + (1000000 - 9200) * Math.pow(q, 1.35);
      if (num) {
        num.textContent = fmtClimb(v);
        num.style.transform = 'translateY(' + ((1 - q) * 26).toFixed(1) + 'px)';
      }
      if (fill) fill.style.height = (8 + q * 92).toFixed(1) + '%';
      const vh = window.innerHeight;
      chips.forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-depth') || '1') || 1;
        el.style.transform = 'translateY(' + ((0.5 - q) * depth * vh * 0.7).toFixed(1) + 'px)';
        el.style.opacity = (0.45 + 0.55 * (1 - Math.min(1, Math.abs(0.5 - q) * 1.6))).toFixed(2);
      });
    }
    // all other centerpieces are pure-CSS off --q (already set above)
  };
}
function proofStatic(sec: HTMLElement): void {
  sec.style.setProperty('--q', '1');
  sec.querySelectorAll<HTMLElement>('[data-cost]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  const shot = sec.querySelector<HTMLElement>('[data-adshot]');
  if (shot) shot.style.transform = 'none';
  const num = sec.querySelector<HTMLElement>('[data-climb-num]');
  if (num) {
    num.textContent = '1M+';
    num.style.transform = 'none';
  }
  const fill = sec.querySelector<HTMLElement>('[data-climb-fill]');
  if (fill) fill.style.height = '100%';
  sec.querySelectorAll<HTMLElement>('[data-chip]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/** GSAP-free static end-state (mobile / reduced-motion). */
export function renderStoryStatic(): void {
  if (!document.querySelector('[data-spine]')) return;
  document.querySelectorAll<HTMLElement>('[data-build]').forEach((sec) => {
    const items = Array.from(sec.querySelectorAll<HTMLElement>('[data-build-item]'));
    const bar = sec.querySelector<HTMLElement>('[data-build-bar]');
    buildStatic(items, bar);
  });
  document.querySelectorAll<HTMLElement>('[data-proof]').forEach((sec) => proofStatic(sec));
}

/** Desktop: pin + scrub the Build and Proof beats (engine already loaded). */
export function initStoryScroll(): void {
  resetPinned();
  if (!document.querySelector('[data-spine]')) return;
  const ST = getST();
  if (!ST) return;

  // Phones get a longer pin per beat so the scrub doesn't race — the data-mult
  // distances were tuned for desktop viewport heights, which made each beat
  // complete in too little scroll on a short mobile viewport.
  const slow = window.innerWidth <= 820 ? 1.9 : 1;
  const scrub = themeMotion().scrub;

  document.querySelectorAll<HTMLElement>('[data-build]').forEach((sec) => {
    const sticky = sec.querySelector<HTMLElement>('[data-build-sticky]') || (sec.firstElementChild as HTMLElement);
    const items = Array.from(sec.querySelectorAll<HTMLElement>('[data-build-item]'));
    const bar = sec.querySelector<HTMLElement>('[data-build-bar]');
    const mult = parseFloat(sec.getAttribute('data-mult') || '2.6') || 2.6;
    const dist = (mult - 1) * window.innerHeight * slow;
    // Note: items render readable (CSS default) until the pin engages — the
    // scrubbed dimming applies via onUpdate, so the at-rest state stays AA.
    ST.create({
      trigger: sec,
      start: 'top top',
      end: '+=' + dist,
      pin: sticky,
      scrub,
      invalidateOnRefresh: true,
      onUpdate: (self: { progress: number }) => stepBuild(items, bar, clamp01(self.progress)),
      onToggle: (self: { isActive: boolean }) => setPinned(self.isActive),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-proof]').forEach((sec) => {
    const sticky = sec.querySelector<HTMLElement>('[data-proof-sticky]') || (sec.firstElementChild as HTMLElement);
    const update = makeProof(sec);
    const mult = parseFloat(sec.getAttribute('data-mult') || '2.4') || 2.4;
    const dist = (mult - 1) * window.innerHeight * slow;
    // centerpiece renders at its readable CSS default until the pin engages
    ST.create({
      trigger: sec,
      start: 'top top',
      end: '+=' + dist,
      pin: sticky,
      scrub,
      invalidateOnRefresh: true,
      onUpdate: (self: { progress: number }) => update(clamp01(self.progress)),
      onToggle: (self: { isActive: boolean }) => setPinned(self.isActive),
    });
  });
}
