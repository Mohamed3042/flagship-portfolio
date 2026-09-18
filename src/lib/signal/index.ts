/**
 * "From Signal to Systems" — the landing orchestrator.
 *
 * Native document scroll is the only source of progress. Every frame is a pure
 * evaluation of that one number: no animation queue, no played/unplayed flags,
 * no one-way transitions. Reverse scroll, a restored scroll position, a deep
 * link, Home/End and a fast swipe all land on exactly the state the same
 * progress produces going forward.
 *
 * The page is useful before this file runs and if it never runs: the headline,
 * every chapter's copy, its screenshot and its links are real HTML in document
 * order. This module upgrades that composition; it does not
 * supply it.
 */
import * as THREE from 'three';
import type { ArtifactId, ArtifactStage, CameraPose, Layout, Progress, ShapeId, Tier } from './types';
import { TIERS } from './types';
import { RIM, buildShapes } from './shapes';
import { projectBounds, projectSurface } from './artifacts';
import { applyPose, blendPose, frameHeightAt, microParallax } from './camera';
import { CHAPTERS, SEGMENT_VH, evaluate } from './chapters';
import { STAGES } from './artifacts';
import { createCloud, createStarfield } from './particles';

/** A stage that has been told about the camera, so it can report its handoff rect. */
type BoundStage = ArtifactStage & {
  setCamera?: (camera: THREE.PerspectiveCamera, size: { width: number; height: number }) => void;
};

/**
 * Height change (CSS px) below which a resize is treated as a mobile browser bar
 * sliding, not a layout change. Re-measuring on every bar movement would rebuild
 * the timeline mid-gesture; the plan forbids that.
 */
