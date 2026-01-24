/**
 * Query definition for imprecise-input-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-3.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_IMPRECISE_INPUT_3_QUERY: GroundTruthQueryDefinition = {
  query: 'evapration and condensashun',
  category: 'imprecise-input',
  description: 'Tests typo recovery for evaporation and condensation content',
  expectedFile: './imprecise-input-3.expected.ts',
} as const;
