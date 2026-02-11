/**
 * Expected relevance for natural-expression-3 ground truth.
 * Query: "splitting numbers into parts"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_NATURAL_EXPRESSION_3_EXPECTED: ExpectedRelevance = {
  'explain-that-a-whole-can-be-split-into-parts': 3,
  'use-a-part-whole-model-to-represent-a-whole-partitioned-into-two-parts': 3,
  'identify-a-missing-part-when-a-whole-is-partitioned-into-two-parts': 3,
  'partition-a-whole-into-two-parts-and-express-as-a-subtraction-equation': 2,
  'use-a-part-whole-model-to-represent-a-whole-partitioned-into-more-than-two-parts': 2,
} as const;
