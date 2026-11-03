/**
 * Which commit `merge-bot push` writes: the one HEAD names, settled as one
 * snapshot with the branch so a checkout during the push's origin reads
 * cannot pair one branch with another's commit. Split from
 * `push-target-branch.ts`, which settles the branch, at the file limit.
 *
 * @packageDocumentation
 */
import { err, ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import type { GitCommandResult } from './git-executor.js';
import { describeGitChildEnd, type PushGitReads } from './push-git.js';

/** The branch HEAD is on, or undefined for a detached HEAD. */
export function currentBranchFrom(result: GitCommandResult): Result<string | undefined, Error> {
  if (result.status !== 0) {
    return err(
      new Error(
        `cannot read the current branch (git branch ${describeGitChildEnd(result)}): ${result.stderr.trim()}`,
      ),
    );
  }
  const branch = result.stdout.trim();
  return ok(branch === '' ? undefined : branch);
}

/** A full object name: SHA-1 (40 hex digits) or SHA-256 (64). */
const OBJECT_NAME = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/u;

/**
 * Settle the commit a push writes: the one HEAD names, read once before the
 * mint, so every attempt pushes the same commit however long the retry waits.
 *
 * @param read - git's answer naming HEAD's commit (`rev-parse --verify HEAD^{commit}`).
 * @returns The commit's full object name, or the failure naming the cure.
 */
export function settleCommit(read: GitCommandResult): Result<string, Error> {
  const name = read.stdout.trim();
  return read.status === 0 && OBJECT_NAME.test(name)
    ? ok(name)
    : err(
        new Error(
          `cannot settle the commit HEAD names (git rev-parse ${describeGitChildEnd(read)}, answering ${JSON.stringify(name)}); check out a branch with a commit and push again`,
        ),
      );
}

/**
 * Settle the commit for a settled branch, as one snapshot of HEAD. The branch
 * is read first and the commit last, with origin's reads between; a checkout
 * that changed branch in that interval would pair the first branch with the
 * second branch's commit. So the branch is read again after the commit, and
 * a different answer fails the push before the mint. A named branch is
 * HEAD's branch too, settled so by {@link settleTargetBranch}, and is asked
 * the same.
 *
 * @param branch - The settled target branch.
 * @param reads - git's answers naming HEAD's commit and its branch.
 * @returns The commit's full object name, or the failure naming the cure.
 */
export async function settleCommitFor(
  branch: string,
  reads: Pick<PushGitReads, 'headCommit' | 'currentBranch'>,
): Promise<Result<string, Error>> {
  const commit = settleCommit(await reads.headCommit());
  if (!commit.ok) {
    return commit;
  }
  const now = currentBranchFrom(await reads.currentBranch());
  if (!now.ok) {
    return now;
  }
  if (now.value === branch) {
    return commit;
  }
  const movedTo = now.value === undefined ? 'no branch' : `"${printable(now.value)}"`;
  return err(
    new Error(
      `HEAD moved from branch "${printable(branch)}" to ${movedTo} while the push settled its target; nothing was minted or pushed; run the push again`,
    ),
  );
}
