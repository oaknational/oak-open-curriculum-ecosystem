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

export const PHYSICAL_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'design-your-programme': 3,
  'the-fitt-frequency-intensity-time-and-type-principle': 2,
  'setting-goals-for-training': 2,
} as const;
