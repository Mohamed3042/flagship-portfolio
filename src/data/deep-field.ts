/**
 * DEEP FIELD — the content the landing flies through, in the owner's own order.
 *
 * Everything here traces to a file: each world to its own page and key frame,
 * each game to the project notes that record what was built, the voice engine
 * to its version ledger, each tool to the skill file it is defined in. The
 * provenance table lives in the round's report; nothing on this page is
 * invented, and nothing private is named.
 *
 * The systems chapters are NOT here: they read the site's own project data, so
 * a system's title, tag and line can never drift from its archive entry.
 */
import type { Localized } from './projects';

import cakeFrame from '../assets/worlds/cake-studio.avif?url';
import disneyFrame from '../assets/worlds/disney.avif?url';
import stringsFrame from '../assets/worlds/strings.avif?url';
import academyFrame from '../assets/worlds/academy.avif?url';
import spotifyFrame from '../assets/worlds/spotify.avif?url';

/* ------------------------------------------------------------------ worlds */

export interface World {
  /** The page's own file name under the live worlds floor. */
  slug: string;
  /** Where the portal leads. Absolute: the worlds floor is a separate deploy. */
  href: string;
  /** False when the page exists in the repository but is not on the live floor. */
  live: boolean;
  title: Localized;
  line: Localized;
  /** The world's own key frame, already encoded for the portal. */
  frame: string;
  /** Intrinsic ratio of that frame, so the plate never guesses its own shape. */
  aspect: number;
  alt: Localized;
}

const FLOOR = 'https://mohamed3042.github.io/flagship-portfolio/worlds/';

/**
 * The five the owner confirmed, in his order of pride. All five are on the live
 * worlds floor. The Academy was 404 for most of September — the release on the
 * 17th rebuilt the Pages tree from a source that no longer carried it — and was
 * restored this round from the exact bytes it was last live with, so its portal
 * leads to the world again rather than to the floor.
 */
export const worlds: World[] = [
  {
    slug: 'cake-studio',
    href: `${FLOOR}cake-studio.html`,
    live: true,
    title: { en: 'The Cake Is Made Twice', ar: 'تُصنع الكعكة مرتين' },
    line: {
      en: 'Fifty linked shots, 4:10 — a flexible design, a measured approval, a kitchen-ready handoff.',
      ar: 'خمسون لقطةً مترابطة، ٤:١٠ — تصميمٌ مرن، واعتمادٌ مَقيس، وتسليمٌ جاهز للمطبخ.',
    },
    frame: cakeFrame,
    aspect: 1.7778,
    alt: {
      en: 'A carved sugar arch on a dark studio floor, with tiered cakes behind it.',
      ar: 'قوس سكّري منحوت على أرضية استوديو داكنة، وخلفه كعكات متدرّجة.',
    },
  },
  {
    slug: 'disney',
    href: `${FLOOR}disney.html`,
    live: true,
    title: { en: 'The Kingdom of Running Things', ar: 'مملكة الأشياء التي تجري' },
    line: {
      en: 'Twenty scroll-scrubbed shots: a golden book opens, and the code keeps the kingdom running.',
      ar: 'عشرون لقطةً يقودها التمرير: كتابٌ مذهّب يُفتح، ثم تُبقي الشيفرةُ المملكةَ جاريةً.',
    },
    frame: disneyFrame,
    aspect: 2.1769,
    alt: {
      en: 'A cut-paper gate between two lanterns, opening onto a lamplit storybook town.',
      ar: 'بوابة من الورق المقصوص بين فانوسين، تنفتح على مدينةِ حكايةٍ مضاءة بالقناديل.',
    },
  },
  {
    slug: 'strings',
    href: `${FLOOR}strings.html`,
    live: true,
    title: { en: 'Cut the Strings', ar: 'اقطع الخيوط' },
    line: {
      en: 'Forty accepted takes as one uninterrupted reel. Your hand is the only clock.',
      ar: 'أربعون لقطة مقبولة في شريطٍ واحد بلا انقطاع. يدُك هي الساعة الوحيدة.',
    },
    frame: stringsFrame,
    aspect: 1.7648,
    alt: {
      en: 'Scissors cutting the threads above a wooden marionette on a workshop bench.',
      ar: 'مقصٌّ يقطع الخيوط فوق دميةٍ خشبية على منضدة ورشة.',
    },
  },
  {
    slug: 'academy',
    href: `${FLOOR}academy.html`,
    live: true,
    title: { en: 'The Academy of Proven Spells', ar: 'أكاديمية التعاويذ المُثبَتة' },
    line: {
      en: 'Nothing is magic until it survives the proof. Fourteen accepted shots, one scroll.',
      ar: 'لا يصبح شيءٌ سحرًا حتى ينجو من البرهان. أربع عشرة لقطة مقبولة، وتمريرة واحدة.',
    },
    frame: academyFrame,
    aspect: 1.7778,
    alt: {
      en: 'An owl carrying a sealed letter towards a moonlit castle gate.',
      ar: 'بومة تحمل رسالة مختومة نحو بوابة قلعة يضيئها القمر.',
    },
  },
  {
    slug: 'spotify',
    href: `${FLOOR}spotify.html`,
    live: true,
    title: { en: 'The Album', ar: 'الألبوم' },
    line: {
      en: 'Silence acquires a pulse; the pulse becomes a studio; a hand rides the fader to unity.',
      ar: 'الصمتُ يكتسب نبضًا؛ ثم يصير النبضُ استوديو؛ ويدٌ تدفع المستوى الرئيسَ إلى تمامه.',
    },
    frame: spotifyFrame,
    aspect: 2.3881,
    alt: {
      en: 'Records drifting as ringed planets through deep space.',
      ar: 'أسطوانات تسبح ككواكب ذات حلقات في عمق الفضاء.',
    },
  },
];

