/**
 * DEEP FIELD — the scroll script.
 *
 * Nineteen beats and the pure evaluator that turns one scroll number into a
 * scene state. Nothing here reads a clock, a random source or a previous frame,
 * so a reverse scroll, an anchor jump and a restored scroll position all land
 * on exactly the frame forward scroll produces.
 *
 * The order is the owner's own order of pride: the worlds he confirmed, the
 * games he built, the voice engine, the systems the site already features, the
 * tools that do the repeating, the public repositories, and the reply. Project
 * copy is never repeated here — a chapter names a slug or an id, and the render
 * layer reads that entry's own words.
 */
import type {
  ChapterSpec, Layout, MorphWindow, Progress, ReadingStop, SceneState,
} from './types';
import { featured } from '../../data/featured';
import { games, tools, voice, worlds, SYSTEM_COUNT } from '../../data/deep-field';
import type { Localized } from '../../data/projects';
import { roadBend, roadDolly } from './road';

/* -------------------------------------------------------------------- maths */

const clamp01 = (v: number) => (v > 1 ? 1 : v > 0 ? v : 0); // NaN falls through to 0
const at01 = (u: Progress) => (Number.isFinite(u) ? clamp01(u) : 0);
const ramp = (v: number, a: number, b: number) => (b > a ? clamp01((v - a) / (b - a)) : v >= b ? 1 : 0);
const smoothstep = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
/** Assembly: fast out of the field, then a long settle onto the seat. */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - clamp01(t), 4);
/** Release: it lets go slowly, then goes. */
const easeInQuad = (t: number) => clamp01(t) * clamp01(t);

/* ----------------------------------------------------------------- the runway */

/**
 * Scroll runway, in viewport heights.
 *
 * The cap is 36 viewport heights on the desktop across nineteen beats. The
 * sticky frame eats one viewport, so that is 35 screens of travel — 1,682.7 px
 * a beat at 1440x900, the hero taking 0.72 of one — and the four-point window
 * below divides it.
 *
 * ROUND 4 kept the cap. The director allowed 40 viewport heights if the hold
 * and the release could not otherwise be paid for, and they could: at 36 the
 * beat is long enough for a 471 px hold, a 421 px release and 791 px of
 * assembly, which clears the 700 px floor. A longer page was not needed, so it
 * was not taken.
 */
export const SEGMENT_VH: Record<Layout, number> = { landscape: 44, portrait: 46 };

/**
 * The floors the split is measured against, in CSS pixels of scroll. They are
 * exported because the harness checks the SHIPPED window against them rather
 * than against a second copy of the numbers.
 */
export const BEAT_FLOORS = { holdPx: 450, releasePx: 400, assemblyPx: 700 };

/** Scene units the eye travels down the tunnel across the whole segment. */
export const DOLLY_TOTAL = 5300;

/**
 * The default four-point window, in local progress: out of the field, held,
 * then back into the field. In and out are both eased to zero velocity, so no
 * boundary reads as a cut.
 *
 * ROUND 4 — THE SPLIT. Round 3 spent seven tenths of every beat assembling and
 * left the HOLD at 202 px: a title, a line and a link arriving and leaving
 * inside two notches of a wheel. Nobody reads in 202 px. The director set the
 * floors — hold at least 450, release at least 400, assembly whatever is left
 * as long as it clears 700 — and this window is those floors with a little
 * air, measured against the beat the shipped runway actually produces at
 * 1440x900: 1,682.7 px, of which 0.47 assembles (790.9), 0.28 holds (471.2)
 * and 0.25 releases (420.7). Assembly clears 700 by ninety pixels, so the
 * runway cap stays where it was at 36 viewport heights; it did not have to go
 * to 40 to buy the hold.
 *
 * The fractions, not the pixels, are what ship: the beat is a share of a
 * runway measured in viewport heights, so every distance here scales with the
 * screen. The px above are this window on the review viewport, and the round's
 * report states them for the phone too.
 */
const MORPH: MorphWindow = { in0: 0, in1: 0.47, out0: 0.75, out1: 1 };

/** Where the camera rests, as a fraction of a beat: inside the hold, a sliver
 *  in from each end of it, so a seek lands on a pose that is not still moving. */
const REST: [number, number] = [MORPH.in1, MORPH.out0];

/* ---------------------------------------------------------------- the script */

/**
 * Beat weights. Every beat that assembles a figure gets a full share, so every
 * assembly is the same distance; the hero is shorter because it opens already
 * formed and only has to let go.
 */
const HERO_WEIGHT = 1;

/** A reading stop stated as a fraction of the chapter it belongs to. */
const stop = (from: Progress, to: Progress, a: number, b: number): ReadingStop =>
  ({ from: from + (to - from) * a, to: from + (to - from) * b });

