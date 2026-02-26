/**
 * Curriculum phrase detection for search query preprocessing.
 *
 * Detects multi-word curriculum terms in queries to enable phrase-level
 * boosting. ES synonym filters apply after tokenization, so phrase synonyms
 * cannot expand via that path. Phrase detection provides a complementary
 * mechanism for boosting documents that contain exact multi-word matches.
 *
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md` Phase B.5
 */

import { buildPhraseVocabulary } from '@oaknational/sdk-codegen/synonyms';

/**
 * Precompiled phrase vocabulary for efficient detection.
 * Loaded once at module initialisation.
 */
const PHRASE_VOCABULARY: ReadonlySet<string> = buildPhraseVocabulary();

/**
 * Phrases sorted by length (longest first) for greedy matching.
 * This ensures "completing the square" matches before "the square".
 */
const PHRASES_BY_LENGTH: readonly string[] = [...PHRASE_VOCABULARY].sort(
  (a, b) => b.length - a.length,
);

/** Detected phrase with its position in the query. */
interface DetectedPhrase {
  readonly phrase: string;
  readonly index: number;
}

/** Checks if a character represents a word boundary (space or undefined). */
function isWordBoundary(char: string | undefined): boolean {
  return char === undefined || char === ' ';
}

/** Checks if phrase at given index has valid word boundaries. */
function hasWordBoundaries(query: string, index: number, phraseLength: number): boolean {
  const beforeChar = index > 0 ? query[index - 1] : undefined;
  const afterIndex = index + phraseLength;
  const afterChar = afterIndex < query.length ? query[afterIndex] : undefined;
  return isWordBoundary(beforeChar) && isWordBoundary(afterChar);
}

/** Finds a phrase in the query if it has valid word boundaries. */
function findPhraseWithBoundary(query: string, phrase: string): DetectedPhrase | undefined {
  const index = query.indexOf(phrase);
  if (index === -1) {
    return undefined;
  }
  if (!hasWordBoundaries(query, index, phrase.length)) {
    return undefined;
  }
  return { phrase, index };
}

/** Removes duplicates from detected phrases while preserving order. */
function deduplicatePhrases(detected: readonly DetectedPhrase[]): readonly string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const { phrase } of detected) {
    if (!seen.has(phrase)) {
      seen.add(phrase);
      result.push(phrase);
    }
  }
  return result;
}

/**
 * Detects multi-word curriculum phrases in a search query.
 *
 * Scans the query for known multi-word curriculum terms from the SDK synonym
 * vocabulary. These phrases require `match_phrase` boosting because ES synonym
 * filters apply after tokenization, breaking phrase-level matching.
 *
 * **Pure function**: No side effects, deterministic output.
 *
 * @param query - The preprocessed search query (after noise removal)
 * @returns Array of detected phrases, lowercased, in order of appearance
 *
 * @example
 * ```typescript
 * detectCurriculumPhrases('straight line equations')
 * // Returns: ['straight line']
 *
 * detectCurriculumPhrases('completing the square quadratics')
 * // Returns: ['completing the square']
 * ```
 *
 * @see {@link buildPhraseVocabulary} for vocabulary source
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md` Phase B.5
 */
export function detectCurriculumPhrases(query: string): readonly string[] {
  if (query.length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const detected: DetectedPhrase[] = [];

  // Greedy matching: try longest phrases first to avoid partial matches
  for (const phrase of PHRASES_BY_LENGTH) {
    const match = findPhraseWithBoundary(lowerQuery, phrase);
    if (match) {
      detected.push(match);
    }
  }

  // Sort by appearance order and deduplicate
  detected.sort((a, b) => a.index - b.index);
  return deduplicatePhrases(detected);
}
