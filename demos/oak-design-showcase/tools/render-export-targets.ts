/*
 * The export-render arm of the fidelity review: serve the canonical export
 * over the two-root overlay (export-server.ts — the pages are not
 * self-contained under studio-source/), render each declared target with a
 * JS-capable headless browser at matched geometry, and write one PNG per
 * pair into demo-evidence/, named by pair id (the naming-ratchet-safe
 * convention pinned in fidelity-pairs.unit.test.ts).
 *
 * Served-over-HTTP + networkidle is required, not optional: the specimen
 * document.writes its brand sheets from the ?brand= query, and the picker
 * chrome hydrates its specimen iframe — neither completes over file://.
 *
 * CORRECTNESS MECHANISM (the hub's, carried; why there is no unit test at
 * this driving level): the run is self-validating — each render is checked
 * for a real (non-blank) result, and the picker chrome additionally
 * requires a non-empty iframe document because its own body text sits
 * close to the generic threshold (iframe content does not count toward the
 * parent's innerText). The pure classification lives in capture-checks.ts
 * (isRenderSuspect) and is unit-tested there.
 */
import { chromium } from '@playwright/test';
import type { Page, Request, Response } from '@playwright/test';
import { ok, err, type Result } from '@oaknational/result';

import { portOf, resolveExportRoots, serveRoots } from './export-server';
import { EXPORT_RENDER_TARGETS, type ExportRenderTarget } from './fidelity-pairs';
import { isRenderSuspect, isRequiredResourceFailure, type RenderMetrics } from './capture-checks';
import {
  isAllowedRequestUrl,
  MATCHED_GEOMETRY_SCALE,
} from '@oaknational/fidelity-review/capture-flags';
import {
  captureShot,
  createOriginGuard,
  settleForCapture,
} from '@oaknational/fidelity-review/capture-settle';
import { describeThrown } from '@oaknational/fidelity-review/support';
import type { CaptureSession } from '@oaknational/fidelity-review/orchestrator';

/** The picker chrome hosts the specimen in an iframe; a blank frame with a
 *  healthy parent is exactly the wrong-target class the generic classifier
 *  cannot see. Returns the frame's visible text length (undefined when the
 *  page hosts no frame). */
async function iframeTextLength(page: Page): Promise<number | undefined> {
  const frame = page.frames().at(1);
  if (frame === undefined) {
    return undefined;
  }
  return frame.evaluate(() => document.body.innerText.length);
}

async function measureRender(page: Page, status: number): Promise<RenderMetrics> {
  const m = await page.evaluate(() => ({
    h: document.body.scrollHeight,
    len: document.body.innerText.length,
  }));
  return {
    status,
    bodyHeight: m.h,
    textLength: m.len,
    frameTextLength: await iframeTextLength(page),
  };
}

function logRender(url: string, m: RenderMetrics, suspect: boolean): void {
  process.stdout.write(
    `${url}: HTTP=${m.status} bodyH=${m.bodyHeight} textLen=${m.textLength}${
      m.frameTextLength === undefined ? '' : ` frameTextLen=${m.frameTextLength}`
    } -> ${suspect ? 'SUSPECT (blank?)' : 'OK'}\n`,
  );
}

/** Watch one navigation for failed required subresources — both
 *  network-level failures (a destroyed socket) AND error statuses. The
 *  failure policy itself (required types, same-origin scope, status
 *  threshold) is the pure `isRequiredResourceFailure` in
 *  capture-checks.ts, unit-tested there; this is only the wiring. */
function watchRequiredResources(
  page: Page,
  base: string,
): { failures: () => readonly string[]; dispose: () => void } {
  const failures: string[] = [];
  const onRequestFailed = (request: Request): void => {
    if (isRequiredResourceFailure(request.resourceType(), request.url(), base)) {
      failures.push(
        `${request.resourceType()} ${request.url()} — ${request.failure()?.errorText ?? 'failed'}`,
      );
    }
  };
  const onResponse = (response: Response): void => {
    const request = response.request();
    if (
      isRequiredResourceFailure(request.resourceType(), response.url(), base, response.status())
    ) {
      failures.push(`${request.resourceType()} ${response.url()} — HTTP ${response.status()}`);
    }
  };
  page.on('requestfailed', onRequestFailed);
  page.on('response', onResponse);
  return {
    failures: () => failures,
    dispose: () => {
      page.off('requestfailed', onRequestFailed);
      page.off('response', onResponse);
    },
  };
}

