/*
 * Re-runnable §D visual-fidelity capture of the LIVE running demo (the Next.js app), at the
 * §D matched-width standard (1440 CSS px), -> demo-evidence/ as full-page + above-the-fold PNGs.
 * These are the live-side captures that compare against the canonical-export render targets
 * produced by the sibling `render-canonical-targets.ts` (which renders the EXPORT, not the app).
 *
 * WHY a SEPARATE tool from render-canonical-targets.ts (do not merge them):
 *  - That tool serves the static .dc.html export over local HTTP and waits for `networkidle`.
 *  - THIS tool drives the RUNNING demo (default http://localhost:3010, `pnpm dev`).
 *    `next dev` holds an HMR websocket open for the page's lifetime, so `networkidle` NEVER fires
 *    and a networkidle wait times out. The cure (verified first-hand, carried across the data-lane
 *    cast) is `waitUntil: 'domcontentloaded'` (the App-Router pages are server-rendered, so the
 *    content HTML is present at DCL), THEN `document.fonts.ready` (Lexend) + disable animations +
 *    a short settle, THEN screenshot.
 *
 * CORRECTNESS MECHANISM (matches the sibling, and is why there is no separate unit test at this
 * tools/ level): the run is self-validating. Each capture is checked for a real (non-blank) render
 * — HTTP 200 + body scrollHeight + visible text length above thresholds — and the process exits
 * non-zero with SUSPECT if any target looks blank. The "test" for an evidence-generation tool is
 * "did it produce a non-blank capture", enforced live on every run.
 *
 * §D GEOMETRY: the viewport width is the CSS LAYOUT width (heading wrap, max-widths, breakpoints).
 * The PNG pixel dimensions are width × deviceScaleFactor (MATCHED_GEOMETRY_SCALE). Compare wrap/layout against a
 * canonical target only with both captures' CSS width + dSF known; never compare raw pixel dims.
 *
 * PLACEMENT: a workspace-internal dev tool of @oaknational/oak-curriculum-hub — `tsx` and
 * `@playwright/test` are workspace devDependencies, so the tool is first-class TypeScript under
 * the workspace's own strict gates (type-check + lint cover tools/).
 *
 * PREREQUISITE: the demo dev server must already be running (coordinate the :3010 port with the
 * styling lane before starting one). This tool does NOT start the server — it connects to it, so a
 * single running server is shared and there is no two-dev-server clash. If nothing is listening it
 * fails fast with a clear message.
 *
 * USAGE:
 *   # start the demo first (from the app dir): pnpm dev   (serves :3010)
 *   pnpm --filter @oaknational/oak-curriculum-hub tool:capture
 *   pnpm --filter @oaknational/oak-curriculum-hub tool:capture -- --routes /course,/standards --width 1440
 *   # direct form, from the repo root:
 *   BASE_URL=http://localhost:3011 tsx demos/oak-curriculum-hub/tools/capture-live-demo.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ok, err, type Result } from '@oaknational/result';

import {
  isAllowedRequestUrl,
  isSuspect,
  MATCHED_GEOMETRY_SCALE,
  resolveBase,
  resolveWidth,
} from '@oaknational/fidelity-review/capture-flags';
import {
  captureShot,
  createOriginGuard,
  settleForCapture,
} from '@oaknational/fidelity-review/capture-settle';
import {
  createCaptureSession,
  nodeCaptureStageIo,
  type CaptureSession,
} from '@oaknational/fidelity-review/orchestrator';
import { assertServerUp } from '@oaknational/fidelity-review/dev-server';
import { describeThrown, runTool } from '@oaknational/fidelity-review/support';

import {
  APP_SENTINEL,
  DEFAULT_BASE,
  isUnhydrated,
  resolveRoutes,
  routeToBase,
  SERVER_HINT,
} from './capture-checks';

const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEMO_DIR = path.resolve(TOOLS_DIR, '..');

function verdictFor(blank: boolean, unhydrated: boolean): string {
  if (blank) {
    return 'SUSPECT (blank/placeholder?)';
  }
  if (unhydrated) {
    return 'SUSPECT (UNHYDRATED — player never mounted; use a localhost base, 127.0.0.1 blocks dev chunks)';
  }
  return 'OK';
}

/** Capture one route (full-page + above-the-fold PNGs); returns true when the capture is bad. */
async function captureRoute(
  page: Page,
  base: string,
  route: string,
  session: CaptureSession,
): Promise<boolean> {
  const outBase = routeToBase(route);
  // domcontentloaded, NOT networkidle — next dev's HMR websocket keeps the network busy forever.
  const resp = await page.goto(`${base}${route}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  // The shared settle runs once so the measurement reads a settled
  // page; captureShot settles again per shot (idempotent), so the
  // shutter can never fire unsettled.
  await settleForCapture(page);
  const m = await page.evaluate(() => ({
    h: document.body.scrollHeight,
    len: document.body.innerText.length,
    hidden: document.querySelectorAll('[hidden]').length,
  }));
  // A null goto response means SAME-DOCUMENT navigation (a #hash route on an already-loaded
  // page) — Playwright returns null there rather than an HTTP response, and a genuine load
  // failure throws instead. Treat it as the already-delivered 200, not an HTTP=0 suspect.
  const status = resp === null ? 200 : resp.status();
  const blank = isSuspect(status, m.h, m.len);
  const unhydrated = isUnhydrated(route, m.hidden);
  process.stdout.write(
    `${route}: HTTP=${status} bodyH=${m.h} textLen=${m.len} hidden=${m.hidden} -> ${verdictFor(blank, unhydrated)}\n`,
  );
  const full = session.stage(
    `demo-evidence/${outBase}-live.png`,
    await captureShot(page, { fullPage: true }),
  );
  const fold = session.stage(
    `demo-evidence/${outBase}-live-abovefold.png`,
    await captureShot(page, { fullPage: false }),
  );
  if (!full.ok) {
    process.stdout.write(`  STAGE FAIL ${outBase}: ${full.error}\n`);
    return true;
  }
  if (!fold.ok) {
    process.stdout.write(`  STAGE FAIL ${outBase}: ${fold.error}\n`);
    return true;
  }
  process.stdout.write(`  staged ${outBase}-live.png + ${outBase}-live-abovefold.png\n`);
  return blank || unhydrated;
}

function logRunHeader(base: string, width: number, routes: readonly string[]): void {
  process.stdout.write(`live demo base = ${base}\n`);
  process.stdout.write(
    `viewport CSS width = ${width}px (deviceScaleFactor ${MATCHED_GEOMETRY_SCALE} -> ${width * MATCHED_GEOMETRY_SCALE}px PNGs)\n`,
  );
  process.stdout.write(`routes = ${routes.join(', ')}\n`);
}

/** Drive every route through one browser context; true when any capture is bad. */
export async function runCaptures(
  base: string,
  width: number,
  routes: readonly string[],
  session: CaptureSession,
): Promise<boolean> {
  const browser = await chromium.launch({ headless: true });
  const guard = createOriginGuard((url) => isAllowedRequestUrl(url, new URL(base).origin));
  let suspect = false;
  try {
    const ctx = await browser.newContext({
      viewport: { width, height: 1000 },
      deviceScaleFactor: MATCHED_GEOMETRY_SCALE,
    });
    await ctx.route('**/*', (route) => guard.handleRoute(route));
    const page = await ctx.newPage();
    page.on('response', (response) => guard.noteResponseUrl(response.url()));
    for (const route of routes) {
      suspect = (await captureRoute(page, base, route, session)) || suspect;
    }
  } finally {
    await browser.close();
  }
  for (const violation of guard.violations()) {
    process.stdout.write(`EGRESS VIOLATION: ${violation}\n`);
    suspect = true;
  }
  return suspect;
}

async function main(): Promise<Result<void, string>> {
  const argv = process.argv.slice(2);
  const widthRes = resolveWidth(argv, process.env);
  if (!widthRes.ok) {
    return err(`CAPTURE FAIL: ${describeThrown(widthRes.error)}`);
  }
  const baseRes = resolveBase(argv, process.env, DEFAULT_BASE);
  if (!baseRes.ok) {
    return err(`CAPTURE FAIL: ${describeThrown(baseRes.error)}`);
  }
  const base = baseRes.value;
  const routes = resolveRoutes(argv);

  const up = await assertServerUp(base, SERVER_HINT, APP_SENTINEL);
  if (!up.ok) {
    return err(`CAPTURE FAIL: ${up.error}`);
  }
  logRunHeader(base, widthRes.value, routes);

  // Direct invocation is a DIAGNOSTIC run: shots stage under
  // demo-evidence/.staging/ and are never promoted — canonical evidence
  // and its manifest change only through the full tool:fidelity run.
  const session = createCaptureSession(
    nodeCaptureStageIo(DEMO_DIR, `diagnostic-${Date.now()}-${process.pid}`),
    {
      base,
      widthCssPx: widthRes.value,
      deviceScaleFactor: MATCHED_GEOMETRY_SCALE,
      startedAt: new Date().toISOString(),
      now: () => new Date().toISOString(),
    },
  );
  const suspect = await runCaptures(base, widthRes.value, routes, session);
  if (suspect) {
    return err(
      'CAPTURE SUSPECT: a target looked blank/placeholder — investigate before trusting the PNGs',
    );
  }
  process.stdout.write('live capture complete -> demo-evidence/\n');
  return ok(undefined);
}

const invokedPath = process.argv.at(1);
if (invokedPath !== undefined && path.resolve(invokedPath) === fileURLToPath(import.meta.url)) {
  await runTool(main, (error) => `CAPTURE FAIL: ${describeThrown(error)}`);
}
