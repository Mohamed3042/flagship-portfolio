import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const sabotage = process.argv.includes('--sabotage');
const impossibleGate = path.join(root, 'scripts', 'verify-cake-studio-impossible-proof-room.mjs');
const strict = spawnSync(process.execPath, [impossibleGate, ...(sabotage ? ['--sabotage=ktx'] : [])], {
  cwd: root,
  encoding: 'utf8',
});
process.stdout.write(strict.stdout || '');
process.stderr.write(strict.stderr || '');
if (strict.status !== 0) process.exit(strict.status || 1);

const models = JSON.parse(fs.readFileSync(path.join(root, 'public/worlds/cake-studio/models/manifest.json'), 'utf8'));
const set = JSON.parse(fs.readFileSync(path.join(root, 'public/worlds/cake-studio/set/manifest.json'), 'utf8'));
const sources = [
  'public/worlds/cake-studio.html',
  'public/worlds/cake-studio.css',
  'public/worlds/cake-studio.js',
  'public/worlds/cake-studio-coda.js',
  'public/worlds/cake-studio-coda-loader.js',
].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');

assert.equal(models.release, '1.5.0');
assert.equal(models.assets.length, 24);
assert.ok(models.totalBytes <= 20 * 1024 * 1024, 'runtime transfer exceeds 20 MiB');
assert.equal(models.textureStats.textureCount, 48);
assert.equal(models.textureStats.maxEdge, 512);
assert.ok(models.textureStats.ktxPayloadBytes <= 4 * 1024 * 1024, 'KTX2 payload exceeds 4 MiB');
assert.ok(models.textureStats.compressedGpuMipEstimateBytes <= 8 * 1024 * 1024, 'compressed GPU mip estimate exceeds 8 MiB');
assert.equal(models.textureStats.rgbaFallbackMipBytes, 67_108_800, 'RGBA fallback residency drift');
assert.equal(set.release, '1.5.0');
assert.equal(set.heroSheet.bones, 11);
assert.equal(set.portal.cameraCrossing, true);
assert.ok(set.bytes <= 2 * 1024 * 1024, 'proof-room GLB exceeds 2 MiB');
assert.doesNotMatch(sources, /prefers-reduced-motion|reduced-static|data-coda-reduced-poster/);

console.log(
  `CAKE_STUDIO_VNEXT_OK models=24 ktxMiB=${(models.textureStats.ktxPayloadBytes / 1048576).toFixed(2)} `
  + `compressedGpuMipMiB=${(models.textureStats.compressedGpuMipEstimateBytes / 1048576).toFixed(2)} `
  + `sheetBones=11 portalCrossing=true fullMotion=forced`,
);
