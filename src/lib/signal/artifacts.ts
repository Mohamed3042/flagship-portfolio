/**
 * "From Signal to Systems" — the artifact stages.
 *
 * Every pose is a pure function of (local, chapter, time): no accumulation, no
 * easing toward a target, no one-way latch. Reverse scroll, an anchor jump and a
 * restored history all reconstruct the identical transform. `time` drives only
 * ambient life, whose amplitude vanishes at both ends of an interval, so a
 * paused or finished stage is completely still and completely readable.
 *
 * Since Round 06 the middle of the film is ONE stage. The nine fragments the rim
 * breaks into are the same nine meshes that become the workflow's rails, posts
 * and stanchions; the front rail is the same line the carton's top edge hangs
 * from; the carton is the same group that scales up around the camera into the
 * Cake Studio room. Nothing is swapped at a chapter boundary, so nothing cuts.
 */
import * as THREE from 'three';
import type { ArtifactId, ArtifactStage, HandoffRect, StageContext } from './types';
import { CARTON, DECK, RIM, SHARDS, SLOT_OF, STRUCTURE, shardRing, shardRim, type Vec3 } from './shapes';

/* Palette. Near-monochrome by contract: colour arrives from real screenshots, not from here. */
const DEPTH = 0x0b1017, INK = 0xf0f3f6, INK_DIM = 0x98a5b1, ACCENT = 0x70b8ff;
/** The one rendered metal: the rim's silver-blue, carried into every structural member. */
const SILVER = 0xcbd6e2, SILVER_DARK = 0x2b343d;
/** Paperboard: an ivory cake board, with a dark printed interior. */
const BOARD = 0xd9c7a8, BOARD_CUT = 0xe6dfd2, BOARD_INSIDE = 0x171310;

const clamp = THREE.MathUtils.clamp;
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Eased sub-interval of `local`. The only way a stage reads progress. */
const ramp = (v: number, a: number, b: number) => smooth(clamp((v - a) / (b - a), 0, 1));
/** Ambient envelope: zero at both ends, so residual motion decays to nothing at rest. */
const life = (local: number) => { const s = Math.sin(Math.PI * clamp(local, 0, 1)); return s * s; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Seeded PRNG for authored jitter. Never Math.random, never reseeded per frame. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------- resources */

/** Three frees no GPU memory on removal, so each stage owns and returns its own. */
function bin() {
  const geometries: THREE.BufferGeometry[] = [], materials: THREE.Material[] = [], textures: THREE.Texture[] = [];
  return {
    geo<T extends THREE.BufferGeometry>(g: T): T { geometries.push(g); return g; },
    mat<T extends THREE.Material>(m: T): T { materials.push(m); return m; },
    map<T extends THREE.Texture>(t: T): T { textures.push(t); return t; },
    dispose() {
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
      geometries.length = 0; materials.length = 0; textures.length = 0;
    },
  };
}
type Bin = ReturnType<typeof bin>;

/** Soft round falloff, generated rather than loaded: one restrained contact shadow. */
function falloffTexture(size = 64, power = 2.4): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4, dx = ((x + .5) / size) * 2 - 1, dy = ((y + .5) / size) * 2 - 1;
    data[i + 3] = Math.round(Math.pow(Math.max(0, 1 - Math.hypot(dx, dy)), power) * 255);
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  return texture;
}

/** A soft rectangular vignette: clear through the middle, opaque at the edges. */
function vignetteTexture(size = 96): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const dx = Math.abs(((x + .5) / size) * 2 - 1), dy = Math.abs(((y + .5) / size) * 2 - 1);
    const edge = Math.max(dx / .97, dy / .95);
    const a = Math.pow(Math.min(1, Math.max(0, (edge - .58) / .42)), 1.6);
    data[i + 3] = Math.round(a * 255);
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  return texture;
}

