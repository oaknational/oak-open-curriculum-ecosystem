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

export const PHYSICAL_EDUCATION_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'orientating-a-map-to-locate-points': 3,
  'collaborate-effectively-to-complete-a-timed-course': 2,
} as const;
