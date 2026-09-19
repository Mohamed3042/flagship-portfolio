/**
 * DEEP FIELD — the figures, drawn by hand.
 *
 * Round 1 sampled each project's key image and let the luminance decide where
 * the stars went. A screenshot is a page of type and panels, so what came back
 * was a smeared rectangle: recognisable as "a screen", recognisable as nothing
 * else. Image sampling is retired.
 *
 * Every figure here is authored the way a star chart is drawn: a few strokes,
 * a handful of anchors at the vertices, and hairlines between the anchors. Each
 * one comes from what the project actually IS — the thing it makes or the shape
 * of the work — and the reasoning for every one is in the round's report. There
 * is no brand asset, no logo and no traced artwork anywhere in this file.
 *
 * Coordinates are normalized: height 1, width `aspect`, z in [-0.5, 0.5], the
 * origin at the centre. `seatTarget` in targets.ts places the box in front of
 * the eye, so a resize is a multiply and never a re-authoring.
 */
import type { Figure } from './types';
import voiceShapes from './voice-shapes.json';
import { workshop } from '../../data/workshop';

/* --------------------------------------------------------------- the DSL */

export interface Pt { x: number; y: number; z?: number }

export interface Stroke {
  pts: Pt[];
  closed?: boolean;
  /** Stars per unit length, relative to 1. A rule can be fainter than a rim. */
  density?: number;
}

export interface Anchor extends Pt {
  /** 0..1. Above ~0.86 the anchor carries a diffraction spike. */
  w: number;
  /** Set when an HTML label is anchored to this star. */
  key?: string;
}

export interface FigureSpec {
  aspect: number;
  /**
   * How much of its seat the figure fills, 1 by default. Every figure is fitted
   * to its own extent, which is what makes "about 45% of the viewport height" a
   * property of the composition rather than of how big someone happened to draw
   * it — but one beat wants a single small star in a large frame, and this is
   * the dial for that.
   */
  fill?: number;
  /**
   * A soft disc of stars around the origin, for a figure that is a POINT rather
   * than a drawing. `radius` is in the figure's own units and `share` is how
   * much of the count it takes.
   */
  scatter?: { radius: number; share: number; falloff?: number };
  /**
   * A fixed star count at a 900px-tall viewport, for figures whose stroke
   * length says nothing about how many stars they want. Scaled with the
   * viewport like every other count.
   */
  points?: number;
  strokes: Stroke[];
  anchors: Anchor[];
  /** Hairlines, as pairs of anchor indices. */
  links: [number, number][];
  /**
   * The second pose. Same topology — same strokes, same point counts, same
   * anchors — so point i means the same thing in both and the change between
   * them is a fold rather than a cut.
   */
  open?: { strokes: Stroke[]; anchors: Anchor[] };
}

/* ------------------------------------------------------------- primitives */

const line = (...pts: Pt[]): Stroke => ({ pts });
const shape = (...pts: Pt[]): Stroke => ({ pts, closed: true });

/** An ellipse as a polyline. `z` may tilt with the angle, which gives a rim depth. */
function ellipse(cx: number, cy: number, rx: number, ry: number, z = 0, zSwing = 0, steps = 48): Stroke {
  const pts: Pt[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, z: z + Math.sin(a + Math.PI / 2) * zSwing });
  }
  return { pts, closed: true };
}

/** A small ring, for a node on a flow. */
const node = (x: number, y: number, r: number, z = 0) => ellipse(x, y, r, r, z, 0, 18);

/* ============================================================ the figures */

/**
 * ask-repos — a magnifying glass over a folder.
 * The product reads a corpus of repositories and answers questions about it,
 * and it publishes which repositories the answer came from.
 */
const askRepos: FigureSpec = {
  aspect: 1.25,
  strokes: [
    // The folder: a tab along the top-left, and the front pocket's edge.
    shape(
      { x: -0.54, y: -0.3, z: -0.18 }, { x: 0.36, y: -0.3, z: -0.18 },
      { x: 0.36, y: 0.2, z: -0.18 }, { x: -0.16, y: 0.2, z: -0.18 },
      { x: -0.24, y: 0.34, z: -0.18 }, { x: -0.54, y: 0.34, z: -0.18 },
    ),
    { pts: [{ x: -0.54, y: 0.02, z: -0.16 }, { x: -0.1, y: -0.05, z: -0.16 }, { x: 0.36, y: 0.02, z: -0.16 }],
      density: 0.8 },
    // The lens, smaller than the folder and sitting on its lower corner, with
    // the handle running off it: a magnifier OVER a folder, not a circle
    // floating in the middle of a rectangle.
    ellipse(0.24, -0.08, 0.21, 0.21, 0.26, 0.07),
    line({ x: 0.39, y: -0.23, z: 0.26 }, { x: 0.58, y: -0.42, z: 0.26 }),
  ],
  anchors: [
    { x: -0.54, y: -0.3, z: -0.18, w: 0.5 },
    { x: 0.36, y: -0.3, z: -0.18, w: 0.55 },
    { x: 0.36, y: 0.2, z: -0.18, w: 0.5 },
    { x: -0.24, y: 0.34, z: -0.18, w: 0.62 },
    { x: -0.54, y: 0.34, z: -0.18, w: 0.55 },
    { x: 0.45, y: -0.08, z: 0.26, w: 0.88 },
    { x: 0.24, y: 0.13, z: 0.33, w: 0.72 },
    { x: 0.03, y: -0.08, z: 0.26, w: 0.8 },
    { x: 0.24, y: -0.29, z: 0.19, w: 0.72 },
    { x: 0.58, y: -0.42, z: 0.26, w: 0.92 },
  ],
  links: [[0, 1], [1, 2], [3, 4], [4, 0], [5, 6], [6, 7], [7, 8], [8, 5], [5, 9]],
};

/**
 * Enterprise AI Automation Templates — a flow of five nodes with one gated
 * branch. The templates run a workflow; the gate is the human approval the
 * project exists to keep in the loop.
 */
const templates: FigureSpec = (() => {
  const n: Pt[] = [
    { x: -0.46, y: 0.3 }, { x: -0.16, y: 0.15 }, { x: 0.1, y: -0.02 },
    { x: 0.1, y: -0.34 }, { x: 0.46, y: -0.16 },
  ];
  const gate = { x: 0.42, y: 0.2, z: 0.3 };
  const r = 0.055;
  const between = (a: Pt, b: Pt, za = 0, zb = 0): Stroke => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1;
    return line(
      { x: a.x + (dx / d) * r, y: a.y + (dy / d) * r, z: za },
      { x: b.x - (dx / d) * r, y: b.y - (dy / d) * r, z: zb },
    );
  };
  return {
    aspect: 1.5,
    strokes: [
      ...n.map(p2 => node(p2.x, p2.y, r)),
      between(n[0], n[1]), between(n[1], n[2]), between(n[2], n[3]), between(n[3], n[4]),
      // The branch lifts out of the plane, through the gate, and back down.
      between(n[2], gate, 0.04, 0.28),
      shape(
        { x: gate.x, y: gate.y + 0.08, z: 0.3 }, { x: gate.x + 0.07, y: gate.y, z: 0.3 },
        { x: gate.x, y: gate.y - 0.08, z: 0.3 }, { x: gate.x - 0.07, y: gate.y, z: 0.3 },
      ),
      between(gate, n[4], 0.28, 0.04),
    ],
    anchors: [
      { ...n[0], w: 0.78 }, { ...n[1], w: 0.68 }, { ...n[2], w: 0.88 },
      { ...n[3], w: 0.68 }, { ...n[4], w: 0.8 }, { ...gate, w: 0.94 },
    ],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 4]],
  };
})();

