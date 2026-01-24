/**
 * Expected relevance for natural-expression-3 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_NATURAL_EXPRESSION_3_EXPECTED: ExpectedRelevance = {
  // Key Learning: "Water is a solid (ice) at 0°C but becomes a liquid when it is heated"
  'changing-state-solid-to-liquid': 3,
  // Key Learning: "The melting temperature is the temperature at which a solid changes to a liquid"
  'melting-temperatures-plan': 3,
  // Practical investigation of melting temperatures
  'melting-temperatures-do-and-review': 3,
  // Key Learning: "Melting, freezing, evaporation and condensation are examples of reversible changes of state"
  'reversible-changes-of-state': 2,
  // Foundational understanding of states
  'properties-of-solids-liquids-and-gases': 2,
} as const;
