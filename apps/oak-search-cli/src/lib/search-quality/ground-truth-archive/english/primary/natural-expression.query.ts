/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ENGLISH_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'character feelings, emotions in stories',
  category: 'natural-expression',
  description: 'Informal terminology bridging to character analysis/comprehension content',
  expectedFile: './natural-expression.expected.ts',
} as const;
