/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/**
 * Pure helpers of the film engine (film-world.js): which clip a film time falls in, and how far through its scroll
 * travel the page is. No DOM, so `node qa/film-clip-index.test.mjs` can run them.
 *
 * Why they exist (films-web-1a, 2026-11-11): the engine used to compute `(scrollY - top) / travel` and
 * `Math.floor(time / clipSeconds)` inline. With a travel of 0 (before the film's length is measured, or a page with no
 * height yet) that is 0 / 0 = NaN, and `Math.min/max` pass NaN through; `NaN < 0 || NaN >= clipCount` is false, so the
 * NaN clip index was accepted and the engine asked for `clip-NaN.mp4`. Every number that becomes a clip index now goes
 * through here and is always a whole number inside the film.
 */

/** 0..1: how far `scrollY` is through a travel of `travel` px that starts at `top`; 0 when there is no travel (yet) or any input is not a number. */
export function scrollProgress(scrollY, top, travel) {
  const p = (scrollY - top) / travel;
  return Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0;
}

/** The index of the clip that holds `time` seconds: a whole number in 0..clipCount-1, 0 for a time that is not a number. */
export function clipIndexAt(time, clipSeconds, clipCount) {
  const last = Math.max(0, Math.floor(clipCount) - 1);
  const i = Math.floor(time / clipSeconds);
  return Number.isFinite(i) ? Math.min(last, Math.max(0, i)) : 0;
}

/** True for an index the film has a clip for. */
export const isClipIndex = (i, clipCount) => Number.isInteger(i) && i >= 0 && i < clipCount;

/** The clip's address: `{index}` in the template becomes the zero-padded index. Throws on an index that is not a clip (never builds "clip-NaN"). */
export function clipHref(template, index, clipCount = Infinity) {
  if (!isClipIndex(index, clipCount)) throw new RangeError(`Scene ${index} is not a clip of this film`);
  return template.replace('{index}', String(index).padStart(3, '0'));
}
