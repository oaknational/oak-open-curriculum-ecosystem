/**
 * Query definition for imprecise-input-2 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_2_QUERY: GroundTruthQueryDefinition = {
  query: 'photosythesis in plants',
  category: 'imprecise-input',
  description: 'Tests typo recovery for photosynthesis content',
  expectedFile: './imprecise-input-2.expected.ts',
} as const;
