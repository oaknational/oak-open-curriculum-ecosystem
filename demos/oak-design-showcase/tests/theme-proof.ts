/**
 * The per-theme application proof shared by the showcase and specimen
 * suites: what "this theme is IN EFFECT" means, per theme, as computed
 * values. Split from apply-state.ts so the proof tables and their
 * scope caveats read as one unit.
 */
import { expect } from '@playwright/test';
import type { Frame, Page } from '@playwright/test';

import type { OakThemeName } from '@oaknational/oak-design-react';

/** Cascade-level application proof per explicit theme: the computed
 *  color-scheme each choice must resolve to (a per-cell table, not a
 *  branch). */
export const EXPECTED_COLOR_SCHEME: Record<OakThemeName, string> = {
  light: 'light',
  dark: 'dark',
  system: 'light dark',
  'high-contrast': 'light',
  'colour-safe': 'light',
};

/** The theme-distinctive application proof (F40): high-contrast and
 *  colour-safe compute color-scheme 'light' — indistinguishable from a
 *  light-polarity identity's default face, so the colorScheme check
 *  alone cannot tell 'cascade applied' from 'attribute ignored'. For
 *  those themes the kit's block forces --surface-decorative-1 to a
 *  theme-owned target (white under high-contrast; the colour-safe
 *  flattening is the owner-ratified distinctness), so 'applied' is the
 *  probed token computing EQUAL to the target token — derived from the
 *  system at run time, never a pinned hex. The rows are total: a new
 *  theme must decide its proof here or state null. null rows carry no
 *  vacuous mode: where colorScheme cannot discriminate (oak × light,
 *  creature × dark) the claimed face IS the identity's default face,
 *  so the tested pixels are true either way. Scope, stated: this
 *  proves the KIT's root-level theme block cascaded; a brand's own
 *  [data-theme] subtree overrides are invisible to a root read. And
 *  the proof is non-vacuous only while every identity's DEFAULT
 *  decorative-1 differs from both targets — true today, first-hand:
 *  all three defaults compute light-dark() expressions, the targets
 *  plain values. A future brand whose default equals a target would
 *  make its cells pass with the theme block dead (silently — the
 *  equality holds either way); admitting such a brand requires
 *  re-pointing the probe, and nothing here would flag it, so the
 *  brand-admission checklist is the guard. */
const THEME_DISTINCTIVE_TARGET: Record<OakThemeName, string | null> = {
  light: null,
  dark: null,
  system: null,
  'high-contrast': '--oak-white',
  'colour-safe': '--oak-grey20',
};

/** The token both distinctive theme blocks force away from every
 *  identity's own face. */
const THEME_PROBE_PROPERTY = '--surface-decorative-1';

/** Computed custom-property read at the root. NOTE: this is the
 *  computed token string, not a resolved colour — brand faces return
 *  literal light-dark(...) expressions — which is exactly what the
 *  equality proof needs. */
async function readRootProperty(target: Page | Frame, property: string): Promise<string> {
  return target.evaluate(
    (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
    property,
  );
}

/** axe reading a mid-transition frame is a recorded failure mode (a
 *  1.37:1 measured ratio on settled 21:1 buttons was reproduced
 *  first-hand, 2026-08-13), and reduced-motion emulation is NOT a
 *  complete cure: a brand that redeclares the motion tokens at :root
 *  defeats the kit's collapse (live on creature — kit-side ledger
 *  finding). So application helpers poll the page to animation
 *  quiescence before any caller reads it. */
export async function settleAnimations(target: Page | Frame): Promise<void> {
  await expect
    .poll(
      () =>
        target.evaluate(() =>
          document.getAnimations().every((animation) => animation.playState !== 'running'),
        ),
      { message: 'animations must settle before the page is read (mid-transition axe reads)' },
    )
    .toBe(true);
}

/** The shared distinctive-token equality assert (see
 *  THEME_DISTINCTIVE_TARGET for the claim and its stated scope). */
export async function assertThemeDistinctiveToken(
  target: Page | Frame,
  theme: OakThemeName,
): Promise<void> {
  const targetToken = THEME_DISTINCTIVE_TARGET[theme];
  if (targetToken === null) {
    return;
  }
  const [probed, expected] = await Promise.all([
    readRootProperty(target, THEME_PROBE_PROPERTY),
    readRootProperty(target, targetToken),
  ]);
  expect(expected, `${targetToken} must exist at the root for the ${theme} proof`).not.toBe('');
  expect(
    probed,
    `the ${theme} face must land the kit's theme block: ${THEME_PROBE_PROPERTY} must compute equal to ${targetToken} — a failure means the theme cascade did not apply (or a brand redeclared the probe token under this theme); never widen this assert`,
  ).toBe(expected);
}
