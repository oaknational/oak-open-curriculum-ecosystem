/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const PHYSICAL_EDUCATION_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  // Query "PE athletics runing and jumping" (typo: runing)
  // Note: Typo recovery for "runing" -> "running" is poor (search quality issue)
  'running-for-speed-and-the-relationship-between-distance-and-time': 3,
  'jumping-for-distance': 3,
  'jumping-for-height': 3,
  'high-jump': 2, // Found by search, relevant to jumping
  'supporting-others-to-successfully-triple-jump': 2, // Found by search, relevant to jumping
} as const;
