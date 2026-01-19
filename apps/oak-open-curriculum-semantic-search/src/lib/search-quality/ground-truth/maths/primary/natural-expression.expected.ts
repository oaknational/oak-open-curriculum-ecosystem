/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'subtracting-to-and-from-10': 3,
  'subtracting-numbers-that-bridge-through-10': 3,
  'subtracting-small-numbers': 2,
} as const;
