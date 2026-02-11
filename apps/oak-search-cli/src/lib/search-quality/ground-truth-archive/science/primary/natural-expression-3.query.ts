/**
 * Query definition for natural-expression-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-3.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_NATURAL_EXPRESSION_3_QUERY: GroundTruthQueryDefinition = {
  query: 'melting ice, changes of state',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: informal "melting ice" to curriculum terminology',
  expectedFile: './natural-expression-3.expected.ts',
} as const;
