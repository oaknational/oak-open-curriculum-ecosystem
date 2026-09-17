/*
 * The live arm of the per-block fidelity pairs: drive the RUNNING demo's
 * /course#section=<id> deep links (the player's hash handler swaps the
 * section in — proven in CoursePlayer.test.tsx) and element-screenshot the
 * course content region, mirroring drive-export-sections.ts's #main shots
 * of the export player. Output names come from the pairing map so the two
 * arms stay in lockstep.
 *
 * Requires the dev server already running (the capture-live-demo
 * convention); the fidelity orchestrator owns server lifecycle.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ok, err, type Result } from '@oaknational/result';

import {
  isAllowedRequestUrl,
  MATCHED_GEOMETRY_SCALE,
  resolveBase,
} from '@oaknational/fidelity-review/capture-flags';
import {
  captureElementShot,
  createOriginGuard,
  settleForCapture,
} from '@oaknational/fidelity-review/capture-settle';
import {
  createCaptureSession,
  nodeCaptureStageIo,
  type CaptureSession,
} from '@oaknational/fidelity-review/orchestrator';
import { assertServerUp } from '@oaknational/fidelity-review/dev-server';
import { APP_SENTINEL, DEFAULT_BASE, SERVER_HINT } from './capture-checks';
import { FIDELITY_PAIRS, type FidelityPair } from './fidelity-pairs';
import { describeThrown, runTool } from '@oaknational/fidelity-review/support';

const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEMO_DIR = path.resolve(TOOLS_DIR, '..');

/** The live course player's content region (CourseShell renders it). */
const CONTENT_REGION = 'section[aria-label="Course content"]';

interface RegionMeasure {
  readonly boxHeight: number;
  readonly textLength: number;
}

/** A captured region that is collapsed, textless, or absent is a bad
 *  capture: the deep link never swapped the section in, or the shot ran
 *  pre-hydration. Pure policy — the drive measures, this decides. */
export function sectionCaptureLooksBlank(measure: RegionMeasure | undefined): boolean {
  if (measure === undefined) {
    return true;
  }
  return measure.boxHeight < 100 || measure.textLength < 50;
}

async function measureRegion(page: Page): Promise<RegionMeasure | undefined> {
  const region = page.locator(CONTENT_REGION);
  if ((await region.count()) === 0) {
    return undefined;
  }
  const box = await region.boundingBox();
  const text = await region.innerText();
  return { boxHeight: box?.height ?? 0, textLength: text.length };
}

/** Capture one section pair; true on failure (logged, run continues). */
async function captureOne(
  page: Page,
  base: string,
  pair: FidelityPair,
  session: CaptureSession,
): Promise<boolean> {
  try {
    await page.goto(`${base}${pair.liveRoute}`, { waitUntil: 'domcontentloaded' });
    // The shared settle runs once so the region measurement reads a
    // settled page; captureElementShot settles again (idempotent), so
    // the shutter can never fire unsettled.
    await settleForCapture(page);
    if (pair.id === 'bottom-controls') {
      await page.evaluate((selector) => {
        document.querySelector(selector)?.scrollIntoView({ block: 'end' });
      }, CONTENT_REGION);
      await page.waitForTimeout(300);
    }
    if (sectionCaptureLooksBlank(await measureRegion(page))) {
      process.stderr.write(`FAIL capture ${pair.id}: content region blank or absent\n`);
      return true;
    }
    const staged = session.stage(
      pair.livePng,
      await captureElementShot(page, page.locator(CONTENT_REGION)),
    );
    if (!staged.ok) {
      process.stderr.write(`FAIL capture ${pair.id}: ${staged.error}\n`);
      return true;
    }
    process.stdout.write(`PASS capture: ${pair.id}\n`);
    return false;
  } catch (error: unknown) {
    process.stderr.write(`FAIL capture ${pair.id}: ${describeThrown(error).slice(0, 200)}\n`);
    return true;
  }
}

/** Drive every target through one guarded browser page; returns the
 *  failure count (capture failures + egress violations). */
async function driveSectionCaptures(
  base: string,
  width: number,
  targets: readonly FidelityPair[],
  session: CaptureSession,
): Promise<number> {
  const browser = await chromium.launch({ headless: true });
  const guard = createOriginGuard((url) => isAllowedRequestUrl(url, new URL(base).origin));
  const page = await browser.newPage({
    viewport: { width, height: 2200 },
    deviceScaleFactor: MATCHED_GEOMETRY_SCALE,
  });
  await page.route('**/*', (route) => guard.handleRoute(route));
  page.on('response', (response) => guard.noteResponseUrl(response.url()));
  let failures = 0;
  for (const target of targets) {
    if (await captureOne(page, base, target, session)) {
      failures += 1;
    }
  }
  await browser.close();
  for (const violation of guard.violations()) {
    process.stderr.write(`EGRESS VIOLATION: ${violation}\n`);
    failures += 1;
  }
  return failures;
}

/** Capture every section-element pair's live side; Result carries the
 *  failure count so callers decide exit semantics. */
export async function captureLiveSections(
  base: string,
  width: number,
  session: CaptureSession,
): Promise<Result<number, string>> {
  const up = await assertServerUp(base, SERVER_HINT, APP_SENTINEL);
  if (!up.ok) {
    return err(`CAPTURE FAIL: ${up.error}`);
  }
  const targets = FIDELITY_PAIRS.pairs.filter((pair) => pair.kind === 'section-element');
  const failures = await driveSectionCaptures(base, width, targets, session);
  const line = failures === 0 ? 'RESULT: ALL CAPTURED' : `RESULT: ${failures} FAILURES`;
  process.stdout.write(`${line}\n`);
  return ok(failures);
}

async function main(): Promise<Result<void, string>> {
  const baseRes = resolveBase(process.argv.slice(2), process.env, DEFAULT_BASE);
  if (!baseRes.ok) {
    return err(`CAPTURE FAIL: ${baseRes.error.message}`);
  }
  // Diagnostic run: staged only, never promoted (see capture-live-demo).
  const session = createCaptureSession(
    nodeCaptureStageIo(DEMO_DIR, `diagnostic-${Date.now()}-${process.pid}`),
    {
      base: baseRes.value,
      widthCssPx: 1440,
      deviceScaleFactor: MATCHED_GEOMETRY_SCALE,
      startedAt: new Date().toISOString(),
      now: () => new Date().toISOString(),
    },
  );
  const failures = await captureLiveSections(baseRes.value, 1440, session);
  if (!failures.ok) {
    return failures;
  }
  process.exitCode = failures.value === 0 ? 0 : 1;
  return ok(undefined);
}

const invokedPath = process.argv.at(1);
if (invokedPath !== undefined && path.resolve(invokedPath) === fileURLToPath(import.meta.url)) {
  await runTool(main, (error) => `CAPTURE FAIL: ${describeThrown(error)}`);
}
