/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const DESIGN_TECHNOLOGY_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'testing-bridge-structures': 3,
  'shapes-and-materials-used-in-playground-structures': 3,
  'test-and-talk-about-the-final-playground-structure': 2,
} as const;
