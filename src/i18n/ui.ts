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
    'site.title': 'Mohamed Mahmoud — A whole marketing team, in one person',
    'site.description':
      'Mohamed Mahmoud (Medmac) — a one-person marketing department in Kuwait. Meta ads at $0.84/lead, a channel grown to 1M+ followers, a 12-tab CRM, and four AI-assisted production systems shipped. Bilingual AR/EN.',
    'nav.work': 'Work',
    'nav.team': 'One-person team',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'a11y.switchLang': 'التبديل إلى العربية',
    'a11y.toggleTheme': 'Toggle light / dark theme',
    'a11y.themeMenu': 'Choose a theme',
    'theme.dark': 'Dark',
    'theme.light': 'Light',
    'theme.neon': 'Neon',
    'theme.cinema': 'Cinema',
    'theme.storybook': 'Storybook',
    'theme.wave': 'Wave',
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
    'site.title': 'محمد محمود — فريق تسويقٍ كامل، في شخصٍ واحد',
    'site.description':
      'محمد محمود (Medmac) — قسم تسويقٍ من شخصٍ واحد في الكويت. إعلانات ميتا بتكلفة ٠٫٨٤$ للعميل، وقناة نمت إلى مليون+ متابع، ونظام عملاء بـ١٢ جدولًا، وأربعة أنظمة إنتاجية بمساعدة الذكاء الاصطناعي. ثنائي اللغة عربي/إنجليزي.',
    'nav.work': 'الأعمال',
    'nav.team': 'فريق من شخص',
    'nav.about': 'نبذة',
    'nav.contact': 'تواصل',
    'a11y.switchLang': 'Switch to English',
    'a11y.toggleTheme': 'تبديل المظهر الفاتح / الداكن',
    'a11y.themeMenu': 'اختر المظهر',
    'theme.dark': 'داكن',
    'theme.light': 'فاتح',
    'theme.neon': 'نيون',
    'theme.cinema': 'سينما',
    'theme.storybook': 'حكاية',
    'theme.wave': 'موجة',
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
