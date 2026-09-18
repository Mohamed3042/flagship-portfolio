/**
 * "From Signal to Systems" — shared contract for the scroll-controlled landing scene.
 *
 * Everything the cinematic segment draws is a pure function of one number: the
 * segment progress `u` in [0,1]. Nothing in this module may depend on having
 * played earlier frames, so reverse scroll, restored scroll, deep links and
 * Home/End all evaluate to exactly the same state as forward scroll.
 */

/** Progress through the cinematic segment, 0 at the horizon, 1 at the archive handoff. */
export type Progress = number;

/** Composition variant. Portrait is its own camera and typography, not a crop. */
export type Layout = 'landscape' | 'portrait';

/**
 * Rendering budget tier. Lower tiers keep the same story and the same major
 * illusions — they never substitute a static phone hero.
 */
export type Tier = 'desktop' | 'phone' | 'light';

export interface TierBudget {
  /** Points in the morphing cloud that carries the story. */
  morph: number;
  /** Distant stars that establish scale. */
  stars: number;
  /** Foreground depth-cue sprites. */
  foreground: number;
  /** Upper bound on renderer.setPixelRatio. */
  pixelRatio: number;
}

export const TIERS: Record<Tier, TierBudget> = {
  desktop: { morph: 32000, stars: 2200, foreground: 40, pixelRatio: 1.5 },
  phone: { morph: 12000, stars: 900, foreground: 20, pixelRatio: 1.25 },
  light: { morph: 6000, stars: 420, foreground: 0, pixelRatio: 1 },
};

/* ------------------------------------------------------------------ shapes */

/**
 * A particle target set. Point identity is the array index and is stable across
 * every shape, so a morph is an index-wise interpolation and never a re-pairing
 * or a reseed.
 */
export interface ShapeTarget {
  /** length === count * 3, XYZ triples in scene units. */
  positions: Float32Array;
  /**
   * Per-point weight in [0,1] used for brightness and size. Anchor points that
   * establish the silhouette early carry the higher values.
   */
  weights: Float32Array;
  /** length === count * 3. Per-point mid-flight displacement, vanishes at both ends. */
  flow: Float32Array;
}

/**
 * The cloud is scale, not subject. Since Round 06 the objects the story is
 * about are surfaces — a lit mass, metal fragments, paperboard, a room — and the
 * points only ever describe where a surface is about to be, or dust around it.
 */
export type ShapeId =
  | 'aperture' // a sparkle along the horizon's rim and dust for scale
  | 'emblem' // dust around the fragment ring, anamorphic like the ring itself
  | 'structure' // the controlled workflow lattice
  | 'carton' // the closed cake carton
  | 'constellation'; // project nodes, laid out to match the archive grid

/** Builds one target set for `count` points. Must be deterministic for a given count. */
export type ShapeBuilder = (count: number, ctx: ShapeContext) => ShapeTarget;

export interface ShapeContext {
  /** Deterministic PRNG in [0,1). Seeded per shape, never Math.random. */
  random: () => number;
  /** Aspect used by anamorphic sampling (scene width / height at the alignment camera). */
  aspect: number;
  /** Number of selectable project nodes the constellation must produce. */
  nodeCount: number;
}

/* ------------------------------------------------------------------ camera */

export interface CameraPose {
  position: [number, number, number];
  look: [number, number, number];
  /** Vertical field of view, degrees. */
  fov: number;
}

/**
 * A camera path evaluated by arc length, so control-point spacing never
 * produces an unauthored speed spike. Roll stays at zero.
 */
export interface CameraPath {
  /** Evaluate the pose at local progress [0,1] along this path. */
  at(t: number): CameraPose;
  /** The t at which each authored pose is reached, in order. */
  anchors: number[];
}

/* ---------------------------------------------------------------- chapters */

/**
 * How honest a chapter's dominant visual is. This drives the on-screen label,
 * so it is content, not decoration.
 */
export type EvidenceKind =
  | 'screenshot' // an approved, privacy-reviewed product capture
  | 'illustration' // authored geometry that explains an idea, proves nothing
  | 'synthetic' // an authored replay over synthetic data
  | 'media' // authorized media from an existing World
  | 'none';

export interface ReadingStop {
  /** Sub-interval of the chapter where the camera rests and text is legible. */
  from: Progress;
  to: Progress;
}

