import { execFileSync } from 'node:child_process';

import { resolveTrustedGit } from '../core/trusted-git.js';
import { type StagedBundle } from './types.js';

const STAGED_PATCH_BUFFER_BYTES = 32 * 1024 * 1024;
/** Project bound for Git's exhaustive O(N^2) rename/copy search in fingerprint patches. */
const STAGED_PATCH_RENAME_LIMIT = 1_000;

/**
 * Input for the intent-scoped staged-bundle read.
 *
 * `pathspec` is a non-empty tuple: the scope of the read MUST be declared
 * and MUST contain at least one path. The caller is expected to pass the
 * owning commit-queue intent's `files` field so that the staged read
 * returns content for those files only, independent of any concurrent peer
 * staging activity in the shared git index. Every changed tree endpoint
 * belongs in that tuple: a move therefore declares both its deleted source
 * and its added destination. The compile-time non-empty constraint prevents
 * the silent fallback to whole-index reading that would occur if
 * `git diff --cached -- ` were invoked with an empty pathspec list.
 *
 * `gitRoot` is the root of the INVOKING git worktree — never the
 * coordination home (F-138). Staged reads must see the index of the
 * worktree the agent staged in; from a linked worktree the primary
 * checkout's index is a different (typically empty) index entirely.
 *
 * `runGit` is an injection seam for unit tests; production callers omit
 * it and the default real-git invocation runs.
 */
export interface GetStagedBundleInput {
  readonly gitRoot: string;
  readonly pathspec: readonly [string, ...string[]];
  readonly runGit?: (args: readonly string[]) => string;
}

/**
 * Read the staged git bundle scoped to a declared pathspec.
 *
 * Each underlying git invocation appends `--` and the pathspec entries
 * so git filters the staged diff and the worktree short-status to the
 * intent's declared file set. Out-of-scope staged content authored by
 * peers does not appear in the returned bundle.
 *
 * Identity reads disable inferred rename presentation so a move remains
 * the deleted source plus added destination that Git commits. The binary
 * patch requests rename compaction with Git's documented 50% similarity
 * threshold and a fixed bound on exhaustive rename detection. This makes
 * rename policy independent of ambient settings such as `diff.renames` and
 * `diff.renameLimit`; eligible renames retain compact representation when
 * Git detects them within that policy.
 *
 * @see https://git-scm.com/docs/git-diff
 */
export function getStagedBundle(input: GetStagedBundleInput): StagedBundle {
  const runGitBound = input.runGit ?? ((args) => runGit(input.gitRoot, args));
  const pathspecArgs = ['--', ...input.pathspec];
  return {
    stagedNameOnly: runGitBound([
      'diff',
      '--cached',
      '--no-renames',
      '--name-only',
      ...pathspecArgs,
    ]),
    stagedNameStatus: runGitBound([
      'diff',
      '--cached',
      '--no-renames',
      '--name-status',
      ...pathspecArgs,
    ]),
    stagedPatch: runGitBound([
      'diff',
      '--cached',
      '--find-renames=50%',
      `-l${STAGED_PATCH_RENAME_LIMIT}`,
      '--full-index',
      '--binary',
      ...pathspecArgs,
    ]),
    worktreeShortStatus: runGitBound(['status', '--short', ...pathspecArgs]),
  };
}

function runGit(gitRoot: string, args: readonly string[]): string {
  return execFileSync(resolveTrustedGit(), args, {
    cwd: gitRoot,
    encoding: 'utf8',
    maxBuffer: STAGED_PATCH_BUFFER_BYTES,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
