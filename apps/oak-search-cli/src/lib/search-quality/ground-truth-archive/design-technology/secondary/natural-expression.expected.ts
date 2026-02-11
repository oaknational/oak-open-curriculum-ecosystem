/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const DESIGN_TECHNOLOGY_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  'life-cycle-assessment': 3,
  'life-cycle-assessment-of-flat-pack-furniture': 3,
  'linear-versus-circular-economy': 3,
  'material-sustainability': 2,
  'the-environmental-impact-of-materials': 2,
} as const;
