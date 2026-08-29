'use strict';

const TEMPLATE_REVISION = '2026-08-29.1';
const STORAGE_KEY = 'mohamed-cv-facts:v1';
const STORAGE_PREF_KEY = 'mohamed-cv-facts:remember';
const OTHER = 'other';

const text = (en, ar) => ({ en, ar });
const choice = (value, en, ar, answer = en) => ({ value, label: text(en, ar), answer });

const sections = {
  identity: text('Identity & contact', 'الهوية والتواصل'),
  campaign: text('Campaign targets', 'أهداف حملة التقديم'),
  medmac: text('Current employment & Medmac work', 'العمل الحالي ومشاريع مدماك'),
  history: text('Employment history', 'الخبرات السابقة'),
  evidence: text('Education, skills & projects', 'التعليم والمهارات والمشاريع'),
  availability: text('Availability & mobility', 'التوفر والتنقل'),
  authorization: text('Work authorization', 'أهلية وتصاريح العمل'),
  salary: text('Salary & benefits', 'الراتب والمزايا'),
  forms: text('Form-only answers', 'إجابات نماذج التقديم فقط'),
  policy: text('Application policy', 'سياسة التقديم'),
};

const facts = [
  {
    id: 'identity.display_name', section: 'identity', status: 'fixed', locked: true, required: true,
    visibility: 'public_cv', label: text('CV display name', 'الاسم الظاهر في السيرة الذاتية'),
    help: text('Fixed identity fact. Personal work is always branded with this name.', 'حقيقة هوية ثابتة. كل العمل الشخصي يحمل هذا الاسم فقط.'),
    value: 'Mohamed Mahmoud',
  },
  {
    id: 'identity.headline', section: 'identity', status: 'fixed', locked: true, required: true,
    visibility: 'public_cv', label: text('Professional headline', 'المسمى المهني'),
    help: text('Specialization and campaign headline; it is not a replacement for the official employer title.', 'التخصص وعنوان حملة التقديم، وليس بديلاً عن المسمى الرسمي لدى صاحب العمل.'),
    value: 'AI & Automation Engineer',
  },
  {
    id: 'identity.personal_brand', section: 'identity', status: 'fixed', locked: true, required: true,
    visibility: 'internal_policy', label: text('Personal brand rule', 'قاعدة الهوية الشخصية'),
    help: text('Employer branding may appear only inside the current-employment entry and its project names.', 'تظهر علامة صاحب العمل فقط داخل خبرة العمل الحالية وأسماء مشاريعه.'),
    value: 'All personal work is branded Mohamed Mahmoud. Medmac is an employer, never the personal brand.',
  },
  {
    id: 'contact.application_email', section: 'identity', status: 'fixed', locked: true, required: true,
    visibility: 'public_cv', label: text('Only application email', 'البريد الوحيد للتقديم'),
    help: text('Every CV, application, signup, recruiter message, and applicant account must use this personal address only.', 'يُستخدم هذا البريد الشخصي فقط في كل سيرة ذاتية ونموذج وحساب ورسالة توظيف.'),
    value: 'medo433447@gmail.com',
  },
  {
    id: 'identity.nationality_base', section: 'identity', status: 'fixed', locked: true, required: true,
    visibility: 'regional_cv', label: text('Nationality and base', 'الجنسية ومكان الإقامة'),
    help: text('Shown only where the regional CV convention expects it; never on the US CV.', 'تظهر فقط عندما تتوقعها السيرة الإقليمية، ولا تظهر مطلقاً في السيرة الأمريكية.'),
    value: 'Egyptian · Based in Kuwait · Transferable residency',
  },
  {
    id: 'contact.phone', section: 'identity', status: 'confirmed', locked: true, required: true,
    visibility: 'public_cv', label: text('Phone and WhatsApp', 'الهاتف وواتساب'),
    help: text('Confirmed personal phone. WhatsApp is available on the same number.', 'رقم شخصي مؤكد، وواتساب متاح على الرقم نفسه.'),
    value: '+965 9933 8996 · WhatsApp: Yes',
  },
  {
    id: 'contact.professional_links', section: 'identity', status: 'confirmed', locked: true, required: true,
    visibility: 'public_cv', label: text('LinkedIn and GitHub', 'لينكدإن وجيت هب'),
    help: text('Confirmed professional profiles.', 'حسابات مهنية مؤكدة.'),
    value: 'LinkedIn: https://www.linkedin.com/in/mohamed-mahmoud-5a748b243\nGitHub: https://github.com/Mohamed3042',
  },
  {
    id: 'portfolio.primary_links', section: 'identity', status: 'confirmed', locked: true, required: true,
    visibility: 'public_cv', label: text('CV portfolio links', 'روابط معرض الأعمال في السيرة'),
    help: text('The two links selected for the campaign.', 'الرابطان المختاران لحملة التقديم.'),
    value: 'Worlds home: https://mohamed3042.github.io/flagship-portfolio/worlds/\nProject book: https://mohamed3042.github.io/flagship-portfolio/downloads/Mohamed-Mahmoud-AI-Automation-Project-Showcase.pdf',
  },
  {
    id: 'identity.legal_names', section: 'identity', status: 'proposed', locked: false, required: true,
    visibility: 'form_only', label: text('Legal English and Arabic names', 'الاسم القانوني بالإنجليزية والعربية'),
    help: text('Confirm the exact passport spelling. Do not enter a passport number or upload a scan.', 'أكد تهجئة الاسم كما في الجواز. لا تدخل رقم الجواز ولا ترفع صورة منه.'),
    suggested: 'English: Mohamed Mahmoud · Arabic: محمد محمود',
  },
  {
    id: 'location.kuwait_city', section: 'identity', status: 'proposed', locked: false, required: true,
    visibility: 'public_cv', label: text('City or area in Kuwait', 'المدينة أو المنطقة في الكويت'),
    help: text('City/area only on the CV. Keep street address and postal details off every CV.', 'المدينة أو المنطقة فقط في السيرة. لا تضع عنوان الشارع أو الرمز البريدي في أي سيرة.'),
    suggested: 'Farwaniya, Kuwait',
  },
  {
    id: 'campaign.target_titles', section: 'campaign', status: 'proposed', locked: false, required: true,
    visibility: 'internal_policy', label: text('Target job titles', 'المسميات الوظيفية المستهدفة'),
    help: text('Later sessions may search exact and closely related titles, but must preserve the AI/automation positioning.', 'يمكن للجلسات اللاحقة البحث عن هذه المسميات وما يقاربها مع الحفاظ على تموضع الذكاء الاصطناعي والأتمتة.'),
    suggested: 'AI & Automation Engineer · Automation Engineer · Systems Integration Engineer',
  },
  {
    id: 'campaign.seniority_industries', section: 'campaign', status: 'needs_input', locked: false, required: true,
    visibility: 'internal_policy', label: text('Seniority and preferred industries', 'المستوى الوظيفي والقطاعات المفضلة'),
    help: text('Write the level and sectors to prioritize or avoid. This controls the 500-application search.', 'اكتب المستوى والقطاعات التي تُعطى الأولوية أو تُستبعد. هذا يضبط بحث 500 طلب.'),
    choices: [
      choice('junior_mid_any', 'Junior to mid-level · industry-flexible', 'مبتدئ إلى متوسط · مرن في القطاع'),
      choice('mid_any', 'Mid-level · industry-flexible', 'متوسط · مرن في القطاع'),
    ],
  },
  {
    id: 'campaign.work_mode', section: 'campaign', status: 'proposed', locked: false, required: true,
    visibility: 'internal_policy', label: text('Employment and work mode', 'نوع وبيئة العمل'),
    help: text('Default keeps the search broad.', 'الإعداد الافتراضي يبقي البحث واسعاً.'),
    suggested: 'Full-time · Remote, hybrid, or on-site',
  },
  {
    id: 'campaign.target_regions', section: 'campaign', status: 'proposed', locked: false, required: true,
    visibility: 'internal_policy', label: text('Target regions', 'المناطق المستهدفة'),
    help: text('Specific cities can be added through Other.', 'يمكن إضافة مدن محددة عبر خيار «أخرى».'),
    suggested: 'Kuwait · Saudi Arabia · Egypt · Europe · United States',
  },
  {
    id: 'exclusions.medmac_affiliates', section: 'campaign', status: 'needs_input', locked: false, required: true,
    visibility: 'internal_policy', label: text('Known Medmac affiliates and alternate names', 'الشركات التابعة والأسماء البديلة لمدماك'),
    help: text('Medmac itself is already blocked. List every parent, subsidiary, brand, recruiter, and domain that later sessions must also exclude. Suspected matches are held for review.', 'مدماك مستبعدة مسبقاً. اذكر كل شركة أم أو تابعة أو علامة أو مسؤول توظيف أو نطاق يجب استبعاده. تُعلّق الحالات المشتبه بها للمراجعة.'),
    choices: [choice('none_known', 'No other affiliates known', 'لا توجد شركات تابعة أخرى معروفة')],
    multiline: true,
  },
  {
    id: 'employment.current.entry', section: 'medmac', status: 'confirmed', locked: true, required: true,
    visibility: 'public_cv', label: text('Current-employment entry', 'خبرة العمل الحالية'),
    help: text('AI & Automation Engineer remains the specialization headline, not an invented official employer title.', 'يبقى «مهندس ذكاء اصطناعي وأتمتة» تخصص الحملة، وليس مسمى رسمياً مُختلقاً لدى صاحب العمل.'),
    value: 'Information Systems Developer\nMedmac Kuwait Co. (General Trading & Contracting)\nJul 2025–Present · Kuwait',
  },
  {
    id: 'employment.current.type', section: 'medmac', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Current employment type', 'نوع العمل الحالي'),
    help: text('Choose the contractual type used on hiring forms.', 'اختر النوع التعاقدي المستخدم في نماذج التوظيف.'),
    choices: [
      choice('full_time', 'Full-time', 'دوام كامل'),
      choice('part_time', 'Part-time', 'دوام جزئي'),
      choice('contract', 'Contract', 'عقد'),
      choice('temporary', 'Temporary', 'مؤقت'),
    ],
  },
  {
    id: 'employment.current.scope', section: 'medmac', status: 'proposed', locked: false, required: true,
    visibility: 'public_cv', label: text('Current-role scope and tools', 'نطاق وأدوات الدور الحالي'),
    help: text('Accept only if this accurately describes work personally performed.', 'اقبل فقط إذا كان هذا يصف العمل الذي نفذته شخصياً بدقة.'),
    suggested: 'AI automation, workflow engines, systems integration, internal tools, bilingual Arabic/English systems, human approval gates, Python, TypeScript, SQL/SQLite, Electron, Astro, local AI/Ollama, Git, automated testing, document automation, and PDF preflight.',
  },
  {
    id: 'employment.current.achievements', section: 'medmac', status: 'confirmed', locked: true, required: true,
    visibility: 'public_cv', label: text('Confirmed Medmac results', 'نتائج مدماك المؤكدة'),
    help: text('Measured results already approved for the campaign; the CRM line preserves the explicit zero-closure boundary.', 'نتائج مقاسة معتمدة للحملة، مع الحفاظ على حقيقة عدم تسجيل إغلاقات في سطر CRM.'),
    value: 'Bilingual CRM: 200+ contacts, 45 active leads, 22 offers, 0 recorded closures.\nHiring automation: 7 scripts, 3 scheduled jobs, 142 CVs reduced to 100 deduplicated records, supporting 2 hires.\nRFQ workflow: 23 tenders consolidated and 4 live tenders recovered.\nQuotations Locker: 90/90 tests and all 4,729 records preserved.',
  },
  {
    id: 'medmac.projects.disclosure', section: 'medmac', status: 'confirmed', locked: true, required: true,
    visibility: 'internal_policy', label: text('Private-project disclosure rule', 'قاعدة عرض المشاريع الخاصة'),
    help: text('Private repositories do not hide the project, but source code, client data, credentials, and confidential operations remain private.', 'المستودع الخاص لا يخفي المشروع، لكن الكود وبيانات العملاء وبيانات الدخول والتفاصيل التشغيلية السرية تبقى خاصة.'),
    value: 'Include every Medmac project at a sanitized, recruiter-safe level. Recruiters may use the project book or ask Mohamed for a sanitized demonstration.',
  },
  {
    id: 'medmac.projects.named', section: 'medmac', status: 'confirmed', locked: true, required: true,
    visibility: 'public_cv', label: text('Named Medmac systems to include', 'أنظمة مدماك المطلوب ذكرها'),
    help: text('These stay in the master experience inventory even when their repositories are private.', 'تبقى هذه الأنظمة ضمن قائمة الخبرات الرئيسية حتى عندما تكون مستودعاتها خاصة.'),
    value: 'Sheep Business Management System\nMedmac Quotation Builder\nProducts Editor with its Human Bridge\nBilingual CRM\nHiring automation\nRFQ workflow\nQuotations Locker',
  },
  {
    id: 'medmac.products_editor_public', section: 'medmac', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Products Editor: exact public name and Human Bridge description', 'الاسم العام الدقيق لمحرر المنتجات ووصف Human Bridge'),
    help: text('Write the recruiter-safe name and one sentence explaining what the Human Bridge does. Do not paste code or operational data.', 'اكتب الاسم الآمن للتوظيف وجملة تشرح وظيفة Human Bridge دون لصق كود أو بيانات تشغيلية.'),
    multiline: true,
  },
  {
    id: 'medmac.quotation_relationship', section: 'medmac', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Quotation Builder versus Quotations Locker', 'العلاقة بين Quotation Builder وQuotations Locker'),
    help: text('Confirm whether these are two separate systems, one renamed system, or parts of one system.', 'أكد هل هما نظامان منفصلان أم اسم قديم وجديد أم جزآن من نظام واحد.'),
    choices: [
      choice('separate', 'Two separate systems', 'نظامان منفصلان'),
      choice('same', 'The same system / renamed', 'النظام نفسه / تمت إعادة تسميته'),
      choice('components', 'Two components of one quotation system', 'مكوّنان في نظام عروض أسعار واحد'),
    ],
  },
  {
    id: 'medmac.additional_projects', section: 'medmac', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Any other Medmac work to include', 'أي أعمال أخرى في مدماك يجب ذكرها'),
    help: text('This is the catch-all for every private or public Medmac system not named above.', 'هذا الحقل يجمع كل نظام خاص أو عام في مدماك لم يُذكر أعلاه.'),
    choices: [choice('none', 'No other project is missing', 'لا يوجد مشروع آخر مفقود')],
    multiline: true,
  },
  {
    id: 'employment.prior.almaali', section: 'history', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Al-Ma’ali Satellite Channel role', 'العمل في قناة المعالي الفضائية'),
    help: text('Confirm exact employer display name, title, dates, location, type, duties, results, tools, reason for leaving, and contact permission.', 'أكد اسم جهة العمل والمسمى والتواريخ والموقع والنوع والمهام والنتائج والأدوات وسبب المغادرة وإذن التواصل.'),
    prefill: 'Social Media Manager & Digital Marketing Specialist · Al-Ma’ali Satellite Channel · Remote · 2021–2025\nEmployment type: [NEEDS INPUT]\nResponsibilities/tools/results: [NEEDS INPUT]\nReason for leaving: [NEEDS INPUT]\nMay be contacted: [NEEDS INPUT]',
    multiline: true,
  },
  {
    id: 'employment.prior.mozodi', section: 'history', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Mozodi role', 'العمل في موزودي'),
    help: text('Confirm exact dates, title, location, type, duties, results, tools, reason for leaving, and contact permission.', 'أكد التواريخ والمسمى والموقع والنوع والمهام والنتائج والأدوات وسبب المغادرة وإذن التواصل.'),
    prefill: 'Data Entry · Mozodi · Kuwait startup · approximately 6 months\nExact start/end month and year: [NEEDS INPUT]\nEmployment type: [NEEDS INPUT]\nResponsibilities/tools/results: [NEEDS INPUT]\nReason for leaving: [NEEDS INPUT]\nMay be contacted: [NEEDS INPUT]',
    multiline: true,
  },
  {
    id: 'employment.prior.other', section: 'history', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Other employment, freelance, contracts, and gaps', 'أي عمل آخر أو حر أو عقود أو فجوات'),
    help: text('List anything else with dates and naming permission, or confirm there is nothing else. Explain only material date gaps.', 'اذكر أي خبرة أخرى مع التواريخ وإذن ذكر الاسم، أو أكد عدم وجود غير ذلك. اشرح فقط الفجوات الزمنية المهمة.'),
    choices: [choice('none', 'Nothing else to add; no material gap explanation needed', 'لا يوجد شيء آخر ولا توجد فجوة مهمة تحتاج شرحاً')],
    multiline: true,
  },
  {
    id: 'education.degree', section: 'evidence', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Education', 'التعليم'),
    help: text('Confirm institution, qualification, field, location, start/end dates, graduation status, and any grade/honours you want shown.', 'أكد المؤسسة والدرجة والتخصص والموقع وتواريخ البداية والنهاية وحالة التخرج وأي تقدير أو مرتبة شرف تريد إظهارها.'),
    prefill: 'Bachelor of Artificial Intelligence · Egyptian Russian University · Egypt · 2020–2024\nGraduation status: [NEEDS INPUT]\nCity: [NEEDS INPUT]\nGrade/GPA/honours or “omit”: [NEEDS INPUT]\nEquivalency details or “N/A”: [NEEDS INPUT]',
    multiline: true,
  },
  {
    id: 'education.certifications', section: 'evidence', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Certifications and training', 'الشهادات والتدريب'),
    help: text('Give exact title, issuer, issue/expiry date, credential ID or URL, and whether it may appear publicly. Unverified certificates stay omitted.', 'اكتب الاسم الرسمي والجهة وتاريخ الإصدار والانتهاء ورقم أو رابط الشهادة وهل يمكن عرضها. تُحذف أي شهادة غير موثقة.'),
    choices: [choice('none', 'No confirmed certification to list', 'لا توجد شهادة مؤكدة للعرض')],
    multiline: true,
  },
  {
    id: 'skills.confirmed', section: 'evidence', status: 'proposed', locked: false, required: true,
    visibility: 'public_cv', label: text('Technical skills', 'المهارات التقنية'),
    help: text('Remove anything you cannot honestly defend in an interview. Add proficiency boundaries or years where useful.', 'احذف أي مهارة لا تستطيع الدفاع عنها بصدق في مقابلة، وأضف مستوى الإتقان أو سنوات الاستخدام عند الحاجة.'),
    suggested: 'AI automation; workflow engines; systems integration; internal tools; LLM assistants; knowledge bases; human approval gates; Python; TypeScript; SQL/SQLite; C++; GDScript; HTML/CSS; Astro; Electron; Tkinter; Ollama/local AI; Git; GitHub Actions; automated testing; CRM; document automation; PDF preflight; Arabic RTL.',
    multiline: true,
  },
  {
    id: 'languages', section: 'evidence', status: 'proposed', locked: false, required: true,
    visibility: 'public_cv', label: text('Languages', 'اللغات'),
    help: text('Confirm honest speaking, reading, and writing levels.', 'أكد مستوى التحدث والقراءة والكتابة بصدق.'),
    suggested: 'Arabic — Native · English — Fluent',
  },
  {
    id: 'projects.us_shortlist', section: 'evidence', status: 'needs_input', locked: false, required: true,
    visibility: 'public_cv', label: text('Strongest projects for the one-page US CV', 'أقوى المشاريع للسيرة الأمريكية ذات الصفحة الواحدة'),
    help: text('Pick two or three exact project names and the evidence each should lead with. Medmac projects may be included at a sanitized level.', 'اختر اسم مشروعين أو ثلاثة بالضبط والدليل الأهم لكل منها. يمكن إدراج مشاريع مدماك بوصف آمن.'),
    choices: [choice('job_specific', 'Choose the strongest verified projects from the project book per job', 'اختيار أقوى المشاريع الموثقة من كتاب المشاريع حسب الوظيفة')],
    multiline: true,
  },
  {
    id: 'availability.notice_period', section: 'availability', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Notice period', 'فترة الإشعار'),
    help: text('Current employment makes old “immediate” defaults unsafe. Choose the real contractual or practical notice.', 'العمل الحالي يجعل افتراض «فوري» القديم غير آمن. اختر المدة التعاقدية أو العملية الحقيقية.'),
    choices: [
      choice('immediate', 'Immediate / no notice', 'فوري / بلا إشعار'),
      choice('one_week', '1 week', 'أسبوع واحد'),
      choice('two_weeks', '2 weeks', 'أسبوعان'),
      choice('one_month', '1 month', 'شهر واحد'),
      choice('two_months', '2 months', 'شهران'),
    ],
  },
  {
    id: 'availability.earliest_start', section: 'availability', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Earliest realistic start date', 'أقرب تاريخ واقعي للبدء'),
    help: text('Use a date or a rule tied to the confirmed notice period.', 'استخدم تاريخاً أو قاعدة مرتبطة بفترة الإشعار المؤكدة.'),
    choices: [choice('after_notice', 'Immediately after the confirmed notice period', 'فور انتهاء فترة الإشعار المؤكدة')],
  },
  {
    id: 'availability.interview_shift', section: 'availability', status: 'proposed', locked: false, required: true,
    visibility: 'form_only', label: text('Interview hours and shift/weekend flexibility', 'مواعيد المقابلات ومرونة الورديات وعطلة الأسبوع'),
    help: text('Adjust through Other if there are restrictions.', 'عدّل عبر «أخرى» إذا كانت لديك قيود.'),
    suggested: 'Interview scheduling: flexible in Kuwait time (UTC+3) · Shift/weekend availability: discuss per role',
  },
  {
    id: 'mobility.travel_relocation', section: 'availability', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Relocation, travel percentage, and passport validity', 'الانتقال ونسبة السفر وصلاحية الجواز'),
    help: text('State relocation willingness and timing by region, maximum travel percentage, and passport expiry month/year only. Never enter a passport number.', 'اذكر الاستعداد وتوقيت الانتقال لكل منطقة وأقصى نسبة سفر وشهر/سنة انتهاء الجواز فقط. لا تدخل رقم الجواز.'),
    multiline: true,
  },
  {
    id: 'work_auth.kuwait_europe_us_fixed', section: 'authorization', status: 'fixed', locked: true, required: true,
    visibility: 'regional_cv', label: text('Fixed work-authorization facts', 'حقائق أهلية العمل الثابتة'),
    help: text('GCC CV may show nationality and transferable residency. Europe is concise with sponsorship. US CV never shows nationality or age.', 'قد تعرض سيرة الخليج الجنسية والإقامة القابلة للتحويل. سيرة أوروبا مختصرة مع الرعاية. السيرة الأمريكية لا تعرض الجنسية أو العمر.'),
    value: 'Kuwait: transferable residency.\nEurope: visa sponsorship required.\nUnited States: visa sponsorship required.',
  },
  {
    id: 'work_auth.egypt', section: 'authorization', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Egypt work eligibility', 'أهلية العمل في مصر'),
    help: text('Confirm whether you have unrestricted work eligibility in Egypt.', 'أكد ما إذا كانت لديك أهلية عمل غير مقيدة في مصر.'),
    choices: [choice('yes', 'Yes — unrestricted eligibility', 'نعم — أهلية غير مقيدة'), choice('no', 'No', 'لا')],
  },
  {
    id: 'work_auth.kuwait_details', section: 'authorization', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Kuwait residency details', 'تفاصيل الإقامة في الكويت'),
    help: text('Enter the article/type, expiry month/year, and realistic transfer timing. Do not enter Civil ID or residency numbers.', 'أدخل المادة/النوع وشهر/سنة الانتهاء ووقت التحويل الواقعي. لا تدخل رقم البطاقة المدنية أو الإقامة.'),
    multiline: true,
  },
  {
    id: 'work_auth.saudi', section: 'authorization', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Saudi work authorization and sponsorship', 'أهلية ورعاية العمل في السعودية'),
    help: text('Choose the exact current status and add relocation timing through Other if needed.', 'اختر الوضع الحالي الدقيق وأضف توقيت الانتقال عبر «أخرى» عند الحاجة.'),
    choices: [
      choice('needs_sponsor', 'Not currently authorized; employer sponsorship required', 'غير مصرح حالياً؛ أحتاج رعاية صاحب العمل'),
      choice('authorized', 'Currently authorized to work', 'مصرح لي بالعمل حالياً'),
      choice('unknown', 'Need to verify', 'أحتاج إلى التحقق'),
    ],
  },
  {
    id: 'work_auth.europe', section: 'authorization', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Existing European rights or permits', 'أي حقوق أو تصاريح أوروبية حالية'),
    help: text('Sponsorship need is fixed. Confirm whether any EU/EEA/UK right or permit also exists.', 'الحاجة إلى الرعاية ثابتة. أكد إن كان لديك أيضاً أي حق أو تصريح في الاتحاد الأوروبي أو المنطقة الاقتصادية أو بريطانيا.'),
    choices: [choice('none', 'No existing European work right or permit', 'لا يوجد حق أو تصريح عمل أوروبي حالي')],
  },
  {
    id: 'work_auth.us', section: 'authorization', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('US authorization questions', 'أسئلة أهلية العمل في أمريكا'),
    help: text('Confirm the exact answers to “authorized now?” and “require sponsorship now or later?”.', 'أكد الإجابة الدقيقة عن «هل أنت مصرح الآن؟» و«هل تحتاج رعاية الآن أو لاحقاً؟».'),
    choices: [choice('no_yes', 'Authorized now: No · Sponsorship now or later: Yes', 'مصرح الآن: لا · أحتاج رعاية الآن أو لاحقاً: نعم')],
  },
  {
    id: 'salary.egypt', section: 'salary', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Egypt salary expectation', 'الراتب المتوقع في مصر'),
    help: text('Enter minimum/target or range, EGP per month, gross or net, and negotiability.', 'أدخل الحد الأدنى/المستهدف أو النطاق بالجنيه شهرياً، إجمالي أو صافي، وقابلية التفاوض.'),
    choices: [choice('negotiable', 'Negotiable / market-aligned; numeric answer only when mandatory', 'قابل للتفاوض / حسب السوق؛ رقم فقط عند الإلزام')],
  },
  {
    id: 'salary.kuwait', section: 'salary', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Kuwait salary expectation', 'الراتب المتوقع في الكويت'),
    help: text('Enter minimum/target or range, KWD per month, gross or net, and negotiability.', 'أدخل الحد الأدنى/المستهدف أو النطاق بالدينار شهرياً، إجمالي أو صافي، وقابلية التفاوض.'),
    choices: [choice('negotiable', 'Negotiable / market-aligned; numeric answer only when mandatory', 'قابل للتفاوض / حسب السوق؛ رقم فقط عند الإلزام')],
  },
  {
    id: 'salary.saudi', section: 'salary', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Saudi salary expectation', 'الراتب المتوقع في السعودية'),
    help: text('Enter minimum/target or range, SAR per month, gross or net, and negotiability.', 'أدخل الحد الأدنى/المستهدف أو النطاق بالريال شهرياً، إجمالي أو صافي، وقابلية التفاوض.'),
    choices: [choice('negotiable', 'Negotiable / market-aligned; numeric answer only when mandatory', 'قابل للتفاوض / حسب السوق؛ رقم فقط عند الإلزام')],
  },
  {
    id: 'salary.europe', section: 'salary', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Europe salary expectation', 'الراتب المتوقع في أوروبا'),
    help: text('Enter minimum/target or range, EUR annual gross; name any UK or Swiss exception.', 'أدخل الحد الأدنى/المستهدف أو النطاق باليورو سنوياً إجمالي، واذكر أي استثناء لبريطانيا أو سويسرا.'),
    choices: [choice('negotiable', 'Negotiable / market-aligned; numeric answer only when mandatory', 'قابل للتفاوض / حسب السوق؛ رقم فقط عند الإلزام')],
  },
  {
    id: 'salary.us', section: 'salary', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('US salary expectation', 'الراتب المتوقع في أمريكا'),
    help: text('Enter minimum/target or range, USD annual base, and negotiability.', 'أدخل الحد الأدنى/المستهدف أو النطاق بالدولار كراتب أساسي سنوي وقابلية التفاوض.'),
    choices: [choice('negotiable', 'Negotiable / market-aligned; numeric answer only when mandatory', 'قابل للتفاوض / حسب السوق؛ رقم فقط عند الإلزام')],
  },
  {
    id: 'salary.disclosure_policy', section: 'salary', status: 'proposed', locked: false, required: true,
    visibility: 'internal_policy', label: text('Salary disclosure policy', 'سياسة الإفصاح عن الراتب'),
    help: text('Salary stays off every CV.', 'لا يظهر الراتب في أي سيرة ذاتية.'),
    suggested: 'Keep salary off CVs. Say negotiable/market-aligned where allowed. Decline current-salary disclosure when optional; never invent a figure.',
  },
  {
    id: 'benefits.by_region', section: 'salary', status: 'proposed', locked: false, required: true,
    visibility: 'form_only', label: text('Required benefits or compensation constraints', 'المزايا المطلوبة أو قيود التعويض'),
    help: text('Use Other for housing, transport, family visa, flights, insurance, bonus, equity, relocation support, or other minimums.', 'استخدم «أخرى» للسكن أو النقل أو تأشيرة الأسرة أو التذاكر أو التأمين أو المكافأة أو الأسهم أو دعم الانتقال أو أي حد أدنى.'),
    suggested: 'No additional mandatory benefit minimums; evaluate the complete offer.',
  },
  {
    id: 'form.over_18', section: 'forms', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Age eligibility without date of birth', 'أهلية العمر دون تاريخ الميلاد'),
    help: text('Prefer an 18+ confirmation. Exact DOB never appears on US/Europe CVs and is disclosed only when a verified form legally requires it.', 'يفضل تأكيد 18+. لا يظهر تاريخ الميلاد في سيرة أمريكا أو أوروبا ولا يُفصح عنه إلا عند إلزام نموذج موثوق.'),
    choices: [choice('yes', 'Yes — 18 or older', 'نعم — 18 سنة أو أكثر'), choice('prefer_not', 'Prefer not to answer unless mandatory', 'أفضل عدم الإجابة إلا إذا كان الحقل إلزامياً')],
  },
  {
    id: 'form.military_status', section: 'forms', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Egyptian military-service status', 'موقف الخدمة العسكرية المصرية'),
    help: text('Form-only by default; omit from CV unless materially relevant.', 'للنماذج فقط افتراضياً؛ لا يظهر في السيرة إلا عند أهمية مباشرة.'),
    choices: [
      choice('completed', 'Completed', 'أديت الخدمة'),
      choice('exempt', 'Exempt', 'معفى'),
      choice('deferred', 'Deferred', 'مؤجل'),
      choice('not_applicable', 'Not applicable', 'لا ينطبق'),
      choice('prefer_not', 'Prefer not to answer unless mandatory', 'أفضل عدم الإجابة إلا إذا كان إلزامياً'),
    ],
  },
  {
    id: 'form.driving_licence', section: 'forms', status: 'proposed', locked: false, required: true,
    visibility: 'form_only', label: text('Driving licence', 'رخصة القيادة'),
    help: text('Add country/type/expiry through Other if the default is wrong.', 'أضف الدولة والنوع والانتهاء عبر «أخرى» إذا كان الافتراض غير صحيح.'),
    suggested: 'No driving licence',
  },
  {
    id: 'form.professional_licences', section: 'forms', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Professional licences or security clearances', 'التراخيص المهنية أو التصاريح الأمنية'),
    help: text('Confirm none, or list exact licence, jurisdiction, and validity.', 'أكد عدم وجودها أو اذكر الترخيص والجهة والصلاحية بدقة.'),
    choices: [choice('none', 'None', 'لا يوجد')],
  },
  {
    id: 'form.demographic_policy', section: 'forms', status: 'proposed', locked: false, required: true,
    visibility: 'internal_policy', label: text('Voluntary demographic policy', 'سياسة البيانات الديموغرافية الاختيارية'),
    help: text('Covers DOB/age, gender, marital status, dependants, race/ethnicity, religion, disability, and US veteran status. Never put these on a US CV.', 'تشمل الميلاد والعمر والجنس والحالة الاجتماعية والمعالين والعرق والدين والإعاقة وحالة المحارب القديم في أمريكا. لا توضع في السيرة الأمريكية.'),
    suggested: 'Decline to self-identify where allowed. Provide only when legally required and explicitly confirmed for that verified form.',
  },
  {
    id: 'references.policy', section: 'forms', status: 'proposed', locked: false, required: true,
    visibility: 'internal_policy', label: text('References', 'المراجع'),
    help: text('Never publish or contact a referee without permission.', 'لا تنشر بيانات مرجع ولا تتواصل معه دون إذن.'),
    suggested: 'References available on request. Share contact details only after explicit permission.',
  },
  {
    id: 'declarations.legal', section: 'forms', status: 'needs_input', locked: false, required: true,
    visibility: 'form_only', label: text('Conflicts and legal declarations', 'التعارضات والإقرارات القانونية'),
    help: text('Cover non-compete/IP limits, outside-business conflict, government role, sanctions/debarment, criminal disclosure, relatives at targets, and prior target-company history. Do not guess “No”.', 'تشمل عدم المنافسة وقيود الملكية وتعارض العمل الخارجي والدور الحكومي والعقوبات والسجل الجنائي والأقارب لدى الجهات المستهدفة وسجل التقديم السابق. لا تفترض «لا».'),
    choices: [choice('none', 'None of these apply', 'لا ينطبق أي منها'), choice('disclose', 'One or more require disclosure', 'يوجد أمر أو أكثر يتطلب الإفصاح')],
    multiline: true,
  },
  {
    id: 'policy.current_employer_contact', section: 'policy', status: 'fixed', locked: true, required: true,
    visibility: 'internal_policy', label: text('Current-employer contact rule', 'قاعدة التواصل مع صاحب العمل الحالي'),
    help: text('Confidential search guard.', 'حماية البحث الوظيفي السري.'),
    value: 'Do not contact Medmac. Never apply to Medmac or any confirmed affiliate. Hold suspected affiliates for review.',
  },
  {
    id: 'policy.output_variants', section: 'policy', status: 'fixed', locked: true, required: true,
    visibility: 'internal_policy', label: text('Regional CV presentation', 'تنسيق السير الإقليمية'),
    help: text('ATS-safe throughout: no tables or graphics and standard headings.', 'كل النسخ متوافقة مع ATS: بلا جداول أو رسومات وبعناوين قياسية.'),
    value: 'Master: up to 2 pages; omit nationality, salary, visa details, full address, and photo.\nGCC: up to 2 pages; show Egyptian nationality and Kuwait transferable residency; no photo.\nEgypt: up to 2 pages; no photo; military status stays form-only by default.\nEurope: concise; no photo or nationality; show sponsorship line.\nUS: 1 page; no photo, nationality, age, DOB, marital status, or protected traits.',
  },
  {
    id: 'cover_letter.positioning', section: 'policy', status: 'proposed', locked: false, required: true,
    visibility: 'internal_policy', label: text('Cover-letter positioning', 'تموضع خطاب التقديم'),
    help: text('Use Other to add two or three truthful motivations, a stronger differentiator, or topics to avoid.', 'استخدم «أخرى» لإضافة دافعين أو ثلاثة حقيقيين أو فارق أقوى أو موضوعات يجب تجنبها.'),
    suggested: 'Concise, evidence-led, and job-specific. Lead with human-gated automation, bilingual systems, and spec-driven AI-assisted delivery. Never use unsupported enthusiasm, metrics, or claims.',
    multiline: true,
  },
  {
    id: 'authority.application_actions', section: 'policy', status: 'proposed', locked: false, required: true,
    visibility: 'internal_policy', label: text('Authority for later application sessions', 'صلاحيات جلسات التقديم اللاحقة'),
    help: text('Passwords, 2FA, attestations, checks, consent, and e-signatures always stay with Mohamed.', 'كلمات المرور والتحقق الثنائي والإقرارات والفحوص والموافقات والتوقيعات الإلكترونية تبقى دائماً مع محمد.'),
    suggested: 'Research and stage only. Final submission, applicant-account creation, uploads, recruiter contact, privacy acceptance, attestations, background checks, and e-signatures require explicit action-time authorization.',
    multiline: true,
  },
  {
    id: 'policy.catch_all', section: 'policy', status: 'needs_input', locked: false, required: true,
    visibility: 'internal_policy', label: text('Anything else a hiring form may demand', 'أي معلومة أخرى قد يطلبها نموذج توظيف'),
    help: text('Add any missing fact. Unforeseen mandatory fields must HOLD the application and return here; later sessions never guess.', 'أضف أي حقيقة مفقودة. أي حقل إلزامي غير متوقع يوقف الطلب ويعود هنا؛ لا تخمن الجلسات اللاحقة.'),
    choices: [choice('none', 'Nothing else to add now; HOLD every unforeseen mandatory field', 'لا يوجد شيء آخر الآن؛ أوقف أي حقل إلزامي غير متوقع')],
    multiline: true,
  },
];

