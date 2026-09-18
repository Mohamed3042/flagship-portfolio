/**
 * "From Signal to Systems" — the particle target sets, and the geometry every
 * stage is built to.
 *
 * Point identity is the array index and is shared by every shape: index i plays
 * the same role everywhere (anchor, then principal edge, then interior detail),
 * so a morph is an index-wise interpolation and the formation grammar — anchors
 * settle first, edges follow, detail last — is staging on index alone.
 *
 * Every builder reseeds its own stream from a fixed per-shape seed, so the same
 * count yields byte-identical arrays however the caller arrived: forward, back,
 * anchor jump or restored history.
 *
 * The constants published here — the rim, the ring, the seam, the deck and the
 * carton — are the ONE description of where each object is. A stage that
 * restated them would drift, and two copies of a number is how a bright rim
 * ends up drawn inside the silhouette it is supposed to be the edge of.
 */
import type { CameraPose, ShapeBuilder, ShapeContext, ShapeId, ShapeTarget } from './types';

const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** mulberry32. Explicit state, no global entropy, never reseeded mid-shape. */
export function prng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEEDS: Record<ShapeId | 'paper', number> = {
  aperture: 0xa9e70c, emblem: 0xe3b10a, structure: 0x57a0c7,
  carton: 0xca8701, constellation: 0xc057e1, paper: 0x9a9e80,
};

/* ---------------------------------------------------------------- partition */

/** Silhouette anchors. Weights near 1, and the first points to arrive in a morph. */
export const ANCHOR_SHARE = 0.12;
/** Principal edges: the contours that make the shape readable once anchors hold. */
export const EDGE_SHARE = 0.4;

export interface Partition { anchors: number; edges: number; interior: number }

export function partition(count: number): Partition {
  const anchors = Math.min(count, Math.max(count > 0 ? 1 : 0, Math.round(count * ANCHOR_SHARE)));
  const edges = Math.min(count - anchors, Math.max(0, Math.round(count * EDGE_SHARE)));
  return { anchors, edges, interior: count - anchors - edges };
}

/** Default brightness ramp. Shapes that carry meaning in weight override it. */
function ramp(i: number, part: Partition, r: number): number {
  if (i < part.anchors) return 0.9 + r * 0.1;
  if (i < part.anchors + part.edges) return 0.5 + r * 0.22;
  return 0.14 + r * 0.2;
}

/* ------------------------------------------------------------------- tools */

function put(a: Float32Array, i: number, x: number, y: number, z: number): void {
  a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z;
}

export type Vec3 = [number, number, number];

const cross = (a: Vec3, b: Vec3): Vec3 =>
  [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Normalise, falling back to `axis` when the input is degenerate. */
function unit(v: Vec3, axis: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]);
  return len < 1e-6 ? axis : [v[0] / len, v[1] / len, v[2] / len];
}

/** Golden-ratio sequence: any prefix of indices already covers the whole figure. */
const gold = (i: number) => (i * 0.6180339887498949) % 1;
/** Plastic-number sequence, decorrelated from `gold` for a second per-index axis. */
const gold2 = (i: number) => (i * 0.7548776662466927) % 1;

/** Walk the perimeter of a centred rectangle, s in [0,1). */
function onRect(s: number, halfW: number, halfH: number): [number, number] {
  const w = halfW * 2, h = halfH * 2;
  const d = (((s % 1) + 1) % 1) * (w + h) * 2;
  if (d < w) return [-halfW + d, -halfH];
  if (d < w + h) return [halfW, -halfH + (d - w)];
  if (d < w * 2 + h) return [halfW - (d - w - h), halfH];
  return [-halfW, halfH - (d - w * 2 - h)];
}

/** Compress each cell of a 0..1 walk into `duty`, leaving the rest as a gap. */
function dash(s: number, cells: number, duty: number): number {
  const cell = Math.floor(s * cells);
  return (cell + (s * cells - cell) * duty) / cells;
}

