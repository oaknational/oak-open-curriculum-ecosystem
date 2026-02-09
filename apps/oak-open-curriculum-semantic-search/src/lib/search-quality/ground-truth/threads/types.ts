/**
 * Ground truth type definitions for the threads index.
 *
 * ## Thread Ground Truths
 *
 * Threads represent curriculum progressions (predominantly Maths). They show
 * how concepts develop across years and key stages.
 *
 * The index has ~164 documents, requiring high precision.
 *
 * Target: 1 ground truth (Maths progression)
 *
 * @packageDocumentation
 */

import type { AllSubjectSlug } from '@oaknational/oak-curriculum-sdk';
import type { ExpectedRelevance } from '../types';

export type { RelevanceScore, ExpectedRelevance } from '../types';

/**
 * A ground truth entry for thread search.
 *
 * Follows the Known-Answer-First methodology:
 * 1. Explore available threads in bulk data
 * 2. Design a realistic teacher query for curriculum progression
 * 3. Test via the thread search RRF pipeline
 * 4. Capture top 3 results with relevance scores
 *
 * @example
 * const mathsAlgebra: ThreadGroundTruth = {
 *   subject: 'maths',
 *   query: 'algebra equations progression',
 *   expectedRelevance: {
 *     'algebra-equations': 3,
 *     'algebra-expressions': 2,
 *     'algebra-graphs': 2,
 *   },
 *   description: 'Thread covering algebraic equations progression across years.',
 * };
 */
export interface ThreadGroundTruth {
  /**
   * The subject this ground truth belongs to.
   *
   * Note: Threads are predominantly Maths. This field may be optional
   * if threads span multiple subjects.
   */
  readonly subject: AllSubjectSlug;

  /**
   * The natural-phrasing query a teacher would type.
   *
   * Should focus on conceptual progression (not single lessons).
   * May use curriculum vocabulary: "strand", "progression", "thread".
   */
  readonly query: string;

  /**
   * Expected relevance judgments for the top results.
   *
   * Maps thread slugs to relevance scores (1-3).
   * Should include 2-3 expected results for meaningful metrics.
   */
  readonly expectedRelevance: ExpectedRelevance;

  /**
   * Brief description of the thread content that informed the query design.
   *
   * This explains WHY the query should find these threads.
   */
  readonly description: string;
}
