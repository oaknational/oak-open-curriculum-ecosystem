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

export const GEOGRAPHY_PRIMARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'our-school': 3,
  'our-school-from-above': 2,
} as const;
