/**
 * Tests for Zod schema emission.
 *
 * Validates that Zod schemas are generated correctly for ground truth validation.
 */

import { describe, it, expect } from 'vitest';
import { emitGroundTruthSchemas, emitSlugEnumSchema, type ParsedBulkData } from './schema-emitter';

describe('schema-emitter', () => {
  describe('emitSlugEnumSchema', () => {
    it('generates comment with slug count', () => {
      const data: ParsedBulkData = {
        subject: 'maths',
        phase: 'primary',
        sequenceSlug: 'maths-primary',
        lessonSlugs: ['lesson-a', 'lesson-b', 'lesson-c'],
        lessonCount: 3,
      };

      const output = emitSlugEnumSchema(data);

      expect(output).toContain('maths-primary: 3 lesson slugs');
      expect(output).toContain('MATHS_PRIMARY_LESSON_SLUGS');
    });

    it('handles empty slugs', () => {
      const data: ParsedBulkData = {
        subject: 'maths',
        phase: 'primary',
        sequenceSlug: 'maths-primary',
        lessonSlugs: [],
        lessonCount: 0,
      };

      const output = emitSlugEnumSchema(data);

      expect(output).toContain('maths-primary: 0 lesson slugs');
    });
  });

  describe('emitGroundTruthSchemas', () => {
    it('generates complete schema file with imports', () => {
      const output = emitGroundTruthSchemas();

      // Should have imports
      expect(output).toContain("import { typeSafeKeys } from '@oaknational/type-helpers';");
      expect(output).toContain("import { z } from 'zod';");
      expect(output).not.toContain('ALL_LESSON_SLUGS');

      // Should have file header
      expect(output).toContain('@generated');
      expect(output).toContain('DO NOT EDIT');
    });

    it('generates RelevanceScoreSchema as internal const', () => {
      const output = emitGroundTruthSchemas();

      expect(output).toContain('const RelevanceScoreSchema = z.union([');
      expect(output).not.toContain('export const RelevanceScoreSchema');
      expect(output).toContain('z.literal(1)');
      expect(output).toContain('z.literal(2)');
      expect(output).toContain('z.literal(3)');
    });

    it('generates QueryCategorySchema as internal const', () => {
      const output = emitGroundTruthSchemas();

      expect(output).toContain('const QueryCategorySchema = z.enum([');
      expect(output).not.toContain('export const QueryCategorySchema');
      expect(output).toContain("'naturalistic'");
      expect(output).toContain("'misspelling'");
      expect(output).toContain("'synonym'");
      expect(output).toContain("'multi-concept'");
      expect(output).toContain("'colloquial'");
      expect(output).toContain("'intent-based'");
    });

    it('generates QueryPrioritySchema as internal const', () => {
      const output = emitGroundTruthSchemas();

      expect(output).toContain('const QueryPrioritySchema = z.enum([');
      expect(output).not.toContain('export const QueryPrioritySchema');
      expect(output).toContain("'critical'");
      expect(output).toContain("'high'");
      expect(output).toContain("'medium'");
      expect(output).toContain("'exploratory'");
    });

    it('generates KeyStageSchema as internal const', () => {
      const output = emitGroundTruthSchemas();

      expect(output).toContain('const KeyStageSchema = z.enum([');
      expect(output).not.toContain('export const KeyStageSchema');
      expect(output).toContain("'ks1'");
      expect(output).toContain("'ks2'");
      expect(output).toContain("'ks3'");
      expect(output).toContain("'ks4'");
    });

    it('generates GroundTruthQuerySchema as internal const with validation', () => {
      const output = emitGroundTruthSchemas();

      expect(output).toContain('const GroundTruthQuerySchema = z.object({');
      expect(output).not.toContain('export const GroundTruthQuerySchema');
      expect(output).toContain('query: z.string()');
      expect(output).toContain('expectedRelevance: z.record(');
      expect(output).toContain('category: QueryCategorySchema.optional()');
      expect(output).toContain('description: z.string().optional()');
      expect(output).toContain('priority: QueryPrioritySchema.optional()');
      expect(output).toContain('keyStage: KeyStageSchema.optional()');
    });

    it('includes query length validation', () => {
      const output = emitGroundTruthSchemas();

      // Should validate query word count
      expect(output).toContain('.min(1)');
      expect(output).toContain('.refine(');
    });

    it('includes expectedRelevance non-empty validation', () => {
      const output = emitGroundTruthSchemas();

      // Should require at least one entry in expectedRelevance
      expect(output).toContain('typeSafeKeys(obj).length > 0');
    });

    it('does not generate AnyLessonSlugSchema (slug validation lives in lesson-slugs-by-subject)', () => {
      const output = emitGroundTruthSchemas();

      expect(output).not.toContain('AnyLessonSlugSchema');
    });

    it('generates validation function', () => {
      const output = emitGroundTruthSchemas();

      expect(output).toContain('export function validateGroundTruthQuery(');
      expect(output).toContain('GroundTruthQuerySchema.safeParse(');
    });

    it('does not export individual schema types (schemas are internal building blocks)', () => {
      const output = emitGroundTruthSchemas();

      expect(output).not.toContain('export type RelevanceScore');
      expect(output).not.toContain('export type QueryCategory');
      expect(output).not.toContain('export type QueryPriority');
      expect(output).not.toContain('export type KeyStage');
      expect(output).not.toContain('export type GroundTruthQuery');
    });
  });
});
