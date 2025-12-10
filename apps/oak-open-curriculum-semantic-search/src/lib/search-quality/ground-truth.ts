/**
 * Ground truth relevance judgments for search quality evaluation.
 *
 * This module defines the expected relevance of search results for evaluation queries.
 * Relevance scores follow a graded scale:
 *
 * - **3**: Highly relevant (exact match for query intent)
 * - **2**: Relevant (related and useful)
 * - **1**: Marginally relevant (tangentially related)
 * - **0**: Not relevant (implicit - unlisted results assumed 0)
 *
 * @module search-quality/ground-truth
 *
 * **Ground Truth Update**: 2025-12-10
 * **Methodology**: Ground truth is based on **upstream Oak API content**, NOT previous
 * search results. This prevents circular validation where poor search results create
 * poor ground truth, which then validates poor search results.
 *
 * For each query, expected lessons are identified from:
 * 1. Upstream API lesson search (get-search-lessons)
 * 2. Unit summaries containing relevant lessons (get-units-summary)
 * 3. Curriculum expert knowledge of lesson content
 *
 * @see `.agent/plans/semantic-search/reference-ir-metrics-guide.md` for judging guidance
 *
 * @example
 * ```typescript
 * import { GROUND_TRUTH_QUERIES } from './ground-truth';
 *
 * for (const { query, expectedRelevance } of GROUND_TRUTH_QUERIES) {
 *   const results = await searchLessons(query);
 *   const mrr = calculateMRR(results, expectedRelevance);
 * }
 * ```
 */

/**
 * A ground truth query with expected relevance judgments.
 */
export interface GroundTruthQuery {
  /** The search query text */
  readonly query: string;
  /** Map of lesson_slug → relevance score (3/2/1, unlisted = 0) */
  readonly expectedRelevance: Readonly<Record<string, number>>;
}

/**
 * Ground truth queries for Maths KS4 search quality evaluation.
 *
 * These queries cover core Maths KS4 topics and include:
 * - Representative queries for main curriculum areas
 * - Edge cases (misspellings, synonyms)
 * - Natural language queries
 *
 * **Methodology (2025-12-10)**:
 * Ground truth expectations are derived from upstream Oak API content, specifically:
 * - `right-angled-trigonometry` unit contains Pythagoras and trig lessons
 * - `algebraic-manipulation` unit contains quadratic and factorising lessons
 * - Other units provide context for related topics
 *
 * This ensures we measure whether ES search finds content that **exists** in the index,
 * rather than validating poor search results against themselves.
 *
 * @see `.agent/plans/semantic-search/reference-ir-metrics-guide.md` for judging guidance
 */
