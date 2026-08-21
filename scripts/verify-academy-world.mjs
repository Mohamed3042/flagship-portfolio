#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = (path, label) => {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) { failures.push(`${label}: ${error.message}`); return null; }
};

const required = {
  page: join(root, 'public', 'worlds', 'academy.html'),
  css: join(root, 'public', 'worlds', 'academy.css'),
  js: join(root, 'public', 'worlds', 'academy.js'),
  lobby: join(root, 'public', 'worlds', 'index.html'),
  acceptance: join(root, 'production', 'academy', 'wan-acceptance.json'),
  manifest: join(root, 'public', 'worlds', 'academy', 'manifest.json'),
};

for (const [label, path] of Object.entries(required)) {
  check(existsSync(path), `${label} missing: ${path}`);
}

const acceptance = existsSync(required.acceptance)
  ? readJson(required.acceptance, 'acceptance manifest invalid')
  : null;
const manifest = existsSync(required.manifest)
  ? readJson(required.manifest, 'web manifest invalid')
  : null;

if (acceptance) {
  const jobs = acceptance.jobs ?? [];
  const accepted = jobs.filter((job) => job.verdict === 'ACCEPTED');
  const held = jobs.filter((job) => job.verdict === 'HOLD');
  check(jobs.length === 16, `acceptance manifest has ${jobs.length} jobs, expected 16`);
  check(accepted.length === 14, `acceptance manifest has ${accepted.length} accepted jobs, expected 14`);
  check(held.length === 2, `acceptance manifest has ${held.length} held jobs, expected 2`);
  check(held.map((job) => job.id).join(',') === 'ACA-002,ACA-016', 'held IDs must be ACA-002 and ACA-016');

  for (const job of jobs) {
    const source = join(root, 'production', 'academy', 'wan-returns', `${job.id}.mp4`);
    check(existsSync(source), `preserved return missing: ${job.id}.mp4`);
    if (existsSync(source)) check(statSync(source).size > 1_000_000, `preserved return too small: ${job.id}.mp4`);
    check(/^[A-F0-9]{64}$/.test(job.sourceSha256 ?? ''), `source hash missing/invalid: ${job.id}`);
  }
}

const inspect = (path) => {
  const result = spawnSync(ffprobe, [
    '-v', 'error',
    '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt',
    '-of', 'json', path,
  ], { encoding: 'utf8', maxBuffer: 8_000_000 });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `ffprobe exited ${result.status}`);
  const data = JSON.parse(result.stdout);
  const video = data.streams.find((stream) => stream.codec_type === 'video');
  const audio = data.streams.find((stream) => stream.codec_type === 'audio');
  const keys = spawnSync(ffprobe, [
    '-v', 'error', '-select_streams', 'v:0', '-skip_frame', 'nokey',
    '-show_entries', 'frame=best_effort_timestamp_time', '-of', 'csv=p=0', path,
  ], { encoding: 'utf8', maxBuffer: 8_000_000 });
  if (keys.status !== 0) throw new Error(keys.stderr.trim() || `keyframe probe exited ${keys.status}`);
  const bytes = readFileSync(path);
  const moov = bytes.indexOf(Buffer.from('moov'));
  const mdat = bytes.indexOf(Buffer.from('mdat'));
  return {
    codec: video?.codec_name,
    width: video?.width,
    height: video?.height,
    fps: video?.r_frame_rate,
    pixelFormat: video?.pix_fmt,
    audio: Boolean(audio),
    duration: Number(data.format?.duration ?? 0),
    keyframes: keys.stdout.trim().split(/\r?\n/).filter(Boolean).length,
    faststart: moov > 0 && mdat > 0 && moov < mdat,
  };
};

