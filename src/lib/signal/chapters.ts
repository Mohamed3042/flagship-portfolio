/**
 * "From Signal to Systems" — the timeline.
 *
 * Six chapters and the pure evaluator that turns one scroll number into a scene
 * state. Nothing here reads a clock, a random source or a previous frame, so a
 * reverse scroll, an anchor jump and a restored scroll position all land on
 * exactly the same frame as forward scroll.
 *
 * Since Round 06 the object determines how the film unfolds: the rim of the
 * opening mass fractures into fragments, the fragments are the aperture the
 * camera flies through, the aperture's metal becomes the workflow's structure,
 * one rail of that structure is a paper fold when looked at closely, the fold is
 * a carton, and the carton's front opening is the threshold into the Cake
 * Studio world. Every one of those is one scene graph (the `object` artifact),
 * so no chapter boundary can cut between them.
 *
 * Scene scale: roughly 12 units wide and 7 tall around the origin, camera on +Z
 * looking toward -Z. Project copy is never repeated here — a chapter names a
 * slug and the render layer reads that project's own entry.
 */
import type { CameraPath, CameraPose, ChapterSpec, Layout, Progress, ReadingStop, SceneState, ShapeId } from './types';
import { buildPath } from './camera';
import { ALIGNMENT_CAMERA, CARTON } from './shapes';
import type { Localized } from '../../data/projects';

/* -------------------------------------------------------------------- maths */

const clamp01 = (v: number) => (v > 1 ? 1 : v > 0 ? v : 0); // NaN falls through to 0
const at01 = (u: Progress) => (Number.isFinite(u) ? clamp01(u) : 0);
const smoothstep = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
/** Eased sub-interval. */
const ease = (v: number, a: number, b: number) => smoothstep((v - a) / (b - a));

/**
 * The cloud is at rest for the last third of every chapter's moving part: the
 * morph finishes before the camera does, and long before any reading stop opens.
 */
const MORPH_LEAD = .62;

/* ------------------------------------------------------------------- camera */

const pose = (position: [number, number, number], look: [number, number, number], fov: number): CameraPose => ({ position, look, fov });
/** A pose stated as an offset from another, used where the exact base is owned elsewhere. */
const from = (base: CameraPose, d: [number, number, number], look: [number, number, number], dfov = 0): CameraPose =>
  ({ position: [base.position[0] + d[0], base.position[1] + d[1], base.position[2] + d[2]], look, fov: base.fov + dfov });
const last = (path: CameraPose[]) => path[path.length - 1];

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
 * artifact's edges inside the frame.
 *
 * Every chapter starts on the pose the previous chapter ended on, so no boundary
 * is a cut. The horizon lands on ALIGNMENT_CAMERA and the fragments ring is
 * sampled along its viewing rays, so the ring reads as one flat figure from that
 * pose and from no other; the camera holds it until the ring has formed, then
 * goes through.
 */
const ALIGN = ALIGNMENT_CAMERA;

const horizonLandscape: CameraPose[] = [
  from(ALIGN, [-.9, -1.6, 6.2], [0, -.8, 0], 5),
  from(ALIGN, [-.4, -.7, 2.6], [0, -.25, 0], 2),
  ALIGN,
];
const horizonPortrait: CameraPose[] = [
  from(ALIGN, [-.25, -1.9, 5.4], [0, -.6, 0], 13),
  from(ALIGN, [-.1, -.8, 2.3], [0, -.1, 0], 7),
  ALIGN,
];

/** Through the ring: the near fragments pass within a third of a unit of the eye. */
const forgeLandscape: CameraPose[] = [
  ALIGN,
  pose([0, .02, 6.6], [0, .06, -.6], 42),
  pose([.15, .1, 4.6], [.3, .25, -1.6], 44),
];
const forgePortrait: CameraPose[] = [
  ALIGN,
  pose([0, .02, 6.6], [0, .06, -.6], 52),
  pose([.05, .08, 4.6], [.1, .2, -1.6], 54),
];

const systemLandscape: CameraPose[] = [
  last(forgeLandscape),
  pose([.7, .6, 4.8], [-.1, .15, -.7], 41),
  pose([1.2, .9, 4.8], [-.2, .1, -.6], 40),
];
const systemPortrait: CameraPose[] = [
  last(forgePortrait),
  pose([.25, .9, 5.6], [0, .35, -.7], 54),
  pose([.15, .8, 5.4], [0, .45, -.7], 54),
];

/**
 * Down onto the front rail until it fills the frame, then back out while the
 * carton folds up around it. Keyframe 2 is the macro pose; the pace below creeps
 * through it rather than passing at the path's constant speed.
 */
