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

export const PHYSICAL_EDUCATION_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'dribbling-and-keeping-control': 3,
  'passing-and-receiving-skills': 2,
} as const;
