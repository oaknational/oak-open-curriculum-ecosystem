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
  // Core thermal conductivity lessons
  'thermal-conductors': 3,
  'thermal-conduction-and-insulation': 3,
  // Related: insulators are the opposite of conductors
  'thermal-insulators': 2,
} as const;
