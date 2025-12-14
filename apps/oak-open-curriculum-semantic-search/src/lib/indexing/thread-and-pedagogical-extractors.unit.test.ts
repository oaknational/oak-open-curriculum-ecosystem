import { describe, expect, it } from 'vitest';
import { unitSummarySchema } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { SearchUnitSummary } from '../../types/oak';
import {
  extractThreadInfo,
  extractPedagogicalData,
  createEnrichedRollupText,
} from './thread-and-pedagogical-extractors';

/** Build a valid unit summary fixture with defaults. */
function buildUnitSummary(overrides: Partial<SearchUnitSummary> = {}): SearchUnitSummary {
  const base: SearchUnitSummary = {
    unitSlug: 'unit-slug',
    unitTitle: 'Unit Title',
    yearSlug: 'year-6',
    year: 'Year 6',
    phaseSlug: 'primary',
    subjectSlug: 'maths',
    keyStageSlug: 'ks2',
    priorKnowledgeRequirements: ['Add fractions with like denominators'],
    nationalCurriculumContent: ['Numerator and denominator'],
    threads: [{ slug: 'sequence-1', title: 'Sequence 1', order: 1 }],
    categories: [{ categoryTitle: 'Fractions', categorySlug: 'fractions' }],
    unitLessons: [
      { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', state: 'published' },
      { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2', state: 'published' },
    ],
    canonicalUrl: 'https://teachers.thenational.academy/units/unit-slug',
  };
  const summary: SearchUnitSummary = { ...base, ...overrides };
  // Validate against SDK schema to ensure fixture is valid
  void unitSummarySchema.parse(summary);
  return summary;
}

describe('extractThreadInfo', () => {
  it('extracts thread slugs, titles, and orders from threads array', () => {
    const threads = [
      { slug: 'number-thread', title: 'Number', order: 1 },
      { slug: 'algebra-thread', title: 'Algebra', order: 2 },
    ];

    const result = extractThreadInfo(threads);

    expect(result.slugs).toEqual(['number-thread', 'algebra-thread']);
    expect(result.titles).toEqual(['Number', 'Algebra']);
    expect(result.orders).toEqual([1, 2]);
  });

  it('returns undefined arrays when threads is undefined', () => {
    const result = extractThreadInfo(undefined);

    expect(result.slugs).toBeUndefined();
    expect(result.titles).toBeUndefined();
    expect(result.orders).toBeUndefined();
  });

  it('returns undefined arrays when threads is empty', () => {
    const result = extractThreadInfo([]);

    expect(result.slugs).toBeUndefined();
    expect(result.titles).toBeUndefined();
    expect(result.orders).toBeUndefined();
  });

  it('handles single thread', () => {
    const threads = [{ slug: 'single', title: 'Single Thread', order: 1 }];

    const result = extractThreadInfo(threads);

    expect(result.slugs).toEqual(['single']);
    expect(result.titles).toEqual(['Single Thread']);
    expect(result.orders).toEqual([1]);
  });
});

describe('extractPedagogicalData', () => {
  it('extracts prior knowledge and national curriculum content', () => {
    const summary = buildUnitSummary({
      priorKnowledgeRequirements: ['Add fractions', 'Understand denominators'],
      nationalCurriculumContent: ['Fractions and decimals', 'Number operations'],
    });

    const result = extractPedagogicalData(summary);

    expect(result.priorKnowledge).toEqual(['Add fractions', 'Understand denominators']);
    expect(result.nationalCurriculum).toEqual(['Fractions and decimals', 'Number operations']);
  });

  it('returns undefined for empty arrays', () => {
    const summary = buildUnitSummary({
      priorKnowledgeRequirements: [],
      nationalCurriculumContent: [],
    });

    const result = extractPedagogicalData(summary);

    expect(result.priorKnowledge).toBeUndefined();
    expect(result.nationalCurriculum).toBeUndefined();
  });
});

describe('createEnrichedRollupText', () => {
  it('combines snippets with pedagogical context', () => {
    const snippets = ['Lesson 1 content.', 'Lesson 2 content.'];
    const pedagogicalData = {
      priorKnowledge: ['Basic fractions'],
      nationalCurriculum: ['Number operations'],
    };

    const result = createEnrichedRollupText(snippets, pedagogicalData);

    expect(result).toContain('Lesson 1 content.');
    expect(result).toContain('Lesson 2 content.');
    expect(result).toContain('Prior Knowledge');
    expect(result).toContain('Basic fractions');
    expect(result).toContain('National Curriculum');
    expect(result).toContain('Number operations');
  });

  it('returns just snippets when no pedagogical data', () => {
    const snippets = ['Lesson 1 content.', 'Lesson 2 content.'];
    const pedagogicalData = {
      priorKnowledge: undefined,
      nationalCurriculum: undefined,
    };

    const result = createEnrichedRollupText(snippets, pedagogicalData);

    expect(result).toBe('Lesson 1 content.\n\nLesson 2 content.');
    expect(result).not.toContain('Prior Knowledge');
    expect(result).not.toContain('National Curriculum');
  });

  it('handles partial pedagogical data', () => {
    const snippets = ['Content.'];
    const pedagogicalData = {
      priorKnowledge: ['Some prior knowledge'],
      nationalCurriculum: undefined,
    };

    const result = createEnrichedRollupText(snippets, pedagogicalData);

    expect(result).toContain('Content.');
    expect(result).toContain('Prior Knowledge');
    expect(result).toContain('Some prior knowledge');
    expect(result).not.toContain('National Curriculum');
  });
});
