/**
 * Expected relevance for natural-expression-3 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_EXPECTED: ExpectedRelevance = {
  // Key Learning: "Thermal conductors can feel cold... Thermal insulators can feel warm"
  'thermal-conduction-and-insulation': 3,
  // Key Learning: "what we experience as 'heat' is particles in an object vibrating against our skin"
  'thermal-conductors': 3,
  // Related: explains insulation
  'thermal-insulators': 2,
  // About specific heat capacity
  'heating-different-substances': 2,
  // Foundational understanding
  'energy-and-temperature': 1,
} as const;
