/**
 * Primary Maths ground truth queries for search quality evaluation.
 *
 * **Phase-aligned structure (2026-01-05)**:
 * This module covers KS1 (Years 1-2) and KS2 (Years 3-6) primary maths.
 *
 * **Topics covered**:
 * - Number: addition, subtraction, place value, number bonds
 * - Multiplication: times tables, equal groups, multiplication strategies
 * - Fractions: unit fractions, halves, quarters, thirds
 * - Geometry: 2D/3D shapes, angles, properties
 *
 * **Methodology**:
 * All lesson slugs verified from bulk-downloads/maths-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

import { FRACTIONS_PRIMARY_QUERIES } from './fractions';
import { GEOMETRY_PRIMARY_QUERIES } from './geometry';
import { MATHS_PRIMARY_HARD_QUERIES } from './hard-queries';
import { MULTIPLICATION_PRIMARY_QUERIES } from './multiplication';
import { NUMBER_PRIMARY_QUERIES } from './number';

/**
 * All standard Primary Maths ground truth queries.
 *
 * Total: 30 queries across 4 topic areas.
 */
export const MATHS_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...NUMBER_PRIMARY_QUERIES,
  ...MULTIPLICATION_PRIMARY_QUERIES,
  ...FRACTIONS_PRIMARY_QUERIES,
  ...GEOMETRY_PRIMARY_QUERIES,
] as const;

/**
 * All Primary Maths ground truth queries (standard + hard).
 *
 * Total: 37 queries.
 */
export const MATHS_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_PRIMARY_STANDARD_QUERIES,
  ...MATHS_PRIMARY_HARD_QUERIES,
] as const;

// Re-export individual topic modules
export { FRACTIONS_PRIMARY_QUERIES } from './fractions';
export { GEOMETRY_PRIMARY_QUERIES } from './geometry';
export { MATHS_PRIMARY_HARD_QUERIES } from './hard-queries';
export { MULTIPLICATION_PRIMARY_QUERIES } from './multiplication';
export { NUMBER_PRIMARY_QUERIES } from './number';
