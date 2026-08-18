/**
 * The specimen's accessibility matrix (the review's highest finding made
 * mechanical): brand-swap redefines the tokens, so contrast is a
 * PER-IDENTITY property — an axe pass on the base identity proves nothing
 * about the counter-brands. Cells: identity × palette theme, forced-colors
 * per identity, and the SC 1.4.10 reflow floor per identity. Runs against
 * the BUILT artefact like the rest of the proof surface.
 *
 * First run of the matrix caught a real export defect: a bare text-node
 * separator inside the keywords <dl> (axe definition-list, serious) —
 * cured in the rebuild by moving the separator to CSS.
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import {
  assertOnlyKnownExternalOrigins,
  IDENTITIES,
  interceptExternalOrigins,
  PALETTE_THEMES,
  type Identity,
  type ThemeName,
} from './apply-state';
import {
  assertForcedColorsMode,
  colorContrastArtefactPresent,
  expectNoAxeViolations,
} from './axe-checks';
import {
  assertThemeDistinctiveToken,
  EXPECTED_COLOR_SCHEME,
  settleAnimations,
} from './theme-proof';

/** Open the specimen at an identity, hermetically; brand applies
 *  server-side so navigation is the whole input. Reduced motion is
 *  emulated as in openShowcase (mid-transition axe reads are a
 *  recorded failure mode) and the settle poll backs it up, because a
 *  brand that redeclares motion tokens at :root defeats the kit's
 *  collapse. A cell that means forced colours declares it here and the
 *  observed mode is asserted either way. */
async function openSpecimen(
  page: Page,
  identity: Identity,
  options: { readonly forcedColors?: boolean } = {},
): Promise<Set<string>> {
  const forcedColors = options.forcedColors ?? false;
  const aborted = await interceptExternalOrigins(page);
  await page.emulateMedia({
    reducedMotion: 'reduce',
    ...(forcedColors ? { forcedColors: 'active' as const } : {}),
  });
  await page.goto(`/identity-switchboard/specimen?brand=${identity}`);
  await expect(page.locator('[data-region="masthead"]')).toBeVisible();
  await assertForcedColorsMode(page, forcedColors);
  await settleAnimations(page);
  return aborted;
}

/** The specimen has no theme control — the theme lands as the attribute
 *  the kit's cascade keys on, then is asserted IN EFFECT via the
 *  document's computed color-scheme plus, for the themes colorScheme
 *  cannot discriminate from a light-polarity default face, the
 *  distinctive-token equality proof (mirroring applyTheme, minus the
 *  combobox). */
async function applySpecimenTheme(page: Page, theme: ThemeName): Promise<void> {
  await page.evaluate((value) => {
    document.documentElement.dataset['theme'] = value;
  }, theme);
  const colorScheme = await page.evaluate(
    () => getComputedStyle(document.documentElement).colorScheme,
  );
  expect(colorScheme).toBe(EXPECTED_COLOR_SCHEME[theme]);
  await assertThemeDistinctiveToken(page, theme);
  await settleAnimations(page);
}

test.describe('specimen: identity × theme matrix', () => {
  for (const identity of IDENTITIES) {
    for (const theme of PALETTE_THEMES) {
      test(`specimen ${identity} × ${theme} has no WCAG 2.2 AA violations @a11y`, async ({
        page,
      }) => {
        const aborted = await openSpecimen(page, identity);
        await applySpecimenTheme(page, theme);
        await expectNoAxeViolations(page);
        assertOnlyKnownExternalOrigins(aborted);
      });
    }
  }
});

test.describe('specimen: identity-default face', () => {
  for (const identity of IDENTITIES) {
    test(`specimen ${identity} × identity-default has no WCAG 2.2 AA violations @a11y`, async ({
      page,
    }) => {
      // The first-visit state: NO data-theme attribute, each identity's
      // own default face (DDR-003 dated amendment 2026-08-11) — light for
      // the base, dark for a lever-flipped brand. This is the state every
      // visitor sees before any choice, so it gets its own axe cell per
      // identity rather than riding the explicit-theme matrix above.
      const aborted = await openSpecimen(page, identity);
      await expectNoAxeViolations(page);
      assertOnlyKnownExternalOrigins(aborted);
    });
  }
});

test.describe('specimen: forced-colors', () => {
  for (const identity of IDENTITIES) {
    test(`specimen ${identity} stays renderable under forced-colors @a11y`, async ({ page }) => {
      const aborted = await openSpecimen(page, identity, { forcedColors: true });
      await expect(page.getByRole('heading', { level: 1, name: 'The water cycle' })).toBeVisible();
      await expectNoAxeViolations(page);
      assertOnlyKnownExternalOrigins(aborted);
    });
  }
  for (const identity of IDENTITIES) {
    test(`the forced-colors contrast scoping self-retires with its cause (${identity}) @a11y`, async ({
      page,
    }) => {
      // The paired half of the color-contrast scoping (see
      // colorContrastArtefactPresent): the axe-core#3978 artefact is
      // expected PRESENT on every identity today — creature via a
      // filed violation (near-white author ink, 1.08:1), the other two
      // via the withheld equalRatio filing (exactly-white ink, 1.00:1).
      // Emulation death never reaches this assert: openSpecimen's mode
      // assert fails first with its own diagnosis, so a failure HERE is
      // about the artefact, never the harness.
      await openSpecimen(page, identity, { forcedColors: true });
      expect(
        await colorContrastArtefactPresent(page),
        'no #3978 artefact on this identity. The identities share the kit base layer, so gone-everywhere is NOT yet proof axe is fixed — an ink restyle clears it too. First confirm author ink matching the forced paper still exists on the page (white text on dark author surfaces); if the precondition is gone, re-point this probe at a surface that still carries it. If it holds AND every identity is clear, the MEASUREMENT-BUG leg of the color-contrast scoping has expired — re-adjudicate per docs/governance/accessibility-practice.md whether the criterion-scope leg alone still carries the disable, and update its rationale; the scoping is never deleted on sight.',
      ).toBe(true);
    });
  }
});

test.describe('specimen: reflow at 320px', () => {
  test.use({ viewport: { width: 320, height: 900 } });
  for (const identity of IDENTITIES) {
    test(`specimen ${identity} reflows to 320px without loss @a11y`, async ({ page }) => {
      const aborted = await openSpecimen(page, identity);
      const reflow = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        // In-flow content only: the skip link sits off-canvas by design
        // until focused (its focus behaviour has its own cell), and
        // out-of-flow elements are not reflow loss.
        minLeft: Math.min(
          0,
          ...[...document.querySelectorAll('body *')]
            .filter((element) => {
              const position = getComputedStyle(element).position;
              return position === 'static' || position === 'relative';
            })
            .map((element) => element.getBoundingClientRect().left),
        ),
      }));
      expect(reflow.scrollW, 'SC 1.4.10: horizontal scroll must not appear').toBeLessThanOrEqual(
        reflow.clientW,
      );
      expect(reflow.minLeft, 'content pushed left of the origin is unreachable').toBe(0);
      await expectNoAxeViolations(page);
      assertOnlyKnownExternalOrigins(aborted);
    });
  }
});
