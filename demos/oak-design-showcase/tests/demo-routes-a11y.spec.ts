/**
 * The demo-day routes' accessibility cells (review round 1, #907: the axe
 * matrix did not exercise the composition, token-reference, or
 * colour-matrix routes, so their regressions could ride a green build).
 * Same discipline as the specimen matrix: axe against the BUILT artefact,
 * the SC 1.4.10 reflow floor at 320px, and — for the composition exhibit —
 * proof that each layout map carries a NARROW face (below the kit's 840px
 * seam a map without narrow faces silently collapses to the canonical
 * stack and the layout control goes dead).
 */
import { expect, test } from '@playwright/test';

import { assertOnlyKnownExternalOrigins } from './apply-state';
import { expectNoAxeViolations } from './axe-checks';
import { assertResolved } from './picker-stage';
import { expectNoHorizontalOverflow, openRoute } from './route-checks';

const ROUTES = ['/tokens', '/tokens/colours', '/composition'] as const;
const DENSE_COLOUR_MATRIX_ROUTE = '/tokens/colours';
const DENSE_COLOUR_MATRIX_SLOW_REASON =
  'axe over the dense colour-token matrix can exceed the generic UI timeout on shared runners';

test.describe('demo routes: axe', () => {
  for (const route of ROUTES) {
    for (const theme of ['light', 'dark'] as const) {
      test(`${route} × ${theme} has no WCAG 2.2 AA violations @a11y`, async ({ page }) => {
        test.slow(route === DENSE_COLOUR_MATRIX_ROUTE, DENSE_COLOUR_MATRIX_SLOW_REASON);
        const aborted = await openRoute(page, route);
        await page.evaluate((value) => {
          document.documentElement.dataset['theme'] = value;
        }, theme);
        await expectNoAxeViolations(page);
        assertOnlyKnownExternalOrigins(aborted);
      });
    }
  }
});

test.describe('demo routes: reflow at 320px', () => {
  test.use({ viewport: { width: 320, height: 900 } });
  for (const route of ROUTES) {
    test(`${route} reflows to 320px without loss @a11y`, async ({ page }) => {
      test.slow(route === DENSE_COLOUR_MATRIX_ROUTE, DENSE_COLOUR_MATRIX_SLOW_REASON);
      const aborted = await openRoute(page, route);
      await expectNoHorizontalOverflow(page);
      await expectNoAxeViolations(page);
      assertOnlyKnownExternalOrigins(aborted);
    });
  }
});

test.describe('composition exhibit: every layout, both grounds', () => {
  for (const layout of ['document', 'magazine', 'dashboard', 'inverted'] as const) {
    for (const theme of ['light', 'dark'] as const) {
      test(`frame ${layout} × ${theme} has no WCAG 2.2 AA violations @a11y`, async ({ page }) => {
        const aborted = await openRoute(page, `/composition/frame?layout=${layout}&theme=${theme}`);
        await expectNoAxeViolations(page);
        assertOnlyKnownExternalOrigins(aborted);
      });
    }
  }
});

test.describe('composition exhibit: narrow faces re-arrange', () => {
  test.use({ viewport: { width: 320, height: 900 } });
  for (const layout of ['document', 'magazine', 'dashboard', 'inverted'] as const) {
    test(`frame ${layout} reflows to 320px without loss @a11y`, async ({ page }) => {
      const aborted = await openRoute(page, `/composition/frame?layout=${layout}`);
      await expectNoHorizontalOverflow(page);
      assertOnlyKnownExternalOrigins(aborted);
    });
  }

  test('inverted leads with the cta at 320px while document leads with the hero @a11y', async ({
    page,
  }) => {
    const topOf = async (region: string): Promise<number> =>
      page.locator(`[data-region='${region}']`).evaluate((el) => el.getBoundingClientRect().top);
    const aborted = await openRoute(page, '/composition/frame?layout=document');
    expect(await topOf('hero')).toBeLessThan(await topOf('cta'));
    await page.goto('/composition/frame?layout=inverted');
    await expect(page.locator('main').first()).toBeVisible();
    expect(await topOf('cta')).toBeLessThan(await topOf('hero'));
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('composition controls: each group is its own row', () => {
  test('the layout and theme groups never share a horizontal band @a11y', async ({ page }) => {
    const aborted = await openRoute(page, '/composition');
    const rows = await page.locator('.comp-controls > *').evaluateAll((els) => {
      const boxes = els.map((el) => el.getBoundingClientRect()).sort((a, b) => a.top - b.top);
      return {
        groups: boxes.length,
        overlaps: boxes.filter((box, index) => {
          const previous = boxes[index - 1];
          return previous !== undefined && box.top < previous.bottom;
        }).length,
      };
    });
    expect(rows.groups, 'both control groups render').toBeGreaterThan(1);
    expect(rows.overlaps, 'rows by construction, never by wrap coincidence').toBe(0);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('white-labelling stage: the parent theme holds against frame writers', () => {
  test('an external data-theme write inside a column is corrected @a11y', async ({ page }) => {
    const aborted = await openRoute(page, '/identity-white-labelling');
    const stageHandle = await page.locator('.frame iframe').first().elementHandle();
    const stageFrame = await stageHandle.contentFrame();
    assertResolved(stageFrame, 'the first column frame must resolve');
    await expect(stageFrame.locator('[data-identity]').first()).toBeVisible();
    // Each framed document runs the kit runtime, whose live contrast
    // listener rewrites data-theme on an OS change. Simulate any such
    // external writer; the stage's hold must correct it back to the
    // parent-owned state (identity default: no attribute).
    await stageFrame.evaluate(() => {
      document.documentElement.dataset['theme'] = 'dark';
    });
    await expect
      .poll(() => stageFrame.evaluate(() => document.documentElement.dataset['theme'] ?? null), {
        message: 'the stage theme governs for the life of the mount',
      })
      .toBeNull();
    assertOnlyKnownExternalOrigins(aborted);
  });
});
