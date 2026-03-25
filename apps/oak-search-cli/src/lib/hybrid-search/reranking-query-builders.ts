/**
 * Semantic reranking query builders for E-001 experiment.
 *
 * Wraps the existing 4-way RRF retrievers with the `text_similarity_reranker`
 * retriever to apply cross-encoder semantic reranking on top of RRF fusion.
 *
 * All retriever building blocks imported from SDK (ADR-134).
 *
 * @see `.agent/evaluations/experiments/E-001-semantic-reranking.experiment.md`
 */

import type { estypes } from '@elastic/elasticsearch';
import {
  buildBm25Retriever,
  buildLessonHighlight,
  buildUnitHighlight,
  LESSON_BM25_CONTENT,
  LESSON_BM25_STRUCTURE,
  LESSON_BM25_CONFIG,
  LESSON_CONTENT_SEMANTIC,
  LESSON_STRUCTURE_SEMANTIC,
  UNIT_BM25_CONTENT,
  UNIT_BM25_STRUCTURE,
  UNIT_BM25_CONFIG,
  UNIT_CONTENT_SEMANTIC,
  UNIT_STRUCTURE_SEMANTIC,
} from '@oaknational/oak-search-sdk/read';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import {
  createLessonFilters,
  createUnitFilters,
  type SearchFilterOptions,
} from './rrf-query-helpers';

type QueryContainer = estypes.QueryDslQueryContainer;

/** Default rank window size for semantic reranking. */
const DEFAULT_RERANK_WINDOW_SIZE = 20;

/** Elasticsearch inference endpoint for reranking. */
const RERANK_INFERENCE_ID = '.rerank-v1-elasticsearch';

/** RRF parameters for the inner retriever (smaller window for latency). */
const RRF_PARAMS = { rank_window_size: 50, rank_constant: 60 } as const;

/** Builds an ELSER semantic retriever for a given field. */
function buildElserRetriever(
  semanticField: string,
  query: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return { standard: { query: { semantic: { field: semanticField, query } }, filter } };
}

/** Parameters for lesson reranking search. */
export interface LessonRerankingParams extends SearchFilterOptions {
  readonly query: string;
  readonly size: number;
  readonly rerankWindowSize?: number;
  readonly includeHighlights?: boolean;
}

/** Parameters for unit reranking search. */
export interface UnitRerankingParams extends SearchFilterOptions {
  readonly query: string;
  readonly size: number;
  readonly rerankWindowSize?: number;
  readonly includeHighlights?: boolean;
}

/** Builds a lesson search request with 4-way RRF + semantic reranking. */
export function buildLessonRerankingRrfRequest(params: LessonRerankingParams): EsSearchRequest {
  const {
    query,
    size,
    rerankWindowSize = DEFAULT_RERANK_WINDOW_SIZE,
    includeHighlights = true,
    ...filterOptions
  } = params;
  const filters = createLessonFilters(filterOptions);
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;

  const innerRetriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers: [
        buildBm25Retriever(query, LESSON_BM25_CONTENT, filterClause, [], LESSON_BM25_CONFIG),
        buildElserRetriever(LESSON_CONTENT_SEMANTIC, query, filterClause),
        buildBm25Retriever(query, LESSON_BM25_STRUCTURE, filterClause, [], LESSON_BM25_CONFIG),
        buildElserRetriever(LESSON_STRUCTURE_SEMANTIC, query, filterClause),
      ],
      ...RRF_PARAMS,
    },
  };

  const retriever: estypes.RetrieverContainer = {
    text_similarity_reranker: {
      retriever: innerRetriever,
      field: 'lesson_structure',
      inference_id: RERANK_INFERENCE_ID,
      inference_text: query,
      rank_window_size: rerankWindowSize,
    },
  };

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever,
  };
  if (includeHighlights) {
    request.highlight = buildLessonHighlight();
  }
  return request;
}

/** Builds a unit search request with 4-way RRF + semantic reranking. */
export function buildUnitRerankingRrfRequest(params: UnitRerankingParams): EsSearchRequest {
  const {
    query,
    size,
    rerankWindowSize = DEFAULT_RERANK_WINDOW_SIZE,
    includeHighlights = true,
    ...filterOptions
  } = params;
  const filters = createUnitFilters(filterOptions);
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;

  const innerRetriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers: [
        buildBm25Retriever(query, UNIT_BM25_CONTENT, filterClause, [], UNIT_BM25_CONFIG),
        buildElserRetriever(UNIT_CONTENT_SEMANTIC, query, filterClause),
        buildBm25Retriever(query, UNIT_BM25_STRUCTURE, filterClause, [], UNIT_BM25_CONFIG),
        buildElserRetriever(UNIT_STRUCTURE_SEMANTIC, query, filterClause),
      ],
      ...RRF_PARAMS,
    },
  };

  const retriever: estypes.RetrieverContainer = {
    text_similarity_reranker: {
      retriever: innerRetriever,
      field: 'unit_structure',
      inference_id: RERANK_INFERENCE_ID,
      inference_text: query,
      rank_window_size: rerankWindowSize,
    },
  };

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever,
  };
  if (includeHighlights) {
    request.highlight = buildUnitHighlight();
  }
  return request;
}
