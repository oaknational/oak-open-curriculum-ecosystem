/**
 * Operator profile — the push leg of the git layer.
 *
 * Stage the profile's documents by pathspec, commit only those paths (outside
 * a merge, an index entry outside them, staged by hand, is never swept in), and push
 * whatever the upstream lacks — including commits an earlier push left
 * local, so `profile:sync push` cures every finding the check prescribes it
 * for. The first push sets the upstream on the repository's one remote.
 *
 * While a merge is in progress (a pull that conflicted), git makes a merge
 * commit whole and refuses a partial one, so the push concludes the merge
 * with the whole index, anything staged by hand during the merge included:
 * the cure the conflicting pull prescribes. A document the merge touches
 * that still holds a conflict marker is refused by name first, and a path
 * outside the documents still unmerged is refused with its cure
 * (`operator-profile-git-merge.ts`).
 */

import { err, ok, type Result } from '@oaknational/result';

import {
  firstLine,
  gitFailure,
  hasUpstream,
  leftRightCounts,
  remoteNames,
  type GitRunner,
} from './operator-profile-git.js';
import { mergeGuard, unmergedRefusal } from './operator-profile-git-merge.js';
import { INDEX_FILE_NAME, MACHINES_DIR_NAME, SCOPES_DIR_NAME } from './operator-profile-schema.js';
import { PUSH_COMMAND } from './operator-profile-sync-state.js';

/**
 * The pathspecs to stage: the document paths that exist in the worktree plus
 * every tracked document path, so a deleted document (whose directory may no
 * longer exist) is staged as a deletion and never dropped.
 */
function stagingPaths(
  run: GitRunner,
  existing: readonly string[],
): Result<readonly string[], string> {
  const tracked = run(['ls-files', '--', INDEX_FILE_NAME, SCOPES_DIR_NAME, MACHINES_DIR_NAME]);
  if (!tracked.ok) {
    return err(gitFailure('git ls-files', tracked));
  }
  const trackedPaths = tracked.stdout.split('\n').filter((line) => line !== '');
  return ok([...new Set([...existing, ...trackedPaths])]);
}

/** The mode git records a symbolic link with; a profile document is never one. */
const SYMLINK_MODE = '120000';

/**
 * The staged paths git records as symbolic links. The runner checks out
 * with `core.symlinks=false`, under which a path the index holds as a link
 * stays one when its file is rewritten and staged: a document repaired in
 * place after a pulled link would be committed as a link, and check out on
 * another machine as one. Each is refused by name instead.
 */
function stagedLinks(run: GitRunner, paths: readonly string[]): Result<readonly string[], string> {
  const staged = run(['ls-files', '--stage', '-z', '--', ...paths]);
  if (!staged.ok) {
    return err(gitFailure('git ls-files --stage', staged));
  }
  return ok(
    staged.stdout
      .split('\0')
      .filter((row) => row.startsWith(`${SYMLINK_MODE} `))
      .map((row) => row.slice(row.indexOf('\t') + 1)),
  );
}

function linkRefusal(links: readonly string[]): string {
  return `${links.join(', ')} ${links.length === 1 ? 'is' : 'are'} recorded in git as a symbolic link — a profile document never is: in the profile root run git rm --cached -- <path> for each, then ${PUSH_COMMAND}`;
}

/**
 * Commit the staged paths only; during a merge, the whole index, since git
 * refuses a partial merge commit. A merge is concluded even when the
 * resolution leaves the paths as they were; a path outside them that is
 * still unmerged is refused first.
 */
function commitStaged(
  run: GitRunner,
  message: string,
  paths: readonly string[],
  inMerge: boolean,
): Result<{ readonly committed: boolean }, string> {
  if (!inMerge && run(['diff', '--cached', '--quiet', '--', ...paths]).ok) {
    return ok({ committed: false });
  }
  if (inMerge) {
    const unmerged = unmergedRefusal(run);
    if (!unmerged.ok) {
      return unmerged;
    }
  }
  const committed = run(
    inMerge
      ? ['commit', '--quiet', '-m', message]
      : ['commit', '--quiet', '--only', '-m', message, '--', ...paths],
  );
  if (!committed.ok) {
    return err(gitFailure('commit', committed));
  }
  return ok({ committed: true });
}

