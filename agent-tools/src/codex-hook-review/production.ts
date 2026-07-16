import { realpath } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import {
  evaluateLocalActivation,
  type ActivationDecision,
  type LocalActivationManifest,
  type RuntimeExecutablePins,
} from './activation.js';
import { readBoundedUtf8 } from './bounded-input.js';
import { createReviewChildEnvironment } from './child-environment.js';
import { createCodexProcessRequest, type ReviewModelConfiguration } from './configuration.js';
import { productionReviewPathInspection } from './file-system.js';
import { scanOutboundPayload } from './gitleaks.js';
import {
  runCodexReviewHook,
  type CodexReviewHookOutput,
  type HookPreparationError,
  type PreparedReview,
  type ReviewChangeCount,
} from './hook-runtime.js';
import { fingerprintInvocationSha256 } from './invocation-fingerprint.js';
import { FileReviewLeaseCoordinator } from './lease.js';
import { readLocalActivationManifest, verifyLocalBenchmarkReport } from './local-state.js';
import { appendReviewMetric } from './metrics.js';
import { type CodexProcessRequest } from './process-runner.js';
import { ensureReviewRuntimeLayout, type ReviewRuntimeLayout } from './review-assets.js';
import { runCodexHookReview } from './runner.js';
import { type CodexReviewOutcome } from './runner.js';
import { verifyAdapterDeployment, verifyRuntimeExecutablePins } from './runtime-integrity.js';
import {
  MODEL_CONFIGURATIONS,
  TOURNAMENT_CELLS,
  type InstructionMechanism,
  type TournamentCellId,
} from './tournament-types.js';

interface ProductionReviewContext {
  readonly layout: ReviewRuntimeLayout;
  readonly modelConfiguration: ReviewModelConfiguration;
  readonly mechanism: InstructionMechanism;
  readonly sourceEnvironment: Readonly<NodeJS.ProcessEnv>;
  readonly codexExecutable: string;
  readonly gitleaksExecutable: string;
}

interface ProductionActivationState {
  readonly decision: ActivationDecision;
  readonly executables?: RuntimeExecutablePins;
  readonly expectedInvocationSha256?: string;
}

/** Bind the pure hook flow to the private local state, scanner, and Codex process adapter. */
export async function runProductionCodexReviewHook(): Promise<CodexReviewHookOutput> {
  const projectRoot = process.env.CLAUDE_PROJECT_DIR;
  if (projectRoot === undefined || !isAbsolute(projectRoot)) {
    return {};
  }
  const sourceEnvironment = process.env;
  const userHome = sourceEnvironment.HOME;
  if (userHome === undefined || !isAbsolute(userHome)) {
    return {};
  }
  const lease = new FileReviewLeaseCoordinator();
  let executablePins: RuntimeExecutablePins | undefined;
  let expectedInvocationSha256: string | undefined;
  return runCodexReviewHook(
    { projectRoot },
    {
      readInput: async () => readBoundedUtf8(process.stdin),
      pathInspection: productionReviewPathInspection,
      lease,
      loadActivationDecision: async (root) => {
        const activation = await loadProductionActivation(root);
        executablePins = activation.executables;
        expectedInvocationSha256 = activation.expectedInvocationSha256;
        return activation.decision;
      },
      prepareReview: async (cellId) =>
        prepareProductionReview(
          cellId,
          userHome,
          sourceEnvironment,
          executablePins,
          expectedInvocationSha256,
        ),
      scanPayload: async ({ payload, context }) =>
        scanOutboundPayload({
          payload,
          isolatedCwd: context.layout.workingDirectory,
          env: createReviewChildEnvironment(context.sourceEnvironment, context.layout),
          executable: context.gitleaksExecutable,
        }),
      review: runProductionReview,
      recordMetric: appendReviewMetric,
      clock: { nowIso: () => new Date().toISOString(), nowMilliseconds: Date.now },
    },
  );
}

async function loadProductionActivation(projectRoot: string): Promise<ProductionActivationState> {
  const manifest = await readLocalActivationManifest(projectRoot);
  if (!manifest.ok) {
    return { decision: { enabled: false, reason: 'manifest-disabled', mismatches: [] } };
  }
  const report = await verifyLocalBenchmarkReport(projectRoot, manifest.value);
  if (!report.ok) {
    return { decision: { enabled: false, reason: 'manifest-disabled', mismatches: [] } };
  }
  if (!(await productionRuntimeCurrent(manifest.value))) {
    return { decision: { enabled: false, reason: 'runtime-drift', mismatches: [] } };
  }
  return {
    decision: evaluateLocalActivation(manifest.value, manifest.value.fingerprint),
    executables: manifest.value.executables,
    expectedInvocationSha256: manifest.value.fingerprint.invocationSha256,
  };
}

