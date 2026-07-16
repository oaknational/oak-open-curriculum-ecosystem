import { err, ok, type Result } from '@oaknational/result';

import {
  assertDedicatedCodexAuthentication,
  createLiveBenchmarkRunner,
  fingerprintTournamentCell,
  type LiveBenchmarkContext,
} from './benchmark-live.js';
import { runReviewTournament } from './benchmark.js';
import {
  runFeasibilityProbe,
  type CodexReviewFeasibilityProbeReport,
} from './feasibility-probe.js';
import { probeVersion, supportsSafeClaudeAsyncOutput } from './fingerprint-io.js';
import { writeQualifiedBenchmarkState, writeUnqualifiedBenchmarkState } from './local-state.js';
import { deactivateHookReviewState } from './operator-deactivation.js';
import { type OperatorOwnedError } from './operator-runtime.js';
import { ensureReviewRuntimeLayout } from './review-assets.js';
import { captureRuntimeExecutablePins, deployAdapterBundle } from './runtime-integrity.js';
import { type TournamentSelection } from './tournament-types.js';

interface BenchmarkCommandInput {
  readonly projectRoot: string;
  readonly output: {
    readonly writeLine: (message: string) => void;
    readonly writeErrorLine: (message: string) => void;
  };
}

type TournamentReport = Awaited<ReturnType<typeof runReviewTournament>>;

export type TournamentCorpusLabelAuditStatus = 'pending' | 'agreed';

/**
 * Production remains stopped until an independent review ratifies the frozen corpus labels.
 * Changing this constant is a reviewed code change, not an operator bypass.
 */
export const TOURNAMENT_CORPUS_LABEL_AUDIT_STATUS: TournamentCorpusLabelAuditStatus = 'pending';

export interface BenchmarkCommandError {
  readonly kind:
    | 'claude-version-unavailable'
    | 'unsupported-claude-version'
    | 'runtime-layout-failed'
    | 'benchmark-deactivation-failed'
    | 'benchmark-state-write-failed'
    | 'fingerprint-failed'
    | 'runtime-pin-failed'
    | 'adapter-deployment-failed';
  readonly message: string;
}

export interface BenchmarkCommandDependencies {
  readonly validateClaude: (executable: string) => Promise<Result<void, BenchmarkCommandError>>;
  readonly ensureAuthentication: (
    context: LiveBenchmarkContext,
    input: BenchmarkCommandInput,
  ) => Promise<Result<boolean, BenchmarkCommandError>>;
  readonly deactivate: (projectRoot: string) => Promise<Result<void, OperatorOwnedError>>;
  readonly runFeasibility: (
    context: LiveBenchmarkContext,
  ) => Promise<CodexReviewFeasibilityProbeReport>;
  readonly runTournament: typeof runReviewTournament;
}

const productionBenchmarkCommandDependencies: BenchmarkCommandDependencies = {
  validateClaude: assertSupportedClaude,
  ensureAuthentication: ensureBenchmarkAuthentication,
  deactivate: (projectRoot) => deactivateHookReviewState(projectRoot, 'clear'),
  runFeasibility: (context) =>
    runFeasibilityProbe({
      runner: createLiveBenchmarkRunner(context),
      completedAt: new Date().toISOString(),
    }),
  runTournament: runReviewTournament,
};

export async function runBenchmarkCommand(
  input: BenchmarkCommandInput,
  context: LiveBenchmarkContext,
  dependencies: BenchmarkCommandDependencies = productionBenchmarkCommandDependencies,
): Promise<Result<number, BenchmarkCommandError>> {
  const supportedClaude = await dependencies.validateClaude(context.executables.claude);
  if (!supportedClaude.ok) {
    return supportedClaude;
  }
  const authentication = await dependencies.ensureAuthentication(context, input);
  if (!authentication.ok) {
    return authentication;
  }
  if (!authentication.value) {
    return ok(1);
  }
  const deactivated = await dependencies.deactivate(input.projectRoot);
  if (!deactivated.ok) {
    return failure(
      'benchmark-deactivation-failed',
      'Unable to deactivate the previous hook before benchmarking',
    );
  }
  return runFeasibilityGatedTournament(input, context, dependencies);
}

