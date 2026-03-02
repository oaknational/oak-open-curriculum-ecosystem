/**
 * Query definition for natural-expression-2 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_QUERY: GroundTruthQueryDefinition = {
  query: 'rusting oxidation metals',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: informal "rusting" to oxidation chemistry content',
  expectedFile: './natural-expression-2.expected.ts',
} as const;
