/* eslint max-lines: [error, 300] -- JC: defer re-org until directory limits implemented in ESLint */
/**
 * Shared helper functions for RRF query builders.
 *
 * Contains filter builders, highlight configs, and facet definitions
 * used by both two-way and three-way hybrid search.
 *
 */

import type { estypes } from '@elastic/elasticsearch';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Filter options for lesson and unit queries.
 * Uses `terms` query for array document fields (e.g., tiers[], exam_boards[]).
 */
export interface SearchFilterOptions {
  readonly subject?: SearchSubjectSlug;
  readonly keyStage?: KeyStage;
  readonly unitSlug?: string;
  readonly minLessons?: number;
  // KS4 and metadata filter fields (Phase 3 completion)
  readonly tier?: string;
  readonly examBoard?: string;
  readonly examSubject?: string;
  readonly ks4Option?: string;
  readonly year?: string;
  readonly threadSlug?: string;
  readonly category?: string;
}

/** Adds KS4 and metadata filters. For tier, uses bool/should to match tier OR tiers. */
function addMetadataFilters(filters: QueryContainer[], options: SearchFilterOptions): void {
  if (options.tier) {
    filters.push({
      bool: {
        should: [{ term: { tier: options.tier } }, { terms: { tiers: [options.tier] } }],
        minimum_should_match: 1,
      },
    });
  }
  if (options.examBoard) {
    filters.push({ terms: { exam_boards: [options.examBoard] } });
  }
  if (options.examSubject) {
    filters.push({ terms: { exam_subjects: [options.examSubject] } });
  }
  if (options.ks4Option) {
    filters.push({ terms: { ks4_options: [options.ks4Option] } });
  }
  if (options.year) {
    filters.push({ terms: { years: [options.year] } });
  }
  if (options.threadSlug) {
    filters.push({ terms: { thread_slugs: [options.threadSlug] } });
  }
  if (options.category) {
    filters.push({ terms: { categories: [options.category] } });
  }
}

/** Creates filters for lesson queries. */
export function createLessonFilters(options: SearchFilterOptions): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (options.subject) {
    filters.push({ term: { subject_slug: options.subject } });
  }
  if (options.keyStage) {
    filters.push({ term: { key_stage: options.keyStage } });
  }
  if (options.unitSlug) {
    filters.push({ term: { unit_ids: options.unitSlug } });
  }
  addMetadataFilters(filters, options);
  return filters;
}

/** Creates filters for unit queries. */
export function createUnitFilters(options: SearchFilterOptions): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (options.subject) {
    filters.push({ term: { subject_slug: options.subject } });
  }
  if (options.keyStage) {
    filters.push({ term: { key_stage: options.keyStage } });
  }
  if (typeof options.minLessons === 'number') {
    filters.push({ range: { lesson_count: { gte: options.minLessons } } });
  }
  addMetadataFilters(filters, options);
  return filters;
}

/** Creates highlight configuration for lesson content. */
export function createLessonHighlight(): estypes.SearchHighlight {
  return {
    type: 'unified',
    order: 'score',
    boundary_scanner: 'sentence',
    fields: {
      lesson_content: {
        fragment_size: 160,
        number_of_fragments: 2,
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      },
    },
  } satisfies estypes.SearchHighlight;
}

/** Creates highlight configuration for unit content. */
export function createUnitHighlight(): estypes.SearchHighlight {
  return {
    type: 'unified',
    boundary_scanner: 'sentence',
    fields: {
      unit_content: {
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
 * Includes programme factors (tier) for KS4 filtering.
 */
export function createLessonFacets(): Record<string, estypes.AggregationsAggregationContainer> {
  return {
    key_stages: { terms: { field: 'key_stage', size: 10 } },
    subjects: { terms: { field: 'subject_slug', size: 20 } },
    tiers: { terms: { field: 'tier', size: 5 } },
  };
}

/**
 * Creates facet aggregations for unit queries.
 *
 * Includes programme factors (tier) for KS4 filtering.
 */
export function createUnitFacets(): Record<string, estypes.AggregationsAggregationContainer> {
  return {
    key_stages: { terms: { field: 'key_stage', size: 10 } },
    subjects: { terms: { field: 'subject_slug', size: 20 } },
    tiers: { terms: { field: 'tier', size: 5 } },
  };
}

/** BM25 field definitions for four-retriever architecture. */
const LESSON_BM25_CONTENT = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  'misconceptions_and_common_mistakes',
  'teacher_tips',
  'content_guidance',
  'lesson_content',
];
const LESSON_BM25_STRUCTURE = ['lesson_structure^2', 'lesson_title^3'];
const UNIT_BM25_CONTENT = ['unit_title^3', 'unit_content', 'unit_topics^1.5'];
const UNIT_BM25_STRUCTURE = ['unit_structure^2', 'unit_title^3'];

/** BM25 for lessons: min_should_match 75% (+11.7% MRR), default fuzziness. */
function createLessonBm25Retriever(
  text: string,
  fields: string[],
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    standard: {
      query: {
        multi_match: {
          query: text,
          type: 'best_fields',
          tie_breaker: 0.2,
          fuzziness: 'AUTO',
          minimum_should_match: '75%',
          fields,
        },
      },
      filter,
    },
  };
}

/** BM25 for units: fuzzy (+4.2% MRR), no min_should_match (-15.8% if enabled). */
function createUnitBm25Retriever(
  text: string,
  fields: string[],
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    standard: {
      query: {
        multi_match: {
          query: text,
          type: 'best_fields',
          tie_breaker: 0.2,
          fuzziness: 'AUTO:3,6',
          prefix_length: 1,
          fuzzy_transpositions: true,
          fields,
        },
      },
      filter,
    },
  };
}

/** Creates an ELSER semantic retriever. */
function createElserRetriever(
  text: string,
  field: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return { standard: { query: { semantic: { field, query: text } }, filter } };
}

/** Creates BM25 content retriever for lessons (full transcript + pedagogical fields). */
export function createLessonBm25ContentRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return createLessonBm25Retriever(text, LESSON_BM25_CONTENT, filter);
}

/** Creates BM25 structure retriever for lessons (curated summary). */
export function createLessonBm25StructureRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return createLessonBm25Retriever(text, LESSON_BM25_STRUCTURE, filter);
}

/** Creates ELSER content retriever for lessons. */
export function createLessonElserContentRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return createElserRetriever(text, 'lesson_content_semantic', filter);
}

/** Creates ELSER structure retriever for lessons. */
export function createLessonElserStructureRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return createElserRetriever(text, 'lesson_structure_semantic', filter);
}

/** Creates BM25 content retriever for units (aggregated transcripts). */
export function createUnitBm25ContentRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return createUnitBm25Retriever(text, UNIT_BM25_CONTENT, filter);
}

/** Creates BM25 structure retriever for units (curated summary). */
export function createUnitBm25StructureRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return createUnitBm25Retriever(text, UNIT_BM25_STRUCTURE, filter);
}

/** Creates ELSER content retriever for units. */
export function createUnitElserContentRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return createElserRetriever(text, 'unit_content_semantic', filter);
}

/** Creates ELSER structure retriever for units. */
export function createUnitElserStructureRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return createElserRetriever(text, 'unit_structure_semantic', filter);
}