/**
 * RelayOps — a hub and the systems it relays to, with one retry loop.
 * The product is one control plane over runs, alerts and evidence: a console in
 * the middle, the watched systems around it, and a retry that comes back.
 */
const relayops: FigureSpec = (() => {
  const r = 0.44;
  const angles = [200, 262, 324, 26, 88];
  const outer = angles.map((deg, i) => {
    const a = (deg * Math.PI) / 180;
    return { x: Math.cos(a) * r * 1.15, y: Math.sin(a) * r * 0.86, z: (i % 2 ? 0.26 : -0.26) };
  });
  const strokes: Stroke[] = [
    ellipse(0, 0, 0.15, 0.15, 0, 0.1, 30),
    ellipse(0, 0, 0.062, 0.062, 0, 0, 16),
  ];
  for (const p of outer) {
    const s = 0.052;
    strokes.push(shape(
      { x: p.x - s, y: p.y - s, z: p.z }, { x: p.x + s, y: p.y - s, z: p.z },
      { x: p.x + s, y: p.y + s, z: p.z }, { x: p.x - s, y: p.y + s, z: p.z },
    ));
    const len = Math.hypot(p.x, p.y);
    const ux = p.x / len;
    const uy = p.y / len;
    strokes.push({
      pts: [{ x: ux * 0.16, y: uy * 0.16, z: 0 }, { x: p.x - ux * 0.08, y: p.y - uy * 0.08, z: p.z }],
      density: 0.75,
    });
  }
  // The retry: a loop that leaves one node and returns to it.
  const back = outer[2];
  strokes.push(ellipse(back.x + 0.09, back.y + 0.1, 0.075, 0.075, back.z, 0, 24));
  return {
    aspect: 1.3,
    strokes,
    anchors: [
      { x: 0, y: 0, w: 0.95 },
      ...outer.map((p, i) => ({ x: p.x, y: p.y, z: p.z, w: i === 2 ? 0.82 : 0.7 })),
    ],
    links: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  };
})();

/**
 * PetPoint Ops Hub — a storefront with a counter and a graph line.
 * A retail back office: the shop it reports on, and the scheduled report
 * rising over the counter.
 */
const petpoint: FigureSpec = {
  aspect: 1.4,
  strokes: [
    shape({ x: -0.62, y: 0.18 }, { x: -0.5, y: 0.34 }, { x: 0.5, y: 0.34 }, { x: 0.62, y: 0.18 }),
    line({ x: -0.56, y: 0.18 }, { x: -0.56, y: -0.38 }, { x: 0.56, y: -0.38 }, { x: 0.56, y: 0.18 }),
    line({ x: -0.1, y: -0.38 }, { x: -0.1, y: -0.02 }, { x: 0.16, y: -0.02 }, { x: 0.16, y: -0.38 }),
    { pts: [{ x: -0.5, y: -0.16 }, { x: -0.5, y: -0.3 }, { x: -0.2, y: -0.3 }, { x: -0.2, y: -0.16 }, { x: -0.5, y: -0.16 }], density: 0.85 },
    // The report, floating in front of the shop.
    line(
      { x: 0.22, y: -0.04, z: 0.34 }, { x: 0.32, y: 0.05, z: 0.34 },
      { x: 0.4, y: -0.01, z: 0.34 }, { x: 0.5, y: 0.12, z: 0.34 },
    ),
    { pts: [{ x: 0.2, y: -0.12, z: 0.34 }, { x: 0.54, y: -0.12, z: 0.34 }], density: 0.6 },
  ],
  anchors: [
    { x: -0.5, y: 0.34, w: 0.72 },
    { x: 0.5, y: 0.34, w: 0.72 },
    { x: -0.56, y: -0.38, w: 0.56 },
    { x: 0.56, y: -0.38, w: 0.56 },
    { x: -0.1, y: -0.02, w: 0.62 },
    { x: 0.16, y: -0.02, w: 0.62 },
    { x: 0.22, y: -0.04, z: 0.34, w: 0.78 },
    { x: 0.5, y: 0.12, z: 0.34, w: 0.93 },
  ],
  links: [[0, 1], [0, 2], [1, 3], [4, 5], [6, 7]],
};

/**
 * Cake Studio — a three-tier cake on its turntable.
 * The product's own proof view renders a three-tier cake; this is that cake,
 * with the turntable it is inspected on.
 */
const cakeStudio: FigureSpec = {
  aspect: 1.15,
  strokes: [
    ellipse(0, -0.4, 0.44, 0.075, 0, 0.26, 44),
    ellipse(0, -0.16, 0.32, 0.055, 0, 0.2, 36),
    ellipse(0, 0.04, 0.21, 0.04, 0, 0.14, 30),
    ellipse(0, 0.2, 0.115, 0.028, 0, 0.08, 24),
    line({ x: -0.34, y: -0.4, z: 0.2 }, { x: -0.32, y: -0.16, z: 0.2 }),
    line({ x: 0.34, y: -0.4, z: 0.2 }, { x: 0.32, y: -0.16, z: 0.2 }),
    line({ x: -0.22, y: -0.16, z: 0.16 }, { x: -0.21, y: 0.04, z: 0.14 }),
    line({ x: 0.22, y: -0.16, z: 0.16 }, { x: 0.21, y: 0.04, z: 0.14 }),
    line({ x: -0.12, y: 0.04, z: 0.1 }, { x: -0.115, y: 0.2, z: 0.08 }),
    line({ x: 0.12, y: 0.04, z: 0.1 }, { x: 0.115, y: 0.2, z: 0.08 }),
    { pts: [{ x: 0, y: 0.2 }, { x: 0, y: 0.33 }], density: 0.9 },
  ],
  anchors: [
    { x: -0.44, y: -0.4, w: 0.6 },
    { x: 0.44, y: -0.4, w: 0.6 },
    { x: -0.32, y: -0.16, z: 0.2, w: 0.7 },
    { x: 0.32, y: -0.16, z: 0.2, w: 0.7 },
    { x: -0.21, y: 0.04, z: 0.14, w: 0.76 },
    { x: 0.21, y: 0.04, z: 0.14, w: 0.76 },
    { x: -0.115, y: 0.2, z: 0.08, w: 0.82 },
    { x: 0.115, y: 0.2, z: 0.08, w: 0.82 },
    { x: 0, y: 0.37, w: 0.95 },
  ],
  links: [[0, 2], [2, 4], [4, 6], [6, 8], [8, 7], [7, 5], [5, 3], [3, 1]],
};

/**
 * Medmac Box Studio — a carton, and the dieline it is cut from.
 *
 * The figure is the only one on the page with two poses. It arrives as a closed
 * box and opens, panel by panel, into the flat dieline while the chapter is
 * read: the fold IS the reading. Both poses carry the same six panels in the
 * same order, so every star keeps its own corner all the way through and the
 * seams simply come apart.
 */
