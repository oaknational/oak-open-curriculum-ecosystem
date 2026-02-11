/**
 * Query definition for natural-expression-4 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-4.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

/**
 * Physics-only thermal query: Unlike natural-expression-3 which spans physics
 * and biology, this query focuses on thermal conductivity which explains why
 * materials at the same temperature feel different.
 */
export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_QUERY: GroundTruthQueryDefinition = {
  query: 'thermal conductivity materials',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: thermal physics terminology to heat transfer content',
  expectedFile: './natural-expression-4.expected.ts',
} as const;
