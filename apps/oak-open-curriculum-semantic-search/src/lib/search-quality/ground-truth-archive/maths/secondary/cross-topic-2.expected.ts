/**
 * Expected relevance for cross-topic-2 ground truth.
 * Query: "geometry proof coordinate"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_CROSS_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'geometric-proofs-with-vectors': 3,
  'writing-a-proof': 2,
  'problem-solving-with-functions-and-proof': 2,
} as const;
