/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SPANISH_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'teach spanish greetings to children',
  category: 'natural-expression',
  description: 'Teacher intent phrasing for basic Spanish vocabulary',
  expectedFile: './natural-expression.expected.ts',
} as const;
