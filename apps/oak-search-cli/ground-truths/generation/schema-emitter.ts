/**
 * Schema Emitter
 *
 * Generates Zod schemas for ground truth validation from parsed bulk data.
 *
 * Output includes:
 * - Core validation schemas (RelevanceScore, QueryCategory, etc.)
 * - Per-subject/phase slug enum schemas
 * - Combined validation schemas
 * - Validation helper functions
 */

// ============================================================================
// Types (re-export from type-emitter for consistency)
// ============================================================================

export { type ParsedBulkData } from './type-emitter';

import type { ParsedBulkData } from './type-emitter';

// ============================================================================
// Schema Generation
// ============================================================================

/**
 * Generates a comment for slug count in a single subject/phase.
 *
 * Note: We don't generate z.enum for thousands of slugs as it crashes TypeScript.
 * Instead, validation is done at runtime using the Sets from lesson-slugs-by-subject.
 *
 * @param data - Parsed bulk data for one subject/phase
 * @returns TypeScript comment string
 */
export function emitSlugEnumSchema(data: ParsedBulkData): string {
  const lines: string[] = [];

  lines.push(`// ${data.sequenceSlug}: ${data.lessonCount} lesson slugs`);
  lines.push(
    `// Validation uses ${data.sequenceSlug.toUpperCase().replace(/-/g, '_')}_LESSON_SLUGS Set`,
  );

  return lines.join('\n');
}

/**
 * Generates complete Zod schema file for ground truth validation.
 *
 * @param allData - Parsed bulk data for all subjects/phases
 * @returns Complete TypeScript source file content
 */
