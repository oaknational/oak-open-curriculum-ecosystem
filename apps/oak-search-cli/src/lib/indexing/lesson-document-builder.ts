/**
 * Lesson-centric document building for Elasticsearch indexing.
 *
 * This module provides functions for building lesson documents from aggregated
 * lesson data, preserving ALL unit relationships.
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 */

import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchSubjectSlug,
  SearchUnitSummary,
} from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter';
import { createLessonDocument, normaliseYears, type LessonUnitInfo } from './document-transforms';
import { selectLessonPlanningSnippet } from './lesson-planning-snippets';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { ensureUnitSummaryMatchesContext, fetchLessonMaterials } from './index-bulk-helpers';
import { ingestLogger } from '../logger';
import type { UnitContextMap } from './ks4-context-builder';
import type { BulkOperationEntry, BulkAction } from './bulk-operation-types';
import { createBulkAction } from './bulk-action-factory';

/**
 * Aggregated lesson with all unit relationships.
 * Input for lesson-centric document building.
 */
export interface AggregatedLessonInput {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
  /** ALL unit slugs this lesson belongs to - we preserve complete relationships */
  readonly unitSlugs: ReadonlySet<string>;
}

/**
 * Result of building a single lesson document.
 */
export interface LessonBuildResult {
  readonly lessonSlug: string;
  readonly ops: readonly BulkOperationEntry[];
  readonly snippet: string;
  /** Primary unit slug for rollup aggregation */
  readonly primaryUnitSlug: string;
}

/**
 * Resolves unit info for all units a lesson belongs to.
 * Looks up each unit in the summaries map to get title and oak URL.
 */
function resolveUnitsForLesson(
  unitSlugs: readonly string[],
  unitSummaries: Map<string, SearchUnitSummary>,
): LessonUnitInfo[] {
  const units: LessonUnitInfo[] = [];
  for (const unitSlug of unitSlugs) {
    const summary = unitSummaries.get(unitSlug);
    if (summary && summary.oakUrl) {
      units.push({
        unitSlug: summary.unitSlug,
        unitTitle: summary.unitTitle,
        oakUrl: summary.oakUrl,
      });
    }
  }
  return units;
}

interface LessonBuildContext {
  readonly units: readonly LessonUnitInfo[];
  readonly subject: SearchSubjectSlug;
  readonly keyStage: KeyStage;
  readonly years: string[] | undefined;
  readonly lessonCount: number;
  readonly unitContextMap: UnitContextMap;
  /**
   * Whether this lesson has a video.
   * If false, transcript fetch is skipped.
   * @see video-availability.ts
   */
  readonly hasVideo?: boolean;
}

/**
 * Fetches lesson materials and creates a document entry.
 */
async function buildLessonDocEntry(
  client: OakClient,
  lesson: { lessonSlug: string; lessonTitle: string },
  context: LessonBuildContext,
): Promise<{ operation: BulkAction; document: SearchLessonsIndexDoc; snippet: string } | null> {
  const primaryUnit = context.units[0];
  if (!primaryUnit) {
    throw new Error(`Lesson ${lesson.lessonSlug} has no units in context`);
  }

  const materials = await fetchLessonMaterials(client, lesson.lessonSlug, {
    keyStage: context.keyStage,
    subject: context.subject,
    unitSlug: primaryUnit.unitSlug,
    hasVideo: context.hasVideo,
  });

  if (materials === null) {
    return null;
  }

  const document = createLessonDocument({
    lesson,
    transcript: materials.transcript,
    summary: materials.summary,
    subject: context.subject,
    keyStage: context.keyStage,
    years: context.years,
    lessonCount: context.lessonCount,
    unitContextMap: context.unitContextMap,
    units: context.units,
  });

  const snippet = selectLessonPlanningSnippet({
    summary: materials.summary,
    transcript: materials.transcript,
  });

  const operation = createBulkAction(resolvePrimarySearchIndexName('lessons'), lesson.lessonSlug);

  return { operation, document, snippet };
}

/** Creates context for building a lesson document. */
function createLessonContext(
  units: readonly LessonUnitInfo[],
  primarySummary: SearchUnitSummary,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  unitContextMap: UnitContextMap,
  hasVideo?: boolean,
): LessonBuildContext {
  ensureUnitSummaryMatchesContext(primarySummary, subject, keyStage);
  return {
    units,
    subject,
    keyStage,
    years: normaliseYears(primarySummary.year, primarySummary.yearSlug),
    lessonCount: primarySummary.unitLessons.length,
    unitContextMap,
    hasVideo,
  };
}

/**
 * Builds a lesson document with ALL its unit relationships.
 *
 * @param client - Oak API client
 * @param lesson - Aggregated lesson input
 * @param unitSummaries - Map of unit summaries
 * @param subject - Subject slug
 * @param keyStage - Key stage
 * @param unitContextMap - KS4 metadata context
 * @param hasVideo - Optional video availability (if false, transcript fetch skipped)
 * @see ADR-083 Complete Lesson Enumeration Strategy
 */
export async function buildLessonDocFromAggregated(
  client: OakClient,
  lesson: AggregatedLessonInput,
  unitSummaries: Map<string, SearchUnitSummary>,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  unitContextMap: UnitContextMap,
  hasVideo?: boolean,
): Promise<LessonBuildResult | null> {
  const unitSlugsArray = Array.from(lesson.unitSlugs);
  const units = resolveUnitsForLesson(unitSlugsArray, unitSummaries);
  if (units.length === 0) {
    ingestLogger.debug('Lesson has no resolvable units', { lessonSlug: lesson.lessonSlug });
    return null;
  }

  const primaryUnit = units[0];
  const primarySummary = unitSummaries.get(primaryUnit.unitSlug);
  if (!primarySummary) {
    throw new Error(`Primary unit ${primaryUnit.unitSlug} has no summary`);
  }

  const context = createLessonContext(
    units,
    primarySummary,
    subject,
    keyStage,
    unitContextMap,
    hasVideo,
  );
  const entry = await buildLessonDocEntry(client, lesson, context);
  if (entry === null) {
    return null;
  }

  return {
    lessonSlug: lesson.lessonSlug,
    ops: [entry.operation, entry.document],
    snippet: entry.snippet,
    primaryUnitSlug: primaryUnit.unitSlug,
  };
}
