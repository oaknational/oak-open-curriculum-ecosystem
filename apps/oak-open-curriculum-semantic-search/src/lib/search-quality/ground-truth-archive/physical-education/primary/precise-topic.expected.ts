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

export const PHYSICAL_EDUCATION_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  // Hand dribbling lessons - explicitly about dribbling
  'dribbling-with-hands': 3,
  'dribbling-and-keeping-possession-using-our-hands': 3,
  // Feet dribbling lessons (query "dribbling ball skills" is generic, not hands-only)
  'develop-moving-with-the-ball-using-our-feet-dribbling': 3,
  'moving-with-a-ball-using-our-feet': 2, // About moving with ball, less explicitly about dribbling
} as const;
