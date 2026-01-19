/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'that Darwin bird lesson',
  category: 'natural-expression',
  description: 'Informal reference to Darwin finches lesson - tests colloquial language',
  expectedFile: './natural-expression.expected.ts',
} as const;
