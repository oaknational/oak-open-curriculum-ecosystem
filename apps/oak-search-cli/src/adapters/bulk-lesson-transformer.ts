/**
 * Bulk lesson to ES document transformer.
 *
 * @remarks
 * Extracts lesson data from bulk download files and transforms them into
 * Elasticsearch documents for the oak_lessons index via the shared
 * `buildLessonDocument()` builder.
 *
 * Follows DRY by reusing the shared document builder, ensuring a single source
 * of truth for lesson document creation logic.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 * @see buildLessonDocument - Shared document builder
 */

import type { Lesson } from '@oaknational/sdk-codegen/bulk';
import { SUBJECT_TO_PARENT, isAllSubject } from '@oaknational/curriculum-sdk';
import type { SearchLessonsIndexDoc, AllSubjectSlug } from '../types/oak';
import { isKeyStage } from './sdk-guards';
import {
  generateLessonUrl,
  extractKeywordStrings,
  extractLearningPointStrings,
  extractMisconceptionStrings,
  extractTeacherTipStrings,
  extractContentGuidanceLabels,
  normaliseSupervisionLevel,
} from './bulk-transform-helpers.js';
import {
  buildLessonDocument,
  type CreateLessonDocParams,
  type LessonUnitInfo,
} from '../lib/indexing/lesson-document-core';

// ============================================================================
// Semantic Summary Generation (Pure Functions)
// ============================================================================

/** Adds a formatted line to parts array if items exist. */
function addSection(parts: string[], label: string, items: readonly string[]): void {
  if (items.length > 0) {
    parts.push(`${label}: ${items.join('; ')}.`);
  }
}

/**
 * Generates a semantic summary for a bulk lesson.
 *
 * @remarks
 * Creates an information-dense ~200-400 token summary optimised for ELSER embeddings.
 * Includes context (title, key stage, subject, unit) and pedagogical content
 * (key learning points, keywords, misconceptions, teacher tips, pupil outcome).
 *
 * @param lesson - The bulk lesson to summarise
 * @returns A structured semantic summary string
 */
function generateBulkLessonSemanticSummary(lesson: Lesson): string {
  const contextLine = `${lesson.lessonTitle} is a ${lesson.keyStageTitle} ${lesson.subjectTitle} lesson in the unit "${lesson.unitTitle}".`;
  const parts: string[] = [contextLine];

  // Key learning points
  if (lesson.keyLearningPoints.length > 0) {
    addSection(
      parts,
      'Key learning',
      lesson.keyLearningPoints.map((p) => p.keyLearningPoint),
    );
  }

  // Keywords with descriptions
  if (lesson.lessonKeywords.length > 0) {
    addSection(
      parts,
      'Keywords',
      lesson.lessonKeywords.map((k) =>
        k.description ? `${k.keyword} (${k.description})` : k.keyword,
      ),
    );
  }

  // Misconceptions with responses
  if (lesson.misconceptionsAndCommonMistakes.length > 0) {
    addSection(
      parts,
      'Misconceptions',
      lesson.misconceptionsAndCommonMistakes.map((m) => `${m.misconception} → ${m.response}`),
    );
  }

  // Teacher tips
  if (lesson.teacherTips.length > 0) {
    addSection(
      parts,
      'Teacher tips',
      lesson.teacherTips.map((t) => t.teacherTip),
    );
  }

  // Pupil outcome
  if (lesson.pupilLessonOutcome) {
    parts.push(`Pupil outcome: ${lesson.pupilLessonOutcome}`);
  }

  return parts.join('\n\n');
}

// ============================================================================
// Document Building
// ============================================================================

// Re-export LessonUnitInfo from shared module for backwards compatibility
export type { LessonUnitInfo } from '../lib/indexing/lesson-document-core';

/** Parameters for transforming a bulk lesson to ES document */
export interface BulkToESLessonParams {
  readonly lesson: Lesson;
  readonly unitInfo: LessonUnitInfo;
  readonly years: readonly string[];
}

