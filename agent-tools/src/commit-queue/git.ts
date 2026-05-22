import { execFileSync } from 'node:child_process';

import { type StagedBundle } from './types.js';

const STAGED_PATCH_BUFFER_BYTES = 32 * 1024 * 1024;

/**
 * Input for the intent-scoped staged-bundle read.
 *
 * `pathspec` is mandatory: the scope of the read MUST be declared. The
 * caller is expected to pass the owning commit-queue intent's `files`
 * field so that the staged read returns content for those files only,
 * independent of any concurrent peer staging activity in the shared git
 * index.
 *
 * `runGit` is an injection seam for unit tests; production callers omit
 * it and the default real-git invocation runs.
 */
export interface ScopedStagedBundleInput {
  readonly repoRoot: string;
  readonly pathspec: readonly string[];
  readonly runGit?: (args: readonly string[]) => string;
}

/**
 * Read the staged git bundle used by commit-queue verification.
 *
 * Whole-index read; retained for any caller that has not yet adopted the
 * intent-scoped variant. Cycles 1.2 and 1.3 of the
 * commit-queue-intent-scope-discipline plan migrate the remaining
 * callers; this function retires when those cycles land.
 */
export function getStagedBundle(repoRoot: string): StagedBundle {
  return {
    stagedNameOnly: runGit(repoRoot, ['diff', '--cached', '--name-only']),
    stagedNameStatus: runGit(repoRoot, ['diff', '--cached', '--name-status']),
    stagedPatch: runGit(repoRoot, ['diff', '--cached', '--full-index', '--binary']),
    worktreeShortStatus: runGit(repoRoot, ['status', '--short']),
  };
}

/**
 * Read the staged git bundle scoped to a declared pathspec.
 *
 * Each underlying git invocation appends `--` and the pathspec entries
 * so git filters the staged diff and the worktree short-status to the
 * intent's declared file set. Out-of-scope staged content authored by
 * peers does not appear in the returned bundle.
 */
export function getStagedBundleScoped(input: ScopedStagedBundleInput): StagedBundle {
  const runGitBound = input.runGit ?? ((args) => runGit(input.repoRoot, args));
  const pathspecArgs = ['--', ...input.pathspec];
  return {
    stagedNameOnly: runGitBound(['diff', '--cached', '--name-only', ...pathspecArgs]),
    stagedNameStatus: runGitBound(['diff', '--cached', '--name-status', ...pathspecArgs]),
    stagedPatch: runGitBound(['diff', '--cached', '--full-index', '--binary', ...pathspecArgs]),
    worktreeShortStatus: runGitBound(['status', '--short', ...pathspecArgs]),
  };
}

function runGit(repoRoot: string, args: readonly string[]): string {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: STAGED_PATCH_BUFFER_BYTES,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
