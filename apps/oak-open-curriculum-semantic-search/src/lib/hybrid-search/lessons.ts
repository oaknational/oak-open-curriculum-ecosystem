import { esSearch, type EsHit } from '../elastic-http';
import type { SearchLessonsIndexDoc } from '../../types/oak';
import { rrfFuse } from '../rrf';
import type { StructuredQuery, HybridSearchResult, LessonResult } from './types';

export async function runLessonsSearch(
  q: StructuredQuery,
  size: number,
  from: number,
  doHighlight: boolean,
): Promise<HybridSearchResult> {
  const filters: { term: object }[] = [];
  if (q.subject) {
    filters.push({ term: { subject_slug: q.subject } });
  }
  if (q.keyStage) {
    filters.push({ term: { key_stage: q.keyStage } });
  }

  const [lex, sem] = await Promise.all([
    esSearch<SearchLessonsIndexDoc>({
      index: 'oak_lessons',
      size,
      query: {
        bool: {
          should: [
            { multi_match: { query: q.text, fields: ['lesson_title^3', 'transcript_text'] } },
          ],
          filter: filters,
          minimum_should_match: 1,
        },
      },
      highlight: doHighlight
        ? { fields: { transcript_text: { fragment_size: 160, number_of_fragments: 2 } } }
        : undefined,
      sort: from > 0 ? [{ _score: { order: 'desc' } }] : undefined,
    }),
    esSearch<SearchLessonsIndexDoc>({
      index: 'oak_lessons',
      size,
      query: {
        bool: {
          should: [{ semantic: { field: 'lesson_semantic', query: q.text } }],
          filter: filters,
          minimum_should_match: 1,
        },
      },
      sort: from > 0 ? [{ _score: { order: 'desc' } }] : undefined,
    }),
  ]);

  const results = makeLessonResults(lex, sem, from, size);
  return { scope: 'lessons', results };
}

function makeLessonResults(
  lex: { hits: { hits: EsHit<SearchLessonsIndexDoc>[] } },
  sem: { hits: { hits: EsHit<SearchLessonsIndexDoc>[] } },
  from: number,
  size: number,
): LessonResult[] {
  const fused = rrfFuse([
    lex.hits.hits.map((h) => ({ id: h._id })),
    sem.hits.hits.map((h) => ({ id: h._id })),
  ]);
  const idToHit = new Map<string, EsHit<SearchLessonsIndexDoc>>();
  for (const h of [...lex.hits.hits, ...sem.hits.hits]) {
    idToHit.set(h._id, h);
  }
  return Array.from(fused.entries())
    .sort((x, y) => y[1] - x[1])
    .slice(from, from + size)
    .map(([id, rankScore]) => {
      const h = idToHit.get(id);
      if (!h) {
        return undefined;
      }
      return { id, rankScore, lesson: h._source, highlights: h.highlight?.transcript_text ?? [] };
    })
    .filter((x): x is LessonResult => x !== undefined);
}
