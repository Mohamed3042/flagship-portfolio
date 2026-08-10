#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const packDir = process.argv[2];
const sabotage = process.argv.includes('--sabotage');
if (!packDir) throw new Error('Usage: node verify-cake-wan-pack.mjs /absolute/pack/path [--sabotage]');

const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(packDir, relativePath), 'utf8'));
}

function exists(relativePath) {
  return fs.existsSync(path.join(packDir, relativePath));
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function pngDimensions(filePath) {
  const bytes = fs.readFileSync(filePath);
  check(bytes.length >= 24, `PNG too short: ${filePath}`);
  check(bytes.subarray(1, 4).toString('ascii') === 'PNG', `Bad PNG signature: ${filePath}`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const data = readJson('clips.json');
const qa = readJson('review/keyframe-qa.json');
const plan = readJson('prompts/keyframe-plan.json');

if (sabotage) {
  check(data.clips[0].prompt.length > 0, 'Sabotage precondition failed: first prompt was already empty');
  data.clips[0].prompt = '';
  console.log('SABOTAGE_APPLIED: blanked CST-A-001 prompt in memory');
}

check(data.schema === 'cake-studio-wan-owner-pack/v1', 'Unexpected pack schema');
check(data.model === 'WAN 2.7 image-to-video', 'Wrong model lock');
check(data.settings.resolution === '720P / 1280×720 / 16:9', 'Wrong resolution lock');
check(data.settings.durationSeconds === 5, 'Wrong duration lock');
check(data.settings.audio === false, 'Audio must be off');
check(data.settings.promptExtension === false, 'Prompt extension must be off');
check(data.settings.outputsPerAttempt === 1, 'Exactly one output per attempt required');
check(data.settings.baseCreditsTotal === 500, 'Initial credit arithmetic must be 500');
check(data.clips.length === 50, `Expected 50 clips, found ${data.clips.length}`);
check(new Set(data.clips.map((clip) => clip.clip)).size === 50, 'Clip IDs are not unique');

check(data.clips.every((clip) => clip.flf === true), 'Every clip must be a first+last pair (all-FLF contract)');

const motionSeen = new Map();
for (let index = 0; index < data.clips.length; index += 1) {
  const clip = data.clips[index];
  const number = String(index + 1).padStart(3, '0');
  const currentId = `KF${String(index + 1).padStart(2, '0')}`;
  const nextId = index === 49 ? 'KF01' : `KF${String(index + 2).padStart(2, '0')}`;

  check(clip.clip === `CST-A-${number}`, `Wrong clip ID at index ${index}`);
  check(clip.storyboard === `${currentId} → ${nextId}`, `${clip.clip} has wrong storyboard pair`);
  check(clip.generationFirst === clip.storyboardFirst, `${clip.clip} first-frame upload must be the approved still`);
  check(clip.generationLast === clip.storyboardTarget, `${clip.clip} last-frame upload must be the approved still`);
  check(clip.generationFirst.startsWith('keyframes/'), `${clip.clip} first frame is not an approved keyframe`);
  check(exists(clip.storyboardFirst), `${clip.clip} storyboard start is missing: ${clip.storyboardFirst}`);
  check(exists(clip.storyboardTarget), `${clip.clip} storyboard target is missing: ${clip.storyboardTarget}`);
  check(clip.acceptedFilename === `accepted/${clip.clip}.mp4`, `${clip.clip} accepted filename mismatch`);
  check(Number.isInteger(clip.seed), `${clip.clip} seed is not an integer`);
  check(clip.prompt.startsWith('Generate single shot.'), `${clip.clip} prompt start lock failed`);
  check(clip.prompt.endsWith('No dialogue. No background music.'), `${clip.clip} prompt end lock failed`);
  check(clip.prompt.includes(data.styleLock), `${clip.clip} is missing the exact style lock`);
  check(clip.prompt.includes('4.5 seconds'), `${clip.clip} is missing the settle time`);
  check(clip.prompt.includes('matching the supplied last frame'), `${clip.clip} is missing the last-frame landing clause`);
  check(!clip.prompt.includes('..'), `${clip.clip} contains doubled punctuation`);
  check(!clip.prompt.includes('Preserve all established'), `${clip.clip} still carries the rejected boilerplate block`);
  check(!clip.prompt.includes('Starting from the supplied first-frame image'), `${clip.clip} still carries the rejected opener`);

  const words = clip.prompt.split(/\s+/).filter(Boolean).length;
  check(words <= 130, `${clip.clip} prompt is ${words} words; the rebuilt contract caps at 130`);

  const motionKey = clip.prompt.slice('Generate single shot. '.length, 'Generate single shot. '.length + 60);
  check(!motionSeen.has(motionKey), `${clip.clip} motion opening duplicates ${motionSeen.get(motionKey) || ''}`);
  motionSeen.set(motionKey, clip.clip);

  const promptPath = path.join(packDir, 'wan-prompts', `${clip.clip}.txt`);
  check(fs.existsSync(promptPath), `${clip.clip} prompt file is missing`);
  if (fs.existsSync(promptPath)) {
    check(fs.readFileSync(promptPath, 'utf8').trim() === clip.prompt, `${clip.clip} prompt file differs from clips.json`);
  }
}

check(qa.expectedCount === 51 && qa.actualCount === 51 && qa.errors.length === 0, 'Source keyframe QA is not 51/51 green');
check(qa.frames.length === 51, `Expected 51 QA frame records, found ${qa.frames.length}`);
check(plan.frames.length === 50, `Expected 50 planned motion frames, found ${plan.frames.length}`);

for (const frame of qa.frames) {
  const filePath = path.join(packDir, 'keyframes', frame.file);
  check(fs.existsSync(filePath), `Keyframe missing: ${frame.file}`);
  if (!fs.existsSync(filePath)) continue;
  const dimensions = pngDimensions(filePath);
  check(dimensions.width === 1920 && dimensions.height === 1088, `${frame.file} is ${dimensions.width}×${dimensions.height}`);
  check(sha256(filePath) === frame.sha256, `${frame.file} SHA-256 differs from approved QA`);
}

for (const required of [
  'index.html',
  'RUNBOOK.md',
  'README-FIRST.md',
  'SOURCE.md',
  'negative-prompt.txt',
  'run-log.csv',
  'extract-endframe.command',
  'review/CST-contact-sheet-master.png',
  'review/CST-contact-sheet-portrait-master.png',
  'continuity-ledger.md'
]) check(exists(required), `Required file missing: ${required}`);

const html = fs.readFileSync(path.join(packDir, 'index.html'), 'utf8');
check((html.match(/<article class="clip-card"/g) || []).length === 50, 'Offline board does not contain 50 clip cards');
check(html.includes('window.CAKE_WAN_DATA='), 'Offline board does not embed its prompt data');
check(!html.includes('id="negative-prompt"'), 'Offline board must not carry a shared negative-prompt section (one paste per card)');
for (const clip of data.clips) check(html.includes(`id="${clip.clip}"`), `Offline board card missing: ${clip.clip}`);

const runbook = fs.readFileSync(path.join(packDir, 'RUNBOOK.md'), 'utf8');
check((runbook.match(/^### CST-A-/gm) || []).length === 50, 'Runbook does not contain 50 prompt sections');
check(runbook.includes('50 × 10 = 500 credits'), 'Runbook credit arithmetic is missing');
check(runbook.includes('first+last pair'), 'Runbook does not state the first+last-pair workflow');

const negativeFile = fs.readFileSync(path.join(packDir, 'negative-prompt.txt'), 'utf8').trim();
check(negativeFile === data.negativePrompt, 'Negative prompt file differs from clips.json');

const csvLines = fs.readFileSync(path.join(packDir, 'run-log.csv'), 'utf8').trim().split(/\r?\n/);
check(csvLines.length === 51, `Run log should contain header + 50 rows, found ${csvLines.length}`);

const extractorPath = path.join(packDir, 'extract-endframe.command');
if (fs.existsSync(extractorPath)) {
  check((fs.statSync(extractorPath).mode & 0o111) !== 0, 'End-frame helper is not executable');
  check(fs.readFileSync(extractorPath, 'utf8').includes('-sseof -0.04'), 'End-frame helper does not sample the last clean frame');
}

if (failures.length) {
  console.error(`RED_VERIFY ${checks - failures.length}/${checks}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`GREEN_VERIFY ${checks}/${checks}`);
console.log('PACK_CONTRACT 51 approved keyframes · 50 prompts · 50 first+last pairs · offline board embedded');
