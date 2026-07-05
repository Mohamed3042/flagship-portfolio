/* =====================================================================
   Theme registry + THEME_MOTION (Claude Design theme sheets, 2026-07-05).
   Six switchable themes: dark (default, attribute absent) · light · neon ·
   cinema · storybook · wave. The CSS token packs live in tokens.css; this
   module is the single JS source for (a) the theme list the selector renders,
   (b) the per-theme MOTION personality the engines read (easings/scrub
   smoothing/depth/glow — parameterizing the existing systems, never forking
   them), and (c) the canvas palettes for the space + aurora layers.
   dark/light keep the exact pre-theme-pack values — their behavior is frozen.
   ===================================================================== */

export const THEMES = ['dark', 'light', 'neon', 'cinema', 'storybook', 'wave'] as const;
export type ThemeName = (typeof THEMES)[number];

/** Per-theme glyph for the nav trigger + menu rows (decorative, aria-hidden). */
export const THEME_GLYPHS: Record<ThemeName, string> = {
  dark: '☾',
  light: '☀',
  neon: '▞',
  cinema: '▭',
  storybook: '✦',
  wave: '≈',
};

/** The active theme, read from <html data-theme> (absent = dark). */
export function activeTheme(): ThemeName {
  const v = document.documentElement.getAttribute('data-theme') || 'dark';
  return (THEMES as readonly string[]).includes(v) ? (v as ThemeName) : 'dark';
}

/* ---- Motion personality (one map, four identities + the frozen default) ----
   scrub      GSAP ScrollTrigger scrub (true = 1:1, number = smoothing seconds)
   pxScale    multiplier on every [data-px] depth speed
   curve      storybook's curved-path drift: max X offset in px (0 = straight)
   glowGain   multiplier on the scroll-glow curve (clamped to 1)
   lenisLerp  Lenis smoothing (higher = snappier wheel response)               */
export interface ThemeMotion {
  scrub: true | number;
  pxScale: number;
  curve: number;
  glowGain: number;
  lenisLerp: number;
}
export const THEME_MOTION: Record<ThemeName, ThemeMotion> = {
  // frozen: identical to the pre-pack engine values
  dark: { scrub: true, pxScale: 1, curve: 0, glowGain: 1, lenisLerp: 0.1 },
  light: { scrub: true, pxScale: 1, curve: 0, glowGain: 1, lenisLerp: 0.1 },
  // snappy/hard — slides stop dead, deeper parallax, hotter glow
  neon: { scrub: 0.35, pxScale: 1.6, curve: 0, glowGain: 1.25, lenisLerp: 0.16 },
  // slow dolly — heavy smoothing, ~half depth (reads as camera, not layers)
  cinema: { scrub: 1.6, pxScale: 0.45, curve: 0, glowGain: 0.55, lenisLerp: 0.07 },
  // floaty — soft smoothing, deep drift on curved (sine) paths
  storybook: { scrub: 1.1, pxScale: 1.35, curve: 260, glowGain: 0.9, lenisLerp: 0.085 },
  // rhythmic bounce — quantized feel, moderate smoothing
  wave: { scrub: 0.7, pxScale: 1.15, curve: 0, glowGain: 1, lenisLerp: 0.12 },
};
export function themeMotion(): ThemeMotion {
  return THEME_MOTION[activeTheme()];
}

/* ---- Aurora (dark hero canvas) blob palettes, RGB triples ----
   dark/light keep the original blues; the packs re-tint the same four blobs.
   (Bespoke per-theme heroes are a noted follow-up — this pass theme-tints.) */
export const THEME_AURORA: Record<ThemeName, { bg: string; blobs: [number, number, number][] }> = {
  dark: { bg: '#000', blobs: [[41, 151, 255], [162, 89, 255], [255, 94, 138], [124, 108, 255]] },
  light: { bg: '#000', blobs: [[41, 151, 255], [162, 89, 255], [255, 94, 138], [124, 108, 255]] },
  neon: { bg: '#0a0a0a', blobs: [[0, 255, 128], [255, 61, 242], [0, 214, 108], [255, 61, 242]] },
  cinema: { bg: '#000', blobs: [[217, 4, 41], [255, 180, 84], [217, 4, 41], [120, 10, 30]] },
  storybook: { bg: '#0b1029', blobs: [[242, 193, 78], [255, 159, 178], [169, 155, 240], [242, 193, 78]] },
  wave: { bg: '#0e0e0e', blobs: [[25, 212, 106], [138, 92, 255], [25, 212, 106], [138, 92, 255]] },
};
