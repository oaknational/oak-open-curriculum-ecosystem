/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const CITIZENSHIP_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'being fair to everyone rights',
  category: 'natural-expression',
  description: 'Tests colloquial vocabulary bridging: ',
  expectedFile: './natural-expression.expected.ts',
} as const;
