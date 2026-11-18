/**
 * Shared route-level checks for the showcase's spec files (extracted at
 * the second consumer): opening a route with external origins
 * intercepted and reduced motion emulated, and the SC 1.4.10 reflow
 * floor over in-flow content.
 */
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

import { interceptExternalOrigins } from './apply-state';

export async function openRoute(page: Page, route: string): Promise<Set<string>> {
  const aborted = await interceptExternalOrigins(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  await expect(page.locator('main').first()).toBeVisible();
  return aborted;
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const reflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    // In-flow content only, as the sibling suites probe it: out-of-flow
    // elements (the skip link off-canvas by design) are not reflow loss.
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
}
