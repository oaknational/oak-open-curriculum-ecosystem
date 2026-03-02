/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SPANISH_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  // Phase 1B + Search: "spanish grammer conjugating verbs" - verb conjugation lessons (max 5)
  'what-people-do-at-school-regular-verbs-3rd-person-present': 3, // Explicit conjugation
  'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 3, // AR conjugation
  'a-big-adventure-ar-verbs-3rd-person-singular': 2, // AR conjugation
  'in-tenerife-er-and-ir-verbs-singular-persons': 2, // ER/IR conjugation (search #1)
  'in-tenerife-ar-verbs-singular-persons': 2, // AR conjugation (search #4)
} as const;
