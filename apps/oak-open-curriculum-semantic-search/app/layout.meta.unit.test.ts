import type { Viewport } from 'next';
import { describe, expect, it, vi } from 'vitest';
import { createLightTheme } from './ui/themes/light';
import { createDarkTheme } from './ui/themes/dark';
import { resolveUiColor } from './lib/theme/ThemeGlobalStyle';

vi.mock('next/font/google', () => ({
  Lexend: () => ({ className: 'mock-lexend' }),
  Work_Sans: () => ({ className: 'mock-work-sans' }),
}));

function mapThemeColors(
  viewport: Viewport | undefined,
): Map<string | undefined, string | undefined> {
  if (!viewport?.themeColor || !Array.isArray(viewport.themeColor)) {
    return new Map();
  }
  return new Map(viewport.themeColor.map((entry) => [entry.media, entry.color]));
}

describe('Root layout metadata', () => {
  it('aligns theme-color metadata with semantic theme tokens', async () => {
    const { viewport } = await import('./layout');
    const themeColors = mapThemeColors(viewport);

    expect(themeColors.get('(prefers-color-scheme: light)')).toBe(
      resolveUiColor(createLightTheme(), 'bg-primary'),
    );

    expect(themeColors.get('(prefers-color-scheme: dark)')).toBe(
      resolveUiColor(createDarkTheme(), 'bg-primary'),
    );
  });
});
