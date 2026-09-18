/**
 * Encode the five worlds' own key frames for the landing's portals.
 *
 * Sources are the owner's generated art, read from each world's own page assets
 * (and, for the Academy, from the branch that holds that world). Nothing is
 * cropped or recoloured: the frame keeps its own aspect, is scaled to a width
 * the portal can actually use, and is written as AVIF under the round's budget
 * of 250 KB. The manifest it prints is the provenance table in the report.
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'assets', 'worlds');
const W = 'C:/Users/GAMING/Downloads/flagship-sss/public/worlds';
const SSS = 'C:/Users/GAMING/Downloads/flagship-sss';
mkdirSync(OUT, { recursive: true });

/** The Academy's page and art live on a branch; read that blob, never a guess. */
function fromBranch(path) {
  return execFileSync('git', ['-C', SSS, 'show', `origin/feature/academy-proven-spells:${path}`],
    { maxBuffer: 64 * 1024 * 1024, encoding: 'buffer' });
}

const FRAMES = [
  { key: 'cake-studio', src: `${W}/cake-studio/posters/CST-047.jpg` },
  { key: 'disney', src: `${W}/disney2/posters/kf-19.jpg` },
  { key: 'strings', src: `${W}/assets/strings/keyframes/CTS-KF22-the-cut.png` },
  { key: 'academy', branch: 'public/worlds/academy/posters/ACA-001.jpg' },
  { key: 'spotify', src: `${W}/spotify/live/j09-pupil.jpg` },
];

/** The portal never shows a frame wider than this many CSS px at DPR 1.5. */
const TARGET_WIDTH = 1180;
const MAX_KB = 250;

const manifest = [];
for (const frame of FRAMES) {
  const input = frame.branch ? fromBranch(frame.branch) : frame.src;
  const meta = await sharp(input).metadata();
  const width = Math.min(TARGET_WIDTH, meta.width);
  let quality = 58;
  let data;
  for (;;) {
    data = await sharp(input).resize({ width, withoutEnlargement: true })
      .avif({ quality, effort: 6, chromaSubsampling: '4:4:4' }).toBuffer();
    if (data.length <= MAX_KB * 1024 || quality <= 26) break;
    quality -= 6;
  }
  const out = join(OUT, `${frame.key}.avif`);
  writeFileSync(out, data);
  const written = await sharp(out).metadata();
  manifest.push({
    key: frame.key,
    source: frame.branch ? `flagship-sss@feature/academy-proven-spells:${frame.branch}` : frame.src,
    sourceSize: `${meta.width}x${meta.height}`,
    out: `src/assets/worlds/${frame.key}.avif`,
    size: `${written.width}x${written.height}`,
    aspect: Number((written.width / written.height).toFixed(4)),
    kb: Number((statSync(out).size / 1024).toFixed(1)),
    quality,
  });
}
console.log(JSON.stringify(manifest, null, 2));
