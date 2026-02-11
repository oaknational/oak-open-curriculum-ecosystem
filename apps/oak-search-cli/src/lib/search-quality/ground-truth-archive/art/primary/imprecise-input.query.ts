/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ART_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'brush painting techneeques',
  category: 'imprecise-input',
  description: 'Misspelling of techniques - tests fuzzy recovery for brushwork and painting',
  expectedFile: './imprecise-input.expected.ts',
} as const;
