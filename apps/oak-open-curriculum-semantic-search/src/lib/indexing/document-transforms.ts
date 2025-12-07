import type { Client } from '@elastic/elasticsearch';
import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchSubjectSlug,
  SearchUnitRollupDoc,
  SearchUnitsIndexDoc,
} from '../../types/oak';
import {
  extractLessonPlanningFields,
  extractSequenceIds,
  extractUnitLessons,
  extractUnitTopics,
  readUnitSummaryValue,
  resolveLessonSummaryIdentifiers,
  resolveUnitSummaryIdentifiers,
  extractTier,
  extractExamBoard,
  extractPathway,
  extractLessonDocumentFields,
  extractRollupDocumentFields,
  type UnitLessonInfo,
} from './document-transform-helpers';
import { generateDenseVector } from './dense-vector-generation';

export {
  extractLessonPlanningFields,
  extractSequenceIds,
  extractUnitLessons,
} from './document-transform-helpers';

export interface CreateUnitDocumentParams {
  summary: unknown;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  subjectProgrammesUrl: string;
}

export function createUnitDocument({
  summary,
  subject,
  keyStage,
  subjectProgrammesUrl,
}: CreateUnitDocumentParams): SearchUnitsIndexDoc {
  const { unitSlug, unitTitle, canonicalUrl } = resolveUnitSummaryIdentifiers(summary);
  const unitLessons: UnitLessonInfo[] = extractUnitLessons(
    readUnitSummaryValue(summary, 'unitLessons'),
  );
  const lessonIds: string[] = unitLessons.map((lesson) => lesson.lessonSlug);
  const unitTopics: string[] | undefined = extractUnitTopics(
    readUnitSummaryValue(summary, 'categories'),
  );
  const years = normaliseYears(
    readUnitSummaryValue(summary, 'year'),
    readUnitSummaryValue(summary, 'yearSlug'),
  );
  const sequenceIds: string[] | undefined = extractSequenceIds(
    readUnitSummaryValue(summary, 'threads'),
  );

  return {
    unit_id: unitSlug,
    unit_slug: unitSlug,
    unit_title: unitTitle,
    subject_slug: subject,
    key_stage: keyStage,
    years,
    lesson_ids: lessonIds,
    lesson_count: lessonIds.length,
    unit_topics: unitTopics,
    unit_url: canonicalUrl,
    subject_programmes_url: subjectProgrammesUrl,
    sequence_ids: sequenceIds,
    title_suggest: {
      input: [unitTitle],
      contexts: {
        subject: [subject],
        key_stage: [keyStage],
        sequence: sequenceIds,
      },
    },
  };
}

export interface CreateLessonDocumentParams {
  lesson: { lessonSlug: string; lessonTitle: string };
  transcript: string;
  summary: unknown;
  unitCanonicalUrl: string;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  years: string[] | undefined;
  lessonCount: number;
  esClient: Client;
}

/**
 * Generates dense vectors for lesson and title text.
 * Helper to keep createLessonDocument under max-lines-per-function limit.
 */
async function generateLessonVectors(
  esClient: Client,
  transcript: string,
  title: string,
): Promise<{ lessonVector?: number[]; titleVector?: number[] }> {
  const lessonVector = await generateDenseVector(esClient, transcript);
  const titleVector = await generateDenseVector(esClient, title);
  return { lessonVector, titleVector };
}

/**
 * Creates a lesson document for Elasticsearch indexing.
 *
 * Generates dense vector embeddings using the E5 inference endpoint.
 * Extracts tier, exam_board, and pathway from programme factors for KS4/GCSE content.
 *
 * Note: Lessons use subject + key_stage completion contexts only.
 * Sequence context is NOT included - it's a unit-level concept.
 * This aligns with LESSONS_COMPLETION_CONTEXTS in the SDK.
 */