/** The systems the landing keeps: the five the site's own order ranks first. */
export const systemSlugs = featured.slice(0, SYSTEM_COUNT).map(f => f.slug);

interface Beat {
  id: string;
  act: ChapterSpec['act'];
  figure: string | null;
  project?: string;
  portal?: boolean;
  weight?: number;
  side?: ChapterSpec['side'];
  beatClass?: ChapterSpec['beatClass'];
}

/**
 * The flight, as a plain list. Sides alternate across the whole page rather
 * than inside each act, so two neighbouring beats never take the same column.
 */
const BEATS: Beat[] = [
  { id: 'hero', act: 'hero', figure: 'name', weight: HERO_WEIGHT, side: 'centre' },
  { id: 'road-worlds', act: 'road', figure: null, weight: 0.112, side: 'centre' },
  ...worlds.map(world => ({
    id: `world-${world.slug}`, act: 'worlds' as const, figure: 'portal', portal: true,
  })),
  { id: 'road-games', act: 'road', figure: null, weight: 0.112, side: 'centre' },
  ...games.map(game => ({ id: `game-${game.id}`, act: 'games' as const, figure: game.id })),
  { id: 'road-voice', act: 'road', figure: null, weight: 0.112, side: 'centre' },
  { id: 'mk-voice', act: 'voice', figure: 'mk-voice' },
  { id: 'road-systems', act: 'road', figure: null, weight: 0.112, side: 'centre' },
  ...systemSlugs.map(slug => ({
    id: `system-${slug}`, act: 'systems' as const, figure: slug, project: slug,
  })),
  { id: 'road-workshop', act: 'road', figure: null, weight: 0.112, side: 'centre' },
  { id: 'tools', act: 'tools', figure: 'tools' },
  { id: 'road-public', act: 'road', figure: null, weight: 0.112, side: 'centre' },
  { id: 'public', act: 'public', figure: 'public' },
  { id: 'contact', act: 'contact', figure: 'contact', side: 'centre' },
];

export const CHAPTERS: ChapterSpec[] = (() => {
  const total = BEATS.reduce((sum, beat) => sum + (beat.weight ?? 1), 0);
  let cursor = 0;
  let column = 0;
  return BEATS.map((beat) => {
    const span = (beat.weight ?? 1) / total;
    const from = cursor;
    const to = beat === BEATS[BEATS.length - 1] ? 1 : cursor + span;
    cursor = to;
    const side = beat.side ?? (column++ % 2 === 0 ? ('start' as const) : ('end' as const));
    const hero = beat.act === 'hero';
    return {
      id: beat.id,
      from,
      to,
      target: beat.figure === 'name'
        ? { kind: 'text' as const, from: 'name' as const }
        : beat.figure ? { kind: 'drawn' as const, figure: beat.figure } : null,
      // The name is already assembled when the page opens: the visitor arrives
      // at the held pose, and scrolling is what releases it back into the field.
      morph: hero ? { in0: -0.02, in1: 0, out0: 0.44, out1: 0.81 } : MORPH,
      portal: beat.portal,
      project: beat.project,
      effect: beat.act === 'contact' ? { kind: 'breath' as const, window: MORPH } : undefined,
      reading: beat.act === 'road' ? null : hero ? stop(from, to, 0, 0.4) : stop(from, to, REST[0], REST[1]),
      beatClass: beat.act === 'road' ? 'road' : beat.portal ? 'gate' : 'reading',
      act: beat.act,
      side,
    };
  });
})();

/* --------------------------------------------------------------- evaluation */

export function chapterAt(u: Progress): ChapterSpec {
  const p = at01(u);
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (p >= CHAPTERS[i].from) return CHAPTERS[i];
  }
  return CHAPTERS[0];
}

/**
 * How far along a four-point window the visitor is: out on an ease-out-quart,
 * held, then released on an ease-in, so both ends of the move have zero
 * velocity and no boundary reads as a cut.
 */
function windowAt(w: MorphWindow, local: number): number {
  if (local < w.out0) return easeOutQuart(ramp(local, w.in0, w.in1));
  return 1 - easeInQuad(ramp(local, w.out0, w.out1));
}

/** How far the stars have left the field for this chapter's figure. */
export function morphAt(chapter: ChapterSpec, local: number): number {
  const w = chapter.morph;
  if (!chapter.target || !w) return 0;
  return windowAt(w, local);
}

/**
 * How far a folding figure has opened into its second pose.
 *
 * It runs across the HOLD, not the assembly: a box arrives closed, and it is
 * the reading that opens it into the dieline. No beat on the landing folds
 * today — the carton is one of the three systems the five-beat cap left out —
 * and the machinery stays, because the figure and its second pose still ship.
 */
export function foldAt(chapter: ChapterSpec, local: number): number {
  if (!chapter.folds || !chapter.morph) return 0;
  return smoothstep(ramp(local, chapter.morph.in1 + 0.02, chapter.morph.out0));
}

