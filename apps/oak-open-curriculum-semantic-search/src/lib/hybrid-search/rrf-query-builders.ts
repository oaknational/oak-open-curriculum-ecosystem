/**
 * Two-way RRF query builders for hybrid search.
 *
 * Combines two retrieval methods using Reciprocal Rank Fusion (ES 8.11+ retriever API):
 * 1. BM25 lexical search (multi_match via standard retriever)
 * 2. ELSER sparse embeddings (semantic via standard retriever)
 *
 * Phase 2 experiments confirmed that two-way hybrid (BM25 + ELSER) is optimal.
 * Dense vectors (E5) provided no benefit and were removed.
 *
 * @see `.agent/research/elasticsearch/hybrid-search-reranking-evaluation.md`
 * @module rrf-query-builders
 */

import type { estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import {
  createLessonFilters,
  createLessonHighlight,
  createLessonFacets,
  createLessonBm25Retriever,
  createLessonElserRetriever,
  createUnitFilters,
  createUnitHighlight,
  createUnitFacets,
  createUnitBm25Retriever,
  createUnitElserRetriever,
} from './rrf-query-helpers';

type QueryContainer = estypes.QueryDslQueryContainer;

/** Parameters for sequence RRF search. */
export interface SequenceRrfParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  phaseSlug?: string;
}

/** Builds a two-way RRF request for lessons (BM25 + ELSER). */
export function buildLessonRrfRequest(params: {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  unitSlug?: string;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}): EsSearchRequest {
  const {
    text,
    size,
    subject,
    keyStage,
    unitSlug,
    includeHighlights = false,
    includeFacets = false,
  } = params;
  const filters = createLessonFilters(subject, keyStage, unitSlug);
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: createLessonRetriever(text, filters),
  };

  if (includeHighlights) request.highlight = createLessonHighlight();
  if (includeFacets) request.aggs = createLessonFacets();

  return request;
}

/** Builds a two-way RRF request for units (BM25 + ELSER). */
export function buildUnitRrfRequest(params: {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}): EsSearchRequest {
  const {
    text,
    size,
    subject,
    keyStage,
    minLessons,
    includeHighlights = false,
    includeFacets = false,
  } = params;
  const filters = createUnitFilters(subject, keyStage, minLessons);
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: createUnitRetriever(text, filters),
  };

  if (includeHighlights) request.highlight = createUnitHighlight();
  if (includeFacets) request.aggs = createUnitFacets();

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

/** Creates a two-way RRF retriever for lessons. */
function createLessonRetriever(
  text: string,
  filters: QueryContainer[],
): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  return {
    rrf: {
      retrievers: [
        createLessonBm25Retriever(text, filterClause),
        createLessonElserRetriever(text, filterClause),
      ],
      rank_window_size: 60,
      rank_constant: 60,
    },
  };
}

/** Creates a two-way RRF retriever for units. */
function createUnitRetriever(text: string, filters: QueryContainer[]): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  return {
    rrf: {
      retrievers: [
        createUnitBm25Retriever(text, filterClause),
        createUnitElserRetriever(text, filterClause),
      ],
      rank_window_size: 60,
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
  if (subject) filters.push({ term: { subject_slug: subject } });
  if (phaseSlug) filters.push({ term: { phase_slug: phaseSlug } });
  return filters;
}