function sampler(points: Vec3[]): (t: number) => Vec3 {
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    total += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    lengths.push(total);
  }
  return (t: number) => {
    const d = clamp(t, 0, 1) * total;
    let seg = 0;
    while (seg < lengths.length - 1 && d > lengths[seg]) seg++;
    const from = seg === 0 ? 0 : lengths[seg - 1];
    const span = lengths[seg] - from || 1;
    const k = (d - from) / span;
    const a = points[seg], b = points[seg + 1];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  };
}

/**
 * Mid-flight displacement: outward from the scene centre with a deterministic
 * swirl, sized to the distance a point covers in a typical morph. Detail points
 * take the wider arc, anchors the tightest, so the formation reads as settling.
 */
function finish(count: number, positions: Float32Array, weights: Float32Array, random: () => number): ShapeTarget {
  const flow = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2];
    const radial = Math.hypot(x, y, z) || 1, ground = Math.hypot(x, z) || 1;
    const swirl = (random() - 0.5) * 0.7;
    const fx = x / radial + (-z / ground) * swirl;
    const fy = (y / radial) * 0.6 + (random() - 0.5) * 0.4;
    const fz = z / radial + (x / ground) * swirl;
    const mag = Math.hypot(fx, fy, fz) || 1;
    const reach = (0.19 + random() * 0.14) * (1.18 - weights[i] * 0.36);
    put(flow, i, (fx / mag) * reach, (fy / mag) * reach, (fz / mag) * reach);
  }
  return { positions, weights, flow };
}

/* ------------------------------------------------------------- the geometry */

/** The pose the ring reads flat from, and the pose the horizon lands on. */
export const ALIGNMENT_CAMERA: CameraPose = { position: [0, 0, 9], look: [0, 0, 0], fov: 42 };

const RIM_RADIUS = 15.4, RIM_CENTRE_Y = -14.6, RIM_Z = -3.1, RIM_SPAN = 7.4;

/**
 * The opening limb, published so the renderer frames the camera on the real
 * geometry and stands the dark mass on the same plane as the lit edge.
 */
export const RIM = {
  radius: RIM_RADIUS,
  centreY: RIM_CENTRE_Y,
  z: RIM_Z,
  span: RIM_SPAN,
  /** Highest point of the arc, at x = 0. */
  crest: [0, RIM_CENTRE_Y + RIM_RADIUS, RIM_Z] as Vec3,
  /** Height of the arc at x, in the rim's plane. */
  arcY: (x: number) => RIM_CENTRE_Y + Math.sqrt(Math.max(RIM_RADIUS * RIM_RADIUS - x * x, 0)),
  /**
   * Where the light grazes the limb hardest and the flare sits: on the arc,
   * toward the side the key comes from.
   */
  flare: [2.4, RIM_CENTRE_Y + Math.sqrt(RIM_RADIUS * RIM_RADIUS - 2.4 * 2.4), RIM_Z] as Vec3,
  /** World direction TO the light that grazes the limb: behind and above the mass, from the flare's side. */
  light: unit([3.2, 2.6, -4.4], [0, 1, 0]),
};

/**
 * The workflow's floor. Its front edge is the seam the whole middle of the film
 * turns on: the front rail lies along it in the workflow, and the carton's front
 * wall stands on it once the rail has been looked at closely enough.
 */
export const DECK = { w: 6.4, t: 0.12, d: 2.6, y: -0.44, top: -0.38, front: 1.3 };

/** The seam: one line in world space that is a rail, then a fold. */
export const SEAM = { x: [-0.87, 0.87] as [number, number], y: DECK.top + 0.02, z: DECK.front };

/**
 * The cake carton, in scene units. Its top edge IS the seam, so the box hangs
 * from the rail line rather than standing on a second, restated floor. A cake
 * box opens at the front: the lid lifts and the front wall folds down, which is
 * what later makes the opening a threshold the camera can cross.
 */
export const CARTON = {
  w: 1.74, d: 1.2, h: 0.98,
  /** Board thickness. */
  t: 0.024,
  /** The front wall's return, folded inward at its top: the fold the macro reveals. */
  ret: 0.26,
  /** The lid's front tuck flap. */
  tuck: 0.3,
  /** The side walls' dust flaps, folded in under the lid. */
  dust: 0.3,
  centre: [0, SEAM.y - 0.49, SEAM.z - 0.6] as Vec3,
  /** Where the box rests once the evidence has the frame; it leaves the band, it is never dimmed. */
  rest: [-2.6, -0.75, -2.6] as Vec3,
};

