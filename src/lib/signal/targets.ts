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
 * Sources are the site's own content: the chapter's real title, rendered by the
 * browser in the page's own font, and the project's real key image. Nothing is
 * invented, and no brand asset is traced.
 */

/** A sampled figure in normalized units: x,y about the origin, z in [-.5,.5]. */
export interface Figure {
  /** length === count * 3. Height is 1; width is `aspect`. */
  positions: Float32Array;
  count: number;
  aspect: number;
}

/** Where a figure sits in front of the eye, in scene units. */
export interface Seat {
  /** Distance in front of the camera. */
  distance: number;
  /** The box the figure is fitted inside, preserving its own aspect. */
  width: number;
  height: number;
  /** World-unit offset of the figure's centre from the view axis. */
  offsetX?: number;
  offsetY?: number;
  /** Half-depth of the z scatter. Keeps the figure a cloud, not a decal. */
  jitter?: number;
}

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
 * Collect the EDGES of an image.
 *
 * Brightness is the wrong signal for a screenshot. A light interface is lit
 * almost everywhere, so a luminance take returns a filled rectangle — which is
 * exactly what the first attempt drew. What makes a screen recognisable is its
 * structure: the type, the rules, the chart lines, the edges of its panels. So
 * the take is a Sobel magnitude, normalised against the image's own strong
 * edges rather than an absolute threshold, which makes it work on a dark UI and
 * a white one without a per-image constant.
 *
 * A small share of interior fill is kept as well, weighted by how far a pixel
 * is from the image's mean, so a solid block still reads as a block.
 */
function edgePixels(data: ImageData, fill: number, seed: number): Lit[] {
  const { width, height, data: px } = data;
  const gray = new Float32Array(width * height);
  let mean = 0;
  for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
    gray[i] = (0.2126 * px[p] + 0.7152 * px[p + 1] + 0.0722 * px[p + 2]) / 255;
    mean += gray[i];
  }
  mean /= gray.length || 1;

  const mag = new Float32Array(width * height);
  const at = (x: number, y: number) => gray[Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))];
  let peak = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gx = (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1))
        - (at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1));
      const gy = (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1))
        - (at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1));
      const m = Math.hypot(gx, gy);
      mag[y * width + x] = m;
      if (m > peak) peak = m;
    }
  }
  if (peak <= 1e-6) return [];
  // Normalise against the 97th percentile, not the maximum: one specular pixel
  // must not decide the exposure of the whole figure.
  const sorted = Float32Array.from(mag).sort();
  const norm = Math.max(sorted[Math.floor(sorted.length * 0.97)], peak * 0.08);

  const random = seeded(seed);
  const out: Lit[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const edge = Math.min(1, mag[i] / norm);
      if (edge > 0.12 && random() < Math.pow(edge, 0.85)) {
        out.push({ x: (x + 0.5) / width, y: (y + 0.5) / height });
        continue;
      }
      // The body of the image, thinly: enough to say there is a surface there.
      if (random() < fill * Math.min(1, Math.abs(gray[i] - mean) * 2.2 + 0.18)) {
        out.push({ x: (x + 0.5) / width, y: (y + 0.5) / height });
      }
    }
  }
  return shuffle(out, random);
}

/**
 * Turn lit pixels into a normalized figure. Points are taken in shuffled order
 * and recycled with sub-pixel jitter when there are fewer lit pixels than
 * stars, so a small figure thickens rather than leaving stars in the field.
 */
function figureFrom(lit: Lit[], count: number, aspect: number, seed: number): Figure | null {
  if (lit.length === 0 || count <= 0) return null;
  const positions = new Float32Array(count * 3);
  const random = seeded(seed ^ 0x51ed);
  const cell = 1 / Math.max(1, Math.sqrt(lit.length / Math.max(aspect, 0.05)));
  for (let i = 0; i < count; i++) {
    const source = lit[i % lit.length];
    const spread = (i >= lit.length ? cell * 0.95 : cell * 0.3);
    positions[i * 3] = (source.x - 0.5) * aspect + (random() - 0.5) * spread;
    positions[i * 3 + 1] = (0.5 - source.y) + (random() - 0.5) * spread;
    positions[i * 3 + 2] = random() - 0.5;
  }
  return { positions, count, aspect };
}

/** Place a normalized figure in front of the eye. Cheap: a resize re-seats it. */
export function seatTarget(figure: Figure, seat: Seat, out?: Float32Array): Float32Array {
  const n = figure.count;
  const dest = out && out.length >= n * 3 ? out : new Float32Array(n * 3);
  // Fit inside the box while keeping the figure's own aspect.
  const scale = Math.min(seat.width / Math.max(figure.aspect, 1e-4), seat.height);
  const dx = seat.offsetX ?? 0;
  const dy = seat.offsetY ?? 0;
  const jitter = (seat.jitter ?? 0.6) * 2;
  for (let i = 0; i < n; i++) {
    dest[i * 3] = dx + figure.positions[i * 3] * scale;
    dest[i * 3 + 1] = dy + figure.positions[i * 3 + 1] * scale;
    dest[i * 3 + 2] = seat.distance + figure.positions[i * 3 + 2] * jitter;
  }
  return dest;
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
 * The chapter's own title, rendered to an offscreen canvas by the browser and
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

/**
 * A project's existing key image, sampled at its edges. What a reader
 * recognises in a screen is its structure, so that is what the stars take: the
 * type, the rules, the chart lines, the panel boundaries, plus a thin sense of
 * the surface they sit on.
 */
export function imageFigure(image: HTMLImageElement, count: number, seed = 0x1ce): Figure | null {
  if (!image.complete || !image.naturalWidth) return null;
  const long = 300;
  const scale = Math.min(1, long / Math.max(image.naturalWidth, image.naturalHeight));
  const made = surface(image.naturalWidth * scale, image.naturalHeight * scale);
  if (!made) return null;
  const { canvas, ctx } = made;
  try {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
  let data: ImageData;
  try {
    data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    // A cross-origin image taints the canvas. Same-origin content only.
    return null;
  }
  const lit = edgePixels(data, 0.05, seed);
  return figureFrom(lit, count, canvas.width / canvas.height, seed);
}

/**
 * Load an image for sampling. A target that silently fails is worse than one
 * that never starts, so a failure resolves to null and the chapter keeps the
 * field instead of assembling nothing.
 */
export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
