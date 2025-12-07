/**
 * Three-way RRF query builders for hybrid search.
 *
 * Combines three retrieval methods using Reciprocal Rank Fusion:
 * 1. BM25 lexical search (multi_match)
 * 2. ELSER sparse embeddings (semantic)
 * 3. E5 dense vectors (kNN with HNSW index)
 *
 * @see ADR-072 - Three-Way Hybrid Search Architecture
 * @module rrf-query-builders-three-way
 */

import type { Client, estypes } from '@elastic/elasticsearch';
import type { EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { generateDenseVector } from '../indexing/dense-vector-generation';
import {
  createLessonFilters,
  createLessonHighlight,
  createLessonFacets,
  createUnitFilters,
  createUnitHighlight,
} from './rrf-query-helpers';

type QueryContainer = estypes.QueryDslQueryContainer;

interface RrfRank {
  rrf: { window_size: number; rank_constant: number };
  queries: QueryContainer[];
}

/** Parameters for lesson RRF search. */
export interface LessonRrfParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  includeHighlights?: boolean;
  includeFacets?: boolean;
}

/** Parameters for unit RRF search. */
export interface UnitRrfParams {
  text: string;
  size: number;
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  includeHighlights?: boolean;
}

/**
 * Builds a three-way RRF request for lessons: BM25 + ELSER + Dense Vectors (kNN).
 *
 * Generates a query vector using the E5 inference endpoint and combines three retrieval methods.
 * Gracefully degrades to two-way hybrid (BM25 + ELSER) if dense vector generation fails.
 *
 * @see ADR-072 - Three-Way Hybrid Search Architecture
 */
export async function buildThreeWayLessonRrfRequest(
  esClient: Client,
  params: LessonRrfParams,
): Promise<EsSearchRequest> {
  const {
    text,
    size,
    subject,
    keyStage,
    includeHighlights = false,
    includeFacets = false,
  } = params;
  const filters = createLessonFilters(subject, keyStage);
  const queryVector = await generateDenseVector(esClient, text);

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('lessons'),
    size,
    rank: createThreeWayLessonRank(text, queryVector, filters),
    query: { bool: { filter: filters } },
  };

  if (includeHighlights) {
    request.highlight = createLessonHighlight();
  }
  if (includeFacets) {
    request.aggs = createLessonFacets();
  }

  return request;
}

/**
 * Builds a three-way RRF request for units: BM25 + ELSER + Dense Vectors (kNN).
 *
 * @see ADR-072 - Three-Way Hybrid Search Architecture
 */
export async function buildThreeWayUnitRrfRequest(
  esClient: Client,
  params: UnitRrfParams,
): Promise<EsSearchRequest> {
  const { text, size, subject, keyStage, minLessons, includeHighlights = false } = params;
  const filters = createUnitFilters(subject, keyStage, minLessons);
  const queryVector = await generateDenseVector(esClient, text);

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('unit_rollup'),
    size,
    rank: createThreeWayUnitRank(text, queryVector, filters),
    query: { bool: { filter: filters } },
  };

  if (includeHighlights) {
    request.highlight = createUnitHighlight();
  }

  return request;
}

/** Creates three-way RRF rank for lessons with filtered kNN. */
function createThreeWayLessonRank(
  text: string,
  queryVector: number[] | undefined,
  filters: QueryContainer[],
): RrfRank {
  const queries: QueryContainer[] = [
    {
      multi_match: {
        query: text,
        type: 'best_fields',
        tie_breaker: 0.2,
        fields: [
          'lesson_title^3',
          'lesson_keywords^2',
          'key_learning_points^2',
          'misconceptions_and_common_mistakes',
          'teacher_tips',
          'content_guidance',
          'transcript_text',
        ],
      },
    },
    { semantic: { field: 'lesson_semantic', query: text } },
  ];

  if (queryVector) {
    queries.push({
      knn: {
        field: 'lesson_dense_vector',
        query_vector: queryVector,
        k: 60,
        num_candidates: 120,
        filter: filters.length > 0 ? filters : undefined,
      },
    });
  }

  return { rrf: { window_size: 60, rank_constant: 60 }, queries };
}

/** Creates three-way RRF rank for units with filtered kNN. */
function createThreeWayUnitRank(
  text: string,
  queryVector: number[] | undefined,
  filters: QueryContainer[],
): RrfRank {
  const queries: QueryContainer[] = [
    {
      multi_match: {
        query: text,
        type: 'best_fields',
        fields: ['unit_title^2', 'unit_topics', 'rollup_text'],
      },
    },
    { semantic: { field: 'unit_semantic', query: text } },
  ];

  if (queryVector) {
    queries.push({
      knn: {
        field: 'unit_dense_vector',
        query_vector: queryVector,
        k: 40,
        num_candidates: 80,
        filter: filters.length > 0 ? filters : undefined,
      },
    });
  }

  return { rrf: { window_size: 40, rank_constant: 40 }, queries };
}
