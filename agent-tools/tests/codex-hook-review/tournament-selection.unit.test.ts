import { describe, expect, it } from 'vitest';

import {
  selectCalibrationFinalists,
  selectHeldOutWinner,
} from '../../src/codex-hook-review/tournament-selection';

type Evidence = Parameters<typeof selectCalibrationFinalists>[0][number];
type CellId = Evidence['cellId'];

const CELL_IDS = [
  'spark-low:inline',
  'spark-low:instructions',
  'spark-low:skill',
  'luna-low-standard:inline',
  'luna-low-standard:instructions',
  'luna-low-standard:skill',
  'luna-low-fast:inline',
  'luna-low-fast:instructions',
  'luna-low-fast:skill',
] as const satisfies readonly CellId[];

function evidence(cellId: CellId, p50: number, p95: number, tokens: number): Evidence {
  return {
    cellId,
    quality: {
      easy: { concernCases: 5, detectedConcerns: 5, cleanCases: 5, falseAlerts: 0 },
      medium: { concernCases: 5, detectedConcerns: 5, cleanCases: 5, falseAlerts: 0 },
      hard: { concernCases: 5, detectedConcerns: 5, cleanCases: 5, falseAlerts: 0 },
    },
    completedLatencyMs: [p50, p95],
    medianInputTokens: tokens + 500,
    medianCachedInputTokens: 500,
    medianUncachedInputTokens: tokens,
    medianOutputTokens: 10,
    totalInputTokens: (tokens + 500) * 2,
    totalCachedInputTokens: 1_000,
    totalUncachedInputTokens: tokens * 2,
    totalOutputTokens: 20,
    hardTimeoutCount: 0,
    schemaFailureCount: 0,
    orphanEventCount: 0,
    dynamicToolEventCount: 0,
    unknownEventCount: 0,
    processFailureCount: 0,
  };
}

describe('two-stage tournament selection', () => {
  it('selects exactly one mechanism per model from calibration', () => {
    const tournament = CELL_IDS.map((cellId) => evidence(cellId, 2_000, 3_500, 1_500));
    tournament[0] = evidence('spark-low:inline', 1_700, 3_000, 1_400);
    tournament[1] = evidence('spark-low:instructions', 1_600, 3_100, 1_200);
    tournament[2] = evidence('spark-low:skill', 1_600, 3_100, 1_200);

    const result = selectCalibrationFinalists(tournament);

    expect(result).toMatchObject({
      ok: true,
      value: {
        finalists: [
          { cell: { id: 'spark-low:instructions' } },
          { cell: { id: 'luna-low-standard:inline' } },
          { cell: { id: 'luna-low-fast:inline' } },
        ],
      },
    });
  });

  it('rejects held-out evidence from a calibration non-finalist', () => {
    const finalists = [
      'spark-low:inline',
      'luna-low-standard:inline',
      'luna-low-fast:inline',
    ] as const;
    const heldOut = [
      evidence('spark-low:skill', 1_000, 2_000, 500),
      evidence('luna-low-standard:inline', 2_000, 3_000, 1_500),
      evidence('luna-low-fast:inline', 2_000, 3_000, 1_500),
    ];

    expect(selectHeldOutWinner(heldOut, finalists)).toStrictEqual({
      ok: false,
      error: { kind: 'invalid-finalists', detail: 'held-out evidence must match finalists' },
    });
  });

  it('selects the held-out winner from the three calibration finalists', () => {
    const finalists = [
      'spark-low:inline',
      'luna-low-standard:instructions',
      'luna-low-fast:skill',
    ] as const;
    const heldOut = [
      evidence('spark-low:inline', 2_000, 3_000, 1_500),
      evidence('luna-low-standard:instructions', 1_700, 3_050, 1_200),
      evidence('luna-low-fast:skill', 1_600, 3_050, 1_200),
    ];

    expect(selectHeldOutWinner(heldOut, finalists)).toMatchObject({
      ok: true,
      value: { winner: { cell: { id: 'luna-low-fast:skill' } } },
    });
  });

  it('retains held-out quality, latency, and token trade-offs on the Pareto frontier', () => {
    const finalists = [
      'spark-low:inline',
      'luna-low-standard:instructions',
      'luna-low-fast:skill',
    ] as const;
    const heldOut = [
      evidence('spark-low:inline', 2_000, 3_000, 1_000),
      evidence('luna-low-standard:instructions', 2_100, 3_100, 1_200),
      evidence('luna-low-fast:skill', 2_200, 3_200, 900),
    ];

    expect(selectHeldOutWinner(heldOut, finalists)).toMatchObject({
      ok: true,
      value: {
        paretoFrontier: [
          { cell: { id: 'spark-low:inline' } },
          { cell: { id: 'luna-low-fast:skill' } },
        ],
      },
    });
  });

  it('still selects the best observed mechanism when a calibration lane does not qualify', () => {
    const tournament = CELL_IDS.map((cellId) => evidence(cellId, 2_000, 3_500, 1_500));
    tournament[0] = { ...tournament[0], hardTimeoutCount: 1 };
    tournament[1] = { ...tournament[1], hardTimeoutCount: 1 };
    tournament[2] = { ...tournament[2], hardTimeoutCount: 1 };

    expect(selectCalibrationFinalists(tournament)).toMatchObject({
      ok: true,
      value: {
        finalists: [
          { cell: { id: 'spark-low:inline' } },
          { cell: { id: 'luna-low-standard:inline' } },
          { cell: { id: 'luna-low-fast:inline' } },
        ],
      },
    });
  });

  it('uses the observed failure count rather than the number of failure categories', () => {
    const tournament = CELL_IDS.map((cellId) => evidence(cellId, 2_000, 3_500, 1_500));
    tournament[0] = { ...tournament[0], hardTimeoutCount: 3 };
    tournament[1] = {
      ...tournament[1],
      completedLatencyMs: [2_100, 3_600],
      schemaFailureCount: 1,
    };
    tournament[2] = { ...tournament[2], processFailureCount: 2 };

    const selection = selectCalibrationFinalists(tournament);

    expect(selection.ok ? selection.value.finalists[0]?.cell.id : selection.error.kind).toBe(
      'spark-low:instructions',
    );
  });
});
