/**
 * Keyword extraction from bulk download lesson data.
 *
 * @remarks
 * Extracts and deduplicates all `lessonKeywords` from lesson records,
 * tracking frequency, subject distribution, and first year of introduction.
 * Lessons are visited in deterministic `(lessonSlug, unitSlug)` order, so the
 * first-occurrence `definition` and the order of `definitions` are independent
 * of bulk-file enumeration order (the readdir is unsorted; the graph-corpus
 * determinism contract requires order-independent extraction).
 *
 * @example
 * ```ts
 * const keywords = extractKeywords(lessons);
 * console.log(keywords[0]); // { term: 'photosynthesis', definitions: [...], ... }
 * ```
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */
import type { Lesson } from '../../types/generated/bulk/index.js';

/** One definition of a keyword as lessons authored it, with those lessons. */
export interface ExtractedKeywordDefinition {
  /**
   * The term as authored (trimmed, case preserved); when lessons wrote this
   * definition with different capitals, the casing that sorts first by code unit
   */
  readonly term: string;
  /** The authored definition: whitespace collapsed, never blank, code-unit-first across capitals */
  readonly definition: string;
  /** The lessons that author this term and definition, sorted */
  readonly lessonSlugs: readonly string[];
}

/**
 * Extracted keyword with metadata from vocabulary mining.
 *
 * @remarks
 * Keywords are deduplicated by normalised form (lowercase, trimmed). The
 * `definition` is the first occurrence in `(lessonSlug, unitSlug)` order.
 */
export interface ExtractedKeyword {
  /** The vocabulary term (normalised: lowercase, trimmed) */
  readonly term: string;
  /** Definition from first occurrence */
  readonly definition: string;
  /**
   * Number of keyword occurrences across all lesson records. Can exceed the
   * unique-lesson count when a lesson repeats a keyword or appears in
   * multiple unit placements; `lessonSlugs` carries the unique lesson set.
   */
  readonly frequency: number;
  /** Unique subjects where this keyword is used */
  readonly subjects: readonly string[];
  /** Earliest year this keyword is introduced (derived from key stage) */
  readonly firstYear: number;
  /** All lesson slugs where this keyword appears */
  readonly lessonSlugs: readonly string[];
  /**
   * Every distinct authored definition with the lessons that author it, in
   * first-authoring order. Unlike `definition`, this keeps different
   * meanings apart: one term can mean different things in different lessons.
   */
  readonly definitions: readonly ExtractedKeywordDefinition[];
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
 * Normalises a keyword for deduplication and id minting.
 *
 * @remarks
 * The graph-corpus keyword node id is `keyword:<normalised-term>`; this
 * normalisation is deliberately lowercase + trim and nothing more (no
 * unicode folding the corpus has not warranted).
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
  /** Authored definitions keyed by their lower-cased text */
  definitions: Map<string, { term: string; definition: string; lessonSlugs: Set<string> }>;
}

/**
 * Records that a lesson authors this definition for the keyword.
 *
 * @remarks
 * Definitions compare case-insensitively with whitespace collapsed. Terms and
 * definitions that differ only in capitals merge, each keeping its
 * code-unit-first casing (independent of lesson order).
 */
function addDefinition(
  acc: KeywordAccumulator,
  term: string,
  authoredDefinition: string,
  lessonSlug: string,
): void {
  const definition = authoredDefinition.trim().replaceAll(/\s+/g, ' ');
  const key = definition.toLowerCase();
  const existing = acc.definitions.get(key);
  if (existing) {
    existing.lessonSlugs.add(lessonSlug);
    existing.term = term < existing.term ? term : existing.term;
    existing.definition = definition < existing.definition ? definition : existing.definition;
  } else {
    acc.definitions.set(key, { term, definition, lessonSlugs: new Set([lessonSlug]) });
  }
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
    definitions: new Map(),
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
    subjects: [...acc.subjects].sort((a, b) => a.localeCompare(b)),
    firstYear: acc.firstYear,
    lessonSlugs: [...acc.lessonSlugs].sort((a, b) => a.localeCompare(b)),
    definitions: [...acc.definitions.values()].map((authored) => ({
      term: authored.term,
      definition: authored.definition,
      lessonSlugs: [...authored.lessonSlugs].sort((a, b) => a.localeCompare(b)),
    })),
  };
}

/**
 * Extracts and deduplicates keywords from lesson data.
 *
 * @remarks
 * Lessons are visited in `(lessonSlug, unitSlug)` order so first-occurrence
 * fields are deterministic regardless of input order.
 *
 * @param lessons - Array of lessons to extract keywords from
 * @returns Deduplicated keywords with frequency, subject, and year metadata
 */
export function extractKeywords(lessons: readonly Lesson[]): readonly ExtractedKeyword[] {
  const keywordMap = new Map<string, KeywordAccumulator>();

  const ordered = [...lessons].sort(
    (a, b) => a.lessonSlug.localeCompare(b.lessonSlug) || a.unitSlug.localeCompare(b.unitSlug),
  );
  for (const lesson of ordered) {
    const lessonYear = getFirstYearForKeyStage(lesson.keyStageSlug);
    processLessonKeywords(lesson, lessonYear, keywordMap);
  }

  return buildSortedResults(keywordMap);
}

/**
 * Processes all keywords from a single lesson. An entry with a blank definition
 * is skipped whole, so every recorded placement carries a definition.
 */
function processLessonKeywords(
  lesson: Lesson,
  lessonYear: number,
  keywordMap: Map<string, KeywordAccumulator>,
): void {
  for (const kw of lesson.lessonKeywords.filter((entry) => entry.description.trim() !== '')) {
    const normalised = normaliseKeyword(kw.keyword);
    let acc = keywordMap.get(normalised);

    if (acc) {
      updateAccumulator(acc, lesson, lessonYear);
    } else {
      acc = createAccumulator(lesson, kw.description, lessonYear);
      keywordMap.set(normalised, acc);
    }
    addDefinition(acc, kw.keyword.trim(), kw.description, lesson.lessonSlug);
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
