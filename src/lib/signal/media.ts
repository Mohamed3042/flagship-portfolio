/** Media policy shared by world gates and owner-supplied character capsules. */
import type { ChapterSpec } from './types';
export const CLIP = { seconds: 5, fps: 24, ahead: 2 };
export function clipTime(local: number, holdEnd = .75): number {
  return Math.min(CLIP.seconds - 1 / CLIP.fps, Math.floor(Math.max(0, Math.min(1, local / holdEnd)) * CLIP.seconds * CLIP.fps) / CLIP.fps);
}
export function initMedia(root: HTMLElement, chapters: ChapterSpec[], coarse: boolean, reduced: boolean) {
  const videos = [...root.querySelectorAll<HTMLVideoElement>('[data-signal-clip]')].map(video => {
    const panel = video.closest<HTMLElement>('[data-chapter]')!;
    const index = chapters.findIndex(c => c.id === panel.dataset.chapter);
    video.muted = true; video.loop = coarse;
    video.dataset.policy = coarse ? 'loop' : 'scrub';
    video.addEventListener('canplay', () => { video.dataset.ready = 'true'; });
    return { video, index };
  });
  return {
    frame(index: number, local: number, u: number) {
      for (const {video, index: at} of videos) {
        // No clip competes with initial HTML paint. Direct links and the first
        // actual scroll admit only the nearest two beats, in either direction.
        if (!video.getAttribute('src') && u > 0 && Math.abs(at - index) <= CLIP.ahead) {
          video.src = video.dataset.src!; video.load();
        }
        const active = at === index;
        if (coarse && !reduced) {
          if (active && video.readyState >= 2 && video.paused) void video.play().catch(() => {});
          else if (!active && !video.paused) video.pause();
        } else {
          video.pause();
          const target = reduced ? 2.5 : clipTime(local);
          video.dataset.time = String(target);
          if (active && video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - target) > .015) video.currentTime = target;
        }
      }
    },
    dispose() { for (const {video} of videos) { video.pause(); video.removeAttribute('src'); video.load(); } },
  };
}
