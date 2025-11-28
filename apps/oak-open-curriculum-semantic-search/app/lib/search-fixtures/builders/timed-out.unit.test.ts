import { describe, expect, it } from 'vitest';
import { buildTimedOutMultiScopeFixture, buildTimedOutSingleScopeFixture } from './timed-out';
import { SearchMultiScopeResponseSchema } from '@oaknational/oak-curriculum-sdk/public/search.js';

describe('timed-out builders', () => {
  it('marks single scope fixtures as timed out while keeping results', () => {
    const fixture = buildTimedOutSingleScopeFixture({ dataset: 'ks3-history' });
    expect(fixture.timedOut).toBe(true);
    expect(fixture.results.length).toBeGreaterThan(0);
  });

  it('marks every bucket as timed out in multi-scope fixtures', () => {
    const fixture = buildTimedOutMultiScopeFixture({ lessonsDataset: 'ks3-art' });
    const parsed = SearchMultiScopeResponseSchema.safeParse(fixture);
    expect(parsed.success).toBe(true);
    for (const bucket of fixture.buckets) {
      expect(bucket.result.timedOut).toBe(true);
    }
  });
});
