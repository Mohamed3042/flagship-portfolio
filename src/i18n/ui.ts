/**
 * Shared chrome strings (nav, footer, toggles, common labels, document head).
 * Page/section prose lives co-located in its component as { en, ar } picks —
 * this dictionary is only for text repeated across pages.
 */

export const languages = { en: 'English', ar: 'العربية' } as const;
export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'site.title': 'Mohamed Mahmoud — Automation Engineer in Kuwait',
    'site.description':
      'Mohamed Mahmoud is an Automation Engineer in Kuwait building local AI, internal tools, bilingual document systems, desktop software, and verified system integrations. 30 project stories in English and Arabic.',
    'nav.work': 'Work',
    'nav.team': 'Engineering Lab',
    'nav.about': 'Foundation',
    'nav.contact': 'Contact',
    'a11y.switchLang': 'التبديل إلى العربية',
    'a11y.toggleTheme': 'Toggle light / dark appearance',
    'a11y.themeMenu': 'Choose a visual world',
    'world.astronomy': 'Astronomy · Default',
    'world.razer': 'Razer · Chroma',
    'world.disney': 'Disney · Storybook',
    'world.cod': 'COD · Tactical',
    'world.netflix': 'Netflix · Cinema',
    'world.spotify': 'Spotify · Pulse',
    'world.apple': 'Apple · Titanium',
    'world.samsung': 'Samsung · Galaxy',
    'a11y.skip': 'Skip to content',
    'a11y.home': 'Mohamed Mahmoud — home',
    'cta.seeWork': 'See the work',
    'cta.getInTouch': 'Get in touch',
    'hero.scroll': 'Scroll',
    'work.open': 'Open story',
    'work.all': 'All work',
    'work.prev': 'Prev',
    'work.next': 'Next',
    'work.filmHint':
      'Interactive story — click or use the arrows inside · crafted in Claude Design',
    'footer.note': 'Built from real, sourced data — no fabricated numbers.',
    'footer.top': 'Back to top ↑',
  },
  ar: {
    'site.title': 'محمد محمود — مهندس أتمتة في الكويت',
    'site.description':
      'محمد محمود مهندس أتمتة في الكويت يبني ذكاءً محليًا وأدوات داخلية وأنظمة مستندات ثنائية وبرمجيات سطح مكتب وتكاملات موثقة. ٣٠ قصة مشروع بالعربية والإنجليزية.',
    'nav.work': 'الأعمال',
    'nav.team': 'المختبر الهندسي',
    'nav.about': 'الأساس',
    'nav.contact': 'تواصل',
    'a11y.switchLang': 'Switch to English',
    'a11y.toggleTheme': 'تبديل المظهر الفاتح / الداكن',
    'a11y.themeMenu': 'اختر العالم البصري',
    'world.astronomy': 'الفلك · الافتراضي',
    'world.razer': 'Razer · كروما',
    'world.disney': 'Disney · حكاية',
    'world.cod': 'COD · تكتيكي',
    'world.netflix': 'Netflix · سينما',
    'world.spotify': 'Spotify · نبض',
    'world.apple': 'Apple · تيتانيوم',
    'world.samsung': 'Samsung · مجرّة',
    'a11y.skip': 'تخطَّ إلى المحتوى',
    'a11y.home': 'محمد محمود — الرئيسية',
    'cta.seeWork': 'شاهد الأعمال',
    'cta.getInTouch': 'تواصل معي',
    'hero.scroll': 'مرّر',
    'work.open': 'افتح القصة',
    'work.all': 'كل الأعمال',
    'work.prev': 'السابق',
    'work.next': 'التالي',
    'work.filmHint': 'قصة تفاعلية — انقر أو استخدم الأسهم بالداخل · صُمّمت في Claude Design',
    'footer.note': 'مبنيٌّ على بياناتٍ حقيقية موثّقة — بلا أرقامٍ مُختلَقة.',
    'footer.top': 'العودة للأعلى ↑',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];
