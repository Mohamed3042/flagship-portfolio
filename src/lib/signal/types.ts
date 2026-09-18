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

/**
 * Counts are higher than Round 1's because the geometry changed: a star now has
 * a FIXED position in the world (that is what makes it stream past the eye), so
 * a shell's box has to cover the frustum at its far plane and roughly three
 * quarters of each shell sits outside the view at any moment. `stars` is the
 * allocation; `__deepField.state().visible` reports how many are actually on
 * screen, and that is the number the look depends on.
 */
export const TIERS: Record<Tier, TierBudget> = {
  desktop: { stars: 168000, morph: 6000, hero: 12, pixelRatio: 1.5 },
  phone: { stars: 58000, morph: 5000, hero: 8, pixelRatio: 1.5 },
  light: { stars: 22000, morph: 3600, hero: 5, pixelRatio: 1 },
};

/** Lower bound the adaptive governor may reduce a tier's star count to. */
export const STAR_FLOOR: Record<Tier, number> = { desktop: 56000, phone: 24000, light: 12000 };

/* --------------------------------------------------------------- the field */

/**
 * The tunnel the field lives in, in scene units.
 *
 * Round 1 put a star's home at (unit x, unit y, depth) and scaled x/y BY that
 * depth, so every star rode a fixed ray through the eye. That is an elegant
 * wrap and it is also why the field read flat: a point whose x/y scale with its
 * own depth does not move on screen at all as the eye advances. It grew and
 * brightened in place, and a thousand of those is a texture, not a flight.
 *
 * Now a star's world position is FIXED: (x, y) are metres, decided once. Its
 * depth wraps, and the screen position is x/depth — so a near star sweeps
 * outward and accelerates as it passes, a far star barely moves, and the
 * parallax is the real thing rather than an impression of it.
 */
export const TUNNEL = {
  /** Nearest a star may come to the eye before it wraps. */
  near: 1.6,
  /**
   * Half-width of a shell's box, as a fraction of that shell's own depth. It
   * has to EXCEED the frustum where the stars are still visible, or the box's
   * own corner becomes a rectangle in the sky: the widest frustum this page
   * uses is 0.646 per unit of depth (landscape, 44°, 16:10) and the tallest is
   * 0.601 (portrait, 62°), and the far fade has taken everything out by 0.86 of
   * the depth, so 0.75 × 0.70 clears both with room for the parallax rotation.
   */
  spreadX: 0.75,
  spreadY: 0.7,
  /** The deepest shell. Sets the camera's far plane and the bounding sphere. */
  far: 190,
};

/**
 * The three populations. They are one point cloud, one material and one draw:
 * the class only decides which shell a star lives in and how big and bright it
 * is. Sizes are CSS pixels at pixel ratio 1.
 *
 * Shell depth and class are deliberately tied. Each shell is a SCALED COPY of
 * the others — box half-width and wrap period scale together — so all three
 * have identical screen statistics and none of them shows an edge, while the
 * shallow shell sweeps past the eye many times faster than the deep one. That
 * is the depth hierarchy and the motion hierarchy in one decision.
 */
export type StarClass = 'dust' | 'mid' | 'bright';

export interface ShellSpec {
  /** Share of the population. */
  share: number;
  /** Depth of this shell's wrap period, scene units. */
  depth: number;
  /** Point size in CSS px: [at the far end, at the near end]. */
  size: [number, number];
  /** Alpha: [at the far end, at the near end]. */
  alpha: [number, number];
  /** How much halo the sprite carries around its core. */
  halo: number;
}

export const SHELLS: Record<StarClass, ShellSpec> = {
  dust: { share: 0.7, depth: 190, size: [0.9, 1.4], alpha: [0.25, 0.55], halo: 0.1 },
  mid: { share: 0.25, depth: 76, size: [1.5, 2.5], alpha: [0.42, 0.78], halo: 0.34 },
  bright: { share: 0.05, depth: 25, size: [3.0, 5.0], alpha: [0.62, 0.95], halo: 1.0 },
};

