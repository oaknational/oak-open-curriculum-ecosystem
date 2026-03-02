/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ENGLISH_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'gothic literature Year 8',
  category: 'natural-expression',
  description: 'Tests topic search with year group filter',
  expectedFile: './natural-expression.expected.ts',
} as const;
