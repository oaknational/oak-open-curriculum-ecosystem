/*
 * The app-neutral fidelity-run skeleton, shared at its second consumer
 * (the Sonar duplication gate priced the twin copies on PR #834): flag
 * resolution, the pair diff-and-collect loop, report assembly, and the
 * capture-then-report bracket whose finally block is the single server
 * teardown. What stays app policy: the capture arms, the pair map, the
 * server-reachability hint text, and each CLI's main (the showcase
 * attaches to custom bases; the hub always ensures its own server).
 *
 * EXIT SEMANTICS (both apps): diff magnitude NEVER affects the exit
 * code (the diff is triage; acceptance stays human judgment). Non-zero
 * means a mechanical failure only: capture arm failed, register
 * invalid, server never ready, corrupt evidence, teardown failed.
 */
import { err, ok, type Result } from '@oaknational/result';

import { resolveBase, resolveWidth } from './capture-flags';
import { loadReconciledCohort } from './cohort-loading';
import type { DevServerHandle } from './dev-server';
import { diffPngs } from './image-diff';
import type { FidelityPair, PairingMap } from './pairing-types';
import { parseRegister } from './register';
import type { PairResult, RunMeta } from './report';
import { summariseToStdout, writeReport } from './review-helpers';
import { describeThrown } from './support';

// Re-exported because CaptureRun.report and buildAndWriteReport are
// typed on it — a composition root implementing the interface needs
// the name without reaching into an internal module.
export { type ServerMode } from './report';
// The evidence-io seam and the demo-root layout convention live in
// evidence-io.ts; re-exported here because the orchestrator's own
// signatures are typed on them and the composition roots compose both.
export { type ManifestReadIo } from './evidence-io';
export { acquireRunLease } from './run-lease-io';
export { registerRunTeardown, type SignalProcess } from './run-teardown';
export {
  nodeCaptureStageIo,
  nodeEvidenceIo,
  registerPathFor,
  reportDirFor,
  type DiffWriteIo,
  type EvidenceIo,
  type EvidenceReadIo,
  type RegisterReadIo,
  type ReportWriteIo,
} from './evidence-io';
// The capture-session staging surface, composed by each app's capture
// phase; the pure manifest half lives on the /capture-manifest subpath.
export {
  createCaptureSession,
  type CaptureSession,
  type CaptureSessionMeta,
  type CaptureStageIo,
} from './capture-session';
import {
  registerPathFor,
  type DiffWriteIo,
  type EvidenceIo,
  type EvidenceReadIo,
} from './evidence-io';

export interface RunFlags {
  readonly base: string;
  readonly width: number;
  readonly reportOnly: boolean;
  readonly keepServer: boolean;
}

/** Resolve the run's flags. Pure — argv/env arrive as parameters (the
 *  lib process boundary), the app supplies its own default base. */
export function resolveRunFlags(
  argv: readonly string[],
  env: NodeJS.ProcessEnv,
  defaultBase: string,
): Result<RunFlags, string> {
  const width = resolveWidth(argv, env);
  if (!width.ok) {
    return err(width.error.message);
  }
  const base = resolveBase(argv, env, defaultBase);
  if (!base.ok) {
    return err(base.error.message);
  }
  return ok({
    base: base.value,
    width: width.value,
    reportOnly: argv.includes('--report-only'),
    keepServer: argv.includes('--keep-server'),
  });
}

/** Diff one declared pair. Absent evidence is a reportable row
 *  (missing-evidence); an ineligible pair is a reference-only row; a
 *  PNG that exists but cannot be decoded is CORRUPT evidence — a
 *  mechanical failure that fails the run, never a normal report row
 *  (`missing` is documented as evidence PATHS, so a decode error
 *  rendered there would mislead the report's reader). */
export function diffPair(
  pair: FidelityPair,
  io: EvidenceReadIo & DiffWriteIo,
): Result<PairResult, string> {
  const missing = [pair.exportPng, pair.livePng].filter((candidate) => !io.exists(candidate));
  if (missing.length > 0) {
    return ok({ pair, status: 'missing-evidence', missing });
  }
  if (!pair.diffEligible) {
    return ok({ pair, status: 'reference-only' });
  }
  const exportBytes = io.read(pair.exportPng);
  if (!exportBytes.ok) {
    return err(`fidelity: ${exportBytes.error}`);
  }
  const liveBytes = io.read(pair.livePng);
  if (!liveBytes.ok) {
    return err(`fidelity: ${liveBytes.error}`);
  }
  const outcome = diffPngs(exportBytes.value, liveBytes.value);
  if (!outcome.ok) {
    return err(`fidelity: corrupt evidence for pair ${pair.id} — ${outcome.error}`);
  }
  const diffPngName = `diff-${pair.id}.png`;
  const wrote = io.writeDiff(diffPngName, outcome.value.diffPng);
  if (!wrote.ok) {
    return err(`fidelity: ${wrote.error}`);
  }
  const { changedRatio, exportDims, liveDims, croppedTo, caveats } = outcome.value;
  return ok({
    pair,
    status: 'diffed',
    diff: { changedRatio, diffPngName, exportDims, liveDims, croppedTo, caveats },
  });
}

