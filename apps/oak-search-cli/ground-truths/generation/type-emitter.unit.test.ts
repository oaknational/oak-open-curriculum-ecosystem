/**
 * Tests for TypeScript type emission.
 *
 * Validates that lesson slug Sets and constants are generated
 * correctly from parsed bulk data.
 */

import { describe, it, expect } from 'vitest';
import {
  buildLessonSlugDataset,
  emitLessonSlugType,
  emitAllLessonSlugTypes,
  emitLessonSlugDatasetTypes,
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

      // Should have Set loader
      expect(output).toContain('export const MATHS_PRIMARY_LESSON_SLUGS: ReadonlySet<string>');
      expect(output).toContain("createLessonSlugSet('maths-primary')");
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
      expect(output).toContain("createLessonSlugSet('maths-primary')");
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

  describe('buildLessonSlugDataset', () => {
    it('builds JSON-friendly dataset metadata', () => {
      const dataset = buildLessonSlugDataset([
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
      ]);

      expect(dataset.sequenceOrder).toEqual(['maths-primary', 'science-secondary']);
      expect(dataset.totalLessonSlugCount).toBe(3);
      expect(dataset.allLessonSlugs).toEqual(['lesson-a', 'lesson-b', 'lesson-c']);
      expect(dataset.sequences['maths-primary']).toEqual({
        subject: 'maths',
        phase: 'primary',
        sequenceSlug: 'maths-primary',
        lessonCount: 2,
        lessonSlugs: ['lesson-a', 'lesson-b'],
      });
    });
  });

  describe('emitLessonSlugDatasetTypes', () => {
    it('generates dataset type interfaces', () => {
      const output = emitLessonSlugDatasetTypes();

      expect(output).toContain('export interface LessonSlugDatasetSequenceData');
      expect(output).toContain('export interface LessonSlugDataset');
      expect(output).toContain('readonly allLessonSlugs: readonly string[];');
      expect(output).toContain(
        'readonly sequences: Readonly<Record<string, LessonSlugDatasetSequenceData>>;',
      );
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
      expect(output).toContain(
        "import rawLessonSlugData from './lesson-slugs-by-subject.data.json';",
      );
      expect(output).toContain("import { typeSafeEntries } from '@oaknational/type-helpers';");
      expect(output).toContain(
        "import type { LessonSlugDataset, LessonSlugDatasetSequenceData } from './lesson-slugs-by-subject.types.js';",
      );

      expect(output).toContain('function getSequenceData(sequenceSlug: string)');
    });

    it('does not export branded type or type guard (unused by consumers)', () => {
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

      expect(output).not.toContain('AnyLessonSlug');
      expect(output).not.toContain('isValidLessonSlug');
      expect(output).toContain('function parseLessonSlugPhase(');
      expect(output).toContain('const lessonSlugData = loadLessonSlugData();');
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
      expect(output).toContain('new Set(lessonSlugData.allLessonSlugs)');
      expect(output).toContain('function getSequenceData(sequenceSlug: string)');
    });

    it('handles empty data array', () => {
      const output = emitAllLessonSlugTypes([]);

      expect(output).toContain(
        'export const ALL_LESSON_SLUGS: ReadonlySet<string> = new Set(lessonSlugData.allLessonSlugs)',
      );
      expect(output).not.toContain('AnyLessonSlug');
    });

    it('keeps SLUG_TO_SUBJECT as internal (not exported)', () => {
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

      expect(output).toContain('const SLUG_TO_SUBJECT: ReadonlyMap<string, string>');
      expect(output).not.toContain('export const SLUG_TO_SUBJECT');
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
