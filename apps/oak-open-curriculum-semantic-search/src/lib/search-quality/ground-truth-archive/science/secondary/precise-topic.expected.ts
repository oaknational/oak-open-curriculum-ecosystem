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

export const SCIENCE_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'animal-cell-structures-and-their-functions': 3,
  'plant-cell-structures-and-their-functions': 3,
  'specialised-cells-are-adapted-for-their-functions': 2,
  'multicellular-and-unicellular-organisms': 2,
} as const;
