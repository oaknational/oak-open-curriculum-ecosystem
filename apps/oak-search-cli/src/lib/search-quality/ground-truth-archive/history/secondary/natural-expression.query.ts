/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const HISTORY_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'factory age workers conditions',
  category: 'natural-expression',
  description: 'Factory age = Industrial Revolution - tests vocabulary bridging',
  expectedFile: './natural-expression.expected.ts',
} as const;
