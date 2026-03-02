/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SPANISH_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'estar states location Spanish',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: estar usage for states and location',
  expectedFile: './natural-expression.expected.ts',
} as const;
