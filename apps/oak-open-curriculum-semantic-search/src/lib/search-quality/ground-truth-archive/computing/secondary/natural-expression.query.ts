/**
 * Query definition for natural-expression ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./natural-expression.expected.ts
 *
 * Tests vocabulary bridging from informal teacher language to curriculum terminology:
 * - "fake emails" bridges to "phishing"
 * - "scams" bridges to "phishing", "social engineering"
 * - "social engineering" is direct curriculum vocabulary
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_SECONDARY_NATURAL_EXPRESSION_QUERY: GroundTruthQueryDefinition = {
  query: 'fake emails, scams, social engineering',
  category: 'natural-expression',
  description: 'Tests vocabulary bridging: "fake emails" → phishing, "scams" → social engineering',
  expectedFile: './natural-expression.expected.ts',
} as const;
