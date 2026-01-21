/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'why do people pray',
  category: 'natural-expression',
  description: 'Informal question format bridging to curriculum concepts about prayer and worship',
  expectedFile: './natural-expression.expected.ts',
} as const;
