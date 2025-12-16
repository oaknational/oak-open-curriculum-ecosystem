/**
 * Search quality evaluation utilities.
 *
 * This module provides IR metrics and ground truth for evaluating search quality.
 *
 * @packageDocumentation
 */

export { calculateMRR, calculateNDCG } from './metrics';
export { GROUND_TRUTH_QUERIES, type GroundTruthQuery } from './ground-truth';
