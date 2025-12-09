/**
 * Shared helper functions for RRF query builders.
 *
 * Contains filter builders, highlight configs, and facet definitions
 * used by both two-way and three-way hybrid search.
 *
 * @module rrf-query-helpers
 */

import type { estypes } from '@elastic/elasticsearch';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';

type QueryContainer = estypes.QueryDslQueryContainer;

/** Creates filters for lesson queries. */
export function createLessonFilters(
  subject?: SearchSubjectSlug,
  keyStage?: KeyStage,
): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (keyStage) {
    filters.push({ term: { key_stage: keyStage } });
  }
  return filters;
}

/** Creates filters for unit queries. */
export function createUnitFilters(
  subject?: SearchSubjectSlug,
  keyStage?: KeyStage,
  minLessons?: number,
): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (keyStage) {
    filters.push({ term: { key_stage: keyStage } });
  }
  if (typeof minLessons === 'number') {
    filters.push({ range: { lesson_count: { gte: minLessons } } });
  }
  return filters;
}

/** Creates highlight configuration for lesson transcripts. */
export function createLessonHighlight(): estypes.SearchHighlight {
  return {
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
  } satisfies estypes.SearchHighlight;
}

/** Creates highlight configuration for unit rollup text. */
export function createUnitHighlight(): estypes.SearchHighlight {
  return {
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
  } satisfies estypes.SearchHighlight;
}

/**
 * Creates facet aggregations for lesson queries.
 *
 * Includes programme factors (tier, exam_board, pathway) for KS4 filtering.
 */
export function createLessonFacets(): Record<string, estypes.AggregationsAggregationContainer> {
  return {
    key_stages: { terms: { field: 'key_stage', size: 10 } },
    subjects: { terms: { field: 'subject_slug', size: 20 } },
    tiers: { terms: { field: 'tier', size: 5 } },
    exam_boards: { terms: { field: 'exam_board', size: 10 } },
    pathways: { terms: { field: 'pathway', size: 10 } },
  };
}

/**
 * Creates facet aggregations for unit queries.
 *
 * Includes programme factors (tier, exam_board, pathway) for KS4 filtering.
 */
export function createUnitFacets(): Record<string, estypes.AggregationsAggregationContainer> {
  return {
    key_stages: { terms: { field: 'key_stage', size: 10 } },
    subjects: { terms: { field: 'subject_slug', size: 20 } },
    tiers: { terms: { field: 'tier', size: 5 } },
    exam_boards: { terms: { field: 'exam_board', size: 10 } },
    pathways: { terms: { field: 'pathway', size: 10 } },
  };
}

/** Lesson BM25 search fields with boosts. */
const LESSON_BM25_FIELDS = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  'misconceptions_and_common_mistakes',
  'teacher_tips',
  'content_guidance',
  'transcript_text',
];

/** Unit BM25 search fields with boosts. */
const UNIT_BM25_FIELDS = ['unit_title^3', 'rollup_text', 'unit_topics^1.5'];

/** Creates a BM25 standard retriever for lessons. */
export function createLessonBm25Retriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    standard: {
      query: {
        multi_match: {
          query: text,
          type: 'best_fields',
          tie_breaker: 0.2,
          fields: LESSON_BM25_FIELDS,
        },
      },
      filter,
    },
  };
}

/** Creates an ELSER semantic retriever for lessons. */
export function createLessonElserRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return { standard: { query: { semantic: { field: 'lesson_semantic', query: text } }, filter } };
}

/** Creates a BM25 standard retriever for units. */
export function createUnitBm25Retriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    standard: {
      query: {
        multi_match: {
          query: text,
          type: 'best_fields',
          tie_breaker: 0.2,
          fields: UNIT_BM25_FIELDS,
        },
      },
      filter,
    },
  };
}

/** Creates an ELSER semantic retriever for units. */
export function createUnitElserRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return { standard: { query: { semantic: { field: 'unit_semantic', query: text } }, filter } };
}
