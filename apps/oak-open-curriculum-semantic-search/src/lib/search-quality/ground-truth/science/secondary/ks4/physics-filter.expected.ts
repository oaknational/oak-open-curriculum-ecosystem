/**
 * Expected relevance for KS4 Physics: radioactive decay half-life.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../../types';

export const SCIENCE_KS4_PHYSICS_FILTER_EXPECTED: ExpectedRelevance = {
  // Key learning: "Radioactive half-life is the time taken for half of a
  // radioactive isotope to decay"
  'radioactive-half-life': 3,
  // Related: nuclear decay equations
  'nuclear-decay-including-beta-plus': 2,
  // Related: activity calculations
  'activity-and-half-life-calculations': 2,
} as const;
