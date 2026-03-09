/**
 * Configurable Query Builders for BM25 Ablation Testing
 *
 * These builders allow testing different BM25 configurations
 * to isolate the impact of each Phase 3e enhancement on
 * search quality and latency.
 *
 * @see `./bm25-config.ts` for configuration options
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

import type { estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http.js';
import { resolveCurrentSearchIndexName } from '../search-index-target.js';
import {
  createLessonFilters,
  createLessonHighlight,
  createLessonElserContentRetriever,
  createLessonElserStructureRetriever,
  createUnitFilters,
  createUnitHighlight,
  createUnitElserContentRetriever,
  createUnitElserStructureRetriever,
} from './rrf-query-helpers.js';
import type { Bm25Config } from './bm25-config.js';
import { createConfigurableBm25Retriever } from './bm25-config.js';

/** BM25 field definitions - imported from rrf-query-helpers pattern */
const LESSON_BM25_CONTENT = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  'misconceptions_and_common_mistakes',
  'teacher_tips',
  'content_guidance',
  'lesson_content',
];
const LESSON_BM25_STRUCTURE = ['lesson_structure^2', 'lesson_title^3'];
const UNIT_BM25_CONTENT = ['unit_title^3', 'unit_content', 'unit_topics^1.5'];
const UNIT_BM25_STRUCTURE = ['unit_structure^2', 'unit_title^3'];

/** RRF parameters for four-way hybrid */
const FOUR_WAY_RRF_PARAMS = {
  rank_window_size: 100,
  rank_constant: 60,
} as const;

type QueryContainer = estypes.QueryDslQueryContainer;

/** Search parameters for lessons */
export interface LessonSearchParams {
  readonly query: string;
  readonly size: number;
  readonly subject: 'maths';
  readonly keyStage: 'ks4';
  readonly unitSlug?: string;
  readonly includeHighlights?: boolean;
}

/** Search parameters for units */
export interface UnitSearchParams {
  readonly query: string;
  readonly size: number;
  readonly subject: 'maths';
  readonly keyStage: 'ks4';
  readonly minLessons?: number;
  readonly includeHighlights?: boolean;
}

/**
 * Builds a four-way hybrid RRF request for lessons with configurable BM25.
 *
 * Uses ELSER retrievers as-is (they don't have the configurable parameters)
 * and configurable BM25 retrievers for ablation testing.
 */
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
        // BM25 on content (configurable)
        createConfigurableBm25Retriever(query, LESSON_BM25_CONTENT, filterClause, bm25Config),
        // BM25 on structure (configurable)
        createConfigurableBm25Retriever(query, LESSON_BM25_STRUCTURE, filterClause, bm25Config),
        // ELSER on content (fixed)
        createLessonElserContentRetriever(query, filterClause),
        // ELSER on structure (fixed)
        createLessonElserStructureRetriever(query, filterClause),
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
    request.highlight = createLessonHighlight();
  }

  return request;
}

/**
 * Builds a four-way hybrid RRF request for units with configurable BM25.
 */
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
        // BM25 on content (configurable)
        createConfigurableBm25Retriever(query, UNIT_BM25_CONTENT, filterClause, bm25Config),
        // BM25 on structure (configurable)
        createConfigurableBm25Retriever(query, UNIT_BM25_STRUCTURE, filterClause, bm25Config),
        // ELSER on content (fixed)
        createUnitElserContentRetriever(query, filterClause),
        // ELSER on structure (fixed)
        createUnitElserStructureRetriever(query, filterClause),
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
    request.highlight = createUnitHighlight();
  }

  return request;
}

/**
 * Builds a BM25-only request for lessons (no ELSER, no RRF).
 * Useful for isolating BM25 performance.
 */
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
    request.highlight = createLessonHighlight();
  }

  return request;
}

/**
 * Builds a BM25-only request for units (no ELSER, no RRF).
 */
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
    request.highlight = createUnitHighlight();
  }

  return request;
}
