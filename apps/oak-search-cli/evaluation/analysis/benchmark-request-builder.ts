/**
 * Pure function for building benchmark search request parameters.
 *
 * Determines whether to use phase filtering (which expands to multiple key stages)
 * or specific keyStage filtering based on the query configuration.
 *
 * This is a pure function with no side effects, enabling unit testing
 * of the filtering decision logic independently of ES operations.
 *
 * @example
 * ```typescript
 * // Phase-based filtering (expands to all key stages in phase)
 * buildBenchmarkRequestParams({
 *   query: 'quadratic equations',
 *   subject: 'maths',
 *   phase: 'secondary',
 * });
 * // Returns: { query: '...', size: 10, subject: 'maths', phase: 'secondary' }
 *
 * // KeyStage-specific filtering (for KS4-specific queries)
 * buildBenchmarkRequestParams({
 *   query: 'completing the square higher',
 *   subject: 'maths',
 *   phase: 'secondary',
 *   queryKeyStage: 'ks4',
 * });
 * // Returns: { query: '...', size: 10, subject: 'maths', keyStage: 'ks4' }
 * ```
 *
 * @see benchmark.ts
 */

import type { AllSubjectSlug, KeyStage } from '@oaknational/curriculum-sdk';
import type { Phase } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';

/**
 * Input parameters for building benchmark request.
 *
 * Uses AllSubjectSlug to support KS4 science variants (physics, chemistry, biology, combined-science).
 */
export interface BuildBenchmarkRequestInput {
  readonly query: string;
  readonly subject: AllSubjectSlug;
  readonly phase: Phase;
  readonly queryKeyStage?: KeyStage;
}

/** Request params with phase filter (expands to ks1+ks2 or ks3+ks4). */
interface PhaseFilterParams {
  readonly query: string;
  readonly size: 10;
  readonly subject: AllSubjectSlug;
  readonly phase: Phase;
}

/** Request params with specific keyStage filter. */
interface KeyStageFilterParams {
  readonly query: string;
  readonly size: 10;
  readonly subject: AllSubjectSlug;
  readonly keyStage: KeyStage;
}

/** Output type: either phase-based or keyStage-based filtering. */
export type BenchmarkRequestParams = PhaseFilterParams | KeyStageFilterParams;

/**
 * Builds search request parameters for benchmarking.
 *
 * Decision logic:
 * - If `queryKeyStage` is provided, use keyStage filter (for KS4-specific queries)
 * - Otherwise, use phase filter which correctly expands:
 *   - 'primary' → ks1 + ks2
 *   - 'secondary' → ks3 + ks4
 *
 * @param input - Query configuration including query, subject, phase, and optional keyStage
 * @returns Request parameters ready for buildLessonRrfRequest
 */
export function buildBenchmarkRequestParams(
  input: BuildBenchmarkRequestInput,
): BenchmarkRequestParams {
  const { query, subject, phase, queryKeyStage } = input;

  if (queryKeyStage) {
    return {
      query,
      size: 10,
      subject,
      keyStage: queryKeyStage,
    };
  }

  return {
    query,
    size: 10,
    subject,
    phase,
  };
}
