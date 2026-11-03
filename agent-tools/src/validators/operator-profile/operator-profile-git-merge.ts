/**
 * Operator profile — the merge guard of the push leg. A pull that conflicts
 * leaves the repository mid-merge; the push that concludes it must not stage
 * a document that still holds a conflict marker, and cannot conclude while a
 * path outside the documents is still unmerged.
 *
 * The guard reads the marker lines git writes, in the documents git still
 * holds unmerged. A conflict that writes none (a document modified on one
 * side and deleted on the other) is settled by staging, which keeps the
 * document: the union rule's answer.
 */

import { err, ok, type Result } from '@oaknational/result';

import { gitFailure, type GitRunner } from './operator-profile-git.js';
import { PUSH_COMMAND } from './operator-profile-sync-state.js';

/**
 * Whether a merge is in progress: a conflicting pull leaves `MERGE_HEAD`.
 * `rev-parse -q --verify` exits 1 with nothing on stderr when there is none;
 * any other failure is an error, never "no merge", since the push would go
 * on to stage and clear the record of a conflict it could not see.
 */
function merging(run: GitRunner): Result<boolean, string> {
  const probe = run(['rev-parse', '-q', '--verify', 'MERGE_HEAD']);
  if (probe.ok) {
    return ok(true);
  }
  return probe.stderr === '' ? ok(false) : err(gitFailure('git rev-parse MERGE_HEAD', probe));
}

function lines(text: string): readonly string[] {
  return text.split('\n').filter((line) => line !== '');
}

/** The paths git still holds unmerged: every one, or those `-- <paths>` names. */
function unmergedPaths(
  run: GitRunner,
  pathspec: readonly string[],
): Result<readonly string[], string> {
  const unmerged = run(['diff', '--name-only', '--diff-filter=U', ...pathspec]);
  return unmerged.ok ? ok(lines(unmerged.stdout)) : err(gitFailure('git diff', unmerged));
}

/**
 * The documents git still holds unmerged: the only ones it wrote conflict
 * markers into. A document the merge left alone or merged cleanly is never
 * searched, so a marker-like line in its content (a fenced example) never
 * blocks the push. The limit: an unmerged document that also holds such a
 * line as content is refused until the operator stages it in the profile
 * root. With no documents there is nothing to ask: an empty pathspec would
 * name every unmerged path.
 */
function unmergedDocuments(
  run: GitRunner,
  paths: readonly string[],
): Result<readonly string[], string> {
  return paths.length === 0 ? ok([]) : unmergedPaths(run, ['--', ...paths]);
}

// Git writes a conflict's opening and closing lines as `<` and `>` repeated
// to the path's `conflict-marker-size` attribute, read as `atoi` reads it:
// seven when it is unset or not a positive number. The pattern also admits
// longer lines, as git writes for a conflict nested in a recursive merge.
// `=======` alone is also a Markdown heading underline, so only the two ends
// are read.
const DEFAULT_MARKER_SIZE = 7;

function markerSize(value: string): number {
  const size = Number.parseInt(value, 10);
  return size > 0 ? size : DEFAULT_MARKER_SIZE;
}

/** The documents grouped by the marker size git writes into each. */
function bySize(
  run: GitRunner,
  paths: readonly string[],
): Result<ReadonlyMap<number, readonly string[]>, string> {
  const attributes = run(['check-attr', '-z', 'conflict-marker-size', '--', ...paths]);
  if (!attributes.ok) {
    return err(gitFailure('git check-attr', attributes));
  }
  // `-z` writes one path, attribute and value triple per document.
  const fields = attributes.stdout.split('\0');
  const groups = new Map<number, string[]>();
  for (let at = 0; at + 2 < fields.length; at += 3) {
    const size = markerSize(fields[at + 2] ?? '');
    groups.set(size, [...(groups.get(size) ?? []), fields[at] ?? '']);
  }
  return ok(groups);
}

/**
 * The documents that still hold a conflict marker in the worktree, each
 * searched for its own marker size. `git grep` exits 1 with nothing on
 * stderr when no line matches; any other failure, a warning on stderr
 * included, is an error, never "no markers".
 */
function markedDocuments(
  run: GitRunner,
  paths: readonly string[],
): Result<readonly string[], string> {
  if (paths.length === 0) {
    return ok([]);
  }
  const groups = bySize(run, paths);
  if (!groups.ok) {
    return groups;
  }
  const marked: string[] = [];
  for (const [size, group] of groups.value) {
    const pattern = `^(<{${String(size)},}|>{${String(size)},})( |$)`;
    const found = run(['grep', '-l', '-E', pattern, '--', ...group]);
    if (!found.ok && found.stderr !== '') {
      return err(gitFailure('git grep', found));
    }
    marked.push(...(found.ok ? lines(found.stdout) : []));
  }
  return ok(marked.sort((left, right) => left.localeCompare(right)));
}

function markerRefusal(marked: readonly string[]): string {
  return `${marked.join(', ')} still ${marked.length === 1 ? 'holds' : 'hold'} a conflict marker — resolve by union (both sides kept in time order, the later updated date wins), then ${PUSH_COMMAND}`;
}

/**
 * During a merge, refuse an unmerged document that still holds a conflict
 * marker. It runs before staging: staging would mark the path
 * resolved, and the record of the conflict would be lost.
 *
 * @param run - the git runner bound to the root
 * @param paths - the profile's document paths about to be staged
 * @returns whether a merge is in progress, or the refusal naming each marked document
 */
export function mergeGuard(run: GitRunner, paths: readonly string[]): Result<boolean, string> {
  const inMerge = merging(run);
  if (!inMerge.ok || !inMerge.value) {
    return inMerge;
  }
  const unmerged = unmergedDocuments(run, paths);
  if (!unmerged.ok) {
    return unmerged;
  }
  const marked = markedDocuments(run, unmerged.value);
  if (!marked.ok) {
    return marked;
  }
  return marked.value.length > 0 ? err(markerRefusal(marked.value)) : ok(true);
}

/**
 * After staging the documents during a merge, refuse any path git still
 * holds unmerged: one outside the documents, which a push never stages. The
 * operator resolves it in the profile root, as for any other git furniture.
 *
 * @param run - the git runner bound to the root
 * @returns nothing, or the refusal naming each unmerged path and the cure
 */
export function unmergedRefusal(run: GitRunner): Result<void, string> {
  const unmerged = unmergedPaths(run, []);
  if (!unmerged.ok) {
    return unmerged;
  }
  const paths = unmerged.value;
  if (paths.length === 0) {
    return ok(undefined);
  }
  return err(
    `${paths.join(', ')} ${paths.length === 1 ? 'is' : 'are'} still unmerged outside the profile documents — in the profile root resolve each and git add -- <path>, then ${PUSH_COMMAND}`,
  );
}