/* ------------------------------------------------------------- the fragments */

/**
 * The fragment ring: nine pieces of the rim, each an arc, distributed along the
 * alignment camera's viewing rays so that from that one pose they project to
 * one broken ring and from any other they are a tunnel. `ndc` is the ring's
 * radius as a fraction of the frame's shorter half-extent, so it fits a phone
 * as well as a wide screen.
 */
export const RING = { ndc: 0.56, centreNdcY: 0.06, depth: [1.6, 5.4] as [number, number] };
export const SHARDS = 9;

/** Angular slot, arc extent (degrees) and depth share of each fragment; where on the rim it breaks from. */
const SHARD_SLOT = [
  { angle: 12, extent: 38, depth: 0.62, rimX: -3.9 },
  { angle: 58, extent: 26, depth: 0.18, rimX: -2.6 },
  { angle: 96, extent: 44, depth: 0.86, rimX: -1.3 },
  { angle: 143, extent: 30, depth: 0.35, rimX: -0.2 },
  { angle: 176, extent: 22, depth: 0.05, rimX: 0.9 },
  { angle: 214, extent: 40, depth: 0.72, rimX: 1.9 },
  { angle: 252, extent: 28, depth: 0.48, rimX: 2.8 },
  { angle: 292, extent: 46, depth: 0.95, rimX: 3.7 },
  { angle: 338, extent: 24, depth: 0.26, rimX: 4.5 },
];

export interface ShardRing {
  /** Centre of the arc's chord, world space. */
  position: Vec3;
  /** Angle of the fragment's centre around the ring, radians. */
  angle: number;
  /** Arc extent, radians. */
  extent: number;
  /** Radius of the ring at this fragment's depth. */
  radius: number;
  /** Distance from the alignment eye. */
  depth: number;
  /** Straight length, width and thickness the piece is built at. */
  length: number;
  width: number;
  thick: number;
}

const tanHalf = (fov: number) => Math.tan((fov * DEG) / 2);

/** Fragment i at the ring, for a frame of the given aspect. Pure. */
export function shardRing(i: number, aspect: number): ShardRing {
  const slot = SHARD_SLOT[i % SHARDS];
  const a = Number.isFinite(aspect) && aspect > 0.05 ? aspect : 1;
  const depth = RING.depth[0] + (RING.depth[1] - RING.depth[0]) * slot.depth;
  const th = tanHalf(ALIGNMENT_CAMERA.fov);
  const radius = RING.ndc * Math.min(a, 1) * th * depth;
  const angle = slot.angle * DEG, extent = slot.extent * DEG;
  const eye = ALIGNMENT_CAMERA.position;
  const cy = RING.centreNdcY * th * depth;
  const width = 0.028 + 0.012 * depth;
  return {
    position: [eye[0] + Math.cos(angle) * radius, eye[1] + cy + Math.sin(angle) * radius, eye[2] - depth],
    angle, extent, radius, depth,
    length: radius * extent,
    width,
    thick: width * 0.46,
  };
}

/** Where fragment i sits on the rim before the fracture: tangent to the limb, in the rim's plane. */
export function shardRim(i: number): { position: Vec3; roll: number } {
  const x = SHARD_SLOT[i % SHARDS].rimX;
  return { position: [x, RIM.arcY(x), RIM.z + 0.05], roll: Math.atan2(-x, Math.sqrt(RIM_RADIUS * RIM_RADIUS - x * x)) };
}

export type Axis = 'x' | 'y' | 'z';
export interface ShardSlot { position: Vec3; axis: Axis; length: number; width: number; thick: number }

/**
 * The nine pieces of structure the fragments become: two rails, two gate posts,
 * a gate header, four boundary stanchions. Assigned so the longest fragments
 * take the longest members and none is stretched past recognition.
 */