/** A soft band across a strip: the compressed shadow along a crease, falling off both ways. */
function creaseTexture(size = 64): THREE.DataTexture {
  const data = new Uint8Array(size * 4 * 4);
  for (let y = 0; y < 4; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const d = Math.abs(((x + .5) / size) * 2 - 1);
    data[i + 3] = Math.round(Math.pow(Math.max(0, 1 - d), 1.8) * 255);
  }
  const texture = new THREE.DataTexture(data, size, 4);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Tileable value noise on a seeded lattice. Deterministic, CPU-side and cheap,
 * so no GLSL hash compiles for seconds on a D3D backend.
 */
export function lattice(seed: number, cells: number): (x: number, y: number) => number {
  const random = mulberry32(seed), grid = new Float32Array(cells * cells);
  for (let i = 0; i < grid.length; i++) grid[i] = random();
  return (x, y) => {
    const gx = ((x % cells) + cells) % cells, gy = ((y % cells) + cells) % cells;
    const x0 = Math.floor(gx), y0 = Math.floor(gy), x1 = (x0 + 1) % cells, y1 = (y0 + 1) % cells;
    const fx = smooth(gx - x0), fy = smooth(gy - y0);
    const a = grid[y0 * cells + x0], b = grid[y0 * cells + x1], c = grid[y1 * cells + x0], d = grid[y1 * cells + x1];
    return lerp(lerp(a, b, fx), lerp(c, d, fx), fy);
  };
}

/**
 * Paperboard, as a height field: long fibres one way, a few crossing the other,
 * and a fine speckle. Returned as a tangent-space normal map and a roughness
 * map derived from the same field, so the sheen sits where the fibres are.
 */
function paperTextures(seed: number, size = 1024): { normal: THREE.DataTexture; roughness: THREE.DataTexture } {
  const along = lattice(seed, 160), across = lattice(seed + 7, 160), fine = lattice(seed + 13, 256);
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const fibre = along(u * 160, v * 160 * 0.09) * .56 + across(u * 160 * 0.08, v * 160) * .24 + fine(u * 256, v * 256) * .2;
    height[y * size + x] = fibre;
  }
  const normal = new Uint8Array(size * size * 4), rough = new Uint8Array(size * size * 4);
  const at = (x: number, y: number) => height[(((y % size) + size) % size) * size + (((x % size) + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const dx = (at(x + 1, y) - at(x - 1, y)) * 6.5, dy = (at(x, y + 1) - at(x, y - 1)) * 6.5;
    const len = Math.hypot(dx, dy, 1);
    normal[i] = Math.round((-dx / len * .5 + .5) * 255);
    normal[i + 1] = Math.round((-dy / len * .5 + .5) * 255);
    normal[i + 2] = Math.round((1 / len * .5 + .5) * 255);
    normal[i + 3] = 255;
    // Roughness rides the fibre: the raised fibre is matte, the pressed board between sheens a little.
    const r = .78 + (at(x, y) - .5) * .4;
    rough[i] = rough[i + 1] = rough[i + 2] = Math.round(clamp(r, 0, 1) * 255);
    rough[i + 3] = 255;
  }
  const n = new THREE.DataTexture(normal, size, size), r = new THREE.DataTexture(rough, size, size);
  for (const t of [n, r]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.needsUpdate = true; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; }
  return { normal: n, roughness: r };
}

function outline(res: Bin, mesh: THREE.Mesh, material: THREE.LineBasicMaterial): THREE.Mesh {
  mesh.add(new THREE.LineSegments(res.geo(new THREE.EdgesGeometry(mesh.geometry)), material));
  return mesh;
}

/* ------------------------------------------------------------------ handoff */

const UNIT = new THREE.Box3(new THREE.Vector3(-.5, -.5, 0), new THREE.Vector3(.5, .5, 0));
const CORNER = new THREE.Vector3(), VIEW = new THREE.Vector3();

/**
 * Screen-space rectangle of a 3D surface, in CSS pixels relative to the canvas, so
 * the HTML screenshot can be aligned before the representation switches.
 */
export function projectSurface(
  object: THREE.Object3D, camera: THREE.PerspectiveCamera, width: number, height: number,
): HandoffRect {
  object.updateWorldMatrix(true, false);
  camera.updateMatrixWorld();
  VIEW.setFromMatrixPosition(object.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
  if (VIEW.z > -camera.near) return { x: width / 2, y: height / 2, width: 0, height: 0, blend: 0, fit: 0 };
  const geometry = (object as Partial<THREE.Mesh>).geometry;
  if (geometry && !geometry.boundingBox) geometry.computeBoundingBox();
  const box = geometry?.boundingBox ?? UNIT;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < 8; i++) {
    CORNER.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z)
      .applyMatrix4(object.matrixWorld).project(camera);
    const x = (CORNER.x * .5 + .5) * width, y = (.5 - CORNER.y * .5) * height;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY, blend: 0, fit: 0 };
}

const BOUNDS = new THREE.Box3();

/** Screen-space rectangle of everything inside an object, in CSS pixels. */
export function projectBounds(
  object: THREE.Object3D, camera: THREE.PerspectiveCamera, width: number, height: number,
): HandoffRect {
  object.updateWorldMatrix(true, true);
  camera.updateMatrixWorld();
  BOUNDS.setFromObject(object);
  if (BOUNDS.isEmpty()) return { x: width / 2, y: height / 2, width: 0, height: 0, blend: 0, fit: 0 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < 8; i++) {
    CORNER.set(
      i & 1 ? BOUNDS.max.x : BOUNDS.min.x,
      i & 2 ? BOUNDS.max.y : BOUNDS.min.y,
      i & 4 ? BOUNDS.max.z : BOUNDS.min.z,
    ).project(camera);
    const x = (CORNER.x * .5 + .5) * width, y = (.5 - CORNER.y * .5) * height;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY, blend: 0, fit: 0 };
}

export interface SurfaceSize { width: number; height: number }

/** An object the camera should frame while the chapter is about that object. */
export interface FocusRequest { object: THREE.Object3D; fit: number }

/** A stage that hands a 3D surface to a real HTML screenshot. */
export interface SurfaceStage extends ArtifactStage {
  focus?(): FocusRequest | null;
  /** The plane a screenshot takes over from. Reassigned per chapter by the stage itself. */
  surface: THREE.Object3D | null;
  /** The housing around that plane. It leaves with the surface. */
  chrome?: THREE.Object3D | null;
  setCamera(camera: THREE.PerspectiveCamera | null, size: SurfaceSize): void;
  handoff(): HandoffRect | null;
}

const ALIGN_Q = new THREE.Quaternion();

function surfaceHandoff() {
  let camera: THREE.PerspectiveCamera | null = null, size: SurfaceSize = { width: 0, height: 0 };
  return {
    setCamera(next: THREE.PerspectiveCamera | null, nextSize: SurfaceSize) { camera = next; size = nextSize; },
    /**
     * Turn a surface to face the image plane as its handoff approaches. A plane at
     * an angle projects to a quadrilateral; an HTML image is an axis-aligned
     * rectangle and nothing else, so the two cannot share four corners until the
     * surface is in the image plane.
     */
    align(object: THREE.Object3D, amount: number) {
      if (!camera || amount <= 0) return;
      camera.updateMatrixWorld();
      ALIGN_Q.setFromRotationMatrix(camera.matrixWorld);
      object.quaternion.slerp(ALIGN_Q, clamp(amount, 0, 1));
    },
    rect(surface: THREE.Object3D | null, blend: number, fit: number): HandoffRect | null {
      if (!camera || !surface || size.width <= 0 || size.height <= 0) return null;
      const projected = projectSurface(surface, camera, size.width, size.height);
      projected.blend = blend;
      projected.fit = fit;
      return projected;
    },
    aspect() { return size.height > 0 ? size.width / size.height : 1.6; },
  };
}

/* ---------------------------------------------------------------- fragments */

/**
 * A fragment of the rim: a slender tapered bar with a morph target that bends it
 * to the ring's radius at its depth. Straight it is a piece of the limb or a
 * rail; bent it is one arc of the aperture. The same vertices, both ways.
 */
function sliverGeometry(length: number, width: number, thick: number, bendRadius: number, extent: number): THREE.BufferGeometry {
  const segments = 28;
  const straight: number[] = [], bent: number[] = [], normalS: number[] = [], normalB: number[] = [], index: number[] = [];
  // Four faces around the length, each its own vertex strip so shading stays crisp.
  const faces: { n: Vec3; corners: [Vec3, Vec3] }[] = [
    { n: [0, 1, 0], corners: [[0, .5, -.5], [0, .5, .5]] },
    { n: [0, -1, 0], corners: [[0, -.5, .5], [0, -.5, -.5]] },
    { n: [0, 0, 1], corners: [[0, .5, .5], [0, -.5, .5]] },
    { n: [0, 0, -1], corners: [[0, -.5, -.5], [0, .5, -.5]] },
  ];
  const taper = (u: number) => .62 + .38 * Math.sin(Math.PI * u);
  const pushVertex = (x: number, y: number, z: number, n: Vec3) => {
    straight.push(x, y, z);
    normalS.push(n[0], n[1], n[2]);
    const phi = (x / length) * extent;
    const r = bendRadius + y;
    bent.push(r * Math.sin(phi), r * Math.cos(phi) - bendRadius, z);
    // The normal turns with the arc: rotate about z by phi.
    normalB.push(n[0] * Math.cos(phi) - n[1] * Math.sin(phi), n[0] * Math.sin(phi) + n[1] * Math.cos(phi), n[2]);
  };
  let base = 0;
  for (const face of faces) {
    for (let j = 0; j <= segments; j++) {
      const u = j / segments, x = (u - .5) * length, w = width * taper(u);
      for (const c of face.corners) pushVertex(x, c[1] * w, c[2] * thick, face.n);
    }
    for (let j = 0; j < segments; j++) {
      const a = base + j * 2, b = a + 1, c = a + 2, d = a + 3;
      index.push(a, c, b, b, c, d);
    }
    base += (segments + 1) * 2;
  }
  // End caps.
  for (const end of [-1, 1] as const) {
    const x = end * length / 2, w = width * taper(end < 0 ? 0 : 1);
    const n: Vec3 = [end, 0, 0];
    const corners: Vec3[] = [[x, -.5 * w, -.5 * thick], [x, .5 * w, -.5 * thick], [x, .5 * w, .5 * thick], [x, -.5 * w, .5 * thick]];
    for (const c of corners) pushVertex(c[0], c[1], c[2], n);
    if (end < 0) index.push(base, base + 2, base + 1, base, base + 3, base + 2);
    else index.push(base, base + 1, base + 2, base, base + 2, base + 3);
    base += 4;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(straight, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normalS, 3));
  geometry.morphAttributes.position = [new THREE.Float32BufferAttribute(bent, 3)];
  geometry.morphAttributes.normal = [new THREE.Float32BufferAttribute(normalB, 3)];
  geometry.setIndex(index);
  geometry.computeBoundingSphere();
  return geometry;
}

const Q_RING = new THREE.Quaternion(), Q_RIM = new THREE.Quaternion(), Q_SLOT = new THREE.Quaternion(), Q_OUT = new THREE.Quaternion();
const E = new THREE.Euler();

/* ------------------------------------------------------------------ title */

/**
 * The one typographic moment: the chapter's own line, set in the page's real
 * display face on canvases, as reflective planes with a layered extrusion
 * behind each word. Built once the face has loaded; until then the group is
 * empty, which is the same still frame the reduced-motion path shows.
 */
function buildTitle(res: Bin, text: string, rtl: boolean, font: string): THREE.Group {
  const group = new THREE.Group();
  const words = text.replace(/[.۔]+$/, '').split(/\s+/).filter(Boolean);
  if (words.length === 0 || typeof document === 'undefined') return group;
  const half = Math.ceil(words.length / 2);
  const lines = [words.slice(0, half), words.slice(half)].filter(l => l.length > 0);

  const draw = () => {
    const px = 320, pad = 40, gapPx = px * .22;
    const measure = document.createElement('canvas').getContext('2d');
    if (!measure) return;
    measure.font = font.replace(/\d+px/, `${px}px`);
    const lineWidths = lines.map(line => line.reduce((w, word) => w + measure.measureText(word).width + pad * 2, 0) + gapPx * (line.length - 1));
    const widest = Math.max(...lineWidths);
    const scale = 1.48 / widest; // units per canvas px: the widest line spans 1.48 units
    const lineStep = px * 1.06 * scale;
    let k = 0;
    lines.forEach((line, li) => {
      const y = ((lines.length - 1) / 2 - li) * lineStep;
      let cursor = -lineWidths[li] * scale / 2;
      const ordered = rtl ? [...line].reverse() : line;
      for (const word of ordered) {
        const canvas = document.createElement('canvas');
        const w = Math.ceil(measure.measureText(word).width + pad * 2), h = Math.ceil(px * 1.3);
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.font = measure.font;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.direction = rtl ? 'rtl' : 'ltr';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(word, w / 2, h * .53);
        const alpha = res.map(new THREE.CanvasTexture(canvas));
        alpha.anisotropy = 4;
        const plane = res.geo(new THREE.PlaneGeometry(w * scale, h * scale));
        const stack = new THREE.Group();
        stack.position.set(cursor + (w * scale) / 2, y, 0);
        // The face, then the extrusion behind it: each layer a little darker.
        const LAYERS = 7, step = .011;
        for (let i = 0; i < LAYERS; i++) {
          const face = i === 0;
          const material = res.mat(new THREE.MeshStandardMaterial({
            color: face ? 0xf6f8fb : SILVER_DARK, metalness: face ? .78 : .96, roughness: face ? .18 : .38,
            emissive: face ? 0x3a4656 : 0x000000, emissiveIntensity: face ? .3 : 0,
            alphaMap: alpha, transparent: true, alphaTest: .42, envMapIntensity: face ? 3.6 : .9,
          }));
          const mesh = new THREE.Mesh(plane, material);
          mesh.position.z = -i * step;
          stack.add(mesh);
        }
        stack.userData.index = k++;
        group.add(stack);
        cursor += w * scale + gapPx * scale;
      }
    });
  };

  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fonts?.load) fonts.load(font).then(draw, draw); else draw();
  return group;
}

