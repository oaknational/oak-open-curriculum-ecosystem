/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'buddism and the dhama',
  category: 'imprecise-input',
  description: 'Common Buddhism/Dhamma misspellings - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
