/**
 * The picker's mechanism proofs. The transition is the hero, so the proof
 * is that there is no navigation to hide behind: a sentinel planted on the
 * frame document's root dataset before a swap must still be there after it
 * (a reload manufactures a FRESH document, so the sentinel's survival is
 * document identity itself), the frame's src must still name the MOUNT
 * identity (why the external link derives from control state, not the
 * frame), and each control's choice must be IN EFFECT inside the frame's
 * own document — computed style for identity, computed color-scheme for
 * theme, the frame's own innerWidth for width. (The OS-contrast cells live
 * in identity-picker-contrast.spec.ts; the stage machinery is shared via
 * picker-stage.ts.)
 *
 * No identity slug is typed in this file: every name derives from the
 * imported roster, which keeps the identity-naming census untouched.
 */
import { expect, test } from '@playwright/test';
import type { Frame, Page } from '@playwright/test';

import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import { SWITCHBOARD_CANVAS_WIDTH } from '../components/canonical-widths';
import { SHOWCASE_ORIGIN } from '../tools/showcase-origin';
import { BASE_IDENTITY, IDENTITIES, IDENTITY_LABELS } from '../components/useIdentity';
import { MEASUREMENT_WIDTH_VALUES } from '../tools/measurement-widths';
import { assertOnlyKnownExternalOrigins, interceptExternalOrigins } from './apply-state';
import {
  assertResolved,
  chooseThemeAndExpectInEffect,
  chooseWidthAndExpectInEffect,
  expectBrandInEffect,
  expectSameDocument,
  openPickerStage,
} from './picker-stage';

const COUNTER_BRANDS = IDENTITIES.filter((slug) => slug !== BASE_IDENTITY);

/** The controls open on the ruled defaults: Identity default (DDR-003
 *  dated amendment 2026-08-11 — the frame shows each identity's own
 *  first-visit face) and the export switchboard's own framed canvas, so
 *  the two demos read identically side by side. */
async function expectRuledDefaults(page: Page, frame: Frame): Promise<void> {
  // Controls v3: theme rides the frame's own strip; width is the parent's.
  await expect(frame.getByRole('combobox', { name: 'Theme' })).toHaveValue(IDENTITY_DEFAULT);
  await expect(page.getByRole('combobox', { name: 'Width' })).toHaveValue(
    `${SWITCHBOARD_CANVAS_WIDTH}`,
  );
}

test.describe('picker: every control is an in-place change', () => {
  test('brand changes inside the frame with no navigation', async ({ page }) => {
    const { aborted, stage, frame, mountSrc, baseFont } = await openPickerStage(page);

    const firstCounterBrand = COUNTER_BRANDS[0];
    assertResolved(firstCounterBrand, 'the roster must hold a counter-brand');
    // Controls v3: the identity radio group lives in the FRAME's strip.
    await frame.getByRole('radio', { name: IDENTITY_LABELS[firstCounterBrand] ?? '' }).check();

    await expectBrandInEffect(frame, firstCounterBrand, baseFont);
    await expectSameDocument(frame, stage, mountSrc);

    // The external link derives from CONTROL state — the frame's frozen src
    // would name the mount identity and send the viewer somewhere else.
    await expect(page.getByRole('link', { name: 'open as a full page' })).toHaveAttribute(
      'href',
      `/identity-switchboard/specimen?brand=${firstCounterBrand}`,
    );
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('theme and width land in effect inside the same document', async ({ page }) => {
    const { aborted, stage, frame, mountSrc } = await openPickerStage(page);

    await expectRuledDefaults(page, frame);

    await chooseThemeAndExpectInEffect(page, frame, 'dark');

    const narrowest = MEASUREMENT_WIDTH_VALUES[0];
    assertResolved(narrowest, 'the canonical set must be non-empty');
    await chooseWidthAndExpectInEffect(page, frame, narrowest);

    await expectSameDocument(frame, stage, mountSrc);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('picker: identity default is the frame’s own face', () => {
  test('the frame opens on its own face, and choosing Identity default returns there', async ({
    page,
  }) => {
    const { aborted, stage, frame, mountSrc } = await openPickerStage(page);

    // The base identity's first-visit face: no data-theme on the framed
    // root, computed color-scheme 'light' (the kit root's own polarity —
    // DDR-003 dated amendment 2026-08-11).
    await expect
      .poll(async () =>
        frame.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
      )
      .toBe('light');

    await chooseThemeAndExpectInEffect(page, frame, 'dark');

    // Choosing Identity default clears the frame's theme state in place:
    // the same document returns to its own face.
    await frame.getByRole('combobox', { name: 'Theme' }).selectOption(IDENTITY_DEFAULT);
    await expect
      .poll(async () =>
        frame.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
      )
      .toBe('light');

    await expectSameDocument(frame, stage, mountSrc);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('picker: W3 controls v2', () => {
  /** The arrow press IS the demonstration (R12): one tab stop, arrows move
   *  AND select, each press re-skins the frame — gated, not assumed. */
  test('an arrow key press on the identity radio re-skins the frame', async ({ page }) => {
    const { aborted, frame, baseFont } = await openPickerStage(page);
    const nextIdentity = IDENTITIES[(IDENTITIES.indexOf(BASE_IDENTITY) + 1) % IDENTITIES.length];
    assertResolved(nextIdentity, 'the roster holds more than one identity');

    await frame.getByRole('radio', { name: IDENTITY_LABELS[BASE_IDENTITY] ?? '' }).focus();
    await page.keyboard.press('ArrowRight');

    await expect(
      frame.getByRole('radio', { name: IDENTITY_LABELS[nextIdentity] ?? '' }),
    ).toBeChecked();
    await expectBrandInEffect(frame, nextIdentity, baseFont);
    assertOnlyKnownExternalOrigins(aborted);
  });

  /** Stage dominance (owner word 2026-08-18): at 390px the specimen stage
   *  occupies the majority of the first screenful. */
  test('the stage owns the majority of the first screenful at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    const { stage } = await openPickerStage(page);
    const stageBox = await stage.boundingBox();
    assertResolved(stageBox, 'the stage renders');
    const visibleStage = Math.min(stageBox.y + stageBox.height, 780) - Math.max(stageBox.y, 0);
    expect(visibleStage).toBeGreaterThan(780 / 2);
  });
});

/** The target-size floor (SC 2.5.8): below the scale floor the scaled
 *  preview goes inert — a picture, with interaction owned by the
 *  full-page link beside it — and stays interactive at scales where the
 *  kit's 44px targets still meet the 24px minimum. The `inert` IDL
 *  property reflects the content attribute, so the attribute is the
 *  observable. */
test.describe('scaled preview target-size floor', () => {
  test('the preview is inert below the floor and interactive above it', async ({ page }) => {
    const { aborted } = await openPickerStage(page);
    const frameElement = page.locator('.picker-stage iframe');
    const inertAttribute = (): Promise<string | null> => frameElement.getAttribute('inert');
    await expect
      .poll(inertAttribute, { message: 'wide: the preview stays interactive' })
      .toBeNull();
    await page.setViewportSize({ width: 390, height: 780 });
    await expect
      .poll(inertAttribute, { message: 'narrow: a sub-floor scale renders the preview inert' })
      .not.toBeNull();
    assertOnlyKnownExternalOrigins(aborted);
  });
});

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
