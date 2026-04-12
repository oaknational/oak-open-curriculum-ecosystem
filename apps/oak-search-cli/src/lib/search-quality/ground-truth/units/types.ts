/**
 * Ground truth type definitions for the units index.
 *
 * ## Unit Ground Truths
 *
 * Units are collections of lessons organised by topic and year. Teachers search
 * for units when planning curriculum delivery.
 *
 * Target: 2 ground truths (1 primary, 1 secondary)
 */

import type { AllSubjectSlug, KeyStage } from '@oaknational/curriculum-sdk';
import type { Phase, ExpectedRelevance } from '../types';

export type { ExpectedRelevance } from '../types';

/**
 * A ground truth entry for unit search.
 *
 * Follows the Known-Answer-First methodology:
 * 1. Find a unit with rich content (description, why_this_why_now)
 * 2. Design a realistic teacher query
 * 3. Test via the unit search RRF pipeline
 * 4. Capture top 3 results with relevance scores
 *
 * @example
 * ```typescript
 * const mathsPrimary: UnitGroundTruth = {
 *   subject: 'maths',
 *   phase: 'primary',
 *   keyStage: 'ks2',
 *   query: 'fractions year 5 adding',
 *   expectedRelevance: {
 *     'fractions-y5': 3,
 *     'fractions-equivalence': 2,
 *     'decimals-and-fractions': 2,
 *   },
 *   description: 'Unit covers adding and subtracting fractions with different denominators.',
 * };
 * ```
 */
export interface UnitGroundTruth {
  /**
   * The subject this ground truth belongs to.
   * Uses the canonical subject slug from the curriculum SDK.
   */
  readonly subject: AllSubjectSlug;

  /**
   * The phase (primary or secondary) this ground truth targets.
   */
  readonly phase: Phase;

  /**
   * The key stage for filtering.
   */
  readonly keyStage: KeyStage;

  /**
   * The natural-phrasing query a teacher would type.
   *
   * Should focus on multi-lesson concepts, planning-oriented vocabulary.
   * May include year/key stage context.
   */
  readonly query: string;

  /**
   * Expected relevance judgments for the top results.
   *
   * Maps unit slugs to relevance scores (1-3).
   * Should include 2-3 expected results for meaningful metrics.
   */
  readonly expectedRelevance: ExpectedRelevance;

  /**
   * Brief description of the unit content that informed the query design.
   *
   * This explains WHY the query should find these units.
   */
  readonly description: string;
}
