import { readFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

import { resolveRepoRoot } from '../core/repo-root.js';
import { redactCredentials } from './bounded-excerpt.js';
import { type CliState } from './cli-validation.js';
import { runDrive, type DriveOutcome } from './drive.js';
import { buildDriveNodeIo, resolveMcpjamVersion } from './drive-node-io.js';
import { defaultReportDir, retainOwnerOnlyAt, writeRunSummary } from './node-io.js';
import {
  PLACEHOLDER_PREAMBLE,
  renderReviewerPack,
  reviewerPackPreambleSchema,
  type ReviewerPackPreamble,
  type ReviewerPackProvenance,
} from './render-reviewer-pack.js';

/**
 * CLI orchestration for the drive operation (MCP-303): one run, one JSON
 * summary, one rendered reviewer pack. Extracted from the entrypoint as the
 * drive-side sibling of the suites' `runFromCli` path — the bin keeps only
 * the argv scan, validation, and the operation branch.
 *
 * The rendered pack is OUTWARD-FACING in its entirety: every run's pack
 * goes to the owner for review before any external submission, whether or
 * not owner-approved preamble copy was supplied — the preamble gate covers
 * the three authored sentences, not the structural text around them.
 */

type PreambleLoad =
  | { readonly ok: true; readonly value: ReviewerPackPreamble }
  | { readonly ok: false; readonly error: string };

/**
 * The preamble is owner-gated copy: load it from the caller's file, or run
 * with unmistakable placeholders so a draft pack never reads as finished.
 */
function loadPreamble(preambleFile: string | undefined, repoRoot: string): PreambleLoad {
  if (preambleFile === undefined) {
    return { ok: true, value: PLACEHOLDER_PREAMBLE };
  }
  try {
    const raw: unknown = JSON.parse(readFileSync(resolve(repoRoot, preambleFile), 'utf8'));
    const parsed = reviewerPackPreambleSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ok: false,
        error: `--preamble-file did not match the preamble shape: ${parsed.error.message}`,
      };
    }
    return { ok: true, value: parsed.data };
  } catch (error) {
    return {
      ok: false,
      error: `--preamble-file could not be read: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Emit a run's report JSON to stdout AND `<report-dir>/summary.json` — the
 * single owner of this contract for BOTH operations (the suites' bin path
 * and the drive path consume it), so output and failure semantics cannot
 * drift apart. A failed summary write fails the run: a silently-missing
 * documented output is a false green.
 */
export function emitRunReportJson(
  repoRoot: string,
  reportDir: string,
  reportJson: string,
): boolean {
  const summary = writeRunSummary(repoRoot, reportDir, reportJson);
  process.stdout.write(reportJson);
  if (!summary.ok) {
    process.stderr.write(`summary.json could not be written: ${summary.error}\n`);
    return false;
  }
  return true;
}

function allToolsExercised(outcome: DriveOutcome): boolean {
  return (
    outcome.listFailure === undefined && outcome.witnesses.every((w) => w.outcome === 'called-ok')
  );
}

/** The wrapper's aggregate report for a drive run. */
export interface DriveRunReport {
  readonly operation: 'drive';
  readonly target: string;
  readonly outcome: DriveOutcome;
}

/**
 * The report as emitted — a pure projection so its one rule is describable
 * without the spawn seam: the target is redacted on the way out (a no-op for
 * a validated target; the belt for one that did not parse and so escaped the
 * validator's inspection). The pack redacts its own copy of the target.
 */
export function composeDriveRunReport(target: string, outcome: DriveOutcome): DriveRunReport {
  return { operation: 'drive', target: redactCredentials(target), outcome };
}

/**
 * Run the drive operation from validated CLI state. Exits 0 iff the tool
 * list was usable, every advertised tool was exercised successfully, and
 * both documented outputs (the JSON summary and the rendered pack) landed.
 */
export function runDriveFromCli(state: CliState, target: string): 0 | 1 {
  const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
  const reportDir = state.reportDir ?? defaultReportDir();
  const preamble = loadPreamble(state.preambleFile, repoRoot);
  if (!preamble.ok) {
    process.stderr.write(`${preamble.error}\n`);
    return 1;
  }
  const io = buildDriveNodeIo(repoRoot, reportDir, {
    target,
    ...(state.credentialsFile === undefined ? {} : { credentialsFile: state.credentialsFile }),
  });
  const outcome = runDrive(io);
  const reportJson = `${JSON.stringify(composeDriveRunReport(target, outcome), null, 2)}\n`;
  if (!emitRunReportJson(repoRoot, reportDir, reportJson)) {
    return 1;
  }
  const provenance: ReviewerPackProvenance = {
    generatedAt: new Date().toISOString(),
    vendorCliVersion: resolveMcpjamVersion(repoRoot),
    reportDir,
  };
  const pack = renderReviewerPack({ target, preamble: preamble.value, outcome, provenance });
  if (!writePack(repoRoot, reportDir, state.packOut, pack)) {
    return 1;
  }
  return allToolsExercised(outcome) ? 0 : 1;
}

/**
 * Write the rendered pack owner-only at its resolved destination, refusing
 * a `--pack-out` that shadows ANY run artefact — the summary and the
 * per-tool evidence must survive the pack write, or a green run is missing
 * the evidence its own pack points at.
 */
function writePack(
  repoRoot: string,
  reportDir: string,
  packOut: string | undefined,
  pack: string,
): boolean {
  const packPath = resolve(repoRoot, packOut ?? join(reportDir, 'reviewer-pack.md'));
  const summaryPath = resolve(repoRoot, join(reportDir, 'summary.json'));
  const evidenceDir = resolve(repoRoot, join(reportDir, 'tools'));
  // Compared as case-folded storage keys: default macOS/Windows filesystems
  // open Summary.json and summary.json as the same file.
  const storageKey = (value: string): string => value.toLowerCase();
  if (
    storageKey(packPath) === storageKey(summaryPath) ||
    storageKey(packPath).startsWith(storageKey(evidenceDir + sep))
  ) {
    process.stderr.write(
      `--pack-out must not shadow a run artefact (${packPath}) — the summary and the per-tool evidence must survive the pack write\n`,
    );
    return false;
  }
  const written = retainOwnerOnlyAt(packPath, pack);
  if (!written.ok) {
    process.stderr.write(
      `the reviewer pack could not be written to ${packPath}: ${written.error}\n`,
    );
    return false;
  }
  return true;
}
