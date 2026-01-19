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
  MATHS_ALL_QUERIES,
  MATHS_SECONDARY_ALL_QUERIES,
  type GroundTruthQuery,
} from './ground-truth';
