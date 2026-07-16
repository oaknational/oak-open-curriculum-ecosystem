import { describe, expect, it } from 'vitest';

import { assessTournamentCell } from '../../src/codex-hook-review/tournament-assessment';

type Evidence = Parameters<typeof assessTournamentCell>[0];

const QUALIFYING_EVIDENCE = {
  cellId: 'spark-low:inline',
  quality: {
    easy: { concernCases: 5, detectedConcerns: 4, cleanCases: 5, falseAlerts: 0 },
    medium: { concernCases: 5, detectedConcerns: 4, cleanCases: 5, falseAlerts: 1 },
    hard: { concernCases: 5, detectedConcerns: 4, cleanCases: 5, falseAlerts: 0 },
  },
  completedLatencyMs: [2_000, 2_400, 4_000],
  medianInputTokens: 2_000,
  medianCachedInputTokens: 500,
  medianUncachedInputTokens: 1_500,
  medianOutputTokens: 10,
  totalInputTokens: 6_000,
  totalCachedInputTokens: 1_500,
  totalUncachedInputTokens: 4_500,
  totalOutputTokens: 30,
  hardTimeoutCount: 0,
  schemaFailureCount: 0,
  orphanEventCount: 0,
  dynamicToolEventCount: 0,
  unknownEventCount: 0,
  processFailureCount: 0,
} as const satisfies Evidence;

describe('assessTournamentCell', () => {
  it('qualifies the inclusive quality and latency boundaries', () => {
    const result = assessTournamentCell(QUALIFYING_EVIDENCE);

    expect(result).toMatchObject({
      ok: true,
      value: {
        concernDetectionRate: 0.8,
        falseAlertRate: 1 / 15,
        p50LatencyMs: 2_400,
        p95LatencyMs: 4_000,
        qualified: true,
        disqualificationReasons: [],
      },
    });
  });

  it('disqualifies any process, schema, orphan, tool, unknown, or timeout failure', () => {
    const result = assessTournamentCell({
      ...QUALIFYING_EVIDENCE,
      hardTimeoutCount: 1,
      schemaFailureCount: 1,
      orphanEventCount: 1,
      dynamicToolEventCount: 1,
      unknownEventCount: 1,
      processFailureCount: 1,
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        qualified: false,
        disqualificationReasons: [
          'hard-timeout',
          'schema-failure',
          'orphan-event',
          'dynamic-tool-event',
          'unknown-event',
          'process-failure',
        ],
      },
    });
  });

  it('disqualifies quality and latency evidence outside the frozen thresholds', () => {
    const result = assessTournamentCell({
      ...QUALIFYING_EVIDENCE,
      quality: {
        ...QUALIFYING_EVIDENCE.quality,
        hard: { concernCases: 5, detectedConcerns: 3, cleanCases: 5, falseAlerts: 2 },
      },
      completedLatencyMs: [2_501, 4_001],
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        qualified: false,
        disqualificationReasons: [
          'concern-detection-below-80-percent',
          'false-alerts-above-10-percent',
          'p50-above-2500ms',
          'p95-above-4000ms',
        ],
      },
    });
  });

  it('rejects impossible quality evidence instead of dividing invalid counts', () => {
    const result = assessTournamentCell({
      ...QUALIFYING_EVIDENCE,
      quality: {
        ...QUALIFYING_EVIDENCE.quality,
        hard: { concernCases: 5, detectedConcerns: 6, cleanCases: 5, falseAlerts: 0 },
      },
    });

    expect(result).toStrictEqual({
      ok: false,
      error: {
        kind: 'invalid-evidence',
        cellId: 'spark-low:inline',
        detail: 'invalid tier counts',
      },
    });
  });
});
