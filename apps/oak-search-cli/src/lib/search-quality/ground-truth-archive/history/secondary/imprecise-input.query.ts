/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const HISTORY_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'holocost and nazi germany',
  category: 'imprecise-input',
  description: 'Common Holocaust misspelling - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
