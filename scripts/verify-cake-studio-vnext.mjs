import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sabotage = process.argv.includes('--sabotage');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function readGlbJson(file) {
  const bytes = fs.readFileSync(path.join(root, file));
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF', `${file}: GLB magic`);
  assert.equal(bytes.readUInt32LE(4), 2, `${file}: GLB version`);
  const jsonLength = bytes.readUInt32LE(12);
  assert.equal(bytes.readUInt32LE(16), 0x4e4f534a, `${file}: JSON chunk`);
  const binaryHeader = 20 + jsonLength;
  assert.equal(bytes.readUInt32LE(binaryHeader + 4), 0x004e4942, `${file}: BIN chunk`);
  return {
    bytes,
    binaryStart: binaryHeader + 8,
    json: JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength)),
  };
}

function jpegDimensions(bytes) {
  assert.equal(bytes[0], 0xff, 'JPEG SOI');
  assert.equal(bytes[1], 0xd8, 'JPEG SOI');
  const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 <= bytes.length) {
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++];
    if (sof.has(marker)) {
      return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) continue;
    assert.ok(offset + 2 <= bytes.length, 'JPEG segment header');
    const length = bytes.readUInt16BE(offset);
    assert.ok(length >= 2, 'JPEG segment length');
    offset += length;
  }
  assert.fail('JPEG dimensions unavailable');
}

function fullMipBytes(width, height) {
  let total = 0;
  while (true) {
    total += width * height * 4;
    if (width === 1 && height === 1) return total;
    width = Math.max(1, Math.floor(width / 2));
    height = Math.max(1, Math.floor(height / 2));
  }
}

const models = readJson('public/worlds/cake-studio/models/manifest.json');
if (sabotage) {
  models.assets[0].decodedBaseBytes = 4;
  console.log('SABOTAGE APPLIED: first model decoded texture bytes falsified in memory.');
}
assert.equal(models.release, '1.4.0', 'runtime model release must be 1.4.0');
assert.equal(models.assets.length, 24, 'all 24 authored models remain available');
assert.ok(models.totalBytes <= 15_000_000, 'runtime model transfer exceeds 15 MB');
assert.ok(models.textureStats, 'manifest must measure decoded texture residency');
assert.ok(models.textureStats.maxEdge <= 512, 'runtime textures must be at most 512 px');
assert.ok(models.textureStats.decodedBaseBytes <= 64 * 1024 * 1024, 'decoded base textures exceed 64 MiB');
assert.ok(models.textureStats.estimatedMipBytes <= 67_108_864, 'full mip residency exceeds all-512 ceiling');
let decodedBaseBytes = 0;
let decodedMipBytes = 0;
let textureCount = 0;
for (const asset of models.assets) {
  const glb = readGlbJson(`public/worlds/cake-studio/models/${asset.file}`);
  assert.equal(glb.json.images?.length, 2, `${asset.id}: expected base-color and metallic-roughness JPEGs`);
  assert.ok((glb.json.materials || []).some((material) => (
    material.pbrMetallicRoughness?.baseColorTexture && material.pbrMetallicRoughness?.metallicRoughnessTexture
  )), `${asset.id}: mapped PBR material missing`);
  let assetBase = 0;
  let assetMip = 0;
  for (const image of glb.json.images) {
    assert.equal(image.mimeType, 'image/jpeg', `${asset.id}: texture must remain JPEG`);
    const view = glb.json.bufferViews[image.bufferView];
    const start = glb.binaryStart + (view.byteOffset || 0);
    const dimensions = jpegDimensions(glb.bytes.subarray(start, start + view.byteLength));
    assert.ok(Math.max(dimensions.width, dimensions.height) <= 512, `${asset.id}: embedded texture exceeds 512 px`);
    assetBase += dimensions.width * dimensions.height * 4;
    assetMip += fullMipBytes(dimensions.width, dimensions.height);
    textureCount += 1;
  }
  assert.equal(asset.textureCount, glb.json.images.length, `${asset.id}: manifest textureCount drift`);
  assert.equal(asset.decodedBaseBytes, assetBase, `${asset.id}: manifest decodedBaseBytes drift`);
  assert.equal(asset.estimatedMipBytes, assetMip, `${asset.id}: manifest estimatedMipBytes drift`);
  decodedBaseBytes += assetBase;
  decodedMipBytes += assetMip;
}
assert.equal(textureCount, 48, 'runtime texture count drift');
assert.equal(models.textureStats.textureCount, textureCount, 'manifest total texture count drift');
assert.equal(models.textureStats.decodedBaseBytes, decodedBaseBytes, 'manifest decoded base total drift');
assert.equal(models.textureStats.estimatedMipBytes, decodedMipBytes, 'manifest mip total drift');

