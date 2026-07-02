/**
 * Deterministic strength-of-evidence triage for the discovery pipeline's survivors.
 *
 * @remarks
 * The owner-requested triage signal for a later manual review round: per surviving
 * (kept or rerouted) candidate an evidence vector assembled from the recorded stage
 * outputs, banded by the documented deterministic policy in `./triage-banding.ts`. No
 * LLM ever emits a score (PDR-122: agents judge atomically, code computes aggregates).
 *
 * Ordinal medians take the lower-middle element on even counts (conservative), and the
 * testimony scope is every adjudicated verdict in the result that resolved the
 * candidate — a contested path (e.g. a dissenting tier-0 before a unanimous quorum)
 * legitimately reads as weaker evidence.
 *
 * @packageDocumentation
 */

import type { AdversaryVerdict, Candidate, Confidence, VoterOutcome } from '../judgment-schemas.js';
import type { MetaOutput } from '../recall-schemas.js';
import type { Corroboration } from '../real-world-signal.js';
import { classifyVerdict, distinctGroundingWindows } from '../aggregation-verdict.js';
import type { VerdictDisposition } from '../aggregation-verdict.js';
import type { ValidateResult } from '../workflows/stage-io.js';
import type { TemporalCoverageEntry } from './post-run-analysis.js';
import { bandFor } from './triage-banding.js';
import type { AdjudicationPath, ReviewFirstTrigger, TriageBand } from './triage-banding.js';

type ValidateSuccess = Extract<ValidateResult, { ok: true }>;

/** One surviving candidate's evidence vector and its computed band. */
export interface TriageEntry {
  readonly candidateId: string;
  readonly disposition: 'keep' | 'reroute';
  readonly kind: Candidate['kind'];
  /** Distinct supporting windows, recomputed — never the self-reported count. */
  readonly distinctWindows: number;
  readonly groundingCount: number;
  readonly path: AdjudicationPath;
  /** Winning-votes-minus-refuters within the Tier-2 quorum; null on a clean keep. */
  readonly quorumMargin: number | null;
  readonly minTestConfidence: Confidence;
  readonly medianTestConfidence: Confidence;
  /** Lower-middle median of the resolving voters' importance ratings. */
  readonly importance: Confidence;
  /** The candidate re-found a known recall baseline. */
  readonly recallMatched: boolean;
  /** No existing on-disk home corroborates it — a genuinely new discovery. */
  readonly novel: boolean;
  readonly longitudinalSuspect: boolean;
  readonly band: TriageBand;
  readonly reviewFirstTriggers: readonly ReviewFirstTrigger[];
}

const CONFIDENCE_RANK: Record<Confidence, number> = { low: 0, med: 1, high: 2 };
const CONFIDENCE_BY_RANK: readonly Confidence[] = ['low', 'med', 'high'];

/**
 * Lower-middle median over an ordinal confidence list. An empty testimony deliberately
 * reads as `low` — a keep with no recorded adjudicated testimony routes review-first.
 */
function ordinalStats(confidences: readonly Confidence[]): {
  readonly min: Confidence;
  readonly median: Confidence;
} {
  if (confidences.length === 0) {
    return { min: 'low', median: 'low' };
  }
  const ranks = confidences.map((confidence) => CONFIDENCE_RANK[confidence]).sort((a, b) => a - b);
  return {
    min: CONFIDENCE_BY_RANK[ranks[0] ?? 0] ?? 'low',
    median: CONFIDENCE_BY_RANK[ranks[Math.floor((ranks.length - 1) / 2)] ?? 0] ?? 'low',
  };
}

function adjudicatedVerdicts(outcomes: readonly VoterOutcome[]): readonly AdversaryVerdict[] {
  return outcomes
    .filter(
      (outcome): outcome is Extract<VoterOutcome, { status: 'adjudicated' }> =>
        outcome.status === 'adjudicated',
    )
    .map((outcome) => outcome.verdict);
}

/** Every passing test judgment's confidence across the resolving testimony. */
function passingTestConfidences(verdicts: readonly AdversaryVerdict[]): readonly Confidence[] {
  return verdicts
    .flatMap((verdict) => [
      verdict.grounded,
      verdict.baseRateHolds,
      verdict.survivesNull,
      verdict.notArtefact,
    ])
    .filter((test) => test.pass)
    .map((test) => test.confidence);
}

/** One candidate's last terminal disposition and the resolving result's testimony. */
interface TerminalResolution {
  readonly disposition: 'keep' | 'kill' | 'reroute';
  readonly outcomes: readonly VoterOutcome[];
}

/**
 * The genuinely-last terminal disposition per candidate across resumed validate results
 * (in input order — pass checkpoint files chronologically). A later terminal entry,
 * INCLUDING a kill, supersedes an earlier one, so a cross-result contradiction can
 * never present a superseded keep as a survivor; holds are non-terminal and never
 * supersede.
 */
