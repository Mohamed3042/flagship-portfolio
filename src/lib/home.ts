/* =====================================================================
   Home-page motion scenes (Claude Design parallax package).
   GSAP-driven film strip (desktop only) + a light scroll-computed section
   rail. On mobile / reduced-motion, renderHomeStatic() leaves the stacked
   CSS fallback and never touches GSAP.
   ===================================================================== */
import { getST } from './motion';
import { themeMotion } from './theme';

const RAIL_MIN = 1180;
let railBound = false;
let railEls: HTMLElement[] = [];

/* ---- Signature film strip: vertical scroll → horizontal translate ---- */
function initFilmStrip(): void {
  const sec = document.querySelector<HTMLElement>('[data-filmstrip]');
  if (!sec) return;
  const sticky = sec.querySelector<HTMLElement>('[data-filmstrip-sticky]');
  const track = sec.querySelector<HTMLElement>('[data-filmstrip-track]');
  const bar = sec.querySelector<HTMLElement>('[data-filmstrip-bar]');
  if (!sticky || !track) return;
  const ST = getST();
  if (!ST) return;

  const rtl = document.documentElement.getAttribute('dir') === 'rtl';
  const extra = Math.max(0, track.scrollWidth - window.innerWidth + 120);
  const dist = extra + window.innerHeight * 0.15;

  ST.create({
    trigger: sec,
    start: 'top top',
    end: '+=' + dist,
    pin: sticky,
    scrub: themeMotion().scrub,
    invalidateOnRefresh: true,
    onUpdate: (self: { progress: number }) => {
      const p = self.progress;
      // RTL mirrors the horizontal direction
      track.style.transform = 'translate3d(' + ((rtl ? 1 : -1) * p * extra).toFixed(1) + 'px,0,0)';
      if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    },
  });
}

/* ---- Section progress rail: active item brightens on scroll (desktop) ----
   Deterministic (live getBoundingClientRect), so it is pin-proof. */
function updateRail(): void {
  if (!railEls.length) return;
  const line = window.innerHeight * 0.4;
  let activeId: string | null = null;
  for (const el of railEls) {
    const r = el.getBoundingClientRect();
    if (r.top <= line && r.bottom >= line) {
      activeId = el.id;
      break;
    }
  }
  document.querySelectorAll<HTMLElement>('.railnav a[data-rail-item]').forEach((a) => {
    if (a.getAttribute('data-rail-item') === activeId) a.setAttribute('data-active', '');
    else a.removeAttribute('data-active');
  });
}
function initRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  if (!rail) {
    railEls = [];
    return;
  }
  if (window.innerWidth < RAIL_MIN) {
    rail.style.display = 'none';
    railEls = [];
    return;
  }
  rail.style.display = 'flex';
  railEls = Array.from(rail.querySelectorAll<HTMLElement>('[data-rail-item]'))
    .map((a) => document.getElementById(a.getAttribute('data-rail-item') || ''))
    .filter((el): el is HTMLElement => !!el);
  if (!railBound) {
    railBound = true;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            updateRail();
          });
        }
      },
      { passive: true },
    );
  }
  updateRail();
}

/** GSAP-free static state (mobile / reduced-motion): stacked grid via CSS. */
export function renderHomeStatic(): void {
  if (!document.querySelector('[data-home-motion]')) {
    railEls = [];
    return;
  }
  const track = document.querySelector<HTMLElement>('[data-filmstrip-track]');
  if (track) track.style.transform = 'none';
  const bar = document.querySelector<HTMLElement>('[data-filmstrip-bar]');
  if (bar) bar.style.width = '100%';
  initRail(); // hides itself below 1180px (incl. mobile)
}

/** Desktop: pin + scrub the film strip and run the section rail. */
export function initHomeMotion(): void {
  if (!document.querySelector('[data-home-motion]')) {
    railEls = [];
    return;
  }
  initFilmStrip();
  initRail();
}
