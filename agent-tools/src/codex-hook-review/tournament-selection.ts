import { err, ok, type Result } from '@oaknational/result';

import { assessTournamentCell } from './tournament-assessment.js';
import {
  INSTRUCTION_MECHANISMS,
  MODEL_CONFIGURATIONS,
  TOURNAMENT_CELLS,
  type CalibrationSelection,
  type ModelConfigurationId,
  type TournamentCellAssessment,
  type TournamentCellEvidence,
  type TournamentCellId,
  type TournamentSelection,
  type TournamentSelectionError,
} from './tournament-types.js';

function hasCompleteCellSet(evidence: readonly TournamentCellEvidence[]): boolean {
  return (
    evidence.length === TOURNAMENT_CELLS.length &&
    TOURNAMENT_CELLS.every(
      (cell) => evidence.filter((candidate) => candidate.cellId === cell.id).length === 1,
    )
  );
}

function hasOneFinalistPerModel(finalistIds: readonly TournamentCellId[]): boolean {
  if (finalistIds.length !== MODEL_CONFIGURATIONS.length) {
    return false;
  }
  return MODEL_CONFIGURATIONS.every((model) => {
    const finalistCells = TOURNAMENT_CELLS.filter((cell) =>
      finalistIds.some((id) => id === cell.id),
    );
    return finalistCells.filter((cell) => cell.modelConfigurationId === model.id).length === 1;
  });
}

function mechanismRank(assessment: TournamentCellAssessment): number {
  return INSTRUCTION_MECHANISMS.findIndex((mechanism) => mechanism === assessment.cell.mechanism);
}

function cellRank(assessment: TournamentCellAssessment): number {
  return TOURNAMENT_CELLS.findIndex((cell) => cell.id === assessment.cell.id);
}

function compareNearFastest(
  left: TournamentCellAssessment,
  right: TournamentCellAssessment,
): number {
  if (left.p50LatencyMs !== right.p50LatencyMs) {
    return left.p50LatencyMs - right.p50LatencyMs;
  }
  if (left.medianUncachedInputTokens !== right.medianUncachedInputTokens) {
    return left.medianUncachedInputTokens - right.medianUncachedInputTokens;
  }
  const mechanismDifference = mechanismRank(left) - mechanismRank(right);
  return mechanismDifference === 0 ? cellRank(left) - cellRank(right) : mechanismDifference;
}

function chooseWinner(
  qualified: readonly TournamentCellAssessment[],
): TournamentCellAssessment | undefined {
  const fastestP95 = Math.min(...qualified.map((assessment) => assessment.p95LatencyMs));
  const nearFastest = qualified.filter((assessment) => assessment.p95LatencyMs <= fastestP95 + 100);
  return [...nearFastest].sort(compareNearFastest)[0];
}

function dominates(left: TournamentCellAssessment, right: TournamentCellAssessment): boolean {
  const noWorse =
    left.concernDetectionRate >= right.concernDetectionRate &&
    left.falseAlertRate <= right.falseAlertRate &&
    left.p95LatencyMs <= right.p95LatencyMs &&
    left.medianUncachedInputTokens <= right.medianUncachedInputTokens;
  const better =
    left.concernDetectionRate > right.concernDetectionRate ||
    left.falseAlertRate < right.falseAlertRate ||
    left.p95LatencyMs < right.p95LatencyMs ||
    left.medianUncachedInputTokens < right.medianUncachedInputTokens;
  return noWorse && better;
}

/** Retain every non-dominated measured trade-off for later optimisation. */
function findParetoFrontier(
  assessments: readonly TournamentCellAssessment[],
): readonly TournamentCellAssessment[] {
  return assessments.filter(
    (candidate) =>
      !assessments.some(
        (other) => other.cell.id !== candidate.cell.id && dominates(other, candidate),
      ),
  );
}

function assessAll(
  evidence: readonly TournamentCellEvidence[],
): Result<readonly TournamentCellAssessment[], TournamentSelectionError> {
  const assessments: TournamentCellAssessment[] = [];
  for (const cellEvidence of evidence) {
    const assessment = assessTournamentCell(cellEvidence);
    if (!assessment.ok) {
      return assessment;
    }
    assessments.push(assessment.value);
  }
  return ok(assessments);
}

function selectModelFinalist(
  modelConfigurationId: ModelConfigurationId,
  assessments: readonly TournamentCellAssessment[],
): Result<TournamentCellAssessment, TournamentSelectionError> {
  const modelAssessments = assessments.filter(
    (assessment) => assessment.cell.modelConfigurationId === modelConfigurationId,
  );
  const winner = chooseCalibrationWinner(modelAssessments);
  if (winner === undefined) {
    return err({ kind: 'incomplete-tournament', detail: 'model lane has no calibration cell' });
  }
  return ok(winner);
}

function chooseCalibrationWinner(
  assessments: readonly TournamentCellAssessment[],
): TournamentCellAssessment | undefined {
  let candidates = [...assessments];
  const bestDetection = Math.max(...candidates.map((candidate) => candidate.concernDetectionRate));
  candidates = candidates.filter((candidate) => candidate.concernDetectionRate === bestDetection);
  const bestFalseAlert = Math.min(...candidates.map((candidate) => candidate.falseAlertRate));
  candidates = candidates.filter((candidate) => candidate.falseAlertRate === bestFalseAlert);
  const fewestFailures = Math.min(
    ...candidates.map((candidate) => candidate.reliabilityFailureCount),
  );
  candidates = candidates.filter(
    (candidate) => candidate.reliabilityFailureCount === fewestFailures,
  );
  return chooseWinner(candidates);
}

/** Select the strongest observed instruction mechanism per model from all nine calibration cells. */
export function selectCalibrationFinalists(
  evidence: readonly TournamentCellEvidence[],
): Result<CalibrationSelection, TournamentSelectionError> {
  if (!hasCompleteCellSet(evidence)) {
    return err({ kind: 'incomplete-tournament', detail: 'expected each calibration cell once' });
  }
  const assessed = assessAll(evidence);
  if (!assessed.ok) {
    return assessed;
  }
  const finalists: TournamentCellAssessment[] = [];
  for (const model of MODEL_CONFIGURATIONS) {
    const finalist = selectModelFinalist(model.id, assessed.value);
    if (!finalist.ok) {
      return finalist;
    }
    finalists.push(finalist.value);
  }
  return ok({ finalists, assessments: assessed.value });
}

/** Select the final winner only from the three calibration-selected held-out lanes. */
export function selectHeldOutWinner(
  evidence: readonly TournamentCellEvidence[],
  finalistIds: readonly TournamentCellId[],
): Result<TournamentSelection, TournamentSelectionError> {
  if (!hasOneFinalistPerModel(finalistIds)) {
    return err({ kind: 'invalid-finalists', detail: 'expected one finalist per model' });
  }
  const evidenceMatches =
    evidence.length === finalistIds.length &&
    finalistIds.every((id) => evidence.filter((candidate) => candidate.cellId === id).length === 1);
  if (!evidenceMatches) {
    return err({ kind: 'invalid-finalists', detail: 'held-out evidence must match finalists' });
  }
  const assessed = assessAll(evidence);
  if (!assessed.ok) {
    return assessed;
  }
  const qualified = assessed.value.filter((assessment) => assessment.qualified);
  const winner = chooseWinner(qualified);
  if (winner === undefined) {
    return err({ kind: 'no-qualified-cell', assessments: assessed.value });
  }
  return ok({
    winner,
    assessments: assessed.value,
    paretoFrontier: findParetoFrontier(assessed.value),
  });
}
