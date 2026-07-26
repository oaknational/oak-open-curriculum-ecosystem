/**
 * Deterministic pre-spend cost model and map-coverage check for the large-corpus-analysis
 * pipeline (v2 design changes 5 and 7).
 *
 * Cost is arithmetic over a known stage partition and an explicit effort table — never
 * inherited from the session. The v1 run overspent (~4.4M tokens against a ~1.3M estimate,
 * rate-limit-truncated) precisely because effort was omitted and xhigh was inherited on all
 * 14 map agents. Here every stage names its effort as data, so the estimate is honest and a
 * ceiling can gate the run before the spend.
 */

/** Reasoning-effort tiers. The multiplier table below is calibration DATA, not a constant. */
export type Effort = 'low' | 'medium' | 'high' | 'xhigh';

/**
 * Default effort multipliers — how much a tier inflates a stage's token estimate relative to
 * a low-effort baseline. Calibration data: override per run as the model and tiering evolve.
 */
export const DEFAULT_EFFORT_MULTIPLIERS: Record<Effort, number> = {
  low: 1,
  medium: 1.5,
  high: 2.5,
  xhigh: 4,
};

export interface StagePlan {
  readonly name: string;
  /** How many times this stage is invoked (e.g. 14 map windows, candidates times voters). */
  readonly invocations: number;
  /** Input-plus-output token estimate for a single invocation at the baseline effort. */
  readonly tokensPerInvocation: number;
  readonly effort: Effort;
}

export interface StageCost {
  readonly name: string;
  readonly tokens: number;
}

export interface CostEstimate {
  readonly perStage: readonly StageCost[];
  readonly totalTokens: number;
  readonly ceiling: number;
  /** Whether the estimate is within the abort ceiling — the pre-spend gate. */
  readonly withinCeiling: boolean;
}

/**
 * Estimate the whole pipeline's token cost and gate it against a ceiling. Each stage's cost
 * is invocations times per-invocation tokens times its effort multiplier; the total is
 * compared to the ceiling before any agent is dispatched.
 */
export function estimatePipelineCost(input: {
  readonly stages: readonly StagePlan[];
  readonly ceiling: number;
  readonly effortMultipliers?: Record<Effort, number>;
}): CostEstimate {
  const multipliers = input.effortMultipliers ?? DEFAULT_EFFORT_MULTIPLIERS;
  const perStage = input.stages.map((stage): StageCost => ({
    name: stage.name,
    tokens: Math.round(stage.invocations * stage.tokensPerInvocation * multipliers[stage.effort]),
  }));
  const totalTokens = perStage.reduce((sum, stage) => sum + stage.tokens, 0);
  return {
    perStage,
    totalTokens,
    ceiling: input.ceiling,
    withinCeiling: totalTokens <= input.ceiling,
  };
}

/** Tier-2 diverse-lens ensemble size (mirrors aggregation-adjudication.ts TIER_2_LENSES). */
const TIER_2_ENSEMBLE_SIZE = 3;

/**
 * Worst-case voters the validate stage dispatches for one candidate. The adjudication state
 * machine dispatches at most Tier 0 (1) + Tier 1 (1) + the Tier-2 ensemble (3) = 5 before a
 * terminal disposition; a Tier-0 kill terminates on 1, so this is a conservative ceiling.
 */
export const MAX_VOTERS_PER_CANDIDATE = 1 + 1 + TIER_2_ENSEMBLE_SIZE;

/**
 * The POST-REDUCE cost re-gate input. Build the validate stage plan from the REAL candidate
 * count — the number that actually drives validate spend but is unknowable until reduce runs.
 * Re-run `estimatePipelineCost` with this stage AFTER reduce, never before: the v2 first run
 * overran (~3.5M against a ~1.7M pre-spend estimate) precisely because validate invocations
 * were guessed from a prior run's candidate count (~20) rather than recomputed once reduce
 * produced its actual candidates (50). Worst-case voter count keeps the gate conservative — it
 * over-warns rather than under-warns, which is the correct asymmetry for a spend gate.
 */
export function validateStagePlan(input: {
  readonly candidateCount: number;
  readonly tokensPerVoter: number;
  readonly effort: Effort;
  readonly maxVotersPerCandidate?: number;
}): StagePlan {
  const perCandidate = input.maxVotersPerCandidate ?? MAX_VOTERS_PER_CANDIDATE;
  return {
    name: 'validate',
    invocations: input.candidateCount * perCandidate,
    tokensPerInvocation: input.tokensPerVoter,
    effort: input.effort,
  };
}

export interface WindowExtraction {
  readonly window: string;
  readonly leafCount: number;
}

export interface CoverageReport {
  readonly medianLeafCount: number;
  /** Windows that extracted nothing, or far below the median — silent under-extraction. */
  readonly underExtracting: readonly string[];
}

function median(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Flag windows that silently under-extracted — the upstream analogue of the C06 stranded
 * voter. A window with zero leaves, or far below the median leaf count (default a quarter),
 * is surfaced so the run is not scored over a window that quietly contributed nothing. The
 * floor is exclusive: a window exactly at `minFraction` times the median is not flagged.
 */
export function checkMapCoverage(input: {
  readonly windows: readonly WindowExtraction[];
  readonly minFraction?: number;
}): CoverageReport {
  const minFraction = input.minFraction ?? 0.25;
  const medianLeafCount = median(input.windows.map((window) => window.leafCount));
  const floor = medianLeafCount * minFraction;
  const underExtracting = input.windows
    .filter((window) => window.leafCount === 0 || window.leafCount < floor)
    .map((window) => window.window);
  return { medianLeafCount, underExtracting };
}
