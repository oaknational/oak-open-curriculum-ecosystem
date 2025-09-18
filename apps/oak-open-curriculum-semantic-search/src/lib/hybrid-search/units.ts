import { esSearch, type EsHit } from '../elastic-http';
import type { UnitsIndexDoc, UnitRollupDoc } from '../../types/oak';
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
  return esSearch<UnitsIndexDoc>({
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
  return esSearch<UnitRollupDoc>({
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
  return esSearch<UnitRollupDoc>({
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
  lexUnits: { hits: { hits: EsHit<UnitsIndexDoc>[] } },
  semRoll: { hits: { hits: EsHit<UnitRollupDoc>[] } },
  lexRoll: { hits: { hits: EsHit<UnitRollupDoc>[] } },
  from: number,
  size: number,
): UnitResult[] {
  const fused = rrfFuse([
    lexUnits.hits.hits.map((h) => ({ id: h._id })),
    semRoll.hits.hits.map((h) => ({ id: h._id })),
    lexRoll.hits.hits.map((h) => ({ id: h._id })),
  ]);

  const unitsMap = new Map<string, EsHit<UnitsIndexDoc>>();
  for (const h of lexUnits.hits.hits) {
    unitsMap.set(h._id, h);
  }

  const rollMap = new Map<string, EsHit<UnitRollupDoc>>();
  for (const h of [...semRoll.hits.hits, ...lexRoll.hits.hits]) {
    rollMap.set(h._id, h);
  }

  return Array.from(fused.entries())
    .sort((x, y) => y[1] - x[1])
    .slice(from, from + size)
    .map(([id, rankScore]) => {
      const u = unitsMap.get(id);
      const r = rollMap.get(id);
      const unit: UnitsIndexDoc | null = u
        ? u._source
        : r
          ? {
              unit_id: r._source.unit_id,
              unit_slug: r._source.unit_slug,
              unit_title: r._source.unit_title,
              subject_slug: r._source.subject_slug,
              key_stage: r._source.key_stage,
              lesson_ids: r._source.lesson_ids,
              lesson_count: r._source.lesson_count,
            }
          : null;
      return { id, rankScore, unit, highlights: r?.highlight?.rollup_text ?? [] };
    });
}
