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

export const GEOGRAPHY_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'the-countries-and-capital-cities-of-the-uk': 3,
  'london-as-a-capital-city': 2,
} as const;
