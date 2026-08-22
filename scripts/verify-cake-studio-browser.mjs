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
    cdp.onEvent((event) => {
      if (event.sessionId !== sessionId) return;
      if (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error') {
        consoleErrors.push(event.params.args.map((item) => item.value ?? item.description ?? '').join(' '));
      }
      if (event.method === 'Runtime.exceptionThrown') pageErrors.push(event.params.exceptionDetails.text);
      if (event.method === 'Network.responseReceived' && event.params.response.status >= 400) {
        badResponses.push(`${event.params.response.status} ${event.params.response.url}`);
      }
      if (event.method === 'Network.loadingFailed' && !event.params.canceled && event.params.errorText !== 'net::ERR_ABORTED') {
        failedRequests.push(event.params.errorText);
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
      cameraVersion: window.__cakeStudioDirector?.cameraVersion ?? '',
      cameraShots: window.__cakeStudioDirector?.cameraScore?.length ?? 0,
      cameraLoopLocked: window.__cakeStudioDirector?.cameraLoopLocked ?? false,
      cameraTauMs: window.__cakeStudioDirector?.cameraTauMs ?? -1,
      cameraSnapScoreUnits: window.__cakeStudioDirector?.cameraSnapScoreUnits ?? -1,
      cameraMaxScoreUnitsPerSecond: window.__cakeStudioDirector?.cameraMaxScoreUnitsPerSecond ?? -1,
      fastWeight: window.__cakeStudioDirector?.weights?.[8] ?? -1,
      choiceWeight: window.__cakeStudioDirector?.weights?.[16] ?? -1,
      errorWeight: window.__cakeStudioDirector?.weights?.[26] ?? -1,
      rejectWeight: window.__cakeStudioDirector?.weights?.[37] ?? -1,
      loopWeight: window.__cakeStudioDirector?.weights?.[49] ?? -1,
      codaVersion: window.__cakeStudioCoda?.version ?? '',
      codaReady: window.__cakeStudioCoda?.ready ?? false,
      webgl: window.__cakeStudioCoda?.webglAvailable ?? false,
      engine: window.__cakeStudioCoda?.engine ?? '',
      assetMode: window.__cakeStudioCoda?.assetMode ?? '',
      assetStatus: window.__cakeStudioCoda?.assetStatus ?? '',
      assetExpected: window.__cakeStudioCoda?.expectedAssets ?? -1,
      assetLoaded: window.__cakeStudioCoda?.loadedAssets ?? -1,
      assetFailed: window.__cakeStudioCoda?.failedAssets ?? -1,
      assetManifestEnabled: window.__cakeStudioCoda?.manifestEnabled ?? true,
      canvases: document.querySelectorAll('[data-cake-canvas]').length,
      overflow: document.documentElement.scrollWidth - innerWidth,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir
    }))()`);
    check(`${viewport.name} page identity`, basics.title.includes('The Cake Is Made Twice') && basics.version === '1.2.0', `${basics.title} · ${basics.version}`);
    check(`${viewport.name} 50-shot DOM`, basics.figures === 50 && basics.videos === 2, `${basics.figures} figures / ${basics.videos} buffers`);
    check(
      `${viewport.name} directed score`,
      basics.directorVersion === '1.2.0'
        && basics.directorWeights === 50
        && basics.cameraVersion === '1.0.0'
        && basics.cameraShots === 50
        && basics.cameraLoopLocked
        && basics.cameraTauMs === 140
        && basics.cameraSnapScoreUnits === 1.5
        && basics.cameraMaxScoreUnitsPerSecond > 0
        && basics.fastWeight < basics.choiceWeight
        && [basics.choiceWeight, basics.errorWeight, basics.rejectWeight, basics.loopWeight].every((weight) => weight >= 1.3),
      `v${basics.directorVersion} · camera ${basics.cameraVersion}/${basics.cameraShots} @ ${basics.cameraTauMs}ms, snap ${basics.cameraSnapScoreUnits}, max ${basics.cameraMaxScoreUnitsPerSecond}/s · fast ${basics.fastWeight} · choice/error/reject/loop ${basics.choiceWeight}/${basics.errorWeight}/${basics.rejectWeight}/${basics.loopWeight}`,
    );
    check(
      `${viewport.name} staged real-asset fallback`,
      basics.assetMode === 'proxy'
        && basics.assetStatus === 'awaiting-generated-glb'
        && basics.assetExpected === 14
        && basics.assetLoaded === 0
        && basics.assetFailed === 0
        && !basics.assetManifestEnabled,
      `${basics.assetMode}/${basics.assetStatus} · ${basics.assetLoaded}/${basics.assetExpected} loaded · ${basics.assetFailed} failed · enabled=${basics.assetManifestEnabled}`,
    );
    check(
      `${viewport.name} dimensional engine`,
      basics.codaVersion === '1.2.0' && basics.codaReady && basics.webgl && basics.engine.startsWith('three-r') && basics.canvases === 1,
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
      await evaluate(`(() => {
        const scene=document.querySelector(${JSON.stringify(selector)});
        const top=scene.getBoundingClientRect().top+scrollY;
        const travel=Math.max(0,scene.offsetHeight-innerHeight);
        scrollTo(0,top+travel*${progress});
        dispatchEvent(new Event('scroll'));
        return true;
      })()`);
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
        const picture=scene.querySelector('.picture-zone').getBoundingClientRect();
        const cue=scene.querySelector('.cue').getBoundingClientRect();
        const active=scene.querySelector('video.on');
        const expected=window.__cakeStudioDirector.cameraForShot(${state.shot},.5);
        const cameraX=Number.parseFloat(scene.style.getPropertyValue('--camera-x'));
        const cameraY=Number.parseFloat(scene.style.getPropertyValue('--camera-y'));
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
          objectPosition:active ? getComputedStyle(active).objectPosition : '',
          cameraX,
          cameraY,
          cameraExpected:expected,
          cameraIntent:scene.dataset.cameraIntent ?? '',
          contained:frame.left>=-1 && frame.right<=innerWidth+1 && frame.top>=-1 && frame.bottom<=innerHeight+1,
          captionClear:cue.top>=frame.bottom-1,
          fullBleed:Math.abs(frame.left-picture.left)<1 && Math.abs(frame.right-picture.right)<1 && Math.abs(frame.top-picture.top)<1 && Math.abs(frame.bottom-picture.bottom)<1,
          frame:{left:frame.left,right:frame.right,top:frame.top,bottom:frame.bottom,width:frame.width,height:frame.height},
          picture:{left:picture.left,right:picture.right,top:picture.top,bottom:picture.bottom,width:picture.width,height:picture.height},
          cue:{top:cue.top,bottom:cue.bottom}
        };
      })()`);
      stateResults.push(result);
      check(`${viewport.name} ${state.name} ready`, ready && result.readyState >= 1 && result.seekable === 1, `${result.clip} · ready ${result.readyState} · seekable ${result.seekable}`);
      check(`${viewport.name} ${state.name} identity`, result.shot === state.shot && result.activeVideos === 1, `shot ${result.shot} · ${result.activeVideos} active buffer`);
      check(`${viewport.name} ${state.name} direction`, result.rhythm === state.rhythm && result.weight > 0 && result.directorNote.length > 24, `${result.chapterKey}/${result.rhythm} · weight ${result.weight} · ${result.directorNote}`);
      check(`${viewport.name} ${state.name} scrub time`, Math.abs(result.time - state.time) < .7, `${result.time.toFixed(3)}s / expected ~${state.time.toFixed(1)}s`);
      check(`${viewport.name} ${state.name} full-bleed picture`, result.contained && result.captionClear && result.fullBleed && result.objectFit === 'cover', `${JSON.stringify(result.frame)} · picture ${JSON.stringify(result.picture)} · cue top ${result.cue.top} · ${result.objectFit}`);
      check(`${viewport.name} ${state.name} directed camera`, Math.abs(result.cameraX-result.cameraExpected.x)<.06 && Math.abs(result.cameraY-result.cameraExpected.y)<.06 && result.cameraIntent.length>8, `${result.cameraX.toFixed(2)}% ${result.cameraY.toFixed(2)}% · expected ${result.cameraExpected.x.toFixed(2)}% ${result.cameraExpected.y.toFixed(2)}% · ${result.cameraIntent}`);
      check(`${viewport.name} ${state.name} never autoplayed`, result.paused && result.playAttempts === 0, `paused=${result.paused} · play attempts=${result.playAttempts}`);
      await screenshot(state.name);
    }

    const cameraProof = await evaluate(`(() => {
      const director=window.__cakeStudioDirector;
      const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
      const joints=Array.from({length:50},(_,index)=>distance(
        director.cameraForShot(index+1,1),
        director.cameraForShot((index+1)%50+1,0)
      ));
      const proofShots=[1,7,17,20,28,33,38,43,50].map(shot=>{
        const start=director.cameraForShot(shot,0);
        const middle=director.cameraForShot(shot,.5);
        const end=director.cameraForShot(shot,1);
        return {shot,start,middle,end,travel:distance(start,middle)+distance(middle,end)};
      });
      return {
        joints,
        maxJoint:Math.max(...joints),
        proofShots,
        minimumDirectedTravel:Math.min(...proofShots.map(item=>item.travel)),
        distinctIntents:new Set(director.cameraScore.map(shot=>shot.intent)).size,
      };
    })()`);
    check(`${viewport.name} camera endpoint locks`, cameraProof.maxJoint < .001, `50/50 joins · max discontinuity ${cameraProof.maxJoint.toFixed(5)}`);
    check(`${viewport.name} camera follows scene actions`, cameraProof.minimumDirectedTravel >= 8 && cameraProof.distinctIntents === 50, `minimum proof-shot travel ${cameraProof.minimumDirectedTravel.toFixed(2)} · ${cameraProof.distinctIntents}/50 distinct intents`);

    const motionStartProgress = await evaluate(`window.__cakeStudioDirector.progressForShot(28,.2)`);
    const motionTargetProgress = await evaluate(`window.__cakeStudioDirector.progressForShot(28,.5)`);
    await scrollScene('#cake-reel', motionStartProgress);
    await waitFor(`document.getElementById('cake-reel').dataset.cameraState==='idle'`, 5_000);
    await waitFor(`(() => { const v=document.querySelector('#cake-reel video.on'); return document.getElementById('cake-reel').dataset.currentShot==='28' && v?.readyState>=2 && !v.seeking; })()`, 20_000);
    const stepResponse = await evaluate(`(() => new Promise(resolve => {
      const scene=document.getElementById('cake-reel');
      const director=window.__cakeStudioDirector;
      const top=scene.getBoundingClientRect().top+scrollY;
      const travel=Math.max(0,scene.offsetHeight-innerHeight);
      const samples=[];
      const started=performance.now();
      const read=now=>{
        const video=scene.querySelector('video.on');
        const shot=Number(scene.dataset.currentShot);
        const fraction=Number.parseFloat(scene.style.getPropertyValue('--f'));
        const x=Number.parseFloat(scene.style.getPropertyValue('--camera-x'));
        const y=Number.parseFloat(scene.style.getPropertyValue('--camera-y'));
        const expected=director.cameraForShot(shot,fraction);
        samples.push({
          ms:now-started,
          journey:Number.parseFloat(scene.style.getPropertyValue('--journey')),
          shot,
          fraction,
          x,
          y,
          expectedX:expected.x,
          expectedY:expected.y,
          time:video?.currentTime ?? 0,
          duration:video?.duration ?? 5,
          seeking:video?.seeking ?? false,
          cameraState:scene.dataset.cameraState,
        });
      };
      read(started);
      scrollTo(0,top+travel*${motionTargetProgress});
      dispatchEvent(new Event('scroll'));
      const frame=now=>{
        read(now);
        if(now-started<850) requestAnimationFrame(frame);
        else resolve({samples,target:director.cameraForShot(28,.5),targetFraction:.5});
      };
      requestAnimationFrame(frame);
    }))()`);
    const distance = (first, second) => Math.hypot(first.x - second.x, first.y - second.y);
    const sortedMedian = (values) => {
      const ordered = [...values].sort((a, b) => a - b);
      if (!ordered.length) return 0;
      const middle = Math.floor(ordered.length / 2);
      return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
    };
    const stepSamples = stepResponse.samples;
    const stepStart = stepSamples[0];
    const stepTarget = stepResponse.target;
    const cameraMagnitude = distance(stepStart, stepTarget);
    const cameraDeltas = stepSamples.slice(1).map((sample, index) => distance(sample, stepSamples[index]));
    const clockDeltas = stepSamples.slice(1).map((sample, index) => Math.abs(sample.time - stepSamples[index].time));
    const cameraMovementFrames = cameraDeltas.filter(delta => delta >= Math.max(.01, cameraMagnitude * .002)).length;
    const clockMovementFrames = clockDeltas.filter(delta => delta >= .004).length;
    const maxCameraShare = Math.max(...cameraDeltas) / Math.max(cameraMagnitude, 1e-9);
    const targetTime = stepSamples.at(-1).duration * .5;
    const clockMagnitude = Math.abs(targetTime - stepStart.time);
    const maxClockShare = Math.max(...clockDeltas) / Math.max(clockMagnitude, 1e-9);
    const cameraCross = stepSamples.findIndex(sample => distance(stepStart, sample) >= cameraMagnitude * .5);
    const clockDirection = Math.sign(targetTime - stepStart.time) || 1;
    const clockCross = stepSamples.findIndex(sample => clockDirection * (sample.time - stepStart.time) >= clockMagnitude * .5);
    const finalStep = stepSamples.at(-1);
    const cameraSourceError = Math.max(...stepSamples.map(sample => Math.hypot(sample.x - sample.expectedX, sample.y - sample.expectedY)));
    check(`${viewport.name} weighted camera spreads motion`, cameraMovementFrames >= 8 && clockMovementFrames >= 6, `${cameraMovementFrames} camera frames · ${clockMovementFrames} decoded-clock frames`);
    check(`${viewport.name} weighted camera has no teleport`, maxCameraShare <= .35 && maxClockShare <= .35, `largest camera ${maxCameraShare.toFixed(3)} · clock ${maxClockShare.toFixed(3)} of step`);
    check(`${viewport.name} camera and film share one playhead`, cameraSourceError < .08 && cameraCross >= 0 && clockCross >= 0 && Math.abs(cameraCross - clockCross) <= 4, `source error ${cameraSourceError.toFixed(4)} · halfway frame camera ${cameraCross} / clock ${clockCross}`);
    check(`${viewport.name} weighted camera settles`, distance(finalStep, stepTarget) <= .5 && Math.abs(finalStep.fraction - .5) <= .005, `camera error ${distance(finalStep, stepTarget).toFixed(3)} · fraction ${finalStep.fraction.toFixed(4)}`);

    await scrollScene('#cake-reel', motionStartProgress);
    await waitFor(`document.getElementById('cake-reel').dataset.cameraState==='idle'`, 5_000);
    const burstTargets = await evaluate(`[.25,.30,.35,.40,.45].map(f=>window.__cakeStudioDirector.progressForShot(28,f))`);
    const glideResponse = await evaluate(`(() => new Promise(resolve => {
      const scene=document.getElementById('cake-reel');
      const top=scene.getBoundingClientRect().top+scrollY;
      const travel=Math.max(0,scene.offsetHeight-innerHeight);
      const targets=${JSON.stringify(burstTargets)};
      const cadence=70;
      const inputEnd=(targets.length-1)*cadence;
      const samples=[];
      const started=performance.now();
      const read=now=>samples.push({
        ms:now-started,
        x:Number.parseFloat(scene.style.getPropertyValue('--camera-x')),
        y:Number.parseFloat(scene.style.getPropertyValue('--camera-y')),
        fraction:Number.parseFloat(scene.style.getPropertyValue('--f')),
        journey:Number.parseFloat(scene.style.getPropertyValue('--journey')),
        state:scene.dataset.cameraState,
      });
      read(started);
      targets.forEach((target,index)=>setTimeout(()=>{
        scrollTo(0,top+travel*target);
        dispatchEvent(new Event('scroll'));
      },index*cadence));
      const frame=now=>{
        read(now);
        if(now-started<inputEnd+720) requestAnimationFrame(frame);
        else resolve({samples,inputEnd,targetFraction:.45,targetProgress:targets.at(-1)});
      };
      requestAnimationFrame(frame);
    }))()`);
    const glideSamples = glideResponse.samples;
    const glideDeltas = glideSamples.slice(1).map((sample, index) => ({
      ms: sample.ms,
      delta: distance(sample, glideSamples[index]),
    }));
    const movingDeltas = glideDeltas
      .filter(sample => sample.ms >= 70 && sample.ms <= glideResponse.inputEnd + 170 && sample.delta > .002)
      .map(sample => sample.delta);
    const medianDelta = sortedMedian(movingDeltas);
    const maximumDelta = Math.max(...movingDeltas, 0);
    const postStopFrames = glideDeltas.filter(sample => sample.ms > glideResponse.inputEnd + 34 && sample.ms < glideResponse.inputEnd + 300 && sample.delta > .006).length;
    const glideFinal = glideSamples.at(-1);
    check(`${viewport.name} steady scroll camera is even`, medianDelta > .002 && maximumDelta <= medianDelta * 3.2, `max ${maximumDelta.toFixed(4)} · median ${medianDelta.toFixed(4)} · ${(maximumDelta / Math.max(medianDelta, 1e-9)).toFixed(2)}x`);
    check(`${viewport.name} camera glides after input stops`, postStopFrames >= 2, `${postStopFrames} moving frames after final input`);
    check(`${viewport.name} glide converges to target`, Math.abs(glideFinal.fraction - glideResponse.targetFraction) <= .005, `final fraction ${glideFinal.fraction.toFixed(4)} · target ${glideResponse.targetFraction.toFixed(2)}`);
    await waitFor(`document.getElementById('cake-reel').dataset.cameraState==='idle'`, 5_000);
    const parkedState = await evaluate(`document.getElementById('cake-reel').dataset.cameraState`);
    check(`${viewport.name} camera loop parks`, parkedState === 'idle', parkedState);

    const reverseProgress = await evaluate(`window.__cakeStudioDirector.progressForShot(17, .5)`);
    await scrollScene('#cake-reel', reverseProgress);
    const reversed = await waitFor(`document.getElementById('cake-reel').dataset.currentShot==='17'`, 10_000);
    const reverseState = await evaluate(`(() => { const scene=document.getElementById('cake-reel'); const v=scene.querySelector('video.on'); return {shot:Number(scene.dataset.currentShot),time:v?.currentTime ?? -1,playAttempts:window.__cakePlayAttempts,cameraX:Number.parseFloat(scene.style.getPropertyValue('--camera-x')),cameraY:Number.parseFloat(scene.style.getPropertyValue('--camera-y'))}; })()`);
    check(`${viewport.name} reverse scrub`, reversed && reverseState.shot === 17 && Math.abs(reverseState.time - 2.5) < .8, `shot ${reverseState.shot} @ ${reverseState.time.toFixed(3)}s`);
    const forwardShot17 = stateResults.find(result => result.shot === 17);
    check(`${viewport.name} reverse restores camera`, Math.abs(reverseState.cameraX-forwardShot17.cameraX)<.06 && Math.abs(reverseState.cameraY-forwardShot17.cameraY)<.06, `${reverseState.cameraX.toFixed(2)}% ${reverseState.cameraY.toFixed(2)}% · forward ${forwardShot17.cameraX.toFixed(2)}% ${forwardShot17.cameraY.toFixed(2)}%`);
    check(`${viewport.name} reverse remains silent`, reverseState.playAttempts === 0, `${reverseState.playAttempts} play attempts`);

    const codaStates = [
      { name: 'coda-bridge', progress: .01, act: 'forms', copyRequired: false },
      { name: 'coda-forms', progress: .22, act: 'forms', copyRequired: true },
      { name: 'coda-assembly', progress: .52, act: 'assembly', copyRequired: true },
      { name: 'coda-handoff', progress: .84, act: 'handoff', copyRequired: true },
    ];
    const codaResults = [];
    let priorRenders = -1;
    for (const state of codaStates) {
      await scrollScene('.dimensional-coda', state.progress);
      const rendered = await waitFor(`Math.abs((window.__cakeStudioCoda?.progress ?? -1)-${state.progress})<.025 && window.__cakeStudioCoda?.act==='${state.act}'`, 12_000);
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
        let pixelNonZero=0;
        let pixelRange=0;
        let pixelSamples=0;
        try {
          const gl=canvas.getContext('webgl2') || canvas.getContext('webgl');
          glVersion=gl?.getParameter(gl.VERSION) ?? '';
          if (gl) {
            const size=40;
            const pixels=new Uint8Array(size*size*4);
            let low=255;
            let high=0;
            for (const xRatio of [.2,.5,.8]) {
              for (const yRatio of [.2,.5,.8]) {
                const x=Math.max(0,Math.min(canvas.width-size,Math.floor(canvas.width*xRatio-size/2)));
                const y=Math.max(0,Math.min(canvas.height-size,Math.floor(canvas.height*yRatio-size/2)));
                gl.readPixels(x,y,size,size,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
                for (let index=0;index<pixels.length;index+=4) {
                  const alpha=pixels[index+3];
                  if (alpha>4) pixelNonZero+=1;
                  const light=(pixels[index]+pixels[index+1]+pixels[index+2])/3;
                  low=Math.min(low,light);
                  high=Math.max(high,light);
                  pixelSamples+=1;
                }
              }
            }
            pixelRange=high-low;
          }
        } catch {}
        return {
          ready:runtime?.ready ?? false,
          webgl:runtime?.webglAvailable ?? false,
          engine:runtime?.engine ?? '',
          progress:runtime?.progress ?? -1,
          act:runtime?.act ?? '',
          forms:runtime?.readyForms ?? 0,
          parts:runtime?.controlledParts ?? 0,
          outputs:runtime?.outputs ?? 0,
          renders:runtime?.renders ?? 0,
          drawCalls:runtime?.drawCalls ?? 0,
          triangles:runtime?.triangles ?? 0,
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
          pixelNonZero,
          pixelSamples,
          pixelRange,
          glVersion,
          playAttempts:window.__cakePlayAttempts
        };
      })()`);
      codaResults.push(result);
      check(`${viewport.name} ${state.name} state`, rendered && result.ready && result.webgl && result.act === state.act && Math.abs(result.progress - state.progress) < .025, `${result.act} @ ${result.progress} · ${result.engine}`);
      check(`${viewport.name} ${state.name} object contract`, result.forms === 9 && result.parts === 4 && result.outputs === 3, `${result.forms} forms · ${result.parts} parts · ${result.outputs} outputs`);
      check(`${viewport.name} ${state.name} real render`, result.canvasDisplay !== 'none' && result.drawCalls >= 4 && result.triangles >= 500 && result.pixelNonZero > 120 && result.pixelRange > 8 && result.glVersion.includes('WebGL'), `${result.glVersion} · ${result.drawCalls} calls · ${result.triangles} triangles · pixels ${result.pixelNonZero}/${result.pixelSamples} range ${result.pixelRange.toFixed(1)}`);
      check(`${viewport.name} ${state.name} composition`, result.canvasContained && (!state.copyRequired || (result.actPresence > .3 && result.actContained)), `canvas=${result.canvasContained} · copy presence=${result.actPresence.toFixed(3)} · copy contained=${result.actContained}`);
      check(`${viewport.name} ${state.name} bounded rendering`, result.pixelRatio > 0 && result.pixelRatio <= 1.5 && result.renders > priorRenders, `${result.canvasWidth}×${result.canvasHeight} @ ${result.pixelRatio}x · render ${result.renders}`);
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

    await scrollScene('.dimensional-coda', .22);
    const codaReversed = await waitFor(`window.__cakeStudioCoda?.act==='forms' && Math.abs(window.__cakeStudioCoda.progress-.22)<.025`, 10_000);
    const codaReverseState = await evaluate(`({act:window.__cakeStudioCoda?.act,progress:window.__cakeStudioCoda?.progress,renders:window.__cakeStudioCoda?.renders,playAttempts:window.__cakePlayAttempts})`);
    check(`${viewport.name} dimensional reverse scrub`, codaReversed && codaReverseState.act === 'forms' && codaReverseState.renders > priorRenders, `${codaReverseState.act} @ ${codaReverseState.progress} · render ${codaReverseState.renders}`);
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

    observations[viewport.name] = { basics, filmStates: stateResults, reverseState, codaStates: codaResults, codaReverseState, arabic };
    check(`${viewport.name} console clean`, consoleErrors.length === 0 && pageErrors.length === 0, `${consoleErrors.length} console / ${pageErrors.length} page errors`);
    check(`${viewport.name} network clean`, badResponses.length === 0 && failedRequests.length === 0, `${badResponses.length} bad responses / ${failedRequests.length} failed requests`);
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