/* ------------------------------------------------------------------- games */

/**
 * The four games, worded inside the site's own privacy review.
 *
 * Three of them already have an archive entry here, and those entries are where
 * the numbers come from: the portfolio decided long ago that War Strikes is a
 * code-and-docs export rather than a shipped build, that ARTILLERY3D is an
 * architecture study, and that Cocolani 3D is a sanitized one with no
 * repository. This page does not get to be louder than that review, so each
 * line says what was built and how it is checked, and each beat links to the
 * entry a reader can inspect.
 */
export interface Game {
  id: string;
  title: string;
  /** The engine, which is what the kicker carries. */
  engine: string;
  line: Localized;
  /** Slug into the site's own project data, where one exists. */
  slug?: string;
  /** Set only where the repository is public. */
  repo?: string;
}

export const games: Game[] = [
  {
    id: 'war-strikes',
    title: 'WAR STRIKES',
    engine: 'Unreal Engine 5.8',
    slug: 'war-strikes',
    line: {
      en: 'An arena shooter re-implemented as an inspectable module: ability-driven combat, content that lives in data, 184 automation tests.',
      ar: 'لعبةُ إطلاق نار في حَلبة أُعيدت كتابتها كوحدةٍ قابلة للفحص: قتالٌ تقوده القدرات، ومحتوًى يعيش في البيانات، و١٨٤ اختبارًا آليًا.',
    },
  },
  {
    id: 'cocolani-3d',
    title: 'Cocolani 3D',
    engine: 'Godot 4.7',
    slug: 'cocolani-3d',
    line: {
      en: 'A bilingual world rebuilt from a discontinued client, every conclusion labelled verified, inferred or lost, and the packaged build audited.',
      ar: 'عالمٌ ثنائي اللغة أُعيد بناؤه من تطبيقٍ متوقّف، مع وسم كل نتيجة: متحقَّقٌ منها أو مُستنتَجة أو مفقودة، وتدقيقُ النسخة المحزومة.',
    },
  },
  {
    id: 'artillery3d',
    title: 'ARTILLERY3D',
    engine: 'Godot 4.7',
    slug: 'artillery3d',
    line: {
      en: 'Gameplay rules as inspectable data: 503 battle-map records carrying their own source citations, and one authoritative server that owns the match.',
      ar: 'قواعد اللعب كبياناتٍ قابلة للفحص: ٥٠٣ سجلات خرائط معركة تحمل مراجع مصدرها، وخادمٌ مرجعيٌّ واحد يملك المباراة.',
    },
  },
  {
    id: 'polyblast-arena',
    title: 'Polyblast Arena',
    engine: 'Godot 4.7',
    line: {
      en: 'An original arena shooter: a 60 Hz authoritative simulation, bots on the same intent path as the player, four maps, nine weapons.',
      ar: 'لعبةُ إطلاق نار في حَلبة، أصليةٌ بالكامل: محاكاةٌ مرجعية بمعدّل ٦٠ هرتز، وروبوتاتٌ على مسار النوايا نفسه الذي يسلكه اللاعب، وأربع خرائط، وتسعة أسلحة.',
    },
    repo: 'https://github.com/Mohamed3042/polyblast-arena',
  },
];

/* --------------------------------------------------------------- the voice */

export const voice = {
  title: 'MK Voice',
  /** Its own archive entry, so the beat leads somewhere a reader can check. */
  slug: 'mk-voice',
  kicker: { en: 'Voice engine', ar: 'محرّك صوت' } as Localized,
  line: {
    en: 'A local training studio: a version ledger whose numbers never move, four run presets, warm-start fine-tuning, and quality gates measured on held-out audio. Private build. Demo on request.',
    ar: 'استوديو تدريبٍ محلي: سجلّ إصداراتٍ لا تتغيّر أرقامه، وأربعةُ إعدادات تشغيل، وضبطٌ دقيق ببداية دافئة، وبوابات جودةٍ تُقاس على عيّنات صوتٍ محجوزة عن التدريب. نسخة خاصة. عرضٌ عند الطلب.',
  } as Localized,
};

/* --------------------------------------------------------------- the tools */

/**
 * Twelve of the skills in `~/.claude/skills`, named and described from their own
 * frontmatter. The ones about job hunting, personal machines and private client
 * work are left out on purpose. `repo` is set only where the repository is
 * public — none of these are, today, so the labels are chips and not links.
 */
export interface Tool {
  key: string;
  label: string;
  repo?: string;
}

export const tools: Tool[] = [
  { key: 'agent-brain', label: 'agent-brain' },
  { key: 'codebase-orientation', label: 'codebase-orientation' },
  { key: 'root-cause-debugging', label: 'root-cause-debugging' },
  { key: 'edge-case-sweep', label: 'edge-case-sweep' },
  { key: 'surgical-refactoring', label: 'surgical-refactoring' },
  { key: 'security-reflexes', label: 'security-reflexes' },
  { key: 'verify-ui-visually', label: 'verify-ui-visually' },
  { key: 'stop-thrashing', label: 'stop-thrashing' },
  { key: 'leave-no-mess', label: 'leave-no-mess' },
  { key: 'impeccable', label: 'impeccable' },
  { key: 'blender-assembly', label: 'blender-assembly' },
  { key: 'auto-release-manager', label: 'auto-release-manager' },
];

/** The systems the landing keeps: the five the site's own order ranks first. */
export const SYSTEM_COUNT = 5;
