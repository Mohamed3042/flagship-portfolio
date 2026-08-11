import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sabotage = process.argv.find((argument) => argument.startsWith('--sabotage='))?.split('=')[1] || '';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));

function readGlb(file) {
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

function accessorValues(glb, accessorIndex) {
  const accessor = glb.json.accessors[accessorIndex];
  const view = glb.json.bufferViews[accessor.bufferView];
  const componentCounts = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
  const components = componentCounts[accessor.type];
  assert.ok(components, `unsupported accessor type ${accessor.type}`);
  assert.equal(accessor.componentType, 5126, 'proof-room animation accessors must be float32');
  const packedStride = components * 4;
  const stride = view.byteStride || packedStride;
  const start = glb.binaryStart + (view.byteOffset || 0) + (accessor.byteOffset || 0);
  return Array.from({ length: accessor.count }, (_, index) => (
    Array.from({ length: components }, (_unused, component) => (
      glb.bytes.readFloatLE(start + index * stride + component * 4)
    ))
  ));
}

function embeddedImageBytes(glb, image) {
  const view = glb.json.bufferViews[image.bufferView];
  const start = glb.binaryStart + (view.byteOffset || 0);
  return glb.bytes.subarray(start, start + view.byteLength);
}

const set = readGlb('public/worlds/cake-studio/set/cake-studio-proof-room.glb');
const setManifest = readJson('public/worlds/cake-studio/set/manifest.json');
const nodes = set.json.nodes || [];
const nodeNames = new Set(nodes.map((node) => node.name));
if (sabotage === 'sheet') nodeNames.delete('HeroSheet_Rig');

for (const name of [
  'HeroSheet_Rig', 'HeroSheet_Mesh',
  'SheetBone_00', 'SheetBone_01', 'SheetBone_02', 'SheetBone_03', 'SheetBone_04', 'SheetBone_05',
  'SheetBone_06', 'SheetBone_07', 'SheetBone_08', 'SheetBone_09', 'SheetBone_10',
]) {
  assert.ok(nodeNames.has(name), `rigged hero sheet node missing: ${name}`);
}
assert.ok((set.json.skins || []).length >= 1, 'hero sheet must export as a real glTF skin');
const sheetNode = nodes.find((node) => node.name === 'HeroSheet_Mesh');
assert.notEqual(sheetNode?.skin, undefined, 'HeroSheet_Mesh must reference a skin');
const sheetClip = (set.json.animations || []).find((animation) => animation.name === 'HeroSheet_Journey');
assert.ok(sheetClip, 'HeroSheet_Journey animation missing');
assert.ok(sheetClip.channels.length >= 18, 'HeroSheet_Journey needs authored object and bone channels');
const sheetTargets = new Set(sheetClip.channels.map((channel) => nodes[channel.target.node]?.name));
assert.ok([...sheetTargets].filter((name) => /^SheetBone_\d\d$/.test(name || '')).length >= 9, 'sheet clip must animate at least nine bones');
for (const channel of sheetClip.channels) {
  const sampler = sheetClip.samplers[channel.sampler];
  const times = accessorValues(set, sampler.input);
  assert.equal(Number(times.at(-1)[0].toFixed(6)), 10, 'hero sheet clip must end at 10 seconds');
}

for (const name of ['CustomerFrame_Aperture', 'Portal_SemanticPlane']) {
  assert.ok(nodeNames.has(name), `physical portal contract missing: ${name}`);
}
const cameraClip = (set.json.animations || []).find((animation) => animation.name === 'ProofRoom_Cameras');
assert.ok(cameraClip, 'ProofRoom_Cameras animation missing');
for (const cameraName of ['Camera_Desktop', 'Camera_Phone']) {
  const channel = cameraClip.channels.find((candidate) => (
    candidate.target.path === 'translation' && nodes[candidate.target.node]?.name === cameraName
  ));
  assert.ok(channel, `${cameraName} translation track missing`);
  const positions = accessorValues(set, cameraClip.samplers[channel.sampler].output);
  const depth = positions.map((position) => position[2]);
  assert.ok(Math.max(...depth) > 7, `${cameraName} must begin in front of the portal`);
  assert.ok(Math.min(...depth) < -4.5, `${cameraName} must physically cross the portal plane`);
}
assert.equal(setManifest.release, '1.5.0', 'proof-room manifest must be v1.5.0');
assert.equal(setManifest.heroSheet?.bones, 11, 'manifest hero-sheet bone count drift');
assert.equal(setManifest.portal?.cameraCrossing, true, 'manifest must record a camera-plane crossing');

const modelManifest = readJson('public/worlds/cake-studio/models/manifest.json');
assert.equal(modelManifest.release, '1.5.0', 'runtime model manifest must be v1.5.0');
assert.equal(modelManifest.assets.length, 24, 'all 24 production models remain available');
let ktxImages = 0;
let ktxPayloadBytes = 0;
const ktxMagic = Buffer.from([0xab, 0x4b, 0x54, 0x58, 0x20, 0x32, 0x30, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a]);
for (const [assetIndex, asset] of modelManifest.assets.entries()) {
  const glb = readGlb(`public/worlds/cake-studio/models/${asset.file}`);
  assert.ok(glb.json.extensionsUsed?.includes('KHR_texture_basisu'), `${asset.id}: KHR_texture_basisu missing`);
  assert.ok(glb.json.extensionsUsed?.includes('EXT_meshopt_compression'), `${asset.id}: EXT_meshopt_compression missing`);
  assert.equal(glb.json.images?.length, 2, `${asset.id}: expected two KTX2 images`);
  for (const [imageIndex, image] of glb.json.images.entries()) {
    assert.equal(image.mimeType, 'image/ktx2', `${asset.id}: image ${imageIndex} must be KTX2`);
    const payload = embeddedImageBytes(glb, image);
    const magic = sabotage === 'ktx' && assetIndex === 0 && imageIndex === 0
      ? Buffer.alloc(ktxMagic.length)
      : payload.subarray(0, ktxMagic.length);
    assert.ok(magic.equals(ktxMagic), `${asset.id}: image ${imageIndex} KTX2 magic mismatch`);
    ktxPayloadBytes += payload.length;
    ktxImages += 1;
  }
  for (const [textureIndex, texture] of (glb.json.textures || []).entries()) {
    assert.notEqual(texture.extensions?.KHR_texture_basisu?.source, undefined, `${asset.id}: texture ${textureIndex} basis source missing`);
  }
}
assert.equal(ktxImages, 48, 'runtime KTX2 image count drift');
assert.ok(ktxPayloadBytes <= 16 * 1024 * 1024, 'KTX2 GPU payload exceeds 16 MiB');

const html = sabotage === 'portal'
  ? readText('public/worlds/cake-studio.html').replace('data-cake-studio-live-ui', 'data-portal-sabotaged')
  : readText('public/worlds/cake-studio.html');
const css = readText('public/worlds/cake-studio.css');
let film = readText('public/worlds/cake-studio.js');
let coda = readText('public/worlds/cake-studio-coda.js');
let loader = readText('public/worlds/cake-studio-coda-loader.js');
if (sabotage === 'motion') loader += "\nmatchMedia('(prefers-reduced-motion: reduce)')";

assert.match(html, /data-version="1\.5\.0"/);
assert.match(html, /data-cake-studio-live-ui/);
for (const marker of ['data-ui-cake-form', 'data-ui-surface', 'data-ui-message', 'data-ui-output']) {
  assert.match(html, new RegExp(marker), `semantic Cake Studio interface missing ${marker}`);
}
assert.match(css, /--portal-aperture/);
assert.match(coda, /setKTX2Loader/);
assert.match(coda, /detectSupport\(renderer\)/);
assert.match(coda, /HeroSheet_Journey/);
assert.match(coda, /data-cake-studio-live-ui|cakeStudioLiveUi/);
for (const [file, source] of [['HTML', html], ['CSS', css], ['film JS', film], ['coda JS', coda], ['loader JS', loader]]) {
  assert.doesNotMatch(source, /prefers-reduced-motion|reduced-static|data-coda-reduced-poster/, `${file}: reduced-motion branch must not exist`);
}
assert.equal(loader.trim(), "import('./cake-studio-coda.js?v=7');", 'coda loader must always start the full runtime');
for (const file of [
  'public/worlds/cake-studio/addons/loaders/KTX2Loader.js',
  'public/worlds/cake-studio/addons/libs/basis/basis_transcoder.js',
  'public/worlds/cake-studio/addons/libs/basis/basis_transcoder.wasm',
  'public/worlds/cake-studio/addons/libs/meshopt_decoder.module.js',
]) {
  assert.ok(fs.statSync(path.join(root, file)).size > 1_000, `KTX2 runtime dependency missing: ${file}`);
}

console.log(
  `CAKE_STUDIO_IMPOSSIBLE_PROOF_ROOM_OK models=${modelManifest.assets.length} `
  + `ktxImages=${ktxImages} ktxMiB=${(ktxPayloadBytes / 1048576).toFixed(2)} `
  + `sheetBones=11 cameraCrossing=desktop+phone fullMotion=forced`,
);
