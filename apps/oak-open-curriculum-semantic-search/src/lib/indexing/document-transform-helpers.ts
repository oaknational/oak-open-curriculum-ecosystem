/** Document transformation helpers for ES indexing. @module document-transform-helpers */
import { extractTier, extractExamBoard, extractPathway } from './programme-factor-extractors';
import {
  isUnknownObject,
  ensureRecord,
  safeArray,
  safeString,
  pluckStrings,
  optionalStrings,
  readUnknownField,
} from './extraction-primitives';
import {
  extractThreadInfo,
  extractPedagogicalData,
  createEnrichedRollupText,
  type ThreadInfo,
  type PedagogicalData,
} from './thread-and-pedagogical-extractors';
import {
  resolveUnitSummaryIdentifiers,
  resolveLessonSummaryIdentifiers,
  readUnitSummaryValue,
  readLessonSummaryValue,
  readUnitSummaryString,
  readLessonSummaryString,
  expectUnitSummaryString,
  expectLessonSummaryString,
  type UnitSummaryIdentifiers,
  type LessonSummaryIdentifiers,
} from './summary-reader-helpers';

// Re-export programme factor extractors
export { extractTier, extractExamBoard, extractPathway };

// Re-export thread and pedagogical extractors
export {
  extractThreadInfo,
  extractPedagogicalData,
  createEnrichedRollupText,
  type ThreadInfo,
  type PedagogicalData,
};

// Re-export summary reader helpers
export {
  resolveUnitSummaryIdentifiers,
  resolveLessonSummaryIdentifiers,
  readUnitSummaryValue,
  readLessonSummaryValue,
  readUnitSummaryString,
  readLessonSummaryString,
  expectUnitSummaryString,
  expectLessonSummaryString,
  type UnitSummaryIdentifiers,
  type LessonSummaryIdentifiers,
};

export interface UnitLessonInfo {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
}

type UnknownObject = Readonly<Record<string, unknown>>; // eslint-disable-line @typescript-eslint/no-restricted-types -- REFACTOR

function isUnknownObject(value: unknown): value is UnknownObject {
  return typeof value === 'object' && value !== null;
}

function ensureRecord(value: unknown, context: string): UnknownObject {
  if (!isUnknownObject(value)) {
    throw new Error(`Invalid ${context}: expected an object`);
  }
  return value;
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
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
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

function readUnknownField(record: UnknownObject, key: string): unknown {
  return record[key];
}

function requireStringField(record: UnknownObject, key: string, context: string): string {
  const value = safeString(readUnknownField(record, key));
  if (!value) {
    throw new Error(`Missing ${context}`);
  }
  return value;
}

/** Extracts lesson info from unit lessons array. */
export function extractUnitLessons(value: unknown): UnitLessonInfo[] {
  const lessons: UnitLessonInfo[] = [];
  for (const entry of safeArray(value)) {
    if (!isUnknownObject(entry)) {
      continue;
    }
    const lessonSlug = safeString(entry.lessonSlug);
    const lessonTitle = safeString(entry.lessonTitle);
    if (!lessonSlug || !lessonTitle) {
      continue;
    }
    lessons.push({ lessonSlug, lessonTitle });
  }
  return lessons;
}

/** Extracts unit topics from categories. */
export function extractUnitTopics(value: unknown): string[] | undefined {
  return optionalStrings(pluckStrings(value, 'categoryTitle'));
}

/** Extracts sequence IDs from threads. */
export function extractSequenceIds(value: unknown): string[] | undefined {
  return optionalStrings(pluckStrings(value, 'slug'));
}

/** Extracts misconception pairs. */
export function extractMisconceptions(value: unknown): string[] | undefined {
  const pairs: string[] = [];
  for (const entry of safeArray(value)) {
    if (!isUnknownObject(entry)) {
      continue;
    }
    const misconception = safeString(entry.misconception);
    const response = safeString(entry.response);
    if (!misconception || !response) {
      continue;
    }
    pairs.push(`${misconception} → ${response}`);
  }
  return pairs.length > 0 ? pairs : undefined;
}

/** Extracts content guidance descriptions. */
export function normaliseContentGuidanceEntries(value: unknown): string[] | undefined {
  const descriptions: string[] = [];
  for (const entry of safeArray(value)) {
    if (!isUnknownObject(entry)) {
      continue;
    }
    const description = safeString(entry.contentGuidanceDescription);
    if (description) {
      descriptions.push(description);
    }
  }
  return descriptions.length > 0 ? descriptions : undefined;
}

/** Extracts lesson planning fields from summary. */
export function extractLessonPlanningFields(summary: unknown): {
  lessonKeywords?: string[];
  keyLearningPoints?: string[];
  misconceptions?: string[];
  teacherTips?: string[];
  contentGuidance?: string[];
} {
  const record = ensureRecord(summary, 'lesson summary');
  return {
    lessonKeywords: optionalStrings(
      pluckStrings(readUnknownField(record, 'lessonKeywords'), 'keyword'),
    ),
    keyLearningPoints: optionalStrings(
      pluckStrings(readUnknownField(record, 'keyLearningPoints'), 'keyLearningPoint'),
    ),
    misconceptions: extractMisconceptions(
      readUnknownField(record, 'misconceptionsAndCommonMistakes'),
    ),
    teacherTips: optionalStrings(
      pluckStrings(readUnknownField(record, 'teacherTips'), 'teacherTip'),
    ),
    contentGuidance: normaliseContentGuidanceEntries(readUnknownField(record, 'contentGuidance')),
  };
}

/** Extracts all fields from lesson summary for document creation. */
export function extractLessonDocumentFields(summary: unknown) {
  const { unitSlug, unitTitle, canonicalUrl } = resolveLessonSummaryIdentifiers(summary);
  const { lessonKeywords, keyLearningPoints, misconceptions, teacherTips, contentGuidance } =
    extractLessonPlanningFields(summary);
  const tier = extractTier(summary);
  const examBoard = extractExamBoard(summary);
  const pathway = extractPathway(summary);

  return {
    unitSlug,
    unitTitle,
    canonicalUrl,
    lessonKeywords,
    keyLearningPoints,
    misconceptions,
    teacherTips,
    contentGuidance,
    tier,
    examBoard,
    pathway,
  };
}

/** Extracts all fields from unit summary for rollup document creation. */
export function extractRollupDocumentFields(
  summary: unknown,
  normaliseYears: (year: unknown, yearSlug: unknown) => string[] | undefined,
) {
  const { unitSlug, unitTitle, canonicalUrl } = resolveUnitSummaryIdentifiers(summary);
  const rollupLessons = extractUnitLessons(readUnitSummaryValue(summary, 'unitLessons'));
  const lessonIds = rollupLessons.map((lesson) => lesson.lessonSlug);
  const unitTopics = extractUnitTopics(readUnitSummaryValue(summary, 'categories'));
  const years = normaliseYears(
    readUnitSummaryValue(summary, 'year'),
    readUnitSummaryValue(summary, 'yearSlug'),
  );
  const sequenceIds = extractSequenceIds(readUnitSummaryValue(summary, 'threads'));
  const threadInfo = extractThreadInfo(readUnitSummaryValue(summary, 'threads'));
  const tier = extractTier(summary);
  const examBoard = extractExamBoard(summary);
  const pathway = extractPathway(summary);

  return {
    unitSlug,
    unitTitle,
    canonicalUrl,
    lessonIds,
    unitTopics,
    years,
    sequenceIds,
    threadSlugs: threadInfo.slugs,
    threadTitles: threadInfo.titles,
    threadOrders: threadInfo.orders,
    tier,
    examBoard,
    pathway,
  };
}
