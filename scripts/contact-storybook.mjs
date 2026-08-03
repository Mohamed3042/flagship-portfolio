import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetFolder = process.argv[2] ?? 'storybook';
if (!/^[a-z0-9-]+$/i.test(assetFolder)) throw new Error(`Unsafe asset folder: ${assetFolder}`);
const root = path.resolve('public/images', assetFolder);
const outDir = path.resolve('artifacts/storybook-motion');
const names = (await readdir(root)).filter((name) => name.endsWith('.webp') && name !== 'opening-book.webp').sort();
const cellW = 320;
const cellH = 220;
const columns = 5;
const rows = Math.ceil(names.length / columns);
await mkdir(outDir, { recursive: true });

const composites = await Promise.all(names.map(async (name, index) => {
  const thumb = await sharp(path.join(root, name))
    .resize(cellW, cellH - 26, { fit: 'cover' })
    .extend({ bottom: 26, background: '#16120e' })
    .composite([{
      input: Buffer.from(`<svg width="${cellW}" height="26"><rect width="100%" height="100%" fill="#16120e"/><text x="10" y="18" fill="#ead8b5" font-size="12" font-family="Arial">${name.replace('.webp', '')}</text></svg>`),
      top: cellH - 26,
      left: 0,
    }])
    .png()
    .toBuffer();
  return { input: thumb, left: (index % columns) * cellW, top: Math.floor(index / columns) * cellH };
}));

await sharp({
  create: { width: columns * cellW, height: rows * cellH, channels: 3, background: '#0d0b09' },
}).composite(composites).png().toFile(path.join(outDir, `${assetFolder}-contact.png`));

console.log(`Wrote ${names.length} scenes to ${path.join(outDir, `${assetFolder}-contact.png`)}`);
