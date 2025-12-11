/**
 * @module rerank-experiment/query-builders
 * @description Pure functions for building Elasticsearch search queries.
 */

import type { estypes } from '@elastic/elasticsearch';
import type { SearchConfig } from './types';

/**
 * Build retriever configurations for hybrid search.
 *
 * @param query - Search query string
 * @param queryVector - Dense vector for KNN search, or null for 2-way search
 * @param bm25Fields - Fields for BM25 multi-match
 * @param retrieveSize - Number of candidates to retrieve
 * @returns Array of retrievers (2 or 3 depending on queryVector)
 */
export function buildRetrievers(
  query: string,
  queryVector: number[] | null,
  bm25Fields: readonly string[],
  retrieveSize: number,
): estypes.RetrieverContainer[] {
  const bm25Retriever: estypes.RetrieverContainer = {
    standard: {
      query: {
        multi_match: {
          query,
          type: 'best_fields',
          fuzziness: 'AUTO',
          fields: [...bm25Fields],
        },
      },
    },
  };

  const semanticRetriever: estypes.RetrieverContainer = {
    standard: {
      query: { semantic: { field: 'lesson_semantic', query } },
    },
  };

  const retrievers: estypes.RetrieverContainer[] = [bm25Retriever, semanticRetriever];

  if (queryVector) {
    const knnRetriever: estypes.RetrieverContainer = {
      knn: {
        field: 'lesson_dense_vector',
        query_vector: queryVector,
        k: retrieveSize,
        num_candidates: retrieveSize * 2,
      },
    };
    retrievers.push(knnRetriever);
  }

  return retrievers;
}

/**
 * Build the complete search body for Elasticsearch.
 *
 * @param config - Search configuration
 * @returns Search body ready for ES client
 */
export function buildSearchBody(config: SearchConfig): estypes.SearchRequest {
  const { query, queryVector, useRerank, retrieveSize, rerankSize, bm25Fields } = config;

  const retrievers = buildRetrievers(query, queryVector, bm25Fields, retrieveSize);

  const rrfRetriever: estypes.RetrieverContainer = {
    rrf: {
      retrievers,
      rank_window_size: retrieveSize,
      rank_constant: 60,
    },
  };

  const sourceFields: string[] = ['lesson_slug'];

  if (useRerank) {
    return {
      index: 'oak_lessons',
      size: 10,
      retriever: {
        text_similarity_reranker: {
          retriever: rrfRetriever,
          field: 'lesson_title',
          inference_id: '.rerank-v1-elasticsearch',
          inference_text: query,
          rank_window_size: rerankSize,
        },
      },
      _source: sourceFields,
    };
  }

  return {
    index: 'oak_lessons',
    size: 10,
    retriever: rrfRetriever,
    _source: sourceFields,
  };
}
