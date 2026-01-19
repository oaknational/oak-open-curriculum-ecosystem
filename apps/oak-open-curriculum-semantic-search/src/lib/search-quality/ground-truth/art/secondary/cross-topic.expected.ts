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

export const ART_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'exploring-portraits-through-paint': 3,
  'exploring-power-in-the-portrait': 2,
} as const;
