import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceManifestPath = path.join(root, 'production', 'cake-studio', 'hunyuan3d', 'asset-manifest.json');
const runtimeDir = path.join(root, 'public', 'worlds', 'cake-studio', 'models');
const runtimeManifestPath = path.join(runtimeDir, 'manifest.json');
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
const failures = [];

function readGlb(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 20 || buffer.toString('ascii', 0, 4) !== 'glTF') {
    throw new Error('invalid GLB magic/header');
  }
  const version = buffer.readUInt32LE(4);
  const declaredLength = buffer.readUInt32LE(8);
  const jsonLength = buffer.readUInt32LE(12);
  const jsonType = buffer.toString('ascii', 16, 20);
  if (version !== 2 || declaredLength !== buffer.length || jsonType !== 'JSON') {
    throw new Error(`invalid GLB v2 structure (version=${version}, declared=${declaredLength})`);
  }
  return {
    bytes: buffer.length,
    json: JSON.parse(buffer.toString('utf8', 20, 20 + jsonLength).trimEnd()),
  };
}

if (!fs.existsSync(sourceManifestPath)) {
  failures.push(`missing source manifest: ${sourceManifestPath}`);
}

const sourceManifest = failures.length ? null : JSON.parse(fs.readFileSync(sourceManifestPath, 'utf8'));
const expectedCount = sourceManifest?.assets?.length || 0;
if (!fs.existsSync(runtimeManifestPath)) {
  failures.push(`missing runtime manifest: ${runtimeManifestPath}`);
}

const runtimeManifest = fs.existsSync(runtimeManifestPath)
  ? JSON.parse(fs.readFileSync(runtimeManifestPath, 'utf8'))
  : { assets: [] };
const runtimeById = new Map((runtimeManifest.assets || []).map((asset) => [asset.id, asset]));
let totalBytes = 0;
if (runtimeManifest.release !== '1.5.0') failures.push(`runtime release is ${runtimeManifest.release || 'missing'}, expected 1.5.0`);

for (const expected of sourceManifest?.assets || []) {
  const filePath = path.join(runtimeDir, expected.output);
  const runtimeAsset = runtimeById.get(expected.id);
  if (!runtimeAsset) failures.push(`${expected.id}: missing runtime manifest entry`);
  if (!fs.existsSync(filePath)) {
    failures.push(`${expected.id}: missing ${expected.output}`);
    continue;
  }
  try {
    const { bytes, json } = readGlb(filePath);
    totalBytes += bytes;
    if (bytes > MAX_FILE_BYTES) {
      failures.push(`${expected.id}: ${(bytes / 1_000_000).toFixed(2)} MB exceeds 2 MB file budget`);
    }
    if (!(json.extensionsUsed || []).includes('EXT_meshopt_compression')) failures.push(`${expected.id}: missing EXT_meshopt_compression`);
    if (!(json.extensionsUsed || []).includes('KHR_texture_basisu')) failures.push(`${expected.id}: missing KHR_texture_basisu`);
    if ((json.images || []).length !== 2 || (json.images || []).some((image) => image.mimeType !== 'image/ktx2')) {
      failures.push(`${expected.id}: expected two embedded KTX2 images`);
    }
    const externalUris = [
      ...(json.buffers || []).map((buffer) => buffer.uri),
      ...(json.images || []).map((image) => image.uri),
    ].filter(Boolean);
    if (externalUris.length) failures.push(`${expected.id}: GLB references external resources`);
    if (!runtimeAsset?.triangles || runtimeAsset.triangles > 150_000) {
      failures.push(`${expected.id}: runtime triangle count is missing or above 150k`);
    }
    if (runtimeAsset?.bytes !== bytes) failures.push(`${expected.id}: manifest byte count does not match file`);
  } catch (error) {
    failures.push(`${expected.id}: ${error.message}`);
  }
}

const unexpected = fs.existsSync(runtimeDir)
  ? fs.readdirSync(runtimeDir).filter((name) => name.endsWith('.glb') && !(sourceManifest?.assets || []).some((asset) => asset.output === name))
  : [];
if (unexpected.length) failures.push(`unexpected GLBs: ${unexpected.join(', ')}`);
if (runtimeManifest.assets?.length !== sourceManifest?.assets?.length) {
  failures.push(`runtime manifest has ${runtimeManifest.assets?.length || 0}/${expectedCount} assets`);
}
if (totalBytes > MAX_TOTAL_BYTES) {
  failures.push(`total ${(totalBytes / 1_000_000).toFixed(2)} MB exceeds 20 MB budget`);
}

if (failures.length) {
  console.error(`Cake Studio runtime models: FAILED (${failures.length})`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`Cake Studio runtime models: GREEN — ${expectedCount}/${expectedCount}, ${(totalBytes / 1_000_000).toFixed(2)} MB total, Meshopt + KTX2 embedded.`);
