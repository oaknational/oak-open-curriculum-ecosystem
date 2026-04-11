/**
 * Playwright tests for the widget development index page.
 *
 * Verifies navigation links and WCAG 2.2 AA accessibility. The index
 * page is a development tool — it is never built for production.
 */
import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Widget dev index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('renders navigation heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Oak MCP App Widgets');
  });

  test('has link to token demo', async ({ page }) => {
    const link = page.getByRole('link', { name: /design tokens/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/tokens.html');
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
