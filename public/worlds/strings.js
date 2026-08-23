(() => {
  'use strict';
  const scene = document.getElementById('strings-reel');
  if (!scene) return;
  const definitions = [...scene.querySelectorAll('.shot-data figure')];
  const videos = [...scene.querySelectorAll('.film-frame video')];
  if (definitions.length !== 40 || videos.length !== 2) return;
  const clamp = (value) => value < 0 ? 0 : value > 1 ? 1 : value;
  const readProgress = () => clamp(Number.parseFloat(scene.style.getPropertyValue('--p') || '0'));
  const runtime = 200;
  const shotRuntime = runtime / definitions.length;
  const shots = definitions.map((figure) => ({ id:figure.dataset.sourceId, clip:figure.dataset.clip, poster:figure.dataset.poster, title:figure.dataset.title, revision:figure.dataset.revision, defect:figure.dataset.defect === 'true' }));
  const floor = scene.querySelector('.floor');
  const ambient = scene.querySelector('.ambient');
  const count = document.getElementById('strings-shot-number');
  const title = document.getElementById('strings-shot-title');
  const source = document.getElementById('strings-source');
  const disclosure = document.getElementById('strings-disclosure');
  let activeSlot = -1;
  let currentShot = -1;
  let currentFraction = 0;
  let paintedProgress = 0;
  let frame = 0;
  let travelDirection = 1;
  const slots = videos.map((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.pause();
    return { video, shot:-1, token:0, ready:false, seeking:false, wanted:-1 };
  });
  const seek = (slot, time) => {
    slot.wanted = time;
    if (!slot.ready || slot.seeking) return;
    const ceiling = Number.isFinite(slot.video.duration) ? Math.max(.001, slot.video.duration - .04) : shotRuntime;
    const target = Math.min(ceiling, Math.max(.001, time));
    if (Math.abs(slot.video.currentTime - target) < .01) return;
    slot.seeking = true;
    try { slot.video.currentTime = target; } catch { slot.seeking = false; }
  };
  const load = (slot, shotIndex) => {
    if (slot.shot === shotIndex && slot.video.getAttribute('src')) return slot;
    slot.token += 1;
    const token = slot.token;
    slot.shot = shotIndex;
    slot.ready = false;
    slot.seeking = false;
    slot.wanted = -1;
    slot.video.classList.remove('on');
    slot.video.pause();
    slot.video.poster = shots[shotIndex].poster;
    slot.video.preload = 'auto';
    slot.video.src = shots[shotIndex].clip;
    slot.video.dataset.sourceId = shots[shotIndex].id;
    slot.video.dataset.clip = shots[shotIndex].clip;
    slot.video.onloadedmetadata = () => {
      if (slot.token !== token) return;
      slot.ready = true;
      if (slot.wanted >= 0) seek(slot, slot.wanted);
    };
    slot.video.onseeked = () => {
      if (slot.token !== token) return;
      slot.seeking = false;
      if (slot.wanted >= 0 && Math.abs(slot.video.currentTime - slot.wanted) >= .01) seek(slot, slot.wanted);
    };
    slot.video.onerror = () => {
      if (slot.token !== token) return;
      slot.ready = false;
      scene.dataset.mediaState = 'poster';
    };
    slot.video.load();
    return slot;
  };
  const slotFor = (shotIndex) => {
    const existing = slots.find((slot) => slot.shot === shotIndex);
    return existing || load(activeSlot === 0 ? slots[1] : slots[0], shotIndex);
  };
  const show = (slot) => {
    activeSlot = slots.indexOf(slot);
    slots.forEach((candidate, index) => candidate.video.classList.toggle('on', index === activeSlot));
  };
  const setShot = (index) => {
    if (index === currentShot) return;
    currentShot = index;
    const shot = shots[index];
    floor.src = shot.poster;
    ambient.src = shot.poster;
    count.textContent = `${String(index + 1).padStart(2, '0')} / 40`;
    title.textContent = shot.title;
    source.textContent = `${shot.id} · ${shot.revision}`;
    disclosure.hidden = !shot.defect;
    scene.dataset.currentShot = String(index + 1);
    scene.dataset.currentSource = shot.id;
    scene.dataset.currentClip = shot.clip;
    scene.dataset.mediaState = 'loading';
  };
  const render = (progress) => {
    const previous = paintedProgress;
    paintedProgress = clamp(progress);
    if (paintedProgress > previous) travelDirection = 1;
    else if (paintedProgress < previous) travelDirection = -1;
    const globalTime = Math.min(runtime - .001, paintedProgress * runtime);
    const index = Math.min(shots.length - 1, Math.floor(globalTime / shotRuntime));
    const localTime = globalTime - index * shotRuntime;
    currentFraction = localTime / shotRuntime;
    scene.style.setProperty('--journey', paintedProgress.toFixed(5));
    scene.style.setProperty('--f', currentFraction.toFixed(5));
    scene.style.setProperty('--pan-x', `${((paintedProgress - .5) * -2.5).toFixed(3)}%`);
    scene.style.setProperty('--pan-y', `${((paintedProgress - .5) * 3).toFixed(3)}%`);
    setShot(index);
    const slot = slotFor(index);
    show(slot);
    seek(slot, localTime);
    const neighbour = index + travelDirection;
    if (neighbour >= 0 && neighbour < shots.length) {
      const hidden = slots.find((candidate) => candidate !== slot);
      if (hidden && hidden.shot !== neighbour) load(hidden, neighbour);
    }
  };
  const paint = () => { frame = 0; render(readProgress()); };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
  addEventListener('scroll', schedule, { passive:true });
  addEventListener('resize', schedule, { passive:true });
  scene.addEventListener('scene:live', () => { document.body.classList.add('film-live'); schedule(); });
  scene.addEventListener('scene:idle', () => document.body.classList.remove('film-live'));
  load(slots[0], 0);
  show(slots[0]);
  load(slots[1], 1);
  render(readProgress());
  window.CTS_ONE_PLAYHEAD = Object.freeze({
    version:'2.0.0', runtime, acceptedSourceIds:shots.map((shot) => shot.id),
    snapshot:() => ({ progress:paintedProgress, index:currentShot, sourceId:shots[currentShot]?.id || '', currentTime:currentFraction*shotRuntime, globalTime:paintedProgress*runtime, activeBuffers:videos.filter((video) => video.classList.contains('on')).length }),
  });
})();
