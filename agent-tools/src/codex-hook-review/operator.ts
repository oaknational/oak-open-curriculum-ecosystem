import { err, ok, type Result } from '@oaknational/result';

import { runBenchmarkCommand, type BenchmarkCommandError } from './operator-benchmark.js';
import { enableHookReviewOperator } from './operator-enable.js';
import { runProbeCommand, type ProbeCommandError } from './operator-probe.js';
import { createOperatorContext, type OperatorOwnedError } from './operator-runtime.js';
import { deactivateHookReviewState } from './operator-deactivation.js';
import { statusHookReviewOperator } from './operator-status.js';

const CODEX_HOOK_REVIEW_COMMANDS = ['probe', 'benchmark', 'enable', 'status', 'disable'] as const;
export type CodexHookReviewCommand = (typeof CODEX_HOOK_REVIEW_COMMANDS)[number];

export interface OperatorOutput {
  readonly writeLine: (message: string) => void;
  readonly writeErrorLine: (message: string) => void;
}

type OperatorCommandError = OperatorOwnedError | ProbeCommandError | BenchmarkCommandError;
type OperatorCommandResult = Result<number, OperatorCommandError>;

export function parseOperatorCommand(args: readonly string[]): CodexHookReviewCommand | undefined {
  if (args.length !== 1) {
    return undefined;
  }
  return CODEX_HOOK_REVIEW_COMMANDS.find((command) => command === args[0]);
}

/** Execute one explicit local-only operator command. */
export async function runCodexHookReviewOperator(input: {
  readonly args: readonly string[];
  readonly projectRoot: string;
  readonly environment: Readonly<NodeJS.ProcessEnv>;
  readonly output: OperatorOutput;
}): Promise<number> {
  const command = parseOperatorCommand(input.args);
  if (command === undefined) {
    input.output.writeErrorLine(
      'Usage: pnpm agent-tools:codex-hook-review probe|benchmark|enable|status|disable',
    );
    return 1;
  }
  try {
    const result = await runOperatorCommand(command, input);
    if (result.ok) {
      return result.value;
    }
    input.output.writeErrorLine(`Codex hook review command failed: ${result.error.message}`);
    return 1;
  } catch {
    input.output.writeErrorLine(toSafeOperatorError());
    return 1;
  }
}

type OperatorInput = Parameters<typeof runCodexHookReviewOperator>[0];

async function runOperatorCommand(
  command: CodexHookReviewCommand,
  input: OperatorInput,
): Promise<OperatorCommandResult> {
  if (command === 'probe' || command === 'benchmark') {
    const context = await createOperatorContext(input);
    if (!context.ok) {
      return failure('operator-context-failed', 'Unable to locate required review executables');
    }
    return command === 'probe'
      ? runProbeCommand(input, context.value)
      : runBenchmarkCommand(input, context.value);
  }
  if (command === 'enable') {
    return enableHookReviewOperator(input);
  }
  if (command === 'status') {
    return statusHookReviewOperator(input);
  }
  return disable(input);
}

async function disable(input: OperatorInput): Promise<OperatorCommandResult> {
  const deactivated = await deactivateHookReviewState(input.projectRoot, 'disable');
  if (!deactivated.ok) {
    return deactivated;
  }
  input.output.writeLine('Local PostToolBatch review disabled.');
  return ok(0);
}

function failure(
  kind: OperatorOwnedError['kind'],
  message: string,
): Result<never, OperatorOwnedError> {
  return err({ kind, message });
}

function toSafeOperatorError(): string {
  return 'Codex hook review command failed unexpectedly';
}
