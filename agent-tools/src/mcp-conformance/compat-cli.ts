/**
 * CLI orchestration for the compat operation — the sibling of `drive-cli.ts`,
 * so the bin keeps only the argv scan, validation, and the operation branch.
 *
 * Shares the suites' spawn seam, owner-only retention, and the single
 * report-emission contract (`emitRunReportJson`), so output and failure
 * semantics cannot drift between operations.
 */
import { resolveRepoRoot } from '../core/repo-root.js';
import { type CliState } from './cli-validation.js';
import { type CompatIo } from './compat-evidence.js';
import { runCompat, type CompatOutcome } from './compat-run.js';
import { emitRunReportJson } from './drive-cli.js';
import { buildMcpjamRunner } from './mcpjam-spawn.js';
import { defaultReportDir, writeUnder } from './node-io.js';

/** Compat's IO: the shared spawn seam plus single-artefact retention. */
function buildCompatIo(repoRoot: string, reportDir: string): CompatIo {
  return {
    runMcpjam: buildMcpjamRunner(repoRoot),
    retainRawReport: (content) => writeUnder(repoRoot, reportDir, 'compat.json', content),
  };
}

/** The wrapper's aggregate report for a compat run. */
interface CompatRunReport {
  readonly schema_version: '1.0.0';
  readonly operation: 'compat';
  readonly target: string;
  readonly outcome: CompatOutcome;
}

/**
 * Run the compat capture from validated CLI state.
 *
 * Exits 0 when the run produced a parseable report and both documented
 * outputs landed — the raw capture and the summary. The report is for a
 * human to read; this command does not judge it.
 */
export function runCompatFromCli(state: CliState, target: string): 0 | 1 {
  const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
  const reportDir = state.reportDir ?? defaultReportDir();

  const outcome = runCompat(buildCompatIo(repoRoot, reportDir), {
    target,
    ...(state.credentialsFile === undefined ? {} : { credentialsFile: state.credentialsFile }),
  });

  const report: CompatRunReport = {
    schema_version: '1.0.0',
    operation: 'compat',
    target,
    outcome,
  };
  if (!emitRunReportJson(repoRoot, reportDir, `${JSON.stringify(report, null, 2)}\n`)) {
    return 1;
  }
  return outcome.verdict === 'pass' ? 0 : 1;
}
