import { describe, expect, it } from 'vitest';
import {
  extractThreadInfo,
  extractPedagogicalData,
  createEnrichedRollupText,
} from './thread-and-pedagogical-extractors';

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

  it('filters out entries missing required fields', () => {
    const threads = [
      { slug: 'valid', title: 'Valid', order: 1 },
      { slug: '', title: 'Missing slug', order: 2 },
      { slug: 'missing-title', title: '', order: 3 },
      { slug: 'missing-order', title: 'No Order' },
    ];

    const result = extractThreadInfo(threads);

    expect(result.slugs).toEqual(['valid']);
    expect(result.titles).toEqual(['Valid']);
    expect(result.orders).toEqual([1]);
  });
});

describe('extractPedagogicalData', () => {
  it('extracts prior knowledge and national curriculum content', () => {
    const summary = {
      priorKnowledgeRequirements: ['Add fractions', 'Understand denominators'],
      nationalCurriculumContent: ['Fractions and decimals', 'Number operations'],
    };

    const result = extractPedagogicalData(summary);

    expect(result.priorKnowledge).toEqual(['Add fractions', 'Understand denominators']);
    expect(result.nationalCurriculum).toEqual(['Fractions and decimals', 'Number operations']);
  });

  it('returns undefined for empty arrays', () => {
    const summary = {
      priorKnowledgeRequirements: [],
      nationalCurriculumContent: [],
    };

    const result = extractPedagogicalData(summary);

    expect(result.priorKnowledge).toBeUndefined();
    expect(result.nationalCurriculum).toBeUndefined();
  });

  it('handles missing fields gracefully', () => {
    const summary = { unitSlug: 'test', unitTitle: 'Test' };

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
