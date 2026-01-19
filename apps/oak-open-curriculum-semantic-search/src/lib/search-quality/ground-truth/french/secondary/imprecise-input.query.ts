/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const FRENCH_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'french grammer avoir etre',
  category: 'imprecise-input',
  description: 'Common grammar misspelling - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
