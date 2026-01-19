/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'teach folk songs sea shanty',
  category: 'natural-expression',
  description: 'Teacher intent + specific genre (sea shanties)',
  expectedFile: './natural-expression.expected.ts',
} as const;
