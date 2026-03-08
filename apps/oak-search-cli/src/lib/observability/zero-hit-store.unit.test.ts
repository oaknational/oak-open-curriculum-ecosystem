import { describe, expect, it, beforeEach } from 'vitest';
import {
  recordZeroHitEvent,
  getZeroHitRecent,
  getZeroHitSummary,
  resetZeroHitStore,
} from './zero-hit-store';

describe('zero-hit store', () => {
  beforeEach(() => {
    resetZeroHitStore();
  });

  it('records events with timestamps and caps the size', () => {
    for (let i = 0; i < 205; i += 1) {
      recordZeroHitEvent({
        scope: i % 2 === 0 ? 'lessons' : 'units',
        query: `query-${i}`,
        filters: { subject: 'maths' },
        indexVersion: 'v-test',
      });
    }

    const recent = getZeroHitRecent(250);
    expect(recent).toHaveLength(200);
    expect(recent[0].query).toBe('query-204');
    expect(recent[recent.length - 1]?.query).toBe('query-5');
  });

  it('returns summary grouped by scope', () => {
    recordZeroHitEvent({
      scope: 'lessons',
      query: 'fractions',
      filters: {},
      indexVersion: 'v-1',
      timestamp: 100,
    });
    recordZeroHitEvent({
      scope: 'units',
      query: 'fractions',
      filters: {},
      indexVersion: 'v-2',
      timestamp: 200,
    });

    const summary = getZeroHitSummary();
    expect(summary.total).toBe(2);
    expect(summary.byScope).toEqual({ lessons: 1, units: 1, sequences: 0 });
    expect(summary.latestIndexVersion).toBe('v-2');
  });

  it('provides empty defaults when store has no data', () => {
    const recent = getZeroHitRecent();
    const summary = getZeroHitSummary();

    expect(recent).toHaveLength(0);
    expect(summary).toEqual({
      total: 0,
      byScope: { lessons: 0, units: 0, sequences: 0 },
      latestIndexVersion: null,
    });
  });
});
