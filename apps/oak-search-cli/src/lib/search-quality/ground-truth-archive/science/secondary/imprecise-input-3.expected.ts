/**
 * Expected relevance for imprecise-input-3 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * HAZARD: Expected slugs are about EM WAVES, not electromagnets!
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_3_EXPECTED: ExpectedRelevance = {
  'the-spectrum-of-electromagnetic-waves': 3,
  'the-spectrum-of-electromagnetic-radiation': 3,
  'ionising-electromagnetic-radiation': 3,
  'non-ionising-electromagnetic-radiations': 2,
} as const;