const boxStudio: FigureSpec = (() => {
  const s = 0.17;
  const yaw = (32 * Math.PI) / 180;
  const pitch = (-17 * Math.PI) / 180;
  const turn = (p: [number, number, number]): Pt => {
    const [x, y, z] = p;
    const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
    const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);
    return { x: x1 * 1.35, y: y2 * 1.35, z: z2 * 1.3 };
  };
  const c = (sx: number, sy: number, sz: number): [number, number, number] => [sx * s, sy * s, sz * s];
  // Every face is listed bottom-left, bottom-right, top-right, top-left as seen
  // from outside, which is what makes the fold continuous.
  const faces: [number, number, number][][] = [
    [c(-1, -1, 1), c(1, -1, 1), c(1, 1, 1), c(-1, 1, 1)],     // front
    [c(1, -1, 1), c(1, -1, -1), c(1, 1, -1), c(1, 1, 1)],     // right
    [c(1, -1, -1), c(-1, -1, -1), c(-1, 1, -1), c(1, 1, -1)], // back
    [c(-1, -1, -1), c(-1, -1, 1), c(-1, 1, 1), c(-1, 1, -1)], // left
    [c(-1, 1, 1), c(1, 1, 1), c(1, 1, -1), c(-1, 1, -1)],     // top
    [c(-1, -1, -1), c(1, -1, -1), c(1, -1, 1), c(-1, -1, 1)], // bottom
  ];
  const closed = faces.map(f => shape(...f.map(turn)));

  const p = 0.15;
  const panel = (cx: number, cy: number): Pt[] => [
    { x: cx - p, y: cy - p, z: 0 }, { x: cx + p, y: cy - p, z: 0 },
    { x: cx + p, y: cy + p, z: 0 }, { x: cx - p, y: cy + p, z: 0 },
  ];
  // Left, front, right, back in a strip; top and bottom hinged off the front.
  const flat = [panel(-0.15, 0), panel(0.15, 0), panel(0.45, 0), panel(-0.45, 0), panel(-0.15, 0.3), panel(-0.15, -0.3)];
  const open = flat.map(q => shape(...q));

  // The anchors are the front panel's four corners and the top panel's four.
  // Two of them sit on the same cube corner while the box is closed and come
  // apart as it opens: that pair is the seam, and it is the point of the figure.
  const pick: [number, number][] = [[0, 0], [0, 1], [0, 2], [0, 3], [4, 0], [4, 1], [4, 2], [4, 3]];
  const ws = [0.86, 0.7, 0.72, 0.88, 0.92, 0.74, 0.7, 0.9];
  return {
    aspect: 1.45,
    strokes: closed,
    anchors: pick.map(([f, i], k) => ({ ...turn(faces[f][i]), w: ws[k] })),
    links: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4]],
    open: {
      strokes: open,
      anchors: pick.map(([f, i], k) => ({ ...flat[f][i], w: ws[k] })),
    },
  };
})();

/**
 * Sheep Business Management — a pen with one gate, and the count kept beside
 * it. The product closes a cycle on counted animals in a test farm and keeps
 * every change traceable, which is a fence, a gate and a tally.
 */
const sheep: FigureSpec = (() => {
  // A pen seen at an angle, with a gate in the near side, and the count kept
  // beside it. A ring of posts read as scattered ticks; a quadrilateral reads
  // as an enclosure, which is what the product keeps a cycle inside.
  const A = { x: -0.56, y: -0.3 };
  const B = { x: 0.26, y: -0.3 };
  const C = { x: 0.18, y: 0.16 };
  const D = { x: -0.44, y: 0.16 };
  const strokes: Stroke[] = [];
  const rail = (a: Pt, b: Pt, z: number, posts: number, gap?: [number, number]) => {
    strokes.push({ pts: [{ ...a, z }, { ...b, z }], density: 0.8 });
    for (let i = 1; i <= posts; i++) {
      const t = i / (posts + 1);
      if (gap && t > gap[0] && t < gap[1]) continue;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      strokes.push({ pts: [{ x, y: y - 0.05, z }, { x, y: y + 0.05, z }], density: 1.3 });
    }
  };
  rail(A, B, 0.22, 7);
  rail(D, C, -0.2, 6);
  rail(A, D, -0.06, 3);
  // The near side carries the gate: the rail stops, two taller posts stand, and
  // the bar between them is open.
  strokes.push({ pts: [{ x: B.x, y: B.y, z: 0.18 }, { x: B.x - 0.02, y: B.y + 0.12, z: 0.12 }], density: 0.8 });
  strokes.push({ pts: [{ x: C.x, y: C.y, z: -0.16 }, { x: C.x + 0.02, y: C.y - 0.12, z: -0.1 }], density: 0.8 });
  strokes.push({ pts: [{ x: 0.24, y: -0.24, z: 0.16 }, { x: 0.24, y: -0.04, z: 0.16 }], density: 1.5 });
  strokes.push({ pts: [{ x: 0.2, y: 0.1, z: -0.14 }, { x: 0.2, y: -0.1, z: -0.14 }], density: 1.5 });
  strokes.push({ pts: [{ x: 0.24, y: -0.16, z: 0.16 }, { x: 0.2, y: 0.02, z: -0.14 }], density: 0.9 });
  // The tally, above the pen: what the cycle is counted in.
  for (let i = 0; i < 4; i++) {
    const x = 0.34 + i * 0.06;
    strokes.push({ pts: [{ x, y: 0.24, z: -0.02 }, { x, y: 0.44, z: -0.02 }], density: 1.1 });
  }
  strokes.push({ pts: [{ x: 0.32, y: 0.28, z: -0.02 }, { x: 0.56, y: 0.4, z: -0.02 }], density: 1.1 });
  return {
    aspect: 1.35,
    strokes,
    anchors: [
      { ...A, z: 0.22, w: 0.66 },
      { ...B, z: 0.18, w: 0.84 },
      { ...C, z: -0.16, w: 0.8 },
      { ...D, z: -0.2, w: 0.62 },
      { x: 0.24, y: -0.04, z: 0.16, w: 0.9 },
      { x: 0.2, y: 0.1, z: -0.14, w: 0.72 },
      { x: 0.34, y: 0.44, z: -0.02, w: 0.74 },
      { x: 0.52, y: 0.44, z: -0.02, w: 0.7 },
    ],
    links: [[0, 1], [3, 0], [2, 3], [4, 5], [6, 7]],
  };
})();

/**
 * Spaceframe World — a triangulated truss, in two planes with cross braces.
 * The most literal constellation of the set: the product generates space frames,
 * and a space frame is already a figure made of nodes and straight members.
 */
const spaceframe: FigureSpec = (() => {
  const xs = [-0.52, -0.17, 0.17, 0.52];
  const top = 0.34;
  const bot = -0.34;
  // Shallow on purpose: the fit normalises x and y to the box but z rides along
  // with them, and a figure with half a box of depth projects a fifth wider than
  // its own fit at the near edge — which is how the truss came to hang thirty
  // pixels off the left of the frame.
  const planes = [0.24, -0.24];
  const strokes: Stroke[] = [];
  for (const z of planes) {
    const near = z > 0;
    strokes.push({ pts: xs.map(x => ({ x, y: top, z })), density: near ? 1 : 0.65 });
    strokes.push({ pts: xs.map(x => ({ x, y: bot, z })), density: near ? 1 : 0.65 });
    for (const x of xs) strokes.push({ pts: [{ x, y: bot, z }, { x, y: top, z }], density: near ? 0.9 : 0.55 });
    for (let i = 0; i < xs.length - 1; i++) {
      const a = i % 2 === 0 ? [bot, top] : [top, bot];
      strokes.push({ pts: [{ x: xs[i], y: a[0], z }, { x: xs[i + 1], y: a[1], z }], density: near ? 0.9 : 0.55 });
    }
  }
  // The braces between the two planes: what makes it a space frame rather than
  // a truss drawn twice.
  for (const x of xs) {
    strokes.push({ pts: [{ x, y: top, z: planes[0] }, { x, y: top, z: planes[1] }], density: 0.5 });
    strokes.push({ pts: [{ x, y: bot, z: planes[0] }, { x, y: bot, z: planes[1] }], density: 0.5 });
  }
  const anchors: Anchor[] = [];
  xs.forEach((x, i) => {
    anchors.push({ x, y: top, z: planes[0], w: i % 2 === 0 ? 0.88 : 0.68 });
    anchors.push({ x, y: bot, z: planes[0], w: i % 2 === 0 ? 0.7 : 0.84 });
  });
  return {
    aspect: 1.5,
    strokes,
    anchors,
    links: [[0, 2], [2, 4], [4, 6], [1, 3], [3, 5], [5, 7], [0, 1], [2, 3], [4, 5], [6, 7]],
  };
})();

