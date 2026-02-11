/**
 * Query definition for natural-expression ground truth (query 3 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-3.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_NATURAL_EXPRESSION_3_QUERY: GroundTruthQueryDefinition = {
  query: 'splitting numbers into parts',
  category: 'natural-expression',
  description:
    'Tests vocabulary bridging: "splitting into parts" is informal language that maps to partitioning and number bonds',
  expectedFile: './natural-expression-3.expected.ts',
} as const;
