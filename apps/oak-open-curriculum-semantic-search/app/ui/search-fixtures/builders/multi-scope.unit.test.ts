import { describe, expect, it } from 'vitest';
import {
  MultiScopeHybridResponseSchema,
  SuggestionItemSchema,
} from '../../structured-search.shared';
import { buildMultiScopeFixture } from './multi-scope';
import { z } from 'zod';

const MultiScopeSchema = MultiScopeHybridResponseSchema.extend({
  suggestions: z.array(SuggestionItemSchema).optional(),
  suggestionCache: z
    .object({ version: z.string(), ttlSeconds: z.number().int().nonnegative() })
    .optional(),
});

describe('buildMultiScopeFixture', () => {
  it('assembles default lesson, unit, and sequence buckets', () => {
    const fixture = buildMultiScopeFixture();
    const parsed = MultiScopeSchema.safeParse(fixture);

    expect(parsed.success).toBe(true);
    expect(fixture.scope).toBe('all');
    expect(fixture.buckets).toHaveLength(3);
    expect(fixture.suggestionCache).toMatchObject({ version: 'fixture-v1' });

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
        suggestionCache: { version: 'override', ttlSeconds: 90 },
      },
    });

    const parsed = MultiScopeSchema.safeParse(fixture);
    expect(parsed.success).toBe(true);
    expect(fixture.suggestions).toStrictEqual([]);
    expect(fixture.suggestionCache).toEqual({ version: 'override', ttlSeconds: 90 });

    const lessonBucket = fixture.buckets.find((bucket) => bucket.scope === 'lessons');
    expect(lessonBucket?.result.took).toBe(7);

    const unitBucket = fixture.buckets.find((bucket) => bucket.scope === 'units');
    expect(unitBucket?.result.timedOut).toBe(true);
  });

  it('produces sequence buckets with KS4 options when using science dataset', () => {
    const fixture = buildMultiScopeFixture({ sequencesDataset: 'ks4-science' });
    const sequenceBucket = fixture.buckets.find((bucket) => bucket.scope === 'sequences');
    const sequences = sequenceBucket?.result.results as Array<{ highlights: string[] }> | undefined;
    expect(sequences?.length).toBeGreaterThan(0);
    const hasKs4Highlight = sequences?.some((entry) =>
      entry.highlights.some((highlight) => highlight.includes('KS4')),
    );
    expect(hasKs4Highlight).toBe(true);
  });
});
