import { describe, expect, it } from 'vitest';
import { buildTimedOutMultiScopeFixture, buildTimedOutSingleScopeFixture } from './timed-out';

import {
  MultiScopeHybridResponseSchema,
  SuggestionItemSchema,
} from '../../structured-search.shared';
import { z } from 'zod';

const MultiScopeSchema = MultiScopeHybridResponseSchema.extend({
  suggestions: z.array(SuggestionItemSchema).optional(),
});

describe('timed-out builders', () => {
  it('marks single scope fixtures as timed out while keeping results', () => {
    const fixture = buildTimedOutSingleScopeFixture({ dataset: 'ks3-history' });
    expect(fixture.timedOut).toBe(true);
    expect(fixture.results.length).toBeGreaterThan(0);
  });

  it('marks every bucket as timed out in multi-scope fixtures', () => {
    const fixture = buildTimedOutMultiScopeFixture({ lessonsDataset: 'ks3-art' });
    const parsed = MultiScopeSchema.safeParse(fixture);
    expect(parsed.success).toBe(true);
    for (const bucket of fixture.buckets) {
      expect(bucket.result.timedOut).toBe(true);
    }
  });
});
