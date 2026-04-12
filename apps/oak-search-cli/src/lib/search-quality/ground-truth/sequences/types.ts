/**
 * Ground truth type definitions for the sequences index.
 *
 * ## Sequence Ground Truths
 *
 * Sequences are API data structures for curriculum retrieval -- a pragmatic
 * grouping of units by subject and phase (e.g., "maths-primary"). They are
 * not user-facing programmes; one sequence can generate many programme views.
 * The index has only ~30 documents, so sequences may be better served by
 * navigation/filters than search.
 *
 * Target: 1 ground truth (validates search mechanism works)
 */

import type { AllSubjectSlug } from '@oaknational/curriculum-sdk';
import type { Phase, ExpectedRelevance } from '../types';

export type { ExpectedRelevance } from '../types';

/**
 * A ground truth entry for sequence search.
 *
 * Follows the Known-Answer-First methodology:
 * 1. List available sequences
 * 2. Consider whether teachers would search or navigate to this
 * 3. Design a realistic query if search is plausible
 * 4. Capture top 3 results with relevance scores
 *
 * @example
 * ```typescript
 * const mathsSecondary: SequenceGroundTruth = {
 *   subject: 'maths',
 *   phase: 'secondary',
 *   query: 'secondary mathematics curriculum',
 *   expectedRelevance: {
 *     'maths-secondary': 3,
 *   },
 *   description: 'The complete secondary mathematics programme.',
 * };
 * ```
 */
export interface SequenceGroundTruth {
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
   * The natural-phrasing query a teacher would type.
   *
   * Should focus on programme/curriculum level vocabulary.
   * May include "programme", "curriculum", "sequence".
   */
  readonly query: string;

  /**
   * Expected relevance judgments for the top results.
   *
   * Maps sequence slugs to relevance scores (1-3).
   * Given the tiny index, may only have 1-2 expected results.
   */
  readonly expectedRelevance: ExpectedRelevance;

  /**
   * Brief description of the sequence content that informed the query design.
   *
   * This explains WHY the query should find these sequences.
   */
  readonly description: string;
}
