/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const FRENCH_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'at-school-singular-er-verbs': 3,
  'family-activities-singular-regular-er-verbs': 3,
  'at-school-er-verbs-i-and-you': 2,
} as const;
