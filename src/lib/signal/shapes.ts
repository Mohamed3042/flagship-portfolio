/**
 * "From Signal to Systems" — the particle target sets.
 *
 * Point identity is the array index and is shared by every shape: index i plays
 * the same role everywhere (anchor, then principal edge, then interior detail),
 * so a morph is an index-wise interpolation and the formation grammar — anchors
 * settle first, edges follow, detail last — is staging on index alone.
 *
 * Every builder reseeds its own stream from a fixed per-shape seed, so the same
 * count yields byte-identical arrays however the caller arrived: forward, back,
 * anchor jump or restored history.
 */
import type { CameraPose, ShapeBuilder, ShapeContext, ShapeId, ShapeTarget } from './types';

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
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
  field: 0x5f1e1d, aperture: 0xa9e70c, emblem: 0xe3b10a, structure: 0x57a0c7,
  dieline: 0xd1e11e, carton: 0xca8701, tracks: 0x7ac05a, portal: 0x90a7a1,
  constellation: 0xc057e1, paper: 0x9a9e80,
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

type Vec3 = [number, number, number];

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

/* -------------------------------------------------------------- anamorphic */

/** The pose the emblem reads flat from. Half-height 3.45 at the emblem's depth. */
export const ALIGNMENT_CAMERA: CameraPose = { position: [0, 0, 9], look: [0, 0, 0], fov: 42 };

/**
 * How far the figure is stretched along the alignment camera's view axis.
 *
 * This range IS the surprise. Every point projects back to the same flat figure
 * from ALIGNMENT_CAMERA whatever the range is, so widening it costs the first
 * reading nothing -- and it is the only thing that decides how far the bands
 * slide apart when the camera finally moves. At 6.6..10 the near and far bands
 * were within a third of each other's distance and the reveal was a caption
 * describing something the eye could not see.
 */
const EMBLEM_DEPTH: [number, number] = [5.2, 13.6];
const EMBLEM_BANDS = 8;
/** Lifts the figure clear of the narration band without moving the eye. */
const EMBLEM_OFFSET: [number, number] = [0, 0.085];

/**
 * Sample a silhouette from one camera and distribute the points along its
 * viewing rays. Every point projects back to the same 2D figure from
 * ALIGNMENT_CAMERA; a lateral move separates them into concentric bands, so the
 * reveal is an ordered volume rather than a fog.
 *
 * `silhouette` returns normalised device space [-1,1]^2. `depth` is distance
 * along the alignment camera's forward axis.
 */
export function anamorphic(
  silhouette: (i: number, count: number, random: () => number) => [number, number],
  count: number,
  depth: [number, number],
  ctx: ShapeContext,
  offset: [number, number] = [0, 0],
): Float32Array {
  const eye = ALIGNMENT_CAMERA.position;
  const fwd = unit([
    ALIGNMENT_CAMERA.look[0] - eye[0], ALIGNMENT_CAMERA.look[1] - eye[1], ALIGNMENT_CAMERA.look[2] - eye[2],
  ], [0, 0, -1]);
  const right = unit(cross(fwd, [0, 1, 0]), [1, 0, 0]);
  const up = unit(cross(right, fwd), [0, 1, 0]);
  const tanHalf = Math.tan((ALIGNMENT_CAMERA.fov * DEG) / 2);
  const aspect = Number.isFinite(ctx.aspect) && ctx.aspect > 0.05 ? ctx.aspect : 1;
  const near = Math.min(depth[0], depth[1]), far = Math.max(depth[0], depth[1]);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [fx, fy] = silhouette(i, count, ctx.random);
    // Aspect-corrected silhouette radius picks the band, so concentric rings of
    // the figure land on distinct planes and radial spokes rake through them.
    // The band comes from the figure's OWN radius, before the framing offset, or
    // shifting the figure would tilt the depth ordering with it.
    const ring = clamp(Math.hypot(fx * aspect, fy), 0, 1);
    const band = Math.min(EMBLEM_BANDS - 1, Math.floor(ring * EMBLEM_BANDS));
    const t = near + (far - near) * (band / (EMBLEM_BANDS - 1)) + (ctx.random() - 0.5) * 0.07;
    const nx = fx + offset[0], ny = fy + offset[1];
    const h = t * tanHalf, sx = nx * h * aspect, sy = ny * h;
    put(
      out, i,
      eye[0] + fwd[0] * t + right[0] * sx + up[0] * sy,
      eye[1] + fwd[1] * t + right[1] * sx + up[1] * sy,
      eye[2] + fwd[2] * t + right[2] * sx + up[2] * sy,
    );
  }
  return out;
}

