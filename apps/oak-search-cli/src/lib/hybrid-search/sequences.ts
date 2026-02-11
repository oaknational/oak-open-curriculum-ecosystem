import { esSearch, type EsSearchFn } from '../elastic-http';
import type { SearchSequenceIndexDoc } from '../../types/oak';
import type { HybridSearchResult, StructuredQuery } from './types';
import { buildSequenceRrfRequest } from './rrf-query-builders';

/**
 * Options for sequence search, including optional DI for testing.
 * @see ADR-078 Dependency Injection for Testability
 */
export interface RunSequencesSearchOptions {
  /** Injected search function for testing. Defaults to esSearch. */
  readonly search?: EsSearchFn;
}

/**
 * Runs hybrid search for sequences using two-way RRF (BM25 + ELSER).
 *
 * @param q - Structured query with text and optional filters
 * @param size - Maximum number of results to return
 * @param from - Offset for pagination
 * @param options - Optional dependencies for testing
 * @returns Search results with sequences, scores, and metadata
 *
 * @see ADR-078 Dependency Injection for Testability
 */
export async function runSequencesSearch(
  q: StructuredQuery,
  size: number,
  from: number,
  options: RunSequencesSearchOptions = {},
): Promise<HybridSearchResult> {
  const search = options.search ?? esSearch;
  const request = buildSequenceRrfRequest({
    text: q.text,
    size,
    subject: q.subject,
    phaseSlug: q.phaseSlug,
  });
  if (from > 0) {
    request.from = from;
  }

  const res = await search<SearchSequenceIndexDoc>(request);
  const results = res.hits.hits.map((hit) => ({
    id: hit._id,
    rankScore: hit._score ?? 0,
    sequence: hit._source,
  }));
  return {
    scope: 'sequences' as const,
    results,
    total: res.hits.total.value,
    took: res.took,
    timedOut: res.timed_out,
    aggregations: res.aggregations,
  };
}
