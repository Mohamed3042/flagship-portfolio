/** DARB's road is evaluated from scroll alone. Distances are scene units. */
import type { ChapterSpec } from './types';

export const ROAD = {
  gold: '#E99763', // median warm pixels, gate-tunnel-cake top ring crop; light, never UI
  ground: -3.2,
  lane: 2.8,
  shell: 190,
  speed: 0.14,
  bend: 0.0024,
  depthNear: 8,
  depthFar: 45,
};

/** Remove every held interval from travelled distance. Constant speed elsewhere. */
export function roadDolly(u: number, chapters: ChapterSpec[], total: number): number {
  let held = 0;
  for (const c of chapters) {
    if (!c.reading) continue;
    held += Math.max(0, Math.min(u, c.reading.to) - c.reading.from);
  }
  return (u - held) * total;
}

export function roadBend(chapter: ChapterSpec, local: number): number {
  if (chapter.act !== 'road') return 0;
  const sign = chapter.id === 'road-games' || chapter.id === 'road-systems' || chapter.id === 'road-public' ? -1 : 1;
  return sign * ROAD.bend * Math.sin(Math.PI * local) ** 2;
}
