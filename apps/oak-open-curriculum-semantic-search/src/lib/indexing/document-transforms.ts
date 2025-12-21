/**
 * Document transformation functions for Elasticsearch indexing.
 * Creates unit, lesson, and rollup documents from Oak API data.
 * @see ADR-075 Two-way Hybrid Search, @see ADR-080 KS4 Metadata Denormalisation
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
import { normaliseYears } from './document-transform-utils';

export { extractLessonPlanningFields } from './document-transform-helpers';
export { normaliseYears, extractPassage } from './document-transform-utils';

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

/** Unit info for lesson documents. Each lesson may belong to multiple units. */
export interface LessonUnitInfo {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly canonicalUrl: string;
}

export interface CreateLessonDocumentParams {
  lesson: { lessonSlug: string; lessonTitle: string };
  transcript: string;
  summary: SearchLessonSummary;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  years: string[] | undefined;
  lessonCount: number;
  unitContextMap: UnitContextMap;
  /** ALL units this lesson belongs to - we never discard unit relationships. */
  units: readonly LessonUnitInfo[];
}

/** Extracts unit arrays from unit info. Preserves ALL relationships. */
function extractUnitArrays(units: readonly LessonUnitInfo[]) {
  return {
    unitIds: units.map((u) => u.unitSlug),
    unitTitles: units.map((u) => u.unitTitle),
    unitUrls: units.map((u) => u.canonicalUrl),
  };
}

/** Creates a lesson document for Elasticsearch indexing. */
export function createLessonDocument(params: CreateLessonDocumentParams): SearchLessonsIndexDoc {
  const {
    lesson,
    transcript,
    summary,
    subject,
    keyStage,
    years,
    lessonCount,
    unitContextMap,
    units,
  } = params;
  if (units.length === 0) {
    throw new Error(`Lesson ${lesson.lessonSlug} has no unit relationships`);
  }

  const primaryUnitSlug = units[0].unitSlug;
  const f = extractLessonDocumentFields(summary);
  const ks4 = extractKs4DocumentFields(getKs4ContextForUnit(unitContextMap, primaryUnitSlug));
  const sem = generateLessonSemanticSummary(summary);
  const { unitIds, unitTitles, unitUrls } = extractUnitArrays(units);

  return {
    lesson_id: lesson.lessonSlug,
    lesson_slug: lesson.lessonSlug,
    lesson_title: lesson.lessonTitle,
    subject_slug: subject,
    subject_title: f.subjectTitle,
    key_stage: keyStage,
    key_stage_title: f.keyStageTitle,
    years,
    unit_ids: unitIds,
    unit_titles: unitTitles,
    unit_count: lessonCount,
    unit_urls: unitUrls,
    lesson_keywords: f.lessonKeywords,
    key_learning_points: f.keyLearningPoints,
    misconceptions_and_common_mistakes: f.misconceptions,
    teacher_tips: f.teacherTips,
    content_guidance: f.contentGuidance,
    lesson_content: transcript,
    lesson_structure: sem,
    lesson_content_semantic: transcript,
    lesson_structure_semantic: sem,
    lesson_url: f.canonicalUrl,
    pupil_lesson_outcome: f.pupilLessonOutcome,
    ...ks4,
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
  subjectTitle?: string;
  keyStage: KeyStage;
  keyStageTitle?: string;
  subjectProgrammesUrl: string;
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
    ...extractUnitEnrichmentFields(summary),
    ...ks4Fields,
    doc_type: 'unit',
  };
}
