/**
 * Retriever builders for sequences and threads.
 *
 * Sequences are API data structures for curriculum retrieval, not
 * user-facing programmes. Threads are conceptual progression strands
 * that connect units across years. Sequence retrieval is currently
 * plain lexical because `sequence_semantic` is not populated during
 * ingestion; thread retrieval remains two-way RRF (BM25+ELSER).
 *
 * @see rrf-query-builders.ts for four-way RRF (lessons/units)
 * @see unit-doc-mapper.ts for unit result shaping (separate concern)
 */

import type { estypes } from '@elastic/elasticsearch';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Build the sequence retriever for sequence search.
 *
 * Uses a BM25 `multi_match` retriever (boosting sequence title) with
 * the shared optional filter for subject narrowing.
 *
 * Uses `fuzziness: 'AUTO'` (not `AUTO:6,9` like lessons/units) because
 * the sequence index has only ~30 documents with structured titles, so
 * fuzzy-match pollution is not a practical concern. This stays lexical
 * until ingestion populates `sequence_semantic`; querying an empty
 * semantic field only adds cost and false confidence.
 *
 * @param query - User search query
 * @param filter - Optional Elasticsearch filter (e.g. subject constraint)
 * @returns Direct lexical retriever container for the Elasticsearch search API
 */
export function buildSequenceRetriever(
  query: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    standard: {
      query: {
        multi_match: {
          query,
          type: 'best_fields',
          fuzziness: 'AUTO',
          fields: ['sequence_title^2', 'category_titles', 'subject_title', 'phase_title'],
        },
      },
      filter,
    },
  };
}

/**
 * Build a two-way RRF retriever for thread search.
 *
 * Combines a BM25 `multi_match` retriever (boosting thread title)
 * with a semantic retriever on the `thread_semantic` field. Both
 * retrievers share the same optional filter for subject narrowing.
 *
 * Threads are conceptual progression strands that connect units across
 * years. The index has ~164 documents with short structured titles.
 * Uses `fuzziness: 'AUTO'` (not `AUTO:6,9` like lessons/units) because
 * the small index and title-only BM25 field mean fuzzy-match pollution
 * is minimal. No post-RRF score filtering — 2-way RRF max score ≈ 0.049,
 * and the correct "mountain" thread result scores only 0.024.
 *
 * @param query - User search query
 * @param filter - Optional Elasticsearch filter (e.g. subject constraint)
 * @returns RRF retriever container for the Elasticsearch search API
 */
export function buildThreadRetriever(
  query: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    rrf: {
      retrievers: [
        {
          standard: {
            query: {
              multi_match: {
                query,
                type: 'best_fields',
                fuzziness: 'AUTO',
                fields: ['thread_title^2'],
              },
            },
            filter,
          },
        },
        { standard: { query: { semantic: { field: 'thread_semantic', query } }, filter } },
      ],
      rank_window_size: 40,
      rank_constant: 40,
    },
  };
}
