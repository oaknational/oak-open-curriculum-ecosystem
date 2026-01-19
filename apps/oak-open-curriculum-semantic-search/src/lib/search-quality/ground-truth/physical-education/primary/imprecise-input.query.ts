/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const PHYSICAL_EDUCATION_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'footbal skills primary',
  category: 'imprecise-input',
  description: 'Common misspelling of football - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
