/**
 * The composition exhibit's behaviour proofs (review round 3 guards):
 *
 * - THEME OWNERSHIP — one holder per document. The kit runtime's live
 *   `prefers-contrast` listener rewrites `data-theme` when it believes no
 *   choice exists, so the exhibit's ground must be HELD, not written once.
 *   Both holders are proven against a deterministic external writer (the
 *   white-labelling stage's pattern): framed, the parent stage holds the
 *   frame's root; standalone, the exhibit holds its own.
 * - INVERTED MEANS FULLY REVERSED. `LAYOUT_DESCRIPTIONS.inverted` promises
 *   assistive-technology users the visual order is the full reverse of the
 *   source order — the whole roster, not just cta-before-hero (the round-3
 *   finding: the old maps scrambled the middle six while the ends held).
 */
import { expect, test } from '@playwright/test';
import type { Frame, Page } from '@playwright/test';

import { assertOnlyKnownExternalOrigins, interceptExternalOrigins } from './apply-state';
import { assertResolved } from './picker-stage';

/** Region names in DOM (source) order and in visual order — bounding
 *  boxes sorted by (top, left). The comparison target derives from the
 *  page's own roster, so the cell never carries a copy that can drift.
 *  Scope: the grid ITEMS (children of the main region container) — the
 *  reversal contract is about their placement, not the container. */
async function regionOrders(frame: Page | Frame): Promise<{ source: string[]; visual: string[] }> {
  return frame.evaluate(() => {
    const regions = [...document.querySelectorAll('[data-region="main"] > [data-region]')];
    const named = regions.map((el) => {
      const box = el.getBoundingClientRect();
      return { name: el.getAttribute('data-region') ?? '', top: box.top, left: box.left };
    });
    return {
      source: named.map((entry) => entry.name),
      visual: [...named]
        .sort((a, b) => (a.top === b.top ? a.left - b.left : a.top - b.top))
        .map((entry) => entry.name),
    };
  });
}

test.describe('composition: inverted is the FULL reverse of source order', () => {
  for (const width of [1440, 390]) {
    test(`at ${width}px the visual order is the reversed roster`, async ({ page }) => {
      const aborted = await interceptExternalOrigins(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/composition/frame?layout=inverted');
      const { source, visual } = await regionOrders(page);
      // Population guard: an empty or partial roster must fail here, not
      // vacuously pass the reversal below.
      expect(source.length).toBeGreaterThan(2);
      expect(source).toContain('hero');
      expect(visual).toEqual([...source].reverse());
      assertOnlyKnownExternalOrigins(aborted);
    });
  }
});

test.describe('composition: exactly one theme holder per document', () => {
  test('standalone, the exhibit holds its query theme against an external writer', async ({
    page,
  }) => {
    const aborted = await interceptExternalOrigins(page);
    await page.goto('/composition/frame?theme=dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    // Simulate ANY external writer (the kit runtime's live contrast
    // listener is the real one): the exhibit's own hold must correct it.
    await page.evaluate(() => {
      document.documentElement.dataset['theme'] = 'light';
    });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('framed, the parent stage holds the frame root against an external writer', async ({
    page,
  }) => {
    const aborted = await interceptExternalOrigins(page);
    await page.goto('/composition');
    await page.getByRole('radio', { name: 'Dark' }).check();
    const frame = await (
      await page.locator('.comp-frame-stage iframe').elementHandle()
    ).contentFrame();
    assertResolved(frame, 'the composition stage frame must resolve');
    await expect(frame.locator('html')).toHaveAttribute('data-theme', 'dark');
    await frame.evaluate(() => {
      document.documentElement.dataset['theme'] = 'light';
    });
    await expect(frame.locator('html')).toHaveAttribute('data-theme', 'dark');
    assertOnlyKnownExternalOrigins(aborted);
  });
});
