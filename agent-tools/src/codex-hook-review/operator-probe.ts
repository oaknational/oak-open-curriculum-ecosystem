import { err, ok, type Result } from '@oaknational/result';

import {
  assertDedicatedCodexAuthentication,
  createLiveBenchmarkRunner,
  type LiveBenchmarkContext,
} from './benchmark-live.js';
import {
  runFeasibilityProbe,
  type CodexReviewFeasibilityProbeReport,
} from './feasibility-probe.js';
import { deactivateHookReviewState } from './operator-deactivation.js';
import { type OperatorOwnedError } from './operator-runtime.js';

interface ProbeCommandInput {
  readonly projectRoot: string;
  readonly output: {
    readonly writeLine: (message: string) => void;
  };
}

export interface ProbeCommandError {
  readonly kind: 'probe-authentication-unavailable' | 'probe-deactivation-failed';
  readonly message: string;
}

export interface ProbeCommandDependencies {
  readonly ensureAuthentication: (context: LiveBenchmarkContext) => Promise<boolean>;
  readonly deactivate: (projectRoot: string) => Promise<Result<void, OperatorOwnedError>>;
  readonly runProbe: (context: LiveBenchmarkContext) => Promise<CodexReviewFeasibilityProbeReport>;
}

const productionProbeCommandDependencies: ProbeCommandDependencies = {
  ensureAuthentication: async (context) =>
    (
      await assertDedicatedCodexAuthentication({
        userHome: context.userHome,
        sourceEnvironment: context.sourceEnvironment,
        codexExecutable: context.executables.codex,
      })
    ).ok,
  deactivate: (projectRoot) => deactivateHookReviewState(projectRoot, 'clear'),
  runProbe: (context) =>
    runFeasibilityProbe({
      runner: createLiveBenchmarkRunner(context),
      completedAt: new Date().toISOString(),
    }),
};

/** Run the six-call learning kernel without producing qualification state. */
export async function runProbeCommand(
  input: ProbeCommandInput,
  context: LiveBenchmarkContext,
  dependencies: ProbeCommandDependencies = productionProbeCommandDependencies,
): Promise<Result<number, ProbeCommandError>> {
  if (!(await dependencies.ensureAuthentication(context))) {
    return failure(
      'probe-authentication-unavailable',
      'Dedicated Codex hook authentication is unavailable',
    );
  }
  const deactivated = await dependencies.deactivate(input.projectRoot);
  if (!deactivated.ok) {
    return failure(
      'probe-deactivation-failed',
      'Unable to deactivate the previous hook before probing',
    );
  }
  input.output.writeLine('Running 6 non-qualifying inline feasibility calls.');
  const report = await dependencies.runProbe(context);
  input.output.writeLine(JSON.stringify(report));
  if (!report.viable) {
    input.output.writeLine('No inline lane demonstrated basic feasibility; stop before benchmark.');
    return ok(2);
  }
  input.output.writeLine(`Viable inline lanes: ${report.viableCellIds.join(', ')}`);
  return ok(0);
}

function failure(
  kind: ProbeCommandError['kind'],
  message: string,
): Result<never, ProbeCommandError> {
  return err({ kind, message });
}
