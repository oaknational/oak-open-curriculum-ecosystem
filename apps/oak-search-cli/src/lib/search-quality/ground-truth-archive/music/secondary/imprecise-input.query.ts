/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'rythm patterns drums',
  category: 'imprecise-input',
  description: 'Common misspelling of ',
  expectedFile: './imprecise-input.expected.ts',
} as const;
