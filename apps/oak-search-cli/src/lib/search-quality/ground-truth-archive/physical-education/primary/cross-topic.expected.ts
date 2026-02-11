/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const PHYSICAL_EDUCATION_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  // Query "maps and teamwork outdoor activities" - lessons combining BOTH concepts
  'introduce-maps-working-together': 3, // Perfect title match: maps + working together
  'using-a-map-to-follow-a-route': 3,
  'collaborate-effectively-to-complete-a-timed-course': 3,
  'orientating-a-map-to-locate-points': 2,
} as const;
