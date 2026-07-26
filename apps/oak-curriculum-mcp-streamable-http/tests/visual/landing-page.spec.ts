/**
 * Playwright tests for the MCP server landing page.
 *
 * Tests verify content rendering and WCAG accessibility compliance.
 * Focuses on structural assertions (sections present) rather than content.
 */

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Landing page', () => {
  test('renders main heading and config snippet', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verify main heading contains Oak
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Oak/i);

    // Verify config snippet is present
    await expect(page.getByText(/"mcpServers"/)).toBeVisible();
  });

  test('displays hero explainer text', async ({ page }) => {
    await page.goto('/');

    // The hero band carries an explainer paragraph alongside the title.
    // Located by region and position rather than by a styling class, so the
    // test describes what a visitor sees rather than how it is dressed.
    const hero = page.locator("[data-region='hero'] p").first();
    await expect(hero).toBeVisible();
    await expect(hero).toContainText(/teachers/i);
  });

  test('has collapsible sections for Resources and Tools — and no Prompts section', async ({
    page,
  }) => {
    await page.goto('/');

    // Each section has a summary element containing an h2 with the section name and count
    // e.g. "Resources (3)", "Tools (26)". The app serves zero MCP prompts
    // (decisions register D11), so no Prompts section exists to advertise.
    await expect(page.locator('summary h2', { hasText: /Resources \(\d+\)/ })).toBeVisible();
    await expect(page.locator('summary h2', { hasText: /Tools \(\d+\)/ })).toBeVisible();
    await expect(page.locator('summary h2', { hasText: /Prompts \(\d+\)/ })).toHaveCount(0);
  });

  // Tagged so the dedicated `test:a11y` gate can run browser accessibility
  // assertions separately from the broader UI suite.
  test('@a11y passes WCAG accessibility checks', async ({ page }) => {
    await page.goto('/');

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });
});
