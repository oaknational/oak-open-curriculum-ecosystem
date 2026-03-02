/**
 * Query definition for imprecise-input ground truth (query 3 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-3.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_IMPRECISE_INPUT_3_QUERY: GroundTruthQueryDefinition = {
  query: 'adding frations togethr',
  category: 'imprecise-input',
  description:
    'Tests typo recovery: missing letters (c in fractions, e in together) - common truncation errors',
  expectedFile: './imprecise-input-3.expected.ts',
} as const;
