import type { Client } from '@elastic/elasticsearch';
import type { KeyStage, SearchLessonsIndexDoc, SearchSubjectSlug } from '../../types/oak';
import { isUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import {
  createLessonDocument,
  createUnitDocument,
  extractUnitLessons,
  normaliseYears,
} from './document-transforms';
import { readUnitSummaryValue, resolveUnitSummaryIdentifiers } from './document-transform-helpers';
import { selectLessonPlanningSnippet } from './lesson-planning-snippets';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { ensureUnitSummaryMatchesContext, fetchLessonMaterials } from './index-bulk-support';
import { sandboxLogger } from '../logger';

export async function processUnitSummary(
  client: OakClient,
  unit: { unitSlug: string; unitTitle: string },
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
): Promise<{ summary: unknown; ops: unknown[] } | null> {
  const summaryCandidate: unknown = await client.getUnitSummary(unit.unitSlug);

  // Handle 404 - unit exists in listing but has no summary data
  if (summaryCandidate === null) {
    return null;
  }

  if (!isUnitSummary(summaryCandidate)) {
    throw new Error(`Unexpected unit summary response for ${unit.unitSlug}`);
  }
  const summary: unknown = summaryCandidate;
  const { unitSlug } = resolveUnitSummaryIdentifiers(summary);
  const ops = [
    {
      index: {
        _index: resolvePrimarySearchIndexName('units'),
        _id: unitSlug,
      },
    },
    createUnitDocument({
      summary,
      subject,
      keyStage: ks,
      subjectProgrammesUrl,
    }),
  ];
  return { summary, ops };
}

interface LessonBuildContext {
  unitCanonicalUrl: string;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  years: string[] | undefined;
  lessonCount: number;
}

interface LessonDocEntry {
  operation: { index: { _index: string; _id: string } };
  document: SearchLessonsIndexDoc;
  snippet: string;
}

function createLessonBuildContext(
  unitSummary: unknown,
  group: {
    unitSlug: string;
    unitTitle: string;
    lessons: { lessonSlug: string; lessonTitle: string }[];
  },
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): LessonBuildContext {
  ensureUnitSummaryMatchesContext(unitSummary, subject, keyStage);

  const { canonicalUrl: unitCanonicalUrl } = resolveUnitSummaryIdentifiers(unitSummary);

  const normalisedLessons = extractUnitLessons(readUnitSummaryValue(unitSummary, 'unitLessons'));
  const lessonCount =
    normalisedLessons.length > 0 ? normalisedLessons.length : group.lessons.length;

  return {
    unitCanonicalUrl,
    subject,
    keyStage,
    years: normaliseYears(
      readUnitSummaryValue(unitSummary, 'year'),
      readUnitSummaryValue(unitSummary, 'yearSlug'),
    ),
    lessonCount,
  };
}

async function buildLessonDocEntry(
  client: OakClient,
  esClient: Client,
  lesson: { lessonSlug: string; lessonTitle: string },
  context: LessonBuildContext,
): Promise<LessonDocEntry | null> {
  const materials = await fetchLessonMaterials(client, lesson.lessonSlug);

  // Handle lessons with no summary data (404)
  if (materials === null) {
    return null;
  }

  const document = await createLessonDocument({
    lesson,
    transcript: materials.transcript,
    summary: materials.summary,
    unitCanonicalUrl: context.unitCanonicalUrl,
    subject: context.subject,
    keyStage: context.keyStage,
    years: context.years,
    lessonCount: context.lessonCount,
    esClient,
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
  esClient: Client,
  group: {
    unitSlug: string;
    unitTitle: string;
    lessons: { lessonSlug: string; lessonTitle: string }[];
  },
  unitSummary: unknown,
  subject: SearchSubjectSlug,
  ks: KeyStage,
  processedSoFar: number,
  totalLessons: number,
): Promise<{ ops: unknown[]; snippets: string[]; lessonsProcessed: number }> {
  const ops: unknown[] = [];
  const snippets: string[] = [];
  const context = createLessonBuildContext(unitSummary, group, subject, ks);

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
    const entry = await buildLessonDocEntry(client, esClient, lesson, context);

    // Handle lessons with no summary data (404) - silently skip
    if (entry === null) {
      continue;
    }

    ops.push(entry.operation, entry.document);
    snippets.push(entry.snippet);
  }

  return { ops, snippets, lessonsProcessed: group.lessons.length };
}
