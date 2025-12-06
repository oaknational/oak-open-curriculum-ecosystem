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
  type UnitLessonInfo,
} from './document-transform-helpers';

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
}

/**
 * Creates a lesson document for Elasticsearch indexing.
 *
 * Note: Lessons use subject + key_stage completion contexts only.
 * Sequence context is NOT included - it's a unit-level concept.
 * This aligns with LESSONS_COMPLETION_CONTEXTS in the SDK.
 */
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
  const { unitSlug, unitTitle, canonicalUrl } = resolveLessonSummaryIdentifiers(summary);

  const { lessonKeywords, keyLearningPoints, misconceptions, teacherTips, contentGuidance } =
    extractLessonPlanningFields(summary);

  return {
    lesson_id: lesson.lessonSlug,
    lesson_slug: lesson.lessonSlug,
    lesson_title: lesson.lessonTitle,
    subject_slug: subject,
    key_stage: keyStage,
    years,
    unit_ids: [unitSlug],
    unit_titles: [unitTitle],
    unit_count: lessonCount,
    unit_urls: [unitCanonicalUrl],
    lesson_keywords: lessonKeywords,
    key_learning_points: keyLearningPoints,
    misconceptions_and_common_mistakes: misconceptions,
    teacher_tips: teacherTips,
    content_guidance: contentGuidance,
    transcript_text: transcript,
    lesson_url: canonicalUrl,
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
}

export function createRollupDocument({
  summary,
  snippets,
  subject,
  keyStage,
  subjectProgrammesUrl,
}: CreateRollupDocumentParams): SearchUnitRollupDoc {
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

  const rollupText = snippets.join('\n\n');

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
    rollup_text: rollupText,
    unit_semantic: rollupText,
    unit_url: canonicalUrl,
    subject_programmes_url: subjectProgrammesUrl,
    sequence_ids: sequenceIds,
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
