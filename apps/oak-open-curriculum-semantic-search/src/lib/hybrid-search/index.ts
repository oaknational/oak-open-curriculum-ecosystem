import type { StructuredQuery, HybridSearchResult } from './types';
import { runLessonsSearch } from './lessons';
import { runUnitsSearch } from './units';
import { runSequencesSearch } from './sequences';
import { fetchSequenceFacets } from './sequence-facets';

export type { StructuredQuery, HybridSearchResult } from './types';

export async function runHybridSearch(q: StructuredQuery): Promise<HybridSearchResult> {
  const size = typeof q.size === 'number' ? Math.min(Math.max(q.size, 1), 100) : 25;
  const from = typeof q.from === 'number' ? Math.max(q.from, 0) : 0;
  const doHighlight = q.highlight !== false;
  const includeFacets = q.includeFacets === true;

  const baseResult = await runScopedSearch(q.scope, q, size, from, doHighlight);
  if (!includeFacets) {
    return baseResult;
  }

  const facets = await fetchSequenceFacets({ subject: q.subject, keyStage: q.keyStage });
  return { ...baseResult, facets };
}

async function runScopedSearch(
  scope: StructuredQuery['scope'],
  q: StructuredQuery,
  size: number,
  from: number,
  doHighlight: boolean,
): Promise<HybridSearchResult> {
  if (scope === 'lessons') {
    return runLessonsSearch(q, size, from, doHighlight);
  }
  if (scope === 'units') {
    return runUnitsSearch(q, size, from, doHighlight);
  }
  return runSequencesSearch(q, size, from);
}
