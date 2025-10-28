import type { KeyStage, SearchLessonsIndexDoc, SearchSubjectSlug } from '../../types/oak';
import { isUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import {
  createLessonDocument,
  createRollupDocument,
  createUnitDocument,
  extractUnitLessons,
  normaliseYears,
} from './document-transforms';
import { readUnitSummaryValue, resolveUnitSummaryIdentifiers } from './document-transform-helpers';
import { selectLessonPlanningSnippet } from './lesson-planning-snippets';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import {
  ensureUnitSummaryMatchesContext,
  extractUnitSequenceIds,
  fetchLessonMaterials,
} from './index-bulk-support';

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
): Promise<{ unitSummaries: Map<string, unknown>; unitOps: unknown[] }> {
  const unitSummaries = new Map<string, unknown>();
  const unitOps: unknown[] = [];

  for (const unit of units) {
    const summaryCandidate: unknown = await client.getUnitSummary(unit.unitSlug);
    if (!isUnitSummary(summaryCandidate)) {
      throw new Error(`Unexpected unit summary response for ${unit.unitSlug}`);
    }
    const summary: unknown = summaryCandidate;
    const { unitSlug } = resolveUnitSummaryIdentifiers(summary);
    unitSummaries.set(unitSlug, summary);
    unitOps.push(
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
    );
  }

  return { unitSummaries, unitOps };
}

export async function buildLessonDocuments(
  client: OakClient,
  groups: readonly LessonGroup[],
  unitSummaries: Map<string, unknown>,
  subject: SearchSubjectSlug,
  ks: KeyStage,
): Promise<{ lessonOps: unknown[]; rollupSnippets: Map<string, string[]> }> {
  const lessonOps: unknown[] = [];
  const rollupSnippets = new Map<string, string[]>();

  for (const group of groups) {
    const summary = unitSummaries.get(group.unitSlug);
    if (!summary) {
      throw new Error(`Missing unit summary for unit ${group.unitSlug}`);
    }
    const { ops, snippets } = await buildLessonDocsForGroup(client, group, summary, subject, ks);
    lessonOps.push(...ops);
    rollupSnippets.set(group.unitSlug, snippets);
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

async function buildLessonDocsForGroup(
  client: OakClient,
  group: LessonGroup,
  unitSummary: unknown,
  subject: SearchSubjectSlug,
  ks: KeyStage,
): Promise<{ ops: unknown[]; snippets: string[] }> {
  const ops: unknown[] = [];
  const snippets: string[] = [];
  const context = createLessonBuildContext(unitSummary, group, subject, ks);

  for (const lesson of group.lessons) {
    const entry = await buildLessonDocEntry(client, lesson, context);
    ops.push(entry.operation, entry.document);
    snippets.push(entry.snippet);
  }

  return { ops, snippets };
}

interface LessonBuildContext {
  unitCanonicalUrl: string;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  years: string[] | undefined;
  unitSequenceIds: string[] | undefined;
  lessonCount: number;
}

interface LessonDocEntry {
  operation: { index: { _index: string; _id: string } };
  document: SearchLessonsIndexDoc;
  snippet: string;
}

function createLessonBuildContext(
  unitSummary: unknown,
  group: LessonGroup,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): LessonBuildContext {
  ensureUnitSummaryMatchesContext(unitSummary, subject, keyStage);

  const { canonicalUrl: unitCanonicalUrl } = resolveUnitSummaryIdentifiers(unitSummary);

  const normalisedLessons = extractUnitLessons(readUnitSummaryValue(unitSummary, 'unitLessons'));
  const lessonCount =
    normalisedLessons.length > 0 ? normalisedLessons.length : group.lessons.length;
  const sequenceIds = extractUnitSequenceIds(unitSummary);

  return {
    unitCanonicalUrl,
    subject,
    keyStage,
    years: normaliseYears(
      readUnitSummaryValue(unitSummary, 'year'),
      readUnitSummaryValue(unitSummary, 'yearSlug'),
    ),
    unitSequenceIds: sequenceIds,
    lessonCount,
  };
}

async function buildLessonDocEntry(
  client: OakClient,
  lesson: { lessonSlug: string; lessonTitle: string },
  context: LessonBuildContext,
): Promise<LessonDocEntry> {
  const materials = await fetchLessonMaterials(client, lesson.lessonSlug);
  const document = createLessonDocument({
    lesson,
    transcript: materials.transcript,
    summary: materials.summary,
    unitCanonicalUrl: context.unitCanonicalUrl,
    subject: context.subject,
    keyStage: context.keyStage,
    years: context.years,
    unitSequenceIds: context.unitSequenceIds,
    lessonCount: context.lessonCount,
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
