import { esSearch, type EsHit } from '../elastic-http';
import type { SearchUnitRollupDoc, SearchUnitsIndexDoc } from '../../types/oak';
import type { StructuredQuery, HybridSearchResult, UnitResult } from './types';
import { buildUnitRrfRequest } from './rrf-query-builders';

/**
 * Runs hybrid search for units using two-way RRF (BM25 + ELSER).
 *
 * Uses Reciprocal Rank Fusion to combine lexical (BM25) and semantic (ELSER)
 * retrieval for optimal search quality. Searches the `oak_unit_rollup` index
 * which contains aggregated lesson content for richer semantic matching.
 *
 * @param q - Structured query with text and optional filters
 * @param size - Maximum number of results to return
 * @param from - Offset for pagination
 * @param doHighlight - Whether to include rollup text highlights
 * @returns Search results with units, scores, and metadata
 *
 * @see `.agent/research/elasticsearch/methods/hybrid-retrieval.md`
 */
export async function runUnitsSearch(
  q: StructuredQuery,
  size: number,
  from: number,
  doHighlight: boolean,
): Promise<HybridSearchResult> {
  const request = buildUnitRrfRequest({
    text: q.text,
    size,
    subject: q.subject,
    keyStage: q.keyStage,
    minLessons: q.minLessons,
    includeHighlights: doHighlight,
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

  const res = await esSearch<SearchUnitRollupDoc>(request);
  const results = makeUnitResults(res.hits.hits);
  return {
    scope: 'units',
    results,
    total: res.hits.total.value,
    took: res.took,
    timedOut: res.timed_out,
    aggregations: res.aggregations,
  };
}

function makeUnitResults(hits: EsHit<SearchUnitRollupDoc>[]): UnitResult[] {
  return hits.map((hit) => ({
    id: hit._id,
    rankScore: hit._score ?? 0,
    unit: deriveUnitFromRollup(hit),
    highlights: hit.highlight?.unit_content ?? [],
  }));
}

/**
 * Derives unit document from rollup hit, including curriculum context.
 *
 * Includes thread context (slugs, titles, orders) for progression navigation
 * and unit_topics for topical filtering.
 *
 * @see ADR-097 Context Enrichment Architecture
 */
function deriveUnitFromRollup(hit: EsHit<SearchUnitRollupDoc>): SearchUnitsIndexDoc {
  return {
    unit_id: hit._source.unit_id,
    unit_slug: hit._source.unit_slug,
    unit_title: hit._source.unit_title,
    subject_slug: hit._source.subject_slug,
    key_stage: hit._source.key_stage,
    years: hit._source.years,
    lesson_ids: hit._source.lesson_ids,
    lesson_count: hit._source.lesson_count,
    unit_topics: hit._source.unit_topics,
    unit_url: hit._source.unit_url,
    subject_programmes_url: hit._source.subject_programmes_url,
    sequence_ids: hit._source.sequence_ids,
    // Thread context for curriculum progression
    thread_slugs: hit._source.thread_slugs,
    thread_titles: hit._source.thread_titles,
    thread_orders: hit._source.thread_orders,
    title_suggest: hit._source.title_suggest,
    doc_type: hit._source.doc_type,
  };
}
