import type { Localized } from './projects';

/**
 * The eight systems the home page flies to, in flight order. Everything a
 * station says comes from that project's entry in system-projects.ts (title,
 * blurb, proof, boundary, link); this file only adds what the home needs on
 * top: which sanitized proof-book screens to layer, and how a reader can check
 * the work. `repo` is set ONLY for repositories that are public.
 *
 * Screens: public/img/sky/*.webp, built by scripts/build-sky-shots.mjs from the
 * privacy-reviewed proof-book assets.
 */
export interface FeaturedShot {
  src: string;
  w: number;
  h: number;
  alt: Localized;
}

export interface Featured {
  slug: string;
  chapter: 'public' | 'private';
  version?: string;
  repo?: string;
  shots: FeaturedShot[];
}

export const featured: Featured[] = [
  {
    slug: 'ask-repos',
    chapter: 'public',
    version: 'v0.2.0',
    repo: 'https://github.com/Mohamed3042/ask-repos',
    shots: [
      { src: 'askrepos-evals', w: 1280, h: 738, alt: { en: 'The evals page publishes what CI gates on, including full-text retrieval at 0.512.', ar: 'صفحة التقييمات تنشر ما يعتمد عليه CI، ومنه البحث النصي الكامل عند ٠٫٥١٢.' } },
      { src: 'askrepos-answer', w: 1280, h: 738, alt: { en: 'The public demo states its limits before anyone asks a question.', ar: 'يعلن العرض العام حدوده قبل أن يطرح أحد سؤالًا.' } },
      { src: 'askrepos-corpus', w: 1280, h: 738, alt: { en: 'The corpus page shows exactly which public repositories answers are drawn from.', ar: 'تعرض صفحة المجموعة المستودعات العامة التي تُستمد منها الإجابات بالضبط.' } },
    ],
  },
  {
    slug: 'enterprise-ai-automation-templates',
    chapter: 'public',
    version: 'v0.3.0',
    repo: 'https://github.com/Mohamed3042/enterprise-ai-automation-templates',
    shots: [
      { src: 'atmpl-console', w: 1280, h: 800, alt: { en: 'The read-only public demo states its synthetic, no-key limits before anything else.', ar: 'يعلن العرض العام للقراءة فقط حدوده الاصطناعية وغياب المفاتيح قبل أي شيء آخر.' } },
      { src: 'atmpl-evals', w: 1280, h: 800, alt: { en: '61 scored cases, 0 failed: the gate CI refuses to ship without.', ar: '٦١ حالة مُقيَّمة ولا فشل: البوابة التي يرفض CI الشحن من دونها.' } },
      { src: 'atmpl-audit', w: 1280, h: 800, alt: { en: 'The hash-chained ledger verifies end to end, record by record.', ar: 'يتحقق الدفتر المترابط بالتجزئة من أوله إلى آخره، سجلًا بعد سجل.' } },
    ],
  },
  {
    slug: 'relayops',
    chapter: 'public',
    version: 'v1.2.0',
    repo: 'https://github.com/Mohamed3042/ai-automation-command-center',
    shots: [
      { src: 'relayops-overview', w: 1280, h: 965, alt: { en: 'One control plane over synthetic retail data: runs, alerts and evidence together.', ar: 'لوحة تحكم واحدة فوق بيانات تجزئة اصطناعية: عمليات التشغيل والتنبيهات والأدلة معًا.' } },
      { src: 'relayops-builder', w: 1280, h: 960, alt: { en: 'Workflows, retry limits and schedules persist in SQLite, editable without code.', ar: 'تُحفظ مسارات العمل وحدود إعادة المحاولة والجداول في SQLite وتُعدَّل دون شيفرة.' } },
      { src: 'relayops-intelligence', w: 1280, h: 1019, alt: { en: 'The deterministic offline fallback labels itself while synthetic tickets are routed.', ar: 'يعلن البديل الحتمي دون اتصال عن نفسه بينما تُوجَّه تذاكر اصطناعية.' } },
    ],
  },
  {
    slug: 'petpoint-ops-hub',
    chapter: 'public',
    version: 'v1.1.0',
    repo: 'https://github.com/Mohamed3042/petpoint-ops-hub',
    shots: [
      { src: 'petpoint-reports', w: 1280, h: 889, alt: { en: 'Scheduled daily and weekly reports generated from the same synthetic KPI queries.', ar: 'تقارير يومية وأسبوعية مجدولة تُولَّد من استعلامات المؤشرات الاصطناعية نفسها.' } },
    ],
  },
  {
    slug: 'cake-studio',
    chapter: 'private',
    shots: [
      { src: 'cake-tour', w: 1280, h: 800, alt: { en: 'The public product tour states the line: use the tour, not the source. v9.0.2 is released privately.', ar: 'تعلن الجولة العامة للمنتج الحد الفاصل: استخدم الجولة لا الشيفرة، فالإصدار v9.0.2 خاص.' } },
      { src: 'cake-render', w: 1280, h: 799, alt: { en: 'A synthetic three-tier cake rendered in the 3D proof view.', ar: 'كعكة اصطناعية من ثلاث طبقات في عرض البروفة ثلاثي الأبعاد.' } },
    ],
  },
  {
    slug: 'medmac-box-studio',
    chapter: 'private',
    shots: [
      { src: 'mkeditor-v5-installed', w: 1280, h: 778, alt: { en: 'Installed v5.0.1: an asymmetric test fixture lands once, readable, on the physical carton face.', ar: 'النسخة المثبّتة v5.0.1: يستقر عنصر اختبار غير متماثل مرة واحدة ومقروءًا على وجه الكرتونة المادي.' } },
      { src: 'mkeditor-tour', w: 1280, h: 800, alt: { en: 'The public guided demo: transcript, plan, approval and receipt, with no source code.', ar: 'العرض الموجّه العام: نص منطوق فخطة فموافقة فإيصال، دون أي شيفرة مصدرية.' } },
    ],
  },
  {
    slug: 'sheep-business-management',
    chapter: 'private',
    shots: [
      { src: 'sheep-dashboard', w: 1280, h: 810, alt: { en: 'The Arabic dashboard closes the cycle on synthetic animals in a test farm.', ar: 'تُغلق اللوحة العربية الدورة على رؤوس اصطناعية في مزرعة اختبار.' } },
      { src: 'sheep-audit', w: 1280, h: 810, alt: { en: 'Every change in the synthetic test farm stays traceable: what changed, who, where and when.', ar: 'يبقى كل تغيير في مزرعة الاختبار الاصطناعية قابلًا للتتبع: ماذا تغيّر، ومن غيّره، وأين، ومتى.' } },
      { src: 'sheep-tour', w: 1280, h: 800, alt: { en: 'The public tour draws the line between the inspectable tour and the private product.', ar: 'ترسم الجولة العامة الحد الفاصل بين الجولة القابلة للفحص والمنتج الخاص.' } },
    ],
  },
  {
    slug: 'spaceframe-world',
    chapter: 'private',
    shots: [
      { src: 'spaceframe-utilization', w: 1280, h: 720, alt: { en: 'A generated ring canopy, coloured by design utilisation, with the research-preview warning in view.', ar: 'مظلة حلقية مولَّدة ملوَّنة حسب نسبة الاستخدام التصميمي، مع تحذير المعاينة البحثية ظاهرًا.' } },
      { src: 'spaceframe-optimizer', w: 1280, h: 720, alt: { en: 'Section screening converges and states it is preliminary, not a complete member design.', ar: 'يتقارب فحص المقاطع ويصرّح بأنه أوّلي وليس تصميمًا كاملًا للعناصر.' } },
      { src: 'spaceframe-desktop', w: 1280, h: 821, alt: { en: 'The packaged desktop app offers to restore locally autosaved work from a demonstrator model.', ar: 'يعرض التطبيق المكتبي المُحزَّم استعادة عمل محفوظ تلقائيًا على الجهاز لنموذج توضيحي.' } },
    ],
  },
];
