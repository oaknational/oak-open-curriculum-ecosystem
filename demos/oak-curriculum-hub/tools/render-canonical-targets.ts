/*
 * Re-runnable render of the Claude Design canonical-export pages that LACK an in-export
 * screenshot (Oak Hub, Oak Standards) -> demo-evidence/ as full-page + above-the-fold PNGs.
 * These are the visual-match targets the styling lane needs for DoD §D (Course + Learning
 * Framework already ship in-export targets: screenshots/coursemap.png / check.png / framework-img.png).
 *
 * WHY a server + headless browser (the prior "headless-blank / file:// blocked" wall):
 * the .dc.html is NOT static — it is an <x-dc> custom element hydrated at runtime by
 * _ds_bundle.js, plus a <meta name="ext-resource-dependency" content="data/quality-standards.json">
 * that the bundle FETCHES. Over file:// that fetch is CORS-blocked, so the bundle never renders
 * -> blank page. Cure: serve the export dir over local HTTP (relative assets + the fetch resolve),
 * render with a JS-capable headless browser, wait for networkidle + document.fonts.ready (Lexend),
 * then screenshot. Deterministic / byte-stable, so it is the render arm of the canonical-export
 * sync loop: fresh export -> re-run this -> re-diff the PNGs.
 *
 * PLACEMENT: a workspace-internal dev tool of @oaknational/oak-curriculum-hub — `tsx` and
 * `@playwright/test` are workspace devDependencies, so the tool is first-class TypeScript under
 * the workspace's own strict gates (type-check + lint cover tools/).
 *
 * USAGE:
 *   pnpm --filter @oaknational/oak-curriculum-hub tool:render-targets
 *   pnpm --filter @oaknational/oak-curriculum-hub tool:render-targets -- --width 1280
 *   # direct form, from the repo root:
 *   tsx demos/oak-curriculum-hub/tools/render-canonical-targets.ts
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ok, err, type Result } from '@oaknational/result';

import {
  isAllowedRequestUrl,
  MATCHED_GEOMETRY_SCALE,
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
import { assertExportDir, EXPORT_DIR, portOf, serveDir } from './export-server';
import { describeThrown, runTool } from '@oaknational/fidelity-review/support';

const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEMO_DIR = path.resolve(TOOLS_DIR, '..');

interface RenderTarget {
  file: string;
  base: string;
}

const TARGETS: readonly RenderTarget[] = [
  { file: 'Oak Hub.dc.html', base: 'hub-canonical-render' },
  { file: 'Oak Standards.dc.html', base: 'standards-canonical-render' },
];

/** Render one export page (full-page + above-the-fold PNGs); returns true when it looks blank. */
async function renderTarget(
  page: Page,
  base: string,
  target: RenderTarget,
  session: CaptureSession,
): Promise<boolean> {
  const resp = await page.goto(`${base}/${encodeURIComponent(target.file)}`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  // The shared settle runs once so the measurement reads a settled
  // page; captureShot settles again per shot (idempotent), so the
  // shutter can never fire unsettled.
  await settleForCapture(page);
  const m = await page.evaluate(() => ({
    h: document.body.scrollHeight,
    len: document.body.innerText.length,
  }));
  const status = resp === null ? 0 : resp.status();
  const good = status === 200 && m.h > 400 && m.len > 200;
  process.stdout.write(
    `${target.file}: HTTP=${status} bodyH=${m.h} textLen=${m.len} -> ${good ? 'OK' : 'SUSPECT (blank?)'}\n`,
  );
  const full = session.stage(
    `demo-evidence/${target.base}.png`,
    await captureShot(page, { fullPage: true }),
  );
  const fold = session.stage(
    `demo-evidence/${target.base}-abovefold.png`,
    await captureShot(page, { fullPage: false }),
  );
  if (!full.ok || !fold.ok) {
    process.stdout.write(`  STAGE FAIL ${target.base}\n`);
    return true;
  }
  process.stdout.write(`  staged ${target.base}.png + ${target.base}-abovefold.png\n`);
  return !good;
}

/** Launch the browser and render every target; true when any render looked blank. */
async function renderAll(base: string, width: number, session: CaptureSession): Promise<boolean> {
  process.stdout.write(
    `viewport CSS width = ${width}px (deviceScaleFactor ${MATCHED_GEOMETRY_SCALE} → ${width * MATCHED_GEOMETRY_SCALE}px PNGs)\n`,
  );
  const browser = await chromium.launch({ headless: true });
  const guard = createOriginGuard((url) => isAllowedRequestUrl(url, new URL(base).origin));
  const ctx = await browser.newContext({
    viewport: { width, height: 1000 },
    deviceScaleFactor: MATCHED_GEOMETRY_SCALE,
  });
  await ctx.route('**/*', (route) => guard.handleRoute(route));
  const page = await ctx.newPage();
  page.on('response', (response) => guard.noteResponseUrl(response.url()));
  let suspect = false;
  for (const target of TARGETS) {
    suspect = (await renderTarget(page, base, target, session)) || suspect;
  }
  await browser.close();
  for (const violation of guard.violations()) {
    process.stdout.write(`EGRESS VIOLATION: ${violation}\n`);
    suspect = true;
  }
  return suspect;
}

/** Serve the export and render every canonical target at `width` CSS px —
 *  the importable core the fidelity orchestrator composes. */
export async function renderCanonicalTargets(
  width: number,
  session: CaptureSession,
): Promise<Result<void, string>> {
  const exportDirRes = assertExportDir();
  if (!exportDirRes.ok) {
    return exportDirRes;
  }
  const server = await serveDir(EXPORT_DIR);
  const portRes = portOf(server);
  if (!portRes.ok) {
    return err(`RENDER FAIL: ${describeThrown(portRes.error)}`);
  }
  const base = `http://127.0.0.1:${portRes.value}`;
  process.stdout.write(`serving ${EXPORT_DIR} at ${base}\n`);

  const suspect = await renderAll(base, width, session);
  server.close();
  if (suspect) {
    return err(
      'RENDER SUSPECT: a target looked blank (low bodyH/textLen) — investigate before trusting the PNGs',
    );
  }
  process.stdout.write('render complete -> demo-evidence/\n');
  return ok(undefined);
}

async function main(): Promise<Result<void, string>> {
  // Shared strict resolver (R7): '1440px'/'1440.5' reject instead of
  // silently truncating; WIDTH env replaces the old RENDER_WIDTH.
  const widthRes = resolveWidth(process.argv.slice(2), process.env);
  if (!widthRes.ok) {
    return err(widthRes.error.message);
  }
  // Diagnostic run: staged only, never promoted (see capture-live-demo).
  const session = createCaptureSession(
    nodeCaptureStageIo(DEMO_DIR, `diagnostic-${Date.now()}-${process.pid}`),
    {
      base: 'http://127.0.0.1:0',
      widthCssPx: widthRes.value,
      deviceScaleFactor: MATCHED_GEOMETRY_SCALE,
      startedAt: new Date().toISOString(),
      now: () => new Date().toISOString(),
    },
  );
  return renderCanonicalTargets(widthRes.value, session);
}

const invokedPath = process.argv.at(1);
if (invokedPath !== undefined && path.resolve(invokedPath) === fileURLToPath(import.meta.url)) {
  await runTool(main, (error) => `RENDER FAIL: ${describeThrown(error)}`);
}
