/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const FRENCH_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'fench vocabulary primary',
  category: 'imprecise-input',
  description: 'Misspelling of French - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
