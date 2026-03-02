/**
 * Query definition for natural-expression ground truth (query 2 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_NATURAL_EXPRESSION_2_QUERY: GroundTruthQueryDefinition = {
  query: 'finding the unknown number',
  category: 'natural-expression',
  description:
    'Tests vocabulary bridging: "unknown number" is informal for variable; should map to solving equations/algebra',
  expectedFile: './natural-expression-2.expected.ts',
} as const;
