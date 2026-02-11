/**
 * Expected relevance for KS4 Biology: carbon cycle in ecosystems.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../../types';

export const SCIENCE_KS4_BIOLOGY_FILTER_EXPECTED: ExpectedRelevance = {
  // KS4 Biology: "The carbon cycle shows how carbon is recycled between organisms and the atmosphere"
  'material-cycles-the-carbon-cycle': 3,
  // KS3: Comprehensive carbon cycle explanation including photosynthesis, respiration, decomposition
  'the-carbon-cycle': 3,
  // Key Learning: "Decay is needed to keep nutrients cycling around an ecosystem"
  'the-role-of-microorganisms-in-decomposition': 2,
  // Carbon cycle disruption
  'deforestation-affects-the-carbon-and-water-cycles': 2,
  // Carbon in atmosphere context
  'atmospheric-carbon': 1,
} as const;