/* ------------------------------------------------------------------ shapes */

/** The scattered opening distribution: wide, sparse, stratified in depth. */
export const field: ShapeBuilder = (count) => {
  const random = prng(SEEDS.field);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const anchor = i < part.anchors, edge = !anchor && i < part.anchors + part.edges;
    const reach = anchor ? 0.62 : edge ? 0.86 : 1;
    const r = Math.sqrt((i + 0.5) / count) * reach;
    const a = i * 2.39996 + (anchor ? 0 : edge ? 1.1 : 2.3);
    const x = clamp(Math.cos(a) * r * 5.6 + (random() - 0.5) * 0.5, -5.9, 5.9);
    const y = clamp(Math.sin(a) * r * 3.1 + (random() - 0.5) * 0.35, -3.35, 3.35);
    const z = anchor ? 1.9 - random() * 1.5 : edge ? 0.4 - random() * 2.9 : -2.5 - random() * 4.4;
    put(positions, i, x, y, z);
    weights[i] = ramp(i, part, random());
  }
  return finish(count, positions, weights, random);
};

const RIM_RADIUS = 15.4, RIM_CENTRE_Y = -14.6, RIM_Z = -3.1, RIM_SPAN = 7.4;

/**
 * The opening limb, published so the renderer frames the camera on the real
 * geometry and stands the dark mass on the same plane as the lit edge. Two
 * copies of these numbers is how a bright rim ends up drawn inside the
 * silhouette it is supposed to be the edge of.
 */
export const RIM = {
  radius: RIM_RADIUS,
  centreY: RIM_CENTRE_Y,
  z: RIM_Z,
  span: RIM_SPAN,
  /** Highest point of the arc, at x = 0. */
  crest: [0, RIM_CENTRE_Y + RIM_RADIUS, RIM_Z] as [number, number, number],
};

/** The rim-lit horizon: one thin bright arc running off-frame, sparse dark body below. */
export const aperture: ShapeBuilder = (count) => {
  const random = prng(SEEDS.aperture);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  const rim = part.anchors + part.edges;
  const arcY = (x: number) => RIM_CENTRE_Y + Math.sqrt(Math.max(RIM_RADIUS * RIM_RADIUS - x * x, 0));
  for (let i = 0; i < count; i++) {
    if (i < rim) {
      const anchor = i < part.anchors;
      const x = (gold(i) * 2 - 1) * RIM_SPAN;
      const theta = Math.asin(clamp(x / RIM_RADIUS, -1, 1));
      // Anchors hold the rim thin; edges carry a slight outward bloom above it.
      const off = anchor ? (random() - 0.5) * 0.05 : (random() - 0.35) * 0.3;
      put(positions, i, x + Math.sin(theta) * off, arcY(x) + Math.cos(theta) * off, RIM_Z + (random() - 0.5) * 0.12);
      weights[i] = ramp(i, part, random());
    } else {
      // The body below the limb. Dim, but not invisible: it is what tells the
      // eye there is a surface under the lit edge rather than a line in a void,
      // and it thins with depth into the mass so the limb stays the bright thing.
      const x = (random() * 2 - 1) * RIM_SPAN * 1.04;
      const top = arcY(x);
      const drop = Math.pow(random(), 1.5) * (top + 4.2);
      put(positions, i, x, top - drop, RIM_Z - 0.28 - random() * 1.5);
      weights[i] = (0.1 + random() * 0.17) * (1 - Math.min(drop / (top + 4.2), 1) * 0.55);
    }
  }
  return finish(count, positions, weights, random);
};

