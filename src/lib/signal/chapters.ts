/**
 * "From Signal to Systems" — the timeline.
 *
 * The seven chapters and the pure evaluator that turns one scroll number into a
 * scene state. Nothing here reads a clock, a random source or a previous frame,
 * so a reverse scroll, an anchor jump and a restored scroll position all land on
 * exactly the same frame as forward scroll.
 *
 * Scene scale: roughly 12 units wide and 7 tall around the origin, camera on +Z
 * looking toward -Z. Project copy is never repeated here — a chapter names a
 * slug and the render layer reads that project's own entry.
 */
import type { CameraPath, CameraPose, ChapterSpec, EvidenceKind, Layout, Progress, SceneState, ShapeId } from './types';
import { buildPath } from './camera';
import { ALIGNMENT_CAMERA } from './shapes';
import type { Localized } from '../../data/projects';

/* -------------------------------------------------------------------- maths */

const clamp01 = (v: number) => (v > 1 ? 1 : v > 0 ? v : 0); // NaN falls through to 0
const at01 = (u: Progress) => (Number.isFinite(u) ? clamp01(u) : 0);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
/** Catmull-Rom, one component, so a three-point path has no corner at the middle key. */
const spline = (a: number, b: number, c: number, d: number, t: number) =>
  .5 * ((2 * b) + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - 3 * c + d - a) * t * t * t);

/**
 * The cloud is at rest for the last third of every chapter's moving part: the
 * morph finishes before the camera does, and long before any reading stop opens.
 * Residual motion therefore decays to zero rather than bleeding into the read.
 */
const MORPH_LEAD = .62;

/* ------------------------------------------------------------------- camera */

const pose = (position: [number, number, number], look: [number, number, number], fov: number): CameraPose => ({ position, look, fov });
/** A pose stated as an offset from another, used where the exact base is owned elsewhere. */
const from = (base: CameraPose, d: [number, number, number], look: [number, number, number], dfov = 0): CameraPose =>
  ({ position: [base.position[0] + d[0], base.position[1] + d[1], base.position[2] + d[2]], look, fov: base.fov + dfov });
const last = (path: CameraPose[]) => path[path.length - 1];

const blend = (a: CameraPose, b: CameraPose, t: number): CameraPose => ({
  position: [lerp(a.position[0], b.position[0], t), lerp(a.position[1], b.position[1], t), lerp(a.position[2], b.position[2], t)],
  look: [lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t)],
  fov: lerp(a.fov, b.fov, t),
});

const key = (keys: CameraPose[], t: number): CameraPose => {
  const n = keys.length - 1, x = clamp01(t) * n, i = Math.min(Math.floor(x), n - 1), f = x - i;
  const p0 = keys[Math.max(i - 1, 0)], p1 = keys[i], p2 = keys[i + 1], p3 = keys[Math.min(i + 2, n)];
  return {
    position: [
      spline(p0.position[0], p1.position[0], p2.position[0], p3.position[0], f),
      spline(p0.position[1], p1.position[1], p2.position[1], p3.position[1], f),
      spline(p0.position[2], p1.position[2], p2.position[2], p3.position[2], f),
    ],
    look: [
      spline(p0.look[0], p1.look[0], p2.look[0], p3.look[0], f),
      spline(p0.look[1], p1.look[1], p2.look[1], p3.look[1], f),
      spline(p0.look[2], p1.look[2], p2.look[2], p3.look[2], f),
    ],
    fov: lerp(p1.fov, p2.fov, f),
  };
};

const SAMPLES = 96;

/**
 * Resample the keyframes by arc length, so uneven control-point spacing cannot
 * produce a speed spike nobody authored. All easing is applied to `t` by the
 * caller, where it is visible as a decision.
 */
/** Pure memo. Paths are immutable once built and never depend on when they were built. */
const built = new Map<string, CameraPath>();
function pathFor(chapter: ChapterSpec, layout: Layout): CameraPath {
  const id = `${chapter.id}:${layout}`;
  let path = built.get(id);
  if (!path) { path = buildPath(chapter.camera[layout]); built.set(id, path); }
  return path;
}

/* ------------------------------------------------------------- camera paths */

/**
 * Portrait is a different composition, not a crop: it sits closer to the centred
 * depth axis, opens the field of view, shortens lateral travel and keeps the
 * artifact's edges inside the frame. Landscape carries the lateral move that
 * reveals the anamorphic depth.
 *
 * Every chapter starts on the pose the previous chapter ended on, so no boundary
 * is a cut. The horizon lands on ALIGNMENT_CAMERA and the forge leaves from it:
 * the emblem only reads flat from that exact pose, so it is imported rather than
 * copied, in both layouts, and the illusion cannot drift out of sync.
 */
