/**
 * DEEP FIELD — the landing orchestrator.
 *
 * Native document scroll is the only source of progress. Every frame is a pure
 * evaluation of that one number, plus a clock that drives twinkle and drift and
 * nothing else: no animation queue, no played/unplayed flags, no one-way
 * transitions. Reverse scroll, a restored scroll position, a deep link,
 * Home/End and a fast swipe all land on exactly the state the same progress
 * produces going forward.
 *
 * The page is useful before this file runs and if it never runs: every
 * chapter's heading, its one line and its links are real HTML in document
 * order. This module upgrades that composition; it does not supply it.
 */
import * as THREE from 'three';
import type { ChapterSpec, Layout, Mode, Progress, Tier } from './types';
import { STAR_FLOOR, TIERS, TUNNEL } from './types';
import { CHAPTERS, DOLLY_TOTAL, SEGMENT_VH, evaluate } from './chapters';
import { createField, type Field } from './field';
import { imageFigure, loadImage, seatTarget, textFigure, type Figure, type Seat } from './targets';

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
  let overStage = '';
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
  const camera = new THREE.PerspectiveCamera(FOV[layout], viewportWidth / viewportHeight, 0.4, TUNNEL.depth + 24);

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
    if (layout === 'portrait') {
      // Portrait: the figure takes the block above the copy band.
      return {
        distance,
        width: width * 0.84,
        height: height * 0.36,
        offsetY: height * 0.19,
        jitter: 0.3,
      };
    }
    // Landscape: the copy owns one column, the figure takes the other side.
    return {
      distance,
      width: width * 0.42,
      height: height * 0.56,
      offsetX: (rtl ? -1 : 1) * width * 0.22,
      jitter: 0.32,
    };
  }

  /**
   * How many stars a figure should use, from the area it will actually cover.
   *
   * A fixed count is a different picture at every viewport: the same 12,000
   * points that read as a screen on the desktop read as a bright blob inside a
   * phone's much smaller seat. One point per SEAT_DENSITY square pixels holds
   * the look constant instead.
   */
  const SEAT_DENSITY = 18;
  /** Screen pixels per world unit at a seat's distance. */
  function pixelsPerUnit(distance: number): number {
    const frameHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    return viewportHeight / Math.max(1e-3, frameHeight);
  }
  function pointsFor(chapter: ChapterSpec, aspect?: number, density = SEAT_DENSITY): number {
    const seat = seatFor(chapter);
    const perUnit = pixelsPerUnit(seat.distance);
    // With a known aspect, measure the box the figure will ACTUALLY be fitted
    // into rather than the box it was offered: a name is a wide, shallow figure
    // inside a tall seat, and using the seat's own area over-counts it tenfold.
    const scale = aspect ? Math.min(seat.width / aspect, seat.height) : 0;
    const width = aspect ? scale * aspect : seat.width;
    const height = aspect ? scale : seat.height;
    const area = width * perUnit * height * perUnit;
    return Math.round(THREE.MathUtils.clamp(area / density, 600, field.recruits));
  }

  /** Re-seat every figure for the current viewport. A multiply, not a re-read. */
  function reseat() {
    const key = `${layout}:${viewportWidth}x${viewportHeight}`;
    if (key === seatKey) return;
    seatKey = key;
    for (const chapter of CHAPTERS) {
      const figure = figures.get(chapter.id);
      if (!figure) continue;
      seated.set(chapter.id, seatTarget(figure, seatFor(chapter), seated.get(chapter.id)));
    }
    loadedTarget = '';
  }

  const base = (root.dataset.base ?? '').replace(/\/$/, '');
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
        // decides how many stars this figure should have at THIS viewport. A
        // fixed share of the budget drew a readable name on a desktop and a
        // solid blue smear on a phone, where the same points land in a tenth of
        // the area. Glyph ink is a fraction of its own box, so it takes a
        // denser target than an image does.
        // Glyph ink is a fraction of its own box, so text takes a denser target
        // than an image — but not on a phone, where the name is a third of the
        // width and points land closer together than a stem is wide.
        const probe = textFigure(heroText, heroFont, 1, rtl);
        if (probe) {
          const density = layout === 'portrait' ? 9 : 5;
          figure = textFigure(heroText, heroFont, pointsFor(chapter, probe.aspect, density), rtl);
        }
      } else {
        const img = await loadImage(`${base}/img/sky/${chapter.target.src}.webp`);
        // 40 px per point, not 18: a constellation is a formation you can see
        // through. At 18 the same figure is a filled slab and the brightest
        // object on a page whose whole direction is restraint. Portrait needs a
        // denser target than that, because the same wireframe is a third of the
        // width there and at 40 it thins out into scattered dust — and the
        // owner reviews this on his phone.
        const density = layout === 'portrait' ? 24 : 40;
        if (img) figure = imageFigure(img, pointsFor(chapter, img.naturalWidth / img.naturalHeight, density));
      }
      if (!figure || disposed) continue;
      figures.set(chapter.id, figure);
      seated.set(chapter.id, seatTarget(figure, seatFor(chapter)));
      loadedTarget = '';
      // The document's own h1 gives up its ink only once the stars have
      // somewhere to fly to. If the figure never arrives, the name stays HTML.
      if (chapter.act === 'hero') root.dataset.heroFigure = 'true';
      request();
    }
    root.dataset.figures = String(figures.size);
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

    // Ambient motion. The twinkle and the drift are the only things a clock
    // touches; everything the story does is a pure reading of scroll.
    if (!pinned) {
      motionTime += dt;
      reveal = Math.min(1, reveal + dt / REVEAL_SECONDS);
    }
    field.setTime(motionTime);
    field.setReveal(reveal);
    // A constant slow creep keeps the sky alive when the visitor stops. It is a
    // separate term from the dolly, so stopping the scroll still stops the story.
    field.setDrift(motionTime * 0.85);

    // The dolly damps toward the value scroll asks for, and SNAPS once it is
    // within a hair of it, so a settled frame is exactly the pure evaluation.
    const wanted = state.dolly;
    if (pinned || Math.abs(wanted - dolly) < DOLLY_SNAP) dolly = wanted;
    else dolly += (wanted - dolly) * Math.min(1, DOLLY_DAMP * (dt * 60 || 1));
    field.setDolly(dolly);

    // Under reduced motion every morph sits at its held pose: the chapter is a
    // poster, not a paused animation.
    const morph = still ? (state.chapter.target ? 1 : 0) : state.morph;
    // The figure for this chapter, swapped only while nothing is assembled, so
    // a target arriving late can never pop a formation apart.
    const wantTarget = morph > 0.0005 ? state.chapter.id : '';
    if (wantTarget !== loadedTarget) {
      const next = wantTarget ? seated.get(wantTarget) ?? null : null;
      if (!wantTarget || next) {
        field.setTarget(next);
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

    // Micro-parallax: a rotation of a fraction of a degree, damped, and off at
    // every reading stop so a held figure is never nudged under the eye.
    const aim = state.resting ? 0 : 1;
    parallaxX += (pointerX * aim - parallaxX) * 0.05;
    parallaxY += (pointerY * aim - parallaxY) * 0.05;
    const rad = THREE.MathUtils.degToRad(PARALLAX_DEG);
    camera.rotation.set(-parallaxY * rad, -parallaxX * rad, 0, 'YXZ');

    if (viewportWidth !== innerWidth || Math.abs(viewportHeight - innerHeight) > BAR_TOLERANCE) {
      measure();
      camera.fov = FOV[layout];
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(viewportWidth, viewportHeight, false);
      reseat();
    }

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
      return {
        u: s.u,
        chapter: s.chapter.id,
        act: s.chapter.act,
        local: Number(s.local.toFixed(5)),
        morph: Number(s.morph.toFixed(5)),
        dolly: Number(s.dolly.toFixed(4)),
        appliedDolly: Number(dolly.toFixed(4)),
        narration: Number(s.narration.toFixed(4)),
        resting: s.resting,
        mode: s.mode,
        released: Number(released().toFixed(4)),
        stars: field.drawn,
        recruits: field.recruits,
        figures: figures.size,
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
     * The cost of a frame, in milliseconds: draw the CURRENT scene `frames`
     * times, then read one pixel back.
     *
     * The readback is the point. `gl.finish()` returns immediately in this
     * browser — the command buffer is serviced somewhere else — so timing a
     * draw plus a finish measures JS submission and nothing at all about the
     * GPU, which is why the first version of this probe reported 0.0 ms for
     * 80,000 points. A one-pixel `readPixels` is a real barrier: it cannot
     * return until every queued draw has actually happened.
     *
     * requestAnimationFrame cannot be used for this either: this harness runs
     * it free of vsync and caps it near 230 Hz, so anything under ~4 ms a frame
     * is invisible to it.
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
               morph: s.morph, resting: s.resting, narration: s.narration };
    },
    chapters: CHAPTERS.map((c) => ({ id: c.id, from: c.from, to: c.to, act: c.act })),
    dollyTotal: DOLLY_TOTAL,
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
