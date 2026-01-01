/**
 * Bulk lesson to ES document transformer.
 *
 * @remarks
 * Transforms bulk download lesson data into Elasticsearch document format,
 * including semantic summary generation for ELSER embeddings.
 *
 * @module adapters/bulk-lesson-transformer
 */

import type { Lesson } from '@oaknational/oak-curriculum-sdk/public/bulk.js';
import type { SearchLessonsIndexDoc, SearchSubjectSlug, KeyStage } from '../types/oak';
import { isKeyStage, isSubject } from './sdk-guards';
import {
  generateLessonUrl,
  extractKeywordStrings,
  extractLearningPointStrings,
  extractMisconceptionStrings,
  extractTeacherTipStrings,
  extractContentGuidanceLabels,
  normaliseSupervisionLevel,
  normaliseSubjectSlug,
} from './bulk-transform-helpers.js';

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

/** Unit info needed for lesson document construction */
export interface LessonUnitInfo {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly canonicalUrl: string;
}

/** Parameters for transforming a bulk lesson to ES document */
export interface BulkToESLessonParams {
  readonly lesson: Lesson;
  readonly unitInfo: LessonUnitInfo;
  readonly years: readonly string[];
}

/** Build core fields for lesson document */
function buildLessonCoreFields(
  lesson: Lesson,
  subjectSlug: SearchSubjectSlug,
  keyStage: KeyStage,
  years: readonly string[],
  unitInfo: LessonUnitInfo,
) {
  return {
    lesson_id: lesson.lessonSlug,
    lesson_slug: lesson.lessonSlug,
    lesson_title: lesson.lessonTitle,
    subject_slug: subjectSlug,
    subject_title: lesson.subjectTitle,
    key_stage: keyStage,
    key_stage_title: lesson.keyStageTitle,
    years: years.length > 0 ? [...years] : undefined,
    unit_ids: [unitInfo.unitSlug],
    unit_titles: [unitInfo.unitTitle],
    unit_urls: [unitInfo.canonicalUrl],
  };
}

/** Build pedagogical fields for lesson document */
function buildLessonPedagogicalFields(lesson: Lesson) {
  return {
    lesson_keywords: extractKeywordStrings(lesson.lessonKeywords),
    key_learning_points: extractLearningPointStrings(lesson.keyLearningPoints),
    misconceptions_and_common_mistakes: extractMisconceptionStrings(
      lesson.misconceptionsAndCommonMistakes,
    ),
    teacher_tips: extractTeacherTipStrings(lesson.teacherTips),
    content_guidance: extractContentGuidanceLabels(lesson.contentGuidance),
  };
}

/**
 * Lesson content fields including transcript availability indicator.
 *
 * `lesson_content` and `lesson_content_semantic` are optional because
 * MFL lessons and some practical lessons lack transcripts. These fields
 * are omitted entirely to avoid polluting the BM25/ELSER indexes.
 *
 * @see ADR-094 for `has_transcript` field rationale
 * @see ADR-095 for conditional field inclusion rationale
 */
interface LessonContentFields {
  readonly has_transcript: boolean;
  readonly lesson_content: string | undefined;
  readonly lesson_structure: string | undefined;
  readonly lesson_content_semantic: string | undefined;
  readonly lesson_structure_semantic: string | undefined;
  readonly lesson_url: string;
  readonly pupil_lesson_outcome: string | undefined;
  readonly supervision_level: string | undefined;
  readonly downloads_available: boolean;
}

/**
 * Build content fields for lesson document.
 *
 * Content fields (`lesson_content`, `lesson_content_semantic`) are conditionally
 * included based on transcript availability. This prevents garbage tokens like
 * "No transcript available" from polluting the BM25 index and wasting ELSER
 * inference on meaningless placeholder text.
 *
 * Structure fields (`lesson_structure`, `lesson_structure_semantic`) are always
 * populated from pedagogical metadata, enabling lessons without transcripts to
 * still be found via structure retrievers.
 *
 * @param lesson - The bulk lesson to build content fields for
 * @returns Content fields with conditional transcript inclusion
 *
 * @see ADR-094 for `has_transcript` field rationale
 * @see ADR-095 for conditional field inclusion rationale
 */
function buildLessonContentFields(lesson: Lesson): LessonContentFields {
  const transcript = lesson.transcript_sentences;
  const hasTranscript = typeof transcript === 'string' && transcript.length > 0;
  const structureSummary = generateBulkLessonSemanticSummary(lesson);

  return {
    has_transcript: hasTranscript,
    // Only include content fields if transcript exists
    lesson_content: hasTranscript ? transcript : undefined,
    lesson_content_semantic: hasTranscript ? transcript : undefined,
    // Structure fields always populated from pedagogical data
    lesson_structure: structureSummary,
    lesson_structure_semantic: structureSummary,
    lesson_url: generateLessonUrl(lesson.lessonSlug),
    pupil_lesson_outcome: lesson.pupilLessonOutcome || undefined,
    supervision_level: normaliseSupervisionLevel(lesson.supervisionLevel),
    downloads_available: lesson.downloadsavailable,
  };
}

/**
 * Transform a bulk lesson into an ES lesson document.
 *
 * @remarks
 * Subject slugs are normalised from bulk variants (e.g., 'combined-science')
 * to API subjects (e.g., 'science') before validation.
 */
export function transformBulkLessonToESDoc(params: BulkToESLessonParams): SearchLessonsIndexDoc {
  const { lesson, unitInfo, years } = params;

  // Normalise subject slug (e.g., 'combined-science' → 'science')
  const normalisedSubject = normaliseSubjectSlug(lesson.subjectSlug);
  const subjectSlug = isSubject(normalisedSubject)
    ? normalisedSubject
    : (() => {
        throw new Error(
          `Invalid subject slug: ${lesson.subjectSlug} (normalised: ${normalisedSubject})`,
        );
      })();

  const keyStage = isKeyStage(lesson.keyStageSlug)
    ? lesson.keyStageSlug
    : (() => {
        throw new Error(`Invalid key stage: ${lesson.keyStageSlug}`);
      })();

  return {
    ...buildLessonCoreFields(lesson, subjectSlug, keyStage, years, unitInfo),
    ...buildLessonPedagogicalFields(lesson),
    ...buildLessonContentFields(lesson),
    title_suggest: {
      input: [lesson.lessonTitle],
      contexts: { subject: [subjectSlug], key_stage: [keyStage] },
    },
    doc_type: 'lesson',
  };
}
