/**
 * Playwright tests for the design token demo page.
 *
 * Verifies that the token demo page renders correctly and passes
 * WCAG 2.2 AA in both light and dark themes. The demo page is a
 * development tool — it is never built for production.
 */
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Token demo page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tokens.html', { waitUntil: 'networkidle' });
  });

  test('renders colour swatches', async ({ page }) => {
    const swatches = page.locator('.swatch');
    const count = await swatches.count();

    // At least the semantic colour tokens should be visible
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('renders typography samples', async ({ page }) => {
    const typeSamples = page.locator('.type-sample');
    const count = await typeSamples.count();

    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('renders spacing scale', async ({ page }) => {
    const spaceRows = page.locator('.space-row');
    const count = await spaceRows.count();

    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('detects current theme', async ({ page }) => {
    const themeIndicator = page.locator('#current-theme');
    const text = await themeIndicator.textContent();

    // Should show 'light' or 'dark' based on the Playwright project config
    expect(['light', 'dark']).toContain(text);
  });

  test('@a11y passes WCAG accessibility checks', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(
      results.violations.length,
      `Accessibility violations:\n${JSON.stringify(results.violations, null, 2)}`,
    ).toBe(0);
  });
});