const ALIGN = ALIGNMENT_CAMERA;

const horizonLandscape: CameraPose[] = [
  from(ALIGN, [-.9, -1.6, 6.2], [0, -.8, 0], 5),
  from(ALIGN, [-.4, -.7, 2.6], [0, -.25, 0], 2),
  ALIGN,
];
const horizonPortrait: CameraPose[] = [
  from(ALIGN, [-.25, -1.9, 5.4], [0, -.6, 0], 13), // the horizon recentred above the artifact
  from(ALIGN, [-.1, -.8, 2.3], [0, -.1, 0], 7),
  ALIGN, // fov included: the alignment is the pose, not an approximation of it
];

const forgeLandscape: CameraPose[] = [
  ALIGN,
  from(ALIGN, [1.7, .2, -.5], [.1, 0, -.6], 1),
  from(ALIGN, [3.6, .5, -1.3], [.3, .05, -1.4], 3),
];
const forgePortrait: CameraPose[] = [
  ALIGN,
  from(ALIGN, [.8, .25, -.3], [.05, .05, -.5], 6),
  from(ALIGN, [1.7, .6, -.9], [.15, .1, -1.2], 10), // half the lateral travel, edges protected
];

const systemLandscape: CameraPose[] = [
  last(forgeLandscape),
  pose([2.2, .9, 7.4], [0, .2, -.6], 38),
  pose([.9, .55, 5.6], [-.2, .15, -.8], 40),
];
const systemPortrait: CameraPose[] = [
  last(forgePortrait),
  pose([.6, 1, 7.8], [0, .3, -.5], 52),
  pose([.15, .75, 6.2], [0, .45, -.7], 54),
];

const matterLandscape: CameraPose[] = [
  last(systemLandscape),
  pose([-1.6, 2.6, 5.4], [-.3, .1, -.4], 38), // down onto the flat layout
  pose([-2.3, 1.9, 4.6], [-.5, 0, -.5], 38), // three-quarter and above: a lid seam has to be visible
];
const matterPortrait: CameraPose[] = [
  last(systemPortrait),
  pose([-.4, 2.6, 6.2], [0, .2, -.4], 52),
  pose([-.8, 1.9, 5.6], [-.2, .2, -.5], 54),
];

const signalLandscape: CameraPose[] = [
  last(matterLandscape),
  pose([-3.4, .5, 5], [-.8, .1, -1.2], 34),
  pose([-4.2, .2, 6.2], [-1, 0, -1.8], 32), // all three depths legible in one frame
];
const signalPortrait: CameraPose[] = [
  last(matterPortrait),
  pose([-1, .6, 6.4], [-.2, .15, -1], 52),
  pose([-1.2, .35, 7.2], [-.25, .1, -1.6], 50),
];

const worldLandscape: CameraPose[] = [
  last(signalLandscape),
  pose([-1.8, .4, 4.2], [-.2, .2, -2], 40),
  pose([-.2, .3, 2.2], [0, .25, -3.2], 46), // resting just inside the aperture
];
const worldPortrait: CameraPose[] = [
  last(signalPortrait),
  pose([-.5, .5, 5.2], [0, .3, -2], 56),
  pose([0, .35, 3.4], [0, .35, -3.4], 60), // further back: the aperture keeps its edges
];

const archiveLandscape: CameraPose[] = [
  last(worldLandscape),
  pose([.4, .6, 6.5], [0, .2, -.8], 42),
  pose([0, .35, 6.6], [0, .1, 0], 40), // the whole grid, square to the archive below
];
const archivePortrait: CameraPose[] = [
  last(worldPortrait),
  pose([.2, .9, 8.4], [0, .35, -.6], 56),
  // Far enough back that the whole collection is inside a 0.46-aspect frame:
  // a grid cropped by the viewport edge has not settled, it has overflowed.
  pose([0, .55, 9.3], [0, .2, 0], 54),
];

/* ----------------------------------------------------------------- chapters */

const horizon: ChapterSpec = {
  id: 'horizon',
  from: 0, to: .1,
  shape: 'aperture',
  artifact: null,
  project: 'ask-repos',
  evidence: 'screenshot',
  reading: null,
  camera: { landscape: horizonLandscape, portrait: horizonPortrait },
};

