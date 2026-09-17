// Sanitized product screens from the project proof book → station layers.
// Source: MY Resume/01 Resumes/_ai_project_showcase_2026/assets/products
// (privacy-reviewed for the public proof book, then re-reviewed for this page
// on 2026-09-17). Crops remove what that second review held back: a hosting
// badge, a recipe side panel, and unrelated window edges. Re-run after the
// book changes: `node scripts/build-sky-shots.mjs`.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'C:/Users/GAMING/Claude/Projects/MY Resume/01 Resumes/_ai_project_showcase_2026/assets/products';
const OUT = 'public/img/sky';
const W = 1280;

/** name → { src, crop?: [left, top, width, height], pad?: true (letterbox to 16:10 on the image's own ground) } */
const SHOTS = {
  'askrepos-evals': { src: 'askrepos-evals.png', crop: [0, 0, 1440, 830] },
  'askrepos-answer': { src: 'askrepos-answer.png', crop: [0, 0, 1440, 830] },
  'askrepos-corpus': { src: 'askrepos-corpus.png', crop: [0, 0, 1440, 830] },
  'atmpl-console': { src: 'atmpl-console.png' },
  'atmpl-evals': { src: 'atmpl-evals.png' },
  'atmpl-audit': { src: 'atmpl-audit.png' },
  'relayops-overview': { src: 'relayops-overview.png' },
  'relayops-builder': { src: 'relayops-builder.png' },
  'relayops-intelligence': { src: 'relayops-intelligence.png' },
  'petpoint-reports': { src: 'petpoint-reports.png' },
  'cake-tour': { src: 'updates/2026-09-04-cake-studio-demo-public-product-tour/01-live-privacy-boundary.png', crop: [0, 0, 1440, 900] },
  'cake-render': { src: 'cake-rose.png', crop: [250, 60, 725, 960], pad: true },
  'mkeditor-v5-installed': { src: 'mkeditor-v5-installed.png' },
  'mkeditor-tour': { src: 'updates/2026-09-04-mk-editor-public-demo/highlight.png', crop: [0, 0, 1440, 900] },
  'sheep-tour': { src: 'updates/2026-09-04-sheep-business-management-demo-public-tour/01-public-private-boundary.png' },
  'sheep-dashboard': { src: 'sheep-dashboard.png' },
  'sheep-audit': { src: 'sheep-audit.png' },
  'spaceframe-utilization': { src: 'spaceframe-utilization.png' },
  'spaceframe-optimizer': { src: 'spaceframe-optimizer.png' },
  'spaceframe-desktop': { src: 'spaceframe-desktop.png' },
};

mkdirSync(OUT, { recursive: true });
for (const [name, spec] of Object.entries(SHOTS)) {
  let img = sharp(join(SRC, spec.src));
  if (spec.crop) {
    const [left, top, width, height] = spec.crop;
    img = sharp(await img.extract({ left, top, width, height }).png().toBuffer());
  }
  if (spec.pad) {
    const { data } = await img.clone().extract({ left: 2, top: 2, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    const meta = await img.metadata();
    const targetW = Math.round((meta.height * 16) / 10);
    const side = Math.max(0, Math.round((targetW - meta.width) / 2));
    img = sharp(await img.extend({ left: side, right: side, background: { r: data[0], g: data[1], b: data[2] } }).png().toBuffer());
  }
  const info = await img
    .resize({ width: W, withoutEnlargement: true })
    .webp({ quality: 76, effort: 5 })
    .withMetadata({ exif: { IFD0: { ImageDescription: `Sanitized product screen from the Mohamed Mahmoud project proof book (${spec.src}); cropped, not generated.` } } })
    .toFile(join(OUT, `${name}.webp`));
  console.log(name, info.width, info.height, (info.size / 1024).toFixed(0) + ' KB');
}
