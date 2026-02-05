/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_PRIMARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'prayer, worship practices',
  category: 'natural-expression',
  description: 'Informal terminology bridging to curriculum concepts about religious practices',
  expectedFile: './natural-expression.expected.ts',
} as const;
