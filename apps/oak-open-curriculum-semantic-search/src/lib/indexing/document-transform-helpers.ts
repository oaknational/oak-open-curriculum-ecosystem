/**
 * Document transformation helpers for ES indexing.
 *
 * These functions extract and transform fields from typed SDK summaries
 * for Elasticsearch document creation.
 *
 * @module document-transform-helpers
 */

import type { SearchLessonSummary, SearchUnitSummary } from '../../types/oak';
import { extractTier } from './programme-factor-extractors';
import {
  extractThreadInfo,
  extractPedagogicalData,
  createEnrichedRollupText,
  type ThreadInfo,
  type PedagogicalData,
} from './thread-and-pedagogical-extractors';

// Re-export programme factor extractors
export { extractTier };

// Re-export thread and pedagogical extractors
export {
  extractThreadInfo,
  extractPedagogicalData,
  createEnrichedRollupText,
  type ThreadInfo,
  type PedagogicalData,
};

export interface UnitLessonInfo {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
}

/**
 * Extracts lesson planning fields from lesson summary.
 *
 * @param summary - Lesson summary (typed SDK data)
 * @returns Extracted lesson planning fields
 */
export function extractLessonPlanningFields(summary: SearchLessonSummary): {
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
export function extractLessonDocumentFields(summary: SearchLessonSummary): {
  unitSlug: string;
  unitTitle: string;
  canonicalUrl: string;
  lessonKeywords?: string[];
  keyLearningPoints?: string[];
  misconceptions?: string[];
  teacherTips?: string[];
  contentGuidance?: string[];
  tier: 'foundation' | 'higher' | undefined;
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
    tier: extractTier(summary),
  };
}

/**
 * Extracts all fields from unit summary for rollup document creation.
 *
 * @param summary - Unit summary (typed SDK data)
 * @param normaliseYears - Function to normalise year values
 * @returns Extracted fields for rollup document
 */
export function extractRollupDocumentFields(
  summary: SearchUnitSummary,
  normaliseYears: (year: string | number, yearSlug: string) => string[] | undefined,
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
  tier: 'foundation' | 'higher' | undefined;
} {
  if (!summary.canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${summary.unitSlug}`);
  }

  const lessonIds = summary.unitLessons.map((lesson) => lesson.lessonSlug);
  const unitTopics = summary.categories?.map((cat) => cat.categoryTitle);
  const years = normaliseYears(summary.year, summary.yearSlug);
  const sequenceIds = summary.threads?.map((thread) => thread.slug);
  const threadInfo = extractThreadInfo(summary.threads);

  return {
    unitSlug: summary.unitSlug,
    unitTitle: summary.unitTitle,
    canonicalUrl: summary.canonicalUrl,
    lessonIds,
    unitTopics: unitTopics && unitTopics.length > 0 ? unitTopics : undefined,
    years,
    sequenceIds: sequenceIds && sequenceIds.length > 0 ? sequenceIds : undefined,
    threadSlugs: threadInfo.slugs,
    threadTitles: threadInfo.titles,
    threadOrders: threadInfo.orders,
    tier: extractTier(summary),
  };
}
