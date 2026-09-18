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
import type { ChapterSpec, Layout, MorphWindow, Progress, ReadingStop, SceneState } from './types';
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
 * Scroll runway, in viewport heights. Twelve beats at a little over one
 * viewport each: long enough that no beat is a flick, short enough that the
 * archive is reachable.
 */
export const SEGMENT_VH: Record<Layout, number> = { landscape: 16, portrait: 18 };

/** Scene units the eye travels down the tunnel across the whole segment. */
export const DOLLY_TOTAL = 150;

/** The default assembly window, in local progress. */
const MORPH: MorphWindow = { in0: 0.06, in1: 0.42, out0: 0.76, out1: 0.97 };

/* ---------------------------------------------------------------- the script */

const HERO_TO = 0.095;
const WORLDS_TO = 0.615;
const FILM_TO = 0.745;
const PUBLIC_TO = 0.875;

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
      // The figure is the project's own key image, luminance-sampled. Round 1
      // ships the first one; the rest are Round 2 and carry the field only.
      target: i === 0 ? { kind: 'image' as const, src: entry.shots[0].src } : null,
      morph: i === 0 ? MORPH : undefined,
      project: entry.slug,
      reading: stop(from, to, 0.42, 0.74),
      act: 'worlds' as const,
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
    morph: { in0: -0.02, in1: 0, out0: 0.42, out1: 0.93 },
    reading: stop(0, HERO_TO, 0, 0.38),
    act: 'hero',
  },
  ...worldChapters(),
  {
    id: 'film',
    from: WORLDS_TO,
    to: FILM_TO,
    target: null,
    reading: stop(WORLDS_TO, FILM_TO, 0.28, 0.78),
    act: 'film',
  },
  {
    id: 'public',
    from: FILM_TO,
    to: PUBLIC_TO,
    target: null,
    reading: stop(FILM_TO, PUBLIC_TO, 0.3, 0.78),
    act: 'public',
  },
  {
    id: 'contact',
    from: PUBLIC_TO,
    to: 1,
    target: null,
    reading: stop(PUBLIC_TO, 1, 0.26, 0.8),
    act: 'contact',
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
 * How far the stars have left the field for this chapter's figure.
 * Out of the field on an ease-out-quart, held, then released on an ease-in, so
 * both ends of the move have zero velocity and no boundary reads as a cut.
 */
export function morphAt(chapter: ChapterSpec, local: number): number {
  const w = chapter.morph;
  if (!chapter.target || !w) return 0;
  if (local < w.out0) return easeOutQuart(ramp(local, w.in0, w.in1));
  return 1 - easeInQuad(ramp(local, w.out0, w.out1));
}

/**
 * Copy strength over a chapter. It arrives after the figure has started to
 * form and leaves before the next chapter's arrives, so two chapters' words are
 * never on screen together.
 */
function narrationAt(local: number): number {
  return smoothstep(ramp(local, 0.08, 0.26)) * (1 - smoothstep(ramp(local, 0.84, 0.97)));
}

/** The complete scene state at one progress value. Pure. */
export function evaluate(u: Progress, _layout: Layout): SceneState {
  const p = at01(u);
  const chapter = chapterAt(p);
  const span = chapter.to - chapter.from;
  const local = span > 0 ? clamp01((p - chapter.from) / span) : 0;
  const reading = chapter.reading;
  const resting = !!reading && p >= reading.from && p <= reading.to;
  return {
    u: p,
    chapter,
    local,
    morph: morphAt(chapter, local),
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
