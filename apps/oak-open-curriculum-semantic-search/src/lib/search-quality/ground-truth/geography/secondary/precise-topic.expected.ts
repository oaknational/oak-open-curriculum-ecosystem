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

export const GEOGRAPHY_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'the-movement-of-tectonic-plates': 2,
  'plate-boundaries': 2,
  'the-effects-of-earthquakes': 1,
} as const;
