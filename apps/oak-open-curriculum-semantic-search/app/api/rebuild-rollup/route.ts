import { type NextRequest, NextResponse } from 'next/server';
import { env } from '../../../src/lib/env';
import { esSearch, esBulk } from '../../../src/lib/elastic-http';
import type { SearchUnitRollupDoc, SearchUnitsIndexDoc } from '../../../src/types/oak';
import { createOakSdkClient } from '../../../src/adapters/oak-adapter-sdk';
import {
  isLessonSummary,
  isSearchUnitsIndexDoc,
  isTranscriptResponse,
  isUnitSummary,
} from '../../../src/types/oak';
import { lessonSummarySchema, unitSummarySchema } from '@oaknational/oak-curriculum-sdk';
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
): Promise<{ count: number; rest: unknown[] }> {
  const size = 500;
  let totalProcessed = 0;
  let bulkOps: unknown[] = [];
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

async function rollupUnit(
  client: OakClient,
  unitDoc: SearchUnitsIndexDoc,
): Promise<SearchUnitRollupDoc> {
  const unitSummaryCandidate: unknown = await client.getUnitSummary(unitDoc.unit_slug);
  if (!isUnitSummary(unitSummaryCandidate)) {
    throw new Error(`Unexpected unit summary response for ${unitDoc.unit_slug}`);
  }
  const unitSummary = unitSummarySchema.parse(unitSummaryCandidate);

  const snippets: string[] = [];
  for (const lessonId of unitDoc.lesson_ids) {
    const lessonSummaryCandidate: unknown = await client.getLessonSummary(lessonId);
    if (!isLessonSummary(lessonSummaryCandidate)) {
      throw new Error(`Unexpected lesson summary response for ${lessonId}`);
    }
    const lessonSummary = lessonSummarySchema.parse(lessonSummaryCandidate);
    const transcriptResponse: unknown = await client.getLessonTranscript(lessonId);
    if (!isTranscriptResponse(transcriptResponse)) {
      throw new Error(`Unexpected transcript response for ${lessonId}`);
    }
    snippets.push(
      selectLessonPlanningSnippet({
        summary: lessonSummary,
        transcript: transcriptResponse.transcript,
      }),
    );
  }

  return createRollupDocument({
    summary: unitSummary,
    snippets,
    subject: unitDoc.subject_slug,
    keyStage: unitDoc.key_stage,
    subjectProgrammesUrl: unitDoc.subject_programmes_url,
  });
}
