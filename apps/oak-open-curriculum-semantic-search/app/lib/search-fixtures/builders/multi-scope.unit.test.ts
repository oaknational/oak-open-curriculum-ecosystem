import { describe, expect, it } from 'vitest';
import {
  SearchMultiScopeResponseSchema,
  SearchUnitsResponseSchema,
  SearchSequencesResponseSchema,
  type SearchMultiScopeResponse,
} from '@oaknational/oak-curriculum-sdk';
import { buildMultiScopeFixture } from './multi-scope';

describe('buildMultiScopeFixture', () => {
  it('assembles default lesson, unit, and sequence buckets', () => {
    const fixture: SearchMultiScopeResponse = buildMultiScopeFixture();
    const parsed = SearchMultiScopeResponseSchema.safeParse(fixture);

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
    const fixture: SearchMultiScopeResponse = buildMultiScopeFixture({
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

    const parsed = SearchMultiScopeResponseSchema.safeParse(fixture);
    expect(parsed.success).toBe(true);
    expect(fixture.suggestions).toStrictEqual([]);
    expect(fixture.suggestionCache).toEqual({ version: 'override', ttlSeconds: 90 });

    const lessonBucket = fixture.buckets.find((bucket) => bucket.scope === 'lessons');
    expect(lessonBucket?.result.took).toBe(7);

    const unitBucket = fixture.buckets.find((bucket) => bucket.scope === 'units');
    expect(unitBucket?.result.timedOut).toBe(true);
  });

  it('produces sequence buckets with KS4 options when using science dataset', () => {
    const fixture: SearchMultiScopeResponse = buildMultiScopeFixture({
      sequencesDataset: 'ks4-science',
    });
    const sequenceBucket = fixture.buckets.find((bucket) => bucket.scope === 'sequences');
    if (!sequenceBucket) {
      throw new Error('Expected a sequences bucket in multi-scope fixture');
    }
    const sequences = SearchSequencesResponseSchema.parse(sequenceBucket.result);
    const hasKs4Highlight = sequences.results.some((entry) =>
      entry.highlights.some((highlight) => highlight.includes('KS4')),
    );
    expect(hasKs4Highlight).toBe(true);
  });

  it('guards unit subject slugs to recognised subjects', () => {
    const fixture: SearchMultiScopeResponse = buildMultiScopeFixture({
      unitsDataset: 'ks4-science',
    });
    const unitBucket = fixture.buckets.find((bucket) => bucket.scope === 'units');
    if (!unitBucket) {
      throw new Error('Expected a units bucket in multi-scope fixture');
    }
    const units = SearchUnitsResponseSchema.parse(unitBucket.result);
    const subjects = units.results
      .map((entry) => entry.unit?.subject_slug)
      .filter((slug): slug is NonNullable<typeof slug> => Boolean(slug));
    expect(subjects).toContain('science');
    expect(subjects).not.toContain('unknown');
  });
});
