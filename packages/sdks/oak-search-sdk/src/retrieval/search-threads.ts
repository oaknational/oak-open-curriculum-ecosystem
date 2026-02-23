/**
 * Thread search implementation — two-way RRF (BM25 + ELSER).
 *
 * Threads are conceptual progression strands that connect units across
 * years, showing how ideas build over time. They are programme-agnostic:
 * a single thread like "Algebra" can span Reception to Year 11 across
 * multiple programmes and key stages.
 *
 * Extracted from `create-retrieval-service.ts` to keep that file within
 * the max-lines limit. Follows the same pattern as `searchSequences`.
 *
 * The thread index uses `subject_slugs` (plural, array field) rather
 * than `subject_slug` (singular) — this is handled internally and not
 * exposed to consumers.
 */

import type { estypes } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import { ok, err, type Result } from '@oaknational/result';
import type { SearchThreadIndexDoc } from '@oaknational/curriculum-sdk/public/search.js';

import type { RetrievalError, ThreadsSearchResult } from '../types/retrieval-results.js';
import type { SearchParamsBase } from '../types/retrieval-params.js';
import type { EsSearchFn, EsSearchRequest } from '../internal/types.js';
import { clampSize, clampFrom } from './rrf-score-processing.js';
import { buildThreadRetriever } from './retrieval-search-helpers.js';
import { toRetrievalError } from './retrieval-error.js';
import { THREAD_SOURCE_EXCLUDES } from './source-excludes.js';

/**
 * Execute thread search with two-way RRF (BM25 + semantic).
 *
 * Threads are conceptual progression strands, not sequences or programmes.
 * The `subject` filter maps to the `subject_slugs` array field in the
 * thread index (term queries work on array fields in Elasticsearch).
 *
 * @param params - Search parameters (text, optional subject/keyStage/size/from)
 * @param search - ES search function
 * @param resolveIndex - Index name resolver
 * @param logger - Optional logger
 * @returns Result with threads or retrieval error
 */
export async function searchThreads(
  params: SearchParamsBase,
  search: EsSearchFn,
  resolveIndex: (kind: 'threads') => string,
  logger?: Logger,
): Promise<Result<ThreadsSearchResult, RetrievalError>> {
  try {
    const size = clampSize(params.size);
    const from = clampFrom(params.from);
    const filters: estypes.QueryDslQueryContainer[] = [];
    if (params.subject) {
      filters.push({ term: { subject_slugs: params.subject } });
    }

    const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
    const request: EsSearchRequest = {
      index: resolveIndex('threads'),
      size,
      retriever: buildThreadRetriever(params.text, filterClause),
      from: from > 0 ? from : undefined,
      _source: THREAD_SOURCE_EXCLUDES,
    };

    logger?.debug('searchThreads', { text: params.text, size, from });
    const res = await search<SearchThreadIndexDoc>(request);
    const results = res.hits.hits.map((hit) => ({
      id: hit._id,
      rankScore: hit._score ?? 0,
      thread: hit._source,
    }));
    return ok({
      scope: 'threads',
      results,
      total: results.length,
      took: res.took,
      timedOut: res.timed_out,
    });
  } catch (error: unknown) {
    return err(toRetrievalError(error));
  }
}