/**
 * Deliberately non-verbal: no project, and the lateral move is the whole
 * argument. The hold is what makes that argument legible. The emblem is sampled
 * along ALIGNMENT_CAMERA's viewing rays, so it reads flat from that eye position
 * and from no other; the camera therefore stays there until the form has
 * finished arriving, and only then moves. Without the hold the figure is still
 * in flight for the whole first two thirds of the move, and the flat reading —
 * the thing the depth is a surprise against — never happens.
 */
const FORGE_HOLD = .42;
const forge: ChapterSpec = {
  id: 'forge',
  from: .1, to: .22,
  shape: 'emblem',
  artifact: null,
  hold: FORGE_HOLD,
  evidence: 'illustration',
  reading: null,
  camera: { landscape: forgeLandscape, portrait: forgePortrait },
};

const system: ChapterSpec = {
  id: 'system',
  from: .22, to: .4,
  shape: 'structure',
  artifact: 'workflow',
  project: 'enterprise-ai-automation-templates',
  evidence: 'screenshot',
  // The first substantial proof stop, and the longest: half the chapter.
  reading: { from: .31, to: .4 },
  camera: { landscape: systemLandscape, portrait: systemPortrait },
};

const matter: ChapterSpec = {
  id: 'matter',
  from: .4, to: .56,
  shape: 'carton',
  artifact: 'carton',
  project: 'medmac-box-studio',
  evidence: 'screenshot',
  reading: { from: .49, to: .56 },
  camera: { landscape: matterLandscape, portrait: matterPortrait },
};

const signal: ChapterSpec = {
  id: 'signal',
  from: .56, to: .68,
  shape: 'tracks',
  artifact: 'tracks',
  project: 'montage-pro',
  // No approved screenshot exists for this project; the artifact explains the
  // mechanism and says so on screen.
  evidence: 'illustration',
  reading: { from: .625, to: .68 },
  camera: { landscape: signalLandscape, portrait: signalPortrait },
};

const world: ChapterSpec = {
  id: 'world',
  from: .68, to: .82,
  shape: 'portal',
  artifact: 'portal',
  project: 'cake-studio',
  evidence: 'media',
  reading: { from: .755, to: .82 },
  // local 0.536: the crossing is over and the room is settled well before it.
  camera: { landscape: worldLandscape, portrait: worldPortrait },
};

/**
 * Hands off to the whole collection, so it names no single project. It gets a
 * reading stop of its own: the grid has to be still and complete for a beat
 * before the scene releases, or the last thing the visitor sees of the cinema is
 * it still moving while the real project rows are already arriving underneath.
 */
const archive: ChapterSpec = {
  id: 'archive',
  from: .82, to: 1,
  shape: 'constellation',
  artifact: null,
  evidence: 'none',
  reading: { from: .93, to: 1 },
  camera: { landscape: archiveLandscape, portrait: archivePortrait },
};

export const CHAPTERS: ChapterSpec[] = [horizon, forge, system, matter, signal, world, archive];

/**
 * Scroll runway, in viewport heights. A composition budget — the plan proposes
 * eight to ten on desktop and six to eight on phones — not a measured usability
 * result. Retune after real reading tests with the final copy in place.
 */
export const SEGMENT_VH: Record<Layout, number> = { landscape: 9, portrait: 7 };

export function chapterAt(u: Progress): ChapterSpec {
  const p = at01(u);
  for (const chapter of CHAPTERS) if (p < chapter.to) return chapter;
  return archive;
}

/**
 * How quickly the page composition arrives after a held pose, and how quickly it
 * leaves before one. Both sides of the horizon/forge boundary have to agree on
 * the camera at the instant they meet, or the seam is a cut.
 */
const FRAME_RAMP = .26;

