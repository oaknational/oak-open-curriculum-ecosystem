/**
 * Ablation query builders for four-retriever testing.
 *
 * Configurations: structure-only retrievers, two-way hybrids.
 * All retriever building blocks imported from SDK (ADR-134).
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
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
import type { LessonSearchParams, UnitSearchParams } from './experiment-query-builders';
import { createLessonFilters, createUnitFilters } from './rrf-query-helpers';

type QueryContainer = estypes.QueryDslQueryContainer;

/** RRF parameters for two-way hybrid combinations. */
const TWO_WAY_RRF_PARAMS = { rank_window_size: 80, rank_constant: 60 } as const;

/** Builds an ELSER semantic retriever for a given field. */
function buildElserRetriever(
  semanticField: string,
  query: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return { standard: { query: { semantic: { field: semanticField, query } }, filter } };
}

// ============================================================================
// STRUCTURE-ONLY RETRIEVERS
// ============================================================================

/** Builds a BM25-only request for lessons searching STRUCTURE field only. */
export function buildLessonBm25StructureOnlyRequest(params: LessonSearchParams): EsSearchRequest {
  const { query, size, subject, keyStage, unitSlug, includeHighlights = true } = params;
  const filters = createLessonFilters({ subject, keyStage, unitSlug });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: buildBm25Retriever(
      query,
      LESSON_BM25_STRUCTURE,
      filterClause,
      [],
      LESSON_BM25_CONFIG,
    ),
  };
  if (includeHighlights) {
    request.highlight = buildLessonHighlight();
  }
  return request;
}

/** Builds an ELSER-only request for lessons searching STRUCTURE field only. */
export function buildLessonElserStructureOnlyRequest(params: LessonSearchParams): EsSearchRequest {
  const { query, size, subject, keyStage, unitSlug, includeHighlights = true } = params;
  const filters = createLessonFilters({ subject, keyStage, unitSlug });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: buildElserRetriever(LESSON_STRUCTURE_SEMANTIC, query, filterClause),
  };
  if (includeHighlights) {
    request.highlight = buildLessonHighlight();
  }
  return request;
}

/** Builds a BM25-only request for units searching STRUCTURE field only. */
export function buildUnitBm25StructureOnlyRequest(params: UnitSearchParams): EsSearchRequest {
  const { query, size, subject, keyStage, minLessons, includeHighlights = true } = params;
  const filters = createUnitFilters({ subject, keyStage, minLessons });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: buildBm25Retriever(query, UNIT_BM25_STRUCTURE, filterClause, [], UNIT_BM25_CONFIG),
  };
  if (includeHighlights) {
    request.highlight = buildUnitHighlight();
  }
  return request;
}

/** Builds an ELSER-only request for units searching STRUCTURE field only. */
export function buildUnitElserStructureOnlyRequest(params: UnitSearchParams): EsSearchRequest {
  const { query, size, subject, keyStage, minLessons, includeHighlights = true } = params;
  const filters = createUnitFilters({ subject, keyStage, minLessons });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: buildElserRetriever(UNIT_STRUCTURE_SEMANTIC, query, filterClause),
  };
  if (includeHighlights) {
    request.highlight = buildUnitHighlight();
  }
  return request;
}

// ============================================================================
// TWO-WAY HYBRID RETRIEVERS
// ============================================================================

/** Builds a content-only hybrid request for lessons (BM25 + ELSER on content). */
export function buildLessonContentHybridRequest(params: LessonSearchParams): EsSearchRequest {
  const { query, size, subject, keyStage, unitSlug, includeHighlights = true } = params;
  const filters = createLessonFilters({ subject, keyStage, unitSlug });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const retriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers: [
        buildBm25Retriever(query, LESSON_BM25_CONTENT, filterClause, [], LESSON_BM25_CONFIG),
        buildElserRetriever(LESSON_CONTENT_SEMANTIC, query, filterClause),
      ],
      ...TWO_WAY_RRF_PARAMS,
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

/** Builds a structure-only hybrid request for lessons (BM25 + ELSER on structure). */
export function buildLessonStructureHybridRequest(params: LessonSearchParams): EsSearchRequest {
  const { query, size, subject, keyStage, unitSlug, includeHighlights = true } = params;
  const filters = createLessonFilters({ subject, keyStage, unitSlug });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const retriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers: [
        buildBm25Retriever(query, LESSON_BM25_STRUCTURE, filterClause, [], LESSON_BM25_CONFIG),
        buildElserRetriever(LESSON_STRUCTURE_SEMANTIC, query, filterClause),
      ],
      ...TWO_WAY_RRF_PARAMS,
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

/** Builds a content-only hybrid request for units (BM25 + ELSER on content). */
export function buildUnitContentHybridRequest(params: UnitSearchParams): EsSearchRequest {
  const { query, size, subject, keyStage, minLessons, includeHighlights = true } = params;
  const filters = createUnitFilters({ subject, keyStage, minLessons });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const retriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers: [
        buildBm25Retriever(query, UNIT_BM25_CONTENT, filterClause, [], UNIT_BM25_CONFIG),
        buildElserRetriever(UNIT_CONTENT_SEMANTIC, query, filterClause),
      ],
      ...TWO_WAY_RRF_PARAMS,
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

/** Builds a structure-only hybrid request for units (BM25 + ELSER on structure). */
export function buildUnitStructureHybridRequest(params: UnitSearchParams): EsSearchRequest {
  const { query, size, subject, keyStage, minLessons, includeHighlights = true } = params;
  const filters = createUnitFilters({ subject, keyStage, minLessons });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const retriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers: [
        buildBm25Retriever(query, UNIT_BM25_STRUCTURE, filterClause, [], UNIT_BM25_CONFIG),
        buildElserRetriever(UNIT_STRUCTURE_SEMANTIC, query, filterClause),
      ],
      ...TWO_WAY_RRF_PARAMS,
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
