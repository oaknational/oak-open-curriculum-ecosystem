/**
 * Ground truth registry types.
 *
 * @see ADR-098 Ground Truth Registry as Single Source of Truth
 * @packageDocumentation
 */

import type { Subject } from '@oaknational/oak-curriculum-sdk';

import type { GroundTruthQuery } from '../types';

/**
 * Valid phase values for ground truth organisation.
 *
 * - **primary**: KS1 + KS2 (Years 1-6)
 * - **secondary**: KS3 + KS4 (Years 7-11)
 *
 * KS4-specific queries (tiers, exam boards, set texts) are part of secondary
 * and use `keyStage: 'ks4'` on individual queries.
 */
export type Phase = 'primary' | 'secondary';

/**
 * A ground truth entry in the registry.
 *
 * Represents a complete set of ground truth queries for a specific
 * subject/phase combination, along with the baseline MRR for smoke tests.
 */
export interface GroundTruthEntry {
  /** Subject slug matching the Oak curriculum SDK Subject type */
  readonly subject: Subject;
  /** Phase: primary (KS1+KS2) or secondary (KS3+KS4) */
  readonly phase: Phase;
  /** The ground truth queries for this subject/phase */
  readonly queries: readonly GroundTruthQuery[];
  /**
   * Baseline MRR for smoke test regression detection.
   *
   * Set to 0.0 for newly created ground truths, then update with
   * measured value after running benchmarks.
   *
   * Smoke tests assert: `actualMrr >= baselineMrr * 0.95` (5% tolerance)
   */
  readonly baselineMrr: number;
}
