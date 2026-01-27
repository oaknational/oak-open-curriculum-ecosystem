/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COOKING_NUTRITION_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'healthy lunches, balanced meals',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: informal meal terms to nutrition curriculum',
  expectedFile: './natural-expression.expected.ts',
} as const;
