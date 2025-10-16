import type {
  KeyStage,
  SearchLessonsIndexDoc,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchUnitRollupDoc,
  SearchUnitSummary,
  SearchUnitsIndexDoc,
} from '../../types/oak';

type UnitLesson = NonNullable<SearchUnitSummary['unitLessons']>[number];
type UnitCategory = NonNullable<SearchUnitSummary['categories']>[number];
type UnitThread = NonNullable<SearchUnitSummary['threads']>[number];
type LessonKeyword = NonNullable<SearchLessonSummary['lessonKeywords']>[number];
type LessonKeyLearningPoint = NonNullable<SearchLessonSummary['keyLearningPoints']>[number];
type LessonMisconception = NonNullable<
  SearchLessonSummary['misconceptionsAndCommonMistakes']
>[number];
type LessonTeacherTip = NonNullable<SearchLessonSummary['teacherTips']>[number];

interface LessonContentGuidanceEntry {
  readonly contentGuidanceDescription: string;
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLessonContentGuidanceEntry(value: unknown): value is LessonContentGuidanceEntry {
  if (!isUnknownRecord(value)) {
    return false;
  }
  const description = value.contentGuidanceDescription;
  return typeof description === 'string' && description.length > 0;
}

export function normaliseContentGuidanceEntries(
  value: SearchLessonSummary['contentGuidance'],
): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const descriptions = value
    .map((entry: unknown) =>
      isLessonContentGuidanceEntry(entry) ? entry.contentGuidanceDescription : null,
    )
    .filter(
      (description: string | null): description is string =>
        typeof description === 'string' && description.length > 0,
    );
  return descriptions.length > 0 ? descriptions : undefined;
}

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
  const canonicalUrl = summary.canonicalUrl;
  if (!canonicalUrl) {
    throw new Error(`Missing canonical URL for unit ${summary.unitSlug}`);
  }

  const lessonIds = summary.unitLessons?.map((lesson: UnitLesson) => lesson.lessonSlug) ?? [];
  const unitTopics = summary.categories?.map((category: UnitCategory) => category.categoryTitle);
  const years = normaliseYears(summary.year, summary.yearSlug);
  const sequenceIds = summary.threads
    ?.map((thread: UnitThread) => thread.slug)
    .filter(
      (slug: UnitThread['slug']): slug is string => typeof slug === 'string' && slug.length > 0,
    );

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
  const canonicalUrl = summary.canonicalUrl;
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

function extractLessonPlanningFields(summary: SearchLessonSummary): {
  lessonKeywords?: string[];
  keyLearningPoints?: string[];
  misconceptions?: string[];
  teacherTips?: string[];
  contentGuidance?: string[];
} {
  const lessonKeywords = summary.lessonKeywords?.map((item: LessonKeyword) => item.keyword);
  const keyLearningPoints = summary.keyLearningPoints?.map(
    (item: LessonKeyLearningPoint) => item.keyLearningPoint,
  );
  const misconceptions = summary.misconceptionsAndCommonMistakes?.map(
    (item: LessonMisconception) => `${item.misconception} → ${item.response}`,
  );
  const teacherTips = summary.teacherTips?.map((item: LessonTeacherTip) => item.teacherTip);
  const contentGuidance = normaliseContentGuidanceEntries(summary.contentGuidance);

  return {
    lessonKeywords,
    keyLearningPoints,
    misconceptions,
    teacherTips,
    contentGuidance,
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

  const lessonIds = summary.unitLessons?.map((lesson: UnitLesson) => lesson.lessonSlug) ?? [];
  const unitTopics = summary.categories?.map((category: UnitCategory) => category.categoryTitle);
  const years = normaliseYears(summary.year, summary.yearSlug);
  const sequenceIds = summary.threads
    ?.map((thread: UnitThread) => thread.slug)
    .filter(
      (slug: UnitThread['slug']): slug is string => typeof slug === 'string' && slug.length > 0,
    );

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
