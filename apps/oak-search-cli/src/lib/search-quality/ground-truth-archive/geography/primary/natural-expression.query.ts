/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GEOGRAPHY_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'where is our school ks1',
  category: 'natural-expression',
  description: 'Question format with key stage reference - tests informal phrasing',
  expectedFile: './natural-expression.expected.ts',
} as const;
