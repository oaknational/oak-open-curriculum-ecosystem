/**
 * Ground truth type definitions.
 */
import type { KeyStage } from '@oaknational/oak-curriculum-sdk';

/**
 * Query categories for test scenario classification.
 *
 * Used to group queries by the challenge they present to the search system.
 */
export type QueryCategory =
  | 'naturalistic'
  | 'misspelling'
  | 'synonym'
  | 'multi-concept'
  | 'colloquial'
  | 'intent-based';

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
 */
export interface GroundTruthQuery {
  /** The search query text */
  readonly query: string;
  /** Map of lesson_slug → relevance score (3/2/1, unlisted = 0) */
  readonly expectedRelevance: Readonly<Record<string, number>>;
  /** Category of challenge this query presents */
  readonly category?: QueryCategory;
  /** What this test scenario reveals/validates about the search system */
  readonly description?: string;
  /** Relative importance for current system priorities */
  readonly priority?: QueryPriority;
  /** Override keyStage for KS4-specific queries within secondary phase */
  readonly keyStage?: KeyStage;
}
