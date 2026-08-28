/**
 * The specimen and side-by-side pages' mechanism proofs. (The picker's
 * proofs live in identity-picker.spec.ts — one route per spec once the
 * picker grew its own control surface.)
 *
 * SPECIMEN — presentation is data, applied server-side. Navigation is the
 * only input: the probe goes to `?brand=` and asserts the brand is IN
 * EFFECT in computed style, never merely that a link exists (a link proves
 * the mechanism is wired; a computed value proves it fired). The sheet
 * rides the initial HTML, so there is no post-load application step for a
 * flash to hide in.
 *
 * No identity slug is typed in this file: every name derives from the
 * imported roster, which keeps the identity-naming census untouched.
 */
import { typeSafeKeys } from '@oaknational/type-helpers';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import {
  DEFAULT_VIEWPORT_WIDTH,
  VIEWPORT_WIDTH_LABELS,
  VIEWPORT_WIDTHS,
} from '../components/canonical-widths';
import { BASE_IDENTITY, IDENTITIES, IDENTITY_LABELS } from '../components/useIdentity';
import { MEASUREMENT_WIDTH_VALUES } from '../tools/measurement-widths';
import { assertResolved } from './picker-stage';
import {
  assertOnlyKnownExternalOrigins,
  brandNameFont,
  interceptExternalOrigins,
} from './apply-state';

const COUNTER_BRANDS = IDENTITIES.filter((slug) => slug !== BASE_IDENTITY);

/** The hero band's computed ground — the decorative surface the
 *  colour-safe distinctness claim measures. */
async function heroBandBackground(page: Page): Promise<string> {
  return page.evaluate(() => {
    const band = document.querySelector('.hero-band');
    return band === null ? '' : getComputedStyle(band).backgroundColor;
  });
}

async function applySpecimenThemeAttribute(page: Page, theme: string): Promise<void> {
  await page.evaluate((value) => {
    document.documentElement.dataset['theme'] = value;
  }, theme);
}

