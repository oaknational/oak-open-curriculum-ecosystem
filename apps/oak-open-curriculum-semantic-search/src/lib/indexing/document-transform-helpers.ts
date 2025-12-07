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

export function extractUnitTopics(value: unknown): string[] | undefined {
  return optionalStrings(pluckStrings(value, 'categoryTitle'));
}

export function extractSequenceIds(value: unknown): string[] | undefined {
  return optionalStrings(pluckStrings(value, 'slug'));
}

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

export function extractLessonPlanningFields(summary: unknown): {
  lessonKeywords?: string[];
  keyLearningPoints?: string[];
  misconceptions?: string[];
  teacherTips?: string[];
  contentGuidance?: string[];
} {
  const record = ensureRecord(summary, 'lesson summary');
  const lessonKeywords = optionalStrings(
    pluckStrings(readUnknownField(record, 'lessonKeywords'), 'keyword'),
  );
  const keyLearningPoints = optionalStrings(
    pluckStrings(readUnknownField(record, 'keyLearningPoints'), 'keyLearningPoint'),
  );
  const misconceptions = extractMisconceptions(
    readUnknownField(record, 'misconceptionsAndCommonMistakes'),
  );
  const teacherTips = optionalStrings(
    pluckStrings(readUnknownField(record, 'teacherTips'), 'teacherTip'),
  );
  const contentGuidance = normaliseContentGuidanceEntries(
    readUnknownField(record, 'contentGuidance'),
  );

  return {
    lessonKeywords,
    keyLearningPoints,
    misconceptions,
    teacherTips,
    contentGuidance,
  };
}

export interface UnitSummaryIdentifiers {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly canonicalUrl: string;
}

export function resolveUnitSummaryIdentifiers(summary: unknown): UnitSummaryIdentifiers {
  const record = ensureRecord(summary, 'unit summary');
  const unitSlug = requireStringField(record, 'unitSlug', 'unit summary slug');
  const unitTitle = requireStringField(record, 'unitTitle', `unit summary ${unitSlug} title`);
  const canonicalUrl = requireStringField(
    record,
    'canonicalUrl',
    `canonical URL for unit ${unitSlug}`,
  );
  return { unitSlug, unitTitle, canonicalUrl };
}

export interface LessonSummaryIdentifiers {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly canonicalUrl: string;
}

export function resolveLessonSummaryIdentifiers(summary: unknown): LessonSummaryIdentifiers {
  const record = ensureRecord(summary, 'lesson summary');
  const unitSlug = requireStringField(record, 'unitSlug', 'lesson summary unit slug');
  const unitTitle = requireStringField(
    record,
    'unitTitle',
    `lesson summary ${unitSlug} unit title`,
  );
  const canonicalUrl = requireStringField(
    record,
    'canonicalUrl',
    `canonical URL for lesson in unit ${unitSlug}`,
  );
  return { unitSlug, unitTitle, canonicalUrl };
}

export function readUnitSummaryValue(summary: unknown, key: string): unknown {
  return readUnknownField(ensureRecord(summary, 'unit summary'), key);
}

export function readLessonSummaryValue(summary: unknown, key: string): unknown {
  return readUnknownField(ensureRecord(summary, 'lesson summary'), key);
}

export function readUnitSummaryString(summary: unknown, key: string): string | undefined {
  return safeString(readUnitSummaryValue(summary, key));
}

export function expectUnitSummaryString(summary: unknown, key: string, context: string): string {
  const value = readUnitSummaryString(summary, key);
  if (!value) {
    throw new Error(`Missing ${context}`);
  }
  return value;
}

export function readLessonSummaryString(summary: unknown, key: string): string | undefined {
  return safeString(readLessonSummaryValue(summary, key));
}

export function expectLessonSummaryString(summary: unknown, key: string, context: string): string {
  const value = readLessonSummaryString(summary, key);
  if (!value) {
    throw new Error(`Missing ${context}`);
  }
  return value;
}

// Re-export programme factor extractors from dedicated module
export { extractTier, extractExamBoard, extractPathway } from './programme-factor-extractors';

/**
 * Extracts all fields from lesson summary for document creation.
 * Helper to keep createLessonDocument under max-lines-per-function limit.
 */
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

/**
 * Extracts all fields from unit summary for rollup document creation.
 * Helper to keep createRollupDocument under max-lines-per-function limit.
 *
 * Note: Imports normaliseYears from document-transforms to avoid circular dependency.
 */
export function extractRollupDocumentFields(
  summary: unknown,
  normaliseYears: (year: unknown, yearSlug: unknown) => string[] | undefined,
) {
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
  const tier = extractTier(summary);
  const examBoard = extractExamBoard(summary);

  return {
    unitSlug,
    unitTitle,
    canonicalUrl,
    lessonIds,
    unitTopics,
    years,
    sequenceIds,
    tier,
    examBoard,
  };
}
