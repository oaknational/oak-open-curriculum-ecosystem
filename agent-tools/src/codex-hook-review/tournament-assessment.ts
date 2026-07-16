import { err, ok, type Result } from '@oaknational/result';

import {
  type DisqualificationReason,
  TOURNAMENT_CELLS,
  type TierQualityCounts,
  type TierQualityRates,
  type TournamentCellAssessment,
  type TournamentCellEvidence,
  type TournamentEvidenceError,
} from './tournament-types.js';

function validCount(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

function validTier(counts: TierQualityCounts): boolean {
  return (
    validCount(counts.concernCases) &&
    validCount(counts.detectedConcerns) &&
    validCount(counts.cleanCases) &&
    validCount(counts.falseAlerts) &&
    counts.concernCases > 0 &&
    counts.cleanCases > 0 &&
    counts.detectedConcerns <= counts.concernCases &&
    counts.falseAlerts <= counts.cleanCases
  );
}

function validateEvidence(evidence: TournamentCellEvidence): Result<void, TournamentEvidenceError> {
  const tiers = [evidence.quality.easy, evidence.quality.medium, evidence.quality.hard];
  const counters = [
    evidence.hardTimeoutCount,
    evidence.schemaFailureCount,
    evidence.orphanEventCount,
    evidence.dynamicToolEventCount,
    evidence.unknownEventCount,
    evidence.processFailureCount,
    evidence.medianInputTokens,
    evidence.medianCachedInputTokens,
    evidence.medianUncachedInputTokens,
    evidence.medianOutputTokens,
    evidence.totalInputTokens,
    evidence.totalCachedInputTokens,
    evidence.totalUncachedInputTokens,
    evidence.totalOutputTokens,
  ];
  const latenciesValid =
    evidence.completedLatencyMs.length > 0 &&
    evidence.completedLatencyMs.every((value) => Number.isFinite(value) && value >= 0);
  if (!tiers.every(validTier)) {
    return err({
      kind: 'invalid-evidence',
      cellId: evidence.cellId,
      detail: 'invalid tier counts',
    });
  }
  if (!counters.every(validCount)) {
    return err({ kind: 'invalid-evidence', cellId: evidence.cellId, detail: 'invalid counters' });
  }
  if (!latenciesValid) {
    return err({ kind: 'invalid-evidence', cellId: evidence.cellId, detail: 'invalid latencies' });
  }
  return ok(undefined);
}

function qualityRates(
  difficulty: TierQualityRates['difficulty'],
  counts: TierQualityCounts,
): TierQualityRates {
  return {
    difficulty,
    concernDetectionRate: counts.detectedConcerns / counts.concernCases,
    falseAlertRate: counts.falseAlerts / counts.cleanCases,
  };
}

function percentile(values: readonly number[], percentage: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.ceil(percentage * sorted.length) - 1;
  return sorted[index] ?? 0;
}

function disqualificationReasons(
  evidence: TournamentCellEvidence,
  detectionRate: number,
  falseAlertRate: number,
  p50: number,
  p95: number,
): readonly DisqualificationReason[] {
  const checks = [
    { failed: detectionRate < 0.8, reason: 'concern-detection-below-80-percent' },
    { failed: falseAlertRate > 0.1, reason: 'false-alerts-above-10-percent' },
    { failed: p50 > 2_500, reason: 'p50-above-2500ms' },
    { failed: p95 > 4_000, reason: 'p95-above-4000ms' },
    { failed: evidence.hardTimeoutCount > 0, reason: 'hard-timeout' },
    { failed: evidence.schemaFailureCount > 0, reason: 'schema-failure' },
    { failed: evidence.orphanEventCount > 0, reason: 'orphan-event' },
    { failed: evidence.dynamicToolEventCount > 0, reason: 'dynamic-tool-event' },
    { failed: evidence.unknownEventCount > 0, reason: 'unknown-event' },
    { failed: evidence.processFailureCount > 0, reason: 'process-failure' },
  ] as const satisfies readonly {
    readonly failed: boolean;
    readonly reason: DisqualificationReason;
  }[];
  return checks.filter((check) => check.failed).map((check) => check.reason);
}

interface AggregatedQuality {
  readonly tiers: readonly TierQualityRates[];
  readonly detectionRate: number;
  readonly falseAlertRate: number;
}

function aggregateQuality(evidence: TournamentCellEvidence): AggregatedQuality {
  const tiers = [
    qualityRates('easy', evidence.quality.easy),
    qualityRates('medium', evidence.quality.medium),
    qualityRates('hard', evidence.quality.hard),
  ];
  const concernCases =
    evidence.quality.easy.concernCases +
    evidence.quality.medium.concernCases +
    evidence.quality.hard.concernCases;
  const cleanCases =
    evidence.quality.easy.cleanCases +
    evidence.quality.medium.cleanCases +
    evidence.quality.hard.cleanCases;
  const detectedConcerns =
    evidence.quality.easy.detectedConcerns +
    evidence.quality.medium.detectedConcerns +
    evidence.quality.hard.detectedConcerns;
  const falseAlerts =
    evidence.quality.easy.falseAlerts +
    evidence.quality.medium.falseAlerts +
    evidence.quality.hard.falseAlerts;
  return {
    tiers,
    detectionRate: detectedConcerns / concernCases,
    falseAlertRate: falseAlerts / cleanCases,
  };
}

/** Assess one tournament cell against the frozen quality and reliability contract. */
export function assessTournamentCell(
  evidence: TournamentCellEvidence,
): Result<TournamentCellAssessment, TournamentEvidenceError> {
  const validation = validateEvidence(evidence);
  if (!validation.ok) {
    return validation;
  }
  const quality = aggregateQuality(evidence);
  const p50 = percentile(evidence.completedLatencyMs, 0.5);
  const p95 = percentile(evidence.completedLatencyMs, 0.95);
  const reasons = disqualificationReasons(
    evidence,
    quality.detectionRate,
    quality.falseAlertRate,
    p50,
    p95,
  );
  const cell = TOURNAMENT_CELLS.find((candidate) => candidate.id === evidence.cellId);
  if (cell === undefined) {
    return err({ kind: 'invalid-evidence', cellId: evidence.cellId, detail: 'unknown cell' });
  }
  return ok({
    cell,
    concernDetectionRate: quality.detectionRate,
    falseAlertRate: quality.falseAlertRate,
    qualityByDifficulty: quality.tiers,
    p50LatencyMs: p50,
    p95LatencyMs: p95,
    medianInputTokens: evidence.medianInputTokens,
    medianCachedInputTokens: evidence.medianCachedInputTokens,
    medianUncachedInputTokens: evidence.medianUncachedInputTokens,
    medianOutputTokens: evidence.medianOutputTokens,
    totalInputTokens: evidence.totalInputTokens,
    totalCachedInputTokens: evidence.totalCachedInputTokens,
    totalUncachedInputTokens: evidence.totalUncachedInputTokens,
    totalOutputTokens: evidence.totalOutputTokens,
    reliabilityFailureCount:
      evidence.hardTimeoutCount +
      evidence.schemaFailureCount +
      evidence.orphanEventCount +
      evidence.dynamicToolEventCount +
      evidence.unknownEventCount +
      evidence.processFailureCount,
    qualified: reasons.length === 0,
    disqualificationReasons: reasons,
  });
}
