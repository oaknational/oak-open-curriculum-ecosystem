/**
 * Accessibility tests for Oak widget.
 *
 * Uses axe-core to verify the widget meets WCAG accessibility standards.
 * Tests exercise real product code (aggregated-tool-widget.ts).
 *
 * Note: The widget runs inside ChatGPT's iframe, so we exclude rules that
 * don't apply to embedded content (landmarks, regions). The widget now has
 * its own title and proper colour contrast.
 *
 * @see ../../src/aggregated-tool-widget.ts - Widget under test
 */

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Server } from 'node:http';

import { createWidgetTestServer } from './widget-test-server.js';
import { SEARCH_OUTPUT_FIXTURE, EMPTY_OUTPUT_FIXTURE } from './fixtures.js';

let serverUrl: string;
let server: Server;

test.beforeAll(() => {
  const app = createWidgetTestServer();
  server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to get server address — expected AddressInfo');
  }
  serverUrl = `http://localhost:${String(address.port)}`;
});

test.afterAll(() => {
  server.close();
});

/**
 * Rules excluded from accessibility checks for embedded widgets:
 * - landmark-one-main: Parent page provides landmarks (widget has role="main" now)
 * - region: Content is within parent page's landmark structure
 * - scrollable-region-focusable: Scroll container is managed by parent
 */
const EXCLUDED_RULES = ['landmark-one-main', 'region', 'scrollable-region-focusable'];

test.describe('Widget accessibility', () => {
  test('neutral shell passes WCAG checks', async ({ page }) => {
    await page.addInitScript((fixture: object) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- JC: Browser context injection requires any for window augmentation
      (globalThis as any).openai = { toolOutput: fixture };
    }, EMPTY_OUTPUT_FIXTURE);

    await page.goto(`${serverUrl}/widget`);

    const axe = await new AxeBuilder({ page }).disableRules(EXCLUDED_RULES).analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });

  test('search output passes WCAG checks including colour contrast', async ({ page }) => {
    await page.addInitScript((fixture: object) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- JC: Browser context injection requires any for window augmentation
      (globalThis as any).openai = {
        toolOutput: fixture,
        toolResponseMetadata: { toolName: 'search' },
      };
    }, SEARCH_OUTPUT_FIXTURE);

    await page.goto(`${serverUrl}/widget`);

    const axe = await new AxeBuilder({ page }).disableRules(EXCLUDED_RULES).analyze();
    expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
  });
});
