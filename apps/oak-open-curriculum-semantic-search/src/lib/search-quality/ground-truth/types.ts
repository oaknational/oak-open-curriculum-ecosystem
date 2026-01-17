/**
 * Ground truth type definitions.
 *
 * ## Outcome-Oriented Category Framework (2026-01-09)
 *
 * Categories are structured around **user outcomes** rather than technical challenges.
 * This follows the "test behavior, not implementation" principle: ground truths should
 * prove that **users get what they need from search**, not just that the system handles
 * technical edge cases.
 *
 * @see ADR-085 for category definitions and acceptance criteria
 * @see GROUND-TRUTH-PROCESS.md for creation process
 * @packageDocumentation
 */
import type { KeyStage } from '@oaknational/oak-curriculum-sdk';

/**
 * Outcome-oriented query categories for ground truth classification.
 *
 * Each category represents a **user scenario** and the **system behavior** it proves:
 *
 * | Category | User Scenario | Behavior Proved |
 * |----------|---------------|-----------------|
 * | `precise-topic` | Teacher knows curriculum terminology | Basic retrieval works |
 * | `natural-expression` | Teacher uses everyday language | System bridges vocabulary gaps |
 * | `imprecise-input` | Teacher types imperfectly (typos, truncation, wrong order) | Search is resilient — imprecise input doesn't break search |
 * | `cross-topic` | Teacher wants intersection content | System finds concept overlaps |
 *
 * ## Migration from Legacy Categories (2026-01-09)
 *
 * | Legacy Category | New Category | Notes |
 * |-----------------|--------------|-------|
 * | `naturalistic` (formal) | `precise-topic` | When using curriculum terms |
 * | `naturalistic` (informal) | `natural-expression` | When using teaching language |
 * | `synonym` | `natural-expression` | Vocabulary variance |
 * | `colloquial` | `natural-expression` | Informal phrasing |
 * | `misspelling` | `imprecise-input` | Typo tolerance |
 * | `multi-concept` | `cross-topic` | Concept intersection |
 *
 * @example
 * // Precise Topic - teacher knows the term
 * { category: 'precise-topic', query: 'quadratic equations factorising' }
 *
 * @example
 * // Natural Expression - teacher uses everyday language
 * { category: 'natural-expression', query: 'teach solving for x' }
 *
 * @example
 * // Imprecise Input - teacher makes typos
 * { category: 'imprecise-input', query: 'simulatneous equasions' }
 */
export type QueryCategory =
  | 'precise-topic'
  | 'natural-expression'
  | 'imprecise-input'
  | 'cross-topic';

/**
 * Priority weighting for test scenarios.
 *
 * Indicates relative importance for the current system's use cases:
 * - critical: Must work well - core user behaviour (typos, short queries)
 * - high: Important for good UX - common search patterns
 * - medium: Nice to have - less common but valuable scenarios
 * - exploratory: Future capability - may require NL→DSL pipeline
 */
export type QueryPriority = 'critical' | 'high' | 'medium' | 'exploratory';

/**
 * A ground truth query with expected relevance judgments.
 *
 * Ground truths prove that **users get what they need from search**. Each query
 * represents a user scenario and the behavior the system must exhibit.
 *
 * ## Design Principles
 *
 * 1. **Prove behavior, not implementation** - Query should test what users need,
 *    not what the system does internally.
 * 2. **Test ranking, not just retrieval** - Multiple relevant lessons with
 *    differentiated scores (3/2/1) test ranking quality.
 * 3. **Be realistic** - Queries should reflect how teachers actually search.
 * 4. **Have clear value** - Each query should answer "what would failure mean for users?"
 *
 * ## Acceptance Criteria by Category
 *
 * ### Precise Topic
 * - Query uses recognized curriculum terminology
 * - Expected lessons directly address the stated topic
 * - Score=3 lessons are the canonical answer
 *
 * ### Natural Expression
 * - Query reflects real teacher phrasing (read aloud test)
 * - There's a vocabulary gap between query and lesson titles
 * - Expected lessons match user INTENT, not keywords
 *
 * ### Imprecise Input
 * - Tests that imprecise input doesn't break search (resilience, not mechanism isolation)
 * - Errors are plausible (common typos, truncation, wrong word order)
 * - Correct spelling is obvious to human reader
 * - Success = relevant results appear despite imperfect input
 * - Enabled by: BM25 fuzziness + ELSER semantics + RRF combination
 *
 * ### Cross-Topic
 * - Query genuinely combines multiple distinct concepts
 * - Expected lessons span ALL mentioned concepts
 * - Score=3 lessons are true intersections
 *
 * @see IR-METRICS.md for how these fields influence metric calculation
 * @see ADR-085 for validation requirements
 */
export interface GroundTruthQuery {
  /** The search query text (3-10 words, realistic teacher phrasing) */
  readonly query: string;

  /**
   * Map of lesson_slug → relevance score.
   *
   * - **3** = Highly relevant: Lesson directly answers the query
   * - **2** = Relevant: Lesson is related and useful
   * - **1** = Marginal: Lesson is tangentially related
   *
   * Requirements:
   * - At least 2 slugs (tests ranking, not just retrieval)
   * - At least one score=3 (clear "right answer")
   * - Maximum 5 slugs (more = query too broad)
   * - Varied scores for 2+ slugs (tests ranking quality)
   */
  readonly expectedRelevance: Readonly<Record<string, number>>;

  /**
   * Category of user scenario this query represents. REQUIRED.
   *
   * @see QueryCategory for definitions and examples
   */
  readonly category: QueryCategory;

  /**
   * What this test scenario reveals/validates about system behavior. REQUIRED.
   *
   * Should answer: "What would failure of this query mean for users?"
   */
  readonly description: string;

  /**
   * Relative importance for current system priorities. REQUIRED.
   *
   * - critical: Must work well - core user behaviour
   * - high: Important for good UX - common search patterns
   * - medium: Nice to have - less common but valuable
   * - exploratory: Future capability - may require NL→DSL pipeline
   */
  readonly priority: QueryPriority;

  /** Override keyStage for KS4-specific queries within secondary phase */
  readonly keyStage?: KeyStage;
}