/** Stage the documents and refuse any the index records as a link; with none, nothing to stage. */
function stageDocuments(run: GitRunner, paths: readonly string[]): Result<void, string> {
  if (paths.length === 0) {
    return ok(undefined);
  }
  const added = run(['add', '--', ...paths]);
  if (!added.ok) {
    return err(gitFailure('staging', added));
  }
  const links = stagedLinks(run, paths);
  if (!links.ok) {
    return links;
  }
  return links.value.length > 0 ? err(linkRefusal(links.value)) : ok(undefined);
}

/** Stage by pathspec and commit only those paths (during a merge, the whole index); `committed: false` when nothing changed. */
function stageAndCommit(
  run: GitRunner,
  message: string,
  existing: readonly string[],
): Result<{ readonly committed: boolean }, string> {
  const staged = stagingPaths(run, existing);
  if (!staged.ok) {
    return staged;
  }
  const paths = staged.value;
  // The probe runs before the empty-path return: a profile with no
  // documents can still be mid-merge on its git furniture, and that merge is
  // the push's to refuse or conclude.
  const inMerge = mergeGuard(run, paths);
  if (!inMerge.ok) {
    return inMerge;
  }
  if (paths.length === 0 && !inMerge.value) {
    return ok({ committed: false });
  }
  const documents = stageDocuments(run, paths);
  if (!documents.ok) {
    return documents;
  }
  return commitStaged(run, message, paths, inMerge.value);
}

/** The remote a first push goes to: the repository's one remote, never a guess. */
function firstPushRemote(run: GitRunner): Result<string, string> {
  const remotes = remoteNames(run);
  if (!remotes.ok) {
    return remotes;
  }
  const [only] = remotes.value;
  if (only !== undefined && remotes.value.length === 1) {
    return ok(only);
  }
  return err(
    `${remotes.value.length} remotes and no upstream — set the upstream once (git push -u <remote> HEAD), then push again`,
  );
}

function pushFirst(run: GitRunner, committed: boolean): Result<string, string> {
  const remote = firstPushRemote(run);
  if (!remote.ok) {
    return remote;
  }
  const pushed = run(['push', '--quiet', '-u', remote.value, 'HEAD']);
  if (!pushed.ok) {
    return err(`push failed (the commits are local): ${firstLine(pushed.stderr) || 'no detail'}`);
  }
  return ok(`${committed ? 'committed and ' : ''}pushed; upstream set on ${remote.value}`);
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

/** A branch behind its remote is never pushed; the pull is the cure. */
function behindRefusal(committed: boolean, behind: number): string {
  return `${committed ? 'committed locally; ' : ''}the branch is ${plural(behind, 'commit')} behind the remote — run pnpm profile:sync pull, then push again`;
}

function pushAhead(run: GitRunner, committed: boolean): Result<string, string> {
  const counts = leftRightCounts(run);
  if (!counts.ok) {
    return counts;
  }
  const { ahead, behind } = counts.value;
  if (behind > 0) {
    return err(behindRefusal(committed, behind));
  }
  if (ahead === 0) {
    return ok('nothing to commit; in sync with the upstream');
  }
  const pushed = run(['push', '--quiet']);
  if (!pushed.ok) {
    return err(`push failed (the commits are local): ${firstLine(pushed.stderr) || 'no detail'}`);
  }
  return ok(
    committed
      ? 'committed and pushed'
      : `pushed ${plural(ahead, 'local commit')} (nothing new to commit)`,
  );
}

/**
 * Commit and push the operator's ratified writes: stage the profile's
 * documents by pathspec, commit those paths only (during a merge, the whole
 * index, since git makes a merge commit whole), push whatever the upstream
 * lacks (setting the upstream on the first push); a branch behind its
 * remote is refused with the pull cure. The caller runs the profile check
 * first and passes the document paths that exist; tracked deletions are
 * added here.
 *
 * @param run - the git runner bound to the root
 * @param message - names the seat and the fact
 * @param existing - the profile's document paths that exist in the root
 * @returns what happened, or the failure to surface
 */
export function pushProfile(
  run: GitRunner,
  message: string,
  existing: readonly string[],
): Result<string, string> {
  const commit = stageAndCommit(run, message, existing);
  if (!commit.ok) {
    return commit;
  }
  return hasUpstream(run)
    ? pushAhead(run, commit.value.committed)
    : pushFirst(run, commit.value.committed);
}