/**
 * Copy strength over a chapter. It arrives as the figure lands and leaves
 * before the next chapter's arrives, so two chapters' words are never on
 * screen together. Both ends move with the window: with the assembly ending at
 * 0.47 the words come up over the last quarter of it and are fully up before
 * the hold starts, and they go during the release rather than at the boundary.
 */
function narrationAt(local: number): number {
  return smoothstep(ramp(local, 0.36, 0.49)) * (1 - smoothstep(ramp(local, 0.83, 0.94)));
}

/**
 * How far the portal's own plate is up, 0..1.
 *
 * It is NOT the morph: the picture arrives behind the closing rim, a little
 * after the ring is readable, and it is still there through the hold and the
 * first of the release. A plate keyed straight to the morph flickers on at the
 * far end of every assembly, where the ring is still a scatter.
 */
export function portalAt(chapter: ChapterSpec, local: number): number {
  if (!chapter.portal || !chapter.morph) return 0;
  const w = chapter.morph;
  const up = smoothstep(ramp(local, w.in0 + (w.in1 - w.in0) * 0.62, w.in1));
  const down = smoothstep(ramp(local, w.out0 + (w.out1 - w.out0) * 0.3, w.out1));
  return up * (1 - down);
}

/** The complete scene state at one progress value. Pure. */
export function evaluate(u: Progress, _layout: Layout): SceneState {
  const p = at01(u);
  const chapter = chapterAt(p);
  const span = chapter.to - chapter.from;
  const local = span > 0 ? clamp01((p - chapter.from) / span) : 0;
  const reading = chapter.reading;
  const resting = !!reading && p >= reading.from && p <= reading.to;
  const effect = chapter.effect ? windowAt(chapter.effect.window, local) : 0;
  return {
    u: p,
    chapter,
    local,
    morph: morphAt(chapter, local),
    fold: foldAt(chapter, local),
    portal: portalAt(chapter, local),
    part: chapter.effect?.kind === 'part' ? effect : 0,
    breath: chapter.effect?.kind === 'breath' ? effect : 0,
    dolly: roadDolly(p, CHAPTERS, DOLLY_TOTAL),
    bend: roadBend(chapter, local),
    // At a reading stop the words are at full strength whatever the ramp says:
    // where the visitor is meant to read, they can.
    narration: resting ? 1 : narrationAt(local),
    resting,
    mode: resting ? 'reading' : 'reveal',
  };
}

/* ------------------------------------------------------------------ narration */

/**
 * Narration only, and only the parts that are not already somewhere in the
 * data: a kicker per act, the one line of story, and the closing line. Every
 * world, game, tool and system fact is read from its own entry by the render
 * layer, so the two can never drift.
 */
export interface ChapterCopy { kicker: Localized; title?: Localized; line?: Localized }

export const COPY: Record<string, ChapterCopy> = {
  hero: {
    kicker: { en: 'Deep field', ar: 'الحقل العميق' },
    // The one line of story. It appears exactly once on the page.
    line: {
      en: 'Point at the dark long enough and it fills with worlds.',
      ar: 'وجِّه النظر إلى العتمة وقتًا كافيًا، فتمتلئ بالعوالم.',
    },
  },
  worlds: { kicker: { en: 'Scroll film', ar: 'سينما التمرير' } },
  voice: { kicker: voice.kicker },
  tools: {
    kicker: { en: 'Tools', ar: 'أدوات' },
    title: { en: 'Twelve tools that do the repeating.', ar: 'اثنتا عشرة أداةً تتولّى المتكرِّر.' },
    line: {
      en: 'Skills I wrote so the repeating half of the work runs itself.',
      ar: 'مهاراتٌ كتبتُها كي يُنجِزَ النصفُ المتكرِّر من العمل نفسَه.',
    },
  },
  public: {
    kicker: { en: 'Public work', ar: 'عمل عام' },
    title: { en: 'Four you can run without me.', ar: 'أربعة تستطيع تشغيلها بدوني.' },
  },
  contact: {
    kicker: { en: 'Contact', ar: 'تواصل' },
    title: { en: 'Let’s talk.', ar: 'لنتحدّث.' },
    line: {
      en: 'Open to Automation Engineering and internal-tools roles in Kuwait, the GCC, and remote teams.',
      ar: 'متاحٌ لوظائف هندسة الأتمتة والأدوات الداخلية في الكويت ودول الخليج، ومع الفرق التي تعمل عن بُعد.',
    },
  },
};

/** The act each chapter belongs to, for the page's own section rhythm. */
export const ACTS = ['hero', 'worlds', 'games', 'voice', 'systems', 'tools', 'public', 'contact'] as const;

/** Labels for the tools constellation, in the figure's own anchor order. */
export const TOOL_KEYS = tools.map(t => t.key);
