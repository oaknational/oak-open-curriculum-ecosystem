/**
 * VALIDATE stage workflow: the tiered adversary over the seeded candidates.
 *
 * @remarks
 * Thin composition root over the REAL tested modules — the adjudication loop
 * (`adjudication.ts`, driving the deterministic `adjudicate` state machine with the
 * injected harness primitives), `resolveResumeSeed` (candidate-granular resume),
 * `postReduceRegate` (the hard money-gate: a ceiling breach returns a typed failure
 * BEFORE any voter is dispatched), `assessValidateCompleteness`, and `runCapped` (the
 * shared throttle). Voter grounding is assembled from the seeded grounding-leaf
 * projection at vote time; a candidate with no resolvable grounding fails `grounded`
 * loudly in the prompt rather than silently.
 *
 * Meta is NEVER run inline here: it is its own stage over the merged dispositions, so
 * clean and resumed runs share one structural path.
 *
 * @packageDocumentation
 */

import type { Candidate } from '../judgment-schemas.js';
import {
  assessValidateCompleteness,
  postReduceRegate,
  resolveResumeSeed,
  runCapped,
} from '../run-orchestration.js';
import { createCandidateAdjudicator, type AdjudicatedCandidate } from './adjudication.js';
import type { HarnessAgent, HarnessLog, HarnessParallel, HarnessPhase } from './harness-types.js';
import { RUN_DATA, RUN_DATA_STAGE } from './run-data.js';
import { isValidateRunData, unseededRunDataError } from './stage-guards.js';
import type { Disposition, ValidateResult } from './stage-io.js';

declare const agent: HarnessAgent;
declare const parallel: HarnessParallel;
declare const phase: HarnessPhase;
declare const log: HarnessLog;

/**
 * Max candidate adjudication loops in flight. Each loop dispatches at most the 3-voter
 * Tier-2 ensemble at once, so peak requested agents ≈ 24 against the harness's own
 * per-workflow cap (min(16, cores-2)). Re-derived 2026-07-02 (owner-decided, was 3
 * then 10): single-turn no-tools voters make ~1 API call each so the rate-limit
 * pressure that forced the low cap is gone; 10 ran clean (984 voters, zero deaths)
 * but queued agents ran too far ahead of completions, so 8 keeps the queue depth
 * close to the 16-agent execution ceiling without a long speculative backlog.
 */
const MAX_CONCURRENCY = 8;
/** Max deterministic per-voter dispatch delay (ms) to flatten the burst. */
const JITTER_MS = 250;
/** Safety cap on adjudication rounds per candidate (the state machine terminates well before). */
const MAX_ROUNDS = 8;

function assembleValidateResult(
  validated: readonly AdjudicatedCandidate[],
  candidates: readonly Candidate[],
): ValidateResult {
  const dispositionCounts = validated.reduce<Partial<Record<Disposition, number>>>((acc, entry) => {
    acc[entry.disposition] = (acc[entry.disposition] ?? 0) + 1;
    return acc;
  }, {});
  const voterOutcomes = validated.flatMap((entry) => entry.outcomes);
  log(
    `validate done: ${JSON.stringify(dispositionCounts)}; ${voterOutcomes.length} voter outcomes`,
  );

  const completeness = assessValidateCompleteness(validated, candidates);
  if (!completeness.complete) {
    log(
      `validate INCOMPLETE — ${completeness.incompleteCandidateIds.length} held, ${completeness.missingCandidateIds.length} missing. Re-seed via resolvedIds; unresolved: ${[...completeness.incompleteCandidateIds, ...completeness.missingCandidateIds].join(',')}.`,
    );
  }

  return {
    ok: true,
    validateComplete: completeness.complete,
    resolvedCandidateIds: validated
      .filter((entry) => entry.disposition !== 'held-for-review')
      .map((entry) => entry.candidateId),
    incompleteCandidateIds: [...completeness.incompleteCandidateIds],
    missingCandidateIds: [...completeness.missingCandidateIds],
    dispositions: validated.map((entry) => ({
      candidateId: entry.candidateId,
      disposition: entry.disposition,
      reason: entry.reason ?? null,
    })),
    voterOutcomes,
  };
}

/** Run the validate stage over the seeded candidates. */
export async function main(): Promise<ValidateResult> {
  phase('validate');
  if (!isValidateRunData(RUN_DATA, RUN_DATA_STAGE)) {
    return { ok: false, error: unseededRunDataError('validate') };
  }
  const { candidates: seeded, groundingLeaves, resolvedIds, validateTokenCeiling } = RUN_DATA;
  const candidates = resolveResumeSeed(seeded, resolvedIds);
  log(
    `seeded validate: ${seeded.length} seeded, ${seeded.length - candidates.length} already resolved, ${candidates.length} to validate, MAX_CONCURRENCY=${MAX_CONCURRENCY}`,
  );

  const regate = postReduceRegate({
    candidateCount: candidates.length,
    ceiling: validateTokenCeiling,
  });
  log(regate.message);
  if (regate.abort) {
    return { ok: false, error: regate.message };
  }

  const adjudicateCandidate = createCandidateAdjudicator(
    { agent, parallel, jitterMs: JITTER_MS, maxRounds: MAX_ROUNDS },
    new Map(groundingLeaves.map((leaf) => [leaf.id, leaf])),
  );
  const results = await runCapped(candidates, MAX_CONCURRENCY, adjudicateCandidate, parallel);
  return assembleValidateResult(
    results.flatMap((entry) => (entry === null ? [] : [entry])),
    candidates,
  );
}