/* ------------------------------------------------------------------ object */

/**
 * Media a stage needs from the route. Paths are resolved by the page, because
 * only the page knows the deployment's base URL, and the stage must never guess
 * one: a guessed path is a silently empty portal.
 */
export interface StageAssets {
  /** A frame of the published World whose interior the carton opens onto. */
  worldInterior?: string | null;
  /** Approved captures of the first real work entries, for the arrival. */
  arrival?: string[];
  /** The chapter line the fragments ring is entered through. */
  title?: string | null;
  rtl?: boolean;
  /** CSS font shorthand for the title, in the page's real display face. */
  font?: string | null;
}

/** Per-chapter view of one local progress: which ramps are live. */
interface Beat {
  /** The rim pieces lifting off and gathering into the ring. */
  assemble: number;
  /** The camera going through; the title clearing. */
  through: number;
  /** The ring pieces travelling into the structure. */
  structure: number;
  /** Local progress of the system chapter, for the mechanism. */
  system: number;
  /** Local progress of the matter chapter. */
  matter: number;
  /** Local progress of the world chapter. */
  world: number;
  /** Local progress of the archive, for the dissolve. */
  archive: number;
  chapter: string;
}

function beatOf(local: number, chapter: string): Beat {
  const isForge = chapter === 'forge', isSystem = chapter === 'system';
  const isMatter = chapter === 'matter', isWorld = chapter === 'world', isArchive = chapter === 'archive';
  const past = (id: string) => ['horizon', 'forge', 'system', 'matter', 'world', 'archive'].indexOf(chapter) > ['horizon', 'forge', 'system', 'matter', 'world', 'archive'].indexOf(id);
  return {
    assemble: isForge ? ramp(local, 0, .34) : past('forge') ? 1 : 0,
    through: isForge ? ramp(local, .34, 1) : past('forge') ? 1 : 0,
    structure: isSystem ? ramp(local, 0, .3) : past('system') ? 1 : 0,
    system: isSystem ? local : past('system') ? 1 : 0,
    matter: isMatter ? local : past('matter') ? 1 : 0,
    world: isWorld ? local : past('world') ? 1 : 0,
    archive: isArchive ? local : 0,
    chapter,
  };
}