export const STRUCTURE: ShardSlot[] = [
  { position: [0, DECK.top + 0.03, DECK.front], axis: 'x', length: DECK.w, width: 0.07, thick: 0.06 },
  { position: [0, DECK.top + 0.03, -DECK.front], axis: 'x', length: DECK.w, width: 0.07, thick: 0.06 },
  { position: [0, -0.05, -0.46], axis: 'y', length: 0.78, width: 0.08, thick: 0.08 },
  { position: [0, -0.05, 0.46], axis: 'y', length: 0.78, width: 0.08, thick: 0.08 },
  { position: [0, 0.34, 0], axis: 'z', length: 1.0, width: 0.09, thick: 0.09 },
  { position: [-3.05, -0.14, -1.15], axis: 'y', length: 0.5, width: 0.07, thick: 0.07 },
  { position: [3.05, -0.14, -1.15], axis: 'y', length: 0.5, width: 0.07, thick: 0.07 },
  { position: [-3.05, -0.14, 1.15], axis: 'y', length: 0.5, width: 0.07, thick: 0.07 },
  { position: [3.05, -0.14, 1.15], axis: 'y', length: 0.5, width: 0.07, thick: 0.07 },
];
/** Fragment i takes structure slot SLOT_OF[i]. The two longest arcs become the rails. */
export const SLOT_OF: number[] = [5, 6, 0, 7, 8, 2, 3, 1, 4];

/* ------------------------------------------------------------------ shapes */

/**
 * The opening: a sparse sparkle along the lit limb, and scale dust in the volume
 * in front of the mass. The limb itself is a surface now — the mass draws its
 * own rim — so the points may only glint on it, never draw it.
 */
export const aperture: ShapeBuilder = (count) => {
  const random = prng(SEEDS.aperture);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    if (i < part.anchors) {
      // Glints on the limb, tight to it.
      const x = (gold(i) * 2 - 1) * RIM_SPAN;
      const theta = Math.asin(clamp(x / RIM_RADIUS, -1, 1));
      const off = (random() - 0.4) * 0.05;
      put(positions, i, x + Math.sin(theta) * off, RIM.arcY(x) + Math.cos(theta) * off, RIM_Z + 0.06 + (random() - 0.5) * 0.06);
      weights[i] = 0.3 + random() * 0.3;
    } else if (i < part.anchors + part.edges) {
      // Scale dust above the limb, sparse: the light leaves the edge as one
      // line, never as a bloom.
      const x = (gold(i) * 2 - 1) * RIM_SPAN * 1.1;
      const lift = 0.3 + Math.pow(random(), 1.4) * 3.2;
      put(positions, i, x, RIM.arcY(x) + lift, RIM_Z + (random() - 0.5) * 1.6);
      weights[i] = 0.03 + random() * 0.05;
    } else {
      // Scale dust between the eye and the mass, sparse and dim.
      const x = (random() * 2 - 1) * 9;
      const y = -2.4 + random() * 6.4;
      const z = -2 + Math.pow(random(), 0.7) * 9.5;
      put(positions, i, x, y, z);
      weights[i] = 0.03 + random() * 0.07;
    }
  }
  return finish(count, positions, weights, random);
};

/**
 * Dust around the fragment ring, on the same viewing rays as the fragments, so
 * it reads as one flat halo from the alignment pose and separates into depth
 * exactly as the fragments do when the camera goes through.
 */
export const emblem: ShapeBuilder = (count, ctx) => {
  const random = prng(SEEDS.emblem);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  const aspect = Number.isFinite(ctx.aspect) && ctx.aspect > 0.05 ? ctx.aspect : 1;
  const th = tanHalf(ALIGNMENT_CAMERA.fov);
  const eye = ALIGNMENT_CAMERA.position;
  const fit = Math.min(aspect, 1);
  for (let i = 0; i < count; i++) {
    const near = i < part.anchors;
    const depth = RING.depth[0] + (RING.depth[1] - RING.depth[0]) * (near ? gold2(i) : random());
    const rho = near
      ? RING.ndc * (1 + (random() - 0.5) * 0.05)
      : RING.ndc * (0.3 + random() * 1.5);
    const a = gold(i) * TAU;
    const r = rho * fit * th * depth;
    put(positions, i, eye[0] + Math.cos(a) * r, eye[1] + RING.centreNdcY * th * depth + Math.sin(a) * r, eye[2] - depth);
    weights[i] = near ? 0.18 + random() * 0.22 : 0.02 + random() * 0.04;
  }
  return finish(count, positions, weights, random);
};

