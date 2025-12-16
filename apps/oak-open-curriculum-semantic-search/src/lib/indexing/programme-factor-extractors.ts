/**
 * Programme factor extraction utilities for Maths KS4 vertical slice.
 *
 * Extracts tier information for KS4 filtering.
 * These fields enable precision filtering in hybrid search queries.
 *
 * Important: `programmeFactors` / `pathway` do NOT exist in the upstream API schema.
 * This module only derives values from schema-defined fields.
 *
 */

import type { SearchLessonSummary, SearchUnitSummary } from '../../types/oak';

type Summary = SearchLessonSummary | SearchUnitSummary;

/**
 * Extracts tier from lesson or unit data programme factors.
 *
 * KS4 Maths has Foundation and Higher tiers with different content difficulty.
 *
 * @param summary - Lesson or unit summary (typed SDK data)
 * @returns Tier value or undefined
 *
 * @example
 * ```typescript
 * const tier = extractTier(lessonSummary);
 * // 'foundation' | 'higher' | undefined
 * ```
 */
export function extractTier(summary: Summary): 'foundation' | 'higher' | undefined {
  /**
   * DERIVED: Tier is not explicitly present in lesson/unit summary responses.
   * We derive it from the unit slug suffix used in KS4 Maths content.
   *
   * Examples:
   * - `...-foundation` -> 'foundation'
   * - `...-higher` -> 'higher'
   */
  const slug = summary.unitSlug;
  if (slug.includes('-foundation')) {
    return 'foundation';
  }
  if (slug.includes('-higher')) {
    return 'higher';
  }
  return undefined;
}
