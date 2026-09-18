import { featured } from './featured';

/**
 * Where every project lives in the One Sky.
 *
 * The eight featured systems sit on the home's flight order (the same
 * formula the home used before the story flights existed, so nothing on the
 * home moved). Every other story gets a deterministic seat from its slug, so
 * its planet is the same object every visit and on both language editions.
 * Both the home engine and the story flight read this spec, which is what
 * makes the planet a reader meets on the home the one they land on.
 */
export interface SystemSpec {
  id: string;
  a: string;
  b: string;
  /** 0 oceanic · 1 banded giant · 2 crystalline · 3 ember */
  kind: number;
  seed: number;
  radius: number;
  x: number;
  y: number;
  z: number;
}

const RADII = [4.6, 5.6, 4.0, 5.0];

/** FNV-1a over the slug: stable across builds and editions. */
export function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function systemSpec(slug: string, a: string, b: string): SystemSpec {
  const i = featured.findIndex((f) => f.slug === slug);
  if (i >= 0) {
    const N = featured.length;
    const t = N > 1 ? i / (N - 1) : 0;
    const ang = 0.55 + i * 0.84;
    const orbit = 100 - t * 56;
    return {
      id: slug,
      a,
      b,
      kind: i % 4,
      seed: i * 3.7 + 1.3,
      radius: RADII[i % 4],
      x: Math.cos(ang) * orbit,
      y: Math.sin(i * 1.7) * 6,
      z: Math.sin(ang) * orbit,
    };
  }
  const h = hashSlug(slug);
  const ang = (((h >>> 3) % 3600) / 3600) * Math.PI * 2;
  const orbit = 52 + ((h >>> 7) % 46);
  return {
    id: slug,
    a,
    b,
    kind: h % 4,
    seed: 20 + ((h >>> 11) % 199) * 0.37,
    radius: RADII[(h >>> 2) % 4] * 0.92,
    x: Math.cos(ang) * orbit,
    y: Math.sin(ang * 3.1) * 7,
    z: Math.sin(ang) * orbit,
  };
}
