/**
 * Query definition for natural-expression-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-3.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

/**
 * Cross-discipline query: This topic spans physics (thermal conductivity,
 * heat capacity, particle energy) and biology (thermoreceptors, sensory
 * perception, nervous system). Both physics and biology lessons are valid.
 */
export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_QUERY: GroundTruthQueryDefinition = {
  query: 'thermal conductivity, heat transfer',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: thermal physics terminology to curriculum content',
  expectedFile: './natural-expression-3.expected.ts',
} as const;
