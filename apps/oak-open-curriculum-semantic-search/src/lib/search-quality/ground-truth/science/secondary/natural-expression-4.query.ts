/**
 * Query definition for natural-expression-4 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression-4.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

/**
 * Physics-only thermal query: Unlike natural-expression-3 which spans physics
 * and biology, this query has a clear, unambiguous physics answer — thermal
 * conductivity explains why materials at the same temperature feel different.
 * This is a classic physics demonstration question.
 */
export const SCIENCE_SECONDARY_NATURAL_EXPRESSION_4_QUERY: GroundTruthQueryDefinition = {
  query: 'why does metal feel colder than wood at same temperature',
  category: 'natural-expression',
  description:
    'Tests vocabulary bridging from everyday thermal observation to thermal conductivity content (physics-only)',
  expectedFile: './natural-expression-4.expected.ts',
} as const;
