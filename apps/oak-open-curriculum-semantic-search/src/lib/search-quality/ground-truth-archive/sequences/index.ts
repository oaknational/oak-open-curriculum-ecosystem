/**
 * Comprehensive ground truth for sequence search quality evaluation.
 *
 * Sequences are subject + phase combinations (e.g., "maths-primary",
 * "science-secondary-aqa") that represent curriculum programmes.
 *
 * Ground truth covers:
 * - Subject + phase queries (critical)
 * - Exam board queries (AQA, Edexcel, OCR)
 * - Key stage queries (KS1-KS4)
 * - Misspellings and acronyms
 * - Intent-based queries
 *
 * **Methodology** (2025-12-23):
 * Sequence slugs verified against Oak API via:
 * - `get-subjects` for all subject slugs
 * - `get-subjects-sequences` for sequence slugs per subject
 *
 * @packageDocumentation
 */

export type { SequenceGroundTruthQuery } from './types';

import { SEQUENCE_STANDARD_QUERIES } from './standard-queries';
import { SEQUENCE_HARD_QUERIES } from './hard-queries';
import type { SequenceGroundTruthQuery } from './types';

/**
 * Standard sequence ground truth queries.
 *
 * Total: 24 queries covering basic sequence discovery patterns.
 */
export const SEQUENCE_GROUND_TRUTH_QUERIES: readonly SequenceGroundTruthQuery[] =
  SEQUENCE_STANDARD_QUERIES;

/**
 * Hard sequence ground truth queries.
 *
 * Total: 17 queries testing challenging search scenarios.
 */
export const SEQUENCE_HARD_GROUND_TRUTH_QUERIES: readonly SequenceGroundTruthQuery[] =
  SEQUENCE_HARD_QUERIES;

/**
 * All sequence ground truth queries (standard + hard).
 *
 * Total: 41 queries
 */
export const SEQUENCE_ALL_GROUND_TRUTH_QUERIES: readonly SequenceGroundTruthQuery[] = [
  ...SEQUENCE_GROUND_TRUTH_QUERIES,
  ...SEQUENCE_HARD_GROUND_TRUTH_QUERIES,
] as const;
