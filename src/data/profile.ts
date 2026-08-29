/**
 * SINGLE SOURCE OF TRUTH for every verified, public-safe fact and metric.
 *
 * GUARDRAIL: Every number rendered anywhere on the site MUST trace to this file
 * (or to the verbatim, sourced figures in src/data/projects.ts).
 * Do not invent, round into new claims, or add metrics not listed here.
 * Do not add client names, price lists, candidate/CV data, or project-value figures.
 * All figures below are the verified, public-safe numbers from the build brief §0.
 */

export const profile = {
  name: { en: 'Mohamed Mahmoud', ar: 'محمد محمود' },
  title: {
    en: 'Automation Engineer',
    ar: 'مهندس أتمتة',
  },
  // One-line positioning — the engineer who turns manual work into guarded systems.
  tagline: {
    en: 'An Automation Engineer who maps manual work, builds the internal tool, and verifies the result.',
    ar: 'مهندس أتمتة يرسم العمل اليدوي، ويبني الأداة الداخلية، ويتحقق من النتيجة.',
  },
  location: { en: 'Kuwait', ar: 'الكويت' },
  nationality: { en: 'Egyptian', ar: 'مصري' },
  languages: {
    en: ['Arabic (native)', 'English (fluent)'],
    ar: ['العربية (اللغة الأم)', 'الإنجليزية (إتقان تام)'],
  },

  contact: {
    email: 'medo433447@gmail.com',
    phone: '+965 9933 8996',
    // E.164 digits only, for wa.me / tel: links
    phoneDigits: '96599338996',
    whatsapp: 'https://wa.me/96599338996',
    linkedin: 'https://www.linkedin.com/in/mohamed-mahmoud-5a748b243',
    linkedinHandle: 'mohamed-mahmoud-5a748b243',
  },

  /**
   * 2026 Meta paid-social pilot — MEASURED. Exact figures only.
   */
  metaPilot: {
    spendUsd: 172.78,
    leads: 206,
    costPerLeadUsd: 0.84, // ~$0.84 each (average)
    bestCostPerLeadUsd: 0.5, // best campaign $0.50/lead
    impressions: 85132,
    reach: 40460,
    leadChannel: { en: 'WhatsApp', ar: 'واتساب' },
  },

  /**
   * Cumulative 2025–2026 paid social.
   */
  cumulative: {
    impressions: 878000, // ≈878K
    impressionsLabel: { en: '≈878K', ar: '≈878 ألف' },
    leadsAndCalls: 420, // 420+ leads/calls
    costPerLeadLowUsd: 0.84,
    costPerLeadHighUsd: 3.12,
  },

  /**
   * Bilingual lead-tracking CRM built in-house.
   */
  crm: {
    tabs: 12,
    activeLeads: 45,
    contactsCaptured: 200, // 200+
    offersRouted: 22, // routed to the sales engineer
  },

  /**
   * Al-Ma'ali Satellite Channel social growth (2021–2025).
   */
  almaali: {
    period: '2021–2025',
    channels: [
      { platform: 'Facebook', from: 9200, to: 1000000, fromLabel: '9.2K', toLabel: '1M+' },
      { platform: 'Instagram', from: 3000, to: 50000, fromLabel: '3K', toLabel: '50K' },
      { platform: 'TikTok', from: 0, to: 33000, fromLabel: '0', toLabel: '33K' },
      { platform: 'YouTube', from: 0, to: 43000, fromLabel: '0', toLabel: '43K' },
    ],
  },

  education: [
    {
      degree: { en: 'BSc, Artificial Intelligence', ar: 'بكالوريوس في الذكاء الاصطناعي' },
      org: { en: 'Egyptian Russian University', ar: 'الجامعة المصرية الروسية' },
      period: '2020–2024',
    },
  ],

  certifications: [
    {
      name: { en: 'Verified AI Engineer Certification', ar: 'شهادة مهندس ذكاء اصطناعي مُعتمد' },
      org: 'Sahl',
    },
  ],
} as const;

export type Profile = typeof profile;