export function objectStage(assets: StageAssets = {}): SurfaceStage {
  const res = bin(), object = new THREE.Group(), temp = new THREE.Object3D(), point = new THREE.Vector3();
  const handoff = surfaceHandoff();

  /* ------------------------------------------------------------ materials */
  const silver = res.mat(new THREE.MeshStandardMaterial({
    color: SILVER, metalness: .9, roughness: .38, envMapIntensity: 2.2,
    emissive: 0xbfd8ff, emissiveIntensity: 0,
  }));
  const graphite = res.mat(new THREE.MeshStandardMaterial({ color: 0x2b3640, roughness: .55, metalness: .35, envMapIntensity: .45 }));
  const satin = res.mat(new THREE.MeshStandardMaterial({ color: DEPTH, roughness: .36, metalness: .5, envMapIntensity: .45 }));
  const card = res.mat(new THREE.MeshStandardMaterial({ color: 0xc6ccd3, roughness: .78, metalness: 0 }));
  const inkEdge = res.mat(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .26 }));
  const accentEdge = res.mat(new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: .8 }));
  const accentRing = res.mat(new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: .25 }));

  const paper = paperTextures(0x5eed);
  res.map(paper.normal); res.map(paper.roughness);
  paper.normal.repeat.set(1.6, 1.6); paper.roughness.repeat.set(1.6, 1.6);
  const board = res.mat(new THREE.MeshStandardMaterial({
    color: BOARD, roughness: 1, metalness: 0, roughnessMap: paper.roughness,
    normalMap: paper.normal, normalScale: new THREE.Vector2(1.15, 1.15), envMapIntensity: .3,
  }));
  const boardInside = res.mat(new THREE.MeshStandardMaterial({
    color: BOARD_INSIDE, roughness: .82, metalness: .05, normalMap: paper.normal,
    normalScale: new THREE.Vector2(.3, .3), envMapIntensity: .12,
  }));
  // The cut edge of paperboard is paler and rougher than its face: the core showing.
  const cut = res.mat(new THREE.MeshStandardMaterial({ color: BOARD_CUT, roughness: 1, metalness: 0, envMapIntensity: .15 }));
  const crease = res.mat(new THREE.MeshBasicMaterial({
    color: 0x2a2620, alphaMap: res.map(creaseTexture()), transparent: true, opacity: .8, depthWrite: false,
  }));
  const contact = res.mat(new THREE.MeshBasicMaterial({
    color: 0x1a1f28, map: res.map(falloffTexture()), transparent: true, opacity: 0, depthWrite: false,
  }));
  const fading: THREE.Material[] = [];

  /* -------------------------------------------------------------- lights */
  // The structure is subordinate at the reading stop, but subordinate is not
  // unreadable: a key of its own keeps the gate and the held record legible.
  const key = new THREE.DirectionalLight(0xe8f0f8, 1.4);
  key.position.set(-2.5, 5, 6); object.add(key);
  // Paperboard under the shell's blue rim light reads as painted metal. The
  // board brings its own warm key, faded in as the material changes.
  const paperKey = new THREE.DirectionalLight(0xffe9c8, 0);
  paperKey.position.set(-4.5, 4.2, 6); object.add(paperKey);
  const paperFill = new THREE.DirectionalLight(0xe8dcc8, 0);
  paperFill.position.set(3.4, 1.2, 3); object.add(paperFill);
  // The macro light: a low, grazing spot on the seam. "The lighting changes."
  const graze = new THREE.SpotLight(0xffe4c4, 0, 7, .6, .85, 1.2);
  graze.position.set(-2.6, -.12, 1.7);
  graze.target.position.set(.3, DECK.top + .02, DECK.front);
  object.add(graze); object.add(graze.target);

  /* ------------------------------------------------------------ fragments */
  const aspect = () => handoff.aspect();
  interface Shard {
    mesh: THREE.Mesh;
    ring: ReturnType<typeof shardRing>;
    rim: ReturnType<typeof shardRim>;
    slot: typeof STRUCTURE[number];
    /** Formation order, decorrelated from index. */
    lag: number;
  }
  const shards: Shard[] = [];
  const random = mulberry32(0x5ee2);
  function buildShards() {
    for (const s of shards) { object.remove(s.mesh); s.mesh.geometry.dispose(); }
    shards.length = 0;
    const a = aspect();
    for (let i = 0; i < SHARDS; i++) {
      const ring = shardRing(i, a), rim = shardRim(i), slot = STRUCTURE[SLOT_OF[i]];
      const geometry = sliverGeometry(ring.length, ring.width, ring.thick, ring.radius, ring.extent);
      const mesh = new THREE.Mesh(geometry, silver);
      mesh.frustumCulled = false;
      object.add(mesh);
      shards.push({ mesh, ring, rim, slot, lag: random() * .28 });
    }
  }
  buildShards();

  /* -------------------------------------------------------------- title */
  const title = buildTitle(res, assets.title ?? '', !!assets.rtl, assets.font ?? '850 160px sans-serif');
  const th = Math.tan((42 * Math.PI / 180) / 2);
  const TITLE_DEPTH = 4;
  title.position.set(0, .06 * th * TITLE_DEPTH, 9 - TITLE_DEPTH);
  object.add(title);

  /* ------------------------------------------------------------ workflow */
  const workflow = new THREE.Group(); object.add(workflow);
  const box = (w: number, h: number, d: number, material: THREE.Material) =>
    new THREE.Mesh(res.geo(new THREE.BoxGeometry(w, h, d)), material);

  const deck = box(DECK.w, DECK.t, DECK.d, satin); deck.position.y = DECK.y; workflow.add(outline(res, deck, inkEdge));

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.6, .06, .18), new THREE.Vector3(-1.3, .1, -.06),
    new THREE.Vector3(0, .1, 0), new THREE.Vector3(1.3, .1, -.06), new THREE.Vector3(2.6, .06, .18),
  ]);
  workflow.add(new THREE.Mesh(res.geo(new THREE.TubeGeometry(curve, 72, .022, 6, false)), graphite));
  const PATH_SEGMENTS = 96, REVIEW = .455;
  const active = new THREE.Line(res.geo(new THREE.BufferGeometry().setFromPoints(curve.getPoints(PATH_SEGMENTS))), accentEdge);
  active.position.y = .03; active.frustumCulled = false; workflow.add(active);

  const nodes = new THREE.InstancedMesh(res.geo(new THREE.CylinderGeometry(.17, .17, .12, 6)), silver, 5);
  [.08, .26, .5, .74, .92].forEach((t, i) => {
    temp.position.copy(curve.getPoint(t, point)); temp.position.y -= .07;
    temp.rotation.set(0, Math.PI / 6, 0); temp.scale.setScalar(1); temp.updateMatrix();
    nodes.setMatrixAt(i, temp.matrix);
  });
  workflow.add(nodes);

  const holdX = curve.getPoint(REVIEW, point).x, gateX = curve.getPoint(.5, point).x;
  // The review gate. Its barrier is built closed and never animated: scrolling is not consent.
  const gate = new THREE.Group(); gate.position.x = gateX; workflow.add(gate);
  const barrier = box(.05, .1, .86, graphite); barrier.position.y = .1; gate.add(outline(res, barrier, inkEdge));
  const plate = box(.02, .17, .52, satin); plate.position.y = .47; gate.add(outline(res, plate, inkEdge));
  const jaws = [-1, 1].map(sign => {
    const jaw = box(.1, .16, .16, silver); jaw.position.set(holdX, .1, sign * .3); workflow.add(jaw);
    return { jaw, sign };
  });
  const record = box(.34, .012, .24, card); workflow.add(outline(res, record, inkEdge));
  const focusRing = new THREE.Mesh(res.geo(new THREE.TorusGeometry(.26, .012, 6, 28)), accentRing);
  focusRing.rotation.x = Math.PI / 2; workflow.add(focusRing);
  const inTray = box(.5, .06, .44, satin); inTray.position.set(-2.95, -.35, .18); workflow.add(outline(res, inTray, inkEdge));
  const queue = new THREE.InstancedMesh(res.geo(new THREE.BoxGeometry(.34, .012, .24)), card, 3);
  for (let i = 0; i < 3; i++) {
    temp.position.set(-2.95, -.3 + i * .018, .18); temp.rotation.set(0, .04 * i, 0);
    temp.scale.setScalar(1); temp.updateMatrix(); queue.setMatrixAt(i, temp.matrix);
  }
  workflow.add(queue);
  const outTray = box(.5, .06, .44, satin); outTray.position.set(2.95, -.35, .18); workflow.add(outline(res, outTray, inkEdge));
  const ROLLERS = 9;
  const rollers = new THREE.InstancedMesh(res.geo(new THREE.CylinderGeometry(.075, .075, 1.5, 8)), graphite, ROLLERS);
  rollers.frustumCulled = false; workflow.add(rollers);

  // The screen plane: a real rectangle, so its four projected corners are reportable.
  const screen = new THREE.Group(); workflow.add(screen);
  const screenSurface = new THREE.Mesh(
    res.geo(new THREE.PlaneGeometry(1.6, 1)),
    res.mat(new THREE.MeshStandardMaterial({ color: DEPTH, roughness: .3, metalness: .4, envMapIntensity: .4 })),
  );
  screen.add(outline(res, screenSurface, inkEdge));
  ([[0, .53, 1.72, .06], [0, -.53, 1.72, .06], [-.83, 0, .06, 1.12], [.83, 0, .06, 1.12]] as const).forEach(([x, y, w, h]) => {
    const bar = box(w, h, .05, silver); bar.position.set(x, y, -.02); screen.add(bar);
  });
  const stand = box(.09, .5, .09, silver); stand.position.set(0, -.78, -.02); screen.add(stand);
  fading.push(graphite, satin, card, inkEdge, accentEdge, accentRing, screenSurface.material as THREE.Material);

  /* -------------------------------------------------------------- carton */
  const T = CARTON.t, W = CARTON.w, H = CARTON.h, D = CARTON.d;
  const carton = new THREE.Group(); object.add(carton);
  const cartonHome = new THREE.Vector3(CARTON.centre[0], CARTON.centre[1], CARTON.centre[2]);
  const cartonRest = new THREE.Vector3(CARTON.rest[0], CARTON.rest[1], CARTON.rest[2]);
  // Which of the six faces of a panel is printed board and which is the dark
  // inside; the four thin faces are the cut edge. BoxGeometry order: +x -x +y -y +z -z.
  type Face = 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz';
  const FACE_INDEX: Record<Face, number> = { px: 0, nx: 1, py: 2, ny: 3, pz: 4, nz: 5 };
  const panel = (w: number, h: number, d: number, outside: Face, inside: Face) => {
    const materials: THREE.Material[] = [cut, cut, cut, cut, cut, cut];
    materials[FACE_INDEX[outside]] = board;
    materials[FACE_INDEX[inside]] = boardInside;
    return new THREE.Mesh(res.geo(new THREE.BoxGeometry(w, h, d)), materials);
  };
  /** A rounded crease along a hinge: fold compression, catching the light. */
  const hinge = (length: number, along: 'x' | 'z', radius = T * .9) => {
    const mesh = new THREE.Mesh(res.geo(new THREE.CylinderGeometry(radius, radius, length, 10, 1)), board);
    mesh.rotation.z = along === 'x' ? Math.PI / 2 : 0;
    if (along === 'z') mesh.rotation.x = Math.PI / 2;
    return mesh;
  };
  const creaseStrip = (length: number, along: 'x' | 'z') => {
    const mesh = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(along === 'x' ? length : .16, along === 'x' ? .16 : length)), crease);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  };

  const bottom = panel(W, T, D, 'ny', 'py'); bottom.position.y = -H / 2 - T / 2; carton.add(bottom);
  const shadow = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(W * 2.2, D * 2.4)), contact);
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -H / 2 - T - .012; carton.add(shadow);

  interface Hinge { pivot: THREE.Group; axis: 'x' | 'z'; sign: number; wall: THREE.Mesh }
  const wallHinge = (x: number, z: number, axis: 'x' | 'z', sign: number, w: number, d: number, outside: Face, inside: Face): Hinge => {
    const pivot = new THREE.Group(); pivot.position.set(x, -H / 2, z); carton.add(pivot);
    const wall = panel(w, H, d, outside, inside); wall.position.y = H / 2; pivot.add(wall);
    const roll = hinge(axis === 'x' ? w : d, axis); pivot.add(roll);
    return { pivot, axis, sign, wall };
  };
  const front = wallHinge(0, D / 2, 'x', 1, W, T, 'pz', 'nz');
  const back = wallHinge(0, -D / 2, 'x', -1, W, T, 'nz', 'pz');
  const left = wallHinge(-W / 2, 0, 'z', 1, T, D, 'nx', 'px');
  const right = wallHinge(W / 2, 0, 'z', -1, T, D, 'px', 'nx');
  // Crease shadows on the base along each wall foot.
  for (const [x, z, along] of [[0, D / 2 - .02, 'x'], [0, -D / 2 + .02, 'x'], [-W / 2 + .02, 0, 'z'], [W / 2 - .02, 0, 'z']] as const) {
    const strip = creaseStrip(along === 'x' ? W : D, along); strip.position.set(x, -H / 2 + .002, z); carton.add(strip);
  }

  // The front wall's return: folded in at the top, so the seam is a real fold
  // with a cut end showing the board's core. This is the edge the macro finds.
  const ret = new THREE.Group(); ret.position.set(0, H, T * .55); front.wall.parent!.add(ret);
  const returnFlap = panel(W, CARTON.ret, T, 'pz', 'nz'); returnFlap.position.y = CARTON.ret / 2; ret.add(returnFlap);
  ret.add(hinge(W, 'x', T));
  // The hull: the closed box's own extent, for fitting the camera to the object
  // rather than to its shadow, its light targets or the room inside it.
  const hull = new THREE.Mesh(res.geo(new THREE.BoxGeometry(W, H, D)), res.mat(new THREE.MeshBasicMaterial({ visible: false })));
  carton.add(hull);

  // The lid, hinged at the back wall's top; the tuck, hinged at the lid's front.
  const lid = new THREE.Group(); lid.position.y = H; back.pivot.add(lid);
  const lidPanel = panel(W, D, T, 'nz', 'pz'); lidPanel.position.y = D / 2; lid.add(lidPanel);
  lid.add(hinge(W, 'x'));
  const tuck = new THREE.Group(); tuck.position.y = D; lid.add(tuck);
  const tuckPanel = panel(W, CARTON.tuck, T, 'nz', 'pz'); tuckPanel.position.y = CARTON.tuck / 2; tuck.add(tuckPanel);
  tuck.add(hinge(W, 'x'));
  // The side walls' dust flaps, folded in under the lid.
  const dusts = [left, right].map((side, i) => {
    const flap = new THREE.Group(); flap.position.y = H; side.pivot.add(flap);
    const flapPanel = panel(T, CARTON.dust, D, i === 0 ? 'nx' : 'px', i === 0 ? 'px' : 'nx'); flapPanel.position.y = CARTON.dust / 2; flap.add(flapPanel);
    flap.add(hinge(D, 'z'));
    return { flap, sign: i === 0 ? -1 : 1 };
  });

  // The opening: an invisible plane on the front face, so the camera can be
  // fitted to the threshold itself during the approach.
  const doorway = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(W, H)), res.mat(new THREE.MeshBasicMaterial({ visible: false })));
  doorway.position.z = D / 2; carton.add(doorway);

  /**
   * The evidence: the tool that produced the dieline, on its own stand, beside
   * the object it produced. Distinct — a screen is not a carton — but on the
   * same deck, in the same light, at the same moment.
   */
  const boxScreen = new THREE.Group();
  boxScreen.position.set(CARTON.centre[0] + W * .5 + 2.1, CARTON.centre[1] + .55, CARTON.centre[2] - 2);
  object.add(boxScreen);
  const boxScreenMat = res.mat(new THREE.MeshStandardMaterial({ color: DEPTH, roughness: .3, metalness: .4, envMapIntensity: .4, transparent: true, opacity: 0 }));
  const boxSurface = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(1.92, 1.2)), boxScreenMat);
  boxScreen.add(outline(res, boxSurface, res.mat(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .18 }))));
  ([[0, .64, 2.06, .05], [0, -.64, 2.06, .05], [-.99, 0, .05, 1.33], [.99, 0, .05, 1.33]] as const)
    .forEach(([x, y, w, h]) => { const bar = box(w, h, .05, silver); bar.position.set(x, y, -.02); boxScreen.add(bar); });
  const boxStand = box(.09, .52, .09, silver); boxStand.position.set(0, -.9, -.02); boxScreen.add(boxStand);

  /* --------------------------------------------------------------- room */
  // Inside the box, the World. The far wall carries a frame of the published
  // Cake Studio world; the box's own dark interior is the room around it, and
  // it scales up around the camera at the crossing, so the same walls that
  // occluded the frame from outside are the walls of the room inside.
  const room = new THREE.Group(); carton.add(room);
  const farMaterial = res.mat(new THREE.MeshBasicMaterial({ color: 0x0f1a19 }));
  const far = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(W - T * 2, H - T * 2)), farMaterial);
  far.position.set(0, 0, -D / 2 + T * 1.6); room.add(far);
  if (assets.worldInterior) {
    new THREE.TextureLoader().load(assets.worldInterior, (texture: THREE.Texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      res.map(texture);
      farMaterial.map = texture; farMaterial.color.setHex(0xffffff); farMaterial.needsUpdate = true;
    });
  }
  const vignette = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(W - T * 2, H - T * 2)),
    res.mat(new THREE.MeshBasicMaterial({ color: 0x050a09, alphaMap: res.map(vignetteTexture()), transparent: true, opacity: .92, depthWrite: false })));
  vignette.position.set(0, 0, -D / 2 + T * 1.6 + .004); room.add(vignette);
  // Warm light through the opening: a key from inside the World, and a glow near the sill.
  const warmKey = new THREE.DirectionalLight(0xffd2a0, 0);
  warmKey.position.set(-.4, .5, -.2); warmKey.target.position.set(0, -.2, 1.2); room.add(warmKey); room.add(warmKey.target);
  const warmGlow = new THREE.PointLight(0xffc48a, 0, 0, 2);
  warmGlow.position.set(0, .12, -.15); room.add(warmGlow);
  room.visible = false;

  /* ------------------------------------------------------------- state */
  let progress = 0, chapter = 'horizon', beat = beatOf(0, 'horizon');
  let surface: THREE.Object3D | null = null, chrome: THREE.Object3D | null = null;
  let warmth = 0, paperAmount = 0;
  const paperMats = [board, boardInside, cut, crease];
  for (const m of [...paperMats, silver]) m.transparent = false;

  function setFade(materials: THREE.Material[], opacity: number) {
    const on = opacity < .999;
    for (const m of materials) {
      if (m.transparent !== on) { m.transparent = on; m.needsUpdate = true; }
      m.opacity = on ? opacity : 1;
    }
  }

  return {
    object,
    get surface() { return surface; },
    get chrome() { return chrome; },
    linger: ['horizon', 'archive'],
    setCamera(next, size) {
      handoff.setCamera(next, size);
      buildShards();
      // The title is set for a wide frame; a narrow one gets it smaller rather
      // than cropped, and the fly-through clears it sooner (see update).
      const a = handoff.aspect();
      title.scale.setScalar(a < 1 ? .72 : Math.min(1, (.84 * 2 * TITLE_DEPTH * th * a) / 1.48));
    },
    warmth: () => warmth,
    paper: () => paperAmount,
    focus() {
      if (chapter === 'matter') return { object: hull, fit: ramp(progress, .4, .56) * (1 - ramp(progress, .7, .78)) };
      if (chapter === 'world') return { object: doorway, fit: ramp(progress, .06, .2) * (1 - ramp(progress, .34, .46)) };
      return null;
    },
    handoff() {
      if (chapter === 'system') {
        const leave = 1 - ramp(progress, .965, 1);
        return handoff.rect(screenSurface, ramp(progress, .33, .49) * leave, ramp(progress, .19, .33) * leave);
      }
      if (chapter === 'matter') {
        // The previous chapter's fit lets go over the first tenth, so the camera
        // eases from the fitted pose back onto the authored path instead of jumping.
        if (progress < .1) return handoff.rect(screenSurface, 0, 1 - ramp(progress, 0, .1));
        const leave = 1 - ramp(progress, .965, 1);
        return handoff.rect(boxSurface, ramp(progress, .8, .86) * leave, ramp(progress, .74, .8) * leave);
      }
      if (chapter === 'world') {
        if (progress < .08) return handoff.rect(boxSurface, 0, 1 - ramp(progress, 0, .08));
        return handoff.rect(far, ramp(progress, .62, .72), ramp(progress, .5, .62));
      }
      return null;
    },
    update(local, time, ctx: StageContext) {
      progress = clamp(local, 0, 1);
      chapter = ctx.chapter;
      beat = beatOf(progress, chapter);
      const b = beat;

      /* ----------------------------------------------------- fragments */
      // Rim → ring → structure. Every fragment's pose is a blend of three
      // authored poses by two ramps, so any progress reconstructs it.
      const emissiveAt = chapter === 'horizon' ? 1.35 : chapter === 'forge' ? .22 + 1.13 * (1 - ramp(b.assemble, .05, .6)) : 0;
      silver.emissiveIntensity = emissiveAt;
      for (const s of shards) {
        const gather = ramp(b.assemble, s.lag, s.lag + .72);
        const travel = ramp(b.structure, s.lag * .6, s.lag * .6 + .82);
        const { mesh, ring, rim, slot } = s;
        E.set(0, 0, rim.roll); Q_RIM.setFromEuler(E);
        E.set(0, 0, ring.angle + Math.PI / 2); Q_RING.setFromEuler(E);
        E.set(0, slot.axis === 'z' ? Math.PI / 2 : 0, slot.axis === 'y' ? Math.PI / 2 : 0); Q_SLOT.setFromEuler(E);
        if (travel <= 0) {
          // Off the limb and into the ring, bulging toward the eye on the way.
          const bulge = Math.sin(Math.PI * gather);
          mesh.position.set(
            lerp(rim.position[0], ring.position[0], gather) + bulge * .5 * Math.sign(ring.position[0] || 1),
            lerp(rim.position[1], ring.position[1], gather) + bulge * .9,
            lerp(rim.position[2], ring.position[2], gather) + bulge * 1.6,
          );
          Q_OUT.slerpQuaternions(Q_RIM, Q_RING, smooth(gather));
          mesh.quaternion.copy(Q_OUT);
          const s0 = 2.2 + (1 - 2.2) * gather;
          mesh.scale.setScalar(s0);
          mesh.morphTargetInfluences![0] = gather;
        } else {
          const bulge = Math.sin(Math.PI * travel);
          mesh.position.set(
            lerp(ring.position[0], slot.position[0], travel) + bulge * .3,
            lerp(ring.position[1], slot.position[1], travel) + bulge * .8,
            lerp(ring.position[2], slot.position[2], travel) - bulge * .4,
          );
          Q_OUT.slerpQuaternions(Q_RING, Q_SLOT, smooth(travel));
          mesh.quaternion.copy(Q_OUT);
          const stretch = Math.pow(travel, 2.4);
          mesh.scale.set(
            lerp(1, slot.length / ring.length, stretch),
            lerp(1, slot.width / ring.width, travel),
            lerp(1, slot.thick / ring.thick, travel),
          );
          mesh.morphTargetInfluences![0] = 1 - travel;
        }
      }
      // Through the ring the fragments keep still; a breath while the story moves.
      const still = chapter === 'forge' ? .012 * life(b.through) : 0;
      if (still > 0) for (const s of shards) s.mesh.position.y += Math.sin(time * .7 + s.lag * 9) * still;

      /* --------------------------------------------------------- title */
      const narrow = handoff.aspect() < 1;
      const titleIn = chapter === 'forge' ? ramp(progress, .22, .36) * (1 - ramp(progress, narrow ? .52 : .74, narrow ? .72 : .92)) : 0;
      const separate = chapter === 'forge' ? ramp(progress, .36, .7) : 0;
      const clear = chapter === 'forge' ? ramp(progress, narrow ? .5 : .72, narrow ? .74 : .94) : 0;
      title.visible = titleIn > .001;
      title.children.forEach((stack, i) => {
        const k = ((stack.userData.index as number | undefined) ?? i) - (title.children.length - 1) / 2;
        stack.position.z = separate * k * .42;
        // Clearing: the words drift outward radially so the camera passes between them.
        const away = 1 + clear * 1.6;
        stack.scale.setScalar(1);
        const home = stack.userData.home as THREE.Vector2 | undefined;
        if (!home) stack.userData.home = new THREE.Vector2(stack.position.x, stack.position.y);
        const h = stack.userData.home as THREE.Vector2;
        stack.position.x = h.x * away; stack.position.y = h.y * away + clear * .35;
        stack.traverse((node) => {
          const m = (node as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
          if (m && m.isMaterial) m.opacity = titleIn;
        });
      });

      /* ------------------------------------------------------ workflow */
      const sys = b.system;
      const mechanism = chapter === 'system' ? ramp(progress, .02, .2) : b.system > 0 ? 1 : 0;
      workflow.visible = mechanism > .001 && (chapter === 'system' || chapter === 'matter' || chapter === 'forge');
      const travelled = REVIEW * ramp(sys, .3, .5), held = ramp(sys, .48, .58), breath = life(sys);
      curve.getPoint(travelled, point);
      record.position.set(point.x, point.y + .05 + held * .03 + breath * Math.sin(time * .9) * .011, point.z);
      record.rotation.set(0, 0, held * -.1);
      focusRing.position.set(record.position.x, record.position.y - .012, record.position.z);
      accentRing.opacity = .22 + held * .34;
      active.geometry.setDrawRange(0, Math.round(travelled * PATH_SEGMENTS) + 1);
      jaws.forEach(({ jaw, sign }) => { jaw.position.set(holdX, .1 + held * .02, sign * (.3 - held * .13)); });
      const spin = sys * 5.6 + Math.sin(time * .4) * .07 * breath;
      for (let i = 0; i < ROLLERS; i++) {
        temp.position.set(-2.4 + i * .6, -.2, 0); temp.rotation.set(Math.PI / 2, spin + i * .21, 0);
        temp.scale.setScalar(1); temp.updateMatrix(); rollers.setMatrixAt(i, temp.matrix);
      }
      rollers.instanceMatrix.needsUpdate = true;
      const present = ramp(sys, .28, .47);
      screen.position.set(2.42, .58 + present * .06, present * .14);
      screen.rotation.set(0, (1 - present) * -.55, 0);
      if (chapter === 'system') handoff.align(screen, ramp(sys, .19, .33));
      screen.visible = chapter === 'system' && present > .01;
      // The structure fades as the camera dives onto the rail; the rail itself
      // is the last to go, and it goes as paper arrives.
      const dive = chapter === 'matter' ? ramp(progress, .04, .28) : chapter === 'world' || chapter === 'archive' ? 1 : 0;
      const structureFade = 1 - dive;
      setFade(fading, mechanism * structureFade);
      const railFade = chapter === 'matter' ? 1 - ramp(progress, .14, .3) : dive >= 1 ? 0 : 1;
      for (const s of shards) {
        const isRail = SLOT_OF[shards.indexOf(s)] === 0;
        s.mesh.visible = (isRail ? railFade : structureFade) > .01 && chapter !== 'world' && chapter !== 'archive';
      }
      setFade([silver], chapter === 'matter' ? railFade : 1);

      /* ---------------------------------------------------------- paper */
      const m = b.matter;
      const paperIn = chapter === 'matter' ? ramp(progress, .12, .3) : m > 0 || chapter === 'world' ? 1 : 0;
      paperAmount = chapter === 'archive' ? 1 - ramp(b.archive, 0, .35) : paperIn;
      paperKey.intensity = 2.4 * paperIn; paperFill.intensity = .55 * paperIn;
      graze.intensity = chapter === 'matter' ? 18 * ramp(progress, .08, .26) * (1 - ramp(progress, .36, .52)) : 0;
      carton.visible = paperIn > .001 || chapter === 'world' || (chapter === 'archive' && b.archive < .35);
      setFade(paperMats, paperIn);

      // Folding. The front wall stands from the start — it IS the rail — and the
      // rest of the dieline rises around it as the camera pulls back.
      const w = b.world;
      const sideFold = m >= 1 ? 1 : ramp(m, .36, .46), backFold = m >= 1 ? 1 : ramp(m, .4, .5);
      const dustFold = m >= 1 ? 1 : ramp(m, .44, .52);
      const lidFold = chapter === 'world' ? 1 - .8 * ramp(w, .04, .22) : m >= 1 ? 1 : ramp(m, .48, .56);
      const tuckFold = chapter === 'world' ? 1 - ramp(w, 0, .1) : m >= 1 ? 1 : ramp(m, .53, .58);
      const frontFold = chapter === 'world' ? 1 - ramp(w, .12, .3) : 1;
      front.pivot.rotation.x = (1 - frontFold) * Math.PI / 2;
      back.pivot.rotation.x = -(1 - backFold) * Math.PI / 2;
      left.pivot.rotation.z = (1 - sideFold) * Math.PI / 2;
      right.pivot.rotation.z = -(1 - sideFold) * Math.PI / 2;
      lid.rotation.x = lidFold * Math.PI / 2;
      tuck.rotation.x = tuckFold * Math.PI / 2;
      ret.rotation.x = Math.PI;
      dusts.forEach(({ flap, sign }) => { flap.rotation.z = sign * -dustFold * Math.PI / 2; });
      crease.opacity = .8 * Math.max(sideFold, backFold) * paperIn;
      contact.opacity = (.55 + .3 * backFold) * paperIn * (chapter === 'world' ? 1 - ramp(w, .3, .5) : 1);

      // The object's own interval is over, and it gets out of the way before the
      // capture arrives. It is never dimmed under the screenshot: it leaves the band.
      const leaveBand = chapter === 'matter' ? ramp(progress, .7, .78) : m >= 1 ? 1 : 0;
      carton.position.lerpVectors(cartonHome, cartonHome.clone().add(cartonRest), leaveBand);
      carton.rotation.y = chapter === 'matter' ? (1 - ramp(progress, .3, .58)) * -.55 + .62 - leaveBand * .38 : .24;
      // The crossing: the box grows around the opening until the box is the room.
      // It grows deeper than it grows wide, so the far wall recedes into a hall
      // and can be read from inside beside the copy; on a phone the frame is
      // narrower, so the hall is narrower too.
      const g = chapter === 'world' ? ramp(w, .3, .56) : chapter === 'archive' ? 1 : 0;
      const portrait = handoff.aspect() < 1;
      const grow = 1 + (portrait ? 2.2 : 3.4) * g, growZ = 1 + 11 * g;
      carton.scale.set(grow, grow, growZ);
      // Scale about the opening's centre, which is at (0, 0, D/2) in the box's frame.
      const pivotWorld = new THREE.Vector3(0, 0, (D / 2) * (1 - growZ)).applyEuler(carton.rotation);
      carton.position.add(pivotWorld);

      const arrive = chapter === 'matter' ? ramp(progress, .76, .84) * (1 - ramp(progress, .965, 1)) : 0;
      boxScreen.visible = arrive > .01;
      boxScreen.rotation.set(0, (1 - arrive) * .46 - .2, 0);
      if (chapter === 'matter') handoff.align(boxScreen, ramp(progress, .74, .8));
      boxScreenMat.opacity = arrive;

      /* ---------------------------------------------------------- room */
      const open = chapter === 'world' ? ramp(w, .04, .3) : chapter === 'archive' ? 1 : 0;
      room.visible = open > .001;
      warmKey.intensity = 1.6 * open;
      warmGlow.intensity = 3.2 * open * grow * growZ * .32;
      // The board's own key turns warm as the World's light reaches it, so the
      // shell is contaminated before the crossing, not only the lid.
      paperKey.color.setHex(0xffe9c8).lerp(new THREE.Color(0xffc48e), open * .8);
      paperFill.color.setHex(0xe8dcc8).lerp(new THREE.Color(0xd9a37a), open * .8);
      warmth = chapter === 'world' ? ramp(w, .1, .5) : chapter === 'archive' ? 1 - ramp(b.archive, 0, .35) : 0;
      // The frame's rectangle dissolves into the dark walls once the camera is inside.
      (vignette.material as THREE.MeshBasicMaterial).opacity = .92 - .5 * ramp(w, .5, .7);

      /* ------------------------------------------------------ archive */
      if (chapter === 'archive') {
        const gone = ramp(b.archive, 0, .35);
        setFade(paperMats, 1 - gone);
        farMaterial.transparent = true; farMaterial.opacity = 1 - gone;
        (vignette.material as THREE.MeshBasicMaterial).opacity = .92 * (1 - gone);
        carton.visible = gone < .999;
        room.visible = gone < .999;
      } else if (farMaterial.transparent) { farMaterial.transparent = false; farMaterial.opacity = 1; }

      /* ------------------------------------------------------ handoff */
      surface = chapter === 'system' ? screenSurface : chapter === 'matter' ? (progress < .1 ? screenSurface : boxSurface) : chapter === 'world' ? (progress < .08 ? boxSurface : far) : null;
      chrome = chapter === 'system' ? screen : chapter === 'matter' && progress >= .1 ? boxScreen : null;
    },
    dispose() { object.clear(); res.dispose(); for (const s of shards) s.mesh.geometry.dispose(); },
  };
}

