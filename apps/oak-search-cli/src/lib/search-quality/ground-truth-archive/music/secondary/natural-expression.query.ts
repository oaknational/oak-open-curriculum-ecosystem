/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'folk songs, sea shanty',
  category: 'natural-expression',
  description: 'Informal genre terminology bridging to traditional music content',
  expectedFile: './natural-expression.expected.ts',
} as const;
