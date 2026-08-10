#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { basename, join, relative, resolve } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const repositoryRoot = resolve(import.meta.dirname, '..');
const packRoot = join(repositoryRoot, 'public', 'worlds', 'assets', 'cake-studio');
const worldRoot = join(repositoryRoot, 'public', 'worlds', 'cake-studio');
const clipsRoot = join(worldRoot, 'clips');
const postersRoot = join(worldRoot, 'posters');
const manifestPath = join(worldRoot, 'manifest.json');

function command(name, args, encoding = null) {
  const result = spawnSync(name, args, {
    encoding,
    maxBuffer: 80_000_000,
    stdio: encoding ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString() : result.stderr;
    throw new Error(`${name} failed (${result.status}): ${stderr?.trim() ?? 'unknown error'}`);
  }
  return result.stdout;
}

async function sha256(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

function inspect(path) {
  const raw = command('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt',
    '-of', 'json',
    path,
  ], 'utf8');
  const data = JSON.parse(raw);
  const video = data.streams.find((stream) => stream.codec_type === 'video');
  const audio = data.streams.find((stream) => stream.codec_type === 'audio');
  const keyframeLines = command('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-skip_frame', 'nokey',
    '-show_entries', 'frame=best_effort_timestamp_time', '-of', 'csv=p=0', path,
  ], 'utf8').trim().split('\n').filter(Boolean);
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
}

await mkdir(clipsRoot, { recursive: true });
await mkdir(postersRoot, { recursive: true });

const pack = JSON.parse(await readFile(join(packRoot, 'clips.json'), 'utf8'));
if (!Array.isArray(pack.clips) || pack.clips.length !== 50) {
  throw new Error(`expected 50 Cake Studio clips, found ${pack.clips?.length ?? 0}`);
}

const manifestClips = [];
for (const [index, clip] of pack.clips.entries()) {
  const source = join(packRoot, clip.acceptedFilename);
  await stat(source);
  const number = String(index + 1).padStart(3, '0');
  const output = join(clipsRoot, `CST-${number}.mp4`);
  const poster = join(postersRoot, `CST-${number}.jpg`);

  command('ffmpeg', [
    '-nostdin', '-v', 'error', '-i', source,
    '-map', '0:v:0',
    '-vf', 'delogo=x=1182:y=666:w=52:h=46,scale=1280:720:flags=lanczos',
    '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '24',
    '-g', '15', '-keyint_min', '15', '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-y', output,
  ]);

  await sharp(join(packRoot, clip.generationFirst))
    .resize(1280, 720, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 82, progressive: true, chromaSubsampling: '4:2:0' })
    .toFile(poster);

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
    throw new Error(`${clip.clip} web encode is not conformant: ${JSON.stringify(metadata)}`);
  }

  manifestClips.push({
    id: clip.clip,
    number: clip.number,
    chapter: clip.chapter,
    title: clip.title,
    storyboard: clip.storyboard,
    targetId: clip.targetId,
    clip: relative(worldRoot, output),
    poster: relative(worldRoot, poster),
    source: relative(worldRoot, source),
    sourceFilename: basename(source),
    sourceSha256: await sha256(source),
    sha256: await sha256(output),
    ...metadata,
  });
  console.log(`[${String(index + 1).padStart(2, '0')}/50] ${clip.clip} -> ${relative(repositoryRoot, output)} (${(metadata.bytes / 1_000_000).toFixed(2)} MB, ${metadata.keyframes} keyframes)`);
}

const manifest = {
  schema: 'cake-studio-world-media/v1',
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  sourcePack: relative(worldRoot, join(packRoot, 'clips.json')),
  sourceHandoff: 'owner-provided cakez folder',
  generationModel: 'WAN 2.7 First & Last Frame',
  webEncode: {
    codec: 'H.264',
    resolution: '1280x720',
    frameRate: 30,
    silent: true,
    crf: 24,
    keyframeIntervalFrames: 15,
    providerMarkTreatment: 'Fixed 52x46 corner region removed with ffmpeg delogo before scaling.',
  },
  clipCount: manifestClips.length,
  durationSeconds: Number(manifestClips.reduce((sum, clip) => sum + clip.duration, 0).toFixed(3)),
  totalBytes: manifestClips.reduce((sum, clip) => sum + clip.bytes, 0),
  clips: manifestClips,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Cake Studio web media ready: ${manifest.clipCount} clips, ${(manifest.totalBytes / 1_000_000).toFixed(1)} MB, ${manifest.durationSeconds.toFixed(1)} s.`);
console.log(`Manifest: ${relative(repositoryRoot, manifestPath)}`);
