/**
 * Query definition for natural-expression-2 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-2.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_2_QUERY: GroundTruthQueryDefinition = {
  query: 'why does metal go rusty',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging from everyday question to oxidation content',
  expectedFile: './natural-expression-2.expected.ts',
} as const;
