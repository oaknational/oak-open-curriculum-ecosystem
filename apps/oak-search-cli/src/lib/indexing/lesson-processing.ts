/**
 * Functions for processing lessons during indexing.
 * @see ADR-083 Lesson Enumeration
 */

import type { SearchUnitSummary } from '../../types/oak';
import type { AggregatedLesson } from './lesson-aggregation';
import type { BulkOperations } from './bulk-operation-types';
import type { PairBuildContext } from '../index-oak-helpers';
import { buildLessonDocFromAggregated } from './lesson-document-builder';

/** Adds a snippet to the rollup snippets map by unit slug. */
export function addRollupSnippet(
  map: Map<string, string[]>,
  unitSlug: string,
  snippet: string,
): void {
  const existing = map.get(unitSlug);
  if (existing) {
    existing.push(snippet);
  } else {
    map.set(unitSlug, [snippet]);
  }
}

/**
 * Process a single lesson and add its operations to the collection.
 * @param lesson - Aggregated lesson data
 * @param context - Build context
 * @param unitSummaries - Map of unit summaries
 * @param lessonOps - Array to add lesson operations to
 * @param rollupSnippets - Map to add rollup snippets to
 * @param hasVideo - Optional video availability (if false, transcript fetch skipped)
 * @returns Number of lessons skipped (0 or 1)
 */
export async function processLessonForIndexing(
  lesson: AggregatedLesson,
  context: PairBuildContext,
  unitSummaries: Map<string, SearchUnitSummary>,
  lessonOps: BulkOperations,
  rollupSnippets: Map<string, string[]>,
  hasVideo?: boolean,
): Promise<number> {
  const { client, ks, subject, unitContextMap, dataIntegrityReport } = context;
  const result = await buildLessonDocFromAggregated(
    client,
    {
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      unitSlugs: lesson.unitSlugs,
    },
    unitSummaries,
    subject,
    ks,
    unitContextMap,
    hasVideo,
  );
  if (result === null) {
    const unitSlug = Array.from(lesson.unitSlugs)[0] ?? 'unknown';
    dataIntegrityReport.skippedLessons.push({
      lessonSlug: lesson.lessonSlug,
      unitSlug,
      subject,
      keyStage: ks,
      reason: 'summary_404',
      httpStatus: 404,
    });
    return 1;
  }
  lessonOps.push(...result.ops);
  addRollupSnippet(rollupSnippets, result.primaryUnitSlug, result.snippet);
  return 0;
}
