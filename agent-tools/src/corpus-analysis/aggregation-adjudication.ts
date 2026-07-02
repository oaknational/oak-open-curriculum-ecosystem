import type {
  AdversaryLens,
  AdversaryVerdict,
  UnadjudicatedReason,
  VoterOutcome,
} from './judgment-schemas.js';
import { classifyVerdict, isBorderline, type VerdictDisposition } from './aggregation-verdict.js';

/**
 * The deterministic adjudication state machine — the heart of "code routes, the LLM
 * judges". Given the voter outcomes gathered so far for ONE candidate, it returns either a
 * terminal disposition or the next tier to dispatch. The orchestrator's only job is to run
 * the voters this function asks for and feed every outcome of a dispatched tier back
 * before re-invoking; it makes no routing decision itself. Tiers 0 and 1 are single-voter
 * (the function reads the first outcome of each); Tier 2 is the full diverse-lens ensemble.
 */

type CandidateDisposition = VerdictDisposition | 'held-for-review';

export type AdjudicationStep =
  | {
      readonly kind: 'terminal';
      readonly disposition: CandidateDisposition;
      readonly reason?: UnadjudicatedReason;
    }
  | {
      readonly kind: 'dispatch';
      readonly tier: 'tier-0' | 'tier-1' | 'tier-2';
      readonly voterCount: number;
      readonly lenses?: readonly AdversaryLens[];
    };

/** The three diverse lenses of the Tier-2 ensemble — distinct so the votes are uncorrelated. */
const TIER_2_LENSES: readonly AdversaryLens[] = [
  'correctness-grounding',
  'base-rate',
  'null-reproduction',
];
const TIER_2_ENSEMBLE_SIZE = TIER_2_LENSES.length;

const dispatchTier2From = (alreadyDispatched: number): AdjudicationStep => ({
  kind: 'dispatch',
  tier: 'tier-2',
  voterCount: TIER_2_ENSEMBLE_SIZE - alreadyDispatched,
  lenses: TIER_2_LENSES.slice(alreadyDispatched),
});

const dispatchOne = (tier: 'tier-0' | 'tier-1'): AdjudicationStep => ({
  kind: 'dispatch',
  tier,
  voterCount: 1,
});

const terminal = (
  disposition: CandidateDisposition,
  reason?: UnadjudicatedReason,
): AdjudicationStep =>
  reason === undefined
    ? { kind: 'terminal', disposition }
    : { kind: 'terminal', disposition, reason };

function adjudicatedVerdicts(outcomes: readonly VoterOutcome[]): readonly AdversaryVerdict[] {
  return outcomes
    .filter(
      (outcome): outcome is Extract<VoterOutcome, { status: 'adjudicated' }> =>
        outcome.status === 'adjudicated',
    )
    .map((outcome) => outcome.verdict);
}

/**
 * Tally dispositions exhaustively. The `Record<VerdictDisposition, number>` literal is the
 * compile-time guard: add a member to `VerdictDisposition` and this object stops compiling
 * until the new case is handled here, so the quorum can never silently miscount it.
 */
function tallyDispositions(
  dispositions: readonly VerdictDisposition[],
): Record<VerdictDisposition, number> {
  const tally: Record<VerdictDisposition, number> = { keep: 0, kill: 0, reroute: 0 };
  for (const disposition of dispositions) {
    tally[disposition] += 1;
  }
  return tally;
}

/**
 * The Tier-2 quorum over the adjudicated diverse-lens voters. Order matters:
 * 1. Fewer than two adjudicated voters → held for review (`retry-cap`); an availability
 *    failure can never flip a keep.
 * 2. The adjudicated verdicts must carry DISTINCT lenses — the property that licenses a
 *    simple majority (uncorrelated votes). A missing or duplicated lens → held
 *    (`lens-collision`), never a keep, because correlated votes would carry a false keep.
 * 3. Keep iff a strict majority of keep votes; a dead tie → held (`quorum-tie`).
 * 4. Otherwise reroute iff reroute support exists and is not outweighed by outright kills;
 *    else kill.
 */
