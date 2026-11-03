import { execFileSync } from 'node:child_process';

import { GH_EXEC_OPTIONS, type GhCommandExecutor } from '../pr-watch/gh.js';
import type { DiffStat } from './measure.js';

/**
 * The local git reads the gate makes: the diff a push carries, the sync test
 * (a merge that is exactly git's automatic merge of the pull request's base),
 * and the current branch. Every command goes through the injected executor;
 * tests answer it and spawn nothing.
 */

// A merge commit is a sync from the base ONLY when its branch side changed
// nothing: its tree equals the tree git's own automatic merge of its two
// parents produces. That is a content comparison — a merge-time edit that
// preserves line counts, or a binary change, differs in the tree. A merge
// whose automatic form conflicts, or that carries any edit, is priced in
// full from the previous reviewed head — the base's changes ride along,
// which overcharges, the safe direction for a gate.
function numstat(range: string, run: GhCommandExecutor): string {
  return run('git', ['diff', '--numstat', range], GH_EXEC_OPTIONS).trim();
}

/** The two parents of a merge commit, or undefined for anything else. */
function mergeParents(
  revision: string,
  run: GhCommandExecutor,
): { readonly first: string; readonly second: string } | undefined {
  const parents = run('git', ['rev-list', '--parents', '-n', '1', revision], GH_EXEC_OPTIONS)
    .trim()
    .split(/\s+/u);
  const [, first, second] = parents;
  if (parents.length !== 3 || first === undefined || second === undefined) {
    return undefined;
  }
  return { first, second };
}

// A git predicate: true when the command exits 0; a non-zero exit (the
// executor throws) is false, never an error — every caller reads false as
// "not a sync", the safe direction.
function gitHolds(args: readonly string[], run: GhCommandExecutor): boolean {
  try {
    run('git', args, GH_EXEC_OPTIONS);
    return true;
  } catch {
    return false;
  }
}

function automaticMergeTree(
  first: string,
  second: string,
  run: GhCommandExecutor,
): string | undefined {
  try {
    return run('git', ['merge-tree', '--write-tree', first, second], GH_EXEC_OPTIONS).trim();
  } catch {
    return undefined;
  }
}

function isBaseSync(revision: string, run: GhCommandExecutor): boolean {
  const parents = mergeParents(revision, run);
  if (parents === undefined) {
    return false;
  }
  const automatic = automaticMergeTree(parents.first, parents.second, run);
  if (automatic === undefined || automatic === '') {
    return false;
  }
  const actual = run('git', ['rev-parse', `${revision}^{tree}`], GH_EXEC_OPTIONS).trim();
  return actual === automatic;
}

/**
 * Whether a push is a pure base sync: the pushed head is one merge commit
 * whose first parent is the head the remote already holds, whose second
 * parent is the pull request's base (the base tip or an ancestor of it —
 * never another branch), and whose tree is exactly git's automatic merge of
 * the two. Such a push changes no reviewed content and sits outside the
 * settlement budget (PDR-140 clause 4), so the gate passes it whatever the
 * loop's verdict. A push of several commits, a merge of anything but the
 * base, or a merge carrying any edit is never a sync push.
 */
export function isSyncPush(
  remoteSha: string,
  localSha: string,
  baseRefOid: string,
  run: GhCommandExecutor = execFileSync,
): boolean {
  const parents = mergeParents(localSha, run);
  return (
    parents !== undefined &&
    parents.first === remoteSha &&
    gitHolds(['merge-base', '--is-ancestor', parents.second, baseRefOid], run) &&
    isBaseSync(localSha, run)
  );
}

/** Lines and files changed between two revisions, from `git diff --numstat`; zero for a base sync. */
export function gitDiffStat(
  from: string,
  to: string,
  run: GhCommandExecutor = execFileSync,
): DiffStat {
  if (isBaseSync(to, run)) {
    return { lines: 0, files: [], sync: true };
  }
  const out = numstat(`${from}..${to}`, run);
  const rows = out
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => line.split('\t'));
  const lines = rows.reduce(
    (sum, [added, deleted]) => sum + (Number(added) || 0) + (Number(deleted) || 0),
    0,
  );
  return {
    lines,
    files: rows.map((row) => row[2] ?? '').filter((file) => file !== ''),
    sync: false,
  };
}

export function currentBranch(run: GhCommandExecutor = execFileSync): string {
  return run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], GH_EXEC_OPTIONS).trim();
}
