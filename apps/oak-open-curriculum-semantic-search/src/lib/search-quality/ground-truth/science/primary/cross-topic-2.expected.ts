/**
 * Expected relevance for cross-topic-2 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_CROSS_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'plants-without-light': 3,
  'what-plants-need-to-grow-and-stay-healthy': 3,
  'plant-health-and-growth': 2,
  'light-and-seeing': 2,
} as const;
