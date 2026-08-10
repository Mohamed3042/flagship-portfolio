import { open, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packRoot = join(repoRoot, 'production', 'cake-studio', 'hunyuan3d');
const manifestPath = join(packRoot, 'asset-manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const sourceDir = join(repoRoot, manifest.paths.source);
const outputDir = join(repoRoot, manifest.paths.generated);
const expectedOutputs = new Set(manifest.assets.map((asset) => asset.output));

const failures = [];
const notices = [];

for (const asset of manifest.assets) {
  const sourcePath = join(sourceDir, asset.source);
  const outputPath = join(outputDir, asset.output);

  try {
    const sourceInfo = await stat(sourcePath);
    if (sourceInfo.size < 100_000) failures.push(`${asset.id}: source image is unexpectedly small`);
  } catch {
    failures.push(`${asset.id}: missing source image ${asset.source}`);
  }

  try {
    const outputInfo = await stat(outputPath);
    if (outputInfo.size < 100_000) {
      failures.push(`${asset.id}: GLB is unexpectedly small (${outputInfo.size} bytes)`);
      continue;
    }

    const header = Buffer.alloc(12);
    const handle = await open(outputPath, 'r');
    try {
      await handle.read(header, 0, 12, 0);
    } finally {
      await handle.close();
    }
    if (header.toString('ascii', 0, 4) !== 'glTF') {
      failures.push(`${asset.id}: ${asset.output} does not have a GLB header`);
      continue;
    }

    const version = header.readUInt32LE(4);
    const declaredLength = header.readUInt32LE(8);
    if (version !== 2) failures.push(`${asset.id}: expected GLB v2, received v${version}`);
    if (declaredLength !== outputInfo.size) {
      failures.push(`${asset.id}: header length ${declaredLength} does not match file size ${outputInfo.size}`);
    }

    notices.push(`${asset.id}: ${asset.output} (${(outputInfo.size / 1_000_000).toFixed(2)} MB)`);
  } catch {
    failures.push(`${asset.id}: missing ${asset.output}`);
  }
}

const returnedFiles = (await readdir(outputDir)).filter((name) => name.toLowerCase().endsWith('.glb'));
for (const name of returnedFiles) {
  if (!expectedOutputs.has(name)) failures.push(`unexpected GLB filename: ${name}`);
}

console.log(`Cake Studio Hunyuan return: ${notices.length}/${manifest.assets.length} valid GLBs`);
for (const notice of notices) console.log(`  OK ${notice}`);

if (failures.length) {
  console.error(`\nFAILED (${failures.length})`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log('\nGREEN — all expected source images and GLB v2 outputs are present.');
}