const matterLandscape: CameraPose[] = [
  last(systemLandscape),
  pose([.8, .25, 2.7], [.3, -.3, 1.3], 36),
  pose([.5, -.18, 1.6], [.32, -.36, 1.3], 30),
  pose([1.3, .05, 2.8], [-.1, -.7, .9], 38),
  pose([2, .35, 3.5], [-.1, -.8, .7], 38),
];
const matterPortrait: CameraPose[] = [
  last(systemPortrait),
  pose([.3, .3, 2.9], [.2, -.3, 1.3], 44),
  pose([.42, -.16, 1.66], [.3, -.36, 1.3], 40),
  pose([.6, .05, 3], [0, -.7, .9], 50),
  pose([.3, .4, 4.2], [0, -.85, .7], 52),
];

/** The box at rest, where the world chapter finds it. */
const REST: [number, number, number] = [
  CARTON.centre[0] + CARTON.rest[0], CARTON.centre[1] + CARTON.rest[1], CARTON.centre[2] + CARTON.rest[2],
];
const DOOR: [number, number, number] = [REST[0], REST[1], REST[2] + CARTON.d / 2];

/**
 * Turn to the box, approach with a bounded lateral swing across the opening's
 * axis — the depth test, authored into the deterministic path rather than
 * handed to a pointer — cross the sill, and rest inside.
 */
const worldLandscape: CameraPose[] = [
  last(matterLandscape),
  pose([DOOR[0] + 3.2, DOOR[1] + .9, DOOR[2] + 3.6], [DOOR[0], DOOR[1] + .04, DOOR[2]], 40),
  pose([DOOR[0] + 1.1, DOOR[1] + .3, DOOR[2] + 2.2], [DOOR[0], DOOR[1], DOOR[2] - .4], 42),
  pose([DOOR[0] - .8, DOOR[1] + .2, DOOR[2] + 1.3], [DOOR[0], DOOR[1], DOOR[2] - 1.3], 44),
  pose([DOOR[0], DOOR[1] + .1, DOOR[2] + .2], [DOOR[0], DOOR[1], DOOR[2] - 2.4], 46),
  pose([DOOR[0], DOOR[1] + .15, DOOR[2] - 3.4], [DOOR[0], DOOR[1] - .06, DOOR[2] - 14], 46),
];
const worldPortrait: CameraPose[] = [
  last(matterPortrait),
  pose([DOOR[0] + 1.8, DOOR[1] + 1.4, DOOR[2] + 4.4], [DOOR[0], DOOR[1] + .1, DOOR[2]], 54),
  pose([DOOR[0] + .7, DOOR[1] + .3, DOOR[2] + 2.3], [DOOR[0], DOOR[1], DOOR[2] - .4], 56),
  pose([DOOR[0] - .6, DOOR[1] + .2, DOOR[2] + 1.4], [DOOR[0], DOOR[1], DOOR[2] - 1.3], 58),
  pose([DOOR[0], DOOR[1] + .1, DOOR[2] + .2], [DOOR[0], DOOR[1], DOOR[2] - 2.4], 60),
  pose([DOOR[0], DOOR[1] + .15, DOOR[2] - 2], [DOOR[0], DOOR[1] - .06, DOOR[2] - 14], 60),
];

const archiveLandscape: CameraPose[] = [
  last(worldLandscape),
  pose([.4, .6, 6.5], [0, .2, -.8], 42),
  pose([0, .35, 6.6], [0, .1, 0], 40),
];
const archivePortrait: CameraPose[] = [
  last(worldPortrait),
  pose([.2, .9, 8.4], [0, .35, -.6], 56),
  pose([0, .55, 9.3], [0, .2, 0], 54),
];

/* ----------------------------------------------------------------- chapters */

/**
 * How quickly the page composition arrives after a held pose, and how quickly it
 * leaves before one. Both sides of every boundary agree on the camera at the
 * instant they meet, or the seam is a cut.
 */
const FRAME_RAMP = .26;

const horizon: ChapterSpec = {
  id: 'horizon',
  from: 0, to: .1,
  shape: 'aperture',
  artifact: null,
  project: 'ask-repos',
  evidence: 'screenshot',
  reading: null,
  frame: (local) => 1 - ease(local, 1 - FRAME_RAMP, 1),
  cloud: () => 1,
  camera: { landscape: horizonLandscape, portrait: horizonPortrait },
};

/**
 * Deliberately non-verbal on the page. The rim fractures, the fragments
 * assemble into the ring while the camera holds the one pose the ring reads
 * flat from, the chapter title takes physical depth inside it, and the camera
 * goes through. The cloud is dust around the ring, thinning as the metal
 * becomes the subject.
 */
const FORGE_HOLD = .34;
const forge: ChapterSpec = {
  id: 'forge',
  from: .1, to: .24,
  shape: 'emblem',
  artifact: 'object',
  hold: FORGE_HOLD,
  evidence: 'illustration',
  recede: [0, 1],
  reading: null,
  frame: () => 0,
  cloud: (local) => 1 - .5 * ease(local, 0, .3) - .3 * ease(local, .6, 1),
  camera: { landscape: forgeLandscape, portrait: forgePortrait },
};