/* ------------------------------------------------------------------ arrival */

/**
 * The end of the film is four real project captures settling into the places the
 * real cards are about to occupy. These are not a second catalogue and not
 * invented art: they are the same approved screenshots the four public cards
 * below the scene carry, arriving in the same arrangement.
 */
export function arrivalStage(assets: StageAssets = {}): ArtifactStage {
  const res = bin(), object = new THREE.Group();
  const urls = (assets.arrival ?? []).slice(0, 4);
  const random = mulberry32(0xa771);

  const COLS = 2, W = 2.05, H = 1.27, GAP_X = 2.28, GAP_Y = 1.52;
  const cards = urls.map((url, i) => {
    const col = i % COLS, row = Math.floor(i / COLS);
    const rest = new THREE.Vector3(
      (col - (COLS - 1) / 2) * GAP_X,
      ((Math.ceil(urls.length / COLS) - 1) / 2 - row) * GAP_Y,
      0,
    );
    const from = new THREE.Vector3(
      rest.x + (random() - 0.5) * 2.2,
      rest.y + (random() - 0.5) * 1.4,
      -1.6 - random() * 3.2,
    );
    const material = res.mat(new THREE.MeshBasicMaterial({
      color: 0x0b1017, transparent: true, opacity: 0, depthWrite: false,
    }));
    const mesh = new THREE.Mesh(res.geo(new THREE.PlaneGeometry(W, H)), material);
    // Drawn after the point cloud, so the grid sits behind the captures.
    mesh.renderOrder = 2;
    mesh.position.copy(from);
    object.add(outline(res, mesh, res.mat(new THREE.LineBasicMaterial({
      color: INK, transparent: true, opacity: .16,
    }))));
    new THREE.TextureLoader().load(url, (texture: THREE.Texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      res.map(texture);
      material.map = texture;
      material.color.setHex(0xffffff);
      material.needsUpdate = true;
    });
    return { mesh, material, from, rest, lag: (i / Math.max(1, urls.length)) * 0.22 };
  });

  return {
    object,
    update(local) {
      const progress = clamp(local, 0, 1);
      for (const card of cards) {
        const settle = ramp(progress, .08 + card.lag, .62 + card.lag);
        card.mesh.position.lerpVectors(card.from, card.rest, settle);
        card.mesh.rotation.y = (1 - settle) * -.5;
        card.material.opacity = settle;
      }
    },
    dispose() { object.clear(); res.dispose(); },
  };
}

export const STAGES: Record<ArtifactId, (assets: StageAssets) => ArtifactStage> = {
  object: objectStage,
  arrival: arrivalStage,
};

/** Unused palette entries are kept so the recorded system stays one list. */
export const PALETTE = { DEPTH, INK, INK_DIM, ACCENT, SILVER, BOARD };
