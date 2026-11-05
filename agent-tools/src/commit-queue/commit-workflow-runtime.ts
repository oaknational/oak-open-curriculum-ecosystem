/**
 * Runtime wiring for the commit-workflow CLI command.
 *
 * The pure orchestrator at `commit-workflow.ts` is dependency-injected
 * so it can be exercised in unit tests without real sub-processes. This
 * file binds the real `spawn` + `git` + `fs` dependencies the CLI uses
 * at runtime, and keeps cli.ts focused on command dispatch.
 *
 * Both children's output is conserved in full (file-capture-and-replay in
 * `runFileBackedChild` — never live Node pipes, which poison the spawned
 * git's hook chain; F-112) and replayed to the command's own stderr
 * writer, never to the process's stdio, so the command's stdout carries
 * only the commit sha. The order there is the run's order: the advisory
 * banner first (ADR-176 §3), then the advisory transcript, captured as
 * one stream in write order, then the inner `git commit`'s transcript.
 *
 * Advisory polarity is preserved by construction: the workflow does not
 * change its path on non-zero advisory exit. The blocking authority
 * remains `.husky/pre-commit` + `.husky/commit-msg`. See PDR-053 and
 * ADR-176.
 */

import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

import {
  runCommitWorkflow,
  type CommitWorkflowDependencies,
  type CommitWorkflowGitCommitResult,
  type CommitWorkflowProcessResult,
  type CommitWorkflowResult,
} from './commit-workflow.js';
import { getStagedBundle } from './git.js';
import { type CommitWorkflowPathspec } from './pathspec.js';
import { runFileBackedChild, textReplaySinks } from '../core/file-backed-child.js';
import { readRegistry, updateRegistry } from './registry.js';
import { type CommitWorkflowRunnerInput } from './types.js';

const ADVISORY_BANNER = '[ADVISORY ONLY — NOT A COMMIT GATE]';

/**
 * Real-runtime entry that builds spawn-based dependencies and runs the
 * pure workflow orchestrator.
 */
export async function runCommitWorkflowRuntime(
  input: CommitWorkflowRunnerInput,
): Promise<CommitWorkflowResult> {
  await assertMessageFileReadable(input.messageFilePath);

  const deps: CommitWorkflowDependencies = {
    readRegistry: () => readRegistry(input.registryPath),
    transformRegistry: (transform) => updateRegistry(input.registryPath, transform),
    getStagedBundle: (scopeInput) =>
      getStagedBundle({ gitRoot: input.gitRoot, pathspec: scopeInput.pathspec }),
    runAdvisoryOrchestrator: () => runAdvisoryOrchestrator(input),
    runGitCommit: (scopeInput) =>
      runGitCommit({
        messageFilePath: input.messageFilePath,
        gitRoot: input.gitRoot,
        stderr: input.stderr,
        pathspec: scopeInput.pathspec,
      }),
    nowIso: () => new Date().toISOString(),
  };

  return runCommitWorkflow({ intentId: input.intentId, deps });
}

async function assertMessageFileReadable(messageFilePath: string): Promise<void> {
  const content = await readFile(messageFilePath, 'utf8');
  if (content.trim().length === 0) {
    throw new Error(`commit message file is empty: ${messageFilePath}`);
  }
}

async function runAdvisoryOrchestrator(
  input: CommitWorkflowRunnerInput,
): Promise<CommitWorkflowProcessResult> {
  input.stderr.write(`${ADVISORY_BANNER}\n`);
  return runFileBackedChild({
    command: 'pnpm',
    args: ['agent-tools:check-commit-skill-advisories', '-F', input.messageFilePath],
    cwd: input.gitRoot,
    combinedOutput: true,
    replaySinks: textReplaySinks(input.stderr),
  });
}

async function runGitCommit(
  input: Pick<CommitWorkflowRunnerInput, 'messageFilePath' | 'gitRoot' | 'stderr'> & {
    readonly pathspec: CommitWorkflowPathspec;
  },
): Promise<CommitWorkflowGitCommitResult> {
  const commit = await runFileBackedChild({
    command: 'git',
    args: ['commit', '-F', input.messageFilePath, '--', ...input.pathspec],
    cwd: input.gitRoot,
    // Separate captures, both replayed to stderr: the workflow builds its
    // abandon note from the result's stderr, where git writes hook output.
    replaySinks: textReplaySinks(input.stderr),
  });

  if (commit.exitCode !== 0) {
    return commit;
  }

  return { ...commit, sha: readHeadSha(input.gitRoot) };
}
function readHeadSha(gitRoot: string): string {
  return execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: gitRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
