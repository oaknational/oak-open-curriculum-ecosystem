import type { PrVerdict } from '../pr-watch/state-types.js';

/**
 * The pure verdict→action mapping for `merge-bot merge` (MCP-508 slice 1).
 *
 * The command acts on exactly one verdict state — `SETTLE-READY` — and
 * refuses everything else with the verdict's own name in the reason, so a
 * supervisor reads the outcome by name, never by inference. The two
 * additional gates carry the estate's standing rulings as behaviour:
 * merge commits must still be allowed by the repo settings (never a squash
 * fallback), and the expected reviewer set must have been DECLARED — a
 * defaulted set can omit a configured-but-never-requested reviewer, letting
 * settlement read `SETTLE-READY` on a round that owed a leg.
 */

/** The decision: merge, or a typed refusal whose reason names the ground. */
export type MergeDecision =
  { readonly kind: 'merge' } | { readonly kind: 'refuse'; readonly reason: string };

/**
 * The verdicts a bounded poll may legitimately outwait: each resolves by
 * time alone — checks finishing, a live review run completing, the quiet
 * window elapsing. Every other verdict needs an operator act or is
 * terminal, so polling on it would burn the budget silently; the CLI
 * refuses those immediately instead. Exported as the ONE authority the
 * usage text derives from — the list must never be transcribed by hand.
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

export function decideMergeAction(input: {
  readonly verdict: PrVerdict;
  readonly allowMergeCommit: boolean;
  readonly expectedDeclared: boolean;
}): MergeDecision {
  if (!input.expectedDeclared) {
    return {
      kind: 'refuse',
      reason:
        'the expected reviewer set was DEFAULTED from the observed surface — declare --expect from the repository automatic-review configuration; a defaulted set cannot back an irreversible merge',
    };
  }
  if (input.verdict.state === 'MERGED') {
    return {
      kind: 'refuse',
      reason: 'verdict MERGED — the PR was merged by another actor; this invocation merged nothing',
    };
  }
  if (input.verdict.state !== 'SETTLE-READY') {
    return {
      kind: 'refuse',
      reason: `verdict ${input.verdict.state} — only SETTLE-READY merges`,
    };
  }
  if (!input.allowMergeCommit) {
    return {
      kind: 'refuse',
      reason:
        'repo settings no longer allow merge commits (allow_merge_commit is false) — the never-squash ruling stands; restore the setting rather than changing method',
    };
  }
  return { kind: 'merge' };
}
