/**
 * State-application helpers for the showcase suite. Each helper asserts
 * internally that the state actually reached the cascade, so a failure to
 * apply is loud rather than a silently-duplicated cell (the MCP visual
 * suite's apply-theme.ts records the whole-matrix-went-green failure this
 * guards against).
 *
 * The identity wait is grounded in a first-hand probe: Chromium sets
 * `link.sheet` non-null BEFORE the sheet joins document.styleSheets and the
 * cascade (observed one-frame gap while its nested import resolves), so
 * "sheet parsed" is not "styles applied" — membership in
 * document.styleSheets plus a computed-style change is the applied signal.
 */
import { expect } from '@playwright/test';
import type { Frame, Page } from '@playwright/test';

import type { OakThemeName } from '@oaknational/oak-design-react';
import { RATIFIED_EXTERNAL_ORIGINS } from '@oaknational/fidelity-review/capture-flags';
import { SHOWCASE_ORIGIN } from '../tools/showcase-origin';
import { assertForcedColorsMode } from './axe-checks';

export const IDENTITIES = ['oak', 'pds', 'creature'] as const;
export const PALETTE_THEMES = ['light', 'dark', 'high-contrast', 'colour-safe'] as const;
export type Identity = (typeof IDENTITIES)[number];
/** The runtime's closed theme union is the single source of the five names. */
export type ThemeName = OakThemeName;

/** Computed face of the specimen's brand-name — the element every identity
 *  restyles. Polled by callers: the value, not the poll, is the claim.
 *  Shared by the specimen and picker specs. */
export async function brandNameFont(target: Page | Frame): Promise<string> {
  return target.evaluate(() => {
    const name = document.querySelector('.brand-name');
    return name === null ? '' : getComputedStyle(name).fontFamily;
  });
}

/** Origins the kit-authored counter-brand sheets are known to reference;
 *  any other aborted origin during a test fails the suite loudly. Full
 *  origins, not hostnames: a wrong-port loopback request must surface as
 *  itself, never hide behind a familiar hostname. The list itself is
 *  the fidelity package's RATIFIED_EXTERNAL_ORIGINS — one census,
 *  consumed here and by the capture-egress allowlist, so the two
 *  surfaces cannot drift apart. */
const EXPECTED_THIRD_PARTY_ORIGINS: readonly string[] = RATIFIED_EXTERNAL_ORIGINS;

/** Abort every request that is not same-origin with the suite's own
 *  server, recording the aborted ORIGINS. Same-origin means the full
 *  origin from tools/showcase-origin.ts — hostname equality would admit
 *  any port on localhost (cross-origin, and in a many-worktree estate
 *  possibly another tree's server). Icon masks and web fonts are absent
 *  under abort; that does not weaken the a11y claim — the kit's contract
 *  pairs fills with borders, icons AND text, so text carries every
 *  state's meaning. */
export async function interceptExternalOrigins(page: Page): Promise<Set<string>> {
  const abortedOrigins = new Set<string>();
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === SHOWCASE_ORIGIN) {
      return route.continue();
    }
    abortedOrigins.add(url.origin);
    return route.abort();
  });
  return abortedOrigins;
}

export function assertOnlyKnownExternalOrigins(abortedOrigins: ReadonlySet<string>): void {
  for (const origin of abortedOrigins) {
    expect(EXPECTED_THIRD_PARTY_ORIGINS, `unexpected third-party origin: ${origin}`).toContain(
      origin,
    );
  }
}

/** Open the landing hermetically. The page is a static server component —
 *  no hydrating control exists to gate on, so readiness is the doors being
 *  visible (they are links in the initial HTML). Reduced-motion emulation
 *  is on by default: axe reading a mid-transition frame is a recorded
 *  failure mode (MCP apply-theme.ts). The theme runtime on this route is
 *  driven by OS emulation and stored state, never a control — the
 *  switchboard left the landing under the 2026-08-13 tight scope, and the
 *  control-driven proofs live with the demo routes' own specs. */
export async function openShowcase(
  page: Page,
  options: { readonly reducedMotion?: boolean; readonly forcedColors?: boolean } = {},
): Promise<Set<string>> {
  const forcedColors = options.forcedColors ?? false;
  const abortedOrigins = await interceptExternalOrigins(page);
  await page.emulateMedia({
    reducedMotion: (options.reducedMotion ?? true) ? 'reduce' : 'no-preference',
    ...(forcedColors ? { forcedColors: 'active' as const } : {}),
  });
  await page.goto('/');
  await expect(page.getByRole('link', { name: /switching demo/i })).toBeVisible();
  await assertForcedColorsMode(page, forcedColors);
  return abortedOrigins;
}

/** Store a runtime choice the way the real store does, then reload so the
 *  pre-paint bootstrap is the ONLY path that can have applied it. The
 *  landing carries no controls (2026-08-13 tight scope), so stored state
 *  is how its specs drive the theme and motion runtimes. */
export async function reloadWithStoredChoice(
  page: Page,
  key: string,
  value: string,
): Promise<void> {
  await page.evaluate(
    ([storageKey, storedValue]) => {
      localStorage.setItem(storageKey ?? '', storedValue ?? '');
    },
    [key, value],
  );
  await page.reload();
}
