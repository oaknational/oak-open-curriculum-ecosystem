/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'staying safe on computers',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging from informal ',
  expectedFile: './natural-expression.expected.ts',
} as const;
