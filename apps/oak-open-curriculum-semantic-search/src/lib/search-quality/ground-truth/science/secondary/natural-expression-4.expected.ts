/**
 * Expected relevance for natural-expression-4 ground truth.
 *
 * Query: "why does metal feel colder than wood at the same temperature"
 * This is a classic physics demonstration about thermal conductivity.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_EXPECTED: ExpectedRelevance = {
  // Key learning: "Thermal conductors can feel cold because they transfer
  // energy quickly away from their surface."
  'thermal-conduction-and-insulation': 3,
  // Related: heating and energy transfer through materials
  'heating-different-substances': 2,
  // Related: heat capacity and energy transfer
  'calculating-specific-heat-capacity-e-equals-m-c': 2,
} as const;
