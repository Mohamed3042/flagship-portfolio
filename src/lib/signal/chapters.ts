/**
 * DEEP FIELD — the scroll script.
 *
 * Twelve chapters and the pure evaluator that turns one scroll number into a
 * scene state. Nothing here reads a clock, a random source or a previous frame,
 * so a reverse scroll, an anchor jump and a restored scroll position all land
 * on exactly the frame forward scroll produces.
 *
 * The chapter table is DERIVED from the site's own content: one beat per
 * featured project, in the order the site already features them. Project copy
 * is never repeated here — a chapter names a slug and the render layer reads
 * that project's own entry.
 */
import type {
  ChapterSpec, Layout, MorphWindow, Progress, ReadingStop, SceneState,
} from './types';
import { featured } from '../../data/featured';
import type { Localized } from '../../data/projects';

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
 * Round 1 ran twelve beats over sixteen viewport heights, which is 1.3 screens
 * a chapter: enough to show a formation, not enough to WATCH one arrive. The
 * director asked for an assembly that reads as motion on a real wheel — eight
 * per cent of the page scroll, which at Round 1's length was 1,152 px at
 * 1440x900. Twelve chapters cannot each own 13% of one page, so the DISTANCE is
 * what is honoured and the runway grew to carry it: every chapter now spends
 * about 1,160 px assembling, 420 holding and 710 releasing. The exact numbers
 * are measured in the round's report, not asserted here.
 */
export const SEGMENT_VH: Record<Layout, number> = { landscape: 32, portrait: 34 };

/** Scene units the eye travels down the tunnel across the whole segment. */
export const DOLLY_TOTAL = 300;

/**
 * The default four-point window, in local progress. In and out are long, and
 * the hold in the middle is where the chapter is read.
 */
const MORPH: MorphWindow = { in0: 0.03, in1: 0.52, out0: 0.7, out1: 1 };

/* ---------------------------------------------------------------- the script */

const HERO_TO = 0.07;
const WORLDS_TO = 0.745;
const FILM_TO = 0.83;
const PUBLIC_TO = 0.915;

/** A reading stop stated as a fraction of the chapter it belongs to. */
const stop = (from: Progress, to: Progress, a: number, b: number): ReadingStop =>
  ({ from: from + (to - from) * a, to: from + (to - from) * b });

function worldChapters(): ChapterSpec[] {
  const span = (WORLDS_TO - HERO_TO) / featured.length;
  return featured.map((entry, i) => {
    const from = HERO_TO + span * i;
    const to = from + span;
    return {
      id: `world-${entry.slug}`,
      from,
      to,
      // Every world has a figure drawn for it, from what the project is. The
      // figure key IS the project slug, so the two can never drift apart.
      target: { kind: 'drawn' as const, figure: entry.slug },
      morph: MORPH,
      // One figure has a second pose and opens into it while it is read.
      folds: entry.slug === 'medmac-box-studio',
      project: entry.slug,
      reading: stop(from, to, 0.54, 0.7),
      act: 'worlds' as const,
      side: i % 2 === 0 ? ('start' as const) : ('end' as const),
    };
  });
}

export const CHAPTERS: ChapterSpec[] = [
  {
    id: 'hero',
    from: 0,
    to: HERO_TO,
    // The name is already assembled when the page opens: the visitor arrives at
    // the held pose, and scrolling is what releases it back into the field.
    target: { kind: 'text', from: 'name' },
    morph: { in0: -0.02, in1: 0, out0: 0.44, out1: 0.81 },
    reading: stop(0, HERO_TO, 0, 0.4),
    act: 'hero',
    side: 'centre',
  },
  ...worldChapters(),
  {
    id: 'film',
    from: WORLDS_TO,
    to: FILM_TO,
    // No figure: the stars part and hand the middle of the frame to the reel.
    target: null,
    effect: { kind: 'part', window: { in0: 0.04, in1: 0.53, out0: 0.7, out1: 1 } },
    reading: stop(WORLDS_TO, FILM_TO, 0.54, 0.7),
    act: 'film',
    side: 'start',
  },
  {
    id: 'public',
    from: FILM_TO,
    to: PUBLIC_TO,
    target: { kind: 'drawn', figure: 'public' },
    morph: MORPH,
    reading: stop(FILM_TO, PUBLIC_TO, 0.54, 0.7),
    act: 'public',
    side: 'end',
  },
  {
    id: 'contact',
    from: PUBLIC_TO,
    to: 1,
    target: { kind: 'drawn', figure: 'contact' },
    morph: MORPH,
    effect: { kind: 'breath', window: MORPH },
    reading: stop(PUBLIC_TO, 1, 0.54, 0.7),
    act: 'contact',
    side: 'centre',
  },
];

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
 * It runs across the HOLD, not the assembly: the box arrives closed, and it is
 * the reading that opens it into the dieline.
 */
export function foldAt(chapter: ChapterSpec, local: number): number {
  if (!chapter.folds || !chapter.morph) return 0;
  return smoothstep(ramp(local, chapter.morph.in1 + 0.02, chapter.morph.out0));
}

/**
 * Copy strength over a chapter. It arrives as the figure lands and leaves
 * before the next chapter's arrives, so two chapters' words are never on
 * screen together.
 */
function narrationAt(local: number): number {
  return smoothstep(ramp(local, 0.3, 0.48)) * (1 - smoothstep(ramp(local, 0.78, 0.92)));
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
    part: chapter.effect?.kind === 'part' ? effect : 0,
    breath: chapter.effect?.kind === 'breath' ? effect : 0,
    dolly: p * DOLLY_TOTAL,
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
 * data: a kicker per act, the one line of story, and the contact line. Every
 * project fact — title, tag, blurb, repository — is read from that project's
 * own entry by the render layer, so the two can never drift.
 */
export interface ChapterCopy { kicker: Localized; title?: Localized; line?: Localized }

export const COPY: Record<string, ChapterCopy> = {
  hero: {
    kicker: { en: 'Deep field', ar: 'الحقل العميق' },
    // The one line of story. It appears exactly once on the page.
    line: {
      en: 'Point at the dark long enough and it fills with worlds.',
      ar: 'صوّب نحو العتمة وقتًا كافيًا، فتمتلئ بالعوالم.',
    },
  },
  film: {
    kicker: { en: 'The films', ar: 'الأفلام' },
    title: { en: 'Earlier work, on film.', ar: 'أعمال سابقة، على فيلم.' },
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
      ar: 'متاح لوظائف هندسة الأتمتة والأدوات الداخلية في الكويت ودول الخليج وعن بُعد.',
    },
  },
};

/** The act each chapter belongs to, for the page's own section rhythm. */
export const ACTS = ['hero', 'worlds', 'film', 'public', 'contact'] as const;
