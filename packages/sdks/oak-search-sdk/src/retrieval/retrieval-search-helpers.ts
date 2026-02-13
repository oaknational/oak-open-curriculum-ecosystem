/**
 * Retrieval search helpers — sequence retriever and unit document derivation.
 *
 * Contains the RRF retriever builder for sequence search (sequences
 * are API data structures for curriculum retrieval, not user-facing
 * programmes) and the unit document mapper that derives
 * `SearchUnitsIndexDoc` from rollup hits. Extracted from
 * `create-retrieval-service.ts` to keep that file within the
 * max-lines limit.
 */

import type { estypes } from '@elastic/elasticsearch';
import type {
  SearchUnitRollupDoc,
  SearchUnitsIndexDoc,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

import type { EsHit } from '../internal/types.js';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Build a two-way RRF retriever for sequence search.
 *
 * Combines a BM25 `multi_match` retriever (boosting sequence title)
 * with a semantic retriever on the `sequence_semantic` field. Both
 * retrievers share the same optional filter for subject narrowing.
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
 * years. The index has ~164 documents — the simpler two-way RRF
 * (matching the sequence pattern) is appropriate for this index size.
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

/**
 * Derive a `SearchUnitsIndexDoc` from a unit rollup Elasticsearch hit.
 *
 * The rollup document contains all fields needed for the units index
 * document. This function maps them explicitly rather than spreading,
 * ensuring the output shape matches `SearchUnitsIndexDoc` exactly.
 *
 * @param hit - Elasticsearch hit containing a `SearchUnitRollupDoc` source
 * @returns A `SearchUnitsIndexDoc` with all required fields
 */
export function deriveUnitDoc(hit: EsHit<SearchUnitRollupDoc>): SearchUnitsIndexDoc {
  const s = hit._source;
  return {
    unit_id: s.unit_id,
    unit_slug: s.unit_slug,
    unit_title: s.unit_title,
    subject_slug: s.subject_slug,
    subject_parent: s.subject_parent,
    key_stage: s.key_stage,
    years: s.years,
    lesson_ids: s.lesson_ids,
    lesson_count: s.lesson_count,
    unit_topics: s.unit_topics,
    unit_url: s.unit_url,
    subject_programmes_url: s.subject_programmes_url,
    sequence_ids: s.sequence_ids,
    thread_slugs: s.thread_slugs,
    thread_titles: s.thread_titles,
    thread_orders: s.thread_orders,
    title_suggest: s.title_suggest,
    doc_type: s.doc_type,
  };
}
