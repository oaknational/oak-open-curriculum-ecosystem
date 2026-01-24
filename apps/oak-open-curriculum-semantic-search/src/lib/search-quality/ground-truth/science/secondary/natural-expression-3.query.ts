/**
 * Query definition for natural-expression-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-3.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

/**
 * Cross-discipline query: This question spans physics (thermal conductivity,
 * heat capacity, particle energy) and biology (thermoreceptors, sensory
 * perception, nervous system). Both physics and biology lessons are valid
 * answers. The "feel" framing invokes human perception, which is biological,
 * but the underlying phenomenon is physical.
 */
export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_3_QUERY: GroundTruthQueryDefinition = {
  query: 'why do some things feel hotter than others',
  category: 'natural-expression',
  description:
    'Tests vocabulary bridging from everyday temperature question to thermal physics (conductivity, heat transfer) or biology (thermoreceptors, sensory perception) content',
  expectedFile: './natural-expression-3.expected.ts',
} as const;
