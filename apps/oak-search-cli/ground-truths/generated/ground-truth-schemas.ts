/**
 * Generated Zod schemas for ground truth validation.
 *
 * Provides runtime validation for ground truth entries.
 *
 * @generated - DO NOT EDIT
 * Generated at: 2026-04-02T14:20:30.829Z
 */

import { typeSafeKeys } from '@oaknational/type-helpers';
import { z } from 'zod';
// ============================================================================
// Core Validation Schemas
// ============================================================================

/**
 * Relevance score: 3=highly relevant, 2=relevant, 1=marginal.
 *
 * @generated
 */
const RelevanceScoreSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

/** Query categories. Standard: precise-topic, natural-expression, imprecise-input, cross-topic, future-intent. Legacy (deprecated): naturalistic, misspelling, synonym, multi-concept, colloquial, intent-based. @generated */
const QueryCategorySchema = z.enum([
  'precise-topic', 'natural-expression', 'imprecise-input', 'cross-topic', 'future-intent',
  'naturalistic', 'misspelling', 'synonym', 'multi-concept', 'colloquial', 'intent-based',
]);

/**
 * Priority weighting for test scenarios.
 *
 * @generated
 */
const QueryPrioritySchema = z.enum([
  'critical',
  'high',
  'medium',
  'exploratory',
]);

/**
 * Key stage values.
 *
 * @generated
 */
const KeyStageSchema = z.enum([
  'ks1',
  'ks2',
  'ks3',
  'ks4',
]);

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
const GroundTruthQuerySchema = z.object({
  query: z.string().min(1).refine(
    (q) => {
      const wordCount = q.trim().split(/\s+/).length;
      return wordCount >= 1;
    },
    { message: 'Query must have at least 1 word' }
  ),
  expectedRelevance: z.record(z.string(), RelevanceScoreSchema).refine(
    (obj) => typeSafeKeys(obj).length > 0,
    { message: 'expectedRelevance must have at least one entry' }
  ),
  category: QueryCategorySchema.optional(),
  description: z.string().optional(),
  priority: QueryPrioritySchema.optional(),
  keyStage: KeyStageSchema.optional(),
});

// ============================================================================
// Validation Functions
// ============================================================================

/** Return type for validateGroundTruthQuery */
type GroundTruthQueryValidationResult = ReturnType<typeof GroundTruthQuerySchema.safeParse>;

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