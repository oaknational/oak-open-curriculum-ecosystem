import { type BenchmarkFailureKind, type BenchmarkRunOutcome } from './benchmark-run-contract.js';
import {
  type QualityByDifficulty,
  type TournamentCellEvidence,
  type TournamentCellId,
} from './tournament-types.js';
import {
  type BenchmarkCase,
  type ConcernDecision,
  type Difficulty,
  type ReviewDecision,
} from './types.js';

interface EvidenceAccumulator {
  readonly cellId: TournamentCellId;
  readonly quality: MutableQualityByDifficulty;
  readonly latencies: number[];
  readonly inputTokens: number[];
  readonly cachedInputTokens: number[];
  readonly uncachedInputTokens: number[];
  readonly outputTokens: number[];
  readonly failures: Record<BenchmarkFailureKind, number>;
}

type MutableQualityByDifficulty = Record<Difficulty, MutableTierQualityCounts>;

interface MutableTierQualityCounts {
  concernCases: number;
  detectedConcerns: number;
  cleanCases: number;
  falseAlerts: number;
}

export function createAccumulator(cellId: TournamentCellId): EvidenceAccumulator {
  return {
    cellId,
    quality: {
      easy: emptyTier(),
      medium: emptyTier(),
      hard: emptyTier(),
    },
    latencies: [],
    inputTokens: [],
    cachedInputTokens: [],
    uncachedInputTokens: [],
    outputTokens: [],
    failures: {
      'hard-timeout': 0,
      'schema-failure': 0,
      'orphan-event': 0,
      'dynamic-tool-event': 0,
      'unknown-event': 0,
      'process-failure': 0,
    },
  };
}

function emptyTier(): MutableTierQualityCounts {
  return { concernCases: 0, detectedConcerns: 0, cleanCases: 0, falseAlerts: 0 };
}

export function recordOutcome(
  accumulator: EvidenceAccumulator,
  benchmarkCase: BenchmarkCase,
  outcome: BenchmarkRunOutcome,
): void {
  const tier = accumulator.quality[benchmarkCase.difficulty];
  if (benchmarkCase.expected.label === 'concern') {
    tier.concernCases += 1;
  } else {
    tier.cleanCases += 1;
  }
  if (outcome.kind === 'failed') {
    accumulator.failures[outcome.reason] += 1;
    return;
  }
  accumulator.latencies.push(outcome.durationMs);
  accumulator.inputTokens.push(outcome.usage.inputTokens);
  accumulator.cachedInputTokens.push(outcome.usage.cachedInputTokens);
  accumulator.uncachedInputTokens.push(
    Math.max(0, outcome.usage.inputTokens - outcome.usage.cachedInputTokens),
  );
  accumulator.outputTokens.push(outcome.usage.outputTokens);
  if (benchmarkCase.expected.label === 'concern') {
    if (matchesConcern(outcome.decision, benchmarkCase.expected)) {
      tier.detectedConcerns += 1;
    }
  } else if (outcome.decision.verdict === 'concern') {
    tier.falseAlerts += 1;
  }
}

function matchesConcern(
  decision: ReviewDecision,
  expected: Extract<BenchmarkCase['expected'], { readonly label: 'concern' }>,
): decision is ConcernDecision {
  return (
    decision.verdict === 'concern' &&
    decision.kind === expected.concernKind &&
    decision.change_index === expected.changeIndex
  );
}

export function finishEvidence(accumulator: EvidenceAccumulator): TournamentCellEvidence {
  const quality: QualityByDifficulty = accumulator.quality;
  return {
    cellId: accumulator.cellId,
    quality,
    completedLatencyMs: accumulator.latencies,
    medianInputTokens: median(accumulator.inputTokens),
    medianCachedInputTokens: median(accumulator.cachedInputTokens),
    medianUncachedInputTokens: median(accumulator.uncachedInputTokens),
    medianOutputTokens: median(accumulator.outputTokens),
    totalInputTokens: sum(accumulator.inputTokens),
    totalCachedInputTokens: sum(accumulator.cachedInputTokens),
    totalUncachedInputTokens: sum(accumulator.uncachedInputTokens),
    totalOutputTokens: sum(accumulator.outputTokens),
    hardTimeoutCount: accumulator.failures['hard-timeout'],
    schemaFailureCount: accumulator.failures['schema-failure'],
    orphanEventCount: accumulator.failures['orphan-event'],
    dynamicToolEventCount: accumulator.failures['dynamic-tool-event'],
    unknownEventCount: accumulator.failures['unknown-event'],
    processFailureCount: accumulator.failures['process-failure'],
  };
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function median(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle] ?? 0;
  }
  return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
}
