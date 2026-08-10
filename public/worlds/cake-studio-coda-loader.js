(() => {
  'use strict';

  const scene = document.querySelector('[data-object-coda]');
  if (!scene) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    import('./cake-studio-coda.js?v=6');
    return;
  }

  const canvas = scene.querySelector('[data-cake-canvas]');
  const poster = scene.querySelector('[data-coda-reduced-poster]');
  const portal = scene.querySelector('[data-proof-portal]');
  const acts = [...scene.querySelectorAll('[data-object-act]')];
  const posterFor = (act) => `./cake-studio/posters/coda-${act}-${innerWidth <= 700 ? 'phone' : 'desktop'}.jpg`;
  const runtime = {
    version: '1.4.0',
    engine: 'static-poster',
    webglAvailable: false,
    ready: true,
    progress: 0,
    rawProgress: 0,
    cameraState: 'idle',
    act: 'forms',
    readyForms: 9,
    controlledParts: 4,
    outputs: 3,
    modelStatus: 'skipped',
    modelSource: 'reduced-static',
    modelsExpected: 24,
    modelsLoaded: 0,
    modelsResident: 0,
    residentModelGroups: [],
    setStatus: 'poster',
    setSource: 'reduced-static',
    cameraSource: 'reduced-static',
    portalState: 'hidden',
    renders: 0,
    drawCalls: 0,
    triangles: 0,
    reducedMotion: true,
  };
  window.__cakeStudioCoda = runtime;
  scene.dataset.mode = 'reduced-static';
  scene.dataset.models = 'skipped';
  scene.dataset.webgl = 'skipped';
  canvas.hidden = true;
  poster.hidden = false;

  const render = () => {
    const progress = Math.min(1, Math.max(0, Number.parseFloat(scene.style.getPropertyValue('--p') || '0')));
    const act = progress < 0.36 ? 'forms' : progress < 0.69 ? 'assembly' : 'handoff';
    const portalState = progress >= 0.9 ? 'locked' : progress >= 0.69 ? 'open' : 'hidden';
    runtime.progress = progress;
    runtime.rawProgress = progress;
    runtime.act = act;
    runtime.portalState = portalState;
    scene.dataset.act = act;
    scene.dataset.portalState = portalState;
    scene.style.setProperty('--object-p', progress.toFixed(6));
    scene.style.setProperty('--portal-p', act === 'handoff' ? '1' : '0');
    const posterSource = posterFor(act);
    if (poster.getAttribute('src') !== posterSource) poster.setAttribute('src', posterSource);
    portal?.setAttribute('aria-hidden', portalState === 'hidden' ? 'true' : 'false');
    acts.forEach((element) => {
      const visible = element.dataset.objectAct === act;
      element.style.setProperty('--presence', visible ? '1' : '0');
      element.dataset.visible = visible ? 'true' : 'false';
    });
  };
  addEventListener('scroll', render, { passive: true });
  addEventListener('resize', render, { passive: true });
  scene.addEventListener('scene:live', render);
  render();
})();
