/**
 * Two-way RRF retriever builders for sequences and threads.
 *
 * Sequences are API data structures for curriculum retrieval, not
 * user-facing programmes. Threads are conceptual progression strands
 * that connect units across years. Both use two-way RRF (BM25+ELSER)
 * with `fuzziness: 'AUTO'` and no post-RRF score filtering.
 *
 * @see rrf-query-builders.ts for four-way RRF (lessons/units)
 * @see unit-doc-mapper.ts for unit result shaping (separate concern)
 */

import type { estypes } from '@elastic/elasticsearch';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Build a two-way RRF retriever for sequence search.
 *
 * Combines a BM25 `multi_match` retriever (boosting sequence title)
 * with a semantic retriever on the `sequence_semantic` field. Both
 * retrievers share the same optional filter for subject narrowing.
 *
 * Uses `fuzziness: 'AUTO'` (not `AUTO:6,9` like lessons/units) because
 * the sequence index has only ~30 documents with structured titles, so
 * fuzzy-match pollution is not a practical concern. No post-RRF score
 * filtering is applied — 2-way RRF max score ≈ 0.049 means any
 * meaningful threshold would eliminate legitimate results.
 *
 * @param text - User search query
 * @param filter - Optional Elasticsearch filter (e.g. subject constraint)
 * @returns RRF retriever container for the Elasticsearch search API
 */
export function buildSequenceRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    rrf: {
      retrievers: [
        {
          standard: {
            query: {
              multi_match: {
                query: text,
                type: 'best_fields',
                fuzziness: 'AUTO',
                fields: ['sequence_title^2', 'category_titles', 'subject_title', 'phase_title'],
              },
            },
            filter,
          },
        },
        { standard: { query: { semantic: { field: 'sequence_semantic', query: text } }, filter } },
      ],
      rank_window_size: 40,
      rank_constant: 40,
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
 * @param text - User search query
 * @param filter - Optional Elasticsearch filter (e.g. subject constraint)
 * @returns RRF retriever container for the Elasticsearch search API
 */
export function buildThreadRetriever(
  text: string,
  filter: QueryContainer | undefined,
): estypes.RetrieverContainer {
  return {
    rrf: {
      retrievers: [
        {
          standard: {
            query: {
              multi_match: {
                query: text,
                type: 'best_fields',
                fuzziness: 'AUTO',
                fields: ['thread_title^2'],
              },
            },
            filter,
          },
        },
        { standard: { query: { semantic: { field: 'thread_semantic', query: text } }, filter } },
      ],
      rank_window_size: 40,
      rank_constant: 40,
    },
  };
}