function finaliseQuorum(verdicts: readonly AdversaryVerdict[]): AdjudicationStep {
  if (verdicts.length < 2) {
    return terminal('held-for-review', 'retry-cap');
  }
  const lenses = verdicts.map((verdict) => verdict.lens);
  if (lenses.includes(undefined) || new Set(lenses).size !== lenses.length) {
    return terminal('held-for-review', 'lens-collision');
  }
  const tally = tallyDispositions(verdicts.map(classifyVerdict));
  const refuters = verdicts.length - tally.keep;
  if (tally.keep > refuters) {
    return terminal('keep');
  }
  if (tally.keep === refuters) {
    return terminal('held-for-review', 'quorum-tie');
  }
  if (tally.reroute >= 1 && tally.reroute >= tally.kill) {
    return terminal('reroute');
  }
  return terminal('kill');
}

/** Decide the next step after a clean (non-borderline) Tier-0 keep, given any Tier-1 outcome. */
function decideAfterCleanKeep(tier1: readonly VoterOutcome[]): AdjudicationStep {
  if (tier1.length === 0) {
    return dispatchOne('tier-1');
  }
  const confirmer = tier1[0];
  if (confirmer.status === 'unadjudicated') {
    return dispatchTier2From(0);
  }
  return classifyVerdict(confirmer.verdict) === 'keep' ? terminal('keep') : dispatchTier2From(0);
}

/** Decide the next step from the Tier-0 outcome and any Tier-1 outcome (pre-ensemble). */
function decidePreEnsemble(
  tier0Outcome: VoterOutcome,
  tier1: readonly VoterOutcome[],
): AdjudicationStep {
  if (tier0Outcome.status === 'unadjudicated') {
    return tier1.length === 0 ? dispatchOne('tier-1') : dispatchTier2From(0);
  }
  const disposition = classifyVerdict(tier0Outcome.verdict);
  if (disposition === 'kill' || disposition === 'reroute' || isBorderline(tier0Outcome.verdict)) {
    // A kill is NOT terminal on one voter — it escalates to the Tier-2 diverse-lens quorum,
    // exactly as a reroute or a borderline keep does. Discarding a grounded candidate is the
    // irreversible, recall-dropping error (a false keep is visible and prunable; a false kill
    // vanishes silently), and correlated votes never license a discard — so only the
    // diverse-lens quorum may kill. Conserve by default.
    return dispatchTier2From(0);
  }
  return decideAfterCleanKeep(tier1);
}

/**
 * Tier 0: one voter — a SCREEN, never a terminal discard. A kill, a reroute (base-rate-only
 * fail at high importance), and a borderline keep all escalate to the Tier-2 diverse-lens
 * quorum: discarding a grounded candidate is the irreversible, recall-dropping error (a false
 * keep is visible and prunable; a false kill vanishes silently), so only a quorum may kill —
 * conserve by default. A clean (confident) keep escalates instead to a single Tier-1 confirmer.
 * Tier 1: one blind confirmer — both keep gives a keep; a lone dissent or an unadjudicated
 * confirmer escalates to Tier 2 (the C06 fix: one missing voter no longer strands the
 * candidate). Tier 2: finalised by `finaliseQuorum` only once the FULL ensemble has reported;
 * a partial feed dispatches the remaining voters rather than deciding early.
 */
export function adjudicate(input: {
  readonly outcomes: readonly VoterOutcome[];
}): AdjudicationStep {
  const outcomes = input.outcomes;
  if (outcomes.filter((outcome) => outcome.tier === 'tier-0').length === 0) {
    return dispatchOne('tier-0');
  }
  const tier2 = outcomes.filter((outcome) => outcome.tier === 'tier-2');
  if (tier2.length >= TIER_2_ENSEMBLE_SIZE) {
    return finaliseQuorum(adjudicatedVerdicts(tier2));
  }
  if (tier2.length > 0) {
    return dispatchTier2From(tier2.length);
  }
  const tier0Outcome = outcomes.find((outcome) => outcome.tier === 'tier-0');
  if (tier0Outcome === undefined) {
    return dispatchOne('tier-0');
  }
  return decidePreEnsemble(
    tier0Outcome,
    outcomes.filter((outcome) => outcome.tier === 'tier-1'),
  );
}
