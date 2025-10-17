import type { SearchLessonSummary } from '../../types/oak';

export interface UnitLessonInfo {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
}

function safeArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

function safeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function pluckStrings(collection: unknown, key: string): string[] {
  const results: string[] = [];
  for (const entry of safeArray(collection)) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const raw: unknown = Reflect.get(entry, key);
    const value = safeString(raw);
    if (value) {
      results.push(value);
    }
  }
  return results;
}

function optionalStrings(values: string[]): string[] | undefined {
  return values.length > 0 ? values : undefined;
}

export function extractUnitLessons(value: unknown): UnitLessonInfo[] {
  const lessons: UnitLessonInfo[] = [];
  for (const entry of safeArray(value)) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const lessonSlug = safeString(Reflect.get(entry, 'lessonSlug'));
    const lessonTitle = safeString(Reflect.get(entry, 'lessonTitle'));
    if (!lessonSlug || !lessonTitle) {
      continue;
    }
    lessons.push({ lessonSlug, lessonTitle });
  }
  return lessons;
}

export function extractUnitTopics(value: unknown): string[] | undefined {
  return optionalStrings(pluckStrings(value, 'categoryTitle'));
}

export function extractSequenceIds(value: unknown): string[] | undefined {
  return optionalStrings(pluckStrings(value, 'slug'));
}

export function extractMisconceptions(value: unknown): string[] | undefined {
  const pairs: string[] = [];
  for (const entry of safeArray(value)) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const misconception = safeString(Reflect.get(entry, 'misconception'));
    const response = safeString(Reflect.get(entry, 'response'));
    if (!misconception || !response) {
      continue;
    }
    pairs.push(`${misconception} → ${response}`);
  }
  return pairs.length > 0 ? pairs : undefined;
}

export function normaliseContentGuidanceEntries(value: unknown): string[] | undefined {
  const descriptions: string[] = [];
  for (const entry of safeArray(value)) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const description = safeString(Reflect.get(entry, 'contentGuidanceDescription'));
    if (description) {
      descriptions.push(description);
    }
  }
  return descriptions.length > 0 ? descriptions : undefined;
}

export function extractLessonPlanningFields(summary: SearchLessonSummary): {
  lessonKeywords?: string[];
  keyLearningPoints?: string[];
  misconceptions?: string[];
  teacherTips?: string[];
  contentGuidance?: string[];
} {
  const lessonKeywords = optionalStrings(pluckStrings(summary.lessonKeywords, 'keyword'));
  const keyLearningPoints = optionalStrings(
    pluckStrings(summary.keyLearningPoints, 'keyLearningPoint'),
  );
  const misconceptions = extractMisconceptions(summary.misconceptionsAndCommonMistakes);
  const teacherTips = optionalStrings(pluckStrings(summary.teacherTips, 'teacherTip'));
  const contentGuidance = normaliseContentGuidanceEntries(summary.contentGuidance);

  return {
    lessonKeywords,
    keyLearningPoints,
    misconceptions,
    teacherTips,
    contentGuidance,
  };
}