const STATIONS: Vec3[] = [
  [-3.5, 0.15, 0.25], [-1.85, 0.4, -0.1], [-0.2, 0, 0], [1.5, -0.28, 0.15], [3.25, 0.08, -0.2],
];
const INTAKE: Vec3 = [-5, -0.1, 0.45];
const RELEASE: Vec3 = [4.65, 0.05, -0.35];
const GATE_X = -0.2, GATE_Y = 1.2, GATE_Z = 0.95;

/** Input cluster, a path of stations, one review gate, an output cluster. Nothing more. */
export const structure: ShapeBuilder = (count) => {
  const random = prng(SEEDS.structure);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  const path = sampler([INTAKE, ...STATIONS, RELEASE]);
  const blob = (c: Vec3, spread: number): Vec3 => {
    const a = random() * TAU, b = Math.acos(random() * 2 - 1), d = Math.cbrt(random()) * spread;
    return [c[0] + Math.sin(b) * Math.cos(a) * d, c[1] + Math.cos(b) * d * 0.7, c[2] + Math.sin(b) * Math.sin(a) * d];
  };
  for (let i = 0; i < count; i++) {
    if (i < part.anchors) {
      if (i % 8 < 7) {
        const s = STATIONS[i % 5];
        put(positions, i, s[0] + (random() - 0.5) * 0.17, s[1] + (random() - 0.5) * 0.17, s[2] + (random() - 0.5) * 0.17);
      } else {
        const [y, z] = onRect(gold(i), GATE_Y, GATE_Z);
        put(positions, i, GATE_X, y, z);
      }
      weights[i] = ramp(i, part, random());
    } else if (i < part.anchors + part.edges) {
      if (i % 25 < 23) {
        const [x, y, z] = path(dash(gold(i), 26, 0.62));
        put(positions, i, x, y + (random() - 0.5) * 0.035, z + (random() - 0.5) * 0.035);
      } else {
        const inner = i % 2 === 0;
        const [y, z] = onRect(gold2(i), inner ? GATE_Y - 0.11 : GATE_Y + 0.07, inner ? GATE_Z - 0.11 : GATE_Z + 0.07);
        put(positions, i, GATE_X + (random() - 0.5) * 0.05, y, z);
      }
      weights[i] = ramp(i, part, random());
    } else if (i % 10 < 9) {
      const [x, y, z] = blob(i % 2 === 0 ? INTAKE : RELEASE, 0.62);
      put(positions, i, x, y, z);
      weights[i] = ramp(i, part, random());
    } else {
      const [x, y, z] = path(gold2(i));
      put(positions, i, x + (random() - 0.5) * 0.5, y + (random() - 0.5) * 1.5, z + (random() - 0.5) * 1.1);
      weights[i] = 0.06 + random() * 0.06;
    }
  }
  return finish(count, positions, weights, random);
};

/* ------------------------------------------------------------------ carton */

const CW = CARTON.w, CD = CARTON.d, CH = CARTON.h;

interface PaperPanel {
  w: number;
  h: number;
  normal: Vec3;
  /** (u, v) in [-.5, .5]² on the panel, to the closed box's local frame (centred on CARTON.centre). */
  at(u: number, v: number): Vec3;
}

