/**
 * Configurable Query Builders for BM25 Ablation Testing
 *
 * These builders allow testing different BM25 configurations
 * to isolate the impact of each Phase 3e enhancement on
 * search quality and latency.
 *
 * All field constants and ELSER retrievers imported from SDK (ADR-134).
 *
 * @see `./bm25-config.ts` for configuration options
 */

import type { estypes } from '@elastic/elasticsearch';
import {
  buildLessonHighlight,
  buildUnitHighlight,
  LESSON_BM25_CONTENT,
  LESSON_BM25_STRUCTURE,
  LESSON_CONTENT_SEMANTIC,
  LESSON_STRUCTURE_SEMANTIC,
  UNIT_BM25_CONTENT,
  UNIT_BM25_STRUCTURE,
  UNIT_CONTENT_SEMANTIC,
  UNIT_STRUCTURE_SEMANTIC,
} from '@oaknational/oak-search-sdk/read';
import type { EsSearchRequest } from '../elastic-http.js';
import { resolveCurrentSearchIndexName } from '../search-index-target.js';
import { createLessonFilters, createUnitFilters } from './rrf-query-helpers.js';
import type { Bm25Config } from './bm25-config.js';
import { createConfigurableBm25Retriever } from './bm25-config.js';

type QueryContainer = estypes.QueryDslQueryContainer;

/** RRF parameters for four-way hybrid. */
const FOUR_WAY_RRF_PARAMS = { rank_window_size: 100, rank_constant: 60 } as const;

/** Builds an ELSER semantic retriever for a given field. */
function buildElserRetriever(
  semanticField: string,
  query: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return { standard: { query: { semantic: { field: semanticField, query } }, filter } };
}

/** Search parameters for lessons. */
export interface LessonSearchParams {
  readonly query: string;
  readonly size: number;
  readonly subject: 'maths';
  readonly keyStage: 'ks4';
  readonly unitSlug?: string;
  readonly includeHighlights?: boolean;
}

/** Search parameters for units. */
export interface UnitSearchParams {
  readonly query: string;
  readonly size: number;
  readonly subject: 'maths';
  readonly keyStage: 'ks4';
  readonly minLessons?: number;
  readonly includeHighlights?: boolean;
}

/** Builds a four-way hybrid RRF request for lessons with configurable BM25. */
export function buildConfigurableLessonRrfRequest(
  params: LessonSearchParams,
  bm25Config: Bm25Config,
): EsSearchRequest {
  const { query, size, subject, keyStage, unitSlug, includeHighlights = true } = params;
  const filters = createLessonFilters({ subject, keyStage, unitSlug });
  const filterClause: QueryContainer | undefined =
    filters.length > 0 ? { bool: { filter: filters } } : undefined;

  const retriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers: [
        createConfigurableBm25Retriever(query, LESSON_BM25_CONTENT, filterClause, bm25Config),
        createConfigurableBm25Retriever(query, LESSON_BM25_STRUCTURE, filterClause, bm25Config),
        buildElserRetriever(LESSON_CONTENT_SEMANTIC, query, filterClause),
        buildElserRetriever(LESSON_STRUCTURE_SEMANTIC, query, filterClause),
      ],
      ...FOUR_WAY_RRF_PARAMS,
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

/** Builds a four-way hybrid RRF request for units with configurable BM25. */
export function buildConfigurableUnitRrfRequest(
  params: UnitSearchParams,
  bm25Config: Bm25Config,
): EsSearchRequest {
  const { query, size, subject, keyStage, minLessons, includeHighlights = true } = params;
  const filters = createUnitFilters({ subject, keyStage, minLessons });
  const filterClause: QueryContainer | undefined =
    filters.length > 0 ? { bool: { filter: filters } } : undefined;

  const retriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers: [
        createConfigurableBm25Retriever(query, UNIT_BM25_CONTENT, filterClause, bm25Config),
        createConfigurableBm25Retriever(query, UNIT_BM25_STRUCTURE, filterClause, bm25Config),
        buildElserRetriever(UNIT_CONTENT_SEMANTIC, query, filterClause),
        buildElserRetriever(UNIT_STRUCTURE_SEMANTIC, query, filterClause),
      ],
      ...FOUR_WAY_RRF_PARAMS,
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

/** Builds a BM25-only request for lessons (no ELSER, no RRF). */
export function buildConfigurableLessonBm25OnlyRequest(
  params: LessonSearchParams,
  bm25Config: Bm25Config,
): EsSearchRequest {
  const { query, size, subject, keyStage, unitSlug, includeHighlights = true } = params;
  const filters = createLessonFilters({ subject, keyStage, unitSlug });
  const filterClause: QueryContainer | undefined =
    filters.length > 0 ? { bool: { filter: filters } } : undefined;

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: createConfigurableBm25Retriever(
      query,
      LESSON_BM25_CONTENT,
      filterClause,
      bm25Config,
    ),
  };
  if (includeHighlights) {
    request.highlight = buildLessonHighlight();
  }
  return request;
}

/** Builds a BM25-only request for units (no ELSER, no RRF). */
export function buildConfigurableUnitBm25OnlyRequest(
  params: UnitSearchParams,
  bm25Config: Bm25Config,
): EsSearchRequest {
  const { query, size, subject, keyStage, minLessons, includeHighlights = true } = params;
  const filters = createUnitFilters({ subject, keyStage, minLessons });
  const filterClause: QueryContainer | undefined =
    filters.length > 0 ? { bool: { filter: filters } } : undefined;

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: createConfigurableBm25Retriever(query, UNIT_BM25_CONTENT, filterClause, bm25Config),
  };
  if (includeHighlights) {
    request.highlight = buildUnitHighlight();
  }
  return request;
}
