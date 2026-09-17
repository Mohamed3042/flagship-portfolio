/* One Sky palettes — the galaxy re-tints with the site's theme packs, using
   the same blob colours the aurora hero already reads (lib/theme.ts), and
   the deep-space ground the CSS paints (--space-1 / --space-2). */
import { activeTheme, THEME_AURORA } from '../theme';

export interface SkyPalette {
  light: boolean;
  core: string;
  route: string;
  arms: string[];
  /** deep-space gradient, top and bottom (the backdrop quad paints these) */
  top: string;
  bottom: string;
}

const hex = ([r, g, b]: [number, number, number]) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

const CORE: Record<string, string> = {
  dark: '#ffe6d2',
  light: '#7a4cff',
  neon: '#eafff2',
  cinema: '#ffdcb0',
  storybook: '#fff0c4',
  wave: '#e6fff1',
};

const ROUTE: Record<string, string> = {
  dark: '#9fd8ff',
  light: '#2b6fe0',
  neon: '#7dffb8',
  cinema: '#ffb454',
  storybook: '#f2c14e',
  wave: '#8a5cff',
};

const SPACE: Record<string, [string, string]> = {
  dark: ['#03030a', '#070713'],
  light: ['#eaf0ff', '#f6f4ff'],
  neon: ['#050705', '#0a0f0a'],
  cinema: ['#000000', '#0a0a0a'],
  storybook: ['#0b1029', '#131c45'],
  wave: ['#0e0e0e', '#161616'],
};

function cssVar(name: string, fallback: string): string {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function skyPalette(): SkyPalette {
  const theme = activeTheme();
  const blobs = THEME_AURORA[theme].blobs.map(hex);
  // The dark default leans on the site's four nebula accents in reading order.
  const arms = theme === 'dark' || theme === 'light' ? ['#2997ff', '#a259ff', '#ff5e8a', '#64d2ff'] : blobs;
  const space = SPACE[theme];
  return {
    light: theme === 'light',
    core: CORE[theme],
    route: ROUTE[theme],
    arms,
    top: cssVar('--space-1', space[0]),
    bottom: cssVar('--space-2', space[1]),
  };
}
