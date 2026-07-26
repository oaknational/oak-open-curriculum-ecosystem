import { expect, type Page } from '@playwright/test';

/** The four themes the design system ships, and the page must honour. */
export const THEMES = ['light', 'dark', 'high-contrast', 'colour-safe'] as const;

/**
 * Puts the page into a theme and returns once it is settled and verified.
 *
 * @remarks
 * Two traps here, both hit before this helper existed.
 *
 * Setting `data-theme` after load starts the design system's `background` and
 * `box-shadow` transitions, and anything measured before they settle is a frame
 * of an animation, not the served state — axe read one such frame as a 3.23:1
 * masthead failure, `#8f8f8f` being the midpoint between the light and dark
 * button fills, a colour neither theme contains. Emulating reduced motion
 * collapses the system's `--motion-*` tokens to 0.01ms, so there is no frame to
 * catch it in.
 *
 * Setting it from an init script instead does not work at all: that runs
 * against the initial empty document, and the server-rendered
 * `<html data-theme="light">` then parses over the top. Every theme silently
 * became light, and a whole matrix went green while testing one cell.
 *
 * Hence the assertion. A theme helper that fails to apply the theme must fail
 * loudly, or every test built on it is worthless and looks fine.
 */
export async function applyTheme(page: Page, theme: string): Promise<void> {
  await page.emulateMedia({
    colorScheme: theme === 'dark' ? 'dark' : 'light',
    reducedMotion: 'reduce',
  });
  await page.evaluate((chosen) => {
    document.documentElement.setAttribute('data-theme', chosen);
  }, theme);

  const applied = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute('data-theme'),
    colorScheme: getComputedStyle(document.documentElement).colorScheme,
  }));
  expect(applied.theme, 'theme did not reach the document').toBe(theme);
  expect(applied.colorScheme, `${theme} resolved no colour-scheme`).not.toBe('');
}
