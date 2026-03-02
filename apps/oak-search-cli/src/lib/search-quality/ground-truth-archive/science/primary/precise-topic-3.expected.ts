/**
 * Expected relevance for precise-topic-3 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_PRECISE_TOPIC_3_EXPECTED: ExpectedRelevance = {
  'properties-of-solids-liquids-and-gases': 3,
  'comparing-and-grouping-solids-liquids-and-gases': 3,
  'reversible-changes-of-state': 2,
  'changing-state-solid-to-liquid': 2,
} as const;
