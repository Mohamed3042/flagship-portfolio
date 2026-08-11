import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pack = path.join(repo, 'production', 'cake-studio-v17', 'wan-production');
const jobsFile = path.join(pack, 'wan-jobs.js');
const boardFile = path.join(pack, 'WAN-GENERATION-BOARD.html');
const sabotage = process.argv.includes('--sabotage');

function fail(message) {
  throw new Error(message);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function pngSize(file) {
  const bytes = fs.readFileSync(file);
  check(bytes.subarray(1, 4).toString('ascii') === 'PNG', `${file} is not a PNG`);
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(jobsFile, 'utf8'), sandbox, { filename: jobsFile });
let jobs = sandbox.window.CST17_WAN_JOBS;
check(Array.isArray(jobs), 'wan-jobs.js did not expose an array');

if (sabotage) jobs = jobs.slice(0, -1);

check(jobs.length === 15, `expected 15 WAN jobs, found ${jobs.length}`);
check(jobs.filter(job => job.id.startsWith('I')).length === 10, 'expected 10 opening jobs');
check(jobs.filter(job => job.id.startsWith('O')).length === 5, 'expected 5 ending jobs');

const expectedIds = [
  ...Array.from({ length: 10 }, (_, index) => `I${String(index + 1).padStart(2, '0')}`),
  ...Array.from({ length: 5 }, (_, index) => `O${String(index + 1).padStart(2, '0')}`)
];
check(jobs.map(job => job.id).join(',') === expectedIds.join(','), 'job ids or ordering changed');

const promptHashes = new Set();
const frames = new Set();
for (const job of jobs) {
  check(job.output === `CST17-${job.id}.mp4`, `${job.id} output filename is wrong`);
  check(typeof job.prompt === 'string' && job.prompt.length >= 1100, `${job.id} prompt is incomplete`);
  for (const phrase of ['first and last frames', 'five-second', 'last frame', 'No cut']) {
    check(job.prompt.includes(phrase), `${job.id} prompt is missing: ${phrase}`);
  }
  promptHashes.add(crypto.createHash('sha256').update(job.prompt).digest('hex'));

  for (const relative of [job.first, job.last]) {
    const file = path.join(pack, ...relative.split('/'));
    check(fs.existsSync(file), `${job.id} frame missing: ${relative}`);
    const [width, height] = pngSize(file);
    check(width === 1280 && height === 720, `${relative} is ${width}x${height}, expected 1280x720`);
    frames.add(path.resolve(file));
  }
}
check(promptHashes.size === 15, 'prompts must be unique');
check(frames.size === 17, `expected 17 unique endpoint frames, found ${frames.size}`);

for (let index = 1; index < 10; index += 1) {
  check(jobs[index - 1].last === jobs[index].first, `${jobs[index].id} opening boundary is not shared exactly`);
}
for (let index = 11; index < 15; index += 1) {
  check(jobs[index - 1].last === jobs[index].first, `${jobs[index].id} ending boundary is not shared exactly`);
}

const introSeam = path.join(pack, 'keyframes', 'CST17-I10-exact-cst001-frame000.png');
const introTruth = path.join(repo, 'public', 'worlds', 'cake-studio', 'bookends', 'cake-studio-intro-endpoint.png');
const outroSeam = path.join(pack, 'keyframes', 'CST17-O00-exact-cst050-frame149.png');
const outroTruth = path.join(repo, 'public', 'worlds', 'cake-studio', 'bookends', 'cake-studio-outro-endpoint.png');
check(sha256(introSeam) === sha256(introTruth), 'opening seam is not the exact decoded CST-001 endpoint');
check(sha256(outroSeam) === sha256(outroTruth), 'ending seam is not the exact decoded CST-050 endpoint');

const board = fs.readFileSync(boardFile, 'utf8');
for (const phrase of ['First frame', 'Last frame', 'One prompt', 'wan-jobs.js', 'WAN 2.7']) {
  check(board.includes(phrase), `generation board is missing: ${phrase}`);
}

console.log(`WAN_PACK_GATE_OK jobs=${jobs.length} frames=${frames.size} exact_seams=2 prompts=${promptHashes.size}`);