export function evaluate(u: Progress, layout: Layout): SceneState {
  const p = at01(u);
  const chapter = chapterAt(p);
  const span = chapter.to - chapter.from;
  const local = span > 0 ? clamp01((p - chapter.from) / span) : 0;
  const stop = chapter.reading;
  // Local progress at which all motion must be over: the reading stop, or the
  // end of the chapter when there is none.
  const settle = stop ? clamp01((stop.from - chapter.from) / span) : 1;
  const hold = clamp01(chapter.hold ?? 0);
  // With a hold the morph owns the held interval and the camera owns what is
  // left; without one they share the run up to the settle, as before.
  const formed = hold > 0 ? hold : settle * MORPH_LEAD;
  const travel = hold > 0
    ? (settle > hold ? clamp01((local - hold) / (settle - hold)) : 1)
    : (settle > 0 ? Math.min(local / settle, 1) : 1);
  const previous = CHAPTERS[CHAPTERS.indexOf(chapter) - 1];
  // The opening chapter has nothing to morph from: the horizon must already be
  // formed in the first viewport, because it is what the page opens on.
  const opening: ShapeId = previous ? previous.shape : chapter.shape;
  return {
    u: p,
    chapter,
    local,
    morph: formed > 0 ? smoothstep(clamp01(local / formed)) : 1,
    from: opening,
    to: chapter.shape,
    // Eased in and out of every chapter's own move, then held: at travel 1 the
    // camera is on its last keyframe, which is the pose it had when the stop
    // opened, and it stays there while the visitor reads.
    camera: pathFor(chapter, layout).at(smoothstep(travel)),
    frame: framing(chapter, local, hold),
    narration: narration(chapter, local, hold),
    resting: stop !== null && p >= stop.from && p <= stop.to,
  };
}

/**
 * The opening is framed around its protected copy and actions; the alignment
 * pose is not framed at all. Between them the framing has to travel, or the two
 * chapters hand over on different cameras and the seam reads as an edit.
 *
 * The horizon lets its framing go as it rises to the alignment pose; the forge
 * holds there and takes the framing back once the lateral move begins.
 */
function framing(chapter: ChapterSpec, local: number, hold: number): number {
  if (chapter.id === 'horizon') return 1 - smoothstep(clamp01((local - (1 - FRAME_RAMP)) / FRAME_RAMP));
  if (hold > 0) return smoothstep(clamp01((local - hold) / FRAME_RAMP));
  return 1;
}

/**
 * The copy recedes exactly where the artifact is the argument — through a held
 * formation and through the move that reveals it — and is at full strength
 * everywhere a visitor is meant to read.
 */
function narration(chapter: ChapterSpec, local: number, hold: number): number {
  if (hold <= 0) return 1;
  const away = smoothstep(clamp01(local / (hold * .55)));
  const back = smoothstep(clamp01((local - .86) / .14));
  return 1 - away * (1 - back);
}

/* ----------------------------------------------------------------- narration */

/** Narration only. The honesty label belongs to the renderer, which holds the
 *  single EvidenceKind -> label map; duplicating it here would let the two drift. */
export interface ChapterCopy { kicker: Localized; line: Localized }

/**
 * The honesty label, derived from the chapter's own evidence kind so the two can
 * never disagree. It is content, not decoration.
 */

const narrate = (chapter: ChapterSpec, kicker: Localized, line: Localized): ChapterCopy => {
  return { kicker, line };
};

/** Short by rule: no paragraph should compete with the most complex morph. */
export const COPY: Record<string, ChapterCopy> = {
  horizon: narrate(horizon,
    { en: 'Signal', ar: 'إشارة' },
    { en: 'Everything starts as noise. Attention is the first engineering decision.', ar: 'كل شيء يبدأ ضجيجًا، والانتباه أول قرار هندسي.' }),
  forge: narrate(forge,
    { en: 'Structure', ar: 'بنية' },
    { en: 'A form that reads flat from one seat, and deep from the next.', ar: 'شكل يبدو مسطحًا من مقعد، وعميقًا من المقعد التالي.' }),
  system: narrate(system,
    { en: 'Control', ar: 'تحكّم' },
    { en: 'Inside the structure, nothing moves until something approves it.', ar: 'داخل البنية، لا يتحرك شيء قبل أن توافق عليه جهة.' }),
  matter: narrate(matter,
    { en: 'Matter', ar: 'مادة' },
    { en: 'The flat layout folds. Now the design has edges you can hold.', ar: 'ينطوي التخطيط المسطح، فتصير للتصميم حواف تُمسك باليد.' }),
  signal: narrate(signal,
    { en: 'Sync', ar: 'تزامن' },
    { en: 'Separate recordings find each other by what they heard.', ar: 'تسجيلات منفصلة يجد بعضها بعضًا بما سمعته.' }),
  world: narrate(world,
    { en: 'World', ar: 'عالم' },
    { en: 'A window widens until you are standing inside the work.', ar: 'تتسع النافذة حتى تصير واقفًا داخل العمل.' }),
  archive: narrate(archive,
    { en: 'Archive', ar: 'أرشيف' },
    { en: 'Every piece settles into its place, and stays open to inspection.', ar: 'يستقر كل جزء في مكانه، ويبقى مفتوحًا للفحص.' }),
};
