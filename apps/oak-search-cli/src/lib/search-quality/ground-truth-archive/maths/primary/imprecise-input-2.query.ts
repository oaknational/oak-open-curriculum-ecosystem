/**
 * Query definition for imprecise-input ground truth (query 2 of 3).
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-2.expected.ts
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_IMPRECISE_INPUT_2_QUERY: GroundTruthQueryDefinition = {
  query: 'multiplikation timetables year 3',
  category: 'imprecise-input',
  description:
    'Tests typo recovery: phonetic substitution (k for c) combined with variant spelling "timetables" instead of "times tables", with year context',
  expectedFile: './imprecise-input-2.expected.ts',
} as const;
