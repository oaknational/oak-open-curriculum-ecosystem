/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const DESIGN_TECHNOLOGY_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'DT making things move',
  category: 'natural-expression',
  description: 'Tests informal phrasing ',
  expectedFile: './natural-expression.expected.ts',
} as const;
