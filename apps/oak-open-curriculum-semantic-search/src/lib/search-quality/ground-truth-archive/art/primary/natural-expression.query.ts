/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ART_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'drawing faces, portraits',
  category: 'natural-expression',
  description: 'Informal terminology bridging to portraiture/figure drawing content',
  expectedFile: './natural-expression.expected.ts',
} as const;
