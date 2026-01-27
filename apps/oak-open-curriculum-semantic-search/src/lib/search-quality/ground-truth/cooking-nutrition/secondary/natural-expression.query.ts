/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COOKING_NUTRITION_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'bread making, baking techniques',
  category: 'natural-expression',
  description: 'Informal baking terminology bridging to food preparation content',
  expectedFile: './natural-expression.expected.ts',
} as const;
