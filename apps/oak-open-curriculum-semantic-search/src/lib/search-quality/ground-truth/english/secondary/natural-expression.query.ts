/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ENGLISH_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'teach students about gothic literature year 8',
  category: 'natural-expression',
  description: 'Teacher request with year group specification - tests informal phrasing',
  expectedFile: './natural-expression.expected.ts',
} as const;
