/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'resperation in humans',
  category: 'imprecise-input',
  description: 'Common respiration misspelling - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
