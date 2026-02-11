/**
 * Expected relevance for natural-expression-2 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_NATURAL_EXPRESSION_2_EXPECTED: ExpectedRelevance = {
  // Key Learning: "Gravity is an invisible pulling force that makes unsupported objects fall towards Earth"
  'introduction-to-gravity': 3,
  // Key Learning: "A force meter works by stretching a spring – as the downward force due to gravity increases"
  'pushes-and-pulls': 2,
  // Key Learning: "Air resistance is a force caused by air moving against the surface of an object"
  'air-resistance-plan': 2,
  // Practical investigation of falling objects (parachutes)
  'air-resistance-do-and-review': 2,
} as const;
