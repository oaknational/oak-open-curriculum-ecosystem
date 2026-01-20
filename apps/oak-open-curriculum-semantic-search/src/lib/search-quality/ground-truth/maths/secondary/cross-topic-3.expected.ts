/**
 * Expected relevance for cross-topic-3 ground truth.
 * Query: "ratio proportion percentage"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_SECONDARY_CROSS_TOPIC_3_EXPECTED: ExpectedRelevance = {
  'checking-and-securing-understanding-of-converting-between-ratios-percentages-and-fractions': 3,
  'problem-solving-with-percentages-and-proportionality': 2,
} as const;
