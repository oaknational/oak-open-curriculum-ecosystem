/**
 * Expected relevance for imprecise-input-3 ground truth.
 * Query: "adding frations togethr" (misspellings)
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_IMPRECISE_INPUT_3_EXPECTED: ExpectedRelevance = {
  'add-fractions-with-the-same-denominator': 3,
  'add-fractions-with-the-same-denominator-and-generalise-the-rule': 3,
  'add-on-fractions-with-the-same-denominator': 3,
  'explain-how-to-add-related-unit-fractions-with-a-representation-or-image': 2,
  'add-and-subtract-non-related-fractions-with-different-denominators': 2,
} as const;
