#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const repositoryRoot = resolve(import.meta.dirname, '..');
const packRoot = join(repositoryRoot, 'public', 'worlds', 'assets', 'cake-studio');
const acceptedRoot = join(packRoot, 'accepted');
const defaultOutput = join(repositoryRoot, 'artifacts', 'cake-studio-media-audit');
const endpointThreshold = 18;

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : resolve(args[index + 1]);
};

const sourceRoot = option('--source', process.env.CAKE_STUDIO_SOURCE ? resolve(process.env.CAKE_STUDIO_SOURCE) : null);
const outputRoot = option('--output', defaultOutput);
const skipSheets = args.includes('--skip-sheets');

if (!sourceRoot) {
  throw new Error('Cake Studio source folder required: pass --source /path/to/cakez or set CAKE_STUDIO_SOURCE.');
}

function command(name, commandArgs, options = {}) {
  const result = spawnSync(name, commandArgs, {
    encoding: options.encoding ?? null,
    maxBuffer: 80_000_000,
  });
  if (result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString() : result.stderr;
    throw new Error(`${name} failed (${result.status}): ${stderr?.trim() ?? 'unknown error'}`);
  }
  return result.stdout;
}

function normalize(value) {
  return value.normalize('NFKC').replace(/\s+/g, ' ').trim();
}

function sourceStem(filename) {
  return normalize(basename(filename, '.mp4').replace(/ \(\d+\)$/u, ''));
}

function xml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function sha256(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

function probe(path) {
  const raw = command('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt',
    '-of', 'json',
    path,
  ], { encoding: 'utf8' });
  const data = JSON.parse(raw);
  const video = data.streams.find((stream) => stream.codec_type === 'video');
  const audio = data.streams.find((stream) => stream.codec_type === 'audio');
  return {
    codec: video?.codec_name ?? null,
    width: video?.width ?? null,
    height: video?.height ?? null,
    frameRate: video?.r_frame_rate ?? null,
    pixelFormat: video?.pix_fmt ?? null,
    audioCodec: audio?.codec_name ?? null,
    duration: Number(data.format?.duration ?? 0),
    bytes: Number(data.format?.size ?? 0),
  };
}

function frame(path, position) {
  const seek = position === 'end'
    ? ['-sseof', '-0.15']
    : ['-ss', String(position)];
  return command('ffmpeg', [
    '-nostdin', '-v', 'error',
    ...seek,
    '-i', path,
    '-an', '-frames:v', '1',
    '-f', 'image2pipe', '-vcodec', 'png',
    'pipe:1',
  ]);
}

const targetCache = new Map();
async function targetPixels(path, width, height) {
  const key = `${path}:${width}x${height}`;
  if (!targetCache.has(key)) {
    targetCache.set(
      key,
      sharp(path)
        .resize(width, height, { fit: 'fill' })
        .removeAlpha()
        .raw()
        .toBuffer(),
    );
  }
  return targetCache.get(key);
}

async function endpointMad(videoPath, imagePath, position, width, height) {
  const [actual, expected] = await Promise.all([
    sharp(frame(videoPath, position)).removeAlpha().raw().toBuffer(),
    targetPixels(imagePath, width, height),
  ]);
  if (actual.length !== expected.length) {
    throw new Error(`pixel buffer mismatch for ${videoPath}: ${actual.length} != ${expected.length}`);
  }
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference += Math.abs(actual[index] - expected[index]);
  }
  return Number((difference / actual.length).toFixed(3));
}

const inspectionCache = new Map();
async function inspectVideo(path, clip) {
  const hash = await sha256(path);
  const cacheKey = `${clip.clip}:${hash}`;
  if (inspectionCache.has(cacheKey)) {
    return { path, filename: basename(path), sha256: hash, ...inspectionCache.get(cacheKey) };
  }
  const metadata = probe(path);
  const firstImage = join(packRoot, clip.generationFirst);
  const lastImage = join(packRoot, clip.generationLast);
  const [firstMad, lastMad] = await Promise.all([
    endpointMad(path, firstImage, 0, metadata.width, metadata.height),
    endpointMad(path, lastImage, 'end', metadata.width, metadata.height),
  ]);
  const inspection = { metadata, firstMad, lastMad };
  inspectionCache.set(cacheKey, inspection);
  return { path, filename: basename(path), sha256: hash, ...inspection };
}

async function thumbnail(path, position) {
  return sharp(frame(path, position))
    .resize(236, 134, { fit: 'cover' })
    .jpeg({ quality: 84 })
    .toBuffer();
}

