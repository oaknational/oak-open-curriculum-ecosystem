/**
 * Playwright tests for the Oak brand banner widget.
 *
 * Tests verify structural rendering and WCAG 2.2 AA accessibility in
 * both light and dark themes (configured as separate Playwright projects
 * in `playwright.widget.config.ts`). The widget runs standalone via Vite
 * dev server — no MCP server connection required.
 *
 * @remarks
 * The `@a11y` tag allows `test:widget:a11y` to run accessibility checks
 * independently from visual assertions via `--grep @a11y`.
 */
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Oak banner widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/oak-banner.html', { waitUntil: 'networkidle' });
  });

  test('renders Oak brand banner', async ({ page }) => {
    const banner = page.locator('.oak-banner');
    await expect(banner).toBeVisible();

    const link = page.locator('.oak-banner__link');
    await expect(link).toContainText('Oak National Academy');
  });

  test('renders Oak logo SVG', async ({ page }) => {
    const logo = page.locator('.oak-banner__logo');
    await expect(logo).toBeVisible();
  });

  test('banner link targets Oak website', async ({ page }) => {
    const link = page.locator('.oak-banner__link');
    await expect(link).toHaveAttribute('href', 'https://www.thenational.academy');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('applies page background from design tokens', async ({ page }) => {
    const body = page.locator('body');

    // Design tokens set a non-transparent background via CSS custom properties.
    // Playwright's toHaveCSS asserts the computed value.
    await expect(body).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
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
