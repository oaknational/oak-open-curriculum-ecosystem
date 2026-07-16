import { isAbsolute, join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import {
  type BenchmarkFailureKind,
  type BenchmarkReviewRunner,
  type BenchmarkRunOutcome,
} from './benchmark.js';
import { createReviewChildEnvironment } from './child-environment.js';
import { createCodexProcessRequest, type ReviewModelConfiguration } from './configuration.js';
import { computeRuntimeFingerprint, type FingerprintExecutables } from './fingerprint.js';
import { type RuntimeFingerprint } from './activation.js';
import { scanOutboundPayload } from './gitleaks.js';
import { readGuardedRegularFile } from './guarded-local-io.js';
import { productionCodexProcessRunner, type CodexProcessRunner } from './process-runner.js';
import { ensureReviewRuntimeLayout, type ReviewRuntimeLayout } from './review-assets.js';
import { runCodexHookReview, type CodexReviewFailureReason } from './runner.js';
import {
  MODEL_CONFIGURATIONS,
  TOURNAMENT_CELLS,
  type TournamentCellId,
} from './tournament-types.js';

export interface LiveBenchmarkContext {
  readonly projectRoot: string;
  readonly userHome: string;
  readonly sourceEnvironment: Readonly<NodeJS.ProcessEnv>;
  readonly executables: FingerprintExecutables;
}

export interface BenchmarkLiveError {
  readonly kind:
    | 'authentication-missing'
    | 'runtime-layout-failed'
    | 'unknown-tournament-cell'
    | 'unknown-model-configuration'
    | 'invalid-fingerprint-invocation'
    | 'fingerprint-failed';
}

export interface DedicatedCodexAuthenticationInput {
  readonly userHome: string;
  readonly sourceEnvironment: Readonly<NodeJS.ProcessEnv>;
  readonly codexExecutable: string;
  readonly processRunner?: CodexProcessRunner;
}

const MAX_AUTH_FILE_BYTES = 1024 * 1024;

/** Bind the pure tournament to the scanner and one fresh Codex process per sample. */
export function createLiveBenchmarkRunner(context: LiveBenchmarkContext): BenchmarkReviewRunner {
  return { run: (request) => runLiveBenchmarkReview(context, request) };
}

async function runLiveBenchmarkReview(
  context: LiveBenchmarkContext,
  request: Parameters<BenchmarkReviewRunner['run']>[0],
): Promise<BenchmarkRunOutcome> {
  const startedAt = process.hrtime.bigint();
  const layout = await ensureReviewRuntimeLayout({
    userHome: context.userHome,
    mechanism: request.cell.mechanism,
  });
  if (!layout.ok) {
    return failed('process-failure', startedAt);
  }
  const environment = createReviewChildEnvironment(context.sourceEnvironment, layout.value);
  const scan = await scanOutboundPayload({
    payload: request.payload,
    isolatedCwd: layout.value.workingDirectory,
    env: environment,
    executable: context.executables.gitleaks,
  });
  if (scan.kind !== 'clean') {
    return failed('process-failure', startedAt);
  }
  const modelConfiguration = findModelConfiguration(request.cell.modelConfigurationId);
  if (!modelConfiguration.ok) {
    return failed('process-failure', startedAt);
  }
  const outcome = await runCodexHookReview({
    payload: request.payload,
    changeCount: request.changeCount,
    modelConfiguration: modelConfiguration.value,
    mechanism: request.cell.mechanism,
    layout: layout.value,
    sourceEnvironment: context.sourceEnvironment,
    codexExecutable: context.executables.codex,
  });
  if (outcome.kind === 'failed') {
    return failed(mapFailure(outcome.reason), startedAt);
  }
  return {
    kind: 'completed',
    decision: outcome.decision,
    durationMs: elapsedMilliseconds(startedAt),
    reviewerDurationMs: outcome.durationMs,
    reasoningItemCount: outcome.reasoningItemCount,
    usage: outcome.usage,
  };
}

/** Fail before a 279-call benchmark if the dedicated Codex home has not been authenticated. */
export async function assertDedicatedCodexAuthentication(
  input: DedicatedCodexAuthenticationInput,
): Promise<Result<void, BenchmarkLiveError>> {
  if (!isAbsolute(input.codexExecutable)) {
    return err({ kind: 'authentication-missing' });
  }
  const layout = await ensureReviewRuntimeLayout({ userHome: input.userHome, mechanism: 'inline' });
  if (!layout.ok) {
    return err({ kind: 'runtime-layout-failed' });
  }
  const auth = await readGuardedRegularFile(
    join(layout.value.codexHome, 'auth.json'),
    MAX_AUTH_FILE_BYTES,
  );
  if (!auth.ok || auth.value.content.length === 0 || (auth.value.stats.mode & 0o077) !== 0) {
    return err({ kind: 'authentication-missing' });
  }
  const status = await runAuthenticationStatus(input, layout.value);
  return status.kind === 'completed' ? ok(undefined) : err({ kind: 'authentication-missing' });
}

async function runAuthenticationStatus(
  input: DedicatedCodexAuthenticationInput,
  layout: ReviewRuntimeLayout,
) {
  try {
    return await (input.processRunner ?? productionCodexProcessRunner).run({
      command: input.codexExecutable,
      args: ['-c', 'cli_auth_credentials_store="file"', 'login', 'status'],
      cwd: layout.workingDirectory,
      env: createReviewChildEnvironment(input.sourceEnvironment, layout),
      stdin: '',
    });
  } catch {
    return { kind: 'failed', reason: 'process-error', durationMs: 0 } as const;
  }
}

/** Recompute the activation fingerprint for one selected tournament cell. */
export async function fingerprintTournamentCell(
  context: LiveBenchmarkContext,
  selectedCellId: TournamentCellId,
): Promise<Result<RuntimeFingerprint, BenchmarkLiveError>> {
  const cell = TOURNAMENT_CELLS.find((candidate) => candidate.id === selectedCellId);
  if (cell === undefined) {
    return err({ kind: 'unknown-tournament-cell' });
  }
  const layout = await ensureReviewRuntimeLayout({
    userHome: context.userHome,
    mechanism: cell.mechanism,
  });
  if (!layout.ok) {
    return err({ kind: 'runtime-layout-failed' });
  }
  const modelConfiguration = findModelConfiguration(cell.modelConfigurationId);
  if (!modelConfiguration.ok) {
    return modelConfiguration;
  }
  const request = createCodexProcessRequest({
    payload: '{}',
    modelConfiguration: modelConfiguration.value,
    mechanism: cell.mechanism,
    layout: layout.value,
    sourceEnvironment: context.sourceEnvironment,
    codexExecutable: context.executables.codex,
  });
  if (!request.ok) {
    return err({ kind: 'invalid-fingerprint-invocation' });
  }
  const fingerprint = await computeRuntimeFingerprint({
    projectRoot: context.projectRoot,
    selectedCellId,
    layout: layout.value,
    invocation: {
      command: request.value.command,
      args: request.value.args,
      cwd: request.value.cwd,
      env: request.value.env,
    },
    executables: context.executables,
  });
  return fingerprint.ok ? fingerprint : err({ kind: 'fingerprint-failed' });
}

function findModelConfiguration(id: string): Result<ReviewModelConfiguration, BenchmarkLiveError> {
  const configuration = MODEL_CONFIGURATIONS.find((candidate) => candidate.id === id);
  if (configuration === undefined) {
    return err({ kind: 'unknown-model-configuration' });
  }
  return ok(configuration);
}

function mapFailure(reason: CodexReviewFailureReason): BenchmarkFailureKind {
  if (reason === 'hard-timeout') {
    return 'hard-timeout';
  }
  if (reason === 'schema-failure') {
    return 'schema-failure';
  }
  if (reason === 'orphan-event') {
    return 'orphan-event';
  }
  if (reason === 'dynamic-tool-event') {
    return 'dynamic-tool-event';
  }
  if (reason === 'unknown-event') {
    return 'unknown-event';
  }
  return 'process-failure';
}

function failed(reason: BenchmarkFailureKind, startedAt: bigint): BenchmarkRunOutcome {
  return { kind: 'failed', reason, durationMs: elapsedMilliseconds(startedAt) };
}

function elapsedMilliseconds(startedAt: bigint): number {
  return Number((process.hrtime.bigint() - startedAt) / 1_000_000n);
}
