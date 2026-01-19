/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const ART_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'teach drawing skills beginers',
  category: 'imprecise-input',
  description: 'Tests search resilience to typo ',
  expectedFile: './imprecise-input.expected.ts',
} as const;