const setManifest = readJson('public/worlds/cake-studio/set/manifest.json');
assert.equal(setManifest.release, '1.4.0', 'proof-room release must be 1.4.0');
assert.equal(setManifest.asset, 'cake-studio-proof-room.glb');
const set = readGlbJson('public/worlds/cake-studio/set/cake-studio-proof-room.glb');
assert.ok(set.bytes.length <= 2 * 1024 * 1024, 'proof-room GLB exceeds 2 MiB');
const nodeNames = new Set((set.json.nodes || []).map((node) => node.name));
for (const name of [
  'ProofRoom', 'Zone_Archive', 'Zone_Assembly', 'Zone_Handoff',
  'Anchor_Forms_Content', 'Anchor_Assembly_Content', 'Anchor_Handoff_Content',
  'Layer_Foreground', 'Layer_Midground', 'Layer_Background',
  'Handoff_PortalVoid', 'Camera_Desktop', 'Camera_Phone',
]) {
  assert.ok(nodeNames.has(name), `proof-room node missing: ${name}`);
}
assert.ok((set.json.cameras || []).length >= 2, 'proof-room needs desktop and phone cameras');
const cameraClip = (set.json.animations || []).find((animation) => animation.name === 'ProofRoom_Cameras');
assert.ok(cameraClip, 'authored camera clip missing');
assert.equal(cameraClip.channels.length, 4, 'camera clip must have exactly four transform channels');
const cameraTargets = cameraClip.channels.map((channel) => `${set.json.nodes[channel.target.node].name}.${channel.target.path}`).sort();
assert.deepEqual(cameraTargets, [
  'Camera_Desktop.rotation', 'Camera_Desktop.translation',
  'Camera_Phone.rotation', 'Camera_Phone.translation',
]);
for (const channel of cameraClip.channels) {
  const sampler = cameraClip.samplers[channel.sampler];
  assert.equal(set.json.accessors[sampler.input].max[0], 10, 'camera clip must end at 10 seconds');
}
for (const [name, expectedStart, expectedEnd] of [
  ['Camera_Desktop', 35, 30],
  ['Camera_Phone', 43, 40],
]) {
  const node = set.json.nodes.find((candidate) => candidate.name === name);
  const curve = JSON.parse(node?.extras?.fovCurve || 'null');
  assert.ok(Array.isArray(curve) && curve.length >= 8, `${name} authored FOV curve missing`);
  assert.equal(curve[0][1], expectedStart, `${name} opening FOV drifted`);
  assert.equal(curve.at(-1)[1], expectedEnd, `${name} closing FOV drifted`);
  assert.ok(new Set(curve.map((key) => key[1])).size >= 4, `${name} FOV curve was flattened`);
}

const html = readText('public/worlds/cake-studio.html');
const coda = readText('public/worlds/cake-studio-coda.js');
const codaLoader = readText('public/worlds/cake-studio-coda-loader.js');
assert.match(html, /data-version="1\.4\.0"/);
assert.match(html, /data-proof-portal/);
assert.match(html, /data-coda-reduced-poster/);
assert.match(html, /cake-studio-coda-loader\.js\?v=6/);
assert.match(codaLoader, /import\('\.\/cake-studio-coda\.js\?v=6'\)/);
for (const layout of ['desktop', 'phone']) {
  for (const act of ['forms', 'assembly', 'handoff']) {
    const file = `public/worlds/cake-studio/posters/coda-${act}-${layout}.jpg`;
    assert.ok(fs.statSync(path.join(root, file)).size > 15_000, `${file}: rendered reduced-motion poster missing`);
  }
}
assert.match(coda, /MODEL_GROUPS/);
assert.match(coda, /disposeModelGroup/);
assert.match(coda, /runtime\.cameraSource\s*=\s*['"]authored-clip['"]/);
assert.match(coda, /runtime\.setSource\s*=\s*['"]cake-studio-proof-room\.glb['"]/);
assert.match(coda, /reduced-static/);

console.log(`CAKE_STUDIO_VNEXT_OK models=${models.assets.length} textureBaseMiB=${(decodedBaseBytes / 1048576).toFixed(2)} textureMipMiB=${(decodedMipBytes / 1048576).toFixed(2)} setKiB=${(set.bytes.length / 1024).toFixed(1)}`);