export interface ChapterSpec {
  id: string;
  /** Interval of overall segment progress this chapter owns. */
  from: Progress;
  to: Progress;
  /** Particle target this chapter morphs the cloud into, by the end of its interval. */
  shape: ShapeId;
  /** Which artifact stage is active, if any. */
  artifact: ArtifactId | null;
  /**
   * Local progress the camera holds its first keyframe for while the scene
   * finishes forming. A chapter whose figure only reads from one exact pose has
   * to complete the formation BEFORE the camera leaves that pose; without a hold
   * the form is still in flight when the move that reveals it has already started.
   * 0 (the default) is the plain behaviour: morph and move share the interval.
   */
  hold?: Progress;
  /**
   * Re-times the camera's travel along its path. Arc-length evaluation makes
   * every unit of path take the same scroll, which is right for a move and wrong
   * for a moment: a macro approach needs to decelerate into its subject, creep,
   * and then leave. This is that curve, monotone over [0,1], and it replaces the
   * default ease so no two easings stack.
   */
  pace?: (travel: number, anchors: number[]) => number;
  /**
   * How much page composition the camera takes at a given local progress, 0..1.
   * The authored pose frames the subject centred; the page wants it beside the
   * copy. Defaults to always framed. An authored move that must land exactly —
   * a fly-through, a macro, a crossing — declares 0 there, and both sides of a
   * chapter boundary must agree at the instant they meet.
   */
  frame?: (local: number) => number;
  /**
   * Opacity of the point cloud over the chapter, 0..1. The cloud describes where
   * a surface is about to be; once the surface is there it has nothing to say.
   * Declared per chapter so a boundary never pops.
   */
  cloud?: (local: number) => number;
  /** Slug into the existing project data. Never duplicate project copy here. */
  project?: string;
  /** What the chapter's PLATE is — the HTML image the 3D surface hands off to. */
  evidence: EvidenceKind;
  /**
   * What the chapter's own 3D artifact is, when that is a different thing from
   * its plate. A carton built out of geometry beside a real screenshot is two
   * claims, not one, and "Actual product screenshot" is false about the carton.
   */
  sceneEvidence?: EvidenceKind;
  /**
   * Where the camera rests and the copy is legible.
   *
   * A chapter may rest more than once. An object has to be recognised before its
   * evidence arrives, and those are two different things to look at: one stop for
   * the object alone, a later one for the readable proof beside it. The camera's
   * travel is measured to the FIRST stop; what moves between stops is the scene.
   */
  reading: ReadingStop | ReadingStop[] | null;
  /**
   * Local interval over which the narration gives the stage to the artifact, and
   * after which it comes back. Outside it the copy is at full strength. It never
   * goes away — at any reading stop it is held at a readable floor.
   */
  recede?: [Progress, Progress];
  camera: Record<Layout, CameraPose[]>;
}

/**
 * Since Round 06 one artifact carries the middle of the film: the fragments,
 * the workflow, the carton and the World are one scene graph that keeps
 * becoming the next thing, so no chapter boundary can cut between them.
 */
export type ArtifactId = 'object' | 'arrival';

/* ------------------------------------------------------------------- stage */

/** What a stage is told about the film beyond its own local progress. */
export interface StageContext {
  /** Segment progress, 0..1. */
  u: Progress;
  /** The active chapter's id. */
  chapter: string;
  layout: Layout;
}

/** A Three.js artifact stage. `update` is a pure function of (local, ctx). */
export interface ArtifactStage {
  /** The scene graph node. Added and removed by the orchestrator. */
  object: import('three').Object3D;
  /**
   * @param local progress within the active chapter, 0..1
   * @param time  seconds of *unpaused* motion, for ambient life only. The scene
   *              must be fully readable when this stops advancing.
   * @param ctx   which chapter is active, and the global progress
   */
  update(local: number, time: number, ctx: StageContext): void;
  /** Screen-space rectangle of the surface that hands off to an HTML image, if any. */
  handoff?: () => HandoffRect | null;
  /**
   * Chapters, besides the one that names this artifact, during which it stays
   * drawn and updated: a thing that is about to become the subject is already
   * on screen, and a thing that has stopped being the subject leaves gradually.
   */
  linger?: string[];
  /**
   * How much of the World's own warm light has reached the shell, 0..1. The
   * orchestrator dims the shared cool rim light against it, so the warmth is
   * environmental rather than painted on one object.
   */
  warmth?: () => number;
  /**
   * How much paperboard is the subject right now, 0..1. The shared cool key
   * steps back against it so the board's own warm key is what shapes it.
   */
  paper?: () => number;
  dispose(): void;
}

/**
 * Where the 3D representation of a product screen currently projects to, in CSS
 * pixels relative to the canvas. The HTML image is aligned to this before the
 * representation switches, so the handoff does not jump or double-render.
 */
export interface HandoffRect {
  x: number;
  y: number;
  width: number;
  height: number;
  /** 0 while the 3D surface owns the pixels, 1 once the HTML image does. */
  blend: number;
  /**
   * How much the camera should already be fitted to this surface, 0..1. It
   * reaches 1 before the crossfade starts, so the two representations share one
   * projection for the whole of it.
   */
  fit: number;
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
  /** Morph interpolant between the previous chapter's shape and this one's. */
  morph: number;
  from: ShapeId;
  to: ShapeId;
  camera: CameraPose;
  /**
   * How much of the page composition to apply to `camera`, 0..1.
   *
   * The authored pose frames the subject centred; the page wants it beside the
   * copy. That re-framing is a camera move, and it is wrong in two places: at a
   * pose whose figure is only correct from one exact eye position, and across a
   * chapter boundary where the two sides would disagree. So it is a value, not a
   * constant — 0 hands the renderer the authored pose untouched.
   */
  frame: number;
  /**
   * How much stage the narration takes, 0..1. It drops while a transformation
   * is the argument and returns for every reading stop, so the copy recedes
   * rather than disappearing: at 0 it is still present, still legible, and no
   * longer the largest thing on screen.
   */
  narration: number;
  /** Point-cloud opacity for this frame, 0..1. */
  cloud: number;
  /** True while the camera rests for a reading stop. */
  resting: boolean;
  /** The composition in force: everything restored at a reading stop, the essentials elsewhere. */
  mode: Mode;
}
