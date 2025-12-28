import { type NextRequest, NextResponse } from 'next/server';
import { env } from '../../../src/lib/env';
import { esSearch, esBulk } from '../../../src/lib/elastic-http';
import type { SearchUnitRollupDoc, SearchUnitsIndexDoc } from '../../../src/types/oak';
import { createOakSdkClient } from '../../../src/adapters/oak-adapter-sdk';
import { isSearchUnitsIndexDoc } from '../../../src/types/oak';
import { createRollupDocument } from '../../../src/lib/indexing/document-transforms';
import { selectLessonPlanningSnippet } from '../../../src/lib/indexing/lesson-planning-snippets';
import {
  currentSearchIndexTarget,
  resolveCurrentSearchIndexName,
  resolvePrimarySearchIndexName,
  rewriteBulkOperations,
  type SearchIndexTarget,
} from '../../../src/lib/search-index-target';
import type { OakClient } from '../../../src/adapters/oak-adapter-sdk';
import type {
  AggregatedUnitContext,
  UnitContextMap,
} from '../../../src/lib/indexing/ks4-context-builder';
import type { BulkOperations } from '../../../src/lib/indexing/bulk-operation-types';

/** Guard header check */
function authorize(req: NextRequest): boolean {
  const k = req.headers.get('x-api-key');
  return typeof k === 'string' && k.length > 0 && k === env().SEARCH_API_KEY;
}

export const maxDuration = 300;

async function fetchAllUnits(size: number) {
  return esSearch<SearchUnitsIndexDoc>({
    index: resolveCurrentSearchIndexName('units'),
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
      'unit_url',
      'subject_programmes_url',
      'unit_topics',
      'years',
      'sequence_ids',
    ],
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!authorize(req)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const client = createOakSdkClient();
  const target = currentSearchIndexTarget();
  const { count, rest } = await rollupAllUnits(client, target);
  if (rest.length > 0) {
    await esBulk(rewriteBulkOperations(rest, target));
  }
  return NextResponse.json({ ok: true, unitsProcessed: count });
}

async function rollupAllUnits(
  client: OakClient,
  target: SearchIndexTarget,
): Promise<{ count: number; rest: BulkOperations }> {
  const size = 500;
  let totalProcessed = 0;
  let bulkOps: BulkOperations = [];
  const unitsRes = await fetchAllUnits(size);
  for (const uh of unitsRes.hits.hits) {
    const source: unknown = uh._source;
    if (!isSearchUnitsIndexDoc(source)) {
      throw new Error('Unexpected unit document in search results');
    }
    const roll = await rollupUnit(client, source);
    bulkOps.push(
      {
        index: {
          _index: resolvePrimarySearchIndexName('unit_rollup'),
          _id: roll.unit_id,
        },
      },
      roll,
    );
    if (bulkOps.length >= 1000) {
      await esBulk(rewriteBulkOperations(bulkOps, target));
      bulkOps = [];
    }
    totalProcessed += 1;
  }
  return { count: totalProcessed, rest: bulkOps };
}

/** Fetch and validate unit summary. */
async function fetchUnitSummary(client: OakClient, unitSlug: string) {
  const result = await client.getUnitSummary(unitSlug);
  if (!result.ok) {
    throw new Error(`Failed to fetch unit summary for ${unitSlug}`);
  }
  return result.value;
}

/** Build snippets from lesson transcripts. */
async function buildLessonSnippets(client: OakClient, lessonIds: readonly string[]) {
  const snippets: string[] = [];
  for (const lessonId of lessonIds) {
    const summaryResult = await client.getLessonSummary(lessonId);
    if (!summaryResult.ok) {
      // Skip lessons that fail to fetch
      continue;
    }
    const transcriptResult = await client.getLessonTranscript(lessonId);
    const transcript = transcriptResult.ok ? transcriptResult.value.transcript : '';
    snippets.push(
      selectLessonPlanningSnippet({
        summary: summaryResult.value,
        transcript,
      }),
    );
  }
  return snippets;
}

/** Check if unit document has any KS4 data. */
function hasKs4Data(doc: SearchUnitsIndexDoc): boolean {
  return Boolean(doc.tiers || doc.exam_boards || doc.exam_subjects || doc.ks4_options);
}

/** Normalizes optional array to empty array. */
function emptyIfUndefined(arr: readonly string[] | undefined): readonly string[] {
  return arr ?? [];
}

/** Extract KS4 context from existing unit document. */
function extractKs4ContextFromDoc(unitDoc: SearchUnitsIndexDoc): AggregatedUnitContext | null {
  if (!hasKs4Data(unitDoc)) {
    return null;
  }
  return {
    tiers: emptyIfUndefined(unitDoc.tiers),
    tierTitles: emptyIfUndefined(unitDoc.tier_titles),
    examBoards: emptyIfUndefined(unitDoc.exam_boards),
    examBoardTitles: emptyIfUndefined(unitDoc.exam_board_titles),
    examSubjects: emptyIfUndefined(unitDoc.exam_subjects),
    examSubjectTitles: emptyIfUndefined(unitDoc.exam_subject_titles),
    ks4Options: emptyIfUndefined(unitDoc.ks4_options),
    ks4OptionTitles: emptyIfUndefined(unitDoc.ks4_option_titles),
  };
}

async function rollupUnit(
  client: OakClient,
  unitDoc: SearchUnitsIndexDoc,
): Promise<SearchUnitRollupDoc> {
  const unitSummary = await fetchUnitSummary(client, unitDoc.unit_slug);
  const snippets = await buildLessonSnippets(client, unitDoc.lesson_ids);

  const unitContextMap: UnitContextMap = new Map();
  const ks4Context = extractKs4ContextFromDoc(unitDoc);
  if (ks4Context) {
    unitContextMap.set(unitDoc.unit_slug, ks4Context);
  }

  return createRollupDocument({
    summary: unitSummary,
    snippets,
    subject: unitDoc.subject_slug,
    keyStage: unitDoc.key_stage,
    subjectProgrammesUrl: unitDoc.subject_programmes_url,
    unitContextMap,
  });
}