const ui = {
  en: {
    headerSubtitle: 'Campaign facts', languageButton: 'العربية', eyebrow: '500-application campaign · 0 submitted',
    title: 'Your CV truth lock', lede: 'Answer the remaining items once. Confirmed answers stay locked; choose Other whenever the default is not right.',
    privacyTitle: 'Answers do not leave this page', privacyBody: 'GitHub hosts the empty editor and CV-safe locked facts. New answers stay in this tab unless you explicitly remember them on this device or download a private file. No submit button, analytics, account token, or server exists here.',
    privateState: 'PRIVATE MODE', progressKicker: 'Truth rail', progressTitle: 'Campaign readiness', confirmed: 'Confirmed', proposed: 'Defaults',
    needsInput: 'Needs input', changed: 'Changed', rememberTitle: 'Remember on this device', rememberHelp: 'Off by default for salary, visa, and form-only privacy.',
    sessionOnly: 'Session only · download before closing', showLabel: 'Show', filterOpen: 'Needs input', filterDefaults: 'Defaults', filterConfirmed: 'Locked',
    filterChanged: 'Changed', filterAll: 'Everything', fileLabel: 'Private handoff', importAction: 'Import private JSON', jsonAction: 'Download working JSON',
    markdownAction: 'Download working Markdown', copyAction: 'Copy remaining answers', sourceRule: 'Only a final exported FACTS.md may feed later application sessions.',
    remainingKicker: 'Do these now', remainingTitle: 'Remaining answers', emptyTitle: 'Nothing in this view', emptyBody: 'Choose another filter or continue with the final export.',
    finishKicker: 'Final gate', finishTitle: 'FACTS.md unlocks at zero open items', finishBody: 'Finish every required answer. Proposed defaults do not become facts until you accept them.',
    finalAction: 'Download final FACTS.md', footerRule: 'No passwords, ID numbers, scans, or signatures belong in this editor.',
    change: 'Change', acceptDefault: 'Accept default', other: 'Other — write my answer', saveLock: 'Save & lock', cancel: 'Cancel',
    customLabel: 'Your exact answer', customPlaceholder: 'Write the exact answer. Use N/A or None when true.', privateEditNote: 'This answer stays local unless you download it.',
    fixedStatus: 'Fixed', confirmedStatus: 'Confirmed · locked', proposedStatus: 'Default · not confirmed', needsStatus: '[NEEDS INPUT]', holdStatus: 'HOLD', changedStatus: 'Changed · unconfirmed',
    publicCv: 'CV-safe', regionalCv: 'Regional CV', formOnly: 'Form only', internalPolicy: 'Policy',
    items: 'items', item: 'item', savedAt: 'Saved locally at', sessionChanged: 'Session changed · download before closing',
    remembered: 'Remembered on this device', rememberOff: 'Local copy cleared; session only', importOk: 'Private JSON imported', importBad: 'Import refused: invalid or unsupported file',
    downloadedJson: 'Working JSON downloaded', downloadedMarkdown: 'Working Markdown downloaded', copied: 'Working Markdown copied', copyFailed: 'Copy failed; download the Markdown instead.',
    answerRequired: 'Choose an answer or write an exact value before locking.', finalBlockedTitle: 'Final export is still locked', finalBlockedBody: 'Required items remain open or proposed. Finish them before generating FACTS.md.',
    finalReady: 'All required facts are confirmed. FACTS.md is ready.', filterTitles: { open: ['Do these now', 'Remaining answers'], proposed: ['One tap if correct', 'Defaults to confirm'], confirmed: ['Read-only until changed', 'Locked facts'], changed: ['Review your decisions', 'Changed answers'], all: ['Full campaign record', 'Every fact'] },
  },
  ar: {
    headerSubtitle: 'حقائق حملة التقديم', languageButton: 'English', eyebrow: 'حملة 500 طلب · 0 مُرسل',
    title: 'قفل حقائق سيرتك', lede: 'أجب عن العناصر المتبقية مرة واحدة. تبقى الإجابات المؤكدة مقفلة، واختر «أخرى» عندما لا يناسبك الافتراض.',
    privacyTitle: 'إجاباتك لا تغادر هذه الصفحة', privacyBody: 'يستضيف GitHub المحرر الفارغ والحقائق الآمنة المؤكدة فقط. تبقى الإجابات الجديدة في هذه الجلسة إلا إذا اخترت حفظها على هذا الجهاز أو نزّلت ملفاً خاصاً. لا يوجد زر إرسال أو تحليلات أو رمز حساب أو خادم.',
    privateState: 'وضع خاص', progressKicker: 'مسار الحقيقة', progressTitle: 'جاهزية الحملة', confirmed: 'مؤكد', proposed: 'افتراضات',
    needsInput: 'يحتاج إدخالاً', changed: 'تغيّر', rememberTitle: 'تذكر على هذا الجهاز', rememberHelp: 'مغلق افتراضياً لحماية بيانات الراتب والتأشيرة والنماذج.',
    sessionOnly: 'هذه الجلسة فقط · نزّل الملف قبل الإغلاق', showLabel: 'عرض', filterOpen: 'يحتاج إدخالاً', filterDefaults: 'الافتراضات', filterConfirmed: 'المقفلة',
    filterChanged: 'المتغيرة', filterAll: 'الكل', fileLabel: 'تسليم خاص', importAction: 'استيراد JSON خاص', jsonAction: 'تنزيل JSON للعمل',
    markdownAction: 'تنزيل Markdown للعمل', copyAction: 'نسخ الإجابات المتبقية', sourceRule: 'ملف FACTS.md النهائي المُصدّر وحده يسمح بتغذية جلسات التقديم اللاحقة.',
    remainingKicker: 'نفّذ هذه الآن', remainingTitle: 'الإجابات المتبقية', emptyTitle: 'لا يوجد شيء في هذا العرض', emptyBody: 'اختر مرشحاً آخر أو انتقل إلى التصدير النهائي.',
    finishKicker: 'البوابة النهائية', finishTitle: 'يفتح FACTS.md عند وصول العناصر المفتوحة إلى صفر', finishBody: 'أكمل كل إجابة مطلوبة. لا تصبح الافتراضات حقائق حتى تقبلها.',
    finalAction: 'تنزيل FACTS.md النهائي', footerRule: 'لا مكان لكلمات المرور أو أرقام الهوية أو الصور أو التوقيعات في هذا المحرر.',
    change: 'تغيير', acceptDefault: 'قبول الافتراض', other: 'أخرى — اكتب إجابتي', saveLock: 'حفظ وقفل', cancel: 'إلغاء',
    customLabel: 'إجابتك الدقيقة', customPlaceholder: 'اكتب الإجابة الدقيقة. استخدم لا ينطبق أو لا يوجد عندما يكون ذلك صحيحاً.', privateEditNote: 'تبقى هذه الإجابة محلية ما لم تنزّلها.',
    fixedStatus: 'ثابت', confirmedStatus: 'مؤكد · مقفل', proposedStatus: 'افتراض · غير مؤكد', needsStatus: '[يحتاج إدخالاً]', holdStatus: 'موقوف', changedStatus: 'متغيّر · غير مؤكد',
    publicCv: 'آمن للسيرة', regionalCv: 'سيرة إقليمية', formOnly: 'للنماذج فقط', internalPolicy: 'سياسة',
    items: 'عناصر', item: 'عنصر', savedAt: 'حُفظ محلياً في', sessionChanged: 'تغيّرت الجلسة · نزّل الملف قبل الإغلاق',
    remembered: 'يُحفظ على هذا الجهاز', rememberOff: 'حُذفت النسخة المحلية؛ الجلسة فقط', importOk: 'تم استيراد JSON الخاص', importBad: 'رُفض الاستيراد: الملف غير صالح أو غير مدعوم',
    downloadedJson: 'تم تنزيل JSON للعمل', downloadedMarkdown: 'تم تنزيل Markdown للعمل', copied: 'تم نسخ Markdown للعمل', copyFailed: 'تعذر النسخ؛ نزّل ملف Markdown بدلاً منه.',
    answerRequired: 'اختر إجابة أو اكتب قيمة دقيقة قبل القفل.', finalBlockedTitle: 'التصدير النهائي ما زال مقفلاً', finalBlockedBody: 'ما زالت عناصر مطلوبة مفتوحة أو مجرد افتراضات. أكملها قبل إنشاء FACTS.md.',
    finalReady: 'كل الحقائق المطلوبة مؤكدة. ملف FACTS.md جاهز.', filterTitles: { open: ['نفّذ هذه الآن', 'الإجابات المتبقية'], proposed: ['نقرة واحدة إن كان صحيحاً', 'افتراضات تحتاج تأكيداً'], confirmed: ['للقراءة حتى التغيير', 'الحقائق المقفلة'], changed: ['راجع قراراتك', 'الإجابات المتغيرة'], all: ['السجل الكامل للحملة', 'كل الحقائق'] },
  },
};

