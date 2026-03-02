/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const PHYSICAL_EDUCATION_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'throwing catching skills',
  category: 'natural-expression',
  description: 'Informal terminology bridging to sending/receiving skills content',
  expectedFile: './natural-expression.expected.ts',
} as const;
