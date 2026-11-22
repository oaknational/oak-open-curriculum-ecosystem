import type { PrVerdict } from '../pr-watch/state-types.js';

/**
 * The pure verdict→action mapping for `merge-bot merge` (MCP-508 slice 1).
 *
 * The command acts on `SETTLE-READY`, for every pull request whatever paths
 * it changes. It also acts on a pull request that is green and reviewed by
 * nobody when the caller states its reason for no review: a review is owed
 * where the change's complexity justifies one, and that judgement is the
 * caller's to make and to put on the record. It refuses everything else
 * with the verdict's own name in the reason, so a supervisor reads the
 * outcome by name, never by inference. One additional gate carries a standing ruling:
 * merge commits must still be allowed by the repo settings (never a squash
 * fallback). The reviewers are read from the pull request by the verdict; the
 * door is told none.
 */

/** The decision: merge, or a typed refusal. */
export type MergeDecision =
  | { readonly kind: 'merge'; readonly withoutReview: false }
  | {
      readonly kind: 'merge';
      /** The merge stands on the caller's stated reason, not on a review. */
      readonly withoutReview: true;
      /** The reason, for the record the merge leaves on the pull request. */
      readonly reason: string;
    }
  | {
      readonly kind: 'refuse';
      readonly reason: string;
      /**
       * The refusal is the verdict's own wait state, which a bounded poll may
       * outwait; every other refusal (MERGED, the settings gate, a verdict
       * that needs an act) is terminal, and the poll loop ends on it at once.
       */
      readonly awaitsSettlement: boolean;
    };

/**
 * The verdicts a bounded poll may legitimately outwait: each resolves by
 * time alone — checks finishing, a live review run completing, the quiet
 * window elapsing. Every other verdict needs an operator act or is
 * terminal, so polling on it would burn the budget silently; the decision
 * marks a refusal as awaiting settlement only when the verdict is one of
 * these AND nothing else refused, and the CLI polls on that mark alone.
 * Exported as the ONE authority the usage text derives from — the list must
 * never be transcribed by hand.
 */
export const SETTLEMENT_WAIT_STATES = [
  'SETTLING-QUIET-WINDOW',
  'CHECKS-RUNNING',
  'WAITING-REVIEW-RUN-LIVE',
] as const satisfies readonly PrVerdict['state'][];

/** Widened at the declaration, so membership needs no assertion. */
const WAIT_STATE_SET: ReadonlySet<PrVerdict['state']> = new Set(SETTLEMENT_WAIT_STATES);

export function verdictAwaitsSettlement(state: PrVerdict['state']): boolean {
  return WAIT_STATE_SET.has(state);
}

export interface MergeDecisionInput {
  readonly verdict: PrVerdict;
  readonly allowMergeCommit: boolean;
  /**
   * The caller's reason for merging with no review, when it gives one. It
   * stands in for the review on a pull request green on everything else and
   * reviewed by nobody (`SILENT-WAIT-NO-REVIEWER`), and for nothing else:
   * red checks, open threads, a draft or a review in progress refuse as they
   * do without it.
   */
  readonly noReviewReason: string | undefined;
  /**
   * Nobody has reviewed the pull request and no review is asked of anybody:
   * the reading's expected reviewer set is empty. The verdict's state name
   * cannot say this by itself, because `SILENT-WAIT-NO-REVIEWER` is also what
   * a pull request reads when it HAS reviewers and one of them owes a round
   * nobody has requested (`pr-watch/most-blocking-leg.ts`); a reason must
   * never merge past a review that exists or is on its way.
   */
  readonly nobodyReviewsOrIsAsked: boolean;
}

/** The caller's reason, when the missing review is all that stands in the way; undefined otherwise. */
function reasonStandingInForReview(input: MergeDecisionInput): string | undefined {
  const unreviewed =
    input.verdict.state === 'SILENT-WAIT-NO-REVIEWER' && input.nobodyReviewsOrIsAsked;
  return unreviewed ? input.noReviewReason : undefined;
}

export function decideMergeAction(input: MergeDecisionInput): MergeDecision {
  if (input.verdict.state === 'MERGED') {
    return {
      kind: 'refuse',
      reason: 'verdict MERGED — the PR was merged by another actor; this invocation merged nothing',
      awaitsSettlement: false,
    };
  }
  const reason = reasonStandingInForReview(input);
  if (input.verdict.state !== 'SETTLE-READY' && reason === undefined) {
    return {
      kind: 'refuse',
      reason: `verdict ${input.verdict.state} — only SETTLE-READY merges`,
      awaitsSettlement: verdictAwaitsSettlement(input.verdict.state),
    };
  }
  if (!input.allowMergeCommit) {
    return {
      kind: 'refuse',
      reason:
        'repo settings no longer allow merge commits (allow_merge_commit is false) — the never-squash ruling stands; restore the setting rather than changing method',
      awaitsSettlement: false,
    };
  }
  return reason === undefined
    ? { kind: 'merge', withoutReview: false }
    : { kind: 'merge', withoutReview: true, reason };
}
