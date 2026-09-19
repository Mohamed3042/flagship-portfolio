/**
 * DEEP FIELD — the landing orchestrator.
 *
 * Native document scroll is the only source of progress. Every frame is a pure
 * evaluation of that one number, plus a clock that drives twinkle, drift and
 * the figure's breathing rotation and nothing else: no animation queue, no
 * played/unplayed flags, no one-way transitions. Reverse scroll, a restored
 * scroll position, a deep link, Home/End and a fast swipe all land on exactly
 * the state the same progress produces going forward.
 *
 * The page is useful before this file runs and if it never runs: every
 * chapter's heading, its one line and its links are real HTML in document
 * order. This module upgrades that composition; it does not supply it.
 */
import * as THREE from 'three';
import type { ChapterSpec, Figure, Layout, Mode, Progress, Seat, Tier } from './types';
import { BAND, STAR_FLOOR, TIERS, TUNNEL } from './types';
import { CHAPTERS, DOLLY_TOTAL, SEGMENT_VH, evaluate } from './chapters';
import { createField, type Field } from './field';
import {
  FIGURES, PORTAL_ASPECT, PORTAL_RIM_SHARE, drawnFigure, figureAspect, strokeLength,
  type FigureSpec,
} from './figures';
import { seatTarget, seatPoint, textFigure } from './targets';

/**
 * Height change (CSS px) below which a resize is treated as a mobile browser
 * bar sliding, not a layout change. Re-measuring on every bar movement would
 * rebuild the timeline mid-gesture.
 */
const BAR_TOLERANCE = 140;

/** How much of the remaining dolly error is taken each frame at 60fps. */
const DOLLY_DAMP = 0.08;
/** Below this the dolly snaps, so a settled frame is exactly the pure value. */
const DOLLY_SNAP = 0.002;
/** Seconds the opening takes to bring the whole field up. */
const REVEAL_SECONDS = 2.4;
/** Pointer micro-parallax, in degrees. The cap, not a starting point. */
const PARALLAX_DEG = 0.3;
/** The figure's breathing rotation. The cap, in degrees. */
const SPIN_DEG = 3;
/** Screen pixels between two stars seated along a stroke. */
const STROKE_SPACING = 2.2;

let teardown: (() => void) | null = null;

function pickTier(portrait: boolean): Tier {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return 'light';
  if ((nav.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency ?? 8) <= 3) return 'light';
  return portrait ? 'phone' : 'desktop';
}

