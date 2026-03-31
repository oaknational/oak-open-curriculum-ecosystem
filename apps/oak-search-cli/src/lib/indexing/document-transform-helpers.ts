/**
 * Document transformation helpers for ES indexing.
 *
 * These functions extract and transform fields from typed SDK summaries
 * for Elasticsearch document creation.
 *
 */

import type { SearchLessonSummary, SearchUnitSummary } from '../../types/oak';
import {
  extractThreadInfo,
  extractPedagogicalData,
  createEnrichedRollupText,
  type ThreadInfo,
  type PedagogicalData,
} from './thread-and-pedagogical-extractors';
import type { AggregatedUnitContext } from './ks4-context-builder';

// Re-export thread and pedagogical extractors
export {
  extractThreadInfo,
  extractPedagogicalData,
  createEnrichedRollupText,
  type ThreadInfo,
  type PedagogicalData,
};

/**
 * KS4 fields for Elasticsearch documents.
 * Optional arrays following the denormalisation pattern in ADR-080.
 */
export interface Ks4DocumentFields {
  readonly tiers?: string[];
  readonly tier_titles?: string[];
  readonly exam_boards?: string[];
  readonly exam_board_titles?: string[];
  readonly exam_subjects?: string[];
  readonly exam_subject_titles?: string[];
  readonly ks4_options?: string[];
  readonly ks4_option_titles?: string[];
}

/** Converts non-empty readonly array to mutable, or undefined. */
function nonEmptyOrUndefined(arr: readonly string[]): string[] | undefined {
  return arr.length > 0 ? [...arr] : undefined;
}

/**
 * Extracts KS4 document fields from aggregated unit context.
 *
 * @param ks4Context - Aggregated KS4 context from UnitContextMap
 * @returns KS4 fields ready for spreading into document
 */
export function extractKs4DocumentFields(ks4Context: AggregatedUnitContext): Ks4DocumentFields {
  return {
    tiers: nonEmptyOrUndefined(ks4Context.tiers),
    tier_titles: nonEmptyOrUndefined(ks4Context.tierTitles),
    exam_boards: nonEmptyOrUndefined(ks4Context.examBoards),
    exam_board_titles: nonEmptyOrUndefined(ks4Context.examBoardTitles),
    exam_subjects: nonEmptyOrUndefined(ks4Context.examSubjects),
    exam_subject_titles: nonEmptyOrUndefined(ks4Context.examSubjectTitles),
    ks4_options: nonEmptyOrUndefined(ks4Context.ks4Options),
    ks4_option_titles: nonEmptyOrUndefined(ks4Context.ks4OptionTitles),
  };
}

export interface UnitLessonInfo {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
}

type LessonDocumentSummaryInput = Omit<SearchLessonSummary, 'canonicalUrl'> & {
  canonicalUrl?: string;
};

/**
 * Extracts lesson planning fields from lesson summary.
 *
 * @param summary - Lesson summary (typed SDK data)
 * @returns Extracted lesson planning fields
 */
export function extractLessonPlanningFields(summary: LessonDocumentSummaryInput): {
  lessonKeywords?: string[];
  keyLearningPoints?: string[];
  misconceptions?: string[];
  teacherTips?: string[];
  contentGuidance?: string[];
} {
  const lessonKeywords =
    summary.lessonKeywords.length > 0 ? summary.lessonKeywords.map((k) => k.keyword) : undefined;

  const keyLearningPoints =
    summary.keyLearningPoints.length > 0
      ? summary.keyLearningPoints.map((k) => k.keyLearningPoint)
      : undefined;

  const misconceptions =
    summary.misconceptionsAndCommonMistakes.length > 0
      ? summary.misconceptionsAndCommonMistakes.map((m) => `${m.misconception} → ${m.response}`)
      : undefined;

  const teacherTips =
    summary.teacherTips.length > 0 ? summary.teacherTips.map((t) => t.teacherTip) : undefined;

  const contentGuidance =
    summary.contentGuidance && summary.contentGuidance.length > 0
      ? summary.contentGuidance.map((c) => c.contentGuidanceDescription)
      : undefined;

  return {
    lessonKeywords,
    keyLearningPoints,
    misconceptions,
    teacherTips,
    contentGuidance,
  };
}

