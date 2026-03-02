/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const GEOGRAPHY_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  earthquakes: 3,
  'plate-boundaries': 3,
  'global-distribution-of-earthquakes-and-volcanoes': 2,
} as const;
