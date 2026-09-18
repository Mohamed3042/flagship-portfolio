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
 * order. This module upgrades that composition; it does not supply it.
 */
import * as THREE from 'three';
import type { ArtifactId, ArtifactStage, CameraPose, Layout, Mode, Progress, ShapeId, Tier } from './types';
import { TIERS } from './types';
import { RIM, buildShapes } from './shapes';
import { lattice, projectBounds, projectSurface } from './artifacts';
import { applyPose, blendPose, frameHeightAt, microParallax } from './camera';
import { CHAPTERS, SEGMENT_VH, evaluate } from './chapters';
import { STAGES } from './artifacts';
import { createCloud, createStarfield } from './particles';

/** A stage that has been told about the camera, so it can report its handoff rect. */
type BoundStage = ArtifactStage & {
  setCamera?: (camera: THREE.PerspectiveCamera, size: { width: number; height: number }) => void;
  surface?: THREE.Object3D | null;
  chrome?: THREE.Object3D | null;
  focus?: () => { object: THREE.Object3D; fit: number } | null;
  paper?: () => number;
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

/* ------------------------------------------------------------ the mass */

/**
 * The opening body: lit, not painted. A very dark albedo with a terminator, a
 * grazing relief that only shows where the light rakes the surface, one razor
 * Fresnel rim toward the light, and a faint haze just outside it. The rim is
 * the story's material: it is what fractures.
 */
const massVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vW;
  varying vec3 vO;
  void main() {
    vO = position;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const massFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uLight;
  uniform vec3 uEye;
  uniform sampler2D uNoise;
  uniform float uRim;
  uniform float uOpacity;
  uniform vec3 uRimColor;
  uniform vec3 uBodyDark;
  uniform vec3 uBodyLit;
  varying vec3 vN;
  varying vec3 vW;
  varying vec3 vO;
  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(uEye - vW);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float ndl = dot(N, uLight);
    // Surface relief at three scales, sampled by object position. It only
    // shows where the light rakes the body: a terminator with texture in it,
    // not a textured ball.
    vec2 p = vO.xy * 0.11 + vO.zx * 0.04;
    float n1 = texture2D(uNoise, p).r;
    float n2 = texture2D(uNoise, p * 4.7 + 0.31).g;
    float n3 = texture2D(uNoise, p * 17.0 + 0.77).b;
    float relief = (n1 - 0.5) * 0.5 + (n2 - 0.5) * 0.35 + (n3 - 0.5) * 0.15;
    float graze = pow(1.0 - ndv, 1.4);
    float lit = smoothstep(-0.3, 0.6, ndl + relief * 0.5);
    vec3 body = mix(uBodyDark, uBodyLit, lit) * (1.0 + relief * (0.5 + graze * 2.6));
    // Sparse settlements along the terminator: the fine octave, thresholded,
    // where the light has just left the surface.
    float dusk = smoothstep(0.55, 0.0, abs(ndl + 0.1)) * (1.0 - lit * 0.6);
    float lights = smoothstep(0.74, 0.86, n3) * dusk * 0.9;
    body += vec3(0.86, 0.9, 1.0) * lights * 0.22;
    // The rim: one razor at the limb, brighter toward the light. A hard core
    // in the last few percent of the Fresnel term and a short glow inside it.
    float f = 1.0 - ndv;
    float core = smoothstep(0.945, 0.992, f);
    float glow = pow(f, 40.0) * 0.45;
    float towardLight = 0.4 + 0.6 * smoothstep(-0.35, 0.65, ndl);
    vec3 rim = uRimColor * (core * 3.4 + glow) * towardLight * uRim;
    float haze = pow(f, 8.0) * 0.035 * uRim * towardLight;
    vec3 color = body + rim + uRimColor * haze;
    gl_FragColor = vec4(color, uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
const hazeFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uLight;
  uniform vec3 uEye;
  uniform float uRim;
  uniform vec3 uRimColor;
  varying vec3 vN;
  varying vec3 vW;
  varying vec3 vO;
  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(uEye - vW);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float towardLight = 0.4 + 0.6 * smoothstep(-0.35, 0.65, dot(N, uLight));
    float a = pow(1.0 - ndv, 16.0) * 0.08 * uRim * towardLight;
    gl_FragColor = vec4(uRimColor, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** Three channels of tileable value noise at three scales, sampled by the mass shader. */
function noiseTexture(size = 256): THREE.DataTexture {
  const a = lattice(0x2f1a, 24), b = lattice(0x7c11, 64), c = lattice(0xa30d, 160);
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4, u = x / size, v = y / size;
    data[i] = Math.round(a(u * 24, v * 24) * 255);
    data[i + 1] = Math.round(b(u * 64, v * 64) * 255);
    data[i + 2] = Math.round(c(u * 160, v * 160) * 255);
    data[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/** The lens flare where the light grazes the limb hardest: a streak, drawn once. */
function flareTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  // The streak is a radial gradient squashed to a line, so it has no edge
  // anywhere: a rectangle of any alpha would read as a box on the limb.
  ctx.save();
  ctx.translate(256, 64);
  ctx.scale(1, .075);
  const streak = ctx.createRadialGradient(0, 0, 0, 0, 0, 256);
  streak.addColorStop(0, 'rgba(240,246,255,.95)');
  streak.addColorStop(.18, 'rgba(216,232,255,.5)');
  streak.addColorStop(.5, 'rgba(200,222,255,.16)');
  streak.addColorStop(1, 'rgba(200,222,255,0)');
  ctx.fillStyle = streak;
  ctx.fillRect(-256, -900, 512, 1800);
  ctx.restore();
  const core = ctx.createRadialGradient(256, 64, 0, 256, 64, 26);
  core.addColorStop(0, 'rgba(255,255,255,1)');
  core.addColorStop(.3, 'rgba(230,240,255,.7)');
  core.addColorStop(1, 'rgba(180,210,255,0)');
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, 512, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * The environment every metal reflects: a dark cool sky, one bright thin band
 * at the horizon, a soft lobe where the key sits. Procedural and tiny, so the
 * silver in the rim, the fragments and the rails is the same silver everywhere.
 */
function environment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const w = 128, h = 64, data = new Uint8Array(w * h * 4);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4, lat = y / (h - 1), lon = x / w;
    const above = lat < .47;
    const t = above ? lat / .47 : (lat - .47) / .53;
    let r = above ? mix(0x9c, 0xd6, t) : mix(0x7a, 0x34, t);
    let g = above ? mix(0xa8, 0xde, t) : mix(0x84, 0x3c, t);
    let bl = above ? mix(0xb8, 0xea, t) : mix(0x94, 0x48, t);
    const band = Math.exp(-Math.pow((lat - .47) / .026, 2));
    const lobe = Math.exp(-(Math.pow((lon - .22) / .12, 2) + Math.pow((lat - .3) / .15, 2))) * 1.5;
    r = mix(r, 0xdb, band) + lobe * 255; g = mix(g, 0xe6, band) + lobe * 255; bl = mix(bl, 0xf2, band) + lobe * 255;
    data[i] = Math.min(255, Math.round(r)); data[i + 1] = Math.min(255, Math.round(g)); data[i + 2] = Math.min(255, Math.round(bl)); data[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, w, h);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(texture).texture;
  texture.dispose();
  pmrem.dispose();
  return env;
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

  /**
   * Move focus off a subtree that is about to become inert, and nowhere else.
   * We take focus ONLY from an element we are ourselves about to make
   * unreachable, and we hand it to the nearest thing that says where the
   * visitor now is. Anything wider than that is focus theft during a scroll.
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

  /** The first viewport leaves the tab order once it has left the screen. */
  let introInert = false;
  function updateIntro(progress: number) {
    const away = progress > 0.015;
    if (away === introInert || !intro) return;
    introInert = away;
    if (away) rescueFocus(intro, null);
    intro.toggleAttribute('inert', away);
  }
  showChapter(panels[0]?.dataset.chapter ?? '');

  /**
   * Reveal and reading are two compositions, not one dimmed. In reveal the copy
   * is the line, the name and the navigation; at a reading stop everything
   * returns. The stylesheet does the composing; this only names the state.
   */
  let modeOn: Mode | '' = '';
  function setMode(mode: Mode) {
    if (mode === modeOn) return;
    modeOn = mode;
    root.dataset.mode = mode;
  }

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
   * are then the same declaration.
   */
  let sky = 0.27;
  /** Height of the fixed header, in CSS pixels. Measured, never assumed. */
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
    const bar = document.querySelector('.nav');
    headerBand = bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
    bands.clear();
  }

  function progress(): Progress {
    return THREE.MathUtils.clamp((scrollY - runwayTop) / runwayRange, 0, 1);
  }

  /**
   * How far past the end of the runway the visitor has scrolled, 0..1. The fade
   * STARTS before the runway ends, so by the time the work scrolls in the scene
   * is already gone. A function of scroll position alone.
   */
  function released(): number {
    const past = scrollY - (runwayTop + runwayRange - viewportHeight * 0.55);
    return THREE.MathUtils.clamp(past / Math.max(1, viewportHeight * 0.75), 0, 1);
  }

  /**
   * Direct addressing. Every chapter has a real address -- #signal-horizon
   * through #signal-archive -- that resolves to that chapter's own progress.
   */
  function addressedProgress(): Progress | null {
    const id = decodeURIComponent(location.hash).replace(/^#signal-/, '');
    if (!id || id.startsWith('#')) return null;
    const chapter = CHAPTERS.find((c) => c.id === id);
    if (!chapter) return null;
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

  function seekTo(index: number) {
    const bounded = Math.min(Math.max(index, 0), CHAPTERS.length - 1);
    scrollTo({ top: runwayTop + runwayRange * midpoint(bounded), behavior: 'instant' as ScrollBehavior });
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

  /* --------------------------------- the static path: reduced motion / no WebGL */

  function staticPath(reason: 'reduced' | 'fallback') {
    root.dataset.graphics = reason === 'reduced' ? 'static' : 'fallback';
    root.dataset.mode = 'reading';
    for (const panel of panels) {
      panel.removeAttribute('inert');
      panel.setAttribute('aria-hidden', 'false');
      panel.dataset.active = 'true';
    }
    intro?.removeAttribute('inert');
    seek?.setAttribute('hidden', '');
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

  const bands = new Map<string, { start: number; end: number; top: number; bottom: number }>();
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
  // cinema layout, and that changes the runway's height. Measure AFTER it.
  root.dataset.graphics = 'webgl';
  setMode('reveal');
  measure();

  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, budget.pixelRatio));
  renderer.setSize(viewportWidth, viewportHeight, false);
  renderer.setClearColor(0x05070a, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;

  const scene = new THREE.Scene();
  scene.environment = environment(renderer);
  scene.environmentIntensity = 1;
  const camera = new THREE.PerspectiveCamera(38, viewportWidth / viewportHeight, 0.1, 140);

  // Light direction is shared by every chapter: one world, one light.
  const hemi = new THREE.HemisphereLight(0xc9d8e6, 0x05070a, 1.15);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xf0f3f6, 2.2);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x70b8ff, 1.5);
  scene.add(rim);
  rim.position.set(-6, 2, -5);
  const COOL_SKY = new THREE.Color(0xc9d8e6), WARM_SKY = new THREE.Color(0xe6d3ba);

  const nodeCount = Number(root.dataset.nodes ?? '0') || CHAPTERS.length;
  const shapes = buildShapes(budget.morph, {
    random: seeded(0x5f2d1c),
    aspect: viewportWidth / Math.max(1, viewportHeight),
    nodeCount,
  });

  const cloud = createCloud(shapes, budget, tier);
  cloud.points.renderOrder = 1;
  scene.add(cloud.points);

  const starfield = createStarfield(budget);
  scene.add(starfield.points);

  /* ---------------------------------------------------------------- the mass */

  // The immense dark mass the opening rim is the limb of. Radius, centre AND
  // plane are the aperture shape's own, read from it rather than restated.
  const noise = noiseTexture();
  const massUniforms = {
    uLight: { value: new THREE.Vector3(RIM.light[0], RIM.light[1], RIM.light[2]) },
    uEye: { value: new THREE.Vector3() },
    uNoise: { value: noise },
    uRim: { value: 1 },
    uOpacity: { value: 1 },
    uRimColor: { value: new THREE.Color(0xc4dcff) },
    uBodyDark: { value: new THREE.Color(0x05070a) },
    uBodyLit: { value: new THREE.Color(0x2a3648) },
  };
  const massMaterial = new THREE.ShaderMaterial({
    vertexShader: massVertex, fragmentShader: massFragment, uniforms: massUniforms, transparent: true,
  });
  const massGeometry = new THREE.SphereGeometry(RIM.radius, 384, 192);
  const mass = new THREE.Mesh(massGeometry, massMaterial);
  mass.position.set(0, RIM.centreY, RIM.z - 0.16);
  mass.renderOrder = -1;
  scene.add(mass);
  const hazeMaterial = new THREE.ShaderMaterial({
    vertexShader: massVertex, fragmentShader: hazeFragment,
    uniforms: { uLight: massUniforms.uLight, uEye: massUniforms.uEye, uRim: massUniforms.uRim, uRimColor: massUniforms.uRimColor },
    transparent: true, depthWrite: false, blending: THREE.NormalBlending,
  });
  const haze = new THREE.Mesh(new THREE.SphereGeometry(RIM.radius * 1.018, 256, 128), hazeMaterial);
  haze.position.copy(mass.position);
  haze.renderOrder = 0;
  scene.add(haze);
  const flareMap = flareTexture();
  // The flare sits on the limb, which is the exact place the body's own front
  // surface wins a depth test; it is drawn without one, after the body.
  const flareMaterial = new THREE.SpriteMaterial({ map: flareMap, transparent: true, depthWrite: false, depthTest: false, opacity: 1 });
  const flare = new THREE.Sprite(flareMaterial);
  flare.position.set(RIM.flare[0], RIM.flare[1], RIM.flare[2] + 0.4);
  flare.scale.set(5.2, 1.3, 1);
  flare.renderOrder = 3;
  scene.add(flare);

  /* ------------------------------------------------------- artifact stages */

  const resident = new Map<ArtifactId, BoundStage>();
  const rtl = document.documentElement.dir === 'rtl';

  function stageFor(id: ArtifactId): BoundStage {
    let stage = resident.get(id);
    if (!stage) {
      stage = STAGES[id]({
        worldInterior: root.dataset.worldInterior || null,
        arrival: parseList(root.dataset.arrival),
        title: root.dataset.title || null,
        rtl,
        font: rtl ? '850 160px "Al Rai Media"' : '850 160px "Inter Variable"',
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
   * The opening composition, stated as the picture rather than as offsets:
   * `pull` is the distance to the limb as a multiple of the authored one, `apex`
   * where the top of the arc sits horizontally, mirrored with reading direction.
   * Where it sits vertically is 1 - --signal-sky, the band the stylesheet
   * reserved.
   */
  const OPENING: Record<Layout, { pull: number; apex: number }> = {
    landscape: { pull: 0.52, apex: 0.44 },
    portrait: { pull: 1.0, apex: 0.5 },
  };

  const RIGHT = new THREE.Vector3(), UP = new THREE.Vector3(), FWD = new THREE.Vector3();
  const TO = new THREE.Vector3();

  /** Translate the camera, without turning it, until `target` projects to `(ndcX, ndcY)`. */
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
    // Portrait frames the crest higher, behind the artifact's lower half, and the
    // stylesheet places the artifact over it; the reserved band below is the body.
    const crestY = layout === 'portrait' ? Math.max(sky * 2 - 1, -.14) : sky * 2 - 1;
    return frameOn(dollied, RIM.crest, apex * 2 - 1, crestY);
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
      // Lowering the camera is what raises a fixed world point in the frame.
      const lift = frameHeightAt(pose, distance) * 0.22;
      position[1] -= lift;
      look[1] -= lift;
    }
    return { position, look, fov: pose.fov };
  }

  /* -------------------------------------------------------- pointer parallax */

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
    setMode(state.mode);
    root.dataset.signalChapter = state.chapter.id;

    // Ambient motion only advances while the story is moving. At a reading stop
    // the scene settles and stays settled: stopping the scroll stops everything.
    if (!state.resting) motionTime += dt;

    cloud.setPair(state.from as ShapeId, state.to as ShapeId);
    cloud.setMorph(state.morph);
    cloud.setBreath(state.resting ? 0 : 0.25 * Math.sin(motionTime * 0.6));
    cloud.setAccent(state.chapter.artifact ? 0.3 : 0.12);

    const gone = released();
    cloud.setOpacity(state.cloud * (1 - gone));
    starfield.setOpacity(1 - gone);
    // The whole canvas fades, not only its contents; `visibility` is only
    // switched once there is nothing left to see.
    if (gone !== lastGone) {
      lastGone = gone;
      canvas.style.opacity = gone > 0 ? (1 - gone).toFixed(3) : '';
      canvas.style.visibility = gone > 0.995 ? 'hidden' : '';
    }

    // A reading stop holds a floor: the narration may give the stage to the
    // artifact, but where the visitor is meant to READ it stays legible.
    setNarration(state.resting ? Math.max(state.narration, 0.72) : state.narration);
    setRest(state.resting ? 1 : 0);

    // The mass belongs to the opening. Its rim goes dark as the pieces leave
    // it, and the body clears as the camera goes through the ring.
    const local = state.local;
    const rimLit = state.chapter.id === 'horizon' ? 1 : state.chapter.id === 'forge' ? 1 - smooth01((local - 0.02) / 0.28) : 0;
    const massFade = state.chapter.id === 'horizon' ? 1 : state.chapter.id === 'forge' ? 1 - smooth01((local - 0.32) / 0.3) : 0;
    massUniforms.uRim.value = rimLit;
    massUniforms.uOpacity.value = massFade;
    mass.visible = massFade > 0.01;
    haze.visible = massFade > 0.01 && rimLit > 0.01;
    flare.visible = rimLit > 0.01 && massFade > 0.01;
    flareMaterial.opacity = rimLit * massFade;

    // The far population drifts a little with the camera and nothing else.
    starfield.points.rotation.y = state.camera.position[0] * 0.004;

    // Parallax is off at every reading stop, and off while an authored pose is
    // held exactly: the ring reads flat from one eye position and no other.
    const parallax = state.resting || state.frame < 0.02 ? 0 : 0.35;
    const composed = compose(state.camera, state.chapter.id, state.frame);
    applyPose(camera, microParallax(composed, pointerX, pointerY, parallax));
    massUniforms.uEye.value.copy(camera.position);

    // Build the current chapter's stage and its immediate neighbours, then let
    // everything else go. A stage that lingers stays drawn while it hands over.
    const keep = neighbourhood(index);
    for (const id of keep) stageFor(id);
    releaseExcept(keep);
    const ctx = { u, chapter: state.chapter.id, layout };
    for (const [id, stage] of resident) {
      const active = id === state.chapter.artifact || (stage.linger?.includes(state.chapter.id) ?? false);
      stage.object.visible = active;
      if (active) stage.update(state.local, motionTime, ctx);
    }

    // The World's warmth reaches the shell: the cool rim light gives way and the
    // sky tint turns, so the warm light is environmental, not painted on.
    const warm = resident.get('object')?.warmth?.() ?? 0;
    const paper = resident.get('object')?.paper?.() ?? 0;
    rim.intensity = 1.5 * (1 - warm * 0.85) * (1 - paper * 0.5);
    key.intensity = 2.2 * (1 - paper * 0.6);
    hemi.color.copy(COOL_SKY).lerp(WARM_SKY, Math.max(warm * 0.7, paper * 0.35));

    if (viewportWidth !== innerWidth || Math.abs(viewportHeight - innerHeight) > BAR_TOLERANCE) {
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
    const surface = live?.surface ?? null;
    const wanted = live?.handoff?.()?.fit ?? 0;
    // The object's own interval frames the object -- its whole silhouette --
    // into the composition in force; the proof stop frames the surface the
    // capture is taking over, always into the reading composition.
    const focus = live?.focus?.() ?? null;
    if (panel && focus && focus.fit > wanted && focus.fit > 0.001) {
      applyPose(
        camera,
        microParallax(
          fitSurface(composed, focus.object, freeBox(panel, state.mode, 'object'), focus.fit, true),
          pointerX, pointerY, parallax,
        ),
      );
    } else if (wanted > 0.001 && surface && panel) {
      applyPose(
        camera,
        microParallax(fitSurface(composed, surface, freeBox(panel, 'reading', 'proof'), wanted), pointerX, pointerY, parallax),
      );
    }
    massUniforms.uEye.value.copy(camera.position);

    // Which claim is currently true. At the carton's own stop there is no
    // screenshot on screen, so the sentence that names one may not be showing.
    const blended = live?.handoff?.()?.blend ?? 0;
    setPhase(panel, blended > 0.5 ? 'proof' : 'object');

    alignPlate(state.chapter.id, live);

    renderer.render(scene, camera);

    request();
  }

  /* -------------------------------------------- 3D surface -> HTML screenshot */

  /**
   * Hand over, do not double-draw: the 3D surface gives up its pixels exactly as
   * the HTML image takes them, so no ghost quad is left beside the screenshot.
   * The housing goes with the plane, and this may only ever HIDE it.
   */
  function fadeSurface(stage: BoundStage | undefined, blend: number) {
    const mesh = stage?.surface as THREE.Mesh | undefined;
    if (stage?.chrome) stage.chrome.visible = stage.chrome.visible && blend < 0.995;
    if (!mesh?.material) return;
    const material = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
    material.transparent = true;
    material.opacity = 1 - blend;
    mesh.visible = blend < 0.995;
  }

  /**
   * The inline band the active chapter's copy and actions occupy, in a given
   * composition, measured from the element rather than recomputed from the
   * stylesheet's arithmetic. Cached per chapter, size and mode: it is a layout
   * read in the middle of a frame that is otherwise all writes. Measuring the
   * other composition means switching the attribute for one read and back.
   */
  type Phase = 'object' | 'proof';
  function copyBand(panel: HTMLElement, mode: Mode, phase: Phase) {
    // The phase is part of the key: a chapter whose caption changes when the
    // capture arrives has a taller copy block at the proof stop than at the
    // object's own stop, and a band measured for the shorter one lets the plate
    // reach into the longer one. The handoff fit measures the phase the plate
    // will have, so the target does not move under the crossfade.
    const key = `${panel.dataset.chapter}:${mode}:${phase}:${viewportWidth}x${viewportHeight}`;
    let band = bands.get(key);
    if (!band) {
      const previous = root.dataset.mode, previousPhase = panel.dataset.phase;
      if (previous !== mode) root.dataset.mode = mode;
      if (previousPhase !== phase) panel.dataset.phase = phase;
      const box = panel.querySelector<HTMLElement>('[data-chapter-copy]')?.getBoundingClientRect();
      if (previous !== mode) root.dataset.mode = previous ?? '';
      if (previousPhase !== phase) panel.dataset.phase = previousPhase ?? 'proof';
      band = box
        ? { start: box.left, end: box.right, top: box.top, bottom: box.bottom }
        : { start: 0, end: 0, top: viewportHeight, bottom: viewportHeight };
      bands.set(key, band);
    }
    return band;
  }

  /**
   * The part of the frame the artifact may use: the whole viewport minus the
   * band the copy and its actions own, minus a margin, and below the fixed header.
   * Landscape takes the inline side beyond the copy column; portrait takes the
   * block above it.
   */
  const FIT_MARGIN = 24;
  const FIT_CLEAR = 26;
  function freeBox(panel: HTMLElement, mode: Mode, phase: Phase = 'proof') {
    const band = copyBand(panel, mode, phase);
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
   * Dolly along the surface's own depth and re-centre in the same pass, and
   * re-measure after the dolly.
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
      WHOLE.setFromObject(surface);
      WHOLE.getCenter(CENTRE);
    } else {
      CENTRE.setFromMatrixPosition(surface.matrixWorld);
    }
    const target: [number, number, number] = [CENTRE.x, CENTRE.y, CENTRE.z];
    const inset = 8;
    const aim = {
      x: box.x + inset, y: box.y + inset,
      width: Math.max(40, box.width - inset * 2), height: Math.max(40, box.height - inset * 2),
    };
    let out = pose;
    for (let pass = 0; pass < 5; pass++) {
      let rect = projectWith(out, surface, whole);
      if (!(rect.width > 1 && rect.height > 1)) return pose;

      const scale = Math.min(aim.width / rect.width, aim.height / rect.height) * 0.94;
      if (scale < 0.998 || scale > 1.002) {
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

  function alignPlate(chapterId: string, stage: BoundStage | undefined) {
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
    // not slid: both are the same camera's work, so the rectangle the HTML
    // image occupies is the rectangle the 3D surface projected to. Whether the
    // pixels inside agree is a separate claim, true only where the 3D side
    // carries the same image (the World's far wall) and not claimed elsewhere.
    //
    // `data-fit` records whether the fit actually held. It is an assertion the
    // browser suite reads, not a repair.
    const box = freeBox(panel, 'reading', 'proof');
    const slack = 1.5;
    const fitted =
      rect.x >= box.x - slack && rect.y >= box.y - slack &&
      rect.x + rect.width <= box.x + box.width + slack &&
      rect.y + rect.height <= box.y + box.height + slack;

    // An image that has not decoded yet is not on screen, whatever its opacity
    // says: the surface keeps its pixels until the plate can actually take them.
    const loaded = plate instanceof HTMLImageElement ? plate.complete && plate.naturalWidth > 0 : true;
    const blend = loaded ? rect.blend : 0;
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
  addEventListener('resize', () => { request(); }, { passive: true, signal });
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
    massGeometry.dispose();
    massMaterial.dispose();
    hazeMaterial.dispose();
    haze.geometry.dispose();
    noise.dispose();
    flareMap.dispose();
    flareMaterial.dispose();
    scene.environment?.dispose();
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