async function makeSheet(title, rows, outputPath) {
  const width = 1260;
  const headerHeight = 74;
  const rowHeight = 190;
  const height = headerHeight + rows.length * rowHeight + 20;
  const layers = [];
  layers.push({
    input: Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#091311"/>
      <text x="24" y="44" fill="#f5eadb" font-family="Arial, sans-serif" font-size="25" font-weight="700">${xml(title)}</text>
      ${rows.map((row, index) => {
        const y = headerHeight + index * rowHeight;
        const score = `first ${row.firstMad.toFixed(1)} · last ${row.lastMad.toFixed(1)}`;
        return `<rect x="16" y="${y}" width="1228" height="174" rx="10" fill="${index % 2 ? '#10211d' : '#0d1b18'}"/>
          <text x="28" y="${y + 24}" fill="#e7b9a8" font-family="Arial, sans-serif" font-size="16" font-weight="700">${xml(`${row.clip} · take ${row.take} · ${score}`)}</text>
          <text x="28" y="${y + 48}" fill="#9eb4ac" font-family="Arial, sans-serif" font-size="11">${xml(row.filename.slice(0, 148))}</text>`;
      }).join('')}
    </svg>`),
    top: 0,
    left: 0,
  });

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    const positions = [0, 1.2, 2.5, 3.8, 'end'];
    const images = await Promise.all(positions.map((position) => thumbnail(row.path, position)));
    for (let imageIndex = 0; imageIndex < images.length; imageIndex += 1) {
      layers.push({
        input: images[imageIndex],
        left: 28 + imageIndex * 242,
        top: headerHeight + rowIndex * rowHeight + 58,
      });
    }
  }

  await sharp({
    create: { width, height, channels: 4, background: '#091311' },
  }).composite(layers).png({ compressionLevel: 8 }).toFile(outputPath);
}

await mkdir(outputRoot, { recursive: true });

const pack = JSON.parse(await readFile(join(packRoot, 'clips.json'), 'utf8'));
if (!Array.isArray(pack.clips) || pack.clips.length !== 50) {
  throw new Error(`expected 50 clip definitions, found ${pack.clips?.length ?? 0}`);
}

const sourceFiles = (await readdir(sourceRoot))
  .filter((filename) => filename.toLowerCase().endsWith('.mp4'))
  .sort((a, b) => a.localeCompare(b))
  .map((filename) => join(sourceRoot, filename));

const incoming = new Map(pack.clips.map((clip) => [clip.clip, []]));
const unmapped = [];
const ambiguous = [];

for (const path of sourceFiles) {
  const stem = sourceStem(path);
  const matches = pack.clips.filter((clip) => normalize(`Wan_First&LastFrame_${clip.prompt}`).startsWith(stem));
  if (matches.length === 1) incoming.get(matches[0].clip).push(path);
  else if (matches.length === 0) unmapped.push(path);
  else ambiguous.push({ path, matches: matches.map((clip) => clip.clip) });
}

if (unmapped.length || ambiguous.length) {
  console.error(`Filename mapping failed: ${unmapped.length} unmapped, ${ambiguous.length} ambiguous.`);
  for (const path of unmapped) console.error(`UNMAPPED ${basename(path)}`);
  for (const item of ambiguous) console.error(`AMBIGUOUS ${basename(item.path)} -> ${item.matches.join(', ')}`);
  process.exit(2);
}

const accepted = [];
const candidates = [];
const failures = [];

for (const [index, clip] of pack.clips.entries()) {
  const acceptedPath = join(packRoot, clip.acceptedFilename);
  let acceptedAudit = null;
  try {
    await stat(acceptedPath);
    acceptedAudit = await inspectVideo(acceptedPath, clip);
    accepted.push({ clip: clip.clip, ...acceptedAudit });
    if (acceptedAudit.firstMad > endpointThreshold || acceptedAudit.lastMad > endpointThreshold) {
      failures.push(`${clip.clip} accepted endpoint MAD exceeds ${endpointThreshold}: ${acceptedAudit.firstMad}/${acceptedAudit.lastMad}`);
    }
  } catch (error) {
    if (error?.code === 'ENOENT') failures.push(`${clip.clip} accepted file is missing`);
    else throw error;
  }

  const paths = incoming.get(clip.clip);
  if (!paths.length) failures.push(`${clip.clip} has no matching Cakez export`);
  for (const [takeIndex, path] of paths.entries()) {
    const audit = await inspectVideo(path, clip);
    candidates.push({
      clip: clip.clip,
      number: clip.number,
      title: clip.title,
      chapter: clip.chapter,
      take: takeIndex + 1,
      matchesAccepted: acceptedAudit?.sha256 === audit.sha256,
      ...audit,
    });
  }
  console.log(`[${String(index + 1).padStart(2, '0')}/50] ${clip.clip}: ${paths.length} Cakez take(s), ${acceptedAudit ? 'accepted present' : 'accepted missing'}`);
}

const metadataFailures = candidates.filter(({ metadata }) => (
  metadata.codec !== 'h264'
  || metadata.width !== 1274
  || metadata.height !== 722
  || metadata.frameRate !== '30/1'
  || metadata.duration < 4.9
  || metadata.duration > 5.2
));
for (const item of metadataFailures) failures.push(`${item.clip} take ${item.take} has unexpected media metadata`);

const report = {
  schema: 'cake-studio-media-audit/v1',
  generatedAt: new Date().toISOString(),
  sourceRoot,
  endpointThreshold,
  clipDefinitions: pack.clips.length,
  sourceFiles: sourceFiles.length,
  mappedClips: [...incoming.values()].filter((paths) => paths.length).length,
  acceptedFiles: accepted.length,
  candidates,
  accepted,
  failures,
};

await writeFile(join(outputRoot, 'media-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

if (!skipSheets) {
  const sheetGroups = [
    ['approve-032-037', 32, 37],
    ['inspect-038-043', 38, 43],
    ['finale-044-050', 44, 50],
  ];
  for (const [name, first, last] of sheetGroups) {
    const rows = candidates.filter((item) => Number(item.number) >= first && Number(item.number) <= last);
    const path = join(outputRoot, `${name}.png`);
    await makeSheet(`Cake Studio · ${name.replaceAll('-', ' ')}`, rows, path);
    console.log(`Wrote ${path}`);
  }
}

console.log(`Audit: ${sourceFiles.length} exports -> ${report.mappedClips}/50 clips; ${accepted.length}/50 accepted files.`);
console.log(`Report: ${join(outputRoot, 'media-audit.json')}`);

if (failures.length) {
  console.error(`Cake Studio media gate RED (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Cake Studio media gate GREEN: all 50 clips are mapped, accepted, conformant, and endpoint-aligned.');
