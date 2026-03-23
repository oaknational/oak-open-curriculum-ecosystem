/**
 * Experiment query builders for hybrid superiority testing.
 *
 * These builders are used to compare BM25-only and ELSER-only retrieval
 * against hybrid search in Phase 3.0 experiments.
 *
 * All retriever building blocks imported from SDK (ADR-134).
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

import {
  buildBm25Retriever,
  buildLessonHighlight,
  buildUnitHighlight,
  LESSON_BM25_CONTENT,
  LESSON_BM25_CONFIG,
  LESSON_CONTENT_SEMANTIC,
  UNIT_BM25_CONTENT,
  UNIT_BM25_CONFIG,
  UNIT_CONTENT_SEMANTIC,
} from '@oaknational/oak-search-sdk/read';
import type { estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import {
  createLessonFilters,
  createLessonFacets,
  createUnitFilters,
  createUnitFacets,
} from './rrf-query-helpers';

// Re-export ablation builders for backwards compatibility
export {
  buildLessonBm25StructureOnlyRequest,
  buildLessonElserStructureOnlyRequest,
  buildUnitBm25StructureOnlyRequest,
  buildUnitElserStructureOnlyRequest,
  buildLessonContentHybridRequest,
  buildLessonStructureHybridRequest,
  buildUnitContentHybridRequest,
  buildUnitStructureHybridRequest,
} from './ablation-query-builders';

/** Common parameters for lesson search requests. */
export interface LessonSearchParams {
  query: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  unitSlug?: string;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/** Builds a BM25-only request for lessons (no semantic search). */
export function buildLessonBm25OnlyRequest(params: LessonSearchParams): EsSearchRequest {
  const {
    query,
    size,
    subject,
    keyStage,
    unitSlug,
    includeHighlights = true,
    includeFacets = false,
  } = params;
  const filters = createLessonFilters({ subject, keyStage, unitSlug });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: buildBm25Retriever(query, LESSON_BM25_CONTENT, filterClause, [], LESSON_BM25_CONFIG),
  };

  if (includeHighlights) {
    request.highlight = buildLessonHighlight();
  }
  if (includeFacets) {
    request.aggs = createLessonFacets();
  }
  return request;
}

/** Builds an ELSER-only request for lessons (no BM25 lexical search). */
export function buildLessonElserOnlyRequest(params: LessonSearchParams): EsSearchRequest {
  const {
    query,
    size,
    subject,
    keyStage,
    unitSlug,
    includeHighlights = true,
    includeFacets = false,
  } = params;
  const filters = createLessonFilters({ subject, keyStage, unitSlug });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const retriever: estypes.RetrieverContainer = {
    standard: {
      query: { semantic: { field: LESSON_CONTENT_SEMANTIC, query } },
      filter: filterClause,
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
  if (includeFacets) {
    request.aggs = createLessonFacets();
  }
  return request;
}

/** Common parameters for unit search requests. */
export interface UnitSearchParams {
  query: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/** Builds a BM25-only request for units (no semantic search). */
export function buildUnitBm25OnlyRequest(params: UnitSearchParams): EsSearchRequest {
  const {
    query,
    size,
    subject,
    keyStage,
    minLessons,
    includeHighlights = true,
    includeFacets = false,
  } = params;
  const filters = createUnitFilters({ subject, keyStage, minLessons });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: buildBm25Retriever(query, UNIT_BM25_CONTENT, filterClause, [], UNIT_BM25_CONFIG),
  };

  if (includeHighlights) {
    request.highlight = buildUnitHighlight();
  }
  if (includeFacets) {
    request.aggs = createUnitFacets();
  }
  return request;
}

/** Builds an ELSER-only request for units (no BM25 lexical search). */
export function buildUnitElserOnlyRequest(params: UnitSearchParams): EsSearchRequest {
  const {
    query,
    size,
    subject,
    keyStage,
    minLessons,
    includeHighlights = true,
    includeFacets = false,
  } = params;
  const filters = createUnitFilters({ subject, keyStage, minLessons });
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const retriever: estypes.RetrieverContainer = {
    standard: {
      query: { semantic: { field: UNIT_CONTENT_SEMANTIC, query } },
      filter: filterClause,
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
  if (includeFacets) {
    request.aggs = createUnitFacets();
  }
  return request;
}
