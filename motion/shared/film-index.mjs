/*! © 2026 Mohamed Mahmoud. All rights reserved. */




export function scrollProgress(scrollY, top, travel) {
  const p = (scrollY - top) / travel;
  return Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0;
}


export function clipIndexAt(time, clipSeconds, clipCount) {
  const last = Math.max(0, Math.floor(clipCount) - 1);
  const i = Math.floor(time / clipSeconds);
  return Number.isFinite(i) ? Math.min(last, Math.max(0, i)) : 0;
}


export const isClipIndex = (i, clipCount) => Number.isInteger(i) && i >= 0 && i < clipCount;


export function clipHref(template, index, clipCount = Infinity) {
  if (!isClipIndex(index, clipCount)) throw new RangeError(`Scene ${index} is not a clip of this film`);
  return template.replace('{index}', String(index).padStart(3, '0'));
}
