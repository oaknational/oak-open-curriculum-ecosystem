/**
 * Pure functions for building Elasticsearch search queries.
 *
 * Uses two-way hybrid search (BM25 + ELSER) per ADR-075 - dense vectors removed.
 */

import type { estypes } from '@elastic/elasticsearch';
import type { SearchConfig } from './types';

/**
 * Build retriever configurations for two-way hybrid search.
 *
 * @param query - Search query string
 * @param bm25Fields - Fields for BM25 multi-match
 * @returns Array of retrievers (BM25 + ELSER semantic)
 */
export function buildRetrievers(
  query: string,
  bm25Fields: readonly string[],
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

  return [bm25Retriever, semanticRetriever];
}

/**
 * Build the complete search body for Elasticsearch.
 *
 * @param config - Search configuration
 * @returns Search body ready for ES client
 */
export function buildSearchBody(config: SearchConfig): estypes.SearchRequest {
  const { query, useRerank, retrieveSize, rerankSize, bm25Fields } = config;

  const retrievers = buildRetrievers(query, bm25Fields);

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
