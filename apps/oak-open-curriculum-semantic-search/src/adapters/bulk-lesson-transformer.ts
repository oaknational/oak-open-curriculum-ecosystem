/**
 * Bulk lesson to ES document transformer.
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

/** Lesson content fields */
interface LessonContentFields {
  readonly lesson_content: string;
  readonly lesson_structure: string | undefined;
  readonly lesson_content_semantic: string;
  readonly lesson_structure_semantic: string | undefined;
  readonly lesson_url: string;
  readonly pupil_lesson_outcome: string | undefined;
  readonly supervision_level: string | undefined;
  readonly downloads_available: boolean;
}

/** Build content fields for lesson document */
function buildLessonContentFields(lesson: Lesson): LessonContentFields {
  const transcriptText = lesson.transcript_sentences ?? '[No transcript available]';
  return {
    lesson_content: transcriptText,
    lesson_structure: undefined,
    lesson_content_semantic: transcriptText,
    lesson_structure_semantic: undefined,
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