if (manifest) {
  const clips = manifest.clips ?? [];
  check(manifest.schema === 'academy-world-media/v1', `unexpected manifest schema: ${manifest.schema}`);
  check(manifest.clipCount === 14, `manifest clipCount is ${manifest.clipCount}, expected 14`);
  check(clips.length === 14, `manifest has ${clips.length} clips, expected 14`);
  check((manifest.heldIds ?? []).join(',') === 'ACA-002,ACA-016', 'manifest held IDs are wrong');

  for (const clip of clips) {
    const videoPath = join(root, 'public', 'worlds', 'academy', clip.clip);
    const posterPath = join(root, 'public', 'worlds', 'academy', clip.poster);
    check(existsSync(videoPath), `web clip missing: ${clip.id}`);
    check(existsSync(posterPath), `poster missing: ${clip.id}`);
    if (existsSync(posterPath)) check(statSync(posterPath).size > 10_000, `poster too small: ${clip.id}`);
    if (!existsSync(videoPath)) continue;
    try {
      const meta = inspect(videoPath);
      check(meta.codec === 'h264', `${clip.id}: codec ${meta.codec}, expected h264`);
      check(meta.width === 1280 && meta.height === 720, `${clip.id}: ${meta.width}x${meta.height}, expected 1280x720`);
      check(meta.fps === '30/1', `${clip.id}: fps ${meta.fps}, expected 30/1`);
      check(meta.pixelFormat === 'yuv420p', `${clip.id}: pixel format ${meta.pixelFormat}, expected yuv420p`);
      check(!meta.audio, `${clip.id}: audio track survived`);
      check(meta.duration >= 4.9 && meta.duration <= 5.1, `${clip.id}: duration ${meta.duration.toFixed(3)}s outside gate`);
      check(meta.keyframes >= 10, `${clip.id}: only ${meta.keyframes} keyframes`);
      check(meta.faststart, `${clip.id}: moov atom is not before mdat`);
    } catch (error) {
      failures.push(`${clip.id}: ${error.message}`);
    }
  }
}

if (existsSync(required.page)) {
  const html = readFileSync(required.page, 'utf8');
  const sourceIds = [...html.matchAll(/data-source-id="(ACA-\d{3})"/g)].map((match) => match[1]);
  check(sourceIds.length === 14, `page exposes ${sourceIds.length} film definitions, expected 14`);
  check(!sourceIds.includes('ACA-002') && !sourceIds.includes('ACA-016'), 'held clips leaked into the public film');
  check((html.match(/class="L en"/g) ?? []).length >= 20, 'English live-DOM copy is incomplete');
  check((html.match(/class="L ar"/g) ?? []).length >= 20, 'Arabic live-DOM copy is incomplete');
  check(!/1080p/i.test(html), 'page contains a false 1080p claim');
  check(/data-proof-instrument/.test(html), 'signature proof instrument is missing');
  check(/data-version="2\.0\.0"/.test(html), 'Academy phone contract version is not 2.0.0');
  check(!/data-letterbox/.test(html), 'Academy still opts into projector letterbox mattes');
  check(!/(?:clip-mobile|-m\.mp4|mobile\.mp4)/i.test(html), 'a separate mobile media chain leaked into Academy');
}

if (existsSync(required.css)) {
  const css = readFileSync(required.css, 'utf8');
  check(/width:\s*100dvw/.test(css) && /height:\s*100dvh/.test(css), 'live dvw/dvh stage contract is missing');
  check(/object-fit:\s*cover/.test(css), 'Academy film does not declare cover rendering');
  check(!/object-fit:\s*contain/.test(css), 'contained film rendering survived the full-bleed revision');
  check(!/100svh\s*-\s*178px|aspect-ratio:\s*16\s*\/\s*9/.test(css), 'fixed 16:9 letterbox geometry survived');
}

if (existsSync(required.js)) {
  const js = readFileSync(required.js, 'utf8');
  check(/version:\s*'2\.0\.0'/.test(js), 'Academy director runtime version is not 2.0.0');
  check(/weighted-monotonic-full-bleed/.test(js), 'monotonic camera mode is missing');
  check(/orientationchange/.test(js) && /viewportRevision/.test(js), 'orientation repaint/preservation path is missing');
}

if (existsSync(required.lobby)) {
  const lobby = readFileSync(required.lobby, 'utf8');
  check(/href="academy\.html"/.test(lobby), 'Academy card is missing from the Worlds lobby');
}

if (failures.length) {
  console.error(`ACADEMY_WORLD_GATE_RED (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('ACADEMY_WORLD_GATE_GREEN');
console.log('16 preserved returns · 14 accepted web clips · 2 held outside the reel');
console.log('H.264 1280x720 30fps · silent · yuv420p · GOP15 · faststart');
