/**
 * KS4 English ground truth queries for search quality evaluation.
 *
 * **Updated 2026-01-11**: Per M3 plan, KS4 queries are now integrated
 * into the main secondary entry. This module exports an empty array
 * for backward compatibility.
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * All KS4 English ground truth queries.
 *
 * Empty array - KS4 queries integrated into secondary entry.
 */
export const ENGLISH_KS4_ALL_QUERIES: readonly GroundTruthQuery[] = [] as const;
