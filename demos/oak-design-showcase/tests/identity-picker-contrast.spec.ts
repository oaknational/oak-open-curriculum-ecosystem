/**
 * The picker's OS-contrast cells: the access commitment inside the stage,
 * and the stage-local control holding the framed root against the frame's
 * own runtime (whose live contrast listener believes no choice exists —
 * the picker never tells it one does, by design: a runtime write would
 * persist to shared localStorage and leak the demo state).
 *
 * The flip cells are marker-then-assert: each waits for the FRAME's own
 * matchMedia to report the emulated change before asserting anything
 * about writes — a poll on an already-true value proves nothing about
 * what a late listener would have done.
 */
import { expect, test } from '@playwright/test';

import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import { assertOnlyKnownExternalOrigins } from './apply-state';
import {
  chooseThemeAndExpectInEffect,
  frameSeesMoreContrast,
  frameThemeAttribute,
  openPickerStage,
} from './picker-stage';

test.describe('picker: OS contrast and the access commitment', () => {
  test('an OS contrast request reaches the identity-default face and survives choices', async ({
    page,
  }) => {
    // DDR-003 amendment: with no choice made in the control, an OS request
    // for more contrast shows the high-contrast face; an explicit choice
    // wins; returning to Identity default returns to the ACCESS face,
    // never the bare one.
    await page.emulateMedia({ contrast: 'more' });
    const opened = await openPickerStage(page);
    if (opened === null) {
      return;
    }
    const { aborted, frame } = opened;
    await expect.poll(async () => frameThemeAttribute(frame)).toBe('high-contrast');
    await chooseThemeAndExpectInEffect(page, frame, 'dark');
    await page.getByRole('combobox', { name: 'Theme' }).selectOption(IDENTITY_DEFAULT);
    await expect.poll(async () => frameThemeAttribute(frame)).toBe('high-contrast');
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('an explicit picker theme survives live OS contrast flips in both directions', async ({
    page,
  }) => {
    const opened = await openPickerStage(page);
    if (opened === null) {
      return;
    }
    const { aborted, frame } = opened;
    await chooseThemeAndExpectInEffect(page, frame, 'dark');

    // Flip ON: wait until the FRAME sees the emulated media (the marker
    // that the change event has been dispatched to its listeners), then
    // the picked theme must still hold.
    await page.emulateMedia({ contrast: 'more' });
    await expect.poll(async () => frameSeesMoreContrast(frame)).toBe(true);
    await expect.poll(async () => frameThemeAttribute(frame)).toBe('dark');

    // Flip OFF: same marker discipline; the picked theme must not be
    // wiped back to the bare identity-default face.
    await page.emulateMedia({ contrast: null });
    await expect.poll(async () => frameSeesMoreContrast(frame)).toBe(false);
    await expect.poll(async () => frameThemeAttribute(frame)).toBe('dark');

    assertOnlyKnownExternalOrigins(aborted);
  });
});
