/*
 * Fluid display type — the fluidity pillar, tranche 1 (plan
 * design-showcase-experience §W1; owner rulings R14/R15).
 *
 * These cells run the kit's own tier files plus each identity's brand
 * sheets in a fixture page (the kit workspace is happy-dom and cannot
 * resolve clamp() against a viewport). What they prove:
 *
 * - each fluid slot renders its declared floor at 320px and today's exact
 *   size at 960/1280/1440/1920px, per identity (saturation at 960px keeps
 *   the estate's comparison widths unchanged);
 * - the floors answer to a RENDERED fit: the front page's longest-word
 *   headline fits a 320px line with hyphenation disabled — never ramp
 *   arithmetic tested against itself;
 * - text resize holds at both anchor widths (SC 1.4.4 two-width proxy:
 *   with the root font doubled, computed px at least doubles at 320px and
 *   1920px — between the anchors the ratio deliberately dips, and the
 *   rem-true bounds carry the criterion's real bar);
 * - leading is ratio-driven and byte-identical to the old fixed values at
 *   maximum width;
 * - under print media the slots render at their maxima, not at a
 *   page-box-derived size.
 */
import { expect, test, type Page } from '@playwright/test';
import { fixtureHtml, IDENTITIES, type IdentityExpectation } from './fluid-type-fixture';

const openFixture = async (page: Page, identity: IdentityExpectation): Promise<void> => {
  await page.setContent(fixtureHtml(identity.slug), { waitUntil: 'networkidle' });
  await page.evaluate(async () => document.fonts.ready);
  if (identity.fontCheck !== null) {
    const loaded = await page.evaluate((check) => document.fonts.check(check), identity.fontCheck);
    expect(loaded, `${identity.slug} display face must load before measuring`).toBe(true);
  }
};

const computedPx = async (
  page: Page,
  id: string,
  property: 'fontSize' | 'lineHeight',
): Promise<number> =>
  page
    .locator(`#${id}`)
    .evaluate((element, prop) => Number.parseFloat(getComputedStyle(element)[prop]), property);

const expectSlotSizes = async (
  page: Page,
  identity: IdentityExpectation,
  pick: (slot: IdentityExpectation['slots'][number]) => number,
  label: string,
): Promise<void> => {
  for (const [index, slot] of identity.slots.entries()) {
    expect(
      await computedPx(page, `h${index + 1}`, 'fontSize'),
      `h${index + 1} ${label}`,
    ).toBeCloseTo(pick(slot), 0);
  }
};

for (const identity of IDENTITIES) {
  test.describe(`fluid display type — ${identity.slug}`, () => {
    test(`floors at 320px, and a live curve at 640px`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await openFixture(page, identity);
      await expectSlotSizes(page, identity, (slot) => slot.min, 'floor at 320px');
      // one mid-curve reading so a broken interpolation cannot hide
      await page.setViewportSize({ width: 640, height: 900 });
      const mid = await computedPx(page, 'h1', 'fontSize');
      const [h1] = identity.slots;
      expect(mid, 'h1 mid-curve at 640px').toBeCloseTo(h1.min + (h1.max - h1.min) / 2, 0);
    });

    test(`saturation: today's exact sizes at every comparison width`, async ({ page }) => {
      await openFixture(page, identity);
      for (const width of [960, 1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await expectSlotSizes(page, identity, (slot) => slot.max, `at ${width}px`);
      }
    });

    test(`leading is ratio-driven and exact at maximum width`, async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 900 });
      await openFixture(page, identity);
      for (const [index, slot] of identity.slots.entries()) {
        expect(
          await computedPx(page, `h${index + 1}`, 'lineHeight'),
          `h${index + 1} leading at max`,
        ).toBeCloseTo(slot.max * slot.leading, 0);
      }
    });
  });

  test(`${identity.slug}: the longest hero word fits a 320px line, hyphenation disabled @a11y`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openFixture(page, identity);
    const scroll = await page.locator('#fit').evaluate((element) => element.scrollWidth);
    const client = await page.locator('#fit-box').evaluate((element) => element.clientWidth);
    expect(scroll, 'hero headline overflows its 320px line').toBeLessThanOrEqual(client);
  });

  test(`${identity.slug}: text resize doubles computed size at both anchor widths @a11y`, async ({
    page,
  }) => {
    for (const width of [320, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await openFixture(page, identity);
      const base = await computedPx(page, 'h1', 'fontSize');
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '32px';
      });
      const doubled = await computedPx(page, 'h1', 'fontSize');
      expect(doubled, `root doubled at ${width}px`).toBeGreaterThanOrEqual(base * 2 - 0.5);
    }
  });
}

test('under print media the fluid slots render at their maxima (dark-first identity)', async ({
  page,
}) => {
  const creature = IDENTITIES[2];
  await page.setViewportSize({ width: 640, height: 900 });
  await openFixture(page, creature);
  await page.emulateMedia({ media: 'print' });
  expect(await computedPx(page, 'h1', 'fontSize'), 'h1 under print').toBeCloseTo(
    creature.slots[0].max,
    0,
  );
});
