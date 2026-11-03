import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import { gitFailure, runGit, type RetireGit } from './retire-git-run.js';
import { parseWorktrees, type WorktreeEntry } from './retire-parse.js';

/**
 * Whether any worktree is using a branch `merge-bot retire` was asked to
 * delete. `update-ref -d` deletes a branch that is checked out, or that a
 * rebase or bisect in some worktree still names, where `git branch -d` would
 * refuse; so the command reads git's own state for every worktree and refuses
 * these itself.
 */

const WORKTREE_STATE_PATHS = [
  'rebase-merge/head-name',
  'rebase-apply/head-name',
  'BISECT_START',
  'rebase-merge/update-refs',
] as const;

/**
 * Reads a file's text: undefined when it does not exist, a failure when it
 * exists and cannot be read, or when a directory on its path is a file
 * (ENOTDIR). An unreadable state file is never read as "not in use": that
 * would let a delete through on a question left unanswered.
 */
type ReadOptionalFile = (path: string) => Promise<Result<string | undefined, Error>>;

/** A path's last part, with no control or format characters: a report can be pasted into a tracked record. */
const nameOf = (path: string): string => printable(basename(path));

/** The real state-file reader: a missing file is undefined; any other failure is a failure. */
const readOptionalFile: ReadOptionalFile = async (path) => {
  try {
    return ok(await readFile(path, 'utf8'));
  } catch (cause) {
    const code = cause instanceof Error && 'code' in cause ? cause.code : undefined;
    if (code === 'ENOENT') {
      return ok(undefined);
    }
    // The basename and the code only: a node error message carries the full path.
    return err(new Error(`reading worktree state file ${nameOf(path)}: ${String(code)}`));
  }
};

/**
 * The worktrees (by basename) using `branch`: checked out there, or named by
 * git's own rebase or bisect state in that worktree's private git directory.
 * `update-ref -d` deletes a branch in any of these states, where
 * `git branch -d` would refuse, so the command refuses them itself.
 */
export async function worktreesUsing(
  retire: RetireGit,
  branch: string,
): Promise<Result<readonly string[], Error>> {
  const listed = await runGit(retire, ['worktree', 'list', '--porcelain']);
  if (listed.status !== 0) {
    return err(gitFailure('listing the worktrees', listed));
  }
  const using: string[] = [];
  for (const entry of parseWorktrees(listed.stdout)) {
    const inState =
      entry.branch === `refs/heads/${branch}`
        ? ok(true)
        : await stateOfListedWorktree(retire, entry, branch);
    if (!inState.ok) {
      return inState;
    }
    if (inState.value) {
      using.push(nameOf(entry.path));
    }
  }
  return ok(using);
}

/**
 * Whether a listed worktree's rebase or bisect state names the branch. A
 * worktree that cannot be asked, prunable ones included (moved, deleted,
 * unmounted), still keeps its state in the common git directory until it
 * is pruned or repaired, so the question is unanswered, and an unanswered
 * question is a failure, never "not in use".
 */
async function stateOfListedWorktree(
  retire: RetireGit,
  entry: WorktreeEntry,
  branch: string,
): Promise<Result<boolean, Error>> {
  if (entry.prunable) {
    return err(
      new Error(
        `worktree ${nameOf(entry.path)} is prunable, so its rebase and bisect state cannot be read; if it was moved, run \`git worktree repair <its new path>\`; prune it only if it was deleted (pruning drops a rebase in progress); then re-run`,
      ),
    );
  }
  const paths = await runGit(retire, [
    '-C',
    entry.path,
    'rev-parse',
    '--path-format=absolute',
    ...WORKTREE_STATE_PATHS.flatMap((name) => ['--git-path', name]),
  ]);
  if (paths.status !== 0) {
    return err(
      gitFailure(`reading the rebase and bisect state of worktree ${nameOf(entry.path)}`, paths),
    );
  }
  const names = new Set([branch, `refs/heads/${branch}`]);
  for (const path of paths.stdout.split('\n').filter((line) => line !== '')) {
    const content = await readOptionalFile(path);
    if (!content.ok) {
      return content;
    }
    if (content.value?.split('\n').some((line) => names.has(line.trim())) === true) {
      return ok(true);
    }
  }
  return ok(false);
}
