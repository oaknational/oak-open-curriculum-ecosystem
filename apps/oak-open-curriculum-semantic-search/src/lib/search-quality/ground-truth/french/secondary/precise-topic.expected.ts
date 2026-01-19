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

export const FRENCH_SECONDARY_PRECISE_TOPIC_EXPECTED: ExpectedRelevance = {
  'what-isnt-happening-ne-pas-negation': 3,
  'what-people-do-and-dont-do-ne-pas-negation': 2,
  'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 2,
  'what-isnt-there-negation-before-a-noun-with-il-y-a': 1,
} as const;