/**
 * Extracts all fields from lesson summary for document creation.
 *
 * @param summary - Lesson summary (typed SDK data)
 * @returns Extracted fields for lesson document
 */
export function extractLessonDocumentFields(summary: LessonDocumentSummaryInput): {
  unitSlug: string;
  unitTitle: string;
  canonicalUrl: string;
  lessonKeywords?: string[];
  keyLearningPoints?: string[];
  misconceptions?: string[];
  teacherTips?: string[];
  contentGuidance?: string[];
  pupilLessonOutcome?: string;
  subjectTitle: string;
  keyStageTitle: string;
  supervisionLevel?: string;
  downloadsAvailable?: boolean;
} {
  if (!summary.canonicalUrl) {
    throw new Error(`Missing canonical URL for lesson in unit ${summary.unitSlug}`);
  }

  const { lessonKeywords, keyLearningPoints, misconceptions, teacherTips, contentGuidance } =
    extractLessonPlanningFields(summary);

  return {
    unitSlug: summary.unitSlug,
    unitTitle: summary.unitTitle,
    canonicalUrl: summary.canonicalUrl,
    lessonKeywords,
    keyLearningPoints,
    misconceptions,
    teacherTips,
    contentGuidance,
    pupilLessonOutcome: summary.pupilLessonOutcome,
    subjectTitle: summary.subjectTitle,
    keyStageTitle: summary.keyStageTitle,
    supervisionLevel: summary.supervisionLevel ?? undefined,
    downloadsAvailable: summary.downloadsAvailable,
  };
}

/**
 * Extracts all fields from unit summary for rollup document creation.
 *
 * @param summary - Unit summary (typed SDK data)
 * @param normaliseYears - Function to normalise year values
 * @returns Extracted fields for rollup document
 */
// eslint-disable-next-line complexity -- Field extraction requires conditional logic
export function extractRollupDocumentFields(
  summary: SearchUnitSummary,
  normaliseYears: (year: string | number, yearSlug: string) => string[] | undefined,
  lessonsByUnit?: ReadonlyMap<string, readonly string[]>,
): {
  unitSlug: string;
  unitTitle: string;
  canonicalUrl: string;
  lessonIds: string[];
  unitTopics: string[] | undefined;
  years: string[] | undefined;
  sequenceIds: string[] | undefined;
  threadSlugs: string[] | undefined;
  threadTitles: string[] | undefined;
  threadOrders: number[] | undefined;
} {
  if (!summary.canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${summary.unitSlug}`);
  }

  const lessonIds =
    lessonsByUnit?.get(summary.unitSlug) ?? summary.unitLessons.map((lesson) => lesson.lessonSlug);
  const unitTopics = summary.categories?.map((cat) => cat.categoryTitle);
  const years = normaliseYears(summary.year, summary.yearSlug);
  const sequenceIds = summary.threads?.map((thread) => thread.slug);
  const threadInfo = extractThreadInfo(summary.threads);

  return {
    unitSlug: summary.unitSlug,
    unitTitle: summary.unitTitle,
    canonicalUrl: summary.canonicalUrl,
    lessonIds: [...lessonIds],
    unitTopics: unitTopics && unitTopics.length > 0 ? unitTopics : undefined,
    years,
    sequenceIds: sequenceIds && sequenceIds.length > 0 ? sequenceIds : undefined,
    threadSlugs: threadInfo.slugs,
    threadTitles: threadInfo.titles,
    threadOrders: threadInfo.orders,
  };
}

/** Extracted unit enrichment fields for document creation. */
export interface UnitEnrichmentFields {
  description?: string;
  why_this_why_now?: string;
  categories?: string[];
  prior_knowledge_requirements: string[];
  national_curriculum_content: string[];
}

/** Extracts unit enrichment fields from a unit summary. */
export function extractUnitEnrichmentFields(summary: SearchUnitSummary): UnitEnrichmentFields {
  return {
    description: summary.description ?? undefined,
    why_this_why_now: summary.whyThisWhyNow ?? undefined,
    categories: summary.categories?.map((cat) => cat.categoryTitle),
    prior_knowledge_requirements: summary.priorKnowledgeRequirements,
    national_curriculum_content: summary.nationalCurriculumContent,
  };
}
