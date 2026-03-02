/**
 * KS4 Science ground truth queries for subject-specific content relevance.
 *
 * At KS4, Science fragments into distinct KS4 subjects:
 * - Biology
 * - Chemistry
 * - Physics
 * - Combined Science
 *
 * These queries test search relevance for subject-specific content,
 * ensuring teachers searching within each subject find quality results.
 */

import { combineGroundTruth, type GroundTruthQuery } from '../../../types';

// Import query definitions
import { SCIENCE_KS4_BIOLOGY_FILTER_QUERY } from './biology-filter.query';
import { SCIENCE_KS4_CHEMISTRY_FILTER_QUERY } from './chemistry-filter.query';
import { SCIENCE_KS4_PHYSICS_FILTER_QUERY } from './physics-filter.query';
import { SCIENCE_KS4_COMBINED_SCIENCE_FILTER_QUERY } from './combined-science-filter.query';

// Import expected relevance
import { SCIENCE_KS4_BIOLOGY_FILTER_EXPECTED } from './biology-filter.expected';
import { SCIENCE_KS4_CHEMISTRY_FILTER_EXPECTED } from './chemistry-filter.expected';
import { SCIENCE_KS4_PHYSICS_FILTER_EXPECTED } from './physics-filter.expected';
import { SCIENCE_KS4_COMBINED_SCIENCE_FILTER_EXPECTED } from './combined-science-filter.expected';

/**
 * All KS4 Science content relevance queries.
 *
 * One query per KS4 subject testing search quality:
 * - Biology: carbon cycle in ecosystems
 * - Chemistry: ionic bonding electron transfer
 * - Physics: radioactive decay half-life
 * - Combined Science: energy transfers and efficiency
 */
export const SCIENCE_KS4_ALL_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(SCIENCE_KS4_BIOLOGY_FILTER_QUERY, SCIENCE_KS4_BIOLOGY_FILTER_EXPECTED),
  combineGroundTruth(SCIENCE_KS4_CHEMISTRY_FILTER_QUERY, SCIENCE_KS4_CHEMISTRY_FILTER_EXPECTED),
  combineGroundTruth(SCIENCE_KS4_PHYSICS_FILTER_QUERY, SCIENCE_KS4_PHYSICS_FILTER_EXPECTED),
  combineGroundTruth(
    SCIENCE_KS4_COMBINED_SCIENCE_FILTER_QUERY,
    SCIENCE_KS4_COMBINED_SCIENCE_FILTER_EXPECTED,
  ),
] as const;

// Subject-specific exports for granular testing
export const SCIENCE_KS4_BIOLOGY_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(SCIENCE_KS4_BIOLOGY_FILTER_QUERY, SCIENCE_KS4_BIOLOGY_FILTER_EXPECTED),
] as const;

export const SCIENCE_KS4_CHEMISTRY_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(SCIENCE_KS4_CHEMISTRY_FILTER_QUERY, SCIENCE_KS4_CHEMISTRY_FILTER_EXPECTED),
] as const;

export const SCIENCE_KS4_PHYSICS_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(SCIENCE_KS4_PHYSICS_FILTER_QUERY, SCIENCE_KS4_PHYSICS_FILTER_EXPECTED),
] as const;

export const SCIENCE_KS4_COMBINED_SCIENCE_QUERIES: readonly GroundTruthQuery[] = [
  combineGroundTruth(
    SCIENCE_KS4_COMBINED_SCIENCE_FILTER_QUERY,
    SCIENCE_KS4_COMBINED_SCIENCE_FILTER_EXPECTED,
  ),
] as const;

// Re-export query definitions
export { SCIENCE_KS4_BIOLOGY_FILTER_QUERY } from './biology-filter.query';
export { SCIENCE_KS4_CHEMISTRY_FILTER_QUERY } from './chemistry-filter.query';
export { SCIENCE_KS4_PHYSICS_FILTER_QUERY } from './physics-filter.query';
export { SCIENCE_KS4_COMBINED_SCIENCE_FILTER_QUERY } from './combined-science-filter.query';

// Re-export expected relevance
export { SCIENCE_KS4_BIOLOGY_FILTER_EXPECTED } from './biology-filter.expected';
export { SCIENCE_KS4_CHEMISTRY_FILTER_EXPECTED } from './chemistry-filter.expected';
export { SCIENCE_KS4_PHYSICS_FILTER_EXPECTED } from './physics-filter.expected';
export { SCIENCE_KS4_COMBINED_SCIENCE_FILTER_EXPECTED } from './combined-science-filter.expected';
