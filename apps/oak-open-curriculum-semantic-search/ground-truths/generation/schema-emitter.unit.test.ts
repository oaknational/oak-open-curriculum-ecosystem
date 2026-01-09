/**
 * Tests for Zod schema emission.
 *
 * Validates that Zod schemas are generated correctly for ground truth validation.
 *
 * @packageDocumentation
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
      const allData: readonly ParsedBulkData[] = [
        {
          subject: 'maths',
          phase: 'primary',
          sequenceSlug: 'maths-primary',
          lessonSlugs: ['lesson-a'],
          lessonCount: 1,
        },
      ];

      const output = emitGroundTruthSchemas(allData);

      // Should have imports
      expect(output).toContain("import { z } from 'zod';");
      expect(output).toContain("import { ALL_LESSON_SLUGS } from './lesson-slugs-by-subject';");

      // Should have file header
      expect(output).toContain('@generated');
      expect(output).toContain('DO NOT EDIT');
    });

    it('generates RelevanceScoreSchema', () => {
      const output = emitGroundTruthSchemas([]);

      expect(output).toContain('export const RelevanceScoreSchema = z.union([');
      expect(output).toContain('z.literal(1)');
      expect(output).toContain('z.literal(2)');
      expect(output).toContain('z.literal(3)');
      expect(output).toContain(
        'export type RelevanceScore = z.infer<typeof RelevanceScoreSchema>;',
      );
    });

    it('generates QueryCategorySchema', () => {
      const output = emitGroundTruthSchemas([]);

      expect(output).toContain('export const QueryCategorySchema = z.enum([');
      expect(output).toContain("'naturalistic'");
      expect(output).toContain("'misspelling'");
      expect(output).toContain("'synonym'");
      expect(output).toContain("'multi-concept'");
      expect(output).toContain("'colloquial'");
      expect(output).toContain("'intent-based'");
    });

    it('generates QueryPrioritySchema', () => {
      const output = emitGroundTruthSchemas([]);

      expect(output).toContain('export const QueryPrioritySchema = z.enum([');
      expect(output).toContain("'critical'");
      expect(output).toContain("'high'");
      expect(output).toContain("'medium'");
      expect(output).toContain("'exploratory'");
    });

    it('generates KeyStageSchema', () => {
      const output = emitGroundTruthSchemas([]);

      expect(output).toContain('export const KeyStageSchema = z.enum([');
      expect(output).toContain("'ks1'");
      expect(output).toContain("'ks2'");
      expect(output).toContain("'ks3'");
      expect(output).toContain("'ks4'");
    });

    it('generates GroundTruthQuerySchema with validation', () => {
      const output = emitGroundTruthSchemas([]);

      expect(output).toContain('export const GroundTruthQuerySchema = z.object({');
      expect(output).toContain('query: z.string()');
      expect(output).toContain('expectedRelevance: z.record(');
      expect(output).toContain('category: QueryCategorySchema.optional()');
      expect(output).toContain('description: z.string().optional()');
      expect(output).toContain('priority: QueryPrioritySchema.optional()');
      expect(output).toContain('keyStage: KeyStageSchema.optional()');
    });

    it('includes query length validation', () => {
      const output = emitGroundTruthSchemas([]);

      // Should validate query word count
      expect(output).toContain('.min(1)');
      expect(output).toContain('.refine(');
    });

    it('includes expectedRelevance non-empty validation', () => {
      const output = emitGroundTruthSchemas([]);

      // Should require at least one entry in expectedRelevance
      expect(output).toContain('Object.keys(obj).length > 0');
    });

    it('generates AnyLessonSlugSchema with runtime validation', () => {
      const allData: readonly ParsedBulkData[] = [
        {
          subject: 'maths',
          phase: 'primary',
          sequenceSlug: 'maths-primary',
          lessonSlugs: ['lesson-m'],
          lessonCount: 1,
        },
        {
          subject: 'science',
          phase: 'secondary',
          sequenceSlug: 'science-secondary',
          lessonSlugs: ['lesson-s'],
          lessonCount: 1,
        },
      ];

      const output = emitGroundTruthSchemas(allData);

      // Should use z.string().refine() for runtime validation
      expect(output).toContain('export const AnyLessonSlugSchema = z.string().refine(');
      expect(output).toContain('ALL_LESSON_SLUGS.has(slug)');
      expect(output).toContain('Invalid lesson slug');
    });

    it('generates validation function', () => {
      const output = emitGroundTruthSchemas([]);

      expect(output).toContain('export function validateGroundTruthQuery(');
      expect(output).toContain('GroundTruthQuerySchema.safeParse(');
    });

    it('includes slug count in AnyLessonSlugSchema comment', () => {
      const allData: readonly ParsedBulkData[] = [
        {
          subject: 'maths',
          phase: 'primary',
          sequenceSlug: 'maths-primary',
          lessonSlugs: ['a', 'b'],
          lessonCount: 2,
        },
        {
          subject: 'science',
          phase: 'secondary',
          sequenceSlug: 'science-secondary',
          lessonSlugs: ['c'],
          lessonCount: 1,
        },
      ];

      const output = emitGroundTruthSchemas(allData);

      expect(output).toContain('3 known slugs');
      expect(output).toContain('2 subject/phase combinations');
    });
  });
});
