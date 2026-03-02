/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const ENGLISH_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'engaging-with-the-bfg': 3,
  'engaging-with-the-opening-chapter-of-the-bfg': 3,
  'writing-the-opening-of-the-bfg-part-one': 2,
} as const;