/**
 * Extracts lesson document params from a bulk lesson.
 *
 * This function transforms bulk-specific types into the input-agnostic
 * `CreateLessonDocParams` interface used by the shared builder.
 *
 * @param params - Bulk lesson params
 * @returns Params for `buildLessonDocument()`
 *
 * @example
 * ```typescript
 * const bulkParams: BulkToESLessonParams = { lesson, unitInfo, years };
 * const docParams = extractLessonParamsFromBulk(bulkParams);
 * const doc = buildLessonDocument(docParams);
 * ```
 */
export function extractLessonParamsFromBulk(params: BulkToESLessonParams): CreateLessonDocParams {
  const { lesson, unitInfo, years } = params;

  // Validate and preserve original subject slug (ADR-101: don't normalise away KS4 variants)
  const subjectSlug: AllSubjectSlug = isAllSubject(lesson.subjectSlug)
    ? lesson.subjectSlug
    : (() => {
        throw new Error(`Invalid subject slug: ${lesson.subjectSlug}`);
      })();

  // Get parent subject from SDK lookup (e.g., 'physics' → 'science')
  const subjectParent = SUBJECT_TO_PARENT[subjectSlug];

  const keyStage = isKeyStage(lesson.keyStageSlug)
    ? lesson.keyStageSlug
    : (() => {
        throw new Error(`Invalid key stage: ${lesson.keyStageSlug}`);
      })();

  return {
    lessonSlug: lesson.lessonSlug,
    lessonTitle: lesson.lessonTitle,
    subjectSlug,
    subjectParent,
    subjectTitle: lesson.subjectTitle,
    keyStage,
    keyStageTitle: lesson.keyStageTitle,
    years: years.length > 0 ? years : undefined,
    units: [unitInfo],
    unitCount: 1,
    threadSlugs: unitInfo.threadSlugs,
    threadTitles: unitInfo.threadTitles,
    lessonKeywords: extractKeywordStrings(lesson.lessonKeywords),
    keyLearningPoints: extractLearningPointStrings(lesson.keyLearningPoints),
    misconceptions: extractMisconceptionStrings(lesson.misconceptionsAndCommonMistakes),
    teacherTips: extractTeacherTipStrings(lesson.teacherTips),
    contentGuidance: extractContentGuidanceLabels(lesson.contentGuidance),
    transcript: lesson.transcript_sentences,
    lessonStructure: generateBulkLessonSemanticSummary(lesson),
    lessonUrl: generateLessonUrl(lesson.lessonSlug),
    pupilLessonOutcome: lesson.pupilLessonOutcome || undefined,
    supervisionLevel: normaliseSupervisionLevel(lesson.supervisionLevel),
    downloadsAvailable: lesson.downloadsavailable,
    ks4: undefined, // KS4 is added via enrichment in HybridDataSource
  };
}

/**
 * Transform a bulk lesson into an ES lesson document.
 *
 * Uses the shared `buildLessonDocument()` builder to ensure DRY compliance
 * and a single source of truth for lesson document creation logic.
 *
 * @remarks
 * Subject slugs are normalised from bulk variants (e.g., 'combined-science')
 * to API subjects (e.g., 'science') before validation.
 *
 * KS4 metadata is NOT included in the document returned by this function.
 * It is added later via enrichment in HybridDataSource.
 *
 * @param params - Bulk lesson params
 * @returns SearchLessonsIndexDoc ready for ES indexing
 *
 * @see buildLessonDocument - Shared builder this delegates to
 * @see enrichLessonDocWithKs4 - KS4 enrichment applied later
 */
export function transformBulkLessonToESDoc(params: BulkToESLessonParams): SearchLessonsIndexDoc {
  const docParams = extractLessonParamsFromBulk(params);
  return buildLessonDocument(docParams);
}
