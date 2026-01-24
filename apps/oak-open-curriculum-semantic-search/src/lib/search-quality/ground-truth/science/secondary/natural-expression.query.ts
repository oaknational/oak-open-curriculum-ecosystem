/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'how do plants make their own food',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging from everyday question to photosynthesis content',
  expectedFile: './natural-expression.expected.ts',
} as const;
