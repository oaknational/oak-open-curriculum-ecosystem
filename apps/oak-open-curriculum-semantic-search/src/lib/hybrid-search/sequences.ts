import { esSearch } from '../elastic-http';
import type { SearchSequenceIndexDoc } from '../../types/oak';
import type { HybridSearchResult, StructuredQuery } from './types';
import { buildSequenceRrfRequest } from './rrf-query-builders';

export async function runSequencesSearch(
  q: StructuredQuery,
  size: number,
  from: number,
): Promise<HybridSearchResult> {
  const request = buildSequenceRrfRequest({
    text: q.text,
    size,
    subject: q.subject,
    phaseSlug: q.phaseSlug,
  });
  if (from > 0) {
    request.from = from;
  }

  const res = await esSearch<SearchSequenceIndexDoc>(request);
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
