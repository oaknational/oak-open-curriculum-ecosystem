/**
 * The accessibility half of the landing's Playwright proof surface (see
 * showcase.spec.ts for the behaviour half; both run against the BUILT
 * artefact): axe WCAG 2.2 AA across the palette themes, the OS
 * accessibility signals, keyboard focus visibility, and 320px reflow.
 * The landing renders the base identity only under the 2026-08-13 tight
 * scope — the identity × theme matrix, identity-default faces,
 * forced-colors per identity and per-identity reflow all live in
 * specimen-a11y.spec.ts against the route that actually switches
 * identity. Themes here are driven by stored state (the landing has no
 * control): set the store, reload, and the pre-paint bootstrap applies.
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { parseColour, ringChainContrast } from '../tools/focus-ring-contrast';
import {
  assertOnlyKnownExternalOrigins,
  openShowcase,
  PALETTE_THEMES,
  reloadWithStoredChoice,
} from './apply-state';
import { expectNoAxeViolations } from './axe-checks';

test.describe('OS accessibility signals', () => {
  test('prefers-contrast: more auto-selects the high-contrast theme @a11y', async ({ page }) => {
    await page.emulateMedia({ contrast: 'more' });
    const aborted = await openShowcase(page);
    // The kit's access commitment, end to end: no stored choice + an OS
    // contrast request = the high-contrast theme, applied pre-paint.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast');
    await expectNoAxeViolations(page);
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('forced-colors keeps the page renderable @a11y', async ({ page }) => {
    // Declared intent: expectNoAxeViolations observes the mode and
    // scopes color-contrast out (criterion scoping — before bundle 2
    // this cell ran the rule un-scoped and passed on author-ink luck).
    const aborted = await openShowcase(page, { forcedColors: true });
    await expect(
      page.getByRole('heading', { level: 1, name: 'Oak Open Curriculum Design System' }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

/** Browser reads for the SC 1.4.11 ring verdict: the focused element's
 *  computed box-shadow and the nearest non-transparent ancestor surface.
 *  Every judgement (layer split, alpha compositing, adjacency-chain
 *  contrast) lives in tools/focus-ring-contrast.ts, unit-tested with
 *  literal fixtures — this helper only observes. */
async function focusRingContrast(page: Page): Promise<number> {
  const evidence = await page.evaluate(() => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) {
      return null;
    }
    let surface: string | null = null;
    for (let el = active.parentElement; el !== null; el = el.parentElement) {
      const bg = getComputedStyle(el).backgroundColor;
      // Chromium serialises fully-transparent as exactly this string.
      if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        surface = bg;
        break;
      }
    }
    return { shadow: getComputedStyle(active).boxShadow, surface };
  });
  if (evidence === null || evidence.surface === null) {
    return 0;
  }
  const surface = parseColour(evidence.surface);
  return surface === null ? 0 : ringChainContrast(evidence.shadow, surface);
}

/** Walk keyboard focus forward until it lands inside the selector's
 *  element, so :focus-visible matching is genuinely keyboard-driven.
 *  Bounded; returns whether the walk arrived. */
async function tabInto(page: Page, selector: string, maxPresses: number): Promise<boolean> {
  for (let i = 0; i < maxPresses; i += 1) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(
      (sel) => document.activeElement?.closest(sel) !== null,
      selector,
    );
    if (inside) {
      return true;
    }
  }
  return false;
}

/** The SC 1.4.11 poll: never a one-shot read — the :focus-visible ring's
 *  application can lag the focus event by a frame (its base state is a
 *  transparent two-layer shadow, so an early read scores 0). The claim is
 *  the steady-state ring. */
async function expectRingContrast(page: Page, message: string): Promise<void> {
  await expect.poll(async () => focusRingContrast(page), { message }).toBeGreaterThanOrEqual(3);
}

test.describe('keyboard focus visibility', () => {
  test('the focus ring holds 3:1 on the door links in light and dark @a11y', async ({ page }) => {
    const aborted = await openShowcase(page);
    expect(await tabInto(page, '.doors', 25)).toBe(true);
    await expectRingContrast(page, 'door ring, light (tools/focus-ring-contrast.ts)');
    await reloadWithStoredChoice(page, 'oak-theme', 'dark');
    expect(await tabInto(page, '.doors', 25)).toBe(true);
    await expectRingContrast(page, 'door ring, dark (tools/focus-ring-contrast.ts)');
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('the focus ring holds 3:1 on the inverted footer band in light and dark @a11y', async ({
    page,
  }) => {
    // The 1.12:1 instance a previous round hand-measured lived HERE — the
    // canonical ring's halo against the inverted band, cured per-control in
    // globals.css with --focus-ring-inverted. This leg guards that cure:
    // deleting the override fails this test in dark.
    const aborted = await openShowcase(page);
    expect(await tabInto(page, '.foot', 25)).toBe(true);
    await expectRingContrast(page, 'footer-link ring, light');
    await reloadWithStoredChoice(page, 'oak-theme', 'dark');
    expect(await tabInto(page, '.foot', 25)).toBe(true);
    await expectRingContrast(page, 'footer-link ring, dark');
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('landing × theme', () => {
  for (const theme of PALETTE_THEMES) {
    test(`landing × ${theme} has no WCAG 2.2 AA violations @a11y`, async ({ page }) => {
      const aborted = await openShowcase(page);
      await reloadWithStoredChoice(page, 'oak-theme', theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expectNoAxeViolations(page);
      // axe ships no focus-indicator-contrast rule; the ring measure
      // covers the cell the axe pass just proved.
      expect(await tabInto(page, '.doors', 25)).toBe(true);
      await expectRingContrast(page, `door ring, ${theme}`);
      assertOnlyKnownExternalOrigins(aborted);
    });
  }
});

test.describe('landing × system theme (dark OS)', () => {
  test.use({ colorScheme: 'dark' });
  test('landing × system has no WCAG 2.2 AA violations @a11y', async ({ page }) => {
    const aborted = await openShowcase(page);
    await reloadWithStoredChoice(page, 'oak-theme', 'system');
    await expectNoAxeViolations(page);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('reflow at 320px', () => {
  test.use({ viewport: { width: 320, height: 900 } });
  test('the landing reflows to 320px without loss @a11y', async ({ page }) => {
    const aborted = await openShowcase(page);
    // SC 1.4.10 Reflow — axe ships no rule for it (MCP landing-page
    // precedent). Content pushed left of the origin is unreachable in
    // LTR, so negative offsets are content loss even when scrollWidth
    // stays clean.
    const reflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      minLeft: Math.min(
        0,
        ...[...document.querySelectorAll('body *')].map(
          (element) => element.getBoundingClientRect().left,
        ),
      ),
    }));
    expect(reflow.scrollW, 'SC 1.4.10: horizontal scroll must not appear').toBeLessThanOrEqual(
      reflow.clientW,
    );
    expect(reflow.minLeft, 'content pushed left of the origin is unreachable').toBe(0);
    await expectNoAxeViolations(page);
    assertOnlyKnownExternalOrigins(aborted);
  });
});
