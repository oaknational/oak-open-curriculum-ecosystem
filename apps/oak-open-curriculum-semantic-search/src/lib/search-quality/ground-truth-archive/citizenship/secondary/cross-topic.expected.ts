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

export const CITIZENSHIP_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'what-does-it-mean-to-live-in-a-democracy': 3,
  'what-are-rights-and-where-do-they-come-from': 3,
  'what-is-the-right-to-protest-within-a-democracy-with-the-rule-of-law': 2,
} as const;
