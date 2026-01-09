/**
 * Tests for TypeScript type emission.
 *
 * Validates that lesson slug Sets and constants are generated
 * correctly from parsed bulk data.
 *
 * @packageDocumentation
 */

import { describe, it, expect } from 'vitest';
import {
  emitLessonSlugType,
  emitAllLessonSlugTypes,
  toPascalCase,
  type ParsedBulkData,
} from './type-emitter';

describe('type-emitter', () => {
  describe('toPascalCase', () => {
    it('converts hyphenated strings to PascalCase', () => {
      expect(toPascalCase('maths-primary')).toBe('MathsPrimary');
      expect(toPascalCase('science-secondary')).toBe('ScienceSecondary');
    });

    it('handles compound names', () => {
      expect(toPascalCase('design-technology-primary')).toBe('DesignTechnologyPrimary');
      expect(toPascalCase('cooking-nutrition-secondary')).toBe('CookingNutritionSecondary');
      expect(toPascalCase('religious-education-primary')).toBe('ReligiousEducationPrimary');
    });

    it('handles single words', () => {
      expect(toPascalCase('maths')).toBe('Maths');
      expect(toPascalCase('science')).toBe('Science');
    });

    it('handles empty string', () => {
      expect(toPascalCase('')).toBe('');
    });
  });

  describe('emitLessonSlugType', () => {
    it('generates Set and count for slugs', () => {
      const data: ParsedBulkData = {
        subject: 'maths',
        phase: 'primary',
        sequenceSlug: 'maths-primary',
        lessonSlugs: ['adding-fractions', 'subtracting-fractions', 'multiplying-fractions'],
        lessonCount: 3,
      };

      const output = emitLessonSlugType(data);

      // Should have count constant
      expect(output).toContain('export const MATHS_PRIMARY_LESSON_COUNT = 3');

      // Should have Set with slugs
      expect(output).toContain('export const MATHS_PRIMARY_LESSON_SLUGS: ReadonlySet<string>');
      expect(output).toContain("'adding-fractions'");
      expect(output).toContain("'subtracting-fractions'");
      expect(output).toContain("'multiplying-fractions'");
    });

    it('handles empty slugs array', () => {
      const data: ParsedBulkData = {
        subject: 'maths',
        phase: 'primary',
        sequenceSlug: 'maths-primary',
        lessonSlugs: [],
        lessonCount: 0,
      };

      const output = emitLessonSlugType(data);

      expect(output).toContain('export const MATHS_PRIMARY_LESSON_COUNT = 0');
      expect(output).toContain('new Set()');
    });

    it('escapes special characters in slugs', () => {
      const data: ParsedBulkData = {
        subject: 'english',
        phase: 'secondary',
        sequenceSlug: 'english-secondary',
        lessonSlugs: ["lesson's-apostrophe"],
        lessonCount: 1,
      };

      const output = emitLessonSlugType(data);

      // Single quotes in slugs should be escaped
      expect(output).toContain("'lesson\\'s-apostrophe'");
    });

    it('generates SCREAMING_SNAKE_CASE for constant names', () => {
      const data: ParsedBulkData = {
        subject: 'design-technology',
        phase: 'secondary',
        sequenceSlug: 'design-technology-secondary',
        lessonSlugs: ['test-lesson'],
        lessonCount: 1,
      };

      const output = emitLessonSlugType(data);

      expect(output).toContain('DESIGN_TECHNOLOGY_SECONDARY_LESSON_COUNT');
      expect(output).toContain('DESIGN_TECHNOLOGY_SECONDARY_LESSON_SLUGS');
    });
  });

  describe('emitAllLessonSlugTypes', () => {
    it('generates file with header and all constants', () => {
      const allData: readonly ParsedBulkData[] = [
        {
          subject: 'maths',
          phase: 'primary',
          sequenceSlug: 'maths-primary',
          lessonSlugs: ['lesson-a', 'lesson-b'],
          lessonCount: 2,
        },
        {
          subject: 'science',
          phase: 'secondary',
          sequenceSlug: 'science-secondary',
          lessonSlugs: ['lesson-c'],
          lessonCount: 1,
        },
      ];

      const output = emitAllLessonSlugTypes(allData);

      // Should have file header
      expect(output).toContain('/**');
      expect(output).toContain('Generated lesson slug validation data');
      expect(output).toContain('@generated');
      expect(output).toContain('DO NOT EDIT');

      // Should contain both Sets
      expect(output).toContain('MATHS_PRIMARY_LESSON_SLUGS');
      expect(output).toContain('SCIENCE_SECONDARY_LESSON_SLUGS');
    });

    it('generates branded type for validated slugs', () => {
      const allData: readonly ParsedBulkData[] = [
        {
          subject: 'maths',
          phase: 'primary',
          sequenceSlug: 'maths-primary',
          lessonSlugs: ['lesson-a'],
          lessonCount: 1,
        },
      ];

      const output = emitAllLessonSlugTypes(allData);

      expect(output).toContain('export type AnyLessonSlug = string & { readonly __brand:');
    });

    it('generates combined ALL_LESSON_SLUGS Set', () => {
      const allData: readonly ParsedBulkData[] = [
        {
          subject: 'maths',
          phase: 'primary',
          sequenceSlug: 'maths-primary',
          lessonSlugs: ['lesson-a'],
          lessonCount: 1,
        },
        {
          subject: 'science',
          phase: 'secondary',
          sequenceSlug: 'science-secondary',
          lessonSlugs: ['lesson-b'],
          lessonCount: 1,
        },
      ];

      const output = emitAllLessonSlugTypes(allData);

      expect(output).toContain('export const ALL_LESSON_SLUGS');
      expect(output).toContain('MATHS_PRIMARY_LESSON_SLUGS');
      expect(output).toContain('SCIENCE_SECONDARY_LESSON_SLUGS');
      expect(output).toContain('collectAllSlugs');
    });

    it('handles empty data array', () => {
      const output = emitAllLessonSlugTypes([]);

      expect(output).toContain('export type AnyLessonSlug = string & { readonly __brand:');
      expect(output).toContain('export const ALL_LESSON_SLUGS: ReadonlySet<string> = new Set()');
    });

    it('generates type guard function', () => {
      const allData: readonly ParsedBulkData[] = [
        {
          subject: 'maths',
          phase: 'primary',
          sequenceSlug: 'maths-primary',
          lessonSlugs: ['lesson-a'],
          lessonCount: 1,
        },
      ];

      const output = emitAllLessonSlugTypes(allData);

      expect(output).toContain('export function isValidLessonSlug(');
      expect(output).toContain('value is AnyLessonSlug');
      expect(output).toContain('ALL_LESSON_SLUGS.has(value)');
    });

    it('generates total count constant', () => {
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

      const output = emitAllLessonSlugTypes(allData);

      expect(output).toContain('export const TOTAL_LESSON_SLUG_COUNT = 3');
    });
  });
});
