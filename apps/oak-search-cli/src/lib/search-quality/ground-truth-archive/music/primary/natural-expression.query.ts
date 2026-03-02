/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'singing in tune, pitch matching',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: informal "singing in tune" to pitch/vocal lessons',
  expectedFile: './natural-expression.expected.ts',
} as const;
