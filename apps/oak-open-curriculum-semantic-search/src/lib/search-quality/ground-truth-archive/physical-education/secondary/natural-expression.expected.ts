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

export const PHYSICAL_EDUCATION_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Query "getting fit exercise programme" - lessons about fitness/exercise programmes
  'promotion-of-personal-health': 3,
  'non-examined-assessment-writing-your-personal-exercise-programme': 3,
  'the-principles-of-training-and-their-application-to-a-personal-exercise-programme': 3,
  'long-term-effects-of-exercise': 2,
} as const;
