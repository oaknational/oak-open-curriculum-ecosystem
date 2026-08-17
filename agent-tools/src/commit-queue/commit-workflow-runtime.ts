/**
 * Runtime wiring for the commit-workflow CLI command.
 *
 * The pure orchestrator at `commit-workflow.ts` is dependency-injected
 * so it can be exercised in unit tests without real sub-processes. This
 * file binds the real `spawn` + `git` + `fs` dependencies the CLI uses
 * at runtime, and keeps cli.ts focused on command dispatch.
 *
 * Advisory polarity is preserved by construction: the advisory
 * orchestrator's stdout/stderr are conserved in full and replayed to
 * the caller's terminal on completion (file-capture-and-replay in
 * `runFileBackedChild` — never live Node pipes, which poison the
 * spawned git's hook chain; F-112), and the workflow does not change
 * its path on non-zero advisory exit. The blocking authority remains
 * `.husky/pre-commit` + `.husky/commit-msg`. See PDR-053 and ADR-176.
 */

import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

import { resolveTrustedGit } from '../core/trusted-git.js';
import { resolvePnpm } from '../spawn/pnpm-path.js';
import {
  runCommitWorkflow,
  type CommitWorkflowDependencies,
  type CommitWorkflowGitCommitResult,
  type CommitWorkflowProcessResult,
  type CommitWorkflowResult,
} from './commit-workflow.js';
import { getStagedBundle } from './git.js';
import { type CommitWorkflowPathspec } from './pathspec.js';
import { runFileBackedChild } from '../core/file-backed-child.js';
import { readRegistry, updateRegistry } from './registry.js';

const ADVISORY_BANNER = '[ADVISORY ONLY — NOT A COMMIT GATE]';

/**
 * Input for the runtime commit-workflow runner.
 *
 * `registryPath` anchors registry reads/writes at the coordination home;
 * `gitRoot` is the root of the INVOKING git worktree, and every git-side
 * operation (staged reads, the advisory orchestrator, the inner
 * `git commit`, the HEAD read) runs against it — never against the
 * coordination home (F-138).
 */
export interface CommitWorkflowRuntimeInput {
  readonly intentId: string;
  readonly messageFilePath: string;
  readonly registryPath: string;
  readonly gitRoot: string;
}

/**
 * Real-runtime entry that builds spawn-based dependencies and runs the
 * pure workflow orchestrator.
 */
export async function runCommitWorkflowRuntime(
  input: CommitWorkflowRuntimeInput,
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
        intentId: input.intentId,
        messageFilePath: input.messageFilePath,
        registryPath: input.registryPath,
        gitRoot: input.gitRoot,
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
  input: CommitWorkflowRuntimeInput,
): Promise<CommitWorkflowProcessResult> {
  process.stderr.write(`${ADVISORY_BANNER}\n`);
  // Bare 'pnpm' never reaches spawn (the agent-tools invariant, and on
  // Windows a shell-less by-name spawn cannot resolve the .cmd shim at all).
  const pnpm = resolvePnpm(process.env);
  if (!pnpm.ok) {
    return { exitCode: 1, stderr: pnpm.error.message };
  }
  return runFileBackedChild({
    command: pnpm.value.file,
    args: [
      ...pnpm.value.leadingArgs,
      'agent-tools:check-commit-skill-advisories',
      '-F',
      input.messageFilePath,
    ],
    cwd: input.gitRoot,
    env: pnpm.value.env,
  });
}

async function runGitCommit(
  input: CommitWorkflowRuntimeInput & { readonly pathspec: CommitWorkflowPathspec },
): Promise<CommitWorkflowGitCommitResult> {
  const commit = await runFileBackedChild({
    command: resolveTrustedGit(),
    args: ['commit', '-F', input.messageFilePath, '--', ...input.pathspec],
    cwd: input.gitRoot,
  });

  if (commit.exitCode !== 0) {
    return commit;
  }

  return { ...commit, sha: readHeadSha(input.gitRoot) };
}
function readHeadSha(gitRoot: string): string {
  return execFileSync(resolveTrustedGit(), ['rev-parse', 'HEAD'], {
    cwd: gitRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
