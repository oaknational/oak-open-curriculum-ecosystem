/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const GERMAN_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'german grammer present tence',
  category: 'imprecise-input',
  description: 'Common misspellings - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
