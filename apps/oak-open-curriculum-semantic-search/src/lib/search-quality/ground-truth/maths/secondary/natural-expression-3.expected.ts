/**
 * Expected relevance for natural-expression-3 ground truth.
 * Query: "how steep is the line"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_NATURAL_EXPRESSION_3_EXPECTED: ExpectedRelevance = {
  'positive-rate-of-change-from-a-graph': 3,
  'negative-rate-of-change-from-a-graph': 3,
  'rate-of-change-from-a-coordinate-pair': 3,
  'estimating-the-gradient-of-a-curve': 2,
  'improving-the-estimate-of-the-gradient-of-a-curve': 2,
} as const;
