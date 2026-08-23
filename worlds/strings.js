(() => {
  'use strict';
  const scenes = [...document.querySelectorAll('[data-slot]')];
  const rails = [...document.querySelectorAll('[data-rail]')];
  const query = new URLSearchParams(location.search);
  const qaNoMedia = window.__CTS_QA_NO_MEDIA === true;
  const clamp = value => Math.max(0, Math.min(1, value));
  let ticking = false;

  const units = scenes.map(scene => {
    const video = scene.querySelector('[data-scrub-film]');
    const unit = { scene, video, armed: false, metadata: false, wanted: 0 };
    const reveal = () => {
      if (video.readyState >= 2) scene.classList.add('is-ready');
      scene.dataset.decoded = video.readyState >= 2 ? 'true' : 'false';
    };
    video.addEventListener('loadedmetadata', () => {
      unit.metadata = true;
      seek(unit, unit.wanted);
    });
    video.addEventListener('loadeddata', reveal);
    video.addEventListener('seeked', reveal);
    video.addEventListener('error', () => { scene.dataset.mediaError = video.error?.code || 'unknown'; });
    return unit;
  });

  const arm = unit => {
    if (unit.armed) return;
    unit.armed = true;
    unit.video.src = unit.scene.dataset.src;
    unit.video.preload = 'auto';
    unit.video.load();
  };

  const seek = (unit, progress) => {
    unit.wanted = clamp(progress);
    if (!unit.metadata || !Number.isFinite(unit.video.duration)) return;
    const target = unit.wanted * Math.max(0, Math.min(5, unit.video.duration) - 0.034);
    if (Math.abs(unit.video.currentTime - target) < 0.012) {
      if (unit.video.readyState >= 2) unit.scene.classList.add('is-ready');
      return;
    }
    try { unit.video.currentTime = target; } catch {}
  };

  const paint = () => {
    ticking = false;
    const vh = innerHeight;
    const total = document.documentElement.scrollHeight - vh;
    rails.forEach(rail => rail.style.setProperty('--p', (total > 0 ? clamp(scrollY / total) : 0).toFixed(5)));
    units.forEach((unit, index) => {
      const rect = unit.scene.getBoundingClientRect();
      const span = Math.max(1, rect.height - vh);
      const progress = clamp(-rect.top / span);
      unit.scene.style.setProperty('--p', progress.toFixed(5));
      const near = rect.bottom > -vh && rect.top < vh * 2;
      unit.scene.classList.toggle('is-live', rect.top < vh * .55 && rect.bottom > vh * .45);
      if (near && !qaNoMedia) {
        arm(unit);
        if (units[index + 1]) arm(units[index + 1]);
        seek(unit, progress);
      }
    });
  };

  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });

  if (query.has('solo')) {
    const slot = Math.max(1, Math.min(40, Number.parseInt(query.get('solo'), 10) || 1));
    const progress = clamp(Number.parseFloat(query.get('p') || '.5'));
    document.querySelectorAll('.prologue,.epilogue').forEach(element => { element.style.display = 'none'; });
    units.forEach((unit, index) => {
      if (index !== slot - 1) { unit.scene.style.display = 'none'; return; }
      unit.scene.style.height = '100svh';
      unit.scene.style.setProperty('--p', progress.toFixed(5));
      unit.scene.classList.add('is-live');
      arm(unit);
      seek(unit, progress);
    });
  } else {
    paint();
  }

  window.CTS_SCROLL_FILM = {
    version: '1.0.0',
    slots: units.length,
    seekSlot(slot, progress) {
      const unit = units[slot - 1];
      if (!unit) return false;
      arm(unit);
      seek(unit, progress);
      return true;
    },
    snapshot() {
      return units.map(unit => ({
        slot: Number(unit.scene.dataset.slot),
        armed: unit.armed,
        decoded: unit.video.readyState >= 2,
        currentTime: unit.video.currentTime,
        duration: unit.video.duration || null,
        bufferedEnd: unit.video.buffered.length ? unit.video.buffered.end(unit.video.buffered.length - 1) : 0,
        error: unit.scene.dataset.mediaError || null,
      }));
    },
  };
})();
