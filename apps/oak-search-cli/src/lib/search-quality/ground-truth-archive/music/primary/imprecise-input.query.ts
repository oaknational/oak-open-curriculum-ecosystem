/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MUSIC_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'rythm beat ks1',
  category: 'imprecise-input',
  description: 'Misspelling of rhythm - tests fuzzy recovery',
  expectedFile: './imprecise-input.expected.ts',
} as const;
