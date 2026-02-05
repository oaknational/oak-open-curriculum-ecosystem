/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MUSIC_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'the-role-of-the-kick-and-snare-in-drum-grooves': 3,
  'creating-variation-to-a-fundamental-drum-groove': 2,
} as const;
