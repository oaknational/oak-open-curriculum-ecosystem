/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SPANISH_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  // Lessons about adjective agreement (for misspelled "spansh adjective agreemnt")
  'hair-and-eyes-singular-and-plural-agreement-of-adjectives': 3, // Explicit adjective agreement
  'how-someone-is-today-singular-regular-adjective-agreement': 3, // Singular adjective agreement
  'at-the-zoo-adjective-agreement': 3, // Adjective agreement
  'a-party-adjectives-after-the-noun': 2, // Adjective placement and forms
  'a-party-intonation-questions-nouns-and-adjectives': 2, // Nouns and adjectives
} as const;
