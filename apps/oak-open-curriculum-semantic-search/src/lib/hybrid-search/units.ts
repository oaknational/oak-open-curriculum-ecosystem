import { esSearch, type EsHit } from '../elastic-http';
import type { SearchUnitRollupDoc, SearchUnitsIndexDoc } from '../../types/oak';
import type { StructuredQuery, HybridSearchResult, UnitResult } from './types';
import { buildUnitRrfRequest } from './rrf-query-builders';

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
    highlights: hit.highlight?.rollup_text ?? [],
  }));
}

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
    title_suggest: hit._source.title_suggest,
  };
}
