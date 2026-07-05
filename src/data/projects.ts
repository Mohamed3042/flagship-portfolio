/**
 * The eight project stories — index metadata.
 *
 * Order here drives: the homepage projects grid, the prev/next pager on each
 * story page, and the static routes generated under /[lang]/work/[slug].
 *
 * `accent` sets the page-level palette (body[data-accent] in the flagship CSS).
 * `cardA` / `cardB` are the two mesh-gradient stops used on the homepage card.
 * Every stat string is verbatim from the vetted flagship copy (see profile.ts).
 */

// 9-domain colour system (Claude Design parallax package). One accent per story.
export type Accent =
  | 'blue' // Paid Social
  | 'red' // Audience Growth
  | 'green' // Marketing Ops / CRM
  | 'violet' // Brand & Content
  | 'teal' // Software
  | 'yellow' // Automation
  | 'indigo' // Web · Live
  | 'orange' // AI Operating Model
  | 'resume' // Career OS — this site
  | 'rose' // B2B Sales Kit
  | 'mint'; // AI Procurement

export interface ProjectMeta {
  slug: string;
  /** filename in /public/films */
  film: string;
  accent: Accent;
  cardA: string;
  cardB: string;
  tag: { en: string; ar: string };
  title: { en: string; ar: string };
  blurb: { en: string; ar: string };
  /** the bold figure on the card */
  stat: { en: string; ar: string };
  /** the muted qualifier after the figure */
  statNote: { en: string; ar: string };
}