const state = {
  language: 'en',
  filter: 'open',
  remember: false,
  facts: facts.map((fact) => ({
    ...fact,
    value: fact.value ?? '',
    selectedChoice: fact.prefill ? OTHER : '',
    draft: fact.prefill ?? '',
    editorOpen: fact.status === 'needs_input' || fact.status === 'hold',
    changed: false,
    history: [],
  })),
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const t = (key) => ui[state.language][key];
const localized = (value) => typeof value === 'string' ? value : value[state.language];

const create = (tag, className, content) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = content;
  return element;
};

const statusGroup = (fact) => {
  if (fact.editorOpen && fact.status === 'confirmed') return 'confirmed';
  if (fact.status === 'fixed' || fact.status === 'confirmed') return 'confirmed';
  if (fact.status === 'proposed') return 'proposed';
  return 'open';
};

const statusLabel = (fact) => {
  if (fact.changed && fact.editorOpen) return t('changedStatus');
  if (fact.status === 'fixed') return t('fixedStatus');
  if (fact.status === 'confirmed') return t('confirmedStatus');
  if (fact.status === 'proposed') return t('proposedStatus');
  if (fact.status === 'hold') return t('holdStatus');
  return t('needsStatus');
};

const visibilityLabel = (visibility) => ({
  public_cv: t('publicCv'),
  regional_cv: t('regionalCv'),
  form_only: t('formOnly'),
  internal_policy: t('internalPolicy'),
}[visibility] ?? visibility);

