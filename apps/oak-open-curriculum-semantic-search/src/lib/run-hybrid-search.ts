import { esSearch, type EsHit } from "@lib/elastic-http";
import type { LessonsIndexDoc, UnitsIndexDoc, UnitRollupDoc, SubjectSlug, KeyStage } from "@types/oak";
import { rrfFuse } from "@lib/rrf";

export type StructuredQuery = {
  scope: "units" | "lessons";
  text: string;
  subject?: SubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  size?: number;
  from?: number;
  highlight?: boolean;
};

export type UnitResult = {
  id: string;
  rankScore: number;
  unit: UnitsIndexDoc | null;
  highlights: string[];
};
export type LessonResult = {
  id: string;
  rankScore: number;
  lesson: LessonsIndexDoc;
  highlights: string[];
};

export type HybridSearchResult =
  | { scope: "units"; results: UnitResult[] }
  | { scope: "lessons"; results: LessonResult[] };

export async function runHybridSearch(q: StructuredQuery): Promise<HybridSearchResult> {
  const size = typeof q.size === "number" ? Math.min(Math.max(q.size, 1), 100) : 25;
  const from = typeof q.from === "number" ? Math.max(q.from, 0) : 0;
  const doHighlight = q.highlight !== false; // default true

  if (q.scope === "lessons") {
    const filters = [
      q.subject ? { term: { "subject_slug": q.subject } } : undefined,
      q.keyStage ? { term: { "key_stage": q.keyStage } } : undefined
    ].filter((x): x is Record<string, unknown> => x !== undefined);

    const [lex, sem] = await Promise.all([
      esSearch<LessonsIndexDoc>({
        index: "oak_lessons",
        size,
        query: { bool: { should: [{ multi_match: { query: q.text, fields: ["lesson_title^3", "transcript_text"] } }], filter: filters, minimum_should_match: 1 } },
        highlight: doHighlight ? { fields: { "transcript_text": { fragment_size: 160, number_of_fragments: 2 } } } : undefined,
        sort: from > 0 ? [{ _score: "desc" }] : undefined
      }),
      esSearch<LessonsIndexDoc>({
        index: "oak_lessons",
        size,
        query: { bool: { should: [{ semantic: { field: "lesson_semantic", query: q.text } }], filter: filters, minimum_should_match: 1 } },
        sort: from > 0 ? [{ _score: "desc" }] : undefined
      })
    ]);

    const a = lex.hits.hits.map((h) => ({ id: h._id }));
    const b = sem.hits.hits.map((h) => ({ id: h._id }));
    const fused = rrfFuse([a, b]);
    const idToHit = new Map<string, EsHit<LessonsIndexDoc>>();
    for (const h of [...lex.hits.hits, ...sem.hits.hits]) idToHit.set(h._id, h);

    const results: LessonResult[] = Array.from(fused.entries())
      .sort((x, y) => y[1] - x[1])
      .slice(from, from + size)
      .map(([id, rankScore]) => {
        const h = idToHit.get(id)!;
        return { id, rankScore, lesson: h._source, highlights: h.highlight?.transcript_text ?? [] };
      });

    return { scope: "lessons", results };
  }

  // units scope: combine oak_units (lexical) + oak_unit_rollup (semantic + lexical with highlights)
  const filters = [
    q.subject ? { term: { "subject_slug": q.subject } } : undefined,
    q.keyStage ? { term: { "key_stage": q.keyStage } } : undefined,
    typeof q.minLessons === "number" ? { range: { "lesson_count": { gte: q.minLessons } } } : undefined
  ].filter((x): x is Record<string, unknown> => x !== undefined);

  const [lexUnits, semRoll, lexRoll] = await Promise.all([
    esSearch<UnitsIndexDoc>({
      index: "oak_units",
      size,
      query: { bool: { should: [{ multi_match: { query: q.text, fields: ["unit_title^3", "unit_topics"] } }], filter: filters, minimum_should_match: 1 } }
    }),
    esSearch<UnitRollupDoc>({
      index: "oak_unit_rollup",
      size,
      query: { bool: { should: [{ semantic: { field: "unit_semantic", query: q.text } }], filter: filters, minimum_should_match: 1 } }
    }),
    esSearch<UnitRollupDoc>({
      index: "oak_unit_rollup",
      size,
      query: { bool: { should: [{ multi_match: { query: q.text, fields: ["unit_title^2", "rollup_text"] } }], filter: filters, minimum_should_match: 1 } },
      highlight: doHighlight ? { fields: { "rollup_text": { fragment_size: 160, number_of_fragments: 2 } } } : undefined
    })
  ]);

  const a = lexUnits.hits.hits.map((h) => ({ id: h._id }));
  const b = semRoll.hits.hits.map((h) => ({ id: h._id }));
  const c = lexRoll.hits.hits.map((h) => ({ id: h._id }));
  const fused = rrfFuse([a, b, c]);

  const unitsMap = new Map<string, EsHit<UnitsIndexDoc>>();
  for (const h of lexUnits.hits.hits) unitsMap.set(h._id, h);

  const rollMap = new Map<string, EsHit<UnitRollupDoc>>();
  for (const h of [...semRoll.hits.hits, ...lexRoll.hits.hits]) rollMap.set(h._id, h);

  const results: UnitResult[] = Array.from(fused.entries())
    .sort((x, y) => y[1] - x[1])
    .slice(from, from + size)
    .map(([id, rankScore]) => {
      const u = unitsMap.get(id);
      const r = rollMap.get(id);
      return {
        id, rankScore,
        unit: u ? u._source : (r ? {
          unit_id: r._source.unit_id, unit_slug: r._source.unit_slug, unit_title: r._source.unit_title,
          subject_slug: r._source.subject_slug, key_stage: r._source.key_stage,
          lesson_ids: r._source.lesson_ids, lesson_count: r._source.lesson_count
        } as UnitsIndexDoc : null),
        highlights: r?.highlight?.rollup_text ?? []
      };
    });

  return { scope: "units", results };
}
