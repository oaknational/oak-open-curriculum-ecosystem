import { esSearch, type EsHit } from '../elastic-http';
import type { SearchLessonsIndexDoc } from '../../types/oak';
import type { StructuredQuery, HybridSearchResult, LessonResult } from './types';
import { buildLessonRrfRequest } from './rrf-query-builders';

/**
 * Runs hybrid search for lessons using two-way RRF (BM25 + ELSER).
 *
 * Uses Reciprocal Rank Fusion to combine lexical (BM25) and semantic (ELSER)
 * retrieval for optimal search quality. This configuration was validated in
 * Phase 2 experiments which confirmed two-way hybrid outperforms three-way.
 *
 * @param q - Structured query with text and optional filters
 * @param size - Maximum number of results to return
 * @param from - Offset for pagination
 * @param doHighlight - Whether to include transcript highlights
 * @returns Search results with lessons, scores, and metadata
 *
 * @see `.agent/research/elasticsearch/hybrid-search-reranking-evaluation.md`
 */
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
    unitSlug: q.unitSlug,
    includeHighlights: doHighlight,
    includeFacets: q.includeFacets === true,
    // KS4 and metadata filter fields (Phase 3 completion)
    tier: q.tier,
    examBoard: q.examBoard,
    examSubject: q.examSubject,
    ks4Option: q.ks4Option,
    year: q.year,
    threadSlug: q.threadSlug,
    category: q.category,
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
    highlights: hit.highlight?.lesson_content ?? [],
  }));
}
