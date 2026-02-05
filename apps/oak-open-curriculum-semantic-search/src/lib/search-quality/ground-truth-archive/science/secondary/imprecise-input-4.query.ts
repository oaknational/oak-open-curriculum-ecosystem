/**
 * Query definition for imprecise-input-4 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-4.expected.ts
 *
 * @remarks
 * Moved from primary where electricity and magnets are taught separately.
 * At KS3, electromagnets are a unified topic combining both concepts.
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_4_QUERY: GroundTruthQueryDefinition = {
  query: 'electrisity and magnits',
  category: 'imprecise-input',
  description: 'Tests typo recovery for electromagnet content (KS3 unified topic)',
  expectedFile: './imprecise-input-4.expected.ts',
} as const;
