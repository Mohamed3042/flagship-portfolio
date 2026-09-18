/**
 * DEEP FIELD — shared contract for the scroll-controlled cosmos.
 *
 * Point at the dark long enough and it fills with worlds.
 *
 * Everything the stage draws is a pure function of one number: the segment
 * progress `u` in [0,1] (plus a clock that only drives twinkle and drift).
 * Nothing here may depend on having played earlier frames, so reverse scroll,
 * a restored scroll position, a deep link and Home/End all evaluate to exactly
 * the state forward scroll produces.
 */

/** Progress through the cinematic segment, 0 at the hero, 1 at the archive handoff. */
export type Progress = number;

/** Composition variant. Portrait is its own camera and typography, not a crop. */
export type Layout = 'landscape' | 'portrait';

/**
 * Rendering budget tier. Lower tiers keep the same story and the same
 * illusions — the phone gets the real show, never a static poster.
 */
export type Tier = 'desktop' | 'phone' | 'light';

export interface TierBudget {
  /** Stars in the field. The field IS the cloud: there is no second population. */
  stars: number;
  /** How many of them can be recruited into a constellation. */
  morph: number;
  /** Stars carrying a four-point diffraction sprite. */
  hero: number;
  /** Upper bound on renderer.setPixelRatio. */
  pixelRatio: number;
}

export const TIERS: Record<Tier, TierBudget> = {
  desktop: { stars: 80000, morph: 20000, hero: 12, pixelRatio: 1.5 },
  phone: { stars: 25000, morph: 12000, hero: 8, pixelRatio: 1.5 },
  light: { stars: 9000, morph: 6000, hero: 5, pixelRatio: 1 },
};

/** Lower bound the adaptive governor may reduce a tier's star count to. */
export const STAR_FLOOR: Record<Tier, number> = { desktop: 26000, phone: 11000, light: 5000 };

/* --------------------------------------------------------------- the field */

/**
 * The tunnel the field lives in, in scene units. A star's home is
 * (unit x, unit y, depth) and its world position is derived in the shader:
 * depth wraps, and x/y scale with depth, so every star travels along a ray
 * through the eye. That is exactly the parallax a straight dolly produces, and
 * it makes the field endless without a single stateful wrap.
 */
export const TUNNEL = {
  /** Depth of one wrap period. A star leaving the near plane re-enters here. */
  depth: 190,
  /** Nearest a star may come to the eye before it wraps. */
  near: 1.6,
  /**
   * Half-width of the field at one unit of depth. It has to EXCEED the frustum
   * at every depth or the field's own boundary becomes a visible disc: the
   * widest frustum this page uses is landscape at 44 degrees, half-width
   * 0.404 * 1.78 = 0.72 per unit of depth, so 0.82 clears it with margin for
   * the parallax rotation.
   */
  spread: 0.82,
};

/* -------------------------------------------------------- constellations */

/**
 * A constellation target set, in CAMERA-RELATIVE units: x right, y up,
 * z metres IN FRONT of the eye. Camera-relative is what keeps the figure framed
 * while the dolly is still running underneath it.
 *
 * Point identity is the array index and never changes: star i always plays
 * role i, in every constellation, for the life of the page.
 */
export interface ConstellationTarget {
  /** length === count * 3. */
  positions: Float32Array;
  /** How many of the morph budget this target actually uses. */
  count: number;
  /** Optional per-point brightness in [0,1]; anchors carry the higher values. */
  weights?: Float32Array;
}

/**
 * How a chapter's constellation is sourced. Content is ground truth, always:
 * a `text` source names a string the PAGE supplies (the localized name or the
 * chapter's own title), never a string invented here, and an `image` source
 * names one of the site's existing key images.
 */
export type TargetSource =
  /** Real page copy, rendered to an offscreen canvas and sampled by glyph fill. */
  | { kind: 'text'; from: 'name' }
  /** An existing key image, luminance-sampled to a point set with tiny z jitter. */
  | { kind: 'image'; src: string };

/* ---------------------------------------------------------------- chapters */

export interface ReadingStop {
  /** Sub-interval of OVERALL progress where the camera rests and text is legible. */
  from: Progress;
  to: Progress;
}

/**
 * The four points of a morph, as local progress inside the chapter: the stars
 * leave the field at `in0`, are fully formed at `in1`, hold until `out0`, and
 * are back in the field at `out1`. Every one of them is a scrub position, not
 * an event: the visitor can sit anywhere on this curve, forwards or backwards.
 */
export interface MorphWindow {
  in0: Progress;
  in1: Progress;
  out0: Progress;
  out1: Progress;
}

export interface ChapterSpec {
  id: string;
  /** Interval of overall segment progress this chapter owns. */
  from: Progress;
  to: Progress;
  /** What the stars assemble into here, or null for field only. */
  target: TargetSource | null;
  /** When they assemble, in local progress. Required when `target` is set. */
  morph?: MorphWindow;
  /** Slug into the existing project data. Never duplicate project copy here. */
  project?: string;
  /** Where the camera rests and the copy is legible, in OVERALL progress. */
  reading: ReadingStop | null;
  /** Grouping for the page's own section rhythm. */
  act: 'hero' | 'worlds' | 'film' | 'public' | 'contact';
}

/* ------------------------------------------------------------------- state */

/** Which composition the page is in. Reveal and reading are different compositions, not one dimmed. */
export type Mode = 'reveal' | 'reading';

/** The complete evaluated scene state for one progress value. */
export interface SceneState {
  u: Progress;
  chapter: ChapterSpec;
  /** Progress within the active chapter, 0..1. */
  local: number;
  /** How far the stars have left the field for this chapter's figure, 0..1. */
  morph: number;
  /** Distance the eye has travelled down the tunnel at this progress, scene units. */
  dolly: number;
  /** Copy opacity driver, 0..1. Text enters by opacity plus a small rise. */
  narration: number;
  /** True while the camera rests for a reading stop. */
  resting: boolean;
  /** The composition in force. */
  mode: Mode;
}
