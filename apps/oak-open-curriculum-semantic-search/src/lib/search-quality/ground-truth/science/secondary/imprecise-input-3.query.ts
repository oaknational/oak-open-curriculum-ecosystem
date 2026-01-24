/**
 * Query definition for imprecise-input-3 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-3.expected.ts
 *
 * HAZARD: electromagnatic != electromagnet
 * - electromagnets: magnets made using electricity
 * - electromagnetic waves: oscillations in EM fields
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_3_QUERY: GroundTruthQueryDefinition = {
  query: 'electromagnatic waves and spectrum',
  category: 'imprecise-input',
  description: 'Tests typo recovery for EM spectrum content (NOT electromagnets)',
  expectedFile: './imprecise-input-3.expected.ts',
} as const;
