/**
 * The specimen page's own strip: the binder's swap authority, the narrow
 * controls disclosure (owner ruling 2026-08-18 — controls disclose instead
 * of scrolling in the band), and the breadcrumbs' page-vs-exhibit split.
 * Split from identity-picker.spec.ts at the page seam: that file proves
 * the PICKER's stage mechanics; this one proves the specimen standing on
 * its own.
 *
 * No identity slug is typed in this file: every name derives from the
 * imported roster, which keeps the identity-naming census untouched.
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { SHOWCASE_ORIGIN } from '../tools/showcase-origin';
import { BASE_IDENTITY, IDENTITIES, IDENTITY_LABELS } from '../components/useIdentity';
import { assertOnlyKnownExternalOrigins, interceptExternalOrigins } from './apply-state';
import { openPickerStage } from './picker-stage';

const COUNTER_BRANDS = IDENTITIES.filter((slug) => slug !== BASE_IDENTITY);

/** Where the strip's three groups sit, and how tall the strip stands. */
async function stripBands(page: Page): Promise<{
  readonly crumbs: number;
  readonly radios: number;
  readonly theme: number;
  readonly stripHeight: number;
}> {
  return page.evaluate(() => {
    const top = (selector: string): number =>
      Math.round(document.querySelector(selector)?.getBoundingClientRect().top ?? Number.NaN);
    return {
      crumbs: top('.strip-controls .showcase-crumbs-nav'),
      radios: top('.strip-controls .identity-radios'),
      theme: top('.strip-controls .oak-cluster--s'),
      stripHeight: Math.round(document.querySelector('.util')?.getBoundingClientRect().height ?? 0),
    };
  });
}

/** Scroll containers inside the open strip panel (the everything-visible
 *  rule at strip scale — the same invariant the tokens nav carries); the
 *  visually-hidden pattern's deliberate 1px clip is outside the rule. */
async function countStripScrollBoxes(page: Page): Promise<number> {
  return page.locator('.strip-disclosure').evaluate(
    (el) =>
      [el, ...el.querySelectorAll('*')].filter((node) => {
        if (node.classList.contains('oak-visually-hidden')) {
          return false;
        }
        const style = getComputedStyle(node);
        return (
          (style.overflowY !== 'visible' || style.overflowX !== 'visible') &&
          (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)
        );
      }).length,
  );
}

