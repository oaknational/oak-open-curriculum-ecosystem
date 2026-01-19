/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const HISTORY_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'teach year 4 about the Romans',
  category: 'natural-expression',
  description: 'Teacher request with year group - tests informal phrasing',
  expectedFile: './natural-expression.expected.ts',
} as const;
