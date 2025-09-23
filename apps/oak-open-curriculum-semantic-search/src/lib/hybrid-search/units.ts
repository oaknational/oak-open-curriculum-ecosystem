import { esSearch, type EsHit } from '../elastic-http';
import type { SearchUnitsIndexDoc, SearchUnitRollupDoc } from '../../types/oak';
import { rrfFuse } from '../rrf';
import type { StructuredQuery, HybridSearchResult, UnitResult } from './types';

export async function runUnitsSearch(
  q: StructuredQuery,
  size: number,
  from: number,
  doHighlight: boolean,
): Promise<HybridSearchResult> {
  const filters: { term?: object; range?: object }[] = [];
  if (q.subject) {
    filters.push({ term: { subject_slug: q.subject } });
  }
  if (q.keyStage) {
    filters.push({ term: { key_stage: q.keyStage } });
  }
  if (typeof q.minLessons === 'number') {
    filters.push({ range: { lesson_count: { gte: q.minLessons } } });
  }

  const [lexUnits, semRoll, lexRoll] = await Promise.all([
    fetchLexicalUnits(q, size, filters),
    fetchSemanticRollups(q, size, filters),
    fetchLexicalRollups(q, size, filters, doHighlight),
  ]);

  const results = makeUnitResults(lexUnits, semRoll, lexRoll, from, size);
  return { scope: 'units', results };
}

function fetchLexicalUnits(
  q: StructuredQuery,
  size: number,
  filters: { term?: object; range?: object }[],
) {
  return esSearch<SearchUnitsIndexDoc>({
    index: 'oak_units',
    size,
    query: {
      bool: {
        should: [{ multi_match: { query: q.text, fields: ['unit_title^3', 'unit_topics'] } }],
        filter: filters,
        minimum_should_match: 1,
      },
    },
  });
}

function fetchSemanticRollups(
  q: StructuredQuery,
  size: number,
  filters: { term?: object; range?: object }[],
) {
  return esSearch<SearchUnitRollupDoc>({
    index: 'oak_unit_rollup',
    size,
    query: {
      bool: {
        should: [{ semantic: { field: 'unit_semantic', query: q.text } }],
        filter: filters,
        minimum_should_match: 1,
      },
    },
  });
}

function fetchLexicalRollups(
  q: StructuredQuery,
  size: number,
  filters: { term?: object; range?: object }[],
  doHighlight: boolean,
) {
  return esSearch<SearchUnitRollupDoc>({
    index: 'oak_unit_rollup',
    size,
    query: {
      bool: {
        should: [{ multi_match: { query: q.text, fields: ['unit_title^2', 'rollup_text'] } }],
        filter: filters,
        minimum_should_match: 1,
      },
    },
    highlight: doHighlight
      ? { fields: { rollup_text: { fragment_size: 160, number_of_fragments: 2 } } }
      : undefined,
  });
}

function makeUnitResults(
  lexUnits: { hits: { hits: EsHit<SearchUnitsIndexDoc>[] } },
  semRoll: { hits: { hits: EsHit<SearchUnitRollupDoc>[] } },
  lexRoll: { hits: { hits: EsHit<SearchUnitRollupDoc>[] } },
  from: number,
  size: number,
): UnitResult[] {
  const fused = fuseUnitHitIds(lexUnits, semRoll, lexRoll);
  const unitsMap = mapUnitHits(lexUnits.hits.hits);
  const rollMap = mapRollupHits([...semRoll.hits.hits, ...lexRoll.hits.hits]);

  return Array.from(fused.entries())
    .sort((x, y) => y[1] - x[1])
    .slice(from, from + size)
    .map(([id, rankScore]) => formatUnitResult(id, rankScore, unitsMap, rollMap));
}

function fuseUnitHitIds(
  lexUnits: { hits: { hits: EsHit<SearchUnitsIndexDoc>[] } },
  semRoll: { hits: { hits: EsHit<SearchUnitRollupDoc>[] } },
  lexRoll: { hits: { hits: EsHit<SearchUnitRollupDoc>[] } },
) {
  return rrfFuse([
    lexUnits.hits.hits.map((h) => ({ id: h._id })),
    semRoll.hits.hits.map((h) => ({ id: h._id })),
    lexRoll.hits.hits.map((h) => ({ id: h._id })),
  ]);
}

function mapUnitHits(hits: EsHit<SearchUnitsIndexDoc>[]) {
  return new Map(hits.map((hit) => [hit._id, hit] as const));
}

function mapRollupHits(hits: EsHit<SearchUnitRollupDoc>[]) {
  return new Map(hits.map((hit) => [hit._id, hit] as const));
}

function formatUnitResult(
  id: string,
  rankScore: number,
  unitsMap: Map<string, EsHit<SearchUnitsIndexDoc>>,
  rollMap: Map<string, EsHit<SearchUnitRollupDoc>>,
): UnitResult {
  const unitHit = unitsMap.get(id);
  const rollupHit = rollMap.get(id);
  const unit = unitHit ? unitHit._source : rollupHit ? deriveUnitFromRollup(rollupHit) : null;

  return {
    id,
    rankScore,
    unit,
    highlights: rollupHit?.highlight?.rollup_text ?? [],
  };
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
