/**
 * Encode the five worlds' own key frames for the landing's portals.
 *
 * Sources are the owner's generated art, read from each world's own page
 * assets. Nothing is cropped or recoloured here: the frame keeps its own
 * aspect and is written as AVIF under the round's budget of 250 KB. The
 * manifest it prints is the provenance table in the report.
 *
 * ROUND 4 — HOW BIG. The plate used to be a small rectangle floating inside
 * the aperture; it is now the aperture itself, so the frame is scaled to COVER
 * an ellipse 1.12 wide for every 1 tall and clipped to it. What decides the
 * encode is therefore the plate's HEIGHT: a frame wider than 1.12 is scaled to
 * the plate's height and loses its sides to the clip, so its height is the
 * only dimension that carries resolution into the aperture.
 *
 * The director asked for 2x the ring box. PLATE_HEIGHT is the shipped desktop
 * rim at 1440x900 — 0.525 of the frustum, divided by the 1.1 the iris ticks
 * add to the figure's own box — and the target is twice that. FOUR OF THE FIVE
 * SOURCES CANNOT REACH IT: the owner's generated clips are 1280x720 masters,
 * so their frames are 720 px tall against a target of 860, and the Spotify
 * frame is letterboxed to 536. Nothing is upscaled to hide that. The manifest
 * carries the multiple each frame actually achieves and the report states it.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'assets', 'worlds');
const W = 'C:/Users/GAMING/Downloads/flagship-sss/public/worlds';
mkdirSync(OUT, { recursive: true });

const FRAMES = [
  { key: 'cake-studio', src: `${W}/cake-studio/posters/CST-047.jpg` },
  { key: 'disney', src: `${W}/disney2/posters/kf-19.jpg` },
  { key: 'strings', src: `${W}/assets/strings/keyframes/CTS-KF22-the-cut.png` },
  // Restored to this line with the world itself this round; it was read off
  // feature/academy-proven-spells while the page was 404.
  { key: 'academy', src: `${W}/academy/posters/ACA-001.jpg` },
  { key: 'spotify', src: `${W}/spotify/live/j09-pupil.jpg` },
];

/** The shipped desktop rim height in CSS px at 1440x900: 900 * 0.525 / 1.1. */
const PLATE_HEIGHT = 900 * 0.525 / 1.1;
/** The director's ask: twice the ring box. */
const TARGET_HEIGHT = Math.round(PLATE_HEIGHT * 2);
const MAX_KB = 250;

const manifest = [];
for (const frame of FRAMES) {
  const meta = await sharp(frame.src).metadata();
  const height = Math.min(TARGET_HEIGHT, meta.height);
  let quality = 62;
  let data;
  for (;;) {
    data = await sharp(frame.src).resize({ height, withoutEnlargement: true })
      .avif({ quality, effort: 6, chromaSubsampling: '4:4:4' }).toBuffer();
    if (data.length <= MAX_KB * 1024 || quality <= 26) break;
    quality -= 6;
  }
  const out = join(OUT, `${frame.key}.avif`);
  writeFileSync(out, data);
  const written = await sharp(out).metadata();
  manifest.push({
    key: frame.key,
    source: frame.src,
    sourceSize: `${meta.width}x${meta.height}`,
    out: `src/assets/worlds/${frame.key}.avif`,
    size: `${written.width}x${written.height}`,
    aspect: Number((written.width / written.height).toFixed(4)),
    kb: Number((statSync(out).size / 1024).toFixed(1)),
    quality,
    // What the aperture actually gets: the plate is this many times the
    // shipped desktop rim, in each direction. 2.0 is the ask.
    plateMultiple: Number((written.height / PLATE_HEIGHT).toFixed(2)),
    targetHeight: TARGET_HEIGHT,
    sourceLimited: written.height < TARGET_HEIGHT,
  });
}
console.log(JSON.stringify({ plateHeightCss: Number(PLATE_HEIGHT.toFixed(1)), targetHeight: TARGET_HEIGHT, frames: manifest }, null, 2));
