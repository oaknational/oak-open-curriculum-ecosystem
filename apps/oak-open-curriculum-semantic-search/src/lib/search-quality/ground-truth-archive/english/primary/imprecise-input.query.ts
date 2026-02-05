/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ENGLISH_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'narative writing storys iron man Year 3',
  category: 'imprecise-input',
  description: 'Common primary teacher misspellings - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
