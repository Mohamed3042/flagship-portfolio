#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1];
};
const baseUrl = valueAfter('--url', 'http://127.0.0.1:4617/worlds/cake-studio.html');
const outputRoot = resolve(valueAfter('--output', 'artifacts/cake-studio-browser'));
const chromePath = valueAfter('--chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const sabotage = args.includes('--sabotage');
const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

class Cdp {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.sequence = 0;
    this.pending = new Map();
    this.listeners = new Set();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    await new Promise((resolveOpen, rejectOpen) => {
      const timeout = setTimeout(() => rejectOpen(new Error('CDP WebSocket open timeout')), 10_000);
      this.socket.addEventListener('open', () => {
        clearTimeout(timeout);
        resolveOpen();
      }, { once: true });
      this.socket.addEventListener('error', () => rejectOpen(new Error('CDP WebSocket failed')), { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timeout);
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
        else pending.resolve(message.result ?? {});
        return;
      }
      for (const listener of this.listeners) listener(message);
    });
  }

  send(method, params = {}, sessionId = undefined) {
    const id = ++this.sequence;
    return new Promise((resolveCommand, rejectCommand) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        rejectCommand(new Error(`${method}: 20s timeout`));
      }, 20_000);
      this.pending.set(id, { resolve: resolveCommand, reject: rejectCommand, timeout, method });
      this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }

  onEvent(listener) { this.listeners.add(listener); }
  close() { this.socket?.close(); }
}

async function launchChrome(profile) {
  const child = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--hide-scrollbars',
    '--mute-audio',
    '--remote-debugging-port=0',
    '--remote-allow-origins=*',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--autoplay-policy=user-gesture-required',
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  const websocketUrl = await new Promise((resolveUrl, rejectUrl) => {
    const timeout = setTimeout(() => rejectUrl(new Error('Chrome DevTools launch timeout')), 15_000);
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        resolveUrl(match[1]);
      }
    });
    child.once('exit', (code) => {
      clearTimeout(timeout);
      rejectUrl(new Error(`Chrome exited before DevTools was ready (${code}): ${stderr.slice(-1000)}`));
    });
  });
  return { child, websocketUrl };
}

