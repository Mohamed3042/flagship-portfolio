export const CHAPTERS = ['Big days start small', 'Give your idea shape', 'Make it yours', 'Say it beautifully', 'Design. Approve. Produce.', 'Your whole cake studio', 'From idea to celebration'];
export const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, Number.isFinite(value) ? value : low));
export const scrollProgress = (scrollY, start, distance) => clamp((scrollY - start) / Math.max(1, distance));
export const mediaMode = (width, height) => width / Math.max(1, height) < 0.86 ? 'portrait' : 'landscape';
export const chapterAt = time => Math.min(6, Math.floor(clamp(time, 0, 28) / 4));
export const formatTime = seconds => `0:${String(Math.floor(clamp(seconds, 0, 59))).padStart(2, '0')}`;
export function downloadProgress(loaded, total, complete = false) {
  const safeLoaded = Math.max(0, loaded || 0);
  const known = Number.isFinite(total) && total > 0 && safeLoaded <= total;
  return { percent: complete ? 100 : known ? Math.min(99, Math.floor(safeLoaded / total * 100)) : null,
    label: `${(safeLoaded / 1000000).toFixed(1)}${known ? ` / ${(total / 1000000).toFixed(1)}` : ''} MB` };
}
