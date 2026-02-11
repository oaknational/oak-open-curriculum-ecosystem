/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  // CORRECTED: Query is "places of worship and religious festivals"
  // Previous expected (guru-nanak teachings) was completely misaligned
  'the-celebration-of-holi': 3, // Search #1, MY #5 - festival
  'belonging-to-a-church': 3, // Search #4 - place of worship
  'the-jewish-festival-of-sukkot': 2, // Search #7, MY #2 - festival
  'harvest-festival-in-uk': 2, // Search #9, MY #1 - festival
  'belonging-to-a-mosque': 2, // MY #3 - place of worship
} as const;
