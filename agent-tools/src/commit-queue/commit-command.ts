/**
 * CLI dispatch for the `commit-queue commit` workflow command.
 *
 * Kept separate from `cli.ts` so the dispatch function and its result
 * formatter do not push the top-level command-router past its
 * file-size / complexity budget. The workflow runner is dependency-
 * injected via `CommitQueueCliInput.commitWorkflow` so unit tests
 * exercise the dispatch shape without spawning real sub-processes.
 *
 * Advisory polarity (PDR-053 / ADR-176) is preserved by surfacing the
 * advisory orchestrator's exit code as INFORMATION on stderr after a
 * successful commit — never as a blocking verdict. The blocking
 * authority remains `.husky/pre-commit` + `.husky/commit-msg`.
 */

import { requireOption } from './args.js';
import { runCommitWorkflowRuntime } from './commit-workflow-runtime.js';
import {
  type CommitQueueCliInput,
  type CommitQueueCliOptions,
  type CommitWorkflowCliResult,
  type CommitWorkflowCliRunner,
} from './types.js';

/**
 * Input expected by the commit-command dispatcher.
 */
export interface CommitCommandInput {
  readonly registryPath: string;
  readonly options: CommitQueueCliOptions;
  readonly input: CommitQueueCliInput;
}

/**
 * Dispatch the `commit` CLI command: parse args, invoke the workflow
 * runner, and translate the workflow result into a CLI exit code.
 */
export async function runCommitCommand(input: CommitCommandInput): Promise<number> {
  const intentId = requireOption(input.options, 'intent-id');
  const messageFilePath = requireOption(input.options, 'message-file');
  const runner: CommitWorkflowCliRunner = input.input.commitWorkflow ?? runCommitWorkflowRuntime;

  const result = await runner({
    intentId,
    messageFilePath,
    registryPath: input.registryPath,
    repoRoot: input.input.repoRoot,
  });

  return writeCommitCommandResult(result, input.input);
}

function writeCommitCommandResult(
  result: CommitWorkflowCliResult,
  cliInput: CommitQueueCliInput,
): number {
  const stdout = cliInput.stdout ?? process.stdout;
  const stderr = cliInput.stderr ?? process.stderr;

  if (result.ok) {
    stdout.write(`${result.sha}\n`);
    if (result.advisoryExitCode !== 0) {
      stderr.write(
        `commit landed at ${result.sha} (intent ${result.intentId}); advisory orchestrator exit ${result.advisoryExitCode} — read, route, and act per the substance-led path.\n`,
      );
    }
    return 0;
  }

  stderr.write(`commit-workflow ${result.stage} failure: ${result.reason}\n`);
  return 1;
}
