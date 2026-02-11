/**
 * Tests for bulk data parsing.
 *
 * Validates that bulk download JSON files are parsed correctly and
 * lesson slugs are extracted with proper type safety.
 */

import { describe, it, expect } from 'vitest';
import {
  parseBulkDataFile,
  extractLessonSlugs,
  parsePhaseFromFilename,
  type BulkLesson,
  type BulkDataFile,
} from './bulk-data-parser';

describe('bulk-data-parser', () => {
  describe('parseBulkDataFile', () => {
    it('parses valid bulk data JSON with lessons array', () => {
      const json = JSON.stringify({
        lessons: [
          {
            lessonSlug: 'adding-fractions',
            lessonTitle: 'Adding fractions',
            subjectSlug: 'maths',
            keyStageSlug: 'ks2',
            unitSlug: 'fractions-unit',
          },
          {
            lessonSlug: 'subtracting-fractions',
            lessonTitle: 'Subtracting fractions',
            subjectSlug: 'maths',
            keyStageSlug: 'ks2',
            unitSlug: 'fractions-unit',
          },
        ],
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      });

      const result = parseBulkDataFile(json);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.lessons).toHaveLength(2);
        expect(result.value.sequenceSlug).toBe('maths-primary');
        expect(result.value.subjectTitle).toBe('Maths');
        expect(result.value.lessons[0]?.lessonSlug).toBe('adding-fractions');
      }
    });

    it('returns error for invalid JSON', () => {
      const result = parseBulkDataFile('not valid json {{{');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('parse_error');
        expect(result.error.message).toContain('Invalid JSON');
      }
    });

    it('returns error when lessons array is missing', () => {
      const json = JSON.stringify({
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      });

      const result = parseBulkDataFile(json);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('validation_error');
        expect(result.error.message).toContain('lessons');
      }
    });

    it('returns error when lessons is not an array', () => {
      const json = JSON.stringify({
        lessons: 'not an array',
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      });

      const result = parseBulkDataFile(json);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('validation_error');
      }
    });

    it('returns error when lesson is missing required fields', () => {
      const json = JSON.stringify({
        lessons: [{ lessonTitle: 'Missing slug' }],
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      });

      const result = parseBulkDataFile(json);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('validation_error');
        expect(result.error.message).toContain('lessonSlug');
      }
    });

    it('returns error when sequenceSlug is missing', () => {
      const json = JSON.stringify({
        lessons: [],
        subjectTitle: 'Maths',
      });

      const result = parseBulkDataFile(json);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('validation_error');
        expect(result.error.message).toContain('sequenceSlug');
      }
    });

    it('handles empty lessons array', () => {
      const json = JSON.stringify({
        lessons: [],
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      });

      const result = parseBulkDataFile(json);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.lessons).toHaveLength(0);
      }
    });

    it('preserves all required lesson fields', () => {
      const json = JSON.stringify({
        lessons: [
          {
            lessonSlug: 'test-lesson',
            lessonTitle: 'Test Lesson',
            subjectSlug: 'science',
            keyStageSlug: 'ks3',
            unitSlug: 'test-unit',
            // Extra fields should be ignored
            extraField: 'ignored',
          },
        ],
        sequenceSlug: 'science-secondary',
        subjectTitle: 'Science',
      });

      const result = parseBulkDataFile(json);

      expect(result.ok).toBe(true);
      if (result.ok) {
        const lesson = result.value.lessons[0];
        expect(lesson).toBeDefined();
        expect(lesson?.lessonSlug).toBe('test-lesson');
        expect(lesson?.lessonTitle).toBe('Test Lesson');
        expect(lesson?.subjectSlug).toBe('science');
        expect(lesson?.keyStageSlug).toBe('ks3');
        expect(lesson?.unitSlug).toBe('test-unit');
      }
    });
  });

  describe('extractLessonSlugs', () => {
    it('extracts unique lesson slugs from bulk data', () => {
      const data: BulkDataFile = {
        lessons: [createLesson('lesson-a'), createLesson('lesson-b'), createLesson('lesson-c')],
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      };

      const slugs = extractLessonSlugs(data);

      expect(slugs).toEqual(['lesson-a', 'lesson-b', 'lesson-c']);
    });

    it('removes duplicate slugs', () => {
      const data: BulkDataFile = {
        lessons: [
          createLesson('lesson-a'),
          createLesson('lesson-b'),
          createLesson('lesson-a'), // duplicate
        ],
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      };

      const slugs = extractLessonSlugs(data);

      expect(slugs).toHaveLength(2);
      expect(slugs).toEqual(['lesson-a', 'lesson-b']);
    });

    it('returns empty array for empty lessons', () => {
      const data: BulkDataFile = {
        lessons: [],
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      };

      const slugs = extractLessonSlugs(data);

      expect(slugs).toEqual([]);
    });

    it('preserves order of first occurrence', () => {
      const data: BulkDataFile = {
        lessons: [createLesson('z-lesson'), createLesson('a-lesson'), createLesson('m-lesson')],
        sequenceSlug: 'maths-primary',
        subjectTitle: 'Maths',
      };

      const slugs = extractLessonSlugs(data);

      expect(slugs).toEqual(['z-lesson', 'a-lesson', 'm-lesson']);
    });
  });

  describe('parsePhaseFromFilename', () => {
    it('extracts primary phase from filename', () => {
      expect(parsePhaseFromFilename('maths-primary.json')).toBe('primary');
      expect(parsePhaseFromFilename('english-primary.json')).toBe('primary');
      expect(parsePhaseFromFilename('science-primary.json')).toBe('primary');
    });

    it('extracts secondary phase from filename', () => {
      expect(parsePhaseFromFilename('maths-secondary.json')).toBe('secondary');
      expect(parsePhaseFromFilename('english-secondary.json')).toBe('secondary');
      expect(parsePhaseFromFilename('science-secondary.json')).toBe('secondary');
    });

    it('handles compound subject names', () => {
      expect(parsePhaseFromFilename('design-technology-primary.json')).toBe('primary');
      expect(parsePhaseFromFilename('cooking-nutrition-secondary.json')).toBe('secondary');
      expect(parsePhaseFromFilename('religious-education-primary.json')).toBe('primary');
      expect(parsePhaseFromFilename('physical-education-secondary.json')).toBe('secondary');
    });

    it('returns null for invalid filenames', () => {
      expect(parsePhaseFromFilename('manifest.json')).toBeNull();
      expect(parsePhaseFromFilename('README.md')).toBeNull();
      expect(parsePhaseFromFilename('maths.json')).toBeNull();
      expect(parsePhaseFromFilename('')).toBeNull();
    });
  });
});

/**
 * Helper to create a minimal BulkLesson for testing.
 */
function createLesson(slug: string): BulkLesson {
  return {
    lessonSlug: slug,
    lessonTitle: `Lesson ${slug}`,
    subjectSlug: 'maths',
    keyStageSlug: 'ks2',
    unitSlug: 'test-unit',
  };
}
