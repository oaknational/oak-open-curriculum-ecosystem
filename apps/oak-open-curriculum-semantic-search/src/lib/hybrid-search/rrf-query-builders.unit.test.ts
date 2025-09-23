import { describe, expect, it } from 'vitest';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
  buildSequenceRrfRequest,
} from './rrf-query-builders';

const geography = 'geography' as SearchSubjectSlug;
const ks4 = 'ks4' as KeyStage;

describe('buildLessonRrfRequest', () => {
  it('constructs lexical + semantic RRF query with filters, highlights, and facets', () => {
    const request = buildLessonRrfRequest({
      text: 'mountain formation',
      size: 25,
      subject: geography,
      keyStage: ks4,
      includeHighlights: true,
      includeFacets: true,
    });

    expect(request.index).toBe('oak_lessons');
    expect(request.size).toBe(25);
    expect(request.rank).toEqual({
      rrf: { window_size: 60, rank_constant: 60 },
      queries: [
        {
          multi_match: {
            query: 'mountain formation',
            type: 'best_fields',
            tie_breaker: 0.2,
            fields: [
              'lesson_title^3',
              'lesson_keywords^2',
              'key_learning_points^2',
              'misconceptions_and_common_mistakes',
              'teacher_tips',
              'content_guidance',
              'transcript_text',
            ],
          },
        },
        { semantic: { field: 'lesson_semantic', query: 'mountain formation' } },
      ],
    });
    expect(request.query).toEqual({
      bool: {
        filter: [{ term: { subject_slug: geography } }, { term: { key_stage: ks4 } }],
      },
    });
    expect(request.highlight).toEqual({
      type: 'unified',
      order: 'score',
      boundary_scanner: 'sentence',
      fields: {
        transcript_text: {
          fragment_size: 160,
          number_of_fragments: 2,
          pre_tags: ['<mark>'],
          post_tags: ['</mark>'],
        },
      },
    });
    expect(request.aggs).toEqual({
      key_stages: { terms: { field: 'key_stage', size: 10 } },
      subjects: { terms: { field: 'subject_slug', size: 20 } },
    });
  });

  it('omits optional sections when not requested', () => {
    const request = buildLessonRrfRequest({
      text: 'mountain formation',
      size: 10,
      includeHighlights: false,
      includeFacets: false,
    });

    expect(request.highlight).toBeUndefined();
    expect(request.aggs).toBeUndefined();
  });
});

describe('buildUnitRrfRequest', () => {
  it('constructs unit rollup RRF query with lesson count filter and highlights', () => {
    const request = buildUnitRrfRequest({
      text: 'glaciation',
      size: 15,
      subject: geography,
      keyStage: ks4,
      minLessons: 3,
      includeHighlights: true,
    });

    expect(request.index).toBe('oak_unit_rollup');
    expect(request.rank).toEqual({
      rrf: { window_size: 60, rank_constant: 60 },
      queries: [
        {
          multi_match: {
            query: 'glaciation',
            type: 'best_fields',
            tie_breaker: 0.2,
            fields: ['unit_title^3', 'rollup_text', 'unit_topics^1.5'],
          },
        },
        { semantic: { field: 'unit_semantic', query: 'glaciation' } },
      ],
    });
    expect(request.query).toEqual({
      bool: {
        filter: [
          { term: { subject_slug: geography } },
          { term: { key_stage: ks4 } },
          { range: { lesson_count: { gte: 3 } } },
        ],
      },
    });
    expect(request.highlight).toEqual({
      type: 'unified',
      boundary_scanner: 'sentence',
      fields: {
        rollup_text: {
          fragment_size: 160,
          number_of_fragments: 2,
          pre_tags: ['<mark>'],
          post_tags: ['</mark>'],
        },
      },
    });
  });
});

describe('buildSequenceRrfRequest', () => {
  it('constructs sequence RRF query with default window constants', () => {
    const request = buildSequenceRrfRequest({
      text: 'secondary geography',
      size: 20,
      subject: geography,
      phaseSlug: 'secondary',
    });

    expect(request.index).toBe('oak_sequences');
    expect(request.rank).toEqual({
      rrf: { window_size: 40, rank_constant: 40 },
      queries: [
        {
          multi_match: {
            query: 'secondary geography',
            type: 'best_fields',
            fields: ['sequence_title^2', 'category_titles', 'subject_title', 'phase_title'],
          },
        },
        { semantic: { field: 'sequence_semantic', query: 'secondary geography' } },
      ],
    });
    expect(request.query).toEqual({
      bool: {
        filter: [{ term: { subject_slug: geography } }, { term: { phase_slug: 'secondary' } }],
      },
    });
    expect(request.highlight).toBeUndefined();
    expect(request.aggs).toBeUndefined();
  });
});
