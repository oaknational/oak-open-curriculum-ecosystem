/**
 * Playwright tests for the MCP server landing page.
 *
 * Tests verify content rendering and WCAG accessibility compliance.
 * Focuses on structural assertions (sections present) rather than content.
 *
 * @remarks
 * These specs type-check under `tests/tsconfig.json`, not the app project. A
 * Playwright spec is genuinely two execution contexts — the test body runs in
 * Node, the `page.evaluate` callbacks run in the browser — so it needs the DOM
 * lib, and this app is a Node server whose own source must never be able to
 * reach for `document`. Same separation the widget already has.
 */

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { applyTheme, THEMES } from './apply-theme.js';

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
  //
  // The matrix is deliberate. A single run at the default viewport, in light,
  // with both accordions shut was green while the page held a Level A failure:
  // the config snippet is only a scroll container below ~500px, and with the
  // accordions closed axe never sees the ~78 tool disclosures that make up most
  // of the DOM. Each axis below is one an audit found the gate blind to.
  const A11Y_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

  for (const theme of THEMES) {
    for (const width of [320, 1280] as const) {
      for (const expanded of [false, true] as const) {
        test(`@a11y passes WCAG checks — ${theme}, ${width}px, ${
          expanded ? 'expanded' : 'collapsed'
        }`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await page.goto('/');
          await applyTheme(page, theme);

          if (expanded) {
            for (const summary of await page.locator('.oak-accordion > summary').all()) {
              await summary.click();
            }
          }

          const axe = await new AxeBuilder({ page }).withTags(A11Y_TAGS).analyze();
          expect(axe.violations.length, JSON.stringify(axe.violations, null, 2)).toBe(0);
        });
      }
    }
  }

  test('@a11y focus indicator contrasts against the inverted masthead band', async ({ page }) => {
    // The masthead is an inverted surface, so the canvas focus ring's halo
    // lands on a background of the opposite polarity. In dark that measured
    // 1.12:1 — a keyboard user could not see where they were. axe cannot catch
    // this: it does not evaluate focus-state contrast.
    await page.goto('/');
    await applyTheme(page, 'dark');

    // A real Tab, not .focus() — programmatic focus does not satisfy
    // :focus-visible, and asserting on it passes while painting nothing.
    let onBand = false;
    for (let i = 0; i < 12 && !onBand; i += 1) {
      await page.keyboard.press('Tab');
      onBand = await page.evaluate(() => document.activeElement?.closest('.site-tabs') !== null);
    }
    expect(onBand, 'expected Tab to reach a masthead tab control').toBe(true);

    const focusVisible = await page.evaluate(
      () => document.activeElement?.matches(':focus-visible') ?? false,
    );
    expect(focusVisible).toBe(true);

    // box-shadow is transitioned, so the value at t=0 is two transparent zero
    // layers. Polling for the settled value is what makes this measure the
    // ring a user sees rather than the frame before it.
    const readRing = async (): Promise<string> =>
      page.evaluate(() => {
        const focused = document.activeElement;
        return focused === null ? '' : getComputedStyle(focused).boxShadow;
      });

    await expect
      .poll(readRing)
      // grey20 (#f2f2f2) is the canvas ground and the defect; grey60 (#575757)
      // is --shadow-ground-inverted, which is what an inverted band must use.
      .toContain('87, 87, 87');

    expect(await readRing()).not.toContain('242, 242, 242');
  });
});
