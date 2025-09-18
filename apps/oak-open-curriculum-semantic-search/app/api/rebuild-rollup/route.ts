import { type NextRequest, NextResponse } from 'next/server';
import { env } from '../../../src/lib/env';
import { esSearch, esBulk } from '../../../src/lib/elastic-http';
import type { UnitsIndexDoc, LessonsIndexDoc, UnitRollupDoc } from '../../../src/types/oak';

/** Guard header check */
function authorize(req: NextRequest): boolean {
  const k = req.headers.get('x-api-key');
  return typeof k === 'string' && k.length > 0 && k === env().SEARCH_API_KEY;
}

/** Extract a short passage (first 1-2 sentences up to ~300 chars). */
function extractPassage(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/u);
  const pick = sentences.slice(0, 2).join(' ');
  return pick.slice(0, 300);
}

export const maxDuration = 300;

async function fetchAllUnits(size: number) {
  return esSearch<UnitsIndexDoc>({
    index: 'oak_units',
    size,
    query: { match_all: {} },
    sort: [{ unit_slug: 'asc' }],
    _source: [
      'unit_id',
      'unit_slug',
      'unit_title',
      'subject_slug',
      'key_stage',
      'lesson_ids',
      'lesson_count',
    ],
  });
}

async function fetchUnitLessons(unitSlug: string) {
  return esSearch<LessonsIndexDoc>({
    index: 'oak_lessons',
    size: 200,
    query: { term: { unit_ids: unitSlug } },
    _source: ['lesson_id', 'lesson_title', 'transcript_text'],
  });
}

function buildRollupDoc(u: UnitsIndexDoc, snippets: string[]): UnitRollupDoc {
  return {
    unit_id: u.unit_id,
    unit_slug: u.unit_slug,
    unit_title: u.unit_title,
    subject_slug: u.subject_slug,
    key_stage: u.key_stage,
    lesson_ids: u.lesson_ids,
    lesson_count: u.lesson_count,
    rollup_text: snippets.join(' \n'),
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!authorize(req)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const { count, rest } = await rollupAllUnits();
  if (rest.length > 0) {
    await esBulk(rest);
  }
  return NextResponse.json({ ok: true, unitsProcessed: count });
}

async function rollupAllUnits(): Promise<{ count: number; rest: unknown[] }> {
  const size = 500;
  let totalProcessed = 0;
  let bulkOps: unknown[] = [];
  const unitsRes = await fetchAllUnits(size);
  for (const uh of unitsRes.hits.hits) {
    const u = uh._source;
    const roll = await rollupUnit(u);
    bulkOps.push({ index: { _index: 'oak_unit_rollup', _id: roll.unit_id } }, roll);
    if (bulkOps.length >= 1000) {
      await esBulk(bulkOps);
      bulkOps = [];
    }
    totalProcessed += 1;
  }
  return { count: totalProcessed, rest: bulkOps };
}

async function rollupUnit(u: UnitsIndexDoc): Promise<UnitRollupDoc> {
  const lessonsRes = await fetchUnitLessons(u.unit_slug);
  const snippets: string[] = [];
  for (const lh of lessonsRes.hits.hits) {
    snippets.push(extractPassage(lh._source.transcript_text));
  }
  return buildRollupDoc(u, snippets);
}