test.describe('specimen: identity is server-applied and in effect at first paint', () => {
  test('each counter-brand changes computed style relative to the base', async ({ page }) => {
    const aborted = await interceptExternalOrigins(page);
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    const baseFont = await brandNameFont(page);
    expect(baseFont).not.toBe('');

    for (const identity of COUNTER_BRANDS) {
      await page.goto(`/identity-switchboard/specimen?brand=${identity}`);
      await expect(page.locator('[data-identity]')).toHaveAttribute('data-identity', identity);
      // The brand sheet is in the initial HTML; "in effect" is a computed
      // value that differs from the base render, polled only because font
      // application is async even for a document-order sheet.
      await expect
        .poll(async () => brandNameFont(page), {
          message: `the ${identity} face must differ from the base face`,
        })
        .not.toBe(baseFont);
    }
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('colour-safe is visibly distinct from light', async ({ page }) => {
    await interceptExternalOrigins(page);
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    // Owner ruling 2026-08-10: colour-safe is a distinct maximum-legibility
    // mode, never a light lookalike — the decorative surfaces flatten to
    // neutral, so the hero band's computed ground must MOVE between the
    // two themes.
    await applySpecimenThemeAttribute(page, 'light');
    const light = await heroBandBackground(page);
    expect(light).not.toBe('');
    await applySpecimenThemeAttribute(page, 'colour-safe');
    await expect
      .poll(async () => heroBandBackground(page), {
        message: 'colour-safe must not render the light decorative surface',
      })
      .not.toBe(light);
  });

  test('an unknown brand value narrows to the base identity', async ({ page }) => {
    await interceptExternalOrigins(page);
    await page.goto('/identity-switchboard/specimen?brand=not-a-brand');
    await expect(page.locator('[data-identity]')).toHaveAttribute('data-identity', BASE_IDENTITY);
    await expect(page.locator('link[data-oak-brand]')).toHaveCount(0);
  });
});

test.describe('specimen: keyboard and state semantics', () => {
  test('the skip link delivers focus to the content headline', async ({ page }) => {
    await interceptExternalOrigins(page);
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    await page.keyboard.press('Tab');
    await expect(page.locator('.oak-skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    // Focus LANDS (WCAG G1), never merely scrolls — on the headline, not
    // on main: a negative tabindex on main (a reading-flow item) would
    // remove the whole subtree from the Tab order (F01/F02).
    await expect(page.locator('#specimen-headline')).toBeFocused();
  });

  test('sticky masthead carries its focus-not-obscured cure', async ({ page }) => {
    await interceptExternalOrigins(page);
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    // Adopting the reference's sticky masthead adopts WCAG 2.2 2.4.11 with
    // it: the scroll container must pad by the bar's height so a focused
    // control is never revealed underneath it.
    const cure = await page.evaluate(() => {
      const mast = document.querySelector('[data-region="masthead"]');
      return {
        mastPosition: mast === null ? '' : getComputedStyle(mast).position,
        scrollPadding: getComputedStyle(document.documentElement).scrollPaddingTop,
      };
    });
    expect(cure.mastPosition).toBe('sticky');
    expect(cure.scrollPadding).not.toBe('auto');
    expect(Number.parseFloat(cure.scrollPadding)).toBeGreaterThan(0);
  });

  test('the strip carries the real identity control: one radio group, exactly one checked', async ({
    page,
  }) => {
    // Owner word 2026-08-18: the decorative audience switcher gave its
    // strip space to the page's real controls. Native radio semantics ARE
    // the not-by-colour-alone state exposure — the checked dot survives
    // forced-colors — and single-select means exactly one checked.
    await interceptExternalOrigins(page);
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    const strip = page.locator('[data-region="utility"]');
    const radios = strip.getByRole('radio');
    await expect(radios).toHaveCount(IDENTITIES.length);
    await expect(strip.locator('input[type="radio"]:checked')).toHaveCount(1);
    await expect(radios.nth(0)).toBeChecked();
  });
});

test.describe('side-by-side: three identities, one specimen route', () => {
  test('frames simulate the canonical canvas width and all three brands render', async ({
    page,
  }) => {
    // The client widths DERIVE from the canonical set (DDR-009), so the
    // relation under guard is the authored remainder: every canonical
    // width carries an owner-facing label, and the default frame width is
    // a member.
    expect(
      typeSafeKeys(VIEWPORT_WIDTH_LABELS)
        .map(Number)
        .sort((a: number, b: number) => a - b),
    ).toEqual([...MEASUREMENT_WIDTH_VALUES]);
    expect(VIEWPORT_WIDTHS).toContain(DEFAULT_VIEWPORT_WIDTH);

    await interceptExternalOrigins(page);
    await page.goto('/identity-white-labelling');
    // The column headings carry the server-rendered brand names — the
    // regression class under guard: a label map exported from a 'use
    // client' module evaluates to undefined in the server render and
    // ships literal "undefined" headings without failing the build.
    for (const [index, identity] of IDENTITIES.entries()) {
      await expect(page.locator('.col-title').nth(index)).toContainText(IDENTITY_LABELS[identity]);
    }
    const frames = page.locator('.frame iframe');
    await expect(frames).toHaveCount(IDENTITIES.length);
    // Every frame's document reaches the identity its column names, and
    // its simulated width is the canonical cell.
    for (const [index, identity] of IDENTITIES.entries()) {
      const frame = await (await frames.nth(index).elementHandle()).contentFrame();
      assertResolved(frame, `frame ${identity} must resolve`);
      await expect(frame.locator('[data-identity]')).toHaveAttribute('data-identity', identity);
    }
    const width = await frames.first().evaluate((el) => el.style.width);
    expect(width).toBe(`${DEFAULT_VIEWPORT_WIDTH}px`);
  });
});

test.describe('specimen mast with the strip absent (?controls=none)', () => {
  test('the mast sticky offset zeroes — no blank strip row reserved', async ({ page }) => {
    await interceptExternalOrigins(page);
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}&controls=none`);
    // The sticky offset normally reserves one strip row so mast and strip
    // stack; with no strip rendered that reservation is a strip-height of
    // blank space at the top of every framing column (review round 3).
    const offset = await page.evaluate(() => {
      const mast = document.querySelector('[data-region="masthead"]');
      return mast === null ? null : getComputedStyle(mast).insetBlockStart;
    });
    expect(offset).toBe('0px');
  });
});
