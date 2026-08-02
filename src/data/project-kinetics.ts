import type { Localized, ProjectMeta, ProjectStory, StoryVisual } from './projects';

export interface ProjectKineticSpec {
  code: string;
  input: string;
  process: string;
  output: string;
  stages: [Localized, Localized, Localized, Localized];
}

const l = (en: string, ar: string): Localized => ({ en, ar });

export const projectKinetics: Record<string, ProjectKineticSpec> = {
  'career-autopilot': { code: 'APPROVAL', input: 'PROFILE', process: 'MATCH / DRAFT', output: 'HUMAN SEND', stages: [l('Load verified profile', 'تحميل الملف المتحقق'), l('Match and deduplicate', 'المطابقة وإزالة التكرار'), l('Package the draft', 'تجهيز المسودة'), l('Stop for approval', 'التوقف للموافقة')] },
  lifeos: { code: 'LOCAL AI', input: 'PRIVATE FILES', process: 'OLLAMA / CITE', output: 'LOCAL ANSWER', stages: [l('Unlock locally', 'فتح محلي'), l('Retrieve evidence', 'استرجاع الدليل'), l('Reason offline', 'الاستدلال دون اتصال'), l('Cite the source', 'إسناد المصدر')] },
  'medmac-document-studio': { code: 'PDF/X-4', input: 'AR + EN', process: 'ONE MODEL', output: 'PRINT MASTER', stages: [l('Author once', 'تأليف واحد'), l('Compose both scripts', 'تركيب اللغتين'), l('Preflight production', 'فحص الإنتاج'), l('Release print masters', 'إطلاق ملفات الطباعة')] },
  'medmac-box-studio': { code: 'FOLD', input: 'PARAMETERS', process: 'DIELINE / 3D', output: 'BOX SYSTEM', stages: [l('Set dimensions', 'تحديد الأبعاد'), l('Generate the dieline', 'توليد خط القص'), l('Fold the live model', 'طي النموذج الحي'), l('Verify the package', 'تحقق العبوة')] },
  'cake-studio': { code: '3→1', input: 'THREE REPOS', process: 'MERGE / TEST', output: 'ONE STUDIO', stages: [l('Unify the models', 'توحيد النماذج'), l('Join the editors', 'دمج المحررات'), l('Run the production line', 'تشغيل خط الإنتاج'), l('Prove every seam', 'إثبات كل وصلة')] },
  'quotations-locker': { code: 'LAN VAULT', input: 'QUOTE DATA', process: 'WATERMARK / HASH', output: 'LOCKED PDF', stages: [l('Build on the LAN', 'البناء داخل الشبكة'), l('Stamp each viewer', 'وسم كل عارض'), l('Append the audit chain', 'إلحاق سلسلة التدقيق'), l('Lock the evidence', 'قفل الدليل')] },
  reclaim: { code: '$MFT', input: '1.86 TB', process: 'PARSE / INDEX', output: '2.6M FILES', stages: [l('Read the MFT', 'قراءة MFT'), l('Index millions', 'فهرسة الملايين'), l('Sweep in seconds', 'المسح في ثوانٍ'), l('Return recoverable paths', 'إرجاع المسارات القابلة للاستعادة')] },
  'sheep-cycle': { code: 'LP', input: 'FEED + GOALS', process: 'CONSTRAINT SOLVER', output: 'RATION', stages: [l('Load ingredients', 'تحميل المكونات'), l('Bind hard limits', 'تثبيت الحدود الصارمة'), l('Balance nutrition', 'موازنة التغذية'), l('Explain every deficit', 'شرح كل نقص')] },
  'resume-builder-skill': { code: 'A4 FIT', input: 'ONE RECORD', process: '4 LAYOUTS', output: 'EXACT PAGES', stages: [l('Load structured facts', 'تحميل الحقائق المنظمة'), l('Compose four layouts', 'تركيب أربعة تخطيطات'), l('Measure actual pages', 'قياس الصفحات الفعلية'), l('Warn before distortion', 'التحذير قبل التشويه')] },
  'polyblast-arena': { code: '60 HZ', input: 'PLAYER INTENT', process: 'AUTHORITATIVE TICK', output: 'SHARED STATE', stages: [l('Capture intent', 'التقاط النية'), l('Advance authority', 'تقدم السلطة'), l('Publish state', 'نشر الحالة'), l('Verify headlessly', 'تحقق بلا واجهة')] },
  'petpoint-ops-hub': { code: '4 BRANCHES', input: 'POS / WEB / APP', process: 'CANONICAL OPS', output: 'TASKS + ALERTS', stages: [l('Unify order channels', 'توحيد قنوات الطلب'), l('Reconcile every branch', 'مطابقة كل فرع'), l('Forecast the next move', 'توقع الخطوة التالية'), l('Leave scheduled evidence', 'ترك دليل مجدول')] },
  relayops: { code: 'RETRY', input: '4 WORKFLOWS', process: 'SAVEPOINTS / FALLBACK', output: 'EVIDENCE RUN', stages: [l('Compose typed actions', 'تركيب إجراءات محددة'), l('Run with savepoints', 'تشغيل بنقاط حفظ'), l('Retry only the seam', 'إعادة الوصلة فقط'), l('Close the alert', 'إغلاق التنبيه')] },
  'statement-styler': { code: 'OCR→2', input: 'PDF / SCAN', process: 'TABLE RECOVERY', output: 'XLSX + A4', stages: [l('Read text or pixels', 'قراءة النص أو البكسلات'), l('Recover the table', 'استعادة الجدول'), l('Build editable numbers', 'بناء أرقام قابلة للتحرير'), l('Render the reference', 'إخراج المرجع')] },
  'meta-ads': { code: '$0.84', input: '85K IMPRESSIONS', process: 'META → WHATSAPP', output: '206 LEADS', stages: [l('Aim the audience', 'توجيه الجمهور'), l('Run the campaign', 'تشغيل الحملة'), l('Route to WhatsApp', 'التحويل إلى واتساب'), l('Read cost per lead', 'قراءة تكلفة العميل')] },
  'al-maali': { code: '1M+', input: '9.2K', process: 'PUBLISH / LEARN', output: 'AUDIENCE', stages: [l('Build the channel voice', 'بناء صوت القناة'), l('Publish every format', 'نشر كل صيغة'), l('Learn from response', 'التعلم من الاستجابة'), l('Compound the audience', 'مراكمة الجمهور')] },
  crm: { code: '12 TABS', input: 'ADS + WHATSAPP', process: 'STATUS / OWNER', output: 'ENGINEER HANDOFF', stages: [l('Capture the lead', 'التقاط العميل'), l('Assign status and owner', 'تعيين الحالة والمالك'), l('Surface stuck work', 'إظهار العمل العالق'), l('Hand off with context', 'التسليم مع السياق')] },
  'brand-system': { code: '254', input: 'ONE IDENTITY', process: 'CATALOG / VIDEO', output: 'CONTENT ENGINE', stages: [l('Lock the identity', 'تثبيت الهوية'), l('Template the formats', 'قوالب الصيغ'), l('Multiply production', 'مضاعفة الإنتاج'), l('Ship a coherent library', 'إطلاق مكتبة متماسكة')] },
  'sheep-app': { code: '59/59', input: 'FARM RECORDS', process: '15 TABLES / RULES', output: 'DESKTOP APP', stages: [l('Model animal identity', 'نمذجة هوية الحيوان'), l('Keep data offline', 'إبقاء البيانات محلية'), l('Build decision support', 'بناء دعم القرار'), l('Package through CI', 'الحزم عبر CI')] },
  'hr-system': { code: '142→100', input: '3 CHANNELS', process: 'DEDUPE / SCORE', output: 'SHORTLIST', stages: [l('Collect every inbox', 'جمع كل قناة'), l('Parse and deduplicate', 'التحليل وإزالة التكرار'), l('Score on schedule', 'التقييم بجدول'), l('Surface the shortlist', 'إظهار القائمة المختصرة')] },
  'medmac-website': { code: '96–100', input: 'AR + EN', process: 'ASTRO / FACT GATE', output: 'LIVE SITE', stages: [l('Structure both languages', 'هيكلة اللغتين'), l('Build reusable pages', 'بناء صفحات قابلة لإعادة الاستخدام'), l('Hold unverified claims', 'حجب الادعاءات غير المتحققة'), l('Measure production', 'قياس الإنتاج')] },
  'ai-workflow': { code: '23 / 4', input: 'RFQ MEMORY', process: '3 AI TOOLS + HUMAN', output: 'RECOVERED TENDERS', stages: [l('Hold the operating memory', 'حفظ ذاكرة التشغيل'), l('Direct three tools', 'توجيه ثلاث أدوات'), l('Verify every handoff', 'تحقق كل تسليم'), l('Recover live work', 'استعادة العمل الحي')] },
  'my-resume': { code: '3·1·1', input: 'MASTER CV', process: 'DIRECT / REVIEW', output: 'BILINGUAL PROOF', stages: [l('Centralize the evidence', 'مركزة الدليل'), l('Direct the tools', 'توجيه الأدوات'), l('Review the output', 'مراجعة المخرج'), l('Ship in the open', 'الإطلاق علنًا')] },
  'spaceframe-world': { code: 'FEM', input: 'NODES / LOADS', process: 'LU + PCG', output: 'FORCES / IFC', stages: [l('Author the frame', 'إنشاء الهيكل'), l('Apply loads', 'تطبيق الأحمال'), l('Solve and deform', 'الحل والتشوه'), l('Hand off traceable data', 'تسليم بيانات قابلة للتتبع')] },
  b2mh: { code: 'dE 1.41', input: 'SOURCE MAPS', process: 'LAYER TRANSFER', output: 'READBACK', stages: [l('Sample real bindings', 'أخذ الربط الفعلي'), l('Compose by layer', 'التركيب حسب الطبقة'), l('Apply and read back', 'التطبيق والقراءة الراجعة'), l('Measure texture and light', 'قياس الخامة والإضاءة')] },
  artillery3d: { code: 'ARC', input: 'RUNTIME JSON', process: 'SERVER SIM', output: 'COMPLETE MATCH', stages: [l('Label provenance', 'وسم الأصل'), l('Load readable rules', 'تحميل قواعد مقروءة'), l('Own the turn centrally', 'امتلاك الدور مركزيًا'), l('Smoke-test the match', 'اختبار المباراة')] },
  'war-strikes': { code: 'GAS', input: 'DATA + RULES', process: 'ABILITY / QA LAYERS', output: '184 TESTS', stages: [l('Own combat in GAS', 'إدارة القتال بـGAS'), l('Drive content from data', 'قيادة المحتوى بالبيانات'), l('Wire QA into the build', 'ربط QA بالبناء'), l('Label the ground truth', 'وسم الحقيقة')] },
  'uberstrike-restoration': { code: '4→6', input: 'LEGACY CLIENT', process: 'PATCH / BRIDGE', output: 'UNITY 6', stages: [l('Recover the project shape', 'استرجاع شكل المشروع'), l('Repair compatibility', 'إصلاح التوافق'), l('Bridge the service path', 'جسر مسار الخدمة'), l('Record every remaining gap', 'تسجيل كل فجوة')] },
  'cocolani-3d': { code: 'V/I/L', input: 'RECOVERABLE SOURCE', process: 'MINE / LABEL', output: 'SANITIZED WORLD', stages: [l('Mine recoverable behavior', 'استخراج السلوك القابل للاسترجاع'), l('Label confidence', 'وسم الثقة'), l('Build bilingual systems', 'بناء أنظمة ثنائية'), l('Audit the exported world', 'تدقيق العالم المصدر')] },
  'job-apply-engine': { code: 'RECEIPT', input: 'VERIFIED FACTS', process: 'LANE / CONFIRM', output: 'SENT OR STAGED', stages: [l('Load only verified facts', 'تحميل الحقائق المتحققة'), l('Check the execution lane', 'فحص مسار التنفيذ'), l('Require a receipt', 'طلب إيصال'), l('Stage ambiguity honestly', 'تجهيز الغموض بصدق')] },
  'portfolio-design-system': { code: '8 WORLDS', input: 'ONE TRUTH MODEL', process: 'TOKENS / MOTION', output: '30 STORIES', stages: [l('Centralize the content', 'مركزة المحتوى'), l('Tokenize each identity', 'ترميز كل هوية'), l('Match every device', 'مطابقة كل جهاز'), l('Distill the flagship', 'تقطير النسخة الرئيسية')] },
};

