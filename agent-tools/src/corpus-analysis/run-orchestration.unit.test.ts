import { describe, expect, it } from 'vitest';

import {
  assessMapCompleteness,
  assessValidateCompleteness,
  deterministicJitterMs,
  postReduceRegate,
  resolveResumeSeed,
  runCapped,
  type ValidatedCandidate,
} from './run-orchestration.js';

/**
 * The orchestration layer the workflow stage entries value-import: candidate-granular
 * resume, the completeness assertions, the post-reduce hard-abort re-gate, the cost
 * calibration, the shared concurrency cap, and deterministic per-voter jitter. Pure
 * functions, bundled into the harness artefacts by the workflow build — one source,
 * no mirrors. No aggregation math is touched.
 */

const candidate = (id: string): { id: string; pattern: string } => ({
  id,
  pattern: `pattern ${id}`,
});

describe('resolveResumeSeed (candidate-granular resume)', () => {
  const seed = [candidate('C01'), candidate('C02'), candidate('C03'), candidate('C04')];

  it('returns the full seed when nothing is resolved (a fresh run)', () => {
    expect(resolveResumeSeed(seed, [])).toEqual(seed);
  });

  it('returns only the unresolved tail, preserving seed order (a re-seed)', () => {
    expect(resolveResumeSeed(seed, ['C01', 'C03'])).toEqual([candidate('C02'), candidate('C04')]);
  });

  it('returns an empty set when every candidate is already resolved', () => {
    expect(resolveResumeSeed(seed, ['C01', 'C02', 'C03', 'C04'])).toEqual([]);
  });

  it('ignores resolved ids that are not in the seed (no crash, no over-removal)', () => {
    expect(resolveResumeSeed(seed, ['C99', 'C02'])).toEqual([
      candidate('C01'),
      candidate('C03'),
      candidate('C04'),
    ]);
  });

  it('does not mutate the input seed', () => {
    const input = [candidate('C01'), candidate('C02')];
    resolveResumeSeed(input, ['C01']);
    expect(input).toEqual([candidate('C01'), candidate('C02')]);
  });
});

describe('assessValidateCompleteness (the extended completeness guard)', () => {
  const candidates = [{ id: 'C01' }, { id: 'C02' }, { id: 'C03' }];
  const terminal = (
    id: string,
    disposition: ValidatedCandidate['disposition'],
  ): ValidatedCandidate => ({
    candidateId: id,
    disposition,
    reason: null,
  });
  const held = (id: string, reason: string): ValidatedCandidate => ({
    candidateId: id,
    disposition: 'held-for-review',
    reason,
  });

  it('is complete when every candidate has a terminal disposition and the count matches', () => {
    const validated = [
      terminal('C01', 'keep'),
      terminal('C02', 'kill'),
      terminal('C03', 'reroute'),
    ];
    expect(assessValidateCompleteness(validated, candidates)).toEqual({
      complete: true,
      incompleteCandidateIds: [],
      missingCandidateIds: [],
    });
  });

  it('is incomplete on a retry-cap hold (the original quota-trip case)', () => {
    const validated = [terminal('C01', 'keep'), held('C02', 'retry-cap'), terminal('C03', 'keep')];
    const report = assessValidateCompleteness(validated, candidates);
    expect(report.complete).toBe(false);
    expect(report.incompleteCandidateIds).toEqual(['C02']);
    expect(report.missingCandidateIds).toEqual([]);
  });

  it('is incomplete on a held-for-review of ANY reason, not only retry-cap (the extension)', () => {
    const validated = [
      terminal('C01', 'keep'),
      held('C02', 'quorum-tie'),
      held('C03', 'lens-collision'),
    ];
    const report = assessValidateCompleteness(validated, candidates);
    expect(report.complete).toBe(false);
    expect(report.incompleteCandidateIds).toEqual(['C02', 'C03']);
  });

  it('is incomplete when a candidate is missing from validated (a silent filter(Boolean) drop)', () => {
    const validated = [terminal('C01', 'keep'), terminal('C03', 'kill')]; // C02 dropped
    const report = assessValidateCompleteness(validated, candidates);
    expect(report.complete).toBe(false);
    expect(report.missingCandidateIds).toEqual(['C02']);
    expect(report.incompleteCandidateIds).toEqual([]);
  });

  it('reports held AND missing together (the two failure dimensions do not mask each other)', () => {
    const validated = [terminal('C01', 'keep'), held('C02', 'quorum-tie')]; // C02 held, C03 dropped
    const report = assessValidateCompleteness(validated, candidates);
    expect(report.complete).toBe(false);
    expect(report.incompleteCandidateIds).toEqual(['C02']);
    expect(report.missingCandidateIds).toEqual(['C03']);
  });

  it('is incomplete when the validated count does not match (a duplicate row)', () => {
    const validated = [
      terminal('C01', 'keep'),
      terminal('C02', 'keep'),
      terminal('C03', 'keep'),
      terminal('C03', 'keep'), // duplicate → count 4 ≠ 3
    ];
    expect(assessValidateCompleteness(validated, candidates).complete).toBe(false);
  });
});

