/**
 * Runtime wiring for the commit-workflow CLI command.
 *
 * The pure orchestrator at `commit-workflow.ts` is dependency-injected
 * so it can be exercised in unit tests without real sub-processes. This
 * file binds the real `spawn` + `git` + `fs` dependencies the CLI uses
 * at runtime, and keeps cli.ts focused on command dispatch.
 *
 * Advisory polarity is preserved by construction: the advisory
 * orchestrator's stdout/stderr stream through to the caller's terminal
 * via `stdio: 'inherit'` (parent stdio binding), and the workflow does
 * not change its path on non-zero advisory exit. The blocking authority
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
import { runInheritedProcess } from './process.js';
import { readRegistry, updateRegistry } from './registry.js';

const ADVISORY_BANNER = '[ADVISORY ONLY — NOT A COMMIT GATE]';

/**
 * Input for the runtime commit-workflow runner.
 */
export interface CommitWorkflowRuntimeInput {
  readonly intentId: string;
  readonly messageFilePath: string;
  readonly registryPath: string;
  readonly repoRoot: string;
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
      getStagedBundle({ repoRoot: input.repoRoot, pathspec: scopeInput.pathspec }),
    runAdvisoryOrchestrator: () => runAdvisoryOrchestrator(input),
    runGitCommit: (scopeInput) =>
      runGitCommit({
        intentId: input.intentId,
        messageFilePath: input.messageFilePath,
        registryPath: input.registryPath,
        repoRoot: input.repoRoot,
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
  return runInheritedProcess({
    command: 'pnpm',
    args: ['agent-tools:check-commit-skill-advisories', '-F', input.messageFilePath],
    cwd: input.repoRoot,
  });
}

async function runGitCommit(
  input: CommitWorkflowRuntimeInput & { readonly pathspec: CommitWorkflowPathspec },
): Promise<CommitWorkflowGitCommitResult> {
  const commit = await runInheritedProcess({
    command: 'git',
    args: ['commit', '-F', input.messageFilePath, '--', ...input.pathspec],
    cwd: input.repoRoot,
  });

  if (commit.exitCode !== 0) {
    return commit;
  }

  return { ...commit, sha: readHeadSha(input.repoRoot) };
}
function readHeadSha(repoRoot: string): string {
  return execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
