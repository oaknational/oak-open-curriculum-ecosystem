/**
 * Query definition for imprecise-input ground truth (query 2 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_IMPRECISE_INPUT_2_QUERY: GroundTruthQueryDefinition = {
  query: 'pythagorus theorum triangles',
  category: 'imprecise-input',
  description:
    'Tests typo recovery: multiple common misspellings of Pythagoras theorem (very frequently misspelled)',
  expectedFile: './imprecise-input-2.expected.ts',
} as const;
