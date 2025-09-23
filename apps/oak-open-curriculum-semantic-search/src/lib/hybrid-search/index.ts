import type { StructuredQuery, HybridSearchResult } from './types';
import { runLessonsSearch } from './lessons';
import { runUnitsSearch } from './units';
import { runSequencesSearch } from './sequences';

export type { StructuredQuery, HybridSearchResult } from './types';

export async function runHybridSearch(q: StructuredQuery): Promise<HybridSearchResult> {
  const size = typeof q.size === 'number' ? Math.min(Math.max(q.size, 1), 100) : 25;
  const from = typeof q.from === 'number' ? Math.max(q.from, 0) : 0;
  const doHighlight = q.highlight !== false;

  if (q.scope === 'lessons') {
    return runLessonsSearch(q, size, from, doHighlight);
  }
  if (q.scope === 'units') {
    return runUnitsSearch(q, size, from, doHighlight);
  }
  return runSequencesSearch(q, size, from);
}