async function runFeasibilityGatedTournament(
  input: BenchmarkCommandInput,
  context: LiveBenchmarkContext,
  dependencies: BenchmarkCommandDependencies,
): Promise<Result<number, BenchmarkCommandError>> {
  input.output.writeLine('Running 6 non-qualifying inline feasibility calls.');
  const feasibility = await dependencies.runFeasibility(context);
  input.output.writeLine(JSON.stringify(feasibility));
  if (!feasibility.viable) {
    input.output.writeLine(
      'No inline lane demonstrated basic feasibility; tournament skipped and local activation remains disabled.',
    );
    return ok(2);
  }
  input.output.writeLine(`Viable inline lanes: ${feasibility.viableCellIds.join(', ')}`);
  if (TOURNAMENT_CORPUS_LABEL_AUDIT_STATUS === 'pending') {
    input.output.writeLine(
      'Tournament blocked pending independent corpus-label agreement; local activation remains disabled.',
    );
    return ok(2);
  }
  input.output.writeLine('Running 9 cold probes, 180 calibration runs, and 90 held-out runs.');
  const report = await dependencies.runTournament({
    runner: createLiveBenchmarkRunner(context),
    completedAt: new Date().toISOString(),
  });
  if (!report.qualified || report.selection === undefined) {
    return persistUnqualifiedBenchmark(input, report);
  }
  return persistQualifiedBenchmark(input, context, report, report.selection);
}

async function assertSupportedClaude(
  executable: string,
): Promise<Result<void, BenchmarkCommandError>> {
  const version = await probeVersion(executable);
  if (!version.ok) {
    return failure('claude-version-unavailable', 'Unable to verify the Claude Code version');
  }
  if (!supportsSafeClaudeAsyncOutput(version.value)) {
    return failure(
      'unsupported-claude-version',
      'Claude Code 2.1.202 or newer is required for safe async hook output',
    );
  }
  return ok(undefined);
}

async function ensureBenchmarkAuthentication(
  context: LiveBenchmarkContext,
  input: BenchmarkCommandInput,
): Promise<Result<boolean, BenchmarkCommandError>> {
  const authentication = await assertDedicatedCodexAuthentication({
    userHome: context.userHome,
    sourceEnvironment: context.sourceEnvironment,
    codexExecutable: context.executables.codex,
  });
  if (authentication.ok) {
    return ok(true);
  }
  const layout = await ensureReviewRuntimeLayout({
    userHome: context.userHome,
    mechanism: 'inline',
  });
  if (!layout.ok) {
    return failure('runtime-layout-failed', 'Unable to prepare the dedicated Codex runtime');
  }
  input.output.writeErrorLine('Dedicated Codex hook authentication is required. Run:');
  input.output.writeErrorLine(
    `HOME=${quote(layout.value.homeDirectory)} CODEX_HOME=${quote(layout.value.codexHome)} ` +
      `codex -c ${quote('cli_auth_credentials_store="file"')} login`,
  );
  return ok(false);
}

async function persistUnqualifiedBenchmark(
  input: BenchmarkCommandInput,
  report: TournamentReport,
): Promise<Result<number, BenchmarkCommandError>> {
  const written = await writeUnqualifiedBenchmarkState({ projectRoot: input.projectRoot, report });
  if (!written.ok) {
    return failure('benchmark-state-write-failed', 'Unable to write benchmark report');
  }
  input.output.writeLine('No candidate qualified; local activation remains disabled.');
  return ok(2);
}

async function persistQualifiedBenchmark(
  input: BenchmarkCommandInput,
  context: LiveBenchmarkContext,
  report: TournamentReport,
  selection: TournamentSelection,
): Promise<Result<number, BenchmarkCommandError>> {
  const fingerprint = await fingerprintTournamentCell(context, selection.winner.cell.id);
  if (!fingerprint.ok) {
    return failure('fingerprint-failed', 'Unable to fingerprint the qualified benchmark runtime');
  }
  const executables = await captureRuntimeExecutablePins(context.executables);
  if (!executables.ok) {
    return failure('runtime-pin-failed', 'Unable to pin the qualified benchmark executables');
  }
  const deployment = await deployAdapterBundle({
    projectRoot: input.projectRoot,
    userHome: context.userHome,
    expectedSha256: fingerprint.value.adapterBuildSha256,
  });
  if (!deployment.ok) {
    return failure('adapter-deployment-failed', 'Unable to deploy the private hook adapter');
  }
  const written = await writeQualifiedBenchmarkState({
    projectRoot: input.projectRoot,
    report,
    winner: selection.winner,
    fingerprint: fingerprint.value,
    executables: executables.value,
    deployment: deployment.value,
  });
  if (!written.ok) {
    return failure('benchmark-state-write-failed', 'Unable to write qualified benchmark state');
  }
  input.output.writeLine(`Qualified candidate: ${selection.winner.cell.id}`);
  input.output.writeLine('Run the enable command to install the local Claude hook.');
  return ok(0);
}

function failure(
  kind: BenchmarkCommandError['kind'],
  message: string,
): Result<never, BenchmarkCommandError> {
  return err({ kind, message });
}

function quote(value: string): string {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}
