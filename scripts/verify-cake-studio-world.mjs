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
const manifestPath = join(worldRoot, 'cake-studio', 'manifest.json');
const ownerPackRoot = join(worldRoot, 'assets', 'cake-studio');
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
}

const [css, script, manifestRaw, clipsRaw, runLog, lobby] = await Promise.all([
  readFile(cssPath, 'utf8'),
  readFile(scriptPath, 'utf8'),
  readFile(manifestPath, 'utf8'),
  readFile(join(ownerPackRoot, 'clips.json'), 'utf8'),
  readFile(join(ownerPackRoot, 'run-log.csv'), 'utf8'),
  readFile(lobbyPath, 'utf8'),
]);
const manifest = JSON.parse(manifestRaw);
const ownerPack = JSON.parse(clipsRaw);

check('visible release badge', page.includes('v1.0 · WORLD 09') && page.includes('data-version="1.0.0"'), 'v1.0 / World 09');
check('shared cinema engine', page.includes('cinema.css?v=6') && page.includes('cinema.js?v=6'), 'cinema v6 linked');
check('page-local assets', page.includes('cake-studio.css?v=1') && page.includes('cake-studio.js?v=1'), 'CSS and JS linked');
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
check('truth-locked workflow', ['One of nine cake forms', 'Twenty-patch colour field', 'True-size edible sheet', 'Six-facet revision proof', 'Twelve rules across nine forms'].every((phrase) => page.includes(phrase)), 'catalogue, calibration, scale, proof, inspection');

const report = {
  schema: 'cake-studio-world-verification/v1',
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
