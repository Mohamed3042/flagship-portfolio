import { readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const root = new URL('../public/images/storybook/', import.meta.url);
const rootPath = decodeURIComponent(root.pathname).replace(/^\/(?:[A-Za-z]:)/, (value) => value.slice(1));
const files = (await readdir(rootPath)).filter((file) => file.endsWith('.png'));

for (const file of files) {
  const input = join(rootPath, file);
  const output = join(rootPath, `${parse(file).name}.webp`);
  await sharp(input)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(output);
  const sourceBytes = (await stat(input)).size;
  const outputBytes = (await stat(output)).size;
  console.log(`${file}: ${Math.round(sourceBytes / 1024)} KB -> ${Math.round(outputBytes / 1024)} KB`);
}
