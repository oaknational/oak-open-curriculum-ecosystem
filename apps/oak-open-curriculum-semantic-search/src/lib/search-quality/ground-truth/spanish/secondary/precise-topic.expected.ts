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
  'a-big-adventure-ar-verbs-3rd-person-singular': 3,
  'a-school-play-ar-verbs-2nd-person-singular-information-questions': 2,
  'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
  'homework-disaster-ar-infinitives-and-3rd-person-singular': 1,
} as const;