async function productionRuntimeCurrent(manifest: LocalActivationManifest): Promise<boolean> {
  const entryPath = process.argv[1];
  if (entryPath === undefined) {
    return false;
  }
  const [deployment, executables, nodePath] = await Promise.all([
    verifyAdapterDeployment(manifest.deployment),
    verifyRuntimeExecutablePins(manifest.executables),
    resolveCurrentNodePath(),
  ]);
  return (
    nodePath.ok &&
    nodePath.value === manifest.executables.node.path &&
    resolve(entryPath) === manifest.deployment.entryPath &&
    deployment.ok &&
    deployment.value &&
    executables.ok &&
    executables.value
  );
}

export async function prepareProductionReview(
  cellId: TournamentCellId,
  userHome: string,
  sourceEnvironment: Readonly<NodeJS.ProcessEnv>,
  executablePins: RuntimeExecutablePins | undefined,
  expectedInvocationSha256: string | undefined,
): Promise<Result<PreparedReview<ProductionReviewContext>, HookPreparationError>> {
  if (executablePins === undefined || expectedInvocationSha256 === undefined) {
    return err({ kind: 'runtime-unavailable' });
  }
  const cell = TOURNAMENT_CELLS.find((candidate) => candidate.id === cellId);
  if (cell === undefined) {
    return err({ kind: 'unknown-cell' });
  }
  const modelConfiguration = MODEL_CONFIGURATIONS.find(
    (candidate) => candidate.id === cell.modelConfigurationId,
  );
  if (modelConfiguration === undefined) {
    return err({ kind: 'unknown-model' });
  }
  const layout = await ensureReviewRuntimeLayout({ userHome, mechanism: cell.mechanism });
  if (!layout.ok) {
    return err({ kind: 'asset-failed' });
  }
  const request = createVerifiedReviewRequest({
    modelConfiguration,
    mechanism: cell.mechanism,
    layout: layout.value,
    sourceEnvironment,
    codexExecutable: executablePins.codex.path,
    expectedInvocationSha256,
  });
  if (!request.ok) {
    return request;
  }
  return ok({
    context: {
      layout: layout.value,
      modelConfiguration,
      mechanism: cell.mechanism,
      sourceEnvironment: request.value.env,
      codexExecutable: executablePins.codex.path,
      gitleaksExecutable: executablePins.gitleaks.path,
    },
    model: modelConfiguration.model,
    mechanism: cell.mechanism,
  });
}

function createVerifiedReviewRequest(input: {
  readonly modelConfiguration: ReviewModelConfiguration;
  readonly mechanism: InstructionMechanism;
  readonly layout: ReviewRuntimeLayout;
  readonly sourceEnvironment: Readonly<NodeJS.ProcessEnv>;
  readonly codexExecutable: string;
  readonly expectedInvocationSha256: string;
}): Result<CodexProcessRequest, HookPreparationError> {
  const request = createCodexProcessRequest({ ...input, payload: '{}' });
  if (!request.ok) {
    return err({ kind: 'runtime-unavailable' });
  }
  const actual = fingerprintInvocationSha256({
    command: request.value.command,
    args: request.value.args,
    cwd: request.value.cwd,
    env: request.value.env,
  });
  return actual === input.expectedInvocationSha256
    ? request
    : err({ kind: 'runtime-invocation-drift' });
}

interface CurrentNodePathError {
  readonly kind: 'node-path-unavailable';
}

async function resolveCurrentNodePath(): Promise<Result<string, CurrentNodePathError>> {
  try {
    return ok(await realpath(process.execPath));
  } catch {
    return err({ kind: 'node-path-unavailable' });
  }
}

async function runProductionReview(input: {
  readonly payload: string;
  readonly changeCount: ReviewChangeCount;
  readonly context: ProductionReviewContext;
}): Promise<CodexReviewOutcome> {
  return runCodexHookReview({
    payload: input.payload,
    changeCount: input.changeCount,
    modelConfiguration: input.context.modelConfiguration,
    mechanism: input.context.mechanism,
    layout: input.context.layout,
    sourceEnvironment: input.context.sourceEnvironment,
    codexExecutable: input.context.codexExecutable,
  });
}