const fallbackVisual: Record<string, StoryVisual> = {
  'meta-ads': 'evidence-ledger', 'al-maali': 'theme-engine', crm: 'evidence-ledger',
  'brand-system': 'theme-engine', 'sheep-app': 'encrypted-vault', 'hr-system': 'approval-gate',
  'medmac-website': 'theme-engine', 'ai-workflow': 'approval-gate', 'my-resume': 'theme-engine',
};

const fallbackBoundary: Record<string, Localized> = {
  'meta-ads': l('The figures describe the documented 2026 pilot, not a lifetime commercial outcome.', 'تصف الأرقام تجربة ٢٠٢٦ الموثقة، لا نتيجة تجارية دائمة.'),
  'al-maali': l('Platform counts describe the documented operating period and do not claim sole authorship of the channel.', 'تصف أعداد المنصات فترة التشغيل الموثقة ولا تدّعي التأليف الفردي للقناة.'),
  crm: l('This is a bilingual spreadsheet operating layer, not an ERP.', 'هذه طبقة تشغيل ثنائية اللغة داخل جداول، وليست نظام ERP.'),
  'brand-system': l('File and video totals are approximate production counts; the work is presented as a system, not agency staffing.', 'أعداد الملفات والفيديو تقريبية؛ ويُعرض العمل كنظام إنتاج لا كفريق وكالة.'),
  'sheep-app': l('Tests and builds prove the repository scope; they do not claim field adoption beyond the documented handoff.', 'تثبت الاختبارات والبناء نطاق المستودع ولا تدّعي تبنيًا ميدانيًا خارج التسليم الموثق.'),
  'hr-system': l('The pipeline parses and scores; a human still owns hiring decisions.', 'يحلل المسار ويقيّم؛ ويبقى قرار التوظيف بيد الإنسان.'),
  'medmac-website': l('Lighthouse values come from production runs; unverified company claims remained withheld.', 'تأتي قيم Lighthouse من تشغيلات الإنتاج؛ وبقيت ادعاءات الشركة غير المتحققة محجوبة.'),
  'ai-workflow': l('AI tools prepared and recovered work under human direction; they did not own the decision.', 'جهزت أدوات الذكاء العمل واستعادته تحت توجيه بشري ولم تملك القرار.'),
  'my-resume': l('The site is AI-assisted and human-directed; the evidence and release decisions remain Mohamed’s.', 'الموقع مساعد بالذكاء وموجّه بشريًا؛ وتبقى الأدلة وقرارات الإطلاق لمحمد.'),
};

