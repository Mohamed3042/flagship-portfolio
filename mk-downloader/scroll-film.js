(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const video = $('#scroll-film'), story = $('#film-story'), controls = $('.film-controls');
  const slider = $('#playhead'), timecode = $('#timecode'), sceneLabel = $('#scene-label');
  const loading = $('#load-state'), motionChoice = $('#motion-choice'), dialog = $('#cinema'), sound = $('#sound-film');
  const loadLabel=$('#load-label'), loadPercent=$('#load-percent'), loadProgress=$('#load-progress'), loadBytes=$('#load-bytes');
  const viewDialog=$('#view-options'), fillControl=$('#fill-screen'), paceControl=$('#scroll-pace');
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
    note:'توفّر الصيغ والاتصالات المتوازية والاستئناف يعتمد على المصدر. حركة نقل الملفات في الفيلم توضيحية.',filmLanguage:'فيلم مدته ٢٤ ثانية · نصوص الفيلم بالإنجليزية · موسيقى أصلية',back:'عد إلى معرض الأعمال',filmTitle:'رابط. ملف. لك.',close:'إغلاق ×',
    settings:'إعدادات العرض',closeSettings:'إغلاق الإعدادات',fill:'ملء الشاشة',fillNote:'املأ النافذة. قد تُقتطع بعض الحواف.',pace:'سرعة التمرير',slow:'بطيء · تحكم أدق',normal:'عادي',fast:'سريع · تمرير أقل',paceNote:'اختر مقدار التمرير اللازم للتنقل خلال الفيلم.',saved:'تُحفظ اختياراتك على هذا الجهاز.',reset:'إعادة الضبط',done:'تم'
  };
  if(ar){
    document.documentElement.lang='ar';document.documentElement.dir='rtl';document.title='MK Downloader — رابط. ملف. لك.';
    document.querySelectorAll('[data-copy]').forEach(el=>{if(copy[el.dataset.copy])el.textContent=copy[el.dataset.copy]});
    document.querySelectorAll('[data-label]').forEach(el=>{if(copy[el.dataset.label])el.setAttribute('aria-label',copy[el.dataset.label])});
    document.querySelectorAll('[data-portfolio]').forEach(el=>el.href='../ar/#sky');
    const lang=$('[data-language]');lang.textContent='English';lang.href='?lang=en&v=4';lang.lang='en';lang.hreflang='en';
    story.setAttribute('aria-label','فيلم MK Downloader بالتمرير');video.setAttribute('aria-label','فيلم MK Downloader مدته ٢٤ ثانية');
  }
  const names = chapterButtons.map(el=>el.textContent.trim());
  let enabled=false,ready=false,target=0,raf=0,format='',loadTimer=0,lastChapter=-1;
  let start=0,distance=0,resizeTimer=0,cinemaScroll=0;
  let download=null,mediaURL='';
  const preferencesKey='mk-downloader-view-v2',paceFactors={slow:1.5,normal:1,fast:0.65};
  let preferences={fill:true,pace:'normal'},settingsProgress=0,settingsScroll=0,chromeTimer=0,keyboardControls=false;
  try{
    const saved=JSON.parse(localStorage.getItem(preferencesKey)||'null');
    if(saved&&typeof saved.fill==='boolean'&&Object.hasOwn(paceFactors,saved.pace))preferences={fill:saved.fill,pace:saved.pace};
    else {const previous=JSON.parse(localStorage.getItem('mk-downloader-view-v1')||'null');if(previous&&Object.hasOwn(paceFactors,previous.pace))preferences.pace=previous.pace}
  }catch{}
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
  const stamp=t=>`00:${String(Math.floor(t)).padStart(2,'0')}`;
  const currentFormat=()=>portrait.matches?'portrait':'wide';

  function revealControls(){
    document.documentElement.classList.add('controls-visible');clearTimeout(chromeTimer);
    if(!enabled||!preferences.fill||!ready)return;
    chromeTimer=setTimeout(()=>{
      if(dialog.open||viewDialog.open||(keyboardControls&&document.activeElement?.closest('.film-header,.film-controls')))return;
      document.documentElement.classList.remove('controls-visible');
    },2400);
  }

  function ui(t){
    const n=Math.max(0,times.findLastIndex(time=>t>=time));
    slider.value=String(t);slider.style.setProperty('--progress',`${t/duration*100}%`);
    slider.setAttribute('aria-valuetext',`${stamp(t)} — ${names[n]}`);
    timecode.textContent=`${stamp(t)} / 00:24`;
    if(n!==lastChapter){lastChapter=n;sceneLabel.textContent=`${String(n+1).padStart(2,'0')} / ${names[n]}`;chapterButtons.forEach((b,i)=>i===n?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'))}
  }
  function schedule(){if(!raf&&enabled&&!dialog.open&&!viewDialog.open)raf=requestAnimationFrame(seek)}
  function seek(){
    raf=0;if(!enabled||!ready||dialog.open||viewDialog.open||video.seeking)return;
    const next=clamp(target,0,lastTime);
    if(Math.abs(video.currentTime-next)>1/10000){try{video.currentTime=next}catch{fallback(ar?'تعذّر تحريك الفيلم. استخدم أدوات التشغيل.':'The film could not seek. Use the playback controls.')}}
  }
  function scroll(){if(!enabled||viewDialog.open)return;target=clamp((window.scrollY-start)/distance)*lastTime;ui(target);schedule();revealControls()}
  function layout(){
    const progress=distance?clamp((scrollY-start)/distance):0;
    const h=Math.round(window.innerHeight);
    document.documentElement.style.setProperty('--screen-height',`${h}px`);
    document.documentElement.style.setProperty('--scroll-distance',`${Math.round(Math.max(7200,h*13)*paceFactors[preferences.pace])}px`);
    start=story.getBoundingClientRect().top+scrollY;distance=Math.max(1,story.offsetHeight-h);
    return progress;
  }
  function applyView(save=false){
    document.documentElement.classList.toggle('film-fill',preferences.fill);
    fillControl.checked=preferences.fill;paceControl.value=preferences.pace;
    $('#view-status').textContent=preferences.fill?(ar?'عرض كامل — الفيلم يملأ الشاشة.':'Full bleed — the film fills the screen.'):(ar?'ملاءمة — يظهر الإطار كاملًا.':'Fit — the full frame stays visible.');
    revealControls();
    if(enabled){
      const p=viewDialog.open?settingsProgress:clamp(target/lastTime);
      layout();settingsScroll=Math.ceil(start+p*distance);window.scrollTo({top:settingsScroll,behavior:'instant'});scroll();
    }
    if(save){try{localStorage.setItem(preferencesKey,JSON.stringify(preferences));$('#save-note').textContent=ar?copy.saved:'Your choices are saved on this device.'}catch{$('#save-note').textContent=ar?'تُطبّق اختياراتك خلال هذه الزيارة.':'Your choices apply to this visit.'}}
  }
  function downloadProgress(loaded,total,complete=false){
    const mb=n=>(n/1e6).toFixed(2);
    if(total>0){
      const percent=complete?100:Math.min(99,Math.floor(loaded/total*100));
      loadPercent.textContent=`${percent}%`;loadProgress.value=percent;
      loadBytes.textContent=`${mb(loaded)} / ${mb(total)} MB`;
    }else{
      loadPercent.textContent='—';loadProgress.removeAttribute('value');
      loadBytes.textContent=ar?`${mb(loaded)} MB تم تحميلها`:`${mb(loaded)} MB downloaded`;
    }
  }
  function loadingWatchdog(){
    clearTimeout(loadTimer);
    loadTimer=setTimeout(()=>{if(!ready)fallback(ar?'توقف التحميل مؤقتًا. استخدم أدوات التشغيل أو أعد تفعيل التمرير.':'The download has stalled. Use the playback controls or enable scroll control to retry.')},35000);
  }
  function releaseDownload(){
    clearTimeout(loadTimer);
    if(download){const previous=download;download=null;previous.abort()}
    video.removeAttribute('src');video.load();
    if(mediaURL){URL.revokeObjectURL(mediaURL);mediaURL=''}
  }
  function source(){
    const next=currentFormat();if(next===format)return;
    ready=false;releaseDownload();format=next;loading.hidden=false;video.setAttribute('aria-hidden','true');
    loadLabel.textContent=ar?copy.loading:'Loading the film…';downloadProgress(0,0);
    video.poster=`assets/poster-${format}.jpg`;
    // Native video buffering measures time ranges, not downloaded bytes. Fetch
    // the complete scrub file so the percentage and every later seek are real.
    const request=new XMLHttpRequest();download=request;
    request.open('GET',`assets/scroll-${format}.mp4`);request.responseType='blob';
    request.onreadystatechange=()=>{
      if(download===request&&request.readyState===2){
        downloadProgress(0,Number(request.getResponseHeader('Content-Length'))||0);loadingWatchdog();
      }
    };
    request.onprogress=event=>{
      if(download!==request)return;
      downloadProgress(event.loaded,event.lengthComputable?event.total:0);loadingWatchdog();
    };
    request.onload=()=>{
      if(download!==request||!enabled)return;
      if(request.status!==200||!request.response?.size){fallback(ar?'تعذّر تحميل الفيلم. استخدم أدوات التشغيل أو أعد المحاولة.':'The film could not download. Use the playback controls or try again.');return}
      download=null;const blob=request.response;
      downloadProgress(blob.size,blob.size,true);loadLabel.textContent=ar?'اكتمل التحميل. جارٍ تجهيز الفيلم…':'Download complete. Preparing the film…';
      mediaURL=URL.createObjectURL(blob);video.src=mediaURL;video.load();loadingWatchdog();
    };
    request.onerror=()=>{if(download===request)fallback(ar?'انقطع الاتصال. استخدم أدوات التشغيل أو أعد المحاولة.':'The connection was interrupted. Use the playback controls or try again.')};
    loadingWatchdog();request.send();
  }
  function enable(){
    if(enabled)return;enabled=true;document.documentElement.classList.add('scroll-active');motionChoice.hidden=true;controls.hidden=false;
    $('#replay-scroll').hidden=false;video.controls=false;video.muted=true;video.preload='auto';video.setAttribute('playsinline','');video.pause();
    layout();source();scroll();
  }
  function fallback(message){
    const wasEnabled=enabled;enabled=false;ready=false;releaseDownload();cancelAnimationFrame(raf);raf=0;document.documentElement.classList.remove('scroll-active');controls.hidden=true;loading.hidden=true;
    video.controls=true;video.muted=false;video.preload='metadata';video.removeAttribute('aria-hidden');format='';
    const f=currentFormat();video.poster=`assets/poster-${f}.jpg`;video.src=`assets/film-${f}.mp4`;video.load();
    motionChoice.hidden=false;motionChoice.querySelector('p').textContent=message|| (ar?copy.reduced:'Reduced motion is on. Play the film, or enable scroll control.');
    if(wasEnabled)window.scrollTo({top:story.offsetTop,behavior:'instant'});
  }
  function jump(t,smooth=true){if(!enabled)enable();window.scrollTo({top:Math.ceil(start+clamp(t/lastTime)*distance),behavior:smooth&&!reduced.matches?'smooth':'instant'})}
  video.addEventListener('loadeddata',()=>{if(!enabled||!mediaURL||video.getAttribute('src')!==mediaURL)return;clearTimeout(loadTimer);ready=true;video.pause();video.removeAttribute('aria-hidden');loading.hidden=true;scroll()});
  video.addEventListener('seeked',()=>{if(enabled)schedule()});
  video.addEventListener('error',()=>{if(enabled&&mediaURL&&video.getAttribute('src')===mediaURL)fallback(ar?'تعذّر تحميل نسخة التمرير. شغّل الفيلم أدناه.':'The scroll version could not load. Play the film below.')});
  video.addEventListener('play',()=>{if(enabled)video.pause()});
  window.addEventListener('scroll',scroll,{passive:true});
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(!enabled)return;const p=viewDialog.open?settingsProgress:(distance?clamp((scrollY-start)/distance):0);layout();source();const y=Math.ceil(start+p*distance);if(viewDialog.open)settingsScroll=y;window.scrollTo({top:y,behavior:'instant'});scroll()},150)},{passive:true});
  window.addEventListener('pageshow',()=>{if(enabled){layout();scroll()}});
  portrait.addEventListener('change',()=>{if(enabled)source()});
  reduced.addEventListener('change',()=>{if(reduced.matches&&enabled)fallback();else if(!reduced.matches&&!enabled)enable()});
  slider.addEventListener('input',()=>jump(Number(slider.value),false));
  chapterButtons.forEach(b=>b.addEventListener('click',()=>jump(Number(b.dataset.time))));
  $('#replay-scroll').addEventListener('click',()=>jump(0));
  $('#enable-scroll').addEventListener('click',enable);
  $('#view-settings').addEventListener('click',()=>{settingsProgress=clamp(target/lastTime);settingsScroll=scrollY;viewDialog.showModal();document.body.classList.add('cinema-open')});
  fillControl.addEventListener('change',()=>{preferences.fill=fillControl.checked;applyView(true)});
  paceControl.addEventListener('change',()=>{preferences.pace=paceControl.value;applyView(true)});
  $('#reset-settings').addEventListener('click',()=>{preferences={fill:true,pace:'normal'};applyView(true)});
  $('#close-settings').addEventListener('click',()=>viewDialog.close());
  $('#done-settings').addEventListener('click',()=>viewDialog.close());
  viewDialog.addEventListener('close',()=>{
    document.body.classList.remove('cinema-open');$('#view-settings').focus({preventScroll:true});
    window.scrollTo({top:enabled?settingsScroll:story.offsetTop,behavior:'instant'});scroll();
    requestAnimationFrame(()=>{window.scrollTo({top:enabled?settingsScroll:story.offsetTop,behavior:'instant'});scroll()});
  });
  $('#watch-film').addEventListener('click',()=>{
    cinemaScroll=scrollY;sound.src=`assets/film-${currentFormat()}.mp4`;sound.muted=false;dialog.showModal();document.body.classList.add('cinema-open');sound.play().catch(()=>{});
  });
  $('#close-cinema').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{sound.pause();sound.removeAttribute('src');sound.load();document.body.classList.remove('cinema-open');$('#watch-film').focus({preventScroll:true});window.scrollTo({top:cinemaScroll,behavior:'instant'});scroll();requestAnimationFrame(()=>{window.scrollTo({top:cinemaScroll,behavior:'instant'});scroll()})});
  window.addEventListener('pointermove',event=>{if(event.pointerType==='mouse')revealControls()},{passive:true});
  window.addEventListener('pointerdown',event=>{keyboardControls=false;if(!event.target.closest?.('.film-screen'))revealControls()},{passive:true});
  window.addEventListener('keydown',()=>{keyboardControls=true;revealControls()});
  document.addEventListener('focusin',event=>{if(event.target.closest?.('.film-header,.film-controls'))revealControls()});
  $('.film-screen').addEventListener('click',()=>{
    if(!enabled||!ready||!preferences.fill)return;
    if(document.documentElement.classList.contains('controls-visible')){clearTimeout(chromeTimer);document.documentElement.classList.remove('controls-visible')}
    else revealControls();
  });
  applyView();if(reduced.matches)fallback();else enable();
})();
