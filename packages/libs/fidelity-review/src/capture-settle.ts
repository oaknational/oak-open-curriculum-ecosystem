/*
 * The ONE capture-settle recipe and the shot that carries it. Export and
 * live evidence are comparable only when both sides settled identically
 * before the shutter — the same invariant that consolidated
 * MATCHED_GEOMETRY_SCALE, with more force: drift in one arm's settle
 * silently strips the warrant from every recorded matched/deliberate
 * disposition (assurance round CC-1, 2026-08-09). The recipe therefore
 * lives here once, and the shot is taken THROUGH it: captureShot is the
 * only sanctioned screenshot path in a capture arm (an ESLint
 * restriction in each demo enforces the arms cannot shoot around it —
 * the two-sided structural gate).
 *
 * Pure over its page parameter: the structural interfaces below name
 * exactly the capabilities used, so the ordered sequence and the fonts
 * bound prove with an injected fake — no browser in any test tier.
 */

/* The fonts wait executes INSIDE the page (Playwright serialises the
 * evaluate callback), where `document` is the page's global. The
 * package itself is browser-free, so the one page-global shape the
 * callback touches is declared minimally here rather than pulling the
 * whole DOM lib into a Node package. */
declare const document: { readonly fonts: { readonly ready: Promise<unknown> } };

/** How long the in-page fonts wait may take before the shot proceeds
 *  without it. The bound lives INSIDE page.evaluate (a Promise.race in
 *  the page), because Playwright's evaluate accepts no timeout or
 *  signal — an unbounded `document.fonts.ready` was the named teardown
 *  hang (assurance LC-1). */
export const FONTS_READY_BUDGET_MS = 15_000;

/** The post-fonts settle: hydration + font swap + late layout. */
export const SETTLE_MS = 2000;

/** The animation kill applied before every shot — animated UI can never
 *  settle, so both sides freeze it identically. */
export const ANIMATION_KILL_CSS = '*{animation:none!important;transition:none!important}';

/** The page capabilities the settle uses — structural, so a plain fake
 *  proves the ordered sequence. Matches the Playwright Page surface. */
export interface SettlePage {
  readonly evaluate: (fn: (arg: number) => Promise<unknown>, arg: number) => Promise<unknown>;
  readonly addStyleTag: (opts: { readonly content: string }) => Promise<unknown>;
  readonly waitForTimeout: (ms: number) => Promise<void>;
}

/** SettlePage plus the shutter. */
export interface ShotPage extends SettlePage {
  readonly screenshot: (opts: { readonly fullPage: boolean }) => Promise<Buffer>;
}

/**
 * Settle the page for a comparable capture: bounded fonts wait,
 * animation kill, fixed settle delay — in that order, identically for
 * every arm and both evidence sides.
 */
export async function settleForCapture(page: SettlePage): Promise<void> {
  await page.evaluate(
    (budgetMs) =>
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => {
          setTimeout(resolve, budgetMs);
        }),
      ]),
    FONTS_READY_BUDGET_MS,
  );
  await page.addStyleTag({ content: ANIMATION_KILL_CSS });
  await page.waitForTimeout(SETTLE_MS);
}

/**
 * The sanctioned capture shot: settle, then shoot, returning the PNG
 * bytes (never writing a path — the caller owns where evidence lands,
 * which is what lets the manifest staging hash and place it).
 */
export async function captureShot(
  page: ShotPage,
  opts: { readonly fullPage: boolean },
): Promise<Buffer> {
  await settleForCapture(page);
  return page.screenshot({ fullPage: opts.fullPage });
}

/** An element shutter (Playwright Locator/ElementHandle screenshot). */
export interface ElementShotTarget {
  readonly screenshot: () => Promise<Buffer>;
}

/** The sanctioned ELEMENT shot: settle the page, then shoot the
 *  element — the element-region counterpart of captureShot, under the
 *  identical settle so section evidence stays comparable with page
 *  evidence. */
export async function captureElementShot(
  page: SettlePage,
  element: ElementShotTarget,
): Promise<Buffer> {
  await settleForCapture(page);
  return element.screenshot();
}

/** The route-interception surface the guard drives — structural over
 *  Playwright's Route, so the block/continue decision proves with a
 *  plain fake. */
export interface RouteLike {
  readonly request: () => { readonly url: () => string };
  readonly continue: () => Promise<void>;
  readonly abort: () => Promise<void>;
}

export interface OriginGuard {
  /** Route handler for context.route's all-URLs pattern: continues an
   *  allowed request, aborts and records a disallowed one. */
  readonly handleRoute: (route: RouteLike) => Promise<void>;
  /** Response listener for `page.on('response', …)` — the redirect
   *  re-check: a hop that LANDED outside the allowlist is recorded even
   *  if its originating request was allowed. */
  readonly noteResponseUrl: (url: string) => void;
  /** The recorded violations, in observation order (deduplicated). */
  readonly violations: () => readonly string[];
}

/**
 * Build the capture-egress guard for one arm run. `isAllowed` arrives
 * as a parameter (the composition point passes the capture-flags
 * predicate bound to its declared origin) so the guard itself stays a
 * pure recorder around it. A violation NEVER silently degrades the
 * pixels: the arm asserts `violations()` is empty at its boundary and
 * fails the run loudly — an aborted subresource with a green run would
 * be a wrong capture the blank classifier cannot catch.
 */
export function createOriginGuard(isAllowed: (url: string) => boolean): OriginGuard {
  const seen = new Set<string>();
  return {
    handleRoute: async (route) => {
      const url = route.request().url();
      if (isAllowed(url)) {
        await route.continue();
        return;
      }
      seen.add(url);
      await route.abort();
    },
    noteResponseUrl: (url) => {
      if (!isAllowed(url)) {
        seen.add(url);
      }
    },
    violations: () => [...seen],
  };
}
