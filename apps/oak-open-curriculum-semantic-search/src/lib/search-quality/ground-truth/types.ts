/**
 * Ground truth type definitions.
 *
 * ## Architecture (2026-01-19)
 *
 * Ground truths are split into two files with different lifecycles:
 * - **Query files** (*.query.ts): Define what we're testing. Change rarely.
 * - **Expected files** (*.expected.ts): Define current "answer key". Change when curriculum updates.
 *
 * This separation:
 * - Enforces independent discovery in GT review protocol (agent reads query, not expected)
 * - Enables independent versioning (queries vs expectations)
 * - Makes PRs clearer ("added query" vs "updated expectations")
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

// ============================================================================
// New Split Architecture (2026-01-19)
// ============================================================================

/**
 * Query definition — lives in *.query.ts files.
 *
 * Contains only the query metadata, NOT the expected results.
 * This enables the GT review protocol where agents discover candidates
 * independently before seeing expected slugs.
 */
export interface GroundTruthQueryDefinition {
  /** The search query text (3-10 words, realistic teacher phrasing) */
  readonly query: string;

  /**
   * Category of user scenario this query represents.
   *
   * @see QueryCategory for definitions and examples
   */
  readonly category: QueryCategory;

  /**
   * What this test scenario reveals/validates about system behavior.
   *
   * Should answer: "What would failure of this query mean for users?"
   */
  readonly description: string;

  /**
   * Relative path to the expected relevance file.
   *
   * Convention: `./${category}.expected.ts`
   */
  readonly expectedFile: string;

  /** Override keyStage for KS4-specific queries within secondary phase */
  readonly keyStage?: KeyStage;
}

/**
 * Expected relevance judgments — lives in *.expected.ts files.
 *
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
export type ExpectedRelevance = Readonly<Record<string, number>>;

// ============================================================================
// Combined Type (Runtime Assembly)
// ============================================================================

/**
 * A ground truth query with expected relevance judgments.
 *
 * This type is assembled at runtime by combining:
 * - `GroundTruthQueryDefinition` (from *.query.ts files)
 * - `ExpectedRelevance` (from *.expected.ts files)
 *
 * The split architecture enables:
 * - Independent discovery in GT review protocol (agent reads query, not expected)
 * - Independent versioning (queries vs expectations)
 * - Cleaner PRs ("added query" vs "updated expectations")
 *
 * @see GroundTruthQueryDefinition for query-only metadata
 * @see ExpectedRelevance for expected relevance scores
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
   */
  readonly expectedRelevance: ExpectedRelevance;

  /**
   * Category of user scenario this query represents.
   *
   * @see QueryCategory for definitions and examples
   */
  readonly category: QueryCategory;

  /**
   * What this test scenario reveals/validates about system behavior.
   *
   * Should answer: "What would failure of this query mean for users?"
   */
  readonly description: string;

  /** Override keyStage for KS4-specific queries within secondary phase */
  readonly keyStage?: KeyStage;
}

/**
 * Combine a query definition and expected relevance into a GroundTruthQuery.
 *
 * This is the canonical way to assemble a complete ground truth entry
 * from the split files.
 *
 * @param queryDef - The query definition from *.query.ts
 * @param expected - The expected relevance from *.expected.ts
 * @returns A complete GroundTruthQuery
 */
export function combineGroundTruth(
  queryDef: GroundTruthQueryDefinition,
  expected: ExpectedRelevance,
): GroundTruthQuery {
  return {
    query: queryDef.query,
    category: queryDef.category,
    description: queryDef.description,
    expectedRelevance: expected,
    ...(queryDef.keyStage ? { keyStage: queryDef.keyStage } : {}),
  };
}
