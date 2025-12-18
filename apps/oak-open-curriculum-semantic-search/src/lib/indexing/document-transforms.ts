/**
 * Document transformation functions for Elasticsearch indexing.
 *
 * Creates unit, lesson, and rollup documents from Oak API data.
 * Uses two-way hybrid search (BM25 + ELSER) per ADR-075.
 *
 * KS4 metadata denormalisation (tiers, exam boards, exam subjects, ks4 options)
 * is handled by looking up units in the UnitContextMap per ADR-080.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
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
  extractKs4DocumentFields,
  extractUnitEnrichmentFields,
} from './document-transform-helpers';
import { getKs4ContextForUnit, type UnitContextMap } from './ks4-context-builder';
import {
  generateLessonSemanticSummary,
  generateUnitSemanticSummary,
} from './semantic-summary-generator';

export { extractLessonPlanningFields } from './document-transform-helpers';

export interface CreateUnitDocumentParams {
  summary: SearchUnitSummary;
  subject: SearchSubjectSlug;
  /** Display title for the subject (e.g., "Mathematics" instead of "maths") */
  subjectTitle?: string;
  keyStage: KeyStage;
  /** Display title for the key stage (e.g., "Key Stage 2" instead of "ks2") */
  keyStageTitle?: string;
  subjectProgrammesUrl: string;
  /** KS4 metadata context map per ADR-080 */
  unitContextMap: UnitContextMap;
}

/** Creates a unit document for Elasticsearch indexing. */
export function createUnitDocument({
  summary,
  subject,
  subjectTitle,
  keyStage,
  keyStageTitle,
  subjectProgrammesUrl,
  unitContextMap,
}: CreateUnitDocumentParams): SearchUnitsIndexDoc {
  if (!summary.canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${summary.unitSlug}`);
  }

  const lessonIds = summary.unitLessons.map((lesson) => lesson.lessonSlug);
  const unitTopics = summary.categories?.map((cat) => cat.categoryTitle);
  const years = normaliseYears(summary.year, summary.yearSlug);
  const sequenceIds = summary.threads?.map((thread) => thread.slug);
  const ks4Fields = extractKs4DocumentFields(
    getKs4ContextForUnit(unitContextMap, summary.unitSlug),
  );

  return {
    unit_id: summary.unitSlug,
    unit_slug: summary.unitSlug,
    unit_title: summary.unitTitle,
    subject_slug: subject,
    subject_title: subjectTitle,
    key_stage: keyStage,
    key_stage_title: keyStageTitle,
    years,
    lesson_ids: lessonIds,
    lesson_count: lessonIds.length,
    unit_topics: unitTopics,
    unit_url: summary.canonicalUrl,
    subject_programmes_url: subjectProgrammesUrl,
    sequence_ids: sequenceIds,
    ...extractUnitEnrichmentFields(summary),
    ...ks4Fields,
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
  /** KS4 metadata context map per ADR-080 */
  unitContextMap: UnitContextMap;
  /** Unit slug for KS4 context lookup */
  unitSlug: string;
}

/** Creates a lesson document for Elasticsearch indexing. */
export function createLessonDocument(params: CreateLessonDocumentParams): SearchLessonsIndexDoc {
  const {
    lesson,
    transcript,
    summary,
    unitCanonicalUrl,
    subject,
    keyStage,
    years,
    lessonCount,
    unitContextMap,
    unitSlug,
  } = params;
  const fields = extractLessonDocumentFields(summary);
  const ks4Fields = extractKs4DocumentFields(getKs4ContextForUnit(unitContextMap, unitSlug));
  const lessonSemantic = generateLessonSemanticSummary(summary);

  return {
    lesson_id: lesson.lessonSlug,
    lesson_slug: lesson.lessonSlug,
    lesson_title: lesson.lessonTitle,
    subject_slug: subject,
    subject_title: fields.subjectTitle,
    key_stage: keyStage,
    key_stage_title: fields.keyStageTitle,
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
    lesson_content: transcript,
    lesson_structure: lessonSemantic,
    lesson_content_semantic: transcript,
    lesson_structure_semantic: lessonSemantic,
    lesson_url: fields.canonicalUrl,
    tier: fields.tier,
    pupil_lesson_outcome: fields.pupilLessonOutcome,
    ...ks4Fields,
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
  /** Display title for the subject (e.g., "Mathematics" instead of "maths") */
  subjectTitle?: string;
  keyStage: KeyStage;
  /** Display title for the key stage (e.g., "Key Stage 2" instead of "ks2") */
  keyStageTitle?: string;
  subjectProgrammesUrl: string;
  /** KS4 metadata context map per ADR-080 */
  unitContextMap: UnitContextMap;
}

/** Creates a rollup document for Elasticsearch indexing. */
export function createRollupDocument(params: CreateRollupDocumentParams): SearchUnitRollupDoc {
  const {
    summary,
    snippets,
    subject,
    subjectTitle,
    keyStage,
    keyStageTitle,
    subjectProgrammesUrl,
    unitContextMap,
  } = params;
  const fields = extractRollupDocumentFields(summary, normaliseYears);
  const rollupText = createEnrichedRollupText(snippets, extractPedagogicalData(summary));
  const ks4Fields = extractKs4DocumentFields(
    getKs4ContextForUnit(unitContextMap, summary.unitSlug),
  );
  const unitSemantic = generateUnitSemanticSummary(
    summary,
    keyStageTitle ?? keyStage,
    subjectTitle ?? subject,
  );

  return {
    unit_id: fields.unitSlug,
    unit_slug: fields.unitSlug,
    unit_title: fields.unitTitle,
    subject_slug: subject,
    subject_title: subjectTitle,
    key_stage: keyStage,
    key_stage_title: keyStageTitle,
    years: fields.years,
    lesson_ids: fields.lessonIds,
    lesson_count: fields.lessonIds.length,
    unit_topics: fields.unitTopics,
    unit_content: rollupText,
    unit_structure: unitSemantic,
    unit_content_semantic: rollupText,
    unit_structure_semantic: unitSemantic,
    unit_url: fields.canonicalUrl,
    subject_programmes_url: subjectProgrammesUrl,
    sequence_ids: fields.sequenceIds,
    thread_slugs: fields.threadSlugs,
    thread_titles: fields.threadTitles,
    thread_orders: fields.threadOrders,
    tier: fields.tier,
    ...extractUnitEnrichmentFields(summary),
    ...ks4Fields,
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
