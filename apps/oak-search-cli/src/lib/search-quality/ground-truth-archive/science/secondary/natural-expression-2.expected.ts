/**
 * Expected relevance for natural-expression-2 ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @remarks
 * Investigation 2026-01-23: Fixed slug `corrosion-and-its-prevention` which does not exist.
 * Actual curriculum slug is `corrosion-and-its-prevention-including-half-equations` (KS4 Chemistry).
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_EXPECTED: ExpectedRelevance = {
  // KS3: "Examples of oxidation are combustion and rusting" - Keywords include "rusting"
  'chemical-reactions-oxidation': 3,
  // KS4 Chemistry: "Rusting is a specific type of corrosion, affecting iron in the presence of air and moisture"
  'corrosion-and-its-prevention-including-half-equations': 3,
  // Related: explains oxidation mechanism
  'redox-reactions': 2,
  // Related: explains metal oxidation
  'the-reactivity-series-for-metals': 2,
  // Related: metal oxides
  'metal-oxides-and-non-metal-oxides': 1,
} as const;
