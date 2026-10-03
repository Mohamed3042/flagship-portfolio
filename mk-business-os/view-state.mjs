export const DURATION = 108;
export const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const number = (value, fallback, low, high) => Number.isFinite(Number(value)) && value !== null && value !== '' ? clamp(Number(value), low, high) : fallback;
export const defaults = (reduced = false) => ({ framing: 'fill', zoom: 1, x: 50, y: 50, pace: 20, manual: reduced, controls: 'auto', accent: 'amber' });
export function sanitize(input, reduced = false) {
  const d = defaults(reduced), s = input && typeof input === 'object' ? input : {};
  return { framing: ['fill', 'fit'].includes(s.framing) ? s.framing : d.framing,
    zoom: number(s.zoom, 1, 1, 1.6), x: number(s.x, 50, 0, 100), y: number(s.y, 50, 0, 100),
    pace: [12,20,30].includes(Number(s.pace)) ? Number(s.pace) : 20,
    manual: typeof s.manual === 'boolean' ? s.manual : d.manual,
    controls: s.controls === 'always' ? 'always' : 'auto',
    accent: ['amber','teal','white'].includes(s.accent) ? s.accent : 'amber' };
}
export function readSettings(storage, query, reduced) {
  let saved = {};
  try { saved = JSON.parse(storage.getItem('mk-business-film-v1') || '{}'); } catch {}
  const fromUrl = Object.fromEntries(query);
  if (query.has('manual')) fromUrl.manual = query.get('manual') === 'true';
  return sanitize({...saved, ...fromUrl}, reduced);
}
export function pictureRect(sourceW, sourceH, width, height, settings) {
  const fit = settings.framing === 'fit';
  const scale = (fit ? Math.min(width/sourceW, height/sourceH) : Math.max(width/sourceW, height/sourceH)) * (fit ? 1 : settings.zoom);
  const w = sourceW * scale, h = sourceH * scale;
  return { x: (width-w) * (fit ? .5 : settings.x/100), y: (height-h) * (fit ? .5 : settings.y/100), w, h };
}
export const timeAtScroll = (y, range) => clamp(range > 0 ? y/range : 0, 0, 1) * DURATION;
export const scrollAtTime = (time, range) => clamp(time/DURATION, 0, 1) * Math.max(0, range);
export const clock = time => `${String(Math.floor(time/60)).padStart(2,'0')}:${String(Math.floor(time%60)).padStart(2,'0')}`;
export const chapters = [
  [0,'From signal to strategy','من الإشارة إلى الاستراتيجية','#edb15d'],
  [4,'Discover','اكتشف','#edb15d'], [16,'Evidence','الأدلة','#80d6ca'],
  [28,'Your knowledge','معرفتك','#87c8f0'], [40,'Company briefs','ملفات الشركات','#e5a27d'],
  [52,'AI Intelligence','الذكاء الاصطناعي','#bea1ee'], [64,'Competitors','المنافسون','#85c6c7'],
  [76,'Experiments','التجارب','#aaca9b'], [88,'Today','اليوم','#edb15d'],
  [100,'Build what comes next','ابنِ خطوتك القادمة','#edb15d']
];
