/**
 * Motion Portfolio film engine, 2026-10-03.
 * Adapted from Job Orbit's proven film-world.js (three paused video buffers,
 * 5-second segments, blob cache, rVFC + paused-seek fallback). Its ownership and
 * original source are documented in README.md. No framework or runtime CDN.
 *
 * Public contract: #film-data JSON + the data-film-* hooks in README.md.
 * Native portrait is a separate authored film, never a crop of the landscape.
 */
export function createFilmWorld(data, scope = document) {
  const root = document.documentElement;
  const redirectLegacyHash = () => {
    const destination = data.hashRedirects?.[location.hash.slice(1)];
    if (!destination) return false;
    location.replace(new URL(destination, location.href).href);
    return true;
  };
  if (redirectLegacyHash()) return {};
  const one = s => scope.querySelector(s);
  const all = s => [...scope.querySelectorAll(s)];
  const lang = data.lang==='ar' ? 'ar' : data.lang==='en' ? 'en' : new URLSearchParams(location.search).get('lang')==='ar' ? 'ar' : 'en';
  const tr = value => typeof value === 'string' ? value : value?.[lang] ?? value?.en ?? '';
  const label = (en, ar) => lang === 'ar' ? ar : en;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = matchMedia('(max-aspect-ratio: 4/5)');
  const coarse = matchMedia('(pointer: coarse)');
  const chooseProfile = () => data.profiles.mobile && (portrait.matches || (coarse.matches && innerWidth <= 600)) ? 'mobile' : 'desktop';
  const frame = 1 / data.fps, lastTime = data.duration - frame;
  const clipCount = data.clipCount || Math.ceil(data.duration / data.clipSeconds);
  const stage = one('[data-film-stage]');
  const poster = one('[data-film-poster]');
  const loading = one('[data-film-loading]');
  const loadMessage = one('[data-load-message]');
  const retry = one('[data-retry]');
  const slider = one('[data-film-scrubber]');
  const progress = one('[data-film-progress]');
  const chapterTitle = one('[data-chapter-title]');
  const chapterSummary = one('[data-chapter-summary]');
  const chapterName = one('[data-chapter-name]');
  const chapterAction = one('[data-chapter-action]');
  const finalContact = one('[data-film-contact]');
  const clock = one('[data-clock]');
  const chapterDialog = one('[data-chapter-dialog]');
  const watchDialog = one('[data-watch-dialog]');
  const watchVideo = one('[data-watch-video]');
  const worldLink = one('[data-world-link]');
  const story = one('[data-film-story]');
  const calm = one('[data-calm-story]');
  const videos = all('[data-film-buffer]');
  if (videos.length !== 3 || !stage || !story) throw new Error('The film requires a stage, story, and exactly three video buffers.');
  const slots = videos.map(video => ({video, key:'', profile:'', index:-1, ready:false, generation:0, wanted:0, presented:0, frameHandle:0, holdUntil:0}));
  const cache = new Map(), jobs = new Map();
  const metrics = {seeks:0, switches:0, profileChanges:0, fetchedBytes:0, downloaded:[], errors:[], maxTickMs:0};
  let profile = chooseProfile(), display = null, desiredIndex = 0, desiredKey = '', lastChapter = null;
  let goal = 0, position = 0, painted = 0, lastGoal = 0, lastDirection = 1, raf = 0, previous = 0;
  let travel = 0, filmMode = !reduced.matches, isReady = false, started = false, disposed = false, resizeTimer = 0;
  const keyFor = (p, i) => `${p}:${i}`;
  const clipURL = (i, p = profile) => new URL(data.profiles[p].clips.replace('{index}', String(i).padStart(3,'0')), location.href).href;
  const chapterAt = t => data.chapters.reduce((current, item) => item.start <= t ? item : current, data.chapters[0]);
  const hashChapter = () => data.chapters.find(c => `#${c.id}` === location.hash);
  const hashTime = () => {
    const chapter=hashChapter();if(chapter)return chapter.start;
    const alias=Number(data.hashAliases?.[location.hash.slice(1)]);
    return Number.isFinite(alias)?clamp(alias,0,lastTime):null;
  };
  const asset = p => new URL(p, location.href).href;
  const posterFor = (chapter, p = profile) => asset(chapter.posters?.[p] || data.profiles[p].poster);
  const fmt = t => `${String(Math.floor(t / 60)).padStart(2,'0')}:${String(Math.floor(t % 60)).padStart(2,'0')}`;
  root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  root.dataset.filmLang = lang;
  for (const node of all('[data-i18n]')) {const copy = data.copy?.[node.dataset.i18n]; if (copy) node.textContent = tr(copy);}
  for (const node of all('[data-i18n-label]')) {const copy = data.copy?.[node.dataset.i18nLabel]; if (copy) node.setAttribute('aria-label',tr(copy));}
  if (data.title) document.title = tr(data.title);
  const languageLink = one('[data-language-link]');
  if (languageLink) {
    languageLink.textContent = label('العربية','English');
    languageLink.lang = lang === 'ar' ? 'en' : 'ar';
    languageLink.hreflang = languageLink.lang;
  }
  for (const link of all('[data-gallery-link]')) link.href = new URL(data.gallery?.[lang] || data.gallery?.en || '../../',location.href).href;
  const setPoster = chapter => {
    poster.src = posterFor(chapter);
    stage.style.setProperty('--film-ar', String(data.profiles[profile].width / data.profiles[profile].height)); // film.css: cover, capped by --film-overscan
    poster.alt = tr(chapter.title);
    poster.width = data.profiles[profile].width;
    poster.height = data.profiles[profile].height;
  };
  function updateLinks(chapter) {
    if (languageLink) {
      const other=lang==='ar'?'en':'ar';
      const url=new URL(data.languageURLs?.[other]||location.href,location.href);
      if(!data.languageURLs?.[other])url.searchParams.set('lang',other);
      url.hash=chapter.id;languageLink.href=url.href;
    }
    if (worldLink && data.world) {
      const url = new URL(data.world.href,location.href);
      url.searchParams.set('from',data.id); url.searchParams.set('chapter',chapter.id); url.searchParams.set('lang',lang);
      worldLink.href=url.href;
      worldLink.setAttribute('aria-label',tr(data.world.label));
    }
  }
  function chrome(t, replaceHash = false) {
    const chapter = chapterAt(t);
    clock.textContent = `${fmt(t)} / ${fmt(data.duration)}`;
    if(finalContact) {
      const show=t >= (data.contactStart ?? data.duration-5);
      if(finalContact.hidden===show){
        finalContact.hidden=!show;
        root.classList.toggle('film-contact-hold',show);
        if(!show&&finalContact.contains(document.activeElement))chapterAction?.focus({preventScroll:true});
      }
    }
    if (chapter !== lastChapter) {
      lastChapter=chapter; chapterTitle.textContent=tr(chapter.title); chapterSummary.textContent=tr(chapter.summary);
      if(chapterName)chapterName.textContent=tr(chapter.name||chapter.title);
      if(chapterAction){
        chapterAction.hidden=!chapter.action;
        if(chapter.action){chapterAction.textContent=tr(chapter.action.label);chapterAction.href=new URL(tr(chapter.action.href),location.href).href;}
      }
      // On the root so the glass header, dock and caption take on each world's colour too (film.css transitions it).
      root.style.setProperty('--chapter-accent',chapter.accent||data.accent||'#1ed760');
      for (const link of all('[data-chapter]')) {
        if (link.dataset.chapter === chapter.id) link.setAttribute('aria-current','step'); else link.removeAttribute('aria-current');
      }
      if (replaceHash && started) history.replaceState(null,'',`${location.pathname}${location.search}#${chapter.id}`);
      updateLinks(chapter);
    }
    root.dataset.filmChapter=chapter.id;
  }
  function showLoading(text) {
    loading.hidden=false;
    if (text) loadMessage.textContent=text;
  }
  function hideLoading() {loading.hidden=true;retry.hidden=true;delete root.dataset.filmError;}
  function failure(error) {
    if (error.name === 'AbortError' || disposed) return;
    metrics.errors.push(error.message);
    root.dataset.filmError=error.message;
    showLoading(label('This scene could not load. Try again or open the chapter posters.','تعذّر تحميل هذا المشهد. أعد المحاولة أو افتح صور الفصول.'));
    retry.hidden=false;
  }
  function evict() {
    const used = new Set(slots.map(s=>s.key));
    for (const [key,entry] of cache) if (!used.has(key) && (entry.profile!==profile || Math.abs(entry.index-desiredIndex)>2)) {
      URL.revokeObjectURL(entry.url); cache.delete(key);
    }
  }
  async function fetchClip(index, requestedProfile=profile) {
    const key=keyFor(requestedProfile,index);
    if(cache.has(key))return cache.get(key).url;
    if(jobs.has(key))return jobs.get(key).promise;
    const job={controller:new AbortController(),promise:null,index,profile:requestedProfile};
    job.promise=(async()=>{
      const timeout=setTimeout(()=>job.controller.abort(new DOMException('Scene download timed out','TimeoutError')),45000);
      try {
        const response=await fetch(clipURL(index,requestedProfile),{signal:job.controller.signal});
        if(!response.ok)throw new Error(`Scene ${index}: HTTP ${response.status}`);
        const blob=await response.blob();
        if(job.controller.signal.aborted)throw new DOMException('Cancelled','AbortError');
        const url=URL.createObjectURL(blob);
        cache.set(key,{url,index,profile:requestedProfile,bytes:blob.size});
        metrics.fetchedBytes+=blob.size;metrics.downloaded.push(key);
        return url;
      } finally {clearTimeout(timeout);}
    })();
    jobs.set(key,job);
    try{return await job.promise;}finally{if(jobs.get(key)===job)jobs.delete(key);}
  }
  function paint(slot, localTime) {
    if(!filmMode || !slot.ready || slot.video.readyState<2 || slot.key!==desiredKey)return;
    if(Math.abs(localTime-slot.wanted)>.11)return;
    if(slot!==display) {
      if(display)display.holdUntil=performance.now()+240;
      videos.forEach(video=>video.classList.toggle('is-visible',video===slot.video));
      display=slot;metrics.switches++;
    }
    painted=clamp(slot.index*data.clipSeconds+localTime,0,lastTime);
    root.dataset.paintedTime=painted.toFixed(4);root.dataset.clip=String(slot.index);root.dataset.profile=slot.profile;
    chrome(painted,true);hideLoading();
    if(!isReady){isReady=true;root.dataset.filmReady='true';root.classList.add('film-ready');}
  }
  function watchFrames(slot) {
    if(typeof slot.video.requestVideoFrameCallback!=='function' || slot.frameHandle || !slot.key)return;
    const generation=slot.generation;
    slot.frameHandle=slot.video.requestVideoFrameCallback((_,metadata)=>{
      slot.frameHandle=0;
      if(slot.generation!==generation || disposed)return;
      slot.presented=metadata.mediaTime;
      if(!slot.video.seeking)paint(slot,metadata.mediaTime);
      watchFrames(slot);schedule();
    });
  }
  function seek(slot,t) {
    if(!slot?.ready || slot.video.readyState<2)return;
    const wanted=clamp(Math.round(t*data.fps)/data.fps,0,(slot.video.duration||data.clipSeconds)-frame);
    slot.wanted=wanted;
    if(slot.video.seeking)return;
    const requested=clamp(wanted+.001,.001,(slot.video.duration||data.clipSeconds)-.001);
    if(Math.abs(slot.video.currentTime-requested)<frame*.2){paint(slot,slot.video.currentTime);return;}
    try {slot.video.currentTime=requested;metrics.seeks++;}catch(error){failure(error);}
  }
  function ensureSlot(index,primary=false) {
    if(index<0||index>=clipCount)return null;
    const key=keyFor(profile,index);
    let slot=slots.find(s=>s.key===key);if(slot)return slot;
    const candidates=slots.filter(s=>s!==display && s.key!==desiredKey && s.holdUntil<performance.now());
    if(!primary && display?.key!==desiredKey)return null;
    slot=candidates.sort((a,b)=>!a.key?-1:!b.key?1:(b.profile!==profile?99:Math.abs(b.index-desiredIndex))-(a.profile!==profile?99:Math.abs(a.index-desiredIndex)))[0];
    if(!slot)return null;
    slot.key=key;slot.index=index;slot.profile=profile;slot.ready=false;slot.presented=0;
    slot.wanted=primary?clamp(position-index*data.clipSeconds,0,data.clipSeconds-frame):.001;
    const generation=++slot.generation;
    if(slot.frameHandle){slot.video.cancelVideoFrameCallback(slot.frameHandle);slot.frameHandle=0;}
    if(primary)showLoading(isReady?label('Loading this scene…','جارٍ تحميل المشهد…'):label('Opening the first world…','جارٍ فتح العالم الأول…'));
    fetchClip(index,profile).then(url=>{
      if(slot.generation!==generation||disposed)return;
      slot.video.src=url;slot.video.load();watchFrames(slot);
    }).catch(error=>{
      if(slot.generation!==generation)return;
      if(error.name==='AbortError'){slot.key='';slot.index=-1;slot.ready=false;slot.generation++;if(filmMode)schedule();return;}
      if(slot.key===desiredKey)failure(error);
      else {slot.key='';slot.index=-1;slot.ready=false;slot.generation++;}
    });
    return slot;
  }
  for(const slot of slots) {
    slot.video.muted=true;slot.video.defaultMuted=true;
    slot.video.addEventListener('loadeddata',()=>{
      slot.ready=true;watchFrames(slot);schedule();
    });
    slot.video.addEventListener('seeked',()=>{
      const generation=slot.generation;
      // Safari/Chromium may decode a paused seek without a compositor callback.
      requestAnimationFrame(()=>{
        if(slot.generation===generation&&!slot.video.seeking)paint(slot,slot.video.currentTime);
      });
      schedule();
    });
    slot.video.addEventListener('error',()=>{if(slot.key===desiredKey)failure(new Error(slot.video.error?.message||'The scene could not decode.'));});
  }
  const inFilm=()=>scrollY>=story.offsetTop-innerHeight*.5&&scrollY<=story.offsetTop+travel+innerHeight*.5;
  function setTravel() {
    travel=data.duration*(profile==='mobile'?(data.pixelsPerSecond?.mobile||72):(data.pixelsPerSecond?.desktop||88));
    root.style.setProperty('--film-travel',`${travel}px`);
  }
  function abortDistant() {
    for(const [key,job] of jobs)if(key!==desiredKey && (job.profile!==profile||Math.abs(job.index-desiredIndex)>2)) {
      job.controller.abort();
      for(const slot of slots)if(slot.key===key&&slot!==display){slot.key='';slot.index=-1;slot.ready=false;slot.generation++;}
    }
  }
  function tick(now) {
    const tickStart=performance.now();raf=0;
    if(!filmMode || disposed || chapterDialog?.open || watchDialog?.open)return;
    const delta=previous?Math.min(64,now-previous):16;previous=now;
    // Scroll positions are integral CSS pixels. Snap their mapped time to the
    // nearest real film frame so a chapter/segment boundary cannot settle
    // fractionally before the requested frame.
    goal=Math.round(clamp((scrollY-story.offsetTop)/travel,0,1)*lastTime*data.fps)/data.fps;
    if(Math.abs(goal-lastGoal)>.01)lastDirection=goal>lastGoal?1:-1;
    lastGoal=goal;
    // Far chapter jumps resolve directly; wheel/trackpad travel is damped.
    position=Math.abs(goal-position)>data.clipSeconds*1.5?goal:position+(goal-position)*(1-Math.exp(-delta/65));
    if(Math.abs(position-goal)<frame*.2)position=goal;
    const frameTime=clamp(Math.round(position*data.fps)/data.fps,0,lastTime);
    desiredIndex=Math.min(clipCount-1,Math.floor(frameTime/data.clipSeconds));desiredKey=keyFor(profile,desiredIndex);
    abortDistant();
    const slot=ensureSlot(desiredIndex,true);
    if(slot?.ready)seek(slot,frameTime-desiredIndex*data.clipSeconds);
    if(slot?.ready&&display?.key===desiredKey) {
      ensureSlot(desiredIndex+lastDirection);ensureSlot(desiredIndex-lastDirection);
      const next=desiredIndex+lastDirection*2;
      if(!navigator.connection?.saveData && jobs.size<2 && next>=0 && next<clipCount)fetchClip(next).catch(()=>{});
    }
    slider.value=String(goal);slider.setAttribute('aria-valuetext',`${fmt(goal)} — ${tr(chapterAt(goal).title)}`);
    progress.style.transform=`scaleX(${goal/lastTime})`;
    root.dataset.targetTime=goal.toFixed(4);root.dataset.positionTime=position.toFixed(4);
    root.classList.toggle('has-film-progress',goal>.5);evict();
    metrics.maxTickMs=Math.max(metrics.maxTickMs,performance.now()-tickStart);
    if(Math.abs(position-goal)>frame*.15 || (!slot&&filmMode))schedule();
  }
  function schedule(){if(!raf&&filmMode&&!disposed)raf=requestAnimationFrame(tick);}
  function go(time,hash=true) {
    const t=clamp(Number(time)||0,0,lastTime),chapter=chapterAt(t);
    if(hash)history.replaceState(null,'',`${location.pathname}${location.search}#${chapter.id}`);
    if(filmMode){scrollTo({top:story.offsetTop+t/lastTime*travel,behavior:'instant'});schedule();}
    else {one(`[data-poster-chapter="${chapter.id}"]`)?.scrollIntoView({behavior:'instant',block:'start'});chrome(t);}
  }
  function buildChapters() {
    const rail=one('[data-chapter-rail]'),list=one('[data-chapter-list]');
    if(rail)rail.replaceChildren();if(list)list.replaceChildren();
    for(const chapter of data.chapters) {
      const n=data.chapters.indexOf(chapter),anchor=document.createElement('a');
      anchor.href=`#${chapter.id}`;anchor.dataset.chapter=chapter.id;anchor.textContent=tr(chapter.title);
      anchor.setAttribute('aria-label',`${tr(chapter.title)}, ${fmt(chapter.start)}`);
      anchor.style.setProperty('--chapter-accent',chapter.accent||data.accent);
      if(rail){const dot=anchor.cloneNode(true);dot.textContent=String(n+1).padStart(2,'0');rail.append(dot);}
      if(list){const item=document.createElement('li'),stamp=document.createElement('span');stamp.textContent=fmt(chapter.start);anchor.prepend(stamp);item.append(anchor);list.append(item);}
      const card=one(`[data-poster-chapter="${chapter.id}"]`);
      if(card){
        card.querySelector('h2').textContent=tr(chapter.title);card.querySelector('p').textContent=tr(chapter.summary);
        const img=card.querySelector('img');img.src=posterFor(chapter);img.alt=tr(chapter.title);
        img.width=data.profiles[profile].width;img.height=data.profiles[profile].height;
        const play=card.querySelector('[data-play-chapter]');play.textContent=label('Play a short scene','شغّل مشهداً قصيراً');play.dataset.playChapter=chapter.id;
      }
    }
  }
  function changeMode(enabled,fromUser=false) {
    filmMode=enabled;root.classList.toggle('is-film-mode',enabled);root.classList.toggle('is-poster-mode',!enabled);
    story.hidden=!enabled;calm.hidden=enabled;
    for(const button of all('[data-mode-toggle]'))button.textContent=enabled?label('View chapters','عرض الفصول'):label('Scroll the film','تصفّح الفيلم بالتمرير');
    if(!enabled){for(const job of jobs.values())job.controller.abort();loading.hidden=true;if(fromUser)scrollTo({top:0,behavior:'instant'});}
    else {setTravel();if(fromUser)go(painted,false);schedule();}
  }
  function resize() {
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      const next=chooseProfile(),progressBefore=goal/lastTime;
      if(next!==profile){profile=next;metrics.profileChanges++;root.dataset.requestedProfile=profile;setPoster(chapterAt(painted));buildChapters();}
      // Keep the film frame across a resize, but only while the film is on screen: pages can place
      // other scenes before or after the story (the home World), and those must not jump into the film.
      setTravel();if(filmMode&&inFilm())scrollTo({top:story.offsetTop+progressBefore*travel,behavior:'instant'});schedule();
    },120);
  }
  function openChapter(chapter) {
    watchVideo.pause();
    const index=Math.min(clipCount-1,Math.floor((chapter.previewAt??chapter.start)/data.clipSeconds));
    watchVideo.src=clipURL(index);watchVideo.poster=posterFor(chapter);watchVideo.load();
    one('[data-watch-title]').textContent=tr(chapter.title);
    watchDialog.showModal();watchVideo.play().catch(()=>{});
  }
  scope.addEventListener('click',event=>{
    const link=event.target.closest('[data-chapter]');
    if(link){event.preventDefault();chapterDialog?.close();go(data.chapters.find(c=>c.id===link.dataset.chapter)?.start||0);}
    const play=event.target.closest('[data-play-chapter]');
    if(play){const c=data.chapters.find(c=>c.id===play.dataset.playChapter);if(c)openChapter(c);}
    if(event.target.closest('[data-mode-toggle]'))changeMode(!filmMode,true);
    if(event.target.closest('[data-open-chapters]'))chapterDialog.showModal();
    if(event.target.closest('[data-close]'))event.target.closest('dialog')?.close();
    if(event.target.closest('[data-film-skip]')){event.preventDefault();changeMode(false,true);calm.focus();}
  });
  scope.addEventListener('keydown',event=>{
    if(!filmMode || !inFilm() || chapterDialog?.open || watchDialog?.open || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName) || event.target.isContentEditable)return;
    const current=data.chapters.indexOf(chapterAt(goal));
    const targets={ArrowRight:current+1,ArrowLeft:current-1,PageDown:current+1,PageUp:current-1,Home:0,End:data.chapters.length-1};
    if(event.key in targets){event.preventDefault();go(data.chapters[clamp(targets[event.key],0,data.chapters.length-1)].start);}
  });
  slider.max=String(lastTime);slider.step=String(frame);slider.setAttribute('aria-label',label('Film position','موضع الفيلم'));
  slider.addEventListener('input',()=>go(slider.value,false));
  retry.addEventListener('click',()=>{
    const slot=slots.find(s=>s.key===desiredKey);
    if(slot){slot.key='';slot.index=-1;slot.ready=false;slot.generation++;}delete root.dataset.filmError;schedule();
  });
  for(const dialog of [chapterDialog,watchDialog].filter(Boolean)){
    dialog.addEventListener('close',()=>{if(dialog===watchDialog){watchVideo.pause();watchVideo.removeAttribute('src');watchVideo.load();}previous=0;schedule();});
    dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
  }
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});
  // Cinema chrome: header and dock clear the frame while the film is scrolled, then fade back after a pause.
  // They stay while a menu or dialog is open, while the scrubber is held, and while keyboard focus is inside them.
  let chromeTimer=0,holding=false;
  const showChrome=()=>{clearTimeout(chromeTimer);root.classList.remove('film-chrome-hidden');};
  slider.addEventListener('pointerdown',()=>{holding=true;showChrome();});
  addEventListener('pointerup',()=>{holding=false;},{passive:true});
  addEventListener('scroll',()=>{
    if(!filmMode||!started||holding||document.querySelector('dialog[open],.film-header details[open],.film-controls details[open],.film-header :focus-visible,.film-controls :focus-visible'))return;
    root.classList.add('film-chrome-hidden');clearTimeout(chromeTimer);chromeTimer=setTimeout(showChrome,1400);
  },{passive:true});
  addEventListener('pointermove',event=>{if(event.pointerType==='mouse'&&Math.abs(event.movementX)+Math.abs(event.movementY)>3)showChrome();},{passive:true}); // still-mouse moves fired by scrolling don't count
  for(const type of ['pointerdown','keydown','focusin'])addEventListener(type,showChrome,{passive:true});
  addEventListener('hashchange',()=>{if(redirectLegacyHash())return;const time=hashTime();if(time!==null)go(time,false);});
  reduced.addEventListener('change',()=>changeMode(!reduced.matches,true));
  addEventListener('pagehide',()=>{watchVideo?.pause();for(const job of jobs.values())job.controller.abort();});
  addEventListener('pageshow',()=>{previous=0;schedule();});
  buildChapters();setTravel();
  const linkedTime=hashTime()??0,deep=chapterAt(linkedTime);position=goal=painted=linkedTime;setPoster(deep);chrome(linkedTime);
  changeMode(filmMode);root.classList.add('film-enhanced');
  requestAnimationFrame(()=>{if(hashTime()!==null)go(linkedTime,false);started=true;schedule();});
  const api={seek:go,setMode:mode=>changeMode(mode==='film',true),get time(){return painted;},get chapter(){return chapterAt(painted).id;},get profile(){return profile;},get mode(){return filmMode?'film':'posters';},get metrics(){return structuredClone(metrics);},destroy(){disposed=true;cancelAnimationFrame(raf);for(const job of jobs.values())job.controller.abort();for(const entry of cache.values())URL.revokeObjectURL(entry.url);}};
  return api;
}

const dataNode=document.querySelector('#film-data');
if(dataNode) {
  try {window.motionFilm=createFilmWorld(JSON.parse(dataNode.textContent));}
  catch(error) {document.documentElement.classList.add('is-poster-mode');document.querySelector('[data-calm-story]')?.removeAttribute('hidden');console.error('Film initialization:',error);}
}
