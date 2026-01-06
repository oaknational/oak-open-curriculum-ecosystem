/**
 * KS4 Science ground truth queries for search quality evaluation.
 *
 * Covers Year 10-11 GCSE Science: Biology, Chemistry, Physics.
 *
 * **Methodology (2026-01-06)**:
 * All lesson slugs verified from bulk-downloads/science-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

import { BIOLOGY_KS4_QUERIES } from './biology';
import { CHEMISTRY_KS4_QUERIES } from './chemistry';
import { PHYSICS_KS4_QUERIES } from './physics';

/**
 * All KS4 Science ground truth queries.
 *
 * Total: 15 queries across Biology, Chemistry, Physics.
 */
export const SCIENCE_KS4_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...BIOLOGY_KS4_QUERIES,
  ...CHEMISTRY_KS4_QUERIES,
  ...PHYSICS_KS4_QUERIES,
] as const;

// Re-export individual subjects
export { BIOLOGY_KS4_QUERIES } from './biology';
export { CHEMISTRY_KS4_QUERIES } from './chemistry';
export { PHYSICS_KS4_QUERIES } from './physics';