const getCounts = () => {
  const hasEmbeddedOpen = (fact) => /\[NEEDS INPUT(?::[^\]]*)?\]/i.test(String(fact.value ?? ''));
  const confirmed = state.facts.filter((fact) => (fact.status === 'fixed' || fact.status === 'confirmed') && !hasEmbeddedOpen(fact)).length;
  const proposed = state.facts.filter((fact) => fact.status === 'proposed').length;
  const open = state.facts.filter((fact) => fact.status === 'needs_input' || fact.status === 'hold').length;
  const changed = state.facts.filter((fact) => fact.changed).length;
  const required = state.facts.filter((fact) => fact.required);
  const embeddedOpen = state.facts.filter((fact) => (fact.status === 'fixed' || fact.status === 'confirmed') && hasEmbeddedOpen(fact)).length;
  const completeRequired = required.filter((fact) => (fact.status === 'fixed' || fact.status === 'confirmed') && !hasEmbeddedOpen(fact)).length;
  return { confirmed, proposed, open, embeddedOpen, changed, total: state.facts.length, required: required.length, completeRequired };
};

const isVisible = (fact) => {
  if (state.filter === 'all') return true;
  if (state.filter === 'changed') return fact.changed;
  return statusGroup(fact) === state.filter;
};

const optionAnswer = (fact) => {
  if (fact.selectedChoice === OTHER) return fact.draft.trim();
  const selected = (fact.choices ?? []).find((item) => item.value === fact.selectedChoice);
  return selected?.answer ?? '';
};

