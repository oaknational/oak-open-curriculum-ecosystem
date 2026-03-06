/**
 * Ablation query builders for four-retriever testing.
 *
 * These builders support the ablation study comparing individual retrievers
 * and hybrid configurations to prove the value of the four-retriever architecture.
 *
 * Configurations:
 * - Structure-only retrievers (BM25 and ELSER on structure field)
 * - Two-way hybrids (content-only and structure-only via RRF)
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

import type { estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { LessonSearchParams, UnitSearchParams } from './experiment-query-builders';
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
} from './rrf-query-helpers';

/** RRF parameters for two-way hybrid combinations */
const TWO_WAY_RRF_PARAMS = {
  rank_window_size: 80,
  rank_constant: 60,
} as const;

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
    retriever: createLessonBm25StructureRetriever(query, filterClause),
  };

  if (includeHighlights) {
    request.highlight = createLessonHighlight();
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
    retriever: createLessonElserStructureRetriever(query, filterClause),
  };

  if (includeHighlights) {
    request.highlight = createLessonHighlight();
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
    retriever: createUnitBm25StructureRetriever(query, filterClause),
  };

  if (includeHighlights) {
    request.highlight = createUnitHighlight();
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
    retriever: createUnitElserStructureRetriever(query, filterClause),
  };

  if (includeHighlights) {
    request.highlight = createUnitHighlight();
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
        createLessonBm25ContentRetriever(query, filterClause),
        createLessonElserContentRetriever(query, filterClause),
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
    request.highlight = createLessonHighlight();
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
        createLessonBm25StructureRetriever(query, filterClause),
        createLessonElserStructureRetriever(query, filterClause),
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
    request.highlight = createLessonHighlight();
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
        createUnitBm25ContentRetriever(query, filterClause),
        createUnitElserContentRetriever(query, filterClause),
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
    request.highlight = createUnitHighlight();
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
        createUnitBm25StructureRetriever(query, filterClause),
        createUnitElserStructureRetriever(query, filterClause),
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
    request.highlight = createUnitHighlight();
  }

  return request;
}
