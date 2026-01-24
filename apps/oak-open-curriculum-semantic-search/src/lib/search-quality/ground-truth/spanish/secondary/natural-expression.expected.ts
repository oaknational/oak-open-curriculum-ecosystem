/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SPANISH_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Phase 1B + Search: "verb endings" covers AR, ER, and IR verb types (max 5)
  'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 3, // AR verb endings
  'a-big-adventure-ar-verbs-3rd-person-singular': 3, // AR verb endings
  'free-time-activities-er-and-ir-verbs-2nd-person-singular': 2, // ER/IR verb endings (search #1)
  'in-tenerife-er-and-ir-verbs-singular-persons': 2, // ER/IR verb endings
  'homework-disaster-ar-infinitives-and-3rd-person-singular': 2, // AR infinitives and endings
} as const;