/**
 * The signature illusion. A nonverbal aperture: a broken ring of concentric arcs
 * with radial spokes and a detent tick ring, sampled flat from ALIGNMENT_CAMERA
 * and pushed out along its viewing rays into seven depth bands.
 */
export const emblem: ShapeBuilder = (count, ctx) => {
  const random = prng(SEEDS.emblem);
  const part = partition(count);
  const aspect = Number.isFinite(ctx.aspect) && ctx.aspect > 0.05 ? ctx.aspect : 1;
  const arc = (s: number, segs: number, gap: number, phase: number) => {
    const slot = Math.floor(s * segs), u = s * segs - slot;
    return ((slot + gap / 2 + u * (1 - gap)) / segs) * TAU + phase;
  };
  const figure = (i: number, _total: number, r: () => number): [number, number] => {
    const s = gold(i);
    let rho: number, angle: number;
    if (i < part.anchors) {
      const outer = i % 9 < 7;
      rho = (outer ? 0.8 : 0.66) + (r() - 0.5) * 0.012;
      angle = arc(s, outer ? 5 : 7, outer ? 0.13 : 0.19, outer ? 0 : 0.41);
    } else if (i < part.anchors + part.edges) {
      const k = i % 3;
      rho = (k === 0 ? 0.66 : k === 1 ? 0.53 : 0.41) + (r() - 0.5) * 0.018;
      angle = arc(s, 7 + k * 2, 0.19 + k * 0.03, 0.41 + k * 0.37);
    } else {
      const k = i % 5;
      if (k < 3) {
        rho = 0.22 + s * 0.66;
        angle = Math.floor(gold2(i) * 6) * (TAU / 6) + 0.26 + (r() - 0.5) * 0.022;
      } else if (k === 3) {
        rho = 0.26 + (r() - 0.5) * 0.016;
        angle = arc(s, 9, 0.24, 1.07);
      } else {
        rho = 0.855 + s * 0.045;
        angle = Math.floor(gold2(i) * 24) * (TAU / 24) + (r() - 0.5) * 0.01;
      }
    }
    // Scaled to sit inside the frame with its narration, rather than running to
    // the frame edge where the first and last arcs are cropped off the figure.
    const fit = 0.86;
    return [(Math.cos(angle) * rho * fit) / aspect, Math.sin(angle) * rho * fit];
  };
  const positions = anamorphic(figure, count, EMBLEM_DEPTH, { ...ctx, random }, EMBLEM_OFFSET);
  const weights = new Float32Array(count);
  for (let i = 0; i < count; i++) weights[i] = ramp(i, part, random());
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
    // The gate is a frame around the path, drawn with a frame's worth of points.
    // It used to take about a fifth of the whole cloud and fill its own plane
    // solid; seen edge-on from the reading camera that is not a boundary, it is
    // an opaque white rail standing through the middle of the chapter.
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
      // Loose material along the run, not a filled pane at the gate.
      const [x, y, z] = path(gold2(i));
      put(positions, i, x + (random() - 0.5) * 0.5, y + (random() - 0.5) * 1.5, z + (random() - 0.5) * 1.1);
      weights[i] = 0.06 + random() * 0.06;
    }
  }
  return finish(count, positions, weights, random);
};

/* ------------------------------------------------------- dieline and carton */

/**
 * The carton, in scene units, published so the paperboard model is built to the
 * same box the points describe.
 *
 * They were two different boxes: the cloud drew a 2.75-unit cuboid and the model
 * folded a 1.05-unit one inside it, which is why the reading stop showed bright
 * construction lines around a small object rather than a piece of packaging.
 */
export const CARTON = { w: 1.74, h: 1.48, d: 1.2, centre: [-0.66, 0, -0.14] as [number, number, number] };

