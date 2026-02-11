/**
 * Expected relevance for precise-topic-3 ground truth.
 * Query: "equivalent fractions same value"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_3_EXPECTED: ExpectedRelevance = {
  'use-the-language-of-equivalent-fractions-correctly': 3,
  'explain-the-relationship-between-numerators-and-denominators-in-equivalent-fractions': 3,
  'explain-the-relationship-within-families-of-equivalent-fractions': 3,
  'use-understanding-of-equivalent-fractions-to-solve-problems': 2,
  'explain-how-to-compare-non-related-fractions-finding-equivalent-fractions-with-common-denominators': 2,
} as const;