const answerIsValid = (fact) => {
  const answer = optionAnswer(fact).trim();
  return answer.length > 0 && !/\[NEEDS INPUT(?::[^\]]*)?\]/i.test(answer);
};

const formatValue = (fact) => {
  if (fact.status === 'proposed') return fact.suggested;
  if (fact.value) return fact.value;
  return '[NEEDS INPUT]';
};

const renderEditor = (fact, card) => {
  const editor = create('div', 'editor');
  editor.id = `editor-${fact.id.replaceAll('.', '-')}`;

  const choiceGrid = create('div', 'choice-grid');
  choiceGrid.setAttribute('role', 'radiogroup');
  choiceGrid.setAttribute('aria-label', localized(fact.label));

  const options = [...(fact.choices ?? []), choice(OTHER, t('other'), t('other'))];
  for (const option of options) {
    const label = create('label', 'choice-label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `choice-${fact.id}`;
    input.value = option.value;
    input.checked = fact.selectedChoice === option.value;
    if (option.value === OTHER) input.dataset.action = 'choose-other';
    input.addEventListener('change', () => {
      fact.selectedChoice = option.value;
      if (option.value !== OTHER) fact.draft = '';
      renderFacts();
      requestAnimationFrame(() => {
        const nextCard = document.querySelector(`[data-field-id="${fact.id}"]`);
        const target = option.value === OTHER ? $('[data-role="other-input"]', nextCard) : $('[data-action="save-lock"]', nextCard);
        target?.focus();
      });
    });
    label.append(input, create('span', '', localized(option.label)));
    choiceGrid.append(label);
  }
  editor.append(choiceGrid);

  if (fact.selectedChoice === OTHER) {
    const otherEditor = create('div', 'other-editor');
    const inputId = `other-${fact.id.replaceAll('.', '-')}`;
    const label = create('label', '', t('customLabel'));
    label.htmlFor = inputId;
    const input = document.createElement(fact.multiline ? 'textarea' : 'input');
    input.id = inputId;
    input.dataset.role = 'other-input';
    if (!fact.multiline) input.type = 'text';
    input.maxLength = fact.multiline ? 8000 : 2000;
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = t('customPlaceholder');
    input.value = fact.draft;
    input.addEventListener('input', () => {
      fact.draft = input.value;
      const save = $('[data-action="save-lock"]', card);
      if (save) save.disabled = !answerIsValid(fact);
      markSessionChanged();
    });
    otherEditor.append(label, input);
    editor.append(otherEditor);
  }

  const footer = create('div', 'editor-footer');
  footer.append(create('p', 'editor-note', t('privateEditNote')));
  const actions = create('div', 'fact-actions');
  const cancel = create('button', 'small-button', t('cancel'));
  cancel.type = 'button';
  cancel.dataset.action = 'cancel';
  cancel.addEventListener('click', () => {
    if (fact.status === 'needs_input' || fact.status === 'hold') {
      fact.selectedChoice = '';
      fact.draft = '';
    } else {
      fact.editorOpen = false;
      fact.selectedChoice = '';
      fact.draft = '';
    }
    renderFacts();
  });

  const save = create('button', 'primary-button', t('saveLock'));
  save.type = 'button';
  save.dataset.action = 'save-lock';
  save.disabled = !answerIsValid(fact);
  save.addEventListener('click', () => saveAndLock(fact));
  actions.append(cancel, save);
  footer.append(actions);
  editor.append(footer);
  card.append(editor);
};

const renderCard = (fact) => {
  const card = create('article', 'fact-card');
  card.dataset.fieldId = fact.id;
  card.dataset.status = fact.status;
  card.dataset.changed = String(fact.changed);

  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  const header = create('span', 'fact-header');
  const titleWrap = create('span', 'fact-title-wrap');
  titleWrap.append(create('span', 'fact-section', localized(sections[fact.section])), create('span', 'fact-title', localized(fact.label)));
  const badges = create('span', 'badge-stack');
  badges.append(create('span', 'status-badge', statusLabel(fact)), create('span', 'visibility-badge', visibilityLabel(fact.visibility)));
  header.append(titleWrap, badges);
  legend.append(header);
  fieldset.append(legend);

  const help = create('p', 'fact-help', localized(fact.help));
  help.id = `help-${fact.id.replaceAll('.', '-')}`;
  fieldset.append(help);

  const showEditor = fact.editorOpen || fact.status === 'needs_input' || fact.status === 'hold';
  if (!showEditor) {
    const row = create('div', 'value-row');
    row.append(create('div', 'value-summary', formatValue(fact)));
    const actions = create('div', 'fact-actions');
    if (fact.status === 'proposed') {
      const accept = create('button', 'small-button accept', t('acceptDefault'));
      accept.type = 'button';
      accept.dataset.action = 'accept-default';
      accept.addEventListener('click', () => acceptDefault(fact));
      const other = create('button', 'small-button other', t('other'));
      other.type = 'button';
      other.dataset.action = 'choose-other';
      other.addEventListener('click', () => openEditor(fact));
      actions.append(accept, other);
    } else if (fact.status === 'confirmed') {
      const change = create('button', 'small-button', t('change'));
      change.type = 'button';
      change.dataset.action = 'change';
      change.setAttribute('aria-expanded', 'false');
      change.setAttribute('aria-controls', `editor-${fact.id.replaceAll('.', '-')}`);
      change.addEventListener('click', () => openEditor(fact));
      actions.append(change);
    }
    row.append(actions);
    fieldset.append(row);
  }

  card.append(fieldset);
  if (showEditor) renderEditor(fact, fieldset);
  return card;
};

const renderFacts = () => {
  const list = $('#facts-list');
  list.replaceChildren();
  const visible = state.facts.filter(isVisible);
  const order = { needs_input: 0, hold: 0, proposed: 1, confirmed: 2, fixed: 3 };
  visible.sort((a, b) => (order[a.status] - order[b.status]) || a.section.localeCompare(b.section));
  for (const fact of visible) list.append(renderCard(fact));
  $('#empty-state').hidden = visible.length > 0;
  $('#visible-count').textContent = `${visible.length} ${visible.length === 1 ? t('item') : t('items')}`;
  updateCounts();
};

const updateCounts = () => {
  const counts = getCounts();
  $('#count-confirmed').textContent = counts.confirmed;
  $('#count-proposed').textContent = counts.proposed;
  $('#count-open').textContent = counts.open;
  $('#count-changed').textContent = counts.changed;
  $('#filter-open-count').textContent = counts.open;
  $('#filter-proposed-count').textContent = counts.proposed;
  $('#filter-confirmed-count').textContent = counts.confirmed;
  $('#filter-changed-count').textContent = counts.changed;
  $('#filter-all-count').textContent = counts.total;

  const percent = Math.round((counts.completeRequired / Math.max(counts.required, 1)) * 100);
  $('#progress-percent').textContent = `${percent}%`;
  $('#rail-confirmed').style.width = `${(counts.confirmed / counts.total) * 100}%`;
  $('#rail-proposed').style.width = `${(counts.proposed / counts.total) * 100}%`;
  $('#rail-open').style.width = `${(counts.open / counts.total) * 100}%`;

  const finalReady = counts.open === 0 && counts.proposed === 0 && counts.embeddedOpen === 0;
  $('#final-export').disabled = !finalReady;
  $('#finish-copy').textContent = finalReady ? t('finalReady') : t('finishBody');
};

const openEditor = (fact) => {
  fact.editorOpen = true;
  fact.selectedChoice = OTHER;
  fact.draft = fact.status === 'confirmed' ? String(fact.value ?? '') : '';
  if (fact.status === 'confirmed') fact.changed = true;
  renderFacts();
  requestAnimationFrame(() => $('[data-role="other-input"]', document.querySelector(`[data-field-id="${fact.id}"]`))?.focus());
};

const saveAndLock = (fact) => {
  const answer = optionAnswer(fact).trim();
  if (!answer) {
    showError(t('answerRequired'));
    return;
  }
  fact.history.push({ at: new Date().toISOString(), fromStatus: fact.status, previousValue: fact.value || null });
  fact.value = answer;
  fact.status = 'confirmed';
  fact.locked = true;
  fact.editorOpen = false;
  fact.selectedChoice = '';
  fact.draft = '';
  fact.changed = true;
  clearError();
  markSessionChanged();
  renderFacts();
};

const acceptDefault = (fact) => {
  fact.history.push({ at: new Date().toISOString(), fromStatus: fact.status, previousValue: null });
  fact.value = fact.suggested;
  fact.status = 'confirmed';
  fact.locked = true;
  fact.editorOpen = false;
  fact.changed = true;
  markSessionChanged();
  renderFacts();
};

const showError = (message) => {
  const summary = $('#error-summary');
  summary.replaceChildren(create('h2', '', t('finalBlockedTitle')), create('p', '', message));
  summary.hidden = false;
  summary.focus();
};

const clearError = () => {
  const summary = $('#error-summary');
  summary.hidden = true;
  summary.replaceChildren();
};

let toastTimer;
const toast = (message) => {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => element.classList.remove('is-visible'), 2400);
};

