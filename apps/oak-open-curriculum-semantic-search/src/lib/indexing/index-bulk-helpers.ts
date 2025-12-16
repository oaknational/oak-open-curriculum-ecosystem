/**
 * Helpers for building Elasticsearch bulk operations.
 *
 * KS4 metadata denormalisation is handled by passing a UnitContextMap through
 * the document building functions, which decorates lessons and units with
 * tier, exam board, and exam subject arrays per ADR-080.
 */

import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { createRollupDocument } from './document-transforms';
// No longer need extraction helpers - using typed property access
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { ensureUnitSummaryMatchesContext } from './index-bulk-support';
import { sandboxLogger } from '../logger';
import { processUnitSummary, buildLessonDocsForGroup } from './index-bulk-helpers-internal';
import type { DataIntegrityReport } from './data-integrity-report';
import type { UnitContextMap } from './ks4-context-builder';

export interface LessonGroup {
  unitSlug: string;
  unitTitle: string;
  lessons: { lessonSlug: string; lessonTitle: string }[];
}

/**
 * Derives lesson groups from unit summaries.
 *
 * This function extracts lesson information from the `unitLessons` array in each
 * unit summary, creating a `LessonGroup` for each unit that has lessons.
 *
 * This replaces the previous approach of fetching lesson groups from the
 * `/key-stages/{ks}/subject/{subject}/lessons` endpoint, which only returns
 * a paginated subset of lessons (limit 100).
 *
 * @param unitSummaries - Map of unit slugs to their summary data
 * @returns Array of lesson groups, one per unit with lessons
 *
 * @example
 * ```typescript
 * const unitSummaries = new Map();
 * unitSummaries.set('unit-1', {
 *   unitSlug: 'unit-1',
 *   unitTitle: 'Unit One',
 *   unitLessons: [{ lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' }]
 * });
 * const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);
 * // [{ unitSlug: 'unit-1', unitTitle: 'Unit One', lessons: [...] }]
 * ```
 */
export function deriveLessonGroupsFromUnitSummaries(
  unitSummaries: Map<string, SearchUnitSummary>,
): LessonGroup[] {
  const groups: LessonGroup[] = [];

  for (const [unitSlug, summary] of unitSummaries) {
    const lessons = summary.unitLessons.map((lesson) => ({
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
    }));

    if (lessons.length > 0) {
      groups.push({ unitSlug, unitTitle: summary.unitTitle, lessons });
    }
  }

  return groups;
}

export async function buildUnitDocuments(
  client: OakClient,
  units: readonly { unitSlug: string; unitTitle: string }[],
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
  dataIntegrityReport: DataIntegrityReport,
): Promise<{
  unitSummaries: Map<string, SearchUnitSummary>;
  unitOps: unknown[];
}> {
  const unitSummaries = new Map<string, SearchUnitSummary>();
  const unitOps: unknown[] = [];

  let unitIndex = 0;
  for (const unit of units) {
    unitIndex++;
    if (unitIndex % 10 === 1 || unitIndex === units.length) {
      sandboxLogger.debug('Fetching unit summaries', {
        progress: `${unitIndex}/${units.length}`,
        subject,
        keyStage: ks,
      });
    }
    const result = await processUnitSummary(
      client,
      unit,
      subject,
      ks,
      subjectProgrammesUrl,
      unitContextMap,
    );
    if (result === null) {
      dataIntegrityReport.skippedUnits.push({
        unitSlug: unit.unitSlug,
        unitTitle: unit.unitTitle,
        subject,
        keyStage: ks,
      });
      continue;
    }
    unitSummaries.set(result.summary.unitSlug, result.summary);
    unitOps.push(...result.ops);
  }

  return { unitSummaries, unitOps };
}

export async function buildLessonDocuments(
  client: OakClient,
  groups: readonly LessonGroup[],
  unitSummaries: Map<string, SearchUnitSummary>,
  subject: SearchSubjectSlug,
  ks: KeyStage,
  unitContextMap: UnitContextMap,
  dataIntegrityReport: DataIntegrityReport,
): Promise<{
  lessonOps: unknown[];
  rollupSnippets: Map<string, string[]>;
}> {
  const lessonOps: unknown[] = [];
  const rollupSnippets = new Map<string, string[]>();
  const totalLessons = groups.reduce((sum, g) => sum + g.lessons.length, 0);
  let processedLessons = 0;

  for (const group of groups) {
    const summary = unitSummaries.get(group.unitSlug);
    if (!summary) {
      // Unit summary unavailable - cannot create valid lesson documents
      const lessonSlugs = group.lessons.map((l) => l.lessonSlug);
      dataIntegrityReport.skippedLessonGroups.push({
        unitSlug: group.unitSlug,
        unitTitle: group.unitTitle,
        lessonCount: group.lessons.length,
        lessonSlugs,
        subject,
        keyStage: ks,
      });
      continue;
    }
    const { ops, snippets, lessonsProcessed } = await buildLessonDocsForGroup(
      client,
      group,
      summary,
      subject,
      ks,
      unitContextMap,
      processedLessons,
      totalLessons,
    );
    lessonOps.push(...ops);
    rollupSnippets.set(group.unitSlug, snippets);
    processedLessons += lessonsProcessed;
  }

  return { lessonOps, rollupSnippets };
}

export function buildRollupDocuments(
  unitSummaries: Map<string, SearchUnitSummary>,
  rollupSnippets: Map<string, string[]>,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
): unknown[] {
  const ops: unknown[] = [];
  for (const summary of unitSummaries.values()) {
    ensureUnitSummaryMatchesContext(summary, subject, keyStage);
    const snippets = rollupSnippets.get(summary.unitSlug) ?? [];
    const rollupDoc = createRollupDocument({
      summary,
      snippets,
      subject,
      keyStage,
      subjectProgrammesUrl,
      unitContextMap,
    });
    ops.push(
      {
        index: {
          _index: resolvePrimarySearchIndexName('unit_rollup'),
          _id: summary.unitSlug,
        },
      },
      rollupDoc,
    );
  }
  return ops;
}