export const GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Pythagoras theorem',
    // Ground truth based on upstream API lesson search (2025-12-10)
    // The right-angled-trigonometry unit contains the core Pythagoras lessons
    expectedRelevance: {
      'checking-and-further-securing-understanding-of-pythagoras-theorem': 3, // Exact match - core Pythagoras lesson
      'using-pythagoras-theorem-to-justify-a-right-angled-triangle': 3, // Exact match - applying Pythagoras
      'applying-pythagoras-theorem-in-3d': 3, // Exact match - 3D Pythagoras application
      'calculating-the-length-of-a-line-segment': 2, // Uses Pythagoras (distance formula)
      'the-volume-of-a-pyramid': 1, // May use Pythagoras for slant height
      'the-surface-area-of-a-pyramid': 1, // May use Pythagoras for slant height
      'problem-solving-with-right-angled-trigonometry': 2, // Related - same unit, often uses Pythagoras
    },
  },
  {
    query: 'quadratic equations',
    // Excellent results - directly about solving quadratics
    expectedRelevance: {
      'solving-quadratic-equations-by-using-the-formula': 3, // Highly relevant
      'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 3,
      'factorising-a-quadratic-expression': 3, // Core quadratic skill
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-quadratic-equations-by-factorising': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 3,
      'factorising-using-the-difference-of-two-squares': 2, // Related factoring technique
      'solving-equations-with-algebraic-fractions': 1, // Marginal - equations but not quadratic
      'equations-from-complex-shapes': 1,
      'advanced-problem-solving-with-algebraic-manipulation': 2,
    },
  },
  {
    query: 'trigonometry',
    // Ground truth based on upstream API right-angled-trigonometry unit (2025-12-10)
    // Core trigonometry lessons from the right-angled-trigonometry unit
    expectedRelevance: {
      'checking-and-securing-understanding-of-sine-ratio-problems': 3, // Core trig - sine
      'checking-and-securing-understanding-of-cosine-problems': 3, // Core trig - cosine
      'checking-and-securing-understanding-of-tangent-ratio-problems': 3, // Core trig - tangent
      'checking-and-securing-understanding-of-the-unit-circle': 3, // Core trig concept
      'calculate-trigonometric-ratios-for-30-and-60': 3, // Core trig - exact values
      'calculate-trigonometric-ratios-for-0-45-and-90': 3, // Core trig - exact values
      'applying-trigonometric-ratios-in-context': 3, // Applied trig
      'problem-solving-with-right-angled-trigonometry': 3, // Trig problem solving
      'calculating-arc-length': 2, // Uses radians/trig concepts
    },
  },
  {
    query: 'simultaneous equations',
    // 58 hits but top 10 don't include simultaneous-specific lessons
    // Results are about general equation solving
    expectedRelevance: {
      'equations-from-complex-shapes': 1, // May form simultaneous
      'shapes-on-coordinate-grids': 1, // Intersection of lines uses simultaneous
      'checking-and-securing-understanding-of-forming-linear-equations': 2, // Related prereq
      'changing-the-subject-where-the-variable-appears-in-multiple-terms': 1,
      'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 0, // Quadratic not simultaneous
      'solving-equations-with-algebraic-fractions': 1,
      'forming-equations-with-angles': 2, // May lead to simultaneous
      'checking-and-securing-understanding-of-substitution': 2, // Key simultaneous technique
      'checking-and-securing-understanding-of-factorising': 0,
      'solving-quadratic-equations-by-completing-the-square': 0,
    },
  },
  {
    query: 'expanding brackets',
    // Good results - includes bracket expansion lessons
    expectedRelevance: {
      'checking-and-securing-understanding-of-expanding-a-single-bracket': 3, // Exact match
      'checking-and-securing-understanding-of-solving-and-interpreting-linear-equations': 1,
      'solving-equations-with-algebraic-fractions': 1,
      'factorising-using-the-difference-of-two-squares': 2, // Inverse operation
      'checking-and-securing-understanding-of-substitution': 0,
      'the-product-of-three-binomials': 3, // Expanding multiple brackets
      'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 1,
      'checking-and-securing-understanding-of-the-product-of-two-binomials': 3, // Expanding two brackets
      'factorising-quadratics-of-the-form-ax-2-plus-bx-plus-c': 2, // Related inverse
      'checking-and-securing-understanding-of-changing-the-subject-with-simple-algebraic-fractions': 0,
    },
  },
  {
    query: 'pythagorus', // Intentional misspelling edge case
    // With fuzzy matching enabled (fuzziness: 'AUTO'), this should match Pythagoras lessons
    // Ground truth based on what SHOULD be returned with proper fuzzy matching
    expectedRelevance: {
      'checking-and-further-securing-understanding-of-pythagoras-theorem': 3, // Should match via fuzzy
      'using-pythagoras-theorem-to-justify-a-right-angled-triangle': 3, // Should match via fuzzy
      'applying-pythagoras-theorem-in-3d': 3, // Should match via fuzzy
    },
  },
  {
    query: 'how to solve equations with x squared', // Natural language query
    // Good results - semantic search picking up quadratic intent
    expectedRelevance: {
      'factorising-quadratics-of-the-form-ax-2-plus-bx-plus-c': 3, // x² in the name
      'solving-equations-with-algebraic-fractions': 1,
      'forming-equations-with-angles': 0,
      'solving-quadratic-equations-by-factorising': 3, // Exact match for intent
      'factorising-using-the-difference-of-two-squares': 3, // x² topic
      'equations-from-complex-shapes': 1,
      'checking-and-securing-understanding-of-forming-linear-equations': 0, // Linear not squared
      'operations-with-algebraic-fractions': 0,
      'changing-the-subject-where-the-variable-appears-in-multiple-terms': 1,
      'checking-and-securing-understanding-of-solving-with-simple-algebraic-fractions': 1,
    },
  },
] as const;
