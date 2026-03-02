/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'simulatneous equasions substitution method',
  category: 'imprecise-input',
  description: 'Two misspellings in 4 words - tests fuzzy + ELSER recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
