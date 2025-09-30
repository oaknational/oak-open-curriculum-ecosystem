import { esSearch, type EsHit } from '../elastic-http';
import type { SearchLessonsIndexDoc } from '../../types/oak';
import type { StructuredQuery, HybridSearchResult, LessonResult } from './types';
import { buildLessonRrfRequest } from './rrf-query-builders';

export async function runLessonsSearch(
  q: StructuredQuery,
  size: number,
  from: number,
  doHighlight: boolean,
): Promise<HybridSearchResult> {
  const request = buildLessonRrfRequest({
    text: q.text,
    size,
    subject: q.subject,
    keyStage: q.keyStage,
    includeHighlights: doHighlight,
    includeFacets: q.includeFacets === true,
  });
  if (from > 0) {
    request.from = from;
  }

  const res = await esSearch<SearchLessonsIndexDoc>(request);
  const results = makeLessonResults(res.hits.hits);
  return {
    scope: 'lessons',
    results,
    total: res.hits.total.value,
    took: res.took,
    timedOut: res.timed_out,
    aggregations: res.aggregations,
  };
}

function makeLessonResults(hits: EsHit<SearchLessonsIndexDoc>[]): LessonResult[] {
  return hits.map((hit) => ({
    id: hit._id,
    rankScore: hit._score ?? 0,
    lesson: hit._source,
    highlights: hit.highlight?.transcript_text ?? [],
  }));
}
