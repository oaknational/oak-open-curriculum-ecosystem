/**
 * Expected relevance for imprecise-input-3 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_IMPRECISE_INPUT_3_EXPECTED: ExpectedRelevance = {
  'evaporation-and-condensation-in-the-water-cycle': 3,
  'everyday-examples-of-evaporation-and-condensation-non-statutory': 3,
  'temperature-and-evaporation-do-and-review': 2,
  'changing-state-liquid-to-gas': 2,
} as const;
