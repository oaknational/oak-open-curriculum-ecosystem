/**
 * The token reference's everything-visible invariants (owner ruling
 * 2026-08-18): no in-content scroll or clip at any canonical width, rows
 * genuinely flowing in columns, and the narrow family nav as a slide-out
 * disclosure. Split from demo-routes-a11y.spec.ts at the page seam.
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { assertOnlyKnownExternalOrigins } from './apply-state';
import { expectNoHorizontalOverflow, openRoute } from './route-checks';

/** Elements inside the token areas carrying scrollable overflow — the
 *  owner's everything-visible rule says this must be zero at every width.
 *  The visually-hidden pattern is a deliberate 1px clip of NON-visible
 *  content, so those boxes are out of the rule's scope. */
const tokenAreaScrollers = (page: Page): Promise<number> =>
  page.locator('.tok-area').evaluateAll(
    (areas) =>
      areas
        // The area ROOTS are in the evaluated set too: a clipping or
        // scrolling container at the root would hide token content while
        // a descendants-only sweep still reported zero.
        .flatMap((area) => [area, ...area.querySelectorAll('*')])
        .filter((el) => {
          if (el.classList.contains('oak-visually-hidden')) {
            return false;
          }
          const style = getComputedStyle(el);
          const scrollable = style.overflowX !== 'visible' || style.overflowY !== 'visible';
          return (
            scrollable && (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)
          );
        }).length,
  );

test.describe('token reference: everything visible, rows flowing in columns', () => {
  // The owner's hard rule (2026-08-18): no in-content scroll or clip
  // anywhere — a value, chip, or name is never behind a gesture. 305 is
  // the classic-scrollbar warrant width: CI's Linux draws classic
  // scrollbars that narrow the layout viewport below the 320 cell, so a
  // layout that only holds at exactly 320 is a latent CI red (the
  // round-1 worked instance; the DDR-009 dated amendment is queued on
  // the records parcel).
  for (const width of [305, 320, 664, 960, 1280, 1440] as const) {
    test(`no token content scrolls or clips at ${width}px @a11y`, async ({ page }) => {
      const aborted = await openRoute(page, '/tokens');
      await page.setViewportSize({ width, height: 900 });
      // Population first: a zero-count over an empty match set proves
      // nothing, so the invariant only counts once the rows exist.
      expect(await page.locator('.tok-area .tok-row').count()).toBeGreaterThan(0);
      await expect
        .poll(() => tokenAreaScrollers(page), {
          message: 'nothing in the token areas scrolls or clips',
        })
        .toBe(0);
      await expectNoHorizontalOverflow(page);
      assertOnlyKnownExternalOrigins(aborted);
    });
  }
});

test.describe('token reference: rows genuinely flow', () => {
  test('rows flow in two columns at monitor width and one thread at narrow @a11y', async ({
    page,
  }) => {
    const aborted = await openRoute(page, '/tokens');
    // Measured over EVERY family, not whichever sorts first (a one-token
    // first family cannot flow): the maximum distinct inline offsets any
    // family's rows occupy is the column count in effect.
    const maxDistinctRowOffsets = (): Promise<number> =>
      page
        .locator('.tok-rows')
        .evaluateAll((lists) =>
          Math.max(
            0,
            ...lists.map(
              (list) =>
                new Set(
                  [...list.children].map((row) => Math.round(row.getBoundingClientRect().left)),
                ).size,
            ),
          ),
        );
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect
      .poll(maxDistinctRowOffsets, { message: 'monitor width: the rows flow in two columns' })
      .toBe(2);
    await page.setViewportSize({ width: 320, height: 900 });
    await expect.poll(maxDistinctRowOffsets, { message: 'narrow: one column, one thread' }).toBe(1);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('token reference: the sticky band reserve covers its rendered height', () => {
  for (const width of [305, 320]) {
    test(`at ${width}px the scroll-margin reserve is at least the band height @a11y`, async ({
      page,
    }) => {
      // SC 2.4.11: at one-column widths the controls stack three rows —
      // a reserve computed for fewer rows leaves focused links and
      // jumped-to headings landing under the sticky band (measured
      // 144px band against a 128px two-row reserve, review round).
      const aborted = await openRoute(page, '/tokens');
      await page.setViewportSize({ width, height: 700 });
      const measured = await page.evaluate(() => {
        const band = document.querySelector('.tok-controls');
        const probe = document.querySelector('.tok-family h3');
        return band === null || probe === null
          ? null
          : {
              bandHeight: band.getBoundingClientRect().height,
              reserve: Number.parseFloat(getComputedStyle(probe).scrollMarginBlockStart),
            };
      });
      expect(measured).not.toBeNull();
      expect(measured?.reserve ?? 0).toBeGreaterThanOrEqual(measured?.bandHeight ?? Infinity);
      assertOnlyKnownExternalOrigins(aborted);
    });
  }
});

test.describe('token reference: the narrow family nav discloses', () => {
  test('closed at narrow, every link unscrolled when open, inline at wide @a11y', async ({
    page,
  }) => {
    const aborted = await openRoute(page, '/tokens');
    await page.setViewportSize({ width: 320, height: 900 });
    const nav = page.locator('.tok-nav');
    const summary = nav.locator('summary');
    // Closed: one honest line; the links are not in the page's reading
    // flow until asked for.
    await expect(summary).toBeVisible();
    await expect(nav.locator('a').first()).not.toBeVisible();
    await summary.click();
    // Open: the FULL list, and none of it behind an inner scrollbar (the
    // old capped box is gone).
    await expect(nav.locator('a').first()).toBeVisible();
    const navScrollBoxes = await nav.evaluate(
      (el) =>
        [el, ...el.querySelectorAll('*')].filter((node) => {
          const style = getComputedStyle(node);
          return (
            (style.overflowY !== 'visible' || style.overflowX !== 'visible') &&
            (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)
          );
        }).length,
    );
    expect(navScrollBoxes, 'the open list scrolls with the page, never in a box').toBe(0);
    // Wide: the wrapper dissolves and the list renders inline.
    await page.setViewportSize({ width: 1280, height: 900 });
    // The details element stays MOUNTED across the seam (focus and open
    // state survive zoom and rotation); dissolution is the summary
    // leaving the accessibility tree, not the DOM — and the click above
    // left the summary FOCUSED, so it stays rendered until focus moves
    // on (the declarative reverse-seam continuity).
    await expect(summary).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(summary).toBeHidden();
    await expect(nav.locator('a').first()).toBeVisible();
    assertOnlyKnownExternalOrigins(aborted);
  });
});
