/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  // CORRECTED: Query is GENERIC "religious beliefs and practices"
  // Previous expected was Buddhism-only - too narrow for generic query
  'possible-psychological-benefits-of-religion': 3, // Search #1 - about religion broadly
  'defining-religion': 3, // Search #2 - beliefs/practices concept
  'different-religious-views-about-freedom-of-religious-expression': 2, // Search #3 - practices
  'different-forms-of-worship': 2, // MY #1 - practices across faiths
  'the-six-beliefs-of-sunni-islam': 2, // MY #2 - beliefs focused
} as const;
