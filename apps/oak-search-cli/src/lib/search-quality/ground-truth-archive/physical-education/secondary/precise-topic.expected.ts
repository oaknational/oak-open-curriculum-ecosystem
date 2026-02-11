/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const PHYSICAL_EDUCATION_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  // Query "fitness training FITT principle intensity programme design"
  'the-fitt-principle': 3, // Direct FITT principle lesson
  'the-principles-of-training-and-their-application-to-a-personal-exercise-programme': 3,
  'the-fitt-frequency-intensity-time-and-type-principle': 3,
  'principles-of-training': 2,
} as const;
