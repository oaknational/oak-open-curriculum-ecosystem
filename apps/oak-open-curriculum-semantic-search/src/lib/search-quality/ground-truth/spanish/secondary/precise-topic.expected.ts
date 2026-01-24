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

export const SPANISH_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  // Phase 1B + Search discovery: Secondary AR verbs present tense lessons (max 5)
  'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 3, // AR verbs 1st/3rd person
  'a-big-adventure-ar-verbs-3rd-person-singular': 3, // AR verbs 3rd person singular
  'work-and-jobs-eres-and-sois-simple-present-ar-verbs': 2, // Search #1 - AR present
  'what-people-do-at-school-regular-verbs-3rd-person-present': 2, // Regular verbs present
  'en-paises-donde-se-habla-espanol-ar-present-tense-2nd-persons': 2, // AR present tense explicit
} as const;
