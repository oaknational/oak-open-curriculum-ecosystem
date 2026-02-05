/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const FRENCH_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'French greetings KS1',
  category: 'natural-expression',
  description: 'Informal terminology with key stage for basic French vocabulary',
  expectedFile: './natural-expression.expected.ts',
} as const;
