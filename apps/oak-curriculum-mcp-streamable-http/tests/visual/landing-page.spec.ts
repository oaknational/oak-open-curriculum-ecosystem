/**
 * @fileoverview Playwright tests for the MCP server landing page.
 *
 * Tests verify content rendering and WCAG accessibility compliance.
 */

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Landing page', () => {
  test('renders correctly with all content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verify main heading contains Oak
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Oak/i);

    // Verify config snippet is present
    await expect(page.getByText(/"mcpServers"/)).toBeVisible();
  });

  test('displays hero explainer text for educators', async ({ page }) => {
    await page.goto('/');

    // Hero should be a prominent paragraph after the title
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    await expect(hero).toContainText(/curriculum/i);
    await expect(hero).toContainText(/teacher|educator/i);
  });

  test('passes accessibility checks', async ({ page }) => {
    await page.goto('/');

    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });
});