/** The closed cake box, panel by panel: base, four walls, lid, tuck, return, two dust flaps. */
const PANELS: PaperPanel[] = [
  { w: CW, h: CD, normal: [0, -1, 0], at: (u, v) => [u * CW, -CH / 2, v * CD] },
  { w: CW, h: CH, normal: [0, 0, 1], at: (u, v) => [u * CW, v * CH, CD / 2] },
  { w: CW, h: CH, normal: [0, 0, -1], at: (u, v) => [u * CW, v * CH, -CD / 2] },
  { w: CD, h: CH, normal: [-1, 0, 0], at: (u, v) => [-CW / 2, v * CH, u * CD] },
  { w: CD, h: CH, normal: [1, 0, 0], at: (u, v) => [CW / 2, v * CH, u * CD] },
  { w: CW, h: CD, normal: [0, 1, 0], at: (u, v) => [u * CW, CH / 2, v * CD] },
  { w: CW, h: CARTON.tuck, normal: [0, 0, 1], at: (u, v) => [u * CW, CH / 2 - (v + 0.5) * CARTON.tuck, CD / 2 + 0.03] },
  { w: CW, h: CARTON.ret, normal: [0, 0, -1], at: (u, v) => [u * CW, CH / 2 - (v + 0.5) * CARTON.ret, CD / 2 - 0.03] },
  { w: CD, h: CARTON.dust, normal: [0, 1, 0], at: (u, v) => [-CW / 2 + (v + 0.5) * CARTON.dust, CH / 2 - 0.02, u * CD] },
  { w: CD, h: CARTON.dust, normal: [0, 1, 0], at: (u, v) => [CW / 2 - (v + 0.5) * CARTON.dust, CH / 2 - 0.02, u * CD] },
];

/** Points on the closed carton: creases and rims first, then panel perimeters, then the faces. */
export const carton: ShapeBuilder = (count) => {
  const random = prng(SEEDS.paper);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  const lip = CARTON.t / 2;
  for (let i = 0; i < count; i++) {
    let panel: PaperPanel, u: number, v: number;
    if (i < part.anchors) {
      // The silhouette of the closed box: the twelve edges, drawn on the six faces.
      const face = i % 6, lane = Math.floor(i / 6) % 4;
      panel = PANELS[face];
      const s = gold(i) - 0.5;
      if (lane === 0) { u = -0.5; v = s; } else if (lane === 1) { u = 0.5; v = s; } else if (lane === 2) { u = s; v = -0.5; } else { u = s; v = 0.5; }
    } else if (i < part.anchors + part.edges) {
      panel = PANELS[i % PANELS.length];
      [u, v] = onRect(gold(i), 0.5, 0.5);
    } else {
      panel = PANELS[i % PANELS.length];
      u = gold(i) - 0.5;
      v = random() - 0.5;
    }
    const [x, y, z] = panel.at(u, v);
    const side = i % 2 === 0 ? lip : -lip;
    put(
      positions, i,
      x + panel.normal[0] * side + CARTON.centre[0],
      y + panel.normal[1] * side + CARTON.centre[1],
      z + panel.normal[2] * side + CARTON.centre[2],
    );
    weights[i] = ramp(i, part, random());
  }
  return finish(count, positions, weights, prng(SEEDS.carton));
};

/* --------------------------------------------------------------- archive */

const NODE_COLUMNS = 4;
/**
 * The settled collection is sized to the frame it is read in, not to the number
 * of projects. Both layouts share one geometry, so it is sized for the narrower.
 */
const NODE_FIELD_W = 4.6, NODE_FIELD_H = 4.6;

/** Points each project node is drawn with. One point per project is not a node. */
export function constellationStride(count: number, nodeCount: number): number {
  const part = partition(count);
  const nodes = clamp(Math.trunc(nodeCount), 1, Math.max(1, part.anchors + part.edges));
  return Math.max(1, Math.floor((part.anchors + part.edges) / nodes));
}

/** First particle index belonging to a project node, for aligning HTML to it. */
export function constellationNodeIndex(node: number, stride = 1): number {
  return Math.max(0, Math.trunc(node)) * Math.max(1, Math.trunc(stride));
}

/**
 * Project nodes on a card-shaped grid, everything else a decorative star: dimmer,
 * behind the card plane, off the grid. A star must never read as a hidden entry.
 * Each node is drawn as a card OUTLINE rather than a single point.
 */