const BAR_TOLERANCE = 140;

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
  const intro = found.querySelector<HTMLElement>('.signal__intro');
  const seek = found.querySelector<HTMLElement>('[data-signal-seek]');
  const panels = Array.from(found.querySelectorAll<HTMLElement>('[data-chapter]'));
  if (!foundCanvas || !foundRunway || !foundFrame || panels.length === 0) return;

  // Re-bound as non-null so the closures below keep the narrowing.
  const root = found;
  const canvas = foundCanvas;
  const runway = foundRunway;
  const frame = foundFrame;

  const abort = new AbortController();
  const { signal } = abort;

  // This site patches window.matchMedia so every reduced-motion query reports
  // "motion is fine" -- a deliberate owner decision for the story pages, where
  // the scroll animation IS the work. The landing sequence is long enough that
  // it has to honour the real preference, so it reads the native query the
  // layout stashed before patching, exactly as the showroom engine does.
  const nativeMedia = (window as Window & { __mmNativeMatchMedia?: typeof window.matchMedia })
    .__mmNativeMatchMedia ?? window.matchMedia.bind(window);
  const reduced = nativeMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------- chapter DOM */

  // The visible chapter is a function of progress, so this is a plain setter and
  // not a transition. `inert` is what keeps a hidden panel's links out of the tab
  // order; visibility alone would leave focusable targets behind.
  /**
   * Move focus off a subtree that is about to become inert, and nowhere else.
   *
   * This is the whole rule for focus here: we take focus ONLY from an element we
   * are ourselves about to make unreachable, and we hand it to the nearest thing
   * that says where the visitor now is. Anything wider than that is focus theft
   * during an ordinary scroll.
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
   * The first viewport leaves the tab order once it has left the screen.
   *
   * This is the Tab rewind. From the middle of the film the next element in
   * document order was the hero's own button, sitting nine viewports above; the
   * browser scrolled it into view to focus it, and the film wound back to the
   * start. The intro is genuinely off screen by then — the same condition that
   * takes the inactive chapters out of the tab order takes it out too. Scroll
   * back up and it returns. No Tab is cancelled, no tabindex is positive, and
   * nothing is trapped.
   */
  /**
   * Whether the fixed header is currently over the stage.
   *
   * The stage is black in all six themes, and the header is not: in the light
   * theme a silver bar floated on it for the whole runway. This is read from the
   * region the header actually overlaps — not a timer, not a hard-coded document
   * height — so it is right at any runway length and on the static path too.
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

  let introInert = false;
  function updateIntro(progress: number) {
    const away = progress > 0.015;
    if (away === introInert || !intro) return;
    introInert = away;
    if (away) rescueFocus(intro, null);
    intro.toggleAttribute('inert', away);
  }
  showChapter(panels[0]?.dataset.chapter ?? '');

  /* ------------------------------------------------- progress measurement */

  const layoutFor = (w: number, h: number): Layout => (w < 820 || h > w ? 'portrait' : 'landscape');
  let layout: Layout = layoutFor(innerWidth, innerHeight);
  let runwayTop = 0;
  let runwayRange = 1;
  let viewportWidth = 0;
  let viewportHeight = 0;
  /**
   * The share of the first viewport reserved for the horizon, read from the
   * stylesheet's own --signal-sky. The protected region and the camera framing
   * are then the same declaration: change the reserved band and the camera
   * re-frames onto it, with no second number to keep in step.
   */
  let sky = 0.27;

  /**
   * Height of the fixed header, in CSS pixels. Measured, never assumed, and
   * declared here rather than beside freeBox because measure() runs during
   * setup — a `let` further down the module would still be in its dead zone.
   */
  let headerBand = 0;

  function measure() {
    const rect = runway.getBoundingClientRect();
    runwayTop = rect.top + scrollY;
    runwayRange = Math.max(1, runway.offsetHeight - frame.offsetHeight);
    viewportWidth = innerWidth;
    viewportHeight = innerHeight;
    layout = layoutFor(innerWidth, innerHeight);
    const declared = Number.parseFloat(getComputedStyle(root).getPropertyValue('--signal-sky'));
    sky = Number.isFinite(declared) ? THREE.MathUtils.clamp(declared, 0.1, 0.6) : 0.27;
    runway.style.setProperty('--signal-vh', String(SEGMENT_VH[layout]));
    // The header is fixed and opaque, so the top of the viewport is not free
    // space: anything the fit places there is behind it. Read rather than
    // assumed, because the bar's height is a clamp on the shared layout.
    const bar = document.querySelector('.nav');
    headerBand = bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
  }

  function progress(): Progress {
    return THREE.MathUtils.clamp((scrollY - runwayTop) / runwayRange, 0, 1);
  }

  /**
   * How far past the end of the runway the visitor has scrolled, over one half
   * viewport, 0..1. The sticky frame un-sticks at 0 and the real project rows
   * arrive over the same distance, so this is where the scene hands them the
   * screen: at 1 nothing of the cinema is drawn, and what the visitor is reading
   * is not competing with a constellation behind it.
   *
   * Like everything else here it is a function of scroll position alone, so it
   * reconstructs identically backwards.
   */
  function released(): number {
    // The fade STARTS before the runway ends. Beginning it at the end meant the
    // constellation was still drawn over the next section's headline and controls
    // for several hundred pixels, and then the canvas switched off in one frame.
    // By the time the work scrolls in, the scene is already gone.
    const past = scrollY - (runwayTop + runwayRange - viewportHeight * 0.55);
    return THREE.MathUtils.clamp(past / Math.max(1, viewportHeight * 0.75), 0, 1);
  }

  /**
   * Direct addressing. Every chapter has a real address -- #signal-horizon
   * through #signal-archive -- that resolves to that chapter's own progress.
   * Native anchor navigation would land on the sticky frame instead of the
   * chapter, so the address is resolved here and the browser's history does the
   * rest: Back restores the position it left.
   */
  function addressedProgress(): Progress | null {
    const id = decodeURIComponent(location.hash).replace(/^#signal-/, '');
    if (!id || id.startsWith('#')) return null;
    const chapter = CHAPTERS.find((c) => c.id === id);
    if (!chapter) return null;
    // Mid-chapter, so the address lands on the chapter's settled state rather
    // than on the transition into it.
    return chapter.from + (chapter.to - chapter.from) * 0.55;
  }

  function goToAddress() {
    const u = addressedProgress();
    if (u === null) return;
    scrollTo({ top: runwayTop + runwayRange * u, behavior: 'instant' as ScrollBehavior });
    request();
  }

  /** Progress at the settled middle of a chapter, the same value an address resolves to. */
  const midpoint = (index: number) => {
    const chapter = CHAPTERS[Math.min(Math.max(index, 0), CHAPTERS.length - 1)];
    return chapter.from + (chapter.to - chapter.from) * 0.55;
  };

  /**
   * A seek scrolls, then puts focus on what the visitor arrived at. The focus
   * call is `preventScroll`, because the destination is inside a sticky frame
   * that is already on screen: letting the browser scroll to it as well is the
   * second, unasked-for jump.
   */
  function seekTo(index: number) {
    const bounded = Math.min(Math.max(index, 0), CHAPTERS.length - 1);
    scrollTo({ top: runwayTop + runwayRange * midpoint(bounded), behavior: 'instant' as ScrollBehavior });
    request();
    // The destination panel is still inert until the next frame evaluates the new
    // progress, and focusing inside an inert subtree does nothing at all. Wait for
    // the frame that makes it the live chapter, then land on it.
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
  // A real link, so it works with the renderer off. The handler only adds the
  // focus destination the browser does not give an in-page jump.
  seekWork?.addEventListener('click', () => {
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('#public-title')?.focus({ preventScroll: true });
    });
  }, { signal });

  function updateSeek(index: number) {
    if (seekPrev) seekPrev.disabled = index <= 0;
    if (seekNext) seekNext.disabled = index >= CHAPTERS.length - 1;
  }

  /* --------------------------------- the static path: reduced motion / no WebGL */

  // A deliberate stillness, not a failure page. The stylesheet lays every chapter
  // out in document order; all this does is declare which path is in use and stop.
  function staticPath(reason: 'reduced' | 'fallback') {
    root.dataset.graphics = reason === 'reduced' ? 'static' : 'fallback';
    for (const panel of panels) {
      panel.removeAttribute('inert');
      panel.setAttribute('aria-hidden', 'false');
      panel.dataset.active = 'true';
    }
    // Nothing is sticky on this path, so there is no chapter to seek between and
    // nothing above the fold to take out of the tab order. The document is the
    // navigation.
    intro?.removeAttribute('inert');
    seek?.setAttribute('hidden', '');
    // The still composition is the same black stage under the same fixed header,
    // so the seam is the same seam. It just has no render loop to drive it.
    updateHeader();
    addEventListener('scroll', updateHeader, { passive: true, signal });
    addEventListener('resize', updateHeader, { passive: true, signal });
  }

  if (reduced.matches) {
    staticPath('reduced');
    const onChange = () => initSignal();
    reduced.addEventListener('change', onChange, { signal });
    teardown = () => abort.abort();
    return;
  }

  /* ---------------------------------------------------------------- renderer */

  measure();
  const tier = pickTier(layoutFor(innerWidth, innerHeight) === 'portrait');
  const budget = TIERS[tier];
  root.dataset.tier = tier;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: tier === 'desktop',
      powerPreference: tier === 'desktop' ? 'high-performance' : 'low-power',
    });
  } catch {
    staticPath('fallback');
    teardown = () => abort.abort();
    return;
  }

  // Declaring the live context is what switches the stylesheet into the sticky
  // cinema layout, and that changes the runway's height. Measure AFTER it, or
  // every progress reading is taken against the document layout the page had
  // before the scene existed.
  root.dataset.graphics = 'webgl';
  measure();

  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, budget.pixelRatio));
  renderer.setSize(viewportWidth, viewportHeight, false);
  renderer.setClearColor(0x05070a, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, viewportWidth / viewportHeight, 0.1, 140);

  // Light direction is shared by every chapter: one world, one light.
  scene.add(new THREE.HemisphereLight(0xc9d8e6, 0x05070a, 1.15));
  const key = new THREE.DirectionalLight(0xf0f3f6, 2.2);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x70b8ff, 1.5);
  scene.add(rim);
  rim.position.set(-6, 2, -5);

  const nodeCount = Number(root.dataset.nodes ?? '0') || CHAPTERS.length;
  const shapes = buildShapes(budget.morph, {
    random: seeded(0x5f2d1c),
    aspect: viewportWidth / Math.max(1, viewportHeight),
    nodeCount,
  });

  const cloud = createCloud(shapes, budget, tier);
  scene.add(cloud.points);

  const starfield = createStarfield(budget);
  scene.add(starfield.points);

  // The immense dark mass the opening rim is the limb of. Radius, centre AND
  // plane are the aperture shape's own, read from it rather than restated: at a
  // different z the sphere's limb overshoots the arc and the bright rim is drawn
  // INSIDE the silhouette instead of along its edge, which is the whole image.
  // The small bias sits the body just behind the lit points so they survive it.
  const massGeometry = new THREE.SphereGeometry(RIM.radius, 64, 40);
  // Lit, not painted. An unlit fill is one value everywhere, which is why the
  // body read as a flat navy semicircle with a bright line on top: a silhouette
  // with a sticker for a horizon. Standing it in the SAME light as everything
  // else gives it a terminator — the surface falls away from the limb because the
  // normals turn away from the key, which is what a limb is. Very dark albedo, so
  // what arrives is separation, not a grey planet.
  const massMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b1119, roughness: .97, metalness: 0, transparent: true, opacity: 1,
  });
  const mass = new THREE.Mesh(massGeometry, massMaterial);
  mass.position.set(0, RIM.centreY, RIM.z - 0.16);
  mass.renderOrder = -1;
  scene.add(mass);

  /* ------------------------------------------------------- artifact stages */

  // Only the current chapter's stage is resident. Approaching a chapter builds
  // its stage; leaving it two chapters behind disposes it, so the scene never
  // holds every World and every mechanism at once.
  const resident = new Map<ArtifactId, BoundStage>();

  function stageFor(id: ArtifactId): BoundStage {
    let stage = resident.get(id);
    if (!stage) {
      stage = STAGES[id]({
        worldInterior: root.dataset.worldInterior || null,
        arrival: parseList(root.dataset.arrival),
      }) as BoundStage;
      stage.setCamera?.(camera, { width: viewportWidth, height: viewportHeight });
      scene.add(stage.object);
      resident.set(id, stage);
    }
    return stage;
  }

  function releaseExcept(keep: Set<ArtifactId>) {
    for (const [id, stage] of resident) {
      if (keep.has(id)) continue;
      scene.remove(stage.object);
      stage.dispose();
      resident.delete(id);
    }
  }

  function neighbourhood(index: number): Set<ArtifactId> {
    const keep = new Set<ArtifactId>();
    for (let i = index - 1; i <= index + 1; i++) {
      const artifact = CHAPTERS[i]?.artifact;
      if (artifact) keep.add(artifact);
    }
    return keep;
  }

  /* ------------------------------------------------------------- composition */

  /**
   * The authored camera frames the subject centred. The page does not want it
   * centred: the copy column owns the band before the registration datum, so
   * the subject is dollied to the far side of it and pulled back until it sits
   * in its own volume instead of overrunning the frame. Dollying position and
   * look target together keeps the view direction, so this is a camera move,
   * not a distortion. It mirrors with reading direction.
   *
   * The opening does not use that rule. It is framed on the rim's real geometry
   * against a protected region, because what has to be true there is a statement
   * about the picture -- the copy and both actions are readable, and the lit edge
   * of an immense mass crosses below them -- and a fraction of a frame height is
   * not that statement. See OPENING.
   */
  const rtl = document.documentElement.dir === 'rtl';

  /**
   * The opening composition, stated as the picture rather than as offsets.
   *
   *  pull   distance to the limb, as a multiple of the authored one. Landscape
   *         pushes in until the arc nearly spans the frame; portrait pulls back,
   *         because a frame 0.46 as wide sees a third of that arc and a third of
   *         this arc is a straight line. Far enough back the same limb curves
   *         again and still runs off both edges.
   *  apex   where the top of the arc sits horizontally, as a fraction of the
   *         viewport width, mirrored with reading direction.
   *
   * Where it sits VERTICALLY is not a constant here: it is 1 - --signal-sky,
   * the band the stylesheet reserved, so the mass fills exactly the strip no
   * copy, action or preview is laid into and the rim rides its upper edge.
   */
  const OPENING: Record<Layout, { pull: number; apex: number }> = {
    landscape: { pull: 0.52, apex: 0.44 },
    portrait: { pull: 1.24, apex: 0.5 },
  };

  const RIGHT = new THREE.Vector3(), UP = new THREE.Vector3(), FWD = new THREE.Vector3();
  const TO = new THREE.Vector3();

  /**
   * Translate the camera, without turning it, until `target` projects to
   * `(ndcX, ndcY)`. A translation perpendicular to the view axis leaves the
   * target's depth alone, so the shift it needs on screen is exactly its shift
   * within the frustum plane it already sits in: this is the solution, not an
   * approach to one, and it re-solves itself at any viewport.
   */
  function frameOn(
    pose: CameraPose, target: readonly [number, number, number], ndcX: number, ndcY: number,
  ): CameraPose {
    FWD.set(
      pose.look[0] - pose.position[0], pose.look[1] - pose.position[1], pose.look[2] - pose.position[2],
    );
    if (FWD.lengthSq() < 1e-12) return pose;
    FWD.normalize();
    RIGHT.crossVectors(FWD, camera.up);
    if (RIGHT.lengthSq() < 1e-8) return pose;
    RIGHT.normalize();
    UP.crossVectors(RIGHT, FWD).normalize();

    TO.set(
      target[0] - pose.position[0], target[1] - pose.position[1], target[2] - pose.position[2],
    );
    const depth = TO.dot(FWD);
    if (depth <= 0.05) return pose;
    const halfHeight = depth * Math.tan(THREE.MathUtils.degToRad(pose.fov) / 2);
    const halfWidth = halfHeight * (viewportWidth / Math.max(1, viewportHeight));
    const shiftX = TO.dot(RIGHT) - ndcX * halfWidth;
    const shiftY = TO.dot(UP) - ndcY * halfHeight;
    const out: CameraPose = { position: [0, 0, 0], look: [0, 0, 0], fov: pose.fov };
    for (let i = 0; i < 3; i++) {
      const delta = RIGHT.getComponent(i) * shiftX + UP.getComponent(i) * shiftY;
      out.position[i] = pose.position[i] + delta;
      out.look[i] = pose.look[i] + delta;
    }
    return out;
  }

  function compose(pose: CameraPose, chapterId: string, amount: number): CameraPose {
    if (amount <= 0.0005) return pose;
    const framed = chapterId === 'horizon' ? composeOpening(pose) : composeChapter(pose);
    return amount >= 0.9995 ? framed : blendPose(pose, framed, amount);
  }

  function composeOpening(pose: CameraPose): CameraPose {
    const spec = OPENING[layout];
    const [lx, ly, lz] = pose.look;
    const dx = pose.position[0] - lx, dy = pose.position[1] - ly, dz = pose.position[2] - lz;
    const dollied: CameraPose = {
      position: [lx + dx * spec.pull, ly + dy * spec.pull, lz + dz * spec.pull],
      look: [lx, ly, lz],
      fov: pose.fov,
    };
    const apex = rtl ? 1 - spec.apex : spec.apex;
    return frameOn(dollied, RIM.crest, apex * 2 - 1, sky * 2 - 1);
  }

  function composeChapter(pose: CameraPose): CameraPose {
    const [px, py, pz] = pose.position;
    const [lx, ly, lz] = pose.look;
    const dx = px - lx, dy = py - ly, dz = pz - lz;
    const pull = layout === 'portrait' ? 1.16 : 1.26;
    const position: [number, number, number] = [lx + dx * pull, ly + dy * pull, lz + dz * pull];
    const look: [number, number, number] = [lx, ly, lz];

    const distance = Math.hypot(dx, dy, dz) * pull;
    if (layout === 'landscape') {
      const frameWidth = frameHeightAt(pose, distance) * (viewportWidth / Math.max(1, viewportHeight));
      const shift = (rtl ? 1 : -1) * frameWidth * 0.17;
      position[0] += shift;
      look[0] += shift;
    } else {
      // Portrait: lift the subject clear of the copy band along the bottom.
      // Lowering the camera is what raises a fixed world point in the frame --
      // the previous sign moved the artifact DOWN, into the band it was written
      // to clear, which is why every portrait reading stop had its object behind
      // its own paragraph.
      const lift = frameHeightAt(pose, distance) * 0.22;
      position[1] -= lift;
      look[1] -= lift;
    }
    return { position, look, fov: pose.fov };
  }

  /* -------------------------------------------------------- pointer parallax */

  // Tiny, optional, and driven to zero at every alignment-critical handoff.
  let pointerX = 0;
  let pointerY = 0;
  if (tier === 'desktop') {
    addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType !== 'mouse') return;
        pointerX = (event.clientX / viewportWidth) * 2 - 1;
        pointerY = (event.clientY / viewportHeight) * 2 - 1;
      },
      { passive: true, signal },
    );
  }

  /* --------------------------------------------------------------- the frame */

  let raf = 0;
  let disposed = false;
  let contextLost = false;
  let motionTime = 0;
  let lastTick = 0;
  let lastGone = -1;

  const smooth01 = (t: number) => {
    const x = t > 1 ? 1 : t > 0 ? t : 0;
    return x * x * (3 - 2 * x);
  };

  // Quantised, because this drives a custom property and a style recalculation
  // every frame for a value the eye cannot resolve is a cost with no picture.
  let narrationStep = -1;
  function setNarration(value: number) {
    const step = Math.round(THREE.MathUtils.clamp(value, 0, 1) * 25);
    if (step === narrationStep) return;
    narrationStep = step;
    root.style.setProperty('--signal-narration', (step / 25).toFixed(2));
  }

  let phaseOn: HTMLElement | null = null;
  function setPhase(panel: HTMLElement | undefined, phase: string) {
    if (!panel) return;
    if (phaseOn && phaseOn !== panel) phaseOn.dataset.phase = 'proof';
    phaseOn = panel;
    if (panel.dataset.phase !== phase) panel.dataset.phase = phase;
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

    const u = progress();
    const state = evaluate(u, layout);
    const index = CHAPTERS.indexOf(state.chapter);

    showChapter(state.chapter.id);
    updateIntro(u);
    updateSeek(index);
    updateHeader();
    root.dataset.signalChapter = state.chapter.id;

    // Ambient motion only advances while the story is moving. At a reading stop
    // the scene settles and stays settled: stopping the scroll stops everything.
    if (!state.resting) motionTime += dt;

    cloud.setPair(state.from as ShapeId, state.to as ShapeId);
    cloud.setMorph(state.morph);
    cloud.setBreath(state.resting ? 0 : 0.25 * Math.sin(motionTime * 0.6));
    cloud.setAccent(state.chapter.artifact ? 0.45 : 0.12);

    // How much of the chapter's subject is now a real surface rather than the
    // cloud that described it. Where paperboard acquires faces, or a real
    // interior opens behind an aperture, the scaffolding gives up its priority:
    // otherwise the guides stay the brightest thing in the frame and the object
    // the chapter is about never actually arrives.
    // How completely: a carton, a room and a cut timeline are surfaces, and the
    // cloud that described them has nothing left to say. The workflow lattice is
    // not — it is the structure the mechanism sits inside, so it thins rather
    // than leaves.
    const depth =
      state.chapter.id === 'matter' || state.chapter.id === 'signal' || state.chapter.id === 'world' ? 1
      : state.chapter.id === 'system' ? 0.74
      : state.chapter.id === 'archive' ? 0.97 : 0;
    const surfaced = depth > 0 ? smooth01((state.local - 0.1) / 0.28) * depth : 0;
    const gone = released();
    cloud.setOpacity((state.chapter.id === 'horizon' ? 1 : 0.82) * (1 - surfaced) * (1 - gone));
    starfield.setOpacity(1 - gone);
    // The whole canvas fades, not only its contents: the mass, the stages and the
    // point cloud leave together, and `visibility` is only switched once there is
    // nothing left to see. A binary flip at the end is a rendering fault, not a
    // release.
    if (gone !== lastGone) {
      lastGone = gone;
      canvas.style.opacity = gone > 0 ? (1 - gone).toFixed(3) : '';
      canvas.style.visibility = gone > 0.995 ? 'hidden' : '';
    }

    // The narration recedes where the artifact is the argument. It is a scale
    // and a weight, never a visibility: a visitor who stops mid-transformation
    // still has the sentence.
    // A reading stop holds a floor: the narration may give the stage to the
    // artifact, but where the visitor is meant to READ it stays legible. Compact
    // is a composition; faint is a defect.
    setNarration(state.resting ? Math.max(state.narration, 0.72) : state.narration);
    // The datum organises reading stops, not every frame. It is drawn where the
    // visitor is reading and nowhere else, so continuity comes from the camera,
    // the recurring points and the shared light rather than from a rule that
    // never leaves the screen.
    setRest(state.resting ? 1 : 0);

    // The mass belongs to the opening. It clears as the points leave the rim.
    const massFade = state.chapter.id === 'horizon' ? 1 : state.chapter.id === 'forge' ? 1 - state.morph : 0;
    mass.visible = massFade > 0.01;
    massMaterial.opacity = massFade;

    // The far population drifts a little with the camera and nothing else.
    starfield.points.rotation.y = state.camera.position[0] * 0.004;

    // Parallax is off at every reading stop, and off while an alignment-critical
    // pose is held: the emblem reads flat from one eye position and from no
    // other, so a pointer nudge there is not a nudge, it is the illusion coming
    // apart under the pointer.
    const parallax = state.resting || state.frame < 0.02 ? 0 : 0.35;
    const composed = compose(state.camera, state.chapter.id, state.frame);
    applyPose(camera, microParallax(composed, pointerX, pointerY, parallax));

    // Build the current chapter's stage and its immediate neighbours, then let
    // everything else go. Without the build step nothing is ever instantiated.
    const keep = neighbourhood(index);
    for (const id of keep) stageFor(id);
    releaseExcept(keep);
    for (const [id, stage] of resident) {
      const active = id === state.chapter.artifact;
      stage.object.visible = active;
      if (active) stage.update(state.local, motionTime);
    }

    if (viewportWidth !== innerWidth || Math.abs(viewportHeight - innerHeight) > BAR_TOLERANCE) {
      // A real layout change. Re-measure, but keep the visitor where they were.
      measure();
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(viewportWidth, viewportHeight, false);
      for (const stage of resident.values()) {
        stage.setCamera?.(camera, { width: viewportWidth, height: viewportHeight });
      }
    }

    // Registration: once the stage says its surface is about to be handed over,
    // the camera is fitted to it and re-applied, and the plate is then placed on
    // the rectangle THIS camera produces. Both representations move together.
    const live = resident.get(state.chapter.artifact as ArtifactId);
    const panel = panels.find((p) => p.dataset.chapter === state.chapter.id);
    const surface = (live as (BoundStage & { surface?: THREE.Object3D | null }) | undefined)?.surface;
    const wanted = live?.handoff?.()?.fit ?? 0;
    // Whichever the chapter is currently about. The object's own interval frames
    // the object -- its whole silhouette, flaps included -- and the proof stop
    // frames the surface the capture is taking over.
    const focus = (live as (BoundStage & { focus?: () => { object: THREE.Object3D; fit: number } | null }) | undefined)
      ?.focus?.() ?? null;
    if (panel && focus && focus.fit > wanted && focus.fit > 0.001) {
      applyPose(
        camera,
        microParallax(
          fitSurface(composed, focus.object, freeBox(panel), focus.fit, true),
          pointerX, pointerY, parallax,
        ),
      );
    } else if (wanted > 0.001 && surface && panel) {
      applyPose(
        camera,
        microParallax(fitSurface(composed, surface, freeBox(panel), wanted), pointerX, pointerY, parallax),
      );
    }

    // Which claim is currently true. At the carton's own stop there is no
    // screenshot on screen, so the sentence that names one may not be showing.
    const blended = live?.handoff?.()?.blend ?? 0;
    setPhase(panel, blended > 0.5 ? 'proof' : 'object');

    alignPlate(state.chapter.id, state.local, live);

    renderer.render(scene, camera);

    request();
  }

  /* -------------------------------------------- 3D surface -> HTML screenshot */

  // The plate is a real <img> in the document. It is positioned onto the 3D
  // surface's projected rectangle and cross-faded in, so the readable state is
  // crisp HTML rather than a texture, and the two never both draw at full
  // strength at once.
  /**
   * Hand over, do not double-draw: the 3D surface gives up its pixels exactly as
   * the HTML image takes them, so no ghost quad is left beside the screenshot.
   */
  function fadeSurface(stage: BoundStage | undefined, blend: number) {
    const owner = stage as (BoundStage & {
      surface?: THREE.Object3D | null;
      chrome?: THREE.Object3D | null;
    }) | undefined;
    const mesh = owner?.surface as THREE.Mesh | undefined;
    // The housing goes with the plane. Left behind, it is a second empty screen
    // standing next to the screenshot that replaced it -- and this may only ever
    // HIDE it: the stage decides when its own screen arrives, and assigning
    // `blend < .995` outright was switching an empty black panel back on through
    // the whole interval the carton is supposed to have to itself.
    if (owner?.chrome) owner.chrome.visible = owner.chrome.visible && blend < 0.995;
    if (!mesh?.material) return;
    const material = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
    material.transparent = true;
    material.opacity = 1 - blend;
    mesh.visible = blend < 0.995;
  }

  /**
   * The inline band the active chapter's copy and actions occupy, measured from
   * the element rather than recomputed from the stylesheet's arithmetic, so it
   * stays true in both reading directions and at any viewport. Cached per
   * chapter and size: it is a layout read in the middle of a frame that is
   * otherwise all writes.
   */
  let guardKey = '';
  let guardBand = { start: 0, end: 0, top: 0, bottom: 0 };
  function copyBand(panel: HTMLElement) {
    const key = `${panel.dataset.chapter}:${viewportWidth}x${viewportHeight}`;
    if (key !== guardKey) {
      const box = panel.querySelector<HTMLElement>('[data-chapter-copy]')?.getBoundingClientRect();
      guardBand = box
        ? { start: box.left, end: box.right, top: box.top, bottom: box.bottom }
        : { start: 0, end: 0, top: viewportHeight, bottom: viewportHeight };
      guardKey = key;
    }
    return guardBand;
  }

  /**
   * The part of the frame the artifact may use: the whole viewport minus the
   * band the copy and its actions own, minus a margin.
   *
   * Landscape takes the inline side beyond the copy column; portrait takes the
   * block above it. Measured once per chapter and viewport and cached, so a
   * visitor opening a disclosure does not move the camera: the box the camera
   * was framed against stays the box it was framed against.
   */
  const FIT_MARGIN = 24;
  const FIT_CLEAR = 26;
  function freeBox(panel: HTMLElement) {
    const band = copyBand(panel);
    // Free space starts below the fixed header, not at the top of the viewport.
    // It did not, and at the carton's reading stop the fit placed the plate at
    // y=32 under a 54px bar: the top 22px of an "actual application screenshot"
    // — its toolbar row — sat behind the site's own chrome, in both languages
    // and both orientations. A capture that is 5% covered by the page furniture
    // is not the readable proof this whole sequence is built to arrive at.
    const top = headerBand + FIT_MARGIN;
    if (layout === 'portrait') {
      const bottom = Math.max(top + 80, band.top - FIT_CLEAR);
      return {
        x: FIT_MARGIN,
        y: top,
        width: Math.max(120, viewportWidth - FIT_MARGIN * 2),
        height: Math.max(80, bottom - top),
      };
    }
    const left = rtl ? FIT_MARGIN : Math.max(FIT_MARGIN, band.end + FIT_CLEAR);
    const right = rtl
      ? Math.min(viewportWidth - FIT_MARGIN, band.start - FIT_CLEAR)
      : viewportWidth - FIT_MARGIN;
    return {
      x: left,
      y: top,
      width: Math.max(160, right - left),
      height: Math.max(120, viewportHeight - FIT_MARGIN - top),
    };
  }

  /**
   * Move the camera until the surface the chapter is about to hand off projects
   * inside the free box, and blend that correction in before the crossfade.
   *
   * Two passes: dolly back along the view axis until the projected rectangle
   * fits, then re-centre it in the box. Because the HTML image is then placed on
   * the rectangle this same camera produces, the two representations share four
   * corners, an aspect ratio and a crop for the whole blend — which rescaling the
   * image after the fact can never give.
   */
  const probe = new THREE.PerspectiveCamera(38, 1, 0.1, 140);
  const CENTRE = new THREE.Vector3();
  const WHOLE = new THREE.Box3();
  function projectWith(pose: CameraPose, surface: THREE.Object3D, whole = false) {
    probe.aspect = viewportWidth / Math.max(1, viewportHeight);
    applyPose(probe, pose);
    probe.updateMatrixWorld(true);
    probe.updateProjectionMatrix();
    return whole
      ? projectBounds(surface, probe, viewportWidth, viewportHeight)
      : projectSurface(surface, probe, viewportWidth, viewportHeight);
  }

  function fitSurface(
    pose: CameraPose, surface: THREE.Object3D, box: ReturnType<typeof freeBox>, amount: number,
    whole = false,
  ) {
    if (amount <= 0.001) return pose;
    surface.updateWorldMatrix(true, true);
    if (whole) {
      const b = projectWith(pose, surface, true);
      if (!(b.width > 1)) return pose;
      // The CENTRE of what is there, not the origin of the node holding it. A
      // carton's group sits on its own base, so aiming at the origin put the box
      // half out of the top of the frame -- the fit was exact about the wrong
      // point.
      WHOLE.setFromObject(surface);
      WHOLE.getCenter(CENTRE);
    } else {
      CENTRE.setFromMatrixPosition(surface.matrixWorld);
    }
    const target: [number, number, number] = [CENTRE.x, CENTRE.y, CENTRE.z];
    // Aim a little inside the band. The correction is computed at the surface's
    // centre depth while its rectangle spans a range of depths, so each pass
    // lands within a few pixels rather than exactly; aiming at the inset makes
    // that residual fall on the safe side of the edge instead of across it.
    const inset = 8;
    const aim = {
      x: box.x + inset, y: box.y + inset,
      width: Math.max(40, box.width - inset * 2), height: Math.max(40, box.height - inset * 2),
    };
    let out = pose;
    // Dolly AND shift in the same pass. Dollying alone, one pass at a time, spent
    // the whole loop on scale and never corrected the position, so the rectangle
    // was the right size in the wrong place and still outside the band.
    for (let pass = 0; pass < 5; pass++) {
      let rect = projectWith(out, surface, whole);
      if (!(rect.width > 1 && rect.height > 1)) return pose;

      // Dolly only if it does not fit, and shift only by what is still outside.
      // The authored composition is the intent; this is a correction, not a
      // re-framing, so a surface that already sits in the free band is left
      // exactly where the chapter put it.
      // Fill the band, do not merely fit inside it. At the proof stop the capture
      // IS the subject, and a 338px render of a 1280px product screen under a
      // caption that says "Actual product screenshot" is a promise the frame does
      // not keep. Scaling up is the same dolly as scaling down.
      const scale = Math.min(aim.width / rect.width, aim.height / rect.height) * 0.94;
      if (scale < 0.998 || scale > 1.002) {
        // Dolly along the view axis by the surface's OWN depth, not by the
        // distance to the look point. Scaling the look distance changes the
        // projected size by some unrelated amount whenever the look target is not
        // the surface -- which is every chapter here -- so the loop chased a
        // number it was not moving and never converged.
        FWD.set(
          out.look[0] - out.position[0], out.look[1] - out.position[1], out.look[2] - out.position[2],
        );
        if (FWD.lengthSq() < 1e-12) return pose;
        FWD.normalize();
        const depth =
          (target[0] - out.position[0]) * FWD.x +
          (target[1] - out.position[1]) * FWD.y +
          (target[2] - out.position[2]) * FWD.z;
        if (depth > 0.6) {
          const step = Math.max(-depth * 6, Math.min(depth - 0.9, depth * (1 - 1 / scale)));
          out = {
            position: [
              out.position[0] + FWD.x * step,
              out.position[1] + FWD.y * step,
              out.position[2] + FWD.z * step,
            ],
            look: [out.look[0] + FWD.x * step, out.look[1] + FWD.y * step, out.look[2] + FWD.z * step],
            fov: out.fov,
          };
          // Re-measure inside the pass. Deciding whether to re-centre from the
          // rectangle taken BEFORE the dolly is deciding about a picture that no
          // longer exists: the surface had been scaled 2.7x and the shift was
          // computed against its old, already-inside-the-band position, so the
          // loop congratulated itself and left the capture off the screen.
          rect = projectWith(out, surface, whole);
          if (!(rect.width > 1 && rect.height > 1)) return pose;
        }
      }

      const dx = rect.x < aim.x ? aim.x - rect.x
        : rect.x + rect.width > aim.x + aim.width ? (aim.x + aim.width) - (rect.x + rect.width) : 0;
      const dy = rect.y < aim.y ? aim.y - rect.y
        : rect.y + rect.height > aim.y + aim.height ? (aim.y + aim.height) - (rect.y + rect.height) : 0;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) break;

      const cx = rect.x + rect.width / 2 + dx, cy = rect.y + rect.height / 2 + dy;
      out = frameOn(out, target, (cx / viewportWidth) * 2 - 1, 1 - (cy / viewportHeight) * 2);
    }
    return amount >= 0.999 ? out : blendPose(pose, out, amount);
  }

  function alignPlate(chapterId: string, local: number, stage: BoundStage | undefined) {
    // Guard the panel, not just the plate. `find` returns `HTMLElement |
    // undefined`, and narrowing the plate never narrowed the panel that is passed
    // on below -- the one error in this file that survives with or without the
    // missing `three` declarations.
    const panel = panels.find((p) => p.dataset.chapter === chapterId);
    if (!panel) return;
    const plate = panel.querySelector<HTMLElement>('[data-plate]');
    if (!plate) return;

    const rect = stage?.handoff?.() ?? null;
    if (!rect) {
      plate.style.removeProperty('transform');
      plate.style.removeProperty('width');
      plate.style.removeProperty('height');
      plate.dataset.handoff = 'flow';
      return;
    }

    // The plate goes exactly where the surface projects. It is not re-scaled and
    // not slid: both are the same camera's work, so the four corners, the aspect
    // ratio and the crop agree for the whole crossfade. Keeping the rectangle
    // inside the frame is the camera's job, done before this point.
    //
    // `data-fit` records whether that actually held. It is an assertion the
    // browser suite reads, not a repair: a rectangle that still overflows means
    // the camera fit failed, and a silently re-scaled image would hide it.
    const box = freeBox(panel);
    const slack = 1.5;
    const fitted =
      rect.x >= box.x - slack && rect.y >= box.y - slack &&
      rect.x + rect.width <= box.x + box.width + slack &&
      rect.y + rect.height <= box.y + box.height + slack;

    const blend = rect.blend;
    fadeSurface(stage, blend);
    plate.dataset.handoff = blend > 0.99 ? 'html' : 'aligning';
    plate.dataset.fit = rect.fit > 0.99 ? (fitted ? 'exact' : 'overflow') : 'settling';
    plate.style.setProperty('--plate-blend', blend.toFixed(3));
    plate.style.width = `${rect.width.toFixed(2)}px`;
    plate.style.height = `${rect.height.toFixed(2)}px`;
    plate.style.transform = `translate3d(${rect.x.toFixed(2)}px, ${rect.y.toFixed(2)}px, 0)`;
  }

  /* --------------------------------------------------------------- listeners */

  addEventListener('hashchange', goToAddress, { signal });
  addEventListener('popstate', goToAddress, { signal });
  addEventListener('scroll', request, { passive: true, signal });
  addEventListener(
    'resize',
    () => {
      // Only a width change or a height change past the browser-bar tolerance is
      // a layout change; the render loop applies it, preserving current progress.
      request();
    },
    { passive: true, signal },
  );
  addEventListener('orientationchange', () => { measure(); request(); }, { signal });

  document.addEventListener(
    'visibilitychange',
    () => {
      lastTick = 0;
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else request();
    },
    { signal },
  );

  canvas.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
      raf = 0;
      // Keep the authored still and the HTML rather than stranding the visitor
      // in a black canvas.
      staticPath('fallback');
    },
    { signal },
  );
  canvas.addEventListener(
    'webglcontextrestored',
    () => {
      contextLost = false;
      root.dataset.graphics = 'webgl';
      measure();
      request();
    },
    { signal },
  );

  goToAddress();
  request();

  teardown = () => {
    disposed = true;
    cancelAnimationFrame(raf);
    abort.abort();
    for (const stage of resident.values()) {
      scene.remove(stage.object);
      stage.dispose();
    }
    resident.clear();
    cloud.dispose();
    starfield.dispose();
    scene.traverse((node: THREE.Object3D) => {
      const light = node as THREE.Light;
      if (light.isLight && typeof light.dispose === 'function') light.dispose();
    });
    renderer.dispose();
    renderer.forceContextLoss();
  };
}

export function stopSignal(): void {
  teardown?.();
  teardown = null;
}

/** A data attribute carrying a list of URLs. A malformed one is no list, not a throw. */
function parseList(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** mulberry32. Deterministic and seeded, so the scene is identical on every load. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Frustum height helper re-exported for the page route's poster sizing. */
export { frameHeightAt };
