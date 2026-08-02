/**
 * Generate social cards + icons from inline SVG, rasterised with sharp.
 *   public/og/en.png, public/og/ar.png   (1200×630 OpenGraph)
 *   public/apple-touch-icon.png          (180×180)
 * Run: npm run og
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Common defs: aurora-like blooms + the brand gradient.
const defs = `
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2997ff"/>
      <stop offset="0.5" stop-color="#a259ff"/>
      <stop offset="1" stop-color="#ff5e8a"/>
    </linearGradient>
    <radialGradient id="b1" cx="0.18" cy="0.2" r="0.5">
      <stop offset="0" stop-color="#2997ff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#2997ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b2" cx="0.86" cy="0.16" r="0.5">
      <stop offset="0" stop-color="#a259ff" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#a259ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b3" cx="0.7" cy="0.95" r="0.55">
      <stop offset="0" stop-color="#ff5e8a" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#ff5e8a" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

const chips = (items) =>
  items
    .map((t, i) => {
      const x = 80 + i * 360;
      return `
      <g transform="translate(${x},498)">
        <rect width="330" height="64" rx="32" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.14"/>
        <text x="28" y="41" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="600" fill="#f5f5f7">${esc(t)}</text>
      </g>`;
    })
    .join('');

function card(lang) {
  const ar = lang === 'ar';
  const font = ar ? 'Tahoma, Segoe UI, sans-serif' : 'Segoe UI, Arial, sans-serif';
  const anchor = ar ? 'end' : 'start';
  const x = ar ? 1120 : 80;
  const eyebrow = ar ? 'محمد محمود · مهندس أتمتة · الكويت' : 'MOHAMED MAHMOUD · AUTOMATION ENGINEER · KUWAIT';
  const l1 = ar ? 'العمل اليدوي.' : 'Manual work.';
  const l2 = ar ? 'نحو أنظمة تعمل.' : 'Into systems that run.';
  const proof = ar
    ? ['٢٦ قصة موثقة', '١٧ عائلة جديدة', 'عربي + إنجليزي']
    : ['26 verified stories', '17 new families', 'English + Arabic'];
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <rect width="1200" height="630" fill="#000000"/>
    <rect width="1200" height="630" fill="url(#b1)"/>
    <rect width="1200" height="630" fill="url(#b2)"/>
    <rect width="1200" height="630" fill="url(#b3)"/>
    <text x="${x}" y="150" text-anchor="${anchor}" font-family="${font}" font-size="26" letter-spacing="3" fill="#a1a1a6">${esc(eyebrow)}</text>
    <text x="${x}" y="262" text-anchor="${anchor}" font-family="${font}" font-size="84" font-weight="800" fill="#f5f5f7">${esc(l1)}</text>
    <text x="${x}" y="374" text-anchor="${anchor}" font-family="${font}" font-size="84" font-weight="800" fill="url(#grad)">${esc(l2)}</text>
    ${chips(proof)}
  </svg>`;
}

const mark = `<svg width="180" height="180" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2997ff"/><stop offset="0.5" stop-color="#a259ff"/><stop offset="1" stop-color="#ff5e8a"/>
  </linearGradient></defs>
  <rect width="64" height="64" rx="15" fill="black"/>
  <text x="50%" y="52%" font-family="Segoe UI, Arial" font-size="30" font-weight="800" fill="url(#g)" text-anchor="middle" dominant-baseline="middle">MM</text>
</svg>`;

await mkdir(join(pub, 'og'), { recursive: true });
await sharp(Buffer.from(card('en'))).png().toFile(join(pub, 'og', 'en.png'));
await sharp(Buffer.from(card('ar'))).png().toFile(join(pub, 'og', 'ar.png'));
await sharp(Buffer.from(mark)).png().toFile(join(pub, 'apple-touch-icon.png'));
console.log('OG cards + icon written to public/');
