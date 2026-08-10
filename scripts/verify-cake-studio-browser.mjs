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
    '--disable-gpu',
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
    await delay(350);

    const basics = await evaluate(`(() => ({
      title: document.title,
      figures: document.querySelectorAll('#cake-reel .shot-data figure').length,
      videos: document.querySelectorAll('#cake-reel video').length,
      version: document.body.dataset.version,
      overflow: document.documentElement.scrollWidth - innerWidth,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir
    }))()`);
    check(`${viewport.name} page identity`, basics.title.includes('The Edible Compiler') && basics.version === '1.0.0', `${basics.title} · ${basics.version}`);
    check(`${viewport.name} 50-shot DOM`, basics.figures === 50 && basics.videos === 2, `${basics.figures} figures / ${basics.videos} buffers`);
    check(`${viewport.name} horizontal fit`, basics.overflow <= 1, `${basics.overflow}px overflow`);

    if (sabotage) {
      const applied = await evaluate(`(() => {
        const frame=document.querySelector('.film-frame');
        frame.dataset.browserSabotage='offset';
        frame.style.transform='translateX(180px)';
        return frame.dataset.browserSabotage==='offset' && getComputedStyle(frame).transform!=='none';
      })()`);
      check('browser sabotage applied', applied, 'film frame translated 180px in runtime only');
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
      { name: 'film-01', progress: .01, shot: 1, time: 2.5 },
      { name: 'film-35', progress: .69, shot: 35, time: 2.5 },
      { name: 'film-50', progress: .99, shot: 50, time: 2.5 },
    ];
    const stateResults = [];
    for (const state of filmStates) {
      await scrollScene('#cake-reel', state.progress);
      const ready = await waitFor(`(() => {
        const scene=document.getElementById('cake-reel');
        const active=scene.querySelector('video.on');
        return scene.dataset.currentShot==='${state.shot}' && active && active.readyState>=2;
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
      check(`${viewport.name} ${state.name} ready`, ready && result.readyState >= 2 && result.seekable === 1, `${result.clip} · ready ${result.readyState} · seekable ${result.seekable}`);
      check(`${viewport.name} ${state.name} identity`, result.shot === state.shot && result.activeVideos === 1, `shot ${result.shot} · ${result.activeVideos} active buffer`);
      check(`${viewport.name} ${state.name} scrub time`, Math.abs(result.time - state.time) < .7, `${result.time.toFixed(3)}s / expected ~${state.time.toFixed(1)}s`);
      check(`${viewport.name} ${state.name} picture contained`, result.contained && result.captionClear && result.objectFit === 'contain', `${JSON.stringify(result.frame)} · cue top ${result.cue.top}`);
      check(`${viewport.name} ${state.name} never autoplayed`, result.paused && result.playAttempts === 0, `paused=${result.paused} · play attempts=${result.playAttempts}`);
      await screenshot(state.name);
    }

    await scrollScene('#cake-reel', .69);
    const reversed = await waitFor(`document.getElementById('cake-reel').dataset.currentShot==='35'`, 10_000);
    const reverseState = await evaluate(`(() => { const v=document.querySelector('#cake-reel video.on'); return {shot:Number(document.getElementById('cake-reel').dataset.currentShot),time:v?.currentTime ?? -1,playAttempts:window.__cakePlayAttempts}; })()`);
    check(`${viewport.name} reverse scrub`, reversed && reverseState.shot === 35 && Math.abs(reverseState.time - 2.5) < .8, `shot ${reverseState.shot} @ ${reverseState.time.toFixed(3)}s`);
    check(`${viewport.name} reverse remains silent`, reverseState.playAttempts === 0, `${reverseState.playAttempts} play attempts`);

    await scrollScene('.measure', .64);
    await screenshot('measure');
    await scrollScene('.ledger', .66);
    await screenshot('ledger');
    await scrollScene('.compile', .72);
    await screenshot('compile');

    await evaluate(`document.documentElement.lang==='en' && document.querySelector('[data-lang-toggle]').click()`);
    await delay(250);
    const arabic = await evaluate(`(() => {
      const ar=document.querySelector('.compile .code-caption .L.ar');
      const en=document.querySelector('.compile .code-caption .L.en');
      return {lang:document.documentElement.lang,dir:document.documentElement.dir,ar:getComputedStyle(ar).display,en:getComputedStyle(en).display,overflow:document.documentElement.scrollWidth-innerWidth};
    })()`);
    check(`${viewport.name} Arabic direction`, arabic.lang === 'ar' && arabic.dir === 'rtl' && arabic.ar !== 'none' && arabic.en === 'none', `${arabic.lang}/${arabic.dir} · ar=${arabic.ar} en=${arabic.en}`);
    check(`${viewport.name} Arabic fit`, arabic.overflow <= 1, `${arabic.overflow}px overflow`);
    await screenshot('compile-ar');

    observations[viewport.name] = { basics, filmStates: stateResults, reverseState, arabic };
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
  schema: 'cake-studio-browser-verification/v1',
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
