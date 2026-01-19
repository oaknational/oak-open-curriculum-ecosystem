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
  query: 'the bit where you complete the square',
  category: 'natural-expression',
  description: 'Informal language with noise words - tests semantic understanding',
  expectedFile: './natural-expression.expected.ts',
} as const;
