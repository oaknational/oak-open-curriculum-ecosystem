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

export const COMPUTING_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'using-information-technology-safely': 3,
  'benefits-of-information-technology': 2,
} as const;
