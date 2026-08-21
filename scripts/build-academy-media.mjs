#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourceRoot = join(root, 'production', 'academy', 'wan-returns');
const acceptancePath = join(root, 'production', 'academy', 'wan-acceptance.json');
const worldRoot = join(root, 'public', 'worlds', 'academy');
const clipsRoot = join(worldRoot, 'clips');
const postersRoot = join(worldRoot, 'posters');
const manifestPath = join(worldRoot, 'manifest.json');
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';

const run = (name, args, encoding = null) => {
  const result = spawnSync(name, args, {
    encoding,
    maxBuffer: 80_000_000,
    stdio: encoding ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe'],
  });
  if (result.error || result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString() : result.stderr;
    throw new Error(`${name} failed (${result.status ?? 'spawn'}): ${result.error?.message ?? stderr?.trim() ?? 'unknown error'}`);
  }
  return result.stdout;
};

const sha256 = async (path) => createHash('sha256').update(await readFile(path)).digest('hex').toUpperCase();
const webPath = (from, to) => relative(from, to).replaceAll('\\', '/');

const inspect = (path) => {
  const raw = run(ffprobe, [
    '-v', 'error',
    '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt',
    '-of', 'json', path,
  ], 'utf8');
  const data = JSON.parse(raw);
  const video = data.streams.find((stream) => stream.codec_type === 'video');
  const audio = data.streams.find((stream) => stream.codec_type === 'audio');
  const keyframeLines = run(ffprobe, [
    '-v', 'error', '-select_streams', 'v:0', '-skip_frame', 'nokey',
    '-show_entries', 'frame=best_effort_timestamp_time', '-of', 'csv=p=0', path,
  ], 'utf8').trim().split(/\r?\n/).filter(Boolean);
  return {
    codec: video?.codec_name ?? null,
    width: video?.width ?? null,
    height: video?.height ?? null,
    frameRate: video?.r_frame_rate ?? null,
    pixelFormat: video?.pix_fmt ?? null,
    audioCodec: audio?.codec_name ?? null,
    duration: Number(Number(data.format?.duration ?? 0).toFixed(3)),
    bytes: Number(data.format?.size ?? 0),
    keyframes: keyframeLines.length,
  };
};

const acceptance = JSON.parse(await readFile(acceptancePath, 'utf8'));
const jobs = acceptance.jobs ?? [];
const accepted = jobs.filter((job) => job.verdict === 'ACCEPTED');
const held = jobs.filter((job) => job.verdict === 'HOLD');

if (jobs.length !== 16 || accepted.length !== 14 || held.length !== 2) {
  throw new Error(`acceptance contract mismatch: ${jobs.length} total, ${accepted.length} accepted, ${held.length} held`);
}
if (held.map((job) => job.id).join(',') !== 'ACA-002,ACA-016') {
  throw new Error(`unexpected held set: ${held.map((job) => job.id).join(',')}`);
}

await mkdir(clipsRoot, { recursive: true });
await mkdir(postersRoot, { recursive: true });

for (const job of jobs) {
  const source = join(sourceRoot, `${job.id}.mp4`);
  await stat(source);
  const hash = await sha256(source);
  if (hash !== job.sourceSha256) throw new Error(`${job.id} source hash mismatch: ${hash}`);
  const meta = inspect(source);
  if (
    meta.codec !== 'h264'
    || meta.width !== 1274
    || meta.height !== 722
    || meta.frameRate !== '30/1'
    || meta.audioCodec === null
    || meta.duration < 5.0
    || meta.duration > 5.1
  ) {
    throw new Error(`${job.id} preserved return is outside the measured source contract: ${JSON.stringify(meta)}`);
  }
}

const manifestClips = [];
for (const [index, job] of accepted.entries()) {
  const source = join(sourceRoot, `${job.id}.mp4`);
  const output = join(clipsRoot, `${job.id}.mp4`);
  const poster = join(postersRoot, `${job.id}.jpg`);

  run(ffmpeg, [
    '-nostdin', '-v', 'error', '-i', source,
    '-map', '0:v:0',
    '-vf', 'delogo=x=1158:y=660:w=82:h=54,scale=1280:720:flags=lanczos',
    '-an',
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0',
    '-preset', 'slow', '-crf', '24',
    '-g', '15', '-keyint_min', '15', '-sc_threshold', '0',
    '-r', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-y', output,
  ]);

  run(ffmpeg, [
    '-nostdin', '-v', 'error', '-i', output,
    '-frames:v', '1', '-q:v', '3', '-y', poster,
  ]);

  const metadata = inspect(output);
  if (
    metadata.codec !== 'h264'
    || metadata.width !== 1280
    || metadata.height !== 720
    || metadata.frameRate !== '30/1'
    || metadata.pixelFormat !== 'yuv420p'
    || metadata.audioCodec !== null
    || metadata.duration < 4.9
    || metadata.duration > 5.1
    || metadata.keyframes < 10
  ) {
    throw new Error(`${job.id} web encode is not conformant: ${JSON.stringify(metadata)}`);
  }

  manifestClips.push({
    id: job.id,
    order: index + 1,
    titleEn: job.titleEn,
    titleAr: job.titleAr,
    chapterEn: job.chapterEn,
    chapterAr: job.chapterAr,
    storyEn: job.storyEn,
    storyAr: job.storyAr,
    clip: webPath(worldRoot, output),
    poster: webPath(worldRoot, poster),
    sourceAsset: webPath(root, source),
    sourceSha256: job.sourceSha256,
    sha256: await sha256(output),
    ...metadata,
  });

  console.log(`[${String(index + 1).padStart(2, '0')}/14] ${job.id} -> ${webPath(root, output)} (${(metadata.bytes / 1_000_000).toFixed(2)} MB, ${metadata.keyframes} keyframes)`);
}

const manifest = {
  schema: 'academy-world-media/v1',
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  sourceModel: 'WAN 2.7 First & Last Frame',
  sourceCount: 16,
  clipCount: manifestClips.length,
  heldIds: held.map((job) => job.id),
  editDecision: acceptance.selection.editDecision,
  sourceMeasurement: acceptance.measurement,
  delivery: {
    codec: 'H.264',
    resolution: '1280x720',
    frameRate: 30,
    silent: true,
    pixelFormat: 'yuv420p',
    crf: 24,
    keyframeIntervalFrames: 15,
    faststart: true,
    providerMarkTreatment: 'Fixed 82x54 bottom-right region removed with ffmpeg delogo before scaling; common-bright set gate plus rendered visual inspection are required afterward.'
  },
  durationSeconds: Number(manifestClips.reduce((sum, clip) => sum + clip.duration, 0).toFixed(3)),
  totalBytes: manifestClips.reduce((sum, clip) => sum + clip.bytes, 0),
  clips: manifestClips,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Academy web media ready: ${manifest.clipCount} clips, ${(manifest.totalBytes / 1_000_000).toFixed(1)} MB, ${manifest.durationSeconds.toFixed(1)} s.`);
console.log(`Held outside reel: ${manifest.heldIds.join(', ')}`);
