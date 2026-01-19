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

export const COMPUTING_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'writing-a-text-based-program': 3,
  'working-with-numerical-inputs': 2,
  'using-selection': 2,
} as const;
