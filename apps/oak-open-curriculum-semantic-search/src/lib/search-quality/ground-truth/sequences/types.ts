/**
 * Sequence ground truth type definitions.
 *
 * Sequences are subject+phase combinations (e.g., "maths-primary", "science-secondary-aqa").
 * Ground truth validates that search correctly finds sequences based on:
 * - Subject names
 * - Phase (primary/secondary)
 * - Exam board (AQA, Edexcel, OCR, etc.)
 * - Key stage references
 */

/**
 * Query priority for sequence search scenarios.
 *
 * - critical: Core use case - finding sequences by subject/phase
 * - high: Common search patterns - exam boards, key stages
 * - medium: Less common but valuable - acronyms, synonyms
 * - exploratory: Future capability - complex intent queries
 */
export type SequenceQueryPriority = 'critical' | 'high' | 'medium' | 'exploratory';

/**
 * A ground truth query for sequence search with expected relevance judgments.
 */
export interface SequenceGroundTruthQuery {
  /** The search query text */
  readonly query: string;
  /** Map of sequence_slug → relevance score (3/2/1, unlisted = 0) */
  readonly expectedRelevance: Readonly<Record<string, number>>;
  /** What this test scenario validates about the search system */
  readonly description?: string;
  /** Relative importance for current system priorities */
  readonly priority?: SequenceQueryPriority;
}
