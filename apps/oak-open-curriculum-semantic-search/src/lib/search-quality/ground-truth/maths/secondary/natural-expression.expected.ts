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

export const MATHS_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'solving-quadratic-equations-by-completing-the-square': 3,
  'solving-complex-quadratic-equations-by-completing-the-square': 3,
  'factorising-using-the-difference-of-two-squares': 2,
} as const;
