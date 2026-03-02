/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'meditaton and prayer practices',
  category: 'imprecise-input',
  description: 'Single realistic typo (meditaton) on generic RE terms - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
