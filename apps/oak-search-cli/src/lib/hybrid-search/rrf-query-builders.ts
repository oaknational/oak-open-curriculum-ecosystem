/**
 * RRF request builders for hybrid search.
 *
 * All retriever shape construction is delegated to the SDK (ADR-134, ADR-139).
 * This module is responsible for request assembly: combining SDK-built retrievers
 * with CLI-specific filter construction, index resolution, highlights, and facets.
 *
 * @see `.agent/research/elasticsearch/methods/hybrid-retrieval.md`
 */

import {
  buildSequenceRetriever,
  buildLessonRetriever,
  buildUnitRetriever,
  removeNoisePhrases,
  detectCurriculumPhrases,
  buildLessonHighlight,
  buildUnitHighlight,
} from '@oaknational/oak-search-sdk/read';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import {
  createLessonFilters,
  createLessonFacets,
  createUnitFilters,
  createUnitFacets,
  type SearchFilterOptions,
} from './rrf-query-helpers';

import type { estypes } from '@elastic/elasticsearch';

type QueryContainer = estypes.QueryDslQueryContainer;

/** Parameters for sequence RRF search. */
interface SequenceRrfParams {
  query: string;
  size: number;
  subject?: SearchSubjectSlug;
  phaseSlug?: string;
  keyStage?: KeyStage;
}

/** Parameters for lesson RRF search including KS4 metadata filters. */
interface LessonRrfParams extends SearchFilterOptions {
  query: string;
  size: number;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/** Parameters for unit RRF search including KS4 metadata filters. */
interface UnitRrfParams extends SearchFilterOptions {
  query: string;
  size: number;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/**
 * Builds a four-way RRF request for lessons (BM25 + ELSER on Content + Structure).
 *
 * Query preprocessing pipeline:
 * 1. Remove noise phrases (B.4): "that X stuff" → "X"
 * 2. Detect curriculum phrases (B.5): "straight line" → phrase boost
 *
 * Retriever shape delegated to SDK's `buildLessonRetriever` (ADR-134).
 */
export function buildLessonRrfRequest(params: LessonRrfParams): EsSearchRequest {
  const { query, size, includeHighlights = true, includeFacets = false, ...filterOptions } = params;

  const cleanedText = removeNoisePhrases(query);
  const detectedPhrases = detectCurriculumPhrases(cleanedText);
  const filters = createLessonFilters(filterOptions);

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    retriever: buildLessonRetriever(cleanedText, filters, detectedPhrases),
  };

  if (includeHighlights) {
    request.highlight = buildLessonHighlight();
  }
  if (includeFacets) {
    request.aggs = createLessonFacets();
  }

  return request;
}

/**
 * Builds a four-way RRF request for units (BM25 + ELSER on Content + Structure).
 *
 * Query preprocessing pipeline:
 * 1. Remove noise phrases (B.4): "that X stuff" → "X"
 * 2. Detect curriculum phrases (B.5): "straight line" → phrase boost
 *
 * Retriever shape delegated to SDK's `buildUnitRetriever` (ADR-134).
 */
export function buildUnitRrfRequest(params: UnitRrfParams): EsSearchRequest {
  const { query, size, includeHighlights = true, includeFacets = false, ...filterOptions } = params;

  const cleanedText = removeNoisePhrases(query);
  const detectedPhrases = detectCurriculumPhrases(cleanedText);
  const filters = createUnitFilters(filterOptions);

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    retriever: buildUnitRetriever(cleanedText, filters, detectedPhrases),
  };

  if (includeHighlights) {
    request.highlight = buildUnitHighlight();
  }
  if (includeFacets) {
    request.aggs = createUnitFacets();
  }

  return request;
}

/**
 * Builds a two-way RRF request for sequences (BM25 + ELSER).
 *
 * Delegates retriever construction to the SDK's `buildSequenceRetriever`,
 * which owns the canonical two-way RRF shape (ADR-139).
 */
export function buildSequenceRrfRequest(params: SequenceRrfParams): EsSearchRequest {
  const { query, size, subject, phaseSlug, keyStage } = params;
  const filters = createSequenceFilters(subject, phaseSlug, keyStage);
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  return {
    index: resolveCurrentSearchIndexName('sequences'),
    size,
    retriever: buildSequenceRetriever(query, filterClause),
  };
}

/**
 * Creates Elasticsearch filter clauses for sequence queries.
 *
 * @param subject - Optional subject slug to filter by
 * @param phaseSlug - Optional phase slug to filter by
 * @param keyStage - Optional key stage to filter by
 */
function createSequenceFilters(
  subject?: SearchSubjectSlug,
  phaseSlug?: string,
  keyStage?: KeyStage,
): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (subject) {
    filters.push({ term: { subject_slug: subject } });
  }
  if (phaseSlug) {
    filters.push({ term: { phase_slug: phaseSlug } });
  }
  if (keyStage) {
    filters.push({ term: { key_stages: keyStage } });
  }
  return filters;
}
