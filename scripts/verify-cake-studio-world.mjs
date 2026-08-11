#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import process from 'node:process';

const root = resolve(import.meta.dirname, '..');
const worldRoot = join(root, 'public', 'worlds');
const pagePath = join(worldRoot, 'cake-studio.html');
const cssPath = join(worldRoot, 'cake-studio.css');
const scriptPath = join(worldRoot, 'cake-studio.js');
const codaScriptPath = join(worldRoot, 'cake-studio-coda.js');
const codaLoaderPath = join(worldRoot, 'cake-studio-coda-loader.js');
const threePath = join(worldRoot, 'cake-studio', 'three.module.js');
const threeCorePath = join(worldRoot, 'cake-studio', 'three.core.min.js');
const threeLicensePath = join(worldRoot, 'cake-studio', 'THREE-LICENSE.txt');
const manifestPath = join(worldRoot, 'cake-studio', 'manifest.json');
const ownerPackRoot = join(worldRoot, 'assets', 'cake-studio');
const opticalPromptPath = join(ownerPackRoot, 'wan-prompts', 'CST-A-050-V2-OPTICAL-BRIDGE.txt');
const lobbyPath = join(worldRoot, 'index.html');
const sabotage = process.argv.includes('--sabotage');

const checks = [];
const failures = [];
const check = (name, condition, detail) => {
  checks.push({ name, pass: Boolean(condition), detail: String(detail) });
  console.log(`${condition ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
  if (!condition) failures.push(`${name}: ${detail}`);
};

const originalPage = await readFile(pagePath, 'utf8');
let page = originalPage;
if (sabotage) {
  page = page.replace(
    'data-clip="cake-studio/clips/CST-050.mp4"',
    'data-clip="cake-studio/clips/CST-XXX.mp4"',
  );
  if (page === originalPage || page.includes('data-clip="cake-studio/clips/CST-050.mp4"')) {
    throw new Error('sabotage was requested but not applied');
  }
  console.log('SABOTAGE APPLIED: CST-050 was replaced in the in-memory page fixture.');
  const codaFixture = page;
  page = page.replace('data-cake-canvas', 'data-cake-flat');
  if (page === codaFixture || page.includes('data-cake-canvas')) {
    throw new Error('dimensional-coda sabotage was requested but not applied');
  }
  console.log('SABOTAGE APPLIED: the WebGL canvas contract was removed in memory.');
}

const readOptional = async (path) => {
  try { return await readFile(path, 'utf8'); } catch { return ''; }
};
const statOptional = async (path) => {
  try { return await stat(path); } catch { return null; }
};

const [css, originalScript, codaScript, threeFile, threeCoreFile, threeLicense, opticalPrompt, manifestRaw, clipsRaw, runLog, lobby] = await Promise.all([
  readFile(cssPath, 'utf8'),
  readFile(scriptPath, 'utf8'),
  readOptional(codaScriptPath),
  statOptional(threePath),
  statOptional(threeCorePath),
  readOptional(threeLicensePath),
  readOptional(opticalPromptPath),
  readFile(manifestPath, 'utf8'),
  readFile(join(ownerPackRoot, 'clips.json'), 'utf8'),
  readFile(join(ownerPackRoot, 'run-log.csv'), 'utf8'),
  readFile(lobbyPath, 'utf8'),
]);
const codaLoader = await readOptional(codaLoaderPath);
let script = originalScript;
if (sabotage) {
  script = script.replace('1.65, 1.85, 1.10', '1.65, 0.55, 1.10');
  if (script === originalScript || !script.includes('1.65, 0.55, 1.10')) {
    throw new Error('director-score sabotage was requested but not applied');
  }
  console.log('SABOTAGE APPLIED: the decisive shot-17 hold was flattened in memory.');
}
const manifest = JSON.parse(manifestRaw);
const ownerPack = JSON.parse(clipsRaw);

check('visible release badge', page.includes('v1.5 · WORLD 09') && page.includes('data-version="1.5.0"'), 'v1.5 / World 09');
check('shared cinema engine', page.includes('cinema.css?v=6') && page.includes('cinema.js?v=6'), 'cinema v6 linked');
check('page-local assets', page.includes('cake-studio.css?v=7') && page.includes('cake-studio.js?v=7'), 'directed CSS and JS linked');
check('dimensional coda module', page.includes('src="cake-studio-coda-loader.js?v=7"') && codaLoader.trim() === "import('./cake-studio-coda.js?v=7');" && codaScript.includes("import * as THREE from './cake-studio/three.module.js';"), 'full-motion local Three.js module linked');
check('one film scene', (page.match(/id="cake-reel"/g) ?? []).length === 1, 'single shared playhead');
check('two video buffers', (page.match(/<video\b/g) ?? []).length === 2, 'exactly two video elements');
const videoTags = [...page.matchAll(/<video\b[^>]*>/g)].map((match) => match[0]);
check('no autoplay markup', videoTags.every((tag) => !/\sautoplay(?:\s|=|>)/i.test(tag)), 'no autoplay attribute');
check('no play call', !/\.play\s*\(/.test(script), 'scroll seeks currentTime; play() absent');
check('same phone and desktop mode', !/pointer:\s*coarse|hover:\s*none|mode-chain|mode-still/.test(script), 'no mobile-lite branch');
check('contained film frame', /\.film-frame \.floor,[\s\S]*?object-fit:\s*contain/.test(css), 'whole 16:9 image remains visible');
check('captions outside picture', page.indexOf('<div class="film-frame"') < page.indexOf('<div class="cue"'), 'cue is a sibling after the frame');

const figureMatches = [...page.matchAll(/<figure\s+data-clip="([^"]+)"\s+data-poster="([^"]+)"[\s\S]*?<\/figure>/g)];
const figureClips = figureMatches.map((match) => match[1]);
const figurePosters = figureMatches.map((match) => match[2]);
const expectedClips = Array.from({ length: 50 }, (_, index) => `cake-studio/clips/CST-${String(index + 1).padStart(3, '0')}.mp4`);
const expectedPosters = Array.from({ length: 50 }, (_, index) => `cake-studio/posters/CST-${String(index + 1).padStart(3, '0')}.jpg`);
check('50 shot definitions', figureMatches.length === 50, `${figureMatches.length}/50`);
check('ordered clip chain', JSON.stringify(figureClips) === JSON.stringify(expectedClips), figureClips.at(-1) ?? 'none');
check('ordered poster chain', JSON.stringify(figurePosters) === JSON.stringify(expectedPosters), figurePosters.at(-1) ?? 'none');
check('bilingual shot captions', figureMatches.every((match) => match[0].includes('class="L en"') && match[0].includes('class="L ar"')), 'English + Arabic in every figure');
check('eight chapter jumps', (page.match(/<button type="button"[^>]+data-shot="/g) ?? []).length === 8, '8/8');

const weightMatch = script.match(/const DIRECTOR_WEIGHTS = Object\.freeze\((\[[\s\S]*?\])\);/);
let directorWeights = [];
try {
  directorWeights = weightMatch ? JSON.parse(weightMatch[1]) : [];
} catch {
  directorWeights = [];
}
check(
  'director thesis',
  page.includes('The Cake Is Made Twice') && page.includes('تُصنع الكعكة مرتين'),
  'software first, kitchen second',
);
check(
  'director pacing map',
  directorWeights.length === 50
    && new Set(directorWeights).size >= 5
    && directorWeights.slice(7, 15).every((weight) => weight <= .7)
    && [15, 16, 26, 37, 49].every((index) => directorWeights[index] >= 1.3),
  `${directorWeights.length}/50 weights · ${new Set(directorWeights).size} distinct rhythms`,
);
check(
  'chapter argument layer',
  page.includes('id="director-note-en"')
    && page.includes('id="director-note-ar"')
    && (script.match(/purposeEn:/g) ?? []).length === 8
    && (script.match(/purposeAr:/g) ?? []).length === 8,
  'eight bilingual reasons, not only eight labels',
);
check(
  'operator handoff promise',
  ['reusable pastry knowledge', 'customer mockup', 'baker sheet', 'true-size plaque'].every((phrase) => page.includes(phrase)),
  'ready form → flexible design → production documents',
);
check(
  'first-screen recruiter value',
  page.includes('class="ident-brief"')
    && page.includes('9 reusable forms → 3 production proofs')
    && page.includes('href="#cake-reel"'),
  'role, result and direct build affordance appear before the long-form film',
);
check(
  'minimum interactive targets',
  css.includes('min-height: 44px')
    && css.includes('width: 44px')
    && css.includes('height: 44px'),
  'chrome and chapter navigation expose 44px hit areas',
);

const objectActs = [...page.matchAll(/<article class="object-act"\s+data-object-act="([^"]+)"/g)].map((match) => match[1]);
const modelAssetBlock = codaScript.match(/const MODEL_ASSETS = \[([\s\S]*?)\n\];/)?.[1] ?? '';
check(
  'film-to-object match cut',
  page.includes('class="film-bridge"')
    && page.includes('src="assets/cake-studio/keyframes/CST-KF01-opening-sheet.png"')
    && page.includes('data-cake-canvas'),
  'exact KF01 endpoint holds until the dimensional sheet paints',
);
check(
  'one dimensional coda',
  (page.match(/data-object-coda/g) ?? []).length === 1
    && (page.match(/data-cake-canvas/g) ?? []).length === 1
    && JSON.stringify(objectActs) === JSON.stringify(['forms', 'assembly', 'handoff']),
  `one canvas · acts ${objectActs.join(' → ') || 'missing'}`,
);
check(
  'object-led visual contract',
  /const READY_FORM_COUNT = 9;/.test(codaScript)
    && /const CONTROLLED_PART_COUNT = 4;/.test(codaScript)
    && /const OUTPUT_COUNT = 3;/.test(codaScript)
    && codaScript.includes('createReadyForms')
    && codaScript.includes('createControlledAssembly')
    && codaScript.includes('createProductionOutputs'),
  '9 cake forms · 4 controlled parts · 3 tangible outputs',
);
check(
  'real model production layer',
  codaScript.includes("import { GLTFLoader }")
    && codaScript.includes("import { DRACOLoader }")
    && (modelAssetBlock.match(/\.glb'/g) ?? []).length === 24
    && codaScript.includes("modelSource = 'staged-glb'"),
  '24 optimized GLBs with staged loading, disposal and procedural fallback',
);
check(
  'cinematic GLB choreography',
  codaScript.includes('createChapterWords')
    && codaScript.includes('renderChapterWords')
    && codaScript.includes("waferSource: 'procedural'")
    && codaScript.includes("handoffArtifactSource: 'procedural'")
    && codaScript.includes('wordmarkModels: 0'),
  '17 textured GLB wafers · 3 physical chapter words · 3 GLB handoff artifacts',
);
check(
  'authored connected proof room',
  codaScript.includes('cake-studio-proof-room.glb')
    && codaScript.includes("cameraSource = 'authored-clip'")
    && codaScript.includes('renderAuthoredCamera')
    && codaScript.includes('disposeModelGroup'),
  'three connected zones · authored desktop/phone cameras · bounded residency',
);
check(
  'semantic production portal',
  page.includes('data-cake-studio-live-ui')
    && page.includes('Order fulfilment workflow')
    && page.includes('WhatsApp proof')
    && page.includes('Verify &amp; approve')
    && codaScript.includes('renderProofPortal'),
  'source-backed Order Desk review and immutable proof-code loop',
);
check(
  'full motion forced',
  !/prefers-reduced-motion|reduced-static|data-coda-reduced-poster/.test([page, css, script, codaScript, codaLoader].join('\n'))
    && codaScript.includes('fullMotion: true')
    && codaLoader.trim() === "import('./cake-studio-coda.js?v=7');",
  'OS motion preference cannot replace the directed film or 3D runtime',
);
check(
  'weighted coda camera',
  codaScript.includes('CAMERA_TAU_MS')
    && codaScript.includes("cameraState: 'idle'")
    && codaScript.includes("style.setProperty('--object-p'")
    && codaScript.includes('smootherstep'),
  'one smoothed playhead drives camera, objects, copy and atmosphere',
);
check(
  'no schematic fallback',
  !page.includes('form-library')
    && !page.includes('cake-model')
    && !page.includes('handoff-line')
    && !css.includes('.form-library')
    && !css.includes('.cake-model')
    && !css.includes('.handoff-line'),
  'old circles, connector lines and boxed silhouettes removed',
);
check(
  'scroll is the coda playhead',
  codaScript.includes('renderCoda(progress)')
    && !/(?:video|slot\.video)\.play\s*\(/.test(codaScript)
    && !/setInterval\s*\(/.test(codaScript)
    && !/function\s+animate\s*\(/.test(codaScript),
  'deterministic forward/reverse render; no autoplay loop',
);
check(
  'coda runtime proof surface',
  codaScript.includes('window.__cakeStudioCoda')
    && codaScript.includes('webglAvailable')
    && page.includes('data-coda-fallback'),
  'browser-verifiable state plus graceful fallback',
);
const codaEnglish = (page.match(/object-act[\s\S]*?class="L en"/g) ?? []).length;
const codaArabic = (page.match(/object-act[\s\S]*?class="L ar"/g) ?? []).length;
check('dimensional coda bilingual', codaEnglish >= 3 && codaArabic >= 3, `${codaEnglish} English / ${codaArabic} Arabic act bodies`);
check(
  'vendored Three license',
  Boolean(threeFile && threeCoreFile && threeFile.size + threeCoreFile.size > 700_000)
    && threeLicense.includes('MIT License')
    && threeLicense.toLowerCase().includes('three.js authors'),
  `${(threeFile?.size ?? 0) + (threeCoreFile?.size ?? 0)} bytes · MIT notice`,
);
check(
  'linked optical bridge prompt',
  opticalPrompt.includes('First Frame: KF50')
    && opticalPrompt.includes('Last Frame: KF01')
    && opticalPrompt.includes('nine dimensional cake forms')
    && opticalPrompt.includes('4.5 seconds')
    && opticalPrompt.includes('final 0.5 seconds'),
  'WAN 2.7 FLF candidate preserves endpoints and foreshadows the 3D coda',
);

check('owner pack complete', ownerPack.clips?.length === 50, `${ownerPack.clips?.length ?? 0}/50 source prompts`);
const acceptedRows = runLog.split(/\r?\n/).filter((line) => line.includes('"accepted","10"'));
const pendingRows = runLog.split(/\r?\n/).filter((line) => line.includes('"pending"'));
check('accepted ledger complete', acceptedRows.length === 50 && pendingRows.length === 0, `${acceptedRows.length} accepted / ${pendingRows.length} pending`);

check('media manifest version', manifest.schema === 'cake-studio-world-media/v1' && manifest.version === '1.0.0', `${manifest.schema} · ${manifest.version}`);
check('media manifest complete', manifest.clipCount === 50 && manifest.clips?.length === 50, `${manifest.clips?.length ?? 0}/50`);
check('running time exact', manifest.durationSeconds === 250, `${manifest.durationSeconds} seconds`);
check('dense silent encodes', manifest.clips.every((clip) => clip.keyframes >= 10 && clip.audioCodec === null), '>=10 keyframes and no audio per clip');
check('uniform web frame', manifest.clips.every((clip) => clip.width === 1280 && clip.height === 720 && clip.frameRate === '30/1'), '1280x720 @ 30 fps');

let verifiedMedia = 0;
for (const clip of manifest.clips) {
  const clipPath = join(worldRoot, 'cake-studio', clip.clip);
  const posterPath = join(worldRoot, 'cake-studio', clip.poster);
  const [clipBytes, posterBytes, clipFile] = await Promise.all([
    readFile(clipPath),
    stat(posterPath),
    stat(clipPath),
  ]);
  const hash = createHash('sha256').update(clipBytes).digest('hex');
  if (hash === clip.sha256 && clipFile.size === clip.bytes && posterBytes.size > 20_000) verifiedMedia += 1;
}
check('media hashes and posters', verifiedMedia === 50, `${verifiedMedia}/50 verified`);

check('lobby entry', lobby.includes('href="cake-studio.html"') && lobby.includes('09 · CAKE STUDIO'), 'World 09 linked');
check('lobby count copy', lobby.includes('Nine Scroll-Cinema Films') && lobby.includes('70 WAN shots'), 'nine worlds / seventy WAN shots');
check(
  'truth-locked workflow',
  [
    'Nine ready forms hold reusable pastry knowledge',
    'Twenty Patches',
    'true-size plaque',
    'Reject the expensive mistake',
    'Physical baking, printing and final material approval remain human production work',
  ].every((phrase) => `${page}\n${script}`.includes(phrase)),
  'ready structure, calibration, measured handoff, early rejection, human craft boundary',
);

const report = {
  schema: 'cake-studio-world-verification/v2',
  generatedAt: new Date().toISOString(),
  sabotage,
  checks,
  failures,
};
if (process.env.CAKE_STUDIO_REPORT) {
  const { writeFile } = await import('node:fs/promises');
  await writeFile(resolve(process.env.CAKE_STUDIO_REPORT), `${JSON.stringify(report, null, 2)}\n`);
}

if (failures.length) {
  console.error(`Cake Studio world gate RED (${failures.length}/${checks.length} failed).`);
  process.exit(1);
}

console.log(`Cake Studio world gate GREEN: ${checks.length}/${checks.length} structural and media checks passed.`);
