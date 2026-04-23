import type { SearchUnitSummary } from '../types/oak';
import type { PairBuildContext, PairUnit } from './index-oak-pair-types';
import type { BulkOperations } from './indexing/bulk-operation-types';
import { fetchAllLessonsByUnit } from './indexing/fetch-all-lessons';
import { processLessonForIndexing } from './indexing/lesson-processing';
import type { AggregatedLesson } from './indexing/lesson-aggregation';
import { ingestLogger } from './logger';

/**
 * Fetch all lessons for the current subject/key-stage pair by querying each
 * unit individually. This preserves the ADR-083 API workaround in one place.
 */
export async function fetchAggregatedLessonsForPair(
  context: PairBuildContext,
  units: readonly PairUnit[],
): Promise<Map<string, AggregatedLesson>> {
  const { client, ks, subject } = context;
  const unitSlugs = units.map((unit) => unit.unitSlug);

  ingestLogger.info('Fetching all lessons by unit', {
    subject,
    keyStage: ks,
    unitCount: unitSlugs.length,
  });

  const aggregatedLessons = await fetchAllLessonsByUnit(
    client.getLessonsByKeyStageAndSubject,
    ks,
    subject,
    unitSlugs,
  );

  ingestLogger.info('Fetched lessons', { subject, keyStage: ks, count: aggregatedLessons.size });
  return aggregatedLessons;
}

/**
 * Build lesson operations and capture rollup snippets from aggregated lessons.
 */
export async function buildLessonOpsForPair(
  aggregatedLessons: Map<string, AggregatedLesson>,
  context: PairBuildContext,
  unitSummaries: Map<string, SearchUnitSummary>,
): Promise<{
  lessonOps: BulkOperations;
  rollupSnippets: Map<string, string[]>;
  processed: number;
  skipped: number;
}> {
  const lessonOps: BulkOperations = [];
  const rollupSnippets = new Map<string, string[]>();
  let processed = 0;
  let skipped = 0;
  ingestLogger.debug('Building lesson operations for pair', {
    lessonCount: aggregatedLessons.size,
    subject: context.subject,
    keyStage: context.ks,
  });

  for (const lesson of aggregatedLessons.values()) {
    const skipCount = await processLessonForIndexing(
      lesson,
      context,
      unitSummaries,
      lessonOps,
      rollupSnippets,
    );

    if (skipCount > 0) {
      skipped++;
      continue;
    }

    processed++;
  }

  return { lessonOps, rollupSnippets, processed, skipped };
}
