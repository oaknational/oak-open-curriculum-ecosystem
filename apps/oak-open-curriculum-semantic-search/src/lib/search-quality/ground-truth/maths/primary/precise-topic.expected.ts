/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'partition-two-digit-numbers-into-tens-and-ones-using-place-value-resources': 3,
  'partition-two-digit-numbers-into-tens-and-ones': 3,
  'explain-that-one-ten-is-equivalent-to-ten-ones': 2,
} as const;
