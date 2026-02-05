/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'evoloution and adaptashun',
  category: 'imprecise-input',
  description: 'Common primary-level spelling errors - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
