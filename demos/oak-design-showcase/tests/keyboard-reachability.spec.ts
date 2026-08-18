/**
 * Keyboard reachability across the demo routes (review-fleet F01/F02;
 * SC 2.1.1 / 2.4.3). The mechanism these cells guard: a negative
 * tabindex on a reading-flow item excludes its ENTIRE subtree from
 * sequential focus in Chromium (the agreed CSSWG/WHATNOT scoping model,
 * not a rendering bug), so `main[tabindex=-1]` inside `.oak-canvas`
 * silently removes every control from the Tab order while axe stays
 * green. Assertions are BEHAVIOUR-level (which regions sequential
 * focus can reach, and in what order) — never mechanism-level — so
 * they survive any future cure reshape (assumptions review, 2026-08-13).
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { interceptExternalOrigins } from './apply-state';

/** Place of the currently-focused element: 'main' for anything inside
 *  the main landmark's subtree (the specimen's inner regions carry
 *  their own data-region markers, which would shadow main's),
 *  otherwise the nearest region marker; 'outside' covers
 *  body/document and unmarked chrome. */
async function focusedRegion(page: Page): Promise<string> {
  return page.evaluate(() => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) {
      return 'outside';
    }
    if (active.closest('main') !== null) {
      return 'main';
    }
    return active.closest('[data-region]')?.getAttribute('data-region') ?? 'outside';
  });
}

/** Press Tab (or Shift+Tab) `presses` times, recording the region after
 *  each press; the caller bounds the walk with `presses`. */
async function regionTrail(page: Page, presses: number, reverse = false): Promise<string[]> {
  const trail: string[] = [];
  for (let i = 0; i < presses; i += 1) {
    await page.keyboard.press(reverse ? 'Shift+Tab' : 'Tab');
    trail.push(await focusedRegion(page));
  }
  return trail;
}

/** Lean opener for keyboard cells: hermetic, reduced motion, no axe.
 *  `readySelector` names the render-complete mark — the masthead region
 *  on specimen routes; pages without chrome regions pass their own. */
async function openForKeyboard(
  page: Page,
  path: string,
  readySelector = '[data-region="masthead"]',
): Promise<void> {
  await interceptExternalOrigins(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
  await expect(page.locator(readySelector)).toBeVisible();
}

test.describe('specimen: sequential focus reaches the content', () => {
  test('Tab from the top enters main without the skip link @a11y', async ({ page }) => {
    await openForKeyboard(page, '/identity-switchboard/specimen?brand=oak');
    // SC 2.4.3: the reading order is masthead → main → footer, and
    // sequential focus must follow it — main must be ENTERED between
    // the chrome regions, not skipped wholesale.
    const trail = await regionTrail(page, 90);
    const firstMain = trail.indexOf('main');
    const firstFooter = trail.indexOf('footer');
    expect(firstMain, `main never received focus; trail: ${trail.join(' → ')}`).not.toBe(-1);
    expect(firstFooter, `footer never received focus; trail: ${trail.join(' → ')}`).not.toBe(-1);
    expect(
      firstMain,
      `main content must come before the footer in the Tab order; trail: ${trail.join(' → ')}`,
    ).toBeLessThan(firstFooter);
  });

  test('Shift+Tab from the end re-enters main @a11y', async ({ page }) => {
    await openForKeyboard(page, '/identity-switchboard/specimen?brand=oak');
    // Walk forward to the end of the page first, then come back: the
    // reverse direction has no skip-link escape hatch, so this is the
    // cell that fails while the forward-only skip path still passes.
    await regionTrail(page, 90);
    const back = await regionTrail(page, 90, true);
    expect(
      back.indexOf('main'),
      `Shift+Tab never re-entered main; reverse trail: ${back.join(' → ')}`,
    ).not.toBe(-1);
  });
});

test.describe('demo pages: sequential focus reaches the controls', () => {
  test('picker: Tab reaches the identity controls inside main @a11y', async ({ page }) => {
    // The picker's every interactive element — three selects, the frame,
    // the full-page link — lives inside main. If main is unreachable the
    // page has NO keyboard-operable content at all (SC 2.1.1).
    await openForKeyboard(page, '/identity-switchboard', 'h1');
    const trail = await regionTrail(page, 30);
    expect(
      trail.indexOf('main'),
      `main (all picker controls) never received focus; trail: ${trail.join(' → ')}`,
    ).not.toBe(-1);
  });

  test('side-by-side: Tab reaches the identity columns inside main @a11y', async ({ page }) => {
    // Each column's frame and full-page link live inside main; the header
    // nav link alone reachable would pass a naive smoke while every
    // exhibit stays keyboard-dead (SC 2.1.1).
    await openForKeyboard(page, '/identity-white-labelling', 'h1');
    const trail = await regionTrail(page, 30);
    expect(
      trail.indexOf('main'),
      `main (the identity columns) never received focus; trail: ${trail.join(' → ')}`,
    ).not.toBe(-1);
  });
});