/**
 * Public work — the four repositories, as four anchor stars joined by
 * hairlines. Nothing is drawn around them: the asterism IS the chapter, and the
 * HTML labels hanging off the anchors are the links.
 */
const publicWork: FigureSpec = {
  aspect: 1.5,
  strokes: [
    { pts: [{ x: -0.58, y: 0.16, z: -0.2 }, { x: -0.12, y: 0.31, z: 0.1 }], density: 0.4 },
    { pts: [{ x: -0.12, y: 0.31, z: 0.1 }, { x: 0.24, y: -0.07, z: 0.26 }], density: 0.4 },
    { pts: [{ x: 0.24, y: -0.07, z: 0.26 }, { x: 0.62, y: -0.27, z: -0.1 }], density: 0.4 },
    { pts: [{ x: -0.58, y: 0.16, z: -0.2 }, { x: 0.24, y: -0.07, z: 0.26 }], density: 0.28 },
  ],
  anchors: [
    { x: -0.58, y: 0.16, z: -0.2, w: 0.96, key: 'ask-repos' },
    { x: -0.12, y: 0.31, z: 0.1, w: 0.88, key: 'enterprise-ai-automation-templates' },
    { x: 0.24, y: -0.07, z: 0.26, w: 0.92, key: 'relayops' },
    { x: 0.62, y: -0.27, z: -0.1, w: 0.84, key: 'petpoint-ops-hub' },
  ],
  links: [[0, 1], [1, 2], [2, 3], [0, 2]],
};

/**
 * Contact — one star. The field draws inward and this is what is left: the
 * brightest star on the page, behind the line that asks for a reply.
 *
 * It fills a fifth of its seat, deliberately. Everything else on this page is a
 * figure that fills the frame; this one has to read as a POINT, with only
 * enough of a halo around it to say the stars came to it.
 */
const contactStar: FigureSpec = {
  aspect: 1,
  fill: 0.5,
  // A dusting, not a ring. A ring drawn with the same machinery as every other
  // figure comes out as a hard circle — the stroke sampler spaces stars evenly
  // along a line, and a small circle is a very short line.
  scatter: { radius: 0.5, share: 1, falloff: 1.15 },
  points: 150,
  strokes: [],
  anchors: [{ x: 0, y: 0, z: 0, w: 1 }],
  links: [],
};


/* ====================================================== round three figures */

/**
 * A portal — the aperture the five worlds are entered through.
 *
 * It is not a drawing of anything: it is the hole the stars open in the field
 * so a world's own key frame can be seen THROUGH it. Slightly wider than it is
 * tall, with a shallow swing in z so the parallax reads the rim as a ring in
 * space rather than a circle painted on the frame, and eight short ticks
 * outside it — an iris, not a coin.
 *
 * No hairlines: a chord across this figure would be a line drawn over the
 * picture, which is the one thing an aperture must not do.
 *
 * ROUND 4. The ticks were 15% of the rim radius long, drawn at nearly twice
 * the spacing of the rim itself, and each one began at a star heavy enough to
 * carry a diffraction spike. Eight bright spikes on radial stalks read as
 * LEGS — the aperture looked like a spider, not an iris. They are now a third
 * of that length, a third of that density, and their anchors sit well under
 * the spike threshold, so what the eye finds is the rim.
 */
/** How far the iris ticks reach past the rim, as a multiple of the rim radius. */
const PORTAL_TICK_OUT = 1.1;
/**
 * The rim's share of the portal figure's own fitted box.
 *
 * The figure is fitted to its whole extent, ticks included, so the rim is
 * smaller than the box the renderer seats. The plate has to fill the RIM and
 * not the box — this is the number that makes "edge to edge" exact, and it
 * moves whenever the tick length does, which is why it is derived and not
 * typed twice.
 */
export const PORTAL_RIM_SHARE = 1 / PORTAL_TICK_OUT;
/** The aperture's own ratio: the rim, and therefore the plate, is this wide. */
export const PORTAL_ASPECT = 1.12;

/** Exact ellipse and the eight inherited ticks. No x/y jitter at alignment. */
export function gateFigure(count: number): Figure {
  const n = Math.max(500, count), positions = new Float32Array(n * 3), weights = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const tick = i < 48;
    const angle = tick ? Math.floor(i / 6) * Math.PI / 4 + Math.PI / 8 : (i - 48) / (n - 48) * Math.PI * 2;
    const radius = tick ? 1.045 + (i % 6) / 5 * (PORTAL_TICK_OUT - 1.045) : 1;
    positions[i * 3] = Math.cos(angle) * .56 * radius / PORTAL_TICK_OUT;
    positions[i * 3 + 1] = Math.sin(angle) * .5 * radius / PORTAL_TICK_OUT;
    weights[i] = tick ? (Math.floor(i / 6) % 2 ? .30 : .42) : .08;
  }
  return { positions, weights, count: n, aspect: PORTAL_ASPECT, links: [] };
}

const portal: FigureSpec = (() => {
  const rx = 0.56;
  const ry = 0.5;
  const strokes: Stroke[] = [ellipse(0, 0, rx, ry, 0, 0.12, 112)];
  const anchors: Anchor[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const cx = Math.cos(a);
    const sy = Math.sin(a);
    // The tick sits OUTSIDE the rim and points away from the middle. It has to
    // clear the rim by more than the rim's own scatter or it reads as thickness.
    strokes.push({
      pts: [
        { x: cx * rx * 1.045, y: sy * ry * 1.045, z: Math.sin(a + Math.PI / 2) * 0.12 },
        { x: cx * rx * PORTAL_TICK_OUT, y: sy * ry * PORTAL_TICK_OUT,
          z: Math.sin(a + Math.PI / 2) * 0.12 },
      ],
      density: 0.55,
    });
    // Under 0.86 by a wide margin: an anchor above that threshold grows a
    // four-point diffraction spike, and eight of those around a rim are the
    // legs the director saw. These are just the eight stars that hold the
    // iris open.
    anchors.push({
      x: cx * rx, y: sy * ry, z: Math.sin(a + Math.PI / 2) * 0.12,
      w: i % 2 === 0 ? 0.42 : 0.3,
    });
  }
  // A ring is a very long stroke, and the spacing rule would seat a thousand
  // stars on it — a wire, not a gathering. Its own count, scaled by viewport.
  // Round 4 grew the ring by a sixth, and the count with it, so the spacing
  // between two stars on the rim is what it was when the figure was accepted.
  return { aspect: rx / ry, points: 950, strokes, anchors, links: [] };
})();

/**
 * WAR STRIKES — an arena, with a reticle over it.
 * The product is an arena shooter: the bowl it is played in, seen at an angle,
 * and the sight the player actually looks through.
 */
