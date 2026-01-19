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
  'the-afterlife-resurrection': 3,
  'sin-and-salvation': 2,
} as const;