const CW = CARTON.w, CD = CARTON.d, CH = CARTON.h, CFLAP = 0.62, CTAB = 0.3, CFOOT = 0.34;
const LIFT = 0.475, THICK = 0.016;
const originX = -4.69;
const flatAt = (offset: number, y: number): [number, number] => [originX + offset, y + LIFT];

interface PaperPanel {
  w: number;
  h: number;
  flat: [number, number];
  normal: Vec3;
  fold(u: number, v: number): Vec3;
}

/**
 * One panel list, two mappings. The flat layout and the folded carton read the
 * same (panel, u, v) per index, so a fold hinges instead of teleporting.
 * Walls run front, right, back, left in wrap order; flaps hinge on their wall.
 */
const PANELS: PaperPanel[] = [
  { w: CW, h: CH, flat: flatAt(CW / 2, 0), normal: [0, 0, 1], fold: (u, v) => [u * CW, v * CH, CD / 2] },
  { w: CD, h: CH, flat: flatAt(CW + CD / 2, 0), normal: [1, 0, 0], fold: (u, v) => [CW / 2, v * CH, -u * CD] },
  { w: CW, h: CH, flat: flatAt(CW + CD + CW / 2, 0), normal: [0, 0, -1], fold: (u, v) => [-u * CW, v * CH, -CD / 2] },
  { w: CD, h: CH, flat: flatAt(CW * 2 + CD + CD / 2, 0), normal: [-1, 0, 0], fold: (u, v) => [-CW / 2, v * CH, u * CD] },
  {
    w: CTAB, h: CH, flat: flatAt(CW * 2 + CD * 2 + CTAB / 2, 0), normal: [0, 0, 1],
    fold: (u, v) => [-CW / 2 + (u + 0.5) * CTAB, v * CH, CD / 2 - 0.05],
  },
  {
    w: CW, h: CFLAP, flat: flatAt(CW / 2, CH / 2 + CFLAP / 2), normal: [0, 1, 0],
    fold: (u, v) => [u * CW, CH / 2, CD / 2 - (v + 0.5) * CFLAP],
  },
  {
    w: CD, h: CFLAP, flat: flatAt(CW + CD / 2, CH / 2 + CFLAP / 2), normal: [0, 1, 0],
    fold: (u, v) => [CW / 2 - (v + 0.5) * CFLAP, CH / 2, -u * CD],
  },
  {
    w: CW, h: CFLAP, flat: flatAt(CW + CD + CW / 2, CH / 2 + CFLAP / 2), normal: [0, 1, 0],
    fold: (u, v) => [-u * CW, CH / 2, -CD / 2 + (v + 0.5) * CFLAP],
  },
  {
    w: CD, h: CFLAP, flat: flatAt(CW * 2 + CD + CD / 2, CH / 2 + CFLAP / 2), normal: [0, 1, 0],
    fold: (u, v) => [-CW / 2 + (v + 0.5) * CFLAP, CH / 2, u * CD],
  },
  {
    w: CW, h: CD, flat: flatAt(CW / 2, -CH / 2 - CD / 2), normal: [0, 1, 0],
    fold: (u, v) => [u * CW, -CH / 2, CD / 2 - (0.5 - v) * CD],
  },
  {
    w: CD, h: CFOOT, flat: flatAt(CW + CD / 2, -CH / 2 - CFOOT / 2), normal: [0, 1, 0],
    fold: (u, v) => [CW / 2 - (0.5 - v) * CFOOT, -CH / 2, -u * CD],
  },
  {
    w: CW, h: CFOOT, flat: flatAt(CW + CD + CW / 2, -CH / 2 - CFOOT / 2), normal: [0, 1, 0],
    fold: (u, v) => [-u * CW, -CH / 2, -CD / 2 + (0.5 - v) * CFOOT],
  },
  {
    w: CD, h: CFOOT, flat: flatAt(CW * 2 + CD + CD / 2, -CH / 2 - CFOOT / 2), normal: [0, 1, 0],
    fold: (u, v) => [-CW / 2 + (0.5 - v) * CFOOT, -CH / 2, u * CD],
  },
];

