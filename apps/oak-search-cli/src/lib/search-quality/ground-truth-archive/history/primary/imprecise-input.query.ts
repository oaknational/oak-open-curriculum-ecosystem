/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const HISTORY_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'vikins and anglo saxons',
  category: 'imprecise-input',
  description: 'Common Vikings misspelling - tests fuzzy recovery limits',
  expectedFile: './imprecise-input.expected.ts',
} as const;
