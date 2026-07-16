import { describe, expect, it } from 'vitest';

import {
  type BenchmarkReviewRunner,
  type BenchmarkRunOutcome,
} from '../../src/codex-hook-review/benchmark.js';
import {
  FEASIBILITY_PROBE_CELLS,
  runFeasibilityProbe,
} from '../../src/codex-hook-review/feasibility-probe.js';

const usage = { inputTokens: 20, cachedInputTokens: 5, outputTokens: 3 };

function completed(verdict: 'pass' | 'concern', durationMs = 100): BenchmarkRunOutcome {
  return verdict === 'pass'
    ? {
        kind: 'completed',
        decision: { verdict: 'pass', kind: 'none', change_index: 0 },
        durationMs,
        reviewerDurationMs: Math.max(0, durationMs - 20),
        reasoningItemCount: 0,
        usage,
      }
    : {
        kind: 'completed',
        decision: { verdict: 'concern', kind: 'syntax-schema', change_index: 1 },
        durationMs,
        reviewerDurationMs: Math.max(0, durationMs - 20),
        reasoningItemCount: 0,
        usage,
      };
}

function runner(
  outcome: (request: Parameters<BenchmarkReviewRunner['run']>[0]) => BenchmarkRunOutcome,
): BenchmarkReviewRunner {
  return { run: async (request) => outcome(request) };
}

function isMalformedConfig(payload: string): boolean {
  const parsed: unknown = JSON.parse(payload);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('changes' in parsed) ||
    !Array.isArray(parsed.changes)
  ) {
    return false;
  }
  const firstChange: unknown = parsed.changes[0];
  return (
    typeof firstChange === 'object' &&
    firstChange !== null &&
    'content' in firstChange &&
    firstChange.content === '{"port": 3000, "features": ["search",]}'
  );
}

describe('runFeasibilityProbe', () => {
  it('runs the two cases once against each inline Spark/Luna lane', async () => {
    const requests: Parameters<BenchmarkReviewRunner['run']>[0][] = [];

    const result = await runFeasibilityProbe({
      completedAt: '2026-07-16T00:00:00.000Z',
      runner: runner((request) => {
        requests.push(request);
        return isMalformedConfig(request.payload) ? completed('concern') : completed('pass');
      }),
    });

    expect(FEASIBILITY_PROBE_CELLS).toHaveLength(3);
    expect(requests).toHaveLength(6);
    expect(requests.every((request) => request.cell.mechanism === 'inline')).toBe(true);
    expect(new Set(requests.map((request) => request.cell.modelConfigurationId))).toStrictEqual(
      new Set(['spark-low', 'luna-low-standard', 'luna-low-fast']),
    );
    expect(result.viable).toBe(true);
    expect(result.viableCellIds).toHaveLength(3);
    expect(result.samples).toHaveLength(6);
    expect(result.samples[0]).toMatchObject({ reviewerDurationMs: 80, reasoningItemCount: 0 });
  });

  it('requires both exact decisions within the latency envelope for a viable lane', async () => {
    const result = await runFeasibilityProbe({
      completedAt: '2026-07-16T00:00:00.000Z',
      runner: runner((request) => {
        const isConcern = isMalformedConfig(request.payload);
        if (request.cell.id === 'spark-low:inline') {
          return isConcern ? completed('concern') : completed('pass');
        }
        if (request.cell.id === 'luna-low-standard:inline') {
          return isConcern ? completed('concern', 4_001) : completed('pass');
        }
        return completed('pass');
      }),
    });

    expect(result.viableCellIds).toStrictEqual(['spark-low:inline']);
    expect(result.failure).toBeUndefined();
  });

  it('reports no viable lane without qualifying or enabling anything', async () => {
    const result = await runFeasibilityProbe({
      completedAt: '2026-07-16T00:00:00.000Z',
      runner: runner(() => ({ kind: 'failed', reason: 'hard-timeout', durationMs: 4_000 })),
    });

    expect(result.viable).toBe(false);
    expect(result.viableCellIds).toStrictEqual([]);
    expect(result.failure).toBe('no-viable-inline-lane');
    expect(result.samples).toHaveLength(6);
  });

  it('contains only content-free sample evidence', async () => {
    const result = await runFeasibilityProbe({
      completedAt: '2026-07-16T00:00:00.000Z',
      runner: runner((request) =>
        isMalformedConfig(request.payload) ? completed('concern') : completed('pass'),
      ),
    });

    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('features');
    expect(serialized).not.toContain('search');
    expect(serialized).not.toContain('service.json');
  });
});