/**
 * Both packaging shapes sample one shared stream, so index i is the same
 * material point on the same panel in the flat layout and in the folded carton.
 * Edge points are doubled either side of the panel normal to suggest board.
 */
function paperboard(count: number, folded: boolean): { positions: Float32Array; weights: Float32Array } {
  const random = prng(SEEDS.paper);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let panel: PaperPanel, u: number, v: number, lip = 0;
    if (i < part.anchors) {
      // Creases and rims of the four walls: the silhouette of the closed carton.
      const wall = i % 4, lane = Math.floor(i / 4) % 8;
      panel = PANELS[wall];
      if (lane < 4) { u = -0.5; v = gold(i) - 0.5; } else if (lane < 6) { u = gold(i) - 0.5; v = 0.5; } else { u = gold(i) - 0.5; v = -0.5; }
      lip = i % 2 === 0 ? THICK : -THICK;
    } else if (i < part.anchors + part.edges) {
      panel = PANELS[i % PANELS.length];
      [u, v] = onRect(gold(i), 0.5, 0.5);
      lip = i % 2 === 0 ? THICK : -THICK;
    } else {
      panel = PANELS[i % PANELS.length];
      u = gold(i) - 0.5;
      v = random() - 0.5;
    }
    if (folded) {
      const [x, y, z] = panel.fold(u, v);
      // Into the model's own frame: same box, same place, so the points sit ON
      // the board instead of around it.
      put(
        positions, i,
        x + panel.normal[0] * lip + CARTON.centre[0],
        y + panel.normal[1] * lip + CARTON.centre[1],
        z + panel.normal[2] * lip + CARTON.centre[2],
      );
    } else {
      put(positions, i, panel.flat[0] + u * panel.w, panel.flat[1] + v * panel.h, lip);
    }
    weights[i] = ramp(i, part, random());
  }
  return { positions, weights };
}

/** The flat packaging layout: panels, score lines, flaps and the glue tab, in one plane. */
export const dieline: ShapeBuilder = (count) => {
  const { positions, weights } = paperboard(count, false);
  return finish(count, positions, weights, prng(SEEDS.dieline));
};

/** The same board folded closed. Index correspondence with `dieline` is exact. */
export const carton: ShapeBuilder = (count) => {
  const { positions, weights } = paperboard(count, true);
  return finish(count, positions, weights, prng(SEEDS.carton));
};

/* ------------------------------------------------------------------ tracks */

const TRACK_Y = [1.05, 0, -1.05];
const TRACK_Z = [1.35, -0.25, -1.85];
const TRACK_OFFSET = [-1.15, 0.65, -0.4];
const TRACK_SPAN = 4.55, CLIP_HALF = 0.17, CLIPS = 8;