describe('assessMapCompleteness (the loud partial-map surface)', () => {
  it('is complete when every window produced leaves', () => {
    expect(
      assessMapCompleteness([
        { window: 'w01', leafCount: 35 },
        { window: 'w02', leafCount: 28 },
      ]),
    ).toEqual({ mapComplete: true, incompleteWindows: [] });
  });

  it('names every zero-leaf window — a dead map agent must never pass silently', () => {
    // The 2026-07-01 run returned "completed" with 9 of 15 windows rate-limited to
    // zero leaves; only inspecting coverage caught it. This surface makes that state
    // first-class in the result.
    const report = assessMapCompleteness([
      { window: 'w01', leafCount: 35 },
      { window: 'w02', leafCount: 0 },
      { window: 'w03', leafCount: 0 },
    ]);
    expect(report.mapComplete).toBe(false);
    expect(report.incompleteWindows).toEqual(['w02', 'w03']);
  });
});

describe('postReduceRegate (calibration + hard-abort decision)', () => {
  it('models worst-case validate at the calibrated 50k all-in figure: 50 candidates x 5 voters x 50k = 12.5M, no double multiplier', () => {
    const regate = postReduceRegate({ candidateCount: 50, ceiling: 20_000_000 });
    // 12.5M pins the calibration through OUTPUT: 31.25M would mean a 2.5x high multiplier was wrongly re-applied.
    expect(regate.worstCaseTokens).toBe(12_500_000);
    expect(regate.estimate.totalTokens).toBe(12_500_000);
  });

  it('does NOT abort when the worst-case validate cost is within the ceiling', () => {
    const regate = postReduceRegate({ candidateCount: 50, ceiling: 13_000_000 });
    expect(regate.estimate.withinCeiling).toBe(true);
    expect(regate.abort).toBe(false);
  });

  it('HARD-ABORTS when the real candidate count breaches the ceiling (the v2 overrun the old log-only gate missed)', () => {
    const regate = postReduceRegate({ candidateCount: 50, ceiling: 2_000_000 });
    expect(regate.estimate.withinCeiling).toBe(false);
    expect(regate.abort).toBe(true);
    expect(regate.message).toContain('12500000');
  });

  it('abort is exactly the negation of withinCeiling at the boundary', () => {
    const exact = postReduceRegate({ candidateCount: 50, ceiling: 12_500_000 });
    expect(exact.abort).toBe(false); // 12.5M <= 12.5M is within
    const justUnder = postReduceRegate({ candidateCount: 50, ceiling: 12_499_999 });
    expect(justUnder.abort).toBe(true);
  });
});

describe('deterministicJitterMs (no Math.random — resume-safe in the Workflow sandbox)', () => {
  it('is deterministic: the same seed always yields the same delay', () => {
    expect(deterministicJitterMs('C12:tier-2:r0:1', 400)).toBe(
      deterministicJitterMs('C12:tier-2:r0:1', 400),
    );
  });

  it('stays within the inclusive [0, maxMs] range', () => {
    for (const seed of ['a', 'C01:tier-0:r0:0', 'vote:C49:tier-2:base-rate', 'zzz']) {
      const ms = deterministicJitterMs(seed, 250);
      expect(ms).toBeGreaterThanOrEqual(0);
      expect(ms).toBeLessThanOrEqual(250);
    }
  });

  it('spreads distinct voter ids across the window (flattens the dispatch burst)', () => {
    const ids = Array.from({ length: 40 }, (_, i) => `C${i}:tier-2:r0:${i % 3}`);
    const distinct = new Set(ids.map((id) => deterministicJitterMs(id, 400)));
    expect(distinct.size).toBeGreaterThan(10);
  });

  it('returns 0 when jitter is disabled (maxMs <= 0)', () => {
    expect(deterministicJitterMs('anything', 0)).toBe(0);
  });

  it('is in-range and non-zero for an empty seed (FNV offset basis, not 0)', () => {
    // FNV-1a over zero bytes returns the offset basis, so an empty / malformed voter id does not
    // collapse the delay to 0 — it stays a deterministic in-range value.
    const ms = deterministicJitterMs('', 400);
    expect(ms).toBe(25);
    expect(ms).toBeGreaterThanOrEqual(0);
    expect(ms).toBeLessThanOrEqual(400);
  });
});

