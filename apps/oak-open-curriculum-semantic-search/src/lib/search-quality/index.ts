/**
 * Search quality evaluation utilities.
 *
 * This module provides IR metrics and ground truth for evaluating search quality.
 *
 * @packageDocumentation
 */

export { calculateMRR, calculateNDCG } from './metrics';
export {
  ALL_GROUND_TRUTH_QUERIES,
  ALL_MATHS_QUERIES,
  MATHS_SECONDARY_STANDARD_QUERIES,
  MATHS_SECONDARY_HARD_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
  type GroundTruthQuery,
} from './ground-truth';
