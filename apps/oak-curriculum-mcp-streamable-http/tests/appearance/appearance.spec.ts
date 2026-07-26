/**
 * Visual regression baselines for the served landing page.
 *
 * @remarks
 * This is the proof surface the page most needed and least had. Every visual
 * defect found during the port — a nested disclosure rendering the browser's
 * native triangle beside a collapsed chevron on ~78 rows, a masthead logo out
 * of line with the content column at every width, a band painted from the
 * button role rather than the inverted role, a `--stack` modifier with no base
 * class so its gap did nothing — was found by a person or an agent looking at a
 * render. Not one was caught by a gate: axe passes all sixteen accessibility
 * cells with the chevron broken, because a double marker is ugly, not
 * inaccessible.
 *
 * **Baselines are platform-specific.** CI renders on `ubuntu-latest`; these are
 * generated in a Linux image matching the installed Playwright, because
 * baselines captured on macOS would compare a different font rasteriser against
 * CI and fail on every run. Regenerate with `pnpm test:visual:baselines`.
 *
 * The tolerance in `playwright.config.ts` absorbs sub-pixel antialiasing, not
 * layout: a moved element or a wrong fill shifts far more than 1% of pixels.
 */

import { expect, test } from '@playwright/test';

import { applyTheme, THEMES } from '../visual/apply-theme.js';

/** The widths the responsive rules actually branch at. */
const VIEWPORTS = [
  { name: 'mobile', width: 320, height: 900 },
  { name: 'desktop', width: 1280, height: 900 },
] as const;

test.describe('Landing page appearance', () => {
  for (const theme of THEMES) {
    for (const viewport of VIEWPORTS) {
      test(`renders as approved — ${theme}, ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');

        // Prove this is the page before asserting how it looks. The first run
        // of this suite captured eight screenshots of a 403 error body and
        // passed every one: setting `data-theme` succeeds on any document,
        // `locator(...).all()` returns an empty list rather than failing, and
        // an absent baseline is written rather than compared. Nothing in the
        // pipeline objects to photographing the wrong page — so the spec has
        // to.
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.locator("[data-region='masthead']")).toBeVisible();
        await expect(page.locator('summary h2', { hasText: /Tools \(\d+\)/ })).toBeVisible();

        await applyTheme(page, theme);

        // Full page, both accordions open: closed, the shot would omit the ~78
        // tool disclosures that are most of the page's surface — and they are
        // where the rendering defects were.
        const accordions = await page.locator('.oak-accordion > summary').all();
        expect(accordions.length, 'expected the Resources and Tools disclosures').toBe(2);
        for (const summary of accordions) {
          await summary.click();
        }

        await expect(page).toHaveScreenshot(`landing-${theme}-${viewport.name}.png`, {
          fullPage: true,
        });
      });
    }
  }

  test('reflows at 320px without horizontal scroll', async ({ page }) => {
    // SC 1.4.10. Measured rather than eyeballed, and gated rather than
    // measured once during a review.
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto('/');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(overflow.scrollWidth).toBe(overflow.clientWidth);
  });
});