export function initSignal(): void {
  stopSignal();

  const found = document.querySelector<HTMLElement>('[data-signal]');
  if (!found) return;

  const foundCanvas = found.querySelector<HTMLCanvasElement>('[data-signal-canvas]');
  const foundRunway = found.querySelector<HTMLElement>('[data-signal-runway]');
  const foundFrame = found.querySelector<HTMLElement>('[data-signal-frame]');
  const seek = found.querySelector<HTMLElement>('[data-signal-seek]');
  const panels = Array.from(found.querySelectorAll<HTMLElement>('[data-chapter]'));
  if (!foundCanvas || !foundRunway || !foundFrame || panels.length === 0) return;

  const root = found;
  const canvas = foundCanvas;
  const runway = foundRunway;
  const frame = foundFrame;

  const abort = new AbortController();
  const { signal } = abort;
  const rtl = document.documentElement.dir === 'rtl';

  // This site patches window.matchMedia so every reduced-motion query reports
  // "motion is fine" -- a deliberate owner decision for the story pages, where
  // the scroll animation IS the work. A landing this long has to honour the
  // real preference, so it reads the native query the layout stashed before
  // patching.
  const nativeMedia = (window as Window & { __mmNativeMatchMedia?: typeof window.matchMedia })
    .__mmNativeMatchMedia ?? window.matchMedia.bind(window);
  const reduced = nativeMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------- chapter DOM */

  /**
   * Move focus off a subtree that is about to become inert, and nowhere else.
   * We take focus ONLY from an element we are ourselves about to make
   * unreachable, and we hand it to the nearest thing that says where the
   * visitor now is.
   */
  function rescueFocus(from: HTMLElement, to: HTMLElement | null | undefined) {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !from.contains(active)) return;
    (to ?? seek?.querySelector<HTMLElement>('button:not([disabled])') ?? null)
      ?.focus({ preventScroll: true });
  }

  let shownChapter = '';
  function showChapter(id: string) {
    if (id === shownChapter) return;
    shownChapter = id;
    const arriving = panels.find((p) => p.dataset.chapter === id) ?? null;
    for (const panel of panels) {
      const active = panel.dataset.chapter === id;
      if (!active) rescueFocus(panel, arriving?.querySelector<HTMLElement>('.signal__line'));
      panel.toggleAttribute('inert', !active);
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      panel.dataset.active = active ? 'true' : 'false';
    }
  }

  /**
   * Whether the fixed header is currently over the stage. Read from the region
   * the header actually overlaps, so it is right at any runway length.
   */
  const HEADER = 56;
  // Seeded from what the parser already declared, so the first frame agrees with
  // the first paint instead of correcting it.
  let overStage = root.dataset.over ?? '';
  function updateHeader() {
    const bottom = root.getBoundingClientRect().bottom;
    const over = bottom > HEADER ? 'cinema' : 'released';
    if (over === overStage) return;
    overStage = over;
    root.dataset.over = over;
  }

  /**
   * Reveal and reading are two compositions, not one dimmed. The stylesheet
   * does the composing; this only names the state.
   */
  let modeOn: Mode | '' = '';
  function setMode(mode: Mode) {
    if (mode === modeOn) return;
    modeOn = mode;
    root.dataset.mode = mode;
  }

  showChapter(panels[0]?.dataset.chapter ?? '');

  /* ------------------------------------------------- progress measurement */

  const layoutFor = (w: number, h: number): Layout => (w < 820 || h > w ? 'portrait' : 'landscape');
  let layout: Layout = layoutFor(innerWidth, innerHeight);
  let runwayTop = 0;
  let runwayRange = 1;
  let viewportWidth = 0;
  let viewportHeight = 0;

  function measure() {
    const rect = runway.getBoundingClientRect();
    runwayTop = rect.top + scrollY;
    runwayRange = Math.max(1, runway.offsetHeight - frame.offsetHeight);
    viewportWidth = innerWidth;
    viewportHeight = innerHeight;
    layout = layoutFor(innerWidth, innerHeight);
    runway.style.setProperty('--signal-vh', String(SEGMENT_VH[layout]));
    // The hairline rides the header's lower edge. Measured, never assumed.
    const bar = document.querySelector('.nav');
    const height = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
    root.style.setProperty('--signal-nav', `${height || 54}px`);
    // The nebula haze is anchored to the band the stars are drawn from. In CSS
    // pixels the band's angle is exactly its tilt, because the frustum's aspect
    // and the viewport's aspect are the same number and cancel; it is published
    // here so the stylesheet and the harness read the shipped value.
    root.style.setProperty('--signal-band', `${BAND.tilt}deg`);
  }

  function progress(): Progress {
    return THREE.MathUtils.clamp((scrollY - runwayTop) / runwayRange, 0, 1);
  }

  /**
   * How far past the end of the runway the visitor has scrolled, 0..1. The fade
   * STARTS before the runway ends, so by the time the archive scrolls in the
   * field is already gone. A function of scroll position alone.
   */
  function released(): number {
    const past = scrollY - (runwayTop + runwayRange - viewportHeight * 0.5);
    return THREE.MathUtils.clamp(past / Math.max(1, viewportHeight * 0.7), 0, 1);
  }

  /** Every chapter has a real address that resolves to that chapter's progress. */
  function addressedProgress(): Progress | null {
    const id = decodeURIComponent(location.hash).replace(/^#signal-/, '');
    if (!id || id.startsWith('#')) return null;
    const chapter = CHAPTERS.find((c) => c.id === id);
    if (!chapter) return null;
    return midpointOf(chapter);
  }

  function goToAddress() {
    const u = addressedProgress();
    if (u === null) return;
    scrollTo({ top: runwayTop + runwayRange * u, behavior: 'instant' as ScrollBehavior });
    request();
  }

  /** The settled middle of a chapter: its reading stop, or its centre. */
  function midpointOf(chapter: ChapterSpec) {
    if (chapter.reading) return (chapter.reading.from + chapter.reading.to) / 2;
    return chapter.from + (chapter.to - chapter.from) * 0.55;
  }

  function seekTo(index: number) {
    const bounded = Math.min(Math.max(index, 0), CHAPTERS.length - 1);
    scrollTo({ top: runwayTop + runwayRange * midpointOf(CHAPTERS[bounded]), behavior: 'instant' as ScrollBehavior });
    request();
    const panel = panels.find((p) => p.dataset.chapter === CHAPTERS[bounded].id);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel?.querySelector<HTMLElement>('.signal__line')?.focus({ preventScroll: true });
    }));
  }

  const seekPrev = seek?.querySelector<HTMLButtonElement>('[data-seek=prev]') ?? null;
  const seekNext = seek?.querySelector<HTMLButtonElement>('[data-seek=next]') ?? null;
  const seekWork = seek?.querySelector<HTMLAnchorElement>('[data-seek=work]') ?? null;

  function currentIndex() {
    return CHAPTERS.findIndex((c) => c.id === shownChapter);
  }

  seekPrev?.addEventListener('click', () => seekTo(currentIndex() - 1), { signal });
  seekNext?.addEventListener('click', () => seekTo(currentIndex() + 1), { signal });
  seekWork?.addEventListener('click', () => {
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('#public-title')?.focus({ preventScroll: true });
    });
  }, { signal });

  function updateSeek(index: number) {
    if (seekPrev) seekPrev.disabled = index <= 0;
    if (seekNext) seekNext.disabled = index >= CHAPTERS.length - 1;
  }

  /* ------------------------------------------------------------- the portals */

  /**
   * A world's own key frame, held inside the aperture its stars open.
   *
   * The plate is HTML, not a texture: the frame is an image the browser decodes
   * and colour-manages, and putting it through a WebGL upload would cost a
   * texture per world and lose the browser's own lazy loading. What the renderer
   * owns is where it goes — the ring's projected centre and the ring's projected
   * height, read with the same camera in the same frame, so the picture cannot
   * drift out of its own aperture when the pointer moves the world a third of a
   * degree.
   *
   * THE PLATE TRAP: an image whose opacity is keyed straight to a scroll value
   * appears the instant the value rises, decoded or not, and the aperture opens
   * onto a blank rectangle that fills in a beat later. `data-decoded` is the
   * gate. It is set from `img.decode()`, which resolves only when the frame is
   * ready to paint, and the stylesheet keeps the blend at exactly 0 until then.
   */
  interface Portal { host: HTMLElement; img: HTMLImageElement; aspect: number; box: string }
  const portals = new Map<string, Portal>();
  for (const panel of panels) {
    const host = panel.querySelector<HTMLElement>('[data-signal-portal]');
    const img = host?.querySelector('img') ?? null;
    if (!host || !img) continue;
    const id = panel.dataset.chapter ?? '';
    portals.set(id, { host, img, aspect: Number(host.dataset.aspect) || 1.777, box: '' });
    const ready = () => {
      host.dataset.decoded = 'true';
      request();
    };
    // decode() on an image that is already complete resolves immediately; on one
    // that fails it rejects, and a portal that cannot decode simply never opens.
    img.decode().then(ready, () => {
      if (img.complete && img.naturalWidth > 0) ready();
    });
  }

  let portalStep = -1;
  function setPortalBlend(value: number) {
    const step = Math.round(THREE.MathUtils.clamp(value, 0, 1) * 100);
    if (step === portalStep) return;
    portalStep = step;
    root.style.setProperty('--signal-portal', (step / 100).toFixed(2));
  }

  const portalCentre = new THREE.Vector3();
  const portalEdge = new THREE.Vector3();

  /** Put the plate inside the ring, from where the camera says the ring is. */
  function placePortal(chapter: ChapterSpec, blend: number) {
    const portal = portals.get(chapter.id);
    if (!portal) return;
    if (blend <= 0) {
      portal.host.style.opacity = '0';
      return;
    }
    portal.host.style.opacity = '';
    const seat = seatFor(chapter);
    const figure = figures.get(chapter.id);
    const ringHeight = fittedHeight(seat, figure ? figure.aspect : 1.12);
    const cx = seat.offsetX ?? 0;
    const cy = seat.offsetY ?? 0;
    // Project the ring's centre and its own top edge: the difference IS the
    // ring's height on screen, under whatever rotation the camera is carrying.
    portalCentre.set(cx, cy, camera.position.z - seat.distance).project(camera);
    portalEdge.set(cx, cy + ringHeight / 2, camera.position.z - seat.distance).project(camera);
    const px = (portalCentre.x * 0.5 + 0.5) * viewportWidth;
    const py = (-portalCentre.y * 0.5 + 0.5) * viewportHeight;
    const halfPx = Math.abs((-portalEdge.y * 0.5 + 0.5) * viewportHeight - py);
    // ROUND 4. The plate IS the aperture now. It was the largest rectangle of
    // the frame's own ratio that fitted inside the ellipse with air around it,
    // which on a 405 px ring made a 16:9 world into a 327x184 postage stamp
    // floating in a hoop. A world is seen THROUGH the hole: the plate takes
    // the rim's whole box, the stylesheet clips it to the ellipse, and the
    // frame covers it. Nothing of the picture reaches past the rim, and
    // nothing of the rim's inside is empty.
    //
    // The rim is NOT the figure's box: the figure is fitted to its full extent
    // and the iris ticks stand outside the rim, so the box is a tick-length
    // larger. PORTAL_RIM_SHARE is that ratio, exported by the figure itself so
    // the two cannot drift apart.
    const height = halfPx * 2 * PORTAL_RIM_SHARE;
    const width = height * PORTAL_ASPECT;
    const box = `${width.toFixed(1)}x${height.toFixed(1)}`;
    if (box !== portal.box) {
      portal.box = box;
      portal.host.style.width = `${width.toFixed(1)}px`;
      portal.host.style.height = `${height.toFixed(1)}px`;
    }
    portal.host.style.transform = `translate(${(px - width / 2).toFixed(1)}px, ${(py - height / 2).toFixed(1)}px)`;
  }

  /* ------------------------- the static path: reduced motion / no WebGL */

  function staticPath(reason: 'reduced' | 'fallback') {
    root.dataset.graphics = reason === 'reduced' ? 'static' : 'fallback';
    root.dataset.mode = 'reading';
    for (const panel of panels) {
      panel.removeAttribute('inert');
      panel.setAttribute('aria-hidden', 'false');
      panel.dataset.active = 'true';
    }
    seek?.setAttribute('hidden', '');
    updateHeader();
    addEventListener('scroll', updateHeader, { passive: true, signal });
    addEventListener('resize', updateHeader, { passive: true, signal });
  }

  measure();

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
  } catch {
    staticPath('fallback');
    teardown = () => abort.abort();
    return;
  }

  const tier = pickTier(layout === 'portrait');
  const budget = TIERS[tier];
  root.dataset.tier = tier;

  // Declaring the live context is what switches the stylesheet into the sticky
  // cinema layout, and that changes the runway's height. Measure AFTER it.
  root.dataset.graphics = 'webgl';
  setMode('reading');
  measure();

  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, budget.pixelRatio));
  renderer.setSize(viewportWidth, viewportHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const FOV: Record<Layout, number> = { landscape: 44, portrait: 62 };
  const camera = new THREE.PerspectiveCamera(FOV[layout], viewportWidth / viewportHeight, 0.4, TUNNEL.far + 24);

  const field: Field = createField(budget, tier);
  scene.add(field.object);

  // The eye never leaves the origin. The dolly is expressed in the field — a
  // star's depth is `mod(home - dolly)` — which is the same picture as moving
  // the camera and is what keeps every constellation seat camera-relative.
  camera.position.set(0, 0, 0);
  field.setCameraZ(0);

  /* ---------------------------------------------------------- the figures */

  /**
   * One figure per chapter that has a target, sampled once from the page's own
   * content and then only re-seated. A chapter whose figure has not arrived
   * keeps the field: nothing half-assembled is ever shown.
   */
  const figures = new Map<string, Figure>();
  const seated = new Map<string, Float32Array>();
  const linkBuffers = new Map<string, Float32Array>();
  let seatKey = '';
  let loadedTarget = '';

  function seatFor(chapter: ChapterSpec): Seat {
    const distance = layout === 'portrait' ? 8.4 : 9.2;
    const height = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const width = height * (viewportWidth / Math.max(1, viewportHeight));
    if (chapter.act === 'hero') {
      return {
        distance,
        // Portrait keeps a gutter: at 0.88 a long name ran to within ten pixels
        // of the screen edge, which reads as a crop rather than a composition.
        width: width * (layout === 'portrait' ? 0.8 : 0.72),
        height: height * (layout === 'portrait' ? 0.2 : 0.26),
        offsetY: height * (layout === 'portrait' ? 0.12 : 0.1),
        // Tiny, and it has to be: a figure this wide SHEARS in perspective, and
        // half a unit of depth at nine units of distance smeared both ends of
        // the name while its centre stayed sharp.
        jitter: 0.09,
      };
    }
    if (chapter.side === 'centre') {
      // The star the last beat ends on sits BEHIND the words, a little high.
      return {
        distance,
        width: width * 0.4,
        height: height * 0.42,
        offsetY: height * (layout === 'portrait' ? 0.15 : 0.11),
        jitter: 1.1,
      };
    }
    // The tools are twelve labelled stars, and twelve HTML chips need height to
    // stand apart in. The figure is authored as a tall ladder for the same
    // reason; this is the other half of that decision.
    const tall = chapter.act === 'tools';
    if (layout === 'portrait') {
      // Portrait: the figure takes the block above the copy band. A portal is
      // given the extra width because its ring is bound by it: at 390 px a ring
      // at 45% of the viewport HEIGHT would be 1.02 screens across, so what the
      // phone can show is a width answer and the round reports the share it
      // actually reaches rather than the desktop number.
      const portal = !!chapter.portal;
      return {
        distance,
        width: width * (portal ? 0.9 : 0.8),
        height: height * (tall ? 0.52 : 0.4),
        offsetY: height * (tall ? 0.13 : 0.17),
        jitter: portal ? 0.9 : 1.2,
      };
    }
    if (tall) {
      const away = chapter.side === 'start' ? 1 : -1;
      return {
        distance,
        width: width * 0.42,
        height: height * 0.62,
        offsetX: (rtl ? -away : away) * width * 0.235,
        jitter: 0.9,
      };
    }
    // Landscape: the copy owns one column and the figure takes the other, and
    // they swap sides every chapter so the eye has somewhere new to go.
    // The seat is sized for the NEAREST point the jitter can put a star at, not
    // for the nominal plane: a figure a unit and a half deep projects up to 17%
    // wider than its own fit, and the first build of this composition hung the
    // Public constellation's leftmost anchor forty pixels off the screen.
    const away = chapter.side === 'start' ? 1 : -1;
    // ROUND 4: a portal is the one figure the visitor is meant to look INTO,
    // and the director asked for half the screen. The width answer has to move
    // with it — at 0.4 of the frustum a 4:3 window would bind the ring on width
    // and hand back 47% — so the portal's column is wide enough that the height
    // is what decides the ring at every ordinary desktop shape.
    const aperture = !!chapter.portal;
    return {
      distance,
      width: width * (aperture ? 0.46 : 0.4),
      height: height * (aperture ? 0.525 : 0.45),
      offsetX: (rtl ? -away : away) * width * 0.245,
      jitter: aperture ? 1.05 : 1.15,
    };
  }

  /** Screen pixels per world unit at a seat's distance. */
  function pixelsPerUnit(distance: number): number {
    const frameHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    return viewportHeight / Math.max(1e-3, frameHeight);
  }

  /** The world height a figure of this aspect gets inside its seat. */
  function fittedHeight(seat: Seat, aspect: number): number {
    return Math.min(seat.width / Math.max(aspect, 1e-4), seat.height);
  }

  /**
   * How many stars a glyph figure should use, from the area it will cover. A
   * fixed count is a different picture at every viewport: the same points that
   * read as a name on the desktop read as a smear inside a phone's smaller seat.
   */
  function textPoints(chapter: ChapterSpec, aspect: number, density: number): number {
    const seat = seatFor(chapter);
    const perUnit = pixelsPerUnit(seat.distance);
    const scale = fittedHeight(seat, aspect);
    const area = scale * aspect * perUnit * scale * perUnit;
    return Math.round(THREE.MathUtils.clamp(area / density, 600, field.recruits));
  }

  /**
   * How many stars a drawn figure should use: one per STROKE_SPACING pixels of
   * stroke, measured on the figure's own strokes.
   *
   * The brief asks for two to five thousand. That is right for a figure with a
   * lot of line in it — the truss, the dieline — and wrong for a simple one: the
   * magnifier over the folder has about 2,500 px of stroke at this size, and two
   * thousand stars on it is one star every 1.3 px, which is a wire. Spacing is
   * the constant that holds, and the counts it produces are in the report.
   */
  function strokePoints(spec: FigureSpec, chapter: ChapterSpec): number {
    // A figure that is a point rather than a drawing states its own count, at a
    // 900px-tall viewport, and it scales from there like everything else.
    if (spec.points) return Math.round(spec.points * THREE.MathUtils.clamp(viewportHeight / 900, 0.6, 1.5));
    const seat = seatFor(chapter);
    const px = strokeLength(spec) * fittedHeight(seat, figureAspect(spec)) * pixelsPerUnit(seat.distance);
    return Math.round(THREE.MathUtils.clamp(px / STROKE_SPACING, 900, Math.min(5000, field.recruits)));
  }

  /** The hairline endpoints for a seated figure, as pairs of world points. */
  function linksFor(figure: Figure, seat: Seat, out?: Float32Array): Float32Array {
    const n = figure.links.length;
    const dest = out && out.length >= n * 6 ? out : new Float32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const [a, b] = figure.links[i];
      const pa = seatPoint(figure, seat, a);
      const pb = seatPoint(figure, seat, b);
      dest.set(pa, i * 6);
      dest.set(pb, i * 6 + 3);
    }
    return dest;
  }

  function place(chapter: ChapterSpec, figure: Figure) {
    const seat = seatFor(chapter);
    figures.set(chapter.id, figure);
    seated.set(chapter.id, seatTarget(figure, seat, seated.get(chapter.id)));
    linkBuffers.set(chapter.id, linksFor(figure, seat, linkBuffers.get(chapter.id)));
  }

  /** Re-seat every figure for the current viewport. A multiply, not a re-read. */
  function reseat() {
    const key = `${layout}:${viewportWidth}x${viewportHeight}`;
    if (key === seatKey) return;
    seatKey = key;
    labelWidths.clear();
    labelHeights.clear();
    for (const chapter of CHAPTERS) {
      const figure = figures.get(chapter.id);
      if (figure) place(chapter, figure);
    }
    loadedTarget = '';
    foldKey = -1;
  }

  const heroText = root.dataset.name ?? '';
  const heroFont = root.dataset.font ?? (rtl ? '300 190px "Cairo Variable"' : '300 190px "Inter Variable"');

  async function buildFigures() {
    // Fonts first: a glyph figure sampled before the webfont lands is the
    // fallback face, and it never corrects itself.
    try { await document.fonts?.ready; } catch { /* no font manager: carry on */ }
    for (const chapter of CHAPTERS) {
      if (disposed || !chapter.target) continue;
      let figure: Figure | null = null;
      if (chapter.target.kind === 'text') {
        // A name is a constellation, not a filled letterform. Sampled twice: the
        // first pass is only there to learn the glyphs' aspect, which is what
        // decides how many stars this figure should have at THIS viewport.
        // Glyph ink is a fraction of its own box, so text takes a denser target
        // than a drawn figure — but not on a phone, where the name is a third of
        // the width and points land closer together than a stem is wide.
        const probe = textFigure(heroText, heroFont, 1, rtl);
        if (probe) {
          const density = layout === 'portrait' ? 9 : 5;
          figure = textFigure(heroText, heroFont, textPoints(chapter, probe.aspect, density), rtl);
        }
      } else {
        const spec = FIGURES[chapter.target.figure];
        if (spec) figure = drawnFigure(spec, strokePoints(spec, chapter));
      }
      if (!figure || disposed) continue;
      place(chapter, figure);
      loadedTarget = '';
      // The document's own h1 gives up its ink only once the stars have
      // somewhere to fly to. If the figure never arrives, the name stays HTML.
      if (chapter.act === 'hero') root.dataset.heroFigure = 'true';
      request();
    }
    root.dataset.figures = String(figures.size);
  }

  /* ------------------------------------------------------- the fold */

  // The one figure that opens while it is read is re-sampled as it folds. The
  // stroke shares are decided on the closed pose and never move, so a star
  // keeps its own edge all the way open; only the geometry changes.
  const folding = CHAPTERS.find((c) => c.folds) ?? null;
  const foldSpec = folding?.target?.kind === 'drawn' ? FIGURES[folding.target.figure] : null;
  let foldKey = -1;
  let foldCount = 0;
  function applyFold(value: number) {
    if (!folding || !foldSpec) return;
    // Quantised, so a slow scroll does not re-sample on every frame for a
    // change nobody could see.
    const step = Math.round(THREE.MathUtils.clamp(value, 0, 1) * 96);
    if (step === foldKey) return;
    foldKey = step;
    if (!foldCount) foldCount = strokePoints(foldSpec, folding);
    const figure = drawnFigure(foldSpec, foldCount, step / 96);
    if (figure) {
      place(folding, figure);
      if (loadedTarget === folding.id) field.setTarget(seated.get(folding.id) ?? null);
    }
  }

  /* --------------------------------------------------- the anchored labels */

  /**
   * Two chapters hang labels now — the public repositories and the tools — so
   * the host is per chapter rather than per page. One shared host would have
   * put twelve tool chips inside the repositories' beat.
   */
  interface LabelHost { host: HTMLElement; nodes: Map<string, HTMLElement>; copy: HTMLElement | null }
  const labelHosts = new Map<string, LabelHost>();
  for (const panel of panels) {
    const host = panel.querySelector<HTMLElement>('[data-signal-labels]');
    if (!host) continue;
    const nodes = new Map<string, HTMLElement>();
    for (const el of Array.from(host.querySelectorAll<HTMLElement>('[data-label-key]'))) {
      nodes.set(el.dataset.labelKey ?? '', el);
    }
    labelHosts.set(panel.dataset.chapter ?? '',
      { host, nodes, copy: panel.querySelector<HTMLElement>('[data-chapter-copy]') });
  }
  const projected: { key: string; x: number; y: number; side: 'left' | 'right' }[] = [];
  const scratch = new THREE.Vector3();
  /** Chip widths, measured once: a label has to know its own size to choose a
   *  side, and reading offsetWidth every frame would lay the page out every
   *  frame. Cleared whenever the viewport changes. */
  const labelWidths = new Map<string, number>();
  const labelHeights = new Map<string, number>();
  /** The chips of the current frame, so they can be de-collided as a set. */
  const placed: { el: HTMLElement; key: string; px: number; py: number; left: number;
                  side: 'left' | 'right'; chip: number; tall: number; dy: number }[] = [];

  /**
   * Put each label where the camera says its star is.
   *
   * Registration belongs to the camera: the label is projected with the same
   * matrices, in the same frame, AFTER the parallax rotation has been applied —
   * an earlier round of this project learned that the hard way by registering
   * against a stale matrix and shipping a four-pixel drift.
   */
  function placeLabels(chapter: ChapterSpec, morph: number, spin: number, pivot: THREE.Vector3) {
    projected.length = 0;
    const found = labelHosts.get(chapter.id);
    // Whatever chapter the visitor left keeps its chips only until the next
    // frame; clearing every other host here is one pass over at most two.
    for (const [id, entry] of labelHosts) {
      if (id === chapter.id) continue;
      entry.host.dataset.on = 'false';
      entry.host.style.setProperty('--signal-labels', '0');
    }
    if (!found) return;
    const { host: labelHost, nodes: labelNodes, copy: copyBlock } = found;
    const figure = figures.get(chapter.id);
    const on = !!figure?.labels?.length && morph > 0.55;
    labelHost.dataset.on = on ? 'true' : 'false';
    if (!on || !figure) {
      labelHost.style.setProperty('--signal-labels', '0');
      return;
    }
    labelHost.style.setProperty('--signal-labels',
      THREE.MathUtils.clamp((morph - 0.6) / 0.25, 0, 1).toFixed(3));
    const seat = seatFor(chapter);
    const cs = Math.cos(spin);
    const sn = Math.sin(spin);
    /* The band a chip may stand in.
     *
     * A chip was free to run anywhere between the two gutters, and on the
     * tools beat — figure on one side, display type on the other — the longest
     * of the twelve ran straight under the headline. The words are not going
     * to move, so the chips get a wall: in landscape, where the copy takes its
     * own column, the band stops a clear margin short of it. In portrait the
     * copy is BELOW the figure and there is nothing to avoid, so the band is
     * the frame. */
    let bandMin = 14;
    let bandMax = viewportWidth - 14;
    if (layout === 'landscape' && copyBlock && chapter.side !== 'centre') {
      const copyRect = copyBlock.getBoundingClientRect();
      if (copyRect.width > 0) {
        // Which side of the copy the figure sits on is the seat's own offset,
        // already mirrored for RTL by seatFor.
        if ((seat.offsetX ?? 0) < 0) bandMax = Math.min(bandMax, copyRect.left - 20);
        else bandMin = Math.max(bandMin, copyRect.right + 20);
      }
    }
    placed.length = 0;
    for (const label of figure.labels ?? []) {
      const [x, y, z] = seatPoint(figure, seat, label.index);
      // The same rotation the shader applies, about the same pivot.
      const rx = x - pivot.x;
      const rz = z - pivot.z;
      scratch.set(pivot.x + rx * cs + rz * sn, y, pivot.z - rx * sn + rz * cs);
      scratch.z = camera.position.z - scratch.z;
      scratch.project(camera);
      const px = (scratch.x * 0.5 + 0.5) * viewportWidth;
      const py = (-scratch.y * 0.5 + 0.5) * viewportHeight;
      // Which side the chip hangs on is decided by whether it FITS, measured,
      // not by a threshold: at 390px a label on the right of centre ran off the
      // screen with a threshold that was right at 1440.
      const el = labelNodes.get(label.key);
      let chip = labelWidths.get(label.key) ?? 0;
      let tall = labelHeights.get(label.key) ?? 0;
      if ((!chip || !tall) && el?.firstElementChild instanceof HTMLElement) {
        chip = el.firstElementChild.offsetWidth;
        tall = el.firstElementChild.offsetHeight;
        if (chip) labelWidths.set(label.key, chip);
        if (tall) labelHeights.set(label.key, tall);
      }
      const side: 'left' | 'right' = px + 18 + chip > bandMax ? 'right' : 'left';
      // ...and then it is clamped inside the band, because at 390px a chip can
      // overrun BOTH edges and a side alone cannot fix that.
      const want = side === 'left' ? px + 18 : px - 18 - chip;
      const left = Math.min(Math.max(want, bandMin), Math.max(bandMin, bandMax - chip));
      projected.push({ key: label.key, x: px, y: py, side });
      if (el) placed.push({ el, key: label.key, px, py, left, side, chip, tall, dy: 0 });
    }

    /* Chips that overlap are chips nobody can read.
     *
     * Twelve of them on a phone's figure block is about thirty pixels a rung,
     * and a chip is taller than that, so some of them HAVE to move. What moves
     * is the chip, never the anchor: the anchor element is the point the camera
     * projected, the registration check reads its rect, and a de-collision that
     * moved it would be a drift the page had introduced on purpose. The chip
     * slides down its own leader instead.
     *
     * One pass down, one pass back up. The first pushes each chip clear of the
     * one above it; the second pulls the whole stack back inside the frame when
     * the first ran it off the bottom.
     */
    const GAP = 3;
    const rows = [...placed].sort((a, b) => (a.py - a.tall / 2) - (b.py - b.tall / 2));
    const overlapping = (a: typeof placed[number], b: typeof placed[number]) =>
      a.left < b.left + b.chip && a.left + a.chip > b.left;
    let floor = 10;
    for (const row of rows) {
      let top = row.py - row.tall / 2;
      const above = rows.filter((r) => r !== row && r.py < row.py && overlapping(r, row));
      const bound = above.length ? Math.max(floor, ...above.map((r) => r.py + r.dy + r.tall / 2 + GAP)) : floor;
      if (top < bound) top = bound;
      row.dy = top - (row.py - row.tall / 2);
    }
    const bottom = rows.length
      ? Math.max(...rows.map((r) => r.py + r.dy + r.tall / 2)) : 0;
    const spill = bottom - (viewportHeight - 10);
    if (spill > 0) for (const row of rows) row.dy -= spill;

    for (const row of placed) {
      const dx = row.left - row.px;
      row.el.dataset.side = row.side;
      row.el.style.setProperty('--label-x', `${dx.toFixed(1)}px`);
      row.el.style.setProperty('--label-y', `${row.dy.toFixed(1)}px`);
      // The leader: from the star the camera projected to the edge of the chip
      // wherever the de-collision pass put it. Both numbers come from the SAME
      // frame that placed the chip, so the line cannot lag the thing it points
      // at. The end point is the chip's near edge — its left when the chip
      // hangs to the right of the star, its right when it hangs to the left —
      // so the hairline stops at the caption instead of running under it.
      const endX = row.side === 'left' ? dx : dx + row.chip;
      const endY = row.dy;
      row.el.style.setProperty('--leader-len', `${Math.hypot(endX, endY).toFixed(1)}px`);
      row.el.style.setProperty('--leader-angle', `${Math.atan2(endY, endX).toFixed(4)}rad`);
      row.el.style.transform = `translate(${row.px.toFixed(1)}px, ${row.py.toFixed(1)}px)`;
    }
  }

  /* -------------------------------------------------------- pointer parallax */

  let pointerX = 0;
  let pointerY = 0;
  let parallaxX = 0;
  let parallaxY = 0;
  if (tier === 'desktop') {
    addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      pointerX = (event.clientX / viewportWidth) * 2 - 1;
      pointerY = (event.clientY / viewportHeight) * 2 - 1;
    }, { passive: true, signal });
  }

  /* --------------------------------------------------------------- the frame */

  let raf = 0;
  let disposed = false;
  let contextLost = false;
  let motionTime = 0;
  let lastTick = 0;
  let lastGone = -1;
  let dolly = 0;
  let reveal = 0;
  const still = reduced.matches;
  let pinned = still;
  const pivot = new THREE.Vector3();

  /* ------------------------------------------------- the adaptive governor */

  const samples: number[] = [];
  let drawn = budget.stars;
  let lastGovern = 0;
  const FLOOR = STAR_FLOOR[tier];
  /**
   * The frame budget, in milliseconds: 55 fps on a desktop, 30 in portrait.
   *
   * The governor reads the INTERVAL between frames, not a frame rate. On a real
   * device that loop is locked to the display and the two are the same thing;
   * in a headless harness it is not, which is why the budget is stated in
   * milliseconds everywhere and no rate is claimed from it.
   */
  const BUDGET_MS = layout === 'portrait' ? 1000 / 30 : 1000 / 55;
  let frameMs = 0;

  function govern(now: number, dt: number) {
    if (dt <= 0) return;
    samples.push(dt * 1000);
    if (samples.length > 90) samples.shift();
    if (samples.length < 45 || now - lastGovern < 1200) return;
    lastGovern = now;
    const sorted = [...samples].sort((a, b) => a - b);
    frameMs = sorted[Math.floor(sorted.length * 0.8)]; // the 80th percentile, not the mean
    root.dataset.frameMs = frameMs.toFixed(1);
    if (frameMs > BUDGET_MS * 1.08 && drawn > FLOOR) {
      drawn = Math.max(FLOOR, Math.round(drawn * 0.78));
    } else if (frameMs < BUDGET_MS * 0.8 && drawn < budget.stars) {
      drawn = Math.min(budget.stars, Math.round(drawn * 1.12));
    } else {
      return;
    }
    field.setCount(drawn);
    root.dataset.stars = String(field.drawn);
    samples.length = 0;
  }

  let narrationStep = -1;
  function setNarration(value: number) {
    const step = Math.round(THREE.MathUtils.clamp(value, 0, 1) * 25);
    if (step === narrationStep) return;
    narrationStep = step;
    root.style.setProperty('--signal-narration', (step / 25).toFixed(2));
  }

  /**
   * Progress, published for the stylesheet. The route's progress HAIRLINE is the
   * site's own `.progress` bar, re-toned for this page — a second one would be
   * two bars saying the same thing, and the shared one already sits above the
   * fixed header where nothing inside an isolated stage can reach. This value
   * drives the scroll hint, which has to go the moment the visitor starts.
   */
  let hairStep = -1;
  function setHairline(u: number) {
    const step = Math.round(THREE.MathUtils.clamp(u, 0, 1) * 200);
    if (step === hairStep) return;
    hairStep = step;
    root.style.setProperty('--signal-progress', (step / 200).toFixed(3));
  }

  let restState = -1;
  function setRest(value: number) {
    if (value === restState) return;
    restState = value;
    root.style.setProperty('--signal-rest', String(value));
  }

  let partStep = -1;
  function setPart(value: number) {
    const step = Math.round(THREE.MathUtils.clamp(value, 0, 1) * 100);
    if (step === partStep) return;
    partStep = step;
    root.style.setProperty('--signal-part', (step / 100).toFixed(2));
  }

  function request() {
    if (!raf && !disposed && !contextLost && !document.hidden) raf = requestAnimationFrame(render);
  }

  function render(now: number) {
    raf = 0;
    if (disposed || contextLost || document.hidden) return;

    const dt = lastTick ? Math.min(now - lastTick, 50) / 1000 : 0;
    lastTick = now;
    govern(now, dt);

    const u = progress();
    const state = evaluate(u, layout);
    const index = CHAPTERS.indexOf(state.chapter);

    showChapter(state.chapter.id);
    updateSeek(index);
    updateHeader();
    setMode(state.mode);
    setHairline(u);
    root.dataset.signalChapter = state.chapter.id;

    // Ambient motion. The twinkle, the drift and the figure's breathing are the
    // only things a clock touches; everything the story does is a pure reading
    // of scroll.
    if (!pinned) {
      motionTime += dt;
      reveal = Math.min(1, reveal + dt / REVEAL_SECONDS);
    }
    field.setTime(motionTime);
    field.setReveal(reveal);
    // A constant slow creep keeps the sky alive when the visitor stops. It is a
    // separate term from the dolly, so stopping the scroll still stops the story.
    field.setDrift(motionTime * 0.35);

    // The dolly damps toward the value scroll asks for, and SNAPS once it is
    // within a hair of it, so a settled frame is exactly the pure evaluation.
    const wanted = state.dolly;
    dolly = wanted;
    field.setDolly(dolly);
    field.setCameraZ(-dolly);
    field.setBend(state.bend);
    camera.position.z = -dolly;

    // Under reduced motion every morph sits at its held pose: the chapter is a
    // poster, not a paused animation.
    const morph = still ? (state.chapter.target ? 1 : 0) : state.morph;
    const part = still ? (state.chapter.effect?.kind === 'part' ? 1 : 0) : state.part;
    const breath = still ? (state.chapter.effect?.kind === 'breath' ? 1 : 0) : state.breath;
    const fold = still ? (state.chapter.folds ? 0.5 : 0) : state.fold;
    if (state.chapter.folds && morph > 0.01) applyFold(fold);
    field.setPart(part);
    field.setBreath(breath);
    setPart(part);

    // The figure breathes at rest: three degrees at the most, from the clock,
    // and nothing at all when the visitor asked for less motion.
    const seat = seatFor(state.chapter);
    pivot.set(seat.offsetX ?? 0, seat.offsetY ?? 0, seat.distance);
    const spin = still ? 0 : THREE.MathUtils.degToRad(SPIN_DEG) * Math.sin(motionTime * 0.21) * morph;
    field.setSpin(spin, [pivot.x, pivot.y, pivot.z]);

    // The figure for this chapter, swapped only while nothing is assembled, so
    // a target arriving late can never pop a formation apart.
    const wantTarget = morph > 0.0005 ? state.chapter.id : '';
    if (wantTarget !== loadedTarget) {
      const next = wantTarget ? seated.get(wantTarget) ?? null : null;
      if (!wantTarget || next) {
        field.setTarget(next);
        const buffer = wantTarget ? linkBuffers.get(wantTarget) ?? null : null;
        field.setLinks(buffer, buffer ? (figures.get(wantTarget)?.links.length ?? 0) : 0);
        loadedTarget = wantTarget;
      }
    }
    field.setMorph(loadedTarget === state.chapter.id ? morph : 0);

    const gone = released();
    field.setOpacity(1 - gone);
    root.style.setProperty('--signal-released', gone.toFixed(3));
    // The whole canvas fades, not only its contents; `visibility` is only
    // switched once there is nothing left to see.
    if (gone !== lastGone) {
      lastGone = gone;
      canvas.style.opacity = gone > 0 ? (1 - gone).toFixed(3) : '';
      canvas.style.visibility = gone > 0.995 ? 'hidden' : '';
    }

    setNarration(state.narration);
    setRest(state.resting ? 1 : 0);
    // The plate behind the rim. It fades with the page as well as with its own
    // beat, so the last thing to leave the screen is never a photograph.
    const portalBlend = (still ? (state.chapter.portal ? 1 : 0) : state.portal) * (1 - gone);
    setPortalBlend(portalBlend);

    // Micro-parallax: a rotation of a fraction of a degree, damped, and off at
    // every reading stop so a held figure is never nudged under the eye.
    const aim = state.resting ? 0 : 1;
    parallaxX += (pointerX * aim - parallaxX) * 0.05;
    parallaxY += (pointerY * aim - parallaxY) * 0.05;
    const rad = THREE.MathUtils.degToRad(PARALLAX_DEG);
    camera.rotation.set(0, -state.bend * 22, 0, 'YXZ');

    if (viewportWidth !== innerWidth || Math.abs(viewportHeight - innerHeight) > BAR_TOLERANCE) {
      measure();
      camera.fov = FOV[layout];
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(viewportWidth, viewportHeight, false);
      reseat();
    }

    camera.updateMatrixWorld();
    placeLabels(state.chapter, loadedTarget === state.chapter.id ? morph : 0, spin, pivot);
    placePortal(state.chapter, portalBlend);

    renderer.render(scene, camera);
    request();
  }

  /* --------------------------------------------------------------- events */

  // Reduced motion is a different composition, not a switched-off one: the
  // field holds still, every morph sits at its held pose, and the page reads as
  // a poster. It still gets the real stars.
  if (still) {
    field.setTwinkle(false);
    reveal = 1;
  }
  root.dataset.stars = String(field.drawn);
  const onReducedChange = () => initSignal();
  reduced.addEventListener('change', onReducedChange, { signal });

  addEventListener('scroll', request, { passive: true, signal });
  addEventListener('resize', () => { measure(); reseat(); request(); }, { passive: true, signal });
  addEventListener('hashchange', goToAddress, { signal });
  document.addEventListener('visibilitychange', () => {
    lastTick = 0;
    request();
  }, { signal });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    contextLost = true;
    staticPath('fallback');
  }, { signal });
  canvas.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    root.dataset.graphics = 'webgl';
    request();
  }, { signal });

  reseat();
  void buildFigures();
  goToAddress();
  request();

  /**
   * The test and capture surface. Reading it observes what the renderer already
   * computed; `settle` pins the two clock-driven terms and snaps the dolly, so
   * a headless capture reads the settled, pure state instead of a transient.
   */
  (window as Window & { __deepField?: unknown }).__deepField = {
    settle(time = 6) {
      pinned = true;
      reveal = 1;
      motionTime = time;
      dolly = evaluate(progress(), layout).dolly;
      request();
    },
    resume() {
      pinned = still;
      request();
    },
    state() {
      const s = evaluate(progress(), layout);
      const figure = figures.get(s.chapter.id);
      return {
        u: s.u,
        chapter: s.chapter.id,
        act: s.chapter.act,
        side: s.chapter.side,
        local: Number(s.local.toFixed(5)),
        morph: Number(s.morph.toFixed(5)),
        fold: Number(s.fold.toFixed(5)),
        portal: Number(s.portal.toFixed(5)),
        part: Number(s.part.toFixed(5)),
        breath: Number(s.breath.toFixed(5)),
        dolly: Number(s.dolly.toFixed(4)),
        appliedDolly: Number(dolly.toFixed(4)),
        bend: s.bend,
        narration: Number(s.narration.toFixed(4)),
        resting: s.resting,
        mode: s.mode,
        released: Number(released().toFixed(4)),
        stars: field.drawn,
        // The tier's cap and the governor's floor, so a harness can check that
        // the count is inside its tier without a second copy of the table.
        starBudget: budget.stars,
        starFloor: FLOOR,
        visible: field.visible(camera, dolly, s.part, s.breath),
        recruits: field.recruits,
        figures: figures.size,
        figurePoints: figure ? figure.count : 0,
        figureLinks: figure ? figure.links.length : 0,
        tier,
        layout,
        frameIntervalMs: Number(frameMs.toFixed(2)),
        reveal: Number(reveal.toFixed(3)),
      };
    },
    frameIntervalMs() {
      return frameMs;
    },
    /**
     * The figure's box on screen, in CSS pixels, from the seated points the
     * shader is actually reading. The composition brief asks for a figure at
     * about 45% of the viewport height; this is how that claim is checked.
     */
    figureBox(id?: string) {
      const chapter = CHAPTERS.find((c) => c.id === (id ?? shownChapter));
      const figure = chapter ? figures.get(chapter.id) : null;
      if (!chapter || !figure) return null;
      const seat = seatFor(chapter);
      const v = new THREE.Vector3();
      let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
      for (let i = 0; i < figure.count; i += Math.max(1, Math.floor(figure.count / 900))) {
        const [x, y, z] = seatPoint(figure, seat, i);
        v.set(x, y, camera.position.z - z).project(camera);
        const px = (v.x * 0.5 + 0.5) * viewportWidth;
        const py = (-v.y * 0.5 + 0.5) * viewportHeight;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }
      return {
        chapter: chapter.id,
        x: Math.round(minX), y: Math.round(minY),
        width: Math.round(maxX - minX), height: Math.round(maxY - minY),
        heightShare: Number(((maxY - minY) / viewportHeight).toFixed(3)),
        points: figure.count,
        links: figure.links.length,
      };
    },
    /**
     * The plate a portal holds, as the page has it right now: where it is, how
     * big it is, whether the browser has DECODED it, and the blend the
     * stylesheet is actually applying. The old plate trap — a picture whose
     * opacity rises before it can be painted — is checkable from this alone.
     */
    portalPlate(id?: string) {
      const chapter = CHAPTERS.find((c) => c.id === (id ?? shownChapter));
      const portal = chapter ? portals.get(chapter.id) : null;
      if (!chapter || !portal) return null;
      const rect = portal.host.getBoundingClientRect();
      const style = getComputedStyle(portal.host);
      const figure = figures.get(chapter.id);
      const seat = seatFor(chapter);
      const ringPx = fittedHeight(seat, figure ? figure.aspect : 1.12) * pixelsPerUnit(seat.distance);
      return {
        chapter: chapter.id,
        decoded: portal.host.dataset.decoded === 'true',
        complete: portal.img.complete,
        naturalWidth: portal.img.naturalWidth,
        currentSrc: portal.img.currentSrc || portal.img.src,
        opacity: Number(style.opacity),
        blend: Number(getComputedStyle(root).getPropertyValue('--signal-portal')) || 0,
        x: Math.round(rect.left), y: Math.round(rect.top),
        width: Math.round(rect.width), height: Math.round(rect.height),
        aspect: Number((rect.width / Math.max(1, rect.height)).toFixed(3)),
        ringHeight: Math.round(ringPx),
        ringShare: Number((ringPx / viewportHeight).toFixed(3)),
      };
    },
    /** Where the camera says each labelled anchor is, in CSS pixels. */
    labels() {
      return projected.map((p) => ({ ...p, x: Number(p.x.toFixed(2)), y: Number(p.y.toFixed(2)) }));
    },
    /**
     * The band's geometry in CSS pixels, so a haze measurement reads the shipped
     * number instead of a guess. The stripe runs through the centre of the frame
     * at the band's own tilt — in pixels the frustum's aspect and the viewport's
     * aspect are the same number and cancel, which is why this is just the tilt.
     */
    band() {
      const rad = (BAND.tilt * Math.PI) / 180;
      return {
        tiltDeg: BAND.tilt,
        // Screen space: y grows downward, so the band rises to the right.
        along: [Math.cos(rad), -Math.sin(rad)],
        normal: [Math.sin(rad), Math.cos(rad)],
        centre: [viewportWidth / 2, viewportHeight / 2],
        width: BAND.width,
        floor: BAND.floor,
      };
    },
    /**
     * The cost of a frame, in milliseconds: draw the CURRENT scene `frames`
     * times, then read one pixel back.
     *
     * The readback is the point. `gl.finish()` returns immediately in this
     * browser — the command buffer is serviced somewhere else — so timing a
     * draw plus a finish measures JS submission and nothing at all about the
     * GPU, which is why the first version of this probe reported 0.0 ms for
     * 80,000 points. A one-pixel `readPixels` is a real barrier: it cannot
     * return until every queued draw has actually happened.
     */
    cost(frames = 60) {
      const gl = renderer.getContext();
      const pixel = new Uint8Array(4);
      // One warm draw and one readback, so shader compilation and the first
      // buffer upload are not counted as the cost of a steady frame.
      renderer.render(scene, camera);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      const t0 = performance.now();
      for (let i = 0; i < frames; i++) renderer.render(scene, camera);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      const total = performance.now() - t0;
      return { frames, totalMs: total, perFrameMs: total / Math.max(1, frames) };
    },
    /**
     * The pure evaluator, exposed. A capture that needs "the frame where this
     * morph is 40% formed" can find it without scrolling to two hundred
     * candidate positions, and it reads the SHIPPED easing rather than a second
     * copy of it in the capture script.
     */
    at(u: number) {
      const s = evaluate(u, layout);
      return { u: s.u, chapter: s.chapter.id, act: s.chapter.act, local: s.local,
               morph: s.morph, part: s.part, breath: s.breath, fold: s.fold,
               portal: s.portal, resting: s.resting, narration: s.narration,
               dolly: s.dolly, bend: s.bend };
    },
    chapters: CHAPTERS.map((c) => ({ id: c.id, from: c.from, to: c.to, act: c.act, side: c.side,
                                     beatClass: c.beatClass,
                                     // The middle of this chapter's reading stop: where the
                                     // figure is held and the copy is meant to be read.
                                     hold: midpointOf(c),
                                     portal: !!c.portal,
                                     // The four points of this beat's window, as
                                     // OVERALL progress, so a harness measures
                                     // the shipped window instead of keeping a
                                     // second copy of its fractions.
                                     window: c.morph ? {
                                       in0: c.from + (c.to - c.from) * c.morph.in0,
                                       in1: c.from + (c.to - c.from) * c.morph.in1,
                                       out0: c.from + (c.to - c.from) * c.morph.out0,
                                       out1: c.from + (c.to - c.from) * c.morph.out1,
                                     } : null,
                                     figure: c.target?.kind === 'drawn' ? c.target.figure
                                       : c.target?.kind === 'text' ? 'name' : null })),
    dollyTotal: DOLLY_TOTAL,
    segmentVh: SEGMENT_VH,
  };

  teardown = () => {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    abort.abort();
    field.dispose();
    renderer.dispose();
    delete (window as Window & { __deepField?: unknown }).__deepField;
  };
}

export function stopSignal(): void {
  teardown?.();
  teardown = null;
}
