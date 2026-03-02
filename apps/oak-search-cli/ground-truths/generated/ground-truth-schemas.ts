/**
 * Generated Zod schemas for ground truth validation.
 *
 * Provides runtime validation for ground truth entries.
 *
 * @generated - DO NOT EDIT
 * Generated at: 2026-02-28T19:15:37.438Z
 */

/* eslint-disable no-restricted-properties */
// Object.keys is used by Zod refinements

import { z } from 'zod';
import { ALL_LESSON_SLUGS } from './lesson-slugs-by-subject';

// ============================================================================
// Core Validation Schemas
// ============================================================================

/**
 * Relevance score: 3=highly relevant, 2=relevant, 1=marginal.
 *
 * @generated
 */
export const RelevanceScoreSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
export type RelevanceScore = z.infer<typeof RelevanceScoreSchema>;

/** Query categories. Standard: precise-topic, natural-expression, imprecise-input, cross-topic, future-intent. Legacy (deprecated): naturalistic, misspelling, synonym, multi-concept, colloquial, intent-based. @generated */
export const QueryCategorySchema = z.enum([
  'precise-topic', 'natural-expression', 'imprecise-input', 'cross-topic', 'future-intent',
  'naturalistic', 'misspelling', 'synonym', 'multi-concept', 'colloquial', 'intent-based',
]);
export type QueryCategory = z.infer<typeof QueryCategorySchema>;

/**
 * Priority weighting for test scenarios.
 *
 * @generated
 */
export const QueryPrioritySchema = z.enum([
  'critical',
  'high',
  'medium',
  'exploratory',
]);
export type QueryPriority = z.infer<typeof QueryPrioritySchema>;

/**
 * Key stage values.
 *
 * @generated
 */
export const KeyStageSchema = z.enum([
  'ks1',
  'ks2',
  'ks3',
  'ks4',
]);
export type KeyStage = z.infer<typeof KeyStageSchema>;

/**
 * Ground truth query with validation.
 *
 * Validates:
 * - Query is non-empty string
 * - Query is 3-10 words (warning if outside range)
 * - expectedRelevance has at least one entry
 * - Relevance scores are 1, 2, or 3
 *
 * @generated
 */
export const GroundTruthQuerySchema = z.object({
  query: z.string().min(1).refine(
    (q) => {
      const wordCount = q.trim().split(/\s+/).length;
      return wordCount >= 1;
    },
    { message: 'Query must have at least 1 word' }
  ),
  expectedRelevance: z.record(z.string(), RelevanceScoreSchema).refine(
    (obj) => Object.keys(obj).length > 0,
    { message: 'expectedRelevance must have at least one entry' }
  ),
  category: QueryCategorySchema.optional(),
  description: z.string().optional(),
  priority: QueryPrioritySchema.optional(),
  keyStage: KeyStageSchema.optional(),
});
export type GroundTruthQuery = z.infer<typeof GroundTruthQuerySchema>;

// ============================================================================
// Lesson Slug Validation
// ============================================================================

// Import ALL_LESSON_SLUGS from ./lesson-slugs-by-subject for runtime validation

/**
 * Zod schema for validating lesson slugs against bulk data.
 *
 * Validates against 12391 known slugs from 30 subject/phase combinations.
 * Uses runtime Set lookup (not union type) for efficiency.
 *
 * @generated
 */
export const AnyLessonSlugSchema = z.string().refine(
  (slug) => ALL_LESSON_SLUGS.has(slug),
  { message: 'Invalid lesson slug - not found in bulk data' }
);

// ============================================================================
// Validation Functions
// ============================================================================

/** Return type for validateGroundTruthQuery */
export type GroundTruthQueryValidationResult = ReturnType<typeof GroundTruthQuerySchema.safeParse>;

/**
 * Validates a ground truth query object.
 *
 * @param data - Object to validate
 * @returns Validation result with success/error
 *
 * @example
 * ```typescript
 * const result = validateGroundTruthQuery(query);
 * if (!result.success) {
 *   console.error(result.error.issues);
 * }
 * ```
 */
export function validateGroundTruthQuery(
  data: unknown
): GroundTruthQueryValidationResult {
  return GroundTruthQuerySchema.safeParse(data);
}