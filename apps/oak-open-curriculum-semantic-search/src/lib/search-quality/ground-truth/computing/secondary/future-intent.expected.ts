/**
 * Expected relevance for future-intent ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * NOTE: This query is in the future-intent category and is EXCLUDED from
 * aggregate statistics. These expected slugs represent the ideal results
 * once Level 4 intent classification is implemented.
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const COMPUTING_SECONDARY_FUTURE_INTENT_EXPECTED: ExpectedRelevance = {
  'writing-a-text-based-program': 3,
  'working-with-numerical-inputs': 2,
  'using-selection': 2,
} as const;
