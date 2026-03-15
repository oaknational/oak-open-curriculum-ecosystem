import { describe, expect, it } from 'vitest';

import { buildLessonFilters, buildSequenceFilters, buildUnitFilters } from './rrf-query-helpers.js';

describe('buildLessonFilters', () => {
  it('includes thread_slugs term filter when threadSlug is provided', () => {
    const filters = buildLessonFilters({
      query: 'fractions',
      threadSlug: 'number-fractions',
    });

    expect(filters).toContainEqual({ term: { thread_slugs: 'number-fractions' } });
  });

  it('does not include thread_slugs filter when threadSlug is omitted', () => {
    const filters = buildLessonFilters({
      query: 'fractions',
    });

    expect(filters).not.toContainEqual({ term: { thread_slugs: 'number-fractions' } });
  });

  it('includes key_stage and unit_ids filters when provided', () => {
    const filters = buildLessonFilters({
      query: 'fractions',
      keyStage: 'ks2',
      unitSlug: 'fractions-year-3',
    });

    expect(filters).toContainEqual({ term: { key_stage: 'ks2' } });
    expect(filters).toContainEqual({ term: { unit_ids: 'fractions-year-3' } });
  });

  it('uses subject_parent for canonical subjects', () => {
    const filters = buildLessonFilters({
      query: 'energy',
      subject: 'science',
      keyStage: 'ks4',
    });

    expect(filters).toContainEqual({ term: { subject_parent: 'science' } });
  });

  it('includes tier and terms-based ks4 filters when provided', () => {
    const filters = buildLessonFilters({
      query: 'forces',
      tier: 'higher',
      examBoard: 'aqa',
      examSubject: 'physics',
      ks4Option: 'combined-science-higher',
      year: '10',
    });

    expect(filters).toContainEqual({
      bool: {
        should: [{ term: { tier: 'higher' } }, { terms: { tiers: ['higher'] } }],
        minimum_should_match: 1,
      },
    });
    expect(filters).toContainEqual({ terms: { exam_boards: ['aqa'] } });
    expect(filters).toContainEqual({ terms: { exam_subjects: ['physics'] } });
    expect(filters).toContainEqual({ terms: { ks4_options: ['combined-science-higher'] } });
    expect(filters).toContainEqual({ terms: { years: ['10'] } });
  });
});

describe('buildUnitFilters', () => {
  it('includes key_stage and min lesson range when provided', () => {
    const filters = buildUnitFilters({
      query: 'fractions',
      keyStage: 'ks2',
      minLessons: 6,
    });

    expect(filters).toContainEqual({ term: { key_stage: 'ks2' } });
    expect(filters).toContainEqual({ range: { lesson_count: { gte: 6 } } });
  });

  it('uses subject_parent when subject parent mapping exists', () => {
    const filters = buildUnitFilters({
      query: 'energy',
      subject: 'science',
    });

    expect(filters).toContainEqual({ term: { subject_parent: 'science' } });
  });

  it('returns an empty filter list when no optional filters are provided', () => {
    const filters = buildUnitFilters({
      query: 'fractions',
    });

    expect(filters).toEqual([]);
  });
});

describe('buildSequenceFilters', () => {
  it('includes subject, phase, key stage and category filters when provided', () => {
    const filters = buildSequenceFilters({
      query: 'maths',
      subject: 'maths',
      phaseSlug: 'secondary',
      keyStage: 'ks4',
      category: 'algebra',
    });

    expect(filters).toContainEqual({ term: { subject_slug: 'maths' } });
    expect(filters).toContainEqual({ term: { phase_slug: 'secondary' } });
    expect(filters).toContainEqual({ term: { key_stages: 'ks4' } });
    expect(filters).toContainEqual({ match_phrase: { category_titles: 'algebra' } });
  });

  it('returns an empty filter list when no optional filters are provided', () => {
    const filters = buildSequenceFilters({
      query: 'maths',
    });

    expect(filters).toEqual([]);
  });
});
