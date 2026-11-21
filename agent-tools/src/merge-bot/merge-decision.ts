import type { PrVerdict } from '../pr-watch/state-types.js';

/**
 * The pure verdict→action mapping for `merge-bot merge` (MCP-508 slice 1).
 *
 * The command acts on exactly one verdict state, `SETTLE-READY`, for every
 * pull request whatever paths it changes, and refuses everything else with
 * the verdict's own name in the reason, so a supervisor reads the outcome by
 * name, never by inference. One additional gate carries a standing ruling:
 * merge commits must still be allowed by the repo settings (never a squash
 * fallback). The reviewers are read from the pull request by the verdict; the
 * door is told none.
 */

/** The decision: merge, or a typed refusal. */
export type MergeDecision =
  | { readonly kind: 'merge' }
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
}

export function decideMergeAction(input: MergeDecisionInput): MergeDecision {
  if (input.verdict.state === 'MERGED') {
    return {
      kind: 'refuse',
      reason: 'verdict MERGED — the PR was merged by another actor; this invocation merged nothing',
      awaitsSettlement: false,
    };
  }
  if (input.verdict.state !== 'SETTLE-READY') {
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
  return { kind: 'merge' };
}
