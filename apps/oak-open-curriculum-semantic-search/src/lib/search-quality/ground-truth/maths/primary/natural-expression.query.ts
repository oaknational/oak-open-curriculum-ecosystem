/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'takeaway sums primary',
  category: 'natural-expression',
  description: 'Colloquial term for subtraction - tests vocabulary bridging',
  expectedFile: './natural-expression.expected.ts',
} as const;
