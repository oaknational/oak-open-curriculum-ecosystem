/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SPANISH_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'spansh adjective agreemnt',
  category: 'imprecise-input',
  description:
    'Misspellings of Spanish and agreement - tests fuzzy recovery on real curriculum concept',
  expectedFile: './imprecise-input.expected.ts',
} as const;