const system: ChapterSpec = {
  id: 'system',
  from: .24, to: .42,
  shape: 'structure',
  artifact: 'object',
  project: 'enterprise-ai-automation-templates',
  evidence: 'screenshot',
  // The lattice and the mechanism are drawn; only the screen is a capture.
  sceneEvidence: 'illustration',
  recede: [0, .5],
  // The first substantial proof stop.
  reading: { from: .35, to: .42 },
  frame: (local) => ease(local, 0, .35),
  cloud: (local) => .22 - .08 * ease(local, .1, .4),
  camera: { landscape: systemLandscape, portrait: systemPortrait },
};

/**
 * The camera's travel to the macro pose and out again, retimed: fast into the
 * approach, decelerating onto the rail, a creep while the material changes
 * under the light, then the pull back that reveals the box. `anchors` are the
 * path's own keyframe parameters, so the creep lands on the authored pose
 * whatever the spline's arc lengths turned out to be.
 */
const macroPace = (travel: number, anchors: number[]): number => {
  const macro = anchors[2] ?? .55;
  const a = macro - .025, b = macro + .015;
  const t = clamp01(travel);
  if (t < .42) return a * (1 - Math.pow(1 - t / .42, 2.4));
  if (t < .58) return a + (b - a) * ((t - .42) / .16);
  return b + (1 - b) * smoothstep((t - .58) / .42);
};

/**
 * Two stops, because there are two things to look at and they must not be the
 * same picture. The first rests on the finished carton with no screenshot on
 * screen at all; the object then leaves the band, and the second rests on the
 * readable capture of the tool that produced it.
 */
const matter: ChapterSpec = {
  id: 'matter',
  from: .42, to: .6,
  shape: 'carton',
  artifact: 'object',
  project: 'medmac-box-studio',
  evidence: 'screenshot',
  // The box is geometry. Only the window beside it is a capture.
  sceneEvidence: 'illustration',
  recede: [0, .55],
  reading: [{ from: .53, to: .545 }, { from: .575, to: .6 }],
  pace: macroPace,
  // The composition lets go as the camera dives, and returns for the stops.
  frame: (local) => (local < .3 ? 1 - ease(local, 0, .12) : ease(local, .5, .6)),
  cloud: (local) => .14 * (1 - ease(local, .02, .24)),
  camera: { landscape: matterLandscape, portrait: matterPortrait },
};

const world: ChapterSpec = {
  id: 'world',
  from: .6, to: .82,
  shape: 'carton',
  artifact: 'object',
  project: 'cake-studio',
  evidence: 'media',
  // The box and the room it opens into are built geometry; the frame on the far wall is the authorized media.
  sceneEvidence: 'illustration',
  // The opening owns the approach and the crossing; the full reading returns
  // for the stop, where the far wall becomes the readable frame.
  recede: [0, .55],
  reading: { from: .77, to: .82 },
  frame: (local) => 1 - ease(local, 0, .12),
  cloud: () => 0,
  camera: { landscape: worldLandscape, portrait: worldPortrait },
};

/**
 * Hands off to the whole collection, so it names no single project. It gets a
 * reading stop of its own: the grid has to be still and complete for a beat
 * before the scene releases.
 */
const archive: ChapterSpec = {
  id: 'archive',
  from: .82, to: 1,
  shape: 'constellation',
  artifact: 'arrival',
  evidence: 'none',
  sceneEvidence: 'screenshot',
  recede: [0, .5],
  reading: { from: .93, to: 1 },
  frame: (local) => ease(local, 0, .3),
  cloud: (local) => .82 * ease(local, .05, .35),
  camera: { landscape: archiveLandscape, portrait: archivePortrait },
};

export const CHAPTERS: ChapterSpec[] = [horizon, forge, system, matter, world, archive];

/**
 * Scroll runway, in viewport heights. A composition budget — the plan proposes
 * eight to ten on desktop and six to eight on phones — not a measured usability
 * result.
 */
export const SEGMENT_VH: Record<Layout, number> = { landscape: 9, portrait: 7 };

export function chapterAt(u: Progress): ChapterSpec {
  const p = at01(u);
  for (const chapter of CHAPTERS) if (p < chapter.to) return chapter;
  return archive;
}

