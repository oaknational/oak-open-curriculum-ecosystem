/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'global warming effects',
  category: 'natural-expression',
  description: 'Global warming = climate change - tests vocabulary bridging',
  expectedFile: './natural-expression.expected.ts',
} as const;
