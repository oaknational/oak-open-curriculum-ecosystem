/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * Tests vocabulary bridging: "making negative" (descriptive) → "negation" (curriculum term)
 *
 * NOTE: MFL subjects have no transcripts (structure-only retrieval), which limits
 * vocabulary bridging capability. This query tests whether descriptive informal
 * language can find negation content.
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const FRENCH_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'making French sentences negative KS3',
  category: 'natural-expression',
  description:
    'Tests vocabulary bridging: "making negative" (descriptive) → "negation" (curriculum term). MFL has limited content coverage which affects vocabulary bridging.',
  expectedFile: './natural-expression.expected.ts',
} as const;
