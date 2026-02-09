/**
 * Ground truth type definitions for the foundational ground truths approach.
 *
 * ## Approach (2026-02-05)
 *
 * One ground truth per subject-phase pair (~33 total), each with:
 * - A natural teacher query
 * - The top 3 expected results with relevance scores
 *
 * The goal: **"Does search help teachers find what they need?"**
 *
 * ## Known-Answer-First Methodology
 *
 * 1. Find a rich unit (5+ lessons) in bulk data
 * 2. Pick a lesson and extract ALL data
 * 3. Summarise the lesson content
 * 4. Design a query around the summary (NOT title alone)
 * 5. Run the query against search
 * 6. Capture top 3 results with relevance scores
 * 7. Lock in or iterate
 *
 * @see semantic-search.prompt.md for the full protocol
 * @see ground-truth-redesign-plan.md for the strategy
 * @packageDocumentation
 */
import type { AllSubjectSlug, KeyStage } from '@oaknational/oak-curriculum-sdk';

/**
 * Valid phase values for ground truth organisation.
 *
 * - **primary**: KS1 + KS2 (Years 1-6)
 * - **secondary**: KS3 + KS4 (Years 7-11)
 */
export type Phase = 'primary' | 'secondary';

/**
 * Relevance score for expected results.
 *
 * - **3**: Highly relevant — the target lesson or equally good
 * - **2**: Relevant — useful for the query, reasonable result
 * - **1**: Marginally relevant — somewhat related but not ideal
 */
export type RelevanceScore = 1 | 2 | 3;

/**
 * Expected relevance judgments for search results.
 *
 * Maps lesson slugs to their relevance scores (1-3).
 * Used by the benchmark system to calculate MRR, NDCG, Precision, Recall.
 */
export type ExpectedRelevance = Readonly<Record<string, RelevanceScore>>;

/**
 * A foundational ground truth entry.
 *
 * Each subject-phase pair has exactly one ground truth with:
 * - A natural teacher query
 * - The top 3 expected results with relevance scores
 *
 * The goal is to prove baseline search quality across the curriculum.
 *
 * @example
 * const mathsSecondary: LessonGroundTruth = {
 *   subject: 'maths',
 *   phase: 'secondary',
 *   keyStage: 'ks3',
 *   query: 'equations unknowns on both sides',
 *   expectedRelevance: {
 *     'rearranging-to-solve-linear-equations': 3,
 *     'solving-two-step-linear-equations': 2,
 *     'forming-and-solving-equations': 2,
 *   },
 *   description: 'Lesson teaches that equations with unknowns on both sides can be manipulated by collecting like terms onto one side.',
 * };
 */
export interface LessonGroundTruth {
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
   * The key stage for filtering. Secondary subjects may be KS3 or KS4.
   */
  readonly keyStage: KeyStage;

  /**
   * The natural-phrasing query a teacher would type.
   *
   * Must NOT match on lesson title alone.
   * Must reflect natural teacher search behaviour.
   */
  readonly query: string;

  /**
   * Expected relevance judgments for the top results.
   *
   * Maps lesson slugs to relevance scores (1-3).
   * Should include 2-3 expected results for meaningful metrics.
   */
  readonly expectedRelevance: ExpectedRelevance;

  /**
   * Brief description of the lesson content that informed the query design.
   *
   * This explains WHY the query should find these lessons.
   */
  readonly description: string;
}

/**
 * All subject-phase pairs that need ground truths.
 *
 * Based on the curriculum structure:
 * - Primary: ~15 subjects
 * - Secondary: ~18 subjects (including KS4 science variants)
 * - Total: ~33 ground truths
 */
export interface SubjectPhasePair {
  readonly subject: AllSubjectSlug;
  readonly phase: Phase;
}

/**
 * A subject-phase key created by {@link subjectPhaseKey}.
 *
 * Preserves type information rather than widening to `string`.
 */
export type SubjectPhaseKey = `${AllSubjectSlug}-${Phase}`;

/**
 * Create a unique key for a subject-phase pair.
 *
 * @param subject - The subject slug
 * @param phase - The phase (primary or secondary)
 * @returns A unique key like "maths-secondary"
 */
export function subjectPhaseKey<S extends AllSubjectSlug, P extends Phase>(
  subject: S,
  phase: P,
): `${S}-${P}` {
  return `${subject}-${phase}`;
}