const serializableState = () => ({
  schema: 'mohamed-cv-facts',
  templateRevision: TEMPLATE_REVISION,
  exportedAt: new Date().toISOString(),
  facts: Object.fromEntries(state.facts.map((fact) => [fact.id, {
    value: fact.value,
    status: fact.status,
    locked: fact.locked,
    required: fact.required,
    visibility: fact.visibility,
    changed: fact.changed,
    history: fact.history,
  }])),
});

const persist = () => {
  if (!state.remember) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState()));
    localStorage.setItem(STORAGE_PREF_KEY, 'yes');
    const time = new Intl.DateTimeFormat(state.language, { hour: '2-digit', minute: '2-digit' }).format(new Date());
    $('#save-state').textContent = `${t('savedAt')} ${time}`;
  } catch {
    state.remember = false;
    $('#remember-device').checked = false;
    $('#save-state').textContent = t('sessionChanged');
  }
};

const markSessionChanged = () => {
  if (state.remember) persist();
  else $('#save-state').textContent = t('sessionChanged');
};

const applyImported = (payload) => {
  if (!payload || payload.schema !== 'mohamed-cv-facts' || typeof payload.facts !== 'object' || payload.facts === null) {
    throw new Error('invalid schema');
  }
  const allowedStatuses = new Set(['fixed', 'confirmed', 'proposed', 'needs_input', 'hold']);
  for (const fact of state.facts) {
    const incoming = payload.facts[fact.id];
    if (!incoming || fact.status === 'fixed') continue;
    if (!allowedStatuses.has(incoming.status)) throw new Error('invalid status');
    if (typeof incoming.value !== 'string' || incoming.value.length > 10000) throw new Error('invalid value');
    fact.value = incoming.value;
    fact.status = incoming.status;
    fact.locked = Boolean(incoming.locked);
    fact.changed = Boolean(incoming.changed);
    fact.history = Array.isArray(incoming.history) ? incoming.history.slice(-50) : [];
    fact.editorOpen = fact.status === 'needs_input' || fact.status === 'hold';
    fact.selectedChoice = '';
    fact.draft = '';
  }
  markSessionChanged();
  renderFacts();
};

