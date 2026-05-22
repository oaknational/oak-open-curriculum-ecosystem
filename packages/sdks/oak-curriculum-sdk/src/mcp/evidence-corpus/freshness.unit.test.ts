import { describe, expect, it } from 'vitest';

import { DEFAULT_THRESHOLD_DAYS, checkFreshness } from './freshness.js';

describe('checkFreshness', () => {
  const now = new Date('2026-05-22T00:00:00.000Z');

  it('returns ok when snapshot age is well within the threshold', () => {
    const lastUpdated = new Date('2026-04-22T00:00:00.000Z').toISOString();

    const result = checkFreshness(lastUpdated, now, DEFAULT_THRESHOLD_DAYS);

    expect(result).toEqual({
      ok: true,
      value: { ageDays: 30, thresholdDays: 180 },
    });
  });

  it('returns ok when snapshot age exactly equals the threshold (inclusive boundary)', () => {
    const lastUpdated = new Date('2025-11-23T00:00:00.000Z').toISOString();

    const result = checkFreshness(lastUpdated, now, 180);

    expect(result).toEqual({
      ok: true,
      value: { ageDays: 180, thresholdDays: 180 },
    });
  });

  it('returns err stale-data when snapshot age is one day past the threshold', () => {
    const lastUpdated = new Date('2025-11-22T00:00:00.000Z').toISOString();

    const result = checkFreshness(lastUpdated, now, 180);

    expect(result).toEqual({
      ok: false,
      error: { kind: 'stale-data', ageDays: 181, thresholdDays: 180 },
    });
  });

  it('returns err stale-data when snapshot is far past the threshold', () => {
    const lastUpdated = new Date('2024-01-01T00:00:00.000Z').toISOString();

    const result = checkFreshness(lastUpdated, now, 180);

    expect(result).toEqual({
      ok: false,
      error: { kind: 'stale-data', ageDays: 872, thresholdDays: 180 },
    });
  });

  it('returns err invalid-date when input is unparseable', () => {
    const result = checkFreshness('not-an-iso-date', now, 180);

    expect(result).toEqual({
      ok: false,
      error: { kind: 'invalid-date', input: 'not-an-iso-date' },
    });
  });

  it('honours a caller-supplied threshold different from the default', () => {
    const lastUpdated = new Date('2025-11-23T00:00:00.000Z').toISOString();

    const result = checkFreshness(lastUpdated, now, 30);

    expect(result).toEqual({
      ok: false,
      error: { kind: 'stale-data', ageDays: 180, thresholdDays: 30 },
    });
  });
});