function terminalResolutions(
  validateResults: readonly ValidateSuccess[],
): ReadonlyMap<string, TerminalResolution> {
  const resolutions = new Map<string, TerminalResolution>();
  for (const result of validateResults) {
    for (const entry of result.dispositions) {
      if (entry.disposition === 'held-for-review') {
        continue;
      }
      resolutions.set(entry.candidateId, {
        disposition: entry.disposition,
        outcomes: result.voterOutcomes.filter(
          (outcome) => outcome.candidateId === entry.candidateId,
        ),
      });
    }
  }
  return resolutions;
}

/**
 * The quorum margin within the Tier-2 tally. Keep: keep-votes minus refuters; reroute:
 * reroute-votes minus kills (mirroring the quorum's reroute tie-break, which excludes
 * keep votes).
 */
function quorumMarginFor(
  disposition: 'keep' | 'reroute',
  tier2Verdicts: readonly AdversaryVerdict[],
): number {
  // The exhaustive tally literal is the compile-time guard: a new VerdictDisposition
  // member stops this compiling until handled (the frozen module's documented pattern).
  const tally: Record<VerdictDisposition, number> = { keep: 0, kill: 0, reroute: 0 };
  for (const verdict of tier2Verdicts) {
    tally[classifyVerdict(verdict)] += 1;
  }
  return disposition === 'keep'
    ? tally.keep - (tier2Verdicts.length - tally.keep)
    : tally.reroute - tally.kill;
}

function triageOne(input: {
  readonly candidate: Candidate;
  readonly disposition: 'keep' | 'reroute';
  readonly outcomes: readonly VoterOutcome[];
  readonly meta: MetaOutput;
  readonly temporalByCandidate: ReadonlyMap<string, TemporalCoverageEntry>;
  readonly corroborationByCandidate: ReadonlyMap<string, Corroboration>;
}): TriageEntry {
  const { candidate, disposition, outcomes } = input;
  const verdicts = adjudicatedVerdicts(outcomes);
  const tier2Verdicts = adjudicatedVerdicts(
    outcomes.filter((outcome) => outcome.tier === 'tier-2'),
  );
  let path: AdjudicationPath = 'clean-keep';
  if (disposition === 'reroute') {
    path = 'quorum-reroute';
  } else if (tier2Verdicts.length > 0) {
    path = 'quorum-keep';
  }
  const quorumMargin = path === 'clean-keep' ? null : quorumMarginFor(disposition, tier2Verdicts);
  const tests = ordinalStats(passingTestConfidences(verdicts));
  const importance = ordinalStats(verdicts.map((verdict) => verdict.importance)).median;
  const longitudinalSuspect = input.temporalByCandidate.get(candidate.id)?.suspect ?? false;
  const distinctWindows = distinctGroundingWindows(candidate);
  const banding = bandFor({
    path,
    quorumMargin,
    minTestConfidence: tests.min,
    distinctWindows,
    longitudinalSuspect,
  });
  return {
    candidateId: candidate.id,
    disposition,
    kind: candidate.kind,
    distinctWindows,
    groundingCount: candidate.groundingCount,
    path,
    quorumMargin,
    minTestConfidence: tests.min,
    medianTestConfidence: tests.median,
    importance,
    recallMatched: input.meta.recallMatches.some(
      (match) => match.matchedCandidateId === candidate.id,
    ),
    novel: !(input.corroborationByCandidate.get(candidate.id)?.isCorroborated ?? false),
    longitudinalSuspect,
    ...banding,
  };
}

/**
 * Assemble the evidence vector and band for every surviving candidate. Pure — the
 * caller supplies each stage's parsed output plus the deterministic temporal and
 * corroboration reports it already computed.
 */
export function triageDispositions(input: {
  readonly candidates: readonly Candidate[];
  readonly validateResults: readonly ValidateSuccess[];
  readonly meta: MetaOutput;
  readonly temporal: readonly TemporalCoverageEntry[];
  readonly corroborations: readonly Corroboration[];
}): readonly TriageEntry[] {
  const resolutions = terminalResolutions(input.validateResults);
  const temporalByCandidate = new Map(input.temporal.map((entry) => [entry.candidateId, entry]));
  const corroborationByCandidate = new Map(
    input.corroborations.map((entry) => [entry.candidateId, entry]),
  );
  return input.candidates.flatMap((candidate) => {
    const resolution = resolutions.get(candidate.id);
    if (resolution === undefined) {
      return [];
    }
    const { disposition, outcomes } = resolution;
    if (disposition === 'kill') {
      return [];
    }
    return [
      triageOne({
        candidate,
        disposition,
        outcomes,
        meta: input.meta,
        temporalByCandidate,
        corroborationByCandidate,
      }),
    ];
  });
}