const warStrikes: FigureSpec = (() => {
  const strokes: Stroke[] = [
    // The bowl: a floor and a rim, with the stands between them.
    ellipse(0, -0.26, 0.33, 0.15, 0, 0.2, 52),
    ellipse(0, -0.03, 0.4, 0.185, 0, 0.24, 56),
  ];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    strokes.push({
      pts: [
        { x: c * 0.33, y: -0.26 + s * 0.15, z: Math.sin(a + Math.PI / 2) * 0.2 },
        { x: c * 0.4, y: -0.03 + s * 0.185, z: Math.sin(a + Math.PI / 2) * 0.24 },
      ],
      density: 0.6,
    });
  }
  // The reticle, in front of the bowl and centred ON it: four arcs with gaps at
  // the compass points, and a tick standing in each gap. The first build put it
  // above the bowl, where it read as a dome; a sight is something you look
  // THROUGH, so it sits over the middle of the arena.
  const cy = -0.03;
  // Smaller than the arena floor, deliberately: at the floor's own radius the
  // sight became a third nested ellipse and the figure read as rings.
  const r = 0.2;
  // Shallow, and it has to be. A seat's jitter carries a figure's own z into
  // WORLD depth, so a point authored half a unit forward lands a fifth of the
  // way nearer the eye and projects a quarter further from the view axis: the
  // first build of this reticle pushed the arena thirty pixels off the screen.
  const z = 0.24;
  for (let q = 0; q < 4; q++) {
    const from = q * (Math.PI / 2) + 0.3;
    const to = (q + 1) * (Math.PI / 2) - 0.3;
    const pts: Pt[] = [];
    for (let i = 0; i <= 11; i++) {
      const a = from + ((to - from) * i) / 11;
      pts.push({ x: Math.cos(a) * r, y: cy + Math.sin(a) * r, z });
    }
    strokes.push({ pts, density: 2.4 });
  }
  const ticks: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (const [dx, dy] of ticks) {
    strokes.push({
      pts: [
        { x: dx * r * 0.42, y: cy + dy * r * 0.42, z },
        { x: dx * r * 0.86, y: cy + dy * r * 0.86, z },
      ],
      density: 1.8,
    });
  }
  return {
    aspect: 1.5,
    strokes,
    anchors: [
      { x: -0.4, y: -0.03, z: 0, w: 0.56 },
      { x: 0.4, y: -0.03, z: 0, w: 0.56 },
      { x: 0, y: -0.41, z: -0.2, w: 0.62 },
      { x: 0, y: 0.155, z: 0.24, w: 0.58 },
      // The crosshair: the four tick ends and the pip in the middle. They are
      // the ONLY hairlines on this figure — a line drawn across the bowl reads
      // as a crack in the arena, which the first build shipped.
      { x: -r * 0.95, y: cy, z, w: 0.86 },
      { x: r * 0.95, y: cy, z, w: 0.86 },
      { x: 0, y: cy + r * 0.95, z, w: 0.86 },
      { x: 0, y: cy - r * 0.95, z, w: 0.86 },
      { x: 0, y: cy, z, w: 0.95 },
    ],
    links: [[4, 8], [8, 5], [6, 8], [8, 7]],
  };
})();

/**
 * Cocolani 3D — an island under a sky.
 * The remake's world is islands: a shore, the land rising out of it, one tree,
 * and the sun the whole thing is played under.
 */
const cocolani: FigureSpec = (() => {
  const strokes: Stroke[] = [
    // The waterline, running past the island on both sides.
    { pts: [{ x: -0.66, y: -0.3, z: -0.12 }, { x: -0.34, y: -0.3, z: -0.12 }], density: 0.55 },
    { pts: [{ x: 0.3, y: -0.3, z: -0.12 }, { x: 0.66, y: -0.3, z: -0.12 }], density: 0.55 },
    // The shore, and the land over it.
    ellipse(-0.02, -0.3, 0.34, 0.075, 0.06, 0.16, 34),
    {
      pts: [
        { x: -0.34, y: -0.3, z: 0.06 }, { x: -0.26, y: -0.18, z: 0.06 },
        { x: -0.16, y: -0.07, z: 0.06 }, { x: -0.05, y: 0.02, z: 0.06 },
        { x: 0.05, y: -0.02, z: 0.06 }, { x: 0.16, y: -0.12, z: 0.06 },
        { x: 0.3, y: -0.3, z: 0.06 },
      ],
      density: 1.5,
    },
    // One tree on the crest: a trunk that leans, and three fronds.
    { pts: [{ x: -0.05, y: 0.02, z: 0.1 }, { x: -0.02, y: 0.2, z: 0.1 }], density: 1.2 },
  ];
  const fronds: [number, number][] = [[-0.16, 0.06], [0.02, 0.12], [0.16, 0.02]];
  for (const [dx, dy] of fronds) {
    strokes.push({
      pts: [{ x: -0.02, y: 0.2, z: 0.1 }, { x: -0.02 + dx, y: 0.2 + dy, z: 0.1 }],
      density: 1.1,
    });
  }
  // The sun, high and to one side.
  strokes.push(ellipse(0.42, 0.42, 0.11, 0.11, -0.2, 0, 26));
  return {
    aspect: 1.55,
    strokes,
    anchors: [
      { x: -0.66, y: -0.3, z: -0.12, w: 0.5 },
      { x: 0.66, y: -0.3, z: -0.12, w: 0.5 },
      { x: -0.34, y: -0.3, z: 0.06, w: 0.72 },
      { x: 0.3, y: -0.3, z: 0.06, w: 0.72 },
      { x: -0.05, y: 0.02, z: 0.06, w: 0.84 },
      { x: -0.02, y: 0.2, z: 0.1, w: 0.78 },
      { x: 0.42, y: 0.42, z: -0.2, w: 0.95 },
    ],
    // Only the waterline and the trunk. The island's own silhouette is DRAWN,
    // and a hairline from shore to crest to shore turns that drawing into a
    // tent — the straight line wins over the curve underneath it every time.
    links: [[0, 2], [3, 1], [4, 5]],
  };
})();

/**
 * ARTILLERY3D — a shell on its arc.
 * A turn-based artillery game is one decision and one parabola: the barrel it
 * leaves, the apex it is judged at, and the ground it lands on.
 */
const artillery: FigureSpec = (() => {
  const x0 = -0.56;
  const x1 = 0.6;
  const ground = -0.38;
  const apexY = 0.5;
  const arc: Pt[] = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const x = x0 + (x1 - x0) * t;
    // A plain parabola through both ends, peaking in the middle.
    arc.push({ x, y: ground + (apexY - ground) * (4 * t * (1 - t)), z: t * 0.28 - 0.14 });
  }
  const strokes: Stroke[] = [
    { pts: arc, density: 0.85 },
    // The ground it is fired from and lands on.
    { pts: [{ x: -0.68, y: ground, z: 0 }, { x: 0.7, y: ground, z: 0 }], density: 0.5 },
    // The barrel, aimed along the arc's first leg.
    { pts: [{ x: x0 - 0.1, y: ground - 0.06, z: -0.14 }, { x: x0 + 0.1, y: ground + 0.14, z: -0.14 }], density: 1.6 },
  ];
  // The burst where it lands: three short rays, no circle.
  for (const a of [0.9, 1.5708, 2.24]) {
    strokes.push({
      pts: [
        { x: x1, y: ground, z: 0.14 },
        { x: x1 + Math.cos(a) * 0.17, y: ground + Math.sin(a) * 0.17, z: 0.14 },
      ],
      density: 1.2,
    });
  }
  return {
    aspect: 1.6,
    strokes,
    anchors: [
      { x: x0 - 0.1, y: ground - 0.06, z: -0.14, w: 0.66 },
      { x: x0 + 0.1, y: ground + 0.14, z: -0.14, w: 0.8 },
      { x: (x0 + x1) / 2, y: apexY, z: 0, w: 0.95 },
      { x: x1, y: ground, z: 0.14, w: 0.9 },
      { x: -0.68, y: ground, z: 0, w: 0.46 },
      { x: 0.7, y: ground, z: 0, w: 0.46 },
    ],
    // The barrel and the ground it stands on. The chords from the muzzle to the
    // apex and down to the impact were a triangle drawn across the parabola,
    // and a straight line over a curve is the line you see.
    links: [[0, 1], [4, 0], [3, 5]],
  };
})();

/**
 * Polyblast Arena — a low-poly arena.
 * The original game is built out of faceted geometry, so the figure is the
 * geometry: a hexagonal bowl, its facets, and the pit in the middle.
 */
