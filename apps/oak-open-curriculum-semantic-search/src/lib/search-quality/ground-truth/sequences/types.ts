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
 * A ground truth query for sequence search with expected relevance judgments.
 */
export interface SequenceGroundTruthQuery {
  /** The search query text */
  readonly query: string;
  /** Map of sequence_slug → relevance score (3/2/1, unlisted = 0) */
  readonly expectedRelevance: Readonly<Record<string, number>>;
  /** What this test scenario validates about the search system */
  readonly description?: string;
}
