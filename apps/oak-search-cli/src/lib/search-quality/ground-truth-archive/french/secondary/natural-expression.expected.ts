/**
 * Expected relevance for natural-expression ground truth.
 *
 * Query: "making French sentences negative KS3"
 * Tests vocabulary bridging: "making negative" → "negation" / "ne pas"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant (directly about making sentences negative)
 * - 2 = Relevant (negation in different grammatical contexts)
 */

import type { ExpectedRelevance } from '../../types';

export const FRENCH_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Title: "What isn't happening" - core introduction to negation
  'what-isnt-happening-ne-pas-negation': 3,
  // Title: "What people do and don't do" - using ne pas in context
  'what-people-do-and-dont-do-ne-pas-negation': 3,
  // Title: "What people are not going to do" - negation with future structures
  'what-people-are-not-going-to-do-negation-with-two-verb-structures': 2,
} as const;