const polyblast: FigureSpec = (() => {
  const ring = (r: number, y: number, z: number) => {
    const pts: Pt[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      // 0.62, not a third: a hexagon squashed to a third of its width is an
      // aspect of 2.4, and a figure that wide is bound by its seat's width and
      // comes out a quarter of the viewport tall instead of nearly half.
      pts.push({ x: Math.cos(a) * r, y: y + Math.sin(a) * r * 0.62, z: z + Math.sin(a) * 0.2 });
    }
    return pts;
  };
  const outer = ring(0.64, 0.02, 0);
  const inner = ring(0.3, -0.12, 0);
  const strokes: Stroke[] = [
    { pts: outer, closed: true },
    { pts: inner, closed: true, density: 0.9 },
  ];
  for (let i = 0; i < 6; i++) {
    strokes.push({ pts: [outer[i], inner[i]], density: 0.7 });
    // One diagonal per facet: that is what makes it read as triangulated.
    strokes.push({ pts: [outer[i], inner[(i + 1) % 6]], density: 0.45 });
  }
  return {
    aspect: 1.45,
    strokes,
    anchors: [
      ...outer.map((p, i) => ({ ...p, w: i % 2 === 0 ? 0.88 : 0.68 })),
      ...inner.filter((_, i) => i % 2 === 0).map(p => ({ ...p, w: 0.6 })),
    ],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  };
})();

/**
 * MK Voice — a waveform on a timeline, with a gate on it.
 * The engine is not a voice: it is a run of training passes measured against a
 * bar a version has to clear before it is kept.
 */
const mkVoice: FigureSpec = (() => {
  const strokes: Stroke[] = [
    { pts: [{ x: -0.74, y: 0, z: 0 }, { x: 0.74, y: 0, z: 0 }], density: 0.55 },
  ];
  // A settled envelope: it grows, wobbles, and holds. Authored, not random, so
  // the same figure ships on every load.
  const heights = [0.06, 0.13, 0.09, 0.22, 0.17, 0.31, 0.24, 0.38, 0.29, 0.42,
                   0.34, 0.45, 0.37, 0.41, 0.33, 0.44, 0.36, 0.4, 0.3, 0.35];
  heights.forEach((h, i) => {
    const x = -0.68 + (i / (heights.length - 1)) * 1.3;
    strokes.push({ pts: [{ x, y: -h, z: 0.06 }, { x, y: h, z: 0.06 }], density: 1.15 });
  });
  // The gate: a mark across the run, with a tick where a version clears it.
  const gx = 0.34;
  strokes.push({ pts: [{ x: gx, y: -0.56, z: 0.22 }, { x: gx, y: 0.56, z: 0.22 }], density: 0.8 });
  strokes.push(shape(
    { x: gx - 0.07, y: 0.46, z: 0.22 }, { x: gx, y: 0.53, z: 0.22 },
    { x: gx + 0.07, y: 0.46, z: 0.22 }, { x: gx, y: 0.39, z: 0.22 },
  ));
  return {
    aspect: 1.55,
    strokes,
    anchors: [
      { x: -0.74, y: 0, z: 0, w: 0.5 },
      { x: 0.74, y: 0, z: 0, w: 0.5 },
      { x: 0.02, y: 0.45, z: 0.06, w: 0.78 },
      { x: 0.02, y: -0.45, z: 0.06, w: 0.7 },
      { x: gx, y: 0.56, z: 0.22, w: 0.94 },
      { x: gx, y: -0.56, z: 0.22, w: 0.8 },
    ],
    links: [[0, 1], [4, 5], [2, 3]],
  };
})();

/**
 * The tools — twelve skills as twelve labelled stars.
 *
 * Nothing is drawn around them: like the public repositories, the asterism IS
 * the chapter. The anchors are laid out with twelve DISTINCT heights, evenly
 * spaced, because each one carries an HTML chip and two chips at the same
 * height collide whatever the renderer does about which side they hang on. The
 * figure is a little taller than it is wide for the same reason: in portrait a
 * seat is bounded by its width, and a wide asterism would squeeze twelve rows
 * into a third of the screen.
 */

// Workshop input/output strokes share topology after deterministic resampling.
const xy = (pairs:number[][]):Stroke => line(...pairs.map(([x,y])=>({x,y})));
const rect = (x:number,y:number,w:number,h:number):Stroke => xy([[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]]);
const head = () => ellipse(0,.12,.25,.34);
const body = (posed=false):Stroke[] => [node(0,.35,.09),xy([[0,.26],[0,-.12]]),xy(posed?[[-.32,.22],[0,.1],[.3,.35]]:[[-.3,.15],[0,.12],[.3,.15]]),xy(posed?[[-.3,-.4],[0,-.12],[.18,-.46]]:[[-.18,-.46],[0,-.12],[.18,-.46]])];
const grid=(tick=false):Stroke[]=>Array.from({length:6},(_,i)=>{const x=(i%3-1)*.3,y=(Math.floor(i/3)-.5)*.4;return tick?xy([[x-.09,y],[x-.02,y-.07],[x+.12,y+.1]]):rect(x-.1,y-.12,.2,.24)});
const gear=(cx:number,cy:number,r:number)=>({closed:true,pts:Array.from({length:48},(_,i)=>{const a=i/48*Math.PI*2,rr=r*(i%4<2?1:.78);return{x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr}})});
const uv=()=>xy([[0,.42],[-.4,.36],[-.25,.08],[-.48,-.28],[0,-.38],[.48,-.28],[.25,.08],[.4,.36],[0,.42]]);
const poses:[Stroke[],Stroke[]][] = [
 [[rect(-.42,.12,.22,.28),rect(.16,-.35,.22,.28),rect(-.2,-.24,.2,.25)],[xy([[-.38,.25],[0,.4],[.35,.12],[.22,-.35],[-.3,-.2],[-.38,.25]]),xy([[0,.4],[-.3,-.2],[.35,.12]])]],
 [[rect(-.35,-.44,.7,.88)],[head(),ellipse(0,.12,.12,.34),ellipse(0,.12,.25,.12)]],
 [[rect(-.45,-.4,.26,.8),rect(-.13,-.4,.26,.8),rect(.19,-.4,.26,.8)],body()],
 [[head(),xy([[-.15,.15],[.15,.15]]),xy([[0,.1],[0,-.05],[.06,-.05]])],[uv(),xy([[-.4,.36],[.48,-.28]]),xy([[.4,.36],[-.48,-.28]])]],
 [[rect(-.35,-.35,.7,.7),xy([[-.35,0],[.35,0]])],[head(),ellipse(0,.12,.25,.12)]],
 [[xy([[-.4,.35],[.3,.35],[.4,-.3],[-.3,-.3],[-.4,.35]])],[xy([[-.15,.35],[-.4,.22],[-.3,0],[-.2,.04],[-.22,-.4],[.22,-.4],[.2,.04],[.3,0],[.4,.22],[.15,.35],[0,.25],[-.15,.35]])]],
 [body(),body(true)],
 [[rect(-.4,-.3,.8,.6),xy([[-.4,0],[.4,0]]),xy([[0,-.3],[0,.3]])],[xy([[-.4,0],[0,.25],[.4,0],[0,-.25],[-.4,0]]),xy([[0,.25],[0,.5],[.4,.25],[.4,0]]),xy([[0,-.25],[0,0],[.4,.25]])]],
 [[rect(-.35,-.3,.3,.4),rect(-.12,-.2,.35,.35),rect(.1,-.35,.3,.5)],grid()],
 [[gear(-.2,.1,.2),gear(.3,-.22,.1)],[gear(-.23,.1,.25),gear(.24,-.12,.3)]],
 [[rect(-.4,-.35,.8,.7),xy([[-.3,-.25],[0,.2],[.3,-.25]])],[xy([[-.5,-.4],[-.5,.45],[-.3,.5]]),xy([[.5,-.4],[.5,.45],[.3,.5]]),xy([[-.3,-.25],[0,.2],[.3,-.25]])]],
 [[rect(-.28,-.44,.56,.88),...Array.from({length:5},(_,i)=>xy([[-.2,.3-i*.14],[.2,.3-i*.14]]))],[rect(-.45,-.25,.9,.5),...Array.from({length:5},(_,i)=>rect(-.4+i*.17,-.18,.1,.36))]],
 [[...grid(),xy([[-.4,0],[.4,0]])],[xy([[-.35,.25],[.35,.25]]),xy([[-.35,0],[.25,0]]),xy([[-.35,-.25],[.12,-.25]])]],
 [grid(),[...grid(),...Array.from({length:6},(_,i)=>xy([[(i%3-1)*.3-.07,(Math.floor(i/3)-.5)*.4],[(i%3-1)*.3+.04,(Math.floor(i/3)-.5)*.4+.07]]))]],
 [[rect(-.35,.2,.15,.15),rect(-.35,-.07,.15,.15),rect(-.35,-.34,.15,.15)],[xy([[-.35,.26],[-.28,.2],[-.17,.36]]),xy([[-.35,-.01],[-.28,-.07],[-.17,.09]]),xy([[-.35,-.28],[-.28,-.34],[-.17,-.18]])]],
 [[node(0,0,.15)],[node(-.3,0,.1),node(.3,.34,.07),node(.3,0,.07),node(.3,-.34,.07),xy([[-.2,0],[.23,.34]]),xy([[-.2,0],[.23,0]]),xy([[-.2,0],[.23,-.34]])]],
 ];
