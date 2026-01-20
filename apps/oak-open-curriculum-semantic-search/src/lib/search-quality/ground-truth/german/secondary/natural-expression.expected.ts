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

export const GERMAN_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Score 3: Explicitly teaches "verb endings" - "Singular present tense weak verb endings are..."
  'famous-german-speakers-present-tense-weak-verbs-singular-persons': 3,
  // Score 3: Key learning explicitly mentions "endings -e, -st or -t"
  'activities-at-home-verb-infinitives-and-singular-persons': 3,
  // Score 2: Teaches verb ending rules
  'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 2,
} as const;
