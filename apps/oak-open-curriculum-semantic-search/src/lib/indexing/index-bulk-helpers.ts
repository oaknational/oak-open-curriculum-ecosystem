import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { createRollupDocument } from './document-transforms';
import { resolveUnitSummaryIdentifiers } from './document-transform-helpers';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { ensureUnitSummaryMatchesContext } from './index-bulk-support';
import { sandboxLogger } from '../logger';
import { processUnitSummary, buildLessonDocsForGroup } from './index-bulk-helpers-internal';
import type { DataIntegrityReport } from './data-integrity-report';

export interface LessonGroup {
  unitSlug: string;
  unitTitle: string;
  lessons: { lessonSlug: string; lessonTitle: string }[];
}

export async function buildUnitDocuments(
  client: OakClient,
  units: readonly { unitSlug: string; unitTitle: string }[],
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
  dataIntegrityReport: DataIntegrityReport,
): Promise<{
  unitSummaries: Map<string, unknown>;
  unitOps: unknown[];
}> {
  const unitSummaries = new Map<string, unknown>();
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
    const result = await processUnitSummary(client, unit, subject, ks, subjectProgrammesUrl);
    if (result === null) {
      dataIntegrityReport.skippedUnits.push({
        unitSlug: unit.unitSlug,
        unitTitle: unit.unitTitle,
        subject,
        keyStage: ks,
      });
      continue;
    }
    const { unitSlug } = resolveUnitSummaryIdentifiers(result.summary);
    unitSummaries.set(unitSlug, result.summary);
    unitOps.push(...result.ops);
  }

  return { unitSummaries, unitOps };
}

export async function buildLessonDocuments(
  client: OakClient,
  groups: readonly LessonGroup[],
  unitSummaries: Map<string, unknown>,
  subject: SearchSubjectSlug,
  ks: KeyStage,
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
  unitSummaries: Map<string, unknown>,
  rollupSnippets: Map<string, string[]>,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  subjectProgrammesUrl: string,
): unknown[] {
  const ops: unknown[] = [];
  for (const summary of unitSummaries.values()) {
    ensureUnitSummaryMatchesContext(summary, subject, keyStage);
    const { unitSlug } = resolveUnitSummaryIdentifiers(summary);
    const snippets = rollupSnippets.get(unitSlug) ?? [];
    const rollupDoc = createRollupDocument({
      summary,
      snippets,
      subject,
      keyStage,
      subjectProgrammesUrl,
    });
    ops.push(
      {
        index: {
          _index: resolvePrimarySearchIndexName('unit_rollup'),
          _id: unitSlug,
        },
      },
      rollupDoc,
    );
  }
  return ops;
}