/** Render one export target and write every declared shot; true when the
 *  render looks blank (or its iframe does, where one is expected), or
 *  when a required subresource failed to serve. */
async function renderTarget(
  page: Page,
  base: string,
  target: ExportRenderTarget,
  session: CaptureSession,
): Promise<boolean> {
  // Attached per target and disposed after its settle window (the
  // specimen document.writes brand sheets and fonts arrive late), so
  // one target's failure never condemns a later one — the page is
  // reused across targets.
  const watch = watchRequiredResources(page, base);
  let metrics: RenderMetrics;
  try {
    const resp = await page.goto(`${base}/${encodeURI(target.url)}`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    // The shared settle runs once so the metrics read a settled page;
    // captureShot settles again per shot (idempotent), so the shutter
    // can never fire unsettled.
    await settleForCapture(page);
    metrics = await measureRender(page, resp === null ? 0 : resp.status());
  } finally {
    watch.dispose();
  }
  const resourceFailures = watch.failures();
  for (const failure of resourceFailures) {
    process.stdout.write(`${target.url}: REQUIRED RESOURCE FAILED — ${failure}\n`);
  }
  const suspect = isRenderSuspect(metrics, target.expectsFrame) || resourceFailures.length > 0;
  logRender(target.url, metrics, suspect);
  // Shots are still STAGED on a suspect render — the staging area is
  // the diagnosis surface; a failed run never promotes, so canonical
  // evidence stays exactly as the last good run left it.
  for (const shot of target.shots) {
    const bytes = await captureShot(page, { fullPage: shot.kind === 'full' });
    const staged = session.stage(`demo-evidence/export-${shot.pairId}.png`, bytes);
    if (!staged.ok) {
      process.stdout.write(`  STAGE FAIL export-${shot.pairId}.png: ${staged.error}\n`);
      return true;
    }
    process.stdout.write(`  staged export-${shot.pairId}.png\n`);
  }
  return suspect;
}

/** Serve the overlay and render every declared export target at `width` CSS
 *  px — the importable core the fidelity orchestrator composes. */
export async function renderExportTargets(
  width: number,
  session: CaptureSession,
): Promise<Result<void, string>> {
  const rootsRes = resolveExportRoots();
  if (!rootsRes.ok) {
    return rootsRes;
  }
  const roots = rootsRes.value;
  const server = await serveRoots(roots);
  const portRes = portOf(server);
  if (!portRes.ok) {
    server.close();
    return err(`RENDER FAIL: ${describeThrown(portRes.error)}`);
  }
  const base = `http://127.0.0.1:${portRes.value}`;
  process.stdout.write(
    `serving export overlay [${roots.map((root) => root.dir).join(' -> ')}] at ${base}\n` +
      `viewport CSS width = ${width}px (deviceScaleFactor ${MATCHED_GEOMETRY_SCALE} -> ${width * MATCHED_GEOMETRY_SCALE}px PNGs)\n`,
  );

  let suspect: boolean;
  try {
    suspect = await renderAll(base, width, session);
  } finally {
    server.close();
  }
  if (suspect) {
    return err(
      'RENDER SUSPECT: an export target looked blank (low text/height, an empty specimen iframe, or a failed required subresource) — investigate before trusting the PNGs',
    );
  }
  process.stdout.write('export render complete -> demo-evidence/\n');
  return ok(undefined);
}

/** Launch the browser and render every declared target; true when any
 *  render looked blank. */
async function renderAll(base: string, width: number, session: CaptureSession): Promise<boolean> {
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
    for (const target of EXPORT_RENDER_TARGETS) {
      suspect = (await renderTarget(page, base, target, session)) || suspect;
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
