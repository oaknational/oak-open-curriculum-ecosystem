import type {
  KeyStage,
  SearchLessonSummary,
  SearchLessonsIndexDoc,
  SearchSubjectSlug,
  SearchUnitSummary,
} from '../../types/oak';
import { isLessonSummary, isTranscriptResponse, isUnitSummary } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import {
  createLessonDocument,
  createRollupDocument,
  createUnitDocument,
  extractSequenceIds,
  extractUnitLessons,
  normaliseYears,
} from './document-transforms';
import { selectLessonPlanningSnippet } from './lesson-planning-snippets';
import { resolvePrimarySearchIndexName } from '../search-index-target';

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
): Promise<{ unitSummaries: Map<string, SearchUnitSummary>; unitOps: unknown[] }> {
  const unitSummaries = new Map<string, SearchUnitSummary>();
  const unitOps: unknown[] = [];

  for (const unit of units) {
    const summaryCandidate: unknown = await client.getUnitSummary(unit.unitSlug);
    if (!isUnitSummary(summaryCandidate)) {
      throw new Error(`Unexpected unit summary response for ${unit.unitSlug}`);
    }
    const summary = summaryCandidate;
    unitSummaries.set(unit.unitSlug, summary);
    unitOps.push(
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
      }),
    );
  }

  return { unitSummaries, unitOps };
}

export async function buildLessonDocuments(
  client: OakClient,
  groups: readonly LessonGroup[],
  unitSummaries: Map<string, SearchUnitSummary>,
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
  unitSummaries: Map<string, SearchUnitSummary>,
  rollupSnippets: Map<string, string[]>,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
  subjectProgrammesUrl: string,
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

async function buildLessonDocsForGroup(
  client: OakClient,
  group: LessonGroup,
  unitSummary: SearchUnitSummary,
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
  unitSummary: SearchUnitSummary,
  group: LessonGroup,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): LessonBuildContext {
  const unitCanonicalUrl = unitSummary.canonicalUrl;
  if (!unitCanonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${unitSummary.unitSlug}`);
  }

  ensureUnitSummaryMatchesContext(unitSummary, subject, keyStage);

  const normalisedLessons = extractUnitLessons(unitSummary.unitLessons);
  const lessonCount = normalisedLessons.length > 0 ? normalisedLessons.length : group.lessons.length;
  const sequenceIds = extractUnitSequenceIds(unitSummary);

  return {
    unitCanonicalUrl,
    subject,
    keyStage,
    years: normaliseYears(unitSummary.year, unitSummary.yearSlug),
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

function extractUnitSequenceIds(summary: SearchUnitSummary): string[] | undefined {
  return extractSequenceIds(summary.threads);
}

async function fetchLessonMaterials(
  client: OakClient,
  lessonSlug: string,
): Promise<{ transcript: string; summary: SearchLessonSummary }> {
  const [transcriptResponse, summaryCandidate] = await Promise.all([
    client.getLessonTranscript(lessonSlug),
    client.getLessonSummary(lessonSlug),
  ]);

  if (!isLessonSummary(summaryCandidate)) {
    throw new Error(`Unexpected lesson summary response for ${lessonSlug}`);
  }
  if (!isTranscriptResponse(transcriptResponse)) {
    throw new Error(`Unexpected lesson transcript response for ${lessonSlug}`);
  }

  return { transcript: transcriptResponse.transcript, summary: summaryCandidate };
}

function ensureUnitSummaryMatchesContext(
  summary: SearchUnitSummary,
  subject: SearchSubjectSlug,
  keyStage: KeyStage,
): void {
  if (summary.subjectSlug !== subject) {
    throw new Error(
      `Unit summary subject mismatch for ${summary.unitSlug}: expected ${subject}, received ${summary.subjectSlug}`,
    );
  }
  if (summary.keyStageSlug !== keyStage) {
    throw new Error(
      `Unit summary key stage mismatch for ${summary.unitSlug}: expected ${keyStage}, received ${summary.keyStageSlug}`,
    );
  }
}
