/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const CITIZENSHIP_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'parliment functions and roles',
  category: 'imprecise-input',
  description: 'Tests typo recovery: ',
  expectedFile: './imprecise-input.expected.ts',
} as const;