export function evaluate(u: Progress, layout: Layout): SceneState {
  const p = at01(u);
  const chapter = chapterAt(p);
  const span = chapter.to - chapter.from;
  const local = span > 0 ? clamp01((p - chapter.from) / span) : 0;
  const stops = readingStops(chapter);
  const first = stops.length > 0 ? stops[0] : null;
  // Local progress at which the camera's travel is over: the FIRST reading stop,
  // or the end of the chapter when there is none. Later stops rest the same
  // camera while the scene rearranges in front of it.
  const settle = first ? clamp01((first.from - chapter.from) / span) : 1;
  const hold = clamp01(chapter.hold ?? 0);
  // With a hold the morph owns the held interval and the camera owns what is
  // left; without one they share the run up to the settle.
  const formed = hold > 0 ? hold : settle * MORPH_LEAD;
  const travel = hold > 0
    ? (settle > hold ? clamp01((local - hold) / (settle - hold)) : 1)
    : (settle > 0 ? Math.min(local / settle, 1) : 1);
  const previous = CHAPTERS[CHAPTERS.indexOf(chapter) - 1];
  // The opening chapter has nothing to morph from: the horizon must already be
  // formed in the first viewport, because it is what the page opens on.
  const opening: ShapeId = previous ? previous.shape : chapter.shape;
  const path = pathFor(chapter, layout);
  const resting = stops.some((s) => p >= s.from && p <= s.to);
  return {
    u: p,
    chapter,
    local,
    morph: formed > 0 ? smoothstep(clamp01(local / formed)) : 1,
    from: opening,
    to: chapter.shape,
    // Eased in and out of every chapter's own move — or retimed by the chapter's
    // own pace — then held: at travel 1 the camera is on its last keyframe,
    // which is the pose it had when the stop opened.
    camera: path.at(chapter.pace ? chapter.pace(travel, path.anchors) : smoothstep(travel)),
    frame: chapter.frame ? clamp01(chapter.frame(local)) : 1,
    narration: narration(chapter, local, hold),
    cloud: chapter.cloud ? clamp01(chapter.cloud(local)) : 1,
    resting,
    mode: resting ? 'reading' : 'reveal',
  };
}

/** One stop, several stops or none, as a list. */
export function readingStops(chapter: ChapterSpec): ReadingStop[] {
  const reading = chapter.reading;
  if (!reading) return [];
  return Array.isArray(reading) ? reading : [reading];
}

/**
 * The copy recedes exactly where the artifact is the argument — through a held
 * formation and through the move that reveals it — and is at full strength
 * everywhere a visitor is meant to read.
 */
function narration(chapter: ChapterSpec, local: number, hold: number): number {
  const window = chapter.recede ?? (hold > 0 ? ([0, hold] as [Progress, Progress]) : null);
  if (!window) return 1;
  const [from, to] = window;
  const enter = Math.max(1e-4, (to - from) * .42);
  const away = smoothstep(clamp01((local - from) / enter));
  const back = smoothstep(clamp01((local - to) / .12));
  return 1 - away * (1 - back);
}

/* ----------------------------------------------------------------- narration */

/** Narration only. The honesty label belongs to the renderer, which holds the
 *  single EvidenceKind -> label map; duplicating it here would let the two drift. */
export interface ChapterCopy { kicker: Localized; line: Localized }

const narrate = (_chapter: ChapterSpec, kicker: Localized, line: Localized): ChapterCopy => ({ kicker, line });

/** Short by rule: no paragraph should compete with the most complex morph. */
export const COPY: Record<string, ChapterCopy> = {
  horizon: narrate(horizon,
    { en: 'Signal', ar: 'إشارة' },
    { en: 'Everything starts as noise. Attention is the first engineering decision.', ar: 'كل شيء يبدأ ضجيجًا، والانتباه أول قرار هندسي.' }),
  // The one typographic moment of the film: the scene draws this line as metal
  // inside the ring, and the page keeps it as the chapter's own heading.
  forge: narrate(forge,
    { en: 'Structure', ar: 'بنية' },
    { en: 'From signal to systems.', ar: 'من الإشارة إلى الأنظمة.' }),
  system: narrate(system,
    { en: 'Control', ar: 'تحكّم' },
    { en: 'Inside the structure, nothing moves until something approves it.', ar: 'داخل البنية، لا يتحرك شيء قبل أن توافق عليه جهة.' }),
  matter: narrate(matter,
    { en: 'Matter', ar: 'مادة' },
    { en: 'Close enough, the edge is a fold. The design has edges you can hold.', ar: 'عن قرب، الحافة طيّة. صار للتصميم حواف تُمسك باليد.' }),
  world: narrate(world,
    { en: 'World', ar: 'عالم' },
    { en: 'The box opens, and you are standing inside the work.', ar: 'تنفتح العلبة، فإذا بك واقفًا داخل العمل.' }),
  archive: narrate(archive,
    { en: 'Archive', ar: 'أرشيف' },
    { en: 'Every piece settles into its place, and stays open to inspection.', ar: 'يستقر كل جزء في مكانه، ويبقى مفتوحًا للفحص.' }),
};
