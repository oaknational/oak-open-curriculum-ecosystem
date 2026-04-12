/**
 * Unit ground truths index.
 *
 * Ground truths for testing unit search quality using the `oak_unit_rollup` index.
 *
 * Target: 2 ground truths (1 primary, 1 secondary)
 */

import type { UnitGroundTruth } from './types';

export type { UnitGroundTruth } from './types';

import { MATHS_PRIMARY } from './entries/maths-primary';
import { SCIENCE_SECONDARY } from './entries/science-secondary';

/**
 * All unit ground truths in the system.
 *
 * Target: 2 ground truths (1 primary, 1 secondary)
 */
export const UNIT_GROUND_TRUTHS: readonly UnitGroundTruth[] = [
  MATHS_PRIMARY,
  SCIENCE_SECONDARY,
] as const;
