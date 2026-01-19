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

export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'the-common-processes-of-all-living-organisms': 3,
  'cellular-respiration': 2,
} as const;
