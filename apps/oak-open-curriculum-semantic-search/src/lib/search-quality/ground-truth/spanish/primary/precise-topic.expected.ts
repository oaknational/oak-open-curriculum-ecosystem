/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SPANISH_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'i-am-happy-the-verb-ser-soy-and-es': 3,
  'what-someone-else-is-like-soy-and-es': 2,
} as const;
