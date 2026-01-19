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
  query: 'teach french greetings to children',
  category: 'natural-expression',
  description: 'Teacher intent phrasing for basic French vocabulary',
  expectedFile: './natural-expression.expected.ts',
} as const;
