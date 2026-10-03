(() => {
  'use strict';

  const translations = {
    skip: 'انتقل إلى القصة', home: 'الرئيسية — Reclaim', nav: 'التنقل الرئيسي',
    portfolio: 'معرض الأعمال', eyebrow: 'قصة المساحة وما يستحق البقاء',
    titleOne: 'قليل من الضوء.', titleTwo: 'قرص أخف.',
    intro: 'اعرف ما يملأ قرصك. قرر ما يستحق البقاء. وافسح مساحة مع Reclaim.',
    watch: 'شاهد الفيلم', read: 'اقلب الصفحات', filmTitle: 'القرص الثقيل',
    filmFormat: 'حكاية ورقية في تسعة فصول', scroll: 'مرّر الصفحة واتبع الضوء',
    chapterCount: 'تسعة فصول · وقرص أخف', story: 'فصول حكاية Reclaim التسعة',
    heroArt: 'كتاب ورقي مفتوح في غابة داكنة', heroAlt: 'تبدأ حكاية القرص الثقيل داخل كتاب مصنوع من طبقات الورق.',
    c0Label: 'البداية', c0Title: 'يمكن لقرص واحد أن يحمل عالمًا كاملًا.',
    c0Body: 'مشروعات وصور وأشياء صغيرة تحتفظ بها لوقت لاحق. حتى لا تبقى مساحة لما يأتي بعدها.',
    c0Alt: 'يفتح حارس ورقي حكاية قرص مزدحم.',
    c1Label: 'الثقل', c1Title: 'ابدأ بفهم هذا الثقل.',
    c1Body: 'القرص الممتلئ سؤال قبل أن يكون مهمة. يساعدك Reclaim على رؤية ما يشغل المساحة.',
    c1Alt: 'يحمل الحارس قرصًا ثقيلًا عبر الغابة الورقية.',
    c2Label: 'الفانوس', c2Title: 'قليل من الضوء يكشف المزيد.',
    c2Body: 'في Windows، يمكن للفحص بصلاحية المسؤول قراءة جدول الملفات الرئيسي MFT. ويتوفر فحص المجلدات عندما يتعذر ذلك.',
    c2Alt: 'يكشف فانوس بلون النعناع محتويات القرص.',
    c3Label: 'السجل', c3Title: 'اقرأ سجل القرص.',
    c3Body: 'تمنحك رؤية أوضح للملفات والمجلدات نقطة بداية لكل قرار.',
    c3Alt: 'يكشف السجل الورقي خريطة ملفات القرص.',
    c4Label: 'الأشياء الأثقل', c4Title: 'اعثر على الأشياء الأثقل.',
    c4Body: 'شاهد أكبر الملفات أينما كانت على القرص، أو تصفح شجرة المجلدات. وافتح مكان الملف في مجلده لتعرف أين ينتمي.',
    c4Alt: 'يعثر الحارس على أكبر الملفات ويتصفح المجلدات.',
    windowsNote: 'التنظيف الذكي متاح على Windows.',
    c5Label: 'المسارات الثلاثة', c5Title: 'احتفظ بما يهمك.',
    c5Body: 'تبقى نسخة محفوظة من الملفات المكررة المتحقق منها. وتبقى المصادر عند إزالة الملفات التي يمكن إعادة بنائها. أما العمل القديم، فالقرار لك بعد مراجعته.',
    c5Alt: 'تفصل ثلاثة مسارات ورقية الملفات المكررة والملفات القابلة لإعادة البناء والعمل القديم لمراجعتها.',
    c6Label: 'الختم', c6Title: 'قرارك يستحق مراجعة أخرى.',
    c6Body: 'راجع الخطة قبل ختمها. يتحقق Reclaim مرة أخرى قبل التنظيف، ويحتفظ بالملفات التي تغيرت.',
    c6Alt: 'يراجع الحارس خطة التنظيف ويختمها قبل إعادة التحقق منها.',
    deleteNote: 'التنظيف المُدار يحذف الملفات التي توافق عليها حذفًا نهائيًا.',
    c7Label: 'الذاكرة', c7Title: 'اترك سجلًا واضحًا.',
    c7Body: 'يساعدك سجل العمليات وعرض «ما الذي تغير» على تتبع العمل. تبدأ القواعد معطّلة، وتقترح فقط قرارات لاحقة لمراجعتها بنفسك.',
    c7Alt: 'يتذكر السجل ما تغير، وتكون قواعد الاقتراح معطلة افتراضيًا.',
    c8Label: 'الفجر', c8Title: 'مساحة لفصل جديد.',
    c8Body: 'قرص أخف. وأشياء تستحق البقاء. ومساحة إضافية لتبدأ من جديد.',
    c8Alt: 'تضيء الغابة الورقية حين يصل الحارس إلى الفجر ومعه قرص أخف.',
    watchFull: 'شاهد الحكاية كاملة', filmEyebrow: 'خذ لحظة لمشاهدة الحكاية',
    filmDetail: '٩٠ ثانية. تسعة فصول. موسيقى أصلية وقليل من ضوء النعناع.',
    player: 'القرص الثقيل، فيلم Reclaim كاملًا باللغة الإنجليزية ومدته ٩٠ ثانية',
    filmLanguage: 'نصوص على الشاشة بالإنجليزية · موسيقى · بلا حوار صوتي',
    videoFallback: 'لا يستطيع متصفحك تشغيل هذا الفيديو.', downloadFilm: 'تنزيل الفيلم',
    closingEyebrow: 'مساحتك. قرارك.', closingTitle: 'افسح مساحة لما يهمك.',
    preview: 'استكشف المعاينة التفاعلية', caseStudy: 'شاهد المشروع في معرض الأعمال',
    previewNote: 'تستخدم معاينة المتصفح ملفات تجريبية. أما تطبيق سطح المكتب فيعمل مع قرصك.',
    backTop: 'عد إلى البداية ↑'
  };

  const isArabic = new URLSearchParams(window.location.search).get('lang') === 'ar';
  if (isArabic) {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.title = 'Reclaim — القرص الثقيل';
    document.querySelectorAll('[data-copy]').forEach((element) => {
      const text = translations[element.dataset.copy];
      if (text) element.textContent = text;
    });
    document.querySelectorAll('[data-label]').forEach((element) => {
      const text = translations[element.dataset.label];
      if (text) element.setAttribute('aria-label', text);
    });
    document.querySelectorAll('[data-alt]').forEach((element) => {
      const text = translations[element.dataset.alt];
      if (text) element.alt = text;
    });
    document.querySelectorAll('[data-portfolio]').forEach((element) => {
      element.href = '../ar/work/reclaim';
    });
    const switchLink = document.querySelector('[data-language]');
    switchLink.textContent = 'English';
    switchLink.lang = 'en';
    switchLink.hreflang = 'en';
    switchLink.href = '?lang=en';
    document.querySelector('.duration').textContent = '٩٠ ث';
  }

  const story = document.querySelector('.story');
  const chapters = Array.from(document.querySelectorAll('[data-chapter]'));
  const images = Array.from(document.querySelectorAll('.scene-image'));
  const number = document.querySelector('[data-page-number]');
  const hero = document.querySelector('.hero');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentChapter = -1;
  let scheduled = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function update() {
    scheduled = false;
    if (motionQuery.matches) return;
    const viewport = window.innerHeight;
    const small = window.innerWidth <= 700;
    const focalPoint = viewport * (small ? 0.70 : 0.50);
    let nearest = 0;
    let closestDistance = Infinity;
    let local = 0;

    chapters.forEach((chapter, index) => {
      const bounds = chapter.getBoundingClientRect();
      const centre = bounds.top + bounds.height / 2;
      const distance = Math.abs(centre - focalPoint);
      if (distance < closestDistance) {
        closestDistance = distance;
        nearest = index;
        local = clamp((focalPoint - centre) / (bounds.height / 2), -1, 1);
      }
    });

    if (nearest !== currentChapter) {
      images.forEach((image, index) => {
        image.classList.toggle('is-active', index === nearest);
        if (Math.abs(index - nearest) <= 1) image.loading = 'eager';
      });
      number.textContent = String(nearest + 1).padStart(2, '0');
      currentChapter = nearest;
    }
    story.style.setProperty('--local-progress', local.toFixed(4));
    const storyBounds = story.getBoundingClientRect();
    const total = clamp(-storyBounds.top / Math.max(1, storyBounds.height - viewport), 0, 1);
    story.style.setProperty('--story-progress', total.toFixed(4));
    const heroBounds = hero.getBoundingClientRect();
    hero.style.setProperty('--hero-progress', clamp(-heroBounds.top / viewport, 0, 1).toFixed(4));
  }

  function schedule() {
    if (!scheduled && !motionQuery.matches) {
      scheduled = true;
      window.requestAnimationFrame(update);
    }
  }

  function setMotionMode() {
    story.classList.toggle('is-enhanced', !motionQuery.matches);
    if (motionQuery.matches) {
      story.style.removeProperty('--local-progress');
      hero.style.removeProperty('--hero-progress');
    } else {
      schedule();
    }
  }

  setMotionMode();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', setMotionMode);
  else motionQuery.addListener(setMotionMode);
})();
