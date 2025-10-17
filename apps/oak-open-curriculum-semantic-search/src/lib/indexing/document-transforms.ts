import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchUnitRollupDoc,
  SearchUnitSummary,
  SearchUnitsIndexDoc,
} from '../../types/oak';
import {
  extractLessonPlanningFields,
  extractSequenceIds,
  extractUnitLessons,
  extractUnitTopics,
  type UnitLessonInfo,
} from './document-transform-helpers';

export {
  extractLessonPlanningFields,
  extractSequenceIds,
  extractUnitLessons,
} from './document-transform-helpers';

export interface CreateUnitDocumentParams {
  summary: SearchUnitSummary;
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
  const canonicalUrlValue: unknown = Reflect.get(summary, 'canonicalUrl');
  const canonicalUrl = typeof canonicalUrlValue === 'string' ? canonicalUrlValue : undefined;
  if (!canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${summary.unitSlug}`);
  }

  const rawUnitLessons: unknown = Reflect.get(summary, 'unitLessons');
  const unitLessons: UnitLessonInfo[] = extractUnitLessons(rawUnitLessons);
  const lessonIds: string[] = unitLessons.map((lesson) => lesson.lessonSlug);
  const rawCategories: unknown = Reflect.get(summary, 'categories');
  const unitTopics: string[] | undefined = extractUnitTopics(rawCategories);
  const years = normaliseYears(Reflect.get(summary, 'year'), Reflect.get(summary, 'yearSlug'));
  const rawThreads: unknown = Reflect.get(summary, 'threads');
  const sequenceIds: string[] | undefined = extractSequenceIds(rawThreads);

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
    unit_url: canonicalUrl,
    subject_programmes_url: subjectProgrammesUrl,
    sequence_ids: sequenceIds,
    title_suggest: {
      input: [summary.unitTitle],
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
  summary: SearchLessonSummary;
  unitCanonicalUrl: string;
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  years: string[] | undefined;
  unitSequenceIds: string[] | undefined;
  lessonCount: number;
}

export function createLessonDocument({
  lesson,
  transcript,
  summary,
  unitCanonicalUrl,
  subject,
  keyStage,
  years,
  unitSequenceIds,
  lessonCount,
}: CreateLessonDocumentParams): SearchLessonsIndexDoc {
  const canonicalUrlValue: unknown = Reflect.get(summary, 'canonicalUrl');
  const canonicalUrl = typeof canonicalUrlValue === 'string' ? canonicalUrlValue : undefined;
  if (!canonicalUrl) {
    throw new Error(`Missing canonical URL for lesson ${lesson.lessonSlug}`);
  }

  const { lessonKeywords, keyLearningPoints, misconceptions, teacherTips, contentGuidance } =
    extractLessonPlanningFields(summary);

  return {
    lesson_id: lesson.lessonSlug,
    lesson_slug: lesson.lessonSlug,
    lesson_title: lesson.lessonTitle,
    subject_slug: subject,
    key_stage: keyStage,
    years,
    unit_ids: [summary.unitSlug],
    unit_titles: [summary.unitTitle],
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
        sequence: unitSequenceIds,
      },
    },
  };
}

export interface CreateRollupDocumentParams {
  summary: SearchUnitSummary;
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
  const canonicalUrl = summary.canonicalUrl;
  if (!canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${summary.unitSlug}`);
  }

  const rawRollupLessons: unknown = Reflect.get(summary, 'unitLessons');
  const rollupLessons: UnitLessonInfo[] = extractUnitLessons(rawRollupLessons);
  const lessonIds = rollupLessons.map((lesson) => lesson.lessonSlug);
  const unitTopics: string[] | undefined = extractUnitTopics(Reflect.get(summary, 'categories'));
  const years = normaliseYears(Reflect.get(summary, 'year'), Reflect.get(summary, 'yearSlug'));
  const sequenceIds: string[] | undefined = extractSequenceIds(Reflect.get(summary, 'threads'));

  const rollupText = snippets.join('\n\n');

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
