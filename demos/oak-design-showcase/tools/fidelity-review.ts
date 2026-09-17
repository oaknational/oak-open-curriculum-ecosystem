/*
 * The fidelity review CLI: one command that serves the canonical export
 * over the studio overlay, ensures the dev server, captures both sides
 * at matched geometry, perceptually diffs every eligible pair, and
 * writes the review surface — demo-evidence/fidelity-report/index.html
 * + results.json — with the disposition register rendered beside each
 * pair. The run skeleton (flags, diff loop, report assembly, the
 * teardown bracket) is @oaknational/fidelity-review/orchestrator; this
 * file keeps only the showcase's composition root: paths, capture
 * arms, and a main that attaches to custom bases.
 *
 * EXIT SEMANTICS: diff magnitude NEVER affects the exit code (the diff
 * is triage; acceptance stays human judgment). Non-zero means a
 * mechanical failure only — see the orchestrator module header.
 *
 * USAGE:
 *   pnpm --filter @oaknational/oak-design-showcase tool:fidelity
 *   pnpm --filter @oaknational/oak-design-showcase tool:fidelity -- --report-only
 *   flags: --base <url> --width <px> --report-only --keep-server
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { assertServerUp, ensureDevServer } from '@oaknational/fidelity-review/dev-server';
import {
  acquireRunLease,
  buildAndWriteReport,
  captureAndReport,
  createCaptureSession,
  nodeCaptureStageIo,
  nodeEvidenceIo,
  reportDirFor,
  resolveRunFlags,
  type CaptureRun,
  type ServerMode,
} from '@oaknational/fidelity-review/orchestrator';
import { MATCHED_GEOMETRY_SCALE } from '@oaknational/fidelity-review/capture-flags';
import { describeThrown, runTool } from '@oaknational/fidelity-review/support';
import { err, type Result } from '@oaknational/result';

import { APP_SENTINEL, DEFAULT_BASE, SERVER_HINT } from './capture-checks';
import { captureLivePages } from './capture-live-pages';
import { FIDELITY_PAIRS } from './fidelity-pairs';
import { assertCanonicalWidth } from './measurement-widths';
import { renderExportTargets } from './render-export-targets';

const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEMO_DIR = path.resolve(TOOLS_DIR, '..');

/** Run both capture arms through ONE staged session; promotion happens
 *  only after every arm succeeds, so a failed or suspect run leaves the
 *  canonical evidence — and its manifest — exactly as the last good run
 *  left them (the staged shots remain under demo-evidence/.staging/ as
 *  diagnostics). Any arm failure is mechanical and fails the run. */
async function capturePhase(base: string, width: number): Promise<Result<void, string>> {
  const runId = `${Date.now()}-${process.pid}`;
  // EI-3: one run per evidence set — a concurrent run refuses loudly
  // with the holder named instead of interleaving writes.
  const lease = acquireRunLease(DEMO_DIR, runId);
  if (!lease.ok) {
    return err(`fidelity: ${lease.error}`);
  }
  try {
    const session = createCaptureSession(nodeCaptureStageIo(DEMO_DIR, runId), {
      base,
      widthCssPx: width,
      deviceScaleFactor: MATCHED_GEOMETRY_SCALE,
      startedAt: new Date().toISOString(),
      now: () => new Date().toISOString(),
    });
    const render = await renderExportTargets(width, session);
    if (!render.ok) {
      return render;
    }
    const suspect = await captureLivePages(base, width, FIDELITY_PAIRS.pairs, session);
    if (suspect) {
      return err('fidelity: a live page capture looked blank — investigate before trusting diffs');
    }
    return session.promote();
  } finally {
    lease.value();
  }
}

function report(serverMode: ServerMode): Result<void, string> {
  return buildAndWriteReport(
    serverMode,
    new Date().toISOString(),
    { map: FIDELITY_PAIRS, demoDir: DEMO_DIR },
    nodeEvidenceIo(DEMO_DIR),
  );
}

async function main(): Promise<Result<void, string>> {
  const flags = resolveRunFlags(process.argv.slice(2), process.env, DEFAULT_BASE);
  if (!flags.ok) {
    return flags;
  }
  // Measurement happens at canonical widths (DDR-009): a free-hand width
  // would produce a capture nothing else can be compared against.
  const width = assertCanonicalWidth(flags.value.width);
  if (!width.ok) {
    return err(`fidelity: ${width.error}`);
  }
  fs.mkdirSync(reportDirFor(DEMO_DIR), { recursive: true });

  if (flags.value.reportOnly) {
    return report('report-only');
  }

  const run: CaptureRun = {
    assertServerUp: (base) => assertServerUp(base, SERVER_HINT, APP_SENTINEL),
    capturePhase,
    report: (serverMode) => report(serverMode),
  };

  // A custom --base is never spawned: the workspace dev script binds the
  // default port, so spawning for any other base would wait the full
  // ready deadline on a port nothing will answer. Custom bases attach to
  // a pre-started server or fail loud.
  if (flags.value.base !== DEFAULT_BASE) {
    return captureAndReport(flags.value, { mode: 'attached' }, run);
  }

  const server = await ensureDevServer(flags.value.base, DEMO_DIR, APP_SENTINEL);
  if (!server.ok) {
    return server;
  }
  return captureAndReport(flags.value, server.value, run);
}

const invokedPath = process.argv.at(1);
if (invokedPath !== undefined && path.resolve(invokedPath) === fileURLToPath(import.meta.url)) {
  await runTool(main, (error) => `FIDELITY FAIL: ${describeThrown(error)}`);
}
