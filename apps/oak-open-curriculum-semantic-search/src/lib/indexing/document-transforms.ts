/**
 * Document transformation functions for Elasticsearch indexing.
 *
 * Creates unit, lesson, and rollup documents from Oak API data.
 * Includes dense vector generation for three-way hybrid search.
 *
 * @module document-transforms
 */

import type { Client } from '@elastic/elasticsearch';
import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchSubjectSlug,
  SearchUnitRollupDoc,
  SearchUnitsIndexDoc,
} from '../../types/oak';
import {
  extractSequenceIds,
  extractUnitLessons,
  extractUnitTopics,
  readUnitSummaryValue,
  resolveUnitSummaryIdentifiers,
  extractLessonDocumentFields,
  extractRollupDocumentFields,
  extractPedagogicalData,
  createEnrichedRollupText,
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

/** Creates a unit document for Elasticsearch indexing. */
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
  const unitTopics = extractUnitTopics(readUnitSummaryValue(summary, 'categories'));
  const years = normaliseYears(
    readUnitSummaryValue(summary, 'year'),
    readUnitSummaryValue(summary, 'yearSlug'),
  );
  const sequenceIds = extractSequenceIds(readUnitSummaryValue(summary, 'threads'));

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
      contexts: { subject: [subject], key_stage: [keyStage], sequence: sequenceIds },
    },
    doc_type: 'unit',
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

/** Creates a lesson document for Elasticsearch indexing with dense vectors. */
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
  const fields = extractLessonDocumentFields(summary);
  const [lessonDenseVector, titleDenseVector] = await Promise.all([
    generateDenseVector(esClient, transcript),
    generateDenseVector(esClient, lesson.lessonTitle),
  ]);

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
    lesson_semantic: transcript,
    lesson_url: fields.canonicalUrl,
    tier: fields.tier,
    exam_board: fields.examBoard,
    pathway: fields.pathway,
    lesson_dense_vector: lessonDenseVector,
    title_dense_vector: titleDenseVector,
    title_suggest: {
      input: [lesson.lessonTitle],
      contexts: { subject: [subject], key_stage: [keyStage] },
    },
    doc_type: 'lesson',
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

/** Creates a rollup document for Elasticsearch indexing with dense vectors. */
export async function createRollupDocument({
  summary,
  snippets,
  subject,
  keyStage,
  subjectProgrammesUrl,
  esClient,
}: CreateRollupDocumentParams): Promise<SearchUnitRollupDoc> {
  const fields = extractRollupDocumentFields(summary, normaliseYears);
  const pedagogicalData = extractPedagogicalData(summary);
  const rollupText = createEnrichedRollupText(snippets, pedagogicalData);
  const [unitDenseVector, rollupDenseVector] = await Promise.all([
    generateDenseVector(esClient, rollupText),
    generateDenseVector(esClient, fields.unitTitle),
  ]);

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
    thread_slugs: fields.threadSlugs,
    thread_titles: fields.threadTitles,
    thread_orders: fields.threadOrders,
    tier: fields.tier,
    exam_board: fields.examBoard,
    pathway: fields.pathway,
    unit_dense_vector: unitDenseVector,
    rollup_dense_vector: rollupDenseVector,
    doc_type: 'unit',
  };
}

/** Normalises year values to string array. */
export function normaliseYears(year: unknown, yearSlug: unknown): string[] | undefined {
  if (typeof year === 'number' || typeof year === 'string') {
    return [String(year)];
  }
  if (typeof yearSlug === 'string') {
    return [yearSlug];
  }
  return undefined;
}

/** Extracts a passage from text. */
export function extractPassage(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/u);
  return sentences.slice(0, 2).join(' ').slice(0, 300);
}
