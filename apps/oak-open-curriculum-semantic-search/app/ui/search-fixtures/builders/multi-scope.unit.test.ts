import { describe, expect, it } from 'vitest';
import {
  MultiScopeHybridResponseSchema,
  SuggestionItemSchema,
} from '../../structured-search.shared';
import { buildMultiScopeFixture } from './multi-scope';
import { z } from 'zod';

const MultiScopeSchema = MultiScopeHybridResponseSchema.extend({
  suggestions: z.array(SuggestionItemSchema).optional(),
});

describe('buildMultiScopeFixture', () => {
  it('assembles default lesson, unit, and sequence buckets', () => {
    const fixture = buildMultiScopeFixture();
    const parsed = MultiScopeSchema.safeParse(fixture);

    expect(parsed.success).toBe(true);
    expect(fixture.scope).toBe('all');
    expect(fixture.buckets).toHaveLength(3);

    const lessonBucket = fixture.buckets.find((bucket) => bucket.scope === 'lessons');
    const unitBucket = fixture.buckets.find((bucket) => bucket.scope === 'units');
    const sequenceBucket = fixture.buckets.find((bucket) => bucket.scope === 'sequences');

    expect(lessonBucket?.result.results.length).toBeGreaterThan(0);
    expect(unitBucket?.result.results.length).toBeGreaterThan(0);
    expect(sequenceBucket?.result.results.length).toBeGreaterThan(0);
  });

  it('supports dataset overrides per scope and custom suggestions', () => {
    const fixture = buildMultiScopeFixture({
      lessonsDataset: 'ks3-art',
      unitsDataset: 'ks4-maths',
      sequencesDataset: 'ks3-history',
      overrides: {
        suggestions: [],
        buckets: {
          lessons: { took: 7 },
          units: { timedOut: true },
        },
      },
    });

    const parsed = MultiScopeSchema.safeParse(fixture);
    expect(parsed.success).toBe(true);
    expect(fixture.suggestions).toStrictEqual([]);

    const lessonBucket = fixture.buckets.find((bucket) => bucket.scope === 'lessons');
    expect(lessonBucket?.result.took).toBe(7);

    const unitBucket = fixture.buckets.find((bucket) => bucket.scope === 'units');
    expect(unitBucket?.result.timedOut).toBe(true);
  });
});
