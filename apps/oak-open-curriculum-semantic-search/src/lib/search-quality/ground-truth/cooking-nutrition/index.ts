/**
 * Cooking & Nutrition ground truth queries for search quality evaluation.
 *
 * This module aggregates ground truths by phase:
 * - **Primary** (KS1-2): Healthy eating, food preparation, nutrition basics
 * - **Secondary** (KS3-4): Cooking techniques, nutrition science, food safety
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../types';

import { COOKING_NUTRITION_PRIMARY_ALL_QUERIES } from './primary';
import { COOKING_NUTRITION_SECONDARY_ALL_QUERIES } from './secondary';

/**
 * All Cooking & Nutrition ground truth queries across all phases.
 *
 * Total: 8 queries (4 Primary + 4 Secondary).
 */
export const COOKING_NUTRITION_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COOKING_NUTRITION_PRIMARY_ALL_QUERIES,
  ...COOKING_NUTRITION_SECONDARY_ALL_QUERIES,
] as const;

// Re-export primary
export { COOKING_NUTRITION_PRIMARY_ALL_QUERIES } from './primary';

// Re-export secondary
export { COOKING_NUTRITION_SECONDARY_ALL_QUERIES } from './secondary';
