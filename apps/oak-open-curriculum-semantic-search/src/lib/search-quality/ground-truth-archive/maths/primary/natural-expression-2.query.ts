/**
 * Query definition for natural-expression ground truth (query 2 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-2.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_NATURAL_EXPRESSION_2_QUERY: GroundTruthQueryDefinition = {
  query: 'counting in groups, skip counting',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: teacher language for multiplication grouping model',
  expectedFile: './natural-expression-2.expected.ts',
} as const;
