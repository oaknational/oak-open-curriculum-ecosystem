/**
 * @module index-bulk-helpers-internal
 * @description Internal helpers for building Elasticsearch bulk operations.
 *
 * KS4 metadata denormalisation is handled by passing a UnitContextMap through
 * to the document creation functions per ADR-080.
 */

import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchSubjectSlug,
  SearchUnitSummary,
} from '../../types/oak';
import { isUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { createLessonDocument, createUnitDocument, normaliseYears } from './document-transforms';
// Using typed property access now - no longer need extraction helpers
import { selectLessonPlanningSnippet } from './lesson-planning-snippets';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { ensureUnitSummaryMatchesContext, fetchLessonMaterials } from './index-bulk-support';
import { sandboxLogger } from '../logger';
import type { UnitContextMap } from './ks4-context-builder';

export async function processUnitSummary(
  client: OakClient,
  unit: { unitSlug: string; unitTitle: string },
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
  unitContextMap: UnitContextMap,
): Promise<{ summary: SearchUnitSummary; ops: unknown[] } | null> {
  const summaryCandidate: unknown = await client.getUnitSummary(unit.unitSlug);

  // Handle 404 - unit exists in listing but has no summary data
  if (summaryCandidate === null) {
    return null;
  }

  if (!isUnitSummary(summaryCandidate)) {
    throw new Error(`Unexpected unit summary response for ${unit.unitSlug}`);
  }

  // After validation, summaryCandidate is now SearchUnitSummary - don't widen!
  const summary = summaryCandidate;
  const ops = [
    {
      index: {
        _index: resolvePrimarySearchIndexName('units'),
        _id: summary.unitSlug,
      },
    },
    createUnitDocument({
      summary,
      subject,
      keyStage: ks,
      subjectProgrammesUrl,
      unitContextMap,
    }),
  ];
  return { summary, ops };
}

interface LessonBuildContext {
  unitSlug: string;
  unitCanonicalUrl: string;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  years: string[] | undefined;
  lessonCount: number;
  unitContextMap: UnitContextMap;
}

interface LessonDocEntry {
  operation: { index: { _index: string; _id: string } };
  document: SearchLessonsIndexDoc;
  snippet: string;
}

function createLessonBuildContext(
  unitSummary: SearchUnitSummary,
  group: {
    unitSlug: string;
    unitTitle: string;
    lessons: { lessonSlug: string; lessonTitle: string }[];
  },
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  unitContextMap: UnitContextMap,
): LessonBuildContext {
  ensureUnitSummaryMatchesContext(unitSummary, subject, keyStage);

  if (!unitSummary.canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${unitSummary.unitSlug}`);
  }
  const unitCanonicalUrl = unitSummary.canonicalUrl;

  const lessonCount =
    unitSummary.unitLessons.length > 0 ? unitSummary.unitLessons.length : group.lessons.length;

  return {
    unitSlug: group.unitSlug,
    unitCanonicalUrl,
    subject,
    keyStage,
    years: normaliseYears(unitSummary.year, unitSummary.yearSlug),
    lessonCount,
    unitContextMap,
  };
}

async function buildLessonDocEntry(
  client: OakClient,
  lesson: { lessonSlug: string; lessonTitle: string },
  context: LessonBuildContext,
): Promise<LessonDocEntry | null> {
  const materials = await fetchLessonMaterials(client, lesson.lessonSlug, {
    keyStage: context.keyStage,
    subject: context.subject,
    unitSlug: context.unitSlug,
  });

  // Handle lessons with no summary data (404)
  if (materials === null) {
    return null;
  }

  const document = createLessonDocument({
    lesson,
    transcript: materials.transcript,
    summary: materials.summary,
    unitCanonicalUrl: context.unitCanonicalUrl,
    subject: context.subject,
    keyStage: context.keyStage,
    years: context.years,
    lessonCount: context.lessonCount,
    unitContextMap: context.unitContextMap,
    unitSlug: context.unitSlug,
  });
  const snippet = selectLessonPlanningSnippet({
    summary: materials.summary,
    transcript: materials.transcript,
  });
  const operation = {
    index: {
      _index: resolvePrimarySearchIndexName('lessons'),
      _id: lesson.lessonSlug,
    },
  };
  return { operation, document, snippet };
}

export async function buildLessonDocsForGroup(
  client: OakClient,
  group: {
    unitSlug: string;
    unitTitle: string;
    lessons: { lessonSlug: string; lessonTitle: string }[];
  },
  unitSummary: SearchUnitSummary,
  subject: SearchSubjectSlug,
  ks: KeyStage,
  unitContextMap: UnitContextMap,
  processedSoFar: number,
  totalLessons: number,
): Promise<{ ops: unknown[]; snippets: string[]; lessonsProcessed: number }> {
  const ops: unknown[] = [];
  const snippets: string[] = [];
  const context = createLessonBuildContext(unitSummary, group, subject, ks, unitContextMap);

  let lessonIndex = 0;
  for (const lesson of group.lessons) {
    lessonIndex++;
    const currentTotal = processedSoFar + lessonIndex;
    // Log every 10 lessons or at completion
    if (currentTotal % 10 === 0 || currentTotal === totalLessons) {
      sandboxLogger.debug('Processing lesson', {
        progress: `${currentTotal}/${totalLessons}`,
        lessonSlug: lesson.lessonSlug.slice(0, 40),
      });
    }
    const entry = await buildLessonDocEntry(client, lesson, context);

    // Handle lessons with no summary data (404) - silently skip
    if (entry === null) {
      continue;
    }

    ops.push(entry.operation, entry.document);
    snippets.push(entry.snippet);
  }

  return { ops, snippets, lessonsProcessed: group.lessons.length };
}
