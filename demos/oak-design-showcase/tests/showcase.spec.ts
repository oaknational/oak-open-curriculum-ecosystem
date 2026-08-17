/**
 * The behaviour half of the landing's Playwright proof surface (see
 * showcase-a11y.spec.ts for axe, OS signals and reflow; both run against
 * the BUILT artefact via `pnpm start` — playwright.config.ts): the region
 * contract in effect, and the theme/motion runtimes driven by STORED
 * STATE and OS signals. The landing carries no controls under the
 * 2026-08-13 tight scope, so these cells drive the runtimes the way a
 * returning visitor's stored choice and the OS do — pre-paint, without a
 * control. Control-driven semantics live with the demo routes' own specs
 * (identity-picker.spec.ts); the per-identity matrix lives in
 * specimen-a11y.spec.ts; identity-transition proofs live with the
 * composition route's spec.
 *
 * Hermetic by interception: every cross-origin request is aborted and the
 * aborted origins must stay within the declared third-party set (see
 * apply-state.ts for why absence of web fonts and icon masks does not
 * weaken the claims).
 */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import {
  assertOnlyKnownExternalOrigins,
  openShowcase,
  reloadWithStoredChoice,
} from './apply-state';

async function bodyBackground(page: Page): Promise<string> {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

test.describe('showcase page structure', () => {
  test('serves the showcase under the region contract', async ({ page }) => {
    const aborted = await openShowcase(page);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Oak Open Curriculum Design System' }),
    ).toBeVisible();
    // The landing's chrome regions (the utility band left with the
    // switchboard under the tight scope; the map's universal fallback
    // stacks whatever regions the markup supplies).
    for (const region of ['masthead', 'main', 'footer']) {
      await expect(page.locator(`.oak-canvas > [data-region="${region}"]`)).toBeVisible();
    }
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('applies the design-system stylesheets with the region map live', async ({ page }) => {
    const aborted = await openShowcase(page);
    const textPrimary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
    );
    expect(textPrimary.trim()).not.toBe('');
    // The composition map in effect is what this slice adds: the main grid
    // must resolve named areas (never assert WHICH areas — that pins the map).
    const gridAreas = await page.evaluate(() => {
      const main = document.querySelector('main.oak-main');
      return main === null ? null : getComputedStyle(main).gridTemplateAreas;
    });
    expect(gridAreas).not.toBeNull();
    expect(gridAreas).not.toBe('none');
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('theme runtime from stored state', () => {
  test('a stored theme choice applies through the pre-paint bootstrap', async ({ page }) => {
    const aborted = await openShowcase(page);
    const defaultBackground = await bodyBackground(page);
    await reloadWithStoredChoice(page, 'oak-theme', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await bodyBackground(page)).not.toBe(defaultBackground);
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('an OS contrast request themes the page without claiming a choice', async ({ page }) => {
    await page.emulateMedia({ contrast: 'more' });
    const aborted = await openShowcase(page);
    // The runtime's auto path applies high-contrast pre-paint; the person
    // has stored no choice (DDR-003: the access route themes the page
    // without claiming one — the choice semantics themselves are proven
    // at the picker's control, identity-picker.spec.ts).
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast');
    const storedChoice = await page.evaluate(() => localStorage.getItem('oak-theme'));
    expect(storedChoice).toBeNull();
    assertOnlyKnownExternalOrigins(aborted);
  });

  test('a stored reduced-motion choice collapses the motion tokens', async ({ page }) => {
    const aborted = await openShowcase(page, { reducedMotion: false });
    const fullMotion = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--motion-quick'),
    );
    await reloadWithStoredChoice(page, 'oak-motion', 'reduced');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    const reducedMotion = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--motion-quick'),
    );
    expect(reducedMotion).not.toBe(fullMotion);
    assertOnlyKnownExternalOrigins(aborted);
  });
});

test.describe('system theme follows the device', () => {
  test.use({ colorScheme: 'dark' });
  test('system matches the explicit dark palette under a dark OS, light under light', async ({
    page,
  }) => {
    const aborted = await openShowcase(page);
    await reloadWithStoredChoice(page, 'oak-theme', 'dark');
    const darkBackground = await bodyBackground(page);
    await reloadWithStoredChoice(page, 'oak-theme', 'system');
    expect(await bodyBackground(page)).toBe(darkBackground);
    await page.emulateMedia({ colorScheme: 'light' });
    await expect.poll(async () => bodyBackground(page)).not.toBe(darkBackground);
    assertOnlyKnownExternalOrigins(aborted);
  });
});
