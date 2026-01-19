/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const PHYSICAL_EDUCATION_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'how to throw and catch',
  category: 'natural-expression',
  description: 'Question format for sending/receiving skills',
  expectedFile: './natural-expression.expected.ts',
} as const;
