/**
 * Query definition for natural-expression-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-3.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_NATURAL_EXPRESSION_3_QUERY: GroundTruthQueryDefinition = {
  query: 'what makes ice turn into water',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging from everyday question to melting/state change content',
  expectedFile: './natural-expression-3.expected.ts',
} as const;
