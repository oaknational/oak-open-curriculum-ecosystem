import type { AdversaryVerdict, Candidate, TestJudgment } from './judgment-schemas.js';

/**
 * Deterministic classification of a single adversary verdict — the keep/kill/reroute
 * predicate and the Tier-2 borderline trigger. The adversary emits only the four
 * pass/confidence tuples and an importance rating; the disposition is computed here.
 */

/** The four conjunctive apophenia tests an adversary judges (v1 design sections 5 and 8). */
function testOutcomes(verdict: AdversaryVerdict): readonly TestJudgment[] {
  return [verdict.grounded, verdict.baseRateHolds, verdict.survivesNull, verdict.notArtefact];
}

export type VerdictDisposition = 'keep' | 'kill' | 'reroute';

/**
 * Classify a single adversary verdict (the Tier-0 predicate). A candidate is kept only if
 * it passes all four tests (conjunctive — a false keep is the irreversible error). The one
 * guarded exception: failing ONLY the base-rate test, at high importance, reroutes to the
 * Surprises lens as a candidate anomaly rather than being discarded.
 */
export function classifyVerdict(verdict: AdversaryVerdict): VerdictDisposition {
  if (testOutcomes(verdict).every((test) => test.pass)) {
    return 'keep';
  }
  const failsOnlyBaseRate =
    !verdict.baseRateHolds.pass &&
    verdict.grounded.pass &&
    verdict.survivesNull.pass &&
    verdict.notArtefact.pass;
  if (failsOnlyBaseRate && verdict.importance === 'high') {
    return 'reroute';
  }
  return 'kill';
}

/**
 * Is a verdict borderline — the Tier-2 trigger? A kept-class verdict is borderline when
 * any of its passing tests passed only marginally (low or med confidence). A verdict that
 * does not classify as keep is not borderline in this sense; its escalation is decided by
 * the adjudication state machine (a reroute, or a Tier-1 dissent).
 */
export function isBorderline(verdict: AdversaryVerdict): boolean {
  if (classifyVerdict(verdict) !== 'keep') {
    return false;
  }
  return testOutcomes(verdict).some((test) => test.pass && test.confidence !== 'high');
}

/**
 * Count the distinct windows a candidate is grounded in — the cross-window spread that
 * separates an emergent pattern from a single-window artefact. Recomputed from the
 * candidate's supporting windows, never trusting its self-reported `groundingCount`.
 */
export function distinctGroundingWindows(candidate: Candidate): number {
  return new Set(candidate.supportingWindows).size;
}