describe('runCapped (chunked-barrier concurrency cap, injected parallel)', () => {
  // A fake of the harness `parallel`: runs a chunk's thunks concurrently, returns results in order,
  // and substitutes `null` for a thunk that throws (the harness null-on-throw contract).
  const fakeParallel = async <R>(
    thunks: readonly (() => Promise<R>)[],
  ): Promise<readonly (R | null)[]> =>
    Promise.all(
      thunks.map(async (t) => {
        try {
          return await t();
        } catch {
          return null;
        }
      }),
    );

  it('preserves global output order == input order across chunk boundaries', async () => {
    const out = await runCapped([1, 2, 3, 4, 5], 2, async (n) => n * 10, fakeParallel);
    expect(out).toEqual([10, 20, 30, 40, 50]);
  });

  it('chunks at the limit: 5 items, limit 2 → runParallel called 3× with sizes [2,2,1]', async () => {
    const sizes: number[] = [];
    const spyParallel = async <R>(
      thunks: readonly (() => Promise<R>)[],
    ): Promise<readonly (R | null)[]> => {
      sizes.push(thunks.length);
      return fakeParallel(thunks);
    };
    await runCapped([1, 2, 3, 4, 5], 2, async (n) => n, spyParallel);
    expect(sizes).toEqual([2, 2, 1]);
  });

  it('never exceeds the limit in flight, and the barrier holds (chunk N+1 waits for chunk N)', async () => {
    let inFlight = 0;
    let peak = 0;
    const entries: number[] = [];
    const fn = async (n: number): Promise<number> => {
      inFlight += 1;
      peak = Math.max(peak, inFlight);
      entries.push(n);
      await Promise.resolve();
      await Promise.resolve();
      inFlight -= 1;
      return n;
    };
    await runCapped([1, 2, 3, 4, 5, 6], 2, fn, fakeParallel);
    expect(peak).toBeLessThanOrEqual(2);
    expect(entries).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('passes null through at the exact failing position (mirrors the parallel null-on-throw contract)', async () => {
    const fn = (n: number): Promise<number> =>
      n === 3 ? Promise.reject(new Error('boom')) : Promise.resolve(n * 10);
    const out = await runCapped([1, 2, 3, 4, 5], 2, fn, fakeParallel);
    expect(out).toEqual([10, 20, null, 40, 50]);
  });

  it('returns [] and never calls runParallel for empty input', async () => {
    let calls = 0;
    const spyParallel = async <R>(
      thunks: readonly (() => Promise<R>)[],
    ): Promise<readonly (R | null)[]> => {
      calls += 1;
      return fakeParallel(thunks);
    };
    const out = await runCapped([], 3, async (n: number) => n, spyParallel);
    expect(out).toEqual([]);
    expect(calls).toBe(0);
  });

  it('runs a single chunk when limit exceeds the item count', async () => {
    const sizes: number[] = [];
    const spyParallel = async <R>(
      thunks: readonly (() => Promise<R>)[],
    ): Promise<readonly (R | null)[]> => {
      sizes.push(thunks.length);
      return fakeParallel(thunks);
    };
    await runCapped([1, 2, 3], 10, async (n) => n, spyParallel);
    expect(sizes).toEqual([3]);
  });

  it('runs a single chunk at the exact limit === length boundary (off-by-one guard)', async () => {
    const sizes: number[] = [];
    const spyParallel = async <R>(
      thunks: readonly (() => Promise<R>)[],
    ): Promise<readonly (R | null)[]> => {
      sizes.push(thunks.length);
      return fakeParallel(thunks);
    };
    await runCapped([1, 2, 3], 3, async (n) => n, spyParallel);
    expect(sizes).toEqual([3]);
  });

  it('applies fn to each item exactly once, in order', async () => {
    const seen: number[] = [];
    await runCapped(
      [1, 2, 3, 4],
      2,
      async (n) => {
        seen.push(n);
        return n;
      },
      fakeParallel,
    );
    expect(seen).toEqual([1, 2, 3, 4]);
  });

  it('runs fully serially when the limit is 1', async () => {
    const sizes: number[] = [];
    const spyParallel = async <R>(
      thunks: readonly (() => Promise<R>)[],
    ): Promise<readonly (R | null)[]> => {
      sizes.push(thunks.length);
      return fakeParallel(thunks);
    };
    const out = await runCapped([1, 2, 3], 1, async (n) => n * 2, spyParallel);
    expect(sizes).toEqual([1, 1, 1]);
    expect(out).toEqual([2, 4, 6]);
  });

  it('rejects if runParallel itself rejects (a conduit — distinct from null-on-throw)', async () => {
    const rejectingParallel = (): Promise<readonly (number | null)[]> =>
      Promise.reject(new Error('runParallel failed'));
    await expect(runCapped([1, 2], 2, async (n: number) => n, rejectingParallel)).rejects.toThrow(
      'runParallel failed',
    );
  });
});
