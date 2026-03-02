/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COOKING_NUTRITION_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'nutrision and helthy food',
  category: 'imprecise-input',
  description: 'Tests resilience: typos ',
  expectedFile: './imprecise-input.expected.ts',
} as const;
