/*! © 2026 Mohamed Mahmoud. All rights reserved. */
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
  // Film pages (no pixelsPerSecond in their data) scroll like the World: its pace, its smooth wheel and its glide after a
  // finger, with whole chapters kept buffered. Home's film sets its own pace inside the World engine and keeps the old feel.
  const filmPage = !data.pixelsPerSecond;
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
  const trackEl = one('[data-film-track]');
  // Ambient: the shown frame, tiny and blurred, fills whatever the film does not cover (phones, ultra-wide).
  const ambient = one('[data-film-ambient]'), ambientCtx = ambient?.getContext('2d');
  let ambientAt = 0;
  const drawAmbient = video => {if (!ambientCtx || performance.now() - ambientAt < 80) return; ambientAt = performance.now(); try {ambientCtx.drawImage(video, 0, 0, ambient.width, ambient.height);} catch {}};
  if (videos.length !== 3 || !stage || !story) throw new Error('The film requires a stage, story, and exactly three video buffers.');
  const slots = videos.map(video => ({video, key:'', profile:'', index:-1, ready:false, generation:0, wanted:0, presented:0, frameHandle:0, holdUntil:0}));
  const cache = new Map(), jobs = new Map(), warmed = new Set();
  const metrics = {seeks:0, switches:0, profileChanges:0, fetchedBytes:0, downloaded:[], errors:[], maxTickMs:0, warmed:0};
  let profile = chooseProfile(), display = null, desiredIndex = 0, desiredKey = '', lastChapter = null;
  let goal = 0, position = 0, painted = 0, lastGoal = 0, lastDirection = 1, raf = 0, previous = 0, layer = 1;
  let travel = 0, filmMode = !reduced.matches, isReady = false, started = false, disposed = false, resizeTimer = 0, lenis = null, warming = false;
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
  // In memory: the two clips either side of the frame, and on film pages every clip of the chapter on screen and of the
  // chapters either side, so a scroll into the next or previous chapter never waits on the network. A computer keeps the
  // whole film (nearest clips first): a jump anywhere then starts from memory, not from the browser's cache.
  let near = [0, 2];
  const keepAll = filmPage && !coarse.matches;
  function bufferRange(t) {
    const around = [desiredIndex-2, desiredIndex+2];
    if (keepAll) return [0, clipCount-1];
    if (!filmPage) return around;
    const c = data.chapters.indexOf(chapterAt(t)), from = data.chapters[Math.max(0,c-1)].start, to = data.chapters[c+2]?.start ?? data.duration;
    return [Math.min(around[0], Math.floor(from/data.clipSeconds)), Math.max(around[1], Math.ceil(to/data.clipSeconds)-1)];
  }
  const isNear = index => index>=near[0] && index<=near[1];
  function evict() {
    const used = new Set(slots.map(s=>s.key));
    for (const [key,entry] of cache) if (!used.has(key) && (entry.profile!==profile || !isNear(entry.index))) {
      URL.revokeObjectURL(entry.url); cache.delete(key);
    }
  }
  let warmJob = null;
  async function fetchClip(index, requestedProfile=profile) {
    const key=keyFor(requestedProfile,index);
    if(cache.has(key))return cache.get(key).url;
    if(jobs.has(key))return jobs.get(key).promise;
    if(warmJob&&warmJob.key!==key){warmJob.controller.abort();warmed.delete(warmJob.key);} // the film on screen comes first
    const job={controller:new AbortController(),promise:null,index,profile:requestedProfile};
    job.promise=(async()=>{
      const timeout=setTimeout(()=>job.controller.abort(new DOMException('Scene download timed out','TimeoutError')),60000);
      try {
        const response=await fetch(clipURL(index,requestedProfile),{signal:job.controller.signal});
        if(!response.ok)throw new Error(`Scene ${index}: HTTP ${response.status}`);
        const blob=await response.blob();
        if(job.controller.signal.aborted)throw new DOMException('Cancelled','AbortError');
        const url=URL.createObjectURL(blob);
        cache.set(key,{url,index,profile:requestedProfile,bytes:blob.size});warmed.add(key);
        metrics.fetchedBytes+=blob.size;metrics.downloaded.push(key);
        return url;
      } finally {clearTimeout(timeout);}
    })();
    jobs.set(key,job);
    try{return await job.promise;}finally{if(jobs.get(key)===job)jobs.delete(key);}
  }
  // Touch screens, once the buffer is in: the rest of the film streams into the HTTP cache one clip at a time, nearest first
  // and only while nothing on screen is loading, so a jump anywhere can start from disk without holding a phone's memory
  // (the owner, 2026-10-06: "its ok force them all to load each page so its well loaded before to avoid lag"). Save-Data opts out.
  async function warm() {
    if(warming||!filmPage||navigator.connection?.saveData)return;
    warming=true;
    while(!disposed&&filmMode){
      if(jobs.size){await new Promise(r=>setTimeout(r,250));continue;}
      const p=profile,i=[...Array(clipCount).keys()].filter(i=>!warmed.has(keyFor(p,i))).sort((a,b)=>Math.abs(a-desiredIndex)-Math.abs(b-desiredIndex))[0];
      if(i===undefined)break;
      const key=keyFor(p,i);warmed.add(key);
      warmJob={key,controller:new AbortController()};
      try{ // read through and drop: the cache keeps the bytes, the page holds none of them
        const response=await fetch(clipURL(i,p),{signal:warmJob.controller.signal,priority:'low'});
        if(response.ok){const reader=response.body.getReader();while(!(await reader.read()).done);metrics.warmed++;}
      }catch{}
      warmJob=null;
    }
    warming=false;
  }
  function paint(slot, localTime) {
    if(!filmMode || !slot.ready || slot.video.readyState<2 || slot.key!==desiredKey)return;
    if(Math.abs(localTime-slot.wanted)>.11)return;
    if(slot!==display) {
      // The new buffer fades in on top while the old one stays opaque underneath, then the old one goes: two half-faded
      // layers over the dark stage dipped the picture by a quarter at every 5 s clip boundary.
      const old=display;
      slot.video.style.zIndex=String(++layer);slot.video.classList.add('is-visible');
      if(old){old.holdUntil=performance.now()+240;setTimeout(()=>{if(display!==old)old.video.classList.remove('is-visible');},240);}
      display=slot;metrics.switches++;
    }
    painted=clamp(slot.index*data.clipSeconds+localTime,0,lastTime);drawAmbient(slot.video);
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
  // Pace. Film pages walk at the World's: six seconds of film to a screen of scroll on every device (world.css:
  // html.world-walk{--pps:calc(100svh / 6)}), measured on the small viewport so a phone's toolbars never stretch the film
  // under the finger — the owner, 2026-10-06: "make it same way as world was made because i feel they too fast".
  // Touch screens also stop at every chapter start: CSS scroll snap, off while Play scrolls — the owner, 2026-10-05: "you
  // can end the whole thing in one strong scroll".
  const touch=matchMedia('(pointer: coarse)');let snaps=[],snapKey='';
  const screenProbe=filmPage?document.body.appendChild(document.createElement('i')):null;
  if(screenProbe)screenProbe.style.cssText='position:fixed;top:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
  const perSecond=()=>filmPage?(screenProbe.offsetHeight||innerHeight)/6:profile==='mobile'?Math.max(data.pixelsPerSecond.mobile||72,180):(data.pixelsPerSecond.desktop||88);
  function setTravel() {
    travel=Math.round(data.duration*perSecond());
    root.style.setProperty('--film-travel',`${travel}px`);
    const on=filmMode&&touch.matches;root.classList.toggle('film-snap',on&&!root.classList.contains('film-autoplay'));
    if(snapKey===`${on}:${travel}`)return;snapKey=`${on}:${travel}`;
    for(const s of snaps)s.remove();snaps=[];
    if(on)for(const t of [...data.chapters.map(c=>c.start),lastTime]){const i=document.createElement('i');i.className='film-snap-point';i.style.top=`${t/lastTime*travel}px`;story.append(i);snaps.push(i);}
  }
  // Smooth, weighted wheel scrolling the World's way (boot.ts: Lenis, lerp .09). A finger scrolls natively, so touch
  // screens keep their snap stops and the film glides after the finger instead (tick).
  if(filmPage&&!touch.matches&&!reduced.matches)import('./lenis.mjs').then(({default:Lenis})=>{
    if(!disposed)lenis=new Lenis({lerp:.09,wheelMultiplier:.9,touchMultiplier:1.3,autoRaf:true,prevent:node=>node.tagName==='DIALOG'});
  }).catch(()=>{});
  const jump=y=>{if(lenis){lenis.resize();lenis.scrollTo(y,{immediate:true,force:true});}else scrollTo({top:y,behavior:'instant'});};
  function abortDistant() {
    const urgent=!cache.has(desiredKey); // after a jump, look-ahead far from the new frame waits its turn again
    for(const [key,job] of jobs)if(key!==desiredKey && (job.profile!==profile||!isNear(job.index)||(urgent&&Math.abs(job.index-desiredIndex)>2))) {
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
    // Far chapter jumps resolve directly. Otherwise the film eases after the scroll: lightly behind the wheel, and on film
    // pages' touch screens with the World's glide after a finger (engine.ts: damp(…, 6)).
    const rate=filmPage&&coarse.matches?6:1000/65;
    position=Math.abs(goal-position)>data.clipSeconds*1.5?goal:position+(goal-position)*(1-Math.exp(-delta*rate/1000));
    if(Math.abs(position-goal)<frame*.2)position=goal;
    const frameTime=clamp(Math.round(position*data.fps)/data.fps,0,lastTime);
    desiredIndex=Math.min(clipCount-1,Math.floor(frameTime/data.clipSeconds));desiredKey=keyFor(profile,desiredIndex);
    near=bufferRange(frameTime);
    abortDistant();
    const slot=ensureSlot(desiredIndex,true);
    if(slot?.ready)seek(slot,frameTime-desiredIndex*data.clipSeconds);
    if(slot?.ready&&display?.key===desiredKey) {
      ensureSlot(desiredIndex+lastDirection);ensureSlot(desiredIndex-lastDirection);
      if(filmPage) {
        // the rest of the buffer, nearest first and ahead before behind, three at a time; once it is all in, the rest of the film
        const order=[];for(let i=Math.max(0,near[0]);i<=Math.min(clipCount-1,near[1]);i++)if(!cache.has(keyFor(profile,i)))order.push(i);
        order.sort((a,b)=>Math.abs(a-desiredIndex)-Math.abs(b-desiredIndex)||(b-a)*lastDirection);
        for(const i of order){if(jobs.size>=3)break;fetchClip(i).then(schedule,()=>{});}
        if(!order.length)warm();
      } else {
        const next=desiredIndex+lastDirection*2;
        if(!navigator.connection?.saveData && jobs.size<2 && next>=0 && next<clipCount)fetchClip(next).catch(()=>{});
      }
    }
    slider.value=String(goal);slider.setAttribute('aria-valuetext',`${fmt(goal)} — ${tr(chapterAt(goal).title)}`);
    progress.style.transform=`scaleX(${goal/lastTime})`;trackEl?.style.setProperty('--p',String(goal/lastTime));
    root.dataset.targetTime=goal.toFixed(4);root.dataset.positionTime=position.toFixed(4);
    root.classList.toggle('has-film-progress',goal>.5);evict();
    metrics.maxTickMs=Math.max(metrics.maxTickMs,performance.now()-tickStart);
    if(Math.abs(position-goal)>frame*.15 || (!slot&&filmMode))schedule();
  }
  function schedule(){if(!raf&&filmMode&&!disposed)raf=requestAnimationFrame(tick);}
  function go(time,hash=true) {
    const t=clamp(Number(time)||0,0,lastTime),chapter=chapterAt(t);
    if(hash)history.replaceState(null,'',`${location.pathname}${location.search}#${chapter.id}`);
    if(filmMode){jump(story.offsetTop+t/lastTime*travel);schedule();}
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
    for(const button of all('[data-mode-toggle]')){const text=enabled?label('View chapters','عرض الفصول'):label('Scroll the film','تصفّح الفيلم بالتمرير');if(button.classList.contains('film-icon'))button.setAttribute('aria-label',text);else button.textContent=text;}
    if(!enabled&&autoplaying)setAutoplay(false);
    if(!enabled){for(const job of jobs.values())job.controller.abort();warmJob?.controller.abort();loading.hidden=true;if(fromUser)jump(0);}
    else {setTravel();if(fromUser)go(painted,false);schedule();}
  }
  function resize() {
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      const next=chooseProfile(),progressBefore=goal/lastTime,travelBefore=travel;
      if(next!==profile){profile=next;metrics.profileChanges++;root.dataset.requestedProfile=profile;setPoster(chapterAt(painted));buildChapters();}
      // Keep the film frame across a resize, but only while the film is on screen: pages can place
      // other scenes before or after the story (the home World), and those must not jump into the film.
      // A film page re-scrolls only when its length changed: a phone's toolbars resize the window mid-fling.
      setTravel();if(filmMode&&inFilm()&&(!filmPage||travel!==travelBefore))jump(story.offsetTop+progressBefore*travel);schedule();
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
    if(!filmMode||!started||holding||autoplaying||document.querySelector('dialog[open],.film-header details[open],.film-controls details[open],.film-header :focus-visible,.film-controls :focus-visible'))return;
    root.classList.add('film-chrome-hidden');clearTimeout(chromeTimer);chromeTimer=setTimeout(showChrome,1400);
  },{passive:true});
  addEventListener('pointermove',event=>{if(event.pointerType==='mouse'&&Math.abs(event.movementX)+Math.abs(event.movementY)>3){showChrome();if(autoplaying)hideSoon(2600);}},{passive:true}); // still-mouse moves fired by scrolling don't count
  for(const type of ['pointerdown','keydown','focusin'])addEventListener(type,showChrome,{passive:true});
  addEventListener('hashchange',()=>{if(redirectLegacyHash())return;const time=hashTime();if(time!==null)go(time,false);});
  reduced.addEventListener('change',()=>changeMode(!reduced.matches,true));
  addEventListener('pagehide',()=>{watchVideo?.pause();for(const job of jobs.values())job.controller.abort();warmJob?.controller.abort();});
  addEventListener('pageshow',()=>{previous=0;schedule();});

  // ── Player controls (film pages with the Netflix-style chrome; every element is optional) ──
  // Play auto-advances the scroll at the film's own pace (travel / duration), so it plays in real time;
  // the chrome then fades out and returns on pointer movement. Any manual scroll, swipe or seek pauses.
  const playButton=one('[data-film-play]'),ticks=one('[data-film-ticks]'),peek=one('[data-film-peek]'),fullButton=one('[data-film-fullscreen]');
  let autoplaying=false,autoLast=0,autoCarry=0,idleTimer=0;
  function hideSoon(delay){clearTimeout(idleTimer);idleTimer=setTimeout(()=>{if(autoplaying&&!document.querySelector('dialog[open]'))root.classList.add('film-chrome-hidden');},delay);}
  function autoStep(now){
    if(!autoplaying)return;
    const dt=autoLast?Math.min(.1,(now-autoLast)/1000):0;autoLast=now;
    if(document.querySelector('dialog[open]')){requestAnimationFrame(autoStep);return;}
    if(scrollY>=story.offsetTop+travel-1){setAutoplay(false);return;}
    autoCarry+=travel/data.duration*dt;const step=Math.floor(autoCarry);
    if(step){autoCarry-=step;if(lenis)jump(scrollY+step);else scrollBy(0,step);}
    requestAnimationFrame(autoStep);
  }
  function setAutoplay(on){
    if(on===autoplaying)return;
    autoplaying=on;root.classList.toggle('film-autoplay',on);root.classList.toggle('film-snap',!on&&filmMode&&touch.matches);
    if(playButton){playButton.setAttribute('aria-pressed',String(on));playButton.setAttribute('aria-label',on?label('Pause','إيقاف'):label('Play','تشغيل'));}
    autoLast=0;autoCarry=0;
    if(on){if(!filmMode)changeMode(true,true);if(scrollY>=story.offsetTop+travel-2)go(0,false);requestAnimationFrame(autoStep);hideSoon(1200);}
    else{clearTimeout(idleTimer);showChrome();}
  }
  playButton?.addEventListener('click',()=>setAutoplay(!autoplaying));
  for(const button of all('[data-film-skip]'))button.addEventListener('click',()=>go(clamp(goal+Number(button.dataset.filmSkip),0,lastTime),false));
  for(const type of ['wheel','touchstart'])addEventListener(type,()=>setAutoplay(false),{passive:true});
  slider.addEventListener('pointerdown',()=>setAutoplay(false));
  addEventListener('keydown',event=>{
    if(event.code==='Space'&&filmMode&&inFilm()&&!/INPUT|TEXTAREA|SELECT|BUTTON|^A$/.test(event.target.tagName)&&!event.target.isContentEditable&&!document.querySelector('dialog[open]')){event.preventDefault();setAutoplay(!autoplaying);}
    else if(autoplaying&&/Arrow|Page|Home|End/.test(event.key))setAutoplay(false);
  });
  for(const dialog of [chapterDialog,watchDialog].filter(Boolean))dialog.addEventListener('toggle',()=>{if(dialog.open)setAutoplay(false);});
  if(ticks)ticks.replaceChildren(...data.chapters.slice(1).map(chapter=>{const mark=document.createElement('i');mark.style.left=`${chapter.start/data.duration*100}%`;return mark;}));
  if(trackEl&&peek&&matchMedia('(hover:hover)').matches){
    const img=peek.querySelector('img'),peekTitle=peek.querySelector('[data-peek-title]'),peekTime=peek.querySelector('[data-peek-time]');
    trackEl.addEventListener('pointermove',event=>{
      const box=trackEl.getBoundingClientRect(),x=clamp(event.clientX-box.left,0,box.width),t=x/box.width*lastTime,chapter=chapterAt(t),src=posterFor(chapter);
      peek.hidden=false;if(img.getAttribute('src')!==src)img.src=src;
      peekTitle.textContent=tr(chapter.title);peekTime.textContent=fmt(t);peek.style.left=`${clamp(x,130,box.width-130)}px`;
    });
    trackEl.addEventListener('pointerleave',()=>{peek.hidden=true;});
  }
  if(fullButton&&document.fullscreenEnabled){
    fullButton.hidden=false;
    fullButton.addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();else root.requestFullscreen().catch(()=>{});});
    addEventListener('fullscreenchange',()=>{const on=!!document.fullscreenElement;root.classList.toggle('film-fullscreen',on);fullButton.setAttribute('aria-label',on?label('Exit full screen','الخروج من ملء الشاشة'):label('Full screen','ملء الشاشة'));});
  }
  buildChapters();setTravel();
  const linkedTime=hashTime()??0,deep=chapterAt(linkedTime);position=goal=painted=linkedTime;setPoster(deep);chrome(linkedTime);
  changeMode(filmMode);root.classList.add('film-enhanced');
  requestAnimationFrame(()=>{if(hashTime()!==null)go(linkedTime,false);started=true;schedule();});
  const api={play:()=>setAutoplay(true),pause:()=>setAutoplay(false),get playing(){return autoplaying;},seek:go,setMode:mode=>changeMode(mode==='film',true),get time(){return painted;},get chapter(){return chapterAt(painted).id;},get profile(){return profile;},get mode(){return filmMode?'film':'posters';},get metrics(){return structuredClone(metrics);},get buffered(){return [...cache.keys()];},destroy(){disposed=true;cancelAnimationFrame(raf);lenis?.destroy();for(const job of jobs.values())job.controller.abort();warmJob?.controller.abort();for(const entry of cache.values())URL.revokeObjectURL(entry.url);}};
  return api;
}

const dataNode=document.querySelector('#film-data');
if(dataNode) {
  try {window.motionFilm=createFilmWorld(JSON.parse(dataNode.textContent));}
  catch(error) {document.documentElement.classList.add('is-poster-mode');document.querySelector('[data-calm-story]')?.removeAttribute('hidden');console.error('Film initialization:',error);}
}
