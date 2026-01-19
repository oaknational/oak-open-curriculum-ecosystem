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

export const SPANISH_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'a-big-adventure-ar-verbs-3rd-person-singular': 3,
  'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
} as const;