function twoPose(a:Stroke[],b:Stroke[],key?:string):FigureSpec {
  const count=Math.max(a.length,b.length);
  const sample=(strokes:Stroke[])=>Array.from({length:count},(_,i)=>{
    const s=strokes[i%strokes.length],pts=s.closed?[...s.pts,s.pts[0]]:s.pts;
    return {pts:Array.from({length:49},(_,j)=>{const f=j/48*(pts.length-1),at=Math.min(pts.length-2,Math.floor(f)),t=f-at;return{x:pts[at].x*(1-t)+pts[at+1].x*t,y:pts[at].y*(1-t)+pts[at+1].y*t,z:0}})};
  });
  const anchors:Anchor[]=key?[{x:0,y:-.48,w:.9,key}]:[];
  return {aspect:1,points:1100,strokes:sample(a),anchors,links:[],open:{strokes:sample(b),anchors}};
}
const workshopFigures=Object.fromEntries(workshop.map((t,i)=>[`skill-${t.key}`,twoPose(poses[i][0],poses[i][1],t.key)]));
const toolsFigure=twoPose(poses[0][1],poses[0][1]);

// The contour face is drawn geometry, not an invented character likeness.
// Each contour carries a time slice of a real held-out spectral comparison.
function ringFace(spec:number[][],dx:number):Stroke[] {
  const rings:Stroke[]=spec.map((row,k)=>({closed:true,pts:Array.from({length:96},(_,i)=>{
    const a=i/96*Math.PI*2,r=.12+k*.026,energy=row[Math.floor(i/4)]*.035;
    return {x:dx+Math.cos(a)*(r+energy)*.7,y:.04+Math.sin(a)*(r+energy),z:Math.cos(a)*.05};
  })}));
  rings.push(xy(Array.from({length:96},(_,i)=>[dx+(i/95-.5)*.6,-.13+Math.sin(i*.55)*spec[7][Math.floor(i/4)]*.045])));
  rings.push(ellipse(dx-.1,.14,.05,.022),ellipse(dx+.1,.14,.05,.022),xy([[dx,.13],[dx-.025,-.015],[dx+.03,-.015]]));
  return rings;
}
const referenceFace=ringFace(voiceShapes.reference,-.15),cloneFace=ringFace(voiceShapes.clone,.22);
const voiceStudio=twoPose([...referenceFace,...cloneFace],[...referenceFace,...ringFace(voiceShapes.clone,-.15)]);
voiceStudio.points=5000;
// An unscaled dial, ending at the stored comparison's measured angle.
const dial=(angle:number)=>xy(Array.from({length:49},(_,i)=>[Math.cos(i/48*angle)*.48,Math.sin(i/48*angle)*.48]));
voiceStudio.strokes.push(dial(Math.PI*.25));voiceStudio.open!.strokes.push(dial(voiceShapes.dialRadians));
const capsuleFigures=Object.fromEntries(['keeber','hazalqoum','lemby','bayoumi','daheeh'].map(key=>{
  const envelope=(voiceShapes.envelopes as Record<string,number[]>)[key];
  const ring=(y:number,r:number)=>({closed:true,pts:Array.from({length:96},(_,i)=>{const a=i/96*Math.PI*2,rr=r*(1+(envelope?.[i]??0)*.12);return{x:Math.cos(a)*rr,y:y+Math.sin(a)*rr*.22,z:Math.sin(a)*.2}})});
  const strokes:Stroke[]=[ring(.43,.3),ring(-.4,.3),ring(-.47,.37),...Array.from({length:10},(_,i)=>{const x=Math.cos(i/10*Math.PI*2)*.3;return{...xy([[x,.43],[x,-.4]]),density:.15}})];
  return [`voice-${key}`,{aspect:.78,points:1300,strokes,anchors:[],links:[]}] as [string,FigureSpec];
}));
export const FIGURES: Record<string, FigureSpec> = {
  // The worlds all open through the same aperture.
  portal,
  // The four games, each drawn from what it actually is.
  'war-strikes': warStrikes,
  'cocolani-3d': cocolani,
  artillery3d: artillery,
  'polyblast-arena': polyblast,
  'mk-voice': voiceStudio,
  ...workshopFigures,
  ...capsuleFigures,
  // The systems. Round 2 drew eight; the landing now flies past the five the
  // site's own featured order ranks first, and the other three keep their
  // figures here for the round that wants them back.
  'ask-repos': askRepos,
  'enterprise-ai-automation-templates': templates,
  relayops,
  'petpoint-ops-hub': petpoint,
  'cake-studio': cakeStudio,
  'medmac-box-studio': boxStudio,
  'sheep-business-management': sheep,
  'spaceframe-world': spaceframe,
  tools: toolsFigure,
  public: publicWork,
  contact: contactStar,
};

/** The figure's aspect after it is fitted to its own box. */
export function figureAspect(spec: FigureSpec): number {
  return fitOf(spec).aspect;
}

/**
 * Total stroke length of a figure, in FITTED units (the box is one unit tall).
 * The star count is decided from this, so the spacing between two stars along a
 * stroke is the same on every figure and at every viewport.
 */
export function strokeLength(spec: FigureSpec): number {
  const fit = fitOf(spec);
  let total = 0;
  for (const stroke of spec.strokes) {
    const pts = stroke.pts;
    const segs = stroke.closed ? pts.length : pts.length - 1;
    let len = 0;
    for (let i = 0; i < segs; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      len += Math.hypot(b.x - a.x, b.y - a.y) * fit.sx;
    }
    total += len * (stroke.density ?? 1);
  }
  return total;
}

/* ------------------------------------------------------------- the sampler */

/** Deterministic PRNG, so a figure is a pure function of its spec and count. */
function seeded(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const at = (p: Pt) => ({ x: p.x, y: p.y, z: p.z ?? 0 });

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: (a.z ?? 0) + ((b.z ?? 0) - (a.z ?? 0)) * t };
}

