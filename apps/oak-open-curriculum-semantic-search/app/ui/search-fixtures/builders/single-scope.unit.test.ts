import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { HybridResponseSchema, SuggestionItemSchema } from '../../structured-search.shared';
import { buildSingleScopeFixture } from './single-scope';
import {
  ks2MathsLessons,
  ks2MathsMeta,
  ks2MathsSuggestions,
  ks3ArtLessons,
  ks3ArtMeta,
  ks3ArtSuggestions,
} from '../data';

describe('buildSingleScopeFixture', () => {
  const StructuredFixtureSchema = HybridResponseSchema.extend({
    suggestions: z.array(SuggestionItemSchema).optional(),
  });

  it('builds a KS2 maths lesson fixture that passes schema checks', () => {
    const fixture = buildSingleScopeFixture();

    const parsed = StructuredFixtureSchema.safeParse(fixture);
    expect(parsed.success).toBe(true);
    expect(fixture.scope).toBe('lessons');
    expect(fixture.results).toHaveLength(ks2MathsLessons.length);
    expect(fixture.total).toBe(ks2MathsMeta.total);
    expect(fixture.suggestions).toStrictEqual(ks2MathsSuggestions);
  });

  it('supports alternative datasets such as KS3 art', () => {
    const fixture = StructuredFixtureSchema.parse(buildSingleScopeFixture({ dataset: 'ks3-art' }));

    expect(fixture.results).toHaveLength(ks3ArtLessons.length);
    expect(fixture.total).toBe(ks3ArtMeta.total);
    expect(fixture.suggestions).toStrictEqual(ks3ArtSuggestions);
    const artRecords = fixture.results as Array<{
      lesson?: { subject_slug?: string; key_stage?: string };
    }>;

    for (const record of artRecords) {
      expect(record.lesson?.subject_slug).toBe('art');
      expect(record.lesson?.key_stage).toBe('ks3');
    }
  });

  it('allows overriding totals and suggestions while keeping schema validity', () => {
    const fixture = buildSingleScopeFixture({
      dataset: 'ks3-art',
      overrides: {
        total: 42,
        took: 5,
        timedOut: true,
        suggestions: [],
      },
    });

    const parsed = StructuredFixtureSchema.safeParse(fixture);
    expect(parsed.success).toBe(true);
    expect(fixture.total).toBe(42);
    expect(fixture.took).toBe(5);
    expect(fixture.timedOut).toBe(true);
    expect(fixture.suggestions).toStrictEqual([]);
  });
});
