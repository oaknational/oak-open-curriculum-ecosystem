/**
 * Cooking & Nutrition ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Basic cooking skills, food hygiene, healthy eating
 * - **Secondary** (KS3): Cooking techniques, nutrition, food safety
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { COOKING_PRIMARY_ALL_QUERIES } from './primary';
import { COOKING_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Cooking & Nutrition ground truth queries across all phases.
 *
 * Total: 14 queries (6 Primary + 8 Secondary).
 */
export const COOKING_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COOKING_PRIMARY_ALL_QUERIES,
  ...COOKING_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export {
  COOKING_PRIMARY_ALL_QUERIES,
  COOKING_PRIMARY_HARD_QUERIES,
  COOKING_PRIMARY_STANDARD_QUERIES,
} from './primary';

// Re-export secondary
export {
  COOKING_SECONDARY_ALL_QUERIES,
  COOKING_SECONDARY_HARD_QUERIES,
  COOKING_SECONDARY_STANDARD_QUERIES,
} from './secondary';

// Legacy exports
export const COOKING_STANDARD_QUERIES = COOKING_ALL_QUERIES;
export const COOKING_HARD_QUERIES: readonly GroundTruthQuery[] = [] as const;
