/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const HISTORY_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'Romans Year 4, Roman Britain',
  category: 'natural-expression',
  description: 'Tests topic search with year group and related term',
  expectedFile: './natural-expression.expected.ts',
} as const;
