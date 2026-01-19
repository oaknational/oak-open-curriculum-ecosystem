/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const PHYSICAL_EDUCATION_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'design-your-programme': 3,
  'running-for-speed-and-the-relationship-between-distance-and-time': 2,
} as const;