export const projects: ProjectMeta[] = [
  {
    slug: 'meta-ads',
    film: 'meta-ads.html',
    accent: 'blue',
    cardA: '#2997ff',
    cardB: '#5ac8fa',
    tag: { en: 'Paid Social', ar: 'الإعلانات المدفوعة' },
    title: { en: 'Meta ads that pay', ar: 'إعلانات ميتا التي تُثمر' },
    blurb: {
      en: 'WhatsApp leads engineered down to under a dollar each.',
      ar: 'عملاء محتملون عبر واتساب بأقل من دولارٍ للواحد.',
    },
    stat: { en: '$0.84', ar: '٠٫٨٤$' },
    statNote: { en: '/ lead · 206 leads · 2026 pilot', ar: '/ للعميل · ٢٠٦ عملاء · تجربة ٢٠٢٦' },
  },
  {
    slug: 'al-maali',
    film: 'al-maali.html',
    accent: 'red',
    cardA: '#ff375f',
    cardB: '#ff7eb6',
    tag: { en: 'Audience Growth', ar: 'نموّ الجمهور' },
    title: { en: '0 → 1M+ followers', ar: 'من الصفر إلى مليون+' },
    blurb: {
      en: 'A satellite channel grown to a million and beyond.',
      ar: 'قناة فضائية نمت إلى مليونٍ وأكثر.',
    },
    stat: { en: '1M+', ar: 'مليون+' },
    statNote: { en: '· Facebook 9.2K → 1M · 2021–2025', ar: '· فيسبوك ٩٫٢ألف ← مليون · ٢٠٢١–٢٠٢٥' },
  },
  {
    slug: 'crm',
    film: 'crm.html',
    accent: 'green',
    cardA: '#0bb1c4',
    cardB: '#64d2ff',
    tag: { en: 'Marketing Ops', ar: 'عمليات التسويق' },
    title: { en: 'A CRM, built from scratch', ar: 'نظام عملاء بُني من الصفر' },
    blurb: {
      en: 'Ads-to-leads, tracked in 12 bilingual tabs.',
      ar: 'من الإعلان إلى العميل، في ١٢ جدولًا ثنائي اللغة.',
    },
    stat: { en: '12 tabs', ar: '١٢ جدولًا' },
    statNote: { en: '· 45 active leads · 22 offers', ar: '· ٤٥ عميلًا نشطًا · ٢٢ عرضًا' },
  },
  {
    slug: 'brand-system',
    film: 'brand-system.html',
    accent: 'violet',
    cardA: '#ff7a00',
    cardB: '#ffd60a',
    tag: { en: 'Brand & Content', ar: 'الهوية والمحتوى' },
    title: { en: 'A whole content engine', ar: 'محرّك محتوى متكامل' },
    blurb: {
      en: 'Brand system, catalogs, and a library of video.',
      ar: 'نظام هوية، وكتالوجات، ومكتبة فيديو.',
    },
    stat: { en: '~254 files', ar: '~٢٥٤ ملفًا' },
    statNote: { en: '· ~144 videos · bilingual', ar: '· ~١٤٤ فيديو · ثنائي اللغة' },
  },
  {
    slug: 'sheep-app',
    film: 'sheep.html',
    accent: 'teal',
    cardA: '#1ea64a',
    cardB: '#9bf0b4',
    tag: { en: 'Software', ar: 'برمجيات' },
    title: { en: 'A desktop app that ships', ar: 'تطبيق سطح مكتب جاهز' },
    blurb: {
      en: 'Offline, bilingual, tested, and CI-built for Windows + macOS.',
      ar: 'يعمل دون إنترنت، ثنائي اللغة، مُختبَر، ومبني آليًا لويندوز وماك.',
    },
    stat: { en: '59/59 tests', ar: '٥٩/٥٩ اختبارًا' },
    statNote: { en: '· Python · SQLite · CI', ar: '· بايثون · SQLite · CI' },
  },
  {
    slug: 'hr-system',
    film: 'hr-system.html',
    accent: 'yellow',
    cardA: '#7b2fff',
    cardB: '#d18cff',
    tag: { en: 'Automation', ar: 'الأتمتة' },
    title: { en: 'Hiring on autopilot', ar: 'توظيفٌ يعمل تلقائيًا' },
    blurb: {
      en: 'Résumés from three channels, deduped and scored daily.',
      ar: 'سِيَر من ثلاث قنوات، تُنقّى وتُقيَّم يوميًا.',
    },
    stat: { en: '142 → 100', ar: '١٤٢ ← ١٠٠' },
    statNote: { en: '· 7 scripts · 3 scheduled jobs', ar: '· ٧ سكربتات · ٣ مهام مجدولة' },
  },
  {
    slug: 'medmac-website',
    film: 'medmac-website.html',
    accent: 'indigo',
    cardA: '#2997ff',
    cardB: '#a259ff',
    tag: { en: 'Web · Live', ar: 'ويب · مباشر' },
    title: { en: 'A production website, live', ar: 'موقع إنتاجي، مباشر الآن' },
    blurb: {
      en: 'Bilingual, fast, and deployed on Vercel.',
      ar: 'ثنائي اللغة، سريع، ومنشور على Vercel.',
    },
    stat: { en: '96–100', ar: '٩٦–١٠٠' },
    statNote: { en: '· Lighthouse · Astro · live URL', ar: '· Lighthouse · Astro · رابط مباشر' },
  },
  {
    slug: 'ai-workflow',
    film: 'ai-workflow.html',
    accent: 'orange',
    cardA: '#a259ff',
    cardB: '#ff5e8a',
    tag: { en: 'AI Operating Model', ar: 'نموذج تشغيل بالذكاء الاصطناعي' },
    title: { en: 'One person, three AI tools', ar: 'شخصٌ واحد، وثلاث أدوات ذكاء' },
    blurb: {
      en: 'A workflow that ships sites and recovered lost tenders.',
      ar: 'منظومة تُطلق المواقع وأنقذت مناقصاتٍ ضائعة.',
    },
    stat: { en: '23 tenders', ar: '٢٣ مناقصة' },
    statNote: { en: '· 4 live deals recovered', ar: '· ٤ صفقات مُستردّة' },
  },
  {
    slug: 'my-resume',
    film: 'my-resume.html', // Career OS film (Claude Design pack #2)
    accent: 'resume',
    cardA: '#2997ff',
    cardB: '#bf5af2',
    tag: { en: 'Career OS', ar: 'نظام المسيرة' },
    title: { en: 'Built in the open', ar: 'بُني على المكشوف' },
    blurb: {
      en: 'The AI operating model behind this very site — one person, three tools.',
      ar: 'نموذج التشغيل بالذكاء الاصطناعي خلف هذا الموقع — شخصٌ واحد وثلاث أدوات.',
    },
    stat: { en: '3 · 1 · 1', ar: '٣ · ١ · ١' },
    statNote: { en: 'tools · workflow · person', ar: 'أدوات · سير عمل · شخص' },
  },
  {
    slug: 'brand-ecosystem',
    film: 'brand-ecosystem-film.html',
    accent: 'rose',
    cardA: '#ff375f',
    cardB: '#ff7eb6',
    tag: { en: 'B2B Sales Kit', ar: 'عُدّة مبيعات B2B' },
    title: { en: 'A sales kit, in one session', ar: 'عُدّة مبيعات في جلسةٍ واحدة' },
    blurb: {
      en: 'Medmac’s bilingual B2B kit — 22 division profiles from one template.',
      ar: 'عُدّة Medmac ثنائية اللغة — ٢٢ ملف قسمٍ من قالبٍ واحد.',
    },
    stat: { en: '60', ar: '٦٠' },
    statNote: { en: 'printable PDFs from one session', ar: 'ملف PDF قابل للطباعة من جلسةٍ واحدة' },
  },
  {
    slug: 'procurement-automated',
    film: 'procurement-automated-film.html',
    accent: 'mint',
    cardA: '#00c7be',
    cardB: '#6ef0e4',
    tag: { en: 'AI Procurement', ar: 'مشتريات بالذكاء الاصطناعي' },
    title: { en: 'Buying, AI-directed', ar: 'شراءٌ بتوجيه الذكاء الاصطناعي' },
    blurb: {
      en: 'One instruction → verified listings, a fair-value benchmark, a decision brief.',
      ar: 'تعليمةٌ واحدة ← عروضٌ موثّقة، ومعيار سعرٍ عادل، وموجز قرار.',
    },
    stat: { en: '~6%', ar: '~٦٪' },
    statNote: { en: 'below market on the recommended unit', ar: 'دون سعر السوق للجهاز المُوصى به' },
  },
];

/** Canonical hex for each domain accent (single source for inline card colours). */
export const accentHex: Record<Accent, string> = {
  blue: '#2997ff',
  red: '#ff453a',
  green: '#30d158',
  violet: '#bf5af2',
  teal: '#64d2ff',
  yellow: '#ffd60a',
  indigo: '#7574ee',
  orange: '#ff9f0a',
  resume: '#bf5af2',
  rose: '#ff375f',
  mint: '#00c7be',
};

export const projectSlugs = projects.map((p) => p.slug);

export function getProject(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Prev/next neighbours in story order (wraps around). */
export function neighbours(slug: string): { prev: ProjectMeta; next: ProjectMeta } {
  const i = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
}
