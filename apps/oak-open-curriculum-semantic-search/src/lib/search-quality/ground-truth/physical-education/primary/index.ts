/**
 * Primary Physical Education ground truth queries for search quality evaluation.
 *
 * Covers KS1-KS2 PE curriculum:
 * - Locomotion and movement
 * - Ball skills
 * - Dance
 * - Invasion games
 * - Swimming
 * - Outdoor adventurous activities
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/physical-education-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { PE_PRIMARY_HARD_QUERIES } from './hard-queries';
import { PE_PRIMARY_STANDARD_QUERIES } from './standard';

/**
 * All Primary PE ground truth queries (standard + hard).
 *
 * Total: 18 queries.
 */
export const PE_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...PE_PRIMARY_STANDARD_QUERIES,
  ...PE_PRIMARY_HARD_QUERIES,
] as const;

export { PE_PRIMARY_HARD_QUERIES } from './hard-queries';
export { PE_PRIMARY_STANDARD_QUERIES } from './standard';
