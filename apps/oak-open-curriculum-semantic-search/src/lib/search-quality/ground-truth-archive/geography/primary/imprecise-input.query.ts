/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GEOGRAPHY_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'british ilands map',
  category: 'imprecise-input',
  description: 'Misspelling of islands - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
