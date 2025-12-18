/**
 * Four-way RRF query builders for hybrid search.
 *
 * Combines four retrieval methods using Reciprocal Rank Fusion (ES 8.11+ retriever API):
 * 1. BM25 on Content (full transcript/aggregated text)
 * 2. ELSER on Content (semantic embedding of full content)
 * 3. BM25 on Structure (curated semantic summary)
 * 4. ELSER on Structure (semantic embedding of summary)
 *
 * Phase 3 enhancement: Four-retriever architecture provides both lexical and semantic
 * matching on both comprehensive content and curated pedagogical summaries.
 *
 * @see `.agent/research/elasticsearch/hybrid-search-reranking-evaluation.md`
 */

import type { estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { SearchSubjectSlug } from '../../types/oak';
import {
  createLessonFilters,
  createLessonHighlight,
  createLessonFacets,
  createLessonBm25ContentRetriever,
  createLessonBm25StructureRetriever,
  createLessonElserContentRetriever,
  createLessonElserStructureRetriever,
  createUnitFilters,
  createUnitHighlight,
  createUnitFacets,
  createUnitBm25ContentRetriever,
  createUnitBm25StructureRetriever,
  createUnitElserContentRetriever,
  createUnitElserStructureRetriever,
  type SearchFilterOptions,
} from './rrf-query-helpers';

type QueryContainer = estypes.QueryDslQueryContainer;

/** Parameters for sequence RRF search. */
export interface SequenceRrfParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  phaseSlug?: string;
}

/** Parameters for lesson RRF search including KS4 metadata filters. */
export interface LessonRrfParams extends SearchFilterOptions {
  text: string;
  size: number;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/** Parameters for unit RRF search including KS4 metadata filters. */
export interface UnitRrfParams extends SearchFilterOptions {
  text: string;
  size: number;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/** Builds a two-way RRF request for lessons (BM25 + ELSER). */
export function buildLessonRrfRequest(params: LessonRrfParams): EsSearchRequest {
  const { text, size, includeHighlights = true, includeFacets = false, ...filterOptions } = params;
  const filters = createLessonFilters(filterOptions);
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: createLessonRetriever(text, filters),
  };

  if (includeHighlights) {
    request.highlight = createLessonHighlight();
  }
  if (includeFacets) {
    request.aggs = createLessonFacets();
  }

  return request;
}

/** Builds a two-way RRF request for units (BM25 + ELSER). */
export function buildUnitRrfRequest(params: UnitRrfParams): EsSearchRequest {
  const { text, size, includeHighlights = true, includeFacets = false, ...filterOptions } = params;
  const filters = createUnitFilters(filterOptions);
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: createUnitRetriever(text, filters),
  };

  if (includeHighlights) {
    request.highlight = createUnitHighlight();
  }
  if (includeFacets) {
    request.aggs = createUnitFacets();
  }

  return request;
}

/**
 * Builds a two-way RRF request for sequences (BM25 + ELSER).
 *
 * **Note**: Unlike lessons and units, sequence search does not currently include
 * faceted filtering or aggregations. This is intentional as sequences use a
 * different navigation pattern via the `oak_sequence_facets` index for browsing.
 *
 * @future When faceted sequence search is needed, add `includeFacets` parameter
 * and implement `createSequenceFacets()` following the lesson/unit pattern.
 */
export function buildSequenceRrfRequest(params: SequenceRrfParams): EsSearchRequest {
  const { text, size, subject, phaseSlug } = params;
  const filters = createSequenceFilters(subject, phaseSlug);
  return {
    index: resolveCurrentSearchIndexName('sequences'),
    size,
    retriever: createSequenceRetriever(text, filters),
  };
}

/**
 * Creates a four-way RRF retriever for lessons.
 * Combines BM25 + ELSER on both content and structure fields.
 */
function createLessonRetriever(
  text: string,
  filters: QueryContainer[],
): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  return {
    rrf: {
      retrievers: [
        createLessonBm25ContentRetriever(text, filterClause),
        createLessonElserContentRetriever(text, filterClause),
        createLessonBm25StructureRetriever(text, filterClause),
        createLessonElserStructureRetriever(text, filterClause),
      ],
      rank_window_size: 80,
      rank_constant: 60,
    },
  };
}

/**
 * Creates a four-way RRF retriever for units.
 * Combines BM25 + ELSER on both content and structure fields.
 */
function createUnitRetriever(text: string, filters: QueryContainer[]): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  return {
    rrf: {
      retrievers: [
        createUnitBm25ContentRetriever(text, filterClause),
        createUnitElserContentRetriever(text, filterClause),
        createUnitBm25StructureRetriever(text, filterClause),
        createUnitElserStructureRetriever(text, filterClause),
      ],
      rank_window_size: 80,
      rank_constant: 60,
    },
  };
}

/** Sequence BM25 search fields with boosts. */
const SEQUENCE_BM25_FIELDS = [
  'sequence_title^2',
  'category_titles',
  'subject_title',
  'phase_title',
];

/**
 * Creates a two-way RRF retriever for sequences.
 *
 * Includes `fuzziness: 'AUTO'` for typo tolerance.
 */
function createSequenceRetriever(
  text: string,
  filters: QueryContainer[],
): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  return {
    rrf: {
      retrievers: [
        {
          standard: {
            query: {
              multi_match: {
                query: text,
                type: 'best_fields',
                fuzziness: 'AUTO',
                fields: SEQUENCE_BM25_FIELDS,
              },
            },
            filter: filterClause,
          },
        },
        {
          standard: {
            query: { semantic: { field: 'sequence_semantic', query: text } },
            filter: filterClause,
          },
        },
      ],
      rank_window_size: 40,
      rank_constant: 40,
    },
  };
}

function createSequenceFilters(subject?: SearchSubjectSlug, phaseSlug?: string): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (phaseSlug) {
    filters.push({ term: { phase_slug: phaseSlug } });
  }
  return filters;
}
