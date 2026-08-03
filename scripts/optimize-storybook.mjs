import { readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const assetFolder = process.argv[2] ?? 'storybook';
if (!/^[a-z0-9-]+$/i.test(assetFolder)) throw new Error(`Unsafe asset folder: ${assetFolder}`);
const root = new URL(`../public/images/${assetFolder}/`, import.meta.url);
const rootPath = decodeURIComponent(root.pathname).replace(/^\/(?:[A-Za-z]:)/, (value) => value.slice(1));
const files = (await readdir(rootPath)).filter((file) => file.endsWith('.png'));

for (const file of files) {
  const input = join(rootPath, file);
  const output = join(rootPath, `${parse(file).name}.webp`);
  const actionSlug = parse(file).name.replace(/-action$/, '');
  const pairedBase = new URL(`../public/images/storybook/${actionSlug}.webp`, import.meta.url);
  const pairedBasePath = decodeURIComponent(pairedBase.pathname).replace(/^\/(?:[A-Za-z]:)/, (value) => value.slice(1));
  const pairedSize = assetFolder === 'storybook-motion' ? await sharp(pairedBasePath).metadata() : null;
  const resize = pairedSize?.width && pairedSize?.height
    ? { width: pairedSize.width, height: pairedSize.height, fit: 'fill' }
    : { width: 1920, withoutEnlargement: true };
  await sharp(input)
    .resize(resize)
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(output);
  const sourceBytes = (await stat(input)).size;
  const outputBytes = (await stat(output)).size;
  console.log(`${file}: ${Math.round(sourceBytes / 1024)} KB -> ${Math.round(outputBytes / 1024)} KB`);
}