/** Run `diffOne` over the declared pairs in order, stopping at the
 *  first mechanical failure. Pure given its callback. */
export function collectPairResults(
  pairs: readonly FidelityPair[],
  diffOne: (pair: FidelityPair) => Result<PairResult, string>,
): Result<readonly PairResult[], string> {
  const results: PairResult[] = [];
  for (const pair of pairs) {
    const outcome = diffOne(pair);
    if (!outcome.ok) {
      return outcome;
    }
    results.push(outcome.value);
  }
  return ok(results);
}

export interface ReportConfig {
  /** The app's full declared map — the pairs to diff and the renderer's
   *  exempt-surfaces view arrive as ONE object, so they cannot
   *  desynchronise (pairing-types deliberately narrows the renderer's
   *  own parameter to the exempt-surfaces projection). */
  readonly map: PairingMap & { readonly pairs: readonly FidelityPair[] };
  readonly demoDir: string;
}

/** Diff every pair against the register and write the report + results
 *  into the package's conventional locations under `demoDir`.
 *  `generatedAt` arrives from the composition root so meta assembly has
 *  no hidden clock. The evidence cohort is reconciled against the
 *  capture manifest FIRST: mixed, incomplete, drifted, or tampered
 *  evidence refuses by name instead of being reported over, and the
 *  report meta (base, geometry) derives from the manifest — the flags
 *  are capture inputs, never report truth. */
export function buildAndWriteReport(
  serverMode: RunMeta['serverMode'],
  generatedAt: string,
  cfg: ReportConfig,
  io: EvidenceIo,
): Result<void, string> {
  const cohort = loadReconciledCohort(cfg.map.pairs, io);
  if (!cohort.ok) {
    return cohort;
  }
  const rawRegister = io.readRegister();
  if (!rawRegister.ok) {
    return err(`fidelity: ${rawRegister.error}`);
  }
  if (rawRegister.value === undefined) {
    return err(`fidelity: register not found at ${registerPathFor(cfg.demoDir)}`);
  }
  const register = parseRegister(rawRegister.value);
  if (!register.ok) {
    return register;
  }
  const results = collectPairResults(cfg.map.pairs, (pair) => diffPair(pair, io));
  if (!results.ok) {
    return results;
  }
  summariseToStdout(results.value, register.value);
  return writeReport(
    results.value,
    register.value,
    {
      base: cohort.value.base,
      widthCssPx: cohort.value.widthCssPx,
      deviceScaleFactor: cohort.value.deviceScaleFactor,
      serverMode,
      generatedAt,
    },
    cfg.map,
    io,
  );
}

/** The app-supplied collaborators of one capture-and-report run. */
export interface CaptureRun {
  readonly assertServerUp: (base: string) => Promise<Result<void, string>>;
  readonly capturePhase: (base: string, width: number) => Promise<Result<void, string>>;
  readonly report: (serverMode: RunMeta['serverMode']) => Result<void, string>;
}

/** Capture both sides, then report. The spawned server is reaped on
 *  EVERY path — a thrown Playwright/Node error, a failed reachability
 *  check, or a failed capture must never leave the detached dev process
 *  alive (no-unbounded-host-load; the dev-server module's ownership
 *  contract: stop() runs here because the handle was received here);
 *  the finally block is the single teardown. */
export async function captureAndReport(
  flags: RunFlags,
  server: DevServerHandle,
  run: CaptureRun,
): Promise<Result<void, string>> {
  let reported: Result<void, string> = err('fidelity: run did not start');
  try {
    const up = await run.assertServerUp(flags.base);
    if (!up.ok) {
      reported = err(`fidelity: ${up.error}`);
    } else {
      const captured = await run.capturePhase(flags.base, flags.width);
      reported = captured.ok ? run.report(server.mode) : captured;
    }
  } catch (error) {
    reported = err(`fidelity: ${describeThrown(error)}`);
  } finally {
    if (server.mode === 'spawned' && !flags.keepServer) {
      const stopped = await server.stop();
      if (!stopped.ok) {
        reported = err(reported.ok ? stopped.error : `${reported.error}; then ${stopped.error}`);
      }
    }
  }
  return reported;
}
