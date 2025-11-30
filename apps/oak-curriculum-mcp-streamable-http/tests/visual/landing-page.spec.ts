/**
 * @fileoverview Playwright tests for the MCP server landing page.
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

    // Hero should be a prominent paragraph after the title
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('has collapsible sections for Resources, Prompts, and Tools', async ({ page }) => {
    await page.goto('/');

    // Each section has a summary element containing an h2 with the section name and count
    // e.g. "Resources (3)", "Prompts (3)", "Tools (26)"
    await expect(page.locator('summary h2', { hasText: /Resources \(\d+\)/ })).toBeVisible();
    await expect(page.locator('summary h2', { hasText: /Prompts \(\d+\)/ })).toBeVisible();
    await expect(page.locator('summary h2', { hasText: /Tools \(\d+\)/ })).toBeVisible();
  });

  test('passes WCAG accessibility checks', async ({ page }) => {
    await page.goto('/');

    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });
});