test.describe('specimen strip: a return to the applied brand cancels an in-flight swap', () => {
  test('a stale sheet load never retires the current brand', async ({ page }) => {
    const [first, second] = COUNTER_BRANDS;
    // Hermetic like the rest of the suite: without this, a blocked-egress
    // host lets the specimen's external font stall the window load event
    // ~20s (measured on the restricted cloud runner), spending the
    // constructed race's whole margin inside goto.
    const aborted = await interceptExternalOrigins(page);
    // Deterministic, not timed: the second brand's sheet is HELD in flight
    // until this test releases it, so the race's ordering is constructed.
    // Registered after the interceptor so it matches first (last wins) and
    // origin-anchored so no external URL can ride it past the seal above.
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(`${SHOWCASE_ORIGIN}/brands/${second}/brand.css`, async (route) => {
      await held;
      await route.continue();
    });
    await page.goto(`/identity-switchboard/specimen?brand=${first}`);
    await page.getByRole('radio', { name: IDENTITY_LABELS[second] }).check();
    await expect(page.locator(`link[data-oak-brand='${second}']`)).toHaveCount(1);
    await page.getByRole('radio', { name: IDENTITY_LABELS[first] }).check();
    // The 200 completion pins the removal below to the STALE-ADJUDICATION
    // branch: a failed load would route through the binder's error handler,
    // whose cleanup is observationally identical on every other assertion.
    const staleLoad = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === `/brands/${second}/brand.css` && response.ok(),
    );
    release?.();
    await staleLoad;
    // A POSITIVE post-load signal: the stale branch REMOVES its link, so
    // its disappearance proves the held load resolved and was adjudicated.
    // Pre-cure the link survives applied instead, and this times out red.
    await expect(page.locator(`link[data-oak-brand='${second}']`), {
      message: 'the stale load must remove itself, never apply',
    }).toHaveCount(0);
    const firstSheetDisabled = (): Promise<boolean | null> =>
      page.evaluate((slug) => {
        const link = document.querySelector(`link[data-oak-brand='${slug}']`);
        return link instanceof HTMLLinkElement ? link.disabled : null;
      }, first);
    await expect
      .poll(firstSheetDisabled, { message: 'the current brand sheet stays in the cascade' })
      .toBe(false);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('specimen strip: narrow controls disclose instead of scroll', () => {
  test('closed at narrow, operable when open', async ({ page }) => {
    const aborted = await interceptExternalOrigins(page);
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    const strip = page.locator('.strip-controls');
    const summary = strip.locator('summary');
    // Closed: the band is one honest line — no radio reachable, and the
    // old one-row in-strip horizontal scroll is gone.
    await expect(summary).toBeVisible();
    await expect(strip.getByRole('radio').first()).not.toBeVisible();
    // Open: the stacked controls are visible AND live — a choice made
    // through the disclosure re-skins the page like any other.
    await summary.click();
    const counterBrand = COUNTER_BRANDS[0];
    const radio = page.getByRole('radio', { name: IDENTITY_LABELS[counterBrand] });
    await expect(radio).toBeVisible();
    // The open panel is measured scroll-free.
    const stripScrollBoxes = await countStripScrollBoxes(page);
    expect(stripScrollBoxes, 'the open panel scrolls with the page, never in a box').toBe(0);
    await radio.check();
    await expect(
      page.locator(`link[data-oak-brand='${counterBrand}'][data-oak-brand-applied]`),
    ).toHaveCount(1);
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('inline at wide: the wrapper dissolves and the controls share the row', async ({ page }) => {
    const aborted = await interceptExternalOrigins(page);
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    const summary = page.locator('.strip-controls summary');
    const counterBrand = COUNTER_BRANDS[0];
    // Wide: the wrapper dissolves — the controls render inline in the row.
    await page.setViewportSize({ width: 1280, height: 900 });
    // The details element stays MOUNTED across the seam (focus and open
    // state survive zoom and rotation); dissolution is the summary
    // leaving the accessibility tree, not the DOM.
    await expect(summary).toBeHidden();
    await expect(page.getByRole('radio', { name: IDENTITY_LABELS[counterBrand] })).toBeVisible();
    // Inline means inline: the identity radios and the theme cluster share
    // one horizontal band with the crumbs (measured on the fork: with the
    // details' content box undissolved they stacked in a column and the
    // strip stood two rows tall under a one-row sticky offset).
    const bands = await stripBands(page);
    expect(bands.radios).toBe(bands.theme);
    expect(Math.abs(bands.radios - bands.crumbs)).toBeLessThan(bands.stripHeight);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('specimen strip: focus continuity across the disclosure seam', () => {
  test('crossing wide to narrow keeps a focused control visible and focused', async ({ page }) => {
    // The seam is crossed by accessibility paths (400% zoom, rotation): a
    // control focused at wide must not vanish into a closed disclosure at
    // narrow — the panel holds open for focus continuity (review round 1).
    const aborted = await interceptExternalOrigins(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    // The server renders the disclosure CLOSED (narrow first); hydration
    // dissolves it at wide. Until then the control sits inside a closed
    // details and a programmatic focus is silently a no-op — measured on a
    // loaded CI runner, where this test focused before hydration and read
    // "inactive". Wait for the wide face, then focus.
    await page.locator('.narrow-disclosure-dissolved').waitFor({ state: 'attached' });
    const theme = page.locator('#specimen-strip-theme');
    await theme.focus();
    await expect(theme).toBeFocused();
    await page.setViewportSize({ width: 320, height: 700 });
    await expect(theme).toBeVisible();
    await expect(theme).toBeFocused();
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('crossing narrow to wide keeps a focused summary rendered until focus moves on', async ({
    page,
  }) => {
    // The REVERSE seam: hiding a focused summary at dissolution would drop
    // focus to the document body (zoom-out is an accessibility path). The
    // cure is declarative — the dissolved summary hides only :not(:focus).
    const aborted = await interceptExternalOrigins(page);
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    const summary = page.locator('.strip-controls summary');
    await summary.focus();
    await expect(summary).toBeFocused();
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(summary).toBeFocused();
    await expect(summary).toBeVisible();
    // Activating the still-focused summary must not collapse the dissolved
    // panel: the native toggle is cancelled while wide, so the inline
    // controls stay rendered and open.
    await page.keyboard.press('Enter');
    await expect(summary.locator('..')).toHaveAttribute('open', '');
    await expect(page.locator('#specimen-strip-theme')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(summary).toBeHidden();
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('specimen breadcrumbs are page furniture, not exhibit furniture', () => {
  test('the framed specimen carries no page navigation; the full page does', async ({ page }) => {
    const { aborted, frame } = await openPickerStage(page);
    // Framed, a breadcrumb click would navigate the STAGE (a switchboard
    // nested inside its own picker), so embedded mode omits the trail.
    await expect(frame.locator('nav.showcase-crumbs-nav')).toHaveCount(0);
    await page.goto(`/identity-switchboard/specimen?brand=${BASE_IDENTITY}`);
    await expect(page.locator('nav.showcase-crumbs-nav')).toBeVisible();
    assertOnlyKnownExternalOrigins(aborted);
  });
});
