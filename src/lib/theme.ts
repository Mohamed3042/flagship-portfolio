/* =====================================================================
   Identity-world registry.

   The portfolio owns one content model and one scroll engine. `data-world`
   changes the art direction and motion response without forking routes or
   story markup. `data-theme="light"` remains a separate appearance setting;
   Astronomy is always the default world.
   ===================================================================== */

export const WORLDS = [
  'astronomy',
  'razer',
  'disney',
  'cod',
  'netflix',
  'spotify',
  'apple',
  'samsung',
] as const;

export type WorldName = (typeof WORLDS)[number];
export type ThemeName = WorldName; // compatibility for the existing motion modules

export interface WorldMeta {
  glyph: string;
  label: string;
  transition: 'constellation' | 'chroma' | 'arc' | 'deploy' | 'zoom' | 'pulse' | 'titanium' | 'orbit';
}

export const WORLD_META: Record<WorldName, WorldMeta> = {
  astronomy: { glyph: '✦', label: 'Astronomy', transition: 'constellation' },
  razer: { glyph: '⌁', label: 'Razer · Chroma', transition: 'chroma' },
  disney: { glyph: '✧', label: 'Disney · Storybook', transition: 'arc' },
  cod: { glyph: '⌖', label: 'COD · Tactical', transition: 'deploy' },
  netflix: { glyph: '▮', label: 'Netflix · Cinema', transition: 'zoom' },
  spotify: { glyph: '≋', label: 'Spotify · Pulse', transition: 'pulse' },
  apple: { glyph: '◌', label: 'Apple · Titanium', transition: 'titanium' },
  samsung: { glyph: '◎', label: 'Samsung · Galaxy', transition: 'orbit' },
};

export const WORLD_GLYPHS: Record<WorldName, string> = Object.fromEntries(
  WORLDS.map((world) => [world, WORLD_META[world].glyph]),
) as Record<WorldName, string>;

/** Legacy names kept only long enough to migrate an existing visitor choice. */
export const LEGACY_WORLD_MAP: Record<string, WorldName> = {
  dark: 'astronomy',
  light: 'astronomy',
  neon: 'razer',
  cinema: 'netflix',
  storybook: 'disney',
  wave: 'spotify',
};

export function activeWorld(): WorldName {
  const value = document.documentElement.getAttribute('data-world') || 'astronomy';
  return (WORLDS as readonly string[]).includes(value) ? (value as WorldName) : 'astronomy';
}

/** Compatibility alias used by the existing canvas modules. */
export const activeTheme = activeWorld;

/* Scroll topology is shared. These values only change how the same progress
   feels: smoothing, depth, curved drift, glow response and Lenis damping. */
export interface ThemeMotion {
  scrub: true | number;
  pxScale: number;
  curve: number;
  glowGain: number;
  lenisLerp: number;
}

export const WORLD_MOTION: Record<WorldName, ThemeMotion> = {
  astronomy: { scrub: true, pxScale: 1, curve: 0, glowGain: 1, lenisLerp: 0.1 },
  razer: { scrub: 0.34, pxScale: 1.65, curve: 0, glowGain: 1.28, lenisLerp: 0.16 },
  disney: { scrub: 1.08, pxScale: 1.32, curve: 220, glowGain: 0.9, lenisLerp: 0.085 },
  cod: { scrub: 0.28, pxScale: 1.42, curve: 0, glowGain: 0.82, lenisLerp: 0.17 },
  netflix: { scrub: 1.45, pxScale: 0.52, curve: 0, glowGain: 0.58, lenisLerp: 0.07 },
  spotify: { scrub: 0.68, pxScale: 1.16, curve: 0, glowGain: 1.02, lenisLerp: 0.12 },
  apple: { scrub: 0.92, pxScale: 0.72, curve: 0, glowGain: 0.72, lenisLerp: 0.09 },
  samsung: { scrub: 0.72, pxScale: 1.22, curve: 34, glowGain: 1.08, lenisLerp: 0.12 },
};

export const THEME_MOTION = WORLD_MOTION;

export function themeMotion(): ThemeMotion {
  return WORLD_MOTION[activeWorld()];
}

export interface AuroraPalette {
  bg: string;
  blobs: [number, number, number][];
}

export const WORLD_AURORA: Record<WorldName, AuroraPalette> = {
  astronomy: { bg: '#000000', blobs: [[41, 151, 255], [162, 89, 255], [255, 94, 138], [124, 108, 255]] },
  razer: { bg: '#020604', blobs: [[68, 214, 44], [0, 224, 255], [255, 45, 196], [68, 214, 44]] },
  disney: { bg: '#050b2b', blobs: [[0, 168, 225], [232, 200, 122], [113, 95, 204], [79, 156, 255]] },
  cod: { bg: '#070806', blobs: [[255, 122, 0], [143, 163, 30], [214, 177, 100], [71, 85, 54]] },
  netflix: { bg: '#050505', blobs: [[229, 9, 20], [125, 9, 18], [255, 84, 48], [76, 7, 12]] },
  spotify: { bg: '#030705', blobs: [[29, 185, 84], [30, 215, 96], [138, 92, 255], [20, 92, 55]] },
  apple: { bg: '#020204', blobs: [[210, 220, 235], [115, 137, 166], [159, 122, 255], [78, 171, 255]] },
  samsung: { bg: '#010617', blobs: [[53, 98, 255], [18, 182, 255], [77, 90, 231], [45, 216, 255]] },
};

export const THEME_AURORA = WORLD_AURORA;
