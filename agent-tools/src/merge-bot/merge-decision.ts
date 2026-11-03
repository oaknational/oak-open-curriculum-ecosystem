import type { PrVerdict } from '../pr-watch/state-types.js';
import { describeOffenders, type ChangeClass } from './change-class.js';

/**
 * The pure verdict→action mapping for `merge-bot merge` (MCP-508 slice 1).
 *
 * The command acts on exactly one verdict state for a code-class pull request —
 * `SETTLE-READY` — and refuses everything else with the verdict's own name in
 * the reason, so a supervisor reads the outcome by name, never by inference.
 * A records-class pull request (`change-class.ts`: every changed path
 * documentation or Practice prose, computed from the diff) also merges on the
 * verdicts that differ from SETTLE-READY only by the vendor leg — checks green,
 * zero unresolved threads, the review requested but not yet landed, its run
 * dead or unreadable, its quiet window open, or never served — the owner's
 * ruling of 2026-09-03 ("Change
 * the merge policy instead") as behaviour; the review, when requested, is
 * harvested after the merge. The two additional gates carry the estate's
 * standing rulings: merge commits must still be allowed by the repo settings
 * (never a squash fallback), and the expected reviewer set must have been
 * DECLARED — a defaulted set can omit a configured-but-never-requested
 * reviewer, letting settlement read `SETTLE-READY` on a round that owed a leg.
 */

/** The decision: merge (with the ground when a class, not the verdict, opened the door), or a typed refusal. */
export type MergeDecision =
  | { readonly kind: 'merge'; readonly ground?: string }
  | {
      readonly kind: 'refuse';
      readonly reason: string;
      /**
       * The refusal is the verdict's own wait state, which a bounded poll may
       * outwait; every other refusal (a declared set that cannot merge, an
       * author the empty set does not admit, MERGED, the settings gate) is
       * terminal, and the poll loop ends on it at once.
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

/**
 * The verdicts a records-class pull request merges on: SETTLE-READY and the
 * seven reviewer-leg states the verdict ladder reaches only after every check
 * is green, every thread resolved and the base current (`states.ts`
 * precedence; UNCLASSIFIED-EVIDENCE stays out: it fires on a refused
 * declaration before the ladder). Exported as the one authority the usage
 * text and the skills derive from.
 */
export const RECORDS_CLASS_MERGE_STATES = [
  'SETTLE-READY',
  'SETTLING-QUIET-WINDOW',
  'SILENT-WAIT-NO-REVIEWER',
  'WAITING-REVIEW-RUN-LIVE',
  'SILENT-WAIT-RUN-DEAD',
  'SILENT-WAIT-RUNS-UNREADABLE',
  'SETTLED-NO-REVIEW',
  'QUOTA-SKIPPED',
] as const satisfies readonly PrVerdict['state'][];

/** Widened at the declaration, so membership needs no assertion. */
const WAIT_STATE_SET: ReadonlySet<PrVerdict['state']> = new Set(SETTLEMENT_WAIT_STATES);
const RECORDS_MERGE_SET: ReadonlySet<PrVerdict['state']> = new Set(RECORDS_CLASS_MERGE_STATES);

export function verdictAwaitsSettlement(state: PrVerdict['state']): boolean {
  return WAIT_STATE_SET.has(state);
}

export function verdictMergesRecordsClass(state: PrVerdict['state']): boolean {
  return RECORDS_MERGE_SET.has(state);
}

export interface MergeDecisionInput {
  readonly verdict: PrVerdict;
  readonly allowMergeCommit: boolean;
  readonly expectedDeclared: boolean;
  /** The expected set declared EMPTY (`--expect none`): no review is awaited, by the seat's judgement. */
  readonly declaredEmpty: boolean;
  /** The pull request's author is the merge bot itself (`app/<slug>`). */
  readonly botAuthored: boolean;
  /** The class read from the diff, when the caller read it; absent, only SETTLE-READY merges. */
  readonly changeClass?: ChangeClass;
}

/** The ground a records class supplies when the verdict alone would not merge. */
function recordsGround(input: MergeDecisionInput): string | undefined {
  const { verdict, changeClass } = input;
  if (changeClass?.kind !== 'records' || verdict.state === 'SETTLE-READY') {
    return undefined;
  }
  if (!verdictMergesRecordsClass(verdict.state)) {
    return undefined;
  }
  return (
    `records-class (${changeClass.pathCount} changed paths, all documentation or Practice prose): ` +
    `merged at checks green with zero unresolved threads on verdict ${verdict.state}; a vendor ` +
    'review requested on this tip is harvested after the merge (the owner ruling of 2026-09-03; ' +
    'the retrospective of 2026-10-10)'
  );
}

/** Why a code-class pull request stays at the door on a verdict the records class would pass. */
function codeClassSuffix(input: MergeDecisionInput): string {
  const { verdict, changeClass } = input;
  if (changeClass?.kind !== 'code' || !verdictMergesRecordsClass(verdict.state)) {
    return '';
  }
  const named =
    changeClass.offenders.length === 0
      ? 'no changed path'
      : describeOffenders(changeClass.offenders);
  return `; a records-class pull request would merge here, but the diff is code-class (${named})`;
}

/** The refusals the declared set alone decides, before any verdict is read. */
function declaredSetRefusal(input: MergeDecisionInput): MergeDecision | undefined {
  if (!input.expectedDeclared) {
    return {
      kind: 'refuse',
      reason:
        'the expected reviewer set was DEFAULTED from the observed surface — declare --expect from the repository automatic-review configuration; a defaulted set cannot back an irreversible merge',
      awaitsSettlement: false,
    };
  }
  if (input.declaredEmpty && !input.botAuthored) {
    return {
      kind: 'refuse',
      reason:
        "--expect none declares no review for a pull request the merge bot did not author — a person's pull request is reviewed, never merged on an empty set (the ruling of 2026-09-03 names the bot's own pull requests)",
      awaitsSettlement: false,
    };
  }
  return undefined;
}

export function decideMergeAction(input: MergeDecisionInput): MergeDecision {
  const refusal = declaredSetRefusal(input);
  if (refusal !== undefined) {
    return refusal;
  }
  if (input.verdict.state === 'MERGED') {
    return {
      kind: 'refuse',
      reason: 'verdict MERGED — the PR was merged by another actor; this invocation merged nothing',
      awaitsSettlement: false,
    };
  }
  const ground = recordsGround(input);
  if (input.verdict.state !== 'SETTLE-READY' && ground === undefined) {
    return {
      kind: 'refuse',
      reason: `verdict ${input.verdict.state} — only SETTLE-READY merges${codeClassSuffix(input)}`,
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
  return ground === undefined ? { kind: 'merge' } : { kind: 'merge', ground };
}
