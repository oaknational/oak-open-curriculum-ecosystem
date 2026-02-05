/**
 * Query definition for imprecise-input ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input.expected.ts
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const COMPUTING_SECONDARY_IMPRECISE_INPUT_QUERY: GroundTruthQueryDefinition = {
  query: 'databse querying lessons',
  category: 'imprecise-input',
  description: 'Tests typo recovery for ',
  expectedFile: './imprecise-input.expected.ts',
} as const;
