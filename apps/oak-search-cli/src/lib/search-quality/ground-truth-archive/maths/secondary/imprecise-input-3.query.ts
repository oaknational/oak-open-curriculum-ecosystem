/**
 * Query definition for imprecise-input ground truth (query 3 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-3.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_SECONDARY_IMPRECISE_INPUT_3_QUERY: GroundTruthQueryDefinition = {
  query: 'probablity tree diagrams',
  category: 'imprecise-input',
  description: 'Tests typo recovery: missing letter (i) in probability - common omission error',
  expectedFile: './imprecise-input-3.expected.ts',
} as const;
