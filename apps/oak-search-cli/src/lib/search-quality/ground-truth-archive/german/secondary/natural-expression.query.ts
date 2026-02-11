/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GERMAN_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'German verb endings Year 7',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: verb endings to conjugation content',
  expectedFile: './natural-expression.expected.ts',
} as const;