/** The stroke list at a fold value: pose A, pose B, or anywhere between. */
function posed(spec: FigureSpec, fold: number): { strokes: Stroke[]; anchors: Anchor[] } {
  if (!spec.open || fold <= 0) return { strokes: spec.strokes, anchors: spec.anchors };
  if (fold >= 1) return spec.open;
  const strokes = spec.strokes.map((s, i) => {
    const other = spec.open!.strokes[i] ?? s;
    return { ...s, pts: s.pts.map((p, j) => lerpPt(p, other.pts[j] ?? p, fold)) };
  });
  const anchors = spec.anchors.map((a, i) => {
    const other = spec.open!.anchors[i] ?? a;
    return { ...a, ...lerpPt(a, other, fold) };
  });
  return { strokes, anchors };
}

/**
 * Fit a figure to its own box.
 *
 * A figure is authored at whatever coordinates read well while drawing it; the
 * truss happens to occupy two fifths of the unit height and the magnifier
 * nearly all of it. Left alone, that is the difference between a figure at 45%
 * of the viewport and one at 20% — Round 2's first captures had exactly that
 * spread. The transform is computed from the figure's own extent, over BOTH
 * poses, so a folding figure keeps one scale and one aspect all the way open
 * and the fold stays a fold.
 */
const fits = new WeakMap<FigureSpec, { sx: number; ox: number; oy: number; aspect: number }>();

function fitOf(spec: FigureSpec) {
  const cached = fits.get(spec);
  if (cached) return cached;
  let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
  const take = (p: Pt) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  };
  for (const pose of [spec, spec.open].filter(Boolean) as { strokes: Stroke[]; anchors: Anchor[] }[]) {
    for (const stroke of pose.strokes) stroke.pts.forEach(take);
    pose.anchors.forEach(take);
  }
  // A scatter has extent too, and it is usually the whole of it.
  if (spec.scatter) {
    take({ x: -spec.scatter.radius, y: -spec.scatter.radius });
    take({ x: spec.scatter.radius, y: spec.scatter.radius });
  }
  const height = Math.max(1e-4, maxY - minY);
  const width = Math.max(1e-4, maxX - minX);
  const fit = {
    sx: (spec.fill ?? 1) / height,
    ox: -(minX + maxX) / 2,
    oy: -(minY + maxY) / 2,
    aspect: width / height,
  };
  fits.set(spec, fit);
  return fit;
}

/**
 * Seat `count` stars on a figure.
 *
 * The anchors come first and keep the low indices, so they are the same stars
 * in every pose and at every viewport, and the stagger can land them before the
 * detail. The rest are distributed along the strokes by LENGTH, so a long rim
 * and a short rule get the same spacing, with a little scatter across and along
 * the stroke — a line made of stars, not a wire.
 */
export function drawnFigure(spec: FigureSpec, count: number, fold = 0, seed = 0x5a1e): Figure | null {
  const raw = posed(spec, fold);
  const fit = fitOf(spec);
  // Fit FIRST, sample second, so the scatter across a stroke is measured in the
  // units the figure actually ships in.
  const map = (p: Pt): Pt => ({ x: (p.x + fit.ox) * fit.sx, y: (p.y + fit.oy) * fit.sx, z: (p.z ?? 0) * fit.sx });
  const strokes = raw.strokes.map(st => ({ ...st, pts: st.pts.map(map) }));
  const anchors = raw.anchors.map(a => ({ ...a, ...map(a) }));
  const nAnchor = anchors.length;
  const total = Math.max(nAnchor + 8, Math.round(count));
  const positions = new Float32Array(total * 3);
  const weights = new Float32Array(total);
  const random = seeded(seed);

  for (let i = 0; i < nAnchor; i++) {
    const a = at(anchors[i]);
    positions[i * 3] = a.x;
    positions[i * 3 + 1] = a.y;
    positions[i * 3 + 2] = a.z;
    weights[i] = anchors[i].w;
  }

  // Length of every stroke, weighted by its own density — measured on the BASE
  // pose, always. A folding figure changes its stroke lengths as it opens, and
  // re-deciding the shares mid-fold would move stars from one stroke to another
  // in the middle of the move, which is the one thing point identity forbids.
  const lengths = spec.strokes.map(raw2 => {
    const stroke = { ...raw2, pts: raw2.pts.map(map) };
    const pts = stroke.pts;
    let len = 0;
    const n = stroke.closed ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) {
      const a = at(pts[i]);
      const b = at(pts[(i + 1) % pts.length]);
      len += Math.hypot(b.x - a.x, b.y - a.y, (b.z - a.z) * 0.6);
    }
    return len * (stroke.density ?? 1);
  });
  const sum = lengths.reduce((a, b) => a + b, 0);

  if (nAnchor === 0 && sum <= 0 && !spec.scatter) return null;
  let write = nAnchor;
  let budget = total - nAnchor;

  // The scatter: a disc around the origin with a radial falloff, seeded from
  // the same source as everything else so it is identical on every load.
  if (spec.scatter) {
    const take = Math.min(budget, Math.round(budget * spec.scatter.share));
    const radius = spec.scatter.radius * fit.sx;
    const falloff = spec.scatter.falloff ?? 2;
    for (let k = 0; k < take && write < total; k++, write++) {
      const a = random() * Math.PI * 2;
      const r = Math.pow(random(), falloff) * radius;
      positions[write * 3] = Math.cos(a) * r;
      positions[write * 3 + 1] = Math.sin(a) * r;
      positions[write * 3 + 2] = (random() - 0.5) * radius * 0.7;
      weights[write] = 0;
    }
    budget -= take;
  }
  for (let s = 0; sum > 0 && s < strokes.length && write < total; s++) {
    const stroke = strokes[s];
    const share = s === strokes.length - 1 ? total - write : Math.round((lengths[s] / sum) * budget);
    if ((stroke.density ?? 1) <= 0) continue;
    const take = Math.max(0, Math.min(total - write, share));
    const pts = stroke.pts;
    const segs = stroke.closed ? pts.length : pts.length - 1;
    // Cumulative length, so points land evenly along the whole stroke rather
    // than evenly per segment: a polyline with one long leg is not a rhythm.
    const cum: number[] = [0];
    for (let i = 0; i < segs; i++) {
      const a = at(pts[i]);
      const b = at(pts[(i + 1) % pts.length]);
      cum.push(cum[i] + Math.hypot(b.x - a.x, b.y - a.y, (b.z - a.z) * 0.6));
    }
    const len = cum[segs] || 1e-6;
    for (let k = 0; k < take; k++) {
      const t = ((k + 0.5) / take + (random() - 0.5) * 0.7 / take) * len;
      let i = 0;
      while (i < segs - 1 && cum[i + 1] < t) i++;
      const a = at(pts[i]);
      const b = at(pts[(i + 1) % pts.length]);
      const f = (t - cum[i]) / Math.max(1e-6, cum[i + 1] - cum[i]);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1e-6;
      // Scatter ACROSS the stroke, so the line has a thickness of stars.
      const off = (random() + random() - 1) * 0.011;
      positions[write * 3] = a.x + dx * f - (dy / d) * off;
      positions[write * 3 + 1] = a.y + dy * f + (dx / d) * off;
      positions[write * 3 + 2] = a.z + ((b.z - a.z) * f) + (random() - 0.5) * 0.03;
      weights[write] = 0;
      write++;
    }
  }
  // A stroke list that rounded short leaves the tail unwritten; park those on
  // the anchors rather than at the origin, where they would draw a dot nobody
  // asked for in the middle of every figure.
  for (; write < total; write++) {
    const a = at(anchors[write % nAnchor]);
    positions[write * 3] = a.x;
    positions[write * 3 + 1] = a.y;
    positions[write * 3 + 2] = a.z;
    weights[write] = 0;
  }

  const labels = anchors
    .map((a, i) => (a.key ? { key: a.key, index: i } : null))
    .filter((v): v is { key: string; index: number } => !!v);

  return { positions, weights, count: total, aspect: fit.aspect, links: spec.links, labels };
}
