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

export const PHYSICAL_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'the-fitt-frequency-intensity-time-and-type-principle': 3,
  'training-with-intensity': 3,
  'design-your-programme': 2,
} as const;
