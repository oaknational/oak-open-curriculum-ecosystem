/**
 * Sequence search implementation — lexical RRF.
 *
 * Sequences are API data structures for curriculum retrieval, not
 * user-facing programmes. One sequence generates many programme views.
 *
 * Extracted from `create-retrieval-service.ts` to keep that file within
 * the max-lines limit. Follows the same pattern as `search-threads.ts`.
 */

import type { Logger } from '@oaknational/logger';
import type { JsonObject } from '@oaknational/observability';
import { ok, err, type Result } from '@oaknational/result';
import type { SearchSequenceIndexDoc } from '@oaknational/sdk-codegen/search';
import { typeSafeEntries } from '@oaknational/type-helpers';

import type { RetrievalError, SequencesSearchResult } from '../types/retrieval-results.js';
import type { SearchSequencesParams } from '../types/retrieval-params.js';
import type { EsSearchRequest, EsSearchResponse } from '../internal/types.js';
import { clampSize, clampFrom } from './rrf-score-processing.js';
import { buildSequenceRetriever } from './retrieval-search-helpers.js';
import { buildSequenceFilters } from './rrf-query-helpers.js';
import { toRetrievalError } from './retrieval-error.js';
import { SEQUENCE_SOURCE_EXCLUDES } from './source-excludes.js';

type SequenceFilter = ReturnType<typeof buildSequenceFilters>[number];

/**
 * Execute sequence search with lexical retrieval.
 *
 * Sequences are API data structures for curriculum retrieval, not
 * user-facing programmes. One sequence generates many programme views.
 *
 * @param params - Search sequences parameters (query, optional subject/phaseSlug/size/from)
 * @param search - ES search function
 * @param resolveIndex - Index name resolver
 * @param logger - Optional logger
 * @returns Result with sequences or retrieval error
 */
export async function searchSequences(
  params: SearchSequencesParams,
  search: (body: EsSearchRequest) => Promise<EsSearchResponse<SearchSequenceIndexDoc>>,
  resolveIndex: (kind: 'sequences') => string,
  logger?: Logger,
): Promise<Result<SequencesSearchResult, RetrievalError>> {
  try {
    const size = clampSize(params.size);
    const from = clampFrom(params.from);
    const filters = buildSequenceFilters(params);
    const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
    const loggedFilterClause = toLoggedSequenceFilterClause(filters);
    const request: EsSearchRequest = {
      index: resolveIndex('sequences'),
      size,
      retriever: buildSequenceRetriever(params.query, filterClause),
      from: from > 0 ? from : undefined,
      _source: SEQUENCE_SOURCE_EXCLUDES,
    };

    logger?.debug('searchSequences', {
      query: params.query,
      size: request.size,
      from: request.from,
      subject: params.subject,
      keyStage: params.keyStage,
      phaseSlug: params.phaseSlug,
      category: params.category,
      hasFilter: filterClause !== undefined,
      filterClause: loggedFilterClause,
    });
    const res = await search(request);
    const results = res.hits.hits.map((hit) => ({
      id: hit._id,
      rankScore: hit._score ?? 0,
      sequence: hit._source,
    }));
    return ok({
      scope: 'sequences',
      results,
      total: results.length,
      took: res.took,
      timedOut: res.timed_out,
    });
  } catch (error: unknown) {
    return err(toRetrievalError(error));
  }
}

function toLoggedSequenceFilterClause(filters: readonly SequenceFilter[]): JsonObject | undefined {
  const loggedFilters = filters.flatMap<JsonObject>((filter) => {
    if (!filter) {
      return [];
    }

    const termClause = toLoggedStringRecord(filter.term);
    if (termClause) {
      return [{ term: termClause }];
    }

    const matchPhraseClause = toLoggedStringRecord(filter.match_phrase);
    if (matchPhraseClause) {
      return [{ match_phrase: matchPhraseClause }];
    }

    return [];
  });

  if (loggedFilters.length === 0) {
    return undefined;
  }

  return {
    bool: {
      filter: loggedFilters,
    },
  };
}

function toLoggedStringRecord(value: unknown): JsonObject | undefined {
  if (!isPlainObject(value)) {
    return undefined;
  }

  const loggedRecord: Record<string, string> = {};
  let hasLoggedEntries = false;

  for (const [key, candidate] of typeSafeEntries(value)) {
    if (typeof candidate !== 'string') {
      continue;
    }

    loggedRecord[key] = candidate;
    hasLoggedEntries = true;
  }

  return hasLoggedEntries ? loggedRecord : undefined;
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