export const constellation: ShapeBuilder = (count, ctx) => {
  const random = prng(SEEDS.constellation);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);

  const budget = part.anchors + part.edges;
  const nodes = clamp(Math.trunc(ctx.nodeCount), 0, Math.max(0, Math.min(count, budget)));
  const stride = nodes > 0 ? Math.max(1, Math.floor(budget / nodes)) : 0;
  const drawn = nodes * stride;

  const rows = Math.max(1, Math.ceil(Math.max(1, nodes) / NODE_COLUMNS));
  const colGap = NODE_FIELD_W / NODE_COLUMNS;
  const rowGap = NODE_FIELD_H / Math.max(1, rows - 1);
  const cardW = colGap * 0.82, cardH = Math.min(rowGap * 0.66, 0.46);

  for (let i = 0; i < count; i++) {
    if (i < drawn) {
      const node = Math.floor(i / stride);
      const seat = i % stride;
      const col = node % NODE_COLUMNS, row = Math.floor(node / NODE_COLUMNS);
      const cx = (col - (NODE_COLUMNS - 1) / 2) * colGap;
      const cy = ((rows - 1) / 2 - row) * rowGap;

      const t = (seat + 0.5) / stride;
      const peri = 2 * (cardW + cardH);
      let d = t * peri, x = 0, y = 0;
      if (d < cardW) { x = -cardW / 2 + d; y = cardH / 2; }
      else if ((d -= cardW) < cardH) { x = cardW / 2; y = cardH / 2 - d; }
      else if ((d -= cardH) < cardW) { x = cardW / 2 - d; y = -cardH / 2; }
      else { d -= cardW; x = -cardW / 2; y = -cardH / 2 + d; }

      const jitter = 0.012;
      put(positions, i,
        cx + x + (random() - 0.5) * jitter,
        cy + y + (random() - 0.5) * jitter,
        (random() - 0.5) * 0.05);
      weights[i] = 0.9 + random() * 0.1;
    } else {
      const anchor = i < part.anchors, edge = !anchor && i < part.anchors + part.edges;
      const a = i * 2.39996;
      const r = Math.sqrt((i + 0.5) / count);
      put(
        positions, i,
        clamp(Math.cos(a) * r * 5.6 + (random() - 0.5) * 0.6, -5.8, 5.8),
        clamp(Math.sin(a) * r * 3.4 + (random() - 0.5) * 0.4, -3.5, 3.5),
        -1.4 - (anchor ? random() * 1.2 : edge ? 1.2 + random() * 1.6 : 2.8 + random() * 2.7),
      );
      weights[i] = (anchor ? 0.16 : edge ? 0.11 : 0.05) + random() * 0.04;
    }
  }
  return finish(count, positions, weights, random);
};

/* ------------------------------------------------------------------ export */

export const SHAPES: Record<ShapeId, ShapeBuilder> = {
  aperture, emblem, structure, carton, constellation,
};

const SHAPE_IDS: ShapeId[] = ['aperture', 'emblem', 'structure', 'carton', 'constellation'];

export function buildShapes(count: number, ctx: ShapeContext): Record<ShapeId, ShapeTarget> {
  const built = {} as Record<ShapeId, ShapeTarget>;
  for (const id of SHAPE_IDS) built[id] = SHAPES[id](count, { ...ctx, random: prng(SEEDS[id]) });
  return built;
}

/** Deterministic, DOM-free. Returns human-readable failures; empty means pass. */
export function selfCheck(): string[] {
  const fail: string[] = [];
  const th = tanHalf(ALIGNMENT_CAMERA.fov);
  for (let i = 0; i < SHARDS; i++) {
    const s = shardRing(i, 1.6);
    // Every fragment projects to the same ring from the alignment eye.
    const ndc = Math.hypot(s.position[0], s.position[1] - RING.centreNdcY * th * s.depth) / (th * s.depth);
    if (Math.abs(ndc - RING.ndc) > 1e-6) fail.push(`shardRing(${i}): projects to ${ndc.toFixed(4)}, want ${RING.ndc}`);
    if (!(s.depth >= RING.depth[0] && s.depth <= RING.depth[1])) fail.push(`shardRing(${i}): depth ${s.depth} outside the band`);
  }
  const seen = new Set(SLOT_OF);
  if (seen.size !== SHARDS || SLOT_OF.some(v => v < 0 || v >= STRUCTURE.length)) fail.push('SLOT_OF is not a permutation of the structure slots');
  if (Math.abs(CARTON.centre[1] + CARTON.h / 2 - SEAM.y) > 1e-9) fail.push('the carton top does not sit on the seam');
  if (Math.abs(CARTON.centre[2] + CARTON.d / 2 - SEAM.z) > 1e-9) fail.push('the carton front does not sit on the seam');
  return fail;
}