/** Three media tracks at three depths, dashed into clips, offset out of sync along X. */
export const tracks: ShapeBuilder = (count) => {
  const random = prng(SEEDS.tracks);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  const lanes = TRACK_Y.map((_, t) => {
    const widths: number[] = [];
    let used = 0;
    for (let c = 0; c < CLIPS; c++) { const w = 0.55 + random() * 0.85; widths.push(w); used += w; }
    const gap = 0.26;
    const scale = (TRACK_SPAN * 2 - gap * (CLIPS - 1)) / used;
    const clips: [number, number][] = [];
    let x = -TRACK_SPAN + TRACK_OFFSET[t];
    for (const w of widths) { clips.push([x, x + w * scale]); x += w * scale + gap; }
    return clips;
  });
  for (let i = 0; i < count; i++) {
    const t = i % 3, lane = lanes[t], y = TRACK_Y[t], z = TRACK_Z[t];
    const clip = lane[Math.floor(gold(i) * CLIPS) % CLIPS];
    const width = clip[1] - clip[0];
    if (i < part.anchors) {
      // The clip head is the sync point the three tracks are aligned on.
      put(positions, i, clip[0], y + (gold2(i) - 0.5) * CLIP_HALF * 2, z + (random() - 0.5) * 0.03);
      weights[i] = ramp(i, part, random());
    } else if (i < part.anchors + part.edges) {
      const [u, v] = onRect(gold2(i), width / 2, CLIP_HALF);
      put(positions, i, clip[0] + width / 2 + u, y + v, z + (random() - 0.5) * 0.03);
      weights[i] = ramp(i, part, random());
    } else if (i % 5 < 4) {
      put(positions, i, clip[0] + random() * width, y + (random() - 0.5) * CLIP_HALF * 1.7, z + (random() - 0.5) * 0.05);
      weights[i] = ramp(i, part, random());
    } else {
      put(positions, i, (random() * 2 - 1) * TRACK_SPAN + TRACK_OFFSET[t], y, z);
      weights[i] = 0.07 + random() * 0.06;
    }
  }
  return finish(count, positions, weights, random);
};

const PORTAL_W = 2.35, PORTAL_H = 1.55;

/** A rectangular frame aperture with a shallow interior implied behind it. */
export const portal: ShapeBuilder = (count) => {
  const random = prng(SEEDS.portal);
  const part = partition(count);
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    if (i < part.anchors) {
      const [x, y] = onRect(gold(i), PORTAL_W, PORTAL_H);
      put(positions, i, x, y, (random() - 0.5) * 0.024);
      weights[i] = ramp(i, part, random());
    } else if (i < part.anchors + part.edges) {
      const k = i % 3;
      const inset = k === 0 ? 0.14 : k === 1 ? 0.07 + random() * 0.06 : -0.06;
      const [x, y] = onRect(gold(i), PORTAL_W - inset, PORTAL_H - inset);
      put(positions, i, x, y, (random() - 0.5) * 0.05);
      weights[i] = ramp(i, part, random());
    } else {
      const k = i % 4;
      const shrink = 1 - (k + 1) * 0.06;
      const [x, y] = onRect(gold2(i), (PORTAL_W - 0.2) * shrink, (PORTAL_H - 0.2) * shrink);
      put(positions, i, x, y, -0.45 - k * 0.42 + (random() - 0.5) * 0.06);
      weights[i] = 0.1 + (3 - k) * 0.05 + random() * 0.06;
    }
  }
  return finish(count, positions, weights, random);
};

const NODE_COLUMNS = 4;
/**
 * The settled collection is sized to the frame it is read in, not to the number
 * of projects. With one row's worth of gap per project the grid grew past the
 * viewport at 38 entries and the chapter read as wallpaper the camera happened
 * to be inside, with cards cut off at the top and bottom edges: a collection you
 * cannot see the edges of has not settled anywhere.
 *
 * Both layouts share one geometry, so it is sized for the narrower of the two.
 */
const NODE_FIELD_W = 4.6, NODE_FIELD_H = 4.6;

/** Particle index of project `node`. Nodes occupy the front of the anchor band. */
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
 *
 * Each node is drawn as a card OUTLINE rather than a single point: the chapter's
 * job is to show the collection settling into the browser that follows, and a
 * lone particle per project reads as empty space, not as a body of work.
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

      // Walk the card's perimeter, so the grid reads as cards, not as a cloud.
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
  field, aperture, emblem, structure, dieline, carton, tracks, portal, constellation,
};

const SHAPE_IDS: ShapeId[] = [
  'field', 'aperture', 'emblem', 'structure', 'dieline', 'carton', 'tracks', 'portal', 'constellation',
];

export function buildShapes(count: number, ctx: ShapeContext): Record<ShapeId, ShapeTarget> {
  const built = {} as Record<ShapeId, ShapeTarget>;
  for (const id of SHAPE_IDS) built[id] = SHAPES[id](count, { ...ctx, random: prng(SEEDS[id]) });
  return built;
}
