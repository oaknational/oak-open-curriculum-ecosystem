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
  query: 'teaching estar for states and location KS2',
  category: 'natural-expression',
  description: 'Teacher phrasing using curriculum terminology for core grammatical concept',
  expectedFile: './natural-expression.expected.ts',
} as const;
