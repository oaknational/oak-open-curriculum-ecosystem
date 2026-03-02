/**
 * Keyword extraction from bulk download lesson data.
 *
 * @remarks
 * Extracts and deduplicates all `lessonKeywords` from lesson records,
 * tracking frequency, subject distribution, and first year of introduction.
 *
 * @example
 * ```ts
 * const keywords = extractKeywords(lessons);
 * console.log(keywords[0]);
 * // { term: 'photosynthesis', definition: '...', frequency: 127, subjects: ['science'], ... }
 * ```
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */
import type { Lesson } from '../lib/index.js';

/**
 * Extracted keyword with metadata from vocabulary mining.
 *
 * @remarks
 * Keywords are deduplicated by normalised form (lowercase, trimmed).
 * The definition is taken from the first occurrence.
 */
export interface ExtractedKeyword {
  /** The vocabulary term (normalised: lowercase, trimmed) */
  readonly term: string;
  /** Definition from first occurrence */
  readonly definition: string;
  /** Number of lessons where this keyword appears */
  readonly frequency: number;
  /** Unique subjects where this keyword is used */
  readonly subjects: readonly string[];
  /** Earliest year this keyword is introduced (derived from key stage) */
  readonly firstYear: number;
  /** All lesson slugs where this keyword appears */
  readonly lessonSlugs: readonly string[];
}

/**
 * Maps key stage slugs to their starting year.
 * Fixed key set: ks1, ks2, ks3, ks4.
 */
const keyStageToFirstYear: Readonly<Record<string, number>> = {
  ks1: 1,
  ks2: 3,
  ks3: 7,
  ks4: 10,
};

/**
 * Gets the first year for a key stage slug.
 */
function getFirstYearForKeyStage(keyStageSlug: string): number {
  return keyStageToFirstYear[keyStageSlug] ?? 1;
}

/**
 * Normalises a keyword for deduplication.
 *
 * @param keyword - Raw keyword string
 * @returns Normalised form: lowercase, trimmed
 */
export function normaliseKeyword(keyword: string): string {
  return keyword.toLowerCase().trim();
}

/**
 * Internal accumulator for building keyword metadata.
 */
interface KeywordAccumulator {
  definition: string;
  frequency: number;
  subjects: Set<string>;
  firstYear: number;
  lessonSlugs: Set<string>;
}

/**
 * Updates an existing accumulator with new lesson data.
 */
function updateAccumulator(acc: KeywordAccumulator, lesson: Lesson, lessonYear: number): void {
  acc.frequency += 1;
  acc.subjects.add(lesson.subjectSlug);
  acc.lessonSlugs.add(lesson.lessonSlug);
  acc.firstYear = Math.min(acc.firstYear, lessonYear);
}

/**
 * Creates a new accumulator for a keyword's first occurrence.
 */
function createAccumulator(
  lesson: Lesson,
  definition: string,
  lessonYear: number,
): KeywordAccumulator {
  return {
    definition,
    frequency: 1,
    subjects: new Set([lesson.subjectSlug]),
    firstYear: lessonYear,
    lessonSlugs: new Set([lesson.lessonSlug]),
  };
}

/**
 * Converts an accumulator to an immutable ExtractedKeyword.
 */
function accumulatorToKeyword(term: string, acc: KeywordAccumulator): ExtractedKeyword {
  return {
    term,
    definition: acc.definition,
    frequency: acc.frequency,
    subjects: [...acc.subjects].sort(),
    firstYear: acc.firstYear,
    lessonSlugs: [...acc.lessonSlugs].sort(),
  };
}

/**
 * Extracts and deduplicates keywords from lesson data.
 *
 * @param lessons - Array of lessons to extract keywords from
 * @returns Deduplicated keywords with frequency, subject, and year metadata
 */
export function extractKeywords(lessons: readonly Lesson[]): readonly ExtractedKeyword[] {
  const keywordMap = new Map<string, KeywordAccumulator>();

  for (const lesson of lessons) {
    const lessonYear = getFirstYearForKeyStage(lesson.keyStageSlug);
    processLessonKeywords(lesson, lessonYear, keywordMap);
  }

  return buildSortedResults(keywordMap);
}

/**
 * Processes all keywords from a single lesson.
 */
function processLessonKeywords(
  lesson: Lesson,
  lessonYear: number,
  keywordMap: Map<string, KeywordAccumulator>,
): void {
  for (const kw of lesson.lessonKeywords) {
    const normalised = normaliseKeyword(kw.keyword);
    const existing = keywordMap.get(normalised);

    if (existing) {
      updateAccumulator(existing, lesson, lessonYear);
    } else {
      keywordMap.set(normalised, createAccumulator(lesson, kw.description, lessonYear));
    }
  }
}

/**
 * Converts accumulator map to sorted array of ExtractedKeyword.
 */
function buildSortedResults(keywordMap: Map<string, KeywordAccumulator>): ExtractedKeyword[] {
  const results: ExtractedKeyword[] = [];

  for (const [term, acc] of keywordMap) {
    results.push(accumulatorToKeyword(term, acc));
  }

  // Sort by frequency descending for easier analysis
  results.sort((a, b) => b.frequency - a.frequency);

  return results;
}
