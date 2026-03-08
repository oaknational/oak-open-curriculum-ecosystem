/**
 * Semantic reranking query builders for E-001 experiment.
 *
 * Wraps the existing 4-way RRF retrievers with the `text_similarity_reranker`
 * retriever to apply cross-encoder semantic reranking on top of RRF fusion.
 *
 * Uses the `.rerank-v1-elasticsearch` inference endpoint which is available
 * in Elasticsearch Serverless.
 *
 * @see `.agent/evaluations/experiments/E-001-semantic-reranking.experiment.md`
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html
 */

import type { estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import {
  createLessonFilters,
  createLessonHighlight,
  createLessonBm25ContentRetriever,
  createLessonBm25StructureRetriever,
  createLessonElserContentRetriever,
  createLessonElserStructureRetriever,
  createUnitFilters,
  createUnitHighlight,
  createUnitBm25ContentRetriever,
  createUnitBm25StructureRetriever,
  createUnitElserContentRetriever,
  createUnitElserStructureRetriever,
  type SearchFilterOptions,
} from './rrf-query-helpers';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Default rank window size for semantic reranking.
 * Set lower than standard RRF to reduce latency from cross-encoder inference.
 */
const DEFAULT_RERANK_WINDOW_SIZE = 20;

/** Elasticsearch inference endpoint for reranking. */
const RERANK_INFERENCE_ID = '.rerank-v1-elasticsearch';

/**
 * RRF parameters for the inner retriever.
 * Uses smaller rank_window_size than standard (80) to reduce documents
 * passed to the reranker, keeping total latency manageable.
 */
const RRF_PARAMS = {
  rank_window_size: 50,
  rank_constant: 60,
} as const;

/** Parameters for lesson reranking search. */
export interface LessonRerankingParams extends SearchFilterOptions {
  /** The search query. */
  readonly query: string;
  /** Number of results to return. */
  readonly size: number;
  /** Rerank window size (default 50). */
  readonly rerankWindowSize?: number;
  /** Include highlight snippets (default true). */
  readonly includeHighlights?: boolean;
}

/** Parameters for unit reranking search. */
export interface UnitRerankingParams extends SearchFilterOptions {
  /** The search query. */
  readonly query: string;
  /** Number of results to return. */
  readonly size: number;
  /** Rerank window size (default 50). */
  readonly rerankWindowSize?: number;
  /** Include highlight snippets (default true). */
  readonly includeHighlights?: boolean;
}

/**
 * Builds a lesson search request with 4-way RRF + semantic reranking.
 *
 * Wraps the standard 4-way RRF retriever (BM25 + ELSER on content + structure)
 * in a `text_similarity_reranker` that uses the `.rerank-v1-elasticsearch`
 * cross-encoder model to re-score results.
 *
 * @param params - Search parameters including query and filters
 * @returns Elasticsearch search request with reranking retriever
 *
 * @example
 * ```typescript
 * const request = buildLessonRerankingRrfRequest({
 *   query: 'that sohcahtoa stuff for triangles',
 *   size: 10,
 *   subject: 'maths',
 *   keyStage: 'ks4',
 * });
 * const response = await esSearch(request);
 * ```
 */
export function buildLessonRerankingRrfRequest(params: LessonRerankingParams): EsSearchRequest {
  const {
    query,
    size,
    rerankWindowSize = DEFAULT_RERANK_WINDOW_SIZE,
    includeHighlights = true,
    ...filterOptions
  } = params;

  const filters = createLessonFilters(filterOptions);
  const innerRrfRetriever = createLessonRrfRetriever(query, filters);

  const retriever: estypes.RetrieverContainer = {
    text_similarity_reranker: {
      retriever: innerRrfRetriever,
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
    request.highlight = createLessonHighlight();
  }

  return request;
}

/**
 * Builds a unit search request with 4-way RRF + semantic reranking.
 *
 * @param params - Search parameters including query and filters
 * @returns Elasticsearch search request with reranking retriever
 */
export function buildUnitRerankingRrfRequest(params: UnitRerankingParams): EsSearchRequest {
  const {
    query,
    size,
    rerankWindowSize = DEFAULT_RERANK_WINDOW_SIZE,
    includeHighlights = true,
    ...filterOptions
  } = params;

  const filters = createUnitFilters(filterOptions);
  const innerRrfRetriever = createUnitRrfRetriever(query, filters);

  const retriever: estypes.RetrieverContainer = {
    text_similarity_reranker: {
      retriever: innerRrfRetriever,
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
    request.highlight = createUnitHighlight();
  }

  return request;
}

/**
 * Creates a 4-way RRF retriever for lessons.
 * Combines BM25 + ELSER on both content and structure fields.
 */
function createLessonRrfRetriever(
  query: string,
  filters: QueryContainer[],
): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  return {
    rrf: {
      retrievers: [
        createLessonBm25ContentRetriever(query, filterClause),
        createLessonElserContentRetriever(query, filterClause),
        createLessonBm25StructureRetriever(query, filterClause),
        createLessonElserStructureRetriever(query, filterClause),
      ],
      ...RRF_PARAMS,
    },
  };
}

/**
 * Creates a 4-way RRF retriever for units.
 * Combines BM25 + ELSER on both content and structure fields.
 */
function createUnitRrfRetriever(
  query: string,
  filters: QueryContainer[],
): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  return {
    rrf: {
      retrievers: [
        createUnitBm25ContentRetriever(query, filterClause),
        createUnitElserContentRetriever(query, filterClause),
        createUnitBm25StructureRetriever(query, filterClause),
        createUnitElserStructureRetriever(query, filterClause),
      ],
      ...RRF_PARAMS,
    },
  };
}