const loadRemembered = () => {
  try {
    if (localStorage.getItem(STORAGE_PREF_KEY) !== 'yes') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    state.remember = true;
    $('#remember-device').checked = true;
    applyImported(JSON.parse(saved));
    $('#save-state').textContent = t('remembered');
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_PREF_KEY);
    state.remember = false;
  }
};

const markdownEscape = (value) => String(value).replaceAll('\\', '\\\\').replaceAll('|', '\\|');

const buildMarkdown = (final = false) => {
  const counts = getCounts();
  const blockedEmployerAddress = ['contact', 'medmack.com'].join('@');
  const lines = [
    '# FACTS.md',
    '',
    `- Schema revision: ${TEMPLATE_REVISION}`,
    `- Exported: ${new Date().toISOString()}`,
    '- Campaign state: 0 applications submitted at intake creation.',
    '',
    '## Absolute identity and confidentiality rules',
    '',
    '- Every application, CV, signup, applicant account, and recruiter contact uses **medo433447@gmail.com only**.',
    `- The employer address **${blockedEmployerAddress}** and every employer account are forbidden on applications, CVs, signups, and recruiter contact.`,
    '- Personal work is branded **Mohamed Mahmoud**. Medmac is the current employer only.',
    '- Never apply to Medmac or any confirmed affiliate. HOLD suspected affiliates for review.',
    '- Current employer must not be contacted without explicit job-specific permission.',
    '- No fact may be invented. An unforeseen mandatory field becomes `[NEEDS INPUT]` and HOLDS the application.',
    '- Private-project descriptions must stay sanitized; never disclose source code, credentials, client/vendor records, prices, or operational data.',
    '',
  ];

  for (const [sectionId, sectionLabel] of Object.entries(sections)) {
    lines.push(`## ${sectionLabel.en}`, '');
    for (const fact of state.facts.filter((item) => item.section === sectionId)) {
      const confirmed = fact.status === 'fixed' || fact.status === 'confirmed';
      const value = confirmed ? markdownEscape(fact.value) : '[NEEDS INPUT]';
      lines.push(`- **${fact.label.en}:** ${value}`);
    }
    lines.push('');
  }

  lines.push('## Finalization gate', '');
  lines.push(`- Confirmed/fixed: ${counts.confirmed}`);
  lines.push(`- Proposed defaults still unconfirmed: ${counts.proposed}`);
  lines.push(`- [NEEDS INPUT]/HOLD: ${counts.open}`);
  lines.push(`- Finalized: ${final && counts.open === 0 && counts.proposed === 0 ? 'YES' : 'NO'}`);
  lines.push('');
  return lines.join('\n');
};