export async function createLessonDocument({
  lesson,
  transcript,
  summary,
  unitCanonicalUrl,
  subject,
  keyStage,
  years,
  lessonCount,
  esClient,
}: CreateLessonDocumentParams): Promise<SearchLessonsIndexDoc> {
  const fields = extractLessonFields(summary);

  // Generate dense vectors for three-way hybrid search
  const { lessonVector: lessonDenseVector, titleVector: titleDenseVector } =
    await generateLessonVectors(esClient, transcript, lesson.lessonTitle);

  return {
    lesson_id: lesson.lessonSlug,
    lesson_slug: lesson.lessonSlug,
    lesson_title: lesson.lessonTitle,
    subject_slug: subject,
    key_stage: keyStage,
    years,
    unit_ids: [fields.unitSlug],
    unit_titles: [fields.unitTitle],
    unit_count: lessonCount,
    unit_urls: [unitCanonicalUrl],
    lesson_keywords: fields.lessonKeywords,
    key_learning_points: fields.keyLearningPoints,
    misconceptions_and_common_mistakes: fields.misconceptions,
    teacher_tips: fields.teacherTips,
    content_guidance: fields.contentGuidance,
    transcript_text: transcript,
    lesson_url: fields.canonicalUrl,
    tier: fields.tier,
    exam_board: fields.examBoard,
    pathway: fields.pathway,
    lesson_dense_vector: lessonDenseVector,
    title_dense_vector: titleDenseVector,
    title_suggest: {
      input: [lesson.lessonTitle],
      contexts: {
        subject: [subject],
        key_stage: [keyStage],
      },
    },
  };
}

export interface CreateRollupDocumentParams {
  summary: unknown;
  snippets: string[];
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  subjectProgrammesUrl: string;
  esClient: Client;
}

/**
 * Extracts all fields from unit summary for rollup document creation.
 * Helper to keep createRollupDocument under max-lines-per-function limit.
 */
function extractRollupFields(summary: unknown) {
  const { unitSlug, unitTitle, canonicalUrl } = resolveUnitSummaryIdentifiers(summary);
  const rollupLessons: UnitLessonInfo[] = extractUnitLessons(
    readUnitSummaryValue(summary, 'unitLessons'),
  );
  const lessonIds = rollupLessons.map((lesson) => lesson.lessonSlug);
  const unitTopics: string[] | undefined = extractUnitTopics(
    readUnitSummaryValue(summary, 'categories'),
  );
  const years = normaliseYears(
    readUnitSummaryValue(summary, 'year'),
    readUnitSummaryValue(summary, 'yearSlug'),
  );
  const sequenceIds: string[] | undefined = extractSequenceIds(
    readUnitSummaryValue(summary, 'threads'),
  );
  const tier = extractTier(summary);
  const examBoard = extractExamBoard(summary);

  return {
    unitSlug,
    unitTitle,
    canonicalUrl,
    lessonIds,
    unitTopics,
    years,
    sequenceIds,
    tier,
    examBoard,
  };
}

/**
 * Generates dense vectors for unit rollup text and title.
 * Helper to keep createRollupDocument under max-lines-per-function limit.
 */
async function generateRollupVectors(
  esClient: Client,
  rollupText: string,
  unitTitle: string,
): Promise<{ unitVector?: number[]; rollupVector?: number[] }> {
  const unitVector = await generateDenseVector(esClient, rollupText);
  const rollupVector = await generateDenseVector(esClient, unitTitle);
  return { unitVector, rollupVector };
}

/**
 * Creates a rollup document for Elasticsearch indexing.
 *
 * Generates dense vector embeddings for unit-level content.
 * Extracts tier and exam_board from programme factors for KS4/GCSE content.
 */
export async function createRollupDocument({
  summary,
  snippets,
  subject,
  keyStage,
  subjectProgrammesUrl,
  esClient,
}: CreateRollupDocumentParams): Promise<SearchUnitRollupDoc> {
  const fields = extractRollupFields(summary);
  const rollupText = snippets.join('\n\n');

  // Generate dense vectors for three-way hybrid search
  const { unitVector: unitDenseVector, rollupVector: rollupDenseVector } =
    await generateRollupVectors(esClient, rollupText, fields.unitTitle);

  return {
    unit_id: fields.unitSlug,
    unit_slug: fields.unitSlug,
    unit_title: fields.unitTitle,
    subject_slug: subject,
    key_stage: keyStage,
    years: fields.years,
    lesson_ids: fields.lessonIds,
    lesson_count: fields.lessonIds.length,
    unit_topics: fields.unitTopics,
    rollup_text: rollupText,
    unit_semantic: rollupText,
    unit_url: fields.canonicalUrl,
    subject_programmes_url: subjectProgrammesUrl,
    sequence_ids: fields.sequenceIds,
    tier: fields.tier,
    exam_board: fields.examBoard,
    unit_dense_vector: unitDenseVector,
    rollup_dense_vector: rollupDenseVector,
  };
}

export function normaliseYears(year: unknown, yearSlug: unknown): string[] | undefined {
  if (typeof year === 'number' || typeof year === 'string') {
    return [String(year)];
  }
  if (typeof yearSlug === 'string') {
    return [yearSlug];
  }
  return undefined;
}

export function extractPassage(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/u);
  const pick = sentences.slice(0, 2).join(' ');
  return pick.slice(0, 300);
}
