/**
 * Classify a git push by what its refs do: send commits, delete refs, or both.
 *
 * A git `pre-push` hook receives, on stdin, one line per pushed ref in the form
 * `<local_ref> <local_sha> <remote_ref> <remote_sha>`. A deletion carries an
 * all-zero `local_sha` (and `(delete)` as its local ref). The `pre-push` gates
 * check the commits a push sends, so a push that only deletes refs has nothing
 * for them to check, and a push that does both is refused by the rule
 * `deletions-never-ride-a-push`.
 *
 * It is a pure function (string input, no IO) so the classification is
 * unit-tested directly; `push-shape.ts` is the thin CLI the hook calls.
 */

/**
 * - `no-ref-lines`: git supplied none (a manual run of the hook).
 * - `commits`: every ref is created or updated.
 * - `deletions-only`: every ref is deleted.
 * - `mixed`: at least one ref is deleted and at least one is not.
 */
export type PushShape = 'no-ref-lines' | 'commits' | 'deletions-only' | 'mixed';

/**
 * An all-zero object id marks an absent ref end. Matched by shape (any length)
 * so it holds for SHA-1 and SHA-256 repositories.
 */
const isZeroObjectId = (objectId: string): boolean => /^0+$/.test(objectId);

/**
 * Whether a ref line deletes its remote ref. A line with no second field is
 * not a well-formed ref line and is never read as a deletion: the direction
 * that keeps the gates running.
 */
function isDeletion(refLine: string): boolean {
  const [, localSha] = refLine.split(/\s+/);
  return localSha !== undefined && isZeroObjectId(localSha);
}

/**
 * @param refsText - raw `pre-push` stdin, newline-separated ref lines.
 * @returns what the push does, read from every ref line.
 */
export function classifyPush(refsText: string): PushShape {
  const refLines = refsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (refLines.length === 0) {
    return 'no-ref-lines';
  }
  const deletions = refLines.filter(isDeletion).length;
  if (deletions === 0) {
    return 'commits';
  }
  return deletions === refLines.length ? 'deletions-only' : 'mixed';
}
