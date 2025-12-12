/**
 * Experiment query builders for hybrid superiority testing.
 *
 * These builders are used to compare BM25-only and ELSER-only retrieval
 * against hybrid search in Phase 3.0 experiments.
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 * @module experiment-query-builders
 */

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

/** Common parameters for lesson search requests. */
export interface LessonSearchParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  unitSlug?: string;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/**
 * Builds a BM25-only request for lessons (no semantic search).
 *
 * Used for hybrid superiority experiments to compare BM25-only vs hybrid.
 * Uses the same BM25 query structure as the hybrid search.
 *
 * @see Phase 3.0 hybrid superiority experiment
 */
export function buildLessonBm25OnlyRequest(params: LessonSearchParams): EsSearchRequest {
  const {
    text,
    size,
    subject,
    keyStage,
    unitSlug,
    includeHighlights = true,
    includeFacets = false,
  } = params;
  const filters = createLessonFilters(subject, keyStage, unitSlug);
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: createLessonBm25Retriever(text, filterClause),
  };

  if (includeHighlights) request.highlight = createLessonHighlight();
  if (includeFacets) request.aggs = createLessonFacets();

  return request;
}

/**
 * Builds an ELSER-only request for lessons (no BM25 lexical search).
 *
 * Used for hybrid superiority experiments to compare ELSER-only vs hybrid.
 * Uses the same ELSER query structure as the hybrid search.
 *
 * @see Phase 3.0 hybrid superiority experiment
 */
export function buildLessonElserOnlyRequest(params: LessonSearchParams): EsSearchRequest {
  const {
    text,
    size,
    subject,
    keyStage,
    unitSlug,
    includeHighlights = true,
    includeFacets = false,
  } = params;
  const filters = createLessonFilters(subject, keyStage, unitSlug);
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: createLessonElserRetriever(text, filterClause),
  };

  if (includeHighlights) request.highlight = createLessonHighlight();
  if (includeFacets) request.aggs = createLessonFacets();

  return request;
}

/** Common parameters for unit search requests. */
export interface UnitSearchParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/**
 * Builds a BM25-only request for units (no semantic search).
 *
 * Used for hybrid superiority experiments to compare BM25-only vs hybrid.
 * Uses the same BM25 query structure as the hybrid search.
 *
 * @see Phase 3.0 hybrid superiority experiment
 */
export function buildUnitBm25OnlyRequest(params: UnitSearchParams): EsSearchRequest {
  const {
    text,
    size,
    subject,
    keyStage,
    minLessons,
    includeHighlights = true,
    includeFacets = false,
  } = params;
  const filters = createUnitFilters(subject, keyStage, minLessons);
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: createUnitBm25Retriever(text, filterClause),
  };

  if (includeHighlights) request.highlight = createUnitHighlight();
  if (includeFacets) request.aggs = createUnitFacets();

  return request;
}

/**
 * Builds an ELSER-only request for units (no BM25 lexical search).
 *
 * Used for hybrid superiority experiments to compare ELSER-only vs hybrid.
 * Uses the same ELSER query structure as the hybrid search.
 *
 * @see Phase 3.0 hybrid superiority experiment
 */
export function buildUnitElserOnlyRequest(params: UnitSearchParams): EsSearchRequest {
  const {
    text,
    size,
    subject,
    keyStage,
    minLessons,
    includeHighlights = true,
    includeFacets = false,
  } = params;
  const filters = createUnitFilters(subject, keyStage, minLessons);
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: createUnitElserRetriever(text, filterClause),
  };

  if (includeHighlights) request.highlight = createUnitHighlight();
  if (includeFacets) request.aggs = createUnitFacets();

  return request;
}
