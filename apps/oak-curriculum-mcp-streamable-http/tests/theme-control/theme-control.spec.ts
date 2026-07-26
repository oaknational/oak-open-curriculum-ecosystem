/**
 * The opt-in theme control, exercised as a visitor uses it.
 *
 * @remarks
 * This surface had no test of any kind. `THEME_SELECTOR_ENABLED` was hardcoded
 * false at every call site, so `public/landing-page.js` — the select wiring —
 * ran only in a browser nobody was measuring, and the axe gate never saw the
 * control it renders. That is the wrong way round: the flag exists so the
 * affordance can be enabled on preview builds, which means the flag-on page is
 * precisely the one a human is about to look at.
 *
 * These specs run against the second server declared in `playwright.config.ts`,
 * booted with the flag on. The default-off surface is covered by
 * `tests/visual/landing-page.spec.ts`.
 *
 * Type-checks under `tests/tsconfig.json` — see the note there on why the DOM
 * lib is scoped to specs rather than added to the app project.
 */

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const THEME_CONTROL = '#theme-control';

/** Reads the theme the document is actually in, not the one we asked for. */
async function currentTheme(page: Page): Promise<string | null> {
  return page.evaluate(() => document.documentElement.getAttribute('data-theme'));
}

test.describe('Theme control (THEME_SELECTOR_ENABLED=true)', () => {
  test('ships the control and its script together', async ({ page }) => {
    await page.goto('/');

    // ADR-217 §5: the mechanism travels with the control that reverses it.
    // Either both are present or neither is; a page carrying oak-theme.js
    // without the select can strand a visitor in a theme it never offered.
    await expect(page.locator(THEME_CONTROL)).toBeVisible();
    await expect(page.locator('script[src$="/oak-ds/oak-theme.js"]')).toHaveCount(1);
    await expect(page.locator('script[src$="/landing-page.js"]')).toHaveCount(1);
  });

  test('offers every theme the design system accepts', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator(`${THEME_CONTROL} option`)).toHaveCount(5);
    for (const value of ['light', 'dark', 'system', 'high-contrast', 'colour-safe']) {
      await expect(page.locator(`${THEME_CONTROL} option[value="${value}"]`)).toHaveCount(1);
    }
  });

  test('changes the document theme when a visitor picks one', async ({ page }) => {
    await page.goto('/');

    await page.selectOption(THEME_CONTROL, 'high-contrast');
    await expect.poll(async () => currentTheme(page)).toBe('high-contrast');

    await page.selectOption(THEME_CONTROL, 'dark');
    await expect.poll(async () => currentTheme(page)).toBe('dark');
  });

  test('is operable by keyboard alone', async ({ page }) => {
    await page.goto('/');

    // Reached by Tab, not by click — a control only a mouse can drive fails
    // SC 2.1.1 however well it works with a pointer.
    let reached = false;
    for (let i = 0; i < 15 && !reached; i += 1) {
      await page.keyboard.press('Tab');
      reached = await page.evaluate(() => document.activeElement?.id === 'theme-control');
    }
    expect(reached, 'expected Tab to reach the theme control').toBe(true);

    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => currentTheme(page)).not.toBe('light');
  });

  test('remembers the visitor’s choice across a reload', async ({ page }) => {
    await page.goto('/');
    await page.selectOption(THEME_CONTROL, 'colour-safe');
    await expect.poll(async () => currentTheme(page)).toBe('colour-safe');

    await page.reload();

    // Both halves matter: the theme must persist, AND the control must agree
    // with it. A select that reads "Light" while the page renders colour-safe
    // misreports state to every sighted user (SC 4.1.2).
    await expect.poll(async () => currentTheme(page)).toBe('colour-safe');
    await expect(page.locator(THEME_CONTROL)).toHaveValue('colour-safe');
  });

  test('@a11y passes WCAG checks with the control rendered', async ({ page }) => {
    await page.goto('/');

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });
});
