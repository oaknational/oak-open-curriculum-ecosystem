/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'working out percentages from amounts',
  category: 'natural-expression',
  description:
    'Tests vocabulary bridging: "working out" is informal for calculating; maps to percentage calculation lessons',
  expectedFile: './natural-expression.expected.ts',
} as const;
