import { describe, expect, it } from 'vitest';

import {
  judgeRunLease,
  LeaseFileSchema,
  RUN_LEASE_TTL_MS,
  type LeaseFileContent,
} from './run-lease';

const SELF = { runId: 'run-1', pid: 100, hostname: 'mac-a' };

const HOLDER: LeaseFileContent = {
  runId: 'run-0',
  pid: 99,
  hostname: 'mac-a',
  startedAt: '2026-08-09T17:00:00Z',
};

const NOW_MS = Date.parse('2026-08-09T17:05:00Z');
const START_MS = Date.parse(HOLDER.startedAt);

describe('judgeRunLease', () => {
  it('acquires when no lease exists', () => {
    const outcome = judgeRunLease({
      nowMs: NOW_MS,
      self: SELF,
      existing: undefined,
      holderLiveness: 'unknown',
      existingStartMs: undefined,
    });

    expect(outcome.ok ? outcome.value : outcome.error).toBe('acquire');
  });

  it('refreshes its OWN lease — identity is runId + pid + hostname, all three', () => {
    const outcome = judgeRunLease({
      nowMs: NOW_MS,
      self: SELF,
      existing: { ...HOLDER, runId: SELF.runId, pid: SELF.pid, hostname: SELF.hostname },
      holderLiveness: 'alive',
      existingStartMs: START_MS,
    });

    expect(outcome.ok ? outcome.value : outcome.error).toBe('refresh');
  });

  it('reclaims a provably dead holder immediately — a crash never wedges the tool', () => {
    const outcome = judgeRunLease({
      nowMs: NOW_MS,
      self: SELF,
      existing: HOLDER,
      holderLiveness: 'gone',
      existingStartMs: START_MS,
    });

    expect(outcome.ok ? outcome.value : outcome.error).toBe('reclaim');
  });

  it('NEVER reclaims a live holder, regardless of age — long runs are healthy, not stale', () => {
    const outcome = judgeRunLease({
      nowMs: START_MS + RUN_LEASE_TTL_MS * 10,
      self: SELF,
      existing: HOLDER,
      holderLiveness: 'alive',
      existingStartMs: START_MS,
    });

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('still alive');
  });

  it('holds a foreign-host lease inside the TTL and reclaims it beyond', () => {
    const foreign = { ...HOLDER, hostname: 'mac-b' };
    const inside = judgeRunLease({
      nowMs: START_MS + RUN_LEASE_TTL_MS - 1000,
      self: SELF,
      existing: foreign,
      holderLiveness: 'unknown',
      existingStartMs: START_MS,
    });
    const beyond = judgeRunLease({
      nowMs: START_MS + RUN_LEASE_TTL_MS + 1000,
      self: SELF,
      existing: foreign,
      holderLiveness: 'unknown',
      existingStartMs: START_MS,
    });

    expect(inside.ok).toBe(false);
    expect(beyond.ok ? beyond.value : beyond.error).toBe('reclaim');
  });

  it('holds an age-unknowable foreign lease — an invalid timestamp never silently reclaims', () => {
    const outcome = judgeRunLease({
      nowMs: NOW_MS,
      self: SELF,
      existing: { ...HOLDER, hostname: 'mac-b' },
      holderLiveness: 'unknown',
      existingStartMs: undefined,
    });

    expect(outcome.ok).toBe(false);
  });
});

describe('LeaseFileSchema', () => {
  it('parses a lease and rejects unknown keys', () => {
    expect(LeaseFileSchema.safeParse(HOLDER).success).toBe(true);
    expect(LeaseFileSchema.safeParse({ ...HOLDER, extra: 1 }).success).toBe(false);
  });
});
