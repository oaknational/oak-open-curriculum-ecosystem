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

export const RELIGIOUS_EDUCATION_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  // CORRECTED: Query is "sacred texts and ethical teachings"
  // Previous expected (afterlife/salvation) was misaligned with query intent
  'ten-commandments': 3, // MY #1 - sacred text + ethical teaching
  'two-great-commandments': 3, // MY #2 - sacred text + ethical teaching
  'situation-ethics-of-jesus': 2, // Search #5 - Jesus ethics
  'worship-using-the-bible': 2, // Sacred text use
  'dhamma-moral-precepts': 2, // Buddhist ethical precepts from text
} as const;
