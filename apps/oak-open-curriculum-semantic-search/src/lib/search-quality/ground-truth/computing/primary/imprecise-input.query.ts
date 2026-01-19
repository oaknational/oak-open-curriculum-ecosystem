/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_PRIMARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'how does the internat work',
  category: 'imprecise-input',
  description: 'Tests typo recovery: ',
  expectedFile: './imprecise-input.expected.ts',
} as const;
