/*! © 2026 Mohamed Mahmoud. All rights reserved. */
/**
 * Title tone, 2026-10-04. A title laid over a playing film stays readable whatever the frame does.
 * A few times a second the picture behind the title is sampled (in the title's own rectangle, through
 * the video's cover/contain fit), blended with whatever scrim sits on top of it, and the title fades
 * to white or ink, whichever contrasts more across the whole title, with a soft halo of the opposite
 * colour. A switch needs a clear win, so a flickering frame does not make the title flicker.
 *
 *   watchTone(title, {
 *     source: () => videoOrImg,                    // what is showing behind the title right now
 *     frame: () => DOMRect,                        // where that picture is drawn
 *     contain: () => bool,                         // contain fit instead of cover
 *     veil: (titleRect, frameRect) => [r, g, b, a] // the scrim over the picture at the title
 *     active: () => bool,                          // skip sampling while hidden
 *   })
 * Images and videos must be same-origin (they are: everything lives on this site). No dependencies.
 */
const css = `
[data-tone]{transition:color .7s ease,text-shadow .7s ease}
[data-tone=light]{color:#fffdf8!important;text-shadow:0 1px 2px rgba(0,0,0,.45),0 4px 28px rgba(0,0,0,.55)!important}
[data-tone=dark]{color:#111114!important;text-shadow:0 1px 2px rgba(255,255,255,.55),0 4px 28px rgba(255,255,255,.72)!important}
@media (prefers-reduced-motion:reduce) and (prefers-reduced-motion:no-preference){[data-tone]{transition:none}}`;
let styled = false;
const lin = c => {c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;};
const lum = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
const LIGHT = lum(255, 253, 248), DARK = lum(17, 17, 20);

/** '#0b1020' or 'rgb(…)' → [r, g, b] */
export function rgb(color) {
  const hex = /#([0-9a-f]{6})/i.exec(color || '');
  if (hex) return [0, 2, 4].map(i => parseInt(hex[1].slice(i, i + 2), 16));
  const m = /(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)/.exec(color || '');
  return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
}

/** Alpha of a piecewise-linear gradient at position t (0..1); stops: [[t, alpha], ...] ascending. */
export function along(stops, t) {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) {
    const [t0, a0] = stops[i - 1], [t1, a1] = stops[i];
    return a0 + (a1 - a0) * (t - t0) / Math.max(1e-6, t1 - t0);
  }
  return stops[stops.length - 1][1];
}

export function watchTone(el, {source, frame, contain = () => false, veil = () => null, active = () => true, every = 320}) {
  if (!el) return {stop() {}, refresh() {}};
  if (!styled) {styled = true; const s = document.createElement('style'); s.textContent = css; document.head.append(s);}
  const cv = document.createElement('canvas'); cv.width = 12; cv.height = 6;
  const g = cv.getContext('2d', {willReadFrequently: true});
  let tone = el.dataset.tone || '', broken = false;
  function sample() {
    if (broken || document.hidden || !active()) return;
    const v = source?.(); if (!v) return;
    const w = v.videoWidth || v.naturalWidth, h = v.videoHeight || v.naturalHeight;
    if (!w || !h || (v.readyState !== undefined && v.readyState < 2) || v.complete === false) return;
    const F = frame(), R = el.getBoundingClientRect();
    if (!F?.width || !R.width) return;
    const s = (contain() ? Math.min : Math.max)(F.width / w, F.height / h);
    const ox = F.left + (F.width - w * s) / 2, oy = F.top + (F.height - h * s) / 2;
    const x0 = Math.max(0, (R.left - ox) / s), y0 = Math.max(0, (R.top - oy) / s);
    const x1 = Math.min(w, (R.right - ox) / s), y1 = Math.min(h, (R.bottom - oy) / s);
    if (x1 - x0 < 2 || y1 - y0 < 2) return;
    let d;
    try {g.drawImage(v, x0, y0, x1 - x0, y1 - y0, 0, 0, 12, 6); d = g.getImageData(0, 0, 12, 6).data;} catch {broken = true; return;}
    const [vr, vg, vb, va] = veil(R, F) || [0, 0, 0, 0], k = 1 - va;
    // average contrast across the title (capped, so a few easy cells cannot hide a hard area)
    let light = 0, dark = 0;
    for (let i = 0; i < d.length; i += 4) {
      const L = lum(d[i] * k + vr * va, d[i + 1] * k + vg * va, d[i + 2] * k + vb * va);
      light += Math.min(7, ratio(LIGHT, L)); dark += Math.min(7, ratio(DARK, L));
    }
    const next = light >= dark ? 'light' : 'dark';
    if (next !== tone && (!tone || (next === 'light' ? light > dark * 1.12 : dark > light * 1.12))) {tone = next; el.dataset.tone = tone;}
  }
  const id = setInterval(sample, every);
  sample();
  return {stop() {clearInterval(id);}, refresh: sample};
}
