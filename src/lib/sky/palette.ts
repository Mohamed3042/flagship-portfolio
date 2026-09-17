/* One Sky palettes — the galaxy re-tints with the site's theme packs, using
   the same blob colours the aurora hero already reads (lib/theme.ts). */
import { activeTheme, THEME_AURORA } from '../theme';

export interface SkyPalette {
  light: boolean;
  core: string;
  route: string;
  arms: string[];
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

export function skyPalette(): SkyPalette {
  const theme = activeTheme();
  const blobs = THEME_AURORA[theme].blobs.map(hex);
  // The dark default leans on the site's four nebula accents in reading order.
  const arms = theme === 'dark' || theme === 'light' ? ['#2997ff', '#a259ff', '#ff5e8a', '#64d2ff'] : blobs;
  return { light: theme === 'light', core: CORE[theme], route: ROUTE[theme], arms };
}