export const CLASS_ORDER: StarClass[] = ['dust', 'mid', 'bright'];

/**
 * The band — the milky way of this page — and the voids around it.
 *
 * It is defined in DIRECTION space (a star's world x,y divided by nothing: the
 * pair that decides the ray it sits on), and a slab through the origin in that
 * space projects to the same stripe on screen at every depth. So the band holds
 * still across the whole flight while the clumps inside it stream past.
 */
export const BAND = {
  /** Tilt of the band, degrees, measured in direction space. */
  tilt: 27,
  /** Half-width of the band's Gaussian, in direction units. */
  width: 0.24,
  /** Density in a void as a share of the band's crest. */
  floor: 0.08,
  /** Scale of the clumping noise along the band. */
  grain: 1.9,
  /** Scale of the clumping noise along the depth axis, per scene unit. */
  grainZ: 0.02,
};

/* -------------------------------------------------------- constellations */

/**
 * A figure, in NORMALIZED units: height 1, width `aspect`, z in [-0.5, 0.5].
 * `weights` carries the per-point role — 0 is a star seated along a stroke, and
 * the higher values are the anchors at the vertices, which come with a halo and
 * (at the top of the range) a diffraction spike.
 */
export interface Figure {
  /** length === count * 3. */
  positions: Float32Array;
  /** length === count. 0 for stroke stars, up to 1 for the brightest anchor. */
  weights: Float32Array;
  count: number;
  aspect: number;
  /** Hairline segments, as pairs of indices into `positions`. */
  links: [number, number][];
  /** Anchors that carry an HTML label, as { key, index }. */
  labels?: { key: string; index: number }[];
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

/**
 * How a chapter's constellation is sourced.
 *
 * Round 1 sampled a project's key image. That is retired: a screenshot is a
 * page of type and panels, and its luminance — or its edges — is a smeared
 * rectangle nobody can read as anything. Every world now gets a figure DRAWN
 * for it, from what the project actually is.
 */
export type TargetSource =
  /** Real page copy, rendered to an offscreen canvas and sampled by glyph fill. */
  | { kind: 'text'; from: 'name' }
  /** A hand-authored figure from `figures.ts`, named by its key. */
  | { kind: 'drawn'; figure: string };

/** A field-wide move a chapter can ask for, on top of (or instead of) a figure. */
export type EffectKind =
  /** The stars part radially from the centre, clearing a plane. */
  | 'part'
  /** The field draws slightly inward, so one star can own the frame. */
  | 'breath';

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
  /** A field-wide move, on the same four-point window. */
  effect?: { kind: EffectKind; window: MorphWindow };
  /** True when this figure has a second pose it opens into while it is read. */
  folds?: boolean;
  /** Slug into the existing project data. Never duplicate project copy here. */
  project?: string;
  /** Where the camera rests and the copy is legible, in OVERALL progress. */
  reading: ReadingStop | null;
  /** Grouping for the page's own section rhythm. */
  act: 'hero' | 'worlds' | 'film' | 'public' | 'contact';
  /**
   * Which side the copy takes on a wide screen; the figure takes the other.
   * `centre` is for the two beats where the figure is BEHIND the words — the
   * name at the top of the page and the one star at the end of it.
   */
  side: 'start' | 'end' | 'centre';
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
  /** How far a folding figure has opened into its second pose, 0..1. */
  fold: number;
  /** The radial parting, 0..1. */
  part: number;
  /** The inward breath, 0..1. */
  breath: number;
  /** Distance the eye has travelled down the tunnel at this progress, scene units. */
  dolly: number;
  /** Copy opacity driver, 0..1. Text enters by opacity plus a small rise. */
  narration: number;
  /** True while the camera rests for a reading stop. */
  resting: boolean;
  /** The composition in force. */
  mode: Mode;
}
