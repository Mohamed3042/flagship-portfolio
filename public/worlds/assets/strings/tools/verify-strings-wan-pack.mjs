#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const stringsDir = path.resolve(process.argv[2] || path.join(toolDir, '..'));
const packDir = path.join(stringsDir, 'wan-production');
const sabotage = process.argv.includes('--sabotage');
const reportFlag = process.argv.indexOf('--report');
const reportPath = reportFlag >= 0 && process.argv[reportFlag + 1]
  ? path.resolve(process.argv[reportFlag + 1])
  : null;

const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function exists(...segments) {
  return fs.existsSync(path.join(...segments));
}

function readJson(filePath, label) {
  check(fs.existsSync(filePath), `${label} is missing: ${filePath}`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    check(false, `${label} is invalid JSON: ${error.message}`);
    return null;
  }
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function pngDimensions(filePath) {
  const bytes = fs.readFileSync(filePath);
  check(bytes.length >= 24, `PNG is too short: ${filePath}`);
  if (bytes.length < 24) return { width: 0, height: 0 };
  check(bytes.subarray(1, 4).toString('ascii') === 'PNG', `Bad PNG signature: ${filePath}`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function videoFiles(root) {
  if (!fs.existsSync(root)) return [];
  const found = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) found.push(...videoFiles(target));
    if (entry.isFile() && /\.(mp4|mov|mkv|webm)$/i.test(entry.name)) found.push(target);
  }
  return found;
}

function frameFilename(frame) {
  return `CTS-${frame.id}-${frame.slug}.png`;
}

const plan = readJson(path.join(stringsDir, 'prompts', 'keyframe-plan.json'), 'Keyframe plan');
const qa = readJson(path.join(stringsDir, 'review', 'keyframe-qa.json'), 'Keyframe QA');
let data = readJson(path.join(packDir, 'clips.json'), 'WAN clip manifest');

if (sabotage && data?.clips?.length) {
  data = structuredClone(data);
  data.clips[0].prompt = '';
  console.log('SABOTAGE_APPLIED: blanked CTS-A-001 prompt in memory');
}

if (plan) {
  check(plan.schema === 'cut-the-strings-keyframe-plan/v1', 'Unexpected keyframe-plan schema');
  check(plan.frames?.length === 40, `Expected 40 planned frames, found ${plan.frames?.length ?? 0}`);
}

if (qa) {
  check(qa.expectedCount === 41, `Expected QA target 41, found ${qa.expectedCount}`);
  check(qa.actualCount === 41, `Expected 41 approved stills, found ${qa.actualCount}`);
  check(Array.isArray(qa.errors) && qa.errors.length === 0, 'Approved keyframe QA has errors');
  check(qa.frames?.length === 41, `Expected 41 QA frame records, found ${qa.frames?.length ?? 0}`);

  for (const frame of qa.frames || []) {
    const filePath = path.join(stringsDir, 'keyframes', frame.file);
    check(fs.existsSync(filePath), `Approved still is missing: ${frame.file}`);
    if (!fs.existsSync(filePath)) continue;
    const dimensions = pngDimensions(filePath);
    check(dimensions.width === 1920 && dimensions.height === 1088, `${frame.file} is ${dimensions.width}x${dimensions.height}`);
    check(sha256(filePath) === frame.sha256, `${frame.file} differs from the approved SHA-256`);
  }
}

if (data) {
  check(data.schema === 'cut-the-strings-wan-owner-pack/v1', 'Unexpected WAN pack schema');
  check(data.status === 'owner-generation-pending', 'WAN pack status must remain owner-generation-pending');
  check(data.model === 'WAN 2.7 image-to-video', 'Wrong model lock');
  check(data.ownerGenerationOnly === true, 'Owner-generation-only lock is missing');
  check(data.jobsSubmitted === 0, 'Board checkpoint must have zero submitted jobs');
  check(data.creditsSpent === 0, 'Board checkpoint must have zero spent credits');
  check(data.settings?.resolution === '720P / 1280x720 / 16:9', 'Wrong resolution lock');
  check(data.settings?.durationSeconds === 5, 'Duration must be exactly 5 seconds');
  check(data.settings?.audio === false, 'Audio must be off');
  check(data.settings?.promptExtension === false, 'Prompt extension must be off');
  check(data.settings?.outputsPerAttempt === 1, 'Exactly one output per attempt is required');
  check(data.settings?.baseCreditsPerClip === 10, 'Base cost must be 10 credits per clip');
  check(data.settings?.baseCreditsTotal === 400, 'Base credit bill must be 400');
  check(data.settings?.plannedCreditsTotal === 600, 'Planned credit bill must be 600');
  check(data.clips?.length === 40, `Expected 40 clips, found ${data.clips?.length ?? 0}`);
  check(new Set((data.clips || []).map((clip) => clip.clip)).size === 40, 'Clip IDs are not unique');
  check((data.clips || []).every((clip) => clip.flf === true), 'Every clip must use approved first and last stills');

  const frameById = new Map((plan?.frames || []).map((frame) => [frame.id, frame]));
  const motionOpenings = new Set();
  for (let index = 0; index < (data.clips || []).length; index += 1) {
    const clip = data.clips[index];
    const number = String(index + 1).padStart(3, '0');
    const currentId = `KF${String(index + 1).padStart(2, '0')}`;
    const nextId = index === 39 ? 'KF01' : `KF${String(index + 2).padStart(2, '0')}`;
    const current = frameById.get(currentId);
    const next = frameById.get(nextId);

    check(clip.clip === `CTS-A-${number}`, `Wrong clip ID at index ${index}`);
    check(clip.storyboard === `${currentId} -> ${nextId}`, `${clip.clip} has wrong storyboard pair`);
    check(clip.targetId === nextId, `${clip.clip} target ID is wrong`);
    check(clip.generationFirst === `../keyframes/${frameFilename(current)}`, `${clip.clip} first-frame path is wrong`);
    check(clip.generationLast === `../keyframes/${frameFilename(next)}`, `${clip.clip} last-frame path is wrong`);
    check(clip.acceptedFilename === `accepted/CTS-A-${number}.mp4`, `${clip.clip} output filename is wrong`);
    check(Number.isInteger(clip.seed), `${clip.clip} seed is not an integer`);
    check(typeof clip.sceneFamily === 'string' && clip.sceneFamily.length > 0, `${clip.clip} scene family is missing`);
    check(typeof clip.action === 'string' && clip.action.length > 20, `${clip.clip} action is missing`);

    const prompt = clip.prompt || '';
    check(prompt.startsWith('Generate single shot.'), `${clip.clip} literal prompt prefix failed`);
    check(prompt.endsWith('No dialogue. No background music.'), `${clip.clip} literal prompt suffix failed`);
    check(prompt.includes('4.5 seconds'), `${clip.clip} settle timing is missing`);
    check(prompt.includes('matching the supplied last frame exactly'), `${clip.clip} stable last-frame landing is missing`);
    check(prompt.includes('@Image1 is the immutable scene geometry and art-direction.'), `${clip.clip} geometry lock is missing`);
    check(prompt.includes(data.styleLock), `${clip.clip} exact style lock is missing`);
    check((prompt.match(/\bCamera\b/g) || []).length === 1, `${clip.clip} must state exactly one camera instruction`);
    check(!prompt.includes('..'), `${clip.clip} has doubled punctuation`);
    check(prompt.split(/\s+/).filter(Boolean).length <= 125, `${clip.clip} prompt exceeds 125 words`);
    const opening = prompt.slice(0, 100);
    check(!motionOpenings.has(opening), `${clip.clip} duplicates a prior motion opening`);
    motionOpenings.add(opening);

    const promptPath = path.join(packDir, 'wan-prompts', `${clip.clip}.txt`);
    check(fs.existsSync(promptPath), `${clip.clip} prompt file is missing`);
    if (fs.existsSync(promptPath)) {
      check(fs.readFileSync(promptPath, 'utf8').trim() === prompt, `${clip.clip} prompt file differs from clips.json`);
    }
  }

  const requiredNegativeTerms = [
    'blur',
    'watermark',
    'captions',
    'extra limbs',
    'morphing',
    'flicker',
    'unintended cut'
  ];
  for (const term of requiredNegativeTerms) {
    check(data.negativePrompt?.includes(term), `Shared negative prompt is missing: ${term}`);
  }
}

for (const required of [
  'WAN-GENERATION-BOARD.html',
  'README-FIRST.md',
  'RUNBOOK.md',
  'clips.json',
  'negative-prompt.txt',
  'run-log.csv',
  'accepted/.gitkeep',
  'raw/.gitkeep',
  'rejected/.gitkeep'
]) {
  check(exists(packDir, ...required.split('/')), `Required WAN artifact is missing: ${required}`);
}

const boardPath = path.join(packDir, 'WAN-GENERATION-BOARD.html');
if (fs.existsSync(boardPath)) {
  const html = fs.readFileSync(boardPath, 'utf8');
  check((html.match(/<article class="clip-card"/g) || []).length === 40, 'Board must contain exactly 40 clip cards');
  check(html.includes('window.CTS_WAN_DATA='), 'Board does not embed the complete clip data');
  check(html.includes('localStorage'), 'Board persistent state is missing');
  check(html.includes('Pending only'), 'Board pending filter is missing');
  check(html.includes('data-state="done"'), 'Board done tracking is missing');
  check(html.includes('Copy prompt'), 'Board prompt copy action is missing');
  check(html.includes('Copy negative'), 'Board shared-negative copy action is missing');
  check(html.includes('THIS PAGE NEVER SUBMITS JOBS OR SPENDS CREDITS'), 'Board owner-only safety warning is missing');
  check(!/\bfetch\s*\(/.test(html), 'Board must not make fetch requests');
  check(!/XMLHttpRequest/.test(html), 'Board must not use XMLHttpRequest');
  check(!/<form\b/i.test(html), 'Board must not contain a submission form');
  check(!/<script[^>]+\bsrc=/i.test(html), 'Board must not load external scripts');
  check(!/https?:\/\//i.test(html), 'Board must not contain network URLs');
  for (const clip of data?.clips || []) {
    check(html.includes(`id="${clip.clip}"`), `Board card is missing: ${clip.clip}`);
    check(html.includes(clip.generationFirst), `${clip.clip} first still is not embedded in the board`);
    check(html.includes(clip.generationLast), `${clip.clip} last still is not embedded in the board`);
    check(html.includes(clip.acceptedFilename), `${clip.clip} accepted filename is not embedded in the board`);
  }
}

const negativePath = path.join(packDir, 'negative-prompt.txt');
if (fs.existsSync(negativePath) && data) {
  check(fs.readFileSync(negativePath, 'utf8').trim() === data.negativePrompt, 'negative-prompt.txt differs from clips.json');
}

const runLogPath = path.join(packDir, 'run-log.csv');
if (fs.existsSync(runLogPath)) {
  const rows = fs.readFileSync(runLogPath, 'utf8').trim().split(/\r?\n/);
  check(rows.length === 41, `Run log must contain one header and 40 rows, found ${rows.length}`);
  check(rows.slice(1).every((row) => row.includes('"pending"') && row.includes('"0"')), 'Run log must remain pending with zero credits');
}

const videos = videoFiles(packDir);
check(videos.length === 0, `WAN board checkpoint contains ${videos.length} video file(s)`);

const report = {
  schema: 'cut-the-strings-wan-board-qa/v1',
  result: failures.length ? 'RED' : 'GREEN',
  checks,
  passed: checks - failures.length,
  failures,
  clips: data?.clips?.length || 0,
  approvedStills: qa?.frames?.length || 0,
  videoFiles: videos.length,
  jobsSubmitted: data?.jobsSubmitted ?? 0,
  creditsSpent: data?.creditsSpent ?? 0,
  sabotage
};

if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

if (failures.length) {
  console.error(`RED_VERIFY ${checks - failures.length}/${checks}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`GREEN_VERIFY ${checks}/${checks}`);
console.log('BOARD_CONTRACT 41 approved stills | 40 prompts | 40 first+last pairs | 0 jobs | 0 credits | 0 videos');
