/**
 * DEEP FIELD — where a constellation comes from.
 *
 * A target is never drawn. It is a seat list the field's first `count` stars
 * fly to. Every sampler here is deterministic for a given input and count, so
 * the same page always assembles the same figure, and index i always means the
 * same seat.
 *
 * Sampling and placing are separate on purpose. A sampler returns a figure in
 * NORMALIZED units — a unit-height box carrying the figure's own aspect — and
 * `seatTarget` places that figure in front of the eye. A resize then re-places
 * an existing figure with a multiply instead of re-reading a canvas.
 *
 * Two sources, and only two. The page's own name, rendered by the browser in
 * the page's own font and sampled by glyph fill, and the hand-drawn figures in
 * `figures.ts`. Luminance sampling of product screenshots is retired: it
 * returned a smeared rectangle of type, which is what a screenshot is.
 */
import type { Figure, Seat } from './types';

/** Deterministic PRNG, so a target is a pure function of its input. */
function seeded(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A sample taken off a canvas: unit position in [0,1]. */
interface Lit { x: number; y: number }

/** Shuffle in place with a seeded source: deterministic, and it decorrelates a
 *  partial take from the scan order so a short take still reads as the whole
 *  figure instead of filling it row by row. */
function shuffle(list: Lit[], random: () => number) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const t = list[i]; list[i] = list[j]; list[j] = t;
  }
  return list;
}

/** Collect the pixels a glyph fill actually covers. */
function inkPixels(data: ImageData, floor: number, seed: number): Lit[] {
  const { width, height, data: px } = data;
  const out: Lit[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const value = (px[i + 3] / 255) * (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
      if (value >= floor) out.push({ x: (x + 0.5) / width, y: (y + 0.5) / height });
    }
  }
  return shuffle(out, seeded(seed));
}

/**
 * Turn lit pixels into a normalized figure. Points are taken in shuffled order
 * and recycled with sub-pixel jitter when there are fewer lit pixels than
 * stars, so a small figure thickens rather than leaving stars in the field.
 */
function figureFrom(lit: Lit[], count: number, aspect: number, seed: number): Figure | null {
  if (lit.length === 0 || count <= 0) return null;
  const positions = new Float32Array(count * 3);
  const weights = new Float32Array(count);
  const random = seeded(seed ^ 0x51ed);
  const cell = 1 / Math.max(1, Math.sqrt(lit.length / Math.max(aspect, 0.05)));
  for (let i = 0; i < count; i++) {
    const source = lit[i % lit.length];
    const spread = (i >= lit.length ? cell * 0.95 : cell * 0.3);
    positions[i * 3] = (source.x - 0.5) * aspect + (random() - 0.5) * spread;
    positions[i * 3 + 1] = (0.5 - source.y) + (random() - 0.5) * spread;
    positions[i * 3 + 2] = random() - 0.5;
  }
  return { positions, weights, count, aspect, links: [] };
}

/** Place a normalized figure in front of the eye. Cheap: a resize re-seats it.
 *  The destination is a vec4 per star: the seat, and the seat's own weight. */
export function seatTarget(figure: Figure, seat: Seat, out?: Float32Array): Float32Array {
  const n = figure.count;
  const dest = out && out.length >= n * 4 ? out : new Float32Array(n * 4);
  // Fit inside the box while keeping the figure's own aspect.
  const scale = Math.min(seat.width / Math.max(figure.aspect, 1e-4), seat.height);
  const dx = seat.offsetX ?? 0;
  const dy = seat.offsetY ?? 0;
  const jitter = (seat.jitter ?? 0.6) * 2;
  for (let i = 0; i < n; i++) {
    dest[i * 4] = dx + figure.positions[i * 3] * scale;
    dest[i * 4 + 1] = dy + figure.positions[i * 3 + 1] * scale;
    dest[i * 4 + 2] = seat.distance + figure.positions[i * 3 + 2] * jitter;
    dest[i * 4 + 3] = figure.weights[i];
  }
  return dest;
}

/** The world position of one seated point, for hairlines and HTML labels. */
export function seatPoint(figure: Figure, seat: Seat, index: number): [number, number, number] {
  const scale = Math.min(seat.width / Math.max(figure.aspect, 1e-4), seat.height);
  const jitter = (seat.jitter ?? 0.6) * 2;
  return [
    (seat.offsetX ?? 0) + figure.positions[index * 3] * scale,
    (seat.offsetY ?? 0) + figure.positions[index * 3 + 1] * scale,
    seat.distance + figure.positions[index * 3 + 2] * jitter,
  ];
}

/** A canvas sized for sampling. Kept small: this runs once per chapter. */
function surface(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(8, Math.round(width));
  canvas.height = Math.max(8, Math.round(height));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  return ctx ? { canvas, ctx } : null;
}

/**
 * The page's own name, rendered to an offscreen canvas by the browser and
 * sampled by glyph fill. The font comes from the page, so Arabic shapes and
 * joins exactly as it does in the DOM — nothing is re-implemented here.
 */
export function textFigure(text: string, font: string, count: number, rtl: boolean): Figure | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const probe = surface(16, 16);
  if (!probe) return null;
  probe.ctx.font = font;
  const metrics = probe.ctx.measureText(trimmed);
  const inkWidth = Math.max(1, metrics.width);
  const ascent = metrics.actualBoundingBoxAscent || 90;
  const descent = metrics.actualBoundingBoxDescent || 26;
  const inkHeight = Math.max(1, ascent + descent);
  if (inkWidth > 8192 || inkHeight > 2048) return null;

  const pad = 10;
  const made = surface(inkWidth + pad * 2, inkHeight + pad * 2);
  if (!made) return null;
  const { canvas, ctx } = made;
  ctx.font = font;
  ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.textAlign = rtl ? 'right' : 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(trimmed, rtl ? canvas.width - pad : pad, pad + ascent);

  const lit = inkPixels(ctx.getImageData(0, 0, canvas.width, canvas.height), 0.3, 0x7e37);
  return figureFrom(lit, count, canvas.width / canvas.height, 0x7e37);
}