const download = (filename, content, mime) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const translatePage = () => {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
  for (const element of $$('[data-i18n]')) {
    const key = element.dataset.i18n;
    if (ui[state.language][key]) element.textContent = ui[state.language][key];
  }
  const toggle = $('#language-toggle');
  toggle.setAttribute('aria-label', state.language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية');
  const titles = t('filterTitles')[state.filter];
  $('#list-kicker').textContent = titles[0];
  $('#list-title').textContent = titles[1];
  if (!state.remember) $('#save-state').textContent = t('sessionOnly');
  renderFacts();
};

const changeFilter = (filter) => {
  state.filter = filter;
  for (const button of $$('[data-filter]')) {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  const titles = t('filterTitles')[filter];
  $('#list-kicker').textContent = titles[0];
  $('#list-title').textContent = titles[1];
  clearError();
  renderFacts();
};

$('#language-toggle').addEventListener('click', () => {
  state.language = state.language === 'en' ? 'ar' : 'en';
  translatePage();
});

for (const button of $$('[data-filter]')) button.addEventListener('click', () => changeFilter(button.dataset.filter));

$('#remember-device').addEventListener('change', (event) => {
  state.remember = event.currentTarget.checked;
  if (state.remember) {
    persist();
    toast(t('remembered'));
  } else {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_PREF_KEY);
    } catch {
      // Storage may be unavailable; the state is already session-only.
    }
    $('#save-state').textContent = t('sessionOnly');
    toast(t('rememberOff'));
  }
});

$('#import-json').addEventListener('change', async (event) => {
  const file = event.currentTarget.files?.[0];
  event.currentTarget.value = '';
  if (!file || file.size > 2_000_000) {
    toast(t('importBad'));
    return;
  }
  try {
    applyImported(JSON.parse(await file.text()));
    toast(t('importOk'));
  } catch {
    toast(t('importBad'));
  }
});

$('#export-json').addEventListener('click', () => {
  download('MOHAMED_CV_FACTS_WORKING.json', JSON.stringify(serializableState(), null, 2), 'application/json;charset=utf-8');
  toast(t('downloadedJson'));
});

$('#export-markdown').addEventListener('click', () => {
  download('MOHAMED_CV_FACTS_WORKING.md', buildMarkdown(false), 'text/markdown;charset=utf-8');
  toast(t('downloadedMarkdown'));
});

$('#copy-markdown').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(buildMarkdown(false));
    toast(t('copied'));
  } catch {
    toast(t('copyFailed'));
  }
});

$('#final-export').addEventListener('click', () => {
  const counts = getCounts();
  if (counts.open > 0 || counts.proposed > 0 || counts.embeddedOpen > 0) {
    showError(t('finalBlockedBody'));
    return;
  }
  download('FACTS.md', buildMarkdown(true), 'text/markdown;charset=utf-8');
});

$('#facts-form').addEventListener('submit', (event) => event.preventDefault());

window.addEventListener('beforeunload', (event) => {
  if (!state.remember && state.facts.some((fact) => fact.changed)) {
    event.preventDefault();
    event.returnValue = '';
  }
});

translatePage();
loadRemembered();
changeFilter('open');
