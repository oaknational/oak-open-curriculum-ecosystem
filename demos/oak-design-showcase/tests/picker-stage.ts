/**
 * Shared stage machinery for the picker specs: open the picker
 * hermetically, resolve the framed specimen, and assert control effects
 * inside the frame's own document. Extracted at the second consumer
 * (identity-picker.spec.ts, then the OS-contrast spec).
 */
import { expect } from '@playwright/test';
import type { Frame, Locator, Page } from '@playwright/test';

import { brandNameFont, interceptExternalOrigins } from './apply-state';
import type { IdentitySlug } from '../components/useIdentity';

/** The swapped brand is IN EFFECT inside the frame: the binder's link is
 *  present with the right href, and the computed face has moved off the
 *  base face. */
export async function expectBrandInEffect(
  frame: Frame,
  identity: IdentitySlug,
  baseFont: string,
): Promise<void> {
  await expect(frame.locator(`link[data-oak-brand="${identity}"]`)).toHaveAttribute(
    'href',
    `/brands/${identity}/brand.css`,
  );
  await expect
    .poll(async () => brandNameFont(frame), {
      message: 'the swapped brand must reach computed style inside the frame',
    })
    .not.toBe(baseFont);
}

/** Narrow a resolution result, failing the test loudly on a missing
 *  value. Both absent shapes die here — `.not.toBeNull()` alone lets
 *  `undefined` through — and the asserts signature carries the fact to
 *  the type level, so callers keep zero runtime branches (the
 *  no-conditional-tests contract: no branch may decide which assertions
 *  run on a passing test). */
export function assertResolved<T>(value: T, message: string): asserts value is NonNullable<T> {
  expect(value, message).not.toBeNull();
  expect(value, message).toBeDefined();
}

/** Open the picker hermetically and resolve its stage down to the framed
 *  specimen's live Frame, with the mount-time facts later assertions
 *  compare against. Resolution failure FAILS the test here — the return
 *  is never nullable, so no caller can pass without its assertions
 *  running. The no-reload sentinel is planted here: a reload
 *  manufactures a fresh document, so a dataset mark on the document root
 *  cannot survive one. */
export async function openPickerStage(page: Page): Promise<{
  readonly aborted: ReadonlySet<string>;
  readonly stage: Locator;
  readonly frame: Frame;
  readonly mountSrc: string;
  readonly baseFont: string;
}> {
  const aborted = await interceptExternalOrigins(page);
  await page.goto('/identity-switchboard');
  const stage = page.locator('.picker-stage iframe');
  // Locator.elementHandle() throws on a missing element (non-nullable by
  // type), so only the contentFrame() resolution needs the narrowing.
  const frame = await (await stage.elementHandle()).contentFrame();
  assertResolved(frame, 'the stage frame must resolve');
  await expect(frame.locator('[data-region="masthead"]')).toBeVisible();
  await frame.evaluate(() => {
    document.documentElement.dataset['pickerSentinel'] = 'planted';
  });
  return {
    aborted,
    stage,
    frame,
    mountSrc: (await stage.getAttribute('src')) ?? '',
    baseFont: await brandNameFont(frame),
  };
}

/** No navigation happened since the sentinel was planted: same document,
 *  same frozen mount src. */
export async function expectSameDocument(
  frame: Frame,
  stage: Locator,
  mountSrc: string,
): Promise<void> {
  await expect
    .poll(async () => frame.evaluate(() => document.documentElement.dataset['pickerSentinel']))
    .toBe('planted');
  await expect(stage).toHaveAttribute('src', mountSrc);
}

/** The chosen theme is IN EFFECT inside the frame: the framed document's
 *  computed color-scheme resolves to it, not merely the attribute string. */
export async function chooseThemeAndExpectInEffect(
  _page: Page,
  frame: Frame,
  theme: string,
): Promise<void> {
  // Controls v3 (owner word 2026-08-18): theme lives in the FRAME's own
  // strip; the parent chrome is width only. The page param stays for the
  // call-shape shared with the width helper.
  await frame.getByRole('combobox', { name: 'Theme' }).selectOption(theme);
  await expect
    .poll(
      async () => frame.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
      {
        message: 'the chosen theme must reach the framed cascade',
      },
    )
    .toBe(theme);
}

/** The chosen canonical width IS the frame's own viewport — innerWidth, so
 *  the media queries inside respond to the simulated width truthfully. */
export async function chooseWidthAndExpectInEffect(
  page: Page,
  frame: Frame,
  width: number,
): Promise<void> {
  await page.getByRole('combobox', { name: 'Width' }).selectOption(`${width}`);
  await expect
    .poll(async () => frame.evaluate(() => window.innerWidth), {
      message: 'the simulated viewport must adopt the chosen canonical width',
    })
    .toBe(width);
}

/** The framed root's live data-theme attribute ('' when absent) — the
 *  observation point for the access-commitment cells: what the frame's
 *  cascade actually keys on, whoever wrote it last. */
export async function frameThemeAttribute(frame: Frame): Promise<string> {
  return frame.evaluate(() => document.documentElement.dataset['theme'] ?? '');
}

/** The frame's OWN read of the emulated contrast media — the propagation
 *  marker the flip cells wait on before asserting anything about writes. */
export async function frameSeesMoreContrast(frame: Frame): Promise<boolean> {
  return frame.evaluate(() => matchMedia('(prefers-contrast: more)').matches);
}