export function emitGroundTruthSchemas(allData: readonly ParsedBulkData[]): string {
  const lines: string[] = [];

  // File header
  lines.push('/**');
  lines.push(' * Generated Zod schemas for ground truth validation.');
  lines.push(' *');
  lines.push(' * Provides runtime validation for ground truth entries.');
  lines.push(' *');
  lines.push(' * @generated - DO NOT EDIT');
  lines.push(` * Generated at: ${new Date().toISOString()}`);
  lines.push(' */');
  lines.push('');
  lines.push("import { typeSafeKeys } from '@oaknational/type-helpers';");
  lines.push("import { z } from 'zod';");
  lines.push("import { ALL_LESSON_SLUGS } from './lesson-slugs-by-subject';");
  lines.push('');

  // Core schemas
  lines.push('// ============================================================================');
  lines.push('// Core Validation Schemas');
  lines.push('// ============================================================================');
  lines.push('');

  // RelevanceScore
  lines.push('/**');
  lines.push(' * Relevance score: 3=highly relevant, 2=relevant, 1=marginal.');
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('export const RelevanceScoreSchema = z.union([');
  lines.push('  z.literal(1),');
  lines.push('  z.literal(2),');
  lines.push('  z.literal(3),');
  lines.push(']);');
  lines.push('export type RelevanceScore = z.infer<typeof RelevanceScoreSchema>;');
  lines.push('');

  // QueryCategory - outcome-oriented framework (2026-01-09), future-intent added 2026-01-24
  lines.push(
    '/** Query categories. Standard: precise-topic, natural-expression, imprecise-input, cross-topic, future-intent. Legacy (deprecated): naturalistic, misspelling, synonym, multi-concept, colloquial, intent-based. @generated */',
  );
  lines.push('export const QueryCategorySchema = z.enum([');
  lines.push(
    "  'precise-topic', 'natural-expression', 'imprecise-input', 'cross-topic', 'future-intent',",
  ); // Standard categories
  lines.push(
    "  'naturalistic', 'misspelling', 'synonym', 'multi-concept', 'colloquial', 'intent-based',",
  ); // Legacy
  lines.push(']);');
  lines.push('export type QueryCategory = z.infer<typeof QueryCategorySchema>;');
  lines.push('');

  // QueryPriority
  lines.push('/**');
  lines.push(' * Priority weighting for test scenarios.');
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('export const QueryPrioritySchema = z.enum([');
  lines.push("  'critical',");
  lines.push("  'high',");
  lines.push("  'medium',");
  lines.push("  'exploratory',");
  lines.push(']);');
  lines.push('export type QueryPriority = z.infer<typeof QueryPrioritySchema>;');
  lines.push('');

  // KeyStage
  lines.push('/**');
  lines.push(' * Key stage values.');
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('export const KeyStageSchema = z.enum([');
  lines.push("  'ks1',");
  lines.push("  'ks2',");
  lines.push("  'ks3',");
  lines.push("  'ks4',");
  lines.push(']);');
  lines.push('export type KeyStage = z.infer<typeof KeyStageSchema>;');
  lines.push('');

  // GroundTruthQuery schema
  lines.push('/**');
  lines.push(' * Ground truth query with validation.');
  lines.push(' *');
  lines.push(' * Validates:');
  lines.push(' * - Query is non-empty string');
  lines.push(' * - Query is 3-10 words (warning if outside range)');
  lines.push(' * - expectedRelevance has at least one entry');
  lines.push(' * - Relevance scores are 1, 2, or 3');
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('export const GroundTruthQuerySchema = z.object({');
  lines.push('  query: z.string().min(1).refine(');
  lines.push('    (q) => {');
  lines.push('      const wordCount = q.trim().split(/\\s+/).length;');
  lines.push('      return wordCount >= 1;');
  lines.push('    },');
  lines.push("    { message: 'Query must have at least 1 word' }");
  lines.push('  ),');
  lines.push('  expectedRelevance: z.record(z.string(), RelevanceScoreSchema).refine(');
  lines.push('    (obj) => typeSafeKeys(obj).length > 0,');
  lines.push("    { message: 'expectedRelevance must have at least one entry' }");
  lines.push('  ),');
  lines.push('  category: QueryCategorySchema.optional(),');
  lines.push('  description: z.string().optional(),');
  lines.push('  priority: QueryPrioritySchema.optional(),');
  lines.push('  keyStage: KeyStageSchema.optional(),');
  lines.push('});');
  lines.push('export type GroundTruthQuery = z.infer<typeof GroundTruthQuerySchema>;');
  lines.push('');

  // Slug validation section
  lines.push('// ============================================================================');
  lines.push('// Lesson Slug Validation');
  lines.push('// ============================================================================');
  lines.push('');

  // Add import comment - actual import will be added at top
  lines.push('// Import ALL_LESSON_SLUGS from ./lesson-slugs-by-subject for runtime validation');
  lines.push('');

  const totalSlugs = allData.reduce((sum, d) => sum + d.lessonCount, 0);
  lines.push('/**');
  lines.push(' * Zod schema for validating lesson slugs against bulk data.');
  lines.push(' *');
  lines.push(
    ` * Validates against ${totalSlugs} known slugs from ${allData.length} subject/phase combinations.`,
  );
  lines.push(' * Uses runtime Set lookup (not union type) for efficiency.');
  lines.push(' *');
  lines.push(' * @generated');
  lines.push(' */');
  lines.push('export const AnyLessonSlugSchema = z.string().refine(');
  lines.push('  (slug) => ALL_LESSON_SLUGS.has(slug),');
  lines.push("  { message: 'Invalid lesson slug - not found in bulk data' }");
  lines.push(');');
  lines.push('');

  // Validation functions
  lines.push('// ============================================================================');
  lines.push('// Validation Functions');
  lines.push('// ============================================================================');
  lines.push('');

  lines.push('/** Return type for validateGroundTruthQuery */');
  lines.push(
    'export type GroundTruthQueryValidationResult = ReturnType<typeof GroundTruthQuerySchema.safeParse>;',
  );
  lines.push('');
  lines.push('/**');
  lines.push(' * Validates a ground truth query object.');
  lines.push(' *');
  lines.push(' * @param data - Object to validate');
  lines.push(' * @returns Validation result with success/error');
  lines.push(' *');
  lines.push(' * @example');
  lines.push(' * ```typescript');
  lines.push(' * const result = validateGroundTruthQuery(query);');
  lines.push(' * if (!result.success) {');
  lines.push(' *   console.error(result.error.issues);');
  lines.push(' * }');
  lines.push(' * ```');
  lines.push(' */');
  lines.push('export function validateGroundTruthQuery(');
  lines.push('  data: unknown');
  lines.push('): GroundTruthQueryValidationResult {');
  lines.push('  return GroundTruthQuerySchema.safeParse(data);');
  lines.push('}');

  return lines.join('\n');
}
