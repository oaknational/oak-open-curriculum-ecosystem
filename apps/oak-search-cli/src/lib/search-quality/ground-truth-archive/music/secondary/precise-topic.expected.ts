/**
 * Expected relevance for precise-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const MUSIC_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'the-role-of-the-kick-and-snare-in-drum-grooves': 3,
  'creating-variation-to-a-fundamental-drum-groove': 3,
  'the-role-of-the-hi-hat-in-a-drum-groove': 2,
} as const;