await mkdir(outputRoot, { recursive: true });
const profile = await mkdtemp(join(tmpdir(), 'cake-studio-browser-'));
const checks = [];
const failures = [];
const observations = {};
const check = (name, condition, detail) => {
  checks.push({ name, pass: Boolean(condition), detail: String(detail) });
  console.log(`${condition ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
  if (!condition) failures.push(`${name}: ${detail}`);
};

let chrome = null;
let cdp = null;
try {
  chrome = await launchChrome(profile);
  cdp = new Cdp(chrome.websocketUrl);
  await cdp.connect();

  const rangeResponse = await fetch(new URL('cake-studio/clips/CST-001.mp4', baseUrl), {
    headers: { Range: 'bytes=0-63' },
  });
  check('byte-range delivery', rangeResponse.status === 206 && rangeResponse.headers.get('accept-ranges') === 'bytes', `${rangeResponse.status} · ${rangeResponse.headers.get('content-range')}`);

  const viewports = sabotage
    ? [{ name: 'desktop', width: 1440, height: 1000, mobile: false }]
    : [
        { name: 'desktop', width: 1440, height: 1000, mobile: false },
        { name: 'phone', width: 390, height: 844, mobile: true },
      ];

  for (const viewport of viewports) {
    const { targetId } = await cdp.send('Target.createTarget', {
      url: 'about:blank',
    });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const consoleErrors = [];
    const pageErrors = [];
    const badResponses = [];
    const failedRequests = [];
    const requestUrls = new Map();
    cdp.onEvent((event) => {
      if (event.sessionId !== sessionId) return;
      if (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error') {
        consoleErrors.push(event.params.args.map((item) => item.value ?? item.description ?? '').join(' '));
      }
      if (event.method === 'Runtime.exceptionThrown') pageErrors.push(event.params.exceptionDetails.text);
      if (event.method === 'Network.responseReceived' && event.params.response.status >= 400) {
        badResponses.push(`${event.params.response.status} ${event.params.response.url}`);
      }
      if (event.method === 'Network.requestWillBeSent') {
        requestUrls.set(event.params.requestId, event.params.request.url);
      }
      if (event.method === 'Network.loadingFailed' && !event.params.canceled && event.params.errorText !== 'net::ERR_ABORTED') {
        failedRequests.push({
          errorText: event.params.errorText,
          type: event.params.type || '',
          url: requestUrls.get(event.params.requestId) || 'unknown-url',
        });
      }
      if (event.method === 'Network.loadingFinished' || event.method === 'Network.loadingFailed') {
        requestUrls.delete(event.params.requestId);
      }
    });

    await Promise.all([
      cdp.send('Page.enable', {}, sessionId),
      cdp.send('Runtime.enable', {}, sessionId),
      cdp.send('Network.enable', {}, sessionId),
      cdp.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
        screenWidth: viewport.width,
        screenHeight: viewport.height,
      }, sessionId),
      cdp.send('Emulation.setTouchEmulationEnabled', {
        enabled: viewport.mobile,
        maxTouchPoints: viewport.mobile ? 5 : 1,
      }, sessionId),
      cdp.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `(() => {
          const nativePlay = HTMLMediaElement.prototype.play;
          window.__cakePlayAttempts = 0;
          HTMLMediaElement.prototype.play = function(...args) {
            window.__cakePlayAttempts += 1;
            return nativePlay.apply(this, args);
          };
        })();`,
      }, sessionId),
    ]);

    const evaluate = async (expression) => {
      const response = await cdp.send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
      }, sessionId);
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
      return response.result?.value;
    };

    const waitFor = async (expression, timeout = 15_000) => {
      const started = Date.now();
      while (Date.now() - started < timeout) {
        if (await evaluate(expression)) return true;
        await delay(120);
      }
      return false;
    };

    const navigate = await cdp.send('Page.navigate', { url: baseUrl }, sessionId);
    check(`${viewport.name} navigation`, !navigate.errorText, navigate.errorText ?? 'HTTP document loaded');
    check(`${viewport.name} document ready`, await waitFor(`document.readyState === 'complete'`, 20_000), 'complete');
    await evaluate(`document.documentElement.style.scrollBehavior='auto'; if(document.documentElement.lang==='ar') document.querySelector('[data-lang-toggle]').click(); true`);
    const codaBooted = await waitFor(`Boolean(window.__cakeStudioCoda?.ready || window.__cakeStudioCoda?.reason)`, 20_000);
    check(`${viewport.name} dimensional runtime boot`, codaBooted, codaBooted ? 'Three.js runtime exposed' : 'runtime timed out');
    await delay(350);

    const basics = await evaluate(`(() => ({
      title: document.title,
      figures: document.querySelectorAll('#cake-reel .shot-data figure').length,
      videos: document.querySelectorAll('#cake-reel video').length,
      version: document.body.dataset.version,
      directorVersion: window.__cakeStudioDirector?.version ?? '',
      directorWeights: window.__cakeStudioDirector?.weights?.length ?? 0,
      fastWeight: window.__cakeStudioDirector?.weights?.[8] ?? -1,
      choiceWeight: window.__cakeStudioDirector?.weights?.[16] ?? -1,
      errorWeight: window.__cakeStudioDirector?.weights?.[26] ?? -1,
      rejectWeight: window.__cakeStudioDirector?.weights?.[37] ?? -1,
      loopWeight: window.__cakeStudioDirector?.weights?.[49] ?? -1,
      codaVersion: window.__cakeStudioCoda?.version ?? '',
      codaReady: window.__cakeStudioCoda?.ready ?? false,
      webgl: window.__cakeStudioCoda?.webglAvailable ?? false,
      engine: window.__cakeStudioCoda?.engine ?? '',
      canvases: document.querySelectorAll('[data-cake-canvas]').length,
      overflow: document.documentElement.scrollWidth - innerWidth,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir
    }))()`);
    check(`${viewport.name} page identity`, basics.title.includes('The Cake Is Made Twice') && basics.version === '1.4.0', `${basics.title} · ${basics.version}`);
    check(`${viewport.name} 50-shot DOM`, basics.figures === 50 && basics.videos === 2, `${basics.figures} figures / ${basics.videos} buffers`);
    check(
      `${viewport.name} directed score`,
      basics.directorVersion === '1.4.0'
        && basics.directorWeights === 50
        && basics.fastWeight < basics.choiceWeight
        && [basics.choiceWeight, basics.errorWeight, basics.rejectWeight, basics.loopWeight].every((weight) => weight >= 1.3),
      `v${basics.directorVersion} · fast ${basics.fastWeight} · choice/error/reject/loop ${basics.choiceWeight}/${basics.errorWeight}/${basics.rejectWeight}/${basics.loopWeight}`,
    );
    check(
      `${viewport.name} dimensional engine`,
      basics.codaVersion === '1.4.0' && basics.codaReady && basics.webgl && basics.engine.startsWith('three-r') && basics.canvases === 1,
      `v${basics.codaVersion} · ${basics.engine} · ready=${basics.codaReady} · canvas=${basics.canvases}`,
    );
    check(`${viewport.name} horizontal fit`, basics.overflow <= 1, `${basics.overflow}px overflow`);

    if (sabotage) {
      const applied = await evaluate(`(() => {
        const frame=document.querySelector('.film-frame');
        frame.dataset.browserSabotage='offset';
        frame.style.transform='translateX(180px)';
        const note=document.getElementById('director-note-en');
        note.dataset.browserSabotage='empty';
        note.textContent='';
        const canvas=document.querySelector('[data-cake-canvas]');
        canvas.dataset.browserSabotage='hidden';
        canvas.style.display='none';
        const output=document.querySelector('.artifact-names [data-output]:last-child');
        output.remove();
        window.__cakeStudioCoda.outputs=2;
        return frame.dataset.browserSabotage==='offset'
          && getComputedStyle(frame).transform!=='none'
          && note.dataset.browserSabotage==='empty'
          && note.textContent===''
          && canvas.dataset.browserSabotage==='hidden'
          && getComputedStyle(canvas).display==='none'
          && document.querySelectorAll('.artifact-names [data-output]').length===2
          && window.__cakeStudioCoda.outputs===2;
      })()`);
      check('browser sabotage applied', applied, 'film displaced, reason emptied, WebGL stage hidden, and one physical output removed in runtime only');
    }

    const scrollScene = async (selector, progress) => {
      let target = await evaluate(`(() => {
        const scene=document.querySelector(${JSON.stringify(selector)});
        const top=scene.getBoundingClientRect().top+scrollY;
        const travel=Math.max(0,scene.offsetHeight-innerHeight);
        const root=document.documentElement;
        const destination=Math.round(top+travel*${progress});
        root.style.setProperty('scroll-behavior','auto','important');
        return destination;
      })()`);
      // Use the same CSS progress cinema.js exposes as feedback. This remains
      // deterministic when a GLB decode delays a scroll paint or scroll anchoring
      // nudges the document while the middle act is entering.
      for (let frame = 0; frame < 6; frame += 1) {
        await evaluate(`document.scrollingElement.scrollTop=${target}; scrollTo(0,${target}); true`);
        // A host delay is not a rendering barrier: CDP can otherwise read the
        // previous knot before cinema.js receives its next animation frame.
        await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))`);
        const feedback = await evaluate(`(() => {
          const scene=document.querySelector(${JSON.stringify(selector)});
          return {
            progress:Number.parseFloat(scene.style.getPropertyValue('--p') || '0'),
            travel:Math.max(0,scene.offsetHeight-innerHeight),
            scrollY
          };
        })()`);
        if (Math.abs(feedback.progress - progress) < .0025) break;
        target = Math.round(feedback.scrollY + (progress - feedback.progress) * feedback.travel);
      }
      const settled = await waitFor(`Math.abs(Number.parseFloat(document.querySelector(${JSON.stringify(selector)}).style.getPropertyValue('--p') || '0')-${progress})<.003`, 3_000);
      if (!settled) throw new Error(`${selector} failed to settle at ${progress}`);
      await delay(800);
    };

    const screenshot = async (name) => {
      if (sabotage) return;
      const result = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
      }, sessionId);
      await writeFile(join(outputRoot, `${viewport.name}-${name}.png`), Buffer.from(result.data, 'base64'));
    };

    await scrollScene('.open', .54);
    await screenshot('opening');

    const filmStates = [
      { name: 'film-01', shot: 1, time: 2.5, rhythm: 'question' },
      { name: 'film-09-fast', shot: 9, time: 2.5, rhythm: 'rush' },
      { name: 'film-17-choice', shot: 17, time: 2.5, rhythm: 'decision' },
      { name: 'film-27-error', shot: 27, time: 2.5, rhythm: 'protect' },
      { name: 'film-38-reject', shot: 38, time: 2.5, rhythm: 'gate' },
      { name: 'film-50', shot: 50, time: 2.5, rhythm: 'release' },
    ];
    const stateResults = [];
    for (const state of filmStates) {
      const progress = await evaluate(`window.__cakeStudioDirector.progressForShot(${state.shot}, .5)`);
      await scrollScene('#cake-reel', progress);
      const ready = await waitFor(`(() => {
        const scene=document.getElementById('cake-reel');
        const active=scene.querySelector('video.on');
        return scene.dataset.currentShot==='${state.shot}' && active && active.readyState>=1 && active.seekable.length===1 && Math.abs(active.currentTime-${state.time})<.7;
      })()`, 20_000);
      await delay(500);
      const result = await evaluate(`(() => {
        const scene=document.getElementById('cake-reel');
        const frame=scene.querySelector('.film-frame').getBoundingClientRect();
        const cue=scene.querySelector('.cue').getBoundingClientRect();
        const active=scene.querySelector('video.on');
        return {
          shot:Number(scene.dataset.currentShot),
          clip:scene.dataset.currentClip,
          chapterKey:scene.dataset.chapterKey,
          rhythm:scene.dataset.rhythm,
          weight:Number(scene.dataset.shotWeight),
          directorNote:document.getElementById('director-note-en')?.textContent.trim() ?? '',
          mediaState:scene.dataset.mediaState,
          time:active ? active.currentTime : -1,
          duration:active ? active.duration : 0,
          readyState:active ? active.readyState : 0,
          seekable:active ? active.seekable.length : 0,
          paused:[...scene.querySelectorAll('video')].every(video=>video.paused),
          activeVideos:scene.querySelectorAll('video.on').length,
          playAttempts:window.__cakePlayAttempts,
          objectFit:active ? getComputedStyle(active).objectFit : '',
          contained:frame.left>=-1 && frame.right<=innerWidth+1 && frame.top>=-1 && frame.bottom<=innerHeight+1,
          captionClear:cue.top>=frame.bottom-1,
          frame:{left:frame.left,right:frame.right,top:frame.top,bottom:frame.bottom,width:frame.width,height:frame.height},
          cue:{top:cue.top,bottom:cue.bottom}
        };
      })()`);
      stateResults.push(result);
      check(`${viewport.name} ${state.name} ready`, ready && result.readyState >= 1 && result.seekable === 1, `${result.clip} · ready ${result.readyState} · seekable ${result.seekable}`);
      check(`${viewport.name} ${state.name} identity`, result.shot === state.shot && result.activeVideos === 1, `shot ${result.shot} · ${result.activeVideos} active buffer`);
      check(`${viewport.name} ${state.name} direction`, result.rhythm === state.rhythm && result.weight > 0 && result.directorNote.length > 24, `${result.chapterKey}/${result.rhythm} · weight ${result.weight} · ${result.directorNote}`);
      check(`${viewport.name} ${state.name} scrub time`, Math.abs(result.time - state.time) < .7, `${result.time.toFixed(3)}s / expected ~${state.time.toFixed(1)}s`);
      check(`${viewport.name} ${state.name} picture contained`, result.contained && result.captionClear && result.objectFit === 'contain', `${JSON.stringify(result.frame)} · cue top ${result.cue.top}`);
      check(`${viewport.name} ${state.name} never autoplayed`, result.paused && result.playAttempts === 0, `paused=${result.paused} · play attempts=${result.playAttempts}`);
      await screenshot(state.name);
    }

    const reverseProgress = await evaluate(`window.__cakeStudioDirector.progressForShot(17, .5)`);
    await scrollScene('#cake-reel', reverseProgress);
    const reversed = await waitFor(`document.getElementById('cake-reel').dataset.currentShot==='17'`, 10_000);
    const reverseState = await evaluate(`(() => { const v=document.querySelector('#cake-reel video.on'); return {shot:Number(document.getElementById('cake-reel').dataset.currentShot),time:v?.currentTime ?? -1,playAttempts:window.__cakePlayAttempts}; })()`);
    check(`${viewport.name} reverse scrub`, reversed && reverseState.shot === 17 && Math.abs(reverseState.time - 2.5) < .8, `shot ${reverseState.shot} @ ${reverseState.time.toFixed(3)}s`);
    check(`${viewport.name} reverse remains silent`, reverseState.playAttempts === 0, `${reverseState.playAttempts} play attempts`);

    const codaStates = [
      { name: 'coda-bridge', progress: .01, act: 'forms', copyRequired: false },
      { name: 'coda-forms', progress: .22, act: 'forms', copyRequired: true },
      { name: 'coda-assembly', progress: .52, act: 'assembly', copyRequired: true },
      { name: 'coda-handoff', progress: .84, act: 'handoff', copyRequired: true },
    ];
    await scrollScene('.dimensional-coda', .01);
    const realModelsReady = await waitFor(`window.__cakeStudioCoda?.residentModelGroups?.includes('forms') && window.__cakeStudioCoda?.setStatus==='ready'`, 30_000);
    const modelProof = await evaluate(`({
      status:window.__cakeStudioCoda?.modelStatus,
      source:window.__cakeStudioCoda?.modelSource,
      loaded:window.__cakeStudioCoda?.modelsLoaded,
      resident:window.__cakeStudioCoda?.modelsResident,
      groups:window.__cakeStudioCoda?.residentModelGroups,
      expected:window.__cakeStudioCoda?.modelsExpected,
      setStatus:window.__cakeStudioCoda?.setStatus,
      setSource:window.__cakeStudioCoda?.setSource,
      cameraSource:window.__cakeStudioCoda?.cameraSource,
      waferSource:window.__cakeStudioCoda?.waferSource,
      waferModels:window.__cakeStudioCoda?.waferModels,
      wordmarkModels:window.__cakeStudioCoda?.wordmarkModels,
      handoffArtifactSource:window.__cakeStudioCoda?.handoffArtifactSource,
      handoffArtifactModels:window.__cakeStudioCoda?.handoffArtifactModels,
      dataset:document.querySelector('.dimensional-coda')?.dataset.models
    })`);
    check(`${viewport.name} staged forms residency`, realModelsReady && modelProof.source === 'staged-glb' && modelProof.resident === 10 && modelProof.groups.length === 1 && modelProof.groups[0] === 'forms' && modelProof.expected === 24 && modelProof.dataset === 'ready', JSON.stringify(modelProof));
    check(`${viewport.name} authored proof room`, modelProof.setStatus === 'ready' && modelProof.setSource === 'cake-studio-proof-room.glb' && modelProof.cameraSource === 'authored-clip', JSON.stringify(modelProof));
    const codaResults = [];
    let priorRenders = -1;
    for (const state of codaStates) {
      await scrollScene('.dimensional-coda', state.progress);
      const rendered = await waitFor(`Math.abs((window.__cakeStudioCoda?.progress ?? -1)-${state.progress})<.025 && window.__cakeStudioCoda?.act==='${state.act}' && window.__cakeStudioCoda?.residentModelGroups?.includes('${state.act}')`, 30_000);
      if (state.copyRequired) {
        await waitFor(`window.__cakeStudioCoda?.wordmarkAct==='${state.act}' && window.__cakeStudioCoda?.subjectBounds?.visible===true`, 10_000);
      }
      await delay(180);
      const result = await evaluate(`(() => {
        const runtime=window.__cakeStudioCoda;
        const scene=document.querySelector('.dimensional-coda');
        const canvas=document.querySelector('[data-cake-canvas]');
        const bridge=document.querySelector('.film-bridge');
        const act=document.querySelector('[data-object-act="${state.act}"]');
        const canvasRect=canvas.getBoundingClientRect();
        const actRect=act.getBoundingClientRect();
        const actStyle=getComputedStyle(act);
        let glVersion='';
        try {
          const gl=canvas.getContext('webgl2') || canvas.getContext('webgl');
          glVersion=gl?.getParameter(gl.VERSION) ?? '';
        } catch {}
        const probe=runtime?.probeFrame?.() ?? {samples:0,nonDark:0,luminanceRange:0,meanLuminance:0};
        return {
          ready:runtime?.ready ?? false,
          webgl:runtime?.webglAvailable ?? false,
          engine:runtime?.engine ?? '',
          progress:runtime?.progress ?? -1,
          act:runtime?.act ?? '',
          forms:runtime?.readyForms ?? 0,
          parts:runtime?.controlledParts ?? 0,
          outputs:runtime?.outputs ?? 0,
          modelStatus:runtime?.modelStatus ?? '',
          modelSource:runtime?.modelSource ?? '',
          modelsLoaded:runtime?.modelsLoaded ?? 0,
          modelsResident:runtime?.modelsResident ?? 0,
          residentGroups:runtime?.residentModelGroups ?? [],
          setSource:runtime?.setSource ?? '',
          cameraSource:runtime?.cameraSource ?? '',
          waferSource:runtime?.waferSource ?? '',
          waferModels:runtime?.waferModels ?? 0,
          wordmarkModels:runtime?.wordmarkModels ?? 0,
          wordmarkAct:runtime?.wordmarkAct ?? 'none',
          handoffArtifactSource:runtime?.handoffArtifactSource ?? '',
          handoffArtifactModels:runtime?.handoffArtifactModels ?? 0,
          renders:runtime?.renders ?? 0,
          drawCalls:runtime?.drawCalls ?? 0,
          triangles:runtime?.triangles ?? 0,
          gpuTextures:runtime?.gpuTextures ?? 0,
          gpuGeometries:runtime?.gpuGeometries ?? 0,
          subjectBounds:runtime?.subjectBounds ?? {visible:false,coverage:0},
          portalState:runtime?.portalState ?? 'hidden',
          pixelRatio:runtime?.pixelRatio ?? 0,
          canvasWidth:canvas.width,
          canvasHeight:canvas.height,
          canvasDisplay:getComputedStyle(canvas).display,
          canvasContained:canvasRect.left>=-1 && canvasRect.right<=innerWidth+1 && canvasRect.top>=-1 && canvasRect.bottom<=innerHeight+1,
          actPresence:Number.parseFloat(actStyle.getPropertyValue('--presence') || '0'),
          actContained:actRect.left>=-1 && actRect.right<=innerWidth+1 && actRect.top>=-1 && actRect.bottom<=innerHeight+1,
          bridgeOpacity:Number.parseFloat(getComputedStyle(bridge).opacity),
          bridgeSource:bridge.getAttribute('src'),
          bridgeWidth:bridge.getBoundingClientRect().width,
          labels:[...document.querySelectorAll('.artifact-names [data-output]')].map(node=>node.dataset.output),
          probe,
          glVersion,
          playAttempts:window.__cakePlayAttempts
        };
      })()`);
      codaResults.push(result);
      const expectedResident = state.act === 'handoff' ? 5 : 10;
      const roleReady = state.act === 'forms'
        ? result.wordmarkModels === 1
        : state.act === 'assembly'
          ? result.wordmarkModels === 1 && result.waferSource === 'glb' && result.waferModels === 17
          : result.wordmarkModels === 1 && result.handoffArtifactSource === 'glb' && result.handoffArtifactModels === 3;
      check(`${viewport.name} ${state.name} state`, rendered && result.ready && result.webgl && result.act === state.act && Math.abs(result.progress - state.progress) < .025, `${result.act} @ ${result.progress} · ${result.engine}`);
      check(`${viewport.name} ${state.name} object contract`, result.forms === 9 && result.parts === 4 && result.outputs === 3 && result.modelStatus === 'ready' && result.modelSource === 'staged-glb' && result.modelsResident === expectedResident && result.residentGroups.length === 1 && result.residentGroups[0] === state.act && roleReady && result.setSource === 'cake-studio-proof-room.glb' && result.cameraSource === 'authored-clip', `${result.forms} forms · ${result.parts} parts · ${result.outputs} outputs · ${result.modelsResident} resident / ${result.modelsLoaded} loaded`);
      if (state.copyRequired) {
        check(`${viewport.name} ${state.name} physical wordmark`, result.wordmarkAct === state.act, `${result.wordmarkAct} / expected ${state.act}`);
      }
      check(`${viewport.name} ${state.name} real render`, result.canvasDisplay !== 'none' && result.drawCalls >= 4 && result.triangles >= 500 && result.probe.nonDark > (state.copyRequired ? 320 : 60) && result.probe.luminanceRange > 8 && (!state.copyRequired || (result.subjectBounds.visible && result.subjectBounds.coverage > .01)) && result.glVersion.includes('WebGL'), `${result.glVersion} · ${result.drawCalls} calls · ${result.triangles} triangles · lit ${result.probe.nonDark}/${result.probe.samples} range ${result.probe.luminanceRange} · subject ${((result.subjectBounds.coverage || 0) * 100).toFixed(1)}%`);
      check(`${viewport.name} ${state.name} composition`, result.canvasContained && (!state.copyRequired || (result.actPresence > .3 && result.actContained)), `canvas=${result.canvasContained} · copy presence=${result.actPresence.toFixed(3)} · copy contained=${result.actContained}`);
      check(`${viewport.name} ${state.name} bounded rendering`, result.pixelRatio > 0 && result.pixelRatio <= 1.5 && result.renders > priorRenders && result.drawCalls <= 150 && result.triangles <= 2_700_000 && result.gpuTextures <= 26, `${result.canvasWidth}×${result.canvasHeight} @ ${result.pixelRatio}x · render ${result.renders} · ${result.gpuTextures} textures / ${result.gpuGeometries} geometries`);
      check(`${viewport.name} ${state.name} never autoplayed`, result.playAttempts === 0, `${result.playAttempts} play attempts`);
      if (state.name === 'coda-bridge') {
        check(`${viewport.name} endpoint match bridge`, result.bridgeOpacity > .72 && result.bridgeSource.endsWith('CST-KF01-opening-sheet.png') && result.bridgeWidth >= viewport.width * .88, `opacity ${result.bridgeOpacity} · ${result.bridgeSource} · ${result.bridgeWidth}px`);
      }
      if (state.name === 'coda-handoff') {
        check(`${viewport.name} tangible handoff labels`, result.labels.length === 3 && ['customer mockup','baker sheet','true-size plaque'].every(label=>result.labels.includes(label)), result.labels.join(' / '));
      }
      priorRenders = result.renders;
      await screenshot(state.name);
    }

    const transitionPeaks = [];
    for (const transition of [
      { progress: .34, groups: ['forms', 'assembly'], resident: 20, textureMax: 56 },
      { progress: .72, groups: ['assembly', 'handoff'], resident: 15, textureMax: 42 },
    ]) {
      await scrollScene('.dimensional-coda', transition.progress);
      const resident = await waitFor(`window.__cakeStudioCoda?.residentModelGroups?.length===2 && ${JSON.stringify(transition.groups)}.every(group=>window.__cakeStudioCoda.residentModelGroups.includes(group))`, 30_000);
      await delay(180);
      const peak = await evaluate(`({
        progress:window.__cakeStudioCoda?.progress,
        groups:window.__cakeStudioCoda?.residentModelGroups,
        resident:window.__cakeStudioCoda?.modelsResident,
        gpuTextures:window.__cakeStudioCoda?.gpuTextures,
        drawCalls:window.__cakeStudioCoda?.drawCalls,
        triangles:window.__cakeStudioCoda?.triangles
      })`);
      transitionPeaks.push(peak);
      check(`${viewport.name} transition ${transition.progress} residency`, resident && peak.resident === transition.resident && transition.groups.every((group) => peak.groups.includes(group)), JSON.stringify(peak));
      check(`${viewport.name} transition ${transition.progress} peak bounded`, peak.gpuTextures <= transition.textureMax && peak.drawCalls <= 240 && peak.triangles <= 4_500_000, `${peak.gpuTextures}/${transition.textureMax} textures Â· ${peak.drawCalls} calls Â· ${peak.triangles} triangles`);
    }

    await scrollScene('.dimensional-coda', .22);
    const codaReversed = await waitFor(`window.__cakeStudioCoda?.act==='forms' && Math.abs(window.__cakeStudioCoda.progress-.22)<.025 && window.__cakeStudioCoda?.residentModelGroups?.length===1 && window.__cakeStudioCoda.residentModelGroups[0]==='forms'`, 30_000);
    const codaReverseState = await evaluate(`({act:window.__cakeStudioCoda?.act,progress:window.__cakeStudioCoda?.progress,renders:window.__cakeStudioCoda?.renders,groups:window.__cakeStudioCoda?.residentModelGroups,resident:window.__cakeStudioCoda?.modelsResident,loaded:window.__cakeStudioCoda?.modelsLoaded,playAttempts:window.__cakePlayAttempts})`);
    check(`${viewport.name} dimensional reverse scrub`, codaReversed && codaReverseState.act === 'forms' && codaReverseState.renders > priorRenders && codaReverseState.resident === 10 && codaReverseState.loaded === 24, `${codaReverseState.act} @ ${codaReverseState.progress} · ${codaReverseState.resident} resident / ${codaReverseState.loaded} loaded · render ${codaReverseState.renders}`);
    check(`${viewport.name} dimensional reverse remains silent`, codaReverseState.playAttempts === 0, `${codaReverseState.playAttempts} play attempts`);

    await evaluate(`document.documentElement.lang==='en' && document.querySelector('[data-lang-toggle]').click()`);
    await delay(250);
    const arabic = await evaluate(`(() => {
      const ar=document.querySelector('[data-object-act="forms"] h2 .L.ar');
      const en=document.querySelector('[data-object-act="forms"] h2 .L.en');
      const codaAr=[...document.querySelectorAll('.dimensional-coda .L.ar')];
      const codaEn=[...document.querySelectorAll('.dimensional-coda .L.en')];
      return {
        lang:document.documentElement.lang,
        dir:document.documentElement.dir,
        ar:getComputedStyle(ar).display,
        en:getComputedStyle(en).display,
        overflow:document.documentElement.scrollWidth-innerWidth,
        codaAr:codaAr.length,
        codaEn:codaEn.length,
        codaArVisible:codaAr.every(node=>getComputedStyle(node).display!=='none'),
        codaEnHidden:codaEn.every(node=>getComputedStyle(node).display==='none')
      };
    })()`);
    check(`${viewport.name} Arabic direction`, arabic.lang === 'ar' && arabic.dir === 'rtl' && arabic.ar !== 'none' && arabic.en === 'none', `${arabic.lang}/${arabic.dir} · ar=${arabic.ar} en=${arabic.en}`);
    check(`${viewport.name} Arabic coda parity`, arabic.codaAr === arabic.codaEn && arabic.codaAr >= 18 && arabic.codaArVisible && arabic.codaEnHidden, `${arabic.codaAr} Arabic / ${arabic.codaEn} English labels · Arabic visible=${arabic.codaArVisible} · English hidden=${arabic.codaEnHidden}`);
    check(`${viewport.name} Arabic fit`, arabic.overflow <= 1, `${arabic.overflow}px overflow`);
    await screenshot('coda-forms-ar');

    const recoveredMediaAborts = [];
    const genuineFailures = [];
    for (const failure of failedRequests) {
      const abandonedMediaRange = ['net::ERR_INVALID_HTTP_RESPONSE', 'net::ERR_CONTENT_LENGTH_MISMATCH'].includes(failure.errorText)
        && /\.mp4(?:$|\?)/i.test(failure.url);
      if (abandonedMediaRange) {
        try {
          const probe = await fetch(failure.url, { headers: { Range: 'bytes=0-63' } });
          const bytes = await probe.arrayBuffer();
          if (probe.status === 206 && probe.headers.get('accept-ranges') === 'bytes' && bytes.byteLength === 64) {
            recoveredMediaAborts.push(failure);
            continue;
          }
        } catch {}
      }
      genuineFailures.push(failure);
    }
    const mediaErrors = await evaluate(`[...document.querySelectorAll('video')].filter(video => video.error).map(video => ({code:video.error.code,message:video.error.message,src:video.currentSrc}))`);
    observations[viewport.name] = { basics, filmStates: stateResults, reverseState, codaStates: codaResults, transitionPeaks, codaReverseState, arabic, network: { badResponses, genuineFailures, recoveredMediaAborts, mediaErrors } };
    check(`${viewport.name} console clean`, consoleErrors.length === 0 && pageErrors.length === 0, `${consoleErrors.length} console / ${pageErrors.length} page errors`);
    check(`${viewport.name} network clean`, badResponses.length === 0 && genuineFailures.length === 0 && mediaErrors.length === 0, `${badResponses.length} bad responses / ${genuineFailures.length} genuine failures / ${mediaErrors.length} media errors · ${recoveredMediaAborts.length} abandoned ranges re-probed 206`);
    await cdp.send('Target.closeTarget', { targetId });
  }
} finally {
  cdp?.close();
  if (chrome?.child && chrome.child.exitCode === null) {
    chrome.child.kill('SIGTERM');
    await Promise.race([
      new Promise((resolveExit) => chrome.child.once('exit', resolveExit)),
      delay(2_000),
    ]);
    if (chrome.child.exitCode === null) chrome.child.kill('SIGKILL');
  }
  await rm(profile, { recursive: true, force: true });
}

const report = {
  schema: 'cake-studio-browser-verification/v3',
  generatedAt: new Date().toISOString(),
  url: baseUrl,
  sabotage,
  checks,
  failures,
  observations,
};
await writeFile(join(outputRoot, sabotage ? 'browser-sabotage.json' : 'browser-verification.json'), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`Cake Studio browser gate RED (${failures.length}/${checks.length} failed).`);
  process.exit(1);
}
console.log(`Cake Studio browser gate GREEN: ${checks.length}/${checks.length} live checks passed.`);
