import { generateCanonicalUrl, isKeyStage, isSubject } from '@oaknational/oak-curriculum-sdk';
import type {
  KeyStage,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchUnitSummary,
} from '../types/oak';
import { isLessonSummary, isUnitSummary } from '../types/oak';
import type { OakClient } from '../adapters/oak-adapter-sdk';
import {
  createLessonDocument,
  createRollupDocument,
  createUnitDocument,
  normaliseYears,
} from './indexing/document-transforms';
import { selectLessonPlanningSnippet } from './indexing/lesson-planning-snippets';

type LessonGroup = {
  unitSlug: string;
  unitTitle: string;
  lessons: { lessonSlug: string; lessonTitle: string }[];
};

export async function buildIndexBulkOps(
  client: OakClient,
  keyStages: readonly string[],
  subjects: readonly string[],
): Promise<unknown[]> {
  const bulkOps: unknown[] = [];
  for (const subject of filterSubjects(subjects)) {
    for (const ks of filterKeyStages(keyStages)) {
      bulkOps.push(...(await buildOpsForPair(client, ks, subject)));
    }
  }
  return bulkOps;
}

function filterKeyStages(list: readonly string[]): KeyStage[] {
  return list.filter((ks): ks is KeyStage => isKeyStage(ks));
}

function filterSubjects(list: readonly string[]): SearchSubjectSlug[] {
  return list.filter((s): s is SearchSubjectSlug => isSubject(s));
}

async function buildOpsForPair(
  client: OakClient,
  ks: KeyStage,
  subject: SearchSubjectSlug,
): Promise<unknown[]> {
  const [units, groups] = await Promise.all([
    client.getUnitsByKeyStageAndSubject(ks, subject),
    client.getLessonsByKeyStageAndSubject(ks, subject),
  ]);

  const subjectProgrammesUrl = generateCanonicalUrl('subject', subject, {
    subject: { keyStageSlugs: [ks] },
  });
  if (!subjectProgrammesUrl) {
    throw new Error(`Missing subject programmes canonical URL for ${subject}/${ks}`);
  }

  const { unitSummaries, unitOps } = await buildUnitDocuments(
    client,
    units,
    subject,
    ks,
    subjectProgrammesUrl,
  );
  const { lessonOps, rollupSnippets } = await buildLessonDocuments(
    client,
    groups,
    unitSummaries,
    subject,
    ks,
  );
  const rollupOps = buildRollupDocuments(
    unitSummaries,
    rollupSnippets,
    subject,
    ks,
    subjectProgrammesUrl,
  );

  return [...unitOps, ...lessonOps, ...rollupOps];
}

async function buildUnitDocuments(
  client: OakClient,
  units: readonly { unitSlug: string; unitTitle: string }[],
  subject: SearchSubjectSlug,
  ks: KeyStage,
  subjectProgrammesUrl: string,
): Promise<{ unitSummaries: Map<string, SearchUnitSummary>; unitOps: unknown[] }> {
  const unitSummaries = new Map<string, SearchUnitSummary>();
  const unitOps: unknown[] = [];

  for (const unit of units) {
    const summary = await client.getUnitSummary(unit.unitSlug);
    if (!isUnitSummary(summary)) {
      throw new Error(`Unexpected unit summary response for ${unit.unitSlug}`);
    }
    unitSummaries.set(unit.unitSlug, summary);
    unitOps.push(
      { index: { _index: 'oak_units', _id: summary.unitSlug } },
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

async function buildLessonDocuments(
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
    ensureUnitSummaryMatchesContext(summary, subject, ks);
    const { ops, snippets } = await buildLessonDocsForGroup(client, group, summary, subject, ks);
    lessonOps.push(...ops);
    rollupSnippets.set(group.unitSlug, snippets);
  }

  return { lessonOps, rollupSnippets };
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

  const unitCanonicalUrl = unitSummary.canonicalUrl;
  if (!unitCanonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${unitSummary.unitSlug}`);
  }

  ensureUnitSummaryMatchesContext(unitSummary, subject, ks);

  const unitSequenceIds = extractUnitSequenceIds(unitSummary);
  const years = normaliseYears(unitSummary.year, unitSummary.yearSlug);
  const baseLessonCount = unitSummary.unitLessons?.length ?? group.lessons.length;

  for (const lesson of group.lessons) {
    const materials = await fetchLessonMaterials(client, lesson.lessonSlug);
    const lessonDoc = createLessonDocument({
      lesson,
      transcript: materials.transcript,
      summary: materials.summary,
      unitCanonicalUrl,
      subject,
      keyStage: ks,
      years,
      unitSequenceIds,
      lessonCount: baseLessonCount,
    });

    ops.push({ index: { _index: 'oak_lessons', _id: lesson.lessonSlug } }, lessonDoc);

    snippets.push(
      selectLessonPlanningSnippet({
        summary: materials.summary,
        transcript: materials.transcript,
      }),
    );
  }

  return { ops, snippets };
}

function buildRollupDocuments(
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
    ops.push({ index: { _index: 'oak_unit_rollup', _id: summary.unitSlug } }, rollupDoc);
  }
  return ops;
}

function extractUnitSequenceIds(summary: SearchUnitSummary): string[] | undefined {
  return summary.threads?.map((thread) => thread.slug).filter(Boolean);
}

async function fetchLessonMaterials(
  client: OakClient,
  lessonSlug: string,
): Promise<{ transcript: string; summary: SearchLessonSummary }> {
  const [transcript, summary] = await Promise.all([
    client.getLessonTranscript(lessonSlug),
    client.getLessonSummary(lessonSlug),
  ]);

  if (!isLessonSummary(summary)) {
    throw new Error(`Unexpected lesson summary response for ${lessonSlug}`);
  }

  return { transcript: transcript.transcript, summary };
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
