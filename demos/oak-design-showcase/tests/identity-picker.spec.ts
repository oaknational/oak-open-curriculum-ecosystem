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
import type { Page } from '@playwright/test';

import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import { SWITCHBOARD_CANVAS_WIDTH } from '../components/canonical-widths';
import { BASE_IDENTITY, IDENTITIES } from '../components/useIdentity';
import { MEASUREMENT_WIDTH_VALUES } from '../tools/measurement-widths';
import { assertOnlyKnownExternalOrigins } from './apply-state';
import {
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
async function expectRuledDefaults(page: Page): Promise<void> {
  await expect(page.getByRole('combobox', { name: 'Theme' })).toHaveValue(IDENTITY_DEFAULT);
  await expect(page.getByRole('combobox', { name: 'Width' })).toHaveValue(
    `${SWITCHBOARD_CANVAS_WIDTH}`,
  );
}

test.describe('picker: every control is an in-place change', () => {
  test('brand changes inside the frame with no navigation', async ({ page }) => {
    const opened = await openPickerStage(page);
    if (opened === null) {
      return;
    }
    const { aborted, stage, frame, mountSrc, baseFont } = opened;

    const firstCounterBrand = COUNTER_BRANDS[0];
    expect(firstCounterBrand, 'the roster must hold a counter-brand').toBeDefined();
    if (firstCounterBrand === undefined) {
      return;
    }
    await page.getByRole('combobox', { name: 'Identity' }).selectOption(firstCounterBrand);

    await expectBrandInEffect(frame, firstCounterBrand, baseFont);
    await expectSameDocument(frame, stage, mountSrc);

    // The external link derives from CONTROL state — the frame's frozen src
    // would name the mount identity and send the viewer somewhere else.
    await expect(
      page.getByRole('link', { name: 'Open this identity as a full page' }),
    ).toHaveAttribute('href', `/identity-switchboard/specimen?brand=${firstCounterBrand}`);
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('theme and width land in effect inside the same document', async ({ page }) => {
    const opened = await openPickerStage(page);
    if (opened === null) {
      return;
    }
    const { aborted, stage, frame, mountSrc } = opened;

    await expectRuledDefaults(page);

    await chooseThemeAndExpectInEffect(page, frame, 'dark');

    const narrowest = MEASUREMENT_WIDTH_VALUES[0];
    expect(narrowest, 'the canonical set must be non-empty').toBeDefined();
    if (narrowest === undefined) {
      return;
    }
    await chooseWidthAndExpectInEffect(page, frame, narrowest);

    await expectSameDocument(frame, stage, mountSrc);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('picker: identity default is the frame’s own face', () => {
  test('the frame opens on its own face, and choosing Identity default returns there', async ({
    page,
  }) => {
    const opened = await openPickerStage(page);
    if (opened === null) {
      return;
    }
    const { aborted, stage, frame, mountSrc } = opened;

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
    await page.getByRole('combobox', { name: 'Theme' }).selectOption(IDENTITY_DEFAULT);
    await expect
      .poll(async () =>
        frame.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
      )
      .toBe('light');

    await expectSameDocument(frame, stage, mountSrc);
    assertOnlyKnownExternalOrigins(aborted);
  });
});
