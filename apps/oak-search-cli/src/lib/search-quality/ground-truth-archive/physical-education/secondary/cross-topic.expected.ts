/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const PHYSICAL_EDUCATION_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  // Query "fitness and athletics together" - lessons combining fitness with sport/athletics
  'linking-sports-and-physical-activity-to-different-components-of-fitness': 3,
  'components-of-fitness-and-the-relative-importance-to-physical-activity-and-sport': 3,
  'the-importance-of-fitness-components-in-sport': 3,
  'the-relationship-between-health-fitness-exercise-and-performance': 2,
} as const;
