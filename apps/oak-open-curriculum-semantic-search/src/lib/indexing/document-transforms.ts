/**
 * Document transformation functions for Elasticsearch indexing.
 *
 * Creates unit, lesson, and rollup documents from Oak API data.
 * Uses two-way hybrid search (BM25 + ELSER) per ADR-075.
 *
 * @module document-transforms
 */

import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchUnitRollupDoc,
  SearchUnitsIndexDoc,
  SearchUnitSummary,
} from '../../types/oak';
import {
  extractLessonDocumentFields,
  extractRollupDocumentFields,
  extractPedagogicalData,
  createEnrichedRollupText,
} from './document-transform-helpers';

export { extractLessonPlanningFields } from './document-transform-helpers';

export interface CreateUnitDocumentParams {
  summary: SearchUnitSummary;
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
  if (!summary.canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${summary.unitSlug}`);
  }

  const lessonIds = summary.unitLessons.map((lesson) => lesson.lessonSlug);
  const unitTopics = summary.categories?.map((cat) => cat.categoryTitle);
  const years = normaliseYears(summary.year, summary.yearSlug);
  const sequenceIds = summary.threads?.map((thread) => thread.slug);

  return {
    unit_id: summary.unitSlug,
    unit_slug: summary.unitSlug,
    unit_title: summary.unitTitle,
    subject_slug: subject,
    key_stage: keyStage,
    years,
    lesson_ids: lessonIds,
    lesson_count: lessonIds.length,
    unit_topics: unitTopics,
    unit_url: summary.canonicalUrl,
    subject_programmes_url: subjectProgrammesUrl,
    sequence_ids: sequenceIds,
    title_suggest: {
      input: [summary.unitTitle],
      contexts: { subject: [subject], key_stage: [keyStage], sequence: sequenceIds ?? [] },
    },
    doc_type: 'unit',
  };
}

export interface CreateLessonDocumentParams {
  lesson: { lessonSlug: string; lessonTitle: string };
  transcript: string;
  summary: SearchLessonSummary;
  unitCanonicalUrl: string;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  years: string[] | undefined;
  lessonCount: number;
}

/** Creates a lesson document for Elasticsearch indexing. */
export function createLessonDocument({
  lesson,
  transcript,
  summary,
  unitCanonicalUrl,
  subject,
  keyStage,
  years,
  lessonCount,
}: CreateLessonDocumentParams): SearchLessonsIndexDoc {
  const fields = extractLessonDocumentFields(summary);

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
    title_suggest: {
      input: [lesson.lessonTitle],
      contexts: { subject: [subject], key_stage: [keyStage] },
    },
    doc_type: 'lesson',
  };
}

export interface CreateRollupDocumentParams {
  summary: SearchUnitSummary;
  snippets: string[];
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  subjectProgrammesUrl: string;
}

/** Creates a rollup document for Elasticsearch indexing. */
export function createRollupDocument({
  summary,
  snippets,
  subject,
  keyStage,
  subjectProgrammesUrl,
}: CreateRollupDocumentParams): SearchUnitRollupDoc {
  const fields = extractRollupDocumentFields(summary, normaliseYears);
  const pedagogicalData = extractPedagogicalData(summary);
  const rollupText = createEnrichedRollupText(snippets, pedagogicalData);

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
