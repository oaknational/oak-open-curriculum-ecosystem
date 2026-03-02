/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const DESIGN_TECHNOLOGY_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'anthropometrics-and-ergonomics': 3,
  'ergonomic-testing-and-design-development': 2,
} as const;
