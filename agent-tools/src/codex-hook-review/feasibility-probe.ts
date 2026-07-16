import { Buffer } from 'node:buffer';

import {
  type BenchmarkFailureKind,
  type BenchmarkReviewRunner,
  type BenchmarkRunOutcome,
} from './benchmark.js';
import { CALIBRATION_CORPUS } from './corpus.js';
import { createReviewPayload } from './payload.js';
import {
  TOURNAMENT_CELLS,
  type TournamentCell,
  type TournamentCellId,
} from './tournament-types.js';
import { type BenchmarkCase, type ReviewDecision } from './types.js';

export const CODEX_REVIEW_FEASIBILITY_PROBE_VERSION = '1';
const FEASIBILITY_PROBE_TIMEOUT_MS = 4_000;

const FEASIBILITY_CASE_IDS = ['cal-easy-concern-config-01', 'cal-easy-clean-config-01'] as const;

export const FEASIBILITY_PROBE_CELLS = TOURNAMENT_CELLS.filter(
  (cell) => cell.mechanism === 'inline',
);

type FeasibilityProbeSample =
  | {
      readonly cellId: TournamentCellId;
      readonly caseId: string;
      readonly expected: BenchmarkCase['expected']['label'];
      readonly kind: 'completed';
      readonly durationMs: number;
      readonly reviewerDurationMs?: number;
      readonly reasoningItemCount?: number;
      readonly decision: ReviewDecision;
      readonly correct: boolean;
      readonly inputTokens: number;
      readonly cachedInputTokens: number;
      readonly outputTokens: number;
    }
  | {
      readonly cellId: TournamentCellId;
      readonly caseId: string;
      readonly expected: BenchmarkCase['expected']['label'];
      readonly kind: 'failed';
      readonly reason: BenchmarkFailureKind;
      readonly durationMs?: number;
    };

export interface CodexReviewFeasibilityProbeReport {
  readonly schemaVersion: 1;
  readonly probeVersion: typeof CODEX_REVIEW_FEASIBILITY_PROBE_VERSION;
  readonly completedAt: string;
  readonly samples: readonly FeasibilityProbeSample[];
  readonly viableCellIds: readonly TournamentCellId[];
  readonly viable: boolean;
  readonly failure?: 'invalid-probe-corpus' | 'no-viable-inline-lane';
}

/** Run the six non-qualifying inline samples that precede the full tournament. */
export async function runFeasibilityProbe(input: {
  readonly runner: BenchmarkReviewRunner;
  readonly completedAt: string;
}): Promise<CodexReviewFeasibilityProbeReport> {
  const cases = feasibilityCases();
  if (cases.length !== FEASIBILITY_CASE_IDS.length) {
    return report(input.completedAt, [], [], 'invalid-probe-corpus');
  }
  const samples: FeasibilityProbeSample[] = [];
  for (const benchmarkCase of cases) {
    for (const cell of FEASIBILITY_PROBE_CELLS) {
      samples.push(await runSample(cell, benchmarkCase, input.runner));
    }
  }
  const viableCellIds = FEASIBILITY_PROBE_CELLS.filter((cell) =>
    cellIsViable(cell.id, samples),
  ).map((cell) => cell.id);
  return report(
    input.completedAt,
    samples,
    viableCellIds,
    viableCellIds.length === 0 ? 'no-viable-inline-lane' : undefined,
  );
}

function feasibilityCases(): readonly BenchmarkCase[] {
  return FEASIBILITY_CASE_IDS.flatMap((caseId) => {
    const benchmarkCase = CALIBRATION_CORPUS.find((candidate) => candidate.id === caseId);
    return benchmarkCase === undefined ? [] : [benchmarkCase];
  });
}

async function runSample(
  cell: TournamentCell,
  benchmarkCase: BenchmarkCase,
  runner: BenchmarkReviewRunner,
): Promise<FeasibilityProbeSample> {
  const outcome = await runBoundedCase(cell, benchmarkCase, runner);
  const identity = {
    cellId: cell.id,
    caseId: benchmarkCase.id,
    expected: benchmarkCase.expected.label,
  } as const;
  if (outcome.kind === 'failed') {
    return { ...identity, kind: 'failed', reason: outcome.reason, durationMs: outcome.durationMs };
  }
  return {
    ...identity,
    kind: 'completed',
    durationMs: outcome.durationMs,
    ...(outcome.reviewerDurationMs === undefined
      ? {}
      : { reviewerDurationMs: outcome.reviewerDurationMs }),
    ...(outcome.reasoningItemCount === undefined
      ? {}
      : { reasoningItemCount: outcome.reasoningItemCount }),
    decision: outcome.decision,
    correct: decisionMatches(outcome.decision, benchmarkCase),
    inputTokens: outcome.usage.inputTokens,
    cachedInputTokens: outcome.usage.cachedInputTokens,
    outputTokens: outcome.usage.outputTokens,
  };
}

async function runBoundedCase(
  cell: TournamentCell,
  benchmarkCase: BenchmarkCase,
  runner: BenchmarkReviewRunner,
): Promise<BenchmarkRunOutcome> {
  const payload = JSON.stringify(createReviewPayload(benchmarkCase.changes));
  const changeCount = boundedChangeCount(benchmarkCase.changes.length);
  if (Buffer.byteLength(payload, 'utf8') > 4_096 || changeCount === undefined) {
    return { kind: 'failed', reason: 'process-failure' };
  }
  try {
    return await runner.run({ cell, payload, changeCount });
  } catch {
    return { kind: 'failed', reason: 'process-failure' };
  }
}

function decisionMatches(decision: ReviewDecision, benchmarkCase: BenchmarkCase): boolean {
  if (benchmarkCase.expected.label === 'clean') {
    return decision.verdict === 'pass';
  }
  return (
    decision.verdict === 'concern' &&
    decision.kind === benchmarkCase.expected.concernKind &&
    decision.change_index === benchmarkCase.expected.changeIndex
  );
}

function cellIsViable(
  cellId: TournamentCellId,
  samples: readonly FeasibilityProbeSample[],
): boolean {
  const cellSamples = samples.filter((sample) => sample.cellId === cellId);
  return (
    cellSamples.length === FEASIBILITY_CASE_IDS.length &&
    cellSamples.every(
      (sample) =>
        sample.kind === 'completed' &&
        sample.correct &&
        sample.durationMs <= FEASIBILITY_PROBE_TIMEOUT_MS,
    )
  );
}

function boundedChangeCount(value: number): 1 | 2 | 3 | undefined {
  return value === 1 || value === 2 || value === 3 ? value : undefined;
}

function report(
  completedAt: string,
  samples: readonly FeasibilityProbeSample[],
  viableCellIds: readonly TournamentCellId[],
  failure?: CodexReviewFeasibilityProbeReport['failure'],
): CodexReviewFeasibilityProbeReport {
  return {
    schemaVersion: 1,
    probeVersion: CODEX_REVIEW_FEASIBILITY_PROBE_VERSION,
    completedAt,
    samples,
    viableCellIds,
    viable: viableCellIds.length > 0,
    ...(failure === undefined ? {} : { failure }),
  };
}
