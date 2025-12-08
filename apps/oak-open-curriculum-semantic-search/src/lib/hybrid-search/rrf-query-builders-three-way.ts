/**
 * Three-way RRF query builders for hybrid search.
 *
 * Combines three retrieval methods using Reciprocal Rank Fusion (ES 8.11+ retriever API):
 * 1. BM25 lexical search (multi_match via standard retriever)
 * 2. ELSER sparse embeddings (semantic via standard retriever)
 * 3. E5 dense vectors (kNN retriever)
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
  createLessonBm25Retriever,
  createLessonElserRetriever,
  createUnitBm25Retriever,
  createUnitElserRetriever,
} from './rrf-query-helpers';

type QueryContainer = estypes.QueryDslQueryContainer;

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
    retriever: createThreeWayLessonRetriever(text, queryVector, filters),
  };

  if (includeHighlights) request.highlight = createLessonHighlight();
  if (includeFacets) request.aggs = createLessonFacets();

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
    retriever: createThreeWayUnitRetriever(text, queryVector, filters),
  };

  if (includeHighlights) request.highlight = createUnitHighlight();

  return request;
}

/** Creates a three-way RRF retriever for lessons with filtered kNN. */
function createThreeWayLessonRetriever(
  text: string,
  queryVector: number[] | undefined,
  filters: QueryContainer[],
): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const retrievers: estypes.RetrieverContainer[] = [
    createLessonBm25Retriever(text, filterClause),
    createLessonElserRetriever(text, filterClause),
  ];

  if (queryVector) {
    retrievers.push(createLessonKnnRetriever(queryVector, filterClause));
  }

  return { rrf: { retrievers, rank_window_size: 60, rank_constant: 60 } };
}

/** Creates a three-way RRF retriever for units with filtered kNN. */
function createThreeWayUnitRetriever(
  text: string,
  queryVector: number[] | undefined,
  filters: QueryContainer[],
): estypes.RetrieverContainer {
  const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
  const retrievers: estypes.RetrieverContainer[] = [
    createUnitBm25Retriever(text, filterClause),
    createUnitElserRetriever(text, filterClause),
  ];

  if (queryVector) {
    retrievers.push(createUnitKnnRetriever(queryVector, filterClause));
  }

  return { rrf: { retrievers, rank_window_size: 40, rank_constant: 40 } };
}

/** Creates a kNN retriever for lesson dense vectors. */
function createLessonKnnRetriever(
  queryVector: number[],
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    knn: {
      field: 'lesson_dense_vector',
      query_vector: queryVector,
      k: 60,
      num_candidates: 120,
      filter,
    },
  };
}

/** Creates a kNN retriever for unit dense vectors. */
function createUnitKnnRetriever(
  queryVector: number[],
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    knn: {
      field: 'unit_dense_vector',
      query_vector: queryVector,
      k: 40,
      num_candidates: 80,
      filter,
    },
  };
}
