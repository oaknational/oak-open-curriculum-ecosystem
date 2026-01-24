/**
 * Expected relevance for cross-topic-3 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_CROSS_TOPIC_3_EXPECTED: ExpectedRelevance = {
  'using-electromagets': 3,
  'an-electric-motor': 3,
  'applications-of-electromagnets': 2,
  'an-electromagnet': 2,
} as const;
