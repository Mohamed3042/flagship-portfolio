(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const video = $('#scroll-film'), story = $('#film-story'), controls = $('.film-controls');
  const slider = $('#playhead'), timecode = $('#timecode'), sceneLabel = $('#scene-label');
  const loading = $('#load-state'), motionChoice = $('#motion-choice'), dialog = $('#cinema'), sound = $('#sound-film');
  const chapterButtons = [...document.querySelectorAll('[data-time]')];
  const times = [0,3,6,10,14,18,21], duration = 24, lastTime = duration - 1/60;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = matchMedia('(max-aspect-ratio: 4/5)');
  const ar = new URLSearchParams(location.search).get('lang') === 'ar';
  const copy = {
    skip:'انتقل إلى تفاصيل التطبيق', portfolio:'معرض الأعمال', loading:'جارٍ تحميل الفيلم…', scrub:'حرّك الفيلم', chapters:'فصول الفيلم',
    c0:'لك.',c1:'مساحة العمل',c2:'صيغتك',c3:'نقل متوازٍ',c4:'إيقاف واستئناف',c5:'تم الحفظ',c6:'MK Downloader',
    scroll:'مرّر لتحريك الفيلم. عد للأعلى لإرجاعه.',watch:'شاهد مع الصوت ↗',reduced:'تقليل الحركة مفعّل. شغّل الفيلم أو فعّل التحكم بالتمرير.',enable:'فعّل التحكم بالتمرير',
    eyebrow:'روابط عامة. ملفات على جهازك.',title1:'رابط. ملف.',title2:'لك.',lead:'اختر فيديو أو صوتًا. نظّم تنزيلاتك. واحفظ الملفات على جهازك.',
    feature1:'فيديو MP4 وصوت MP3',feature2:'نقل الملفات باتصالات متوازية',feature3:'إيقاف التنزيلات المدعومة واستئنافها',explore:'استكشف MK Downloader ↗',replay:'مرّر الفيلم مجددًا ↑',
    note:'توفّر الصيغ والاتصالات المتوازية والاستئناف يعتمد على المصدر. حركة نقل الملفات في الفيلم توضيحية.',filmLanguage:'فيلم مدته ٢٤ ثانية · نصوص الفيلم بالإنجليزية · موسيقى أصلية',back:'عد إلى معرض الأعمال',filmTitle:'رابط. ملف. لك.',close:'إغلاق ×'
  };
  if(ar){
    document.documentElement.lang='ar';document.documentElement.dir='rtl';document.title='MK Downloader — رابط. ملف. لك.';
    document.querySelectorAll('[data-copy]').forEach(el=>{if(copy[el.dataset.copy])el.textContent=copy[el.dataset.copy]});
    document.querySelectorAll('[data-label]').forEach(el=>{if(copy[el.dataset.label])el.setAttribute('aria-label',copy[el.dataset.label])});
    document.querySelectorAll('[data-portfolio]').forEach(el=>el.href='../ar/#sky');
    const lang=$('[data-language]');lang.textContent='English';lang.href='?lang=en';lang.lang='en';lang.hreflang='en';
    story.setAttribute('aria-label','فيلم MK Downloader بالتمرير');video.setAttribute('aria-label','فيلم MK Downloader مدته ٢٤ ثانية');
  }
  const names = chapterButtons.map(el=>el.textContent.trim());
  let enabled=false,ready=false,target=0,raf=0,format='',loadTimer=0,lastChapter=-1;
  let start=0,distance=0,resizeTimer=0,cinemaScroll=0;
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
  const stamp=t=>`00:${String(Math.floor(t)).padStart(2,'0')}`;
  const currentFormat=()=>portrait.matches?'portrait':'wide';

  function ui(t){
    const n=Math.max(0,times.findLastIndex(time=>t>=time));
    slider.value=String(t);slider.style.setProperty('--progress',`${t/duration*100}%`);
    slider.setAttribute('aria-valuetext',`${stamp(t)} — ${names[n]}`);
    timecode.textContent=`${stamp(t)} / 00:24`;
    if(n!==lastChapter){lastChapter=n;sceneLabel.textContent=`${String(n+1).padStart(2,'0')} / ${names[n]}`;chapterButtons.forEach((b,i)=>i===n?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'))}
  }
  function schedule(){if(!raf&&enabled&&!dialog.open)raf=requestAnimationFrame(seek)}
  function seek(){
    raf=0;if(!enabled||!ready||dialog.open||video.seeking)return;
    const next=clamp(target,0,lastTime);
    if(Math.abs(video.currentTime-next)>1/10000){try{video.currentTime=next}catch{fallback(ar?'تعذّر تحريك الفيلم. استخدم أدوات التشغيل.':'The film could not seek. Use the playback controls.')}}
  }
  function scroll(){if(!enabled)return;target=clamp((window.scrollY-start)/distance)*lastTime;ui(target);schedule()}
  function layout(){
    const progress=distance?clamp((scrollY-start)/distance):0;
    const h=Math.round(window.innerHeight);
    document.documentElement.style.setProperty('--screen-height',`${h}px`);
    document.documentElement.style.setProperty('--scroll-distance',`${Math.max(7200,h*13)}px`);
    start=story.getBoundingClientRect().top+scrollY;distance=Math.max(1,story.offsetHeight-h);
    return progress;
  }
  function source(){
    const next=currentFormat();if(next===format)return;
    format=next;ready=false;loading.hidden=false;loading.dataset.error='false';
    loading.querySelector('span').textContent=ar?copy.loading:'Loading the film…';
    video.poster=`assets/poster-${format}.jpg`;video.src=`assets/scroll-${format}.mp4`;video.load();
    clearTimeout(loadTimer);loadTimer=setTimeout(()=>{if(!ready)fallback(ar?'تحميل الفيلم يستغرق وقتًا. استخدم أدوات التشغيل.':'The film is taking a while to load. Use the playback controls.')},25000);
  }
  function enable(){
    if(enabled)return;enabled=true;document.documentElement.classList.add('scroll-active');motionChoice.hidden=true;controls.hidden=false;
    $('#replay-scroll').hidden=false;video.controls=false;video.muted=true;video.preload='auto';video.setAttribute('playsinline','');video.pause();
    layout();source();scroll();
  }
  function fallback(message){
    const wasEnabled=enabled;enabled=false;ready=false;clearTimeout(loadTimer);cancelAnimationFrame(raf);raf=0;document.documentElement.classList.remove('scroll-active');controls.hidden=true;loading.hidden=true;
    video.controls=true;video.muted=false;video.preload='metadata';format='';
    const f=currentFormat();video.poster=`assets/poster-${f}.jpg`;video.src=`assets/film-${f}.mp4`;video.load();
    motionChoice.hidden=false;motionChoice.querySelector('p').textContent=message|| (ar?copy.reduced:'Reduced motion is on. Play the film, or enable scroll control.');
    if(wasEnabled)window.scrollTo({top:story.offsetTop,behavior:'instant'});
  }
  function jump(t,smooth=true){if(!enabled)enable();window.scrollTo({top:Math.ceil(start+clamp(t/lastTime)*distance),behavior:smooth&&!reduced.matches?'smooth':'instant'})}
  video.addEventListener('loadeddata',()=>{if(!enabled)return;clearTimeout(loadTimer);ready=true;video.pause();loading.hidden=true;scroll()});
  video.addEventListener('seeked',()=>{if(enabled)schedule()});
  video.addEventListener('error',()=>{if(enabled)fallback(ar?'تعذّر تحميل نسخة التمرير. شغّل الفيلم أدناه.':'The scroll version could not load. Play the film below.')});
  video.addEventListener('play',()=>{if(enabled)video.pause()});
  window.addEventListener('scroll',scroll,{passive:true});
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(!enabled)return;const p=distance?clamp((scrollY-start)/distance):0;layout();source();window.scrollTo({top:start+p*distance,behavior:'instant'});scroll()},150)},{passive:true});
  window.addEventListener('pageshow',()=>{if(enabled){layout();scroll()}});
  portrait.addEventListener('change',()=>{if(enabled)source()});
  reduced.addEventListener('change',()=>{if(reduced.matches&&enabled)fallback();else if(!reduced.matches&&!enabled)enable()});
  slider.addEventListener('input',()=>jump(Number(slider.value),false));
  chapterButtons.forEach(b=>b.addEventListener('click',()=>jump(Number(b.dataset.time))));
  $('#replay-scroll').addEventListener('click',()=>jump(0));
  $('#enable-scroll').addEventListener('click',enable);
  $('#watch-film').addEventListener('click',()=>{
    cinemaScroll=scrollY;sound.src=`assets/film-${currentFormat()}.mp4`;sound.muted=false;dialog.showModal();document.body.classList.add('cinema-open');sound.play().catch(()=>{});
  });
  $('#close-cinema').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{sound.pause();sound.removeAttribute('src');sound.load();document.body.classList.remove('cinema-open');$('#watch-film').focus({preventScroll:true});window.scrollTo({top:cinemaScroll,behavior:'instant'});scroll();requestAnimationFrame(()=>{window.scrollTo({top:cinemaScroll,behavior:'instant'});scroll()})});
  if(reduced.matches)fallback();else enable();
})();
