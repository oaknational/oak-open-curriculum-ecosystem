/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_PRIMARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  // Cross-faith founders - query tests GENERIC "religious founders and leaders"
  'prophet-muhammad-the-leader': 3, // Search #1 - directly about founder/leader
  'guru-nanak': 3, // Founder lesson - original expected
  'the-idea-of-a-buddha': 3, // Search #7, MY #2 - founder concept
  'guru-nanaks-teachings-on-equality-and-acceptance': 2, // Search #3 - teachings of founder
  'moses-and-the-exodus': 2, // MY #4 - major religious founder figure
} as const;