export function kineticSpecFor(project: ProjectMeta): ProjectKineticSpec {
  return projectKinetics[project.slug] ?? {
    code: project.slug.toUpperCase(), input: 'INPUT', process: 'SYSTEM', output: 'PROOF',
    stages: [l('Map the input', 'رسم المدخل'), l('Build the state', 'بناء الحالة'), l('Control the decision', 'ضبط القرار'), l('Prove the output', 'إثبات المخرج')],
  };
}

export function storyForProject(project: ProjectMeta, lang: 'en' | 'ar' = 'en'): ProjectStory {
  if (project.story) return project.story;
  const spec = kineticSpecFor(project);
  return {
    visual: fallbackVisual[project.slug] ?? 'evidence-ledger',
    ghost: spec.code,
    headline: project.title,
    lead: project.blurb,
    problemKicker: l('The operating input', 'مدخل التشغيل'),
    problemHeading: project.title,
    problemBody: project.blurb,
    stepsKicker: l('The mechanism', 'الآلية'),
    stepsHeading: l('Watch the system move.', 'شاهد النظام يتحرك.'),
    stepsIntro: l('Four factual beats turn the documented input into the documented result.', 'تحول أربع نبضات واقعية المدخل الموثق إلى النتيجة الموثقة.'),
    steps: spec.stages.map((title, index) => ({ n: String(index + 1).padStart(2, '0'), title, body: title })),
    proofKicker: l('Readback', 'القراءة الراجعة'),
    proofHeading: l('The documented result.', 'النتيجة الموثقة.'),
    proofBody: project.statNote,
    proof: [{ value: project.stat[lang], label: { en: project.statNote.en, ar: project.statNote.ar } }],
    boundaryKicker: l('Boundary', 'الحد'),
    boundary: fallbackBoundary[project.slug] ?? project.statNote,
    tools: [],
  };
}
