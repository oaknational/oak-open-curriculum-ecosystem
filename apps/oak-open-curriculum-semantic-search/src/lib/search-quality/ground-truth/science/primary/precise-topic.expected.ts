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

export const SCIENCE_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'charles-darwin-and-finches': 3,
  'evolution-evidence': 3,
  'the-survival-of-the-fittest': 2,
  'how-living-things-have-changed-over-time': 2,
} as const;
