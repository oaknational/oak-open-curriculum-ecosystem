/**
 * Curriculum phrase detection for search query preprocessing.
 *
 * Detects multi-word curriculum terms in queries to enable phrase-level
 * boosting. Phrase detection provides a complementary mechanism to ES
 * synonym expansion for multi-word terms.
 *
 * @packageDocumentation
 */

import { buildPhraseVocabulary } from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

/** Precompiled phrase vocabulary, loaded once at module initialisation. */
const PHRASE_VOCABULARY: ReadonlySet<string> = buildPhraseVocabulary();

/** Phrases sorted by length (longest first) for greedy matching. */
const PHRASES_BY_LENGTH: readonly string[] = [...PHRASE_VOCABULARY].sort(
  (a, b) => b.length - a.length,
);

/** Detected phrase with its position in the query. */
interface DetectedPhrase {
  readonly phrase: string;
  readonly index: number;
}

/** Check if a character represents a word boundary. */
function isWordBoundary(char: string | undefined): boolean {
  return char === undefined || char === ' ';
}

/** Check if phrase at given index has valid word boundaries. */
function hasWordBoundaries(query: string, index: number, phraseLength: number): boolean {
  const beforeChar = index > 0 ? query[index - 1] : undefined;
  const afterIndex = index + phraseLength;
  const afterChar = afterIndex < query.length ? query[afterIndex] : undefined;
  return isWordBoundary(beforeChar) && isWordBoundary(afterChar);
}

/** Find a phrase in the query if it has valid word boundaries. */
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

/** Remove duplicates from detected phrases while preserving order. */
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
 * Detect multi-word curriculum phrases in a search query.
 *
 * @param query - The preprocessed search query (after noise removal)
 * @returns Array of detected phrases, lowercased, in order of appearance
 */
export function detectCurriculumPhrases(query: string): readonly string[] {
  if (query.length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const detected: DetectedPhrase[] = [];

  for (const phrase of PHRASES_BY_LENGTH) {
    const match = findPhraseWithBoundary(lowerQuery, phrase);
    if (match) {
      detected.push(match);
    }
  }

  detected.sort((a, b) => a.index - b.index);
  return deduplicatePhrases(detected);
}
