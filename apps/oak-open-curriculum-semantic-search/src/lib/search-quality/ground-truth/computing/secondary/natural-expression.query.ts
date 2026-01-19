/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'coding for beginners programming basics introduction',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging from ',
  expectedFile: './natural-expression.expected.ts',
} as const;
