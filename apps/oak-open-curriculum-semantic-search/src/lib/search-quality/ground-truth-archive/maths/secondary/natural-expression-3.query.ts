/**
 * Query definition for natural-expression ground truth (query 3 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-3.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_NATURAL_EXPRESSION_3_QUERY: GroundTruthQueryDefinition = {
  query: 'how steep is the line',
  category: 'natural-expression',
  description:
    'Tests vocabulary bridging: "how steep" is informal language for gradient/slope of a line',
  expectedFile: './natural-expression-3.expected.ts',
} as const;
