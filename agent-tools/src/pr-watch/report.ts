import type { ChecksSummary, CommentRef, PrSnapshot } from './index.js';

/**
 * Presentation for `pr-watch`: render a {@link PrSnapshot} to one human line,
 * and diff two snapshots into change lines. Kept separate from the parsing core
 * in `index.ts` so each module stays single-purpose.
 */

const SHORT_SHA_LENGTH = 8;

function reviewLabel(reviewDecision: string): string {
  return reviewDecision === '' ? '(none)' : reviewDecision;
}

function describeChecks(checks: ChecksSummary): string {
  return `${checks.passed}✓ ${checks.failed}✗ ${checks.pending}⋯`;
}

function shortSha(sha: string): string {
  return sha.slice(0, SHORT_SHA_LENGTH);
}

/** One-line human-readable rendering of a snapshot. */
export function formatSnapshot(snapshot: PrSnapshot): string {
  return (
    `PR #${snapshot.number} ${snapshot.state} · ` +
    `merge=${snapshot.mergeable}/${snapshot.mergeStateStatus} · ` +
    `review=${reviewLabel(snapshot.reviewDecision)} · ` +
    `checks ${describeChecks(snapshot.checks)} · ` +
    `comments ${snapshot.reviewComments.length}r/${snapshot.issueComments.length}i · ` +
    `head ${shortSha(snapshot.headRefOid)}`
  );
}

function fieldChange(label: string, previous: string, next: string): string[] {
  return previous === next ? [] : [`${label}: ${previous} → ${next}`];
}

// Compare the FULL sha (so a force-push is never missed by an 8-char prefix
// collision) but display the short form.
function headChange(previous: string, next: string): string[] {
  return previous === next ? [] : [`head: ${shortSha(previous)} → ${shortSha(next)}`];
}

function newCommentLines(
  kind: string,
  previous: readonly CommentRef[],
  next: readonly CommentRef[],
): string[] {
  const seen = new Set(previous.map((comment) => comment.id));
  return next
    .filter((comment) => !seen.has(comment.id))
    .map((comment) => `new ${kind} comment from ${comment.author}`);
}

/**
 * Diff two snapshots into human-readable change lines — one per field that
 * changed, plus one per new review/issue comment. An empty array is the signal
 * a `--watch` loop uses to stay quiet.
 */
export function diffSnapshots(previous: PrSnapshot, next: PrSnapshot): string[] {
  return [
    ...fieldChange('state', previous.state, next.state),
    ...fieldChange('mergeable', previous.mergeable, next.mergeable),
    ...fieldChange('mergeStateStatus', previous.mergeStateStatus, next.mergeStateStatus),
    ...fieldChange(
      'review',
      reviewLabel(previous.reviewDecision),
      reviewLabel(next.reviewDecision),
    ),
    ...headChange(previous.headRefOid, next.headRefOid),
    ...fieldChange('checks', describeChecks(previous.checks), describeChecks(next.checks)),
    ...newCommentLines('review', previous.reviewComments, next.reviewComments),
    ...newCommentLines('issue', previous.issueComments, next.issueComments),
  ];
}

/** Terminal PR states a `--watch` loop should stop on. */
export function isTerminalState(snapshot: PrSnapshot): boolean {
  return snapshot.state === 'MERGED' || snapshot.state === 'CLOSED';
}
