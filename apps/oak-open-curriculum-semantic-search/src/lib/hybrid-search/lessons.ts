import { esSearch, type EsHit, type EsSearchFn } from '../elastic-http';
import type { SearchLessonsIndexDoc } from '../../types/oak';
import type { StructuredQuery, HybridSearchResult, LessonResult } from './types';
import { buildLessonRrfRequest } from './rrf-query-builders';
import { normaliseRrfScores } from './rrf-score-normaliser';

/**
 * Options for lesson search, including optional DI for testing.
 * @see ADR-078 Dependency Injection for Testability
 */
export interface RunLessonsSearchOptions {
  /** Injected search function for testing. Defaults to esSearch. */
  readonly search?: EsSearchFn;
}

/**
 * Runs hybrid search for lessons using four-way RRF (BM25 + ELSER on content + structure).
 *
 * Post-RRF normalisation ensures documents without transcripts are not penalised.
 *
 * @param q - Structured query with text and optional filters
 * @param size - Maximum number of results to return
 * @param from - Offset for pagination
 * @param doHighlight - Whether to include transcript highlights
 * @param options - Optional dependencies for testing
 * @returns Search results with lessons, scores, and metadata
 *
 * @see ADR-078 Dependency Injection for Testability
 * @see ADR-099 Transcript-aware RRF normalisation
 */
export async function runLessonsSearch(
  q: StructuredQuery,
  size: number,
  from: number,
  doHighlight: boolean,
  options: RunLessonsSearchOptions = {},
): Promise<HybridSearchResult> {
  const search = options.search ?? esSearch;
  const request = buildLessonRrfRequest({
    text: q.text,
    size,
    subject: q.subject,
    keyStage: q.keyStage,
    unitSlug: q.unitSlug,
    includeHighlights: doHighlight,
    includeFacets: q.includeFacets === true,
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

  const res = await search<SearchLessonsIndexDoc>(request);
  const normalisedHits = normaliseHits(res.hits.hits);
  const results = makeLessonResults(normalisedHits);

  return {
    scope: 'lessons',
    results,
    total: res.hits.total.value,
    took: res.took,
    timedOut: res.timed_out,
    aggregations: res.aggregations,
  };
}

/**
 * Shape of normalised hit after RRF score normalisation.
 */
interface NormalisedLessonHit {
  _id: string;
  _score: number;
  _source: SearchLessonsIndexDoc;
  _highlight?: Record<string, string[]>;
}

/**
 * Applies transcript-aware RRF normalisation (ADR-099).
 * Documents without transcripts can only appear in 2/4 retrievers;
 * normalisation ensures they are not structurally disadvantaged.
 */
function normaliseHits(hits: EsHit<SearchLessonsIndexDoc>[]): NormalisedLessonHit[] {
  return normaliseRrfScores(
    hits.map((hit) => ({
      _id: hit._id,
      _score: hit._score ?? 0,
      _source: hit._source,
      _highlight: hit.highlight,
    })),
  );
}

function makeLessonResults(hits: readonly NormalisedLessonHit[]): LessonResult[] {
  return hits.map((hit) => ({
    id: hit._id,
    rankScore: hit._score,
    lesson: hit._source,
    highlights: hit._highlight?.lesson_content ?? [],
  }));
}
