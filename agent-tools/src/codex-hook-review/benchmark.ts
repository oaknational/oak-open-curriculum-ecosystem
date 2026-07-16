import { Buffer } from 'node:buffer';

import { createAccumulator, finishEvidence, recordOutcome } from './benchmark-evidence.js';
import {
  type BenchmarkFailureKind,
  type BenchmarkReviewRunner,
  type BenchmarkRunOutcome,
} from './benchmark-run-contract.js';
import { CALIBRATION_CORPUS, HELD_OUT_CORPUS } from './corpus.js';
import { createReviewPayload } from './payload.js';
import { selectCalibrationFinalists, selectHeldOutWinner } from './tournament-selection.js';
import {
  TOURNAMENT_CELLS,
  type TournamentCell,
  type TournamentCellEvidence,
  type TournamentCellId,
  type TournamentSelection,
} from './tournament-types.js';
import { type BenchmarkCase } from './types.js';

export const CODEX_REVIEW_BENCHMARK_VERSION = '1';

export type {
  BenchmarkFailureKind,
  BenchmarkReviewRunner,
  BenchmarkRunOutcome,
} from './benchmark-run-contract.js';

interface ColdProbeResult {
  readonly cellId: TournamentCellId;
  readonly outcome: 'completed' | BenchmarkFailureKind;
  readonly durationMs?: number;
}

interface BenchmarkStageReport {
  readonly evidence: readonly TournamentCellEvidence[];
}

export interface CodexReviewBenchmarkReport {
  readonly schemaVersion: 1;
  readonly benchmarkVersion: typeof CODEX_REVIEW_BENCHMARK_VERSION;
  readonly completedAt: string;
  readonly coldProbes: readonly ColdProbeResult[];
  readonly calibration: BenchmarkStageReport;
  readonly finalistCellIds: readonly TournamentCellId[];
  readonly heldOut: BenchmarkStageReport;
  readonly qualified: boolean;
  readonly selection?: TournamentSelection;
  readonly failure?: 'cold-probe-failed' | 'calibration-invalid' | 'no-held-out-qualifier';
}

/** Execute the frozen 9-cell calibration and 3-finalist held-out tournament. */
export async function runReviewTournament(input: {
  readonly runner: BenchmarkReviewRunner;
  readonly completedAt: string;
}): Promise<CodexReviewBenchmarkReport> {
  const coldProbes: ColdProbeResult[] = [];
  const calibrationEvidence: TournamentCellEvidence[] = [];
  const probeCase = CALIBRATION_CORPUS[0];

  coldProbes.push(...(await runColdProbes(probeCase, input.runner)));
  if (coldProbes.some((probe) => probe.outcome !== 'completed')) {
    return baseReport(input.completedAt, coldProbes, [], [], [], {
      qualified: false,
      failure: 'cold-probe-failed',
    });
  }
  calibrationEvidence.push(...(await runStage(TOURNAMENT_CELLS, CALIBRATION_CORPUS, input.runner)));

  const calibration = selectCalibrationFinalists(calibrationEvidence);
  if (!calibration.ok) {
    return baseReport(input.completedAt, coldProbes, calibrationEvidence, [], [], {
      qualified: false,
      failure: 'calibration-invalid',
    });
  }

  const finalistCellIds = calibration.value.finalists.map((assessment) => assessment.cell.id);
  const finalistCells = TOURNAMENT_CELLS.filter((cell) =>
    finalistCellIds.some((id) => id === cell.id),
  );
  const heldOutEvidence = await runStage(finalistCells, HELD_OUT_CORPUS, input.runner);
  const selection = selectHeldOutWinner(heldOutEvidence, finalistCellIds);
  if (!selection.ok) {
    return baseReport(
      input.completedAt,
      coldProbes,
      calibrationEvidence,
      finalistCellIds,
      heldOutEvidence,
      { qualified: false, failure: 'no-held-out-qualifier' },
    );
  }
  return baseReport(
    input.completedAt,
    coldProbes,
    calibrationEvidence,
    finalistCellIds,
    heldOutEvidence,
    { qualified: true, selection: selection.value },
  );
}

async function runColdProbes(
  benchmarkCase: BenchmarkCase,
  runner: BenchmarkReviewRunner,
): Promise<readonly ColdProbeResult[]> {
  const probes: ColdProbeResult[] = [];
  for (const cell of TOURNAMENT_CELLS) {
    probes.push(await runColdProbe(cell, benchmarkCase, runner));
  }
  return probes;
}

function baseReport(
  completedAt: string,
  coldProbes: readonly ColdProbeResult[],
  calibrationEvidence: readonly TournamentCellEvidence[],
  finalistCellIds: readonly TournamentCellId[],
  heldOutEvidence: readonly TournamentCellEvidence[],
  outcome: Pick<CodexReviewBenchmarkReport, 'qualified' | 'selection' | 'failure'>,
): CodexReviewBenchmarkReport {
  return {
    schemaVersion: 1,
    benchmarkVersion: CODEX_REVIEW_BENCHMARK_VERSION,
    completedAt,
    coldProbes,
    calibration: { evidence: calibrationEvidence },
    finalistCellIds,
    heldOut: { evidence: heldOutEvidence },
    ...outcome,
  };
}

async function runColdProbe(
  cell: TournamentCell,
  benchmarkCase: BenchmarkCase,
  runner: BenchmarkReviewRunner,
): Promise<ColdProbeResult> {
  const outcome = await safeRun(cell, benchmarkCase, runner);
  return outcome.kind === 'completed'
    ? { cellId: cell.id, outcome: 'completed', durationMs: outcome.durationMs }
    : { cellId: cell.id, outcome: outcome.reason, durationMs: outcome.durationMs };
}

async function runStage(
  cells: readonly TournamentCell[],
  cases: readonly BenchmarkCase[],
  runner: BenchmarkReviewRunner,
): Promise<readonly TournamentCellEvidence[]> {
  const entries = cells.map((cell) => ({ cell, accumulator: createAccumulator(cell.id) }));
  for (const [caseIndex, benchmarkCase] of cases.entries()) {
    for (let offset = 0; offset < entries.length; offset += 1) {
      const entry = entries[(caseIndex + offset) % entries.length];
      if (entry !== undefined) {
        const outcome = await safeRun(entry.cell, benchmarkCase, runner);
        recordOutcome(entry.accumulator, benchmarkCase, outcome);
      }
    }
  }
  return entries.map((entry) => finishEvidence(entry.accumulator));
}

async function safeRun(
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
    return await runner.run({
      cell,
      payload,
      changeCount,
    });
  } catch {
    return { kind: 'failed', reason: 'process-failure' };
  }
}

function boundedChangeCount(value: number): 1 | 2 | 3 | undefined {
  if (value === 1 || value === 2 || value === 3) {
    return value;
  }
  return undefined;
}
