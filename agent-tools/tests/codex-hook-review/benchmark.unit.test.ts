import { describe, expect, it } from 'vitest';

import {
  runReviewTournament,
  type BenchmarkReviewRunner,
} from '../../src/codex-hook-review/benchmark.js';
import { TOURNAMENT_CELLS } from '../../src/codex-hook-review/tournament-types.js';

const passRunner: BenchmarkReviewRunner = {
  run: async ({ cell, payload }) => ({
    kind: 'completed',
    decision:
      payload.includes('temporary production fix') ||
      payload.includes('return []') ||
      cell.id.length === 0
        ? { verdict: 'uncertain', kind: 'none', change_index: 0 }
        : { verdict: 'pass', kind: 'none', change_index: 0 },
    durationMs: 100,
    usage: { inputTokens: 100, cachedInputTokens: 20, outputTokens: 8 },
  }),
};

describe('runReviewTournament', () => {
  it('runs nine cold probes and all nine calibration cells without activating a non-qualifier', async () => {
    const report = await runReviewTournament({
      runner: passRunner,
      completedAt: '2026-07-16T00:00:00.000Z',
    });

    expect(report.coldProbes).toHaveLength(9);
    expect(report.calibration.evidence).toHaveLength(9);
    expect(report.calibration.evidence.every((item) => item.completedLatencyMs.length === 20)).toBe(
      true,
    );
    expect(report.calibration.evidence[0]).toMatchObject({
      medianInputTokens: 100,
      medianCachedInputTokens: 20,
      medianUncachedInputTokens: 80,
      medianOutputTokens: 8,
      totalInputTokens: 2_000,
      totalCachedInputTokens: 400,
      totalUncachedInputTokens: 1_600,
      totalOutputTokens: 160,
    });
    expect(report.finalistCellIds).toHaveLength(3);
    expect(report.heldOut.evidence).toHaveLength(3);
    expect(report.heldOut.evidence.every((item) => item.completedLatencyMs.length === 30)).toBe(
      true,
    );
    expect(report).toMatchObject({
      qualified: false,
      failure: 'no-held-out-qualifier',
    });
  });

  it('classifies failed cold probes and skips calibration without retaining error text', async () => {
    let calls = 0;
    const report = await runReviewTournament({
      runner: {
        run: async () => {
          calls += 1;
          return Promise.reject(new Error('sensitive payload'));
        },
      },
      completedAt: '2026-07-16T00:00:00.000Z',
    });

    expect(calls).toBe(TOURNAMENT_CELLS.length);
    expect(report).toMatchObject({ qualified: false, failure: 'cold-probe-failed' });
    expect(report.coldProbes.every((probe) => probe.outcome === 'process-failure')).toBe(true);
    expect(report.calibration.evidence).toStrictEqual([]);
    expect(report.finalistCellIds).toStrictEqual([]);
    expect(report.heldOut.evidence).toStrictEqual([]);
    expect(JSON.stringify(report)).not.toContain('sensitive payload');
  });

  it('rotates the first cell per case to counterbalance sequential runtime drift', async () => {
    const calls: string[] = [];
    await runReviewTournament({
      runner: {
        run: async (request) => {
          calls.push(request.cell.id);
          return passRunner.run(request);
        },
      },
      completedAt: '2026-07-16T00:00:00.000Z',
    });
    const cellIds = TOURNAMENT_CELLS.map((cell) => cell.id);
    const calibrationStart = TOURNAMENT_CELLS.length;

    expect(calls.slice(0, calibrationStart)).toStrictEqual(cellIds);
    expect(calls.slice(calibrationStart, calibrationStart + cellIds.length)).toStrictEqual(cellIds);
    expect(
      calls.slice(calibrationStart + cellIds.length, calibrationStart + cellIds.length * 2),
    ).toStrictEqual([...cellIds.slice(1), TOURNAMENT_CELLS[0].id]);
  });
});
