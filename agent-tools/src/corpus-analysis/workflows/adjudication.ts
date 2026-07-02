/**
 * The per-candidate adjudication loop: drive the deterministic routing state machine,
 * dispatching the voters it asks for until it reaches a terminal disposition.
 *
 * @remarks
 * The REAL `adjudicate` state machine makes every routing decision; this loop only
 * executes its dispatches — voters run through the injected harness primitives
 * (`agent`, `parallel`), a dead voter becomes a first-class `unadjudicated` outcome
 * (never a silent drop), the Tier-2 lens is attached to the verdict AFTER the call (the
 * agent contract deliberately omits it), and every outcome of a dispatched tier feeds
 * back before the machine is re-invoked. `maxRounds` is a safety cap only — the state
 * machine terminates well before it; exhaustion resolves to a `held-for-review` that
 * downstream completeness gates surface, never a spin.
 *
 * Harness primitives are injected (ADR-078), so the loop is unit-tested with fakes and
 * the stage entry stays a thin composition root. Sandbox-safe: no value import here
 * (or transitively) drags zod, Result, or any Node API into the bundle.
 *
 * @packageDocumentation
 */

import { adjudicate } from '../aggregation-adjudication.js';
import type { AdversaryLens, Candidate, VoterOutcome } from '../judgment-schemas.js';
import { deterministicJitterMs, type ValidatedCandidate } from '../run-orchestration.js';
import { AGENT_JSON_SCHEMAS } from './agent-schemas.js';
import type { VoterJudgment } from './agent-schemas.js';
import type { HarnessAgentOptions, HarnessParallel } from './harness-types.js';
import { assembleGroundingLines, votePrompt } from './prompts.js';
import type { GroundingLeaf } from './stage-io.js';

/** A candidate's terminal (or held) disposition plus every voter outcome behind it. */
export interface AdjudicatedCandidate extends ValidatedCandidate {
  readonly outcomes: readonly VoterOutcome[];
}

/**
 * The loop's agent dependency, monomorphic on purpose: adjudication only ever requests
 * voter judgments, and the narrow shape lets tests inject a plainly-typed fake. The
 * harness's generic `agent` global satisfies it by instantiation.
 */
export type VoterAgent = (
  prompt: string,
  opts: HarnessAgentOptions<VoterJudgment>,
) => Promise<VoterJudgment | null>;

/** The injected execution surface and knobs for the adjudication loop. */
export interface AdjudicationDeps {
  readonly agent: VoterAgent;
  readonly parallel: HarnessParallel;
  /** Max deterministic per-voter dispatch delay (ms) to flatten the burst; 0 disables. */
  readonly jitterMs: number;
  /** Safety cap on adjudication rounds per candidate. */
  readonly maxRounds: number;
}

async function dispatchVoter(
  deps: AdjudicationDeps,
  input: {
    readonly candidate: Candidate;
    readonly groundingLines: string;
    readonly lens: AdversaryLens | undefined;
    readonly tier: VoterOutcome['tier'];
    readonly round: number;
    readonly index: number;
  },
): Promise<VoterOutcome> {
  const { candidate, groundingLines, lens, tier, round, index } = input;
  const voterId = `${candidate.id}:${tier}:r${round}:${index}`;
  if (typeof setTimeout === 'function' && deps.jitterMs > 0) {
    await new Promise((done) => setTimeout(done, deterministicJitterMs(voterId, deps.jitterMs)));
  }
  const judgment = await deps.agent(votePrompt({ candidate, lens, groundingLines }), {
    label: `vote:${candidate.id}:${tier}:${lens ?? 'plain'}`,
    phase: 'validate',
    // Sonnet-5 voters (owner-decided 2026-07-02): the rigor lives in the deterministic
    // quorum structure and conjunctive tests; Opus is reserved for the synthesis stages
    // and the bounded post-run assurance leg. Recall calibration measures the regime.
    model: 'sonnet',
    effort: 'high',
    // The no-tools voter agent type: measured free-tool voters burned ~7 tool calls
    // and 350-800k input tokens each re-verifying supplied grounding; that check is
    // deterministic code in the post-run driver instead. Harness-enforced allow-list.
    agentType: 'corpus-voter',
    schema: AGENT_JSON_SCHEMAS.voterJudgment,
  });
  if (judgment === null) {
    return {
      status: 'unadjudicated',
      candidateId: candidate.id,
      voterId,
      tier,
      reason: 'retry-cap',
    };
  }
  const verdict = lens === undefined ? judgment : { ...judgment, lens };
  return { status: 'adjudicated', candidateId: candidate.id, voterId, tier, verdict };
}

/**
 * Create the per-candidate adjudicator over the seeded grounding leaves. The returned
 * function is what `runCapped` throttles in the validate stage.
 */
export function createCandidateAdjudicator(
  deps: AdjudicationDeps,
  leafById: ReadonlyMap<string, GroundingLeaf>,
): (candidate: Candidate) => Promise<AdjudicatedCandidate> {
  return async function adjudicateCandidate(candidate: Candidate): Promise<AdjudicatedCandidate> {
    const groundingLines = assembleGroundingLines(candidate, leafById);
    const outcomes: VoterOutcome[] = [];
    for (let round = 0; round < deps.maxRounds; round += 1) {
      const step = adjudicate({ outcomes });
      if (step.kind === 'terminal') {
        return {
          candidateId: candidate.id,
          disposition: step.disposition,
          reason: step.reason ?? null,
          outcomes,
        };
      }
      const lenses = step.lenses ?? [];
      const voterIndexes = Array.from({ length: step.voterCount }, (_, index) => index);
      const voters = await deps.parallel(
        voterIndexes.map(
          (index) => () =>
            dispatchVoter(deps, {
              candidate,
              groundingLines,
              lens: lenses[index],
              tier: step.tier,
              round,
              index,
            }),
        ),
      );
      for (const outcome of voters) {
        if (outcome !== null) {
          outcomes.push(outcome);
        }
      }
    }
    return {
      candidateId: candidate.id,
      disposition: 'held-for-review',
      reason: 'retry-cap',
      outcomes,
    };
  };
}
